// *** MODAL DE CADASTRO DE SALA ***
function showCadastroSalaModal() {
  if (document.getElementById('cadastroSalaModal')) {
    document.getElementById('cadastroSalaModal').remove();
  }

  // Cria a estrutura da modal
  const modalHTML = `
    <div class="modal fade" id="cadastroSalaModal" tabindex="-1" aria-labelledby="cadastroSalaModalLabel" aria-hidden="true">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="cadastroSalaModalLabel">Cadastro de Sala</h5>
            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <form id="cadastroSalaForm">
              <div class="row g-3">
                <!-- Tipo da Sala -->
                <div class="col-12 col-md-6">
                  <label for="modalTipoSala" class="form-label">Tipo da Sala *</label>
                  <select class="form-control form-select-dark" id="modalTipoSala" required>
                    <option value="" disabled selected>Selecione um tipo</option>
                  </select>
                </div>
                
                <!-- Capacidade -->
                <div class="col-12 col-md-6">
                  <label for="modalCapacidade" class="form-label">Capacidade *</label>
                  <input type="number" class="form-control" id="modalCapacidade" placeholder="Capacidade" min="1" required>
                </div>

                <!-- Tamanho m² -->
                <div class="col-12 col-md-4">
                  <label for="modalTamanhoM2" class="form-label">Tamanho m² *</label>
                  <input type="number" class="form-control" id="modalTamanhoM2" placeholder="Tamanho m²" min="0.1" required>
                </div>

                <!-- Valor Hora -->
                <div class="col-12 col-md-4">
                  <label for="modalValorHora" class="form-label">Valor hora (R$) *</label>
                  <input type="number" class="form-control" id="modalValorHora" placeholder="Valor R$" min="1" max="99999.99" required>
                </div>

                <!-- CEP -->
                <div class="col-12 col-md-4">
                  <label for="modalCep" class="form-label">CEP *</label>
                  <input type="text" class="form-control" id="modalCep" placeholder="CEP" required>
                </div>

                <!-- Endereço -->
                <div class="col-12 col-md-8">
                  <label for="modalRua" class="form-label">Rua *</label>
                  <input type="text" class="form-control" id="modalRua" placeholder="Rua" required>
                </div>

                <div class="col-12 col-md-4">
                  <label for="modalNumero" class="form-label">Número *</label>
                  <input type="text" class="form-control" id="modalNumero" placeholder="Número" required>
                </div>


                <div class="col-12 col-md-6">
                  <label for="modalEstado" class="form-label">Estado *</label>
                  <select class="form-control" id="modalEstado" required>
                    <option value="" disabled selected>Selecione um estado</option>
                  </select>
                </div>

                <div class="col-12 col-md-6">
                  <label for="modalCidade" class="form-label">Cidade *</label>
                  <select class="form-control" id="modalCidade" required>
                    <option value="" disabled selected>Selecione uma cidade</option>
                  </select>
                </div>

                <div class="col-12">
                  <label for="modalComplemento" class="form-label">Complemento</label>
                  <input type="text" class="form-control" id="modalComplemento" placeholder="Complemento">
                </div>

                <!-- Recursos -->
                <div class="col-12">
                  <label for="modalRecursos" class="form-label">Recursos disponíveis *</label>
                  <input type="text" class="form-control" id="modalRecursos" placeholder="Wi-Fi, projetor, TV, etc." required>
                </div>

                <!-- Mobiliário -->
                <div class="col-12">
                  <label for="modalMobilario" class="form-label">Tipo de mobiliário *</label>
                  <input type="text" class="form-control" id="modalMobilario" placeholder="Cadeiras, mesas, sofá, etc." required>
                </div>

                <!-- Descrição -->
                <div class="col-12">
                  <label for="modalDescricao" class="form-label">Descrição *</label>
                  <input type="text" class="form-control" id="modalDescricao" placeholder="Breve descrição da sala." required>
                </div>

                <!-- Disponibilidade -->
                <div class="col-12">
                  <label class="form-label">Disponibilidade (dias da semana) *</label>
                  <div class="d-flex flex-wrap gap-2">
                    <div class="form-check">
                      <input class="form-check-input" type="checkbox" id="modalDomingo">
                      <label class="form-check-label" for="modalDomingo">Domingo</label>
                    </div>
                    <div class="form-check">
                      <input class="form-check-input" type="checkbox" id="modalSegunda">
                      <label class="form-check-label" for="modalSegunda">Segunda-feira</label>
                    </div>
                    <div class="form-check">
                      <input class="form-check-input" type="checkbox" id="modalTerca">
                      <label class="form-check-label" for="modalTerca">Terça-feira</label>
                    </div>
                    <div class="form-check">
                      <input class="form-check-input" type="checkbox" id="modalQuarta">
                      <label class="form-check-label" for="modalQuarta">Quarta-feira</label>
                    </div>
                    <div class="form-check">
                      <input class="form-check-input" type="checkbox" id="modalQuinta">
                      <label class="form-check-label" for="modalQuinta">Quinta-feira</label>
                    </div>
                    <div class="form-check">
                      <input class="form-check-input" type="checkbox" id="modalSexta">
                      <label class="form-check-label" for="modalSexta">Sexta-feira</label>
                    </div>
                    <div class="form-check">
                      <input class="form-check-input" type="checkbox" id="modalSabado">
                      <label class="form-check-label" for="modalSabado">Sábado</label>
                    </div>
                  </div>
                  <div class="invalid-feedback">Selecione pelo menos um dia da semana</div>
                  
                  <div class="col-12">
                    <label for="modalImagemSala" class="form-label">Imagem da Sala</label>
                    <div class="input-group">
                      <input type="file" class="form-control" id="modalImagemSala" accept="image/*">
                    </div>
                  
                  <div id="containerHorarioUteis" class="row">
                    <div class="col-6">
                      <label for="modalHorarioInicioUteis" class="form-label">Horário Início (Dias Úteis) *</label>
                      <input type="time" class="form-control horario-btn" id="modalHorarioInicioUteis">
                    </div>
                    <div class="col-6">
                      <label for="modalHorarioFimUteis" class="form-label">Horário Fim (Dias Úteis) *</label>
                      <input type="time" class="form-control horario-btn" id="modalHorarioFimUteis">
                    </div>
                  </div>

                  <div id="containerHorarioNaoUteis" class="row mt-3">
                    <div class="col-6">
                      <label for="modalHorarioInicioNaoUtil" class="form-label">Horário Início (Finais de Semana/Feriados)*</label>
                      <input type="time" class="form-control horario-btn" id="modalHorarioInicioNaoUtil">
                    </div>
                    <div class="col-6">
                      <label for="modalHorarioFimNaoUtil" class="form-label">Horário Fim (Finais de Semana/Feriados)*</label>
                      <input type="time" class="form-control horario-btn" id="modalHorarioFimNaoUtil">
                    </div>
                  </div>
                </div>
              </div>
            </form>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-primary" id="modalSalvarSala">Salvar Sala</button>
          </div>
        </div>
      </div>
    </div>
  `;

  // Adiciona a modal ao body
  document.body.insertAdjacentHTML('beforeend', modalHTML);

  // Configura os eventos e carrega os dados necessários
  setupCadastroSalaModal();

  // Inicializa a modal
  const modal = new bootstrap.Modal(document.getElementById('cadastroSalaModal'));
  modal.show();
}

