/* ==================== SPEAKENGLISH v2.5.0 - SCRIPT PRINCIPAL ==================== */

// ==================== VARIÁVEIS GLOBAIS ====================
let students = JSON.parse(localStorage.getItem('students')) || [];
let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
let bookTasks = JSON.parse(localStorage.getItem('bookTasks')) || [];
let achievements = JSON.parse(localStorage.getItem('achievements')) || [];
let attendance = JSON.parse(localStorage.getItem('attendance')) || {};
let reposicoes = JSON.parse(localStorage.getItem('reposicoes')) || [];
let contratos = JSON.parse(localStorage.getItem('contratos')) || [];
let mensalidades = JSON.parse(localStorage.getItem('mensalidades')) || []; // Sistema de mensalidades automáticas
let pagamentos = JSON.parse(localStorage.getItem('pagamentos')) || []; // Mantido para compatibilidade
let aulasDadas = JSON.parse(localStorage.getItem('aulasDadas')) || [];

// Variáveis de controle
let currentPage = 1;
let itemsPerPage = 10;
let currentAchievementsPage = 1;
let achievementsItemsPerPage = 10;
let studentsItemsPerPage = 10;
let currentStudentsPage = 1;
let isEditingStudent = false;
let editingStudentId = null;
let filteredStudentsData = []; // Variável para dados filtrados dos alunos

// Configurações do sistema
let systemConfig = JSON.parse(localStorage.getItem('systemConfig')) || {
    pointsConfig: {
        presenca: 5,
        tarefa: 10,
        sequencia: 2,
        bonus: 5
    },
    levelsConfig: [
        { name: 'Bronze', points: 0, icon: '', class: 'level-bronze' },
        { name: 'Prata', points: 300, icon: '', class: 'level-prata' },
        { name: 'Ouro', points: 700, icon: '', class: 'level-ouro' },
        { name: 'Platina', points: 1200, icon: '', class: 'level-platina' },
        { name: 'Diamante', points: 1800, icon: '', class: 'level-diamante' },
        { name: 'Mestre', points: 2500, icon: '', class: 'level-mestre' },
        { name: 'Lenda', points: 3500, icon: '', class: 'level-lenda' }
    ]
};

// Estado atual da aplicação
let currentUser = null;
let currentUserType = null;

// ==================== INICIALIZAÇÃO ====================
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 SpeakEnglish inicializando...');
    
    // Verificar elementos essenciais
    checkEssentialElements();
    
    initializeApp();
    setupEventListeners();
    initializeAchievements();
    updateDashboard();
    setAttendanceDate();
});

function checkEssentialElements() {
    console.log('🔍 Verificando elementos essenciais...');
    
    const essentialElements = [
        'addStudentModal',
        'addStudentForm',
        'studentName',
        'studentEmail',
        'studentLevel',
        'studentsGrid'
    ];
    
    const missingElements = [];
    
    essentialElements.forEach(id => {
        const element = document.getElementById(id);
        if (!element) {
            missingElements.push(id);
            console.error(`❌ Elemento não encontrado: ${id}`);
        } else {
            console.log(`✅ Elemento encontrado: ${id}`);
        }
    });
    
    if (missingElements.length > 0) {
        console.error('❌ Elementos faltando:', missingElements);
        alert(`Erro: Os seguintes elementos não foram encontrados: ${missingElements.join(', ')}`);
    } else {
        console.log('✅ Todos os elementos essenciais encontrados!');
    }
}

function initializeApp() {
    console.log(' Inicializando SpeakEnglish v2.5.0');
    
    // Inicializar variáveis globais do sistema de upload
    if (typeof selectedFiles === 'undefined') {
        window.selectedFiles = [];
        console.log('📁 Variável selectedFiles inicializada');
    }
    if (typeof editSelectedFiles === 'undefined') {
        window.editSelectedFiles = [];
        console.log('📁 Variável editSelectedFiles inicializada');
    }
    
    // Verificar se há usuário logado
    const savedUser = localStorage.getItem('currentUser');
    const savedUserType = localStorage.getItem('currentUserType');
    
    if (savedUser && savedUserType) {
        currentUser = savedUser;
        currentUserType = savedUserType;
        
        if (currentUserType === 'professor') {
            showMainInterface();
            
                // Inicializar sistema de mensalidades
    setTimeout(() => {
        initializeMensalidadesSystem();
    }, 500);
            
            // Atualizar info do usuário no header
            setTimeout(() => {
                const userInfo = document.getElementById('userInfo');
                if (userInfo) {
                    userInfo.innerHTML = '<i class="fas fa-user"></i> ' + currentUser;
                }
            }, 100);
        } else if (currentUserType === 'aluno') {
            // Carregar interface do aluno
            const savedUserData = localStorage.getItem('currentUserData');
            if (savedUserData) {
                const userData = JSON.parse(savedUserData);
                if (typeof showStudentInterface === 'function') {
                    showStudentInterface(userData);
                } else {
                    console.error('Função showStudentInterface não encontrada');
                    logout();
                }
            } else {
                console.error('Dados do aluno não encontrados');
                logout();
            }
        } else {
            showStudentInterface();
        }
    } else {
        showLoginScreen();
    }
}

function setupEventListeners() {
    // Event listeners para abas
    const tabs = document.querySelectorAll('.tab');
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const tabName = tab.getAttribute('onclick').match(/'([^']+)'/)[1];
            showTab(tabName);
        });
    });

    // Event listeners para rankings
    const rankingPeriods = document.querySelectorAll('.ranking-period');
    rankingPeriods.forEach(period => {
        period.addEventListener('click', () => {
            const periodType = period.getAttribute('data-period');
            updateRanking(periodType);
        });
    });

    // Event listener para formulário de login
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
    
    // Event listener para fechar modal com ESC
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            // Fechar todos os modais visíveis
            const modals = document.querySelectorAll('.modal');
            modals.forEach(modal => {
                if (modal.style.display === 'flex' || modal.style.display === 'block' || modal.classList.contains('show')) {
                    closeModal(modal.id);
                }
            });
        }
    });
    
    // Event listener para fechar modal clicando no backdrop
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('modal')) {
            closeModal(e.target.id);
        }
    });

    // Data de presença automática
    const attendanceDate = document.getElementById('attendanceDate');
    if (attendanceDate) {
        attendanceDate.value = new Date().toISOString().split('T')[0];
        // Adicionar listener para mudança de data
        attendanceDate.addEventListener('change', function() {
            console.log('📅 Data de presença alterada para:', this.value);
            loadAttendance();
        });
    }
}

// ==================== SISTEMA DE LOGIN ====================
function showLoginScreen() {
    document.getElementById('loginScreen').style.display = 'block';
    document.getElementById('mainInterface').style.display = 'none';
    
    // Configurar event listener para o formulário de login
    setTimeout(() => {
        const loginForm = document.getElementById('loginForm');
        if (loginForm) {
            // Remover listeners existentes se houver
            loginForm.removeEventListener('submit', handleLogin);
            // Adicionar novo listener
            loginForm.addEventListener('submit', handleLogin);
            console.log('✅ Event listener do login configurado');
        } else {
            console.error('❌ Formulário de login não encontrado');
        }
    }, 100);
}

function showMainInterface() {
    document.getElementById('loginScreen').style.display = 'none';
    document.getElementById('mainInterface').style.display = 'block';
    updateDashboard();
    // REMOVIDO: Carregamento automático de alunos - deixar carregar apenas quando usuário acessar a aba
    // loadStudents();
    
    // Corrigir contratos existentes automaticamente após carregamento
    setTimeout(() => {
        if (window.contratos && contratos.length > 0) {
            console.log('🔧 Verificando contratos existentes para correção...');
            fixExistingContracts();
        }
    }, 2000); // Aguardar 2 segundos para garantir que tudo foi carregado
}

function handleLogin(e) {
    e.preventDefault();
    
    const user = document.getElementById('loginUser').value.trim();
    const password = document.getElementById('loginPassword').value;
    const loginError = document.getElementById('loginError');
    
    // Usar função de validação do auth.js
    const loginResult = validateLogin(user, password);
    
    if (loginResult.success) {
        currentUser = loginResult.userData.name;
        currentUserType = loginResult.userType;
        
        localStorage.setItem('currentUser', currentUser);
        localStorage.setItem('currentUserType', currentUserType);
        
        if (loginResult.userType === 'professor') {
            showMainInterface();
            document.getElementById('userInfo').innerHTML = '<i class="fas fa-user"></i> ' + currentUser;
        } else if (loginResult.userType === 'aluno') {
            // Salvar dados completos do aluno
            localStorage.setItem('currentUserData', JSON.stringify(loginResult.userData));
            localStorage.setItem('currentStudentEmail', loginResult.userData.email);
            
            // Chamar interface do aluno
            if (typeof showStudentInterface === 'function') {
                showStudentInterface(loginResult.userData);
            } else {
                console.error('Função showStudentInterface não encontrada');
                alert('Erro ao carregar interface do aluno. Tente novamente.');
            }
        }
        
        loginError.style.display = 'none';
        
    } else {
        loginError.style.display = 'block';
        loginError.textContent = loginResult.message || 'Usuário ou senha incorretos!';
        
        // Limpar senha e focar novamente
        document.getElementById('loginPassword').value = '';
        document.getElementById('loginPassword').focus();
    }
}

function logout() {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('currentUserType');
    localStorage.removeItem('currentStudentEmail');
    
    currentUser = null;
    currentUserType = null;
    
    showLoginScreen();
    
    // Limpar formulário
    document.getElementById('loginUser').value = '';
    document.getElementById('loginPassword').value = '';
}

function switchLoginTab(type) {
    const tabs = document.querySelectorAll('.login-tab');
    tabs.forEach(tab => tab.classList.remove('active'));
    
    event.target.classList.add('active');
    
    const userInput = document.getElementById('loginUser');
    const userLabel = document.querySelector('label[for="loginUser"]');
    
    if (type === 'professor') {
        userLabel.textContent = 'Usuário';
        userInput.placeholder = 'Digite seu usuário';
    } else {
        userLabel.textContent = 'Email';
        userInput.placeholder = 'Digite seu email';
    }
}

// ==================== SISTEMA DE NAVEGAÇÃO ====================
function showTab(tabName) {
    // Esconder todas as abas
    const allTabs = document.querySelectorAll('.tab-content');
    allTabs.forEach(tab => tab.classList.remove('active'));
    
    // Remover active de todos os botões
    const allTabButtons = document.querySelectorAll('.tab');
    allTabButtons.forEach(btn => btn.classList.remove('active'));
    
    // Mostrar aba selecionada
    const selectedTab = document.getElementById(tabName);
    if (selectedTab) {
        selectedTab.classList.add('active');
    }
    
    // Marcar botão como ativo
    const activeButton = document.querySelector(`[onclick="showTab('${tabName}')"]`);
    if (activeButton) {
        activeButton.classList.add('active');
    }
    
    // Carregar conteúdo específico da aba
    switch(tabName) {
        case 'dashboard':
            updateDashboard();
            break;
        case 'students':
            // Limpar qualquer sistema antigo antes de carregar o novo
            cleanOldStudentsSystem();
            loadStudents();
            break;
        case 'attendance':
            loadAttendance();
            break;
        case 'tasks':
            loadTasks();
            loadBookTasks();
            break;
        case 'achievements':
            loadAchievements();
            // Verificar conquistas automáticas quando entrar na aba
            checkAllStudentsAchievements();
            break;
        case 'reposicoes':
            loadReposicoes();
            break;
        case 'gestao':
            loadGestao();
            break;
        case 'rankings':
            updateRanking('geral');
            break;
        case 'config':
            loadConfigurations();
            break;
    }
}

// ==================== DASHBOARD ====================
function updateDashboard() {
    // Atualizar estatísticas
    document.getElementById('totalStudents').textContent = students.length;
    
    // Calcular presenças de hoje
    const today = new Date().toISOString().split('T')[0];
    const todayAttendance = attendance[today] || {};
    const presentToday = Object.values(todayAttendance).filter(present => present).length;
    document.getElementById('attendanceToday').textContent = presentToday;
    
    // Contar tarefas ativas (gerais + livro)
    const activeTasks = tasks.filter(task => !task.completed).length + 
                       bookTasks.filter(task => !task.completed).length;
    document.getElementById('activeTasks').textContent = activeTasks;
    
    // Contar conquistas desbloqueadas
    const unlockedAchievements = students.reduce((total, student) => {
        return total + (student.achievements ? student.achievements.length : 0);
    }, 0);
    document.getElementById('totalAchievements').textContent = unlockedAchievements;
    
    // Atualizar top 5 alunos
    updateTopStudents();
}

function updateTopStudents() {
    const topStudents = [...students]
        .sort((a, b) => calculateTotalPoints(b) - calculateTotalPoints(a))
        .slice(0, 5);
    
    const container = document.getElementById('topStudents');
    container.innerHTML = '';
    
    topStudents.forEach((student, index) => {
        const points = calculateTotalPoints(student);
        const level = getStudentLevel(student);
        
        const item = document.createElement('div');
        item.className = 'ranking-item';
        item.innerHTML = `
            <div class="ranking-position ${getPositionClass(index)}">${index + 1}º</div>
            <div class="ranking-info">
                <div class="ranking-name">${student.name}</div>
                <div class="ranking-details">
                    <span class="level-badge ${level.class}">${level.icon} ${level.name}</span>
                </div>
            </div>
            <div class="ranking-score">${points} pts</div>
        `;
        container.appendChild(item);
    });
}

function getPositionClass(index) {
    switch(index) {
        case 0: return 'gold';
        case 1: return 'silver';
        case 2: return 'bronze';
        default: return '';
    }
}

// ==================== GESTÃO DE ALUNOS ====================

function cleanOldStudentsSystem() {
    console.log('🧹 Limpando sistema antigo de alunos...');
    
    try {
        // Remover event listeners antigos
        const oldLevelFilter = document.querySelector('#students select[onchange*="filterStudents"]');
        if (oldLevelFilter) {
            oldLevelFilter.onchange = null;
            console.log('✅ Event listener antigo removido');
        }
        
        // Remover controles antigos se existirem
        const oldControls = document.querySelector('#students .students-controls');
        if (oldControls) {
            // Manter apenas o botão de adicionar aluno
            const addButton = oldControls.querySelector('button[onclick*="showAddStudentModal"]');
            if (addButton) {
                const parentElement = addButton.parentNode;
                if (parentElement) {
                    parentElement.innerHTML = '';
                    parentElement.appendChild(addButton);
                }
            }
        }
        
        // Limpar quaisquer listeners globais antigos
        window.filterStudents = function() {
            console.log('🔄 Redirecionando para novo sistema...');
            if (typeof window.filterStudentsRealTime === 'function') {
                window.filterStudentsRealTime();
            }
        };
        
        console.log('✅ Sistema antigo limpo');
    } catch (error) {
        console.error('❌ Erro ao limpar sistema antigo:', error);
    }
}

function loadStudents() {
    console.log('👥 Carregando alunos com sistema de busca...');
    
    const container = document.getElementById('studentsGrid');
    if (!container) {
        console.error('❌ Container studentsGrid não encontrado!');
        return;
    }
    
    // Limpar completamente o container
    container.innerHTML = '';
    
    // Garantir que o container tenha layout em coluna
    container.style.display = 'flex';
    container.style.flexDirection = 'column';
    container.style.width = '100%';
    
    // Resetar variáveis de paginação
    studentsCurrentPage = 1;
    studentsSearchTerm = '';
    filteredStudentsData = [...students];
    
    // Criar estrutura de busca no topo e lista abaixo
    container.innerHTML = `
        <!-- Sistema de busca para alunos - TOPO -->
        <div class="students-search-header">
            <div class="search-main-row">
                <div class="search-input-group">
                    <i class="fas fa-search"></i>
                    <input type="text" id="studentsSearchInput" class="search-input" 
                           placeholder="Digite o nome do aluno, email ou nível...">
                    <button class="clear-search" id="clearStudentsSearchBtn" onclick="clearStudentsSearch()" style="display: none;">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                
                <!-- Filtros rápidos -->
                <div class="quick-filters">
                    <select id="levelFilter" class="filter-select">
                        <option value="">Todos os Níveis</option>
                        <option value="A1">A1</option>
                        <option value="A2">A2</option>
                        <option value="B1">B1</option>
                        <option value="B2">B2</option>
                        <option value="C1">C1</option>
                        <option value="C2">C2</option>
                    </select>
                    
                    <select id="statusFilter" class="filter-select">
                        <option value="">Todos os Status</option>
                        <option value="ativo">Ativo</option>
                        <option value="inativo">Inativo</option>
                    </select>
                </div>
            </div>
            
            <div class="search-results-info" id="studentsSearchResultsInfo">
                <!-- Informações dos resultados -->
            </div>
        </div>
        
        <!-- Lista de alunos embaixo -->
        <div id="studentsCardGrid" class="students-card-grid">
            <!-- Alunos serão carregados aqui -->
        </div>
        
        <!-- Controles de paginação para alunos -->
        <div class="pagination-controls" id="studentsPaginationControls" style="display: none;">
            <button class="pagination-btn" id="studentsPrevPageBtn" onclick="changeStudentsPage(-1)">
                <i class="fas fa-chevron-left"></i> Anterior
            </button>
            <div class="pagination-info" id="studentsPaginationInfo">
                <!-- Página X de Y -->
            </div>
            <button class="pagination-btn" id="studentsNextPageBtn" onclick="changeStudentsPage(1)">
                Próximo <i class="fas fa-chevron-right"></i>
            </button>
        </div>
    `;
    
    // Renderizar lista inicial
    renderStudentsCardsList();
    
    // Configurar event listeners para busca em tempo real
    setTimeout(() => {
        // Verificar se ainda estamos na aba students
        const studentsTab = document.getElementById('students');
        if (!studentsTab || !studentsTab.classList.contains('active')) {
            console.log('⏭️ Não estamos mais na aba students, cancelando configuração');
            return;
        }
        
        const searchInput = document.getElementById('studentsSearchInput');
        const levelFilter = document.getElementById('levelFilter');
        const statusFilter = document.getElementById('statusFilter');
        
        console.log('🔍 Configurando event listeners...');
        console.log('- searchInput encontrado:', !!searchInput);
        console.log('- levelFilter encontrado:', !!levelFilter);
        console.log('- statusFilter encontrado:', !!statusFilter);
        
        if (searchInput && typeof searchInput.value !== 'undefined' && searchInput.parentNode) {
            // Limpar qualquer event listener anterior
            searchInput.oninput = null;
            searchInput.onkeyup = null;
            searchInput.onchange = null;
            
            // Método direto e simples com verificações de segurança
            searchInput.oninput = function(event) {
                try {
                    if (this && typeof this.value !== 'undefined') {
                        console.log('🔍 Busca executada:', this.value);
                        // Pequeno delay para melhor performance
                        clearTimeout(window.studentsSearchTimeout);
                        window.studentsSearchTimeout = setTimeout(() => {
                            filterStudentsRealTime();
                        }, 150);
                    }
                } catch (error) {
                    console.error('❌ Erro no oninput:', error);
                }
            };
            
            searchInput.onkeyup = function(event) {
                try {
                    if (this && typeof this.value !== 'undefined') {
                        console.log('🔍 Tecla liberada:', this.value);
                        filterStudentsRealTime();
                    }
                } catch (error) {
                    console.error('❌ Erro no onkeyup:', error);
                }
            };
            
            // Backup usando addEventListener
            try {
                searchInput.addEventListener('input', function(event) {
                    if (this && typeof this.value !== 'undefined') {
                        clearTimeout(window.studentsSearchTimeout);
                        window.studentsSearchTimeout = setTimeout(() => {
                            filterStudentsRealTime();
                        }, 150);
                    }
                });
            } catch (e) {
                console.warn('⚠️ addEventListener falhou, usando apenas oninput');
            }
            
            console.log('✅ Event listeners do campo de busca configurados');
        } else {
            console.error('❌ Campo de busca studentsSearchInput não encontrado ou inválido!');
        }
        
        if (levelFilter && typeof levelFilter.value !== 'undefined' && levelFilter.parentNode) {
            // Limpar event listeners anteriores
            levelFilter.onchange = null;
            
            levelFilter.onchange = function(event) {
                try {
                    if (this && typeof this.value !== 'undefined') {
                        console.log('🎚️ Nível selecionado:', this.value);
                        filterStudentsRealTime();
                    }
                } catch (error) {
                    console.error('❌ Erro no filtro de nível:', error);
                }
            };
            
            // Backup com addEventListener
            try {
                levelFilter.addEventListener('change', function(event) {
                    if (this && typeof this.value !== 'undefined') {
                        filterStudentsRealTime();
                    }
                });
            } catch (e) {
                console.warn('⚠️ addEventListener do filtro de nível falhou');
            }
            
            console.log('✅ Event listener do filtro de nível configurado');
        } else {
            console.warn('⚠️ Filtro de nível não encontrado');
        }
        
        if (statusFilter && typeof statusFilter.value !== 'undefined' && statusFilter.parentNode) {
            // Limpar event listeners anteriores
            statusFilter.onchange = null;
            
            statusFilter.onchange = function(event) {
                try {
                    if (this && typeof this.value !== 'undefined') {
                        console.log('📊 Status selecionado:', this.value);
                        filterStudentsRealTime();
                    }
                } catch (error) {
                    console.error('❌ Erro no filtro de status:', error);
                }
            };
            
            // Backup com addEventListener
            try {
                statusFilter.addEventListener('change', function(event) {
                    if (this && typeof this.value !== 'undefined') {
                        filterStudentsRealTime();
                    }
                });
            } catch (e) {
                console.warn('⚠️ addEventListener do filtro de status falhou');
            }
            
            console.log('✅ Event listener do filtro de status configurado');
        } else {
            console.warn('⚠️ Filtro de status não encontrado');
        }
        
        console.log('✅ Todos os event listeners de busca configurados');
        
        // Teste inicial (com verificação final)
        if (searchInput && levelFilter && statusFilter) {
            console.log('🧪 Executando teste inicial do filtro...');
            try {
                filterStudentsRealTime();
                console.log('✅ Sistema inicializado com sucesso!');
            } catch (error) {
                console.error('❌ Erro no teste inicial:', error);
                console.log('🔄 Tentando novamente em 1 segundo...');
                // REMOVIDO: Retry automático que causava piscar dos cards
                // setTimeout(() => {
                //     try {
                //         filterStudentsRealTime();
                //     } catch (e) {
                //         console.error('❌ Erro persistente:', e);
                //         console.log('💡 Use recoverStudentsSystem() para tentar recuperar');
                //     }
                // }, 1000);
            }
        } else {
            console.error('❌ Nem todos os elementos foram encontrados:', {
                searchInput: !!searchInput,
                levelFilter: !!levelFilter, 
                statusFilter: !!statusFilter
            });
        }
    }, 200);
    
    console.log(`✅ Sistema de alunos com busca inicializado`);
    
    // Verificação automática de integridade após carregamento
    setTimeout(() => {
        console.log('🔍 Executando verificação automática de integridade...');
        const isHealthy = verifyStudentsSystemIntegrity();
        
        if (isHealthy) {
            console.log('🎯 Sistema verificado e funcionando corretamente!');
            // Iniciar monitoramento automático
            // startStudentsSystemMonitoring();
        } else {
            console.log('⚠️ Problemas detectados - verifique os logs acima');
        }
    }, 1000);
    
    // Adicionar instruções para o usuário
    console.log(`
🎯 SISTEMA DE ALUNOS CARREGADO:
📝 Para usar: Digite no campo de busca ou use os filtros
🧪 Para testar: Execute testCompleteStudentsSystem() no console
🔍 Para verificar: Execute verifyStudentsSystemIntegrity() no console
🚨 Em caso de erro: Execute recoverStudentsSystem() no console
📋 Total de alunos carregados: ${students.length}
    `);
}

// ==================== SISTEMA DE BUSCA E PAGINAÇÃO DE ALUNOS ====================

// Função para renderizar a lista de alunos com paginação
function renderStudentsCardsList() {
    const container = document.getElementById('studentsCardGrid');
    if (!container) {
        console.warn('⚠️ Container studentsCardGrid não encontrado - sistema pode não estar carregado');
        return;
    }
    
    container.innerHTML = '';
    
    if (students.length === 0) {
        container.innerHTML = '<div class="no-data-students"><i class="fas fa-users"></i><p>Nenhum aluno cadastrado</p></div>';
        updateStudentsSearchInfo(0, 0);
        hideStudentsPagination();
        return;
    }
    
    if (filteredStudentsData.length === 0) {
        container.innerHTML = '<div class="no-data-students"><i class="fas fa-search"></i><p>Nenhum aluno encontrado para os critérios de busca</p></div>';
        updateStudentsSearchInfo(0, students.length);
        hideStudentsPagination();
        return;
    }
    
    // Calcular paginação
    const totalPages = Math.ceil(filteredStudentsData.length / studentsItemsPerPage);
    const startIndex = (studentsCurrentPage - 1) * studentsItemsPerPage;
    const endIndex = startIndex + studentsItemsPerPage;
    const currentStudents = filteredStudentsData.slice(startIndex, endIndex);
    
    // Renderizar alunos em cards compactos
    currentStudents.forEach((student, localIndex) => {
        const actualIndex = students.findIndex(s => s.email === student.email);
        const studentCard = createCompactStudentCard(student, actualIndex);
        container.appendChild(studentCard);
    });
    
    // Atualizar informações
    updateStudentsSearchInfo(filteredStudentsData.length, students.length);
    updateStudentsPagination(studentsCurrentPage, totalPages);
}

// Função para criar card compacto de aluno
function createCompactStudentCard(student, index) {
    const card = document.createElement('div');
    card.className = 'student-card-compact';
    
    const totalPoints = calculateTotalPoints(student);
    const level = getStudentLevel(student);
    const streak = student.attendanceStreak || 0;
    
    // Verificar se tem aula hoje
    const today = new Date().getDay();
    const dayNames = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
    const todayName = dayNames[today];
    const hasClassToday = student.classDays && student.classDays.includes(todayName);
    
    // Verificar se tem contrato ativo
    const hasActiveContract = contratos.some(c => 
        c.studentEmail === student.email && c.status === 'ativo'
    );
    
    // Verificar se tem mensalidades vencidas
    const hasOverdue = hasOverdueMensalidades(student.email);
    
    let statusClass = hasActiveContract ? 'ativo' : 'inativo';
    let statusText = hasActiveContract ? 'Ativo' : 'Inativo';
    
    if (hasClassToday) {
        card.classList.add('status-highlight');
    }
    
    card.innerHTML = `
        <div class="student-header-compact">
            <div class="student-info-compact">
                <div class="student-avatar-small2">
                    <i class="fas fa-user"></i>
                </div>
                <div class="student-name-level-compact">
                    <strong>${highlightStudentsSearchTerm(student.name, studentsSearchTerm)}</strong>
                    <small>${student.email}</small>
                    <span class="level-badge-compact level-${getLevelCssClass(student.level)}">${student.level}</span>
                </div>
            </div>
                         <div class="student-status-compact">
                 <span class="status-badge-compact status-${statusClass}">
                     <i class="fas fa-${getStudentStatusIcon(statusClass)}"></i> ${statusText.toUpperCase()}
                 </span>
                 ${hasClassToday ? '<span class="class-today-badge"><i class="fas fa-chalkboard-teacher"></i> Aula Hoje</span>' : ''}
                 ${hasOverdue ? '<span class="overdue-badge"><i class="fas fa-exclamation-triangle"></i> Mensalidade Vencida</span>' : ''}
             </div>
        </div>
        
        <div class="student-body-compact">
            <div class="student-stats-compact">
                <div class="stat-item-compact">
                    <i class="fas fa-trophy"></i>
                    <span class="stat-value">${totalPoints}</span>
                    <span class="stat-label">Pontos</span>
                </div>
                <div class="stat-item-compact">
                    <i class="fas fa-calendar-check"></i>
                    <span class="stat-value">${student.attendanceCount || 0}</span>
                    <span class="stat-label">Presenças</span>
                </div>
                <div class="stat-item-compact">
                    <i class="fas fa-fire"></i>
                    <span class="stat-value">${streak}</span>
                    <span class="stat-label">Sequência</span>
                </div>
                <div class="stat-item-compact">
                    <i class="fas fa-tasks"></i>
                    <span class="stat-value">${student.tasksCompleted || 0}</span>
                    <span class="stat-label">Tarefas</span>
                </div>
            </div>
            
            <div class="student-schedule-compact">
                ${student.classTime ? `
                    <div class="schedule-item">
                        <i class="fas fa-clock"></i>
                        <span>${student.classTime}</span>
                    </div>
                ` : ''}
                ${student.classDays && student.classDays.length > 0 ? `
                    <div class="schedule-item">
                        <i class="fas fa-calendar"></i>
                        <span>${student.classDays.join(', ')}</span>
                    </div>
                ` : ''}
            </div>
            
            <div class="progress-container-compact">
                <div class="progress-text-compact">${level.name} → ${getNextLevel(level).name}</div>
                <div class="progress-bar-compact">
                    <div class="progress-fill-compact" style="width: ${calculateLevelProgress(student)}%"></div>
                </div>
                <div class="progress-info-compact">${totalPoints}/${getNextLevel(level).points} pontos</div>
            </div>
        </div>
        
        <div class="student-actions-compact">
            <button class="btn-compact-text btn-edit" onclick="editStudent(${index})">
                <i class="fas fa-edit"></i>
                <span>Editar</span>
            </button>
            <button class="btn-compact-text btn-bonus" onclick="giveBonus(${index})">
                <i class="fas fa-plus"></i>
                <span>Bônus</span>
            </button>
            <button class="btn-compact-text btn-view" onclick="viewStudentHistory(${index})">
                <i class="fas fa-history"></i>
                <span>Histórico</span>
            </button>
            <button class="btn-compact-text btn-delete" onclick="removeStudent(${index})">
                <i class="fas fa-trash"></i>
                <span>Excluir</span>
            </button>
        </div>
    `;
    
    return card;
}

