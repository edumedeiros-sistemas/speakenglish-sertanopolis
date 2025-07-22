// ==================== FUNÇÕES PARA ESTATÍSTICAS FINANCEIRAS ====================

// Função para calcular estatísticas financeiras
window.calculateFinancialStats = function() {
    console.log('📊 Calculando estatísticas financeiras...');
    
    // Inicializar mensalidades se necessário
    if (!window.mensalidades) {
        if (typeof initializeMensalidadesSystem === 'function') {
            initializeMensalidadesSystem();
        } else {
            window.mensalidades = [];
        }
    }
    
    // Calcular contratos ativos
    const contratosAtivos = contratos ? contratos.filter(c => c.status === 'ativo').length : 0;
    
    // Se não há mensalidades, gerar para contratos ativos
    if (mensalidades.length === 0 && contratos && contratos.length > 0) {
        console.log('🔄 Gerando mensalidades para cálculo...');
        contratos.filter(c => c.status === 'ativo').forEach(contrato => {
            if (typeof generateMensalidadesFromContrato === 'function') {
                generateMensalidadesFromContrato(contrato);
            }
        });
    }
    
    let totalRecebido = 0;
    let totalPendente = 0;
    let totalVencido = 0;
    let mensalidadesPagas = 0;
    let mensalidadesPendentes = 0;
    let mensalidadesVencidas = 0;
    
    // Data atual para comparação
    const hoje = new Date();
    
    // Calcular estatísticas das mensalidades
    if (mensalidades && mensalidades.length > 0) {
        mensalidades.forEach(mensalidade => {
            const valor = parseFloat(mensalidade.valor) || 0;
            const vencimento = new Date(mensalidade.vencimento + 'T12:00:00');
            
            if (mensalidade.status === 'paga') {
                totalRecebido += valor;
                mensalidadesPagas++;
            } else if (mensalidade.status === 'pendente') {
                if (vencimento < hoje) {
                    // Vencida
                    totalVencido += valor;
                    mensalidadesVencidas++;
                } else {
                    // Pendente
                    totalPendente += valor;
                    mensalidadesPendentes++;
                }
            }
        });
    }
    
    const stats = {
        totalRecebido,
        totalPendente,
        totalVencido,
        contratosAtivos,
        totalMensalidades: mensalidades ? mensalidades.length : 0,
        mensalidadesPagas,
        mensalidadesPendentes,
        mensalidadesVencidas
    };
    
    console.log('📊 Estatísticas calculadas:', stats);
    return stats;
};

// Função para atualizar os cards financeiros dinamicamente
window.updateFinancialCards = function() {
    console.log('🔄 Atualizando cards financeiros...');
    
    const stats = calculateFinancialStats();
    
    // Verificar se os cards existem, se não, criá-los
    const summaryCardsContainer = document.getElementById('financialSummaryCards');
    const statsGridContainer = document.getElementById('financialStatsGrid');
    
    if (summaryCardsContainer && summaryCardsContainer.children.length === 0) {
        console.log('📦 Criando estrutura dos cards financeiros...');
        summaryCardsContainer.innerHTML = `
            <div class="financial-card received">
                <div class="card-icon"><i class="fas fa-check-circle"></i></div>
                <div class="card-value">R$ 0,00</div>
                <div class="card-label">TOTAL RECEBIDO</div>
            </div>
            <div class="financial-card pending">
                <div class="card-icon"><i class="fas fa-clock"></i></div>
                <div class="card-value">R$ 0,00</div>
                <div class="card-label">TOTAL PENDENTE</div>
            </div>
            <div class="financial-card overdue">
                <div class="card-icon"><i class="fas fa-exclamation-triangle"></i></div>
                <div class="card-value">R$ 0,00</div>
                <div class="card-label">TOTAL VENCIDO</div>
            </div>
            <div class="financial-card contracts">
                <div class="card-icon"><i class="fas fa-file-contract"></i></div>
                <div class="card-value">0</div>
                <div class="card-label">CONTRATOS ATIVOS</div>
            </div>
        `;
    }
    
    if (statsGridContainer && statsGridContainer.children.length === 0) {
        console.log('📊 Criando estrutura das estatísticas...');
        statsGridContainer.innerHTML = `
            <div class="stat-card">
                <span class="stat-number">0</span>
                <span class="summary-text">Total de Mensalidades</span>
            </div>
            <div class="stat-card">
                <span class="stat-number">0</span>
                <span class="summary-text">Mensalidades Pagas</span>
            </div>
            <div class="stat-card">
                <span class="stat-number">0</span>
                <span class="summary-text">Mensalidades Pendentes</span>
            </div>
            <div class="stat-card">
                <span class="stat-number">0</span>
                <span class="summary-text">Mensalidades Vencidas</span>
            </div>
        `;
    }
    
    // Atualizar cards principais
    const summaryCards = document.querySelectorAll('.financial-card .card-value');
    if (summaryCards.length >= 4) {
        summaryCards[0].textContent = `R$ ${stats.totalRecebido.toLocaleString('pt-BR', {minimumFractionDigits: 2})}`;
        summaryCards[1].textContent = `R$ ${stats.totalPendente.toLocaleString('pt-BR', {minimumFractionDigits: 2})}`;
        summaryCards[2].textContent = `R$ ${stats.totalVencido.toLocaleString('pt-BR', {minimumFractionDigits: 2})}`;
        summaryCards[3].textContent = `${stats.contratosAtivos}`;
    }
    
    // Atualizar estatísticas secundárias
    const statNumbers = document.querySelectorAll('.stat-number');
    if (statNumbers.length >= 4) {
        statNumbers[0].textContent = stats.totalMensalidades;
        statNumbers[1].textContent = stats.mensalidadesPagas;
        statNumbers[2].textContent = stats.mensalidadesPendentes;
        statNumbers[3].textContent = stats.mensalidadesVencidas;
    }
    
    console.log('✅ Cards financeiros atualizados com valores reais!');
    console.log('📊 Resumo atualizado:', {
        'Total Recebido': `R$ ${stats.totalRecebido.toFixed(2)}`,
        'Total Pendente': `R$ ${stats.totalPendente.toFixed(2)}`,
        'Total Vencido': `R$ ${stats.totalVencido.toFixed(2)}`,
        'Contratos Ativos': stats.contratosAtivos,
        'Total Mensalidades': stats.totalMensalidades
    });
};

// Executar atualização automática quando o módulo financeiro for carregado
setTimeout(() => {
    if (window.location.href.includes('8000') && document.querySelector('.financial-card')) {
        console.log('🚀 Módulo financeiro detectado - atualizando cards automaticamente...');
        updateFinancialCards();
    }
}, 1000);

// ==================== FIM DAS FUNÇÕES FINANCEIRAS ==================== 