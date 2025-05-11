from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from starlette.middleware.sessions import SessionMiddleware
from pydantic import BaseModel
import mysql.connector
from passlib.context import CryptContext


app = FastAPI()

# Middleware de sessão
app.add_middleware(SessionMiddleware, secret_key="roomly")

# Middleware de CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://127.0.0.1:5500"],  # ou o IP/porta onde seu frontend roda
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

# Modelo para os dados da sala
class Sala(BaseModel):
    capacidade: int
    tamanho: float
    valor_hora: float
    recursos: str
    tipo_mobilia: str
    cep: str
    rua: str
    cidade: str
    estado: str
    numero: int
    complemento: str
    descricao: str
    fk_tipo_sala_id: int
    fk_usuario_id: int
    domingo: int
    segunda: int
    terca: int
    quarta: int
    quinta: int
    sexta: int
    sabado: int
    status: int = 1  # Status padrão como 1

# Conexão com banco
def get_db_connection():
    return mysql.connector.connect(
        host="127.0.0.1",
        user="root",
        password="",
        database="roomly"
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

    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True)

    try:
        cursor.execute("SELECT ID_Usuario, Nome, Email, Telefone, CPF, fk_papel_ID_Papel FROM usuario WHERE ID_Usuario = %s", (usuario["id"],))
        dados = cursor.fetchone()

        if not dados:
            return {"logado": False}

        return {
            "logado": True,
            "id": dados["ID_Usuario"],
            "nome": dados["Nome"],
            "email": dados["Email"],
            "telefone": dados["Telefone"],
            "cpf": dados["CPF"],
            "papel": dados["fk_papel_ID_Papel"]  # Retorna o papel do usuário
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail="Erro ao buscar usuário logado")
    finally:
        cursor.close()
        connection.close()

@app.delete("/excluir-conta")
async def excluir_conta(request: Request):
    usuario = request.session.get("usuario")
    if not usuario:
        raise HTTPException(status_code=401, detail="Não autenticado")

    # Use ID_Usuario para excluir os dados
    connection = get_db_connection()
    cursor = connection.cursor()

    try:
        # Exclui todas as salas associadas ao usuário
        cursor.execute("DELETE FROM salas WHERE fk_usuario_ID_Usuario = %s", (usuario["id"],))

        # Exclui o usuário
        cursor.execute("DELETE FROM usuario WHERE ID_Usuario = %s", (usuario["id"],))

        connection.commit()
        request.session.clear()  # Limpa a sessão do usuário

        return {"success": True, "message": "Conta e salas associadas excluídas com sucesso!"}
    except Exception as e:
        connection.rollback()
        raise HTTPException(status_code=500, detail=f"Erro ao excluir conta: {str(e)}")
    finally:
        cursor.close()
        connection.close()

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

# Endpoint para buscar tipos de sala
@app.get("/tipos-sala")
async def get_tipos_sala():
    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True)

    try:
        cursor.execute("SELECT ID_Tipo_Sala, Tipo FROM tipo_sala")
        tipos_sala = cursor.fetchall()
        return tipos_sala
    except Exception as e:
        raise HTTPException(status_code=500, detail="Erro ao buscar tipos de sala")
    finally:
        cursor.close()
        connection.close()

