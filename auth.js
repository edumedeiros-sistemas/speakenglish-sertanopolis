/* ==================== SPEAKENGLISH v2.4.2 - SISTEMA DE AUTENTICAÇÃO ==================== */

// Configurações de autenticação
const DEFAULT_CREDENTIALS = {
    admin: { username: 'admin', password: '1234', role: 'professor' }
};

// Armazenar dados de autenticação no localStorage
function saveAuthData() {
    const authData = {
        students: students.map(student => ({
            email: student.email,
            password: student.password || generateStudentPassword(student.name),
            name: student.name
        }))
    };
    localStorage.setItem('speakenglish-auth', JSON.stringify(authData));
}

// Gerar senha para aluno
function generateStudentPassword(name) {
    const firstName = name.split(' ')[0].toLowerCase();
    return firstName + '123';
}

// Verificar credenciais de login
function validateLogin(username, password) {
    // Verificar admin/professor
    if (username === 'admin' && password === '1234') {
        return { success: true, userType: 'professor', userData: { name: 'Professor Diego' } };
    }
    
    // Verificar alunos
    const student = students.find(s => s.email === username);
    if (student) {
        const expectedPassword = student.password || generateStudentPassword(student.name);
        if (password === expectedPassword) {
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
    }
    
    return { success: false, message: 'Usuário ou senha incorretos' };
}

// Atualizar senha do aluno
function updateStudentPassword(email, newPassword) {
    const student = students.find(s => s.email === email);
    if (student) {
        student.password = newPassword;
        saveData();
        saveAuthData();
        return true;
    }
    return false;
}

// Criar login para novo aluno
function createStudentLogin(student) {
    if (!student.password) {
        student.password = generateStudentPassword(student.name);
    }
    saveAuthData();
}

// Remover login do aluno
function removeStudentLogin(studentEmail) {
    saveAuthData();
}

console.log(' Sistema de Autenticação SpeakEnglish v2.4.2 carregado');
