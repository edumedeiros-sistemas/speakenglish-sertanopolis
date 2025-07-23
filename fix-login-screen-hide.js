console.log('🔧 CORREÇÃO: Forçando ocultação da tela de login...');

// ===== FUNÇÃO ROBUSTA PARA OCULTAR TELA DE LOGIN =====
function forceHideLoginScreen() {
    console.log('🫥 Ocultando tela de login...');
    
    // Elementos que precisam ser ocultados
    const elementsToHide = [
        'loginScreen',           // Container principal
        'loginForm',            // Formulário
        'login-container',      // Classe alternativa
        'loginModal'            // Modal se existir
    ];
    
    elementsToHide.forEach(elementId => {
        // Por ID
        const element = document.getElementById(elementId);
        if (element) {
            element.style.display = 'none';
            element.style.visibility = 'hidden';
            element.style.opacity = '0';
            console.log(`✅ Elemento ocultado: ${elementId}`);
        }
        
        // Por classe
        const elementsByClass = document.querySelectorAll(`.${elementId}`);
        elementsByClass.forEach(el => {
            el.style.display = 'none';
            el.style.visibility = 'hidden';
            el.style.opacity = '0';
            console.log(`✅ Elemento por classe ocultado: ${elementId}`);
        });
    });
    
    console.log('✅ Tela de login completamente ocultada!');
}

// ===== INTERCEPTAR LOGIN BEM-SUCEDIDO =====
function interceptStudentLogin() {
    console.log('🎯 Interceptando login de aluno...');
    
    // Verificar se é aluno logado
    const userType = localStorage.getItem('currentUserType');
    if (userType === 'aluno') {
        console.log('👨‍🎓 Aluno detectado, forçando ocultação da tela de login...');
        forceHideLoginScreen();
        
        // Garantir que o main-content seja visível
        const mainContent = document.getElementById('main-content');
        if (mainContent) {
            mainContent.style.display = 'block';
            mainContent.style.visibility = 'visible';
            mainContent.style.opacity = '1';
            console.log('✅ main-content tornado visível');
        }
        
        // Se não houver main-content, garantir que o body seja limpo da tela de login
        const body = document.body;
        if (body && body.innerHTML.includes('login-container')) {
            console.log('🧹 Limpando restos da tela de login do body...');
            // Não vamos mexer no body diretamente, apenas ocultar
        }
    }
}

// ===== CORREÇÃO AUTOMÁTICA =====
function setupLoginHideFix() {
    console.log('⚙️  Configurando correção automática da tela de login...');
    
    // Executar imediatamente se já for aluno
    interceptStudentLogin();
    
    // Observer para mudanças no localStorage
    const originalSetItem = localStorage.setItem;
    localStorage.setItem = function(key, value) {
        originalSetItem.apply(this, arguments);
        
        if (key === 'currentUserType' && value === 'aluno') {
            console.log('🔄 Login de aluno detectado via localStorage!');
            setTimeout(() => {
                forceHideLoginScreen();
                interceptStudentLogin();
            }, 100);
        }
    };
    
    // Verificar periodicamente
    setInterval(() => {
        const userType = localStorage.getItem('currentUserType');
        if (userType === 'aluno') {
            const loginScreen = document.getElementById('loginScreen');
            if (loginScreen && loginScreen.style.display !== 'none') {
                console.log('🔄 Tela de login ainda visível, corrigindo...');
                forceHideLoginScreen();
            }
        }
    }, 1000);
    
    console.log('✅ Correção automática configurada!');
}

// ===== CORREÇÃO PARA INTERFACE DO ALUNO =====
const originalShowStudentInterface = window.showStudentInterface;
if (typeof originalShowStudentInterface === 'function') {
    window.showStudentInterface = function(...args) {
        console.log('🎯 Interceptando showStudentInterface...');
        
        // Ocultar tela de login ANTES de mostrar interface
        forceHideLoginScreen();
        
        // Chamar função original
        const result = originalShowStudentInterface.apply(this, args);
        
        // Garantir que ficou ocultada DEPOIS também
        setTimeout(() => {
            forceHideLoginScreen();
        }, 100);
        
        return result;
    };
    console.log('✅ showStudentInterface interceptada e corrigida!');
}

// ===== EXECUÇÃO AUTOMÁTICA =====
// Executar imediatamente
setupLoginHideFix();

// Executar quando DOM estiver pronto
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setupLoginHideFix);
} else {
    setupLoginHideFix();
}

// Executar quando página carregar completamente
window.addEventListener('load', setupLoginHideFix);

// Comandos para debug manual
window.loginHideFix = {
    hide: forceHideLoginScreen,
    intercept: interceptStudentLogin,
    setup: setupLoginHideFix
};

console.log('🚀 Correção de ocultação da tela de login carregada!');
console.log('💡 Comandos disponíveis: loginHideFix.hide(), loginHideFix.intercept()'); 