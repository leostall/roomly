from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from starlette.middleware.sessions import SessionMiddleware
from pydantic import BaseModel
import mysql.connector
from passlib.context import CryptContext


app = FastAPI()

# Middleware de sessão
app.add_middleware(SessionMiddleware, secret_key="clinica")

# Middleware de CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://127.0.0.1:3000"],  # ou o IP/porta onde seu frontend roda
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Modelo para cadastro
class Usuario(BaseModel):
    email: str
    nome: str
    telefone: str
    cpf: str
    senha: str

# Modelo para login
class LoginData(BaseModel):
    email: str
    senha: str

# Conexão com banco
def get_db_connection():
    return mysql.connector.connect(
        host="127.0.0.1",
        user="root",
        password="Mimiteteu123@",
        database="Roomly"
    )

# Criptografia
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def hash_password(password: str):
    return pwd_context.hash(password)

def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

# Cadastro
@app.post("/register")
async def register_usuario(usuario: Usuario):
    connection = get_db_connection()
    cursor = connection.cursor()

    cursor.execute("SELECT * FROM usuario WHERE CPF = %s", (usuario.cpf,))
    if cursor.fetchone():
        raise HTTPException(status_code=400, detail="CPF já cadastrado")

    cursor.execute("SELECT * FROM usuario WHERE Email = %s", (usuario.email,))
    if cursor.fetchone():
        raise HTTPException(status_code=400, detail="Email já cadastrado")

    hashed_password = hash_password(usuario.senha)

    cursor.execute("""
        INSERT INTO usuario (Nome, CPF, Email, Telefone, Senha, fk_papel_ID_Papel)
        VALUES (%s, %s, %s, %s, %s, %s)
    """, (usuario.nome, usuario.cpf, usuario.email, usuario.telefone, hashed_password, 1))

    connection.commit()
    cursor.close()
    connection.close()

    return {"success": True, "message": "Cadastro realizado com sucesso!"}

# Login
@app.post("/login")
async def login_usuario(request: Request, login: LoginData):
    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True)

    cursor.execute("SELECT * FROM usuario WHERE Email = %s", (login.email,))
    user = cursor.fetchone()

    cursor.close()
    connection.close()

    if not user:
        raise HTTPException(status_code=401, detail="Email não encontrado!")

    if not verify_password(login.senha, user["Senha"]):
        raise HTTPException(status_code=401, detail="Senha incorreta!")

    # Salva na sessão
    request.session["usuario"] = {
        "nome": user["Nome"],
        "email": user["Email"],
        "id": user["ID_Usuario"]  # Aqui estamos salvando o ID do usuário na sessão
    }

    return {"success": True, "message": "Login realizado com sucesso", "nome": user["Nome"]}


# Verifica se está logado
@app.get("/usuario-logado")
async def usuario_logado(request: Request):
    usuario = request.session.get("usuario")
    if usuario:
        # Obter os dados completos do usuário, incluindo telefone e CPF
        connection = get_db_connection()
        cursor = connection.cursor(dictionary=True)

        cursor.execute("SELECT * FROM usuario WHERE Email = %s", (usuario["email"],))
        user = cursor.fetchone()

        cursor.close()
        connection.close()

        if user:
            return {
                "logado": True,
                "nome": user["Nome"],
                "email": user["Email"],
                "telefone": user["Telefone"],
                "cpf": user["CPF"]
            }

    return {"logado": False}


# Logout
@app.post("/logout")
async def logout(request: Request):
    request.session.clear()
    return {"success": True, "message": "Logout realizado com sucesso"}

@app.get("/usuario-logado")
async def usuario_logado(request: Request):
    usuario = request.session.get("usuario")
    if not usuario:
        return {"logado": False}

    # Use ID_Usuario para buscar os dados
    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True)

    cursor.execute("SELECT Nome, Email, Telefone, CPF FROM usuario WHERE ID_Usuario = %s", (usuario["id"],))
    dados = cursor.fetchone()

    cursor.close()
    connection.close()

    return {
        "logado": True,
        "nome": dados["Nome"],
        "email": dados["Email"],
        "telefone": dados["Telefone"],
        "cpf": dados["CPF"]
    }

@app.delete("/excluir-conta")
async def excluir_conta(request: Request):
    usuario = request.session.get("usuario")
    if not usuario:
        raise HTTPException(status_code=401, detail="Não autenticado")

    # Use ID_Usuario para excluir os dados
    connection = get_db_connection()
    cursor = connection.cursor()

    cursor.execute("DELETE FROM usuario WHERE ID_Usuario = %s", (usuario["id"],))
    connection.commit()
    cursor.close()
    connection.close()

    request.session.clear()

    return {"success": True, "message": "Conta excluída com sucesso"}

@app.put("/editar-usuario")
async def editar_usuario(request: Request, usuario: Usuario):
    usuario_logado = request.session.get("usuario")
    if not usuario_logado:
        raise HTTPException(status_code=401, detail="Usuário não autenticado")

    usuario_id = usuario_logado["id"]
    connection = get_db_connection()
    cursor = connection.cursor()

    try:
        if usuario.senha:
            hashed_password = hash_password(usuario.senha)
            cursor.execute("""
                UPDATE usuario
                SET Email = %s, Nome = %s, Telefone = %s, CPF = %s, Senha = %s
                WHERE ID_Usuario = %s
            """, (usuario.email, usuario.nome, usuario.telefone, usuario.cpf, hashed_password, usuario_id))
        else:
            cursor.execute("""
                UPDATE usuario
                SET Email = %s, Nome = %s, Telefone = %s, CPF = %s
                WHERE ID_Usuario = %s
            """, (usuario.email, usuario.nome, usuario.telefone, usuario.cpf, usuario_id))

        connection.commit()
        return {"message": "Dados atualizados com sucesso!"}
    except Exception as e:
        connection.rollback()
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        cursor.close()
        connection.close()
