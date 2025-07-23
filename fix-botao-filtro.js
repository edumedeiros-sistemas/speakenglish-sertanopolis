// 🔧 FIX ESPECÍFICO - Botão Limpar Filtro de Aluno
console.log('🔲 Carregando fix do botão limpar filtro...');

// Função robusta para limpar filtro
function clearStudentFilterRobust() {
    console.log('🧹 clearStudentFilterRobust() executada');
    
    const filterInput = document.getElementById('reposicoesStudentFilter');
    const selectedDisplay = document.getElementById('selectedFilterStudent');
    const studentNameSpan = document.querySelector('.filter-student-name');
    
    console.log('🔍 Debug elementos detalhado:', {
        filterInput: {
            exists: !!filterInput,
            value: filterInput ? filterInput.value : 'N/A'
        },
        selectedDisplay: {
            exists: !!selectedDisplay,
            visible: selectedDisplay ? selectedDisplay.style.display !== 'none' : false,
            innerHTML: selectedDisplay ? selectedDisplay.innerHTML : 'N/A'
        },
        studentNameSpan: {
            exists: !!studentNameSpan,
            text: studentNameSpan ? studentNameSpan.textContent : 'N/A'
        }
    });
    
    // 1. Limpar campo de busca
    if (filterInput) {
        filterInput.value = '';
        console.log('✅ Campo de busca limpo');
    } else {
        console.error('❌ Campo reposicoesStudentFilter não encontrado');
    }
    
    // 2. Limpar texto do nome do aluno
    if (studentNameSpan) {
        studentNameSpan.textContent = '';
        studentNameSpan.innerHTML = '';
        console.log('✅ Nome do aluno limpo');
    } else {
        // Fallback: tentar encontrar de outra forma
        const spanAlternativo = selectedDisplay?.querySelector('.filter-student-name');
        if (spanAlternativo) {
            spanAlternativo.textContent = '';
            spanAlternativo.innerHTML = '';
            console.log('✅ Nome do aluno limpo (fallback)');
        } else {
            console.warn('⚠️ Span do nome do aluno não encontrado');
        }
    }
    
    // 3. Esconder display de aluno selecionado
    if (selectedDisplay) {
        selectedDisplay.style.display = 'none';
        selectedDisplay.style.visibility = 'hidden';
        console.log('✅ Display de aluno escondido');
        
        // Forçar limpeza completa do conteúdo
        const allSpans = selectedDisplay.querySelectorAll('span');
        allSpans.forEach(span => {
            span.textContent = '';
            span.innerHTML = '';
        });
        console.log('✅ Todos os spans internos limpos');
    } else {
        console.error('❌ Display selectedFilterStudent não encontrado');
    }
    
    // 4. Esconder sugestões globais
    try {
        if (typeof window.hideGlobalSuggestions === 'function') {
            window.hideGlobalSuggestions();
            console.log('✅ Sugestões globais escondidas');
        }
    } catch (error) {
        console.warn('⚠️ Erro ao esconder sugestões:', error.message);
    }
    
    // 5. Aplicar filtro vazio para mostrar todas as reposições
    try {
        if (typeof window.filterReposicoesByStudent === 'function') {
            window.filterReposicoesByStudent('');
            console.log('✅ Filtro removido - todas as reposições exibidas');
        } else {
            console.warn('⚠️ Função filterReposicoesByStudent não disponível');
        }
    } catch (error) {
        console.error('❌ Erro ao aplicar filtro vazio:', error.message);
    }
    
    // 6. Verificação final
    setTimeout(() => {
        const finalCheck = {
            inputValue: filterInput ? filterInput.value : 'N/A',
            displayVisible: selectedDisplay ? selectedDisplay.style.display !== 'none' : false,
            spanText: studentNameSpan ? studentNameSpan.textContent : 'N/A'
        };
        console.log('🔍 Verificação final:', finalCheck);
        
        if (finalCheck.inputValue === '' && !finalCheck.displayVisible && finalCheck.spanText === '') {
            console.log('🎯 ✅ Limpeza 100% bem-sucedida!');
        } else {
            console.warn('⚠️ Limpeza parcial - forçando correção...');
            // Força limpeza adicional
            if (filterInput) filterInput.value = '';
            if (selectedDisplay) {
                selectedDisplay.style.display = 'none';
                selectedDisplay.style.visibility = 'hidden';
            }
            if (studentNameSpan) {
                studentNameSpan.textContent = '';
                studentNameSpan.innerHTML = '';
            }
        }
    }, 100);
    
    console.log('🎯 Limpeza de filtro concluída');
}

