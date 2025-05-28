from fastapi import FastAPI, HTTPException, Request, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from starlette.middleware.sessions import SessionMiddleware
from pydantic import BaseModel
import mysql.connector
from passlib.context import CryptContext
from datetime import timedelta
import base64
from datetime import datetime
from fastapi import Body
from typing import Optional




app = FastAPI()

app.add_middleware(SessionMiddleware, secret_key="roomly")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://127.0.0.1:5500"],  # ou o IP/porta onde seu frontend roda
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class Usuario(BaseModel):
    email: str
    nome: str
    telefone: str
    cpf: str
    senha: str

class LoginData(BaseModel):
    email: str
    senha: str

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

class ReservaEditData(BaseModel):
    nova_data_reserva: str  
    novo_horario_checkin: str 
    novo_horario_checkout: str

def get_db_connection():
    try:
        return mysql.connector.connect(
            host="127.0.0.1",
            user="root",
            password="",
            database="roomly"
        )
    except mysql.connector.Error as err:
        raise HTTPException(
            status_code=500,
            detail=f"Erro ao conectar ao banco de dados: {err}"
        )

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def hash_password(password: str):
    return pwd_context.hash(password)

def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

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
        raise HTTPException(status_code=401, detail="Senha incorreta! Senha: {}".format(user["Senha"]))

    # Salva na sessão
    request.session["usuario"] = {
        "nome": user["Nome"],
        "email": user["Email"],
        "id": user["ID_Usuario"],
        "papel": user["fk_papel_ID_Papel"] 
           
    }

    return {"success": True, "message": "Login realizado com sucesso", "nome": user["Nome"]}

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
            "papel": dados["fk_papel_ID_Papel"]
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

    connection = get_db_connection()
    cursor = connection.cursor()

    try:
        cursor.execute("DELETE FROM salas WHERE fk_usuario_ID_Usuario = %s", (usuario["id"],))

        cursor.execute("DELETE FROM tipo_sala WHERE fk_usuario_ID_Usuario = %s", (usuario["id"],))

        cursor.execute("DELETE FROM usuario WHERE ID_Usuario = %s", (usuario["id"],))

        connection.commit()
        request.session.clear() 

        return {"success": True, "message": "Conta, salas e tipo de salas associadas excluídas com sucesso!"}
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

