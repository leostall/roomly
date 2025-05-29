async function showReservaModal(salaId) {
    try {
        // Verifica se o usuário está logado
        const response = await fetch('http://127.0.0.1:8000/usuario-logado', {
            credentials: 'include'
        });
        const data = await response.json();

        if (!data.logado) {
            // Redireciona para a página de login se o usuário não estiver logado
            await Swal.fire({
                icon: 'warning',
                title: 'Login necessário',
                text: 'Você precisa estar logado para reservar uma sala.',
                confirmButtonText: 'Fazer login',
                background: '#121212',
                color: '#fff',
                allowOutsideClick: false,
                backdrop: true
            });
            window.location.href = 'login.html';
            return;
        } } catch (error) {
        console.error('Erro ao verificar login:', error);
        Swal.fire({
            icon: 'error',
            title: 'Erro',
            text: 'Ocorreu um erro ao verificar o login. Tente novamente mais tarde.',
            confirmButtonText: 'OK',
            background: '#121212',
            color: '#fff',
            allowOutsideClick: false,
            backdrop: true
        });
        return;
    }

    const modalId = 'reservaSalaModal';
    // Remove o modal existente se já estiver presente para evitar duplicatas
    if (document.getElementById(modalId)) {
        document.getElementById(modalId).remove();
    }

    const modalHTML = `
        <div class="modal fade" id="${modalId}" tabindex="-1" aria-labelledby="${modalId}Label" aria-hidden="true">
            <div class="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
                <div class="modal-content modal-visualizar-reserva-content">
                    <div class="modal-body p-0">

                        <div class="visualizar-reserva-header">
                            <img id="reservaSalaImagem"
                                 class="visualizar-reserva-imagem-sala"
                                 alt="Imagem da Sala">
                            <div class="visualizar-reserva-header-overlay">
                                <h4 class="visualizar-reserva-nome-sala" id="reservaSalaTipo"></h4>
                            </div>
                        </div>

                        <div class="visualizar-reserva-detalhes-container">
                            <h5 class="visualizar-reserva-secao-titulo">
                                <i class="bi bi-building me-2"></i>Detalhes da Sala
                            </h5>
                            <table class="table table-sm table-visualizar-reserva">
                                <tbody>
                                    <tr><td><strong>Endereço:</strong></td><td id="reservaSalaEndereco">N/D</td></tr>
                                    <tr><td><strong>Capacidade:</strong></td><td id="reservaSalaCapacidade">N/A pessoas</td></tr>
                                    <tr><td><strong>Descrição:</strong></td><td class="text-wrap" id="reservaSalaDescricao">Nenhuma descrição.</td></tr>
                                    <tr><td><strong>Tamanho (m²):</strong></td><td id="reservaSalaTamanho">Carregando...</td></tr>
                                    <tr><td><strong>Recursos:</strong></td><td id="reservaSalaRecursos">Carregando...</td></tr>
                                    <tr><td><strong>Mobiliário:</strong></td><td id="reservaSalaMobiliario">Carregando...</td></tr>
                                    <tr><td><strong>Valor/Hora:</strong></td><td id="reservaSalaValorHora">Carregando...</td></tr>
                                    <tr><td><strong>Disponibilidade:</strong></td><td id="reservaSalaDisponibilidade">Carregando...</td></tr>
                                    <tr><td><strong>Horários de Dias Úteis:</strong></td><td id="reservaSalaHorarioUteis">Carregando...</td></tr>
                                    <tr><td><strong>Horários de Finais de Semana:</strong></td><td id="reservaSalaHorarioNaoUteis">Carregando...</td></tr>
                                </tbody>
                            </table>

                            <h5 class="visualizar-reserva-secao-titulo mt-4">
                                <i class="bi bi-calendar-event me-2"></i>Informações da Reserva
                            </h5>
                            <form id="formReserva" class="row g-3">
                                <div class="col-md-6">
                                    <label for="data" class="form-label">Data</label>
                                    <input type="date" class="form-control" id="data" required>
                                </div>
                                <div class="col-md-6">
                                    <label for="horarioEntrada" class="form-label">Horário de Entrada</label>
                                    <input type="time" class="form-control" id="horarioEntrada" required>
                                </div>
                                <div class="col-md-6">
                                    <label for="horarioSaida" class="form-label">Horário de Saída</label>
                                    <input type="time" class="form-control" id="horarioSaida" required>
                                </div>
                                <div class="col-12 text-center mt-4">
                                    <button type="submit" class="btn btn-primary">Confirmar Reserva</button>
                                </div>
                            </form>
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

    // Obtém os elementos do modal recém-criado
    const dataInput = document.getElementById('data');
    const horarioEntradaInput = document.getElementById('horarioEntrada');
    const formReserva = document.getElementById('formReserva');

    // Obtém elementos específicos para os detalhes da sala
    const reservaSalaImagem = document.getElementById('reservaSalaImagem');
    const reservaSalaTipo = document.getElementById('reservaSalaTipo');
    const reservaSalaEndereco = document.getElementById('reservaSalaEndereco');
    const reservaSalaCapacidade = document.getElementById('reservaSalaCapacidade');
    const reservaSalaDescricao = document.getElementById('reservaSalaDescricao');
    const reservaSalaTamanho = document.getElementById('reservaSalaTamanho');
    const reservaSalaRecursos = document.getElementById('reservaSalaRecursos');
    const reservaSalaMobiliario = document.getElementById('reservaSalaMobiliario');
    const reservaSalaValorHora = document.getElementById('reservaSalaValorHora');
    const reservaSalaDisponibilidade = document.getElementById('reservaSalaDisponibilidade');
    const reservaSalaHorarioUteis = document.getElementById('reservaSalaHorarioUteis');
    const reservaSalaHorarioNaoUteis = document.getElementById('reservaSalaHorarioNaoUteis');


    // Define as datas mínima/máxima para o campo de data
    const hoje = new Date();
    const umAnoDepois = new Date();
    umAnoDepois.setFullYear(hoje.getFullYear() + 1);
    dataInput.min = hoje.toISOString().split("T")[0];
    dataInput.max = umAnoDepois.toISOString().split("T")[0];

    // Função para formatar a hora, idêntica ao reserva.html
    function formatarHora(hora) {
        if (!hora || hora === "null") return "Não disponível";
        const partes = hora.split(":");
        const horas = partes[0].padStart(2, "0");
        const minutos = partes[1].padStart(2, "0");
        return `${horas}:${minutos}`;
    }

    // Carrega os detalhes da sala no modal, adaptado de carregarSala()
    async function carregarSalaNoModal() {
        if (!salaId) {
            Swal.fire({
                title: "Erro",
                text: "ID da Sala não fornecido.",
                icon: "error",
                background: "#121212",
                color: "#ffffff"
            });
            reservaSalaImagem.src = 'images/placeholder.jpg';
            reservaSalaTipo.textContent = 'Sala Indisponível';
            reservaSalaEndereco.textContent = 'N/D';
            reservaSalaCapacidade.textContent = 'N/A pessoas';
            reservaSalaDescricao.textContent = 'ID da Sala não fornecido.';
            reservaSalaTamanho.textContent = 'N/D';
            reservaSalaRecursos.textContent = 'N/D';
            reservaSalaMobiliario.textContent = 'N/D';
            reservaSalaValorHora.textContent = 'N/D';
            reservaSalaDisponibilidade.textContent = 'N/D';
            reservaSalaHorarioUteis.textContent = 'N/D';
            reservaSalaHorarioNaoUteis.textContent = 'N/D';
            return;
        }
        try {
            const resp = await fetch(`http://127.0.0.1:8000/salas-recuperar/${salaId}`, { credentials: "include" });
            const sala = await resp.json();
            if (!sala || sala.detail) {
                Swal.fire({
                    title: "Erro",
                    text: "Sala não encontrada.",
                    icon: "error",
                    background: "#121212",
                    color: "#ffffff"
                });
                reservaSalaImagem.src = 'images/placeholder.jpg';
                reservaSalaTipo.textContent = 'Sala Não Encontrada';
                reservaSalaEndereco.textContent = 'N/D';
                reservaSalaCapacidade.textContent = 'N/A pessoas';
                reservaSalaDescricao.textContent = 'Sala não encontrada.';
                reservaSalaTamanho.textContent = 'N/D';
                reservaSalaRecursos.textContent = 'N/D';
                reservaSalaMobiliario.textContent = 'N/D';
                reservaSalaValorHora.textContent = 'N/D';
                reservaSalaDisponibilidade.textContent = 'N/D';
                reservaSalaHorarioUteis.textContent = 'N/D';
                reservaSalaHorarioNaoUteis.textContent = 'N/D';
                return;
            }

            reservaSalaImagem.src = sala.imagem_url || 'images/placeholder.jpg';
            reservaSalaImagem.alt = `Imagem da Sala: ${sala.descricao || 'Sala'}`;
            reservaSalaTipo.textContent = sala.tipo || 'Tipo da Sala Indisponível';
            reservaSalaEndereco.textContent = `${sala.rua || 'N/D'}, ${sala.numero || 'N/D'} - ${sala.cidade || 'N/D'}/${sala.estado || 'N/D'}`;
            reservaSalaCapacidade.textContent = `${sala.capacidade || 'N/A'} pessoas`;
            reservaSalaDescricao.textContent = sala.descricao || 'Nenhuma descrição.';
            reservaSalaTamanho.textContent = sala.tamanho ? `${sala.tamanho} m²` : 'N/D';
            reservaSalaRecursos.textContent = sala.recursos || 'N/D';
            reservaSalaMobiliario.textContent = sala.tipo_mobilia || 'N/D';
            reservaSalaValorHora.textContent = `R$ ${parseFloat(String(sala.valor_hora).replace(',', '.')).toFixed(2).replace('.', ',')}`;
            reservaSalaDisponibilidade.textContent = Object.entries(sala.disponibilidade)
                .filter(([dia, disp]) => disp)
                .map(([dia]) => dia.charAt(0).toUpperCase() + dia.slice(1))
                .join(', ') || 'Nenhum dia disponível';
            reservaSalaHorarioUteis.textContent = sala.HorarioInicio_DiasUteis && sala.HorarioFim_DiasUteis
                ? `${formatarHora(sala.HorarioInicio_DiasUteis)} - ${formatarHora(sala.HorarioFim_DiasUteis)}`
                : 'Não disponível';
            reservaSalaHorarioNaoUteis.textContent = sala.HorarioInicio_DiaNaoUtil && sala.HorarioFim_DiaNaoUtil
                ? `${formatarHora(sala.HorarioInicio_DiaNaoUtil)} - ${formatarHora(sala.HorarioFim_DiaNaoUtil)}`
                : 'Não disponível';

        } catch (error) {
            console.error("Erro ao carregar detalhes da sala:", error);
            Swal.fire({
                title: "Erro",
                text: "Erro ao carregar detalhes da sala.",
                icon: "error",
                background: "#121212",
                color: "#ffffff"
            });
            reservaSalaImagem.src = 'images/placeholder.jpg';
            reservaSalaTipo.textContent = 'Erro ao Carregar';
            reservaSalaEndereco.textContent = 'Erro ao carregar';
            reservaSalaCapacidade.textContent = 'Erro ao carregar';
            reservaSalaDescricao.textContent = 'Erro ao carregar detalhes da sala.';
            reservaSalaTamanho.textContent = 'Erro ao carregar';
            reservaSalaRecursos.textContent = 'Erro ao carregar';
            reservaSalaMobiliario.textContent = 'Erro ao carregar';
            reservaSalaValorHora.textContent = 'Erro ao carregar';
            reservaSalaDisponibilidade.textContent = 'Erro ao carregar';
            reservaSalaHorarioUteis.textContent = 'Erro ao carregar';
            reservaSalaHorarioNaoUteis.textContent = 'Erro ao carregar';
        }
    }
    carregarSalaNoModal(); // Chama esta função quando o modal é exibido

    // Lógica de validação do campo de data, idêntica ao reserva.html
    dataInput.addEventListener('input', () => {
        const dataSelecionadaStr = dataInput.value;
        const horarioEntradaStr = horarioEntradaInput.value;

        dataInput.classList.remove('is-invalid');
        if (!dataSelecionadaStr) return;

        const agora = new Date();
        const umAnoDepoisValid = new Date();
        umAnoDepoisValid.setFullYear(agora.getFullYear() + 1);

        if (horarioEntradaStr) {
            const dataHoraSelecionada = new Date(`${dataSelecionadaStr}T${horarioEntradaStr}`);
            if (isNaN(dataHoraSelecionada.getTime()) || dataHoraSelecionada < agora || dataHoraSelecionada > umAnoDepoisValid) {
                dataInput.classList.add('is-invalid');
                Swal.fire({
                    title: "Erro de Data",
                    text: "A data e hora selecionadas não são válidas (passadas ou muito futuras).",
                    icon: "error",
                    background: "#121212",
                    color: "#ffffff"
                });
            }
        } else {
            const dataSelecionada = new Date(dataSelecionadaStr);
            if (dataSelecionada > umAnoDepoisValid) {
                dataInput.classList.add('is-invalid');
                Swal.fire({
                    title: "Erro de Data",
                    text: "A data selecionada excede o limite de um ano.",
                    icon: "error",
                    background: "#121212",
                    color: "#ffffff"
                });
            }
        }
    });

    // Lógica de envio do formulário, idêntica ao reserva.html
    formReserva.addEventListener('submit', async function (e) {
        e.preventDefault();
        const data = dataInput.value;
        const horarioEntrada = horarioEntradaInput.value;
        const horarioSaida = document.getElementById('horarioSaida').value;

        document.getElementById('horarioEntrada').classList.remove('is-invalid');
        document.getElementById('horarioSaida').classList.remove('is-invalid');
        dataInput.classList.remove('is-invalid');
        const errorMsg = formReserva.querySelector('.error-msg');
        if (errorMsg) errorMsg.remove();

        if (!data || !horarioEntrada || !horarioSaida) {
            Swal.fire({
                title: "Erro",
                text: "Por favor, preencha todos os campos.",
                icon: "error",
                background: "#121212",
                color: "#ffffff"
            });
            return;
        }

        const checkin = new Date(`${data}T${horarioEntrada}`);
        const checkout = new Date(`${data}T${horarioSaida}`);

        if (checkin < new Date()) {
            Swal.fire({
                title: "Erro de Horário",
                text: "O horário de entrada já passou. Selecione um horário futuro.",
                icon: "error",
                background: "#121212",
                color: "#ffffff"
            });
            dataInput.classList.add('is-invalid');
            return;
        }

        if ((checkout - checkin) / (1000 * 60 * 60) < 1) {
            Swal.fire({
                title: "Erro de Duração",
                text: "O intervalo mínimo para reserva é de 1 hora.",
                icon: "error",
                background: "#121212",
                color: "#ffffff"
            });
            document.getElementById('horarioSaida').classList.add('is-invalid');
            return;
        }

        try {
            const resp = await fetch('http://127.0.0.1:8000/reservar', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({
                    sala_id: salaId,
                    checkin: `${data}T${horarioEntrada}`,
                    checkout: `${data}T${horarioSaida}`
                })
            });

            const responseData = await resp.json();
            if (resp.ok) {
                Swal.fire({
                    title: "Sucesso!",
                    text: responseData.message,
                    icon: "success",
                    background: "#121212",
                    color: "#ffffff"
                }).then(() => {
                    const modalInstance = bootstrap.Modal.getInstance(document.getElementById(modalId));
                    if (modalInstance) modalInstance.hide();
                });
            } else {
                if (typeof responseData.detail === "object" && responseData.detail.horarios_ocupados) {
                    const horarios = responseData.detail.horarios_ocupados.join("\n");
                    Swal.fire({
                        title: "Erro de Reserva",
                        text: `${responseData.detail.mensagem}\nHorários já reservados:\n${horarios}`,
                        icon: "error",
                        background: "#121212",
                        color: "#ffffff"
                    });
                } else {
                    Swal.fire({
                        title: "Erro de Reserva",
                        text: responseData.detail || "Erro ao verificar disponibilidade",
                        icon: "error",
                        background: "#121212",
                        color: "#ffffff"
                    });
                }
            }
        } catch (err) {
            Swal.fire({
                title: "Erro de Conexão",
                text: "Erro ao verificar disponibilidade. Verifique sua conexão com a internet.",
                icon: "error",
                background: "#121212",
                color: "#ffffff"
            });
        }
    });

    // Exibe o modal
    const modal = new bootstrap.Modal(document.getElementById(modalId));
    modal.show();

    // Limpa o modal do DOM depois que ele é ocultado
    document.getElementById(modalId).addEventListener('hidden.bs.modal', function () {
        this.remove();
    });
}