// Função para filtrar alunos em tempo real
window.filterStudentsRealTime = function() {
    try {
        console.log('🔍 Executando filtro de alunos em tempo real...');
        
        const searchInput = document.getElementById('studentsSearchInput');
        const levelFilter = document.getElementById('levelFilter');
        const statusFilter = document.getElementById('statusFilter');
        const clearBtn = document.getElementById('clearStudentsSearchBtn');
        
        // Verificações de segurança mais robustas
        if (!searchInput || typeof searchInput.value === 'undefined' || !searchInput.parentNode) {
            console.error('❌ Campo de busca não encontrado ou inválido!');
            console.log('🔄 Tentando localizar elementos novamente...');
            // Tentar encontrar elementos novamente
            setTimeout(() => {
                const retryInput = document.getElementById('studentsSearchInput');
                if (retryInput && typeof retryInput.value !== 'undefined') {
                    console.log('✅ Elementos encontrados na segunda tentativa');
                    filterStudentsRealTime();
                } else {
                    console.error('❌ Elementos ainda não encontrados - use recoverStudentsSystem()');
                }
            }, 500);
            return;
        }
        
        if (!students || !Array.isArray(students)) {
            console.error('❌ Array de alunos não encontrado!');
            return;
        }
        
        console.log('✅ Elementos encontrados, continuando com filtro...');
        
        studentsSearchTerm = searchInput.value.toLowerCase().trim();
        const selectedLevel = levelFilter ? levelFilter.value : '';
        const selectedStatus = statusFilter ? statusFilter.value : '';
        
        console.log('🔍 Filtros aplicados:', {
            searchTerm: studentsSearchTerm,
            level: selectedLevel,
            status: selectedStatus,
            totalStudents: students.length
        });
        
        // Mostrar/ocultar botão de limpar (com verificação de segurança)
        if (clearBtn && clearBtn.parentNode && typeof clearBtn.style === 'object') {
            try {
                if (studentsSearchTerm || selectedLevel || selectedStatus) {
                    clearBtn.style.display = 'block';
                } else {
                    clearBtn.style.display = 'none';
                }
            } catch (error) {
                console.warn('⚠️ Erro ao alterar botão de limpar:', error);
            }
        } else {
            console.warn('⚠️ Botão de limpar não encontrado ou inválido - continuando sem ele');
        }
        
        // Filtrar alunos
        filteredStudentsData = students.filter(student => {
            const matchesSearch = !studentsSearchTerm || 
                student.name.toLowerCase().includes(studentsSearchTerm) ||
                student.email.toLowerCase().includes(studentsSearchTerm) ||
                student.level.toLowerCase().includes(studentsSearchTerm);
            
            const matchesLevel = !selectedLevel || student.level === selectedLevel;
            
            // Verificar status (se tem contrato ativo)
            const hasActiveContract = contratos.some(c => 
                c.studentEmail === student.email && c.status === 'ativo'
            );
            const currentStatus = hasActiveContract ? 'ativo' : 'inativo';
            const matchesStatus = !selectedStatus || currentStatus === selectedStatus;
            
            // REMOVIDO: Log detalhado que causava lentidão e piscar dos cards
            
            return matchesSearch && matchesLevel && matchesStatus;
        });
        
        // Resetar para primeira página
        studentsCurrentPage = 1;
        
        console.log(`✅ Filtro concluído - ${filteredStudentsData.length} alunos encontrados`);
        
        // Renderizar lista atualizada
        renderStudentsCardsList();
        
    } catch (error) {
        console.error('❌ Erro durante a execução do filtro:', error);
        console.log('🔄 Tentando renderizar sem filtro...');
        filteredStudentsData = [...students];
        renderStudentsCardsList();
    }
};

// Função para limpar busca de alunos
window.clearStudentsSearch = function() {
    const searchInput = document.getElementById('studentsSearchInput');
    const levelFilter = document.getElementById('levelFilter');
    const statusFilter = document.getElementById('statusFilter');
    const clearBtn = document.getElementById('clearStudentsSearchBtn');
    
    if (searchInput) searchInput.value = '';
    if (levelFilter) levelFilter.value = '';
    if (statusFilter) statusFilter.value = '';
    if (clearBtn && clearBtn.parentNode && typeof clearBtn.style === 'object') {
        try {
            clearBtn.style.display = 'none';
        } catch (error) {
            console.warn('⚠️ Erro ao alterar botão de limpar:', error);
        }
    }
    
    studentsSearchTerm = '';
    filteredStudentsData = [...students];
    studentsCurrentPage = 1;
    
    renderStudentsCardsList();
};

// Função para navegar entre páginas de alunos
window.changeStudentsPage = function(direction) {
    const totalPages = Math.ceil(filteredStudentsData.length / studentsItemsPerPage);
    
    if (direction === 1 && studentsCurrentPage < totalPages) {
        studentsCurrentPage++;
    } else if (direction === -1 && studentsCurrentPage > 1) {
        studentsCurrentPage--;
    }
    
    renderStudentsCardsList();
};

// Função de debug para testar busca
window.testStudentsFilter = function() {
    console.log('🧪 Testando sistema de filtros de alunos...');
    
    if (typeof window.filterStudentsRealTime === 'function') {
        console.log('✅ Função filterStudentsRealTime encontrada');
        window.filterStudentsRealTime();
    } else {
        console.error('❌ Função filterStudentsRealTime não encontrada');
    }
    
    // Verificar se os elementos estão presentes
    const searchInput = document.getElementById('studentsSearchInput');
    const levelFilter = document.getElementById('levelFilter');
    const statusFilter = document.getElementById('statusFilter');
    
    console.log('🔍 Verificando elementos:');
    console.log('- Campo de busca:', searchInput ? '✅ Encontrado' : '❌ Não encontrado');
    console.log('- Filtro de nível:', levelFilter ? '✅ Encontrado' : '❌ Não encontrado');
    console.log('- Filtro de status:', statusFilter ? '✅ Encontrado' : '❌ Não encontrado');
    
    if (searchInput) {
        console.log('- Valor atual do campo:', `"${searchInput.value}"`);
        console.log('- Event listeners ativos:', !!searchInput.oninput);
    }
};

// Função global para forçar atualização da busca
window.forceStudentsUpdate = function() {
    console.log('🔄 Forçando atualização da lista de alunos...');
    renderStudentsCardsList();
};

// Função global para teste completo do sistema
window.testCompleteStudentsSystem = function() {
    console.log('🧪 === TESTE COMPLETO DO SISTEMA DE ALUNOS ===');
    
    console.log('1. Verificando dados...');
    console.log('- Total de alunos:', students.length);
    console.log('- Alunos exemplo:', students.slice(0, 2).map(s => ({name: s.name, level: s.level})));
    
    console.log('2. Forçando reload do sistema...');
    cleanOldStudentsSystem();
    loadStudents();
    
    setTimeout(() => {
        console.log('3. Verificando elementos após reload...');
        testStudentsFilter();
        
        console.log('4. Testando filtro com valor...');
        const searchInput = document.getElementById('studentsSearchInput');
        if (searchInput) {
            // Removido direcionamento automático - não colocar valor automático
            filterStudentsRealTime();
        }
        
        console.log('✅ Teste completo finalizado!');
        console.log('- Se ainda não funcionar, verifique no console do navegador');
        console.log('- Use F12 > Console para ver os logs detalhados');
    }, 500);
};

// Função de recuperação para erros críticos
window.recoverStudentsSystem = function() {
    console.log('🚨 Iniciando recuperação do sistema de alunos...');
    
    try {
        // Verificar se estamos na aba students
        const studentsTab = document.getElementById('students');
        if (!studentsTab) {
            console.error('❌ Aba students não encontrada!');
            return;
        }
        
        // REMOVIDO: Redirecionamento automático para aba students
        // showTab('students');
        
        setTimeout(() => {
            console.log('🔄 Tentando recarregar sistema...');
            testCompleteStudentsSystem();
        }, 1000);
        
    } catch (error) {
        console.error('❌ Erro na recuperação:', error);
        console.log('💡 Tente recarregar a página (F5)');
    }
};

// Sistema de verificação de integridade dos alunos
window.verifyStudentsSystemIntegrity = function() {
    console.log('🔍 === VERIFICAÇÃO DE INTEGRIDADE DO SISTEMA ===');
    
    const checks = {
        elementsFound: false,
        functionsAvailable: false,
        dataIntegrity: false,
        eventListenersActive: false
    };
    
    // 1. Verificar elementos
    const searchInput = document.getElementById('studentsSearchInput');
    const levelFilter = document.getElementById('levelFilter');
    const statusFilter = document.getElementById('statusFilter');
    const container = document.getElementById('studentsCardGrid');
    
    checks.elementsFound = !!(searchInput && levelFilter && statusFilter && container);
    console.log(`1. Elementos encontrados: ${checks.elementsFound ? '✅' : '❌'}`);
    
    if (!checks.elementsFound) {
        console.log('   Detalhes:', {
            searchInput: !!searchInput,
            levelFilter: !!levelFilter,
            statusFilter: !!statusFilter,
            container: !!container
        });
    }
    
    // 2. Verificar funções
    checks.functionsAvailable = !!(
        typeof window.filterStudentsRealTime === 'function' &&
        typeof window.clearStudentsSearch === 'function' &&
        typeof window.changeStudentsPage === 'function'
    );
    console.log(`2. Funções disponíveis: ${checks.functionsAvailable ? '✅' : '❌'}`);
    
    // 3. Verificar dados
    checks.dataIntegrity = !!(
        Array.isArray(students) &&
        Array.isArray(filteredStudentsData) &&
        typeof studentsCurrentPage === 'number'
    );
    console.log(`3. Integridade dos dados: ${checks.dataIntegrity ? '✅' : '❌'}`);
    
    if (!checks.dataIntegrity) {
        console.log('   Detalhes:', {
            students: Array.isArray(students) ? `${students.length} itens` : 'inválido',
            filteredStudentsData: Array.isArray(filteredStudentsData) ? `${filteredStudentsData.length} itens` : 'inválido',
            studentsCurrentPage: typeof studentsCurrentPage
        });
    }
    
    // 4. Verificar event listeners
    if (searchInput) {
        checks.eventListenersActive = !!(
            searchInput.oninput &&
            typeof searchInput.oninput === 'function'
        );
    }
    console.log(`4. Event listeners ativos: ${checks.eventListenersActive ? '✅' : '❌'}`);
    
    // Relatório final
    const totalScore = Object.values(checks).filter(Boolean).length;
    const maxScore = Object.keys(checks).length;
    
    console.log(`\n📊 SCORE: ${totalScore}/${maxScore} (${Math.round(totalScore/maxScore*100)}%)`);
    
    if (totalScore === maxScore) {
        console.log('✅ Sistema funcionando perfeitamente!');
        return true;
    } else if (totalScore >= 2) {
        console.log('⚠️ Sistema com problemas menores - tentando correção automática...');
        setTimeout(() => recoverStudentsSystem(), 500);
        return false;
    } else {
        console.log('❌ Sistema com problemas críticos - recarregue a página');
        return false;
    }
};

// Função de monitoramento automático
window.startStudentsSystemMonitoring = function() {
    if (window.studentsMonitoringInterval) {
        clearInterval(window.studentsMonitoringInterval);
    }
    
    console.log('👁️ Iniciando monitoramento automático do sistema de alunos...');
    
    window.studentsMonitoringInterval = setInterval(() => {
        // Verificar apenas se estamos na aba students
        const studentsTab = document.getElementById('students');
        if (studentsTab && studentsTab.parentNode && typeof studentsTab.style === 'object' && studentsTab.style.display !== 'none') {
            const searchInput = document.getElementById('studentsSearchInput');
            
            // Se o campo de busca sumiu, algo deu errado
            if (!searchInput || typeof searchInput.value === 'undefined') {
                console.warn('⚠️ Problema detectado - campo de busca não encontrado');
                console.log('🔄 Tentando recuperação automática...');
                recoverStudentsSystem();
            }
        }
    }, 5000); // Verificar a cada 5 segundos
    
    console.log('✅ Monitoramento ativo - use stopStudentsSystemMonitoring() para parar');
};

// Função para parar monitoramento
window.stopStudentsSystemMonitoring = function() {
    if (window.studentsMonitoringInterval) {
        clearInterval(window.studentsMonitoringInterval);
        window.studentsMonitoringInterval = null;
        console.log('✅ Monitoramento do sistema de alunos parado');
    } else {
        console.log('⚠️ Monitoramento não estava ativo');
    }
};

// Sistema de notificação de correções aplicadas
window.systemFixed = function() {
    console.log(`
🎉 === SISTEMA COMPLETAMENTE CORRIGIDO ===

✅ Todas as verificações de elementos foram robustecidas
✅ Sistema de recuperação automática implementado  
✅ Tratamento de erros melhorado
✅ Monitoramento de integridade disponível

🔧 FUNÇÕES DE DEBUG DISPONÍVEIS:
• verifyStudentsSystemIntegrity() - Verificar saúde do sistema
• testCompleteStudentsSystem() - Teste completo 
• recoverStudentsSystem() - Recuperação em caso de problemas
• startStudentsSystemMonitoring() - Monitoramento automático

🎯 SISTEMA PRONTO PARA USO:
• Busca em tempo real funcionando
• Filtros por nível e status operacionais  
• Marcação de mensalidades vencidas ativa
• Zero erros no console esperados

💡 Se ainda encontrar problemas, execute: recoverStudentsSystem()
    `);
    
    // Verificação automática final
    setTimeout(() => {
        console.log('🔍 Executando verificação final automática...');
        if (typeof verifyStudentsSystemIntegrity === 'function') {
            verifyStudentsSystemIntegrity();
        }
    }, 500);
};

// Executar notificação automática após carregamento
setTimeout(() => {
    if (typeof systemFixed === 'function') {
        systemFixed();
    }
}, 2000);

// Funções auxiliares para alunos
function highlightStudentsSearchTerm(text, term) {
    if (!term) return text;
    const regex = new RegExp(`(${term})`, 'gi');
    return text.replace(regex, '<mark>$1</mark>');
}

function getLevelCssClass(level) {
    // Mapeamento correto dos níveis para classes CSS (suporta níveis antigos e novos)
    const levelMapping = {
        // Níveis em português (antigos)
        'Iniciante': 'beginner',
        'Básico': 'elementary',
        'Intermediário': 'intermediate',
        'Avançado': 'advanced',
        // Níveis em inglês (novos)
        'Beginner': 'beginner',
        'Elementary': 'elementary', 
        'Pre-Intermediate': 'preintermediate',
        'Intermediate': 'intermediate',
        'Upper-Intermediate': 'upperintermediate',
        'Advanced': 'advanced',
        // Níveis CEFR (mais novos) - mapeamento direto
        'A1': 'a1',
        'A2': 'a2',
        'B1': 'b1',
        'B2': 'b2',
        'C1': 'c1',
        'C2': 'c2'
    };
    
    return levelMapping[level] || level.toLowerCase().replace('-', '');
}

function hasOverdueMensalidades(studentEmail) {
    // Garantir que as mensalidades estejam inicializadas
    if (!window.mensalidades) {
        initializeMensalidadesSystem();
    }
    
    if (!mensalidades || !mensalidades.length) {
        return false;
    }
    
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset para o início do dia
    
    const studentMensalidades = mensalidades.filter(m => m.studentEmail === studentEmail);
    
    return studentMensalidades.some(mensalidade => {
        if (mensalidade.status === 'paga') return false;
        
        const vencimento = new Date(mensalidade.vencimento + 'T00:00:00');
        if (isNaN(vencimento.getTime())) return false;
        
        return vencimento < today;
    });
}

function getStudentStatusIcon(status) {
    const icons = {
        'ativo': 'check-circle',
        'inativo': 'times-circle'
    };
    return icons[status] || 'question-circle';
}

function updateStudentsSearchInfo(filtered, total) {
    const infoElement = document.getElementById('studentsSearchResultsInfo');
    if (!infoElement) {
        console.warn('⚠️ Elemento studentsSearchResultsInfo não encontrado');
        return;
    }
    
    if (studentsSearchTerm || document.getElementById('levelFilter')?.value || document.getElementById('statusFilter')?.value) {
        infoElement.innerHTML = `
            <span class="search-info">
                <i class="fas fa-search"></i> 
                Encontrados: <strong>${filtered}</strong> de <strong>${total}</strong> alunos
            </span>
        `;
    } else {
        infoElement.innerHTML = `
            <span class="search-info">
                <i class="fas fa-users"></i> 
                Total: <strong>${total}</strong> alunos cadastrados
            </span>
        `;
    }
    
    if (infoElement && typeof infoElement.style === 'object') {
        try {
            infoElement.style.display = 'block';
        } catch (error) {
            console.warn('⚠️ Erro ao alterar estilo do elemento info de alunos:', error);
        }
    }
}

function updateStudentsPagination(current, total) {
    const paginationControls = document.getElementById('studentsPaginationControls');
    const paginationInfo = document.getElementById('studentsPaginationInfo');
    const prevBtn = document.getElementById('studentsPrevPageBtn');
    const nextBtn = document.getElementById('studentsNextPageBtn');
    
    if (!paginationControls || total <= 1) {
        hideStudentsPagination();
        return;
    }
    
    // Mostrar controles
    paginationControls.style.display = 'flex';
    
    // Atualizar informação
    if (paginationInfo) {
        paginationInfo.innerHTML = `Página <strong>${current}</strong> de <strong>${total}</strong>`;
    }
    
    // Atualizar botões
    if (prevBtn) {
        prevBtn.disabled = current === 1;
        prevBtn.style.opacity = current === 1 ? '0.5' : '1';
    }
    
    if (nextBtn) {
        nextBtn.disabled = current === total;
        nextBtn.style.opacity = current === total ? '0.5' : '1';
    }
}

function hideStudentsPagination() {
    const paginationControls = document.getElementById('studentsPaginationControls');
    if (paginationControls) {
        paginationControls.style.display = 'none';
    }
}

// ==================== FIM DO SISTEMA DE BUSCA E PAGINAÇÃO DE ALUNOS ====================

function createStudentCard(student, index) {
    const card = document.createElement('div');
    card.className = 'student-card';
    
    const totalPoints = calculateTotalPoints(student);
    const level = getStudentLevel(student);
    const streak = student.attendanceStreak || 0;
    
    // Verificar se tem aula hoje
    const today = new Date().getDay();
    const dayNames = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
    const todayName = dayNames[today];
    const hasClassToday = student.classDays && student.classDays.includes(todayName);
    
    if (hasClassToday) {
        card.classList.add('status-highlight');
    }
    
    card.innerHTML = `
        <div class="student-header">
            <h3 class="student-name">${student.name}</h3>
            <span class="student-level">${student.level}</span>
        </div>
        
        <div class="student-info">
            <p><strong>Email:</strong> ${student.email}</p>
            <p><strong>Nível:</strong> ${level.icon} ${level.name} (${totalPoints} pontos)</p>
            ${student.classTime ? `<p><strong>Horário:</strong> ${student.classTime}</p>` : ''}
            ${student.classDays && student.classDays.length > 0 ? 
                `<div class="student-schedule">
                    <strong>Dias:</strong> ${student.classDays.join(', ')}
                    ${hasClassToday ? ' <span class="status-today"> Aula hoje!</span>' : ''}
                </div>` : ''
            }
        </div>
        
        <div class="student-stats">
            <div class="stat-item">
                <span class="number">${totalPoints}</span>
                <span class="label">Pontos</span>
            </div>
            <div class="stat-item">
                <span class="number">${student.attendanceCount || 0}</span>
                <span class="label">Presenças</span>
            </div>
            <div class="stat-item">
                <span class="number">${streak}</span>
                <span class="label">Sequência</span>
            </div>
            <div class="stat-item">
                <span class="number">${student.tasksCompleted || 0}</span>
                <span class="label">Tarefas</span>
            </div>
        </div>
        
        <div class="progress-container">
            <div class="progress-text">${level.name}  ${getNextLevel(level).name}</div>
            <div class="progress-bar">
                <div class="progress-fill" style="width: ${calculateLevelProgress(student)}%"></div>
            </div>
            <div class="progress-info">${totalPoints}/${getNextLevel(level).points} pontos</div>
        </div>
        
        <div class="student-actions">
            <button class="btn btn-warning btn-small" onclick="editStudent(${index})">
                <i class="fas fa-edit"></i> Editar
            </button>
            <button class="btn btn-info btn-small" onclick="giveBonus(${index})">
                <i class="fas fa-plus"></i> Bônus
            </button>
            <button class="btn btn-secondary btn-small" onclick="viewStudentHistory(${index})">
                <i class="fas fa-history"></i> Histórico
            </button>
            <button class="btn btn-danger btn-small" onclick="removeStudent(${index})">
                <i class="fas fa-trash"></i> Remover
            </button>
        </div>
    `;
    
    return card;
}

function showAddStudentModal() {
    console.log('🔍 Tentando abrir modal de adicionar aluno...');
    
    const modal = document.getElementById('addStudentModal');
    if (!modal) {
        console.error('❌ Modal addStudentModal não encontrado!');
        alert('Erro: Modal não encontrado. Verifique se a página carregou completamente.');
        return;
    }
    
    console.log('✅ Modal encontrado, abrindo...');
    modal.classList.add('show');
    
    // Limpar formulário
    const form = document.getElementById('addStudentForm');
    if (form) {
        form.reset();
        // Limpar campo de senha especificamente
        const passwordField = document.getElementById('studentPassword');
        if (passwordField) passwordField.value = '';
        console.log('✅ Formulário limpo');
    } else {
        console.warn('⚠️ Formulário addStudentForm não encontrado');
    }
    
    // Focar no primeiro campo
    const nameInput = document.getElementById('studentName');
    if (nameInput) {
        setTimeout(() => nameInput.focus(), 100);
    }
    
    console.log('✅ Modal deveria estar visível agora');
}

function addStudent() {
    console.log('📝 Tentando adicionar novo aluno...');
    
    const name = document.getElementById('studentName').value;
    const email = document.getElementById('studentEmail').value;
    const password = document.getElementById('studentPassword').value;
    const level = document.getElementById('studentLevel').value;
    const classTime = document.getElementById('studentTime').value;
    
    console.log('📋 Dados coletados:', { name, email, password, level, classTime });
    
    // Coletar dias selecionados
    const classDays = [];
    const dayCheckboxes = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    dayCheckboxes.forEach(day => {
        const checkbox = document.getElementById(`day-${day}`);
        if (checkbox && checkbox.checked) {
            classDays.push(checkbox.value);
        }
    });
    
    console.log('📅 Dias selecionados:', classDays);
    
    // Validações
    if (!name || !email || !password || !level || classDays.length === 0) {
        console.warn('⚠️ Validação falhou - campos obrigatórios não preenchidos');
        showAlert('Por favor, preencha todos os campos obrigatórios, incluindo a senha.', 'danger');
        return;
    }
    
    // Validar senha (mínimo 4 caracteres)
    if (password.length < 4) {
        console.warn('⚠️ Senha muito curta:', password.length);
        showAlert('A senha deve ter pelo menos 4 caracteres.', 'danger');
        return;
    }
    
    // Verificar se email já existe
    if (students.some(s => s.email === email)) {
        console.warn('⚠️ Email já cadastrado:', email);
        showAlert('Este email já está cadastrado.', 'danger');
        return;
    }
    
    console.log('🔑 Senha definida:', password);
    
    const newStudent = {
        name,
        email,
        level,
        classTime: classTime || null,
        classDays,
        password,
        totalPoints: 0,
        attendanceCount: 0,
        attendanceStreak: 0,
        tasksCompleted: 0,
        achievements: [],
        completedTasks: [],
        completedBookTasks: [],
        pointsHistory: [],
        joinDate: new Date().toISOString().split('T')[0]
    };
    
    console.log('👤 Novo aluno criado:', newStudent);
    
    students.push(newStudent);
    
    // Criar login para o aluno
    createStudentLogin(newStudent);
    
    saveData();
    console.log('💾 Dados salvos no localStorage');
    
    closeModal('addStudentModal');
    loadStudents();
    loadStudentFilter(); // Atualizar filtro de tarefas
    updateDashboard();
    
    // Verificar conquistas automáticas para o novo aluno
    checkStudentAchievements(newStudent);
    
    showAlert(`Aluno ${name} adicionado com sucesso! Login: ${email} / Senha: ${password}`, 'success');
    console.log('✅ Aluno adicionado com sucesso!');
}

function editStudent(index) {
    const student = students[index];
    
    document.getElementById('editStudentIndex').value = index;
    document.getElementById('editStudentName').value = student.name;
    document.getElementById('editStudentEmail').value = student.email;
    document.getElementById('editStudentPassword').value = student.password || '';
    document.getElementById('editStudentLevel').value = student.level;
    document.getElementById('editStudentTime').value = student.classTime || '';
    
    // Marcar dias da semana
    const dayCheckboxes = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    dayCheckboxes.forEach(day => {
        const checkbox = document.getElementById(`edit-day-${day}`);
        if (checkbox) {
            checkbox.checked = student.classDays && student.classDays.includes(checkbox.value);
        }
    });
    
    const modal = document.getElementById('editStudentModal');
    modal.classList.add('show');
}

function updateStudent() {
    const index = parseInt(document.getElementById('editStudentIndex').value);
    const name = document.getElementById('editStudentName').value;
    const email = document.getElementById('editStudentEmail').value;
    const password = document.getElementById('editStudentPassword').value;
    const level = document.getElementById('editStudentLevel').value;
    const classTime = document.getElementById('editStudentTime').value;
    
    // Coletar dias selecionados
    const classDays = [];
    const dayCheckboxes = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    dayCheckboxes.forEach(day => {
        const checkbox = document.getElementById(`edit-day-${day}`);
        if (checkbox && checkbox.checked) {
            classDays.push(checkbox.value);
        }
    });
    
    // Validações
    if (!name || !email || !password || !level || classDays.length === 0) {
        showAlert('Por favor, preencha todos os campos obrigatórios, incluindo a senha.', 'danger');
        return;
    }
    
    // Validar senha (mínimo 4 caracteres)
    if (password.length < 4) {
        showAlert('A senha deve ter pelo menos 4 caracteres.', 'danger');
        return;
    }
    
    // Verificar se email já existe (exceto o próprio aluno)
    if (students.some((s, i) => s.email === email && i !== index)) {
        showAlert('Este email já está cadastrado.', 'danger');
        return;
    }
    
    // Atualizar dados do aluno
    students[index].name = name;
    students[index].email = email;
    students[index].password = password;
    students[index].level = level;
    students[index].classTime = classTime || null;
    students[index].classDays = classDays;
    
    saveData();
    
    closeModal('editStudentModal');
    loadStudents();
    loadStudentFilter(); // Atualizar filtro de tarefas
    updateDashboard();
    
    showAlert('Aluno atualizado com sucesso!', 'success');
}