@app.post("/salas-cadastro")
async def cadastrar_sala(
    capacidade: int = Form(...),
    tamanho: float = Form(...),
    valor_hora: float = Form(...),
    recursos: str = Form(...),
    tipo_mobilia: str = Form(...),
    cep: str = Form(...),
    rua: str = Form(...),
    cidade: str = Form(...),
    estado: str = Form(...),
    numero: int = Form(...),
    complemento: str = Form(...),
    descricao: str = Form(...),
    fk_tipo_sala_id: int = Form(...),
    fk_usuario_id: int = Form(...),
    domingo: int = Form(...),
    segunda: int = Form(...),
    terca: int = Form(...),
    quarta: int = Form(...),
    quinta: int = Form(...),
    sexta: int = Form(...),
    sabado: int = Form(...),
    status: int = Form(1),
    imagem: UploadFile = File(None), 
    HorarioInicio_DiasUteis: Optional[str] = Form(None),
    HorarioFim_DiasUteis: Optional[str] = Form(None),
    HorarioInicio_DiaNaoUtil: Optional[str] = Form(None),
    HorarioFim_DiaNaoUtil: Optional[str] = Form(None)
):
    # Validação obrigatória dos horários
    if (segunda or terca or quarta or quinta or sexta):
        if not HorarioInicio_DiasUteis or not HorarioFim_DiasUteis:
            raise HTTPException(status_code=400, detail="Horários de dias úteis são obrigatórios.")
    if (sabado or domingo):
        if not HorarioInicio_DiaNaoUtil or not HorarioFim_DiaNaoUtil:
            raise HTTPException(status_code=400, detail="Horários de finais de semana/feriados são obrigatórios.")
    
    # Ajusta os horários para NULL se não forem preenchidos
    HorarioInicio_DiasUteis = HorarioInicio_DiasUteis if HorarioInicio_DiasUteis else None
    HorarioFim_DiasUteis = HorarioFim_DiasUteis if HorarioFim_DiasUteis else None
    HorarioInicio_DiaNaoUtil = HorarioInicio_DiaNaoUtil if HorarioInicio_DiaNaoUtil else None
    HorarioFim_DiaNaoUtil = HorarioFim_DiaNaoUtil if HorarioFim_DiaNaoUtil else None

    data_cadastro = datetime.now() 
    connection = get_db_connection()
    cursor = connection.cursor()
    try:
        imagem_bytes = await imagem.read() if imagem else None
        cursor.execute("""
            INSERT INTO salas (
                Capacidade, Tamanho, Valor_Hora, Recursos, Tipo_Mobilia, CEP, Rua, Cidade, Estado, Numero, Complemento, Descricao, 
                fk_usuario_ID_Usuario, fk_tipo_sala_ID_Tipo_Sala, Status, Domingo_Disp, Segunda_Disp, Terca_Disp, Quarta_Disp, Quinta_Disp, Sexta_Disp, Sabado_Disp, Imagem, Data_Cadastro,
                HorarioInicio_DiasUteis, HorarioFim_DiasUteis, HorarioInicio_DiaNaoUtil, HorarioFim_DiaNaoUtil
            ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
        """, (
            capacidade, tamanho, valor_hora, recursos, tipo_mobilia, cep, rua, cidade,
            estado, numero, complemento, descricao, fk_usuario_id, fk_tipo_sala_id, status,
            domingo, segunda, terca, quarta, quinta, sexta, sabado, imagem_bytes, data_cadastro,
            HorarioInicio_DiasUteis, HorarioFim_DiasUteis, HorarioInicio_DiaNaoUtil, HorarioFim_DiaNaoUtil
        ))

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
    if usuario.get("papel") != 2:
        raise HTTPException(status_code=403, detail="Acesso negado")

    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True)

    try:
        cursor.execute("""
            SELECT DISTINCT s.ID_Sala AS id, s.Rua AS rua, s.Numero AS numero, s.Cidade AS cidade, s.Estado AS estado,
                            ts.Tipo AS tipo, s.Capacidade AS capacidade
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

@app.get("/salas-recuperar/{id}")
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
                   s.fk_tipo_sala_ID_Tipo_Sala, s.Imagem, ts.Tipo,
                   s.HorarioInicio_DiasUteis, s.HorarioFim_DiasUteis, s.HorarioInicio_DiaNaoUtil, s.HorarioFim_DiaNaoUtil
            FROM salas s
            JOIN tipo_sala ts ON s.fk_tipo_sala_ID_Tipo_Sala = ts.ID_Tipo_Sala
            WHERE s.ID_Sala = %s
        """, (id,))
        sala = cursor.fetchone()
        if not sala:
            raise HTTPException(status_code=404, detail="Sala não encontrada")
        
        # Converte imagem blob para base64
        if sala["Imagem"]:
            imagem_url = "data:image/jpeg;base64," + base64.b64encode(sala["Imagem"]).decode()
        else:
            imagem_url = "images/placeholder.jpg"
        
        def formatar_hora(hora):
            if hora is None:  # Verifica explicitamente se é NULL
                return None
            # Se vier como datetime.time ou datetime.datetime
            if hasattr(hora, "strftime"):
                return hora.strftime("%H:%M")  # Retorna no formato HH:MM
            # Se vier como string "H:MM" ou "HH:MM:SS"
            if isinstance(hora, str):
                partes = hora.split(":")
                if len(partes) >= 2:
                    horas = partes[0].zfill(2)  # Garante dois dígitos para as horas
                    minutos = partes[1].zfill(2)  # Garante dois dígitos para os minutos
                    return f"{horas}:{minutos}"
            return str(hora)

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
            "tipo_sala_id": sala["fk_tipo_sala_ID_Tipo_Sala"],
            "tipo": sala["Tipo"],
            "imagem_url": imagem_url,
            "HorarioInicio_DiasUteis": formatar_hora(sala["HorarioInicio_DiasUteis"]),
            "HorarioFim_DiasUteis": formatar_hora(sala["HorarioFim_DiasUteis"]),
            "HorarioInicio_DiaNaoUtil": formatar_hora(sala["HorarioInicio_DiaNaoUtil"]),
            "HorarioFim_DiaNaoUtil": formatar_hora(sala["HorarioFim_DiaNaoUtil"]),
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail="Erro ao buscar sala")
    finally:
        cursor.close()
        connection.close()

