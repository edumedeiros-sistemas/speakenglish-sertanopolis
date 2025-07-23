// ==================== SISTEMA FINANCEIRO LIMPO ====================

// Função para criar filtro mensal se não existir
window.createMonthlyFilter = function() {
    // Verificar se o filtro já existe
    let monthFilter = document.getElementById('monthFilter');
    if (monthFilter) {
        console.log('Filtro mensal já existe');
        return monthFilter;
    }
    
    // Procurar container para o filtro
    const financialContainer = document.querySelector('#financial') || 
                              document.querySelector('.financial-content') ||
                              document.querySelector('.tab-content');
    
    if (!financialContainer) {
        console.log('Container financeiro não encontrado');
        return null;
    }
    
    // Criar HTML do filtro mensal
    const filterHTML = `
        <div id="monthlyFilterContainer" style="background: white; padding: 20px; margin: 20px 0; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
            <h4 style="margin: 0 0 15px 0; color: #2c3e50;">
                <i class="fas fa-calendar-alt"></i> Filtro Mensal
            </h4>
            <div style="display: flex; gap: 15px; align-items: center; flex-wrap: wrap;">
                <div style="display: flex; flex-direction: column; gap: 5px;">
                    <label for="monthFilter" style="font-weight: 500; color: #495057;">Selecione o Mês:</label>
                    <input type="month" id="monthFilter" style="padding: 8px 12px; border: 1px solid #ced4da; border-radius: 4px; font-size: 14px;">
                </div>
                <button onclick="filterByMonth()" style="padding: 8px 16px; background: #007bff; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 14px; margin-top: 20px;">
                    <i class="fas fa-filter"></i> Filtrar
                </button>
                <button onclick="clearMonthlyFilter()" style="padding: 8px 16px; background: #6c757d; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 14px; margin-top: 20px;">
                    <i class="fas fa-times"></i> Limpar
                </button>
            </div>
        </div>
    `;
    
    // Inserir o filtro no início do container financeiro
    financialContainer.insertAdjacentHTML('afterbegin', filterHTML);
    
    // Configurar valor padrão (mês atual)
    monthFilter = document.getElementById('monthFilter');
    if (monthFilter) {
        const now = new Date();
        const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
        monthFilter.value = currentMonth;
        
        console.log('Filtro mensal criado com sucesso');
    }
    
    return monthFilter;
};

// Função para limpar filtro mensal
window.clearMonthlyFilter = function() {
    const monthFilter = document.getElementById('monthFilter');
    const resultsContainer = document.getElementById('monthlyResults');
    
    if (monthFilter) {
        monthFilter.value = '';
    }
    
    if (resultsContainer) {
        resultsContainer.innerHTML = `
            <div style="text-align: center; padding: 20px; color: #6c757d;">
                <i class="fas fa-calendar-alt" style="font-size: 48px; margin-bottom: 15px;"></i>
                <h4>Filtro Mensal</h4>
                <p>Selecione um mês acima para visualizar as mensalidades</p>
            </div>
        `;
    }
    
    console.log('Filtro mensal limpo');
};

// Função para limpar busca do drill-down
window.clearDrillDownSearch = function() {
    const searchInput = document.getElementById('studentsSearchInput');
    const clearBtn = document.getElementById('clearStudentsSearchBtn');
    
    if (searchInput) {
        searchInput.value = '';
        searchTerm = '';
        filteredStudents = [...students];
        currentPage = 1;
        renderStudentsList();
        if (clearBtn && clearBtn.style) {
            clearBtn.style.display = 'none';
        }
        searchInput.focus();
    }
};

// Função para mudar página de alunos
window.changeStudentsPage = function(direction) {
    const totalPages = Math.ceil(filteredStudents.length / itemsPerPage);
    if (direction === 1 && currentPage < totalPages) {
        currentPage++;
    } else if (direction === -1 && currentPage > 1) {
        currentPage--;
    }
    renderStudentsList();
};

