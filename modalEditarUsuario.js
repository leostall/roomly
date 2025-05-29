function formatarCPF(cpf) {
    cpf = cpf.replace(/\D/g, '');
    return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
}

function formatarTelefone(telefone) {
    telefone = telefone.replace(/\D/g, '');
    if (telefone.length === 11) {
        return telefone.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    }
    return telefone.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
}

function togglePassword(id, icon) {
    const input = document.getElementById(id);
    input.type = input.type === "password" ? "text" : "password";
    icon.classList.toggle("bi-eye");
    icon.classList.toggle("bi-eye-slash");
}

function isValidPassword(password) {
    return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(password);
}

function loadUserData() {
    fetch("http://127.0.0.1:8000/usuario-logado", {
        method: "GET",
        credentials: "include",
    })
        .then(response => response.json())
        .then(data => {
            if (data.logado) {
                document.getElementById("modalNome").value = data.nome;
                document.getElementById("modalEmail").value = data.email;
                document.getElementById("modalTelefone").value = data.telefone ? formatarTelefone(data.telefone) : '';
                document.getElementById("modalCpf").value = data.cpf ? formatarCPF(data.cpf) : '';
            } else {
                window.location.href = "/login.html";
            }
        })
        .catch(error => {
            console.error("Erro ao buscar dados do usuário:", error);
        });
}