@app.put("/salas-atualizar/{id}")
async def editar_sala(
    id: int,
    capacidade: int = Form(...),
    tamanho: float = Form(...),
    valor_hora: float = Form(...),
    recursos: str = Form(...),
    tipo_mobilia: str = Form(...),
    cep: str = Form(...),
    rua: str = Form(...),
    numero: int = Form(...),
    cidade: str = Form(...),
    estado: str = Form(...),
    complemento: str = Form(...),
    descricao: str = Form(...),
    fk_tipo_sala_id: int = Form(...),
    domingo: int = Form(...),
    segunda: int = Form(...),
    terca: int = Form(...),
    quarta: int = Form(...),
    quinta: int = Form(...),
    sexta: int = Form(...),
    sabado: int = Form(...),
    status: int = Form(1),
    imagem: UploadFile = File(None),
    HorarioInicio_DiasUteis: Optional[str] = Form(None),
    HorarioFim_DiasUteis: Optional[str] = Form(None),
    HorarioInicio_DiaNaoUtil: Optional[str] = Form(None),
    HorarioFim_DiaNaoUtil: Optional[str] = Form(None),
    request: Request = None
):
    usuario = request.session.get("usuario")
    if not usuario:
        raise HTTPException(status_code=401, detail="Usuário não autenticado")
    
    # Ajusta os horários para None se não forem preenchidos
    HorarioInicio_DiasUteis = HorarioInicio_DiasUteis if HorarioInicio_DiasUteis else None
    HorarioFim_DiasUteis = HorarioFim_DiasUteis if HorarioFim_DiasUteis else None
    HorarioInicio_DiaNaoUtil = HorarioInicio_DiaNaoUtil if HorarioInicio_DiaNaoUtil else None
    HorarioFim_DiaNaoUtil = HorarioFim_DiaNaoUtil if HorarioFim_DiaNaoUtil else None
    
    # Validação obrigatória dos horários
    if (segunda or terca or quarta or quinta or sexta):
        if not HorarioInicio_DiasUteis or not HorarioFim_DiasUteis:
            raise HTTPException(status_code=400, detail="Horários de dias úteis são obrigatórios.")
    if (sabado or domingo):
        if not HorarioInicio_DiaNaoUtil or not HorarioFim_DiaNaoUtil:
            raise HTTPException(status_code=400, detail="Horários de finais de semana/feriados são obrigatórios.")

    connection = get_db_connection()
    cursor = connection.cursor()
    try:
        # Monta a query de forma dinâmica para tratar valores NULL
        if imagem:
            imagem_bytes = await imagem.read()
            query = """
                UPDATE salas
                SET Capacidade=%s, Tamanho=%s, Valor_Hora=%s, Recursos=%s, Tipo_Mobilia=%s, CEP=%s, Rua=%s,
                    Numero=%s, Cidade=%s, Estado=%s, Complemento=%s, Descricao=%s, fk_tipo_sala_ID_Tipo_Sala=%s,
                    Domingo_Disp=%s, Segunda_Disp=%s, Terca_Disp=%s, Quarta_Disp=%s, Quinta_Disp=%s, Sexta_Disp=%s, Sabado_Disp=%s, Imagem=%s,
                    HorarioInicio_DiasUteis=%s, HorarioFim_DiasUteis=%s, HorarioInicio_DiaNaoUtil=%s, HorarioFim_DiaNaoUtil=%s
                WHERE ID_Sala=%s AND fk_usuario_ID_Usuario=%s
            """
            params = (
                capacidade, tamanho, valor_hora, recursos, tipo_mobilia, cep, rua, numero, cidade, estado, complemento, descricao,
                fk_tipo_sala_id, domingo, segunda, terca, quarta, quinta, sexta, sabado, imagem_bytes,
                HorarioInicio_DiasUteis, HorarioFim_DiasUteis, HorarioInicio_DiaNaoUtil, HorarioFim_DiaNaoUtil,
                id, usuario["id"]
            )
        else:
            query = """
                UPDATE salas
                SET Capacidade=%s, Tamanho=%s, Valor_Hora=%s, Recursos=%s, Tipo_Mobilia=%s, CEP=%s, Rua=%s,
                    Numero=%s, Cidade=%s, Estado=%s, Complemento=%s, Descricao=%s, fk_tipo_sala_ID_Tipo_Sala=%s,
                    Domingo_Disp=%s, Segunda_Disp=%s, Terca_Disp=%s, Quarta_Disp=%s, Quinta_Disp=%s, Sexta_Disp=%s, Sabado_Disp=%s,
                    HorarioInicio_DiasUteis=%s, HorarioFim_DiasUteis=%s, HorarioInicio_DiaNaoUtil=%s, HorarioFim_DiaNaoUtil=%s
                WHERE ID_Sala=%s AND fk_usuario_ID_Usuario=%s
            """
            params = (
                capacidade, tamanho, valor_hora, recursos, tipo_mobilia, cep, rua, numero, cidade, estado, complemento, descricao,
                fk_tipo_sala_id, domingo, segunda, terca, quarta, quinta, sexta, sabado,
                HorarioInicio_DiasUteis, HorarioFim_DiasUteis, HorarioInicio_DiaNaoUtil, HorarioFim_DiaNaoUtil,
                id, usuario["id"]
            )

        # Substitui valores None por NULL no MySQL
        params = tuple(param if param is not None else None for param in params)

        cursor.execute(query, params)
        connection.commit()
        return {"success": True, "message": "Sala atualizada com sucesso!"}
    except Exception as e:
        connection.rollback()
        raise HTTPException(status_code=500, detail=f"Erro ao atualizar sala: {str(e)}")
    finally:
        cursor.close()
        connection.close()

