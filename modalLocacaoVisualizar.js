function showVisualizarLocacaoModal(locacao) {
    const modalId = 'visualizarLocacaoModal';
    if (document.getElementById(modalId)) {
        document.getElementById(modalId).remove();
    }

    const emailLocatario = locacao.email_locatario || 'Não informado';

    const modalHTML = `
        <div class="modal fade" id="${modalId}" tabindex="-1" aria-labelledby="${modalId}Label" aria-hidden="true">
            <div class="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
                <div class="modal-content modal-visualizar-reserva-content"> 
                    <div class="modal-header">
                        <h5 class="modal-title" id="${modalId}Label">Detalhes da Locação</h5>
                        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Fechar"></button>
                    </div>
                    <div class="modal-body">
                        <div class="visualizar-reserva-detalhes-container"> 
                            
                            <h5 class="visualizar-reserva-secao-titulo">
                                <i class="bi bi-person-circle me-2"></i>Dados do Locatário
                            </h5>
                            <table class="table table-sm table-visualizar-reserva"> 
                                <tbody>
                                    <tr><td><strong>Nome:</strong></td><td id="visNomeLocatario">${locacao.nome_locatario || 'Não informado'}</td></tr>
                                    <tr><td><strong>CPF:</strong></td><td id="visCpfLocatario">${maskCPF(locacao.cpf_locatario) || 'Não informado'}</td></tr>
                                    <tr><td><strong>Telefone:</strong></td><td id="visTelefoneLocatario">${formatarTelefone(locacao.telefone_locatario) || 'Não informado'}</td></tr>
                                    <tr><td><strong>E-mail:</strong></td><td id="visEmailLocatario">${emailLocatario}</td></tr>
                                </tbody>
                            </table>
                            <hr class="my-3 border-secondary">

                            <h5 class="visualizar-reserva-secao-titulo">
                                <i class="bi bi-calendar-event me-2"></i>Detalhes da Locação
                            </h5>
                            <table class="table table-sm table-visualizar-reserva">
                                <tbody>
                                    <tr><td><strong>Data:</strong></td><td id="visDataLocacao">${locacao.data_reserva_formatada || 'N/D'}</td></tr>
                                    <tr><td><strong>Horário:</strong></td><td id="visHorarioLocacao">${locacao.horario_inicio || '--:--'} - ${locacao.horario_fim || '--:--'}</td></tr>
                                    <tr><td><strong>Duração:</strong></td><td id="visDuracaoLocacao">Calculando...</td></tr>
                                    <tr><td><strong>Status:</strong></td><td id="visStatusLocacao">Verificando...</td></tr>
                                </tbody>
                            </table>
                            <hr class="my-3 border-secondary">
                            
                            <h5 class="visualizar-reserva-secao-titulo">
                                <i class="bi bi-building me-2"></i>Detalhes da Sala
                            </h5>
                            <table class="table table-sm table-visualizar-reserva">
                                <tbody>
                                    <tr><td><strong>Tipo da Sala:</strong></td><td id="visTipoSalaLocacao">${locacao.tipo_sala || 'N/D'}</td></tr>
                                    <tr><td><strong>Endereço:</strong></td><td>${locacao.endereco_sala || 'N/D'}</td></tr>
                                    <tr><td><strong>Capacidade:</strong></td><td id="visCapacidadeSalaLocacao">Carregando...</td></tr>
                                </tbody>
                            </table>
                            <hr class="my-3 border-secondary">

                            <h5 class="visualizar-reserva-secao-titulo">
                                <i class="bi bi-cash-coin me-2"></i>Detalhes Financeiros
                            </h5>
                            <table class="table table-sm table-visualizar-reserva">
                                <tbody>
                                    <tr><td><strong>Valor/Hora da Sala:</strong></td><td id="visValorHoraSalaLocacao">Carregando...</td></tr>
                                    <tr><td><strong>Valor Total a Receber:</strong></td><td id="visValorTotalReceberLocacao">Calculando...</td></tr>
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

    // Preencher campos derivados e carregar dados adicionais da sala
    calcularEPreencherDetalhesDerivadosLocacao(locacao); // Calcula duração e status

    // Carrega capacidade e valor/hora da sala para cálculos financeiros
    if (locacao.id_sala) {
        carregarDetalhesSalaParaModalLocacao(locacao.id_sala, locacao);
    } else {
        ['visCapacidadeSalaLocacao', 'visValorHoraSalaLocacao', 'visValorTotalReceberLocacao'].forEach(id => {
            const el = document.getElementById(id);
            if (el) el.textContent = 'Não disponível (sem ID da sala)';
        });
    }

    const modal = new bootstrap.Modal(document.getElementById(modalId));
    modal.show();

    // Limpar a modal do DOM quando fechada para evitar conflitos
    document.getElementById(modalId).addEventListener('hidden.bs.modal', function () {
        this.remove();
    });
}

// Função para calcular e preencher duração e status da locação
function calcularEPreencherDetalhesDerivadosLocacao(locacao) {
    const agora = new Date();
    let dataHoraInicioLocacao = null;
    let dataHoraCheckoutLocacao = null;
    let statusTexto = 'Indefinido';

    const duracaoEl = document.getElementById('visDuracaoLocacao');
    const statusEl = document.getElementById('visStatusLocacao');

    // Calcula o status (reutilizando a lógica de getLocacaoStatusDetalhado se ela estiver acessível globalmente ou duplicando aqui)
    // Para simplificar, vamos assumir que getLocacaoStatusDetalhado está disponível ou adaptar
    const statusDetalhado = getLocacaoStatusDetalhado(locacao, agora);

    switch (statusDetalhado) {
        case 'cancelada_usuario': statusTexto = 'Cancelada (Locatário)'; break;
        case 'cancelada_locador': statusTexto = 'Cancelada (Locador)'; break;
        case 'passada': statusTexto = 'Passada'; break;
        case 'hoje': statusTexto = 'Hoje'; break;
        case 'agendada': statusTexto = 'Agendada'; break;
        case 'dados_invalidos': statusTexto = 'Dados Inválidos'; break;
        default: statusTexto = 'Desconhecido';
    }
    if (statusEl) statusEl.textContent = statusTexto;


    // Calcula a duração
    if (locacao.checkin_original && locacao.checkout_original) {
        try {
            dataHoraInicioLocacao = new Date(locacao.checkin_original);
            dataHoraCheckoutLocacao = new Date(locacao.checkout_original);

            if (!isNaN(dataHoraInicioLocacao.getTime()) && !isNaN(dataHoraCheckoutLocacao.getTime())) {
                const duracaoMs = dataHoraCheckoutLocacao.getTime() - dataHoraInicioLocacao.getTime();
                if (duracaoMs > 0) {
                    const duracaoHorasTotal = duracaoMs / (1000 * 60 * 60);
                    const horas = Math.floor(duracaoHorasTotal);
                    const minutos = Math.round((duracaoHorasTotal - horas) * 60);
                    if (duracaoEl) duracaoEl.textContent = `${horas}h ${minutos > 0 ? minutos + 'min' : ''}`.trim();

                    // Retorna a duração em horas para cálculo financeiro
                    return duracaoHorasTotal;
                } else {
                    if (duracaoEl) duracaoEl.textContent = 'Inválida';
                }
            }
        } catch (e) {
            console.error("Erro ao calcular duração da locação (modal):", e);
            if (duracaoEl) duracaoEl.textContent = 'Erro no cálculo';
        }
    } else {
        if (duracaoEl) duracaoEl.textContent = 'N/D';
    }
    return 0; // Retorna 0 se não puder calcular a duração
}

// Função para carregar detalhes da sala (capacidade, valor/hora) e calcular valor total
async function carregarDetalhesSalaParaModalLocacao(salaId, locacaoOriginal) {
    const capacidadeEl = document.getElementById('visCapacidadeSalaLocacao');
    const valorHoraEl = document.getElementById('visValorHoraSalaLocacao');
    const valorTotalReceberEl = document.getElementById('visValorTotalReceberLocacao');

    try {
        const response = await fetch(`http://127.0.0.1:8000/salas-recuperar/${salaId}`, {
            method: 'GET', credentials: 'include',
        });
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

        const salaDetalhes = await response.json(); // Espera que retorne { ..., capacidade, valor_hora, ... }

        if (capacidadeEl) {
            capacidadeEl.textContent = salaDetalhes.capacidade ? `${salaDetalhes.capacidade} pessoas` : 'N/D';
        }

        let valorHoraSala = 0;
        if (salaDetalhes.valor_hora) {
            valorHoraSala = parseFloat(String(salaDetalhes.valor_hora).replace(',', '.'));
            if (valorHoraEl) {
                valorHoraEl.textContent = `R$ ${valorHoraSala.toFixed(2).replace('.', ',')}`;
            }
        } else {
            if (valorHoraEl) valorHoraEl.textContent = 'N/D';
        }

        // Calcula o valor total a receber
        if (locacaoOriginal.checkin_original && locacaoOriginal.checkout_original && valorHoraSala > 0) {
            const duracaoHoras = calcularEPreencherDetalhesDerivadosLocacao(locacaoOriginal); // Re-chama para pegar a duração
            if (duracaoHoras > 0 && valorTotalReceberEl) {
                const totalCalculado = duracaoHoras * valorHoraSala;
                // Só mostra o valor se a locação não estiver cancelada (ou de acordo com sua regra de negócio)
                if (locacaoOriginal.ativo !== 0 && locacaoOriginal.ativo !== 2) {
                    valorTotalReceberEl.textContent = `R$ ${totalCalculado.toFixed(2).replace('.', ',')}`;
                } else {
                    valorTotalReceberEl.textContent = 'R$ 0,00 (Cancelada)';
                }
            } else if (valorTotalReceberEl) {
                valorTotalReceberEl.textContent = (locacaoOriginal.ativo === 0 || locacaoOriginal.ativo === 2) ? 'R$ 0,00 (Cancelada)' : 'N/D';
            }
        } else if (valorTotalReceberEl) {
            valorTotalReceberEl.textContent = (locacaoOriginal.ativo === 0 || locacaoOriginal.ativo === 2) ? 'R$ 0,00 (Cancelada)' : 'N/D';
        }

    } catch (error) {
        console.error("Erro ao carregar detalhes da sala para modal de locação:", error);
        if (capacidadeEl) capacidadeEl.textContent = 'Erro';
        if (valorHoraEl) valorHoraEl.textContent = 'Erro';
        if (valorTotalReceberEl) valorTotalReceberEl.textContent = 'Erro';
    }
}