# Endpoint para cadastrar sala
@app.post("/salas")
async def cadastrar_sala(sala: Sala):
    connection = get_db_connection()
    cursor = connection.cursor()

    try:
        # Inserir os dados na tabela salas
        cursor.execute("""
            INSERT INTO salas (
                Capacidade, Tamanho, Valor_Hora, Recursos, Tipo_Mobilia, CEP, Rua, Cidade, Estado, Numero, Complemento, Descricao, 
                fk_usuario_ID_Usuario, fk_tipo_sala_ID_Tipo_Sala, Status, Domingo_Disp, Segunda_Disp, Terca_Disp, Quarta_Disp, Quinta_Disp, Sexta_Disp, Sabado_Disp
            ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
        """, (
            sala.capacidade, sala.tamanho, sala.valor_hora, sala.recursos, sala.tipo_mobilia, sala.cep, sala.rua, sala.cidade,
            sala.estado, sala.numero, sala.complemento, sala.descricao, sala.fk_usuario_id, sala.fk_tipo_sala_id, sala.status,
            sala.domingo, sala.segunda, sala.terca, sala.quarta, sala.quinta, sala.sexta, sala.sabado
        ))

        # Atualizar o papel do usuário para "locador" (ID_Papel = 2)
        cursor.execute("""
            UPDATE usuario
            SET fk_papel_ID_Papel = 2
            WHERE ID_Usuario = %s
        """, (sala.fk_usuario_id,))

        connection.commit()
        return {"success": True, "message": "Sala cadastrada com sucesso!"}
    except Exception as e:
        connection.rollback()
        raise HTTPException(status_code=500, detail=f"Erro ao cadastrar sala: {str(e)}")
    finally:
        cursor.close()
        connection.close()

@app.get("/minhas-salas")
async def minhas_salas(request: Request):
    usuario = request.session.get("usuario")
    if not usuario:
        raise HTTPException(status_code=401, detail="Usuário não autenticado")

    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True)

    try:
        cursor.execute("""
            SELECT DISTINCT s.ID_Sala AS id, s.Rua AS rua, s.Numero AS numero, s.Cidade AS cidade, s.Estado AS estado,
                            ts.Tipo AS tipo
            FROM salas s
            JOIN tipo_sala ts ON s.fk_tipo_sala_ID_Tipo_Sala = ts.ID_Tipo_Sala
            WHERE s.fk_usuario_ID_Usuario = %s
        """, (usuario["id"],))
        salas = cursor.fetchall()
        return salas
    except Exception as e:
        raise HTTPException(status_code=500, detail="Erro ao buscar salas")
    finally:
        cursor.close()
        connection.close()

@app.get("/salas/{id}")
async def get_sala(id: int, request: Request):
    usuario = request.session.get("usuario")
    if not usuario:
        raise HTTPException(status_code=401, detail="Usuário não autenticado")

    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True)

    try:
        cursor.execute("""
            SELECT s.ID_Sala, s.Capacidade, s.Tamanho, s.Valor_Hora, s.Recursos, s.Tipo_Mobilia, s.CEP, s.Rua, 
                   s.Numero, s.Cidade, s.Estado, s.Complemento, s.Descricao, s.Domingo_Disp AS domingo, 
                   s.Segunda_Disp AS segunda, s.Terca_Disp AS terca, s.Quarta_Disp AS quarta, 
                   s.Quinta_Disp AS quinta, s.Sexta_Disp AS sexta, s.Sabado_Disp AS sabado, 
                   s.fk_tipo_sala_ID_Tipo_Sala
            FROM salas s
            WHERE s.ID_Sala = %s AND s.fk_usuario_ID_Usuario = %s
        """, (id, usuario["id"]))
        sala = cursor.fetchone()
        if not sala:
            raise HTTPException(status_code=404, detail="Sala não encontrada")
        
        return {
            "id": sala["ID_Sala"],
            "capacidade": sala["Capacidade"],
            "tamanho": sala["Tamanho"],
            "valor_hora": sala["Valor_Hora"],
            "recursos": sala["Recursos"],
            "tipo_mobilia": sala["Tipo_Mobilia"],
            "cep": sala["CEP"],
            "rua": sala["Rua"],
            "numero": sala["Numero"],
            "cidade": sala["Cidade"],
            "estado": sala["Estado"],
            "complemento": sala["Complemento"],
            "descricao": sala["Descricao"],
            "disponibilidade": {
                "domingo": bool(sala["domingo"]),
                "segunda": bool(sala["segunda"]),
                "terca": bool(sala["terca"]),
                "quarta": bool(sala["quarta"]),
                "quinta": bool(sala["quinta"]),
                "sexta": bool(sala["sexta"]),
                "sabado": bool(sala["sabado"])
            },
            "tipo_sala_id": sala["fk_tipo_sala_ID_Tipo_Sala"]
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail="Erro ao buscar sala")
    finally:
        cursor.close()
        connection.close()