function setupModalEvents() {
    document.getElementById("modalCpf").addEventListener("input", function (e) {
        let cpf = e.target.value.replace(/\D/g, '');
        if (cpf.length > 11) cpf = cpf.substring(0, 11);
        if (cpf.length <= 3) {
            e.target.value = cpf;
        } else if (cpf.length <= 6) {
            e.target.value = cpf.replace(/(\d{3})(\d{1,3})/, '$1.$2');
        } else if (cpf.length <= 9) {
            e.target.value = cpf.replace(/(\d{3})(\d{3})(\d{1,3})/, '$1.$2.$3');
        } else {
            e.target.value = cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{1,2})/, '$1.$2.$3-$4');
        }
    });

    document.getElementById("modalTelefone").addEventListener("input", function (e) {
        let telefone = e.target.value.replace(/\D/g, '');
        if (telefone.length > 11) telefone = telefone.substring(0, 11);
        if (telefone.length <= 2) {
            e.target.value = telefone;
        } else if (telefone.length <= 7) {
            e.target.value = telefone.replace(/(\d{2})(\d{1,5})/, '($1) $2');
        } else if (telefone.length <= 10) {
            e.target.value = telefone.replace(/(\d{2})(\d{5})(\d{1,4})/, '($1) $2-$3');
        } else {
            e.target.value = telefone.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
        }
    });

    if (document.getElementById("modalPassword")) {
        document.getElementById("modalPassword").addEventListener("input", function () {
        });
    }


    document.getElementById("modalExcluirConta").addEventListener("click", function () {
        const editUserModalInstance = bootstrap.Modal.getInstance(document.getElementById('editUserModal'));
        if (editUserModalInstance) editUserModalInstance.hide();

        document.getElementById("deletePassword").value = "";
        document.getElementById("deleteError").style.display = "none";

        const deleteModal = new bootstrap.Modal(document.getElementById('confirmDeleteModal'));
        deleteModal.show();

        const confirmDeleteModalEl = document.getElementById('confirmDeleteModal');
        const reShowEditModalHandler = () => {
            if (document.body.contains(document.getElementById('editUserModal'))) {
                const potentiallyRecreatedEditUserModalInstance = bootstrap.Modal.getOrCreateInstance(document.getElementById('editUserModal'));
                potentiallyRecreatedEditUserModalInstance.show();
            }
            confirmDeleteModalEl.removeEventListener('hidden.bs.modal', reShowEditModalOnCancelOrClose);
        };

        const reShowEditModalOnCancelOrClose = (event) => {
            if (confirmDeleteModalEl.dataset.actionCompleted !== 'true') {
                reShowEditModalHandler();
            }
            delete confirmDeleteModalEl.dataset.actionCompleted;
        };
        confirmDeleteModalEl.addEventListener('hidden.bs.modal', reShowEditModalOnCancelOrClose, { once: true });

    });

    document.getElementById("btnConfirmDelete").addEventListener("click", function () {
        const senha = document.getElementById("deletePassword").value;
        const errorDiv = document.getElementById("deleteError");
        errorDiv.style.display = "none";

        if (!senha) {
            errorDiv.textContent = "Digite sua senha para confirmar.";
            errorDiv.style.display = "block";
            return;
        }

        fetch("http://127.0.0.1:8000/excluir-conta", {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({ senha })
        })
            .then(async response => {
                const data = await response.json();
                const confirmDeleteModalEl = document.getElementById('confirmDeleteModal');
                if (response.ok && data.success !== false) {
                    confirmDeleteModalEl.dataset.actionCompleted = 'true';
                    const deleteModalInstance = bootstrap.Modal.getInstance(confirmDeleteModalEl);
                    if (deleteModalInstance) deleteModalInstance.hide();
                    Swal.fire({
                        title: "Conta excluída!",
                        text: data.message,
                        icon: "success",
                        background: "#121212",
                        color: "#ffffff"
                    }).then(() => {
                        window.location.href = "login.html";
                    });
                } else {
                    Swal.fire({
                        title: "Erro!",
                        text: data.message || "Senha incorreta. Conta não excluída.",
                        icon: "error",
                        background: "#121212",
                        color: "#ffffff"
                    });
                }
            })
            .catch(error => {
                Swal.fire({
                    title: "Erro!",
                    text: "Erro ao excluir conta.",
                    icon: "error",
                    background: "#121212",
                    color: "#ffffff"
                });
            });
    });

    // Evento para editar conta (Salvar alterações)
    document.getElementById("modalEditarConta").addEventListener("click", function () {
        const nome = document.getElementById("modalNome").value.trim();
        const email = document.getElementById("modalEmail").value.trim();
        const telefone = document.getElementById("modalTelefone").value.trim();
        const cpf = document.getElementById("modalCpf").value.trim();
        const novaSenha = document.getElementById("modalNewPassword").value;
        const confirmarSenha = document.getElementById("modalConfirmNewPassword").value;

        if (nome.length < 3) {
            return Swal.fire({
                title: "Erro",
                text: "O nome deve ter pelo menos 3 caracteres!",
                icon: "error",
                background: "#121212",
                color: "#ffffff"
            });
        }

        if (!email || !nome || !telefone || !cpf) {
            Swal.fire({ title: "Atenção!", text: "Preencha todos os campos obrigatórios.", icon: "warning", background: "#121212", color: "#fff" });
            return;
        }

        if (novaSenha || confirmarSenha) {
            if (novaSenha !== confirmarSenha) {
                Swal.fire({ title: "Atenção!", text: "As senhas não coincidem.", icon: "warning", background: "#121212", color: "#fff" });
                return;
            }
            if (novaSenha && !isValidPassword(novaSenha)) {
                Swal.fire({ title: "Atenção!", text: "A nova senha não é forte o suficiente.", icon: "warning", background: "#121212", color: "#fff" });
                return;
            }
        }

        const editUserModalEl = document.getElementById('editUserModal');
        const editUserModalInstance = bootstrap.Modal.getInstance(editUserModalEl);
        const confirmSenhaModalEl = document.getElementById('confirmSenhaModal');
        document.getElementById("modalPassword").value = ""; // Limpa o campo de senha atual
        const senhaModal = bootstrap.Modal.getOrCreateInstance(confirmSenhaModalEl);

        const confirmSenhaModalHiddenHandler = function () {
            if (confirmSenhaModalEl.dataset.actionCompleted !== 'true') {
                if (editUserModalInstance && document.body.contains(editUserModalEl)) {
                    editUserModalInstance.show();
                }
            }
            delete confirmSenhaModalEl.dataset.actionCompleted;
            confirmSenhaModalEl.removeEventListener('hidden.bs.modal', confirmSenhaModalHiddenHandler);
        };
        confirmSenhaModalEl.addEventListener('hidden.bs.modal', confirmSenhaModalHiddenHandler);

        document.getElementById("btnConfirmSenha").onclick = async function () {
            const senhaAtual = document.getElementById("modalPassword").value;
            if (!senhaAtual) {
                Swal.fire({ title: "Atenção!", text: "Digite sua senha atual para confirmar.", icon: "warning", background: "#121212", color: "#fff" });
                return;
            }

            const body = {
                nome: nome,
                email: email,
                telefone: telefone.replace(/\D/g, ''),
                cpf: cpf.replace(/\D/g, ''),
                senha_confirmacao: senhaAtual,
                nova_senha: novaSenha
            };

            try {
                const response = await fetch("http://127.0.0.1:8000/editar-usuario", {
                    method: "PUT", headers: { "Content-Type": "application/json" },
                    credentials: "include", body: JSON.stringify(body) // Certifique-se que 'body' está correto como discutimos antes
                });
                const data = await response.json(); // Tenta parsear o JSON, mesmo em caso de erro HTTP (FastAPI envia corpo JSON em erros)

                if (response.ok) {
                    confirmSenhaModalEl.dataset.actionCompleted = 'true';

                    const senhaModalInstance = bootstrap.Modal.getInstance(confirmSenhaModalEl);
                    if (senhaModalInstance) {
                        senhaModalInstance.hide();
                    }

                    Swal.fire({
                        title: "Alterações salvas!",
                        text: data.message, // Supondo que a resposta de sucesso tenha data.message
                        icon: "success",
                        background: "#121212",
                        color: "#ffffff"
                    }).then((result) => {
                        if (result.isConfirmed) {
                            window.location.reload();
                        }
                    });
                } else {
                    // CORREÇÃO AQUI: Use data.detail para pegar a mensagem de erro do FastAPI
                    throw new Error(data.detail || "Erro ao salvar alterações.");
                }
            } catch (error) { // Captura erros de rede ou o erro lançado acima
                Swal.fire({ title: "Erro!", text: error.message, icon: "error", background: "#121212", color: "#ffffff" });
            }
        };

        if (editUserModalInstance) {
            editUserModalInstance.hide();
        }
        senhaModal.show();
    });
}