// Função para configurar a modal de cadastro de sala
function setupCadastroSalaModal() {
  // Carrega os tipos de sala
  carregarTiposSalaModal();

  carregarEstados("modalEstado");

  // Configura o evento para carregar cidades ao selecionar um estado
  document.getElementById("modalEstado").addEventListener("change", () => {
    carregarCidades("modalEstado", "modalCidade");
  });


  // Configura máscara para o CEP
  document.getElementById("modalCep").addEventListener("input", function (e) {
    let cep = e.target.value.replace(/\D/g, '');
    if (cep.length <= 5) {
      e.target.value = cep.replace(/(\d{5})(\d{0,3})/, '$1-$2');
    } else {
      cep = cep.slice(0, 8);
      e.target.value = cep.replace(/(\d{5})(\d{3})/, '$1-$2');
    }
  });

  // Configura máscara para o campo "Número"
  document.getElementById("modalNumero").addEventListener("input", function (e) {
    let numero = e.target.value.replace(/\D/g, ''); // Remove tudo que não for número
    e.target.value = numero; // Atualiza o valor do campo
  });

  // Busca endereço pelo CEP
  document.getElementById('modalCep').addEventListener('blur', async function () {
    const cep = this.value.replace(/\D/g, '');
    if (cep.length !== 8) return;

    try {
      const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
      const data = await response.json();

      if (!data.erro) {
        document.getElementById('modalRua').value = data.logradouro || '';
        document.getElementById('modalCidade').innerHTML = `<option value="${data.localidade}" selected>${data.localidade}</option>`;
        document.getElementById('modalEstado').value = data.uf || '';
      } else {
        console.error("CEP não encontrado.");
      }
    } catch (error) {
      console.error("Erro ao buscar CEP:", error);
    }
  });

  // Validação em tempo real para campos obrigatórios
  document.querySelectorAll('#cadastroSalaForm [required]').forEach(field => {
    field.addEventListener('input', function () {
      if (this.value) {
        this.classList.remove('is-invalid');
      }
    });
  });

  // Evento para salvar a sala
  document.getElementById("modalSalvarSala").addEventListener("click", async function () {
    // Verifica se pelo menos um dia foi selecionado
    const checkboxes = document.querySelectorAll('#cadastroSalaForm .form-check-input');
    let atLeastOneChecked = false;
    checkboxes.forEach(checkbox => {
      if (checkbox.checked) atLeastOneChecked = true;
    });

    // Validação de intervalo de horários
    const horarioInicioUteis = document.getElementById("modalHorarioInicioUteis").value;
    const horarioFimUteis = document.getElementById("modalHorarioFimUteis").value;
    const horarioInicioNaoUteis = document.getElementById("modalHorarioInicioNaoUtil").value;
    const horarioFimNaoUteis = document.getElementById("modalHorarioFimNaoUtil").value;

    // Captura os dados do formulário
    const tipoSalaId = document.getElementById("modalTipoSala").value;
    const capacidade = document.getElementById("modalCapacidade").value;
    const tamanhoM2 = document.getElementById("modalTamanhoM2").value;
    const valorHora = document.getElementById("modalValorHora").value;
    const recursos = document.getElementById("modalRecursos").value;
    const tipoMobilia = document.getElementById("modalMobilario").value;
    const cep = document.getElementById("modalCep").value.replace(/\D/g, '');
    const rua = document.getElementById("modalRua").value;
    const cidade = document.getElementById("modalCidade").value;
    const estado = document.getElementById("modalEstado").value;
    const numero = document.getElementById("modalNumero").value;
    const complemento = document.getElementById("modalComplemento").value;
    const descricao = document.getElementById("modalDescricao").value;

    // Captura a disponibilidade
    const domingo = document.getElementById("modalDomingo").checked ? 1 : 0;
    const segunda = document.getElementById("modalSegunda").checked ? 1 : 0;
    const terca = document.getElementById("modalTerca").checked ? 1 : 0;
    const quarta = document.getElementById("modalQuarta").checked ? 1 : 0;
    const quinta = document.getElementById("modalQuinta").checked ? 1 : 0;
    const sexta = document.getElementById("modalSexta").checked ? 1 : 0;
    const sabado = document.getElementById("modalSabado").checked ? 1 : 0;


    const diasUteisSelecionados = segunda || terca || quarta || quinta || sexta;
    const diasNaoUteisSelecionados = sabado || domingo;

    const cepValido = await validarCepCidadeEstado(cep, cidade, estado);

    if (!tipoSalaId || !capacidade || !tamanhoM2 || !valorHora || !recursos || !tipoMobilia || !cep || !rua || !cidade || !estado || !numero || !descricao) {
      Swal.fire({
        title: "Erro!",
        text: "Preencha todos os campos obrigatórios.",
        icon: "error",
        background: "#121212",
        color: "#ffffff"
      });
      return;
    }

    if (recursos.length < 10 || tipoMobilia.length < 10 || rua.length < 10 || descricao.length < 10) {
      Swal.fire({
        title: "Erro!",
        text: "Os campos de texto devem ter no mínimo 10 caracteres.",
        icon: "error",
        background: "#121212",
        color: "#ffffff"
      });
      return;
    }

    if (capacidade < 1) {
      Swal.fire({
        title: "Erro!",
        text: "O valor de capacidade deve ser maior ou igual a 1.",
        icon: "error",
        background: "#121212",
        color: "#ffffff"
      });
      return;
    }

    if (capacidade <= 0 || numero <= 0 || capacidade.includes(",")) {
      Swal.fire({
        title: "Erro!",
        text: "Os campos numéricos devem ser positivos e não podem conter vírgulas.",
        icon: "error",
        background: "#121212",
        color: "#ffffff"
      });
      return;
    }

    // Validação do campo "Número"
    if (!numero || isNaN(numero) || numero.includes(",") || parseInt(numero) <= 0) {
      Swal.fire({
        title: "Erro!",
        text: "O campo 'Número' deve conter apenas números positivos e não pode conter vírgulas.",
        icon: "error",
        background: "#121212",
        color: "#ffffff"
      });
      return;
    }

    if (tamanhoM2 < 0.1) {
      Swal.fire({
        title: "Erro!",
        text: "O tamanho deve ser maior ou igual a 0.1 m².",
        icon: "error",
        background: "#121212",
        color: "#ffffff"
      });
      return;
    }

    // Validação do campo "Valor Hora"
    if (!valorHora || isNaN(valorHora.replace(",", ".")) || parseFloat(valorHora.replace(",", ".")) < 0.1) {
      Swal.fire({
        title: "Erro!",
        text: "O campo 'Valor Hora' deve ser um número válido (mínimo 0,1).",
        icon: "error",
        background: "#121212",
        color: "#ffffff"
      });
      return;
    }

    if (!capacidade || isNaN(capacidade.replace(",", ".")) || parseFloat(capacidade.replace(",", ".")) < 0.1) {
      Swal.fire({
        title: "Erro!",
        text: "O campo 'Capacidade' deve ser um número válido (mínimo 0,1).",
        icon: "error",
        background: "#121212",
        color: "#ffffff"
      });
      return;
    }

    if (descricao.length > 200) {
      Swal.fire({
        title: "Erro!",
        text: "A descrição deve ter no máximo 200 caracteres.",
        icon: "error",
        background: "#121212",
        color: "#ffffff"
      });
      return;
    }


    if (!(domingo || segunda || terca || quarta || quinta || sexta || sabado)) {
      Swal.fire({
        title: "Erro!",
        text: "Selecione pelo menos um dia da semana.",
        icon: "error",
        background: "#121212",
        color: "#ffffff"
      });
      return;
    }

    // Verifica se a imagem foi selecionada
    const imagemInput = document.getElementById("modalImagemSala");
    if (imagemInput.files.length === 0) {
      Swal.fire({
        title: 'Erro!',
        text: 'Selecione uma imagem para a sala.',
        icon: 'info',
        confirmButtonText: 'Ok',
        background: '#121212',
        color: '#fff'
      });
      return;
    }


    if (horarioInicioUteis && horarioFimUteis) {
      const diffUteis = calcularDiferencaHoras(horarioInicioUteis, horarioFimUteis);
      if (diffUteis < 1) {
        Swal.fire({
          title: "Erro!",
          text: "O intervalo entre os horários de dias úteis deve ser maior que 1 hora.",
          icon: "error",
          background: "#121212",
          color: "#ffffff"
        });
        return;
      }
    }

    if (horarioInicioNaoUteis && horarioFimNaoUteis) {
      const diffNaoUteis = calcularDiferencaHoras(horarioInicioNaoUteis, horarioFimNaoUteis);
      if (diffNaoUteis < 1) {
        Swal.fire({
          title: "Erro!",
          text: "O intervalo entre os horários de finais de semana/feriados deve ser maior que 1 hora.",
          icon: "error",
          background: "#121212",
          color: "#ffffff"
        });
        return;
      }
    }



    if (!cepValido) {
      Swal.fire({
        title: "Erro!",
        text: "O CEP não corresponde à cidade e ao estado selecionados.",
        icon: "error",
        background: "#121212",
        color: "#fff"
      });
      return; // Impede o envio do formulário
    }

    if (diasUteisSelecionados) {
      if (!document.getElementById("modalHorarioInicioUteis").value || !document.getElementById("modalHorarioFimUteis").value) {
        Swal.fire({
          title: 'Erro!',
          text: 'Preencha os horários de dias úteis.',
          icon: 'info',
          confirmButtonText: 'Ok',
          background: '#121212',
          color: '#fff'
        });
        return;
      }
    }
    if (diasNaoUteisSelecionados) {
      if (!document.getElementById("modalHorarioInicioNaoUtil").value || !document.getElementById("modalHorarioFimNaoUtil").value) {
        Swal.fire({
          title: 'Erro!',
          text: 'Preencha os horários de finais de semana/feriados.',
          icon: 'info',
          confirmButtonText: 'Ok',
          background: '#121212',
          color: '#fff'
        });
        return;
      }
    }



    // Obtém o ID do usuário logado
    const usuario = await fetchUsuarioLogado();
    const fkUsuarioId = usuario.id;

    const formData = new FormData();
    formData.append("tipoSalaId", tipoSalaId);
    formData.append("capacidade", capacidade);
    formData.append("tamanho", tamanhoM2);
    formData.append("valor_hora", valorHora);
    formData.append("recursos", recursos);
    formData.append("tipo_mobilia", tipoMobilia);
    formData.append("cep", cep);
    formData.append("rua", rua);
    formData.append("cidade", cidade);
    formData.append("estado", estado);
    formData.append("numero", numero);
    formData.append("complemento", complemento);
    formData.append("descricao", descricao);
    formData.append("fk_tipo_sala_id", tipoSalaId);
    formData.append("fk_usuario_id", fkUsuarioId);
    formData.append("domingo", domingo);
    formData.append("segunda", segunda);
    formData.append("terca", terca);
    formData.append("quarta", quarta);
    formData.append("quinta", quinta);
    formData.append("sexta", sexta);
    formData.append("sabado", sabado);
    formData.append("status", 1);
    formData.append("HorarioInicio_DiasUteis", document.getElementById("modalHorarioInicioUteis").value);
    formData.append("HorarioFim_DiasUteis", document.getElementById("modalHorarioFimUteis").value);
    formData.append("HorarioInicio_DiaNaoUtil", document.getElementById("modalHorarioInicioNaoUtil").value);
    formData.append("HorarioFim_DiaNaoUtil", document.getElementById("modalHorarioFimNaoUtil").value);

    // Adiciona a imagem, se houver
    if (imagemInput.files.length > 0) {
      formData.append("imagem", imagemInput.files[0]);
    }

    try {
      const response = await fetch("http://127.0.0.1:8000/salas-cadastro", {
        method: "POST",
        body: formData

      });

      const result = await response.json();

      if (result.success) {
        Swal.fire({
          title: "Sucesso!",
          text: result.message,
          icon: "success",
          confirmButtonText: "Ok",
          background: "#121212",
          color: "#fff"
        }).then(() => {
          // Fecha a modal
          bootstrap.Modal.getInstance(document.getElementById('cadastroSalaModal')).hide();
          // Redireciona para a página de edição de salas
          window.location.href = "editarSalas.html";
        });
      } else {
        Swal.fire({
          title: "Erro!",
          text: result.message,
          icon: "error",
          confirmButtonText: "Ok",
          background: "#121212",
          color: "#fff"
        });
      }
    } catch (error) {
      console.error("Erro ao cadastrar sala:", error);
      Swal.fire({
        title: "Erro!",
        text: "Ocorreu um erro ao cadastrar a sala.",
        icon: "error",
        confirmButtonText: "Ok",
        background: "#121212",
        color: "#fff"
      });
    }
  });

  function toggleHorariosCadastro() {
    // Dias úteis: segunda a sexta
    const diasUteis = [
      document.getElementById("modalSegunda"),
      document.getElementById("modalTerca"),
      document.getElementById("modalQuarta"),
      document.getElementById("modalQuinta"),
      document.getElementById("modalSexta")
    ];
    // Dias não úteis: sábado e domingo
    const diasNaoUteis = [
      document.getElementById("modalSabado"),
      document.getElementById("modalDomingo")
    ];

    const algumUtil = diasUteis.some(cb => cb.checked);
    const algumNaoUtil = diasNaoUteis.some(cb => cb.checked);

    document.getElementById("containerHorarioUteis").style.display = algumUtil ? "flex" : "none";
    document.getElementById("containerHorarioNaoUteis").style.display = algumNaoUtil ? "flex" : "none";
  }

  // Adiciona o evento nos checkboxes
  ["modalSegunda", "modalTerca", "modalQuarta", "modalQuinta", "modalSexta", "modalSabado", "modalDomingo"].forEach(id => {
    document.getElementById(id).addEventListener("change", toggleHorariosCadastro);
  });

  // Chama uma vez para garantir o estado inicial
  toggleHorariosCadastro();

  validarIntervaloAoVivo("modalHorarioInicioUteis", "modalHorarioFimUteis");
  validarIntervaloAoVivo("modalHorarioInicioNaoUtil", "modalHorarioFimNaoUtil");

}