// Disponibilizar em múltiplos escopos
window.clearStudentFilter = clearStudentFilterRobust;
window.clearStudentFilterRobust = clearStudentFilterRobust;

// Função alternativa para teste
window.testClearFilter = function() {
    console.log('🧪 Testando função de limpeza...');
    clearStudentFilterRobust();
};

// Função para forçar limpeza manual
window.forceClearFilter = function() {
    console.log('🔥 FORÇANDO limpeza manual...');
    
    // Força limpeza de todos os elementos possíveis
    const elementos = [
        '#reposicoesStudentFilter',
        '#selectedFilterStudent',
        '.filter-student-name'
    ];
    
    elementos.forEach(selector => {
        const el = document.querySelector(selector);
        if (el) {
            if (el.tagName === 'INPUT') {
                el.value = '';
            } else {
                el.style.display = 'none';
                el.textContent = '';
                el.innerHTML = '';
            }
            console.log(`✅ ${selector} limpo forçadamente`);
        }
    });
    
    // Aplicar filtro vazio
    if (typeof window.filterReposicoesByStudent === 'function') {
        window.filterReposicoesByStudent('');
    }
    
    console.log('🔥 Limpeza forçada concluída');
};

// Configurar quando DOM estiver pronto
document.addEventListener('DOMContentLoaded', function() {
    console.log('🔧 Configurando evento de clique do botão...');
    
    // Encontrar o botão e adicionar evento
    setTimeout(function() {
        const clearButton = document.querySelector('.btn-clear-filter');
        if (clearButton) {
            console.log('✅ Botão encontrado, configurando evento');
            
            // Remover eventos existentes e adicionar novo
            clearButton.onclick = function(e) {
                e.preventDefault();
                e.stopPropagation();
                console.log('🔲 Botão clicado via evento');
                clearStudentFilterRobust();
            };
            
            console.log('✅ Evento de clique configurado');
        } else {
            console.warn('⚠️ Botão .btn-clear-filter não encontrado');
        }
    }, 1000);
});

// Configurar observador para botão que pode ser criado dinamicamente
const observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
        mutation.addedNodes.forEach(function(node) {
            if (node.nodeType === 1) { // Element node
                const clearButton = node.querySelector ? node.querySelector('.btn-clear-filter') : null;
                if (clearButton || (node.classList && node.classList.contains('btn-clear-filter'))) {
                    console.log('🔍 Botão detectado dinamicamente, configurando...');
                    const button = clearButton || node;
                    button.onclick = function(e) {
                        e.preventDefault();
                        e.stopPropagation();
                        console.log('🔲 Botão clicado via observador');
                        clearStudentFilterRobust();
                    };
                }
            }
        });
    });
});

// Observar mudanças no DOM
observer.observe(document.body, {
    childList: true,
    subtree: true
});

console.log('✅ Fix do botão limpar filtro carregado completamente');

// Debug função
window.debugClearButton = function() {
    console.log('=== DEBUG BOTÃO LIMPAR ===');
    const button = document.querySelector('.btn-clear-filter');
    const filterInput = document.getElementById('reposicoesStudentFilter');
    const selectedDisplay = document.getElementById('selectedFilterStudent');
    const studentNameSpan = document.querySelector('.filter-student-name');
    
    console.log('Botão encontrado:', !!button);
    console.log('Campo filtro encontrado:', !!filterInput);
    console.log('Display seleção encontrado:', !!selectedDisplay);
    console.log('Span nome encontrado:', !!studentNameSpan);
    console.log('clearStudentFilter global:', typeof window.clearStudentFilter);
    console.log('clearStudentFilterRobust global:', typeof window.clearStudentFilterRobust);
    
    if (button) {
        console.log('Evento onclick do botão:', typeof button.onclick);
        console.log('HTML do botão:', button.outerHTML);
    }
    
    if (selectedDisplay) {
        console.log('Display atual:', {
            display: selectedDisplay.style.display,
            visibility: selectedDisplay.style.visibility,
            innerHTML: selectedDisplay.innerHTML
        });
    }
    
    if (studentNameSpan) {
        console.log('Span nome:', {
            text: studentNameSpan.textContent,
            html: studentNameSpan.innerHTML
        });
    }
}; 