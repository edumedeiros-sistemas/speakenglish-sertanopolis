// ==================== SPEAKENGLISH v3.1.0 - MÓDULO DE RELATÓRIOS ====================

// Sistema de Relatórios Financeiros e de Alunos
console.log('📊 Carregando Módulo de Relatórios v3.1.0...');

// Verificar se dependências estão disponíveis
console.log('🔍 Verificando dependências...');
console.log('- window.students:', typeof window.students, window.students ? `(${window.students.length} alunos)` : '');
console.log('- window.mensalidades:', typeof window.mensalidades, window.mensalidades ? `(${window.mensalidades.length} mensalidades)` : '');
console.log('- window.contratos:', typeof window.contratos, window.contratos ? `(${window.contratos.length} contratos)` : '');

// ==================== FUNÇÃO PRINCIPAL ====================

// Função principal para carregar módulo de relatórios
window.loadReportsModule = function() {
    console.log('📊 Executando loadReportsModule...');
    
    const gestaoContent = document.getElementById('gestaoContent');
    if (!gestaoContent) {
        console.error('❌ Elemento gestaoContent não encontrado!');
        return;
    }
    
    console.log('✅ Container gestaoContent encontrado, renderizando...');
    renderReportsModule(gestaoContent);
};

// Função para renderizar o módulo
function renderReportsModule(container) {
    console.log('🎨 Renderizando interface de relatórios...');
    
    try {
        container.innerHTML = `
            <div class="reports-module">
                <div class="reports-header">
                    <h2><i class="fas fa-chart-bar"></i> Relatórios e Análises</h2>
                    <p>Sistema completo de relatórios financeiros e de desempenho</p>
                </div>
                
                <!-- Abas de Relatórios -->
                <div class="reports-tabs">
                    <button class="tab-btn active" id="financialReportsTab" onclick="showReportsTab('financial')">
                        <i class="fas fa-dollar-sign"></i> Relatórios Financeiros
                    </button>
                    <button class="tab-btn" id="studentReportsTab" onclick="showReportsTab('students')">
                        <i class="fas fa-graduation-cap"></i> Relatórios de Alunos
                    </button>
                    <button class="tab-btn" id="performanceReportsTab" onclick="showReportsTab('performance')">
                        <i class="fas fa-trophy"></i> Performance & Gamificação
                    </button>
                </div>
                
                <!-- Conteúdo dos Relatórios -->
                <div id="reportsTabContent" class="reports-content">
                    <!-- Relatórios Financeiros -->
                    <div id="financialReportsContent" class="tab-content active">
                        <div class="financial-reports-section">
                            <h3><i class="fas fa-chart-line"></i> Relatórios Financeiros</h3>
                            
                            <!-- Filtros de Período -->
                            <div class="reports-filters">
                                <div class="filter-group">
                                    <label>Período:</label>
                                    <select id="financialPeriodFilter" onchange="updateFinancialReports()">
                                        <option value="current-month">Mês Atual</option>
                                        <option value="last-month">Mês Anterior</option>
                                        <option value="current-year">Ano Atual</option>
                                        <option value="custom">Período Personalizado</option>
                                    </select>
                                </div>
                                <div class="filter-group custom-period" id="customPeriodFilters" style="display: none;">
                                    <input type="month" id="startPeriod" onchange="updateFinancialReports()">
                                    <span>até</span>
                                    <input type="month" id="endPeriod" onchange="updateFinancialReports()">
                                </div>
                            </div>
                            
                            <!-- Resumo Financeiro -->
                            <div class="financial-summary" id="financialSummary">
                                <!-- Será preenchido dinamicamente -->
                            </div>
                            
                            <!-- Gráficos e Tabelas -->
                            <div class="financial-charts">
                                <div class="chart-container">
                                    <h4>Receitas por Mês</h4>
                                    <div id="revenueChart" class="chart-placeholder">
                                        <p class="text-muted">Gráfico será implementado em versão futura</p>
                                    </div>
                                </div>
                                <div class="chart-container">
                                    <h4>Status de Pagamentos</h4>
                                    <div id="paymentStatusChart" class="chart-placeholder">
                                        <p class="text-muted">Gráfico será implementado em versão futura</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Relatórios de Alunos -->
                    <div id="studentReportsContent" class="tab-content">
                        <div class="student-reports-section">
                            <h3><i class="fas fa-users"></i> Relatórios de Alunos</h3>
                            
                            <!-- Seletor de Aluno -->
                            <div class="reports-filters">
                                <div class="filter-group">
                                    <label>Aluno:</label>
                                    <div class="reports-student-search-container">
                                        <div class="search-input-wrapper">
                                            <input type="text" 
                                                   id="reportsStudentSearchInput" 
                                                   class="student-search-input"
                                                   placeholder="Digite o nome do aluno..." 
                                                   autocomplete="off">
                                            <i class="fas fa-search search-icon"></i>
                                        </div>
                                        <div id="reportsStudentSuggestions" class="student-suggestions"></div>
                                    </div>
                                </div>
                                <div class="filter-group">
                                    <label>Período:</label>
                                    <select id="studentPeriodFilter" onchange="updateStudentReports()">
                                        <option value="current-month">Mês Atual</option>
                                        <option value="last-month">Mês Anterior</option>
                                        <option value="current-year">Ano Atual</option>
                                        <option value="all-time">Todo o Período</option>
                                    </select>
                                </div>
                            </div>
                            
                            <!-- Dados do Aluno -->
                            <div class="student-data" id="studentReportData">
                                <!-- Será preenchido quando aluno for selecionado -->
                            </div>
                        </div>
                    </div>
                    
                    <!-- Relatórios de Performance -->
                    <div id="performanceReportsContent" class="tab-content">
                        <div class="performance-reports-section">
                            <h3><i class="fas fa-trophy"></i> Performance & Gamificação</h3>
                            
                            <!-- Rankings e Estatísticas -->
                            <div class="performance-overview" id="performanceOverview">
                                <!-- Será preenchido dinamicamente -->
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        console.log('✅ Interface renderizada com sucesso');
        
        // Inicializar relatórios
        initializeReports();
        
        console.log('✅ Módulo de relatórios carregado completamente');
        
    } catch (error) {
        console.error('❌ Erro ao renderizar módulo de relatórios:', error);
        container.innerHTML = `
            <div class="error-state">
                <h3><i class="fas fa-exclamation-triangle"></i> Erro ao Carregar Relatórios</h3>
                <p>Erro: ${error.message}</p>
                <button class="btn btn-primary" onclick="location.reload()">Recarregar Página</button>
            </div>
        `;
    }
}

// ==================== INICIALIZAÇÃO ====================

// Função para inicializar relatórios
function initializeReports() {
    console.log('🔄 Inicializando relatórios...');
    
    // Verificar se os dados básicos estão disponíveis
    if (!window.students) {
        console.error('❌ Array students não disponível!');
        setTimeout(() => {
            console.log('🔄 Tentando novamente carregar students...');
            if (window.students) {
                initializeReports();
            } else {
                console.error('❌ Students ainda não disponível após retry');
            }
        }, 1000);
        return;
    }
    
    if (!window.mensalidades) {
        console.warn('⚠️ Array mensalidades não disponível, inicializando...');
        window.mensalidades = [];
    }
    
    console.log(`📊 Dados disponíveis: ${students.length} alunos, ${mensalidades.length} mensalidades`);
    
    // Carregar opções de alunos
    try {
        loadStudentOptions();
        console.log('✅ Opções de alunos carregadas');
    } catch (error) {
        console.error('❌ Erro ao carregar opções de alunos:', error);
    }
    
    // Carregar relatório financeiro inicial
    try {
        updateFinancialReports();
        console.log('✅ Relatórios financeiros carregados');
    } catch (error) {
        console.error('❌ Erro ao carregar relatórios financeiros:', error);
    }
    
    // Configurar filtros
    try {
        setupReportsFilters();
        console.log('✅ Filtros configurados');
    } catch (error) {
        console.error('❌ Erro ao configurar filtros:', error);
    }
    
    console.log('✅ Inicialização de relatórios concluída');
}

// ==================== CONTROLE DE ABAS ====================

// Função para alternar abas de relatórios
window.showReportsTab = function(tabType) {
    console.log(`📊 === MUDANDO PARA ABA: ${tabType.toUpperCase()} ===`);
    
    // Atualizar abas ativas
    const tabs = document.querySelectorAll('.reports-tabs .tab-btn');
    console.log(`🔍 Encontradas ${tabs.length} abas`);
    
    tabs.forEach(tab => {
        tab.classList.remove('active');
    });
    
    // Mapear os tipos corretos dos IDs
    const tabMapping = {
        'financial': 'financialReportsTab',
        'students': 'studentReportsTab',
        'performance': 'performanceReportsTab'
    };
    
    const contentMapping = {
        'financial': 'financialReportsContent',
        'students': 'studentReportsContent',
        'performance': 'performanceReportsContent'
    };
    
    const activeTabId = tabMapping[tabType];
    const activeTab = document.getElementById(activeTabId);
    if (activeTab) {
        activeTab.classList.add('active');
        console.log(`✅ Aba ${tabType} ativada (ID: ${activeTabId})`);
    } else {
        console.error(`❌ Aba ${activeTabId} não encontrada`);
    }
    
    // Atualizar conteúdo ativo
    const contents = document.querySelectorAll('#reportsTabContent .tab-content');
    console.log(`🔍 Encontrados ${contents.length} conteúdos`);
    
    contents.forEach(content => {
        content.classList.remove('active');
    });
    
    const activeContentId = contentMapping[tabType];
    const activeContent = document.getElementById(activeContentId);
    if (activeContent) {
        activeContent.classList.add('active');
        console.log(`✅ Conteúdo ${tabType} ativado (ID: ${activeContentId})`);
    } else {
        console.error(`❌ Conteúdo ${activeContentId} não encontrado`);
    }
    
    // Carregar dados específicos da aba com delay para garantir DOM
    setTimeout(() => {
        console.log(`🔄 Carregando dados para aba: ${tabType}`);
        
        switch(tabType) {
            case 'financial':
                console.log('💰 Carregando relatórios financeiros...');
                updateFinancialReports();
                break;
                
            case 'students':
                console.log('👥 Carregando relatórios de alunos...');
                
                // Garantir que as opções estejam carregadas
                if (typeof loadStudentOptions === 'function') {
                    loadStudentOptions();
                } else {
                    console.error('❌ loadStudentOptions não disponível');
                }
                
                // Atualizar relatórios
                if (typeof updateStudentReports === 'function') {
                    updateStudentReports();
                } else {
                    console.error('❌ updateStudentReports não disponível');
                }
                break;
                
            case 'performance':
                console.log('🏆 Carregando relatórios de performance...');
                updatePerformanceReports();
                break;
                
            default:
                console.warn(`⚠️ Tipo de aba desconhecido: ${tabType}`);
        }
        
        console.log(`✅ Dados carregados para aba: ${tabType}`);
    }, 100);
    
    console.log(`📊 === FIM MUDANÇA PARA ABA: ${tabType.toUpperCase()} ===`);
};

// ==================== RELATÓRIOS FINANCEIROS ====================

// Função para atualizar relatórios financeiros
window.updateFinancialReports = function() {
    console.log('💰 Atualizando relatórios financeiros...');
    
    const period = document.getElementById('financialPeriodFilter')?.value || 'current-month';
    const summaryContainer = document.getElementById('financialSummary');
    
    if (!summaryContainer) return;
    
    // Configurar filtros personalizados
    const customFilters = document.getElementById('customPeriodFilters');
    if (customFilters) {
        customFilters.style.display = period === 'custom' ? 'flex' : 'none';
    }
    
    // Calcular dados financeiros
    const financialData = calculateFinancialData(period);
    
    // Renderizar resumo
    summaryContainer.innerHTML = `
        <div class="financial-cards">
            <div class="finance-card revenue">
                <div class="card-icon"><i class="fas fa-arrow-up"></i></div>
                <div class="card-content">
                    <div class="card-value">R$ ${financialData.totalReceita.toFixed(2).replace('.', ',')}</div>
                    <div class="card-label">Total Arrecadado</div>
                </div>
            </div>
            <div class="finance-card pending">
                <div class="card-icon"><i class="fas fa-clock"></i></div>
                <div class="card-content">
                    <div class="card-value">R$ ${financialData.totalPendente.toFixed(2).replace('.', ',')}</div>
                    <div class="card-label">Valores Pendentes</div>
                </div>
            </div>
            <div class="finance-card overdue">
                <div class="card-icon"><i class="fas fa-exclamation-triangle"></i></div>
                <div class="card-content">
                    <div class="card-value">R$ ${financialData.totalVencido.toFixed(2).replace('.', ',')}</div>
                    <div class="card-label">Valores Vencidos</div>
                </div>
            </div>
            <div class="finance-card students">
                <div class="card-icon"><i class="fas fa-users"></i></div>
                <div class="card-content">
                    <div class="card-value">${financialData.totalAlunos}</div>
                    <div class="card-label">Alunos Ativos</div>
                </div>
            </div>
        </div>
        
        <div class="financial-details">
            <h4>Detalhamento por Status</h4>
            <div class="status-breakdown">
                <div class="status-item">
                    <span class="status-indicator pago"></span>
                    <span class="status-text">Pagas: ${financialData.mensalidadesPagas}</span>
                    <span class="status-value">R$ ${financialData.valorPago.toFixed(2).replace('.', ',')}</span>
                </div>
                <div class="status-item">
                    <span class="status-indicator pendente"></span>
                    <span class="status-text">Pendentes: ${financialData.mensalidadesPendentes}</span>
                    <span class="status-value">R$ ${financialData.valorPendente.toFixed(2).replace('.', ',')}</span>
                </div>
                <div class="status-item">
                    <span class="status-indicator vencido"></span>
                    <span class="status-text">Vencidas: ${financialData.mensalidadesVencidas}</span>
                    <span class="status-value">R$ ${financialData.valorVencido.toFixed(2).replace('.', ',')}</span>
                </div>
            </div>
        </div>
    `;
    
    // Atualizar gráficos
    updateFinancialCharts(financialData);
};

// Função para calcular dados financeiros
function calculateFinancialData(period) {
    // Inicializar mensalidades se necessário
    if (!window.mensalidades) {
        window.mensalidades = [];
    }
    
    const today = new Date();
    let startDate, endDate;
    
    // Definir período
    switch(period) {
        case 'current-month':
            startDate = new Date(today.getFullYear(), today.getMonth(), 1);
            endDate = new Date(today.getFullYear(), today.getMonth() + 1, 0);
            break;
        case 'last-month':
            startDate = new Date(today.getFullYear(), today.getMonth() - 1, 1);
            endDate = new Date(today.getFullYear(), today.getMonth(), 0);
            break;
        case 'current-year':
            startDate = new Date(today.getFullYear(), 0, 1);
            endDate = new Date(today.getFullYear(), 11, 31);
            break;
        case 'custom':
            const start = document.getElementById('startPeriod')?.value;
            const end = document.getElementById('endPeriod')?.value;
            if (start && end) {
                startDate = new Date(start + '-01');
                endDate = new Date(end + '-01');
                endDate.setMonth(endDate.getMonth() + 1, 0);
            }
            break;
        default:
            startDate = new Date(today.getFullYear(), today.getMonth(), 1);
            endDate = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    }
    
    if (!startDate || !endDate) {
        startDate = new Date(today.getFullYear(), today.getMonth(), 1);
        endDate = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    }
    
    // Filtrar mensalidades do período
    const mensalidadesPeriodo = mensalidades.filter(m => {
        if (!m.vencimento) return false;
        const vencimento = new Date(m.vencimento + 'T12:00:00');
        return vencimento >= startDate && vencimento <= endDate;
    });
    
    // Calcular totais
    const pagas = mensalidadesPeriodo.filter(m => m.status === 'paga');
    const pendentes = mensalidadesPeriodo.filter(m => {
        if (!m.vencimento) return false;
        const vencimento = new Date(m.vencimento + 'T12:00:00');
        return m.status === 'pendente' && vencimento >= today;
    });
    const vencidas = mensalidadesPeriodo.filter(m => {
        if (!m.vencimento) return false;
        const vencimento = new Date(m.vencimento + 'T12:00:00');
        return m.status === 'pendente' && vencimento < today;
    });
    
    return {
        totalReceita: pagas.reduce((sum, m) => sum + (m.valor || 0), 0) + pendentes.reduce((sum, m) => sum + (m.valor || 0), 0) + vencidas.reduce((sum, m) => sum + (m.valor || 0), 0),
        totalPendente: pendentes.reduce((sum, m) => sum + (m.valor || 0), 0),
        totalVencido: vencidas.reduce((sum, m) => sum + (m.valor || 0), 0),
        totalAlunos: [...new Set(mensalidadesPeriodo.map(m => m.studentEmail).filter(email => email))].length,
        mensalidadesPagas: pagas.length,
        mensalidadesPendentes: pendentes.length,
        mensalidadesVencidas: vencidas.length,
        valorPago: pagas.reduce((sum, m) => sum + (m.valor || 0), 0),
        valorPendente: pendentes.reduce((sum, m) => sum + (m.valor || 0), 0),
        valorVencido: vencidas.reduce((sum, m) => sum + (m.valor || 0), 0)
    };
}

// ==================== RELATÓRIOS DE ALUNOS ====================

// Função para carregar opções de alunos
function loadStudentOptions() {
    console.log('👥 === CARREGANDO OPÇÕES DE ALUNOS ===');
    
    const selector = document.getElementById('reportsStudentSearchInput');
    if (!selector) {
        console.error('❌ Elemento reportsStudentSearchInput não encontrado!');
        console.log('🔍 Elementos disponíveis:', 
            Array.from(document.querySelectorAll('[id*="reportsStudent"]')).map(el => el.id)
        );
        return;
    }
    
    console.log('✅ Input de busca encontrado:', selector);
    
    if (!window.students) {
        console.error('❌ Array students não disponível!');
        console.log('🔍 Variáveis window disponíveis:', 
            Object.keys(window).filter(k => k.toLowerCase().includes('stud'))
        );
        
        // Tentar aguardar um pouco e recarregar
        setTimeout(() => {
            console.log('🔄 Tentativa 2 - Verificando students...');
            if (window.students) {
                console.log('✅ Students encontrado na segunda tentativa');
                loadStudentOptions();
            } else {
                console.error('❌ Students ainda não disponível após timeout');
                
                // Verificar se há dados no localStorage
                const storedStudents = localStorage.getItem('students');
                if (storedStudents) {
                    console.log('🔄 Tentando carregar do localStorage...');
                    try {
                        window.students = JSON.parse(storedStudents);
                        console.log(`✅ Carregados ${students.length} alunos do localStorage`);
                        loadStudentOptions();
                    } catch (error) {
                        console.error('❌ Erro ao parsear students do localStorage:', error);
                    }
                } else {
                    console.error('❌ Nenhum dado de students no localStorage');
                }
            }
        }, 2000);
        
        return;
    }
    
    console.log(`📊 Encontrados ${students.length} alunos para relatórios`);
    
    if (students.length === 0) {
        console.warn('⚠️ Array students está vazio');
        selector.innerHTML = '<option value="">Nenhum aluno cadastrado</option>';
        return;
    }
    
    // Limpar e popular o selector
    selector.innerHTML = '<option value="">Selecione um aluno</option>';
    
    let optionsAdded = 0;
    students.forEach((student, index) => {
        if (!student || !student.email || !student.name) {
            console.warn(`⚠️ Aluno ${index} inválido:`, student);
            return;
        }
        
        const option = document.createElement('option');
        option.value = student.email;
        option.textContent = student.name;
        selector.appendChild(option);
        optionsAdded++;
    });
    
    console.log(`✅ ${optionsAdded} alunos adicionados ao selector de relatórios`);
    console.log('📋 Primeiro aluno:', students[0]);
    console.log('📋 HTML do selector:', selector.innerHTML.substring(0, 200) + '...');
    
    // Verificar se as opções foram realmente adicionadas
    const finalOptions = selector.querySelectorAll('option');
    console.log(`🔍 Verificação final: ${finalOptions.length} opções no DOM`);
    
    if (finalOptions.length <= 1) {
        console.error('❌ Opções não foram adicionadas corretamente ao DOM');
    } else {
        console.log('✅ Opções adicionadas com sucesso');
    }
    
    console.log('👥 === FIM CARREGAMENTO OPÇÕES ===');
}

// Função para atualizar relatórios de alunos
window.updateStudentReports = function() {
    console.log('=== ATUALIZANDO RELATÓRIOS DE ALUNOS ===');
    
    // Usar a busca inteligente em vez do dropdown
    const studentEmail = (typeof getSelectedReportsStudentEmail === 'function') ? getSelectedReportsStudentEmail() : '';
    const period = document.getElementById('studentPeriodFilter')?.value || 'current-month';
    
    const container = document.getElementById('studentReportsContent');
    const containerExists = !!container;
    
    console.log('📋 Dados da interface:', {
        studentEmail,
        period,
        container: !!container,
        containerExists
    });
    
    if (!container) {
        console.error('❌ Container studentReportsContent não encontrado');
        return;
    }
    
    console.log('✅ Container encontrado');
    
    if (!studentEmail) {
        console.log('👤 Nenhum aluno selecionado, mostrando estado vazio');
        
        // Verificar se já existe a estrutura de filtros
        const existingFilters = container.querySelector('.reports-filters');
        if (!existingFilters) {
            // Se não existe, criar estrutura completa
            ensureSearchFieldExists();
            return;
        }
        
        // Se existe filtros, mostrar apenas estado vazio preservando filtros
        const emptyStateContainer = container.querySelector('.student-reports-empty') || 
                                  container.querySelector('.student-report-container');
        
        if (!emptyStateContainer) {
            // Adicionar estado vazio após os filtros
            const emptyHTML = `
                <div class="student-reports-empty">
                    <div class="empty-state-icon">
                        <i class="fas fa-user-graduate" style="font-size: 64px; color: #dee2e6; margin-bottom: 20px;"></i>
                    </div>
                    <h4 style="color: #495057; margin-bottom: 12px; font-weight: 600;">Selecione um Aluno</h4>
                    <p style="margin-bottom: 8px; line-height: 1.5;">Use a busca inteligente acima para encontrar e selecionar um aluno.</p>
                    <p class="text-muted" style="color: #6c757d;">Total de ${students ? students.length : 0} alunos disponíveis</p>
                </div>
            `;
            
            existingFilters.insertAdjacentHTML('afterend', emptyHTML);
        }
        
        console.log('✅ Estado vazio definido');
        return;
    }
    
    // Continuar com a lógica existente para o aluno selecionado
    console.log(`👤 Carregando relatórios para: ${studentEmail}`);
    
    if (!window.students) {
        console.error('❌ Array students não disponível');
        container.innerHTML = `
            <div class="empty-state error">
                <i class="fas fa-exclamation-triangle"></i>
                <h4>Dados não Carregados</h4>
                <p>Os dados dos alunos não foram carregados corretamente</p>
                <button class="btn btn-primary" onclick="reloadReports()">Recarregar</button>
            </div>
        `;
        return;
    }
    
    const student = students.find(s => s.email === studentEmail);
    if (!student) {
        console.error('❌ Aluno não encontrado:', studentEmail);
        console.log('🔍 Alunos disponíveis:', students.map(s => s.email));
        container.innerHTML = `
            <div class="empty-state error">
                <i class="fas fa-exclamation-triangle"></i>
                <h4>Aluno não encontrado</h4>
                <p>O aluno selecionado não existe mais no sistema</p>
                <button class="btn btn-primary" onclick="reloadReports()">Recarregar</button>
            </div>
        `;
        return;
    }
    
    console.log('✅ Aluno encontrado:', student.name);
    
    try {
        console.log('📊 Calculando dados do aluno...');
        
        // Calcular dados do aluno
        const studentData = calculateStudentData(studentEmail, period);
        console.log('📊 Dados calculados:', studentData);
        
        // Verificar se funções auxiliares estão disponíveis
        let avatar = '👤';
        let levelInfo = { name: 'Básico' };
        
        if (typeof generateAvatar === 'function') {
            avatar = generateAvatar(student.name);
            console.log('🎨 Avatar gerado');
        } else {
            console.warn('⚠️ generateAvatar não disponível, usando emoji padrão');
        }
        
        if (typeof getStudentLevel === 'function') {
            levelInfo = getStudentLevel(student.points || 0);
            console.log('⭐ Nível calculado:', levelInfo.name);
        } else {
            console.warn('⚠️ getStudentLevel não disponível, usando nível padrão');
        }
        
        console.log('🎨 Gerando HTML do relatório...');
        
        const reportHTML = `
            <div class="student-report-card">
                <div class="student-header">
                    <div class="student-avatar">${avatar}</div>
                    <div class="student-info">
                        <h3>${student.name}</h3>
                        <p>${student.email}</p>
                        <div class="student-level">
                            <i class="fas fa-star"></i>
                            Nível: ${levelInfo.name}
                        </div>
                    </div>
                </div>
                
                <div class="student-stats">
                    <div class="stat-card">
                        <div class="stat-icon"><i class="fas fa-trophy"></i></div>
                        <div class="stat-content">
                            <div class="stat-value">${student.points || 0}</div>
                            <div class="stat-label">Pontos Totais</div>
                        </div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-icon"><i class="fas fa-calendar-check"></i></div>
                        <div class="stat-content">
                            <div class="stat-value">${studentData.presencas}</div>
                            <div class="stat-label">Presenças</div>
                        </div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-icon"><i class="fas fa-tasks"></i></div>
                        <div class="stat-content">
                            <div class="stat-value">${studentData.tarefasConcluidas}</div>
                            <div class="stat-label">Tarefas Concluídas</div>
                        </div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-icon"><i class="fas fa-dollar-sign"></i></div>
                        <div class="stat-content">
                            <div class="stat-value">R$ ${studentData.valorPago.toFixed(2).replace('.', ',')}</div>
                            <div class="stat-label">Pagamentos</div>
                        </div>
                    </div>
                </div>
                
                <div class="student-details">
                    <div class="detail-section">
                        <h4><i class="fas fa-chart-line"></i> Progresso</h4>
                        <div class="progress-bar">
                            <div class="progress-fill" style="width: ${(studentData.presencas / Math.max(studentData.totalAulas, 1)) * 100}%"></div>
                        </div>
                        <p>Frequência: ${((studentData.presencas / Math.max(studentData.totalAulas, 1)) * 100).toFixed(1)}%</p>
                    </div>
                    
                    <div class="detail-section">
                        <h4><i class="fas fa-money-bill-wave"></i> Situação Financeira</h4>
                        <div class="financial-status">
                            <span class="status-badge ${studentData.financialStatus}">${studentData.financialStatusText}</span>
                            <p>Próximo vencimento: ${studentData.proximoVencimento || 'Nenhum'}</p>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        container.innerHTML = reportHTML;
        console.log('✅ Relatório do aluno carregado com sucesso para:', student.name);
        
    } catch (error) {
        console.error('❌ Erro ao gerar relatório do aluno:', error);
        container.innerHTML = `
            <div class="empty-state error">
                <i class="fas fa-exclamation-triangle"></i>
                <h4>Erro ao Gerar Relatório</h4>
                <p>Ocorreu um erro: ${error.message}</p>
                <div class="mt-3">
                    <button class="btn btn-primary" onclick="updateStudentReports()">Tentar Novamente</button>
                    <button class="btn btn-secondary ml-2" onclick="debugSR()">Debug</button>
                </div>
            </div>
        `;
    }
    
    console.log('📊 === FIM ATUALIZAÇÃO RELATÓRIOS ===');
};