function removeStudent(index) {
    const student = students[index];
    
    if (confirm(`Tem certeza que deseja remover o aluno ${student.name}? Esta ação não pode ser desfeita.`)) {
        students.splice(index, 1);
        saveData();
        loadStudents();
        loadStudentFilter(); // Atualizar filtro de tarefas
        updateDashboard();
        
        showAlert(`Aluno ${student.name} removido com sucesso.`, 'success');
    }
}

function viewStudentHistory(index) {
    const student = students[index];
    if (!student) {
        showAlert('Aluno não encontrado.', 'danger');
        return;
    }
    
    // Calcular estatísticas
    const totalPoints = calculateTotalPoints(student);
    const level = getStudentLevel(student);
    const pointsHistory = student.pointsHistory || [];
    
    // Construir histórico de pontos
    let historyText = `Histórico de ${student.name}\n\n`;
    historyText += `📊 ESTATÍSTICAS GERAIS:\n`;
    historyText += `• Total de Pontos: ${totalPoints}\n`;
    historyText += `• Nível Atual: ${level.name}\n`;
    historyText += `• Presenças: ${student.attendanceCount || 0}\n`;
    historyText += `• Sequência: ${student.attendanceStreak || 0}\n`;
    historyText += `• Tarefas Concluídas: ${student.tasksCompleted || 0}\n`;
    historyText += `• Data de Cadastro: ${formatDate(student.joinDate)}\n\n`;
    
    if (pointsHistory.length > 0) {
        historyText += `💰 HISTÓRICO DE PONTOS (últimos ${Math.min(10, pointsHistory.length)}):\n`;
        pointsHistory.slice(-10).reverse().forEach(entry => {
            historyText += `• ${formatDate(entry.date)}: +${entry.points} pontos (${entry.source})\n`;
        });
    } else {
        historyText += `💰 HISTÓRICO DE PONTOS:\nNenhum ponto registrado ainda.\n`;
    }
    
    // Verificar contratos
    const studentContracts = contratos.filter(c => c.studentEmail === student.email);
    if (studentContracts.length > 0) {
        historyText += `\n📄 CONTRATOS:\n`;
        studentContracts.forEach(contrato => {
            historyText += `• ${contrato.tipo.toUpperCase()}: R$ ${contrato.valor.toFixed(2)} (${contrato.status})\n`;
        });
    }
    
    alert(historyText);
}

function giveBonus(index) {
    const student = students[index];
    const bonusPoints = systemConfig.pointsConfig.bonus;
    
    if (confirm(`Dar ${bonusPoints} pontos bônus para ${student.name}?`)) {
        addPointsToStudent(student, bonusPoints, 'Pontos Bônus');
        saveData();
        loadStudents();
        updateDashboard();
        
        showAlert(`${bonusPoints} pontos bônus dados para ${student.name}!`, 'success');
    }
}

// ==================== SISTEMA DE PONTUAÇÃO E NÍVEIS ====================
function calculateTotalPoints(student) {
    if (!student.pointsHistory) return 0;
    return student.pointsHistory.reduce((total, entry) => total + entry.points, 0);
}

function addPointsToStudent(student, points, source, date = null) {
    console.log(`💰 INÍCIO addPointsToStudent: ${student.name} +${points} (${source})`);
    
    if (!student.pointsHistory) {
        student.pointsHistory = [];
        console.log('📊 Inicializando pointsHistory para', student.name);
    }
    
    const entry = {
        points,
        source,
        date: date || new Date().toISOString().split('T')[0],
        timestamp: new Date().toISOString()
    };
    
    console.log('📝 Entrada de pontos:', entry);
    
    student.pointsHistory.push(entry);
    console.log(`📈 Histórico atualizado: ${student.pointsHistory.length} entradas`);
    
    const oldTotal = student.totalPoints || 0;
    student.totalPoints = calculateTotalPoints(student);
    
    console.log(`💎 Pontos atualizados: ${oldTotal} → ${student.totalPoints}`);
    console.log('✅ FIM addPointsToStudent');
}

function getStudentLevel(student) {
    const totalPoints = calculateTotalPoints(student);
    const levels = systemConfig.levelsConfig;
    
    let currentLevel = levels[0];
    
    for (let i = levels.length - 1; i >= 0; i--) {
        if (totalPoints >= levels[i].points) {
            currentLevel = levels[i];
            break;
        }
    }
    
    return currentLevel;
}

function getNextLevel(currentLevel) {
    const levels = systemConfig.levelsConfig;
    const currentIndex = levels.findIndex(l => l.name === currentLevel.name);
    
    if (currentIndex < levels.length - 1) {
        return levels[currentIndex + 1];
    }
    
    return currentLevel; // Já está no nível máximo
}

function calculateLevelProgress(student) {
    const totalPoints = calculateTotalPoints(student);
    const currentLevel = getStudentLevel(student);
    const nextLevel = getNextLevel(currentLevel);
    
    if (currentLevel.name === nextLevel.name) {
        return 100; // Nível máximo
    }
    
    const pointsInCurrentLevel = totalPoints - currentLevel.points;
    const pointsNeededForNext = nextLevel.points - currentLevel.points;
    
    return Math.min(100, (pointsInCurrentLevel / pointsNeededForNext) * 100);
}

// ==================== SISTEMA DE PRESENÇA ====================
function setAttendanceDate() {
    const today = new Date().toISOString().split('T')[0];
    const dateInput = document.getElementById('attendanceDate');
    if (dateInput) {
        dateInput.value = today;
        loadAttendance();
    }
}

function loadAttendance() {
    console.log('📅 INÍCIO loadAttendance');
    
    // SEMPRE garantir que a data está sincronizada
    const dateInput = document.getElementById('attendanceDate');
    const today = new Date();
    const todayString = today.toISOString().split('T')[0];
    
    // Se não há data ou se estamos carregando pela primeira vez, usar hoje
    if (!dateInput.value) {
        dateInput.value = todayString;
        console.log('📅 Data padrão definida para hoje:', todayString);
    }
    
    const selectedDate = dateInput.value;
    if (!selectedDate) {
        console.log('❌ Nenhuma data selecionada');
        return;
    }
    
    console.log('📅 Data do campo input:', selectedDate);
    console.log('📅 Data de hoje:', todayString);
    
    console.log('📅 Data selecionada:', selectedDate);
    
    const dayNames = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
    const selectedDay = dayNames[new Date(selectedDate + 'T00:00:00').getDay()];
    console.log('📅 Dia da semana:', selectedDay);
    
    // 1. Filtrar alunos que têm aula regular no dia selecionado
    console.log('👥 Total de alunos:', students.length);
    const studentsWithRegularClass = students.filter(student => 
        student.classDays && student.classDays.includes(selectedDay)
    );
    console.log('🎓 Alunos com aula regular hoje:', studentsWithRegularClass.length);
    
    // 2. Filtrar alunos que têm reposições agendadas na data selecionada
    console.log('🔍 Verificando reposições para', selectedDate);
    console.log('📊 Total de reposições no sistema:', reposicoes.length);
    console.log('📋 Todas as reposições:', reposicoes);
    
    const reposicoesHoje = reposicoes.filter(reposicao => {
        const match = reposicao.dataReposicao === selectedDate && reposicao.status === 'agendada';
        console.log(`🔍 Reposição ${reposicao.id}: data=${reposicao.dataReposicao}, status=${reposicao.status}, match=${match}`);
        return match;
    });
    console.log('🔄 Reposições agendadas hoje:', reposicoesHoje.length, reposicoesHoje);
    
    const studentsWithReposicao = reposicoesHoje.map(reposicao => {
        const student = students.find(s => s.email === reposicao.studentEmail);
        if (student) {
            return {
                ...student,
                isReposicao: true,
                reposicaoInfo: reposicao
            };
        }
        return null;
    }).filter(Boolean);
    
    // 3. Combinar alunos (evitar duplicatas)
    const allStudentsToday = [];
    
    // Adicionar alunos com aula regular
    studentsWithRegularClass.forEach(student => {
        allStudentsToday.push({
            ...student,
            isReposicao: false
        });
    });
    
    // Adicionar alunos com reposição (apenas se não tiverem aula regular hoje)
    studentsWithReposicao.forEach(studentWithReposicao => {
        const alreadyHasRegularClass = studentsWithRegularClass.some(
            regular => regular.email === studentWithReposicao.email
        );
        
        if (!alreadyHasRegularClass) {
            allStudentsToday.push(studentWithReposicao);
        } else {
            // Se o aluno já tem aula regular E reposição, marcar que tem reposição também
            const existingStudent = allStudentsToday.find(s => s.email === studentWithReposicao.email);
            if (existingStudent) {
                existingStudent.hasReposicaoToday = true;
                existingStudent.reposicaoInfo = studentWithReposicao.reposicaoInfo;
            }
        }
    });
    
    console.log('👥 Total de alunos para presença hoje:', allStudentsToday.length);
    
    // Atualizar cabeçalho com informações do dia
    updateAttendanceHeader(selectedDay, studentsWithRegularClass.length, reposicoesHoje.length);
    
    // Renderizar alunos
    const withClassContainer = document.getElementById('studentsWithClass');
    if (!withClassContainer) {
        console.error('❌ Container studentsWithClass não encontrado!');
        return;
    }
    
    withClassContainer.innerHTML = '';
    
    if (allStudentsToday.length === 0) {
        withClassContainer.innerHTML = `
            <div class="no-students-message">
                <i class="fas fa-calendar-times"></i>
                <p>Nenhum aluno tem aula ou reposição na <strong>${selectedDay}</strong>.</p>
                <p class="text-muted">Selecione outro dia ou verifique os horários dos alunos.</p>
            </div>
        `;
        console.log('📢 Exibindo mensagem: nenhum aluno tem aula ou reposição hoje');
        return;
    }
    
    console.log('📝 Criando items de presença...');
    allStudentsToday.forEach((student, index) => {
        const typeInfo = student.isReposicao ? 'REPOSIÇÃO' : 
                        student.hasReposicaoToday ? 'AULA + REPOSIÇÃO' : 'AULA REGULAR';
        
        console.log(`👤 ${index + 1}. ${student.name} - ${typeInfo}`);
        
        const item = createAttendanceItem(student, selectedDate, true);
        withClassContainer.appendChild(item);
    });
    
    console.log('✅ FIM loadAttendance');
}

function createAttendanceItem(student, date, hasClass) {
    console.log(`🎫 Criando item de presença para: ${student.name} - Data: ${date}`);
    
    const item = document.createElement('div');
    item.className = 'attendance-item';
    
    // Adicionar classe especial se for reposição
    if (student.isReposicao) {
        item.classList.add('attendance-reposicao');
    } else if (student.hasReposicaoToday) {
        item.classList.add('attendance-mixed');
    }
    
    const currentAttendance = attendance[date] || {};
    const isPresent = currentAttendance[student.email] || false;
    
    console.log(`📊 Status atual de ${student.name}: ${isPresent ? 'Presente' : 'Ausente'}`);
    console.log(`📅 Attendance para ${date}:`, currentAttendance);
    
    // Determinar tipo de aula e informações extras
    let classType = '';
    let extraInfo = '';
    
    if (student.isReposicao) {
        classType = '<span class="class-type reposicao"><i class="fas fa-redo"></i> Reposição</span>';
        extraInfo = `
            <div class="reposicao-details">
                <small><strong>Motivo:</strong> ${student.reposicaoInfo.motivo}</small>
                <small><strong>Aula original:</strong> ${formatDate(student.reposicaoInfo.dataOriginal)}</small>
                ${student.reposicaoInfo.horario ? `<small><strong>Horário:</strong> ${student.reposicaoInfo.horario}</small>` : ''}
            </div>
        `;
    } else if (student.hasReposicaoToday) {
        classType = '<span class="class-type mixed"><i class="fas fa-calendar-plus"></i> Aula + Reposição</span>';
        extraInfo = `
            <div class="reposicao-details">
                <small><strong>Também tem reposição:</strong> ${student.reposicaoInfo.motivo}</small>
                ${student.reposicaoInfo.horario ? `<small><strong>Horário reposição:</strong> ${student.reposicaoInfo.horario}</small>` : ''}
            </div>
        `;
    } else {
        classType = '<span class="class-type regular"><i class="fas fa-calendar-check"></i> Aula Regular</span>';
    }
    
    item.innerHTML = `
        <div class="student-attendance-info">
            <div class="attendance-name">
                ${student.name}
                ${classType}
            </div>
            <div class="attendance-schedule">
                ${student.classDays ? student.classDays.join(', ') : 'Sem horário definido'}
                ${student.classTime ? ` - ${student.classTime}` : ''}
            </div>
            ${extraInfo}
        </div>
        <div class="attendance-checkbox">
            <input type="checkbox" 
                   id="attendance-${student.email}" 
                   ${isPresent ? 'checked' : ''}
                   onchange="toggleAttendance('${student.email}', '${date}', this.checked)">
            <label for="attendance-${student.email}">Presente</label>
        </div>
    `;
    
    console.log(`✅ Item criado para ${student.name} com status: ${isPresent ? 'checked' : 'unchecked'}`);
    return item;
}

function debugAttendanceSystem() {
    console.log('🔍 DEBUG - Sistema de Presença:');
    console.log('📊 Variáveis globais:');
    console.log('- students:', students);
    console.log('- attendance:', attendance);
    console.log('- achievements:', achievements);
    console.log('- systemConfig:', systemConfig);
    
    console.log('📈 Configurações de pontos:');
    console.log('- presença:', systemConfig.pointsConfig.presenca);
    console.log('- sequência:', systemConfig.pointsConfig.sequencia);
    
    console.log('🎯 Conquistas automáticas:');
    achievements.forEach(achievement => {
        if (achievement.autoCheck) {
            console.log(`- ${achievement.name}: ${achievement.condition} >= ${achievement.target}`);
        }
    });
    
    if (students.length > 0) {
        console.log('👤 Dados do primeiro aluno:');
        const student = students[0];
        console.log('- Nome:', student.name);
        console.log('- Presenças:', student.attendanceCount || 0);
        console.log('- Sequência:', student.attendanceStreak || 0);
        console.log('- Pontos totais:', calculateTotalPoints(student));
        console.log('- Conquistas:', student.achievements || []);
        console.log('- Histórico de pontos:', student.pointsHistory || []);
    }
}

function toggleAttendance(studentEmail, date, isPresent) {
    console.log('🎯 INÍCIO toggleAttendance:', { studentEmail, date, isPresent });
    
    if (!attendance[date]) {
        attendance[date] = {};
        console.log('📅 Data criada no attendance:', date);
    }
    
    attendance[date][studentEmail] = isPresent;
    console.log('✅ Presença marcada no attendance:', attendance[date]);
    
    // Atualizar contador de presença do aluno
    const student = students.find(s => s.email === studentEmail);
    if (!student) {
        console.error('❌ Aluno não encontrado:', studentEmail);
        return;
    }
    
    console.log('👤 Aluno encontrado:', student.name);
    console.log('📊 Estado anterior - Presenças:', student.attendanceCount || 0, 'Sequência:', student.attendanceStreak || 0);
    
    // Verificar se há reposição para este aluno nesta data (agendada ou realizada)
    const reposicaoHoje = reposicoes.find(reposicao => 
        reposicao.studentEmail === studentEmail && 
        reposicao.dataReposicao === date
    );
    
        if (isPresent) {
            student.attendanceCount = (student.attendanceCount || 0) + 1;
        console.log('➕ Incrementando presença para:', student.attendanceCount);
        
        console.log('💰 Adicionando pontos de presença...');
        console.log('- Valor dos pontos:', systemConfig.pointsConfig.presenca);
            addPointsToStudent(student, systemConfig.pointsConfig.presenca, 'Presença', date);
        
        // Se há reposição agendada para hoje e o aluno está presente, marcar reposição como realizada
        if (reposicaoHoje && reposicaoHoje.status === 'agendada') {
            console.log(`🔄 Marcando reposição como realizada para ${student.name}`);
            reposicaoHoje.status = 'realizada';
            reposicaoHoje.dataRealizada = date;
            showAlert(`Reposição de ${student.name} marcada como realizada automaticamente!`, 'success');
        }
            
            // Calcular sequência de presenças
        console.log('🔥 Atualizando sequência de presença...');
            updateAttendanceStreak(student, date, true);
        
        console.log('🏆 Verificando conquistas automáticas...');
        checkStudentAchievements(student);
        
        } else {
            if (student.attendanceCount > 0) {
                student.attendanceCount--;
            console.log('➖ Decrementando presença para:', student.attendanceCount);
        }
        
        // Se há reposição que foi marcada como realizada hoje e agora está desmarcando presença, voltar para agendada
        if (reposicaoHoje && reposicaoHoje.status === 'realizada') {
            console.log(`🔄 Voltando reposição para agendada para ${student.name}`);
            reposicaoHoje.status = 'agendada';
            delete reposicaoHoje.dataRealizada;
            showAlert(`Reposição de ${student.name} voltou para status "agendada".`, 'info');
            }
            
            // Remover pontos de presença se necessário
            if (student.pointsHistory) {
                const index = student.pointsHistory.findIndex(entry => 
                    entry.source === 'Presença' && entry.date === date
                );
                if (index !== -1) {
                    student.pointsHistory.splice(index, 1);
                    student.totalPoints = calculateTotalPoints(student);
                console.log('🗑️ Pontos de presença removidos');
                }
            }
            
            updateAttendanceStreak(student, date, false);
    }
    
    console.log('📊 Estado final - Presenças:', student.attendanceCount, 'Sequência:', student.attendanceStreak);
    console.log('💎 Pontos totais:', calculateTotalPoints(student));
    
    console.log('💾 Salvando dados...');
    saveData();
    
    // Recarregar a área de presença para atualizar status das reposições
    loadAttendance();
    
    // Se há mudança de status de reposição, atualizar também a aba de reposições
    if (reposicaoHoje) {
        loadReposicoes();
    }
    
    console.log('✅ FIM toggleAttendance');
}

function saveAttendance() {
    saveData();
    updateDashboard();
    showAlert('Presenças salvas com sucesso!', 'success');
}

function updateAttendanceStreak(student, date, isPresent) {
    // Lógica simplificada para sequência de presenças
    if (isPresent) {
        student.attendanceStreak = (student.attendanceStreak || 0) + 1;
        
        // Dar bônus por sequência a cada 5 dias consecutivos
        if (student.attendanceStreak > 0 && student.attendanceStreak % 5 === 0) {
            addPointsToStudent(student, systemConfig.pointsConfig.sequencia, 'Bônus Sequência', date);
        }
        
        // Verificar conquistas relacionadas à sequência
        checkStudentAchievements(student);
    } else {
        student.attendanceStreak = 0;
    }
}

// ==================== SISTEMA DE TAREFAS ====================
function loadTasks() {
    // Carregar lista de alunos no filtro
    loadStudentFilter();
    
    // Não carregar tarefas até que um aluno seja selecionado
    const tasksContent = document.getElementById('tasksContent');
    tasksContent.innerHTML = `
        <div class="no-student-selected">
            <i class="fas fa-user-check"></i>
            <h3>Selecione um Aluno</h3>
            <p>Escolha um aluno no filtro acima para visualizar suas tarefas.</p>
        </div>
    `;
}

function loadStudentFilter() {
    const select = document.getElementById('studentTaskFilter');
    if (!select) return; // Filtro não existe ainda
    
    select.innerHTML = '<option value="">Selecione um aluno para ver suas tarefas</option>';
    
    students.forEach(student => {
        const option = document.createElement('option');
        option.value = student.email;
        option.textContent = student.name;
        select.appendChild(option);
    });
}

function filterTasksByStudent() {
    const selectedStudentEmail = document.getElementById('studentTaskFilter').value;
    const tasksContent = document.getElementById('tasksContent');
    
    if (!selectedStudentEmail) {
        tasksContent.innerHTML = `
            <div class="no-student-selected">
                <i class="fas fa-user-check"></i>
                <h3>Selecione um Aluno</h3>
                <p>Escolha um aluno no filtro acima para visualizar suas tarefas.</p>
            </div>
        `;
        return;
    }
    
    const selectedStudent = students.find(s => s.email === selectedStudentEmail);
    if (!selectedStudent) return;
    
    // Filtrar tarefas gerais - APENAS para o aluno selecionado
    const generalTasks = tasks.filter(task => {
        // Verificar se a tarefa tem estudantes específicos atribuídos
        if (task.students && Array.isArray(task.students)) {
            return task.students.includes(selectedStudentEmail);
        }
        // Se não tem estudantes específicos, pode ser uma tarefa antiga - não mostrar
        return false;
    });
    
    // Filtrar tarefas do livro do aluno - APENAS para o aluno selecionado
    const studentBookTasks = bookTasks.filter(task => {
        if (task.students && Array.isArray(task.students)) {
            return task.students.includes(selectedStudentEmail);
        }
        if (task.selectedStudents && Array.isArray(task.selectedStudents)) {
            return task.selectedStudents.includes(selectedStudentEmail);
        }
        return false;
    });
    
    // Renderizar conteúdo filtrado
    tasksContent.innerHTML = `
        <div class="student-tasks-header">
            <h2><i class="fas fa-user"></i> Tarefas de ${selectedStudent.name}</h2>
            <span class="student-level">${selectedStudent.level}</span>
        </div>
        
        ${createStatusFilters(generalTasks, studentBookTasks, selectedStudent)}
        
        <!-- Tarefas Gerais -->
        <div class="tasks-section">
            <h3><i class="fas fa-tasks"></i> Tarefas Gerais</h3>
            <div id="studentTasksContainer">
                ${generalTasks.length === 0 ? '<p class="no-tasks">Nenhuma tarefa geral encontrada.</p>' : ''}
            </div>
        </div>
        
        <!-- Tarefas do Livro -->
        <div class="tasks-section">
            <h3><i class="fas fa-book"></i> Tarefas do Livro</h3>
            <div id="studentBookTasksContainer">
                ${studentBookTasks.length === 0 ? '<p class="no-tasks">Nenhuma tarefa do livro encontrada.</p>' : ''}
            </div>
        </div>
    `;
    
    // Renderizar tarefas gerais
    const generalContainer = document.getElementById('studentTasksContainer');
    generalTasks.forEach((task, index) => {
        const taskCard = createStudentTaskCard(task, selectedStudent, 'general');
        generalContainer.appendChild(taskCard);
    });
    
    // Renderizar tarefas do livro
    const bookContainer = document.getElementById('studentBookTasksContainer');
    studentBookTasks.forEach((task, index) => {
        const taskCard = createStudentTaskCard(task, selectedStudent, 'book');
        bookContainer.appendChild(taskCard);
    });
    
    // Aplicar filtros e configurar sistema de filtros
    if (typeof applyFiltersToStudentTasks === 'function') {
        applyFiltersToStudentTasks(generalTasks, studentBookTasks, selectedStudent);
    }
}

function createStudentTaskCard(task, student, type) {
    const card = document.createElement('div');
    card.className = 'task-card student-task-card';
    
    const isCompleted = type === 'general' 
        ? (student.completedTasks && student.completedTasks.includes(task.id))
        : (student.completedBookTasks && student.completedBookTasks.includes(task.id));
    
    // Verificar se a tarefa está vencida
    const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && !isCompleted;
    
    // Determinar o título da tarefa
    const taskTitle = task.title || (task.bookName ? `${task.bookName} - Página ${task.bookPage}` : `${task.book} - Página ${task.page}`);
    
    card.innerHTML = `
        <div class="student-task-header">
            <div class="task-title-section">
                <div class="task-type-indicator ${type}">
                    <i class="fas fa-${type === 'general' ? 'clipboard-list' : 'book'}"></i>
                    <span>${type === 'general' ? 'Tarefa Geral' : 'Tarefa do Livro'}</span>
                </div>
                <h4 class="student-task-title">${taskTitle}</h4>
            </div>
            <div class="task-status-section">
                <div class="task-points-badge">
                    <i class="fas fa-star"></i>
                    <span>${task.points} pontos</span>
                </div>
                <div class="completion-status-indicator ${isCompleted ? 'completed' : isOverdue ? 'overdue' : 'pending'}">
                    <i class="fas fa-${isCompleted ? 'check-circle' : isOverdue ? 'exclamation-triangle' : 'clock'}"></i>
                    <span>${isCompleted ? 'Concluída' : isOverdue ? 'Vencida' : 'Pendente'}</span>
                </div>
            </div>
        </div>
        
        <div class="student-task-content">
            ${task.description ? `
                <div class="task-detail-item">
                    <div class="detail-label">
                        <i class="fas fa-align-left"></i>
                        <span>Descrição:</span>
                    </div>
                    <div class="detail-value">${task.description}</div>
                </div>
            ` : ''}
            
            ${task.exercises || task.bookExercises ? `
                <div class="task-detail-item">
                    <div class="detail-label">
                        <i class="fas fa-pencil-alt"></i>
                        <span>Exercícios:</span>
                    </div>
                    <div class="detail-value">${task.exercises || task.bookExercises}</div>
                </div>
            ` : ''}
            
            ${task.dueDate ? `
                <div class="task-detail-item ${isOverdue ? 'overdue-date' : ''}">
                    <div class="detail-label">
                        <i class="fas fa-calendar-alt"></i>
                        <span>Data de Entrega:</span>
                    </div>
                    <div class="detail-value">
                        ${formatDate(task.dueDate)}
                        ${isOverdue ? '<span class="overdue-indicator">• Vencida</span>' : ''}
                    </div>
                </div>
            ` : ''}
            
            ${task.classroomLink ? `
                <div class="task-detail-item">
                    <div class="detail-label">
                        <i class="fas fa-link"></i>
                        <span>Link:</span>
                    </div>
                    <div class="detail-value">
                        <a href="${task.classroomLink}" target="_blank" class="task-link-btn">
                            <i class="fas fa-external-link-alt"></i>
                            Abrir Link
                        </a>
                    </div>
                </div>
            ` : ''}
        </div>
        
        <div class="student-task-actions">
            <button class="btn task-action-btn ${isCompleted ? 'btn-completed' : 'btn-pending'}" 
                    onclick="toggleStudentTaskCompletion('${student.email}', '${task.id}', '${type}')">
                <i class="fas fa-${isCompleted ? 'undo' : 'check'}"></i>
                <span>${isCompleted ? 'Marcar Pendente' : 'Marcar Concluída'}</span>
            </button>
            <button class="btn task-delete-btn btn-danger btn-small" 
                    onclick="deleteTask('${task.id}', '${type}')">
                <i class="fas fa-trash"></i>
                <span>Remover</span>
            </button>
        </div>
    `;
    
    return card;
}

function toggleStudentTaskCompletion(studentEmail, taskId, type) {
    const student = students.find(s => s.email === studentEmail);
    if (!student) return;
    
    if (type === 'general') {
        if (!student.completedTasks) student.completedTasks = [];
        
        const isCompleted = student.completedTasks.includes(taskId);
        if (isCompleted) {
            student.completedTasks = student.completedTasks.filter(id => id !== taskId);
        } else {
            student.completedTasks.push(taskId);
            const task = tasks.find(t => t.id === taskId);
            if (task) {
                addPointsToStudent(student, task.points, `Tarefa: ${task.title}`);
                // Verificar conquistas automáticas relacionadas a tarefas
                checkStudentAchievements(student);
            }
        }
    } else if (type === 'book') {
        if (!student.completedBookTasks) student.completedBookTasks = [];
        
        const isCompleted = student.completedBookTasks.includes(taskId);
        if (isCompleted) {
            student.completedBookTasks = student.completedBookTasks.filter(id => id !== taskId);
        } else {
            student.completedBookTasks.push(taskId);
            const task = bookTasks.find(t => t.id === taskId);
            if (task) {
                addPointsToStudent(student, task.points, `Tarefa do Livro: ${task.book} - Página ${task.page}`);
                // Verificar conquistas automáticas relacionadas a tarefas do livro
                checkStudentAchievements(student);
            }
        }
    }
    
    saveData();
    filterTasksByStudent(); // Recarregar a visualização
    updateDashboard();
    
    const action = type === 'general' ? 'tarefa' : 'tarefa do livro';
    const status = student.completedTasks?.includes(taskId) || student.completedBookTasks?.includes(taskId) ? 'concluída' : 'marcada como pendente';
    showAlert(`${action.charAt(0).toUpperCase() + action.slice(1)} ${status} para ${student.name}!`, 'success');
}

