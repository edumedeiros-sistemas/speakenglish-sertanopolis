// ==================== AUTO-CORREÇÃO INTELIGENTE - SEM INTERFERÊNCIA ====================

console.log('🔧 Sistema de Auto-Correção Inteligente carregado!');

// Função principal de auto-correção que não interfere com seleções ativas
function intelligentAutoCorrect() {
    console.log('🔧 === AUTO-CORREÇÃO INTELIGENTE ===');
    
    // Verificar se estamos na aba de alunos
    const studentsTab = document.getElementById('studentReportsTab');
    const studentsContent = document.getElementById('studentReportsContent');
    
    if (!studentsTab || !studentsContent) {
        console.log('⏳ Aguardando elementos de relatórios...');
        return false;
    }
    
    // Verificar se a aba de alunos está ativa
    const isStudentsTabActive = studentsTab.classList.contains('active');
    
    if (isStudentsTabActive) {
        // Verificar se o campo existe
        const searchInput = studentsContent.querySelector('#reportsStudentSearchInput');
        
        if (!searchInput) {
            console.log('📦 Campo não existe, criando...');
            createSearchFieldInStudentsTab();
        } else {
            // IMPORTANTE: Se campo existe, verificar se tem valor/seleção ativa
            const hasValue = searchInput.value && searchInput.value.trim().length > 0;
            const hasSelection = typeof getSelectedReportsStudentEmail === 'function' && getSelectedReportsStudentEmail();
            
            if (hasValue || hasSelection) {
                console.log('✅ Campo existe e tem seleção ativa, NÃO interferindo');
                return true; // NÃO fazer nada para preservar seleção
            }
            
            console.log('✅ Campo existe mas sem seleção');
            
            // Verificar se a busca está inicializada apenas se não há seleção
            if (typeof initializeReportsStudentSearch === 'function') {
                initializeReportsStudentSearch();
            }
        }
    }
    
    return true;
}

// Função para criar campo especificamente na aba de alunos (sem afetar seleções)
function createSearchFieldInStudentsTab() {
    const studentsContent = document.getElementById('studentReportsContent');
    if (!studentsContent) return;
    
    // Verificar se já existe antes de recriar
    const existingField = studentsContent.querySelector('#reportsStudentSearchInput');
    if (existingField) {
        console.log('✅ Campo já existe, não recriando');
        return;
    }
    
    console.log('📦 Criando campo na aba de alunos...');
    
    // Limpar conteúdo atual e criar estrutura completa
    studentsContent.innerHTML = `
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
            <p class="text-muted" style="color: #6c757d;">Total de ${window.students ? window.students.length : 0} alunos disponíveis</p>
        </div>
    `;
    
    // Adicionar eventos visuais
    const searchInput = document.getElementById('reportsStudentSearchInput');
    if (searchInput) {
        searchInput.addEventListener('focus', function() {
            this.style.borderColor = '#007bff';
            this.style.boxShadow = '0 0 0 0.2rem rgba(0, 123, 255, 0.25)';
        });
        
        searchInput.addEventListener('blur', function() {
            this.style.borderColor = '#e1e5e9';
            this.style.boxShadow = 'none';
        });
        
        // Inicializar busca
        setTimeout(() => {
            if (typeof initializeReportsStudentSearch === 'function') {
                initializeReportsStudentSearch();
                console.log('✅ Auto-correção: Busca inicializada!');
            }
        }, 300);
        
        console.log('✅ Auto-correção: Campo criado com sucesso!');
    }
}

// Interceptar cliques na aba de alunos (sem verificações agressivas)
function interceptStudentsTabClick() {
    const studentsTab = document.getElementById('studentReportsTab');
    if (studentsTab) {
        studentsTab.addEventListener('click', function() {
            setTimeout(() => {
                intelligentAutoCorrect();
            }, 500);
        });
    }
}

// Interceptar função showReportsTab se existir (preservando seleções)
if (typeof window.showReportsTab === 'function') {
    const originalShowReportsTab = window.showReportsTab;
    window.showReportsTab = function(tabType) {
        const result = originalShowReportsTab.apply(this, arguments);
        
        if (tabType === 'students') {
            setTimeout(() => {
                intelligentAutoCorrect();
            }, 800);
        }
        
        return result;
    };
}

// Sistema de verificações REDUZIDO e INTELIGENTE
function startIntelligentChecks() {
    // Verificar apenas UMA VEZ inicialmente
    setTimeout(intelligentAutoCorrect, 1000);
    
    // Verificações periódicas MUITO REDUZIDAS e CONDICIONAIS
    const intelligentInterval = setInterval(() => {
        const studentsTab = document.getElementById('studentReportsTab');
        if (studentsTab && studentsTab.classList.contains('active')) {
            const studentsContent = document.getElementById('studentReportsContent');
            const searchInput = studentsContent ? studentsContent.querySelector('#reportsStudentSearchInput') : null;
            
            // SÓ interferir se campo realmente não existe E não há seleção ativa
            if (!searchInput) {
                console.log('🔧 Verificação inteligente: Campo não encontrado, criando...');
                intelligentAutoCorrect();
            } else {
                // Se campo existe, verificar se há seleção ativa
                const hasActiveSelection = typeof getSelectedReportsStudentEmail === 'function' && 
                                         getSelectedReportsStudentEmail();
                
                if (hasActiveSelection) {
                    console.log('✅ Seleção ativa detectada, NÃO interferindo');
                    // Limpar o intervalo para parar verificações enquanto há seleção
                    clearInterval(intelligentInterval);
                    
                    // Reativar verificações apenas após 30 segundos sem atividade
                    setTimeout(() => {
                        startIntelligentChecks();
                    }, 30000);
                }
            }
        }
    }, 10000); // Verificar apenas a cada 10 segundos (era 3 segundos)
}

// Inicializar quando DOM estiver pronto
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
        interceptStudentsTabClick();
        startIntelligentChecks();
    });
} else {
    interceptStudentsTabClick();
    startIntelligentChecks();
}

console.log('🔧 Auto-correção inteligente configurada (sem interferir com seleções)!'); 