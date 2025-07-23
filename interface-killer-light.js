console.log('🔥 INTERFACE KILLER LIGHT: Apenas remove azuis, preserva cores naturais');

// ===== KILLER LEVE DE INTERFACES AZUIS =====
function killBlueInterfacesLight() {
    console.log('🔥 Removendo APENAS interfaces azuis...');
    
    // Remover elementos com gradiente azul específico
    const blueElements = document.querySelectorAll('[style*="background: linear-gradient(135deg, #667eea"]');
    blueElements.forEach(el => {
        console.log('🗑️ Removendo elemento azul:', el);
        el.remove();
    });
    
    // Remover divs student-interface antigas
    const studentInterfaces = document.querySelectorAll('.student-interface');
    studentInterfaces.forEach(el => {
        console.log('🗑️ Removendo .student-interface:', el);
        el.remove();
    });
    
    console.log('✅ Limpeza leve concluída!');
}

// ===== CSS MÍNIMO - SEM FORÇAR CORES =====
function applyMinimalCSS() {
    console.log('🎨 Aplicando CSS mínimo...');
    
    const style = document.createElement('style');
    style.innerHTML = `
        /* APENAS esconder interfaces azuis - SEM forçar outras cores */
        .student-interface,
        [style*="background: linear-gradient(135deg, #667eea"],
        [style*="background: linear-gradient(135deg, #4f46e5"] {
            display: none !important;
        }
        
        /* Fundo body apenas */
        body {
            background-color: #f8f9fa !important;
        }
        
        /* DEIXAR TODOS OS OUTROS ELEMENTOS USAREM styles.css NATURALMENTE */
    `;
    document.head.appendChild(style);
    
    console.log('✅ CSS mínimo aplicado!');
}

// ===== MONITORAMENTO LEVE =====
function setupLightMonitoring() {
    console.log('👁️ Ativando monitoramento LEVE...');
    
    // Observer apenas para elementos azuis
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (localStorage.getItem('currentUserType') === 'aluno') {
                mutation.addedNodes.forEach((node) => {
                    if (node.nodeType === 1) {
                        
                        // Matar APENAS elementos azuis
                        if (node.style && node.style.background && 
                           node.style.background.includes('linear-gradient(135deg, #667eea')) {
                            console.log('💀 Removendo elemento azul:', node);
                            node.remove();
                        }
                        
                        // Matar APENAS divs student-interface
                        if (node.classList && node.classList.contains('student-interface')) {
                            console.log('💀 Removendo .student-interface:', node);
                            node.remove();
                        }
                    }
                });
            }
        });
    });
    
    observer.observe(document.documentElement, {
        childList: true,
        subtree: true
    });
    
    console.log('✅ Monitoramento leve ativado!');
}

// ===== COMANDOS GLOBAIS =====
window.interfaceKillerLight = {
    kill: killBlueInterfacesLight,
    css: applyMinimalCSS,
    monitor: setupLightMonitoring,
    
    activate: function() {
        console.log('🔥 ATIVANDO KILLER LIGHT...');
        killBlueInterfacesLight();
        applyMinimalCSS();
        setupLightMonitoring();
        console.log('✅ KILLER LIGHT ativo - cores naturais preservadas!');
    }
};

// ===== AUTO-EXECUÇÃO PARA ALUNOS =====
if (localStorage.getItem('currentUserType') === 'aluno') {
    console.log('👨‍🎓 Aluno detectado - ativando killer LIGHT...');
    
    setTimeout(() => {
        interfaceKillerLight.activate();
    }, 100);
}

console.log('🔥 INTERFACE KILLER LIGHT carregado!'); 