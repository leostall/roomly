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
                    <div class="modal-body p-0"> 
                        
                        <div class="visualizar-reserva-header">
                            <img src="${reservaCompleta.imagem_url || 'images/placeholder.jpg'}" 
                                 class="visualizar-reserva-imagem-sala" 
                                 alt="Imagem da Sala: ${reservaCompleta.nome_sala || 'Sala'}">
                            <div class="visualizar-reserva-header-overlay">
                                <h4 class="visualizar-reserva-nome-sala">${reservaCompleta.tipo_sala || 'Tipo da Sala Indisponível'}</h4>
                            </div>
                        </div>

                        <div class="visualizar-reserva-detalhes-container">
                            <div class="row">
                            <div class="col-lg-6">
                                    <h5 class="visualizar-reserva-secao-titulo">
                                        <i class="bi bi-building me-2"></i>Detalhes da Sala
                                    </h5>
                                    <table class="table table-sm table-visualizar-reserva">
                                        <tbody>
                                            <tr><td><strong>Endereço:</strong></td><td>${reservaCompleta.endereco || 'N/D'}</td></tr>
                                            <tr><td><strong>Capacidade:</strong></td><td>${reservaCompleta.capacidade_sala || 'N/A'} pessoas</td></tr>
                                            <tr><td><strong>Descrição:</strong></td><td class="text-wrap visualizar-reserva-descricao-texto">${reservaCompleta.descricao_sala || 'Nenhuma descrição.'}</td></tr>
                                            <tr><td><strong>Tamanho (m²):</strong></td><td id="visTamanhoSala">Carregando...</td></tr>
                                            <tr><td><strong>Recursos:</strong></td><td id="visRecursosSala">Carregando...</td></tr>
                                            <tr><td><strong>Mobiliário:</strong></td><td id="visMobiliarioSala">Carregando...</td></tr>
                                        </tbody>
                                    </table>
                                </div>
                                <div class="col-lg-6 mb-4 mb-lg-0">
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
                                            <tr><td><strong>Valor Total:</strong></td><td id="visValorTotalReserva">Calculando...</td></tr>
                                        </tbody>
                                    </table>
                                </div>

                            </div>
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

    calcularEPreencherDetalhesDerivadosVisualizacao(reservaCompleta);

    if (reservaCompleta.id_sala) {
        carregarDetalhesAdicionaisSalaVisualizacao(reservaCompleta.id_sala);
    } else {
        ['visTamanhoSala', 'visRecursosSala', 'visMobiliarioSala'].forEach(id => {
            const el = document.getElementById(id);
            if (el) el.textContent = 'Não disponível';
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

    const duracaoEl = document.getElementById('visDuracaoReserva');
    const valorTotalEl = document.getElementById('visValorTotalReserva');
    const statusEl = document.getElementById('visStatusReserva');

    if (reserva.ativo_reserva === 0) {
        statusTexto = 'Cancelada';
    } else if (reserva.data_reserva && reserva.horario_inicio && reserva.horario_fim) {
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
                    const duracaoHoras = duracaoMs / (1000 * 60 * 60);
                    const horas = Math.floor(duracaoHoras);
                    const minutos = Math.round((duracaoHoras - horas) * 60);
                    if (duracaoEl) duracaoEl.textContent = `${horas}h ${minutos > 0 ? minutos + 'min' : ''}`.trim();

                    const valorHoraNumerico = parseFloat(String(reserva.valor_hora || 0).replace(',', '.'));
                    if (!isNaN(valorHoraNumerico) && valorTotalEl) {
                        const totalCalculado = duracaoHoras * valorHoraNumerico;
                        valorTotalEl.textContent = `R$ ${totalCalculado.toFixed(2).replace('.', ',')}`;
                    } else if (valorTotalEl) {
                        valorTotalEl.textContent = 'N/D';
                    }
                } else {
                    if (duracaoEl) duracaoEl.textContent = 'Inválida';
                    if (valorTotalEl) valorTotalEl.textContent = 'N/D';
                }

                if (dataHoraCheckoutReserva < agora) {
                    statusTexto = 'Passada';
                } else if (dataHoraInicioReserva.getFullYear() === agora.getFullYear() &&
                    dataHoraInicioReserva.getMonth() === agora.getMonth() &&
                    dataHoraInicioReserva.getDate() === agora.getDate()) {
                    statusTexto = 'Hoje';
                } else {
                    statusTexto = 'Agendada';
                }
            }
        } catch (e) {
            console.error("Erro ao calcular detalhes derivados (visualização):", e);
            if (duracaoEl) duracaoEl.textContent = 'Erro';
            if (valorTotalEl) valorTotalEl.textContent = 'Erro';
        }
    }
    if (statusEl) statusEl.textContent = statusTexto;
}

async function carregarDetalhesAdicionaisSalaVisualizacao(salaId) {
    const tamanhoEl = document.getElementById('visTamanhoSala');
    const recursosEl = document.getElementById('visRecursosSala');
    const mobiliarioEl = document.getElementById('visMobiliarioSala');
    try {
        const response = await fetch(`http://127.0.0.1:8000/salas-recuperar/${salaId}`, {
            method: 'GET', credentials: 'include',
        });
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const salaDetalhes = await response.json();
        if (tamanhoEl) tamanhoEl.textContent = salaDetalhes.tamanho ? `${salaDetalhes.tamanho} m²` : 'N/D';
        if (recursosEl) recursosEl.textContent = salaDetalhes.recursos || 'N/D';
        if (mobiliarioEl) mobiliarioEl.textContent = salaDetalhes.tipo_mobilia || 'N/D';
    } catch (error) {
        console.error("Erro ao carregar detalhes adicionais da sala (visualização):", error);
        if (tamanhoEl) tamanhoEl.textContent = 'Erro ao carregar';
        if (recursosEl) recursosEl.textContent = 'Erro ao carregar';
        if (mobiliarioEl) mobiliarioEl.textContent = 'Erro ao carregar';
    }
}