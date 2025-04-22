from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import mysql.connector
from passlib.context import CryptContext


app = FastAPI()


# Adicionando o middleware de CORS
# Configuração do CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://127.0.0.1:3000"],  # Permite requisições do seu frontend
    allow_credentials=True,
    allow_methods=["*"],  # Permite todos os métodos HTTP (GET, POST, etc.)
    allow_headers=["*"],  # Permite todos os cabeçalhos
)

# Modelo para os dados de cadastro
class Usuario(BaseModel):
    email: str
    nome: str
    telefone: str
    cpf: str
    senha: str

# Conexão com o banco de dados
def get_db_connection():
    return mysql.connector.connect(
        host="",
        user="",
        password="",
        database="Roomly"
    )

# Criptografando a senha
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def hash_password(password: str):
    return pwd_context.hash(password)

# Rota para o cadastro de usuário
@app.post("/register")
async def register_usuario(usuario: Usuario):
    connection = get_db_connection()
    cursor = connection.cursor()

    # Verificar se o CPF ou email já existem no banco
    cursor.execute("SELECT * FROM usuario WHERE CPF = %s", (usuario.cpf,))
    existing_user_cpf = cursor.fetchone()

    cursor.execute("SELECT * FROM usuario WHERE Email = %s", (usuario.email,))
    existing_user_email = cursor.fetchone()

    if existing_user_cpf:
        raise HTTPException(status_code=400, detail="CPF já cadastrado")
    
    if existing_user_email:
        raise HTTPException(status_code=400, detail="Email já cadastrado")

    # Hash da senha
    hashed_password = hash_password(usuario.senha)

    # Inserção no banco de dados
    cursor.execute("""
        INSERT INTO usuario (Nome, CPF, Email, Telefone, Senha, fk_papel_ID_Papel)
        VALUES (%s, %s, %s, %s, %s, %s)
    """, (usuario.nome, usuario.cpf, usuario.email, usuario.telefone, hashed_password, 1))  # Considerando que fk_papel_ID_Papel = 1
    connection.commit()

    cursor.close()
    connection.close()

    return {"success": True, "message": "Cadastro realizado com sucesso!"}

# Modelo para login
class LoginData(BaseModel):
    email: str
    senha: str

# Verificar a senha
def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

# Rota de login
@app.post("/login")
async def login_usuario(login: LoginData):
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

    return {"success": True, "message": "Login realizado com sucesso", "nome": user["Nome"], "email": user["Email"]}