// Função para carregar os tipos de sala na modal
async function carregarTiposSalaModal() {
  try {
    const usuario = await fetchUsuarioLogado();
    const response = await fetch('http://127.0.0.1:8000/tipos-sala-recuperar', {
      method: "GET",
      credentials: "include"
    });

    const tiposSala = await response.json();

    const selectTipoSala = document.getElementById('modalTipoSala');
    selectTipoSala.innerHTML = '<option value="" disabled selected>Selecione um tipo</option>';

    tiposSala.forEach(tipo => {
      const option = document.createElement('option');
      option.value = tipo.ID_Tipo_Sala;
      option.textContent = tipo.Tipo;
      selectTipoSala.appendChild(option);
    });
  } catch (error) {
    console.error('Erro ao carregar tipos de sala:', error);
    Swal.fire({
      title: 'Erro!',
      text: 'Não foi possível carregar os tipos de sala.',
      icon: 'error',
      background: '#121212',
      color: '#ffffff'
    });
  }
}

// Função auxiliar para obter usuário logado
async function fetchUsuarioLogado() {
  try {
    const response = await fetch("http://127.0.0.1:8000/usuario-logado", {
      method: "GET",
      credentials: "include"
    });
    const data = await response.json();

    if (data.logado) {
      return data;
    } else {
      window.location.href = "login.html";
      return null;
    }
  } catch (error) {
    console.error("Erro ao buscar usuário logado:", error);
    window.location.href = "login.html";
    return null;
  }
}