@app.delete("/salas-excluir/{id}")
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

@app.get("/tipos-sala-recuperar")
async def get_tipos_sala(request: Request):
    # Verifica se o usuário está logado e tem papel 2
    usuario = request.session.get("usuario")
    if not usuario:
        raise HTTPException(status_code=401, detail="Usuário não autenticado")
    
    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True)
    
    try:
        cursor.execute("""
            SELECT ID_Tipo_Sala, Tipo 
            FROM tipo_sala 
            WHERE fk_usuario_ID_Usuario = %s
        """, (usuario["id"],))

        tipos_sala = cursor.fetchall()
        return tipos_sala
    except Exception as e:
        raise HTTPException(status_code=500, detail="Erro ao buscar tipos de sala")
    finally:
        cursor.close()
        connection.close()

@app.post("/tipos-sala-criar")
async def criar_tipo_sala(request: Request, data: dict):
    usuario = request.session.get("usuario")
        
    tipo = data.get("tipo")
    if not tipo:
        raise HTTPException(status_code=400, detail="Nome do tipo é obrigatório")
    
    connection = get_db_connection()
    cursor = connection.cursor()
    
    try:
        cursor.execute("""
            INSERT INTO tipo_sala (Tipo, fk_usuario_ID_Usuario) 
            VALUES (%s, %s)
        """, (tipo, usuario["id"]))

        connection.commit()
        return {"success": True, "message": "Tipo de sala criado com sucesso!"}
    except Exception as e:
        connection.rollback()
        raise HTTPException(status_code=500, detail=f"Erro ao criar tipo de sala: {str(e)}")
    finally:
        cursor.close()
        connection.close()

