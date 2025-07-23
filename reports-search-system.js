// ==================== SISTEMA DE BUSCA INTELIGENTE PARA RELATÓRIOS ====================

// Variáveis globais para o sistema de busca de relatórios
let selectedReportsStudent = null;
let reportsSearchTimeout;

function initializeReportsStudentSearch() {
    const searchInput = document.getElementById('reportsStudentSearchInput');
    const suggestionsContainer = document.getElementById('reportsStudentSuggestions');
    
    if (!searchInput || !suggestionsContainer) {
        console.log('🔍 Elementos de busca de relatórios não encontrados ainda');
        return;
    }
    
    console.log('🔧 Inicializando busca inteligente para relatórios...');
    
    // Evento de digitação
    searchInput.addEventListener('input', function(e) {
        clearTimeout(reportsSearchTimeout);
        const query = e.target.value.trim();
        
        if (query.length < 2) {
            suggestionsContainer.style.display = 'none';
            selectedReportsStudent = null;
            // Limpar relatórios quando não há busca
            updateStudentReports();
            return;
        }
        
        reportsSearchTimeout = setTimeout(() => {
            searchReportsStudents(query);
        }, 200);
    });
    
    // Esconder sugestões quando clica fora
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.reports-student-search-container')) {
            suggestionsContainer.style.display = 'none';
        }
    });
    
    // Evento de foco para mostrar sugestões recentes
    searchInput.addEventListener('focus', function() {
        if (this.value.length >= 2) {
            searchReportsStudents(this.value);
        }
    });
    
    console.log('✅ Sistema de busca inteligente para relatórios inicializado!');
}

function searchReportsStudents(query) {
    const suggestionsContainer = document.getElementById('reportsStudentSuggestions');
    if (!suggestionsContainer) return;
    
    const filteredStudents = students.filter(student => {
        const name = student.name.toLowerCase();
        const email = student.email.toLowerCase();
        const level = student.level.toLowerCase();
        const searchTerm = query.toLowerCase();
        
        return name.includes(searchTerm) || 
               email.includes(searchTerm) || 
               level.includes(searchTerm);
    });
    
    displayReportsStudentSuggestions(filteredStudents, query);
}

function displayReportsStudentSuggestions(students, query) {
    const suggestionsContainer = document.getElementById('reportsStudentSuggestions');
    if (!suggestionsContainer) return;
    
    if (students.length === 0) {
        suggestionsContainer.innerHTML = `
            <div class="suggestion-item no-results">
                <i class="fas fa-search"></i>
                <span>Nenhum aluno encontrado para "${query}"</span>
            </div>
        `;
        suggestionsContainer.style.display = 'block';
        return;
    }
    
    const html = students.slice(0, 8).map(student => {
        const avatar = generateAvatar(student.name);
        const highlightedName = highlightText(student.name, query);
        const highlightedEmail = highlightText(student.email, query);
        
        return `
            <div class="suggestion-item" onclick="selectReportsStudent('${student.email}', '${student.name.replace(/'/g, "\\'")}')">
                <div class="student-avatar" style="background: ${avatar.background}; color: ${avatar.color};">
                    ${avatar.letter}
                </div>
                <div class="student-info">
                    <div class="student-name">${highlightedName}</div>
                    <div class="student-details">
                        <span class="student-email">${highlightedEmail}</span>
                        <span class="student-level">${student.level}</span>
                    </div>
                </div>
                <div class="student-status">
                    <i class="fas fa-chart-line"></i>
                </div>
            </div>
        `;
    }).join('');
    
    suggestionsContainer.innerHTML = html;
    suggestionsContainer.style.display = 'block';
    
    console.log(`📊 Exibindo ${students.length} sugestões de alunos para relatórios`);
}

function selectReportsStudent(email, name) {
    console.log(`👤 Aluno selecionado para relatório: ${name} (${email})`);
    
    selectedReportsStudent = { email, name };
    
    // Atualizar input de busca
    const searchInput = document.getElementById('reportsStudentSearchInput');
    if (searchInput) {
        searchInput.value = name;
    }
    
    // Esconder sugestões
    const suggestionsContainer = document.getElementById('reportsStudentSuggestions');
    if (suggestionsContainer) {
        suggestionsContainer.style.display = 'none';
    }
    
    // Mostrar indicador de aluno selecionado
    showSelectedReportsStudent(name, email);
    
    // Atualizar relatórios
    updateStudentReports();
}

function showSelectedReportsStudent(name, email) {
    const searchContainer = document.querySelector('.reports-student-search-container');
    if (!searchContainer) return;
    
    // Remover indicador anterior se existir
    const existingIndicator = searchContainer.querySelector('.selected-student-indicator');
    if (existingIndicator) {
        existingIndicator.remove();
    }
    
    // Criar novo indicador
    const indicator = document.createElement('div');
    indicator.className = 'selected-student-indicator';
    indicator.innerHTML = `
        <div class="selected-student-info">
            <i class="fas fa-user-check"></i>
            <span class="selected-name">${name}</span>
            <span class="selected-email">(${email})</span>
        </div>
        <button class="clear-selection-btn" onclick="clearReportsStudentSelection()" title="Limpar seleção">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    searchContainer.appendChild(indicator);
}

function clearReportsStudentSelection() {
    console.log('🧹 Limpando seleção de aluno nos relatórios');
    
    selectedReportsStudent = null;
    
    // Limpar input
    const searchInput = document.getElementById('reportsStudentSearchInput');
    if (searchInput) {
        searchInput.value = '';
    }
    
    // Esconder sugestões
    const suggestionsContainer = document.getElementById('reportsStudentSuggestions');
    if (suggestionsContainer) {
        suggestionsContainer.style.display = 'none';
    }
    
    // Remover indicador
    const indicator = document.querySelector('.selected-student-indicator');
    if (indicator) {
        indicator.remove();
    }
    
    // Atualizar relatórios para estado vazio
    updateStudentReports();
}

function highlightText(text, query) {
    if (!query) return text;
    
    const regex = new RegExp(`(${query})`, 'gi');
    return text.replace(regex, '<strong>$1</strong>');
}

// Função para integrar com o sistema de relatórios existente
function getSelectedReportsStudentEmail() {
    return selectedReportsStudent ? selectedReportsStudent.email : '';
}

// Inicializar quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', function() {
    // Tentar inicializar imediatamente
    initializeReportsStudentSearch();
    
    // Também tentar após um delay para garantir que os elementos estejam criados
    setTimeout(initializeReportsStudentSearch, 1000);
    setTimeout(initializeReportsStudentSearch, 3000);
});

console.log('📊 Sistema de busca inteligente para relatórios carregado!'); 