// *** MODAL DE EDIÇÃO DE SALA ***
function showEditSalaModal(salaId) {
  if (document.getElementById('editSalaModal')) {
    document.getElementById('editSalaModal').remove();
  }

  // Cria a estrutura da modal
  const modalHTML = `
    <div class="modal fade" id="editSalaModal" tabindex="-1" aria-labelledby="editSalaModalLabel" aria-hidden="true">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="editSalaModalLabel">Editar Sala</h5>
            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <form id="editarSalaForm" class="row g-3">
              <div class="col-md-6">
                <label for="modalEditTipoSala" class="form-label">Tipo de Sala</label>
                <select id="modalEditTipoSala" class="form-control form-select-dark" required>
                  <!-- Tipos de sala serão preenchidos dinamicamente -->
                </select>
              </div>
              <div class="col-md-6">
                <label for="modalEditCapacidade" class="form-label">Capacidade</label>
                <input type="number" class="form-control" id="modalEditCapacidade" step="0.01" min="1" max="999999.99" required>
              </div>
              <div class="col-md-6">
                <label for="modalEditTamanhoM2" class="form-label">Tamanho (m²)</label>
                <input type="number" class="form-control" id="modalEditTamanhoM2" step="0.01" required>
              </div>
              <div class="col-md-6">
                <label for="modalEditValorHora" class="form-label">Valor por Hora</label>
                <input type="number" class="form-control" id="modalEditValorHora" step="0.01" min="0.1" max="99999.99" required>
              </div>
              <div class="col-md-12">
                <label for="modalEditRecursos" class="form-label">Recursos Disponíveis</label>
                <input type="text" class="form-control" id="modalEditRecursos" required>
              </div>
              <div class="col-md-12">
                <label for="modalEditMobilario" class="form-label">Tipo de Mobiliário</label>
                <input type="text" class="form-control" id="modalEditMobilario" required>
              </div>
              <div class="col-md-6">
                <label for="modalEditCep" class="form-label">CEP</label>
                <input type="text" class="form-control" id="modalEditCep" 
                      placeholder="00000-000" maxlength="9" required>
              </div>
              <div class="col-md-6">
                <label for="modalEditRua" class="form-label">Rua</label>
                <input type="text" class="form-control" id="modalEditRua" required>
              </div>
              <div class="col-md-6">
                <label for="modalEditNumero" class="form-label">Número</label>
                <input type="number" class="form-control" id="modalEditNumero" required>
              </div>
              <div class="col-12 col-md-6">
                <label for="modalEditEstado" class="form-label">Estado *</label>
                <select class="form-control" id="modalEditEstado" required>
                  <option value="" disabled selected>Selecione um estado</option>
                </select>
              </div>
              <div class="col-12 col-md-6">
                <label for="modalEditCidade" class="form-label">Cidade *</label>
                <select class="form-control" id="modalEditCidade" required>
                  <option value="" disabled selected>Selecione uma cidade</option>
                </select>
              </div>
              <div class="col-md-6">
                <label for="modalEditComplemento" class="form-label">Complemento</label>
                <input type="text" class="form-control" id="modalEditComplemento">
              </div>
              <div class="col-md-12">
                <label for="modalEditDescricao" class="form-label">Descrição</label>
                <textarea class="form-control" id="modalEditDescricao" rows="3" required></textarea>
              </div>
              <div class="col-md-12">
                <label class="form-label">Disponibilidade</label>
                <div class="d-flex flex-wrap gap-3">
                  <div class="form-check">
                    <input class="form-check-input" type="checkbox" id="modalEditDomingo">
                    <label class="form-check-label" for="modalEditDomingo">Domingo</label>
                  </div>
                  <div class="form-check">
                    <input class="form-check-input" type="checkbox" id="modalEditSegunda">
                    <label class="form-check-label" for="modalEditSegunda">Segunda</label>
                  </div>
                  <div class="form-check">
                    <input class="form-check-input" type="checkbox" id="modalEditTerca">
                    <label class="form-check-label" for="modalEditTerca">Terça</label>
                  </div>
                  <div class="form-check">
                    <input class="form-check-input" type="checkbox" id="modalEditQuarta">
                    <label class="form-check-label" for="modalEditQuarta">Quarta</label>
                  </div>
                  <div class="form-check">
                    <input class="form-check-input" type="checkbox" id="modalEditQuinta">
                    <label class="form-check-label" for="modalEditQuinta">Quinta</label>
                  </div>
                  <div class="form-check">
                    <input class="form-check-input" type="checkbox" id="modalEditSexta">
                    <label class="form-check-label" for="modalEditSexta">Sexta</label>
                  </div>
                  <div class="form-check">
                    <input class="form-check-input" type="checkbox" id="modalEditSabado">
                    <label class="form-check-label" for="modalEditSabado">Sábado</label>
                  </div>
                </div>
                <div class="col-12">
                      <label for="modalEditImagemSala" class="form-label">Editar a imagem da Sala</label>
                      <div class="input-group">
                        <input type="file" class="form-control" id="modalEditImagemSala" accept="image/*">
                      </div>
                </div>
                <!-- Adicione dentro do <form id="editarSalaForm">, após os checkboxes de dias -->
                <div id="containerHorarioUteisEdit" class="row">
                  <div class="col-6">
                    <label for="modalHorarioInicioUteisEdit" class="form-label">Horário Início (Dias Úteis) *</label>
                    <input type="time" class="form-control horario-btn" id="modalHorarioInicioUteisEdit">
                  </div>
                  <div class="col-6">
                    <label for="modalHorarioFimUteisEdit" class="form-label">Horário Fim (Dias Úteis) *</label>
                    <input type="time" class="form-control horario-btn" id="modalHorarioFimUteisEdit">
                  </div>
                </div>

                <div id="containerHorarioNaoUteisEdit" class="row mt-3">
                  <div class="col-6">
                    <label for="modalHorarioInicioNaoUtilEdit" class="form-label">Horário Início (Finais de Semana/Feriados)*</label>
                    <input type="time" class="form-control horario-btn" id="modalHorarioInicioNaoUtilEdit">
                  </div>
                  <div class="col-6">
                    <label for="modalHorarioFimNaoUtilEdit" class="form-label">Horário Fim (Finais de Semana/Feriados)*</label>
                    <input type="time" class="form-control horario-btn" id="modalHorarioFimNaoUtilEdit">
                  </div>
                </div>
              </div>
            </form>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-danger me-auto" id="modalExcluirSala">Excluir Sala</button>
            <button type="button" class="btn btn-primary" id="modalSalvarSala">Salvar Alterações</button>
          </div>
        </div>
      </div>
    </div>
  `;

  // Adiciona a modal ao body
  document.body.insertAdjacentHTML('beforeend', modalHTML);

  // Carrega os dados da sala
  loadSalaData(salaId);

  // Configura os eventos
  setupEditSalaModal(salaId);


  // Inicializa a modal
  const modal = new bootstrap.Modal(document.getElementById('editSalaModal'));
  modal.show();
}

