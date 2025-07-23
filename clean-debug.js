console.log('🧹 CLEAN DEBUG: Removendo poluição visual do sistema');

// ===== REMOVER MENSAGENS DE DEBUG =====
function cleanDebugMessages() {
    console.log('🧹 Limpando mensagens de debug...');
    
    // Elementos com texto de debug específico
    const debugTexts = [
        'INTERFACE FUNCIONANDO',
        'Fundo branco ativado',
        'Logo SpeakEnglish carregada',
        'Layout idêntico ao professor',
        'Interface protegida contra sobrescrita',
        '=== SISTEMA COMPLETAMENTE CORRIGIDO ===',
        'Verificação de integridade',
        'DEBUG',
        'TESTE'
    ];
    
    debugTexts.forEach(text => {
        const elements = Array.from(document.querySelectorAll('*')).filter(el => 
            el.textContent && el.textContent.includes(text)
        );
        elements.forEach(el => {
            console.log(`🗑️ Removendo elemento com texto debug: "${text}"`);
            el.remove();
        });
    });
    
    // Remover cards com títulos de debug
    const debugCards = document.querySelectorAll('.card-header h3');
    debugCards.forEach(header => {
        if (header.textContent.includes('FUNCIONANDO') || 
            header.textContent.includes('DEBUG') ||
            header.textContent.includes('TESTE')) {
            console.log('🗑️ Removendo card de debug:', header.textContent);
            header.closest('.card').remove();
        }
    });
    
    console.log('✅ Mensagens de debug removidas!');
}

// ===== LIMPAR CONSOLE LOGS =====
function cleanConsoleLogs() {
    console.log('🧹 Desabilitando console logs excessivos...');
    
    // Sobrescrever console.log para filtrar mensagens de debug
    const originalConsoleLog = console.log;
    console.log = function(...args) {
        const message = args.join(' ');
        
        // Filtrar mensagens de debug específicas
        const debugKeywords = [
            '===',
            '🔧',
            '✅',
            '❌',
            '🔍',
            '🎯',
            '💾',
            '📊',
            '🛡️',
            '🔥',
            '👁️',
            'Aluno detectado',
            'Interface detectada',
            'Aplicando correção',
            'Verificando',
            'Carregando'
        ];
        
        const isDebugMessage = debugKeywords.some(keyword => 
            message.includes(keyword)
        );
        
        // Só exibir logs importantes (não de debug)
        if (!isDebugMessage) {
            originalConsoleLog.apply(console, args);
        }
    };
    
    console.log('✅ Console limpo!');
}

// ===== REMOVER ELEMENTOS VISUAIS DE DEBUG =====
function cleanVisualDebug() {
    console.log('🧹 Removendo elementos visuais de debug...');
    
    // Remover elementos com classes de debug
    const debugClasses = [
        '.debug-info',
        '.test-element',
        '.verification-status',
        '.system-status'
    ];
    
    debugClasses.forEach(className => {
        const elements = document.querySelectorAll(className);
        elements.forEach(el => {
            console.log(`🗑️ Removendo elemento debug: ${className}`);
            el.remove();
        });
    });
    
    // Remover elementos com IDs de debug
    const debugIds = [
        'debug-panel',
        'test-panel',
        'verification-panel',
        'status-panel'
    ];
    
    debugIds.forEach(id => {
        const element = document.getElementById(id);
        if (element) {
            console.log(`🗑️ Removendo elemento debug: #${id}`);
            element.remove();
        }
    });
    
    console.log('✅ Elementos visuais de debug removidos!');
}

// ===== FUNÇÃO PRINCIPAL =====
window.cleanDebug = {
    messages: cleanDebugMessages,
    console: cleanConsoleLogs,
    visual: cleanVisualDebug,
    
    all: function() {
        console.log('🧹 LIMPEZA TOTAL DO SISTEMA...');
        cleanDebugMessages();
        cleanVisualDebug();
        cleanConsoleLogs();
        console.log('✨ Sistema limpo! Sem poluição visual.');
    }
};

// ===== AUTO-EXECUÇÃO =====
if (localStorage.getItem('currentUserType') === 'aluno') {
    console.log('👨‍🎓 Aluno detectado - limpando sistema...');
    
    // Aguardar interface carregar e então limpar
    setTimeout(() => {
        cleanDebug.all();
    }, 3000);
}

console.log('🧹 CLEAN DEBUG carregado! Use cleanDebug.all() para limpeza total.'); 