// Função para atualizar cards financeiros (versão limpa)
window.updateFinancialCards = function() {
    if (!window.mensalidades) {
        initializeMensalidadesSystem();
    }
    
    // Tentar gerar mensalidades se não existirem
    if ((!mensalidades || mensalidades.length === 0) && contratos && contratos.length > 0) {
        contratos.filter(c => c.status === 'ativo').forEach(contrato => {
            if (typeof generateMensalidadesFromContrato === 'function') {
                generateMensalidadesFromContrato(contrato);
            }
        });
    }
    
    // Calcular totais
    const hoje = new Date();
    const pagas = mensalidades ? mensalidades.filter(m => m.status === 'paga') : [];
    const pendentesValidas = mensalidades ? mensalidades.filter(m => {
        const vencimento = new Date(m.vencimento + 'T12:00:00');
        return m.status === 'pendente' && !isNaN(vencimento.getTime()) && vencimento >= hoje;
    }) : [];
    const vencidasValidas = mensalidades ? mensalidades.filter(m => {
        const vencimento = new Date(m.vencimento + 'T12:00:00');
        return m.status === 'pendente' && !isNaN(vencimento.getTime()) && vencimento < hoje;
    }) : [];
    
    const totalRecebido = pagas.reduce((sum, m) => sum + m.valor, 0);
    const totalPendente = pendentesValidas.reduce((sum, m) => sum + m.valor, 0);
    const totalVencido = vencidasValidas.reduce((sum, m) => sum + m.valor, 0);
    const contratosAtivos = contratos ? contratos.filter(c => c.status === 'ativo').length : 0;
    
    // Estatísticas
    const totalMensalidades = mensalidades ? mensalidades.length : 0;
    const mensalidadesPagas = pagas.length;
    const mensalidadesPendentes = pendentesValidas.length;
    const mensalidadesVencidas = vencidasValidas.length;
    
    // Atualizar cards principais
    try {
        const cards = document.querySelectorAll('.financial-card');
        if (cards.length >= 4) {
            const cardValue1 = cards[0].querySelector('.card-value');
            if (cardValue1) cardValue1.textContent = `R$ ${totalRecebido.toFixed(2).replace('.', ',')}`;
            
            const cardValue2 = cards[1].querySelector('.card-value');
            if (cardValue2) cardValue2.textContent = `R$ ${totalPendente.toFixed(2).replace('.', ',')}`;
            
            const cardValue3 = cards[2].querySelector('.card-value');
            if (cardValue3) cardValue3.textContent = `R$ ${totalVencido.toFixed(2).replace('.', ',')}`;
            
            const cardValue4 = cards[3].querySelector('.card-value');
            if (cardValue4) cardValue4.textContent = contratosAtivos.toString();
        }
        
        // Atualizar estatísticas
        let statCards = document.querySelectorAll('.financial-stats-grid .stat-card .stat-number');
        if (statCards.length === 0) {
            statCards = document.querySelectorAll('.stat-card .stat-number');
        }
        if (statCards.length === 0) {
            statCards = document.querySelectorAll('#financialStatsGrid .stat-number');
        }
        
        if (statCards.length >= 4) {
            if (statCards[0]) statCards[0].textContent = totalMensalidades.toString();
            if (statCards[1]) statCards[1].textContent = mensalidadesPagas.toString();
            if (statCards[2]) statCards[2].textContent = mensalidadesPendentes.toString();
            if (statCards[3]) statCards[3].textContent = mensalidadesVencidas.toString();
        }
    } catch (error) {
        console.error('Erro ao atualizar cards:', error);
    }
};

// Função para garantir que dados estão inicializados
window.ensureDataInitialized = function() {
    if (!window.mensalidades) {
        initializeMensalidadesSystem();
    }
    if (!window.contratos) {
        window.contratos = [];
    }
    if (!window.students) {
        window.students = [];
    }
};

// Função para formatar nome do mês
window.formatMonthName = function(monthString) {
    if (!monthString || monthString.length < 7) return monthString;
    const months = {
        '01': 'Janeiro', '02': 'Fevereiro', '03': 'Março', '04': 'Abril',
        '05': 'Maio', '06': 'Junho', '07': 'Julho', '08': 'Agosto',
        '09': 'Setembro', '10': 'Outubro', '11': 'Novembro', '12': 'Dezembro'
    };
    const [year, month] = monthString.split('-');
    return `${months[month] || month}/${year}`;
};

