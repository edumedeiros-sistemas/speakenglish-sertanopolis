// ==================== FUNCIONALIDADES COMPLEMENTARES ====================

// Sistema de Conquistas
function setupDefaultAchievements() {
    if (achievements.length === 0) {
        achievements = [
            { id: 1, title: 'Primeira Presença', description: 'Comparecer à primeira aula', icon: 'fas fa-star', condition: 'attendance', target: 1, points: 5 },
            { id: 2, title: 'Sequência de Ferro', description: '5 dias consecutivos', icon: 'fas fa-fire', condition: 'attendance', target: 5, points: 15 },
            { id: 3, title: 'Primeira Tarefa', description: 'Completar primeira tarefa', icon: 'fas fa-medal', condition: 'tasks', target: 1, points: 10 },
            { id: 4, title: 'Estudante Dedicado', description: '10 tarefas completadas', icon: 'fas fa-trophy', condition: 'tasks', target: 10, points: 25 },
            { id: 5, title: 'Centurião', description: 'Alcançar 100 pontos', icon: 'fas fa-crown', condition: 'points', target: 100, points: 20 }
        ];
        saveDataExtras();
    }
}

function handleAddAchievement(e) {
    e.preventDefault();
    const title = document.getElementById('achievement-title').value;
    const description = document.getElementById('achievement-description').value;
    const icon = document.getElementById('achievement-icon').value;
    const condition = document.getElementById('achievement-condition').value;
    const target = parseInt(document.getElementById('achievement-target').value);

    achievements.push({
        id: Date.now(),
        title, description, icon, condition, target,
        points: Math.floor(target * 2)
    });

    saveDataExtras();
    renderAchievements();
    closeModal('add-achievement-modal');
    document.getElementById('add-achievement-form').reset();
    showNotification(`Conquista "${title}" criada!`, 'success');
}

function renderAchievements() {
    const container = document.getElementById('achievements-grid');
    if (!container) return;

    container.innerHTML = achievements.map(achievement => `
        <div class="achievement-card">
            <div class="achievement-icon"><i class="${achievement.icon}"></i></div>
            <div class="achievement-title">${achievement.title}</div>
            <div class="achievement-description">${achievement.description}</div>
            <div class="achievement-target">Meta: ${achievement.target}</div>
            <div class="achievement-rewards">+${achievement.points} pontos</div>
            <div class="achievement-earned">${getAchievementEarnedCount(achievement.id)} alunos</div>
        </div>
    `).join('');
}

function checkAchievements(student) {
    achievements.forEach(achievement => {
        if (student.achievements.includes(achievement.id)) return;

        let achieved = false;
        switch(achievement.condition) {
            case 'attendance': achieved = student.attendanceStreak >= achievement.target; break;
            case 'tasks': achieved = student.tasksCompleted >= achievement.target; break;
            case 'points': achieved = student.points >= achievement.target; break;
        }

        if (achieved) {
            student.achievements.push(achievement.id);
            student.points += achievement.points;
            saveDataExtras();
            showNotification(`🎉 ${student.name} conquistou "${achievement.title}"!`, 'success', 5000);
        }
    });
}

function getAchievementEarnedCount(achievementId) {
    return students.filter(s => s.achievements.includes(achievementId)).length;
}

// Dashboard e Estatísticas
function updateDashboardExtras() {
    // Função renomeada para evitar conflito
    // A função updateDashboard principal está no script.js
    const totalStudentsEl = document.getElementById('total-students');
    const attendanceRateEl = document.getElementById('attendance-rate');
    const completedTasksEl = document.getElementById('completed-tasks');
    const avgScoreEl = document.getElementById('avg-score');
    
    if (totalStudentsEl) totalStudentsEl.textContent = students.length;
    if (attendanceRateEl) attendanceRateEl.textContent = `${calculateAttendanceRate()}%`;
    if (completedTasksEl) completedTasksEl.textContent = students.reduce((total, s) => total + s.tasksCompleted, 0);
    if (avgScoreEl) avgScoreEl.textContent = students.length > 0 ? 
        Math.round(students.reduce((total, s) => total + s.points, 0) / students.length) : 0;
    renderRanking();
}