function showEditUserModal() {
    if (document.getElementById('editUserModal')) {
        document.getElementById('editUserModal').remove();
    }
    if (document.getElementById('confirmSenhaModal')) {
        document.getElementById('confirmSenhaModal').remove();
    }
    if (document.getElementById('confirmDeleteModal')) {
        document.getElementById('confirmDeleteModal').remove();
    }


    const modalHTML = `
  <div class="modal fade" id="editUserModal" tabindex="-1" aria-labelledby="editUserModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-lg">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="editUserModalLabel">Editar cadastro</h5>
          <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <form id="registrationForm">
            <div class="mb-3">
              <label for="modalEmail" class="form-label">E-mail<span class="required">*</span></label>
              <input type="text" class="form-control" id="modalEmail" placeholder="nome@exemplo.com">
            </div>
            <div class="mb-3">
              <label for="modalNome" class="form-label">Nome completo<span class="required">*</span></label>
              <input type="text" class="form-control" id="modalNome" placeholder="Insira o nome">
            </div>
            <div class="mb-3">
              <label for="modalTelefone" class="form-label">Telefone<span class="required">*</span></label>
              <input type="tel" class="form-control" id="modalTelefone" placeholder="(00) 00000-0000">
            </div>
            <div class="mb-3">
              <label for="modalCpf" class="form-label">CPF<span class="required"></span></label>
              <input type="text" class="form-control bg-light" id="modalCpf" placeholder="000.000.000-00" maxlength="14" readonly>
            </div>
            <div class="mb-3 password-wrapper">
              <label for="modalNewPassword" class="form-label">Nova senha</label>
              <div class="password-wrapper-inner">
                <input type="password" class="form-control" id="modalNewPassword" placeholder="Nova senha">
                <i class="bi bi-eye toggle-password" onclick="togglePassword('modalNewPassword', this)"></i>
              </div>
            </div>
            <div class="mb-3 password-wrapper">
              <label for="modalConfirmNewPassword" class="form-label">Confirmar nova senha</label>
              <div class="password-wrapper-inner">
                <input type="password" class="form-control" id="modalConfirmNewPassword" placeholder="Confirme a nova senha">
                <i class="bi bi-eye toggle-password" onclick="togglePassword('modalConfirmNewPassword', this)"></i>
              </div>
            </div>
          </form>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-danger me-auto" id="modalExcluirConta">Excluir Conta</button>
          <button type="button" class="btn btn-primary" id="modalEditarConta">Salvar alterações</button>
        </div>
      </div>
    </div>
  </div>

  <div class="modal fade" id="confirmSenhaModal" tabindex="-1" aria-hidden="true" data-bs-backdrop="static">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Confirme sua senha</h5>
          <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <form id="formConfirmSenha">
            <div class="mb-3">
              <label for="modalPassword" class="form-label">Senha atual <span class="required">*</span></label>
              <input type="password" class="form-control" id="modalPassword" placeholder="Digite sua senha atual" required>
            </div>
          </form>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
          <button type="button" class="btn btn-primary" id="btnConfirmSenha">Confirmar</button>
        </div>
      </div>
    </div>
  </div>

  <div class="modal fade" id="confirmDeleteModal" tabindex="-1" aria-hidden="true" data-bs-backdrop="static">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content bg-dark text-white">
        <div class="modal-header">
          <h5 class="modal-title">Excluir conta</h5>
          <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <form id="formConfirmDelete">
            <div class="mb-3">
              <label for="deletePassword" class="form-label">Senha atual <span class="required">*</span></label>
              <input type="password" class="form-control" id="deletePassword" placeholder="Digite sua senha atual" required>
            </div>
          </form>
          <div id="deleteError" class="text-danger mt-2" style="display:none;"></div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
          <button type="button" class="btn btn-danger" id="btnConfirmDelete">Excluir Conta</button>
        </div>
      </div>
    </div>
  </div>
  `;

    document.body.insertAdjacentHTML('beforeend', modalHTML);
    loadUserData();
    const modal = new bootstrap.Modal(document.getElementById('editUserModal'));
    modal.show();
    setupModalEvents();
}