// Função para carregar os dados da sala
async function loadSalaData(salaId) {
  try {
    const response = await fetch(`http://127.0.0.1:8000/salas-recuperar/${salaId}`, {
      method: "GET",
      credentials: "include"
    });
    const sala = await response.json();

    if (!sala || response.status !== 200) {
      console.error("Erro: Sala não encontrada ou dados inválidos.");
      return;
    }

    // Preenche os campos do formulário com os dados da sala
    await preencherTiposSalaModal(sala.tipo_sala_id);
    document.getElementById("modalEditCapacidade").value = sala.capacidade || "";
    document.getElementById("modalEditTamanhoM2").value = sala.tamanho || "";
    document.getElementById("modalEditValorHora").value = sala.valor_hora || "";
    document.getElementById("modalEditRecursos").value = sala.recursos || "";
    document.getElementById("modalEditMobilario").value = sala.tipo_mobilia || "";
    document.getElementById('modalEditCep').value = formatarCEP(sala.cep || '');
    document.getElementById("modalEditRua").value = sala.rua || "";
    document.getElementById("modalEditNumero").value = sala.numero || "";
    document.getElementById("modalEditEstado").value = sala.estado || "";
    document.getElementById("modalEditComplemento").value = sala.complemento || "";
    document.getElementById("modalEditDescricao").value = sala.descricao || "";

    // Preenche o campo de cidade dinamicamente
    const selectCidade = document.getElementById("modalEditCidade");
    selectCidade.innerHTML = `<option value="${sala.cidade}" selected>${sala.cidade}</option>`;

    // Preenche os checkboxes
    document.getElementById("modalEditDomingo").checked = sala.disponibilidade.domingo;
    document.getElementById("modalEditSegunda").checked = sala.disponibilidade.segunda;
    document.getElementById("modalEditTerca").checked = sala.disponibilidade.terca;
    document.getElementById("modalEditQuarta").checked = sala.disponibilidade.quarta;
    document.getElementById("modalEditQuinta").checked = sala.disponibilidade.quinta;
    document.getElementById("modalEditSexta").checked = sala.disponibilidade.sexta;
    document.getElementById("modalEditSabado").checked = sala.disponibilidade.sabado;


    // Função auxiliar para converter "HH:MM:SS" para "HH:MM"
    function formatarHoraParaInput(hora) {
      if (!hora) return "";
      if (typeof hora === "string" && hora.includes(":")) {
        const [hh, mm] = hora.split(":");
        return `${hh.padStart(2, "0")}:${mm.padStart(2, "0")}`; // Garante que tenha 2 dígitos
      }
      return hora; // Retorna o valor original se não for uma string válida
    }

    // Preenche os campos de horário
    document.getElementById("modalHorarioInicioUteisEdit").value = formatarHoraParaInput(sala.HorarioInicio_DiasUteis);
    document.getElementById("modalHorarioFimUteisEdit").value = formatarHoraParaInput(sala.HorarioFim_DiasUteis);
    document.getElementById("modalHorarioInicioNaoUtilEdit").value = formatarHoraParaInput(sala.HorarioInicio_DiaNaoUtil);
    document.getElementById("modalHorarioFimNaoUtilEdit").value = formatarHoraParaInput(sala.HorarioFim_DiaNaoUtil);

    // Mostra/oculta campos de horário conforme os checkboxes
    function toggleHorariosEdicao() {
      const diasUteis = [
        document.getElementById("modalEditSegunda"),
        document.getElementById("modalEditTerca"),
        document.getElementById("modalEditQuarta"),
        document.getElementById("modalEditQuinta"),
        document.getElementById("modalEditSexta")
      ];
      const diasNaoUteis = [
        document.getElementById("modalEditSabado"),
        document.getElementById("modalEditDomingo")
      ];
      const algumUtil = diasUteis.some(cb => cb.checked);
      const algumNaoUtil = diasNaoUteis.some(cb => cb.checked);

      document.getElementById("containerHorarioUteisEdit").style.display = algumUtil ? "flex" : "none";
      document.getElementById("containerHorarioNaoUteisEdit").style.display = algumNaoUtil ? "flex" : "none";
    }

    // Adiciona o evento nos checkboxes
    ["modalEditSegunda", "modalEditTerca", "modalEditQuarta", "modalEditQuinta", "modalEditSexta", "modalEditSabado", "modalEditDomingo"].forEach(id => {
      document.getElementById(id).addEventListener("change", toggleHorariosEdicao);
    });

    // Chama uma vez para garantir o estado inicial
    toggleHorariosEdicao();


  } catch (error) {
    console.error("Erro ao buscar dados da sala:", error);
    Swal.fire({
      title: "Erro!",
      text: "Não foi possível carregar os dados da sala.",
      icon: "error",
      background: "#121212",
      color: "#ffffff"
    });
  }
}