@app.put("/salas/{id}")
async def editar_sala(id: int, sala: Sala, request: Request):
    usuario = request.session.get("usuario")
    if not usuario:
        raise HTTPException(status_code=401, detail="Usuário não autenticado")

    print("Usuário logado:", usuario)  # Verifica o ID do usuário logado
    print("ID da sala recebida:", id)  # Verifica o ID da sala recebida

    # Adiciona o ID do usuário logado ao objeto sala
    sala_dict = sala.dict()
    sala_dict["fk_usuario_id"] = usuario["id"]  # Garante que o ID do usuário seja usado

    print("Dados recebidos para atualização:", sala_dict)  # Verifica os dados recebidos

    connection = get_db_connection()
    cursor = connection.cursor()

    try:
        cursor.execute("""
            UPDATE salas
            SET Capacidade = %s, Tamanho = %s, Valor_Hora = %s, Recursos = %s, Tipo_Mobilia = %s, CEP = %s, Rua = %s,
                Numero = %s, Cidade = %s, Estado = %s, Complemento = %s, Descricao = %s, fk_tipo_sala_ID_Tipo_Sala = %s,
                Domingo_Disp = %s, Segunda_Disp = %s, Terca_Disp = %s, Quarta_Disp = %s, Quinta_Disp = %s, Sexta_Disp = %s, Sabado_Disp = %s
            WHERE ID_Sala = %s AND fk_usuario_ID_Usuario = %s
        """, (
            sala.capacidade, sala.tamanho, sala.valor_hora, sala.recursos, sala.tipo_mobilia, sala.cep, sala.rua,
            sala.numero, sala.cidade, sala.estado, sala.complemento, sala.descricao, sala.fk_tipo_sala_id,
            sala.domingo, sala.segunda, sala.terca, sala.quarta, sala.quinta, sala.sexta, sala.sabado,
            id, sala_dict["fk_usuario_id"]
        ))

        connection.commit()
        return {"success": True, "message": "Sala atualizada com sucesso!"}
    except Exception as e:
        connection.rollback()
        raise HTTPException(status_code=500, detail=f"Erro ao atualizar sala: {str(e)}")
    finally:
        cursor.close()
        connection.close()

@app.get("/salas/{id}")
async def get_sala(id: int, request: Request):
    usuario = request.session.get("usuario")
    if not usuario:
        raise HTTPException(status_code=401, detail="Usuário não autenticado")

    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True)

    try:
        cursor.execute("""
            SELECT s.ID_Sala, s.Capacidade, s.Tamanho, s.Valor_Hora, s.Recursos, s.Tipo_Mobilia, s.CEP, s.Rua, 
                   s.Numero, s.Cidade, s.Estado, s.Complemento, s.Descricao, s.Domingo_Disp AS domingo, 
                   s.Segunda_Disp AS segunda, s.Terca_Disp AS terca, s.Quarta_Disp AS quarta, 
                   s.Quinta_Disp AS quinta, s.Sexta_Disp AS sexta, s.Sabado_Disp AS sabado, 
                   s.fk_tipo_sala_ID_Tipo_Sala
            FROM salas s
            WHERE s.ID_Sala = %s AND s.fk_usuario_ID_Usuario = %s
        """, (id, usuario["id"]))
        sala = cursor.fetchone()
        if not sala:
            raise HTTPException(status_code=404, detail="Sala não encontrada")
        
        return {
            "id": sala["ID_Sala"],
            "capacidade": sala["Capacidade"],
            "tamanho": sala["Tamanho"],
            "valor_hora": sala["Valor_Hora"],
            "recursos": sala["Recursos"],
            "tipo_mobilia": sala["Tipo_Mobilia"],
            "cep": sala["CEP"],
            "rua": sala["Rua"],
            "numero": sala["Numero"],
            "cidade": sala["Cidade"],
            "estado": sala["Estado"],
            "complemento": sala["Complemento"],
            "descricao": sala["Descricao"],
            "disponibilidade": {
                "domingo": bool(sala["domingo"]),
                "segunda": bool(sala["segunda"]),
                "terca": bool(sala["terca"]),
                "quarta": bool(sala["quarta"]),
                "quinta": bool(sala["quinta"]),
                "sexta": bool(sala["sexta"]),
                "sabado": bool(sala["sabado"])
            },
            "tipo_sala_id": sala["fk_tipo_sala_ID_Tipo_Sala"]
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail="Erro ao buscar sala")
    finally:
        cursor.close()
        connection.close()