function deleteTask(taskId, type) {
    const taskArray = type === 'general' ? tasks : bookTasks;
    const taskIndex = taskArray.findIndex(task => task.id === taskId);
    
    if (taskIndex === -1) {
        showAlert('Tarefa não encontrada!', 'danger');
        return;
    }
    
    const task = taskArray[taskIndex];
    const taskName = task.title || `${task.book} - Página ${task.page}`;
    
    if (confirm(`Tem certeza que deseja deletar a tarefa "${taskName}"? Esta ação não pode ser desfeita.`)) {
        // Remover a tarefa do array
        taskArray.splice(taskIndex, 1);
        
        // Remover a tarefa das listas de tarefas concluídas de todos os alunos
        students.forEach(student => {
            if (type === 'general') {
                if (student.completedTasks) {
                    student.completedTasks = student.completedTasks.filter(id => id !== taskId);
                }
                // Remover pontos relacionados à tarefa
                if (student.pointsHistory) {
                    student.pointsHistory = student.pointsHistory.filter(entry => 
                        entry.source !== `Tarefa: ${task.title}`
                    );
                    student.totalPoints = calculateTotalPoints(student);
                }
            } else {
                if (student.completedBookTasks) {
                    student.completedBookTasks = student.completedBookTasks.filter(id => id !== taskId);
                }
                // Remover pontos relacionados à tarefa do livro
                if (student.pointsHistory) {
                    student.pointsHistory = student.pointsHistory.filter(entry => 
                        entry.source !== `Tarefa do Livro: ${task.book} - Página ${task.page}`
                    );
                    student.totalPoints = calculateTotalPoints(student);
                }
            }
        });
        
        saveData();
        filterTasksByStudent(); // Recarregar a visualização
        updateDashboard();
        
        const taskType = type === 'general' ? 'Tarefa' : 'Tarefa do livro';
        showAlert(`${taskType} "${taskName}" deletada com sucesso!`, 'success');
    }
}

function createTaskCard(task, index) {
    const card = document.createElement('div');
    card.className = 'task-card';
    
    const studentsAssigned = students.length;
    const studentsCompleted = students.filter(student => 
        student.completedTasks && student.completedTasks.includes(task.id)
    ).length;
    
    card.innerHTML = `
        <div class="task-header">
            <h3 class="task-title">${task.title}</h3>
            <span class="task-points">${task.points} pontos</span>
        </div>
        
        <div class="task-info">
            <div class="task-detail">
                <strong>Descrição:</strong>
                ${task.description || 'Sem descrição'}
            </div>
            ${task.dueDate ? `
                <div class="task-detail">
                    <strong>Data de Entrega:</strong>
                    ${formatDate(task.dueDate)}
                </div>
            ` : ''}
            ${task.classroomLink ? `
                <div class="task-detail">
                    <strong>Google Classroom:</strong>
                    <a href="${task.classroomLink}" target="_blank" class="btn-google">
                        <i class="fab fa-google"></i> Abrir no Classroom
                    </a>
                </div>
            ` : ''}
        </div>
        
        <div class="task-progress">
            <div class="progress-text">${studentsCompleted}/${studentsAssigned} alunos concluíram</div>
            <div class="progress-bar">
                <div class="progress-fill" style="width: ${(studentsCompleted / studentsAssigned) * 100}%"></div>
            </div>
        </div>
        
        <div class="students-list">
            ${students.map(student => {
                const completed = student.completedTasks && student.completedTasks.includes(task.id);
                return `
                    <div class="student-task-item ${completed ? 'completed' : ''}">
                        <span>${student.name}</span>
                        <button class="btn btn-small ${completed ? 'btn-success' : 'btn-secondary'}" 
                                onclick="toggleTaskCompletion('${student.email}', '${task.id}')">
                            <i class="fas fa-${completed ? 'check' : 'times'}"></i>
                            ${completed ? 'Concluída' : 'Marcar'}
                        </button>
                    </div>
                `;
            }).join('')}
        </div>
        
        <div class="task-actions">
            <button class="btn btn-warning btn-small" onclick="editTask(${index})">
                <i class="fas fa-edit"></i> Editar
            </button>
            <button class="btn btn-danger btn-small" onclick="removeTask(${index})">
                <i class="fas fa-trash"></i> Remover
            </button>
        </div>
    `;
    
    return card;
}

function showAddTaskModal() {
    const modal = document.getElementById('addTaskModal');
    modal.classList.add('show');
    
    // Limpar formulário
    document.getElementById('addTaskForm').reset();
    document.getElementById('taskPoints').value = 10;
}

function addTask() {
    const title = document.getElementById('taskTitle').value;
    const description = document.getElementById('taskDescription').value;
    const points = parseInt(document.getElementById('taskPoints').value);
    const dueDate = document.getElementById('taskDueDate').value;
    const classroomLink = document.getElementById('taskClassroomLink').value;
    
    if (!title || !points) {
        showAlert('Por favor, preencha o título e os pontos.', 'danger');
        return;
    }
    
    // Validar link do Google Classroom se fornecido
    if (classroomLink && !isValidUrl(classroomLink)) {
        showAlert('Por favor, insira um link válido do Google Classroom.', 'danger');
        return;
    }
    
    const newTask = {
        id: generateId(),
        title,
        description,
        points,
        dueDate: dueDate || null,
        classroomLink: classroomLink || null,
        createdDate: new Date().toISOString().split('T')[0],
        completed: false
    };
    
    tasks.push(newTask);
    saveData();
    
    closeModal('addTaskModal');
    loadTasks();
    updateDashboard();
    
    showAlert('Tarefa criada com sucesso!', 'success');
}

function toggleTaskCompletion(studentEmail, taskId) {
    const student = students.find(s => s.email === studentEmail);
    const task = tasks.find(t => t.id === taskId);
    
    if (!student || !task) return;
    
    if (!student.completedTasks) {
        student.completedTasks = [];
    }
    
    const isCompleted = student.completedTasks.includes(taskId);
    
    if (isCompleted) {
        // Remover tarefa concluída
        student.completedTasks = student.completedTasks.filter(id => id !== taskId);
        
        // Remover pontos
        if (student.pointsHistory) {
            const index = student.pointsHistory.findIndex(entry => 
                entry.source === `Tarefa: ${task.title}`
            );
            if (index !== -1) {
                student.pointsHistory.splice(index, 1);
                student.totalPoints = calculateTotalPoints(student);
            }
        }
        
        if (student.tasksCompleted > 0) {
            student.tasksCompleted--;
        }
        
    } else {
        // Marcar como concluída
        student.completedTasks.push(taskId);
        student.tasksCompleted = (student.tasksCompleted || 0) + 1;
        
        // Adicionar pontos
        addPointsToStudent(student, task.points, `Tarefa: ${task.title}`);
        
        // Verificar conquistas automáticas
        checkStudentAchievements(student);
    }
    
    saveData();
    loadTasks();
    updateDashboard();
    
    const action = isCompleted ? 'desmarcada' : 'marcada como concluída';
    showAlert(`Tarefa ${action} para ${student.name}!`, 'success');
}

// ==================== SISTEMA DE RANKINGS ====================
function updateRanking(period) {
    // Atualizar botões ativos
    document.querySelectorAll('.ranking-period').forEach(btn => {
        btn.classList.remove('active');
        if (btn.getAttribute('data-period') === period) {
            btn.classList.add('active');
        }
    });
    
    // Atualizar cabeçalho
    const header = document.getElementById('rankingHeader');
    const titles = {
        'geral': 'Ranking Geral',
        'mensal': 'Ranking Mensal',
        'trimestral': 'Ranking Trimestral',
        'anual': 'Ranking Anual'
    };
    
    header.innerHTML = `
        <h2> ${titles[period]}</h2>
        <p>Classificação baseada na pontuação ${period === 'geral' ? 'total' : 'do período'} dos alunos</p>
    `;
    
    // Calcular ranking baseado no período
    const rankedStudents = calculateRankingByPeriod(period);
    
    // Renderizar ranking
    const container = document.getElementById('rankingList');
    container.innerHTML = '';
    
    rankedStudents.forEach((student, index) => {
        const points = student.periodPoints;
        const level = getStudentLevel(student);
        
        const item = document.createElement('div');
        item.className = 'ranking-item';
        item.innerHTML = `
            <div class="ranking-position ${getPositionClass(index)}">${index + 1}º</div>
            <div class="ranking-info">
                <div class="ranking-name">${student.name}</div>
                <div class="ranking-details">
                    <span class="level-badge ${level.class}">${level.icon} ${level.name}</span>
                     ${student.level}
                </div>
            </div>
            <div class="ranking-score">${points} pts</div>
        `;
        container.appendChild(item);
    });
}

function calculateRankingByPeriod(period) {
    const now = new Date();
    let startDate;
    
    switch(period) {
        case 'mensal':
            startDate = new Date(now.getFullYear(), now.getMonth(), 1);
            break;
        case 'trimestral':
            const quarter = Math.floor(now.getMonth() / 3);
            startDate = new Date(now.getFullYear(), quarter * 3, 1);
            break;
        case 'anual':
            startDate = new Date(now.getFullYear(), 0, 1);
            break;
        default:
            // Ranking geral - todos os pontos
            return [...students]
                .map(student => ({
                    ...student,
                    periodPoints: calculateTotalPoints(student)
                }))
                .sort((a, b) => b.periodPoints - a.periodPoints);
    }
    
    const startDateStr = startDate.toISOString().split('T')[0];
    
    return [...students]
        .map(student => {
            const periodPoints = student.pointsHistory 
                ? student.pointsHistory
                    .filter(entry => entry.date >= startDateStr)
                    .reduce((total, entry) => total + entry.points, 0)
                : 0;
            
            return {
                ...student,
                periodPoints
            };
        })
        .sort((a, b) => b.periodPoints - a.periodPoints);
}

// ==================== GESTÃO EMPRESARIAL ====================
function loadGestao() {
    // Implementação será expandida conforme necessário
    const content = document.getElementById('gestaoContent');
    content.innerHTML = `
        <div class="gestao-placeholder">
            <h3>Módulo de Gestão Empresarial</h3>
            <p>Selecione um módulo acima para começar:</p>
            <ul>
                <li><strong>Contratos:</strong> Gestão de contratos e documentos</li>
                <li><strong>Financeiro:</strong> Controle de pagamentos e mensalidades</li>
                <li><strong>Controle de Aulas:</strong> Aulas dadas e planejamento</li>
                <li><strong>Relatórios:</strong> Relatórios de desempenho</li>
            </ul>
        </div>
    `;
}

function showGestaoModule(module) {
    // Marcar módulo ativo
    document.querySelectorAll('.module-card').forEach(card => {
        card.classList.remove('active');
    });
    event.target.closest('.module-card').classList.add('active');
    
    const content = document.getElementById('gestaoContent');
    
    switch(module) {
        case 'contratos':
            loadContratosModule(content);
            break;
        case 'financeiro':
            loadFinancialModule(content);
            break;
        case 'aulas':
            loadAulasModule(content);
            break;
        case 'relatorios':
            loadRelatoriosModule(content);
            break;
    }
}

function loadContratosModule(container) {
    container.innerHTML = `
        <div class="module-content">
            <div class="module-header">
                <h3><i class="fas fa-file-contract"></i> Gestão de Contratos</h3>
                <button class="btn btn-success" onclick="showAddContratoModal()">
                    <i class="fas fa-plus"></i> Novo Contrato
                </button>
            </div>
            <div id="contratosList" class="contratos-list">
                ${contratos.length === 0 ? '<p class="text-muted">Nenhum contrato cadastrado.</p>' : ''}
            </div>
        </div>
    `;
    
    // Carregar contratos existentes
    loadContratos();
}

// Função antiga removida - agora usamos a versão nova com sistema de mensalidades

function loadAulasModule(container) {
    container.innerHTML = `
        <div class="module-content">
            <div class="aulas-header">
                <h3><i class="fas fa-chalkboard-teacher"></i> Controle de Aulas</h3>
                <!-- Cards com mesmo padrão do dashboard -->
                <div class="stats-grid aulas-stats-grid">
                    <div class="stat-card">
                        <h3><i class="fas fa-calendar-check"></i> Aulas este Mês</h3>
                        <span class="stat-number" id="totalAulasmes">0</span>
                        <span class="stat-label">Realizadas</span>
                    </div>
                    <div class="stat-card">
                        <h3><i class="fas fa-clock"></i> Horas Ministradas</h3>
                        <span class="stat-number" id="horasMinistradas">0h</span>
                        <span class="stat-label">Este Mês</span>
                    </div>
                    <div class="stat-card">
                        <h3><i class="fas fa-users"></i> Alunos Atendidos</h3>
                        <span class="stat-number" id="alunosAtendidos">0</span>
                        <span class="stat-label">Únicos</span>
                    </div>
                </div>
            </div>

            <!-- Navegação de Sub-abas -->
            <div class="aulas-navigation">
                <button class="aulas-tab active" onclick="showAulasSubTab('registrar')">
                    <i class="fas fa-plus-circle"></i> Registrar Aula
                </button>
                <button class="aulas-tab" onclick="showAulasSubTab('historico')">
                    <i class="fas fa-history"></i> Histórico
                </button>
                <button class="aulas-tab" onclick="showAulasSubTab('calendario')">
                    <i class="fas fa-calendar-alt"></i> Calendário
                </button>
                <button class="aulas-tab" onclick="showAulasSubTab('planejamento')">
                    <i class="fas fa-clipboard-list"></i> Planejamento
                </button>
            </div>

            <!-- Conteúdo das Sub-abas -->
            <div class="aulas-content">
                <!-- Registrar Aula -->
                <div id="registrarAula" class="aulas-subtab active">
                    <div class="registro-aula-form">
                        <h4><i class="fas fa-plus"></i> Registrar Nova Aula</h4>
                        <form id="registroAulaForm">
                            <div class="form-row">
                                <div class="form-group">
                                    <label class="form-label">Data da Aula *</label>
                                    <input type="date" id="aulaData" class="form-input" required>
                                </div>
                                <div class="form-group">
                                    <label class="form-label">Horário de Início *</label>
                                    <input type="time" id="aulaHoraInicio" class="form-input" required>
                                </div>
                                <div class="form-group">
                                    <label class="form-label">Horário de Término *</label>
                                    <input type="time" id="aulaHoraFim" class="form-input" required>
                                </div>
                            </div>
                            
                            <div class="form-row">
                                <div class="form-group">
                                    <label class="form-label">Tipo de Aula *</label>
                                    <select id="aulaTipo" class="form-select" required>
                                        <option value="">Selecione o tipo</option>
                                        <option value="individual">Aula Individual</option>
                                        <option value="grupo">Aula em Grupo</option>
                                        <option value="reposicao">Aula de Reposição</option>
                                        <option value="avaliacao">Aula de Avaliação</option>
                                        <option value="conversacao">Aula de Conversação</option>
                                    </select>
                                </div>
                                <div class="form-group">
                                    <label class="form-label">Nível da Aula</label>
                                    <select id="aulaNivel" class="form-select">
                                        <option value="">Todos os níveis</option>
                                        <option value="A1">A1 - Básico</option>
                                        <option value="A2">A2 - Pré-Intermediário</option>
                                        <option value="B1">B1 - Intermediário</option>
                                        <option value="B2">B2 - Intermediário Superior</option>
                                        <option value="C1">C1 - Avançado</option>
                                        <option value="C2">C2 - Proficiente</option>
                                    </select>
                                </div>
                            </div>

                            <div class="form-group">
                                <label class="form-label">Alunos Participantes *</label>
                                <div id="aulaAlunosSelection" class="students-selection-aula">
                                    <!-- Preenchido via JavaScript -->
                                </div>
                            </div>

                            <div class="form-group">
                                <label class="form-label">Conteúdo da Aula *</label>
                                <textarea id="aulaConteudo" class="form-textarea" rows="3" required placeholder="Descreva o conteúdo abordado na aula..."></textarea>
                            </div>

                            <div class="form-row">
                                <div class="form-group">
                                    <label class="form-label">Materiais Utilizados</label>
                                    <input type="text" id="aulaMateriais" class="form-input" placeholder="Ex: Livro Unit 5, Vídeo YouTube, Slides...">
                                </div>
                                <div class="form-group">
                                    <label class="form-label">Status da Aula</label>
                                    <select id="aulaStatus" class="form-select">
                                        <option value="realizada">Realizada</option>
                                        <option value="agendada">Agendada</option>
                                        <option value="cancelada">Cancelada</option>
                                    </select>
                                </div>
                            </div>

                            <div class="form-group">
                                <label class="form-label">Observações</label>
                                <textarea id="aulaObservacoes" class="form-textarea" rows="2" placeholder="Observações sobre a aula, dificuldades dos alunos, etc."></textarea>
                            </div>

                            <div class="form-actions">
                                <button type="button" class="btn btn-secondary" onclick="resetAulaForm()">
                                    <i class="fas fa-times"></i> Limpar
                                </button>
                                <button type="submit" class="btn btn-success">
                                    <i class="fas fa-save"></i> Registrar Aula
                                </button>
                            </div>
                        </form>
                    </div>
                </div>

                <!-- Histórico de Aulas -->
                <div id="historicoAulas" class="aulas-subtab">
                    <div class="historico-header">
                        <h4><i class="fas fa-history"></i> Histórico de Aulas</h4>
                        <div class="historico-filters">
                            <select id="filtroMesHistorico" class="form-select">
                                <option value="">Todos os meses</option>
                            </select>
                            <select id="filtroTipoHistorico" class="form-select">
                                <option value="">Todos os tipos</option>
                                <option value="individual">Individual</option>
                                <option value="grupo">Grupo</option>
                                <option value="reposicao">Reposição</option>
                                <option value="avaliacao">Avaliação</option>
                                <option value="conversacao">Conversação</option>
                            </select>
                            <input type="text" id="filtroAlunoHistorico" class="form-input" placeholder="Filtrar por aluno...">
                            <button class="clear-filters-btn" onclick="limparFiltrosHistorico()" title="Limpar filtros">
                                <i class="fas fa-times"></i> Limpar
                            </button>
                        </div>
                    </div>
                    <div id="aulasHistoricoContainer" class="aulas-historico-container">
                        <!-- Preenchido via JavaScript -->
                    </div>
                </div>

                <!-- Calendário -->
                <div id="calendarioAulas" class="aulas-subtab">
                    <div class="calendario-header">
                        <h4><i class="fas fa-calendar-alt"></i> Calendário de Aulas</h4>
                        <div class="calendario-navigation">
                            <button class="btn btn-secondary" onclick="navegarMesCalendario(-1)">
                                <i class="fas fa-chevron-left"></i>
                            </button>
                            <span id="mesAnoCalendario" class="mes-ano-display"></span>
                            <button class="btn btn-secondary" onclick="navegarMesCalendario(1)">
                                <i class="fas fa-chevron-right"></i>
                            </button>
                        </div>
                    </div>
                    <div id="calendarioContainer" class="calendario-container">
                        <!-- Preenchido via JavaScript -->
                    </div>
                </div>

                <!-- Planejamento -->
                <div id="planejamentoAulas" class="aulas-subtab">
                    <div class="planejamento-header">
                        <h4><i class="fas fa-clipboard-list"></i> Planejamento de Aulas</h4>
                        <button class="btn btn-primary" onclick="showAdicionarPlanejamentoModal()">
                            <i class="fas fa-plus"></i> Novo Planejamento
                        </button>
                    </div>
                    <div id="planejamentoContainer" class="planejamento-container">
                        <!-- Preenchido via JavaScript -->
                    </div>
                </div>


            </div>
        </div>
    `;

    // Inicializar o módulo
    initializeAulasModule();
}

function loadRelatoriosModule(container) {
    console.log('📊 Carregando módulo de relatórios...');
    
    // Verificar se o container existe
    if (!container) {
        console.error('❌ Container não fornecido para loadRelatoriosModule');
        return;
    }
    
    // Tentar carregar o módulo de relatórios
    if (typeof loadReportsModule === 'function') {
        console.log('✅ Módulo de relatórios encontrado, carregando...');
        
        // Definir o container como gestaoContent temporariamente
        const originalGestaoContent = document.getElementById('gestaoContent');
        
        // Criar um elemento temporário com id gestaoContent se não existir
        if (!originalGestaoContent) {
            container.id = 'gestaoContent';
        }
        
        try {
            loadReportsModule();
            console.log('✅ Módulo de relatórios carregado com sucesso');
        } catch (error) {
            console.error('❌ Erro ao carregar módulo de relatórios:', error);
            container.innerHTML = `
                <div class="module-content">
                    <h3><i class="fas fa-exclamation-triangle"></i> Erro nos Relatórios</h3>
                    <p class="text-danger">Erro ao carregar módulo: ${error.message}</p>
                    <button class="btn btn-primary" onclick="loadRelatoriosModule(document.getElementById('gestaoContent'))">
                        <i class="fas fa-sync"></i> Tentar Novamente
                    </button>
                </div>
            `;
        }
    } else {
        console.warn('⚠️ Módulo de relatórios não encontrado, tentando carregamento com delay...');
        
        // Mostrar loading e tentar novamente após delay
        container.innerHTML = `
            <div class="module-content">
                <h3><i class="fas fa-chart-bar"></i> Relatórios de Desempenho</h3>
                <div class="loading-reports">
                    <div class="spinner-border text-primary" role="status">
                        <span class="sr-only">Carregando...</span>
                    </div>
                    <p class="text-info mt-3">Carregando módulo de relatórios...</p>
                    <p class="text-muted">Aguarde enquanto inicializamos o sistema de relatórios.</p>
                </div>
            </div>
        `;
        
        // Tentar novamente após 2 segundos
        setTimeout(() => {
            if (typeof loadReportsModule === 'function') {
                console.log('✅ Módulo de relatórios carregado após delay');
                loadRelatoriosModule(container);
            } else {
                console.error('❌ Módulo de relatórios ainda não disponível após delay');
                container.innerHTML = `
                    <div class="module-content">
                        <h3><i class="fas fa-exclamation-triangle"></i> Módulo Não Carregado</h3>
                        <p class="text-warning">O módulo de relatórios não foi carregado corretamente.</p>
                        <p class="text-muted">Verifique se o arquivo reports-module.js foi carregado.</p>
                        <div class="mt-3">
                            <button class="btn btn-primary" onclick="location.reload()">
                                <i class="fas fa-sync"></i> Recarregar Página
                            </button>
                            <button class="btn btn-info ml-2" onclick="loadRelatoriosModule(document.getElementById('gestaoContent'))">
                                <i class="fas fa-redo"></i> Tentar Novamente
                            </button>
                        </div>
                    </div>
                `;
            }
        }, 2000);
    }
}

// ==================== CONFIGURAÇÕES ====================
function loadConfigurations() {
    // Atualizar total de alunos
    document.getElementById('configTotalStudents').textContent = students.length;
    
    // Carregar tabela de níveis
    loadLevelsTable();
    
    // Atualizar valores de pontuação
    updatePointsDisplay();
}

