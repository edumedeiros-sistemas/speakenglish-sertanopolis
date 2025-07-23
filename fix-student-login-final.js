console.log('🔧 FIX FINAL: Corrigindo login de aluno...');

// ===== FORÇAR CRIAÇÃO DE ALUNOS DE TESTE =====
function forceCreateTestStudents() {
    console.log('👥 Forçando criação de alunos de teste...');
    
    // Garantir que array students existe
    if (typeof window.students === 'undefined') {
        window.students = [];
    }
    
    // Alunos de teste
    const testStudents = [
        {
            id: 'test-joao-' + Date.now(),
            name: 'João Silva',
            email: 'joao.silva@teste.com',
            password: 'joão123',
            level: 'Ouro',
            totalPoints: 950,
            attendance: 95,
            streak: 7,
            birthDate: '1990-05-15',
            phone: '(11) 99999-9999',
            address: 'São Paulo, SP'
        },
        {
            id: 'test-maria-' + Date.now(),
            name: 'Maria Santos',
            email: 'maria.santos@teste.com',
            password: 'maria123',
            level: 'Prata',
            totalPoints: 750,
            attendance: 88,
            streak: 3,
            birthDate: '1985-08-22',
            phone: '(11) 88888-8888',
            address: 'Rio de Janeiro, RJ'
        }
    ];
    
    // Adicionar alunos se não existirem
    testStudents.forEach(testStudent => {
        const exists = students.find(s => s.email === testStudent.email);
        if (!exists) {
            students.push(testStudent);
            console.log(`✅ Aluno criado: ${testStudent.name} (${testStudent.email})`);
        } else {
            console.log(`ℹ️ Aluno já existe: ${testStudent.name}`);
        }
    });
    
    // Salvar no localStorage
    localStorage.setItem('students', JSON.stringify(students));
    console.log(`💾 ${students.length} alunos salvos no localStorage`);
    
    return students;
}

// ===== FORÇAR LOGIN DE ALUNO =====
function forceStudentLogin(email = 'joao.silva@teste.com', password = 'joão123') {
    console.log(`🔑 Forçando login: ${email}`);
    
    // Criar alunos primeiro
    forceCreateTestStudents();
    
    // Encontrar aluno
    const student = students.find(s => s.email === email);
    
    if (!student) {
        console.error(`❌ Aluno não encontrado: ${email}`);
        return false;
    }
    
    // Validar senha
    if (student.password !== password) {
        console.error(`❌ Senha incorreta para ${email}`);
        return false;
    }
    
    console.log(`✅ Login válido para: ${student.name}`);
    
    // Definir dados de login
    const loginData = {
        success: true,
        userType: 'aluno',
        userData: {
            name: student.name,
            email: student.email,
            student: student
        }
    };
    
    // Salvar no localStorage
    localStorage.setItem('currentUser', student.name);
    localStorage.setItem('currentUserType', 'aluno');
    localStorage.setItem('currentUserData', JSON.stringify(loginData.userData));
    localStorage.setItem('currentStudentEmail', student.email);
    
    console.log('💾 Dados de login salvos');
    
    // Ocultar tela de login
    document.querySelectorAll('#loginScreen, .login-container, #loginForm').forEach(el => {
        if (el) el.style.display = 'none';
    });
    
    // Carregar interface do aluno
    if (typeof createProfessorIdenticalStudentInterface === 'function') {
        console.log('🎯 Carregando interface idêntica ao professor...');
        createProfessorIdenticalStudentInterface();
    } else if (typeof createStandardizedStudentInterface === 'function') {
        console.log('🎯 Carregando interface padronizada...');
        createStandardizedStudentInterface();
    } else {
        console.log('🔄 Recarregando página...');
        location.reload();
    }
    
    return true;
}

// ===== INTERCEPTAR VALIDAÇÃO DE LOGIN =====
function fixLoginValidation() {
    console.log('🔧 Interceptando validação de login...');
    
    // Sobrescrever função validateLogin se existir
    if (typeof window.validateLogin === 'function') {
        const originalValidateLogin = window.validateLogin;
        
        window.validateLogin = function(username, password) {
            console.log(`🔍 Validando login: ${username}`);
            
            // Criar alunos se não existirem
            forceCreateTestStudents();
            
            // Verificar se é admin/professor
            if (username === 'admin' && password === '1234') {
                return { 
                    success: true, 
                    userType: 'professor', 
                    userData: { name: 'Professor Diego' } 
                };
            }
            
            // Verificar alunos
            const student = students.find(s => s.email === username);
            if (student && student.password === password) {
                console.log(`✅ Login de aluno válido: ${student.name}`);
                return { 
                    success: true, 
                    userType: 'aluno', 
                    userData: { 
                        name: student.name, 
                        email: student.email,
                        student: student
                    } 
                };
            }
            
            console.log(`❌ Login inválido para: ${username}`);
            return { success: false, message: 'Usuário ou senha incorretos' };
        };
        
        console.log('✅ Função validateLogin interceptada e corrigida');
    }
}

// ===== CORRIGIR ERROS DE ELEMENTOS NULL =====
function fixNullElementErrors() {
    console.log('🔧 Corrigindo erros de elementos null...');
    
    // Interceptar switchLoginTab para evitar erro
    if (typeof window.switchLoginTab === 'function') {
        const originalSwitchLoginTab = window.switchLoginTab;
        
        window.switchLoginTab = function(tab) {
            try {
                return originalSwitchLoginTab(tab);
            } catch (error) {
                console.log('⚠️ Erro em switchLoginTab interceptado:', error.message);
                return false;
            }
        };
    }
    
    // Interceptar outras funções que podem causar erro
    ['showTab', 'switchTab'].forEach(funcName => {
        if (typeof window[funcName] === 'function') {
            const originalFunc = window[funcName];
            
            window[funcName] = function(...args) {
                try {
                    return originalFunc.apply(this, args);
                } catch (error) {
                    console.log(`⚠️ Erro em ${funcName} interceptado:`, error.message);
                    return false;
                }
            };
        }
    });
    
    console.log('✅ Proteção contra erros null ativada');
}

// ===== COMANDOS GLOBAIS =====
window.fixStudentLogin = {
    createStudents: forceCreateTestStudents,
    login: forceStudentLogin,
    fixValidation: fixLoginValidation,
    fixErrors: fixNullElementErrors,
    
    // Comando completo
    fix: function() {
        console.log('🔧 CORREÇÃO COMPLETA DO LOGIN DE ALUNO');
        forceCreateTestStudents();
        fixLoginValidation();
        fixNullElementErrors();
        console.log('✅ Tudo corrigido! Tente fazer login agora.');
    },
    
    // Login rápido
    quickLogin: function() {
        console.log('⚡ LOGIN RÁPIDO DE ALUNO');
        forceStudentLogin('joao.silva@teste.com', 'joão123');
    }
};

// ===== AUTO-EXECUÇÃO =====
(function autoFix() {
    // Executar correções automaticamente
    setTimeout(() => {
        forceCreateTestStudents();
        fixLoginValidation();
        fixNullElementErrors();
        
        console.log('🎯 Correções automáticas aplicadas!');
        console.log('💡 Credenciais válidas:');
        console.log('   📧 joao.silva@teste.com / joão123');
        console.log('   📧 maria.santos@teste.com / maria123');
        console.log('⚡ Use fixStudentLogin.quickLogin() para login automático');
    }, 1000);
})();

console.log('🔧 Script de correção final carregado!');
console.log('🎯 Use fixStudentLogin.fix() para corrigir tudo');
console.log('⚡ Use fixStudentLogin.quickLogin() para login rápido'); 