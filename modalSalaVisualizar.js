function showVisualizarReservaModal(reservaCompleta) {
    const modalId = 'visualizarReservaModal';
    if (document.getElementById(modalId)) {
        document.getElementById(modalId).remove();
    }

    const valorHoraFormatado = reservaCompleta.valor_hora ?
        `R$ ${parseFloat(String(reservaCompleta.valor_hora).replace(',', '.')).toFixed(2).replace('.', ',')}` :
        'N/D';

    const modalHTML = `
        <div class="modal fade" id="${modalId}" tabindex="-1" aria-labelledby="${modalId}Label" aria-hidden="true">
            <div class="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
                <div class="modal-content modal-visualizar-reserva-content"> 
                    <div class="modal-header">
                        <h5 class="modal-title" id="${modalId}Label">Detalhes da Reserva e Sala</h5>
                        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Fechar"></button>
                    </div>
                    <div class="modal-body">
                        <div class="visualizar-reserva-detalhes-container">
                            
                            <h5 class="visualizar-reserva-secao-titulo">
                                <i class="bi bi-calendar-event me-2"></i>Informações da Reserva
                            </h5>
                            <table class="table table-sm table-visualizar-reserva">
                                <tbody>
                                    <tr><td><strong>Data:</strong></td><td>${reservaCompleta.data_reserva || 'N/D'}</td></tr>
                                    <tr><td><strong>Horário:</strong></td><td>${reservaCompleta.horario_inicio || '--:--'} - ${reservaCompleta.horario_fim || '--:--'}</td></tr>
                                    <tr><td><strong>Duração:</strong></td><td id="visDuracaoReserva">Calculando...</td></tr>
                                    <tr><td><strong>Status:</strong></td><td id="visStatusReserva">Verificando...</td></tr>
                                    <tr><td><strong>Valor/Hora (Sala):</strong></td><td>${valorHoraFormatado}</td></tr>
                                    <tr><td><strong>Valor Total da Reserva:</strong></td><td id="visValorTotalReserva">Calculando...</td></tr>
                                </tbody>
                            </table>
                            <hr class="my-3 border-secondary">

                            <h5 class="visualizar-reserva-secao-titulo">
                                <i class="bi bi-building me-2"></i>Detalhes da Sala
                            </h5>
                            
                            <table class="table table-sm table-visualizar-reserva">
                                <tbody>
                                    <tr><td><strong>Tipo:</strong></td><td>${reservaCompleta.tipo_sala || 'N/D'}</td></tr>
                                    <tr><td><strong>Endereço:</strong></td><td>${reservaCompleta.endereco || 'N/D'}</td></tr>
                                    <tr><td><strong>Capacidade:</strong></td><td>${reservaCompleta.capacidade_sala || 'N/A'} pessoas</td></tr>
                                    <tr><td><strong>Descrição:</strong></td><td class="text-wrap visualizar-reserva-descricao-texto">${reservaCompleta.descricao_sala || 'Nenhuma descrição.'}</td></tr>
                                    <tr><td><strong>Tamanho (m²):</strong></td><td id="visTamanhoSala">Carregando...</td></tr>
                                    <tr><td><strong>Recursos Disponíveis:</strong></td><td id="visRecursosSala">Carregando...</td></tr>
                                    <tr><td><strong>Tipo de Mobiliário:</strong></td><td id="visMobiliarioSala">Carregando...</td></tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-outline-primary" data-bs-dismiss="modal">Fechar</button>
                    </div>
                </div>
            </div>
        </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHTML);

    calcularEPreencherDetalhesDerivadosVisualizacao(reservaCompleta);

    if (reservaCompleta.id_sala) {
        carregarDetalhesAdicionaisSalaVisualizacao(reservaCompleta.id_sala);
    } else {
        ['visTamanhoSala', 'visRecursosSala', 'visMobiliarioSala'].forEach(id => {
            const el = document.getElementById(id);
            if (el) el.textContent = 'Não disponível (sem ID da sala)';
        });
    }

    const modal = new bootstrap.Modal(document.getElementById(modalId));
    modal.show();

    document.getElementById(modalId).addEventListener('hidden.bs.modal', function () {
        this.remove();
    });
}

function calcularEPreencherDetalhesDerivadosVisualizacao(reserva) {
    const agora = new Date();
    let dataHoraInicioReserva = null;
    let dataHoraCheckoutReserva = null;
    let statusTexto = 'Indefinido';
    let duracaoHorasTotal = 0;

    const duracaoEl = document.getElementById('visDuracaoReserva');
    const valorTotalEl = document.getElementById('visValorTotalReserva');
    const statusEl = document.getElementById('visStatusReserva');

    if (reserva.data_reserva && reserva.horario_inicio && reserva.horario_fim) {
        try {
            const partesData = reserva.data_reserva.split('/');
            const dia = parseInt(partesData[0], 10);
            const mes = parseInt(partesData[1], 10) - 1;
            const ano = parseInt(partesData[2], 10);
            const partesHI = reserva.horario_inicio.split(':');
            const horaI = parseInt(partesHI[0], 10);
            const minI = parseInt(partesHI[1], 10);
            dataHoraInicioReserva = new Date(ano, mes, dia, horaI, minI);
            const partesHF = reserva.horario_fim.split(':');
            const horaF = parseInt(partesHF[0], 10);
            const minF = parseInt(partesHF[1], 10);
            dataHoraCheckoutReserva = new Date(ano, mes, dia, horaF, minF);

            if (!isNaN(dataHoraInicioReserva.getTime()) && !isNaN(dataHoraCheckoutReserva.getTime())) {
                const duracaoMs = dataHoraCheckoutReserva.getTime() - dataHoraInicioReserva.getTime();
                if (duracaoMs > 0) {
                    duracaoHorasTotal = duracaoMs / (1000 * 60 * 60);
                    const horas = Math.floor(duracaoHorasTotal);
                    const minutos = Math.round((duracaoHorasTotal - horas) * 60);
                    if (duracaoEl) duracaoEl.textContent = `${horas}h ${minutos > 0 ? minutos + 'min' : ''}`.trim();
                } else {
                    if (duracaoEl) duracaoEl.textContent = 'Inválida';
                }
            } else {
                if (duracaoEl) duracaoEl.textContent = 'N/D (Datas Inválidas)';
            }
        } catch (e) {
            console.error("Erro ao calcular duração (visualização):", e);
            if (duracaoEl) duracaoEl.textContent = 'Erro no Cálculo';
        }
    } else {
        if (duracaoEl) duracaoEl.textContent = 'N/D (Datas Ausentes)';
    }

    if (reserva.ativo_reserva === 0) {
        statusTexto = 'Cancelada (Usuário)';
    } else if (reserva.ativo_reserva === 2) {
        statusTexto = 'Cancelada (Locador)';
    } else if (reserva.ativo_reserva === 1) {
        if (dataHoraInicioReserva && dataHoraCheckoutReserva && !isNaN(dataHoraInicioReserva.getTime()) && !isNaN(dataHoraCheckoutReserva.getTime())) {
            if (dataHoraCheckoutReserva < agora) {
                statusTexto = 'Passada';
            } else if (dataHoraInicioReserva.getFullYear() === agora.getFullYear() &&
                dataHoraInicioReserva.getMonth() === agora.getMonth() &&
                dataHoraInicioReserva.getDate() === agora.getDate()) {
                statusTexto = 'Hoje';
            } else if (dataHoraInicioReserva > agora) {
                statusTexto = 'Agendada';
            } else {
                statusTexto = 'Ativa (Verificar Datas)';
            }
        } else {
            statusTexto = 'Ativa (Datas Inválidas/Ausentes)';
        }
    } else {
        statusTexto = 'Status Desconhecido';
    }

    if (statusEl) statusEl.textContent = statusTexto;

    if (valorTotalEl) {
        if (reserva.ativo_reserva === 0 || reserva.ativo_reserva === 2) {
            valorTotalEl.textContent = 'R$ 0,00 (Cancelada)';
        } else if (reserva.ativo_reserva === 1 && duracaoHorasTotal > 0 && reserva.valor_hora) {
            const valorHoraNumerico = parseFloat(String(reserva.valor_hora).replace(',', '.'));
            if (!isNaN(valorHoraNumerico)) {
                const totalCalculado = duracaoHorasTotal * valorHoraNumerico;
                valorTotalEl.textContent = `R$ ${totalCalculado.toFixed(2).replace('.', ',')}`;
            } else {
                valorTotalEl.textContent = 'N/D (Valor/Hora Inválido)';
            }
        } else {
            valorTotalEl.textContent = 'N/D';
        }
    }
}

async function carregarDetalhesAdicionaisSalaVisualizacao(salaId) {
    const tamanhoEl = document.getElementById('visTamanhoSala');
    const recursosEl = document.getElementById('visRecursosSala');
    const mobiliarioEl = document.getElementById('visMobiliarioSala');

    if (tamanhoEl) tamanhoEl.textContent = 'Carregando...';
    if (recursosEl) recursosEl.textContent = 'Carregando...';
    if (mobiliarioEl) mobiliarioEl.textContent = 'Carregando...';

    try {
        const response = await fetch(`http://127.0.0.1:8000/salas-recuperar/${salaId}`, {
            method: 'GET', credentials: 'include',
        });
        if (!response.ok) {
            let errorMsg = `HTTP error! status: ${response.status}`;
            try {
                const errorData = await response.json();
                errorMsg = errorData.detail || errorMsg;
            } catch (e) { }
            throw new Error(errorMsg);
        }
        const salaDetalhes = await response.json();

        if (tamanhoEl) tamanhoEl.textContent = salaDetalhes.tamanho ? `${salaDetalhes.tamanho} m²` : 'N/D';
        if (recursosEl) recursosEl.textContent = salaDetalhes.recursos || 'N/D';
        if (mobiliarioEl) mobiliarioEl.textContent = salaDetalhes.tipo_mobilia || 'N/D';

    } catch (error) {
        console.error("Erro ao carregar detalhes adicionais da sala (visualização):", error);
        const errorText = 'Erro ao carregar';
        if (tamanhoEl) tamanhoEl.textContent = errorText;
        if (recursosEl) recursosEl.textContent = errorText;
        if (mobiliarioEl) mobiliarioEl.textContent = errorText;
    }
}