console.log('🔧 Corrigindo navegação entre abas...');

// ===== CORREÇÃO DA NAVEGAÇÃO ENTRE ABAS =====
function fixTabNavigation() {
    // Sobrescrever a função showTabPersistent
    window.showTabPersistent = function(tabName) {
        console.log(`🔄 Navegando para aba: ${tabName}`);
        
        // Atualizar botões ativos
        document.querySelectorAll('.tab').forEach(btn => {
            btn.classList.remove('active');
        });
        const activeBtn = document.getElementById(`persistent-tab-${tabName}`);
        if (activeBtn) activeBtn.classList.add('active');
        
        const content = document.getElementById('persistent-content');
        if (!content) return;
        
        // RESTAURAR DASHBOARD COMPLETO
        if (tabName === 'dashboard') {
            const userData = JSON.parse(localStorage.getItem('currentUserData') || '{"name":"João Silva"}');
            const student = userData.student || { level: 'Ouro', totalPoints: 950 };
            
            content.innerHTML = `
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
            `;
            
            console.log('✅ Dashboard restaurado!');
            
        } else {
            // Conteúdo para outras abas
            content.innerHTML = `
                <div class="dashboard-section">
                    <div class="section-header">
                        <h2><i class="fas fa-${getTabIcon(tabName)}"></i> ${getTabTitle(tabName)}</h2>
                        <p>Seção em desenvolvimento</p>
                    </div>
                    <div class="card">
                        <div class="card-body">
                            <div class="empty-state" style="text-align: center; padding: 40px;">
                                <i class="fas fa-${getTabIcon(tabName)}" style="font-size: 3em; color: #4169E1; margin-bottom: 15px;"></i>
                                <h3>${getTabTitle(tabName)}</h3>
                                <p>Em breve você poderá acessar esta seção!</p>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            
            console.log(`✅ Aba ${tabName} carregada!`);
        }
    };
    
    // Funções auxiliares
    function getTabIcon(tab) {
        const icons = {
            rankings: 'trophy',
            presenca: 'calendar-check',
            tarefas: 'tasks',
            financeiro: 'credit-card',
            perfil: 'user-cog'
        };
        return icons[tab] || 'cog';
    }
    
    function getTabTitle(tab) {
        const titles = {
            rankings: 'Rankings',
            presenca: 'Minhas Presenças',
            tarefas: 'Minhas Tarefas',
            financeiro: 'Área Financeira',
            perfil: 'Meu Perfil'
        };
        return titles[tab] || 'Seção';
    }
    
    console.log('✅ Navegação entre abas corrigida!');
}

// ===== APLICAR CORREÇÃO =====
if (localStorage.getItem('currentUserType') === 'aluno') {
    // Aplicar após interface carregar
    setTimeout(() => {
        fixTabNavigation();
    }, 2000);
    
    // Verificar se precisa corrigir
    setInterval(() => {
        if (typeof window.showTabPersistent !== 'function') {
            fixTabNavigation();
        }
    }, 5000);
}

// Comando manual
window.fixTabNavigation = fixTabNavigation;

console.log('🔧 Fix Tab Navigation carregado!'); 