// NOTA: Função filterByMonth removida daqui - usando a versão com cards do script.js

// Função de teste manual - pode ser usada no console
window.testMonthlyFilter = function() {
    console.log('🧪 Testando filtro mensal...');
    
    // Criar filtro se não existir
    const filter = createMonthlyFilter();
    
    if (filter) {
        console.log('✅ Filtro criado/encontrado');
        
        // Definir mês atual
        const now = new Date();
        const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
        filter.value = currentMonth;
        
        console.log(`📅 Mês definido: ${currentMonth}`);
        
        // Executar filtro
        setTimeout(() => {
            filterByMonth();
            console.log('🔍 Filtro executado');
        }, 500);
    } else {
        console.error('❌ Não foi possível criar o filtro');
    }
};

// Inicialização simples
window.initializeFinancialModule = function() {
    ensureDataInitialized();
    setTimeout(updateFinancialCards, 500);
};

// Executar inicialização uma vez
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeFinancialModule);
} else {
    setTimeout(initializeFinancialModule, 100);
}

// Função especial para garantir filtro mensal na aba Gestão
window.ensureFinancialInterface = function() {
    // Verificar se estamos na aba Gestão
    const gestaoTab = document.querySelector('.nav-item[onclick*="showFinancial"]') || 
                     document.querySelector('[data-tab="financial"]') ||
                     document.querySelector('#gestao-tab');
    
    if (gestaoTab) {
        // Aguardar um pouco e criar o filtro
        setTimeout(() => {
            const filter = createMonthlyFilter();
            if (filter) {
                console.log('Interface financeira garantida');
            }
        }, 300);
    }
};

// Observar cliques na navegação para detectar quando a aba Gestão é aberta
document.addEventListener('click', function(e) {
    const target = e.target;
    const isGestaoClick = target.textContent && target.textContent.includes('Gestão') ||
                         target.onclick && target.onclick.toString().includes('showFinancial') ||
                         target.getAttribute('data-tab') === 'financial';
    
    if (isGestaoClick) {
        setTimeout(ensureFinancialInterface, 200);
    }
});

console.log('✅ Sistema Financeiro Carregado (Versão Limpa)');
console.log('📋 Funções para teste manual:');
console.log('  • showFinancialTab("monthly") - Ativar sub-aba Filtro Mensal');
console.log('  • forceMonthlyTabToWork() - Forçar sub-aba mensal a funcionar');
console.log('  • loadMonthlyFilter() - Carregar filtro mensal');
console.log('  • filterByMonth() - Executar filtro');
console.log('  • clearMonthlyFilter() - Limpar filtro');
console.log('  • loadAllMensalidades() - Carregar mensalidades vencidas');
console.log('💡 Se a sub-aba "Filtro Mensal" não funcionar, execute: forceMonthlyTabToWork()');

// ==================== CORREÇÃO DA SUB-ABA FILTRO MENSAL ====================

// Função para mostrar diferentes abas financeiras (corrigida)
window.showFinancialTab = function(tabName) {
    console.log(`📂 Mudando para aba financeira: ${tabName}`);
    
    try {
        // Remover classe active de todas as abas
        const allTabs = document.querySelectorAll('.financial-tabs .tab-btn');
        allTabs.forEach(tab => tab.classList.remove('active'));
        
        // Remover classe active de todos os conteúdos
        const allContents = document.querySelectorAll('#financialTabContent .tab-content');
        allContents.forEach(content => content.classList.remove('active'));
        
        // Ativar aba selecionada
        const selectedTab = document.getElementById(tabName + 'Tab');
        if (selectedTab) {
            selectedTab.classList.add('active');
            console.log(`✅ Aba ${tabName} ativada`);
        } else {
            console.warn(`⚠️ Aba ${tabName}Tab não encontrada`);
        }
        
        // Ativar conteúdo correspondente
        const selectedContent = document.getElementById(tabName + 'Content');
        if (selectedContent) {
            selectedContent.classList.add('active');
            console.log(`✅ Conteúdo ${tabName} ativado`);
        } else {
            console.warn(`⚠️ Conteúdo ${tabName}Content não encontrado`);
        }
        
        // Carregar dados específicos da aba
        switch(tabName) {
            case 'students':
                console.log('📊 Carregando dados de alunos...');
                if (typeof loadStudentsDrillDown === 'function') {
                    loadStudentsDrillDown();
                }
                break;
            case 'monthly':
                console.log('📅 Carregando filtro mensal...');
                loadMonthlyFilter();
                break;
            case 'mensalidades':
                console.log('💰 Carregando mensalidades vencidas...');
                if (typeof loadAllMensalidades === 'function') {
                    loadAllMensalidades();
                }
                break;
            default:
                console.warn(`⚠️ Aba desconhecida: ${tabName}`);
        }
        
    } catch (error) {
        console.error('❌ Erro ao trocar aba financeira:', error);
    }
};