function loadLevelsTable() {
    const tbody = document.getElementById('levelsTable');
    tbody.innerHTML = '';
    
    systemConfig.levelsConfig.forEach((level, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>
                <span class="level-badge ${level.class}">
                    ${level.icon} ${level.name}
                </span>
            </td>
            <td>${level.points} pontos</td>
            <td>
                <button class="btn btn-small edit-points-btn" onclick="editLevelPoints(${index})">
                    Editar
                </button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

function updatePointsDisplay() {
    document.getElementById('pointsPresenca').textContent = systemConfig.pointsConfig.presenca;
    document.getElementById('pointsTarefa').textContent = systemConfig.pointsConfig.tarefa;
    document.getElementById('pointsSequencia').textContent = systemConfig.pointsConfig.sequencia;
    document.getElementById('pointsBonus').textContent = systemConfig.pointsConfig.bonus;
}

function editPoints(type) {
    const currentValue = systemConfig.pointsConfig[type];
    const newValue = prompt(`Digite o novo valor para ${type}:`, currentValue);
    
    if (newValue !== null && !isNaN(newValue) && parseInt(newValue) > 0) {
        systemConfig.pointsConfig[type] = parseInt(newValue);
        saveData();
        updatePointsDisplay();
        showAlert('Pontuação atualizada com sucesso!', 'success');
    }
}

function editLevelPoints(levelIndex) {
    const level = systemConfig.levelsConfig[levelIndex];
    
    if (!level) {
        showAlert('Nível não encontrado!', 'error');
        return;
    }
    
    // Bronze (índice 0) sempre tem 0 pontos
    if (levelIndex === 0) {
        showAlert('O nível Bronze sempre tem 0 pontos e não pode ser editado.', 'warning');
        return;
    }
    
    const currentValue = level.points;
    const levelName = level.name;
    const previousLevel = systemConfig.levelsConfig[levelIndex - 1];
    const nextLevel = systemConfig.levelsConfig[levelIndex + 1];
    
    // Definir limites
    const minPoints = previousLevel.points + 50; // Pelo menos 50 pontos acima do anterior
    const maxPoints = nextLevel ? nextLevel.points - 50 : 15000; // Se há próximo nível, deixar 50 pontos de diferença
    
    const promptMessage = `Digite os pontos necessários para o nível ${levelName}:\n` +
                         `Valor atual: ${currentValue} pontos\n` +
                         `Mínimo: ${minPoints} pontos\n` +
                         `Máximo: ${maxPoints} pontos`;
    
    const newValue = prompt(promptMessage, currentValue);
    
    if (newValue !== null && !isNaN(newValue)) {
        const points = parseInt(newValue);
        
        // Validações
        if (points < minPoints) {
            showAlert(`O nível ${levelName} deve ter pelo menos ${minPoints} pontos (50 acima do ${previousLevel.name}).`, 'error');
            return;
        }
        
        if (points > maxPoints) {
            const nextLevelName = nextLevel ? nextLevel.name : 'limite máximo';
            showAlert(`O nível ${levelName} deve ter no máximo ${maxPoints} pontos (abaixo do ${nextLevelName}).`, 'error');
            return;
        }
        
        // Atualizar pontos
        systemConfig.levelsConfig[levelIndex].points = points;
        saveData();
        loadLevelsTable(); // Recarregar tabela
        updateAllStudentLevels(); // Atualizar níveis dos alunos
        showAlert(`Nível ${levelName} atualizado para ${points} pontos!`, 'success');
    }
}

function updateAllStudentLevels() {
    // Atualizar níveis de todos os alunos após mudança na configuração
    students.forEach(student => {
        const totalPoints = student.totalPoints || 0;
        student.level = determineLevel(totalPoints);
    });
    saveData();
    updateDashboard(); // Atualizar display
}

function determineLevel(totalPoints) {
    // Determinar nível baseado nos pontos totais
    let currentLevel = systemConfig.levelsConfig[0]; // Começar com Bronze
    
    for (let i = systemConfig.levelsConfig.length - 1; i >= 0; i--) {
        const level = systemConfig.levelsConfig[i];
        if (totalPoints >= level.points) {
            return level.name;
        }
    }
    
    return currentLevel.name; // Retornar Bronze se não encontrar nível
}

// Função para testar se os botões estão funcionando
function testLevelButtons() {
    console.log('🧪 Testando botões de editar níveis...');
    console.log('📊 Configuração atual dos níveis:', systemConfig.levelsConfig);
    
    // Verificar se todas as funções existem
    if (typeof editLevelPoints === 'function') {
        console.log('✅ Função editLevelPoints existe');
    } else {
        console.error('❌ Função editLevelPoints não encontrada');
    }
    
    if (typeof loadLevelsTable === 'function') {
        console.log('✅ Função loadLevelsTable existe');
    } else {
        console.error('❌ Função loadLevelsTable não encontrada');
    }
    
    if (typeof showAlert === 'function') {
        console.log('✅ Função showAlert existe');
    } else {
        console.error('❌ Função showAlert não encontrada');
    }
    
    // Testar se a tabela foi carregada
    const table = document.getElementById('levelsTable');
    if (table && table.children.length > 0) {
        console.log('✅ Tabela de níveis carregada com', table.children.length, 'linhas');
    } else {
        console.error('❌ Tabela de níveis não encontrada ou vazia');
    }
}

// ==================== FUNÇÕES UTILITÁRIAS ====================
function closeModal(modalId) {
    console.log('🔒 Tentando fechar modal:', modalId);
    
    const modal = document.getElementById(modalId);
    if (!modal) {
        console.error('❌ Modal não encontrado:', modalId);
        return;
    }
    
    // Verificar se o modal foi aberto com style.display ou com classe
    if (modal.style.display === 'flex' || modal.style.display === 'block') {
        modal.style.display = 'none';
        console.log('✅ Modal fechado via style.display:', modalId);
    } else {
    modal.classList.remove('show');
        console.log('✅ Modal fechado via classList:', modalId);
    }
    
    // Limpar formulários específicos quando o modal é fechado
    try {
        if (modalId === 'addPagamentoModal') {
            const form = document.getElementById('addPagamentoForm');
            if (form) {
                form.reset();
                console.log('🧹 Formulário de pagamento limpo');
            }
            
            // Ocultar informações do contrato
            const contratoInfo = document.getElementById('contratoInfo');
            if (contratoInfo) {
                contratoInfo.style.display = 'none';
            }
        } else if (modalId === 'editPagamentoModal') {
            const form = document.getElementById('editPagamentoForm');
            if (form) {
                form.reset();
                console.log('🧹 Formulário de edição de pagamento limpo');
            }
        } else if (modalId === 'addReposicaoModal') {
            // Limpar sistema de busca de alunos
            cleanupStudentSearch();
            const form = document.getElementById('addReposicaoForm');
            if (form) {
                form.reset();
                console.log('🧹 Formulário de reposição limpo e busca de alunos resetada');
            }
        }
    } catch (error) {
        console.warn('⚠️ Erro ao limpar formulário:', error);
    }
}

function showAlert(message, type = 'info') {
    // Criar elemento de alerta
    const alert = document.createElement('div');
    alert.className = `alert alert-${type}`;
    alert.innerHTML = `
        <i class="fas fa-${getAlertIcon(type)} alert-icon"></i>
        <span>${message}</span>
    `;
    
    // Adicionar ao corpo da página
    document.body.appendChild(alert);
    
    // Remover após 3 segundos
    setTimeout(() => {
        if (alert.parentNode) {
            alert.parentNode.removeChild(alert);
        }
    }, 3000);
}

function getAlertIcon(type) {
    const icons = {
        'success': 'check-circle',
        'danger': 'exclamation-triangle',
        'warning': 'exclamation-circle',
        'info': 'info-circle'
    };
    return icons[type] || 'info-circle';
}

function generateRandomPassword() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let password = '';
    for (let i = 0; i < 8; i++) {
        password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
}

function generateId() {
    return 'id_' + Math.random().toString(36).substr(2, 9);
}

function formatDate(dateString) {
    if (!dateString) return 'Data inválida';
    
    const date = new Date(dateString + 'T12:00:00'); // Adicionar horário para evitar problemas de timezone
    
    if (isNaN(date.getTime())) {
        console.warn('⚠️ Data inválida detectada:', dateString);
        return 'Data inválida';
    }
    
    return date.toLocaleDateString('pt-BR');
}

function isValidUrl(string) {
    try {
        new URL(string);
        return true;
    } catch (_) {
        return false;
    }
}

function saveData() {
    localStorage.setItem('students', JSON.stringify(students));
    localStorage.setItem('tasks', JSON.stringify(tasks));
    localStorage.setItem('bookTasks', JSON.stringify(bookTasks));
    localStorage.setItem('achievements', JSON.stringify(achievements));
    localStorage.setItem('attendance', JSON.stringify(attendance));
    localStorage.setItem('reposicoes', JSON.stringify(reposicoes));
    localStorage.setItem('contratos', JSON.stringify(contratos));
    localStorage.setItem('mensalidades', JSON.stringify(mensalidades));
    localStorage.setItem('pagamentos', JSON.stringify(pagamentos));
    localStorage.setItem('aulasDadas', JSON.stringify(aulasDadas));
    localStorage.setItem('systemConfig', JSON.stringify(systemConfig));
}

// ==================== INICIALIZAÇÃO DE CONQUISTAS ====================
function initializeAchievements() {
    // Verificar se existem conquistas antigas que precisam ser atualizadas
    const needsUpdate = achievements.length === 0 || 
                       achievements.some(a => !a.name || a.icon?.includes('🎯') || a.icon?.includes('⭐'));
    
    if (needsUpdate) {
        console.log('📝 Atualizando conquistas para nova versão...');
        
        const defaultAchievements = [
            {
                id: 'first_step',
                name: 'First Step',
                description: 'Participou da primeira aula de inglês',
                icon: 'fas fa-step-forward',
                points: 10,
                condition: 'attendance',
                target: 1,
                autoCheck: true,
                createdDate: new Date().toISOString().split('T')[0]
            },
            {
                id: 'english_speaker',
                name: 'English Speaker', 
                description: 'Completou 5 tarefas',
                icon: 'fas fa-microphone',
                points: 25,
                condition: 'tasks',
                target: 5,
                autoCheck: true,
                createdDate: new Date().toISOString().split('T')[0]
            },
            {
                id: 'vocabulary_builder',
                name: 'Vocabulary Builder',
                description: 'Completou 10 tarefas do livro',
                icon: 'fas fa-book-reader',
                points: 30,
                condition: 'bookTasks',
                target: 10,
                autoCheck: true,
                createdDate: new Date().toISOString().split('T')[0]
            },
            {
                id: 'grammar_master',
                name: 'Grammar Master',
                description: 'Alcançou 100 pontos totais',
                icon: 'fas fa-language',
                points: 35,
                condition: 'points',
                target: 100,
                autoCheck: true,
                createdDate: new Date().toISOString().split('T')[0]
            },
            {
                id: 'listening_champion',
                name: 'Listening Champion',
                description: 'Sequência de 7 dias de presença',
                icon: 'fas fa-headphones',
                points: 40,
                condition: 'streak',
                target: 7,
                autoCheck: true,
                createdDate: new Date().toISOString().split('T')[0]
            },
            {
                id: 'perfect_attendance',
                name: 'Perfect Attendance',
                description: 'Presente em 15 aulas',
                icon: 'fas fa-calendar-check',
                points: 50,
                condition: 'attendance',
                target: 15,
                autoCheck: true,
                createdDate: new Date().toISOString().split('T')[0]
            },
            {
                id: 'conversation_expert',
                name: 'Conversation Expert',
                description: 'Completou 20 tarefas',
                icon: 'fas fa-comments',
                points: 45,
                condition: 'tasks',
                target: 20,
                autoCheck: true,
                createdDate: new Date().toISOString().split('T')[0]
            },
            {
                id: 'fluency_seeker',
                name: 'Fluency Seeker',
                description: 'Alcançou 500 pontos totais',
                icon: 'fas fa-trophy',
                points: 100,
                condition: 'points',
                target: 500,
                autoCheck: true,
                createdDate: new Date().toISOString().split('T')[0]
            }
        ];
        
        // Substituir todas as conquistas pelas novas
        achievements.length = 0;
        achievements.push(...defaultAchievements);
        saveData();
        console.log('✅ Conquistas atualizadas com sucesso!');
    }
}

function loadAchievements() {
    const container = document.getElementById('achievementsContainer');
    container.innerHTML = '';
    
    if (achievements.length === 0) {
        container.innerHTML = '<p class="text-muted text-center">Nenhuma conquista criada ainda.</p>';
        return;
    }
    
    achievements.forEach((achievement, index) => {
        const achievementCard = document.createElement('div');
        achievementCard.className = 'achievement-card';
        const conditionLabels = {
            'attendance': 'Presenças',
            'tasks': 'Tarefas Gerais',
            'bookTasks': 'Tarefas do Livro',
            'points': 'Pontos Totais',
            'streak': 'Sequência de Presença'
        };
        
        achievementCard.innerHTML = `
            <div class="achievement-header">
                <h4><i class="${achievement.icon || 'fas fa-trophy'}"></i> ${achievement.name || achievement.title || 'Conquista sem nome'}</h4>
                <span class="achievement-points">${achievement.points} pts</span>
            </div>
            <div class="achievement-body">
                <p>${achievement.description || 'Sem descrição'}</p>
                <div class="achievement-requirements">
                    <strong>Requisito:</strong> ${achievement.target || 1} ${conditionLabels[achievement.condition] || 'Não definido'}
                    ${achievement.autoCheck ? '<span class="auto-badge">🤖 Automático</span>' : '<span class="manual-badge">👨‍🏫 Manual</span>'}
                </div>
                <small class="text-muted">Criado em: ${formatDate(achievement.createdDate)}</small>
            </div>
            <div class="achievement-actions">
                <button class="btn btn-warning btn-small" onclick="editAchievement(${index})">
                    <i class="fas fa-edit"></i> Editar
                </button>
                <button class="btn btn-danger btn-small" onclick="removeAchievement(${index})">
                    <i class="fas fa-trash"></i> Remover
                </button>
            </div>
        `;
        container.appendChild(achievementCard);
    });
}

function loadBookTasks() {
    const container = document.getElementById('bookTasksContainer');
    container.innerHTML = '';
    
    if (bookTasks.length === 0) {
        // O estado vazio é tratado pelo CSS com ::after
        return;
    }
    
    bookTasks.forEach((task, index) => {
        const taskCard = document.createElement('div');
        taskCard.className = 'task-card';
        taskCard.innerHTML = `
            <div class="task-header">
                <h4>${task.bookName} - Página ${task.bookPage}</h4>
                <span class="task-points">${task.points} pontos</span>
            </div>
            <div class="task-info">
                <div class="task-detail">
                    <strong>Exercícios:</strong> ${task.exercises}
                </div>
                ${task.description ? `<div class="task-detail"><strong>Descrição:</strong> ${task.description}</div>` : ''}
                ${task.dueDate ? `<div class="task-detail"><strong>Data de Entrega:</strong> ${formatDate(task.dueDate)}</div>` : ''}
                <div class="task-detail">
                    <strong>Alunos:</strong> ${task.selectedStudents.length} selecionados
                </div>
                <small class="text-muted">Criado em: ${formatDate(task.createdDate)}</small>
            </div>
            <div class="task-students">
                <h5>Progresso dos Alunos:</h5>
                <div class="students-list">
                    ${task.selectedStudents.map(email => {
                        const student = students.find(s => s.email === email);
                        const isCompleted = student && student.completedBookTasks && student.completedBookTasks.includes(task.id);
                        return `
                            <div class="student-task-item ${isCompleted ? 'completed' : ''}">
                                <span class="student-name">${student ? student.name : email}</span>
                                <button class="btn ${isCompleted ? 'btn-warning' : 'btn-success'} btn-small" 
                                        onclick="toggleBookTaskCompletion('${email}', '${task.id}')">
                                    ${isCompleted ? 'Desmarcar' : 'Marcar'} Concluída
                                </button>
                            </div>
                        `;
                    }).join('')}
                </div>
            </div>
            <div class="task-actions">
                <button class="btn btn-warning btn-small" onclick="editBookTask(${index})">
                    <i class="fas fa-edit"></i> Editar
                </button>
                <button class="btn btn-danger btn-small" onclick="removeBookTask(${index})">
                    <i class="fas fa-trash"></i> Remover
                </button>
            </div>
        `;
        container.appendChild(taskCard);
    });
}

function loadReposicoes() {
    // Carregar lista de alunos no filtro
    loadStudentFilterForReposicoes();
    
    // Aplicar filtro se algum aluno estiver selecionado
    filterReposicoesByStudent();
}

function loadStudentFilterForReposicoes() {
    const select = document.getElementById('studentReposicaoFilter');
    if (!select) return; // Filtro não existe ainda
    
    const currentValue = select.value; // Preservar seleção atual
    select.innerHTML = '<option value="">Todos os alunos</option>';
    
    students.forEach(student => {
        const option = document.createElement('option');
        option.value = student.email;
        option.textContent = student.name;
        select.appendChild(option);
    });
    
    // Restaurar seleção se havia uma
    if (currentValue) {
        select.value = currentValue;
    }
}

function filterReposicoesByStudent(studentEmail = null) {
    let selectedStudentEmail = studentEmail;
    
    // Se não foi fornecido email como parâmetro, tentar ler do campo antigo (compatibilidade)
    if (!selectedStudentEmail) {
        selectedStudentEmail = document.getElementById('studentReposicaoFilter')?.value || '';
    }
    
    // Filtrar reposições baseado no aluno selecionado
    let filteredReposicoes = reposicoes;
    if (selectedStudentEmail) {
        filteredReposicoes = reposicoes.filter(r => r.studentEmail === selectedStudentEmail);
        console.log(`🔍 Filtrando reposições para: ${selectedStudentEmail} - ${filteredReposicoes.length} encontradas`);
    } else {
        console.log('📋 Exibindo todas as reposições');
    }
    
    // Renderizar reposições filtradas
    renderFilteredReposicoes(filteredReposicoes);
}

function renderFilteredReposicoes(filteredReposicoes) {
    const proximasContainer = document.getElementById('proximasReposicoes');
    const realizadasContainer = document.getElementById('reposicoesRealizadas');
    
    if (proximasContainer) {
        proximasContainer.innerHTML = '';
        const proximasReposicoes = filteredReposicoes.filter(r => r.status === 'agendada');
        
        if (proximasReposicoes.length === 0) {
            const selectedStudent = document.getElementById('studentReposicaoFilter')?.value;
            const message = selectedStudent ? 
                'Nenhuma reposição agendada para este aluno.' : 
                'Nenhuma reposição agendada.';
            proximasContainer.innerHTML = `<p class="text-muted">${message}</p>`;
        } else {
            proximasReposicoes.forEach((reposicao, index) => {
                const reposicaoCard = document.createElement('div');
                reposicaoCard.className = 'reposicao-card';
                reposicaoCard.innerHTML = `
                    <div class="reposicao-header">
                        <h4>${reposicao.studentName}</h4>
                        <span class="reposicao-status status-${reposicao.status}">${reposicao.status}</span>
                    </div>
                    <div class="reposicao-body">
                        <p><strong>Motivo:</strong> ${reposicao.motivo}</p>
                        <p><strong>Aula Original:</strong> ${formatDate(reposicao.dataOriginal)}</p>
                        <p><strong>Data da Reposição:</strong> ${formatDate(reposicao.dataReposicao)}</p>
                        ${reposicao.horario ? `<p><strong>Horário:</strong> ${reposicao.horario}</p>` : ''}
                        ${reposicao.observacoes ? `<p><strong>Observações:</strong> ${reposicao.observacoes}</p>` : ''}
                    </div>
                    <div class="reposicao-actions">
                        <button class="btn btn-success btn-small" onclick="markReposicaoAsCompleted('${reposicao.id}')">
                            <i class="fas fa-check"></i> Marcar como Realizada
                        </button>
                        <button class="btn btn-warning btn-small" onclick="editReposicao('${reposicao.id}')">
                            <i class="fas fa-edit"></i> Editar
                        </button>
                        <button class="btn btn-danger btn-small" onclick="removeReposicao('${reposicao.id}')">
                            <i class="fas fa-trash"></i> Remover
                        </button>
                    </div>
                `;
                proximasContainer.appendChild(reposicaoCard);
            });
        }
    }
    
    if (realizadasContainer) {
        realizadasContainer.innerHTML = '';
        const realizadasReposicoes = filteredReposicoes.filter(r => r.status === 'realizada');
        
        if (realizadasReposicoes.length === 0) {
            const selectedStudent = document.getElementById('studentReposicaoFilter')?.value;
            const message = selectedStudent ? 
                'Nenhuma reposição realizada para este aluno.' : 
                'Nenhuma reposição realizada.';
            realizadasContainer.innerHTML = `<p class="text-muted">${message}</p>`;
        } else {
            realizadasReposicoes.forEach(reposicao => {
                const reposicaoCard = document.createElement('div');
                reposicaoCard.className = 'reposicao-card completed';
                reposicaoCard.innerHTML = `
                    <div class="reposicao-header">
                        <h4>${reposicao.studentName}</h4>
                        <span class="reposicao-status status-${reposicao.status}">${reposicao.status}</span>
                    </div>
                    <div class="reposicao-body">
                        <p><strong>Motivo:</strong> ${reposicao.motivo}</p>
                        <p><strong>Aula Original:</strong> ${formatDate(reposicao.dataOriginal)}</p>
                        <p><strong>Data da Reposição:</strong> ${formatDate(reposicao.dataReposicao)}</p>
                        ${reposicao.horario ? `<p><strong>Horário:</strong> ${reposicao.horario}</p>` : ''}
                        ${reposicao.observacoes ? `<p><strong>Observações:</strong> ${reposicao.observacoes}</p>` : ''}
                    </div>
                `;
                realizadasContainer.appendChild(reposicaoCard);
            });
        }
    }
}

// ==================== INTERFACE DO ALUNO ====================
function showStudentInterface() {
    // Implementação da interface do aluno será expandida conforme necessário
    document.getElementById('loginScreen').style.display = 'none';
    document.getElementById('mainInterface').style.display = 'block';
    
    // Ocultar funcionalidades específicas do professor
    const professorElements = document.querySelectorAll('.professor-only');
    professorElements.forEach(el => el.style.display = 'none');
}

console.log(' SpeakEnglish v2.5.0 carregado com sucesso!');

function showAddBookTaskModal() {
    const modal = document.getElementById('addBookTaskModal');
    modal.classList.add('show');
    
    // Limpar formulário
    document.getElementById('addBookTaskForm').reset();
    document.getElementById('bookTaskPoints').value = 10;
    
    // Carregar lista de alunos para seleção
    loadStudentsForBookTask();
}

function loadStudentsForBookTask() {
    const container = document.getElementById('bookTaskStudents');
    container.innerHTML = '';
    
    students.forEach(student => {
        const studentDiv = document.createElement('div');
        studentDiv.className = 'form-checkbox';
        studentDiv.innerHTML = `
            <input type="checkbox" id="book-student-${student.email}" value="${student.email}">
            <label for="book-student-${student.email}">${student.name} (${student.level})</label>
        `;
        container.appendChild(studentDiv);
    });
}

function addBookTask() {
    const bookName = document.getElementById('bookName').value;
    const bookPage = document.getElementById('bookPage').value;
    const exercises = document.getElementById('bookExercises').value;
    const points = parseInt(document.getElementById('bookTaskPoints').value);
    const description = document.getElementById('bookTaskDescription').value;
    const dueDate = document.getElementById('bookTaskDueDate').value;
    
    // Coletar alunos selecionados
    const selectedStudents = [];
    students.forEach(student => {
        const checkbox = document.getElementById(`book-student-${student.email}`);
        if (checkbox && checkbox.checked) {
            selectedStudents.push(student.email);
        }
    });
    
    // Validações
    if (!bookName || !bookPage || !exercises || !points || selectedStudents.length === 0) {
        showAlert('Por favor, preencha todos os campos obrigatórios e selecione pelo menos um aluno.', 'danger');
        return;
    }
    
    const newBookTask = {
        id: generateId(),
        bookName,
        bookPage,
        exercises,
        points,
        description: description || '',
        dueDate: dueDate || null,
        selectedStudents,
        createdDate: new Date().toISOString().split('T')[0],
        completed: false
    };
    
    bookTasks.push(newBookTask);
    saveData();
    
    closeModal('addBookTaskModal');
    loadBookTasks();
    updateDashboard();
    
    showAlert('Tarefa do livro criada com sucesso!', 'success');
}

function showAddAchievementModal() {
    const modal = document.getElementById('addAchievementModal');
    modal.classList.add('show');
    
    // Limpar formulário
    document.getElementById('addAchievementForm').reset();
    document.getElementById('achievementPoints').value = 20;
    document.getElementById('achievementIcon').value = '';
}

function addAchievement() {
    const name = document.getElementById('achievementName').value;
    const description = document.getElementById('achievementDescription').value;
    const icon = document.getElementById('achievementIcon').value;
    const points = parseInt(document.getElementById('achievementPoints').value);
    const condition = document.getElementById('achievementCondition').value;
    const target = parseInt(document.getElementById('achievementTarget').value);
    const autoCheck = document.getElementById('achievementAutoCheck').checked;
    
    if (!name || !condition || !target) {
        showAlert('Por favor, preencha todos os campos obrigatórios.', 'danger');
        return;
    }
    
    const newAchievement = {
        id: generateId(),
        name,
        description: description || '',
        icon: icon || 'fas fa-trophy',
        points: points || 0,
        condition,
        target,
        autoCheck,
        createdDate: new Date().toISOString().split('T')[0]
    };
    
    achievements.push(newAchievement);
    saveData();
    
    closeModal('addAchievementModal');
    loadAchievements();
    updateDashboard();
    
    showAlert('Conquista criada com sucesso!', 'success');
}

function showAddReposicaoModal() {
    const modal = document.getElementById('addReposicaoModal');
    modal.classList.add('show');
    
    // Limpar formulário
    document.getElementById('addReposicaoForm').reset();
    document.getElementById('reposicaoStatus').value = 'agendada';
    
    // Aplicar correções CSS dinâmicas como backup
    setTimeout(() => {
        applyReposicaoCSSFixes();
    }, 100);
    
    // Inicializar sistema de busca múltipla de alunos
    initReposicaoStudentsSearch();
}

// Função para aplicar correções CSS dinamicamente
function applyReposicaoCSSFixes() {
    try {
        const container = document.querySelector('.reposicao-students-search-container');
        const icon = container?.querySelector('.search-input-group i');
        const input = container?.querySelector('.search-input-group input');
        const suggestions = container?.querySelector('.students-suggestions');
        
        if (icon) {
            icon.style.left = '12px';
            icon.style.right = 'auto';
            icon.style.zIndex = '5';
            icon.style.pointerEvents = 'none';
        }
        
        if (input) {
            input.style.paddingLeft = '40px';
            input.style.paddingRight = '12px';
        }
        
        if (suggestions) {
            suggestions.style.zIndex = '999999';
            suggestions.style.position = 'absolute';
            suggestions.style.top = '100%';
            suggestions.style.background = 'white';
            suggestions.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.25)';
        }
        
        if (container) {
            container.style.position = 'relative';
            container.style.overflow = 'visible';
        }
        
        console.log('✅ Correções CSS aplicadas dinamicamente');
    } catch (error) {
        console.warn('⚠️ Erro ao aplicar correções CSS:', error);
    }
}

// ==================== SISTEMA DE BUSCA MÚLTIPLA PARA REPOSIÇÕES ====================

// Variáveis globais para seleção múltipla
let reposicaoSelectedStudents = [];
let reposicaoSearchTimeout;

function initReposicaoStudentsSearch() {
    const searchInput = document.getElementById('reposicaoStudentsSearch');
    const suggestionsContainer = document.getElementById('reposicaoStudentsSuggestions');
    const selectedContainer = document.getElementById('reposicaoSelectedStudents');
    
    if (!searchInput || !suggestionsContainer || !selectedContainer) {
        console.error('❌ Elementos de busca de reposição não encontrados');
        return;
    }
    
    // Limpar seleções ao abrir o modal
    reposicaoSelectedStudents = [];
    updateReposicaoSelectedStudentsDisplay();
    
    // Limpar input de busca
    searchInput.value = '';
    
    // Evento de digitação com debounce
    searchInput.addEventListener('input', function(e) {
        clearTimeout(reposicaoSearchTimeout);
        const query = e.target.value.trim();
        
        if (query.length < 2) {
            hideReposicaoSuggestions();
            return;
        }
        
        // Debounce para performance
        reposicaoSearchTimeout = setTimeout(() => {
            searchReposicaoStudents(query);
        }, 200);
    });
    
    // Fechar sugestões ao clicar fora
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.reposicao-students-search-container')) {
            hideReposicaoSuggestions();
        }
    });
    
    // Mostrar sugestões ao focar (se há texto)
    searchInput.addEventListener('focus', function() {
        if (searchInput.value.trim().length >= 2) {
            searchReposicaoStudents(searchInput.value.trim());
        }
    });
    
    // APLICAR CORREÇÕES CSS DINÂMICAS
    applyCSSFixesForReposicao();
    
    console.log('✅ Sistema de busca múltipla para reposições inicializado');
}

function searchReposicaoStudents(query) {
    if (!students || students.length === 0) {
        showReposicaoNoResults();
        return;
    }
    
    // Filtrar estudantes (excluir já selecionados)
    const filteredStudents = students.filter(student => {
        const name = student.name.toLowerCase();
        const email = student.email.toLowerCase();
        const level = student.level ? student.level.toLowerCase() : '';
        const searchQuery = query.toLowerCase();
        
        // Buscar por nome, email ou nível
        const matchesSearch = name.includes(searchQuery) || 
                             email.includes(searchQuery) || 
                             level.includes(searchQuery);
        
        // Excluir alunos já selecionados
        const notSelected = !reposicaoSelectedStudents.some(selected => selected.email === student.email);
        
        return matchesSearch && notSelected;
    });
    
    showReposicaoSuggestions(filteredStudents);
}

// 🔧 CORREÇÃO FORÇADA - Função para forçar posicionamento correto das sugestões
function forceCorrectSuggestionsPosition() {
    const suggestionsContainer = document.getElementById('reposicaoStudentsSuggestions');
    const searchInput = document.getElementById('reposicaoStudentsSearch');
    
    if (suggestionsContainer && searchInput) {
        // Força estilos inline que têm prioridade máxima
        suggestionsContainer.style.position = 'fixed';
        suggestionsContainer.style.zIndex = '2147483647';
        suggestionsContainer.style.background = 'white';
        suggestionsContainer.style.border = '2px solid #007bff';
        suggestionsContainer.style.borderTop = 'none';
        suggestionsContainer.style.borderRadius = '0 0 8px 8px';
        suggestionsContainer.style.boxShadow = '0 8px 24px rgba(0,0,0,0.5)';
        suggestionsContainer.style.maxHeight = '200px';
        suggestionsContainer.style.overflowY = 'auto';
        
        // Calcula posição baseada no input
        const rect = searchInput.getBoundingClientRect();
        suggestionsContainer.style.top = (rect.bottom) + 'px';
        suggestionsContainer.style.left = rect.left + 'px';
        suggestionsContainer.style.width = rect.width + 'px';
        
        console.log('🔧 Posicionamento forçado aplicado às sugestões');
    }
}

// Aplica o posicionamento forçado sempre que as sugestões são exibidas
function showReposicaoSuggestions(matchingStudents) {
    console.log('🔍 Exibindo sugestões para reposição:', matchingStudents.length);
    const suggestionsContainer = document.getElementById('reposicaoStudentsSuggestions');
    
    suggestionsContainer.innerHTML = matchingStudents.map(student => `
        <div class="task-suggestion-item" onclick="selectReposicaoStudent('${student.email}')">
            <div class="task-suggestion-info">
                <div class="task-suggestion-name">${student.name}</div>
                <div class="task-suggestion-email">${student.email}</div>
            </div>
            <div class="task-suggestion-level">${student.level || 'N/A'}</div>
        </div>
    `).join('');
    
    suggestionsContainer.classList.add('show');
    
    // FORÇA posicionamento correto
    setTimeout(() => {
        forceCorrectSuggestionsPosition();
    }, 10);
}

function showReposicaoNoResults() {
    const suggestionsContainer = document.getElementById('reposicaoStudentsSuggestions');
    suggestionsContainer.innerHTML = `
        <div class="no-students-found">
            <i class="fas fa-user-slash"></i>
            <p>Nenhum aluno encontrado</p>
        </div>
    `;
    suggestionsContainer.classList.add('show');
}

function hideReposicaoSuggestions() {
    const suggestionsContainer = document.getElementById('reposicaoStudentsSuggestions');
    suggestionsContainer.classList.remove('show');
}

