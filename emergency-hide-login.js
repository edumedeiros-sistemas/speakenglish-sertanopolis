// EMERGENCY HIDE LOGIN - VERSÃO SILENCIOSA
function obliterateLoginElements() {
    const loginSelectors = [
        '.login-container',
        '.login-form',
        '.login-section',
        '#loginContainer',
        '#loginForm',
        '#loginSection',
        '.auth-container',
        '.auth-form'
    ];
    
    let hiddenCount = 0;
    
    loginSelectors.forEach(selector => {
        const elements = document.querySelectorAll(selector);
        elements.forEach(element => {
            // OBLITERAÇÃO TOTAL
            element.style.display = 'none';
            element.style.visibility = 'hidden';
            element.style.opacity = '0';
            element.style.height = '0';
            element.style.overflow = 'hidden';
            element.style.position = 'absolute';
            element.style.left = '-9999px';
            element.remove(); // REMOVER COMPLETAMENTE
            hiddenCount++;
        });
    });
    
    // Apenas log essencial (sem emoji)
    if (hiddenCount > 0) {
        console.log(`Login elements hidden: ${hiddenCount}`);
    }
}

// VERIFICAÇÃO SILENCIOSA
function checkAndHideLogin() {
    if (localStorage.getItem('currentUserType') === 'aluno') {
        obliterateLoginElements();
    }
}

// EXECUÇÃO SILENCIOSA
if (localStorage.getItem('currentUserType') === 'aluno') {
    // Execução imediata
    checkAndHideLogin();
    
    // Verificação contínua (reduzida)
    const interval = setInterval(() => {
        checkAndHideLogin();
    }, 5000); // A cada 5 segundos (menos frequente)
    
    // Parar após 30 segundos
    setTimeout(() => {
        clearInterval(interval);
    }, 30000);
} 