// auth.js - Script de autenticação e controle de navbar

// Função para controlar o efeito de scroll na navbar
function setupNavbarScroll() {
    window.addEventListener('scroll', function () {
        const navbar = document.querySelector('.navbar');
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
}

// Função para configurar scroll suave
function setupSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('#href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Função para verificar o status de login
async function verificarLogin() {
    try {
        const response = await fetch("http://127.0.0.1:8000/usuario-logado", {
            credentials: "include"
        });
        const data = await response.json();

        const authDiv = document.getElementById("auth-buttons");
        const loginBtn = document.getElementById("login-btn");
        const dropdown = document.getElementById("user-dropdown");
        const greeting = document.getElementById("user-greeting");
        const editRooms = document.getElementById("editRooms");
        const adminItems = document.getElementById("admin-items");

        if (data.logado) {
            // Esconde o botão de login
            if (loginBtn) loginBtn.style.display = "none";

            // Mostra o dropdown
            if (dropdown) dropdown.style.display = "block";
            if (greeting) greeting.textContent = `Olá, ${data.nome}!`;

            // Mostra itens administrativos para papel = 2
            if (data.papel === 2) {
                if (editRooms) {
                    editRooms.style.display = "block";
                    editRooms.onclick = () => {
                        window.location.href = "editarSalas.html";
                    };
                }
                if (adminItems) adminItems.style.display = "block";

                const manageTypesBtn = document.getElementById("manage-room-types");
                if (manageTypesBtn) {
                    manageTypesBtn.addEventListener("click", function (e) {
                        e.preventDefault();
                        if (typeof showTiposSalaModal === 'function') {
                            showTiposSalaModal();
                        }
                    });
                }
            } else {
                if (editRooms) editRooms.style.display = "none";
                if (adminItems) adminItems.style.display = "none";
            }

            // Configura logout
            const logoutBtn = document.getElementById("logout");
            if (logoutBtn) {
                logoutBtn.addEventListener("click", function (e) {
                    e.preventDefault();
                    logout();
                });
            }
        } else {
            // Usuário não logado
            if (loginBtn) loginBtn.style.display = "block";
            if (dropdown) dropdown.style.display = "none";
            if (adminItems) adminItems.style.display = "none";
        }
    } catch (error) {
        console.error("Erro ao verificar login:", error);
    }
}

// Função de logout
async function logout() {
    try {
        await fetch("http://127.0.0.1:8000/logout", {
            method: "POST",
            credentials: "include"
        });
        window.location.reload();
    } catch (error) {
        console.error("Erro ao fazer logout:", error);
    }
}

// Inicializa tudo quando o DOM estiver pronto
document.addEventListener("DOMContentLoaded", function () {
    setupNavbarScroll();
    setupSmoothScroll();
    verificarLogin();
});

async function carregarTodasSalas(limite = 6) {
  const container = document.getElementById('user-rooms-container');
  if (!container) return;
  container.innerHTML = "";

  try {
    const response = await fetch("http://127.0.0.1:8000/salas-todas");
    const salas = await response.json();

    // Gera os cards
    salas.slice(0, limite).forEach(sala => {
      const card = document.createElement('div');
      card.className = 'col-md-6 col-lg-4';
      card.innerHTML = `
        <div class="room-card h-100 d-flex flex-column">
          <div class="position-relative">
            <img src="${sala.imagem_url}" class="img-fluid room-img w-100" alt="Sala">
            <span class="room-badge">Disponível</span>
          </div>
          <div class="p-4 flex-grow-1 d-flex flex-column">
            <h4>${sala.Tipo || "Sala"}</h4>
            <p class="text-muted">${sala.Descricao || ""}</p>
            <div class="mt-auto">
              <div class="d-flex justify-content-between align-items-center">
                <div>
                  <span class="fw-bold">R$ ${sala.Valor_Hora}/h</span>
                  <span class="text-muted ms-2">• até ${sala.Capacidade} pessoas</span>
                </div>
                <button class="btn btn-sm btn-primary reservar-btn" data-id="${sala.ID_Sala}">Reservar</button>
              </div>
            </div>
          </div>
        </div>
      `;
      container.appendChild(card);
    });

    container.querySelectorAll('.reservar-btn').forEach(btn => {
      btn.addEventListener('click', function () {
        const salaId = this.getAttribute('data-id');
        window.location.href = `reserva.html?sala=${salaId}`;
      });
    });

    
    const verTodasDiv = document.getElementById('ver-todas-salas-btn');
    if (salas.length > limite) {
      if (!verTodasDiv) {
        const btnDiv = document.createElement('div');
        btnDiv.className = "text-center mt-4";
        btnDiv.id = "ver-todas-salas-btn";
        btnDiv.innerHTML = `
          <button class="btn btn-outline-primary" onclick="window.location.href='todasSalas.html'">
            Ver todas as salas
          </button>
        `;
        container.parentElement.appendChild(btnDiv);
      }
    } else if (verTodasDiv) {
      verTodasDiv.remove();
    }

  } catch (error) {
    console.error("Erro ao carregar salas:", error);
  }
}
