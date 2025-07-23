// ==================== CRIAR ALUNOS DE TESTE AUTOMATICAMENTE ====================

console.log('🧪 Criando alunos de teste...');

// Função para criar alunos de teste
function createTestStudents() {
    console.log('📋 Verificando alunos existentes...');
    
    // Alunos de teste
    const testStudents = [
        {
            id: 'test-joao-' + Date.now(),
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
            attendanceStreak: 5,
            classDays: ['Segunda', 'Quarta', 'Sexta'],
            classTime: '14:00'
        },
        {
            id: 'test-maria-' + Date.now(),
            name: 'Maria Santos',
            email: 'maria.santos@teste.com',
            level: 'Ouro',
            totalPoints: 950,
            password: 'maria123',
            mensalidade: '350,00',
            diaVencimento: '10',
            formaPagamento: 'PIX',
            telefone: '(11) 88888-8888',
            dataNascimento: '22/08/1990',
            dataMatricula: '01/02/2025',
            attendanceStreak: 8,
            classDays: ['Terça', 'Quinta'],
            classTime: '16:00'
        },
        {
            id: 'test-pedro-' + Date.now(),
            name: 'Pedro Costa',
            email: 'pedro.costa@teste.com',
            level: 'Bronze',
            totalPoints: 420,
            password: 'pedro123',
            mensalidade: '350,00',
            diaVencimento: '15',
            formaPagamento: 'PIX',
            telefone: '(11) 77777-7777',
            dataNascimento: '10/12/1988',
            dataMatricula: '15/03/2025',
            attendanceStreak: 3,
            classDays: ['Segunda', 'Quarta'],
            classTime: '18:00'
        },
        {
            id: 'test-ana-' + Date.now(),
            name: 'Ana Oliveira',
            email: 'ana.oliveira@teste.com',
            level: 'Platina',
            totalPoints: 1250,
            password: 'ana123',
            mensalidade: '350,00',
            diaVencimento: '05',
            formaPagamento: 'PIX',
            telefone: '(11) 66666-6666',
            dataNascimento: '03/07/1992',
            dataMatricula: '01/01/2025',
            attendanceStreak: 12,
            classDays: ['Terça', 'Quinta', 'Sábado'],
            classTime: '10:00'
        }
    ];
    
    // Verificar e criar alunos que não existem
    let studentsCreated = 0;
    testStudents.forEach(testStudent => {
        const existingStudent = students.find(s => s.email === testStudent.email);
        if (!existingStudent) {
            students.push(testStudent);
            studentsCreated++;
            console.log(`✅ Aluno criado: ${testStudent.name} (${testStudent.email})`);
        } else {
            console.log(`ℹ️  Aluno já existe: ${testStudent.name}`);
        }
    });
    
    if (studentsCreated > 0) {
        // Salvar dados
        saveData();
        console.log(`🎉 ${studentsCreated} alunos de teste criados com sucesso!`);
    } else {
        console.log('ℹ️  Todos os alunos de teste já existem.');
    }
    
    return studentsCreated;
}

// Função para mostrar credenciais de teste
function showTestCredentials() {
    console.log('🔑 === CREDENCIAIS DE TESTE ===');
    console.log('');
    console.log('👨‍🏫 PROFESSOR:');
    console.log('Usuário: admin');
    console.log('Senha: 1234');
    console.log('');
    console.log('👤 ALUNOS:');
    console.log('1. João Silva');
    console.log('   Email: joao.silva@teste.com');
    console.log('   Senha: joão123');
    console.log('');
    console.log('2. Maria Santos');
    console.log('   Email: maria.santos@teste.com');
    console.log('   Senha: maria123');
    console.log('');
    console.log('3. Pedro Costa');
    console.log('   Email: pedro.costa@teste.com');
    console.log('   Senha: pedro123');
    console.log('');
    console.log('4. Ana Oliveira');
    console.log('   Email: ana.oliveira@teste.com');
    console.log('   Senha: ana123');
    console.log('');
    console.log('🌐 Acesse: http://localhost:8000');
}

// Função para fazer login automático de teste
function quickTestLogin(studentEmail = 'joao.silva@teste.com') {
    // Encontrar aluno
    const student = students.find(s => s.email === studentEmail);
    if (!student) {
        console.error('❌ Aluno não encontrado:', studentEmail);
        console.log('💡 Execute: createTestStudents() primeiro');
        return;
    }
    
    // Simular login
    const loginResult = {
        success: true,
        userType: 'aluno',
        userData: {
            name: student.name,
            email: student.email,
            student: student
        }
    };
    
    // Definir usuário atual
    window.currentUser = student.name;
    window.currentUserType = 'aluno';
    
    // Salvar no localStorage
    localStorage.setItem('currentUser', student.name);
    localStorage.setItem('currentUserType', 'aluno');
    localStorage.setItem('currentUserData', JSON.stringify(loginResult.userData));
    localStorage.setItem('currentStudentEmail', student.email);
    
    // Chamar interface do aluno
    if (typeof showStudentInterface === 'function') {
        showStudentInterface(loginResult.userData);
        console.log(`🎉 Login automático realizado: ${student.name}`);
    } else {
        console.error('❌ Função showStudentInterface não encontrada');
    }
}

// Função para testar autenticação
function testStudentAuth(email, password) {
    console.log(`🧪 Testando login: ${email} / ${password}`);
    
    const result = validateLogin(email, password);
    
    if (result.success) {
        console.log('✅ Login bem-sucedido!');
        console.log('Tipo:', result.userType);
        console.log('Dados:', result.userData);
    } else {
        console.log('❌ Falha no login:', result.message);
        
        // Verificar se aluno existe
        const student = students.find(s => s.email === email);
        if (student) {
            const expectedPassword = student.password || generateStudentPassword(student.name);
            console.log('💡 Senha esperada:', expectedPassword);
            console.log('💡 Senha informada:', password);
        } else {
            console.log('💡 Aluno não encontrado no sistema');
            console.log('💡 Execute: createTestStudents()');
        }
    }
    
    return result;
}

// Auto-execução para criar alunos
function autoSetupTestEnvironment() {
    console.log('🚀 Configurando ambiente de teste...');
    
    // Aguardar um pouco para garantir que o sistema carregou
    setTimeout(() => {
        if (typeof students !== 'undefined' && typeof saveData === 'function') {
            const created = createTestStudents();
            showTestCredentials();
            
            if (created > 0) {
                console.log('');
                console.log('🎯 Para testar rapidamente:');
                console.log('quickTestLogin() - Login automático como João Silva');
                console.log('quickTestLogin("maria.santos@teste.com") - Login como Maria Santos');
            }
        } else {
            console.log('⏳ Sistema ainda carregando... Tente novamente em alguns segundos');
            console.log('💡 Ou execute manualmente: createTestStudents()');
        }
    }, 2000);
}

// Comandos disponíveis globalmente
window.testCommands = {
    createTestStudents,
    showTestCredentials,
    quickTestLogin,
    testStudentAuth
};

// Executar automaticamente
autoSetupTestEnvironment();

console.log('✅ Script de alunos de teste carregado!');
console.log('🎮 Comandos disponíveis: testCommands.createTestStudents(), testCommands.quickTestLogin()'); 