@app.put("/salas/{id}")
async def editar_sala(id: int, sala: Sala, request: Request):
    usuario = request.session.get("usuario")
    if not usuario:
        raise HTTPException(status_code=401, detail="Usuário não autenticado")

    print("Usuário logado:", usuario)  # Verifica o ID do usuário logado
    print("ID da sala recebida:", id)  # Verifica o ID da sala recebida

    # Adiciona o ID do usuário logado ao objeto sala
    sala_dict = sala.dict()
    sala_dict["fk_usuario_id"] = usuario["id"]  # Garante que o ID do usuário seja usado

    print("Dados recebidos para atualização:", sala_dict)  # Verifica os dados recebidos

    connection = get_db_connection()
    cursor = connection.cursor()

    try:
        cursor.execute("""
            UPDATE salas
            SET Capacidade = %s, Tamanho = %s, Valor_Hora = %s, Recursos = %s, Tipo_Mobilia = %s, CEP = %s, Rua = %s,
                Numero = %s, Cidade = %s, Estado = %s, Complemento = %s, Descricao = %s, fk_tipo_sala_ID_Tipo_Sala = %s,
                Domingo_Disp = %s, Segunda_Disp = %s, Terca_Disp = %s, Quarta_Disp = %s, Quinta_Disp = %s, Sexta_Disp = %s, Sabado_Disp = %s
            WHERE ID_Sala = %s AND fk_usuario_ID_Usuario = %s
        """, (
            sala.capacidade, sala.tamanho, sala.valor_hora, sala.recursos, sala.tipo_mobilia, sala.cep, sala.rua,
            sala.numero, sala.cidade, sala.estado, sala.complemento, sala.descricao, sala.fk_tipo_sala_id,
            sala.domingo, sala.segunda, sala.terca, sala.quarta, sala.quinta, sala.sexta, sala.sabado,
            id, sala_dict["fk_usuario_id"]
        ))

        connection.commit()
        return {"success": True, "message": "Sala atualizada com sucesso!"}
    except Exception as e:
        connection.rollback()
        raise HTTPException(status_code=500, detail=f"Erro ao atualizar sala: {str(e)}")
    finally:
        cursor.close()
        connection.close()

@app.delete("/salas/{id}")
async def excluir_sala(id: int, request: Request):
    usuario = request.session.get("usuario")
    if not usuario:
        raise HTTPException(status_code=401, detail="Usuário não autenticado")

    connection = get_db_connection()
    cursor = connection.cursor()

    try:
        # Verifica se a sala pertence ao usuário logado
        cursor.execute("SELECT * FROM salas WHERE ID_Sala = %s AND fk_usuario_ID_Usuario = %s", (id, usuario["id"]))
        sala = cursor.fetchone()
        if not sala:
            raise HTTPException(status_code=404, detail="Sala não encontrada ou não pertence ao usuário")

        # Exclui a sala
        cursor.execute("DELETE FROM salas WHERE ID_Sala = %s", (id,))
        connection.commit()

        return {"success": True, "message": "Sala excluída com sucesso!"}
    except Exception as e:
        connection.rollback()
        raise HTTPException(status_code=500, detail=f"Erro ao excluir sala: {str(e)}")
    finally:
        cursor.close()
        connection.close()