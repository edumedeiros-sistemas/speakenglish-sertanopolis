console.log('🛡️ INTERFACE PERSISTENTE: Proteção contra sobrescrita');

// ===== INTERFACE PERSISTENTE E PROTEGIDA =====
function createPersistentProfessorInterface() {
    console.log('🛡️ Criando interface PERSISTENTE do professor...');
    
    const userData = JSON.parse(localStorage.getItem('currentUserData') || '{"name":"João Silva","email":"joao.silva@teste.com"}');
    const student = userData.student || { level: 'Ouro', totalPoints: 950 };
    
    // REMOVER TUDO PRIMEIRO
    document.body.innerHTML = '';
    document.head.innerHTML = `
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>SpeakEnglish - Área do Aluno</title>
        <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet">
        <link rel="stylesheet" href="styles.css">
        <style>
            /* FORÇA FUNDO BRANCO */
            body, html {
                background-color: #f8f9fa !important;
                background: #f8f9fa !important;
            }
            /* EVITA SOBREPOSIÇÃO */
            .student-interface {
                display: none !important;
            }
            [style*="background: linear-gradient(135deg, #667eea"] {
                display: none !important;
            }
            
            /* ESTILO PARA ATIVIDADES - CORRIGIDO */
            .activity-item {
                display: flex;
                align-items: flex-start;
                padding: 16px 0;
                border-bottom: 1px solid #e9ecef;
                width: 100%;
                box-sizing: border-box;
            }
            .activity-item:last-child {
                border-bottom: none;
            }
            .activity-icon {
                margin-right: 16px;
                width: 50px;
                min-width: 50px;
                text-align: center;
                flex-shrink: 0;
                padding-top: 3px;
            }
            .activity-icon i {
                font-size: 1.4em;
                line-height: 1;
            }
            .activity-content {
                flex: 1;
                min-width: 0;
                overflow: hidden;
            }
            .activity-content h4 {
                margin: 0 0 8px 0;
                font-size: 15px;
                font-weight: 600;
                color: #333;
                line-height: 1.3;
            }
            .activity-content p {
                margin: 0 0 6px 0;
                font-size: 14px;
                color: #666;
                line-height: 1.3;
            }
            .activity-content small {
                font-size: 12px;
                color: #999;
                display: block;
                margin-top: 4px;
                line-height: 1.2;
            }
            
            /* Garantir espaçamento adequado */
            .card-body {
                padding: 20px;
            }
        </style>
    `;
    
    // CRIAR INTERFACE PROTEGIDA
    document.body.innerHTML = `
        <div class="container">
            <!-- Header PROTEGIDO -->
            <header class="header">
                <div class="header-content">
                    <div class="logo-section">
                        <div class="logo">
                            <div class="logo-horizontal">
                                <div class="logo-text">
                                    <span class="logo-speak">speak</span><span class="logo-english">english</span>
                                </div>
                                <div class="flags-container">
                                    <img src="https://flagcdn.com/w40/gb.png" alt="Reino Unido" class="flag">
                                    <img src="https://flagcdn.com/w40/us.png" alt="Estados Unidos" class="flag">
                                </div>
                            </div>
                            <h1 class="header-title">Área do Aluno - ${userData.name}</h1>
                            <p class="header-subtitle">Acompanhe seu Progresso • Conquiste seus Objetivos</p>
                            <div class="header-buttons">
                                <button class="header-btn confidence-btn">
                                    <i class="fas fa-user-graduate"></i> ${userData.name}
                                </button>
                                <button class="header-btn professor-btn">
                                    <i class="fas fa-star"></i> ${student.level} - ${student.totalPoints} pts
                                </button>
                            </div>
                        </div>
                    </div>
                    
                    <div class="header-actions">
                        <button class="btn btn-danger" onclick="logoutStudentPersistent()">
                            <i class="fas fa-sign-out-alt"></i> Sair
                        </button>
                    </div>
                </div>
            </header>

            <!-- Navegação PROTEGIDA -->
            <nav class="tabs">
                <button class="tab active" onclick="showTabPersistent('dashboard')" id="persistent-tab-dashboard">
                    <i class="fas fa-chart-line"></i> Meu Progresso
                </button>
                <button class="tab" onclick="showTabPersistent('rankings')" id="persistent-tab-rankings">
                    <i class="fas fa-trophy"></i> Rankings
                </button>
                <button class="tab" onclick="showTabPersistent('presenca')" id="persistent-tab-presenca">
                    <i class="fas fa-calendar-check"></i> Presenças
                </button>
                <button class="tab" onclick="showTabPersistent('tarefas')" id="persistent-tab-tarefas">
                    <i class="fas fa-tasks"></i> Tarefas
                </button>
                <button class="tab" onclick="showTabPersistent('financeiro')" id="persistent-tab-financeiro">
                    <i class="fas fa-credit-card"></i> Financeiro
                </button>
                <button class="tab" onclick="showTabPersistent('perfil')" id="persistent-tab-perfil">
                    <i class="fas fa-user-cog"></i> Perfil
                </button>
            </nav>

            <!-- Conteúdo PROTEGIDO -->
            <div id="persistent-content">
                <div class="dashboard-section">
                    <div class="section-header">
                        <h2><i class="fas fa-chart-line"></i> Meu Progresso</h2>
                        <p>Acompanhe sua evolução e conquistas no SpeakEnglish</p>
                    </div>
                    
                    <!-- Cards de Estatísticas -->
                    <div class="stats-grid">
                        <div class="stat-card primary">
                            <div class="stat-icon">
                                <i class="fas fa-star"></i>
                            </div>
                            <div class="stat-content">
                                <h3>${student.totalPoints || 950}</h3>
                                <p>Pontos Totais</p>
                            </div>
                        </div>
                        
                        <div class="stat-card success">
                            <div class="stat-icon">
                                <i class="fas fa-trophy"></i>
                            </div>
                            <div class="stat-content">
                                <h3>${student.level || 'Ouro'}</h3>
                                <p>Nível Atual</p>
                            </div>
                        </div>
                        
                        <div class="stat-card info">
                            <div class="stat-icon">
                                <i class="fas fa-calendar-check"></i>
                            </div>
                            <div class="stat-content">
                                <h3>95%</h3>
                                <p>Frequência</p>
                            </div>
                        </div>
                        
                        <div class="stat-card warning">
                            <div class="stat-icon">
                                <i class="fas fa-fire"></i>
                            </div>
                            <div class="stat-content">
                                <h3>7</h3>
                                <p>Dias Seguidos</p>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Progresso -->
                    <div class="content-grid">
                        <div class="card">
                            <div class="card-header">
                                <h3><i class="fas fa-chart-bar"></i> Progresso do Nível</h3>
                            </div>
                            <div class="card-body">
                                <div class="progress-container">
                                    <div class="progress-info">
                                        <span>Nível ${student.level || 'Ouro'}</span>
                                        <span>750/1000 pontos</span>
                                    </div>
                                    <div class="progress-bar">
                                        <div class="progress-fill" style="width: 75%"></div>
                                    </div>
                                    <p class="progress-text">250 pontos para Platina</p>
                                </div>
                            </div>
                        </div>
                        
                        <div class="card">
                            <div class="card-header">
                                <h3><i class="fas fa-graduation-cap"></i> Últimas Atividades</h3>
                            </div>
                            <div class="card-body">
                                <div class="activity-item">
                                    <div class="activity-icon">
                                        <i class="fas fa-check-circle" style="color: #28a745;"></i>
                                    </div>
                                    <div class="activity-content">
                                        <h4>Tarefa Concluída</h4>
                                        <p>Exercícios de Grammar - Unit 5</p>
                                        <small class="text-muted">Há 2 dias</small>
                                    </div>
                                </div>
                                <div class="activity-item">
                                    <div class="activity-icon">
                                        <i class="fas fa-star" style="color: #ffc107;"></i>
                                    </div>
                                    <div class="activity-content">
                                        <h4>Pontuação Obtida</h4>
                                        <p>+50 pontos por participação</p>
                                        <small class="text-muted">Há 3 dias</small>
                                    </div>
                                </div>
                                <div class="activity-item">
                                    <div class="activity-icon">
                                        <i class="fas fa-calendar-check" style="color: #17a2b8;"></i>
                                    </div>
                                    <div class="activity-content">
                                        <h4>Aula Assistida</h4>
                                        <p>Conversation Practice</p>
                                        <small class="text-muted">Há 5 dias</small>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    console.log('✅ Interface persistente criada!');
}

// ===== FUNÇÕES PROTEGIDAS =====
function setupPersistentFunctions() {
    
    window.logoutStudentPersistent = function() {
        localStorage.removeItem('currentUser');
        localStorage.removeItem('currentUserType');
        localStorage.removeItem('currentUserData');
        localStorage.removeItem('currentStudentEmail');
        location.reload();
    };
    
    window.showTabPersistent = function(tabName) {
        console.log(`🔄 Carregando aba: ${tabName}`);
        
        // Atualizar botões ativos
        document.querySelectorAll('.tab').forEach(btn => btn.classList.remove('active'));
        const activeBtn = document.getElementById(`persistent-tab-${tabName}`);
        if (activeBtn) activeBtn.classList.add('active');
        
        const content = document.getElementById('persistent-content');
        if (!content) return;
        
        const userData = JSON.parse(localStorage.getItem('currentUserData') || '{"name":"João Silva","email":"joao.silva@teste.com"}');
        const student = userData.student || { level: 'Ouro', totalPoints: 950 };
        
        switch(tabName) {
            case 'dashboard':
                content.innerHTML = getDashboardContent(userData, student);
                break;
            case 'rankings':
                content.innerHTML = getRankingsContent(userData, student);
                break;
            case 'presenca':
                content.innerHTML = getPresencaContent(userData, student);
                break;
            case 'tarefas':
                content.innerHTML = getTarefasContent(userData, student);
                break;
            case 'financeiro':
                content.innerHTML = getFinanceiroContent(userData, student);
                break;
            case 'perfil':
                content.innerHTML = getPerfilContent(userData, student);
                break;
            default:
                content.innerHTML = getDashboardContent(userData, student);
        }
    };
    
    // ===== DASHBOARD CONTENT =====
    function getDashboardContent(userData, student) {
        return `
            <div class="dashboard-section">
                <div class="section-header">
                    <h2><i class="fas fa-chart-line"></i> Meu Progresso</h2>
                    <p>Acompanhe sua evolução e conquistas no SpeakEnglish</p>
                </div>
                
                <div class="stats-grid">
                    <div class="stat-card primary">
                        <div class="stat-icon"><i class="fas fa-star"></i></div>
                        <div class="stat-content">
                            <h3>${student.totalPoints || 950}</h3>
                            <p>Pontos Totais</p>
                        </div>
                    </div>
                    <div class="stat-card success">
                        <div class="stat-icon"><i class="fas fa-trophy"></i></div>
                        <div class="stat-content">
                            <h3>${student.level || 'Ouro'}</h3>
                            <p>Nível Atual</p>
                        </div>
                    </div>
                    <div class="stat-card info">
                        <div class="stat-icon"><i class="fas fa-calendar-check"></i></div>
                        <div class="stat-content">
                            <h3>95%</h3>
                            <p>Frequência</p>
                        </div>
                    </div>
                    <div class="stat-card warning">
                        <div class="stat-icon"><i class="fas fa-fire"></i></div>
                        <div class="stat-content">
                            <h3>7</h3>
                            <p>Dias Seguidos</p>
                        </div>
                    </div>
                </div>
                
                <div class="content-grid">
                    <div class="card">
                        <div class="card-header">
                            <h3><i class="fas fa-chart-bar"></i> Progresso do Nível</h3>
                        </div>
                        <div class="card-body">
                            <div class="progress-container">
                                <div class="progress-info">
                                    <span>Nível ${student.level || 'Ouro'}</span>
                                    <span>750/1000 pontos</span>
                                </div>
                                <div class="progress-bar">
                                    <div class="progress-fill" style="width: 75%"></div>
                                </div>
                                <p class="progress-text">250 pontos para Platina</p>
                            </div>
                        </div>
                    </div>
                    
                    <div class="card">
                        <div class="card-header">
                            <h3><i class="fas fa-graduation-cap"></i> Últimas Atividades</h3>
                        </div>
                        <div class="card-body">
                            <div class="activity-item">
                                <div class="activity-icon">
                                    <i class="fas fa-check-circle" style="color: #28a745;"></i>
                                </div>
                                <div class="activity-content">
                                    <h4>Tarefa Concluída</h4>
                                    <p>Exercícios de Grammar - Unit 5</p>
                                    <small class="text-muted">Há 2 dias</small>
                                </div>
                            </div>
                            <div class="activity-item">
                                <div class="activity-icon">
                                    <i class="fas fa-star" style="color: #ffc107;"></i>
                                </div>
                                <div class="activity-content">
                                    <h4>Pontuação Obtida</h4>
                                    <p>+50 pontos por participação</p>
                                    <small class="text-muted">Há 3 dias</small>
                                </div>
                            </div>
                            <div class="activity-item">
                                <div class="activity-icon">
                                    <i class="fas fa-calendar-check" style="color: #17a2b8;"></i>
                                </div>
                                <div class="activity-content">
                                    <h4>Aula Assistida</h4>
                                    <p>Conversation Practice</p>
                                    <small class="text-muted">Há 5 dias</small>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
    
    // ===== RANKINGS CONTENT =====
    function getRankingsContent(userData, student) {
        return `
            <div class="dashboard-section">
                <div class="section-header">
                    <h2><i class="fas fa-trophy"></i> Rankings</h2>
                    <p>Veja sua posição entre os alunos do SpeakEnglish</p>
                </div>
                
                <div class="stats-grid">
                    <div class="stat-card primary">
                        <div class="stat-icon"><i class="fas fa-medal"></i></div>
                        <div class="stat-content">
                            <h3>5º</h3>
                            <p>Posição Geral</p>
                        </div>
                    </div>
                    <div class="stat-card success">
                        <div class="stat-icon"><i class="fas fa-users"></i></div>
                        <div class="stat-content">
                            <h3>54</h3>
                            <p>Total de Alunos</p>
                        </div>
                    </div>
                    <div class="stat-card info">
                        <div class="stat-icon"><i class="fas fa-arrow-up"></i></div>
                        <div class="stat-content">
                            <h3>+2</h3>
                            <p>Posições este mês</p>
                        </div>
                    </div>
                    <div class="stat-card warning">
                        <div class="stat-icon"><i class="fas fa-target"></i></div>
                        <div class="stat-content">
                            <h3>150</h3>
                            <p>Pontos até 4º lugar</p>
                        </div>
                    </div>
                </div>
                
                <div class="content-grid">
                    <div class="card">
                        <div class="card-header">
                            <h3><i class="fas fa-trophy"></i> Top 10 Ranking</h3>
                        </div>
                        <div class="card-body">
                            <div class="ranking-item highlight">
                                <span class="rank">5º</span>
                                <span class="name">${userData.name}</span>
                                <span class="points">${student.totalPoints || 950} pts</span>
                                <span class="badge you">Você</span>
                            </div>
                            <div class="ranking-item">
                                <span class="rank">1º</span>
                                <span class="name">Ana Oliveira</span>
                                <span class="points">1200 pts</span>
                                <span class="badge gold">Platina</span>
                            </div>
                            <div class="ranking-item">
                                <span class="rank">2º</span>
                                <span class="name">Pedro Costa</span>
                                <span class="points">1150 pts</span>
                                <span class="badge silver">Platina</span>
                            </div>
                            <div class="ranking-item">
                                <span class="rank">3º</span>
                                <span class="name">Maria Santos</span>
                                <span class="points">1100 pts</span>
                                <span class="badge bronze">Ouro</span>
                            </div>
                            <div class="ranking-item">
                                <span class="rank">4º</span>
                                <span class="name">Carlos Silva</span>
                                <span class="points">1050 pts</span>
                                <span class="badge gold">Ouro</span>
                            </div>
                        </div>
                    </div>
                    
                    <div class="card">
                        <div class="card-header">
                            <h3><i class="fas fa-chart-area"></i> Evolução no Ranking</h3>
                        </div>
                        <div class="card-body">
                            <div class="evolution-item">
                                <span class="month">Janeiro</span>
                                <span class="position">8º lugar</span>
                                <span class="change down">-2</span>
                            </div>
                            <div class="evolution-item">
                                <span class="month">Fevereiro</span>
                                <span class="position">6º lugar</span>
                                <span class="change up">+2</span>
                            </div>
                            <div class="evolution-item">
                                <span class="month">Março</span>
                                <span class="position">7º lugar</span>
                                <span class="change down">-1</span>
                            </div>
                            <div class="evolution-item current">
                                <span class="month">Abril</span>
                                <span class="position">5º lugar</span>
                                <span class="change up">+2</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
    
    // ===== PRESENÇAS CONTENT =====
    function getPresencaContent(userData, student) {
        return `
            <div class="dashboard-section">
                <div class="section-header">
                    <h2><i class="fas fa-calendar-check"></i> Minhas Presenças</h2>
                    <p>Acompanhe sua frequência e histórico de aulas</p>
                </div>
                
                <div class="stats-grid">
                    <div class="stat-card primary">
                        <div class="stat-icon"><i class="fas fa-percentage"></i></div>
                        <div class="stat-content">
                            <h3>95%</h3>
                            <p>Frequência Geral</p>
                        </div>
                    </div>
                    <div class="stat-card success">
                        <div class="stat-icon"><i class="fas fa-check-circle"></i></div>
                        <div class="stat-content">
                            <h3>38</h3>
                            <p>Aulas Assistidas</p>
                        </div>
                    </div>
                    <div class="stat-card warning">
                        <div class="stat-icon"><i class="fas fa-times-circle"></i></div>
                        <div class="stat-content">
                            <h3>2</h3>
                            <p>Faltas</p>
                        </div>
                    </div>
                    <div class="stat-card info">
                        <div class="stat-icon"><i class="fas fa-fire"></i></div>
                        <div class="stat-content">
                            <h3>7</h3>
                            <p>Dias Consecutivos</p>
                        </div>
                    </div>
                </div>
                
                <div class="content-grid">
                    <div class="card">
                        <div class="card-header">
                            <h3><i class="fas fa-calendar-alt"></i> Últimas Aulas</h3>
                        </div>
                        <div class="card-body">
                            <div class="attendance-item present">
                                <div class="date">21/07/2025</div>
                                <div class="class-info">
                                    <h4>Conversation Practice</h4>
                                    <p>18:00 - 19:00</p>
                                </div>
                                <div class="status present">Presente</div>
                            </div>
                            <div class="attendance-item present">
                                <div class="date">19/07/2025</div>
                                <div class="class-info">
                                    <h4>Grammar Focus</h4>
                                    <p>18:00 - 19:00</p>
                                </div>
                                <div class="status present">Presente</div>
                            </div>
                            <div class="attendance-item present">
                                <div class="date">17/07/2025</div>
                                <div class="class-info">
                                    <h4>Vocabulary Building</h4>
                                    <p>18:00 - 19:00</p>
                                </div>
                                <div class="status present">Presente</div>
                            </div>
                            <div class="attendance-item absent">
                                <div class="date">15/07/2025</div>
                                <div class="class-info">
                                    <h4>Reading Comprehension</h4>
                                    <p>18:00 - 19:00</p>
                                </div>
                                <div class="status absent">Ausente</div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="card">
                        <div class="card-header">
                            <h3><i class="fas fa-chart-pie"></i> Frequência por Mês</h3>
                        </div>
                        <div class="card-body">
                            <div class="frequency-item">
                                <span class="month">Janeiro</span>
                                <div class="frequency-bar">
                                    <div class="fill" style="width: 90%"></div>
                                </div>
                                <span class="percentage">90%</span>
                            </div>
                            <div class="frequency-item">
                                <span class="month">Fevereiro</span>
                                <div class="frequency-bar">
                                    <div class="fill" style="width: 88%"></div>
                                </div>
                                <span class="percentage">88%</span>
                            </div>
                            <div class="frequency-item">
                                <span class="month">Março</span>
                                <div class="frequency-bar">
                                    <div class="fill" style="width: 92%"></div>
                                </div>
                                <span class="percentage">92%</span>
                            </div>
                            <div class="frequency-item current">
                                <span class="month">Abril</span>
                                <div class="frequency-bar">
                                    <div class="fill" style="width: 95%"></div>
                                </div>
                                <span class="percentage">95%</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
    
    // ===== TAREFAS CONTENT =====
    function getTarefasContent(userData, student) {
        return `
            <div class="dashboard-section">
                <div class="section-header">
                    <h2><i class="fas fa-tasks"></i> Minhas Tarefas</h2>
                    <p>Gerencie suas atividades e acompanhe o progresso</p>
                </div>
                
                <div class="stats-grid">
                    <div class="stat-card success">
                        <div class="stat-icon"><i class="fas fa-check-circle"></i></div>
                        <div class="stat-content">
                            <h3>24</h3>
                            <p>Concluídas</p>
                        </div>
                    </div>
                    <div class="stat-card warning">
                        <div class="stat-icon"><i class="fas fa-clock"></i></div>
                        <div class="stat-content">
                            <h3>3</h3>
                            <p>Pendentes</p>
                        </div>
                    </div>
                    <div class="stat-card info">
                        <div class="stat-icon"><i class="fas fa-calendar-day"></i></div>
                        <div class="stat-content">
                            <h3>1</h3>
                            <p>Para Hoje</p>
                        </div>
                    </div>
                    <div class="stat-card primary">
                        <div class="stat-icon"><i class="fas fa-star"></i></div>
                        <div class="stat-content">
                            <h3>89%</h3>
                            <p>Taxa de Conclusão</p>
                        </div>
                    </div>
                </div>
                
                <div class="content-grid">
                    <div class="card">
                        <div class="card-header">
                            <h3><i class="fas fa-list-ul"></i> Tarefas Pendentes</h3>
                        </div>
                        <div class="card-body">
                            <div class="task-item urgent">
                                <div class="task-info">
                                    <h4>Grammar Exercise - Unit 6</h4>
                                    <p>Complete exercises 1-15</p>
                                    <small>Vence hoje</small>
                                </div>
                                <div class="task-actions">
                                    <button class="btn btn-sm btn-primary">Fazer Agora</button>
                                </div>
                            </div>
                            <div class="task-item normal">
                                <div class="task-info">
                                    <h4>Reading Comprehension</h4>
                                    <p>Read text and answer questions</p>
                                    <small>Vence em 2 dias</small>
                                </div>
                                <div class="task-actions">
                                    <button class="btn btn-sm btn-outline-primary">Ver Detalhes</button>
                                </div>
                            </div>
                            <div class="task-item normal">
                                <div class="task-info">
                                    <h4>Vocabulary Quiz</h4>
                                    <p>Weekly vocabulary test</p>
                                    <small>Vence em 5 dias</small>
                                </div>
                                <div class="task-actions">
                                    <button class="btn btn-sm btn-outline-primary">Ver Detalhes</button>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="card">
                        <div class="card-header">
                            <h3><i class="fas fa-check-double"></i> Últimas Concluídas</h3>
                        </div>
                        <div class="card-body">
                            <div class="task-item completed">
                                <div class="task-info">
                                    <h4>Speaking Practice</h4>
                                    <p>Record 5-minute conversation</p>
                                    <small>Concluída há 1 dia</small>
                                </div>
                                <div class="task-score">
                                    <span class="score">95%</span>
                                </div>
                            </div>
                            <div class="task-item completed">
                                <div class="task-info">
                                    <h4>Listening Exercise</h4>
                                    <p>Audio comprehension test</p>
                                    <small>Concluída há 3 dias</small>
                                </div>
                                <div class="task-score">
                                    <span class="score">88%</span>
                                </div>
                            </div>
                            <div class="task-item completed">
                                <div class="task-info">
                                    <h4>Grammar Unit 5</h4>
                                    <p>Past perfect exercises</p>
                                    <small>Concluída há 5 dias</small>
                                </div>
                                <div class="task-score">
                                    <span class="score">92%</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
    
    // ===== FINANCEIRO CONTENT =====
    function getFinanceiroContent(userData, student) {
        return `
            <div class="dashboard-section">
                <div class="section-header">
                    <h2><i class="fas fa-credit-card"></i> Área Financeira</h2>
                    <p>Acompanhe suas mensalidades e histórico de pagamentos</p>
                </div>
                
                <div class="stats-grid">
                    <div class="stat-card success">
                        <div class="stat-icon"><i class="fas fa-check-circle"></i></div>
                        <div class="stat-content">
                            <h3>Em Dia</h3>
                            <p>Status Atual</p>
                        </div>
                    </div>
                    <div class="stat-card info">
                        <div class="stat-icon"><i class="fas fa-calendar-alt"></i></div>
                        <div class="stat-content">
                            <h3>25/07</h3>
                            <p>Próximo Vencimento</p>
                        </div>
                    </div>
                    <div class="stat-card primary">
                        <div class="stat-icon"><i class="fas fa-money-bill-wave"></i></div>
                        <div class="stat-content">
                            <h3>R$ 450</h3>
                            <p>Mensalidade</p>
                        </div>
                    </div>
                    <div class="stat-card warning">
                        <div class="stat-icon"><i class="fas fa-clock"></i></div>
                        <div class="stat-content">
                            <h3>4 dias</h3>
                            <p>Para Vencimento</p>
                        </div>
                    </div>
                </div>
                
                <div class="content-grid">
                    <div class="card">
                        <div class="card-header">
                            <h3><i class="fas fa-file-invoice-dollar"></i> Mensalidades</h3>
                        </div>
                        <div class="card-body">
                            <div class="payment-item current">
                                <div class="payment-info">
                                    <h4>Julho 2025</h4>
                                    <p>Vencimento: 25/07/2025</p>
                                </div>
                                <div class="payment-amount">R$ 450,00</div>
                                <div class="payment-status pending">Pendente</div>
                                <div class="payment-actions">
                                    <button class="btn btn-sm btn-primary">Pagar</button>
                                </div>
                            </div>
                            <div class="payment-item paid">
                                <div class="payment-info">
                                    <h4>Junho 2025</h4>
                                    <p>Pago em: 20/06/2025</p>
                                </div>
                                <div class="payment-amount">R$ 450,00</div>
                                <div class="payment-status paid">Pago</div>
                            </div>
                            <div class="payment-item paid">
                                <div class="payment-info">
                                    <h4>Maio 2025</h4>
                                    <p>Pago em: 18/05/2025</p>
                                </div>
                                <div class="payment-amount">R$ 450,00</div>
                                <div class="payment-status paid">Pago</div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="card">
                        <div class="card-header">
                            <h3><i class="fas fa-chart-line"></i> Histórico de Pagamentos</h3>
                        </div>
                        <div class="card-body">
                            <div class="payment-summary">
                                <div class="summary-item">
                                    <span class="label">Total Pago em 2025:</span>
                                    <span class="value">R$ 2.700,00</span>
                                </div>
                                <div class="summary-item">
                                    <span class="label">Média de Atraso:</span>
                                    <span class="value">0 dias</span>
                                </div>
                                <div class="summary-item">
                                    <span class="label">Pagamentos em Dia:</span>
                                    <span class="value">100%</span>
                                </div>
                            </div>
                            
                            <div class="payment-methods">
                                <h4>Formas de Pagamento</h4>
                                <div class="method-item">
                                    <i class="fas fa-credit-card"></i>
                                    <span>Cartão de Crédito</span>
                                </div>
                                <div class="method-item">
                                    <i class="fas fa-university"></i>
                                    <span>Transferência Bancária</span>
                                </div>
                                <div class="method-item">
                                    <i class="fas fa-barcode"></i>
                                    <span>Boleto Bancário</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
    
    // ===== PERFIL CONTENT =====
    function getPerfilContent(userData, student) {
        return `
            <div class="dashboard-section">
                <div class="section-header">
                    <h2><i class="fas fa-user-cog"></i> Meu Perfil</h2>
                    <p>Gerencie suas informações pessoais e preferências</p>
                </div>
                
                <div class="content-grid">
                    <div class="card">
                        <div class="card-header">
                            <h3><i class="fas fa-user-circle"></i> Informações Pessoais</h3>
                        </div>
                        <div class="card-body">
                            <div class="profile-section">
                                <div class="profile-avatar">${userData.name.charAt(0)}</div>
                                <div class="profile-info">
                                    <h3>${userData.name}</h3>
                                    <p class="email">${userData.email}</p>
                                    <p class="level">Nível: <strong>${student.level || 'Ouro'}</strong></p>
                                    <p class="points">Pontos: <strong>${student.totalPoints || 950}</strong></p>
                                </div>
                            </div>
                            
                            <div class="info-grid">
                                <div class="info-item">
                                    <label>Data de Matrícula:</label>
                                    <span>15/01/2025</span>
                                </div>
                                <div class="info-item">
                                    <label>Curso:</label>
                                    <span>Inglês Intermediário</span>
                                </div>
                                <div class="info-item">
                                    <label>Turma:</label>
                                    <span>Noturno B</span>
                                </div>
                                <div class="info-item">
                                    <label>Professor:</label>
                                    <span>Admin Sistema</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="card">
                        <div class="card-header">
                            <h3><i class="fas fa-cog"></i> Configurações</h3>
                        </div>
                        <div class="card-body">
                            <div class="settings-section">
                                <h4>Notificações</h4>
                                <div class="setting-item">
                                    <label class="switch">
                                        <input type="checkbox" checked>
                                        <span class="slider"></span>
                                    </label>
                                    <span>Email de lembretes</span>
                                </div>
                                <div class="setting-item">
                                    <label class="switch">
                                        <input type="checkbox" checked>
                                        <span class="slider"></span>
                                    </label>
                                    <span>Notificações de tarefas</span>
                                </div>
                                <div class="setting-item">
                                    <label class="switch">
                                        <input type="checkbox">
                                        <span class="slider"></span>
                                    </label>
                                    <span>SMS de vencimento</span>
                                </div>
                            </div>
                            
                            <div class="settings-section">
                                <h4>Preferências</h4>
                                <div class="setting-item">
                                    <label>Idioma da Interface:</label>
                                    <select class="form-control">
                                        <option>Português</option>
                                        <option>English</option>
                                    </select>
                                </div>
                                <div class="setting-item">
                                    <label>Tema:</label>
                                    <select class="form-control">
                                        <option>Claro</option>
                                        <option>Escuro</option>
                                    </select>
                                </div>
                            </div>
                            
                            <div class="profile-actions">
                                <button class="btn btn-primary">Salvar Alterações</button>
                                <button class="btn btn-outline-secondary">Alterar Senha</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
}

// ===== SISTEMA DE PROTEÇÃO CONTÍNUA =====
function setupContinuousProtection() {
    console.log('🛡️ Ativando proteção contínua...');
    
    // Verificar a cada 500ms se interface foi alterada
    setInterval(() => {
        if (localStorage.getItem('currentUserType') === 'aluno') {
            
            // Verificar se fundo está correto
            const bodyBg = window.getComputedStyle(document.body).backgroundColor;
            const isCorrectBg = bodyBg === 'rgb(248, 249, 250)' || bodyBg === 'rgba(248, 249, 250, 1)';
            
            // Verificar se tem logo
            const hasLogo = document.querySelector('.logo-speak') && document.querySelector('.logo-english');
            
            // Verificar se tem container
            const hasContainer = document.querySelector('.container');
            
            // Se qualquer verificação falhar, recriar interface
            if (!isCorrectBg || !hasLogo || !hasContainer) {
                console.log('🔄 Interface alterada detectada, restaurando...');
                createPersistentProfessorInterface();
                setupPersistentFunctions();
            }
        }
    }, 500);
    
    // Interceptar tentativas de mudança no body
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.type === 'childList' && localStorage.getItem('currentUserType') === 'aluno') {
                
                // Se detectar interface azul sendo inserida, remover
                mutation.addedNodes.forEach((node) => {
                    if (node.nodeType === 1) { // Element node
                        
                        // Remover qualquer div com fundo azul
                        if (node.style && node.style.background && node.style.background.includes('667eea')) {
                            console.log('🚫 Interface azul bloqueada!');
                            node.remove();
                        }
                        
                        // Remover divs com classe student-interface
                        if (node.classList && node.classList.contains('student-interface')) {
                            console.log('🚫 student-interface bloqueada!');
                            node.remove();
                        }
                    }
                });
            }
        });
    });
    
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
    
    console.log('✅ Proteção contínua ativada!');
}

// ===== COMANDOS GLOBAIS =====
window.persistentInterface = {
    create: createPersistentProfessorInterface,
    protect: setupContinuousProtection,
    
    force: function() {
        console.log('🛡️ FORÇANDO interface persistente...');
        createPersistentProfessorInterface();
        setupPersistentFunctions();
        setupContinuousProtection();
        console.log('✅ Interface persistente ATIVA!');
    }
};

// ===== AUTO-EXECUÇÃO ROBUSTA =====
(function autoSetupPersistent() {
    if (localStorage.getItem('currentUserType') === 'aluno') {
        console.log('🛡️ Aluno detectado - configurando interface persistente...');
        
        // Executar após todos os outros scripts
        setTimeout(() => {
            createPersistentProfessorInterface();
            setupPersistentFunctions();
            setupContinuousProtection();
        }, 1000); // 1 segundo de delay para ser o último
        
        // Executar também após carregamento completo
        window.addEventListener('load', () => {
            setTimeout(() => {
                createPersistentProfessorInterface();
                setupPersistentFunctions();
            }, 500);
        });
    }
})();

console.log('🛡️ Interface PERSISTENTE carregada!');
console.log('⚡ Use persistentInterface.force() para forçar proteção');
console.log('🔄 Monitora e protege contra sobrescritas automaticamente!'); 