// ==================== PARAR INTERFERÊNCIAS DE REFRESH ====================

console.log('🛑 Parando todas as verificações que causam refresh...');

// Função global para parar interferências
window.stopRefreshInterference = function() {
    console.log('🛑 === PARANDO TODAS AS INTERFERÊNCIAS ===');
    
    // Parar todos os intervalos ativos (força bruta)
    for (let i = 1; i < 99999; i++) {
        clearInterval(i);
        clearTimeout(i);
    }
    
    // Redefinir função de auto-correção para ser passiva
    if (typeof ensureSearchFieldExists === 'function') {
        window.ensureSearchFieldExists = function() {
            console.log('✅ Auto-correção desabilitada para preservar seleções');
        };
    }
    
    // Parar verificações do reports-autocorrect
    if (typeof startIntelligentChecks === 'function') {
        window.startIntelligentChecks = function() {
            console.log('✅ Verificações inteligentes pausadas');
        };
    }
    
    // Redefinir função de interceptação
    if (typeof window.showReportsTab === 'function') {
        const originalShowReportsTab = window.showReportsTab;
        window.showReportsTab = function(tabType) {
            const result = originalShowReportsTab.apply(this, arguments);
            // NÃO executar auto-correções após mudança de aba
            console.log(`📋 Mudança para aba ${tabType} sem interferências`);
            return result;
        };
    }
    
    console.log('✅ Todas as interferências foram paradas!');
    console.log('🎯 Seleções de aluno devem permanecer estáveis agora');
};

// Função para reativar verificações (com cuidado)
window.restartSmartChecks = function() {
    console.log('🔄 Reativando verificações inteligentes...');
    
    // Verificação única e cuidadosa
    setTimeout(() => {
        const searchInput = document.getElementById('reportsStudentSearchInput');
        const hasSelection = typeof getSelectedReportsStudentEmail === 'function' && getSelectedReportsStudentEmail();
        
        if (!searchInput && !hasSelection) {
            console.log('📦 Campo não existe e sem seleção, criando...');
            if (typeof intelligentAutoCorrect === 'function') {
                intelligentAutoCorrect();
            }
        } else {
            console.log('✅ Campo existe ou há seleção ativa, não interferindo');
        }
    }, 2000);
};

// Executar imediatamente
stopRefreshInterference();

console.log('🛑 Sistema de parada de interferências ativo!'); 