// ==================== SISTEMA ESTÁVEL DE RELATÓRIOS ====================

console.log('✅ Sistema estável de relatórios carregado!');

// Variável global para controlar estado de seleção
window.reportsSelectionActive = false;
window.lastSelectedStudent = null;

// Função para marcar seleção como ativa
window.markReportsSelectionActive = function(studentEmail, studentName) {
    window.reportsSelectionActive = true;
    window.lastSelectedStudent = { email: studentEmail, name: studentName };
    console.log(`🔒 Seleção marcada como ativa: ${studentName}`);
    
    // Parar todas as verificações automáticas por 60 segundos
    if (typeof stopRefreshInterference === 'function') {
        stopRefreshInterference();
    }
    
    // Reativar verificações apenas após período de inatividade
    setTimeout(() => {
        if (window.reportsSelectionActive) {
            console.log('🔄 Verificando se seleção ainda está ativa...');
            const currentSelection = typeof getSelectedReportsStudentEmail === 'function' ? 
                                   getSelectedReportsStudentEmail() : '';
            
            if (!currentSelection) {
                console.log('🔓 Seleção não está mais ativa, liberando verificações');
                window.reportsSelectionActive = false;
                window.lastSelectedStudent = null;
            }
        }
    }, 60000); // 1 minuto
};

// Função para limpar seleção
window.clearReportsSelection = function() {
    window.reportsSelectionActive = false;
    window.lastSelectedStudent = null;
    console.log('🔓 Seleção de relatórios limpa');
};

// Interceptar função de seleção de aluno se existir
if (typeof selectReportsStudent === 'function') {
    const originalSelectReportsStudent = selectReportsStudent;
    window.selectReportsStudent = function(email, name) {
        console.log(`👤 Interceptando seleção: ${name}`);
        
        // Executar seleção original
        const result = originalSelectReportsStudent.apply(this, arguments);
        
        // Marcar como ativa
        markReportsSelectionActive(email, name);
        
        return result;
    };
}

// Interceptar função de limpeza se existir
if (typeof clearReportsStudentSelection === 'function') {
    const originalClearReportsStudentSelection = clearReportsStudentSelection;
    window.clearReportsStudentSelection = function() {
        console.log('🧹 Interceptando limpeza de seleção');
        
        // Executar limpeza original
        const result = originalClearReportsStudentSelection.apply(this, arguments);
        
        // Limpar estado
        clearReportsSelection();
        
        return result;
    };
}

// Verificação inteligente que respeita seleções ativas
function stableReportsCheck() {
    // Se há seleção ativa, NÃO fazer nada
    if (window.reportsSelectionActive) {
        console.log('🔒 Seleção ativa detectada, pulando verificação');
        return;
    }
    
    // Se não há seleção, verificar se campo existe
    const studentsTab = document.getElementById('studentReportsTab');
    const studentsContent = document.getElementById('studentReportsContent');
    
    if (studentsTab && studentsTab.classList.contains('active') && studentsContent) {
        const searchInput = studentsContent.querySelector('#reportsStudentSearchInput');
        
        if (!searchInput) {
            console.log('📦 Campo não existe e sem seleção ativa, criando...');
            if (typeof intelligentAutoCorrect === 'function') {
                intelligentAutoCorrect();
            }
        }
    }
}

// Verificação estável a cada 30 segundos (muito reduzida)
setInterval(stableReportsCheck, 30000);

// Monitorar mudanças de DOM para detectar quando seleção é perdida
const observer = new MutationObserver(function(mutations) {
    if (window.reportsSelectionActive) {
        mutations.forEach(function(mutation) {
            // Se o conteúdo foi completamente substituído, a seleção foi perdida
            if (mutation.type === 'childList' && mutation.removedNodes.length > 0) {
                const studentsContent = document.getElementById('studentReportsContent');
                if (studentsContent && !studentsContent.querySelector('#reportsStudentSearchInput')) {
                    console.log('⚠️ Conteúdo foi substituído, seleção pode ter sido perdida');
                    
                    // Verificar se realmente perdeu seleção
                    const currentSelection = typeof getSelectedReportsStudentEmail === 'function' ? 
                                           getSelectedReportsStudentEmail() : '';
                    
                    if (!currentSelection && window.lastSelectedStudent) {
                        console.log('🔄 Tentando restaurar seleção perdida...');
                        
                        // Tentar restaurar seleção após pequeno delay
                        setTimeout(() => {
                            if (typeof selectReportsStudent === 'function' && window.lastSelectedStudent) {
                                selectReportsStudent(window.lastSelectedStudent.email, window.lastSelectedStudent.name);
                            }
                        }, 500);
                    }
                }
            }
        });
    }
});

// Observar mudanças no container de relatórios
const studentsContent = document.getElementById('studentReportsContent');
if (studentsContent) {
    observer.observe(studentsContent, {
        childList: true,
        subtree: true
    });
}

console.log('✅ Sistema estável configurado - seleções serão preservadas!'); 