function calculateAttendanceRate() {
    if (students.length === 0) return 0;
    const last7Days = [];
    for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        last7Days.push(date.toISOString().split('T')[0]);
    }

    let totalPossible = students.length * 7;
    let totalPresent = 0;
    last7Days.forEach(date => {
        if (attendance[date]) {
            totalPresent += Object.values(attendance[date]).filter(Boolean).length;
        }
    });

    return totalPossible > 0 ? Math.round((totalPresent / totalPossible) * 100) : 0;
}

function renderRanking() {
    const container = document.getElementById('ranking-list');
    if (!container) return;

    const sortedStudents = [...students].sort((a, b) => b.points - a.points);
    
    if (sortedStudents.length === 0) {
        container.innerHTML = '<div class="text-center"><p>Nenhum aluno cadastrado ainda.</p></div>';
        return;
    }

    container.innerHTML = sortedStudents.map((student, index) => {
        const position = index + 1;
        const positionClass = position === 1 ? 'first' : position === 2 ? 'second' : position === 3 ? 'third' : '';
        
        return `
            <div class="ranking-item">
                <div class="ranking-position ${positionClass}">${position}</div>
                <div class="ranking-avatar">${student.name.charAt(0).toUpperCase()}</div>
                <div class="ranking-info">
                    <div class="ranking-name">${student.name}</div>
                    <div class="ranking-level">${LEVELS[student.level]}</div>
                </div>
                <div class="ranking-score">${student.points}</div>
            </div>
        `;
    }).join('');
}

// Modais - REMOVIDOS para evitar conflito com script.js
// As funções de modal agora estão apenas no script.js

// Modais de Configurações
function showChangePasswordModal() {
    document.getElementById('change-password-modal').classList.add('active');
    document.getElementById('current-password').focus();
}

function showStudentPasswordsModal() {
    document.getElementById('student-passwords-modal').classList.add('active');
    loadStudentPasswordsList();
}

function loadStudentPasswordsList() {
    const container = document.getElementById('student-passwords-list');
    
    container.innerHTML = `
        <div style="margin-bottom: 20px;">
            <h4>Credenciais dos Alunos</h4>
            <p style="color: #6c757d; font-size: 0.9rem;">Use essas informações para informar aos alunos como fazer login</p>
        </div>
        <div style="display: grid; gap: 15px;">
            ${students.map(student => {
                const authInfo = Object.entries(authData.students).find(([email, data]) => data.studentId === student.id);
                const email = authInfo ? authInfo[0] : 'Não cadastrado';
                const hasAuth = !!authInfo;
                
                return `
                    <div style="display: flex; justify-content: space-between; align-items: center; padding: 15px; border: 1px solid #e9ecef; border-radius: 8px; background: ${hasAuth ? '#f8f9fa' : '#fff3cd'};">
                        <div>
                            <strong>${student.name}</strong>
                            <div style="color: #6c757d; font-size: 0.9rem;">
                                Login: ${email}
                                ${!hasAuth ? '<span style="color: #e67e22;"> (Login não configurado)</span>' : ''}
                            </div>
                        </div>
                        <div style="display: flex; gap: 10px;">
                            ${hasAuth ? `
                                <button class="btn btn-sm btn-warning" onclick="resetStudentPassword('${email}', '${student.name}')">
                                    <i class="fas fa-key"></i> Redefinir Senha
                                </button>
                                <button class="btn btn-sm btn-info" onclick="showStudentCredentials('${email}', '${student.name}')">
                                    <i class="fas fa-eye"></i> Ver Senha
                                </button>
                            ` : `
                                <button class="btn btn-sm btn-primary" onclick="createStudentLogin(${student.id}, '${student.name}')">
                                    <i class="fas fa-plus"></i> Criar Login
                                </button>
                            `}
                        </div>
                    </div>
                `;
            }).join('')}
        </div>
    `;
}

function resetStudentPassword(email, studentName) {
    const newPassword = prompt(`Digite a nova senha para ${studentName}:`, 'nova123');
    if (newPassword && newPassword.length >= 4) {
        authData.students[email].password = newPassword;
        saveAuthData();
        showNotification(`Senha de ${studentName} alterada para: ${newPassword}`, 'success', 8000);
        loadStudentPasswordsList();
    } else if (newPassword !== null) {
        showNotification('Senha deve ter pelo menos 4 caracteres', 'warning');
    }
}