// Função para calcular dados do aluno
function calculateStudentData(studentEmail, period) {
    // Verificar se mensalidades está disponível
    if (!window.mensalidades) {
        window.mensalidades = [];
    }
    
    // Dados básicos
    const studentMensalidades = mensalidades.filter(m => m.studentEmail === studentEmail);
    const pagas = studentMensalidades.filter(m => m.status === 'paga');
    const pendentes = studentMensalidades.filter(m => m.status === 'pendente');
    
    // Situação financeira
    const today = new Date();
    const hasOverdue = pendentes.some(m => {
        if (!m.vencimento) return false;
        const vencimento = new Date(m.vencimento + 'T12:00:00');
        return !isNaN(vencimento.getTime()) && vencimento < today;
    });
    
    let financialStatus = 'em-dia';
    let financialStatusText = 'Em Dia';
    
    if (hasOverdue) {
        financialStatus = 'em-atraso';
        financialStatusText = 'Em Atraso';
    } else if (pendentes.length > 0) {
        financialStatus = 'pendente';
        financialStatusText = 'Pendente';
    }
    
    // Próximo vencimento
    const proximasPendentes = pendentes.filter(m => {
        if (!m.vencimento) return false;
        const vencimento = new Date(m.vencimento + 'T12:00:00');
        return !isNaN(vencimento.getTime()) && vencimento >= today;
    }).sort((a, b) => new Date(a.vencimento) - new Date(b.vencimento));
    
    const proximoVencimento = proximasPendentes.length > 0 ? 
        new Date(proximasPendentes[0].vencimento + 'T12:00:00').toLocaleDateString('pt-BR') : null;
    
    // Dados simulados para presenças e tarefas
    const presencas = Math.floor(Math.random() * 20) + 5;
    const totalAulas = 25;
    const tarefasConcluidas = Math.floor(Math.random() * 15) + 3;
    const valorPago = pagas.reduce((sum, m) => sum + (m.valor || 0), 0);
    
    return {
        presencas,
        totalAulas,
        tarefasConcluidas,
        valorPago,
        financialStatus,
        financialStatusText,
        proximoVencimento
    };
}

