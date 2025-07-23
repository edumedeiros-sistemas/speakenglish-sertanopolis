// MODO SILENCIOSO - Remove toda poluição de debug
(function() {
    'use strict';
    
    // ===== DESABILITAR CONSOLE LOGS DE DEBUG =====
    const originalConsoleLog = console.log;
    const originalConsoleWarn = console.warn;
    const originalConsoleError = console.error;
    
    console.log = function(...args) {
        const message = args.join(' ');
        
        // Lista de palavras-chave de debug para filtrar
        const debugKeywords = [
            '===', '🔧', '✅', '❌', '🔍', '🎯', '💾', '📊', '🛡️', 
            '🔥', '👁️', '🧹', '🎨', '⚡', '💀', '🚫', '⚪', '👨‍🎓',
            'Aluno detectado', 'Interface detectada', 'Aplicando', 
            'Verificando', 'Carregando', 'Criando', 'Ativando',
            'DEBUG', 'TESTE', 'CORRIGINDO', 'INTERCEPTANDO',
            'OBLITERANDO', 'MATANDO', 'KILLER', 'NUKE'
        ];
        
        const isDebugMessage = debugKeywords.some(keyword => 
            message.includes(keyword)
        );
        
        // Apenas permitir logs importantes do sistema
        if (!isDebugMessage) {
            originalConsoleLog.apply(console, args);
        }
    };
    
    // ===== REMOVER ELEMENTOS DE DEBUG DA INTERFACE =====
    function removeDebugElements() {
        // Textos de debug para remover
        const debugTexts = [
            'INTERFACE FUNCIONANDO',
            'Fundo branco ativado',
            'Logo SpeakEnglish carregada',
            'Layout idêntico ao professor',
            'Interface protegida',
            'SISTEMA COMPLETAMENTE CORRIGIDO',
            'Verificação de integridade',
            'DEBUG', 'TESTE'
        ];
        
        debugTexts.forEach(text => {
            const walker = document.createTreeWalker(
                document.body,
                NodeFilter.SHOW_TEXT,
                null,
                false
            );
            
            const textNodes = [];
            let node;
            while (node = walker.nextNode()) {
                if (node.textContent.includes(text)) {
                    textNodes.push(node);
                }
            }
            
            textNodes.forEach(textNode => {
                const parent = textNode.parentElement;
                if (parent) {
                    parent.remove();
                }
            });
        });
    }
    
    // ===== LIMPAR INTERVALOS EXCESSIVOS =====
    function cleanExcessiveIntervals() {
        // Sobrescrever setInterval para evitar intervals de debug excessivos
        const originalSetInterval = window.setInterval;
        const intervals = [];
        
        window.setInterval = function(callback, delay) {
            // Limitar intervals muito frequentes (menos de 1 segundo)
            if (delay < 1000) {
                delay = Math.max(delay, 2000); // Mínimo 2 segundos
            }
            
            const intervalId = originalSetInterval(callback, delay);
            intervals.push(intervalId);
            
            // Limitar número total de intervals
            if (intervals.length > 10) {
                const oldInterval = intervals.shift();
                clearInterval(oldInterval);
            }
            
            return intervalId;
        };
    }
    
    // ===== EXECUÇÃO =====
    if (localStorage.getItem('currentUserType') === 'aluno') {
        // Remover elementos de debug após carregar
        setTimeout(removeDebugElements, 2000);
        
        // Limpar intervals excessivos
        cleanExcessiveIntervals();
        
        // Aplicar limpeza periódica (mas silenciosa)
        setInterval(removeDebugElements, 10000);
    }
    
    // Log silencioso de ativação
    originalConsoleLog('Silent mode activated');
})(); 