function showStudentCredentials(email, studentName) {
    const password = authData.students[email].password;
    alert(`Credenciais de ${studentName}:\n\nLogin: ${email}\nSenha: ${password}\n\nCompartilhe essas informações com o aluno.`);
}

function createStudentLogin(studentId, studentName) {
    const email = prompt(`Digite o email para ${studentName}:`);
    if (!email) return;
    
    if (authData.students[email]) {
        showNotification('Este email já está em uso!', 'danger');
        return;
    }
    
    const password = prompt('Digite a senha:', 'senha123');
    if (!password || password.length < 4) {
        showNotification('Senha deve ter pelo menos 4 caracteres', 'warning');
        return;
    }
    
    // Atualizar email do aluno
    const student = students.find(s => s.id === studentId);
    if (student) {
        student.email = email;
    }
    
    addStudentAuth(studentId, email, password, studentName);
    saveDataExtras();
    showNotification(`Login criado para ${studentName}: ${email}`, 'success');
    loadStudentPasswordsList();
}

// Utilitários
function saveDataExtras() {
    // Função renomeada para evitar conflito com script.js
    // A função saveData principal está no script.js
    localStorage.setItem('students', JSON.stringify(students));
    localStorage.setItem('tasks', JSON.stringify(tasks));
    localStorage.setItem('achievements', JSON.stringify(achievements));
    localStorage.setItem('attendance', JSON.stringify(attendance));
}

function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString('pt-BR');
}

function showNotification(message, type = 'info', duration = 3000) {
    const notification = document.createElement('div');
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : 'info-circle'}"></i>
        <span>${message}</span>
    `;
    
    notification.style.cssText = `
        position: fixed; top: 20px; right: 20px; padding: 15px 20px;
        border-radius: 8px; color: white; font-weight: 500; z-index: 10000;
        display: flex; align-items: center; gap: 10px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        transform: translateX(100%); transition: transform 0.3s ease;
        background-color: ${type === 'success' ? '#4CAF50' : '#2196F3'};
    `;

    document.body.appendChild(notification);
    setTimeout(() => notification.style.transform = 'translateX(0)', 100);
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => notification.remove(), 300);
    }, duration);
}

// Funcionalidades Extras
function exportData() {
    const data = { students, tasks, achievements, attendance, exportDate: new Date().toISOString() };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `english-tracker-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    showNotification('Backup exportado com sucesso!', 'success');
}

function generateWeeklyReport() {
    const report = {
        totalStudents: students.length,
        totalPoints: students.reduce((sum, s) => sum + s.points, 0),
        averagePoints: students.length > 0 ? Math.round(students.reduce((sum, s) => sum + s.points, 0) / students.length) : 0,
        attendanceRate: calculateAttendanceRate(),
        completedTasks: students.reduce((sum, s) => sum + s.tasksCompleted, 0),
        topStudent: students.sort((a, b) => b.points - a.points)[0]
    };
    
    console.log('Relatório Semanal:', report);
    showNotification('Relatório gerado no console!', 'info');
}

// Atalhos de Teclado - DESABILITADOS para evitar conflito
// Os atalhos de teclado estão sendo gerenciados pelo script.js principal

/*
document.addEventListener('keydown', function(e) {
    if (e.ctrlKey) {
        switch(e.key) {
            case '1': e.preventDefault(); switchTab('dashboard'); break;
            case '2': e.preventDefault(); switchTab('students'); break;
            case '3': e.preventDefault(); switchTab('attendance'); break;
            case '4': e.preventDefault(); switchTab('tasks'); break;
            case '5': e.preventDefault(); switchTab('achievements'); break;
            case 's': e.preventDefault(); showAddStudentModal(); break;
            case 't': e.preventDefault(); showAddTaskModal(); break;
        }
    }
    
    if (e.key === 'Escape') {
        document.querySelectorAll('.modal.active').forEach(modal => {
            modal.classList.remove('active');
        });
    }
});
*/

// Inicialização
document.addEventListener('DOMContentLoaded', function() {
    setupDefaultAchievements();
    // updateDashboard agora está no script.js principal
});

console.log('✅ Funcionalidades extras carregadas!'); 