// ==================== RELATÓRIOS DE PERFORMANCE ====================

// Função para atualizar relatórios de performance
window.updatePerformanceReports = function() {
    const container = document.getElementById('performanceOverview');
    if (!container) return;
    
    // Calcular rankings
    const rankings = calculateStudentRankings();
    
    container.innerHTML = `
        <div class="performance-section">
            <h4><i class="fas fa-crown"></i> Ranking de Pontuação</h4>
            <div class="rankings-list">
                ${rankings.map((student, index) => `
                    <div class="ranking-item ${index < 3 ? 'top-three' : ''}">
                        <div class="ranking-position">
                            ${index + 1}${index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : ''}
                        </div>
                        <div class="ranking-student">
                            <div class="student-avatar">${student.name.charAt(0)}</div>
                            <div class="student-name">${student.name}</div>
                        </div>
                        <div class="ranking-points">${student.points} pts</div>
                        <div class="ranking-level">Nível ${Math.floor(student.points / 100) + 1}</div>
                    </div>
                `).join('')}
            </div>
        </div>
        
        <div class="performance-stats">
            <h4><i class="fas fa-chart-pie"></i> Estatísticas Gerais</h4>
            <div class="stats-grid">
                <div class="stat-item">
                    <div class="stat-number">${students.length}</div>
                    <div class="stat-label">Total de Alunos</div>
                </div>
                <div class="stat-item">
                    <div class="stat-number">${rankings.reduce((sum, s) => sum + s.points, 0)}</div>
                    <div class="stat-label">Pontos Totais</div>
                </div>
                <div class="stat-item">
                    <div class="stat-number">${Math.round(rankings.reduce((sum, s) => sum + s.points, 0) / rankings.length)}</div>
                    <div class="stat-label">Média de Pontos</div>
                </div>
                <div class="stat-item">
                    <div class="stat-number">${rankings.filter(s => s.points > 1000).length}</div>
                    <div class="stat-label">Alunos Avançados</div>
                </div>
            </div>
        </div>
    `;
};