@app.put("/tipos-sala-atualizar/{id}")
async def atualizar_tipo_sala(id: int, request: Request, data: dict):
    usuario = request.session.get("usuario")
    
    tipo_novo = data.get("tipo")
    if not tipo_novo:
        raise HTTPException(status_code=400, detail="Nome do tipo é obrigatório")
    
    connection = get_db_connection()
    cursor = connection.cursor()
    
    try:
        # Primeiro consulta o nome atual
        cursor.execute("SELECT Tipo FROM tipo_sala WHERE ID_Tipo_Sala = %s", (id,))
        resultado = cursor.fetchone()
        
        if not resultado:
            raise HTTPException(status_code=404, detail="Tipo de sala não encontrado")
            
        tipo_atual = resultado[0]
        
        # Verifica se o nome foi alterado
        if tipo_novo == tipo_atual:
            return {"success": False, "message": "O nome do tipo continua o mesmo"}
        
        # Se foi alterado, faz o UPDATE
        cursor.execute("UPDATE tipo_sala SET Tipo = %s WHERE ID_Tipo_Sala = %s", (tipo_novo, id))
        connection.commit()
        
        return {"success": True, "message": "Tipo de sala atualizado com sucesso!"}
    except Exception as e:
        connection.rollback()
        raise HTTPException(status_code=500, detail=f"Erro ao atualizar tipo de sala: {str(e)}")
    finally:
        cursor.close()
        connection.close()

@app.delete("/tipos-sala-excluir/{id}")
async def excluir_tipo_sala(id: int, request: Request):
    usuario = request.session.get("usuario")
    
    connection = get_db_connection()
    cursor = connection.cursor()
    
    try:
        # Verifica se existem salas usando este tipo
        cursor.execute("SELECT COUNT(*) FROM salas WHERE fk_tipo_sala_ID_Tipo_Sala = %s", (id,))
        count = cursor.fetchone()[0]
        
        if count > 0:
            raise HTTPException(
                status_code=400,
                detail="Não é possível excluir, pois há registro vinculado."
            )
        
        cursor.execute("DELETE FROM tipo_sala WHERE ID_Tipo_Sala = %s", (id,))
        if cursor.rowcount == 0:
            raise HTTPException(status_code=404, detail="Tipo de sala não encontrado")
        
        connection.commit()
        return {"success": True, "message": "Tipo de sala excluído com sucesso!"}
    except HTTPException:
        raise
    except Exception as e:
        connection.rollback()
        raise HTTPException(status_code=500, detail=f"Erro ao excluir tipo de sala: {str(e)}")
    finally:
        cursor.close()
        connection.close()

@app.post("/tornar-locador")
async def tornar_locador(request: Request):
    usuario = request.session.get("usuario")
    if not usuario:
        raise HTTPException(status_code=401, detail="Usuário não autenticado")

    connection = get_db_connection()
    cursor = connection.cursor()

    try:
        cursor.execute("""
            UPDATE usuario
            SET fk_papel_ID_Papel = 2
            WHERE ID_Usuario = %s
        """, (usuario["id"],))

        tipos_padrao = ["Auditório", "Sala de Reunião", "Mesa Individual"]

        for tipo in tipos_padrao:
            cursor.execute("""
                INSERT INTO tipo_sala (Tipo, fk_usuario_ID_Usuario)
                VALUES (%s, %s)
            """, (tipo, usuario["id"]))

        connection.commit()
        return {"success": True, "message": "Agora você é um locador!"}
    except Exception as e:
        connection.rollback()
        raise HTTPException(status_code=500, detail=f"Erro ao tornar-se locador.")
    finally:
        cursor.close()
        connection.close()