// Função para carregar filtro mensal (corrigida)
window.loadMonthlyFilter = function() {
    console.log('📅 Carregando filtro mensal...');
    
    try {
        // Verificar se estamos na aba correta
        const monthlyContent = document.getElementById('monthlyContent');
        if (!monthlyContent) {
            console.error('❌ Conteúdo da aba mensal não encontrado');
            return;
        }
        
        // Inicializar dados se necessário
        ensureDataInitialized();
        
        // Configurar valor padrão do filtro (mês atual)
        const monthFilter = document.getElementById('monthFilter');
        if (monthFilter) {
            const now = new Date();
            const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
            monthFilter.value = currentMonth;
            
            console.log(`📅 Filtro configurado para: ${currentMonth}`);
            
            // Executar filtro automaticamente
            setTimeout(() => {
                filterByMonth();
            }, 100);
        } else {
            console.warn('⚠️ Campo monthFilter não encontrado');
        }
        
        // Mostrar mensagem inicial se não há resultados
        const resultsContainer = document.getElementById('monthlyResults');
        if (resultsContainer && !resultsContainer.innerHTML.trim()) {
            resultsContainer.innerHTML = `
                <div style="text-align: center; padding: 40px; color: #6c757d;">
                    <i class="fas fa-calendar-alt" style="font-size: 48px; margin-bottom: 15px;"></i>
                    <h4>Filtro Mensal</h4>
                    <p>Os resultados aparecerão aqui após selecionar um mês</p>
                </div>
            `;
        }
        
        console.log('✅ Filtro mensal carregado');
        
    } catch (error) {
        console.error('❌ Erro ao carregar filtro mensal:', error);
    }
};