// Função para calcular rankings de alunos
function calculateStudentRankings() {
    if (!window.students) return [];
    
    return students
        .map(student => ({
            name: student.name,
            email: student.email,
            points: student.points || Math.floor(Math.random() * 2000) + 100
        }))
        .sort((a, b) => b.points - a.points)
        .slice(0, 10);
}

// ==================== FUNÇÕES AUXILIARES ====================

// Função para configurar filtros
function setupReportsFilters() {
    const periodFilter = document.getElementById('financialPeriodFilter');
    if (periodFilter) {
        periodFilter.addEventListener('change', function() {
            const customFilters = document.getElementById('customPeriodFilters');
            if (customFilters) {
                customFilters.style.display = this.value === 'custom' ? 'flex' : 'none';
            }
        });
    }
}

// Função para atualizar gráficos financeiros (placeholder)
function updateFinancialCharts(data) {
    console.log('📈 Atualizando gráficos financeiros...', data);
}

// ==================== AUTO-CORREÇÃO CAMPO DE BUSCA ====================

// Função para garantir que o campo de busca seja criado (SEM INTERFERIR COM SELEÇÕES)
function ensureSearchFieldExists() {
    console.log('🔧 Verificando campo de busca de relatórios...');
    
    setTimeout(() => {
        const searchInput = document.getElementById('reportsStudentSearchInput');
        
        // Se campo existe, verificar se tem seleção ativa antes de interferir
        if (searchInput) {
            const hasValue = searchInput.value && searchInput.value.trim().length > 0;
            const hasSelection = typeof getSelectedReportsStudentEmail === 'function' && getSelectedReportsStudentEmail();
            
            if (hasValue || hasSelection) {
                console.log('✅ Campo existe e tem seleção ativa, NÃO interferindo');
                return; // NÃO fazer nada para preservar seleção
            }
            
            console.log('✅ Campo de busca já existe');
            return;
        }
        
        console.log('❌ Campo não encontrado, criando automaticamente...');
        
        // Procurar especificamente o container da aba de ALUNOS
        const studentReportsContent = document.getElementById('studentReportsContent');
        if (!studentReportsContent) {
            console.log('❌ Container studentReportsContent não encontrado');
            return;
        }
        
        // Verificar se já existe (dupla verificação)
        const existingField = studentReportsContent.querySelector('#reportsStudentSearchInput');
        if (existingField) {
            console.log('✅ Campo já existe na aba de alunos!');
            return;
        }
        
        console.log('📦 Criando campo na aba de ALUNOS...');
        
        // Criar estrutura completa na aba correta (SÓ quando realmente necessário)
        studentReportsContent.innerHTML = `
            <div class="reports-filters" style="margin-bottom: 20px; padding: 20px; background: #f8f9fa; border-radius: 8px; border: 1px solid #dee2e6;">
                <div class="filter-group" style="margin-bottom: 15px;">
                    <label style="display: block; margin-bottom: 8px; font-weight: 600; color: #495057;">Aluno:</label>
                    <div style="position: relative;">
                        <input type="text" 
                               id="reportsStudentSearchInput" 
                               placeholder="Digite o nome do aluno..." 
                               autocomplete="off"
                               style="width: 100%; padding: 12px 40px 12px 16px; border: 2px solid #e1e5e9; border-radius: 8px; font-size: 14px; outline: none; transition: border-color 0.3s ease;">
                        <i class="fas fa-search" style="position: absolute; right: 12px; top: 50%; transform: translateY(-50%); color: #6c757d; pointer-events: none;"></i>
                        <div id="reportsStudentSuggestions" style="position: absolute; top: 100%; left: 0; right: 0; background: white; border: 1px solid #ddd; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.15); max-height: 300px; overflow-y: auto; z-index: 1050; display: none; margin-top: 4px;"></div>
                    </div>
                </div>
                <div class="filter-group">
                    <label style="display: block; margin-bottom: 8px; font-weight: 600; color: #495057;">Período:</label>
                    <select id="studentPeriodFilter" onchange="updateStudentReports()" style="width: 100%; padding: 10px; border: 2px solid #e1e5e9; border-radius: 8px; font-size: 14px;">
                        <option value="current-month">Mês Atual</option>
                        <option value="last-month">Mês Anterior</option>
                        <option value="current-year">Ano Atual</option>
                        <option value="all-time">Todo o Período</option>
                    </select>
                </div>
            </div>
            
            <div class="student-reports-empty">
                <div class="empty-state-icon">
                    <i class="fas fa-user-graduate" style="font-size: 64px; color: #dee2e6; margin-bottom: 20px;"></i>
                </div>
                <h4 style="color: #495057; margin-bottom: 12px; font-weight: 600;">Selecione um Aluno</h4>
                <p style="margin-bottom: 8px; line-height: 1.5;">Use a busca inteligente acima para encontrar e selecionar um aluno.</p>
                <p class="text-muted" style="color: #6c757d;">Total de ${students ? students.length : 0} alunos disponíveis</p>
            </div>
        `;
        
        // Verificar se foi criado
        const newField = document.getElementById('reportsStudentSearchInput');
        if (newField) {
            console.log('✅ Campo criado COM SUCESSO na aba de ALUNOS!');
            
            // Adicionar eventos visuais
            newField.addEventListener('focus', function() {
                this.style.borderColor = '#007bff';
                this.style.boxShadow = '0 0 0 0.2rem rgba(0, 123, 255, 0.25)';
            });
            
            newField.addEventListener('blur', function() {
                this.style.borderColor = '#e1e5e9';
                this.style.boxShadow = 'none';
            });
            
            // Inicializar busca após criação
            setTimeout(() => {
                if (typeof initializeReportsStudentSearch === 'function') {
                    initializeReportsStudentSearch();
                    console.log('✅ Campo de busca criado e inicializado automaticamente!');
                }
            }, 200);
        }
    }, 1000);
}

// Executar verificação sempre que a aba de alunos for carregada
const originalLoadStudentsReports = window.loadStudentsReports;
if (typeof originalLoadStudentsReports === 'function') {
    window.loadStudentsReports = function() {
        const result = originalLoadStudentsReports.apply(this, arguments);
        ensureSearchFieldExists();
        return result;
    };
} else {
    // Se não existe, criar interceptador para showReportsTab
    const originalShowReportsTab = window.showReportsTab;
    if (typeof originalShowReportsTab === 'function') {
        window.showReportsTab = function(tabType) {
            const result = originalShowReportsTab.apply(this, arguments);
            if (tabType === 'students') {
                ensureSearchFieldExists();
            }
            return result;
        };
    }
}

// Executar verificação automática ao carregar
setTimeout(ensureSearchFieldExists, 2000);
setTimeout(ensureSearchFieldExists, 5000);

console.log('🔧 Sistema de auto-correção do campo de busca ativado!');

console.log('✅ Módulo de Relatórios v3.1.0 carregado com sucesso!');