@app.get("/recuperar-salas")
async def get_salas(limit: int = None):
    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True)
    try:
        query = """
            SELECT s.ID_Sala, s.Descricao, s.Valor_Hora, s.Capacidade, s.Imagem, ts.Tipo
            FROM salas s
            JOIN tipo_sala ts ON s.fk_tipo_sala_ID_Tipo_Sala = ts.ID_Tipo_Sala
            WHERE s.Status = 1
            ORDER BY RAND()
        """
        
        if limit is not None and limit > 0:
            query += f" LIMIT {limit}"

        cursor.execute(query)
        salas = cursor.fetchall()
        
        for sala in salas:
            if sala["Imagem"]:
                sala["imagem_url"] = "data:image/jpeg;base64," + base64.b64encode(sala["Imagem"]).decode()
            else:
                sala["imagem_url"] = "images/placeholder.jpg"
            del sala["Imagem"]
        
        return salas
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erro ao buscar salas: {str(e)}")
    finally:
        cursor.close()
        connection.close()

@app.post("/reservar")
async def reservar_sala(request: Request, data: dict = Body(...)):
    from datetime import datetime, timedelta

    usuario = request.session.get("usuario")
    if not usuario:
        raise HTTPException(status_code=401, detail="Usuário não autenticado")

    sala_id = data.get("sala_id")
    checkin_horario = data.get("checkin")
    checkout_horario = data.get("checkout")

    if not sala_id or not checkin_horario or not checkout_horario:
        raise HTTPException(status_code=400, detail="Dados incompletos")

    try:
        checkin_dt = datetime.strptime(checkin_horario, "%Y-%m-%dT%H:%M")
        checkout_dt = datetime.strptime(checkout_horario, "%Y-%m-%dT%H:%M")
    except Exception:
        raise HTTPException(status_code=400, detail="Formato de data ou horário inválido")

    if checkin_dt >= checkout_dt:
        raise HTTPException(status_code=400, detail="Horário de início deve ser antes do horário de término")

    if (checkout_dt - checkin_dt).total_seconds() < 3600:
        raise HTTPException(status_code=400, detail="O intervalo mínimo para reserva é de 1 hora")

    agora = datetime.now()
    if checkin_dt < agora:
        raise HTTPException(status_code=400, detail="O horário de entrada já passou. Selecione um horário futuro.")

    um_ano_depois = agora.replace(year=agora.year + 1)
    if checkin_dt > um_ano_depois:
        raise HTTPException(status_code=400, detail="A data da reserva não pode ser superior a 1 ano a partir de hoje")

    dia_semana = checkin_dt.weekday() + 1

    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True)
    try:
        cursor.execute("""
            SELECT Domingo_Disp, Segunda_Disp, Terca_Disp, Quarta_Disp, Quinta_Disp, Sexta_Disp, Sabado_Disp,
                   HorarioInicio_DiasUteis, HorarioFim_DiasUteis, HorarioInicio_DiaNaoUtil, HorarioFim_DiaNaoUtil
            FROM salas WHERE ID_Sala = %s
        """, (sala_id,))
        sala = cursor.fetchone()
        if not sala:
            raise HTTPException(status_code=404, detail="Sala não encontrada")

        dias_disponiveis = {
            7: sala["Domingo_Disp"],
            1: sala["Segunda_Disp"],
            2: sala["Terca_Disp"],
            3: sala["Quarta_Disp"],
            4: sala["Quinta_Disp"],
            5: sala["Sexta_Disp"],
            6: sala["Sabado_Disp"],
        }

        if not dias_disponiveis.get(dia_semana, 0):
            raise HTTPException(status_code=400, detail="A sala não está disponível no dia selecionado")

        if dia_semana in [1, 2, 3, 4, 5]:
            horario_inicio = sala["HorarioInicio_DiasUteis"]
            horario_fim = sala["HorarioFim_DiasUteis"]
        else:
            horario_inicio = sala["HorarioInicio_DiaNaoUtil"]
            horario_fim = sala["HorarioFim_DiaNaoUtil"]

        if horario_inicio is None or horario_fim is None:
            raise HTTPException(status_code=400, detail="Sala sem horário configurado para esse tipo de dia")

        def converter_hora(hora_str):
            if isinstance(hora_str, str):
                hora_str = hora_str.strip()
            else:
                hora_str = str(hora_str)
            partes = hora_str.split(":")
            if len(partes) >= 2:
                hora = partes[0].zfill(2)
                minuto = partes[1].zfill(2)
                return datetime.strptime(f"{hora}:{minuto}", "%H:%M").time()
            raise ValueError("Formato de hora inválido")

        try:
            h_inicio = converter_hora(horario_inicio)
            h_fim = converter_hora(horario_fim)
        except Exception:
            raise HTTPException(status_code=500, detail="Erro ao interpretar horários configurados para a sala")

        if not (h_inicio <= checkin_dt.time() <= h_fim and h_inicio <= checkout_dt.time() <= h_fim):
            raise HTTPException(
                status_code=400,
                detail=f"Horários fora da faixa permitida ({h_inicio.strftime('%H:%M')} - {h_fim.strftime('%H:%M')})"
            )

        # 🔄 NOVO: busca conflitos e retorna lista se houver
        cursor.execute("""
            SELECT Checkin, Checkout FROM locacao_loca
            WHERE fk_salas_ID_Sala = %s
              AND DATE(Checkin) = %s
              AND (
                (Checkin < %s AND Checkout > %s) OR
                (Checkin < %s AND Checkout > %s) OR
                (Checkin >= %s AND Checkout <= %s)
              )
        """, (
            sala_id, checkin_dt.date(),
            checkout_dt, checkin_dt,
            checkout_dt, checkin_dt,
            checkin_dt, checkout_dt
        ))
        conflitos = cursor.fetchall()

        if conflitos:
            horarios_ocupados = [
                f"{c['Checkin'].strftime('%H:%M')} - {c['Checkout'].strftime('%H:%M')}" for c in conflitos
            ]
            raise HTTPException(
                status_code=400,
                detail={
                    "mensagem": "Já existe uma reserva nesse período.",
                    "horarios_ocupados": horarios_ocupados
                }
            )

        cursor.execute("""
            INSERT INTO locacao_loca (Checkin, Checkout, fk_usuario_ID_Usuario, fk_salas_ID_Sala)
            VALUES (%s, %s, %s, %s)
        """, (checkin_dt, checkout_dt, usuario["id"], sala_id))
        connection.commit()

        return {"success": True, "message": "Reserva realizada com sucesso!"}
    except HTTPException:
        raise
    except Exception as e:
        connection.rollback()
        raise HTTPException(status_code=500, detail=f"Erro ao reservar: {str(e)}")
    finally:
        cursor.close()
        connection.close()