function selectReposicaoStudent(studentEmail) {
    const student = students.find(s => s.email === studentEmail);
    if (!student) {
        console.error('❌ Aluno não encontrado:', studentEmail);
        return;
    }
    
    // Verificar se já não está selecionado
    if (reposicaoSelectedStudents.some(s => s.email === studentEmail)) {
        console.warn('⚠️ Aluno já selecionado:', student.name);
        return;
    }
    
    // Adicionar à lista de selecionados
    reposicaoSelectedStudents.push(student);
    
    // Limpar input e sugestões
    document.getElementById('reposicaoStudentsSearch').value = '';
    hideReposicaoSuggestions();
    
    // Atualizar display
    updateReposicaoSelectedStudentsDisplay();
    
    console.log(`✅ Aluno adicionado: ${student.name}`);
}

function removeReposicaoStudent(studentEmail) {
    reposicaoSelectedStudents = reposicaoSelectedStudents.filter(student => student.email !== studentEmail);
    updateReposicaoSelectedStudentsDisplay();
    
    const student = students.find(s => s.email === studentEmail);
    console.log(`🗑️ Aluno removido: ${student ? student.name : studentEmail}`);
}

function clearAllReposicaoStudents() {
    reposicaoSelectedStudents = [];
    updateReposicaoSelectedStudentsDisplay();
    console.log('🧹 Todos os alunos removidos da seleção');
}

function updateReposicaoSelectedStudentsDisplay() {
    const selectedContainer = document.getElementById('reposicaoSelectedStudents');
    const countElement = document.getElementById('reposicaoSelectedCount');
    const clearAllBtn = document.querySelector('.btn-clear-all');
    
    if (!selectedContainer) {
        console.error('❌ Container de selecionados não encontrado');
        return;
    }
    
    // Atualizar contador se existir
    if (countElement) {
        countElement.textContent = reposicaoSelectedStudents.length;
    }
    
    // Mostrar/ocultar botão "Limpar todos" se existir
    if (clearAllBtn) {
        clearAllBtn.style.display = reposicaoSelectedStudents.length > 0 ? 'block' : 'none';
    }
    
    // Renderizar lista de alunos selecionados - estilo tarefas
    if (reposicaoSelectedStudents.length === 0) {
        selectedContainer.innerHTML = '<p class="task-no-students">Nenhum aluno selecionado</p>';
        return;
    }
    
    selectedContainer.innerHTML = reposicaoSelectedStudents.map(student => `
        <div class="selected-student-item">
            <div class="selected-student-main-info">
                <div>
                    <div class="selected-student-name">${student.name}</div>
                    <div class="selected-student-email">${student.email}</div>
                </div>
            </div>
            <div class="selected-student-level">${student.level || 'N/A'}</div>
            <button type="button" class="btn-remove-student" onclick="removeReposicaoStudent('${student.email}')" title="Remover aluno">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `).join('');
}

// ... existing code ...

// ==================== ADIÇÃO DE REPOSIÇÕES COM MÚLTIPLOS ALUNOS ====================

function addReposicao() {
    console.log('🔄 INÍCIO addReposicao - Sistema Múltiplos Alunos');
    
    // Obter dados do formulário
    const motivo = document.getElementById('reposicaoMotivo').value;
    const dataOriginal = document.getElementById('reposicaoDataOriginal').value;
    const dataReposicao = document.getElementById('reposicaoDataReposicao').value;
    const horario = document.getElementById('reposicaoHorario').value;
    const status = document.getElementById('reposicaoStatus').value;
    const observacoes = document.getElementById('reposicaoObservacoes').value;
    
    console.log('📋 Dados da reposição:', {
        alunos: reposicaoSelectedStudents.length,
        motivo, dataOriginal, dataReposicao, horario, status, observacoes
    });
    
    // Validações
    if (reposicaoSelectedStudents.length === 0) {
        console.log('❌ Nenhum aluno selecionado');
        showAlert('Por favor, selecione pelo menos um aluno.', 'danger');
        return;
    }
    
    if (!motivo || !dataOriginal || !dataReposicao) {
        console.log('❌ Validação falhou - campos obrigatórios vazios');
        showAlert('Por favor, preencha todos os campos obrigatórios.', 'danger');
        return;
    }
    
    // Gerar ID de grupo para reposições múltiplas
    const groupId = reposicaoSelectedStudents.length > 1 ? generateId() : null;
    
    console.log('📊 Criando reposições:', {
        totalAlunos: reposicaoSelectedStudents.length,
        grupoId: groupId,
        tipoReposicao: reposicaoSelectedStudents.length > 1 ? 'grupo' : 'individual'
    });
    
    // Criar uma reposição para cada aluno selecionado
    const novasReposicoes = reposicaoSelectedStudents.map(student => {
        return {
            id: generateId(),
            studentEmail: student.email,
            studentName: student.name,
            motivo,
            dataOriginal,
            dataReposicao,
            horario: horario || null,
            status,
            observacoes: observacoes || '',
            groupId: groupId, // ID do grupo para reposições múltiplas
            groupSize: reposicaoSelectedStudents.length, // Quantos alunos no grupo
            groupMembers: reposicaoSelectedStudents.map(s => s.name).join(', '), // Nomes dos membros
            createdDate: new Date().toISOString().split('T')[0]
        };
    });
    
    // Adicionar todas as reposições ao array global
    reposicoes.push(...novasReposicoes);
    
    console.log('📄 Reposições criadas:', {
        quantidade: novasReposicoes.length,
        alunos: novasReposicoes.map(r => r.studentName),
        totalReposicoes: reposicoes.length
    });
    
    saveData();
    console.log('💾 Dados salvos');
    
    closeModal('addReposicaoModal');
    loadReposicoes();
    updateDashboard();
    
    // Se a data da reposição for hoje ou a data selecionada na presença, recarregar presença
    const attendanceDate = document.getElementById('attendanceDate');
    if (attendanceDate && attendanceDate.value === dataReposicao) {
        console.log('🔄 Recarregando presença porque a reposição é para a data selecionada');
        loadAttendance();
    }
    
    // Feedback personalizado baseado no número de alunos
    const tipoReposicao = reposicaoSelectedStudents.length > 1 ? 'em grupo' : 'individual';
    const quantidadeText = reposicaoSelectedStudents.length === 1 ? 
        reposicaoSelectedStudents[0].name : 
        `${reposicaoSelectedStudents.length} alunos`;
    
    showAlert(`Reposição ${tipoReposicao} criada com sucesso para ${quantidadeText}!`, 'success');
    console.log('✅ FIM addReposicao');
}

// Função para limpar sistema de busca ao fechar modal
function cleanupStudentSearch() {
    reposicaoSelectedStudents = [];
    const searchInput = document.getElementById('reposicaoStudentsSearch');
    const suggestionsContainer = document.getElementById('reposicaoStudentsSuggestions');
    
    if (searchInput) {
        searchInput.value = '';
    }
    
    if (suggestionsContainer) {
        suggestionsContainer.classList.remove('show');
        suggestionsContainer.innerHTML = '';
    }
    
    // Limpar sugestões globais também
    if (window.cleanupGlobalSuggestions) {
        window.cleanupGlobalSuggestions();
    }
    
    updateReposicaoSelectedStudentsDisplay();
    console.log('🧹 Sistema de busca de alunos limpo');
}

// ==================== SISTEMA DE MENSALIDADES ====================

// Função para inicializar sistema de mensalidades
function initializeMensalidadesSystem() {
    console.log('💰 Inicializando sistema de mensalidades...');
    
    // Verificar se há mensalidades salvas
    const savedMensalidades = localStorage.getItem('mensalidades');
    if (savedMensalidades) {
        try {
            window.mensalidades = JSON.parse(savedMensalidades);
            console.log(`📋 ${mensalidades.length} mensalidades carregadas do localStorage`);
        } catch (error) {
            console.error('❌ Erro ao carregar mensalidades:', error);
            window.mensalidades = [];
        }
    } else {
        window.mensalidades = [];
        console.log('📋 Nenhuma mensalidade encontrada - iniciando array vazio');
    }
    
    // Verificar se há contratos ativos sem mensalidades geradas
    if (window.contratos && contratos.length > 0) {
        const contratosAtivos = contratos.filter(c => c.status === 'ativo');
        console.log(`📄 Contratos ativos encontrados: ${contratosAtivos.length}`);
        
        let mensalidadesGeradas = 0;
        contratosAtivos.forEach(contrato => {
            // Verificar se já existem mensalidades para este contrato
            const mensalidadesExistentes = mensalidades.filter(m => m.contratoId === contrato.id);
            
            if (mensalidadesExistentes.length === 0) {
                console.log(`💰 Verificando mensalidades para: ${contrato.studentName}`);
                mensalidadesGeradas++;
            }
        });
        
        if (mensalidadesGeradas > 0) {
            console.log(`✅ Sistema verificou ${mensalidadesGeradas} contratos sem mensalidades`);
        }
    }
    
    console.log('✅ Sistema de mensalidades inicializado');
    return {
        totalMensalidades: mensalidades ? mensalidades.length : 0,
        contratosAtivos: contratos ? contratos.filter(c => c.status === 'ativo').length : 0
    };
}

// ==================== SISTEMA DE MENSALIDADES (GLOBAL) ====================

// Função para inicializar sistema de mensalidades - VERSÃO GLOBAL
window.initializeMensalidadesSystem = function() {
    console.log('💰 Inicializando sistema de mensalidades...');
    
    // Verificar se há mensalidades salvas
    const savedMensalidades = localStorage.getItem('mensalidades');
    if (savedMensalidades) {
        try {
            window.mensalidades = JSON.parse(savedMensalidades);
            console.log(`📋 ${mensalidades.length} mensalidades carregadas do localStorage`);
        } catch (error) {
            console.error('❌ Erro ao carregar mensalidades:', error);
            window.mensalidades = [];
        }
    } else {
        window.mensalidades = [];
        console.log('📋 Nenhuma mensalidade encontrada - iniciando array vazio');
    }
    
    // Verificar se há contratos ativos sem mensalidades geradas
    if (window.contratos && contratos.length > 0) {
        const contratosAtivos = contratos.filter(c => c.status === 'ativo');
        console.log(`📄 Contratos ativos encontrados: ${contratosAtivos.length}`);
        
        let mensalidadesGeradas = 0;
        contratosAtivos.forEach(contrato => {
            // Verificar se já existem mensalidades para este contrato
            const mensalidadesExistentes = mensalidades.filter(m => m.contratoId === contrato.id);
            
            if (mensalidadesExistentes.length === 0) {
                console.log(`📝 Contrato ${contrato.id} sem mensalidades - gerando automaticamente`);
                mensalidadesGeradas++;
            }
        });
        
        if (mensalidadesGeradas > 0) {
            console.log(`✅ ${mensalidadesGeradas} contratos processados para geração de mensalidades`);
        } else {
            console.log('✅ Todos os contratos já possuem mensalidades geradas');
        }
    }
    
    console.log('✅ [CORREÇÃO] Sistema de mensalidades inicializado');
}

// Função fallback para selecionar aluno no filtro (compatibilidade)
function selectStudentForFilter(email) {
    console.log('👤 selectStudentForFilter (fallback) chamada para:', email);
    
    const student = students.find(s => s.email === email);
    if (!student) {
        console.error('❌ Aluno não encontrado:', email);
        return;
    }
    
    console.log('✅ Aluno encontrado:', student.name);
    
    // Elementos do DOM
    const filterInput = document.getElementById('reposicoesStudentFilter');
    const selectedDisplay = document.getElementById('selectedFilterStudent');
    
    console.log('🔍 Elementos DOM:', {
        filterInput: !!filterInput,
        selectedDisplay: !!selectedDisplay
    });
    
    // Limpar campo de busca
    if (filterInput) {
        filterInput.value = '';
        console.log('✅ Campo limpo');
    }
    
    // Exibir aluno selecionado
    if (selectedDisplay) {
        // Buscar span do nome
        let nameSpan = selectedDisplay.querySelector('.filter-student-name');
        
        console.log('🔍 Span do nome encontrado:', !!nameSpan);
        
        if (!nameSpan) {
            console.warn('⚠️ Span não encontrado, verificando estrutura...');
            console.log('HTML atual do selectedDisplay:', selectedDisplay.innerHTML);
            
            // Tentar encontrar de forma alternativa
            nameSpan = document.querySelector('#selectedFilterStudent .filter-student-name');
            
            if (!nameSpan) {
                console.warn('⚠️ Criando span dinamicamente...');
                // Criar estrutura se não existir
                selectedDisplay.innerHTML = `
                    <div class="filter-student-info">
                        <span class="filter-student-name"></span>
                        <button type="button" class="btn-clear-filter" onclick="clearStudentFilter()">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                `;
                nameSpan = selectedDisplay.querySelector('.filter-student-name');
                console.log('✅ Estrutura criada');
            }
        }
        
        if (nameSpan) {
            // Definir nome do aluno
            nameSpan.textContent = student.name;
            nameSpan.setAttribute('data-email', email); // Para debug
            console.log('✅ Nome definido:', student.name);
            
            // Exibir display
            selectedDisplay.style.display = 'block';
            selectedDisplay.style.visibility = 'visible';
            
            console.log('✅ Display exibido');
            
            // Verificação após delay
            setTimeout(() => {
                const checkSpan = document.querySelector('.filter-student-name');
                const checkDisplay = document.getElementById('selectedFilterStudent');
                
                console.log('🔍 Verificação final:', {
                    spanExists: !!checkSpan,
                    spanText: checkSpan ? checkSpan.textContent : 'N/A',
                    displayVisible: checkDisplay ? checkDisplay.style.display !== 'none' : false
                });
                
                if (checkSpan && checkSpan.textContent === student.name && 
                    checkDisplay && checkDisplay.style.display !== 'none') {
                    console.log('🎯 ✅ Exibição BEM-SUCEDIDA!');
                } else {
                    console.warn('⚠️ Problema na exibição, forçando...');
                    if (checkSpan) checkSpan.textContent = student.name;
                    if (checkDisplay) checkDisplay.style.display = 'block';
                }
            }, 200);
            
        } else {
            console.error('❌ Não foi possível criar/encontrar span do nome');
        }
    } else {
        console.error('❌ selectedFilterStudent não encontrado');
    }
    
    // Esconder sugestões globais
    if (typeof window.hideGlobalSuggestions === 'function') {
        window.hideGlobalSuggestions();
    }
    
    // Aplicar filtro às reposições
    filterReposicoesByStudent(email);
    
    console.log('🎯 Seleção concluída para:', student.name);
}

// Disponibilizar globalmente
window.selectStudentForFilter = selectStudentForFilter;

// ==================== REORGANIZAÇÃO DA INTERFACE FINANCEIRA ====================

window.reorganizeFinancialInterface = function() {
    console.log('🔧 REORGANIZANDO INTERFACE FINANCEIRA');
    console.log('====================================');
    
    const gestaoContent = document.getElementById('gestaoContent');
    if (!gestaoContent) {
        console.error('❌ gestaoContent não encontrado!');
        showAlert('Erro: Área de gestão não encontrada!', 'danger');
        return;
    }
    
    // Limpar conteúdo existente
    gestaoContent.innerHTML = '';
    
    // Criar nova estrutura com abas ANTES dos cards
    gestaoContent.innerHTML = `
        <div class="financial-module">
            <div class="financial-header">
                <h2><i class="fas fa-dollar-sign"></i> Gestão Financeira</h2>
                <p>Sistema automático de mensalidades baseado em contratos</p>
            </div>
            
            <!-- FILTROS PRIMEIRO (ANTES DOS CARDS) -->
            <div class="financial-tabs" style="margin-bottom: 30px;">
                <button class="tab-btn active" id="studentsTab" onclick="showFinancialTab('students')">
                    <i class="fas fa-users"></i> Controle por Aluno
                </button>
                <button class="tab-btn" id="monthlyTab" onclick="showFinancialTab('monthly')">
                    <i class="fas fa-filter"></i> Filtro Mensal
                </button>
                <button class="tab-btn" id="mensalidadesTab" onclick="showFinancialTab('mensalidades')">
                    <i class="fas fa-exclamation-triangle"></i> Mensalidades Vencidas
                </button>
            </div>
            
            <!-- ÁREA DE CONTEÚDO DOS FILTROS -->
            <div id="financialTabContent" style="margin-bottom: 30px;">
                <!-- Drill-down de alunos -->
                <div id="studentsContent" class="tab-content active">
                    <div class="students-drill-down">
                        <div class="drill-down-header">
                            <h4><i class="fas fa-users"></i> Selecione um Aluno</h4>
                            <p>Clique em um aluno para ver suas mensalidades</p>
                        </div>
                        
                        <!-- Filtro de busca -->
                        <div class="students-search-section">
                            <div class="search-input-group">
                                <i class="fas fa-search"></i>
                                <input type="text" id="studentsSearchInput" class="search-input" 
                                       placeholder="Digite o nome do aluno...">
                                <button class="clear-search" id="clearStudentsSearchBtn" onclick="clearDrillDownSearch()" style="display: none;">
                                    <i class="fas fa-times"></i>
                                </button>
                            </div>
                            <div class="search-results-info" id="searchResultsInfo">
                                <!-- Informações dos resultados -->
                            </div>
                        </div>
                        
                        <div id="studentsDrillDownList" class="students-list">
                            <!-- Lista de alunos será carregada aqui -->
                        </div>
                        
                        <!-- Controles de paginação -->
                        <div class="pagination-controls" id="paginationControls" style="display: none;">
                            <button class="pagination-btn" id="prevPageBtn" onclick="changeStudentsPage(-1)">
                                <i class="fas fa-chevron-left"></i> Anterior
                            </button>
                            <div class="pagination-info" id="paginationInfo">
                                <!-- Página X de Y -->
                            </div>
                            <button class="pagination-btn" id="nextPageBtn" onclick="changeStudentsPage(1)">
                                Próximo <i class="fas fa-chevron-right"></i>
                            </button>
                        </div>
                    </div>
                </div>
                
                <!-- Filtro mensal -->
                <div id="monthlyContent" class="tab-content">
                    <div class="monthly-filter-section">
                        <div class="month-selector-centered">
                            <label for="monthFilter" class="month-filter-label">
                                <i class="fas fa-calendar-alt"></i> Selecione o Mês:
                            </label>
                            <input type="month" id="monthFilter" class="month-filter-input" onchange="filterByMonth()">
                        </div>
                        <div id="monthlyResults" class="monthly-results">
                            <!-- Resultados do filtro mensal -->
                        </div>
                    </div>
                </div>
                
                <!-- Mensalidades vencidas -->
                <div id="mensalidadesContent" class="tab-content">
                    <div class="all-mensalidades-section">
                        <h4><i class="fas fa-exclamation-triangle"></i> Mensalidades Vencidas</h4>
                        <div id="allMensalidadesList" class="mensalidades-list">
                            <!-- Lista de mensalidades vencidas -->
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- CARDS DE RESUMO (DEPOIS DOS FILTROS) - VALORES DINÂMICOS -->
            <div class="financial-summary-cards" id="financialSummaryCards">
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
            </div>
            
            <!-- ESTATÍSTICAS SECUNDÁRIAS - VALORES DINÂMICOS -->
            <div class="financial-stats-grid" id="financialStatsGrid">
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
            </div>
        </div>
    `;
    
    console.log('🏗️ Interface reorganizada com sucesso!');
    
    // Carregar dados iniciais se as funções existirem
    if (typeof loadStudentsDrillDown === 'function') {
        loadStudentsDrillDown();
    }
    
    // Atualizar cards financeiros com valores dinâmicos
    setTimeout(() => {
        if (typeof updateFinancialCards === 'function') {
            updateFinancialCards();
        }
    }, 500);
    
    console.log('✅ REORGANIZAÇÃO CONCLUÍDA');
};

// Função para carregar módulo financeiro
window.loadFinancialModule = function(container) {
    console.log('💰 Carregando módulo financeiro...');
    
    if (!container) {
        console.error('❌ Container não fornecido para loadFinancialModule');
        return;
    }
    
    // Usar a função de reorganização que já criamos
    reorganizeFinancialInterface();
    
    console.log('✅ Módulo financeiro carregado');
};

// Disponibilizar globalmente
window.selectStudentForFilter = selectStudentForFilter;

// ==================== SISTEMA DE CONTRATOS COMPLETO ====================

// Variáveis globais para contratos
let contractCurrentPage = 1;
let contractSearchTerm = '';
let filteredContracts = [];
let contractItemsPerPage = 6;

function loadContratos() {
    console.log('📄 Carregando contratos com sistema de busca...');
    
    const container = document.getElementById('contratosList');
    if (!container) {
        console.error('❌ Container contratosList não encontrado!');
        return;
    }
    
    // Garantir que o container tenha layout em coluna
    container.style.display = 'flex';
    container.style.flexDirection = 'column';
    container.style.width = '100%';
    
    // Resetar variáveis de paginação
    contractCurrentPage = 1;
    contractSearchTerm = '';
    filteredContracts = [...contratos];
    
    // Criar estrutura de busca no topo e lista abaixo
    container.innerHTML = `
        <!-- Sistema de busca para contratos - TOPO -->
        <div class="contracts-search-header">
            <div class="search-main-row">
                <div class="search-input-group">
                    <i class="fas fa-search"></i>
                    <input type="text" id="contractsSearchInput" class="search-input" 
                           placeholder="Digite o nome do aluno, tipo ou valor..." 
                           oninput="filterContractsRealTime()">
                    <button class="clear-search" id="clearContractSearchBtn" onclick="clearContractsSearch()" style="display: none;">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                
                <!-- Filtros rápidos -->
                <div class="quick-filters">
                    <select id="statusFilter" onchange="filterContractsRealTime()" class="filter-select">
                        <option value="">Todos os Status</option>
                        <option value="ativo">Ativo</option>
                        <option value="inativo">Inativo</option>
                        <option value="vencido">Vencido</option>
                    </select>
                    
                    <select id="tipoFilter" onchange="filterContractsRealTime()" class="filter-select">
                        <option value="">Todos os Tipos</option>
                        <option value="mensal">Mensal</option>
                        <option value="trimestral">Trimestral</option>
                        <option value="semestral">Semestral</option>
                        <option value="anual">Anual</option>
                    </select>
                </div>
            </div>
            
            <div class="search-results-info" id="contractSearchResultsInfo">
                <!-- Informações dos resultados -->
            </div>
        </div>
        
        <!-- Lista de contratos embaixo -->
        <div id="contractsGrid" class="contracts-grid">
            <!-- Contratos serão carregados aqui -->
        </div>
        
        <!-- Controles de paginação para contratos -->
        <div class="pagination-controls" id="contractPaginationControls" style="display: none;">
            <button class="pagination-btn" id="contractPrevPageBtn" onclick="changeContractPage(-1)">
                <i class="fas fa-chevron-left"></i> Anterior
            </button>
            <div class="pagination-info" id="contractPaginationInfo">
                <!-- Página X de Y -->
            </div>
            <button class="pagination-btn" id="contractNextPageBtn" onclick="changeContractPage(1)">
                Próximo <i class="fas fa-chevron-right"></i>
            </button>
        </div>
    `;
    
    // Renderizar lista inicial
    renderContractsList();
    
    console.log(`✅ Sistema de contratos com busca inicializado`);
}

// ==================== SISTEMA DE BUSCA E PAGINAÇÃO DE CONTRATOS ====================

// Função para renderizar a lista de contratos com paginação
function renderContractsList() {
    const container = document.getElementById('contractsGrid');
    if (!container) return;
    
    container.innerHTML = '';
    
    if (contratos.length === 0) {
        container.innerHTML = '<div class="no-data-contracts"><i class="fas fa-file-contract"></i><p>Nenhum contrato cadastrado</p></div>';
        updateContractsSearchInfo(0, 0);
        hideContractsPagination();
        return;
    }
    
    if (filteredContracts.length === 0) {
        container.innerHTML = '<div class="no-data-contracts"><i class="fas fa-search"></i><p>Nenhum contrato encontrado para os critérios de busca</p></div>';
        updateContractsSearchInfo(0, contratos.length);
        hideContractsPagination();
        return;
    }
    
    // Calcular paginação
    const totalPages = Math.ceil(filteredContracts.length / contractItemsPerPage);
    const startIndex = (contractCurrentPage - 1) * contractItemsPerPage;
    const endIndex = startIndex + contractItemsPerPage;
    const currentContracts = filteredContracts.slice(startIndex, endIndex);
    
    // Renderizar contratos em cards compactos
    currentContracts.forEach((contrato, index) => {
        const actualIndex = contratos.findIndex(c => c.id === contrato.id);
        const contractCard = createCompactContractCard(contrato, actualIndex);
        container.appendChild(contractCard);
    });
    
    // Atualizar informações
    updateContractsSearchInfo(filteredContracts.length, contratos.length);
    updateContractsPagination(contractCurrentPage, totalPages);
}

// Função para criar card compacto de contrato
function createCompactContractCard(contrato, index) {
    const card = document.createElement('div');
    card.className = 'contract-card-compact';
    
    // Calcular status baseado na data
    const hoje = new Date();
    const dataTermino = contrato.dataTermino ? new Date(contrato.dataTermino + 'T12:00:00') : null;
    let statusClass = contrato.status;
    let statusText = contrato.status;
    
    if (dataTermino && dataTermino < hoje && contrato.status === 'ativo') {
        statusClass = 'vencido';
        statusText = 'Vencido';
    }
    
    // Verificar se tem mensalidades vencidas (função pode não existir)
    const hasOverdue = typeof hasOverdueMensalidades === 'function' ? hasOverdueMensalidades(contrato.studentEmail) : false;
    
    card.innerHTML = `
        <div class="contract-header-compact">
            <div class="contract-student-info">
                <div class="student-avatar-small">
                    <i class="fas fa-user"></i>
                </div>
                <div class="student-name-compact">
                    <strong>${highlightContractSearchTerm(contrato.studentName, contractSearchTerm)}</strong>
                    <small>${contrato.studentEmail}</small>
                </div>
            </div>
            <div class="contract-status-compact">
                <span class="status-badge-compact status-${statusClass}">
                    <i class="fas fa-${getStatusIcon(statusClass)}"></i> ${statusText.toUpperCase()}
                </span>
                ${hasOverdue ? '<span class="overdue-badge contract-overdue"><i class="fas fa-exclamation-triangle"></i> Mensalidade Vencida</span>' : ''}
            </div>
        </div>
        
        <div class="contract-body-compact">
            <div class="contract-main-info">
                <div class="contract-type-value">
                    <span class="type-badge type-${contrato.tipo || 'mensal'}">${(contrato.tipo || 'mensal').toUpperCase()}</span>
                    <span class="value-compact">R$ ${contrato.valor.toFixed(2).replace('.', ',')}</span>
                </div>
                <div class="contract-period-compact">
                    <i class="fas fa-calendar"></i>
                    ${formatDate(contrato.dataInicio)} → ${contrato.dataTermino ? formatDate(contrato.dataTermino) : 'Indefinido'}
                </div>
            </div>
            
            <div class="contract-details-compact">
                <div class="detail-item">
                    <i class="fas fa-chalkboard-teacher"></i>
                    <span>${contrato.aulasSemana || contrato.aulasMonth || 4} aulas/mês</span>
                </div>
                ${contrato.vencimento ? `
                    <div class="detail-item">
                        <i class="fas fa-calendar-day"></i>
                        <span>Vence dia ${contrato.vencimento}</span>
                    </div>
                ` : ''}
            </div>
        </div>
        
        <div class="contract-actions-compact">
            <button class="btn-compact-text btn-edit" onclick="editContrato(${index})">
                <i class="fas fa-edit"></i>
                <span>Editar</span>
            </button>
            <button class="btn-compact-text btn-view" onclick="viewContratoDetails(${index})">
                <i class="fas fa-eye"></i>
                <span>Ver</span>
            </button>
            <button class="btn-compact-text btn-delete" onclick="removeContrato(${index})">
                <i class="fas fa-trash"></i>
                <span>Excluir</span>
            </button>
        </div>
    `;
    
    return card;
}

