// INTEGRAÇÃO PERMANENTE DO LOGIN COM SUPABASE
// Autor: Sistema SpeakEnglish
// Data: Janeiro 2025

console.log('🔐 Carregando integração de login com Supabase...');

(function loginIntegrationSupabase() {
    'use strict';
    
    // Aguardar DOM e Supabase estarem prontos
    function initLoginIntegration() {
        console.log('🚀 Inicializando integração de login...');
        
        // Verificar se Supabase está disponível
        if (typeof supabase === 'undefined') {
            console.log('⏳ Aguardando Supabase...');
            setTimeout(initLoginIntegration, 1000);
            return;
        }
        
        // Função de login integrada com Supabase
        window.loginSupabase = async function(email, password, userType = 'aluno') {
            console.log(`🔐 Tentando login: ${email} como ${userType}`);
            
            try {
                // Login Professor
                if (userType === 'professor' || email === 'admin') {
                    if ((email === 'admin' && password === '1234') || 
                        (email === 'amanda@school.com' && password === 'admin123')) {
                        
                        localStorage.setItem('currentUser', email);
                        localStorage.setItem('currentUserType', 'professor');
                        
                        document.getElementById('loginScreen').style.display = 'none';
                        document.getElementById('mainInterface').style.display = 'block';
                        
                        console.log('✅ Login professor realizado com sucesso');
                        return true;
                    }
                } else {
                    // Login Aluno - Verificar no Supabase
                    const { data: students, error } = await supabase
                        .from('students')
                        .select('*')
                        .eq('email', email);
                    
                    if (error) {
                        console.error('❌ Erro ao consultar Supabase:', error);
                        throw error;
                    }
                    
                    if (students && students.length > 0) {
                        const student = students[0];
                        
                        // Verificar senha (aceita 123456 ou senha específica)
                        if (password === '123456' || password === student.password) {
                            
                            // Salvar dados do aluno no localStorage
                            localStorage.setItem('currentUser', student.name);
                            localStorage.setItem('currentUserEmail', student.email);
                            localStorage.setItem('currentUserType', 'aluno');
                            localStorage.setItem('currentStudentId', student.id);
                            
                            // Ocultar tela de login e mostrar sistema
                            document.getElementById('loginScreen').style.display = 'none';
                            document.getElementById('mainInterface').style.display = 'block';
                            
                            console.log('✅ Login aluno realizado:', student.name);
                            
                            // Carregar dados específicos do aluno
                            if (typeof loadStudentData === 'function') {
                                loadStudentData(student);
                            }
                            
                            return true;
                        } else {
                            console.log('❌ Senha incorreta para:', email);
                        }
                    } else {
                        console.log('❌ Aluno não encontrado:', email);
                    }
                }
                
                // Login falhou
                console.log('❌ Falha na autenticação');
                
                // Mostrar erro na interface
                const errorElement = document.getElementById('loginError');
                if (errorElement) {
                    errorElement.style.display = 'block';
                    setTimeout(() => {
                        errorElement.style.display = 'none';
                    }, 3000);
                }
                
                return false;
                
            } catch (error) {
                console.error('❌ Erro no processo de login:', error);
                alert('Erro na conexão com o servidor. Tente novamente.');
                return false;
            }
        };
        
        // Sobrescrever função login original (se existir)
        window.login = window.loginSupabase;
        
        // Interceptar formulário de login
        function setupFormInterception() {
            const loginForm = document.getElementById('loginForm');
            if (loginForm) {
                // Remover listeners existentes clonando o elemento
                const newForm = loginForm.cloneNode(true);
                loginForm.parentNode.replaceChild(newForm, loginForm);
                
                // Adicionar novo listener
                const currentForm = document.getElementById('loginForm');
                currentForm.addEventListener('submit', async function(e) {
                    e.preventDefault();
                    e.stopImmediatePropagation();
                    
                    console.log('📋 Formulário de login submetido');
                    
                    // Obter valores dos campos
                    const emailInput = document.getElementById('loginUser');
                    const passwordInput = document.getElementById('loginPassword');
                    
                    if (!emailInput || !passwordInput) {
                        console.error('❌ Campos de login não encontrados');
                        return;
                    }
                    
                    const email = emailInput.value.trim();
                    const password = passwordInput.value;
                    
                    if (!email || !password) {
                        alert('Por favor, preencha email e senha.');
                        return;
                    }
                    
                    console.log(`📧 Tentativa de login para: ${email}`);
                    
                    // Executar login
                    await loginSupabase(email, password);
                }, true);
                
                console.log('✅ Formulário de login interceptado com sucesso');
            } else {
                console.log('⚠️ Formulário de login não encontrado, tentando novamente...');
                setTimeout(setupFormInterception, 500);
            }
        }
        
        // Configurar interceptação
        setupFormInterception();
        
        console.log('🎉 Integração de login configurada com sucesso!');
    }
    
    // Inicializar quando DOM estiver pronto
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initLoginIntegration);
    } else {
        initLoginIntegration();
    }
    
})();

// Função auxiliar para carregar dados específicos do aluno
window.loadStudentData = function(student) {
    console.log('📊 Carregando dados específicos do aluno:', student.name);
    
    // Atualizar título da página
    document.title = `SpeakEnglish - ${student.name}`;
    
    // Atualizar elementos da interface com nome do aluno
    const userElements = document.querySelectorAll('.user-name, #userName, .current-user');
    userElements.forEach(element => {
        element.textContent = student.name;
    });
    
    // Disparar evento personalizado para outros módulos
    const studentLoginEvent = new CustomEvent('studentLogin', {
        detail: { student: student }
    });
    document.dispatchEvent(studentLoginEvent);
};

console.log('🔐 Arquivo de integração de login carregado!'); 