// Função para carregar mensalidades vencidas (corrigida)
window.loadAllMensalidades = function() {
    console.log('📋 Carregando mensalidades vencidas...');
    
    const container = document.getElementById('allMensalidadesList');
    if (!container) return;
    
    // Inicializar mensalidades se necessário
    if (!window.mensalidades) {
        if (typeof initializeMensalidadesSystem === 'function') {
            initializeMensalidadesSystem();
        } else {
            window.mensalidades = [];
        }
    }
    
    // Data atual para comparação
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);
    
    // Filtrar apenas mensalidades vencidas
    const mensalidadesVencidas = mensalidades.filter(mensalidade => {
        // Verificar se não está paga
        if (mensalidade.status === 'pago' || mensalidade.status === 'paga') {
            return false;
        }
        
        // Verificar se a data de vencimento é válida e está no passado
        const vencimento = new Date(mensalidade.vencimento + 'T00:00:00');
        if (isNaN(vencimento.getTime())) {
            return false;
        }
        
        return vencimento < hoje;
    });
    
    // Ordenar por data de vencimento (mais antigas primeiro)
    mensalidadesVencidas.sort((a, b) => {
        const dataA = new Date(a.vencimento);
        const dataB = new Date(b.vencimento);
        return dataA - dataB;
    });
    
    // Calcular total vencido
    const totalVencido = mensalidadesVencidas.reduce((sum, m) => sum + (parseFloat(m.valor) || 0), 0);
    
    if (mensalidadesVencidas.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <div class="empty-icon">
                    <i class="fas fa-check-circle"></i>
                </div>
                <h4>Nenhuma mensalidade vencida!</h4>
                <p>Parabéns! Todas as mensalidades estão em dia.</p>
            </div>
        `;
        return;
    }
    
    // Criar HTML com mensalidades vencidas
    let html = `
        <div class="overdue-summary">
            <div class="summary-header">
                <h4><i class="fas fa-exclamation-triangle"></i> Mensalidades Vencidas</h4>
                <div class="overdue-stats">
                    <div class="stat-item">
                        <span class="stat-number" id="overdueCount">${mensalidadesVencidas.length}</span>
                        <span class="stat-label">Mensalidades</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-number" id="overdueTotal">R$ ${totalVencido.toFixed(2).replace('.', ',')}</span>
                        <span class="stat-label">Total Vencido</span>
                    </div>
                </div>
            </div>
        </div>
        
        <div class="overdue-search">
            <div class="search-input-group">
                <i class="fas fa-search"></i>
                <input type="text" id="overdueSearchInput" class="search-input" 
                       placeholder="Buscar por nome do aluno..." 
                       onkeyup="filterOverdueByStudent()">
                <button class="clear-search" id="clearOverdueSearchBtn" onclick="clearOverdueSearch()" style="display: none;">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="search-results-info" id="overdueSearchInfo">
                <span class="search-info">
                    <i class="fas fa-exclamation-triangle"></i> 
                    Mostrando: <strong id="filteredCount">${mensalidadesVencidas.length}</strong> de <strong>${mensalidadesVencidas.length}</strong> mensalidades vencidas
                </span>
            </div>
        </div>
        
        <div class="overdue-list" id="overdueListContainer">
    `;
    
    mensalidadesVencidas.forEach((mensalidade, index) => {
        const vencimento = new Date(mensalidade.vencimento);
        const diasVencidos = Math.floor((hoje - vencimento) / (1000 * 60 * 60 * 24));
        const referenciaNome = formatMonthName(mensalidade.referencia);
        
        html += `
                        <div class="overdue-item">
                 <div class="overdue-student">
                     <div class="student-avatar-small">
                         <i class="fas fa-user"></i>
                     </div>
                     <div class="student-details">
                         <h5>${mensalidade.studentName}</h5>
                         <small>${mensalidade.studentEmail}</small>
                     </div>
                 </div>
                 
                 <div class="overdue-period">
                     <span class="period-badge">${referenciaNome}</span>
                 </div>
                 
                 <div class="overdue-amount">
                     <span class="amount">R$ ${parseFloat(mensalidade.valor).toFixed(2).replace('.', ',')}</span>
                 </div>
                 
                 <div class="overdue-days">
                     <span class="days-count ${diasVencidos > 30 ? 'critical' : diasVencidos > 15 ? 'warning' : 'normal'}">
                         ${diasVencidos} dia${diasVencidos !== 1 ? 's' : ''} vencido${diasVencidos !== 1 ? 's' : ''}
                     </span>
                 </div>
                 
                 <div class="overdue-date">
                     <small>Venceu em</small>
                     <span class="date">${vencimento.toLocaleDateString('pt-BR')}</span>
                 </div>
                 
                 <div class="overdue-actions">
                     <button class="btn btn-success btn-small" onclick="markMensalidadeAsPaid('${mensalidade.id}')">
                         <i class="fas fa-check"></i> Marcar Pago
                     </button>
                 </div>
             </div>
        `;
    });
    
    html += '</div>';
    
    container.innerHTML = html;
    
    // Inicializar sistema de busca
    allOverdueMensalidades = [...mensalidadesVencidas];
    filteredOverdueMensalidades = [...mensalidadesVencidas];
    
    console.log(`✅ Carregadas ${mensalidadesVencidas.length} mensalidades vencidas`);
};

// Função de força bruta para fazer a sub-aba mensal funcionar
window.forceMonthlyTabToWork = function() {
    console.log('🔧 Forçando sub-aba mensal a funcionar...');
    
    // Procurar o botão da sub-aba mensal
    let monthlyBtn = document.getElementById('monthlyTab');
    if (!monthlyBtn) {
        monthlyBtn = document.querySelector('button[onclick*="monthly"]');
    }
    
    if (monthlyBtn) {
        console.log('✅ Botão da sub-aba mensal encontrado');
        
        // Adicionar evento de clique personalizado
        monthlyBtn.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('🖱️ Clique interceptado na sub-aba mensal');
            showFinancialTab('monthly');
        });
        
        // Simular clique para abrir a aba
        monthlyBtn.click();
        
    } else {
        console.error('❌ Botão da sub-aba mensal não encontrado');
        
        // Tentar ativar diretamente
        showFinancialTab('monthly');
    }
};

// Auto-executar ao detectar que estamos na página financeira
setTimeout(() => {
    const financialTab = document.querySelector('#financial, .financial-content');
    if (financialTab) {
        console.log('💡 Página financeira detectada, configurando sub-aba mensal...');
        
        // Aguardar um pouco mais e tentar configurar
        setTimeout(() => {
            const monthlyTab = document.getElementById('monthlyTab');
            if (monthlyTab) {
                // Interceptar cliques na sub-aba mensal
                monthlyTab.addEventListener('click', function(e) {
                    e.stopPropagation();
                    e.preventDefault();
                    console.log('🎯 Sub-aba mensal clicada - executando função corrigida');
                    showFinancialTab('monthly');
                });
                
                console.log('✅ Sub-aba mensal configurada com sucesso');
            }
        }, 1000);
    }
    }, 2000); 

// ==================== SISTEMA DE BUSCA MENSALIDADES VENCIDAS ====================

// Variáveis globais para busca de mensalidades vencidas
let allOverdueMensalidades = [];
let filteredOverdueMensalidades = [];

// Função para filtrar mensalidades vencidas por nome do aluno
window.filterOverdueByStudent = function() {
    const searchInput = document.getElementById('overdueSearchInput');
    const clearBtn = document.getElementById('clearOverdueSearchBtn');
    
    if (!searchInput || !clearBtn) return;
    
    const searchTerm = searchInput.value.toLowerCase().trim();
    
    // Mostrar/ocultar botão de limpar
    if (searchTerm) {
        clearBtn.style.display = 'block';
    } else {
        clearBtn.style.display = 'none';
    }
    
    // Filtrar mensalidades
    if (searchTerm) {
        filteredOverdueMensalidades = allOverdueMensalidades.filter(mensalidade => 
            mensalidade.studentName.toLowerCase().includes(searchTerm) ||
            mensalidade.studentEmail.toLowerCase().includes(searchTerm)
        );
    } else {
        filteredOverdueMensalidades = [...allOverdueMensalidades];
    }
    
    // Atualizar display
    renderFilteredOverdueMensalidades();
    updateOverdueSearchInfo(searchTerm);
};

// Função para renderizar mensalidades filtradas
function renderFilteredOverdueMensalidades() {
    const container = document.getElementById('overdueListContainer');
    if (!container) return;
    
    if (filteredOverdueMensalidades.length === 0) {
        container.innerHTML = `
            <div class="no-results">
                <i class="fas fa-search" style="font-size: 48px; color: #6c757d; margin-bottom: 15px;"></i>
                <h4 style="color: #6c757d;">Nenhum resultado encontrado</h4>
                <p style="color: #6c757d;">Tente buscar por outro nome de aluno</p>
            </div>
        `;
        return;
    }
    
    const hoje = new Date();
    let html = '';
    
    filteredOverdueMensalidades.forEach((mensalidade, index) => {
        const vencimento = new Date(mensalidade.vencimento);
        const diasVencidos = Math.floor((hoje - vencimento) / (1000 * 60 * 60 * 24));
        const referenciaNome = formatMonthName(mensalidade.referencia);
        
        html += `
            <div class="overdue-item">
                <div class="overdue-student">
                    <div class="student-avatar-small">
                        <i class="fas fa-user"></i>
                    </div>
                    <div class="student-details">
                        <h5>${highlightSearchTerm(mensalidade.studentName, document.getElementById('overdueSearchInput').value)}</h5>
                        <small>${mensalidade.studentEmail}</small>
                    </div>
                </div>
                
                <div class="overdue-period">
                    <span class="period-badge">${referenciaNome}</span>
                </div>
                
                <div class="overdue-amount">
                    <span class="amount">R$ ${parseFloat(mensalidade.valor).toFixed(2).replace('.', ',')}</span>
                </div>
                
                <div class="overdue-days">
                    <span class="days-count ${diasVencidos > 30 ? 'critical' : diasVencidos > 15 ? 'warning' : 'normal'}">
                        ${diasVencidos} dia${diasVencidos !== 1 ? 's' : ''} vencido${diasVencidos !== 1 ? 's' : ''}
                    </span>
                </div>
                
                <div class="overdue-date">
                    <small>Venceu em</small>
                    <span class="date">${vencimento.toLocaleDateString('pt-BR')}</span>
                </div>
                
                <div class="overdue-actions">
                    <button class="btn btn-success btn-small" onclick="markMensalidadeAsPaid('${mensalidade.id}')">
                        <i class="fas fa-check"></i> Marcar Pago
                    </button>
                </div>
            </div>
        `;
    });
    
    container.innerHTML = html;
}

// Função para destacar termo de busca
function highlightSearchTerm(text, term) {
    if (!term) return text;
    
    const regex = new RegExp(`(${term})`, 'gi');
    return text.replace(regex, '<mark>$1</mark>');
}

// Função para atualizar informações de busca
function updateOverdueSearchInfo(searchTerm) {
    const infoElement = document.getElementById('overdueSearchInfo');
    const countElement = document.getElementById('filteredCount');
    const overdueCountElement = document.getElementById('overdueCount');
    const overdueTotalElement = document.getElementById('overdueTotal');
    
    if (!infoElement) return;
    
    // Atualizar contador de resultados
    if (countElement) {
        countElement.textContent = filteredOverdueMensalidades.length;
    }
    
    // Atualizar contador principal
    if (overdueCountElement) {
        overdueCountElement.textContent = filteredOverdueMensalidades.length;
    }
    
    // Calcular total filtrado
    const totalFiltrado = filteredOverdueMensalidades.reduce((sum, m) => sum + (parseFloat(m.valor) || 0), 0);
    if (overdueTotalElement) {
        overdueTotalElement.textContent = `R$ ${totalFiltrado.toFixed(2).replace('.', ',')}`;
    }
    
    // Atualizar mensagem
    if (searchTerm) {
        infoElement.innerHTML = `
            <span class="search-info">
                <i class="fas fa-search"></i> 
                Encontrados: <strong>${filteredOverdueMensalidades.length}</strong> de <strong>${allOverdueMensalidades.length}</strong> mensalidades para "${searchTerm}"
            </span>
        `;
    } else {
        infoElement.innerHTML = `
            <span class="search-info">
                <i class="fas fa-exclamation-triangle"></i> 
                Mostrando: <strong>${filteredOverdueMensalidades.length}</strong> de <strong>${allOverdueMensalidades.length}</strong> mensalidades vencidas
            </span>
        `;
    }
}

// Função para limpar busca
window.clearOverdueSearch = function() {
    const searchInput = document.getElementById('overdueSearchInput');
    const clearBtn = document.getElementById('clearOverdueSearchBtn');
    
    if (searchInput) {
        searchInput.value = '';
    }
    if (clearBtn) {
        clearBtn.style.display = 'none';
    }
    
    // Resetar filtro
    filteredOverdueMensalidades = [...allOverdueMensalidades];
    renderFilteredOverdueMensalidades();
    updateOverdueSearchInfo('');
};

// Função para inicializar busca de mensalidades vencidas (chamada pelo script.js)
window.initializeOverdueSearch = function(mensalidadesVencidas) {
    allOverdueMensalidades = [...mensalidadesVencidas];
    filteredOverdueMensalidades = [...mensalidadesVencidas];
    console.log('🔍 Sistema de busca de mensalidades vencidas inicializado');
}; 