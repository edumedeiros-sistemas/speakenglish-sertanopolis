// ==================== CORREÇÃO RÁPIDA - CREDENCIAIS DE LOGIN ====================

console.log('🔧 Corrigindo credenciais de login...');

// Função para garantir que alunos existam
function ensureTestStudentsExist() {
    console.log('🔍 Verificando alunos no sistema...');
    
    // Se não existir array de students, criar
    if (typeof students === 'undefined') {
        window.students = [];
        console.log('📝 Array de estudantes criado');
    }
    
    console.log(`📊 Alunos existentes: ${students.length}`);
    
    // Aluno principal de teste
    const mainTestStudent = {
        id: 'fix-test-' + Date.now(),
        name: 'João Silva',
        email: 'joao.silva@teste.com',
        level: 'Prata',
        totalPoints: 750,
        password: 'joão123',
        mensalidade: '350,00',
        diaVencimento: '10',
        formaPagamento: 'PIX',
        telefone: '(11) 99999-9999',
        dataNascimento: '15/05/1995',
        dataMatricula: '01/03/2025',
        attendanceStreak: 5
    };
    
    // Verificar se aluno principal existe
    const existingStudent = students.find(s => s.email === mainTestStudent.email);
    if (!existingStudent) {
        students.push(mainTestStudent);
        console.log('✅ Aluno principal criado:', mainTestStudent.name);
        
        // Salvar se função existe
        if (typeof saveData === 'function') {
            saveData();
            console.log('💾 Dados salvos');
        }
    } else {
        console.log('ℹ️  Aluno principal já existe:', existingStudent.name);
    }
    
    return mainTestStudent;
}

// Função para testar login específico
function testSpecificLogin() {
    const email = 'joao.silva@teste.com';
    const password = 'joão123';
    
    console.log(`🧪 Testando login específico: ${email} / ${password}`);
    
    // Garantir que aluno existe
    const student = ensureTestStudentsExist();
    
    // Testar validação
    if (typeof validateLogin === 'function') {
        const result = validateLogin(email, password);
        
        if (result.success) {
            console.log('✅ Login validado com sucesso!');
            console.log('👤 Usuário:', result.userData.name);
            console.log('🎭 Tipo:', result.userType);
            return result;
        } else {
            console.log('❌ Falha na validação:', result.message);
            
            // Debug do problema
            console.log('🔍 Debug:');
            console.log('  - Aluno encontrado:', students.find(s => s.email === email) ? 'SIM' : 'NÃO');
            const foundStudent = students.find(s => s.email === email);
            if (foundStudent) {
                console.log('  - Senha esperada:', foundStudent.password);
                console.log('  - Senha informada:', password);
                console.log('  - Senhas iguais:', foundStudent.password === password);
            }
        }
    } else {
        console.error('❌ Função validateLogin não encontrada');
    }
    
    return null;
}

// Função para login direto (bypass)
function forceStudentLogin() {
    console.log('🚀 Forçando login do aluno...');
    
    const student = ensureTestStudentsExist();
    
    const loginData = {
        success: true,
        userType: 'aluno',
        userData: {
            name: student.name,
            email: student.email,
            student: student
        }
    };
    
    // Definir variáveis globais
    window.currentUser = student.name;
    window.currentUserType = 'aluno';
    
    // Salvar no localStorage
    localStorage.setItem('currentUser', student.name);
    localStorage.setItem('currentUserType', 'aluno');
    localStorage.setItem('currentUserData', JSON.stringify(loginData.userData));
    localStorage.setItem('currentStudentEmail', student.email);
    
    // Chamar interface
    if (typeof showStudentInterface === 'function') {
        showStudentInterface(loginData.userData);
        console.log('🎉 Login forçado realizado com sucesso!');
        console.log('👤 Usuário logado:', student.name);
    } else {
        console.error('❌ Função showStudentInterface não encontrada');
        console.log('💡 Verifique se o arquivo student-interface.js foi carregado');
    }
}

// Função para mostrar credenciais corretas
function showCorrectCredentials() {
    console.log('');
    console.log('🔑 === CREDENCIAIS CORRETAS ===');
    console.log('');
    console.log('👨‍🏫 PROFESSOR:');
    console.log('   Usuário: admin');
    console.log('   Senha: 1234');
    console.log('');
    console.log('👤 ALUNO DE TESTE:');
    console.log('   Email: joao.silva@teste.com');
    console.log('   Senha: joão123');
    console.log('');
    console.log('🌐 URL: http://localhost:8000');
    console.log('');
    console.log('🎮 COMANDOS DE EMERGÊNCIA:');
    console.log('   fixLogin.forceStudentLogin() - Login direto');
    console.log('   fixLogin.testSpecificLogin() - Testar validação');
    console.log('   fixLogin.ensureTestStudentsExist() - Criar alunos');
}

// Função principal de correção
function fixLoginIssues() {
    console.log('🔧 === CORREÇÃO COMPLETA DE LOGIN ===');
    
    // 1. Garantir que estudantes existam
    console.log('1️⃣ Criando alunos de teste...');
    ensureTestStudentsExist();
    
    // 2. Testar validação
    console.log('2️⃣ Testando validação...');
    const loginResult = testSpecificLogin();
    
    if (loginResult) {
        console.log('3️⃣ Validação OK - Credenciais funcionando!');
    } else {
        console.log('3️⃣ Problema na validação - Use login forçado');
        console.log('💡 Execute: fixLogin.forceStudentLogin()');
    }
    
    // 4. Mostrar credenciais
    showCorrectCredentials();
}

// Disponibilizar comandos globalmente
window.fixLogin = {
    ensureTestStudentsExist,
    testSpecificLogin,
    forceStudentLogin,
    showCorrectCredentials,
    fixLoginIssues
};

// Auto-executar correção
setTimeout(() => {
    if (typeof students !== 'undefined') {
        fixLoginIssues();
    } else {
        console.log('⏳ Aguardando carregamento do sistema...');
        setTimeout(() => {
            fixLoginIssues();
        }, 3000);
    }
}, 1000);

console.log('✅ Sistema de correção de login carregado!');
console.log('🚨 Se tiver problemas, execute: fixLogin.fixLoginIssues()'); 