// Função para configurar a modal de edição de sala
function setupEditSalaModal(salaId) {

  // Carrega os estados
  carregarEstados("modalEditEstado");

  // Configura o evento para carregar cidades ao selecionar um estado
  document.getElementById("modalEditEstado").addEventListener("change", () => {
    carregarCidades("modalEditEstado", "modalEditCidade");
  });

  // Configura máscara para o CEP
  document.getElementById("modalEditCep").addEventListener("input", function (e) {
    let cep = e.target.value.replace(/\D/g, '');
    if (cep.length <= 5) {
      e.target.value = cep.replace(/(\d{5})(\d{0,3})/, '$1-$2');
    } else {
      cep = cep.slice(0, 8);
      e.target.value = cep.replace(/(\d{5})(\d{3})/, '$1-$2');
    }
  });

  // Configura máscara para o campo "Número"
  document.getElementById("modalEditNumero").addEventListener("input", function (e) {
    let numero = e.target.value.replace(/\D/g, ''); // Remove tudo que não for número
    e.target.value = numero; // Atualiza o valor do campo
  });

  // Busca endereço pelo CEP
  document.getElementById('modalEditCep').addEventListener('blur', async function () {
    const cep = this.value.replace(/\D/g, '');
    if (cep.length !== 8) return;

    try {
      const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
      const data = await response.json();

      if (!data.erro) {
        document.getElementById('modalEditRua').value = data.logradouro || '';
        document.getElementById('modalEditCidade').innerHTML = `<option value="${data.localidade}" selected>${data.localidade}</option>`;
        document.getElementById('modalEditEstado').value = data.uf || '';
      } else {
        console.error("CEP não encontrado.");
      }
    } catch (error) {
      console.error("Erro ao buscar CEP:", error);
    }
  });

  // Evento para excluir sala
  document.getElementById("modalExcluirSala").addEventListener("click", function () {
    Swal.fire({
      title: "Tem certeza?",
      text: "Essa ação irá excluir a sala permanentemente.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sim, excluir",
      cancelButtonText: "Cancelar",
      background: "#121212",
      color: "#ffffff",
      confirmButtonColor: "#d33",
      cancelButtonColor: "#6c757d"
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await fetch(`http://127.0.0.1:8000/salas-excluir/${salaId}`, {
            method: "DELETE",
            credentials: "include"
          });

          const result = await response.json();

          if (response.ok) {
            Swal.fire({
              title: "Sala excluída!",
              text: result.message,
              icon: "success",
              background: "#121212",
              color: "#ffffff"
            }).then(() => {
              // Fecha a modal e recarrega a página
              bootstrap.Modal.getInstance(document.getElementById('editSalaModal')).hide();
              window.location.reload();
            });
          } else {
            throw new Error(result.detail || "Erro ao excluir sala");
          }
        } catch (error) {
          Swal.fire({
            title: "Erro!",
            text: error.message,
            icon: "error",
            background: "#121212",
            color: "#ffffff"
          });
        }
      }
    });
  });

  // Evento para salvar alterações
  document.getElementById("modalSalvarSala").addEventListener("click", async function () {

    // Captura os valores dos horários
    const horarioInicioUteis = document.getElementById("modalHorarioInicioUteisEdit").value || null;
    const horarioFimUteis = document.getElementById("modalHorarioFimUteisEdit").value || null;
    const horarioInicioNaoUteis = document.getElementById("modalHorarioInicioNaoUtilEdit").value || null;
    const horarioFimNaoUteis = document.getElementById("modalHorarioFimNaoUtilEdit").value || null;

    // Captura os valores de disponibilidade
    const domingo = document.getElementById("modalEditDomingo").checked ? 1 : 0;
    const segunda = document.getElementById("modalEditSegunda").checked ? 1 : 0;
    const terca = document.getElementById("modalEditTerca").checked ? 1 : 0;
    const quarta = document.getElementById("modalEditQuarta").checked ? 1 : 0;
    const quinta = document.getElementById("modalEditQuinta").checked ? 1 : 0;
    const sexta = document.getElementById("modalEditSexta").checked ? 1 : 0;
    const sabado = document.getElementById("modalEditSabado").checked ? 1 : 0;

    // Ajusta os horários para NULL se o dia correspondente não estiver selecionado
    const horarioInicioDiasUteisFinal = (segunda || terca || quarta || quinta || sexta) ? horarioInicioUteis : null;
    const horarioFimDiasUteisFinal = (segunda || terca || quarta || quinta || sexta) ? horarioFimUteis : null;
    const horarioInicioNaoUteisFinal = (sabado || domingo) ? horarioInicioNaoUteis : null;
    const horarioFimNaoUteisFinal = (sabado || domingo) ? horarioFimNaoUteis : null;


    const cep = document.getElementById("modalEditCep").value.replace(/\D/g, '');
    const cidade = document.getElementById("modalEditCidade").value;
    const estado = document.getElementById("modalEditEstado").value;

    // Captura os valores dos campos
    const tipoSalaId = document.getElementById("modalEditTipoSala").value; // Certifique-se de capturar o valor aqui
    const capacidade = document.getElementById("modalEditCapacidade").value;
    const tamanhoM2 = document.getElementById("modalEditTamanhoM2").value;
    const valorHora = document.getElementById("modalEditValorHora").value;
    const recursos = document.getElementById("modalEditRecursos").value;
    const tipoMobilia = document.getElementById("modalEditMobilario").value;
    const rua = document.getElementById("modalEditRua").value;
    const numero = document.getElementById("modalEditNumero").value;
    const complemento = document.getElementById("modalEditComplemento").value;
    const descricao = document.getElementById("modalEditDescricao").value;

    const cepValido = await validarCepCidadeEstado(cep, cidade, estado);

    if (!tipoSalaId || !capacidade || !tamanhoM2 || !valorHora || !recursos || !tipoMobilia || !cep || !rua || !cidade || !estado || !numero || !descricao) {
      Swal.fire({
        title: "Erro!",
        text: "Preencha todos os campos obrigatórios.",
        icon: "error",
        background: "#121212",
        color: "#ffffff"
      });
      return;
    }
    if (recursos.length < 10 || tipoMobilia.length < 10 || rua.length < 10 || descricao.length < 10) {
      Swal.fire({
        title: "Erro!",
        text: "Os campos de texto devem ter no mínimo 10 caracteres.",
        icon: "error",
        background: "#121212",
        color: "#ffffff"
      });
      return;
    }

    if (capacidade < 1) {
      Swal.fire({
        title: "Erro!",
        text: "O valor de capacidade deve ser maior ou igual a 1.",
        icon: "error",
        background: "#121212",
        color: "#ffffff"
      });
      return;
    }

    if (capacidade <= 0 || numero <= 0 || capacidade.includes(",")) {
      Swal.fire({
        title: "Erro!",
        text: "Os campos numéricos devem ser positivos e não podem conter vírgulas.",
        icon: "error",
        background: "#121212",
        color: "#ffffff"
      });
      return;
    }

    if (tamanhoM2 < 0.1) {
      Swal.fire({
        title: "Erro!",
        text: "O tamanho deve ser maior ou igual a 0.1 m².",
        icon: "error",
        background: "#121212",
        color: "#ffffff"
      });
      return;
    }

    // Validação do campo "Valor Hora"
    if (!valorHora || isNaN(valorHora.replace(",", ".")) || parseFloat(valorHora.replace(",", ".")) < 0.1) {
      Swal.fire({
        title: "Erro!",
        text: "O campo 'Valor Hora' deve ser um número válido (mínimo 0,1).",
        icon: "error",
        background: "#121212",
        color: "#ffffff"
      });
      return;
    }

    if (descricao.length > 200) {
      Swal.fire({
        title: "Erro!",
        text: "A descrição deve ter no máximo 200 caracteres.",
        icon: "error",
        background: "#121212",
        color: "#ffffff"
      });
      return;
    }


    if (!(domingo || segunda || terca || quarta || quinta || sexta || sabado)) {
      Swal.fire({
        title: "Erro!",
        text: "Selecione pelo menos um dia da semana.",
        icon: "error",
        background: "#121212",
        color: "#ffffff"
      });
      return;
    }
    if (!cepValido) {
      Swal.fire({
        title: "Erro!",
        text: "O CEP não corresponde à cidade e ao estado selecionados.",
        icon: "error",
        background: "#121212",
        color: "#fff"
      });
      return; // Impede o envio do formulário
    }

    // Validação de intervalo de horários
    if (horarioInicioUteis && horarioFimUteis) {
      const diffUteis = calcularDiferencaHoras(horarioInicioUteis, horarioFimUteis);
      if (diffUteis < 1) {
        Swal.fire({
          title: "Erro!",
          text: "O intervalo entre os horários de dias úteis deve ser maior que 1 hora.",
          icon: "error",
          background: "#121212",
          color: "#fff"
        });
        return;
      }
    }

    if (horarioInicioNaoUteis && horarioFimNaoUteis) {
      const diffNaoUteis = calcularDiferencaHoras(horarioInicioNaoUteis, horarioFimNaoUteis);
      if (diffNaoUteis < 1) {
        Swal.fire({
          title: "Erro!",
          text: "O intervalo entre os horários de finais de semana/feriados deve ser maior que 1 hora.",
          icon: "error",
          background: "#121212",
          color: "#fff"
        });
        return;
      }
    }
    console.log("Salvando alterações...");

    const formData = new FormData();
    formData.append("capacidade", document.getElementById("modalEditCapacidade").value);
    formData.append("tamanho", document.getElementById("modalEditTamanhoM2").value);
    formData.append("valor_hora", document.getElementById("modalEditValorHora").value);
    formData.append("recursos", document.getElementById("modalEditRecursos").value);
    formData.append("tipo_mobilia", document.getElementById("modalEditMobilario").value);
    formData.append("cep", document.getElementById("modalEditCep").value.replace(/\D/g, ''));
    formData.append("rua", document.getElementById("modalEditRua").value);
    formData.append("numero", document.getElementById("modalEditNumero").value);
    formData.append("cidade", document.getElementById("modalEditCidade").value);
    formData.append("estado", document.getElementById("modalEditEstado").value);
    formData.append("complemento", document.getElementById("modalEditComplemento").value);
    formData.append("descricao", document.getElementById("modalEditDescricao").value);
    formData.append("fk_tipo_sala_id", document.getElementById("modalEditTipoSala").value);
    formData.append("domingo", domingo);
    formData.append("segunda", segunda);
    formData.append("terca", terca);
    formData.append("quarta", quarta);
    formData.append("quinta", quinta);
    formData.append("sexta", sexta);
    formData.append("sabado", sabado);
    formData.append("status", 1);

    if (horarioInicioDiasUteisFinal !== null) {
      formData.append("HorarioInicio_DiasUteis", horarioInicioDiasUteisFinal);
    }
    if (horarioFimDiasUteisFinal !== null) {
      formData.append("HorarioFim_DiasUteis", horarioFimDiasUteisFinal);
    }
    if (horarioInicioNaoUteisFinal !== null) {
      formData.append("HorarioInicio_DiaNaoUtil", horarioInicioNaoUteisFinal);
    }
    if (horarioFimNaoUteisFinal !== null) {
      formData.append("HorarioFim_DiaNaoUtil", horarioFimNaoUteisFinal);
    }


    // Adiciona a imagem, se houver
    const imagemInput = document.getElementById("modalEditImagemSala");
    if (imagemInput.files.length > 0) {
      formData.append("imagem", imagemInput.files[0]);
    }

    try {
      const response = await fetch(`http://127.0.0.1:8000/salas-atualizar/${salaId}`, {
        method: "PUT",
        body: formData,
        credentials: "include"
      });
      const result = await response.json();

      if (response.ok) {
        Swal.fire({
          title: "Sucesso!",
          text: result.message,
          icon: "success",
          background: "#121212",
          color: "#ffffff"
        }).then(() => {
          bootstrap.Modal.getInstance(document.getElementById('editSalaModal')).hide();
          if (typeof carregarTodasSalas === "function") {
            carregarTodasSalas(); // Atualiza os cards sem recarregar a página
          } else {
            window.location.reload(); // Fallback se a função não existir
          }
        });
      } else {
        throw new Error(result.detail || "Erro ao salvar alterações");
      }

    } catch (error) {
      Swal.fire({
        title: "Erro!",
        text: error.message,
        icon: "error",
        background: "#121212",
        color: "#ffffff"
      });
    }
  });

  validarIntervaloAoVivo("modalHorarioInicioUteisEdit", "modalHorarioFimUteisEdit");
  validarIntervaloAoVivo("modalHorarioInicioNaoUtilEdit", "modalHorarioFimNaoUtilEdit");

}