@app.get("/minhas-reservas")
async def minhas_reservas(request: Request):
    usuario = request.session.get("usuario")
    if not usuario:
        raise HTTPException(status_code=401, detail="Usuário não autenticado")

    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True)

    try:
        cursor.execute("""
            SELECT 
                r.ID_Locacao AS id_reserva,
                s.Rua AS rua,
                s.Numero AS numero,
                s.Cidade AS cidade,
                s.Estado AS estado,
                r.Checkin AS horario_inicio,
                r.Checkout AS horario_fim,
                s.Imagem AS imagem,
                ts.Tipo AS tipo_sala,
                s.Capacidade AS capacidade_sala,     
                s.Descricao AS descricao_sala,
                s.Valor_Hora AS valor_hora,
                r.fk_salas_ID_Sala AS id_sala,
                r.Ativo AS ativo_reserva 
            FROM locacao_loca r
            JOIN salas s ON r.fk_salas_ID_Sala = s.ID_Sala
            JOIN tipo_sala ts ON s.fk_tipo_sala_ID_Tipo_Sala = ts.ID_Tipo_Sala
            WHERE r.fk_usuario_ID_Usuario = %s
            ORDER BY r.Checkin DESC
        """, (usuario["id"],))
        reservas = cursor.fetchall()

        for reserva in reservas:
            reserva["imagem_url"] = (
                "data:image/jpeg;base64," + base64.b64encode(reserva["imagem"]).decode()
                if reserva["imagem"] else "images/placeholder.jpg"
            )

            reserva["endereco"] = f"{reserva.get('rua', '')}, {reserva.get('numero', '')} - {reserva.get('cidade', '')}, {reserva.get('estado', '')}"


            if isinstance(reserva["horario_inicio"], str):

                try:
                    reserva["horario_inicio"] = datetime.strptime(reserva["horario_inicio"], "%Y-%m-%d %H:%M:%S")
                except ValueError:
                    pass 
            if isinstance(reserva["horario_fim"], str):
                try:
                    reserva["horario_fim"] = datetime.strptime(reserva["horario_fim"], "%Y-%m-%d %H:%M:%S")
                except ValueError:
                    pass

            if isinstance(reserva["horario_inicio"], datetime):
                reserva["data_reserva"] = reserva["horario_inicio"].strftime("%d/%m/%Y")
            else:
                reserva["data_reserva"] = "Data inválida"

            if isinstance(reserva["horario_inicio"], datetime):
                reserva["horario_inicio"] = reserva["horario_inicio"].strftime("%H:%M")
            else:
                reserva["horario_inicio"] = "--:--"

            if isinstance(reserva["horario_fim"], datetime):
                reserva["horario_fim"] = reserva["horario_fim"].strftime("%H:%M")
            else:
                reserva["horario_fim"] = "--:--"

            del reserva["imagem"]

        return reservas
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erro ao buscar reservas: {str(e)}")
    finally:
        if connection.is_connected():
            cursor.close()
            connection.close()

