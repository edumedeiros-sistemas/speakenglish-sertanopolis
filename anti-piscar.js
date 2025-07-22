// ==================== ANTI-PISCAR AUTOMÁTICO ====================
// Este arquivo é carregado automaticamente e previne o piscar dos cards

console.log('🛡️ Anti-piscar automático carregando...');

// Aplicar correções assim que a página carregar
document.addEventListener('DOMContentLoaded', function() {
    // Aguardar um pouco para garantir que outros scripts carregaram
    setTimeout(aplicarCorrecoesPiscar, 2000);
});

// Aplicar também quando o usuário entrar na aba students
function interceptarAbaStudents() {
    const originalShowTab = window.showTab;
    
    window.showTab = function(tabName) {
        // Chamar função original
        if (originalShowTab) {
            originalShowTab(tabName);
        }
        
        // Se for aba students, aplicar correções após carregamento
        if (tabName === 'students') {
            setTimeout(aplicarCorrecoesPiscar, 500);
        }
    };
}

function aplicarCorrecoesPiscar() {
    console.log('🔧 Aplicando correções anti-piscar...');
    
    // 1. Limpar timeouts que causam piscar
    if (window.studentsSearchTimeout) {
        clearTimeout(window.studentsSearchTimeout);
        window.studentsSearchTimeout = null;
    }
    
    if (window.studentsMonitoringInterval) {
        clearInterval(window.studentsMonitoringInterval);
        window.studentsMonitoringInterval = null;
    }
    
    // 2. Substituir função filterStudentsRealTime por versão otimizada
    if (typeof window.filterStudentsRealTime === 'function') {
        window.filterStudentsRealTime = function() {
            try {
                const searchInput = document.getElementById('studentsSearchInput');
                const levelFilter = document.getElementById('levelFilter');
                const statusFilter = document.getElementById('statusFilter');
                const clearBtn = document.getElementById('clearStudentsSearchBtn');
                
                if (!searchInput || !students || !Array.isArray(students)) {
                    return;
                }
                
                studentsSearchTerm = searchInput.value.toLowerCase().trim();
                const selectedLevel = levelFilter ? levelFilter.value : '';
                const selectedStatus = statusFilter ? statusFilter.value : '';
                
                if (clearBtn && clearBtn.style) {
                    clearBtn.style.display = (studentsSearchTerm || selectedLevel || selectedStatus) ? 'block' : 'none';
                }
                
                filteredStudentsData = students.filter(student => {
                    const matchesSearch = !studentsSearchTerm || 
                        student.name.toLowerCase().includes(studentsSearchTerm) ||
                        student.email.toLowerCase().includes(studentsSearchTerm) ||
                        student.level.toLowerCase().includes(studentsSearchTerm);
                    
                    const matchesLevel = !selectedLevel || student.level === selectedLevel;
                    
                    const hasActiveContract = contratos.some(c => 
                        c.studentEmail === student.email && c.status === 'ativo'
                    );
                    const currentStatus = hasActiveContract ? 'ativo' : 'inativo';
                    const matchesStatus = !selectedStatus || currentStatus === selectedStatus;
                    
                    return matchesSearch && matchesLevel && matchesStatus;
                });
                
                studentsCurrentPage = 1;
                renderStudentsCardsList();
                
            } catch (error) {
                if (Array.isArray(students)) {
                    filteredStudentsData = [...students];
                    renderStudentsCardsList();
                }
            }
        };
        console.log('✅ Função filterStudentsRealTime otimizada');
    }
    
    // 3. Aplicar CSS anti-piscar
    if (!document.getElementById('anti-piscar-styles')) {
        const style = document.createElement('style');
        style.id = 'anti-piscar-styles';
        style.textContent = `
            .students-card-grid, #studentsCardGrid {
                transition: none !important;
                animation: none !important;
                transform: translateZ(0);
                backface-visibility: hidden;
            }
            .student-card-compact {
                transition: none !important;
                animation: none !important;
                transform: translateZ(0);
                backface-visibility: hidden;
            }
            .student-card-compact * {
                transition: none !important;
                animation: none !important;
            }
        `;
        document.head.appendChild(style);
        console.log('✅ CSS anti-piscar aplicado');
    }
    
    // 4. Interceptar aba students
    interceptarAbaStudents();
    
    console.log('✅ Correções anti-piscar aplicadas com sucesso!');
}

// Aplicar novamente se necessário
window.aplicarCorrecoesPiscar = aplicarCorrecoesPiscar; 