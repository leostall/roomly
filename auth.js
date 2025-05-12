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
            const target = document.querySelector(this.getAttribute('href'));
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