// Funções utilitárias (podem já existir no seu script principal ou em auth.js)
if (typeof maskCPF !== 'function') {
    function maskCPF(cpf) {
        if (!cpf) return "";
        cpf = String(cpf).replace(/\D/g, '');
        if (cpf.length !== 11) return cpf;
        return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
    }
}

if (typeof formatarTelefone !== 'function') {
    function formatarTelefone(telefone) {
        if (!telefone) return "";
        const tel = String(telefone).replace(/\D/g, '');
        if (tel.length === 11) { // Celular (XX) XXXXX-XXXX
            return tel.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
        } else if (tel.length === 10) { // Fixo (XX) XXXX-XXXX
            return tel.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
        }
        return telefone; // Retorna original se não for um formato esperado
    }
}

function getLocacaoStatusDetalhado(locacao, agora) {
    if (locacao.ativo === 0) return 'cancelada_usuario';
    if (locacao.ativo === 2) return 'cancelada_locador';
    if (locacao.ativo === 1) {
        if (!locacao.checkin_original || !locacao.checkout_original) return 'dados_invalidos';
        let dataHoraInicioLocacao, dataHoraCheckoutLocacao;
        try {
            dataHoraInicioLocacao = new Date(locacao.checkin_original);
            dataHoraCheckoutLocacao = new Date(locacao.checkout_original);
            if (isNaN(dataHoraInicioLocacao.getTime()) || isNaN(dataHoraCheckoutLocacao.getTime())) return 'dados_invalidos';
        } catch (e) { return 'dados_invalidos'; }

        if (dataHoraCheckoutLocacao < agora) return 'passada';
        const ehHoje = dataHoraInicioLocacao.getFullYear() === agora.getFullYear() &&
            dataHoraInicioLocacao.getMonth() === agora.getMonth() &&
            dataHoraInicioLocacao.getDate() === agora.getDate();
        if (ehHoje) return 'hoje';
        if (dataHoraInicioLocacao > agora) return 'agendada';
    }
    return 'desconhecido';
}