// Função para filtrar contratos em tempo real
window.filterContractsRealTime = function() {
    const searchInput = document.getElementById('contractsSearchInput');
    const statusFilter = document.getElementById('statusFilter');
    const tipoFilter = document.getElementById('tipoFilter');
    const clearBtn = document.getElementById('clearContractSearchBtn');
    
    if (!searchInput) return;
    
    contractSearchTerm = searchInput.value.toLowerCase().trim();
    const selectedStatus = statusFilter ? statusFilter.value : '';
    const selectedTipo = tipoFilter ? tipoFilter.value : '';
    
    // Mostrar/ocultar botão de limpar
    if (contractSearchTerm || selectedStatus || selectedTipo) {
        clearBtn.style.display = 'block';
    } else {
        clearBtn.style.display = 'none';
    }
    
    // Filtrar contratos
    filteredContracts = contratos.filter(contrato => {
        const matchesSearch = !contractSearchTerm || 
            contrato.studentName.toLowerCase().includes(contractSearchTerm) ||
            contrato.studentEmail.toLowerCase().includes(contractSearchTerm) ||
            (contrato.tipo || 'mensal').toLowerCase().includes(contractSearchTerm) ||
            contrato.valor.toString().includes(contractSearchTerm);
        
        const matchesStatus = !selectedStatus || getContractStatus(contrato) === selectedStatus;
        const matchesTipo = !selectedTipo || (contrato.tipo || 'mensal') === selectedTipo;
        
        return matchesSearch && matchesStatus && matchesTipo;
    });
    
    // Resetar para primeira página
    contractCurrentPage = 1;
    
    // Renderizar lista atualizada
    renderContractsList();
};

// Função para limpar busca de contratos
window.clearContractsSearch = function() {
    const searchInput = document.getElementById('contractsSearchInput');
    const statusFilter = document.getElementById('statusFilter');
    const tipoFilter = document.getElementById('tipoFilter');
    const clearBtn = document.getElementById('clearContractSearchBtn');
    
    if (searchInput) searchInput.value = '';
    if (statusFilter) statusFilter.value = '';
    if (tipoFilter) tipoFilter.value = '';
    if (clearBtn && clearBtn.parentNode && typeof clearBtn.style === 'object') {
        try {
            clearBtn.style.display = 'none';
        } catch (error) {
            console.warn('⚠️ Erro ao alterar botão de limpar contratos:', error);
        }
    }
    
    contractSearchTerm = '';
    filteredContracts = [...contratos];
    contractCurrentPage = 1;
    
    renderContractsList();
};

// Função para navegar entre páginas de contratos
window.changeContractPage = function(direction) {
    const totalPages = Math.ceil(filteredContracts.length / contractItemsPerPage);
    
    if (direction === 1 && contractCurrentPage < totalPages) {
        contractCurrentPage++;
    } else if (direction === -1 && contractCurrentPage > 1) {
        contractCurrentPage--;
    }
    
    renderContractsList();
};

// Funções auxiliares para contratos
function highlightContractSearchTerm(text, term) {
    if (!term) return text;
    const regex = new RegExp(`(${term})`, 'gi');
    return text.replace(regex, '<mark>$1</mark>');
}

function getContractStatus(contrato) {
    const hoje = new Date();
    const dataTermino = contrato.dataTermino ? new Date(contrato.dataTermino + 'T12:00:00') : null;
    
    if (dataTermino && dataTermino < hoje && contrato.status === 'ativo') {
        return 'vencido';
    }
    return contrato.status;
}

function getStatusIcon(status) {
    const icons = {
        'ativo': 'check-circle',
        'inativo': 'times-circle',
        'vencido': 'exclamation-triangle'
    };
    return icons[status] || 'question-circle';
}

function updateContractsSearchInfo(filtered, total) {
    const infoElement = document.getElementById('contractSearchResultsInfo');
    if (!infoElement) return;
    
    if (contractSearchTerm || document.getElementById('statusFilter')?.value || document.getElementById('tipoFilter')?.value) {
        infoElement.innerHTML = `
            <span class="search-info">
                <i class="fas fa-search"></i> 
                Encontrados: <strong>${filtered}</strong> de <strong>${total}</strong> contratos
            </span>
        `;
    } else {
        infoElement.innerHTML = `
            <span class="search-info">
                <i class="fas fa-file-contract"></i> 
                Total: <strong>${total}</strong> contratos cadastrados
            </span>
        `;
    }
}

function updateContractsPagination(currentPage, totalPages) {
    const paginationContainer = document.getElementById('contractPaginationControls');
    const prevBtn = document.getElementById('contractPrevPageBtn');
    const nextBtn = document.getElementById('contractNextPageBtn');
    const paginationInfo = document.getElementById('contractPaginationInfo');
    
    if (!paginationContainer) return;
    
    if (totalPages <= 1) {
        paginationContainer.style.display = 'none';
        return;
    }
    
    paginationContainer.style.display = 'flex';
    
    // Atualizar estado dos botões
    if (prevBtn) prevBtn.disabled = currentPage === 1;
    if (nextBtn) nextBtn.disabled = currentPage === totalPages;
    
    // Atualizar informação da página
    if (paginationInfo) {
        paginationInfo.textContent = `Página ${currentPage} de ${totalPages}`;
    }
}

function hideContractsPagination() {
    const paginationContainer = document.getElementById('contractPaginationControls');
    if (paginationContainer) {
        paginationContainer.style.display = 'none';
    }
}

// Função auxiliar para formatar data
function formatDate(dateString) {
    if (!dateString) return 'N/A';
    const date = new Date(dateString + 'T12:00:00');
    return date.toLocaleDateString('pt-BR');
}

// Função para corrigir contratos existentes IMEDIATAMENTE
window.fixExistingContracts = function() {
    console.log('🔧 === CORRIGINDO CONTRATOS EXISTENTES ===');
    
    if (!window.contratos || contratos.length === 0) {
        console.log('📋 Nenhum contrato encontrado');
        return;
    }
    
    let contratosCorrigidos = 0;
    
    contratos.forEach((contrato, index) => {
        if (!contrato.dataTermino || contrato.dataTermino === '' || contrato.dataTermino === null) {
            console.log(`📅 Corrigindo contrato ${index + 1}: ${contrato.studentName}`);
            
            // Calcular data de término baseada no tipo de contrato
            const dataInicioDate = new Date(contrato.dataInicio + 'T12:00:00');
            let dataTerminoDate = new Date(dataInicioDate);
            
            // Definir período baseado no tipo
            switch(contrato.tipo) {
                case 'mensal':
                    dataTerminoDate.setMonth(dataInicioDate.getMonth() + 12); // 1 ano
                    break;
                case 'trimestral':
                    dataTerminoDate.setMonth(dataInicioDate.getMonth() + 3); // 3 meses
                    break;
                case 'semestral':
                    dataTerminoDate.setMonth(dataInicioDate.getMonth() + 6); // 6 meses
                    break;
                case 'anual':
                    dataTerminoDate.setFullYear(dataInicioDate.getFullYear() + 1); // 1 ano
                    break;
                default:
                    dataTerminoDate.setFullYear(dataInicioDate.getFullYear() + 1); // padrão 1 ano
            }
            
            contrato.dataTermino = dataTerminoDate.toISOString().split('T')[0];
            contratosCorrigidos++;
            
            console.log(`✅ ${contrato.studentName}: ${contrato.dataInicio} → ${contrato.dataTermino} (${contrato.tipo})`);
        }
    });
    
    if (contratosCorrigidos > 0) {
        // Salvar contratos corrigidos
        localStorage.setItem('contratos', JSON.stringify(contratos));
        
        // Limpar e regenerar mensalidades se a função existir
        if (typeof generateMensalidadesFromContrato === 'function') {
            window.mensalidades = [];
            const contratosAtivos = contratos.filter(c => c.status === 'ativo');
            contratosAtivos.forEach(contrato => {
                generateMensalidadesFromContrato(contrato);
            });
            
            // Salvar mensalidades
            localStorage.setItem('mensalidades', JSON.stringify(mensalidades));
        }
        
        console.log(`✅ ${contratosCorrigidos} contratos corrigidos e mensalidades regeneradas`);
        
        // Recarregar interface se estiver visível
        if (document.getElementById('contratosList')) {
            loadContratos();
        }
        
        if (typeof showAlert === 'function') {
            showAlert(`✅ Contratos corrigidos com sucesso! ${contratosCorrigidos} contratos corrigidos.`, 'success');
        }
        
    } else {
        console.log('✅ Todos os contratos já possuem data de término');
    }
    
    console.log('🔧 === FIM DA CORREÇÃO AUTOMÁTICA ===');
};

// ==================== FUNÇÕES DO SISTEMA DE CONTRATOS ====================

function showAddContratoModal() {
    console.log('📄 Abrindo modal de contrato...');
    
    const modal = document.getElementById('addContratoModal');
    if (!modal) {
        console.error('❌ Modal addContratoModal não encontrado!');
        if (typeof showAlert === 'function') {
            showAlert('Erro: Modal de contrato não encontrado.', 'danger');
        } else {
            alert('Erro: Modal de contrato não encontrado.');
        }
        return;
    }
    
    modal.classList.add('show');
    
    // Limpar formulário
    const form = document.getElementById('addContratoForm');
    if (form) {
        form.reset();
    }
    
    // Carregar lista de alunos
    loadStudentsForContrato();
    
    // Definir data de início como hoje
    const today = new Date().toISOString().split('T')[0];
    const dataInicioField = document.getElementById('contratoDataInicio');
    if (dataInicioField) {
        dataInicioField.value = today;
    }
    
    // Definir data de término como 1 ano após hoje
    const nextYear = new Date();
    nextYear.setFullYear(nextYear.getFullYear() + 1);
    const dataTerminoField = document.getElementById('contratoDataTermino');
    if (dataTerminoField) {
        dataTerminoField.value = nextYear.toISOString().split('T')[0];
    }
    
    console.log('✅ Modal de contrato aberto');
}

function loadStudentsForContrato(preSelectedEmail = null) {
    const select = document.getElementById('contratoStudent');
    if (!select) {
        console.error('❌ Select contratoStudent não encontrado!');
        return;
    }
    
    // Limpar select
    select.innerHTML = '<option value="">Selecione o aluno</option>';
    
    students.forEach(student => {
        const option = document.createElement('option');
        option.value = student.email;
        option.textContent = `${student.name} (${student.level})`;
        select.appendChild(option);
    });
    
    // Se um email foi especificado para pré-seleção, selecionar ele
    if (preSelectedEmail) {
        select.value = preSelectedEmail;
    }
    
    console.log(`✅ ${students.length} alunos carregados no select de contratos`);
}

async function addContrato() {
    console.log('💾 Iniciando addContrato...');
    
    try {
        // Obter dados do formulário
        const studentEmail = document.getElementById('contratoStudent').value;
        const dataInicio = document.getElementById('contratoDataInicio').value;
        const dataTermino = document.getElementById('contratoDataTermino').value;
        const valor = parseFloat(document.getElementById('contratoValor').value);
        const aulasMonth = parseInt(document.getElementById('contratoAulasMonth').value);
        const vencimento = parseInt(document.getElementById('contratoVencimento').value);
        const tipo = document.getElementById('contratoTipo').value;
        const observacoes = document.getElementById('contratoObservacoes').value;
        
        // Validações básicas
        if (!studentEmail) {
            throw new Error('Selecione um aluno');
        }
        if (!dataInicio) {
            throw new Error('Data de início é obrigatória');
        }
        if (!dataTermino) {
            throw new Error('Data de término é obrigatória');
        }
        if (!valor || valor <= 0) {
            throw new Error('Valor deve ser maior que zero');
        }
        if (!aulasMonth || aulasMonth <= 0) {
            throw new Error('Número de aulas deve ser maior que zero');
        }
        if (!vencimento || vencimento < 1 || vencimento > 31) {
            throw new Error('Dia de vencimento deve estar entre 1 e 31');
        }
        
        // Encontrar dados do aluno
        const student = students.find(s => s.email === studentEmail);
        if (!student) {
            throw new Error('Aluno não encontrado');
        }
        
        // Verificar se já existe contrato ativo para este aluno
        const contratoExistente = contratos.find(c => 
            c.studentEmail === studentEmail && c.status === 'ativo'
        );
        
        if (contratoExistente) {
            throw new Error(`Já existe um contrato ativo para ${student.name}`);
        }
        
        // Criar novo contrato
        const novoContrato = {
            id: Date.now().toString(),
            studentName: student.name,
            studentEmail: studentEmail,
            dataInicio: dataInicio,
            dataTermino: dataTermino,
            valor: valor,
            aulasMonth: aulasMonth,
            vencimento: vencimento,
            tipo: tipo || 'mensal',
            observacoes: observacoes,
            status: 'ativo',
            createdAt: new Date().toISOString()
        };
        
        console.log('📋 Novo contrato criado:', novoContrato);
        
        // Adicionar ao array de contratos
        contratos.push(novoContrato);
        
        // Salvar dados
        localStorage.setItem('contratos', JSON.stringify(contratos));
        console.log('💾 Contratos salvos no localStorage');
        
        // Gerar mensalidades se a função existir
        if (typeof generateMensalidadesFromContrato === 'function') {
            generateMensalidadesFromContrato(novoContrato);
            localStorage.setItem('mensalidades', JSON.stringify(mensalidades));
            console.log('📅 Mensalidades geradas e salvas');
        }
        
        // Limpar formulário
        document.getElementById('addContratoForm').reset();
        
        // Fechar modal
        document.getElementById('addContratoModal').classList.remove('show');
        
        // Recarregar lista de contratos se estiver visível
        if (document.getElementById('contratosList')) {
            loadContratos();
        }
        
        // Atualizar dashboard
        if (typeof updateDashboard === 'function') {
            updateDashboard();
        }
        
        // Mostrar mensagem de sucesso
        if (typeof showAlert === 'function') {
            showAlert('Contrato criado com sucesso! Mensalidades geradas automaticamente.', 'success');
        } else {
            alert('Contrato criado com sucesso!');
        }
        
        console.log('✅ Contrato adicionado com sucesso');
        
    } catch (error) {
        console.error('❌ Erro ao criar contrato:', error);
        if (typeof showAlert === 'function') {
            showAlert('Erro ao criar contrato: ' + error.message, 'danger');
        } else {
            alert('Erro ao criar contrato: ' + error.message);
        }
    }
}

// ==================== REORGANIZAÇÃO DA INTERFACE FINANCEIRA ====================

// ==================== FUNÇÕES FALTANTES PARA ABAS FINANCEIRAS ====================

// Função para carregar drill-down de alunos - VERSÃO COM PAGINAÇÃO E BUSCA
window.loadStudentsDrillDown = function() {
    console.log('👥 Carregando drill-down de alunos com paginação...');
    
    const container = document.getElementById('studentsDrillDownList');
    if (!container) {
        console.error('❌ Container studentsDrillDownList não encontrado!');
        return;
    }
    
    // Resetar variáveis (definir se não existirem)
    if (typeof currentPage === 'undefined') window.currentPage = 1;
    if (typeof searchTerm === 'undefined') window.searchTerm = '';
    if (typeof filteredStudents === 'undefined') window.filteredStudents = [];
    if (typeof itemsPerPage === 'undefined') window.itemsPerPage = 5;
    
    currentPage = 1;
    searchTerm = '';
    filteredStudents = [...students];
    
    // Limpar campo de busca
    const searchInput = document.getElementById('studentsSearchInput');
    if (searchInput) {
        searchInput.value = '';
    }
    
    // Renderizar lista
    renderStudentsList();
    
    // Configurar event listener do campo de busca
    setTimeout(() => {
        const searchInput = document.getElementById('studentsSearchInput');
        if (searchInput && typeof searchInput.addEventListener === 'function') {
            // Remover listeners anteriores
            searchInput.removeEventListener('input', handleSearchInput);
            
            // Adicionar novo listener
            searchInput.addEventListener('input', handleSearchInput);
            
            console.log('✅ Event listeners configurados para busca de drill-down');
        }
    }, 100);
    
    console.log(`✅ Sistema de drill-down inicializado`);
};