// Função para preencher os tipos de sala na modal
async function preencherTiposSalaModal(tipoSalaSelecionado) {
  try {
    const response = await fetch("http://127.0.0.1:8000/tipos-sala-recuperar", {
      method: "GET",
      credentials: "include"
    });

    if (!response.ok) {
      throw new Error("Erro ao buscar tipos de sala");
    }

    const tiposSala = await response.json();
    const dropdown = document.getElementById("modalEditTipoSala");
    dropdown.innerHTML = "";

    tiposSala.forEach(tipo => {
      const option = document.createElement("option");
      option.value = tipo.ID_Tipo_Sala;
      option.textContent = tipo.Tipo;
      dropdown.appendChild(option);
    });

    // Seleciona o tipo de sala correspondente
    if (tipoSalaSelecionado) {
      dropdown.value = tipoSalaSelecionado;
    }
  } catch (error) {
    console.error("Erro ao buscar tipos de sala:", error);
    Swal.fire({
      title: "Erro!",
      text: "Não foi possível carregar os tipos de sala.",
      icon: "error",
      background: "#121212",
      color: "#ffffff"
    });
  }
}

// *** MODAL DE TIPOS DE SALA ***
function showTiposSalaModal() {
  if (document.getElementById('tiposSalaModal')) {
    document.getElementById('tiposSalaModal').remove();
  }

  // Cria a estrutura da modal
  const modalHTML = `
    <div class="modal fade" id="tiposSalaModal" tabindex="-1" aria-labelledby="tiposSalaModalLabel" aria-hidden="true" data-bs-backdrop="static">
      <div class="modal-dialog modal-lg modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="tiposSalaModalLabel">Gerenciar Tipos de Sala</h5>
            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <div class="d-flex justify-content-between mb-3">
              <div class="input-group" style="width: 100%;">
                <input type="text" class="form-control" id="searchTipoSala" placeholder="Pesquisar tipo...">
                <button class="btn btn-outline-secondary" type="button">
                  <i class="bi bi-search"></i>
                </button>
              </div>
            </div>
            
            <div class="table-responsive">
              <table class="table table-dark table-hover">
                <thead>
                  <tr>
                    <th>Tipo</th>
                    <th class="text-end">Ações</th>
                  </tr>
                </thead>
                <tbody id="tiposSalaTableBody">
                  <!-- Tipos serão carregados dinamicamente -->
                </tbody>
              </table>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-primary" id="btnAdicionarTipo">
                <i class="bi bi-plus-circle"></i> Adicionar Tipo
            </button>
            <button type="button" class="btn btn-secondary ms-auto" data-bs-dismiss="modal">Fechar</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal para adicionar/editar tipo -->
    <div class="modal fade" id="editarTipoSalaModal" tabindex="-1" aria-hidden="true" data-bs-backdrop="static">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="editarTipoSalaModalLabel">Adicionar Tipo</h5>
            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <form id="formTipoSala">
              <input type="hidden" id="tipoSalaId">
              <div class="mb-3">
                <label for="tipoSalaNome" class="form-label">Nome do Tipo *</label>
                <input type="text" class="form-control" id="tipoSalaNome" required>
              </div>
            </form>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
            <button type="button" class="btn btn-primary" id="btnSalvarTipo">Salvar</button>
          </div>
        </div>
      </div>
    </div>
  `;

  // Adiciona a modal ao body
  document.body.insertAdjacentHTML('beforeend', modalHTML);

  // Carrega os tipos de sala
  carregarTiposSala();

  // Configura os eventos
  setupTiposSalaModal();

  // Inicializa a modal
  const modal = new bootstrap.Modal(document.getElementById('tiposSalaModal'));
  modal.show();
}

async function carregarTiposSala() {
  try {
    const response = await fetch("http://127.0.0.1:8000/tipos-sala-recuperar", {
      method: "GET",
      credentials: "include"
    });
    const tipos = await response.json();

    const tableBody = document.getElementById("tiposSalaTableBody");
    tableBody.innerHTML = "";

    if (tipos.length === 0) {
      tableBody.innerHTML = `
        <tr>
          <td colspan="2" class="text-center">Nenhum tipo de sala cadastrado</td>
        </tr>
      `;
      return;
    }

    tipos.forEach(tipo => {
      const row = document.createElement("tr");
      row.innerHTML = `
          <td>${tipo.Tipo}</td>
          <td class="text-end">
              <button class="btn btn-sm btn-editar me-2" data-id="${tipo.ID_Tipo_Sala}">
                  <i class="bi bi-pencil"></i> Editar
              </button>
              <button class="btn btn-sm btn-excluir" data-id="${tipo.ID_Tipo_Sala}">
                  <i class="bi bi-trash"></i> Excluir
              </button>
          </td>
        `;
      tableBody.appendChild(row);
    });
  } catch (error) {
    console.error("Erro ao carregar tipos de sala:", error);
    Swal.fire({
      title: "Erro!",
      text: "Não foi possível carregar os tipos de sala.",
      icon: "error",
      background: "#121212",
      color: "#ffffff"
    });
  }
}

function setupTiposSalaModal() {
  // Evento para adicionar novo tipo
  document.getElementById("btnAdicionarTipo").addEventListener("click", function () {
    document.getElementById("tipoSalaId").value = "";
    document.getElementById("tipoSalaNome").value = "";
    document.getElementById("editarTipoSalaModalLabel").textContent = "Adicionar Tipo";

    const modal = new bootstrap.Modal(document.getElementById('editarTipoSalaModal'));
    modal.show();
  });

  // Evento para editar tipo (delegação de eventos)
  document.getElementById("tiposSalaTableBody").addEventListener("click", function (e) {
    if (e.target.closest(".btn-editar")) {
      const btnEditar = e.target.closest(".btn-editar");
      const id = btnEditar.getAttribute("data-id");
      const row = btnEditar.closest("tr");

      // Corrigido: Pegar o texto do PRIMEIRO <td> (índice 1)
      const nome = row.querySelector("td:first-child").textContent.trim();

      document.getElementById("tipoSalaId").value = id;
      document.getElementById("tipoSalaNome").value = nome;
      document.getElementById("editarTipoSalaModalLabel").textContent = "Editar Tipo";

      const modal = new bootstrap.Modal(document.getElementById('editarTipoSalaModal'));
      modal.show();
    }

    if (e.target.closest(".btn-excluir")) {
      const id = e.target.closest(".btn-excluir").getAttribute("data-id");
      confirmarExclusaoTipo(id);
    }
  });

  // Evento para salvar tipo
  document.getElementById("btnSalvarTipo").addEventListener("click", async function () {
    const id = document.getElementById("tipoSalaId").value;
    const nome = document.getElementById("tipoSalaNome").value;

    if (!nome) {
      Swal.fire({
        title: "Atenção!",
        text: "Preencha o nome do tipo.",
        icon: "info",
        background: "#121212",
        color: "#ffffff"
      });
      return;
    }

    if (!nome || nome.length < 3) {
      Swal.fire({
        title: "Atenção!",
        text: "O nome do tipo deve ter no mínimo 3 caracteres.",
        icon: "info",
        background: "#121212",
        color: "#ffffff"
      });
      return;
    }

    try {
      let response;
      if (id) {
        // Edição
        response = await fetch(`http://127.0.0.1:8000/tipos-sala-atualizar/${id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ tipo: nome })
        });
      } else {
        // Criação
        response = await fetch("http://127.0.0.1:8000/tipos-sala-criar", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ tipo: nome })
        });
      }

      const result = await response.json();

      if (response.ok) {
        if (result.success === false) {
          // Caso o nome não tenha sido alterado
          Swal.fire({
            title: "Aviso",
            text: result.message,
            icon: "info",
            background: "#121212",
            color: "#ffffff"
          });
        } else {
          // Caso tenha sido atualizado com sucesso
          Swal.fire({
            title: "Sucesso!",
            text: result.message,
            icon: "success",
            background: "#121212",
            color: "#ffffff"
          }).then(() => {
            bootstrap.Modal.getInstance(document.getElementById('editarTipoSalaModal')).hide();
            carregarTiposSala();
          });
        }
      } else {
        throw new Error(result.detail || "Erro ao salvar tipo");
      }
    } catch (error) {
      Swal.fire({
        title: "Erro!",
        text: error.message,
        icon: "error",
        background: "#121212",
        color: "#ffffff"
      });
    }
  });

  // Pesquisa
  document.getElementById("searchTipoSala").addEventListener("input", function (e) {
    const termo = e.target.value.toLowerCase();
    const linhas = document.querySelectorAll("#tiposSalaTableBody tr");

    linhas.forEach(linha => {
      const texto = linha.textContent.toLowerCase();
      linha.style.display = texto.includes(termo) ? "" : "none";
    });
  });
}

async function confirmarExclusaoTipo(id) {
  Swal.fire({
    title: "Tem certeza?",
    text: "Esta ação não pode ser desfeita!",
    icon: "info",
    showCancelButton: true,
    confirmButtonText: "Sim, excluir!",
    cancelButtonText: "Cancelar",
    background: "#121212",
    color: "#ffffff",
    confirmButtonColor: "#d33",
    cancelButtonColor: "#6c757d"
  }).then(async (result) => {
    if (result.isConfirmed) {
      try {
        const response = await fetch(`http://127.0.0.1:8000/tipos-sala-excluir/${id}`, {
          method: "DELETE",
          credentials: "include"
        });

        const result = await response.json();

        if (response.ok) {
          Swal.fire({
            title: "Excluído!",
            text: result.message,
            icon: "success",
            background: "#121212",
            color: "#ffffff"
          });
          carregarTiposSala();
        } else {
          throw new Error(result.detail || "Erro ao excluir tipo");
        }
      } catch (error) {
        Swal.fire({
          title: "Erro!",
          text: error.message,
          icon: "error",
          background: "#121212",
          color: "#ffffff"
        });
      }
    }
  });
}