@app.put("/reservas/{id_reserva}/cancelar") 
async def cancelar_reserva_api(id_reserva: int, request: Request):
    usuario_sessao = request.session.get("usuario")
    if not usuario_sessao:
        raise HTTPException(status_code=401, detail="Usuário não autenticado. Faça login para continuar.")
    
    usuario_id = usuario_sessao["id"]
    connection = None
    try:
        connection = get_db_connection()
        cursor = connection.cursor(dictionary=True)

        cursor.execute("""
            SELECT Checkin, Ativo 
            FROM locacao_loca 
            WHERE ID_Locacao = %s AND fk_usuario_ID_Usuario = %s
        """, (id_reserva, usuario_id))
        reserva = cursor.fetchone()

        if not reserva:
            raise HTTPException(status_code=404, detail="Reserva não encontrada ou não pertence a este usuário.")
        
        if reserva["Ativo"] == 0:
            raise HTTPException(status_code=400, detail="Esta reserva já foi cancelada anteriormente.")

        checkin_reserva = reserva["Checkin"]
        agora = datetime.now()

        if not isinstance(checkin_reserva, datetime):
             checkin_reserva = datetime.strptime(str(checkin_reserva), "%Y-%m-%d %H:%M:%S")


        if checkin_reserva < agora:
            raise HTTPException(status_code=400, detail="Não é possível cancelar uma reserva que já iniciou ou passou.")

        if (checkin_reserva - agora) < timedelta(hours=24):
            raise HTTPException(status_code=400, detail="As reservas só podem ser canceladas com mais de 24 horas de antecedência do horário de check-in.")

        cursor.execute("""
            UPDATE locacao_loca 
            SET Ativo = 0 
            WHERE ID_Locacao = %s AND fk_usuario_ID_Usuario = %s
        """, (id_reserva, usuario_id))
        
        if cursor.rowcount == 0:
            raise HTTPException(status_code=500, detail="Não foi possível atualizar a reserva. Tente novamente.")

        connection.commit()
        return {"success": True, "message": "Reserva cancelada com sucesso!"}

    except mysql.connector.Error as err:
        if connection and connection.is_connected():
            connection.rollback()
        raise HTTPException(status_code=500, detail=f"Erro de banco de dados: {err}")
    except HTTPException:
        raise
    except Exception as e:
        if connection and connection.is_connected():
            connection.rollback()
        raise HTTPException(status_code=500, detail=f"Ocorreu um erro inesperado: {str(e)}")
    finally:
        if connection and connection.is_connected():
            cursor.close()
            connection.close()