// Função para renderizar a lista de alunos com paginação
function renderStudentsList() {
    const container = document.getElementById('studentsDrillDownList');
    if (!container) return;
    
    container.innerHTML = '';
    
    if (students.length === 0) {
        container.innerHTML = '<p class="no-data">Nenhum aluno cadastrado</p>';
        updateSearchInfo(0, 0);
        hidePagination();
        return;
    }
    
    if (filteredStudents.length === 0) {
        container.innerHTML = '<p class="no-data">Nenhum aluno encontrado para a busca</p>';
        updateSearchInfo(0, students.length);
        hidePagination();
        return;
    }
    
    // Calcular paginação
    const totalPages = Math.ceil(filteredStudents.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentStudents = filteredStudents.slice(startIndex, endIndex);
    
    // Criar lista de cards de alunos
    const studentsHTML = currentStudents.map(student => {
        // Verificar se tem contrato ativo
        const hasActiveContract = contratos.some(c => 
            c.studentEmail === student.email && c.status === 'ativo'
        );
        
        return `
            <div class="student-drill-card" onclick="showStudentFinancials('${student.email}')">
                <div class="student-drill-avatar">
                    <i class="fas fa-user"></i>
                </div>
                <div class="student-drill-info">
                    <h5>${highlightSearchTerm(student.name, searchTerm)}</h5>
                    <p>${student.email}</p>
                    <span class="level-badge level-${student.level.toLowerCase()}">${student.level}</span>
                    ${hasActiveContract ? 
                        '<span class="status-active"><i class="fas fa-check-circle"></i> Ativo</span>' :
                        '<span class="status-inactive"><i class="fas fa-times-circle"></i> Inativo</span>'
                    }
                </div>
                <div class="student-drill-action">
                    <button class="btn btn-primary btn-small" onclick="event.stopPropagation(); showStudentFinancials('${student.email}')">
                        <i class="fas fa-eye"></i> Ver
                    </button>
                </div>
            </div>
        `;
    }).join('');
    
    container.innerHTML = studentsHTML;
    
    // Atualizar informações
    updateSearchInfo(filteredStudents.length, students.length);
    updatePagination(currentPage, totalPages);
}

// Função para lidar com input de busca
function handleSearchInput(event) {
    try {
        if (!event || !event.target) return;
        
        searchTerm = event.target.value.toLowerCase().trim();
        currentPage = 1;
        
        // Filtrar estudantes
        if (searchTerm === '') {
            filteredStudents = [...students];
        } else {
            filteredStudents = students.filter(student =>
                student.name.toLowerCase().includes(searchTerm) ||
                student.email.toLowerCase().includes(searchTerm)
            );
        }
        
        // Atualizar botão de limpar
        const clearBtn = document.getElementById('clearStudentsSearchBtn');
        if (clearBtn) {
            clearBtn.style.display = searchTerm ? 'block' : 'none';
        }
        
        // Re-renderizar
        renderStudentsList();
        
    } catch (error) {
        console.error('❌ Erro na busca:', error);
    }
}

// Função para destacar termo de busca
function highlightSearchTerm(text, term) {
    if (!term) return text;
    const regex = new RegExp(`(${term})`, 'gi');
    return text.replace(regex, '<mark>$1</mark>');
}

// Função para atualizar informações de busca
function updateSearchInfo(found, total) {
    const container = document.getElementById('searchResultsInfo');
    if (!container) return;
    
    if (total === 0) {
        container.innerHTML = '<p class="search-info">Nenhum aluno cadastrado</p>';
    } else if (searchTerm) {
        container.innerHTML = `<p class="search-info">Encontrados: ${found} de ${total} alunos</p>`;
    } else {
        container.innerHTML = `<p class="search-info">Total: ${total} alunos</p>`;
    }
}

// Função para atualizar paginação
function updatePagination(current, total) {
    const container = document.getElementById('paginationControls');
    if (!container) return;
    
    if (total <= 1) {
        container.style.display = 'none';
        return;
    }
    
    container.style.display = 'flex';
    
    const prevBtn = document.getElementById('prevPageBtn');
    const nextBtn = document.getElementById('nextPageBtn');
    const info = document.getElementById('paginationInfo');
    
    if (prevBtn) prevBtn.disabled = current <= 1;
    if (nextBtn) nextBtn.disabled = current >= total;
    if (info) info.textContent = `Página ${current} de ${total}`;
}

// Função para ocultar paginação
function hidePagination() {
    const container = document.getElementById('paginationControls');
    if (container) {
        container.style.display = 'none';
    }
}

// Função para mostrar financeiro de um aluno específico
window.showStudentFinancials = function(studentEmail) {
    console.log(`💰 Mostrando financeiro do aluno: ${studentEmail}`);
    
    const student = students.find(s => s.email === studentEmail);
    if (!student) {
        if (typeof showAlert === 'function') {
            showAlert('Aluno não encontrado!', 'danger');
        } else {
            alert('Aluno não encontrado!');
        }
        return;
    }
    
    const container = document.getElementById('studentsDrillDownList');
    if (!container) {
        console.error('❌ Container não encontrado!');
        return;
    }
    
    // Criar seção de detalhes financeiros do aluno
    const detailsSection = document.createElement('div');
    detailsSection.className = 'student-financial-details';
    detailsSection.innerHTML = `
        <div class="student-financial-header">
            <button class="btn btn-secondary" onclick="loadStudentsDrillDown()">
                <i class="fas fa-arrow-left"></i> Voltar à Lista
            </button>
            <h3><i class="fas fa-user"></i> ${student.name} - Situação Financeira</h3>
        </div>
        <div class="student-financial-content">
            <div class="student-contracts">
                <h4><i class="fas fa-file-contract"></i> Contratos</h4>
                <div id="studentContracts"></div>
            </div>
            <div class="student-mensalidades">
                <h4><i class="fas fa-calendar-alt"></i> Mensalidades</h4>
                <div id="studentMensalidades"></div>
            </div>
        </div>
    `;
    
    container.innerHTML = '';
    container.appendChild(detailsSection);
    
    // Carregar contratos do aluno
    loadStudentContracts(studentEmail);
    
    // Carregar mensalidades do aluno
    loadStudentMensalidades(studentEmail);
};

// Função para carregar contratos de um aluno
window.loadStudentContracts = function(studentEmail) {
    const container = document.getElementById('studentContracts');
    if (!container) return;
    
    const studentContracts = contratos.filter(c => c.studentEmail === studentEmail);
    
    if (studentContracts.length === 0) {
        container.innerHTML = `
            <div class="no-data">
                <i class="fas fa-file-contract"></i>
                <p>Nenhum contrato encontrado</p>
                <small>Este aluno não possui contratos cadastrados</small>
            </div>
        `;
        return;
    }
    
    container.innerHTML = '';
    
    studentContracts.forEach(contrato => {
        const contractCard = document.createElement('div');
        contractCard.className = 'contract-mini-card';
        contractCard.innerHTML = `
            <div class="contract-info">
                <strong>${contrato.tipo.toUpperCase()}</strong>
                <span class="contract-value">R$ ${contrato.valor.toFixed(2).replace('.', ',')}</span>
            </div>
            <div class="contract-period">
                ${formatDate(contrato.dataInicio)} - ${contrato.dataTermino ? formatDate(contrato.dataTermino) : 'Indeterminado'}
            </div>
            <div class="contract-status status-${contrato.status}">
                ${contrato.status.toUpperCase()}
            </div>
            <div class="contract-details">
                <small><i class="fas fa-calendar-week"></i> ${contrato.aulasSemana || 2} aulas/semana</small>
                <small><i class="fas fa-calendar-day"></i> ${contrato.diaVencimento || 5}º dia do mês</small>
            </div>
        `;
        container.appendChild(contractCard);
    });
};

// Função para carregar mensalidades de um aluno
window.loadStudentMensalidades = function(studentEmail) {
    const container = document.getElementById('studentMensalidades');
    if (!container) return;
    
    console.log(`💰 Carregando mensalidades para: ${studentEmail}`);
    
    // Filtrar mensalidades do aluno
    const studentMensalidades = mensalidades.filter(m => m.studentEmail === studentEmail);
    
    if (studentMensalidades.length === 0) {
        const studentContracts = contratos.filter(c => 
            c.studentEmail === studentEmail && c.status === 'ativo'
        );
        
        container.innerHTML = `
            <div class="no-mensalidades">
                <i class="fas fa-calendar-times"></i>
                <h4>Nenhuma mensalidade encontrada</h4>
                <p>Este aluno não possui mensalidades geradas.</p>
                ${studentContracts.length === 0 ? 
                    '<small>Cadastre um contrato ativo para gerar mensalidades automaticamente.</small>' : 
                    '<small>As mensalidades serão geradas automaticamente com base nos contratos ativos.</small>'
                }
            </div>
        `;
        return;
    }
    
    // Organizar mensalidades por status
    const today = new Date();
    const pagas = studentMensalidades.filter(m => m.status === 'paga');
    const pendentes = studentMensalidades.filter(m => {
        const vencimento = new Date(m.vencimento + 'T12:00:00');
        return m.status === 'pendente' && !isNaN(vencimento.getTime()) && vencimento >= today;
    });
    const vencidas = studentMensalidades.filter(m => {
        const vencimento = new Date(m.vencimento + 'T12:00:00');
        return m.status === 'pendente' && !isNaN(vencimento.getTime()) && vencimento < today;
    });
    
    // Calcular totais
    const totalPago = pagas.reduce((sum, m) => sum + m.valor, 0);
    const totalPendente = pendentes.reduce((sum, m) => sum + m.valor, 0);
    const totalVencido = vencidas.reduce((sum, m) => sum + m.valor, 0);
    
    container.innerHTML = `
        <!-- Resumo das mensalidades -->
        <div class="mensalidades-summary">
            <div class="summary-card paga">
                <div class="summary-icon"><i class="fas fa-check-circle"></i></div>
                <div class="summary-info">
                    <span class="summary-count">${pagas.length}</span>
                    <span class="summary-label">Pagas</span>
                    <span class="summary-value">R$ ${totalPago.toFixed(2).replace('.', ',')}</span>
                </div>
            </div>
            
            <div class="summary-card pendente">
                <div class="summary-icon"><i class="fas fa-clock"></i></div>
                <div class="summary-info">
                    <span class="summary-count">${pendentes.length}</span>
                    <span class="summary-label">Pendentes</span>
                    <span class="summary-value">R$ ${totalPendente.toFixed(2).replace('.', ',')}</span>
                </div>
            </div>
            
            <div class="summary-card vencida">
                <div class="summary-icon"><i class="fas fa-exclamation-triangle"></i></div>
                <div class="summary-info">
                    <span class="summary-count">${vencidas.length}</span>
                    <span class="summary-label">Vencidas</span>
                    <span class="summary-value">R$ ${totalVencido.toFixed(2).replace('.', ',')}</span>
                </div>
            </div>
        </div>
        
        <!-- Abas de mensalidades -->
        <div class="mensalidades-tabs">
            <button class="mensalidade-tab active" onclick="showMensalidadeTab('all', '${studentEmail}')">
                <i class="fas fa-list"></i> Todas (${studentMensalidades.length})
            </button>
            <button class="mensalidade-tab" onclick="showMensalidadeTab('pagas', '${studentEmail}')">
                <i class="fas fa-check-circle"></i> Pagas (${pagas.length})
            </button>
            <button class="mensalidade-tab" onclick="showMensalidadeTab('pendentes', '${studentEmail}')">
                <i class="fas fa-clock"></i> Pendentes (${pendentes.length})
            </button>
            <button class="mensalidade-tab" onclick="showMensalidadeTab('vencidas', '${studentEmail}')">
                <i class="fas fa-exclamation-triangle"></i> Vencidas (${vencidas.length})
            </button>
        </div>
        
        <!-- Lista de mensalidades -->
        <div id="mensalidadesList" class="mensalidades-list">
            ${renderMensalidadesList(studentMensalidades, 'all')}
        </div>
    `;
    
    console.log(`✅ Carregadas ${studentMensalidades.length} mensalidades para ${studentEmail}`);
};

// Função para mostrar aba específica de mensalidades
window.showMensalidadeTab = function(tabType, studentEmail) {
    // Atualizar abas ativas
    document.querySelectorAll('.mensalidade-tab').forEach(tab => {
        tab.classList.remove('active');
    });
    event.target.classList.add('active');
    
    // Filtrar mensalidades do aluno
    const studentMensalidades = mensalidades.filter(m => m.studentEmail === studentEmail);
    
    // Filtrar por tipo
    let filteredMensalidades = [];
    const today = new Date();
    
    switch(tabType) {
        case 'pagas':
            filteredMensalidades = studentMensalidades.filter(m => m.status === 'paga');
            break;
        case 'pendentes':
            filteredMensalidades = studentMensalidades.filter(m => {
                const vencimento = new Date(m.vencimento + 'T12:00:00');
                return m.status === 'pendente' && !isNaN(vencimento.getTime()) && vencimento >= today;
            });
            break;
        case 'vencidas':
            filteredMensalidades = studentMensalidades.filter(m => {
                const vencimento = new Date(m.vencimento + 'T12:00:00');
                return m.status === 'pendente' && !isNaN(vencimento.getTime()) && vencimento < today;
            });
            break;
        default:
            filteredMensalidades = studentMensalidades;
    }
    
    // Atualizar lista
    const container = document.getElementById('mensalidadesList');
    if (container) {
        container.innerHTML = renderMensalidadesList(filteredMensalidades, tabType);
    }
};

// Função para renderizar lista de mensalidades
function renderMensalidadesList(mensalidadesList, filterType) {
    if (mensalidadesList.length === 0) {
        const messages = {
            'all': 'Nenhuma mensalidade encontrada',
            'pagas': 'Nenhuma mensalidade paga',
            'pendentes': 'Nenhuma mensalidade pendente',
            'vencidas': 'Nenhuma mensalidade vencida'
        };
        
        return `
            <div class="no-mensalidades-filtered">
                <i class="fas fa-calendar-check"></i>
                <p>${messages[filterType]}</p>
            </div>
        `;
    }
    
    // Ordenar por vencimento (mais recente primeiro)
    const sortedMensalidades = mensalidadesList.sort((a, b) => {
        const dateA = new Date(a.vencimento + 'T12:00:00');
        const dateB = new Date(b.vencimento + 'T12:00:00');
        
        // Se alguma data for inválida, colocar no final
        if (isNaN(dateA.getTime()) && isNaN(dateB.getTime())) return 0;
        if (isNaN(dateA.getTime())) return 1;
        if (isNaN(dateB.getTime())) return -1;
        
        return dateB - dateA;
    });
    
    return `
        <div class="mensalidades-grid">
            ${sortedMensalidades.map(mensalidade => renderMensalidadeCard(mensalidade)).join('')}
        </div>
    `;
}

// Função para renderizar card de mensalidade (versão simplificada para detalhes do aluno)
function renderMensalidadeCard(mensalidade) {
    const today = new Date();
    const vencimento = new Date(mensalidade.vencimento + 'T12:00:00');
    
    // Verificar se a data é válida
    if (isNaN(vencimento.getTime())) {
        return `
            <div class="mensalidade-card-simple error">
                <div class="mensalidade-error">
                    <i class="fas fa-exclamation-triangle"></i>
                    <span>Data inválida</span>
                    <small>ID: ${mensalidade.id.substring(0, 8)}</small>
                </div>
            </div>
        `;
    }
    
    const isVencida = mensalidade.status === 'pendente' && vencimento < today;
    const statusClass = mensalidade.status === 'paga' ? 'paga' : (isVencida ? 'vencida' : 'pendente');
    
    const statusText = mensalidade.status === 'paga' ? 'Paga' : (isVencida ? 'Vencida' : 'Pendente');
    const statusIcon = mensalidade.status === 'paga' ? 'check-circle' : (isVencida ? 'exclamation-triangle' : 'clock');
    
    // Calcular dias até/desde vencimento
    const diffTime = vencimento - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    let vencimentoInfo = '';
    
    if (mensalidade.status === 'paga') {
        vencimentoInfo = mensalidade.dataPagamento ? `Pago em ${formatDate(mensalidade.dataPagamento)}` : 'Pago';
    } else if (diffDays > 0) {
        vencimentoInfo = `Vence em ${diffDays} dia${diffDays > 1 ? 's' : ''}`;
    } else if (diffDays === 0) {
        vencimentoInfo = 'Vence hoje';
    } else {
        vencimentoInfo = `Venceu há ${Math.abs(diffDays)} dia${Math.abs(diffDays) > 1 ? 's' : ''}`;
    }
    
    return `
        <div class="mensalidade-card-simple ${statusClass}">
            <div class="mensalidade-header-simple">
                <div class="mensalidade-referencia">
                    <strong>${formatReferencia(mensalidade.referencia)}</strong>
                </div>
                <div class="mensalidade-status">
                    <i class="fas fa-${statusIcon}"></i>
                    <span>${statusText}</span>
                </div>
            </div>
            
            <div class="mensalidade-details-simple">
                <div class="mensalidade-valor">
                    <span class="valor">R$ ${mensalidade.valor.toFixed(2).replace('.', ',')}</span>
                </div>
                <div class="mensalidade-vencimento">
                    <small><i class="fas fa-calendar"></i> ${formatDate(mensalidade.vencimento)}</small>
                    <small class="vencimento-info ${statusClass}">${vencimentoInfo}</small>
                </div>
            </div>
            
            <div class="mensalidade-actions-simple">
                ${mensalidade.status === 'pendente' ? `
                    <button class="btn btn-success btn-xs" onclick="markMensalidadeAsPaga('${mensalidade.id}')" title="Marcar como paga">
                        <i class="fas fa-check"></i>
                    </button>
                ` : `
                    <button class="btn btn-warning btn-xs" onclick="markMensalidadeAsPendente('${mensalidade.id}')" title="Marcar como pendente">
                        <i class="fas fa-undo"></i>
                    </button>
                `}
            </div>
        </div>
    `;
}

// ==================== FIM DAS FUNÇÕES FINANCEIRAS FALTANTES ====================

// ==================== FUNÇÕES DE PAGINAÇÃO E FILTROS (RESTAURADAS) ====================

// Função para mudar página de alunos
window.changeStudentsPage = function(direction) {
    const totalPages = Math.ceil(filteredStudents.length / itemsPerPage);
    
    if (direction === -1 && currentPage > 1) {
        currentPage--;
    } else if (direction === 1 && currentPage < totalPages) {
        currentPage++;
    }
    
    renderStudentsList();
};

// Função para limpar busca de drill-down
window.clearDrillDownSearch = function() {
    const searchInput = document.getElementById('studentsSearchInput');
    if (searchInput) {
        searchInput.value = '';
        searchTerm = '';
        filteredStudents = [...students];
        currentPage = 1;
        renderStudentsList();
        
        const clearBtn = document.getElementById('clearStudentsSearchBtn');
        if (clearBtn) {
            clearBtn.style.display = 'none';
        }
    }
};

// Função para carregar filtro mensal
window.loadMonthlyFilter = function() {
    console.log('📅 Carregando filtro mensal...');
    
    try {
        // Definir mês atual como padrão
        const monthFilter = document.getElementById('monthFilter');
        if (monthFilter && !monthFilter.value) {
            const currentMonth = new Date().toISOString().slice(0, 7);
            monthFilter.value = currentMonth;
            console.log(`📅 Mês padrão definido: ${currentMonth}`);
        }
        
        // Filtrar automaticamente se há mês selecionado
        if (monthFilter && monthFilter.value) {
            filterByMonth();
        } else {
            // Mostrar mensagem inicial
            const resultsContainer = document.getElementById('monthlyResults');
            if (resultsContainer) {
                resultsContainer.innerHTML = `
                    <div class="monthly-filter-initial">
                        <div class="filter-icon">
                            <i class="fas fa-calendar-alt"></i>
                        </div>
                        <h4>Filtro Mensal</h4>
                        <p>Selecione um mês para visualizar as mensalidades correspondentes</p>
                        <small>O mês atual está pré-selecionado por padrão</small>
                    </div>
                `;
            }
        }
        
        console.log('✅ Filtro mensal carregado');
        
    } catch (error) {
        console.error('❌ Erro ao carregar filtro mensal:', error);
    }
};

// Função para filtrar por mês
window.filterByMonth = function() {
    console.log('🔍 === INICIANDO FILTRO MENSAL ===');
    
    const monthFilter = document.getElementById('monthFilter');
    const resultsContainer = document.getElementById('monthlyResults');
    
    if (!monthFilter || !resultsContainer) {
        console.error('❌ Elementos de filtro mensal não encontrados!');
        return;
    }
    
    const selectedMonth = monthFilter.value;
    if (!selectedMonth) {
        console.warn('⚠️ Nenhum mês selecionado');
        resultsContainer.innerHTML = '<p class="warning">Selecione um mês para filtrar</p>';
        return;
    }
    
    console.log(`📅 Filtrando mensalidades para: ${selectedMonth}`);
    
    // Filtrar mensalidades do mês
    const mensalidadesDoMes = mensalidades.filter(mensalidade => {
        if (!mensalidade.referencia) return false;
        return mensalidade.referencia === selectedMonth;
    });
    
    console.log(`📊 Encontradas ${mensalidadesDoMes.length} mensalidades para ${selectedMonth}`);
    
    if (mensalidadesDoMes.length === 0) {
        resultsContainer.innerHTML = `
            <div class="monthly-no-results">
                <div class="no-results-icon">
                    <i class="fas fa-calendar-times"></i>
                </div>
                <h4>Nenhuma mensalidade encontrada</h4>
                <p>Não há mensalidades para o mês de <strong>${formatMonthName(selectedMonth)}</strong></p>
                <small>Verifique se existem contratos ativos para este período</small>
            </div>
        `;
        return;
    }
    
    // Calcular estatísticas
    const pagas = mensalidadesDoMes.filter(m => m.status === 'paga').length;
    const pendentes = mensalidadesDoMes.filter(m => m.status === 'pendente').length;
    const vencidas = mensalidadesDoMes.filter(m => isOverdue(m.vencimento) && m.status === 'pendente').length;
    
    const totalPago = mensalidadesDoMes.filter(m => m.status === 'paga').reduce((sum, m) => sum + m.valor, 0);
    const totalPendente = mensalidadesDoMes.filter(m => m.status === 'pendente').reduce((sum, m) => sum + m.valor, 0);
    
    // Criar HTML dos resultados
    const resultHTML = `
        <div class="monthly-results-header">
            <h4><i class="fas fa-calendar-check"></i> ${formatMonthName(selectedMonth)}</h4>
            <p>${mensalidadesDoMes.length} mensalidade(s) encontrada(s)</p>
        </div>
        
        <div class="monthly-stats-cards">
            <div class="monthly-stat-card pagas">
                <div class="stat-icon"><i class="fas fa-check-circle"></i></div>
                <div class="stat-info">
                    <span class="stat-number">${pagas}</span>
                    <span class="stat-label">Pagas</span>
                    <span class="stat-value">R$ ${totalPago.toFixed(2).replace('.', ',')}</span>
                </div>
            </div>
            <div class="monthly-stat-card pendentes">
                <div class="stat-icon"><i class="fas fa-clock"></i></div>
                <div class="stat-info">
                    <span class="stat-number">${pendentes}</span>
                    <span class="stat-label">Pendentes</span>
                    <span class="stat-value">R$ ${totalPendente.toFixed(2).replace('.', ',')}</span>
                </div>
            </div>
            <div class="monthly-stat-card vencidas">
                <div class="stat-icon"><i class="fas fa-exclamation-triangle"></i></div>
                <div class="stat-info">
                    <span class="stat-number">${vencidas}</span>
                    <span class="stat-label">Vencidas</span>
                </div>
            </div>
        </div>
        
        <div class="monthly-mensalidades-list">
            ${mensalidadesDoMes.map(mensalidade => createMensalidadeCard(mensalidade)).join('')}
        </div>
    `;
    
    resultsContainer.innerHTML = resultHTML;
    
    console.log(`✅ Filtro mensal carregado para ${selectedMonth} - ${mensalidadesDoMes.length} mensalidades`);
    console.log('🔍 === FIM DO FILTRO MENSAL ===');
};

// Função para formatar nome do mês
function formatMonthName(monthString) {
    if (!monthString) return 'N/A';
    
    const [year, month] = monthString.split('-');
    const months = [
        'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
        'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
    ];
    
    return `${months[parseInt(month) - 1]} de ${year}`;
}

// Função para criar card de mensalidade (para filtro mensal)
function createMensalidadeCard(mensalidade) {
    const isOverdueStatus = isOverdue(mensalidade.vencimento) && mensalidade.status === 'pendente';
    const statusClass = mensalidade.status === 'paga' ? 'paga' : (isOverdueStatus ? 'vencida' : 'pendente');
    
    return `
        <div class="mensalidade-card status-${statusClass}">
            <div class="mensalidade-header">
                <div class="student-info">
                    <h5>${mensalidade.studentName}</h5>
                    <small>${mensalidade.studentEmail}</small>
                </div>
                <div class="mensalidade-value">
                    <span class="value">R$ ${mensalidade.valor.toFixed(2).replace('.', ',')}</span>
                </div>
            </div>
            <div class="mensalidade-details">
                <div class="detail-item">
                    <i class="fas fa-calendar"></i>
                    <span>Vencimento: ${formatDate(mensalidade.vencimento)}</span>
                    ${isOverdueStatus ? '<span class="overdue-badge">VENCIDA</span>' : ''}
                </div>
                <div class="detail-item">
                    <i class="fas fa-${mensalidade.status === 'paga' ? 'check-circle' : 'clock'}"></i>
                    <span>Status: ${mensalidade.status === 'paga' ? 'Paga' : 'Pendente'}</span>
                </div>
                ${mensalidade.dataPagamento ? `
                    <div class="detail-item">
                        <i class="fas fa-money-bill"></i>
                        <span>Pago em: ${formatDate(mensalidade.dataPagamento)}</span>
                    </div>
                ` : ''}
            </div>
            <div class="mensalidade-actions">
                ${mensalidade.status === 'pendente' ? `
                    <button class="btn btn-success btn-small" onclick="markMensalidadeAsPaga('${mensalidade.id}')">
                        <i class="fas fa-check"></i> Marcar como Paga
                    </button>
                ` : `
                    <button class="btn btn-warning btn-small" onclick="markMensalidadeAsPendente('${mensalidade.id}')">
                        <i class="fas fa-undo"></i> Marcar como Pendente
                    </button>
                `}
            </div>
        </div>
    `;
}

// Função para verificar se data está vencida
function isOverdue(dateString) {
    if (!dateString) return false;
    const today = new Date();
    const dueDate = new Date(dateString + 'T23:59:59');
    return dueDate < today;
}

// Função para formatar data
function formatDate(dateString) {
    if (!dateString) return 'N/A';
    const date = new Date(dateString + 'T12:00:00');
    return date.toLocaleDateString('pt-BR');
}

// Função para marcar mensalidade como paga
window.markMensalidadeAsPaga = function(mensalidadeId) {
    const mensalidade = mensalidades.find(m => m.id === mensalidadeId);
    if (!mensalidade) {
        if (typeof showAlert === 'function') {
            showAlert('Mensalidade não encontrada!', 'danger');
        } else {
            alert('Mensalidade não encontrada!');
        }
        return;
    }
    
    mensalidade.status = 'paga';
    mensalidade.dataPagamento = new Date().toISOString().split('T')[0];
    
    // Salvar dados
    saveData();
    
    // Recarregar filtro mensal se estiver ativo
    const monthFilter = document.getElementById('monthFilter');
    if (monthFilter && monthFilter.value) {
        filterByMonth();
    }
    
    // Recarregar mensalidades do aluno se estiver na visualização do aluno
    if (document.getElementById('studentMensalidades')) {
        loadStudentMensalidades(mensalidade.studentEmail);
    }
    
    if (typeof showAlert === 'function') {
        showAlert('Mensalidade marcada como paga!', 'success');
    } else {
        alert('Mensalidade marcada como paga!');
    }
    
    console.log(`✅ Mensalidade ${mensalidadeId} marcada como paga`);
};

// Função para marcar mensalidade como pendente
window.markMensalidadeAsPendente = function(mensalidadeId) {
    const mensalidade = mensalidades.find(m => m.id === mensalidadeId);
    if (!mensalidade) {
        if (typeof showAlert === 'function') {
            showAlert('Mensalidade não encontrada!', 'danger');
        } else {
            alert('Mensalidade não encontrada!');
        }
        return;
    }
    
    mensalidade.status = 'pendente';
    delete mensalidade.dataPagamento;
    
    // Salvar dados
    saveData();
    
    // Recarregar filtro mensal se estiver ativo
    const monthFilter = document.getElementById('monthFilter');
    if (monthFilter && monthFilter.value) {
        filterByMonth();
    }
    
    // Recarregar mensalidades do aluno se estiver na visualização do aluno
    if (document.getElementById('studentMensalidades')) {
        loadStudentMensalidades(mensalidade.studentEmail);
    }
    
    if (typeof showAlert === 'function') {
        showAlert('Mensalidade marcada como pendente!', 'success');
    } else {
        alert('Mensalidade marcada como pendente!');
    }
    
    console.log(`↩️ Mensalidade ${mensalidadeId} marcada como pendente`);
};

// ==================== FIM DAS FUNÇÕES RESTAURADAS ====================

// ==================== GERAÇÃO DE MENSALIDADES ====================

// Função para gerar mensalidades baseadas em contratos - VERSÃO CORRIGIDA
window.generateMensalidadesFromContrato = function(contrato) {
    console.log('📅 Gerando mensalidades para contrato:', contrato.id);
    
    if (!contrato || !contrato.dataInicio) {
        console.error('❌ Contrato inválido para gerar mensalidades');
        return;
    }
    
    // Inicializar mensalidades se não existir
    if (!window.mensalidades) {
        window.mensalidades = [];
    }
    
    // Remover mensalidades existentes deste contrato
    window.mensalidades = mensalidades.filter(m => m.contratoId !== contrato.id);
    
    // Garantir que as datas sejam válidas
    const dataInicio = new Date(contrato.dataInicio + 'T12:00:00'); // Usar meio-dia para evitar problemas de timezone
    
    // Se não há data de término no contrato, definir como 1 ano
    let dataTerminoContrato = contrato.dataTermino;
    if (!dataTerminoContrato) {
        const dataInicioDate = new Date(contrato.dataInicio);
        dataInicioDate.setFullYear(dataInicioDate.getFullYear() + 1);
        dataTerminoContrato = dataInicioDate.toISOString().split('T')[0];
        contrato.dataTermino = dataTerminoContrato; // Atualizar o contrato
        console.log(`📅 Data de término automática adicionada: ${dataTerminoContrato}`);
    }
    
    const dataTermino = new Date(dataTerminoContrato + 'T12:00:00');
    
    // Validar data de início
    if (isNaN(dataInicio.getTime())) {
        console.error('❌ Data de início inválida:', contrato.dataInicio);
        return;
    }
    
    console.log(`📅 Período: ${dataInicio.toISOString().split('T')[0]} até ${dataTermino ? dataTermino.toISOString().split('T')[0] : 'indeterminado'}`);
    
    // Configurações para geração
    const diaVencimento = contrato.vencimento ? parseInt(contrato.vencimento) : 10;
    const maxMonths = contrato.tipo === 'trimestral' ? 3 : (contrato.tipo === 'semestral' ? 6 : 12);
    
    let currentDate = new Date(dataInicio.getTime()); // Clonar a data
    let monthCount = 0;
    
    console.log(`🔧 Configurações: Vencimento dia ${diaVencimento}, Máximo ${maxMonths} meses`);
    
    while (monthCount < maxMonths) {
        // Criar data de referência (primeiro dia do mês)
        const referenciaDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
        
        // Parar se a referência passou da data de término
        if (referenciaDate > dataTermino) {
            console.log(`⏹️ Parou na referência ${referenciaDate.toISOString().split('T')[0]} - passou do término`);
            break;
        }
        
        // Criar data de vencimento com validação robusta
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        
        console.log(`📅 Criando vencimento: Ano ${year}, Mês ${month + 1}, Dia ${diaVencimento}`);
        
        // Obter o último dia do mês
        const ultimoDiaDoMes = new Date(year, month + 1, 0).getDate();
        
        // Ajustar dia de vencimento se for maior que o último dia do mês
        const diaVencimentoAjustado = Math.min(diaVencimento, ultimoDiaDoMes);
        
        console.log(`📅 Dia ajustado: ${diaVencimento} -> ${diaVencimentoAjustado} (último dia: ${ultimoDiaDoMes})`);
        
        // Criar data de vencimento
        let vencimentoDate = new Date(year, month, diaVencimentoAjustado);
        
        // Verificação adicional de segurança
        if (vencimentoDate.getMonth() !== month) {
            console.warn(`⚠️ Data de vencimento mudou de mês! Corrigindo...`);
            vencimentoDate = new Date(year, month, Math.min(diaVencimento, 28)); // Fallback seguro
        }
        
        // Gerar ID único
        const mensalidadeId = generateId();
        
        // Validar se a data de vencimento foi criada corretamente
        if (isNaN(vencimentoDate.getTime())) {
            console.error(`❌ Data de vencimento inválida gerada para o mês ${currentDate.getMonth() + 1}/${currentDate.getFullYear()}`);
            vencimentoDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), Math.min(diaVencimento, 28)); // Fallback para dia 28
        }
        
        const vencimentoFormatted = formatDateForStorage(vencimentoDate);
        
        const mensalidade = {
            id: mensalidadeId,
            contratoId: contrato.id,
            studentEmail: contrato.studentEmail,
            studentName: contrato.studentName,
            valor: contrato.valor,
            vencimento: vencimentoFormatted,
            referencia: `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}`,
            status: 'pendente',
            createdDate: formatDateForStorage(new Date())
        };
        
        // Validar mensalidade antes de adicionar
        if (!mensalidade.vencimento || mensalidade.vencimento === 'NaN-NaN-NaN' || mensalidade.vencimento === null) {
            console.error('❌ Mensalidade com data inválida detectada, pulando:', {
                mes: monthCount + 1,
                aluno: mensalidade.studentName,
                vencimento: mensalidade.vencimento
            });
            return; // Não adicionar mensalidade inválida
        }
        
        mensalidades.push(mensalidade);
        
        console.log(`✅ Mensalidade ${monthCount + 1}: ${mensalidade.studentName} - ${mensalidade.referencia} - Vence: ${mensalidade.vencimento}`);
        
        // Próximo mês
        currentDate.setMonth(currentDate.getMonth() + 1);
        monthCount++;
    }
    
    // Salvar mensalidades
    localStorage.setItem('mensalidades', JSON.stringify(mensalidades));
    
    console.log(`✅ ${monthCount} mensalidades geradas para ${contrato.studentName}`);
    if (mensalidades.length > 0) {
        const contratMensalidades = mensalidades.filter(m => m.contratoId === contrato.id);
        if (contratMensalidades.length > 0) {
            console.log('📊 Primeira mensalidade:', contratMensalidades[0]);
            console.log('📊 Última mensalidade:', contratMensalidades[contratMensalidades.length - 1]);
        }
    }
};

// Função auxiliar para formatação de datas para armazenamento - VERSÃO ROBUSTA
function formatDateForStorage(date) {
    try {
        // Verificar se é uma data válida
        if (!date || !(date instanceof Date) || isNaN(date.getTime())) {
            console.error('❌ Data inválida recebida para formatação:', date);
            return null;
        }
        
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        
        // Verificar se os valores são válidos
        if (year < 1900 || year > 3000 || month === '00' || day === '00') {
            console.error('❌ Componentes de data inválidos:', { year, month, day });
            return null;
        }
        
        const formatted = `${year}-${month}-${day}`;
        return formatted;
    } catch (error) {
        console.error('❌ Erro ao formatar data:', error, date);
        return null;
    }
}

// Função para regenerar mensalidades (utilitário de correção)
window.regenerarMensalidades = function() {
    console.log('🔄 Regenerando todas as mensalidades...');
    
    // Limpar todas as mensalidades
    window.mensalidades = [];
    
    // Gerar mensalidades para todos os contratos ativos
    if (window.contratos && contratos.length > 0) {
        const contratosAtivos = contratos.filter(c => c.status === 'ativo');
        console.log(`📋 Regenerando para ${contratosAtivos.length} contratos ativos`);
        
        contratosAtivos.forEach(contrato => {
            generateMensalidadesFromContrato(contrato);
        });
        
        console.log(`✅ Regeneração concluída! Total: ${mensalidades.length} mensalidades`);
        
        // Mostrar alerta de sucesso
        if (typeof showAlert === 'function') {
            showAlert(`Mensalidades regeneradas com sucesso! Total: ${mensalidades.length}`, 'success');
        }
        
        // Recarregar interface se estiver na área financeira
        if (document.getElementById('financialTabContent')) {
            const activeTab = document.querySelector('.tab-btn.active');
            if (activeTab && activeTab.id === 'studentsTab') {
                loadStudentsDrillDown();
            }
        }
    } else {
        console.log('⚠️ Nenhum contrato ativo encontrado');
        if (typeof showAlert === 'function') {
            showAlert('Nenhum contrato ativo encontrado para gerar mensalidades!', 'warning');
        }
    }
};

// Função para formatar referência da mensalidade
function formatReferencia(referencia) {
    if (!referencia) return 'N/A';
    
    const [ano, mes] = referencia.split('-');
    const meses = [
        'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
        'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
    ];
    
    return `${meses[parseInt(mes) - 1]} ${ano}`;
}

// Funcoes para marcar mensalidades
window.markMensalidadeAsPaga = function(mensalidadeId) {
    console.log('Marcando mensalidade como paga:', mensalidadeId);
    
    const mensalidade = mensalidades.find(m => m.id === mensalidadeId);
    if (!mensalidade) {
        if (typeof showAlert === 'function') {
            showAlert('Mensalidade nao encontrada!', 'danger');
        }
        return;
    }
    
    mensalidade.status = 'paga';
    mensalidade.dataPagamento = new Date().toISOString().split('T')[0];
    
    localStorage.setItem('mensalidades', JSON.stringify(mensalidades));
    
    if (typeof showStudentFinancials === 'function') {
        showStudentFinancials(mensalidade.studentEmail);
    }
    
    if (typeof updateFinancialCards === 'function') {
        updateFinancialCards();
    }
    
    if (typeof showAlert === 'function') {
        showAlert('Mensalidade marcada como paga!', 'success');
    }
};

window.markMensalidadeAsPendente = function(mensalidadeId) {
    console.log('Marcando mensalidade como pendente:', mensalidadeId);
    
    const mensalidade = mensalidades.find(m => m.id === mensalidadeId);
    if (!mensalidade) {
        if (typeof showAlert === 'function') {
            showAlert('Mensalidade nao encontrada!', 'danger');
        }
        return;
    }
    
    mensalidade.status = 'pendente';
    mensalidade.dataPagamento = null;
    
    localStorage.setItem('mensalidades', JSON.stringify(mensalidades));
    
    if (typeof showStudentFinancials === 'function') {
        showStudentFinancials(mensalidade.studentEmail);
    }
    
    if (typeof updateFinancialCards === 'function') {
        updateFinancialCards();
    }
    
    if (typeof showAlert === 'function') {
        showAlert('Mensalidade marcada como pendente!', 'info');
    }
};

// ==================== FUNÇÃO DE GERAÇÃO DE AVATAR ====================

function generateAvatar(name) {
    if (!name) return '👤';
    
    // Pegar primeira letra do nome
    const firstLetter = name.charAt(0).toUpperCase();
    
    // Cores baseadas na primeira letra
    const colors = [
        '#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA726', '#66BB6A',
        '#8E24AA', '#D32F2F', '#F57C00', '#388E3C', '#7B1FA2'
    ];
    
    const colorIndex = firstLetter.charCodeAt(0) % colors.length;
    const backgroundColor = colors[colorIndex];
    
    return `<div class="avatar-circle" style="background-color: ${backgroundColor}; color: white; width: 50px; height: 50px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 20px;">${firstLetter}</div>`;
}

// ==================== FUNÇÕES AUXILIARES PARA RELATÓRIOS ====================

// Função para verificar se mensalidades estão inicializadas
function initializeMensalidadesSystem() {
    if (!window.mensalidades) {
        window.mensalidades = [];
        console.log('🔄 Sistema de mensalidades inicializado');
    }
    return true;
}

// Disponibilizar funções globalmente
window.generateAvatar = generateAvatar;
window.initializeMensalidadesSystem = initializeMensalidadesSystem;