// Funções de máscara
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

function formatarCEP(cep) {
  cep = cep.replace(/\D/g, '');
  return cep.replace(/(\d{5})(\d{3})/, '$1-$2');
}

async function obterIdUsuarioLogado() {
  const usuario = JSON.parse(sessionStorage.getItem('usuario')); // ou sessionStorage
  if (usuario && usuario.id) {
    return usuario.id;
  }
  throw new Error("Usuário não está logado ou ID não encontrado.");
}

function calcularDiferencaHoras(horarioInicio, horarioFim) {
  const [horaInicio, minutoInicio] = horarioInicio.split(":").map(Number);
  const [horaFim, minutoFim] = horarioFim.split(":").map(Number);

  const inicio = horaInicio * 60 + minutoInicio;
  const fim = horaFim * 60 + minutoFim;

  // Verifica se o horário de término é menor que o horário de início (não permitido)
  if (fim <= inicio) {
    return -1; // Retorna um valor negativo para indicar erro
  }

  return (fim - inicio) / 60; // Retorna a diferença em horas
}

function validarIntervaloAoVivo(horarioInicioId, horarioFimId) {
  const horarioInicio = document.getElementById(horarioInicioId);
  const horarioFim = document.getElementById(horarioFimId);

  function verificarIntervalo() {
    const inicio = horarioInicio.value;
    const fim = horarioFim.value;

    if (inicio && fim) {
      const diff = calcularDiferencaHoras(inicio, fim);
      if (diff < 1) {
        horarioInicio.classList.add("is-invalid");
        horarioFim.classList.add("is-invalid");
      } else {
        horarioInicio.classList.remove("is-invalid");
        horarioFim.classList.remove("is-invalid");
      }
    } else {
      // Remove a borda vermelha se os campos estiverem vazios
      horarioInicio.classList.remove("is-invalid");
      horarioFim.classList.remove("is-invalid");
    }
  }

  horarioInicio.addEventListener("input", verificarIntervalo);
  horarioFim.addEventListener("input", verificarIntervalo);
}

function showMinhasReservasModal() {
  if (document.getElementById('minhasReservasModal')) {
    document.getElementById('minhasReservasModal').remove();
  }

  const modalHTML = `
    <div class="modal fade" id="minhasReservasModal" tabindex="-1" aria-labelledby="minhasReservasModalLabel" aria-hidden="true">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="minhasReservasModalLabel">Minhas Reservas</h5>
            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <div id="reservasContainer" class="row g-3">
              <!-- Reservas serão carregadas dinamicamente -->
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Fechar</button>
          </div>
        </div>
      </div>
    </div>
  `;

  document.body.insertAdjacentHTML('beforeend', modalHTML);

  // Carrega as reservas do usuário
  carregarReservasUsuario();

  // Inicializa o modal
  const modal = new bootstrap.Modal(document.getElementById('minhasReservasModal'));
  modal.show();
}

async function carregarReservasUsuario() {
  try {
    const response = await fetch('http://127.0.0.1:8000/minhas-reservas', {
      method: 'GET',
      credentials: 'include',
    });

    const reservas = await response.json();
    console.log('Reservas recebidas:', reservas); // Adicione este log para depuração

    const container = document.getElementById('reservasContainer');
    container.innerHTML = '';

    if (reservas.length === 0) {
      container.innerHTML = '<p class="text-center text-muted">Nenhuma reserva encontrada.</p>';
      return;
    }

    reservas.forEach(reserva => {
      const reservaCard = `
        <div class="col-md-6">
          <div class="data-horario-bloco">
            <img src="${reserva.imagem_url}" class="card-img-top" alt="Imagem da Sala">
            <div class="card-body">
              <h5 class="card-title">${reserva.nome_sala}</h5>
              <p class="card-text">
                <strong>Data:</strong> ${reserva.data_reserva}<br>
                <strong>Horário:</strong> ${reserva.horario_inicio} - ${reserva.horario_fim}<br>
                <strong>Endereço:</strong> ${reserva.endereco}
              </p>
              <a href="detalhesReserva.html?id=${reserva.id_reserva}" class="btn btn-primary">Mais detalhes</a>
            </div>
          </div>
        </div>
      `;
      container.insertAdjacentHTML('beforeend', reservaCard);
    });
  } catch (error) {
    console.error('Erro ao carregar reservas:', error);
    const container = document.getElementById('reservasContainer');
    container.innerHTML = '<p class="text-center text-danger">Erro ao carregar reservas.</p>';
  }
}

// Função para carregar estados
async function carregarEstados(selectId) {
  try {
    const response = await fetch("https://servicodados.ibge.gov.br/api/v1/localidades/estados");
    const estados = await response.json();

    const selectEstado = document.getElementById(selectId);
    selectEstado.innerHTML = '<option value="" disabled selected>Selecione um estado</option>';

    estados.forEach(estado => {
      const option = document.createElement("option");
      option.value = estado.sigla;
      option.textContent = estado.nome;
      selectEstado.appendChild(option);
    });
  } catch (error) {
    Swal.fire({
      title: "Erro!",
      text: "Não foi possível carregar os estados.",
      icon: "error",
      background: "#121212",
      color: "#ffffff"
    });
  }
}

// Função para carregar cidades
async function carregarCidades(selectEstadoId, selectCidadeId) {
  const estadoSigla = document.getElementById(selectEstadoId).value;
  if (!estadoSigla) return;

  try {
    const response = await fetch(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${estadoSigla}/municipios`);
    const cidades = await response.json();

    const selectCidade = document.getElementById(selectCidadeId);
    selectCidade.innerHTML = '<option value="" disabled selected>Selecione uma cidade</option>';

    cidades.forEach(cidade => {
      const option = document.createElement("option");
      option.value = cidade.nome;
      option.textContent = cidade.nome;
      selectCidade.appendChild(option);
    });
  } catch (error) {
    Swal.fire({
      title: "Erro!",
      text: "Não foi possível carregar as cidades.",
      icon: "error",
      background: "#121212",
      color: "#ffffff"
    });
  }
}

function validarCepCidadeEstado(cep, cidade, estado) {
  return fetch(`https://viacep.com.br/ws/${cep}/json/`)
    .then(response => response.json())
    .then(data => {
      if (data.erro) {
        return false; // CEP inválido
      }
      return data.localidade === cidade && data.uf === estado; // Verifica cidade e estado
    })
    .catch(() => false); // Retorna falso em caso de erro
}