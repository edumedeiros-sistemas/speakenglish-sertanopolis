// Sistema de Controle de Aulas - SpeakEnglish v3.0.0

console.log('🎓 Carregando Sistema de Controle de Aulas...');

// Função para recarregar dados do localStorage
function reloadAulasFromStorage() {
    console.log('🔄 Recarregando aulas do localStorage...');
    try {
        const storedData = localStorage.getItem('aulasDadas');
        if (storedData) {
            window.aulasDadas = JSON.parse(storedData);
            console.log('✅ Dados recarregados:', window.aulasDadas.length, 'aulas');
        } else {
            window.aulasDadas = [];
            console.log('⚠️ Nenhum dado no localStorage, inicializando array vazio');
        }
    } catch (error) {
        console.error('❌ Erro ao recarregar dados do localStorage:', error);
        window.aulasDadas = [];
    }
}

// Inicializar o módulo de aulas
function initializeAulasModule() {
    console.log('🎓 Inicializando módulo de controle de aulas...');
    
    try {
        // PRIMEIRO: Recarregar dados do localStorage
        reloadAulasFromStorage();
        
        // Debug: Verificar estado inicial
        console.log('DEBUG: aulasDadas no início:', window.aulasDadas);
        
        // Carregar alunos para seleção
        loadStudentsForAula();
        
        // Definir data atual no formulário
        const today = new Date().toISOString().split('T')[0];
        const aulaDataInput = document.getElementById('aulaData');
        if (aulaDataInput) {
            aulaDataInput.value = today;
        }
        
        // Configurar formulário
        setupAulaForm();
        
        // Carregar estatísticas - COM DELAY para garantir que DOM está pronto
        setTimeout(() => {
            console.log('🕐 Executando updateAulasStats após 200ms...');
            updateAulasStats();
        }, 200);
        
        // Carregar histórico
        loadAulasHistorico();
        
        console.log('✅ Módulo de aulas inicializado');
    } catch (error) {
        console.error('❌ Erro ao inicializar módulo de aulas:', error);
    }
}

// Mostrar sub-abas do sistema de aulas - IMPLEMENTAÇÃO COMPLETA
function showAulasSubTab(tabName) {
    console.log('📂 Mudando para sub-aba:', tabName);
    
    try {
        // Remover classe active de todas as abas
        document.querySelectorAll('.aulas-tab').forEach(tab => {
            tab.classList.remove('active');
        });
        
        // Remover classe active de todos os conteúdos
        document.querySelectorAll('.aulas-subtab').forEach(content => {
            content.classList.remove('active');
        });
        
        // Ativar aba clicada - buscar por todos os elementos que contêm o onclick
        const allTabs = document.querySelectorAll('.aulas-tab');
        allTabs.forEach(tab => {
            const onclick = tab.getAttribute('onclick');
            if (onclick && onclick.includes(`showAulasSubTab('${tabName}')`)) {
                tab.classList.add('active');
            }
        });
        
        // Mapeamento das sub-abas
        const subtabMap = {
            'registrar': 'registrarAula',
            'historico': 'historicoAulas',
            'calendario': 'calendarioAulas',
            'planejamento': 'planejamentoAulas'
        };
        
        // Mostrar conteúdo correspondente
        const targetId = subtabMap[tabName];
        const targetContent = document.getElementById(targetId);
        
        if (targetContent) {
            targetContent.classList.add('active');
            console.log('✅ Sub-aba ativada:', targetId);
            
            // Carregar conteúdo específico da aba
            switch(tabName) {
                case 'historico':
                    loadAulasHistorico();
                    break;
                case 'calendario':
                    loadCalendarioAulas();
                    break;
                case 'planejamento':
                    loadPlanejamentos();
                    break;
                default:
                    console.log('📝 Aba registrar já carregada');
            }
        } else {
            console.error('❌ Elemento não encontrado:', targetId);
        }
        
    } catch (error) {
        console.error('❌ Erro ao mudar sub-aba:', error);
    }
}

// Carregar alunos para seleção nas aulas - SISTEMA DE BUSCA INTELIGENTE
function loadStudentsForAula() {
    const container = document.getElementById('aulaAlunosSelection');
    if (!container) return;
    
    try {
        // Criar interface de busca inteligente de alunos
        container.innerHTML = `
            <div class="smart-student-search">
                <!-- Campo de busca -->
                <div class="search-input-container">
                    <div class="search-input-wrapper">
                        <i class="fas fa-search search-icon"></i>
                        <input type="text" id="studentSearchInput" class="student-search-input" 
                               placeholder="Digite o nome do aluno para buscar..." 
                               autocomplete="off">
                        <div class="search-suggestions" id="studentSuggestions" style="display: none;">
                            <!-- Sugestões aparecerão aqui -->
                        </div>
                    </div>
                </div>
                
                <!-- Alunos selecionados -->
                <div class="selected-students-container">
                    <div class="selected-students-header">
                        <span class="selected-count">Alunos Selecionados: <strong id="selectedStudentsCount">0</strong></span>
                        <button type="button" class="clear-all-btn" id="clearAllStudentsBtn" onclick="clearAllSelectedStudents()" style="display: none;">
                            <i class="fas fa-times"></i> Limpar Todos
                        </button>
                    </div>
                    <div class="selected-students-tags" id="selectedStudentsTags">
                        <!-- Tags dos alunos selecionados aparecerão aqui -->
                    </div>
                </div>
                
                <!-- Input hidden para armazenar os emails selecionados -->
                <input type="hidden" id="selectedStudentsData" value="">
            </div>
        `;
        
        // Verificar se há alunos cadastrados
        if (!window.students || students.length === 0) {
            const searchInput = document.getElementById('studentSearchInput');
            if (searchInput) {
                searchInput.placeholder = 'Nenhum aluno cadastrado ainda...';
                searchInput.disabled = true;
            }
            return;
        }
        
        // Configurar eventos da busca
        setupStudentSearchEvents();
        
        console.log('✅ Sistema de busca inteligente de alunos carregado');
        
    } catch (error) {
        console.error('❌ Erro ao carregar sistema de busca de alunos:', error);
        // Fallback para interface simples
        container.innerHTML = '<p class="text-danger">Erro ao carregar seleção de alunos.</p>';
    }
}

// Configurar eventos de busca de alunos
function setupStudentSearchEvents() {
    const searchInput = document.getElementById('studentSearchInput');
    const suggestionsContainer = document.getElementById('studentSuggestions');
    
    if (!searchInput || !suggestionsContainer) return;
    
    // Array para armazenar alunos selecionados
    if (!window.selectedStudentsForClass) {
        window.selectedStudentsForClass = [];
    }
    
    // Evento de digitação com debounce
    let searchTimeout;
    searchInput.addEventListener('input', function(e) {
        clearTimeout(searchTimeout);
        const query = e.target.value.trim();
        
        if (query.length === 0) {
            hideSuggestions();
            return;
        }
        
        searchTimeout = setTimeout(() => {
            showStudentSuggestions(query);
        }, 200); // Debounce de 200ms
    });
    
    // Fechar sugestões ao clicar fora
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.search-input-wrapper')) {
            hideSuggestions();
        }
    });
    
    // Focar no campo quando clica no container
    searchInput.addEventListener('focus', function() {
        const query = this.value.trim();
        if (query.length > 0) {
            showStudentSuggestions(query);
        }
    });
    
    console.log('✅ Eventos de busca configurados');
}

// Mostrar sugestões de alunos
function showStudentSuggestions(query) {
    const suggestionsContainer = document.getElementById('studentSuggestions');
    if (!suggestionsContainer || !window.students) return;
    
    // Filtrar alunos que coincidem com a busca
    const filteredStudents = students.filter(student => {
        const searchTerms = [
            student.name.toLowerCase(),
            student.email.toLowerCase(),
            student.level.toLowerCase()
        ];
        
        const queryLower = query.toLowerCase();
        return searchTerms.some(term => term.includes(queryLower)) &&
               !isStudentAlreadySelected(student.email);
    });
    
    // Limpar sugestões
    suggestionsContainer.innerHTML = '';
    
    if (filteredStudents.length === 0) {
        suggestionsContainer.innerHTML = `
            <div class="no-suggestions">
                <i class="fas fa-search"></i>
                <span>Nenhum aluno encontrado para "${query}"</span>
            </div>
        `;
        suggestionsContainer.style.display = 'block';
        return;
    }
    
    // Mostrar apenas os 8 primeiros resultados
    const studentsToShow = filteredStudents.slice(0, 8);
    
    studentsToShow.forEach(student => {
        const suggestionItem = document.createElement('div');
        suggestionItem.className = 'suggestion-item';
        suggestionItem.innerHTML = `
            <div class="student-suggestion">
                <div class="student-info">
                    <div class="student-name">${student.name}</div>
                    <div class="student-details">
                        <span class="student-level">${student.level}</span>
                        <span class="student-email">${student.email}</span>
                    </div>
                </div>
                <div class="add-button">
                    <i class="fas fa-plus"></i>
                </div>
            </div>
        `;
        
        // Evento para adicionar aluno
        suggestionItem.addEventListener('click', function() {
            addStudentToSelection(student);
            clearSearchInput();
            hideSuggestions();
        });
        
        suggestionsContainer.appendChild(suggestionItem);
    });
    
    // Mostrar contador se há mais resultados
    if (filteredStudents.length > 8) {
        const moreResults = document.createElement('div');
        moreResults.className = 'more-results';
        moreResults.innerHTML = `
            <span>E mais ${filteredStudents.length - 8} aluno(s)... Continue digitando para refinar</span>
        `;
        suggestionsContainer.appendChild(moreResults);
    }
    
    suggestionsContainer.style.display = 'block';
}

// Verificar se aluno já está selecionado
function isStudentAlreadySelected(email) {
    return window.selectedStudentsForClass && 
           selectedStudentsForClass.some(student => student.email === email);
}

// Adicionar aluno à seleção
function addStudentToSelection(student) {
    if (!window.selectedStudentsForClass) {
        window.selectedStudentsForClass = [];
    }
    
    // Verificar se já não está selecionado
    if (isStudentAlreadySelected(student.email)) {
        return;
    }
    
    // Adicionar à lista
    selectedStudentsForClass.push({
        name: student.name,
        email: student.email,
        level: student.level
    });
    
    console.log('➕ Aluno adicionado:', student.name);
    
    // Atualizar interface
    updateSelectedStudentsDisplay();
    updateHiddenInput();
}

// Remover aluno da seleção
function removeStudentFromSelection(email) {
    if (!window.selectedStudentsForClass) return;
    
    const student = selectedStudentsForClass.find(s => s.email === email);
    if (student) {
        console.log('➖ Aluno removido:', student.name);
    }
    
    window.selectedStudentsForClass = selectedStudentsForClass.filter(s => s.email !== email);
    
    // Atualizar interface
    updateSelectedStudentsDisplay();
    updateHiddenInput();
}

// Atualizar exibição de alunos selecionados
function updateSelectedStudentsDisplay() {
    const tagsContainer = document.getElementById('selectedStudentsTags');
    const countElement = document.getElementById('selectedStudentsCount');
    const clearAllBtn = document.getElementById('clearAllStudentsBtn');
    
    if (!tagsContainer || !countElement) return;
    
    const selectedCount = selectedStudentsForClass ? selectedStudentsForClass.length : 0;
    
    // Atualizar contador
    countElement.textContent = selectedCount;
    
    // Mostrar/ocultar botão de limpar todos
    if (clearAllBtn) {
        clearAllBtn.style.display = selectedCount > 0 ? 'inline-flex' : 'none';
    }
    
    // Limpar container
    tagsContainer.innerHTML = '';
    
    if (selectedCount === 0) {
        tagsContainer.innerHTML = `
            <div class="no-students-selected">
                <i class="fas fa-users"></i>
                <span>Nenhum aluno selecionado ainda</span>
            </div>
        `;
        return;
    }
    
    // Criar tags dos alunos selecionados
    selectedStudentsForClass.forEach(student => {
        const tag = document.createElement('div');
        tag.className = 'student-tag';
        tag.innerHTML = `
            <div class="student-tag-info">
                <span class="student-tag-name">${student.name}</span>
                <span class="student-tag-level">${student.level}</span>
            </div>
            <button type="button" class="remove-student-btn" onclick="removeStudentFromSelection('${student.email}')" title="Remover aluno">
                <i class="fas fa-times"></i>
            </button>
        `;
        tagsContainer.appendChild(tag);
    });
}

// Atualizar input hidden com emails selecionados
function updateHiddenInput() {
    const hiddenInput = document.getElementById('selectedStudentsData');
    if (hiddenInput && selectedStudentsForClass) {
        const emails = selectedStudentsForClass.map(s => s.email);
        hiddenInput.value = JSON.stringify(emails);
    }
}

// Limpar campo de busca
function clearSearchInput() {
    const searchInput = document.getElementById('studentSearchInput');
    if (searchInput) {
        searchInput.value = '';
    }
}

// Ocultar sugestões
function hideSuggestions() {
    const suggestionsContainer = document.getElementById('studentSuggestions');
    if (suggestionsContainer) {
        suggestionsContainer.style.display = 'none';
    }
}

// Limpar todos os alunos selecionados
function clearAllSelectedStudents() {
    if (window.selectedStudentsForClass) {
        window.selectedStudentsForClass = [];
    }
    updateSelectedStudentsDisplay();
    updateHiddenInput();
    clearSearchInput();
    hideSuggestions();
    console.log('🧹 Todos os alunos removidos da seleção');
}

// Configurar formulário de aula
function setupAulaForm() {
    const form = document.getElementById('registroAulaForm');
    if (!form) return;
    
    try {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            registrarAula();
        });
    } catch (error) {
        console.error('❌ Erro ao configurar formulário:', error);
    }
}

// Registrar nova aula
function registrarAula() {
    console.log('💾 Registrando nova aula...');
    
    try {
        // Debug: Verificar estado antes do registro
        console.log('DEBUG: aulasDadas antes do registro:', window.aulasDadas);
        
        // Coletar dados do formulário
        const aulaData = document.getElementById('aulaData').value;
        const horaInicio = document.getElementById('aulaHoraInicio').value;
        const horaFim = document.getElementById('aulaHoraFim').value;
        const tipo = document.getElementById('aulaTipo').value;
        const nivel = document.getElementById('aulaNivel').value;
        const conteudo = document.getElementById('aulaConteudo').value;
        const materiais = document.getElementById('aulaMateriais').value;
        const status = document.getElementById('aulaStatus').value;
        const observacoes = document.getElementById('aulaObservacoes').value;
        
        // Debug: Mostrar dados coletados
        console.log('DEBUG: Dados coletados:', {
            aulaData, horaInicio, horaFim, tipo, nivel, conteudo, materiais, status, observacoes
        });
        
        // Coletar alunos selecionados do novo sistema de busca
        const alunosSelecionados = [];
        if (window.selectedStudentsForClass && selectedStudentsForClass.length > 0) {
            selectedStudentsForClass.forEach(student => {
                alunosSelecionados.push(student.email);
            });
        }
        
        console.log('DEBUG: Alunos selecionados:', alunosSelecionados);
        
        // Validações
        if (!aulaData || !horaInicio || !horaFim || !tipo || !conteudo || alunosSelecionados.length === 0) {
            showAlert('Por favor, preencha todos os campos obrigatórios!', 'danger');
            return;
        }
        
        if (horaFim <= horaInicio) {
            showAlert('O horário de término deve ser posterior ao horário de início!', 'danger');
            return;
        }
        
        // Calcular duração
        const inicio = new Date(`${aulaData}T${horaInicio}`);
        const fim = new Date(`${aulaData}T${horaFim}`);
        const duracao = Math.round((fim - inicio) / (1000 * 60)); // em minutos
        
        // Verificar se está editando uma aula existente
        const isEditando = window.editandoAulaId;
        let aulaProcessada;
        
        if (isEditando) {
            // MODO EDIÇÃO - Atualizar aula existente
            const aulaIndex = aulasDadas.findIndex(a => a.id === window.editandoAulaId);
            if (aulaIndex === -1) {
                showAlert('Aula não encontrada para edição!', 'danger');
                return;
            }
            
            // Manter dados originais e atualizar apenas os campos editados
            aulaProcessada = {
                ...aulasDadas[aulaIndex], // Manter dados originais
                data: aulaData,
                horaInicio: horaInicio,
                horaFim: horaFim,
                duracao: duracao,
                tipo: tipo,
                nivel: nivel,
                alunosParticipantes: alunosSelecionados,
                conteudo: conteudo,
                materiais: materiais,
                status: status,
                observacoes: observacoes,
                editadoEm: new Date().toISOString() // Adicionar timestamp da edição
            };
            
            // Substituir aula no array
            aulasDadas[aulaIndex] = aulaProcessada;
            console.log('DEBUG: Aula atualizada:', aulaProcessada);
            
        } else {
            // MODO CRIAÇÃO - Criar nova aula
            aulaProcessada = {
                id: generateId(),
                data: aulaData,
                horaInicio: horaInicio,
                horaFim: horaFim,
                duracao: duracao,
                tipo: tipo,
                nivel: nivel,
                alunosParticipantes: alunosSelecionados,
                conteudo: conteudo,
                materiais: materiais,
                status: status,
                observacoes: observacoes,
                criadoEm: new Date().toISOString(),
                professor: currentUser || 'Professor'
            };
            
            // Garantir que aulasDadas existe
            if (!window.aulasDadas) {
                console.log('⚠️ Criando array aulasDadas');
                window.aulasDadas = [];
            }
            
            // Adicionar à lista de aulas
            aulasDadas.push(aulaProcessada);
            console.log('DEBUG: Nova aula criada:', aulaProcessada);
        }
        
        console.log('DEBUG: aulasDadas após processar:', window.aulasDadas);
        
        // Salvar dados
        saveData();
        console.log('DEBUG: Dados salvos no localStorage');
        
        // Verificar se foi salvo corretamente
        const savedData = localStorage.getItem('aulasDadas');
        console.log('DEBUG: Dados no localStorage após salvar:', savedData);
        
        // Feedback personalizado baseado no modo
        if (isEditando) {
            showAlert('Aula atualizada com sucesso!', 'success');
            console.log('✅ Aula atualizada:', aulaProcessada);
            
            // Limpar modo de edição
            delete window.editandoAulaId;
            
            // Restaurar botão original
            const submitBtn = document.querySelector('#registroAulaForm button[type="submit"]');
            if (submitBtn) {
                submitBtn.innerHTML = '<i class="fas fa-plus"></i> Registrar Aula';
                submitBtn.className = 'btn btn-primary btn-block';
            }
            
            // Remover botão de cancelar se existir
            const cancelBtn = document.getElementById('cancelarEdicaoBtn');
            if (cancelBtn) {
                cancelBtn.remove();
            }
        } else {
            showAlert('Aula registrada com sucesso!', 'success');
            console.log('✅ Aula registrada:', aulaProcessada);
        }
        
        // Limpar formulário
        resetAulaForm();
        
        // Atualizar estatísticas
        updateAulasStats();
        
        // Força recarregar histórico independente da aba ativa
        console.log('🔄 Forçando reload do histórico...');
        setTimeout(() => {
            loadAulasHistorico();
        }, 100);
        
    } catch (error) {
        console.error('❌ Erro ao registrar aula:', error);
        showAlert('Erro ao registrar aula. Verifique o console.', 'danger');
    }
}

// Limpar formulário de aula
function resetAulaForm() {
    const form = document.getElementById('registroAulaForm');
    if (form) {
        form.reset();
        
        // Redefinir data atual
        const today = new Date().toISOString().split('T')[0];
        const aulaDataInput = document.getElementById('aulaData');
        if (aulaDataInput) {
            aulaDataInput.value = today;
        }
        
        // Limpar seleção de alunos no novo sistema
        if (window.selectedStudentsForClass) {
            window.selectedStudentsForClass = [];
            updateSelectedStudentsDisplay();
            updateHiddenInput();
            clearSearchInput();
        }
    }
}

// Atualizar estatísticas das aulas
function updateAulasStats() {
    console.log('📊 Atualizando estatísticas de aulas...');
    
    try {
        // Sempre recarregar dados primeiro
        reloadAulasFromStorage();
        
        if (!window.aulasDadas) {
            window.aulasDadas = [];
        }
        
        console.log('DEBUG Stats: aulasDadas.length =', aulasDadas.length);
        console.log('DEBUG Stats: Conteúdo aulasDadas =', aulasDadas);
        
        const hoje = new Date();
        const anoAtual = hoje.getFullYear();
        const mesAtual = hoje.getMonth(); // 0-11
        
        console.log('DEBUG Stats: Ano atual =', anoAtual, 'Mês atual =', mesAtual);
        
        // Filtrar aulas do mês atual - CORREÇÃO na lógica de data
        const aulasDoMes = aulasDadas.filter(aula => {
            try {
                // Forçar formato YYYY-MM-DD e adicionar timezone local
                const dataAula = new Date(aula.data + 'T12:00:00');
                const anoAula = dataAula.getFullYear();
                const mesAula = dataAula.getMonth();
                
                const isThisMonth = anoAula === anoAtual && mesAula === mesAtual;
                const isRealizada = aula.status === 'realizada';
                
                console.log(`DEBUG Stats: Aula ${aula.data} - Ano: ${anoAula}, Mês: ${mesAula}, ThisMonth: ${isThisMonth}, Realizada: ${isRealizada}`);
                
                return isThisMonth && isRealizada;
            } catch (error) {
                console.error('Erro ao processar data da aula:', aula.data, error);
                return false;
            }
        });
        
        console.log('DEBUG Stats: Aulas do mês filtradas =', aulasDoMes);
        
        // Calcular estatísticas
        const totalAulas = aulasDoMes.length;
        const totalMinutos = aulasDoMes.reduce((sum, aula) => sum + (aula.duracao || 0), 0);
        const totalHoras = Math.round(totalMinutos / 60 * 10) / 10; // Uma casa decimal
        
        // Contar alunos únicos atendidos
        const alunosUnicos = new Set();
        aulasDoMes.forEach(aula => {
            if (aula.alunosParticipantes) {
                aula.alunosParticipantes.forEach(email => alunosUnicos.add(email));
            }
        });
        
        console.log('DEBUG Stats: Calculadas =', { totalAulas, totalHoras, alunosUnicos: alunosUnicos.size });
        
        // MÚLTIPLAS TENTATIVAS para encontrar os elementos DOM
        let totalAulasElement = null;
        let horasMinistradas = null;
        let alunosAtendidos = null;
        
        // Tentativa 1: IDs diretos
        totalAulasElement = document.getElementById('totalAulasmes');
        horasMinistradas = document.getElementById('horasMinistradas');
        alunosAtendidos = document.getElementById('alunosAtendidos');
        
        // Tentativa 2: Busca por seletores alternativos
        if (!totalAulasElement) {
            totalAulasElement = document.querySelector('#totalAulasmes, [id="totalAulasmes"]');
        }
        if (!horasMinistradas) {
            horasMinistradas = document.querySelector('#horasMinistradas, [id="horasMinistradas"]');
        }
        if (!alunosAtendidos) {
            alunosAtendidos = document.querySelector('#alunosAtendidos, [id="alunosAtendidos"]');
        }
        
        // Tentativa 3: Busca dentro do container de aulas
        if (!totalAulasElement || !horasMinistradas || !alunosAtendidos) {
            const aulasContainer = document.querySelector('.aulas-stats-grid, .module-content');
            if (aulasContainer) {
                if (!totalAulasElement) totalAulasElement = aulasContainer.querySelector('#totalAulasmes');
                if (!horasMinistradas) horasMinistradas = aulasContainer.querySelector('#horasMinistradas');
                if (!alunosAtendidos) alunosAtendidos = aulasContainer.querySelector('#alunosAtendidos');
            }
        }
        
        console.log('DEBUG Stats: Elementos DOM =', {
            totalAulasElement: !!totalAulasElement,
            horasMinistradas: !!horasMinistradas, 
            alunosAtendidos: !!alunosAtendidos
        });
        
        // Se ainda não encontrou, aguardar um pouco e tentar novamente
        if (!totalAulasElement || !horasMinistradas || !alunosAtendidos) {
            console.log('⏳ Elementos não encontrados, tentando novamente em 100ms...');
            setTimeout(() => {
                updateAulasStats();
            }, 100);
            return;
        }
        
        // Atualizar interface
        if (totalAulasElement) {
            totalAulasElement.textContent = totalAulas;
            console.log('✅ Total aulas atualizado:', totalAulas);
        }
        if (horasMinistradas) {
            horasMinistradas.textContent = `${totalHoras}h`;
            console.log('✅ Horas ministradas atualizadas:', `${totalHoras}h`);
        }
        if (alunosAtendidos) {
            alunosAtendidos.textContent = alunosUnicos.size;
            console.log('✅ Alunos atendidos atualizados:', alunosUnicos.size);
        }
        
        console.log('✅ Estatísticas atualizadas com sucesso!');
        
    } catch (error) {
        console.error('❌ Erro ao atualizar estatísticas de aulas:', error);
    }
}

// Funções placeholder para outras abas - IMPLEMENTAÇÃO COMPLETA DOS FILTROS
function setupHistoricoFilters() {
    console.log('📋 Configurando filtros do histórico...');
    
    try {
        // Configurar filtro de mês
        setupMonthFilter();
        
        // Configurar eventos dos filtros - SEM aplicar automaticamente
        const filtroAluno = document.getElementById('filtroAlunoHistorico');
        const filtroTipo = document.getElementById('filtroTipoHistorico');
        const filtroMes = document.getElementById('filtroMesHistorico');
        
        // Remover eventos antigos se existirem
        if (filtroAluno) {
            filtroAluno.removeEventListener('input', aplicarFiltrosHistorico);
            filtroAluno.addEventListener('input', debounce(aplicarFiltrosHistorico, 300));
        }
        
        if (filtroTipo) {
            filtroTipo.removeEventListener('change', aplicarFiltrosHistorico);
            filtroTipo.addEventListener('change', aplicarFiltrosHistorico);
        }
        
        if (filtroMes) {
            filtroMes.removeEventListener('change', aplicarFiltrosHistorico);
            filtroMes.addEventListener('change', aplicarFiltrosHistorico);
        }
        
        // NÃO aplicar filtros automaticamente na configuração inicial
        console.log('✅ Filtros configurados com sucesso! (sem aplicar automaticamente)');
        
    } catch (error) {
        console.error('❌ Erro ao configurar filtros:', error);
    }
}

// Configurar opções do filtro de mês
function setupMonthFilter() {
    const filtroMes = document.getElementById('filtroMesHistorico');
    if (!filtroMes) return;
    
    // Limpar opções existentes (exceto a primeira)
    while (filtroMes.children.length > 1) {
        filtroMes.removeChild(filtroMes.lastChild);
    }
    
    // Buscar meses únicos das aulas
    const mesesUnicos = new Set();
    
    if (window.aulasDadas && aulasDadas.length > 0) {
        aulasDadas.forEach(aula => {
            try {
                const dataAula = new Date(aula.data + 'T12:00:00');
                const anoMes = `${dataAula.getFullYear()}-${String(dataAula.getMonth() + 1).padStart(2, '0')}`;
                mesesUnicos.add(anoMes);
            } catch (error) {
                console.warn('Data inválida encontrada:', aula.data);
            }
        });
    }
    
    // Converter para array e ordenar (mais recente primeiro)
    const mesesOrdenados = Array.from(mesesUnicos).sort((a, b) => b.localeCompare(a));
    
    // Obter mês atual
    const hoje = new Date();
    const mesAtual = `${hoje.getFullYear()}-${String(hoje.getMonth() + 1).padStart(2, '0')}`;
    
    // Adicionar opções ao select
    mesesOrdenados.forEach(anoMes => {
        const [ano, mes] = anoMes.split('-');
        const nomesMeses = [
            'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
            'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
        ];
        
        const option = document.createElement('option');
        option.value = anoMes;
        option.textContent = `${nomesMeses[parseInt(mes) - 1]} ${ano}`;
        filtroMes.appendChild(option);
    });
    
    // SELECIONAR MÊS ATUAL COMO PADRÃO (se existir aulas nesse mês)
    if (mesesUnicos.has(mesAtual)) {
        filtroMes.value = mesAtual;
        console.log('✅ Mês atual selecionado automaticamente:', mesAtual);
        
        // Aplicar filtro do mês atual automaticamente
        setTimeout(() => {
            aplicarFiltroMesAtual();
        }, 200);
    } else {
        console.log('⚠️ Nenhuma aula encontrada no mês atual:', mesAtual);
    }
}

// Aplicar apenas filtro do mês atual (sem afetar outros filtros)
function aplicarFiltroMesAtual() {
    console.log('📅 Aplicando filtro do mês atual...');
    
    try {
        // Recarregar dados se necessário
        if (!window.aulasDadas) {
            reloadAulasFromStorage();
        }
        
        if (!aulasDadas || aulasDadas.length === 0) {
            console.log('⚠️ Nenhuma aula para filtrar');
            return;
        }
        
        // Obter apenas o valor do filtro de mês
        const filtroMes = document.getElementById('filtroMesHistorico')?.value || '';
        
        if (!filtroMes) {
            console.log('⚠️ Filtro de mês não selecionado');
            return;
        }
        
        console.log('🎯 Filtrando por mês:', filtroMes);
        
        // Filtrar aulas apenas por mês
        const aulasFiltradas = aulasDadas.filter(aula => {
            try {
                const dataAula = new Date(aula.data + 'T12:00:00');
                const anoMes = `${dataAula.getFullYear()}-${String(dataAula.getMonth() + 1).padStart(2, '0')}`;
                return anoMes === filtroMes;
            } catch (error) {
                return false;
            }
        });
        
        console.log(`📊 Filtro do mês resultou em ${aulasFiltradas.length} de ${aulasDadas.length} aulas`);
        
        // Exibir aulas filtradas
        exibirAulasFiltradas(aulasFiltradas);
        
    } catch (error) {
        console.error('❌ Erro ao aplicar filtro do mês atual:', error);
    }
}

// Aplicar todos os filtros
function aplicarFiltrosHistorico() {
    console.log('🔍 Aplicando filtros do histórico...');
    
    try {
        // Recarregar dados se necessário
        if (!window.aulasDadas) {
            reloadAulasFromStorage();
        }
        
        if (!aulasDadas || aulasDadas.length === 0) {
            console.log('⚠️ Nenhuma aula para filtrar');
            return;
        }
        
        // Obter valores dos filtros
        const filtroAluno = document.getElementById('filtroAlunoHistorico')?.value?.toLowerCase() || '';
        const filtroTipo = document.getElementById('filtroTipoHistorico')?.value || '';
        const filtroMes = document.getElementById('filtroMesHistorico')?.value || '';
        
        console.log('🎯 Filtros aplicados:', { filtroAluno, filtroTipo, filtroMes });
        
        // Filtrar aulas
        let aulasFiltradas = [...aulasDadas];
        
        // Filtro por aluno
        if (filtroAluno) {
            aulasFiltradas = aulasFiltradas.filter(aula => {
                if (!aula.alunosParticipantes || aula.alunosParticipantes.length === 0) {
                    return false;
                }
                
                return aula.alunosParticipantes.some(email => {
                    // Buscar nome do aluno
                    const student = window.students ? students.find(s => s.email === email) : null;
                    const nomeAluno = student ? student.name : email.split('@')[0];
                    
                    // Verificar se o termo de busca está no nome ou email
                    return nomeAluno.toLowerCase().includes(filtroAluno) || 
                           email.toLowerCase().includes(filtroAluno);
                });
            });
        }
        
        // Filtro por tipo
        if (filtroTipo) {
            aulasFiltradas = aulasFiltradas.filter(aula => aula.tipo === filtroTipo);
        }
        
        // Filtro por mês
        if (filtroMes) {
            aulasFiltradas = aulasFiltradas.filter(aula => {
                try {
                    const dataAula = new Date(aula.data + 'T12:00:00');
                    const anoMes = `${dataAula.getFullYear()}-${String(dataAula.getMonth() + 1).padStart(2, '0')}`;
                    return anoMes === filtroMes;
                } catch (error) {
                    return false;
                }
            });
        }
        
        console.log(`📊 Filtros resultaram em ${aulasFiltradas.length} de ${aulasDadas.length} aulas`);
        
        // Exibir aulas filtradas
        exibirAulasFiltradas(aulasFiltradas);
        
    } catch (error) {
        console.error('❌ Erro ao aplicar filtros:', error);
    }
}

// Exibir aulas filtradas
function exibirAulasFiltradas(aulasFiltradas) {
    const container = document.getElementById('aulasHistoricoContainer');
    if (!container) {
        console.error('❌ Container do histórico não encontrado');
        return;
    }
    
    // Limpar container
    container.innerHTML = '';
    container.className = 'aulas-historico-container-compact';
    
    if (aulasFiltradas.length === 0) {
        container.innerHTML = `
            <div class="no-results-message">
                <i class="fas fa-search"></i>
                <p>Nenhuma aula encontrada com os filtros aplicados.</p>
                <small>Tente ajustar os critérios de busca</small>
            </div>
        `;
        return;
    }
    
    // Ordenar por data (mais recentes primeiro)
    const aulasOrdenadas = [...aulasFiltradas].sort((a, b) => new Date(b.data) - new Date(a.data));
    
    // Criar cards
    aulasOrdenadas.forEach((aula, index) => {
        const aulaCard = createAulaCard(aula);
        container.appendChild(aulaCard);
    });
    
    console.log(`✅ ${aulasFiltradas.length} aulas exibidas no histórico`);
}

// Função debounce para otimizar busca em tempo real
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Limpar todos os filtros
function limparFiltrosHistorico() {
    console.log('🧹 Limpando filtros do histórico...');
    
    const filtroAluno = document.getElementById('filtroAlunoHistorico');
    const filtroTipo = document.getElementById('filtroTipoHistorico');
    const filtroMes = document.getElementById('filtroMesHistorico');
    
    if (filtroAluno) filtroAluno.value = '';
    if (filtroTipo) filtroTipo.value = '';
    if (filtroMes) filtroMes.value = '';
    
    // Recarregar histórico completo
    loadAulasHistorico();
}

// Carregar histórico de aulas - FUNÇÃO CORRIGIDA
function loadAulasHistorico() {
    console.log('🔄 Carregando histórico de aulas...');
    
    const container = document.getElementById('aulasHistoricoContainer');
    if (!container) {
        console.error('❌ Container aulasHistoricoContainer não encontrado!');
        return;
    }
    
    try {
        // SEMPRE recarregar dados do localStorage antes de mostrar
        reloadAulasFromStorage();
        
        // Limpar container completamente
        container.innerHTML = '';
        container.className = 'aulas-historico-container-compact';
        
        // Debug: Verificar dados
        console.log('DEBUG: window.aulasDadas existe?', !!window.aulasDadas);
        console.log('DEBUG: aulasDadas.length:', window.aulasDadas ? window.aulasDadas.length : 'N/A');
        console.log('DEBUG: Conteúdo de aulasDadas:', window.aulasDadas);
        
        if (!window.aulasDadas) {
            console.log('⚠️ Inicializando array aulasDadas vazio');
            window.aulasDadas = [];
        }
        
        if (aulasDadas.length === 0) {
            console.log('📝 Nenhuma aula encontrada');
            container.innerHTML = '<div class="no-aulas-message"><i class="fas fa-calendar-times"></i><p>Nenhuma aula registrada ainda.</p><small>Registre sua primeira aula na aba "Registrar Aula"</small></div>';
            // Configurar filtros mesmo sem aulas
            setTimeout(() => {
                setupHistoricoFilters();
            }, 100);
            return;
        }
        
        console.log(`📚 Carregando ${aulasDadas.length} aulas no histórico (layout compacto)`);
        
        // Ordenar aulas por data (mais recentes primeiro)
        const aulasOrdenadas = [...aulasDadas].sort((a, b) => new Date(b.data) - new Date(a.data));
        
        aulasOrdenadas.forEach((aula, index) => {
            console.log(`📋 Criando card compacto para aula ${index + 1}:`, aula);
            const aulaCard = createAulaCard(aula);
            container.appendChild(aulaCard);
        });
        
        console.log('✅ Histórico carregado com sucesso (layout compacto)');
        
        // Configurar filtros APÓS carregar as aulas
        setTimeout(() => {
            setupHistoricoFilters();
        }, 100);
        
    } catch (error) {
        console.error('❌ Erro ao carregar histórico de aulas:', error);
        container.innerHTML = '<div class="error-message"><i class="fas fa-exclamation-triangle"></i><p>Erro ao carregar histórico de aulas.</p></div>';
    }
}

// Função de debug manual
function debugAulasSystem() {
    console.log('=== DEBUG SISTEMA DE AULAS ===');
    console.log('1. window.aulasDadas existe?', !!window.aulasDadas);
    console.log('2. Conteúdo de aulasDadas:', window.aulasDadas);
    console.log('3. Quantidade de aulas:', window.aulasDadas ? window.aulasDadas.length : 'N/A');
    
    // Verificar localStorage
    const storedData = localStorage.getItem('aulasDadas');
    console.log('4. Dados no localStorage:', storedData);
    
    if (storedData) {
        const parsedData = JSON.parse(storedData);
        console.log('5. Dados parseados do localStorage:', parsedData);
        console.log('6. Quantidade no localStorage:', parsedData.length);
    }
    
    // Verificar elementos DOM
    const container = document.getElementById('aulasHistoricoContainer');
    console.log('7. Container histórico existe?', !!container);
    
    const registrarTab = document.getElementById('registrarAula');
    const historicoTab = document.getElementById('historicoAulas');
    console.log('8. Tab registrar existe?', !!registrarTab);
    console.log('9. Tab histórico existe?', !!historicoTab);
    
    if (historicoTab) {
        console.log('10. Tab histórico está ativa?', historicoTab.classList.contains('active'));
    }
    
    // Verificar botões de navegação
    const navButtons = document.querySelectorAll('.aulas-tab');
    console.log('11. Botões de navegação encontrados:', navButtons.length);
    navButtons.forEach((btn, index) => {
        console.log(`    Botão ${index + 1}:`, btn.textContent.trim(), 'onclick:', btn.getAttribute('onclick'));
    });
    
    console.log('=== FIM DEBUG ===');
}

// Função para recarregar manualmente o histórico
function forceReloadHistorico() {
    console.log('🔄 Forçando recarga manual do histórico...');
    reloadAulasFromStorage();
    loadAulasHistorico();
}

// Função para simular navegação para histórico
function debugNavigateToHistorico() {
    console.log('🧪 Simulando navegação para histórico...');
    showAulasSubTab('historico');
}

// Função para forçar atualização das estatísticas
function forceUpdateStats() {
    console.log('🔄 Forçando atualização das estatísticas...');
    updateAulasStats();
}

// Função de emergência para atualizar estatísticas manualmente
function emergencyUpdateStats() {
    console.log('🚨 ATUALIZAÇÃO DE EMERGÊNCIA DAS ESTATÍSTICAS');
    
    try {
        // Recarregar dados
        reloadAulasFromStorage();
        
        if (!window.aulasDadas || aulasDadas.length === 0) {
            console.log('❌ Nenhuma aula encontrada');
            return;
        }
        
        // Filtrar aulas do mês atual
        const hoje = new Date();
        const anoAtual = hoje.getFullYear();
        const mesAtual = hoje.getMonth();
        
        const aulasDoMes = aulasDadas.filter(aula => {
            const dataAula = new Date(aula.data + 'T12:00:00');
            const anoAula = dataAula.getFullYear();
            const mesAula = dataAula.getMonth();
            return anoAula === anoAtual && mesAula === mesAtual && aula.status === 'realizada';
        });
        
        // Calcular estatísticas
        const totalAulas = aulasDoMes.length;
        const totalMinutos = aulasDoMes.reduce((sum, aula) => sum + (aula.duracao || 0), 0);
        const totalHoras = Math.round(totalMinutos / 60 * 10) / 10;
        
        const alunosUnicos = new Set();
        aulasDoMes.forEach(aula => {
            if (aula.alunosParticipantes) {
                aula.alunosParticipantes.forEach(email => alunosUnicos.add(email));
            }
        });
        
        console.log('🧮 Estatísticas calculadas:', {
            totalAulas,
            totalHoras: totalHoras + 'h',
            alunosUnicos: alunosUnicos.size
        });
        
        // Buscar TODOS os possíveis elementos
        const allPossibleSelectors = [
            '#totalAulasmes',
            '.stat-number#totalAulasmes',
            '[id="totalAulasmes"]',
            '.aulas-stats-grid #totalAulasmes',
            '.stats-grid #totalAulasmes'
        ];
        
        let totalElement = null;
        for (const selector of allPossibleSelectors) {
            totalElement = document.querySelector(selector);
            if (totalElement) {
                console.log('✅ Elemento totalAulas encontrado com:', selector);
                break;
            }
        }
        
        const horasSelectors = [
            '#horasMinistradas',
            '.stat-number#horasMinistradas',
            '[id="horasMinistradas"]',
            '.aulas-stats-grid #horasMinistradas',
            '.stats-grid #horasMinistradas'
        ];
        
        let horasElement = null;
        for (const selector of horasSelectors) {
            horasElement = document.querySelector(selector);
            if (horasElement) {
                console.log('✅ Elemento horas encontrado com:', selector);
                break;
            }
        }
        
        const alunosSelectors = [
            '#alunosAtendidos',
            '.stat-number#alunosAtendidos',
            '[id="alunosAtendidos"]',
            '.aulas-stats-grid #alunosAtendidos',
            '.stats-grid #alunosAtendidos'
        ];
        
        let alunosElement = null;
        for (const selector of alunosSelectors) {
            alunosElement = document.querySelector(selector);
            if (alunosElement) {
                console.log('✅ Elemento alunos encontrado com:', selector);
                break;
            }
        }
        
        // Atualizar elementos se encontrados
        if (totalElement) {
            totalElement.textContent = totalAulas;
            totalElement.style.color = '#28a745';
            totalElement.style.fontWeight = 'bold';
            console.log('🎯 Total aulas atualizado para:', totalAulas);
        } else {
            console.log('❌ Elemento totalAulas não encontrado');
        }
        
        if (horasElement) {
            horasElement.textContent = totalHoras + 'h';
            horasElement.style.color = '#28a745';
            horasElement.style.fontWeight = 'bold';
            console.log('⏰ Horas atualizadas para:', totalHoras + 'h');
        } else {
            console.log('❌ Elemento horas não encontrado');
        }
        
        if (alunosElement) {
            alunosElement.textContent = alunosUnicos.size;
            alunosElement.style.color = '#28a745';
            alunosElement.style.fontWeight = 'bold';
            console.log('👥 Alunos atualizados para:', alunosUnicos.size);
        } else {
            console.log('❌ Elemento alunos não encontrado');
        }
        
        console.log('🚨 Atualização de emergência concluída!');
        
    } catch (error) {
        console.error('💥 Erro na atualização de emergência:', error);
    }
}

// Função de emergência para forçar carregamento do histórico
function emergencyFixHistorico() {
    console.log('🚨 FUNÇÃO DE EMERGÊNCIA - CORRIGINDO HISTÓRICO');
    
    try {
        // 1. Recarregar dados do localStorage
        console.log('1. Recarregando dados...');
        reloadAulasFromStorage();
        
        // 2. Verificar se temos aulas
        if (!window.aulasDadas || aulasDadas.length === 0) {
            console.log('❌ Nenhuma aula encontrada no localStorage');
            const storedData = localStorage.getItem('aulasDadas');
            if (storedData) {
                console.log('🔧 Tentando reparar dados...');
                window.aulasDadas = JSON.parse(storedData);
                console.log('✅ Dados reparados:', aulasDadas.length, 'aulas');
            } else {
                console.log('❌ Nenhum dado no localStorage');
                return;
            }
        }
        
        // 3. Encontrar container
        const container = document.getElementById('aulasHistoricoContainer');
        if (!container) {
            console.log('❌ Container não encontrado');
            return;
        }
        
        // 4. Limpar e recriar cards
        console.log('2. Limpando container...');
        container.innerHTML = '';
        container.className = 'aulas-historico-container-compact';
        
        console.log('3. Criando cards das aulas...');
        const aulasOrdenadas = [...aulasDadas].sort((a, b) => new Date(b.data) - new Date(a.data));
        
        aulasOrdenadas.forEach((aula, index) => {
            try {
                const aulaCard = createAulaCard(aula);
                container.appendChild(aulaCard);
                console.log(`   ✅ Card ${index + 1} criado`);
            } catch (error) {
                console.error(`   ❌ Erro no card ${index + 1}:`, error);
            }
        });
        
        // 5. Configurar filtros
        console.log('4. Configurando filtros...');
        setTimeout(() => {
            setupHistoricoFilters();
        }, 100);
        
        console.log('🚨 EMERGÊNCIA CONCLUÍDA! Histórico corrigido com', aulasDadas.length, 'aulas');
        
    } catch (error) {
        console.error('💥 ERRO NA EMERGÊNCIA:', error);
    }
}

// Adicionar todas as funções principais ao escopo global
if (typeof window !== 'undefined') {
    window.initializeAulasModule = initializeAulasModule;
    window.showAulasSubTab = showAulasSubTab;
    window.registrarAula = registrarAula;
    window.updateAulasStats = updateAulasStats;
    window.loadAulasHistorico = loadAulasHistorico;
    window.aplicarFiltrosHistorico = aplicarFiltrosHistorico;
    window.aplicarFiltroMesAtual = aplicarFiltroMesAtual;
    window.limparFiltrosHistorico = limparFiltrosHistorico;
    window.reloadAulasFromStorage = reloadAulasFromStorage;
    window.debugAulasSystem = debugAulasSystem;
    window.forceReloadHistorico = forceReloadHistorico;
    window.emergencyUpdateStats = emergencyUpdateStats;
    window.emergencyFixHistorico = emergencyFixHistorico;
    window.fixHistoricoAgora = fixHistoricoAgora;
    // Novas funções de edição e remoção
    window.editarAula = editarAula;
    window.removerAula = removerAula;
    window.preencherFormularioEdicao = preencherFormularioEdicao;
    window.cancelarEdicaoAula = cancelarEdicaoAula;
    // Funções do sistema de busca inteligente de alunos
    window.setupStudentSearchEvents = setupStudentSearchEvents;
    window.showStudentSuggestions = showStudentSuggestions;
    window.addStudentToSelection = addStudentToSelection;
    window.removeStudentFromSelection = removeStudentFromSelection;
    window.updateSelectedStudentsDisplay = updateSelectedStudentsDisplay;
    window.clearAllSelectedStudents = clearAllSelectedStudents;
    window.isStudentAlreadySelected = isStudentAlreadySelected;
    window.updateHiddenInput = updateHiddenInput;
    window.clearSearchInput = clearSearchInput;
    window.hideSuggestions = hideSuggestions;
    // Funções do calendário
    window.loadCalendarioAulas = loadCalendarioAulas;
    window.updateCalendarioHeader = updateCalendarioHeader;
    window.navegarMesCalendario = navegarMesCalendario;
    window.renderCalendario = renderCalendario;
    window.createDiaCalendario = createDiaCalendario;
    window.showAulaDetails = showAulaDetails;
    window.closeAulaDetailsModal = closeAulaDetailsModal;
    window.showDayDetails = showDayDetails;
    window.closeDayDetailsModal = closeDayDetailsModal;
    window.adicionarAulaNoDia = adicionarAulaNoDia;
    // Funções placeholder
    window.loadPlanejamentos = loadPlanejamentos;
    window.gerarRelatorioAulas = gerarRelatorioAulas;
    window.showAdicionarPlanejamentoModal = showAdicionarPlanejamentoModal;
}

console.log('✅ Sistema de Controle de Aulas carregado!');
console.log('💡 Para debug, digite no console: debugAulasSystem()');
console.log('💡 Para recarregar histórico: forceReloadHistorico()');
console.log('💡 Para testar navegação: debugNavigateToHistorico()');
console.log('💡 Para recarregar dados: reloadAulasFromStorage()');
console.log('💡 Para atualizar estatísticas: forceUpdateStats()');
console.log('🚨 Para emergência: emergencyUpdateStats()');
console.log('🆘 EMERGÊNCIA HISTÓRICO: emergencyFixHistorico()');

// Criar card da aula - LAYOUT COMPACTO COM TRATAMENTO DE ERROS
function createAulaCard(aula) {
    const card = document.createElement('div');
    card.className = 'aula-card-compact';
    
    try {
        // Verificar se a aula tem dados básicos
        if (!aula) {
            throw new Error('Aula é null ou undefined');
        }
        
        if (!aula.id || !aula.data) {
            throw new Error('Aula sem dados essenciais (id ou data)');
        }
        
        // Buscar nomes dos alunos com tratamento de erro
        let nomesAlunos = 'Nenhum aluno';
        try {
            if (aula.alunosParticipantes && aula.alunosParticipantes.length > 0) {
                nomesAlunos = aula.alunosParticipantes.map(email => {
                    try {
                        const student = window.students ? students.find(s => s.email === email) : null;
                        return student ? student.name : email.split('@')[0];
                    } catch (err) {
                        console.warn('Erro ao processar aluno:', email, err);
                        return email;
                    }
                }).join(', ');
                
                // Limitar tamanho se muito longo
                if (nomesAlunos.length > 30) {
                    nomesAlunos = nomesAlunos.substring(0, 27) + '...';
                }
            }
        } catch (err) {
            console.warn('Erro ao processar alunos participantes:', err);
            nomesAlunos = 'Erro ao carregar alunos';
        }
        
        // Ícone do tipo de aula
        const tipoIcons = {
            'individual': 'fas fa-user',
            'grupo': 'fas fa-users',
            'reposicao': 'fas fa-redo',
            'avaliacao': 'fas fa-clipboard-check',
            'conversacao': 'fas fa-comments'
        };
        
        // Status da aula
        const statusColors = {
            'realizada': 'success',
            'agendada': 'info',
            'cancelada': 'danger'
        };
        
        const statusLabels = {
            'realizada': 'REALIZADA',
            'agendada': 'AGENDADA',
            'cancelada': 'CANCELADA'
        };
        
        // Formatar duração com fallback
        const duracao = aula.duracao ? `${aula.duracao}min` : '60min';
        
        // Tipo de aula com fallback
        const tipoLabel = aula.tipo ? aula.tipo.charAt(0).toUpperCase() + aula.tipo.slice(1) : 'Individual';
        
        // Formatear data com tratamento de erro
        let dataFormatada = 'Data inválida';
        try {
            if (typeof formatDate === 'function') {
                dataFormatada = formatDate(aula.data);
            } else {
                // Fallback simples
                const date = new Date(aula.data + 'T12:00:00');
                dataFormatada = date.toLocaleDateString('pt-BR');
            }
        } catch (err) {
            console.warn('Erro ao formatar data:', aula.data, err);
            dataFormatada = aula.data || 'Data inválida';
        }
        
        card.innerHTML = `
            <div class="aula-compact-header">
                <div class="aula-compact-main">
                    <div class="aula-compact-date">
                        <i class="fas fa-calendar-alt"></i>
                        <span class="date-text">${dataFormatada}</span>
                    </div>
                    <div class="aula-compact-time">
                        <i class="fas fa-clock"></i>
                        <span class="time-text">${aula.horaInicio || '00:00'}-${aula.horaFim || '00:00'}</span>
                        <span class="duration-text">(${duracao})</span>
                    </div>
                </div>
                <div class="aula-compact-status">
                    <span class="status-badge status-${statusColors[aula.status] || 'info'}">${statusLabels[aula.status] || aula.status || 'PENDENTE'}</span>
                </div>
            </div>
            
            <div class="aula-compact-body">
                <div class="aula-compact-info">
                    <div class="info-item">
                        <i class="${tipoIcons[aula.tipo] || 'fas fa-chalkboard-teacher'}"></i>
                        <span class="info-label">${tipoLabel}</span>
                        ${aula.nivel ? `<span class="nivel-badge-compact">${aula.nivel}</span>` : ''}
                    </div>
                    <div class="info-item">
                        <i class="fas fa-users"></i>
                        <span class="info-text">${nomesAlunos}</span>
                    </div>
                    <div class="info-item">
                        <i class="fas fa-book-open"></i>
                        <span class="info-text">${aula.conteudo || 'Não informado'}</span>
                    </div>
                    ${aula.materiais ? `
                    <div class="info-item">
                        <i class="fas fa-file-alt"></i>
                        <span class="info-text">${aula.materiais}</span>
                    </div>` : ''}
                    ${aula.observacoes ? `
                    <div class="info-item obs-item">
                        <i class="fas fa-sticky-note"></i>
                        <span class="info-text obs-text">${aula.observacoes}</span>
                    </div>` : ''}
                </div>
                
                <div class="aula-compact-actions">
                    <button class="btn-compact btn-edit" onclick="editarAula('${aula.id || ''}')" title="Editar">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn-compact btn-delete" onclick="removerAula('${aula.id || ''}')" title="Remover">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `;
        
    } catch (error) {
        console.error('❌ Erro ao criar card da aula:', error, 'Dados da aula:', aula);
        card.className = 'aula-card-compact error';
        card.innerHTML = `
            <div class="aula-compact-header">
                <div class="error-content">
                    <i class="fas fa-exclamation-triangle"></i>
                    <span>Erro ao exibir aula (ID: ${aula?.id || 'desconhecido'})</span>
                </div>
            </div>
        `;
    }
    
    return card;
}

// FUNÇÃO DE CORREÇÃO DIRETA - Execute no console: fixHistoricoAgora()
function fixHistoricoAgora() {
    console.log('🔧 CORREÇÃO DIRETA DO HISTÓRICO');
    
    // 1. Forçar carregamento dos dados
    const storedData = localStorage.getItem('aulasDadas');
    if (!storedData) {
        console.log('❌ Nenhum dado encontrado no localStorage');
        return;
    }
    
    window.aulasDadas = JSON.parse(storedData);
    console.log('✅ Dados carregados:', window.aulasDadas.length, 'aulas');
    
    // 2. Encontrar container
    const container = document.getElementById('aulasHistoricoContainer');
    if (!container) {
        console.log('❌ Container não encontrado');
        return;
    }
    
    // 3. Limpar container
    container.innerHTML = '';
    container.className = 'aulas-historico-container-compact';
    
    // 4. Criar cards simples (sem função complexa)
    window.aulasDadas.forEach((aula, index) => {
        const card = document.createElement('div');
        card.className = 'aula-card-compact';
        
        // Dados seguros
        const data = aula.data || 'Data inválida';
        const inicio = aula.horaInicio || '00:00';
        const fim = aula.horaFim || '00:00';
        const tipo = aula.tipo || 'individual';
        const nivel = aula.nivel || '';
        const conteudo = aula.conteudo || 'Não informado';
        const status = aula.status || 'realizada';
        
        // Alunos
        let alunos = 'Nenhum aluno';
        if (aula.alunosParticipantes && aula.alunosParticipantes.length > 0) {
            alunos = aula.alunosParticipantes.map(email => {
                const student = window.students ? students.find(s => s.email === email) : null;
                return student ? student.name : email.split('@')[0];
            }).join(', ');
        }
        
        card.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center; padding: 15px; background: #f8f9fa; border-bottom: 1px solid #dee2e6;">
                <div>
                    <strong>${data} - ${inicio} às ${fim}</strong>
                    <span style="margin-left: 15px; padding: 4px 8px; background: #28a745; color: white; border-radius: 12px; font-size: 11px;">${status.toUpperCase()}</span>
                </div>
                <div>
                    <span style="padding: 3px 8px; background: #007bff; color: white; border-radius: 8px; font-size: 11px;">${nivel}</span>
                </div>
            </div>
            <div style="padding: 15px;">
                <div style="margin-bottom: 8px;"><i class="fas fa-user"></i> <strong>Tipo:</strong> ${tipo}</div>
                <div style="margin-bottom: 8px;"><i class="fas fa-users"></i> <strong>Alunos:</strong> ${alunos}</div>
                <div style="margin-bottom: 8px;"><i class="fas fa-book"></i> <strong>Conteúdo:</strong> ${conteudo}</div>
                ${aula.materiais ? `<div style="margin-bottom: 8px;"><i class="fas fa-file"></i> <strong>Materiais:</strong> ${aula.materiais}</div>` : ''}
                ${aula.observacoes ? `<div style="margin-bottom: 8px;"><i class="fas fa-note"></i> <strong>Obs:</strong> ${aula.observacoes}</div>` : ''}
                <div style="margin-top: 15px; text-align: right;">
                    <button onclick="editarAula('${aula.id}')" style="margin-right: 5px; padding: 5px 10px; background: #ffc107; border: none; border-radius: 4px; cursor: pointer;">✏️ Editar</button>
                    <button onclick="removerAula('${aula.id}')" style="padding: 5px 10px; background: #dc3545; color: white; border: none; border-radius: 4px; cursor: pointer;">🗑️ Remover</button>
                </div>
            </div>
        `;
        
        container.appendChild(card);
        console.log(`✅ Card ${index + 1} criado`);
    });
    
    console.log('🎉 HISTÓRICO CORRIGIDO! Total:', window.aulasDadas.length, 'aulas exibidas');
}

// Função para editar aula
function editarAula(aulaId) {
    console.log('✏️ Editando aula:', aulaId);
    
    try {
        // Recarregar dados
        reloadAulasFromStorage();
        
        if (!window.aulasDadas || aulasDadas.length === 0) {
            showAlert('Nenhuma aula encontrada!', 'warning');
            return;
        }
        
        // Encontrar a aula
        const aula = aulasDadas.find(a => a.id === aulaId);
        if (!aula) {
            showAlert('Aula não encontrada!', 'danger');
            return;
        }
        
        console.log('📋 Aula encontrada:', aula);
        
        // Mudar para aba de registro
        showAulasSubTab('registrar');
        
        // Aguardar um pouco para garantir que a aba foi carregada
        setTimeout(() => {
            preencherFormularioEdicao(aula);
        }, 300);
        
    } catch (error) {
        console.error('❌ Erro ao editar aula:', error);
        showAlert('Erro ao editar aula!', 'danger');
    }
}

// Preencher formulário com dados da aula para edição
function preencherFormularioEdicao(aula) {
    console.log('📝 Preenchendo formulário com dados da aula:', aula);
    
    try {
        // Preencher campos básicos
        const aulaData = document.getElementById('aulaData');
        const horaInicio = document.getElementById('aulaHoraInicio');
        const horaFim = document.getElementById('aulaHoraFim');
        const tipo = document.getElementById('aulaTipo');
        const nivel = document.getElementById('aulaNivel');
        const conteudo = document.getElementById('aulaConteudo');
        const materiais = document.getElementById('aulaMateriais');
        const status = document.getElementById('aulaStatus');
        const observacoes = document.getElementById('aulaObservacoes');
        
        if (aulaData) aulaData.value = aula.data || '';
        if (horaInicio) horaInicio.value = aula.horaInicio || '';
        if (horaFim) horaFim.value = aula.horaFim || '';
        if (tipo) tipo.value = aula.tipo || 'individual';
        if (nivel) nivel.value = aula.nivel || '';
        if (conteudo) conteudo.value = aula.conteudo || '';
        if (materiais) materiais.value = aula.materiais || '';
        if (status) status.value = aula.status || 'realizada';
        if (observacoes) observacoes.value = aula.observacoes || '';
        
        // Carregar alunos participantes no novo sistema de busca
        if (aula.alunosParticipantes && aula.alunosParticipantes.length > 0) {
            // Limpar seleção atual
            if (window.selectedStudentsForClass) {
                window.selectedStudentsForClass = [];
            } else {
                window.selectedStudentsForClass = [];
            }
            
            // Adicionar alunos participantes
            aula.alunosParticipantes.forEach(email => {
                const student = window.students ? students.find(s => s.email === email) : null;
                if (student) {
                    selectedStudentsForClass.push({
                        name: student.name,
                        email: student.email,
                        level: student.level
                    });
                }
            });
            
            // Atualizar interface
            updateSelectedStudentsDisplay();
            updateHiddenInput();
        }
        
        // Marcar que está em modo de edição
        window.editandoAulaId = aula.id;
        
        // Alterar o texto do botão de envio
        const submitBtn = document.querySelector('#registroAulaForm button[type="submit"]');
        if (submitBtn) {
            submitBtn.innerHTML = '<i class="fas fa-save"></i> Atualizar Aula';
            submitBtn.className = 'btn btn-warning btn-block';
        }
        
        // Adicionar botão de cancelar edição
        if (!document.getElementById('cancelarEdicaoBtn')) {
            const cancelBtn = document.createElement('button');
            cancelBtn.id = 'cancelarEdicaoBtn';
            cancelBtn.type = 'button';
            cancelBtn.className = 'btn btn-secondary btn-block mt-2';
            cancelBtn.innerHTML = '<i class="fas fa-times"></i> Cancelar Edição';
            cancelBtn.onclick = cancelarEdicaoAula;
            
            if (submitBtn && submitBtn.parentNode) {
                submitBtn.parentNode.insertBefore(cancelBtn, submitBtn.nextSibling);
            }
        }
        
        console.log('✅ Formulário preenchido para edição');
        showAlert('Aula carregada para edição! Modifique os dados e clique em "Atualizar".', 'info');
        
    } catch (error) {
        console.error('❌ Erro ao preencher formulário:', error);
        showAlert('Erro ao carregar dados da aula!', 'danger');
    }
}

// Cancelar edição de aula
function cancelarEdicaoAula() {
    console.log('❌ Cancelando edição de aula');
    
    // Remover modo de edição
    delete window.editandoAulaId;
    
    // Restaurar botão de envio
    const submitBtn = document.querySelector('#registroAulaForm button[type="submit"]');
    if (submitBtn) {
        submitBtn.innerHTML = '<i class="fas fa-plus"></i> Registrar Aula';
        submitBtn.className = 'btn btn-primary btn-block';
    }
    
    // Remover botão de cancelar
    const cancelBtn = document.getElementById('cancelarEdicaoBtn');
    if (cancelBtn) {
        cancelBtn.remove();
    }
    
    // Limpar formulário
    resetAulaForm();
    
    showAlert('Edição cancelada!', 'info');
}

// Função para remover aula
function removerAula(aulaId) {
    console.log('🗑️ Removendo aula:', aulaId);
    
    try {
        // Confirmar remoção
        if (!confirm('Tem certeza que deseja remover esta aula?\n\nEsta ação não pode ser desfeita!')) {
            return;
        }
        
        // Recarregar dados
        reloadAulasFromStorage();
        
        if (!window.aulasDadas || aulasDadas.length === 0) {
            showAlert('Nenhuma aula encontrada!', 'warning');
            return;
        }
        
        // Encontrar índice da aula
        const aulaIndex = aulasDadas.findIndex(a => a.id === aulaId);
        if (aulaIndex === -1) {
            showAlert('Aula não encontrada!', 'danger');
            return;
        }
        
        // Obter dados da aula antes de remover (para mostrar confirmação)
        const aulaRemovida = aulasDadas[aulaIndex];
        
        // Remover aula do array
        aulasDadas.splice(aulaIndex, 1);
        
        // Salvar dados atualizados
        saveData();
        
        console.log('✅ Aula removida:', aulaRemovida);
        
        // Feedback
        showAlert(`Aula de ${aulaRemovida.data} removida com sucesso!`, 'success');
        
        // Atualizar estatísticas
        updateAulasStats();
        
        // Recarregar histórico
        setTimeout(() => {
            loadAulasHistorico();
        }, 100);
        
    } catch (error) {
        console.error('❌ Erro ao remover aula:', error);
        showAlert('Erro ao remover aula!', 'danger');
    }
}

// Placeholder functions for other tabs - IMPLEMENTAÇÃO COMPLETA DO CALENDÁRIO
function loadCalendarioAulas() {
    console.log('📅 Carregando calendário de aulas...');
    
    try {
        // Inicializar data atual se não existir
        if (!window.calendarioCurrentDate) {
            window.calendarioCurrentDate = new Date();
        }
        
        // Atualizar cabeçalho do mês/ano
        updateCalendarioHeader();
        
        // Renderizar calendário
        renderCalendario();
        
        console.log('✅ Calendário carregado com sucesso');
        
    } catch (error) {
        console.error('❌ Erro ao carregar calendário:', error);
        const container = document.getElementById('calendarioContainer');
        if (container) {
            container.innerHTML = '<div class="error-message"><i class="fas fa-exclamation-triangle"></i><p>Erro ao carregar calendário.</p></div>';
        }
    }
}

// Atualizar cabeçalho do calendário
function updateCalendarioHeader() {
    const mesAnoElement = document.getElementById('mesAnoCalendario');
    if (!mesAnoElement || !window.calendarioCurrentDate) return;
    
    const meses = [
        'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
        'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
    ];
    
    const mesAtual = meses[calendarioCurrentDate.getMonth()];
    const anoAtual = calendarioCurrentDate.getFullYear();
    
    mesAnoElement.textContent = `${mesAtual} ${anoAtual}`;
}

// Navegar entre meses
function navegarMesCalendario(direcao) {
    console.log('🧭 Navegando calendário:', direcao > 0 ? 'próximo' : 'anterior');
    
    if (!window.calendarioCurrentDate) {
        window.calendarioCurrentDate = new Date();
    }
    
    // Mover mês
    calendarioCurrentDate.setMonth(calendarioCurrentDate.getMonth() + direcao);
    
    // Atualizar interface
    updateCalendarioHeader();
    renderCalendario();
}

// Renderizar calendário
function renderCalendario() {
    const container = document.getElementById('calendarioContainer');
    if (!container || !window.calendarioCurrentDate) return;
    
    try {
        // Recarregar dados de aulas
        reloadAulasFromStorage();
        
        const hoje = new Date();
        const primeiroDiaMes = new Date(calendarioCurrentDate.getFullYear(), calendarioCurrentDate.getMonth(), 1);
        const ultimoDiaMes = new Date(calendarioCurrentDate.getFullYear(), calendarioCurrentDate.getMonth() + 1, 0);
        const primeiroDiaCalendario = new Date(primeiroDiaMes);
        
        // Ajustar para começar na segunda-feira
        const diaSemana = primeiroDiaCalendario.getDay();
        const diasParaVoltar = diaSemana === 0 ? 6 : diaSemana - 1;
        primeiroDiaCalendario.setDate(primeiroDiaCalendario.getDate() - diasParaVoltar);
        
        // Criar estrutura do calendário
        container.innerHTML = `
            <div class="calendario-wrapper">
                <!-- Cabeçalho dos dias da semana -->
                <div class="calendario-header">
                    <div class="dia-semana">SEG</div>
                    <div class="dia-semana">TER</div>
                    <div class="dia-semana">QUA</div>
                    <div class="dia-semana">QUI</div>
                    <div class="dia-semana">SEX</div>
                    <div class="dia-semana">SÁB</div>
                    <div class="dia-semana">DOM</div>
                </div>
                
                <!-- Grid do calendário -->
                <div class="calendario-grid" id="calendarioGrid">
                    <!-- Dias serão adicionados aqui -->
                </div>
                
                <!-- Legenda -->
                <div class="calendario-legenda">
                    <div class="legenda-item">
                        <div class="legenda-cor individual"></div>
                        <span>Individual</span>
                    </div>
                    <div class="legenda-item">
                        <div class="legenda-cor grupo"></div>
                        <span>Grupo</span>
                    </div>
                    <div class="legenda-item">
                        <div class="legenda-cor reposicao"></div>
                        <span>Reposição</span>
                    </div>
                    <div class="legenda-item">
                        <div class="legenda-cor avaliacao"></div>
                        <span>Avaliação</span>
                    </div>
                    <div class="legenda-item">
                        <div class="legenda-cor conversacao"></div>
                        <span>Conversação</span>
                    </div>
                </div>
            </div>
        `;
        
        const grid = document.getElementById('calendarioGrid');
        const dataAtual = new Date(primeiroDiaCalendario);
        
        // Criar 42 dias (6 semanas x 7 dias)
        for (let i = 0; i < 42; i++) {
            const diaElement = createDiaCalendario(dataAtual, primeiroDiaMes, ultimoDiaMes, hoje);
            grid.appendChild(diaElement);
            
            // Próximo dia
            dataAtual.setDate(dataAtual.getDate() + 1);
        }
        
        console.log('✅ Calendário renderizado');
        
    } catch (error) {
        console.error('❌ Erro ao renderizar calendário:', error);
        container.innerHTML = '<div class="error-message"><i class="fas fa-exclamation-triangle"></i><p>Erro ao renderizar calendário.</p></div>';
    }
}

// Criar elemento de dia do calendário
function createDiaCalendario(data, primeiroDiaMes, ultimoDiaMes, hoje) {
    const diaElement = document.createElement('div');
    const dataString = data.toISOString().split('T')[0];
    const isDiaAtual = data.toDateString() === hoje.toDateString();
    const isMesAtual = data >= primeiroDiaMes && data <= ultimoDiaMes;
    
    // Classes CSS
    let classes = ['calendario-dia'];
    if (!isMesAtual) classes.push('outro-mes');
    if (isDiaAtual) classes.push('hoje');
    
    diaElement.className = classes.join(' ');
    diaElement.setAttribute('data-date', dataString);
    
    // Buscar aulas do dia
    const aulasNoDia = window.aulasDadas ? aulasDadas.filter(aula => aula.data === dataString) : [];
    
    // Estrutura do dia
    let aulasHtml = '';
    if (aulasNoDia.length > 0) {
        // Mostrar até 3 aulas, depois "e mais X"
        const aulasParaMostrar = aulasNoDia.slice(0, 3);
        
        aulasParaMostrar.forEach(aula => {
            const statusClass = aula.status === 'realizada' ? 'realizada' : 
                               aula.status === 'cancelada' ? 'cancelada' : 'agendada';
            
            aulasHtml += `
                <div class="aula-item ${aula.tipo} ${statusClass}" 
                     onclick="showAulaDetails('${aula.id}')" 
                     title="${aula.horaInicio}-${aula.horaFim} - ${aula.tipo}">
                    <span class="aula-hora">${aula.horaInicio}</span>
                    <span class="aula-tipo">${aula.tipo.charAt(0).toUpperCase()}</span>
                </div>
            `;
        });
        
        // Se há mais aulas, mostrar contador
        if (aulasNoDia.length > 3) {
            aulasHtml += `
                <div class="mais-aulas" onclick="showDayDetails('${dataString}')">
                    +${aulasNoDia.length - 3} mais
                </div>
            `;
        }
    }
    
    diaElement.innerHTML = `
        <div class="dia-numero" onclick="showDayDetails('${dataString}')">${data.getDate()}</div>
        <div class="dia-aulas">
            ${aulasHtml}
        </div>
    `;
    
    return diaElement;
}

// Mostrar detalhes de uma aula específica
function showAulaDetails(aulaId) {
    console.log('👁️ Mostrando detalhes da aula:', aulaId);
    
    if (!window.aulasDadas) {
        reloadAulasFromStorage();
    }
    
    const aula = aulasDadas.find(a => a.id === aulaId);
    if (!aula) {
        showAlert('Aula não encontrada!', 'warning');
        return;
    }
    
    // Buscar nomes dos alunos
    let nomesAlunos = 'Nenhum aluno';
    if (aula.alunosParticipantes && aula.alunosParticipantes.length > 0) {
        nomesAlunos = aula.alunosParticipantes.map(email => {
            const student = window.students ? students.find(s => s.email === email) : null;
            return student ? student.name : email.split('@')[0];
        }).join(', ');
    }
    
    // Formatear duração
    const duracao = aula.duracao ? `${aula.duracao} minutos` : 'Não informado';
    
    // Status com ícones
    const statusIcons = {
        'realizada': '<i class="fas fa-check-circle" style="color: #28a745;"></i>',
        'agendada': '<i class="fas fa-clock" style="color: #007bff;"></i>',
        'cancelada': '<i class="fas fa-times-circle" style="color: #dc3545;"></i>'
    };
    
    const statusIcon = statusIcons[aula.status] || statusIcons['agendada'];
    
    // Criar modal com detalhes
    const modalHtml = `
        <div class="modal fade show" id="aulaDetailsModal" style="display: block;">
            <div class="modal-dialog modal-lg">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">
                            <i class="fas fa-chalkboard-teacher"></i> 
                            Detalhes da Aula
                        </h5>
                        <button type="button" class="close" onclick="closeAulaDetailsModal()">
                            <span>&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        <div class="aula-details-grid">
                            <div class="detail-item">
                                <label><i class="fas fa-calendar"></i> Data:</label>
                                <span>${formatDate(aula.data)}</span>
                            </div>
                            <div class="detail-item">
                                <label><i class="fas fa-clock"></i> Horário:</label>
                                <span>${aula.horaInicio} - ${aula.horaFim} (${duracao})</span>
                            </div>
                            <div class="detail-item">
                                <label><i class="fas fa-tag"></i> Tipo:</label>
                                <span class="tipo-badge ${aula.tipo}">${aula.tipo.charAt(0).toUpperCase() + aula.tipo.slice(1)}</span>
                            </div>
                            <div class="detail-item">
                                <label><i class="fas fa-signal"></i> Nível:</label>
                                <span class="nivel-badge">${aula.nivel || 'Não especificado'}</span>
                            </div>
                            <div class="detail-item">
                                <label><i class="fas fa-info-circle"></i> Status:</label>
                                <span>${statusIcon} ${aula.status.charAt(0).toUpperCase() + aula.status.slice(1)}</span>
                            </div>
                            <div class="detail-item full-width">
                                <label><i class="fas fa-users"></i> Alunos:</label>
                                <span>${nomesAlunos}</span>
                            </div>
                            <div class="detail-item full-width">
                                <label><i class="fas fa-book-open"></i> Conteúdo:</label>
                                <span>${aula.conteudo || 'Não informado'}</span>
                            </div>
                            ${aula.materiais ? `
                            <div class="detail-item full-width">
                                <label><i class="fas fa-file-alt"></i> Materiais:</label>
                                <span>${aula.materiais}</span>
                            </div>` : ''}
                            ${aula.observacoes ? `
                            <div class="detail-item full-width">
                                <label><i class="fas fa-sticky-note"></i> Observações:</label>
                                <span>${aula.observacoes}</span>
                            </div>` : ''}
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-warning" onclick="editarAula('${aula.id}'); closeAulaDetailsModal();">
                            <i class="fas fa-edit"></i> Editar
                        </button>
                        <button type="button" class="btn btn-danger" onclick="removerAula('${aula.id}'); closeAulaDetailsModal();">
                            <i class="fas fa-trash"></i> Remover
                        </button>
                        <button type="button" class="btn btn-secondary" onclick="closeAulaDetailsModal()">
                            <i class="fas fa-times"></i> Fechar
                        </button>
                    </div>
                </div>
            </div>
        </div>
        <div class="modal-backdrop fade show"></div>
    `;
    
    // Adicionar modal ao body
    document.body.insertAdjacentHTML('beforeend', modalHtml);
}

// Fechar modal de detalhes da aula
function closeAulaDetailsModal() {
    const modal = document.getElementById('aulaDetailsModal');
    const backdrop = document.querySelector('.modal-backdrop');
    
    if (modal) modal.remove();
    if (backdrop) backdrop.remove();
}

// Mostrar detalhes de um dia específico
function showDayDetails(dateString) {
    console.log('📅 Mostrando detalhes do dia:', dateString);
    
    if (!window.aulasDadas) {
        reloadAulasFromStorage();
    }
    
    const aulasNoDia = aulasDadas.filter(aula => aula.data === dateString);
    const dataFormatada = formatDate(dateString);
    
    if (aulasNoDia.length === 0) {
        showAlert(`Nenhuma aula agendada para ${dataFormatada}`, 'info');
        return;
    }
    
    // Ordenar aulas por horário
    const aulasOrdenadas = aulasNoDia.sort((a, b) => a.horaInicio.localeCompare(b.horaInicio));
    
    let aulasListHtml = '';
    aulasOrdenadas.forEach(aula => {
        const statusClass = aula.status === 'realizada' ? 'success' : 
                           aula.status === 'cancelada' ? 'danger' : 'info';
        
        // Buscar alunos
        let alunosNomes = 'Nenhum aluno';
        if (aula.alunosParticipantes && aula.alunosParticipantes.length > 0) {
            alunosNomes = aula.alunosParticipantes.map(email => {
                const student = window.students ? students.find(s => s.email === email) : null;
                return student ? student.name : email.split('@')[0];
            }).join(', ');
        }
        
        aulasListHtml += `
            <div class="day-aula-item">
                <div class="aula-time-type">
                    <span class="aula-time">${aula.horaInicio} - ${aula.horaFim}</span>
                    <span class="badge badge-${statusClass}">${aula.status.toUpperCase()}</span>
                </div>
                <div class="aula-info">
                    <strong>${aula.tipo.charAt(0).toUpperCase() + aula.tipo.slice(1)}</strong>
                    ${aula.nivel ? `<span class="nivel-mini">${aula.nivel}</span>` : ''}
                    <br>
                    <small><i class="fas fa-users"></i> ${alunosNomes}</small>
                    <br>
                    <small><i class="fas fa-book"></i> ${aula.conteudo || 'Conteúdo não informado'}</small>
                </div>
                <div class="aula-actions">
                    <button class="btn btn-sm btn-info" onclick="showAulaDetails('${aula.id}'); closeDayDetailsModal();" title="Ver detalhes">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="btn btn-sm btn-warning" onclick="editarAula('${aula.id}'); closeDayDetailsModal();" title="Editar">
                        <i class="fas fa-edit"></i>
                    </button>
                </div>
            </div>
        `;
    });
    
    // Criar modal com lista de aulas do dia
    const modalHtml = `
        <div class="modal fade show" id="dayDetailsModal" style="display: block;">
            <div class="modal-dialog modal-lg">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">
                            <i class="fas fa-calendar-day"></i> 
                            Aulas de ${dataFormatada}
                        </h5>
                        <button type="button" class="close" onclick="closeDayDetailsModal()">
                            <span>&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        <div class="day-summary">
                            <span class="summary-item">
                                <i class="fas fa-list"></i> 
                                <strong>${aulasNoDia.length}</strong> aula(s)
                            </span>
                            <span class="summary-item">
                                <i class="fas fa-clock"></i> 
                                <strong>${aulasNoDia.reduce((total, aula) => total + (aula.duracao || 0), 0)}</strong> min
                            </span>
                        </div>
                        <div class="day-aulas-list">
                            ${aulasListHtml}
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-primary" onclick="adicionarAulaNoDia('${dateString}'); closeDayDetailsModal();">
                            <i class="fas fa-plus"></i> Adicionar Aula
                        </button>
                        <button type="button" class="btn btn-secondary" onclick="closeDayDetailsModal()">
                            <i class="fas fa-times"></i> Fechar
                        </button>
                    </div>
                </div>
            </div>
        </div>
        <div class="modal-backdrop fade show"></div>
    `;
    
    // Adicionar modal ao body
    document.body.insertAdjacentHTML('beforeend', modalHtml);
}

// Fechar modal de detalhes do dia
function closeDayDetailsModal() {
    const modal = document.getElementById('dayDetailsModal');
    const backdrop = document.querySelector('.modal-backdrop');
    
    if (modal) modal.remove();
    if (backdrop) backdrop.remove();
}

// Adicionar aula em um dia específico
function adicionarAulaNoDia(dateString) {
    console.log('➕ Adicionando aula no dia:', dateString);
    
    // Ir para aba de registro
    showAulasSubTab('registrar');
    
    // Preencher data
    setTimeout(() => {
        const dataInput = document.getElementById('aulaData');
        if (dataInput) {
            dataInput.value = dateString;
        }
    }, 300);
}

// Placeholder functions for other tabs
function loadPlanejamentos() {
    console.log('📋 Carregando planejamentos de aulas...');
    const container = document.getElementById('planejamentoContainer');
    if (container) {
        container.innerHTML = `
            <div class="coming-soon">
                <i class="fas fa-clipboard-list"></i>
                <h3>Planejamento de Aulas</h3>
                <p>Esta funcionalidade estará disponível em breve!</p>
                <small>Aqui você poderá criar e gerenciar planejamentos de aulas por período</small>
            </div>
        `;
    }
}

function gerarRelatorioAulas() {
    console.log('📊 Gerando relatórios de aulas...');
    const container = document.getElementById('relatoriosContainer');
    if (container) {
        container.innerHTML = `
            <div class="coming-soon">
                <i class="fas fa-chart-line"></i>
                <h3>Relatórios de Aulas</h3>
                <p>Esta funcionalidade estará disponível em breve!</p>
                <small>Aqui você poderá gerar relatórios detalhados sobre as aulas ministradas</small>
            </div>
        `;
    }
}

function showAdicionarPlanejamentoModal() {
    showAlert('Funcionalidade em desenvolvimento!', 'info');
}

// ==================== SISTEMA DE PLANEJAMENTO DE AULAS v3.0.0 ====================

// Variáveis globais para planejamentos
if (!window.planejamentos) {
    window.planejamentos = JSON.parse(localStorage.getItem('planejamentos')) || [];
}

if (!window.templatesAula) {
    window.templatesAula = JSON.parse(localStorage.getItem('templatesAula')) || getDefaultTemplates();
}

if (!window.bibliotecaAtividades) {
    window.bibliotecaAtividades = JSON.parse(localStorage.getItem('bibliotecaAtividades')) || getDefaultAtividades();
}

// Templates padrão do sistema
function getDefaultTemplates() {
    return [
        {
            id: 'template_1',
            nome: 'Aula de Conversação',
            tipo: 'conversacao',
            nivel: 'B1',
            duracao: 50,
            objetivos: ['Desenvolver fluência oral', 'Praticar vocabulário do dia a dia', 'Melhorar pronúncia'],
            estrutura: [
                { etapa: 'Warm-up', duracao: 10, atividade: 'Small talk e revisão' },
                { etapa: 'Apresentação', duracao: 15, atividade: 'Introdução do tópico' },
                { etapa: 'Prática', duracao: 20, atividade: 'Atividades de conversação' },
                { etapa: 'Wrap-up', duracao: 5, atividade: 'Resumo e homework' }
            ],
            materiais: ['Slides', 'Audio files', 'Discussion cards'],
            avaliacao: 'Participação oral e fluência'
        },
        {
            id: 'template_2',
            nome: 'Gramática Básica',
            tipo: 'gramatica',
            nivel: 'A2',
            duracao: 50,
            objetivos: ['Ensinar nova estrutura gramatical', 'Praticar com exercícios', 'Aplicar em contexto'],
            estrutura: [
                { etapa: 'Revisão', duracao: 5, atividade: 'Review da aula anterior' },
                { etapa: 'Apresentação', duracao: 15, atividade: 'Explicação da gramática' },
                { etapa: 'Prática controlada', duracao: 15, atividade: 'Exercícios guiados' },
                { etapa: 'Prática livre', duracao: 10, atividade: 'Produção livre' },
                { etapa: 'Consolidação', duracao: 5, atividade: 'Resumo e dúvidas' }
            ],
            materiais: ['Livro didático', 'Slides', 'Worksheets'],
            avaliacao: 'Exercícios e produção oral'
        },
        {
            id: 'template_3',
            nome: 'Reading & Vocabulary',
            tipo: 'leitura',
            nivel: 'B2',
            duracao: 50,
            objetivos: ['Desenvolver compreensão leitora', 'Expandir vocabulário', 'Analisar texto'],
            estrutura: [
                { etapa: 'Pre-reading', duracao: 10, atividade: 'Ativação de conhecimento prévio' },
                { etapa: 'While-reading', duracao: 20, atividade: 'Leitura e compreensão' },
                { etapa: 'Post-reading', duracao: 15, atividade: 'Discussão e vocabulário' },
                { etapa: 'Extension', duracao: 5, atividade: 'Atividade extra' }
            ],
            materiais: ['Texto selecionado', 'Vocabulary cards', 'Comprehension questions'],
            avaliacao: 'Compreensão textual e uso de vocabulário'
        }
    ];
}

// Biblioteca de atividades padrão
function getDefaultAtividades() {
    return [
        {
            id: 'ativ_1',
            nome: 'Role Play - Restaurant',
            tipo: 'conversacao',
            nivel: ['A2', 'B1'],
            descricao: 'Simulação de diálogo em restaurante',
            materiais: ['Menu cards', 'Role cards'],
            duracao: 15,
            objetivos: ['Praticar vocabulário de comida', 'Usar frases de cortesia']
        },
        {
            id: 'ativ_2',
            nome: 'Grammar Race',
            tipo: 'gramatica',
            nivel: ['A1', 'A2'],
            descricao: 'Competição de gramática em equipes',
            materiais: ['Sentence cards', 'Timer'],
            duracao: 20,
            objetivos: ['Revisar estruturas gramaticais', 'Aumentar velocidade de resposta']
        },
        {
            id: 'ativ_3',
            nome: 'Picture Description',
            tipo: 'vocabulario',
            nivel: ['A2', 'B1', 'B2'],
            descricao: 'Descrição detalhada de imagens',
            materiais: ['Picture cards', 'Vocabulary lists'],
            duracao: 10,
            objetivos: ['Expandir vocabulário descritivo', 'Melhorar fluência']
        },
        {
            id: 'ativ_4',
            nome: 'Listening Comprehension',
            tipo: 'listening',
            nivel: ['B1', 'B2'],
            descricao: 'Atividade de compreensão auditiva',
            materiais: ['Audio file', 'Worksheets'],
            duracao: 25,
            objetivos: ['Desenvolver compreensão auditiva', 'Identificar informações específicas']
        }
    ];
}

// Função principal para carregar planejamentos
function loadPlanejamentos() {
    console.log('📋 Carregando sistema de planejamento de aulas v3.0.0...');
    
    try {
        const container = document.getElementById('planejamentoContainer');
        if (!container) {
            console.error('❌ Container de planejamento não encontrado');
            return;
        }
        
        // Recarregar dados do localStorage
        reloadPlanejamentosData();
        
        // Criar interface completa
        container.innerHTML = createPlanejamentoInterface();
        
        // Configurar event listeners
        setupPlanejamentoEventListeners();
        
        // Carregar lista de planejamentos
        renderPlanejamentosList();
        
        // Carregar estatísticas
        updatePlanejamentosStats();
        
        console.log('✅ Sistema de planejamento carregado com sucesso');
        
    } catch (error) {
        console.error('❌ Erro ao carregar planejamentos:', error);
        showAlert('Erro ao carregar sistema de planejamento!', 'danger');
    }
}

// Recarregar dados do localStorage
function reloadPlanejamentosData() {
    try {
        window.planejamentos = JSON.parse(localStorage.getItem('planejamentos')) || [];
        window.templatesAula = JSON.parse(localStorage.getItem('templatesAula')) || getDefaultTemplates();
        window.bibliotecaAtividades = JSON.parse(localStorage.getItem('bibliotecaAtividades')) || getDefaultAtividades();
        
        console.log(`📊 Dados carregados: ${planejamentos.length} planejamentos, ${templatesAula.length} templates, ${bibliotecaAtividades.length} atividades`);
    } catch (error) {
        console.error('❌ Erro ao recarregar dados:', error);
        window.planejamentos = [];
        window.templatesAula = getDefaultTemplates();
        window.bibliotecaAtividades = getDefaultAtividades();
    }
}

// Criar interface completa do planejamento
function createPlanejamentoInterface() {
    return `
        <!-- Estatísticas Rápidas -->
        <div class="planejamento-stats">
            <div class="stat-card">
                <div class="stat-icon total">
                    <i class="fas fa-clipboard-list"></i>
                </div>
                <div class="stat-info">
                    <div class="stat-number" id="totalPlanejamentos">0</div>
                    <div class="stat-label">Total de Planos</div>
                </div>
            </div>
            <div class="stat-card">
                <div class="stat-icon pending">
                    <i class="fas fa-clock"></i>
                </div>
                <div class="stat-info">
                    <div class="stat-number" id="planejamentosPendentes">0</div>
                    <div class="stat-label">Pendentes</div>
                </div>
            </div>
            <div class="stat-card">
                <div class="stat-icon completed">
                    <i class="fas fa-check-circle"></i>
                </div>
                <div class="stat-info">
                    <div class="stat-number" id="planejamentosCompletos">0</div>
                    <div class="stat-label">Completos</div>
                </div>
            </div>
            <div class="stat-card">
                <div class="stat-icon templates">
                    <i class="fas fa-layer-group"></i>
                </div>
                <div class="stat-info">
                    <div class="stat-number" id="totalTemplates">0</div>
                    <div class="stat-label">Templates</div>
                </div>
            </div>
        </div>

        <!-- Cabeçalho com Botões -->
        <div class="planejamento-header">
            <div class="header-title">
                <h2><i class="fas fa-clipboard-list"></i> Planejamento de Aulas</h2>
                <p class="header-subtitle">Crie e gerencie seus planos de aula de forma organizada</p>
            </div>
            <div class="header-actions">
                <button class="btn btn-info" onclick="showTemplatesModal()">
                    <i class="fas fa-layer-group"></i> Templates
                </button>
                <button class="btn btn-warning" onclick="showBibliotecaModal()">
                    <i class="fas fa-book"></i> Biblioteca
                </button>
            </div>
        </div>

        <!-- Filtros e Busca -->
        <div class="planejamento-filters">
            <div class="filters-row">
                <div class="search-group">
                    <div class="search-input-wrapper">
                        <i class="fas fa-search"></i>
                        <input type="text" id="planejamentosSearch" class="search-input" 
                               placeholder="Buscar por título, nível, tipo..."
                               onkeyup="filterPlanejamentos()">
                        <button class="clear-search" id="clearPlanejamentosSearch" 
                                onclick="clearPlanejamentosSearch()" style="display: none;">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                </div>
                
                <div class="filter-group">
                    <select id="filtroNivel" class="filter-select" onchange="filterPlanejamentos()">
                        <option value="">Todos os Níveis</option>
                        <option value="A1">A1 - Básico</option>
                        <option value="A2">A2 - Pré-Intermediário</option>
                        <option value="B1">B1 - Intermediário</option>
                        <option value="B2">B2 - Intermediário Superior</option>
                        <option value="C1">C1 - Avançado</option>
                        <option value="C2">C2 - Proficiente</option>
                    </select>
                    
                    <select id="filtroTipo" class="filter-select" onchange="filterPlanejamentos()">
                        <option value="">Todos os Tipos</option>
                        <option value="conversacao">Conversação</option>
                        <option value="gramatica">Gramática</option>
                        <option value="leitura">Leitura</option>
                        <option value="escrita">Escrita</option>
                        <option value="listening">Listening</option>
                        <option value="vocabulario">Vocabulário</option>
                        <option value="avaliacao">Avaliação</option>
                    </select>
                    
                    <select id="filtroStatus" class="filter-select" onchange="filterPlanejamentos()">
                        <option value="">Todos os Status</option>
                        <option value="rascunho">Rascunho</option>
                        <option value="planejado">Planejado</option>
                        <option value="em_andamento">Em Andamento</option>
                        <option value="concluido">Concluído</option>
                    </select>
                </div>
            </div>
            
            <div class="filter-info" id="planejamentosFilterInfo">
                <!-- Informações dos filtros serão exibidas aqui -->
            </div>
        </div>

        <!-- Lista de Planejamentos -->
        <div class="planejamentos-container">
            <div id="planejamentosList" class="planejamentos-grid">
                <!-- Planejamentos serão carregados aqui -->
            </div>
            
            <!-- Estado vazio -->
            <div id="planejamentosEmpty" class="empty-state" style="display: none;">
                <div class="empty-icon">
                    <i class="fas fa-clipboard-list"></i>
                </div>
                <h3>Nenhum planejamento encontrado</h3>
                <p>Crie seu primeiro plano de aula clicando no botão "Novo Planejamento"</p>
                <button class="btn btn-primary" onclick="showNovoPlanejamentoModal()">
                    <i class="fas fa-plus"></i> Criar Primeiro Planejamento
                </button>
            </div>
        </div>

        <!-- Modais serão adicionados aqui -->
        ${createPlanejamentoModals()}
    `;
}

// Criar modais do sistema de planejamento
function createPlanejamentoModals() {
    return `
        <!-- Modal Novo Planejamento -->
        <div id="novoPlanejamentoModal" class="modal">
            <div class="modal-content modal-lg">
                <div class="modal-header">
                    <h3><i class="fas fa-plus"></i> Novo Planejamento de Aula</h3>
                    <button class="close" onclick="closePlanejamentoModal('novoPlanejamentoModal')">&times;</button>
                </div>
                <div class="modal-body">
                    <form id="novoPlanejamentoForm">
                        <!-- Aba de navegação -->
                        <div class="form-tabs">
                            <button type="button" class="tab-btn active" onclick="switchPlanejamentoTab('basico')">
                                <i class="fas fa-info-circle"></i> Básico
                            </button>
                            <button type="button" class="tab-btn" onclick="switchPlanejamentoTab('estrutura')">
                                <i class="fas fa-list"></i> Estrutura
                            </button>
                            <button type="button" class="tab-btn" onclick="switchPlanejamentoTab('materiais')">
                                <i class="fas fa-tools"></i> Materiais
                            </button>
                            <button type="button" class="tab-btn" onclick="switchPlanejamentoTab('avaliacao')">
                                <i class="fas fa-check-square"></i> Avaliação
                            </button>
                        </div>

                        <!-- Conteúdo das abas -->
                        <div class="tab-content">
                            <!-- Aba Básico -->
                            <div id="tabBasico" class="tab-pane active">
                                <div class="form-row">
                                    <div class="form-group">
                                        <label class="form-label">Título do Plano *</label>
                                        <input type="text" id="planejamentoTitulo" class="form-input" required 
                                               placeholder="Ex: Aula de Present Perfect">
                                    </div>
                                    <div class="form-group">
                                        <label class="form-label">Template Base</label>
                                        <select id="planejamentoTemplate" class="form-select" onchange="loadTemplateData()">
                                            <option value="">Começar do zero</option>
                                            <!-- Templates serão carregados aqui -->
                                        </select>
                                    </div>
                                </div>
                                
                                <div class="form-row">
                                    <div class="form-group">
                                        <label class="form-label">Tipo de Aula *</label>
                                        <select id="planejamentoTipo" class="form-select" required>
                                            <option value="">Selecione o tipo</option>
                                            <option value="conversacao">Conversação</option>
                                            <option value="gramatica">Gramática</option>
                                            <option value="leitura">Leitura</option>
                                            <option value="escrita">Escrita</option>
                                            <option value="listening">Listening</option>
                                            <option value="vocabulario">Vocabulário</option>
                                            <option value="avaliacao">Avaliação</option>
                                        </select>
                                    </div>
                                    <div class="form-group">
                                        <label class="form-label">Nível *</label>
                                        <select id="planejamentoNivel" class="form-select" required>
                                            <option value="">Selecione o nível</option>
                                            <option value="A1">A1 - Básico</option>
                                            <option value="A2">A2 - Pré-Intermediário</option>
                                            <option value="B1">B1 - Intermediário</option>
                                            <option value="B2">B2 - Intermediário Superior</option>
                                            <option value="C1">C1 - Avançado</option>
                                            <option value="C2">C2 - Proficiente</option>
                                        </select>
                                    </div>
                                </div>
                                
                                <div class="form-row">
                                    <div class="form-group">
                                        <label class="form-label">Duração (minutos) *</label>
                                        <input type="number" id="planejamentoDuracao" class="form-input" required 
                                               min="15" max="120" value="50">
                                    </div>
                                    <div class="form-group">
                                        <label class="form-label">Data Planejada</label>
                                        <input type="date" id="planejamentoData" class="form-input">
                                    </div>
                                </div>
                                
                                <div class="form-group">
                                    <label class="form-label">Objetivos de Aprendizagem *</label>
                                    <div id="objetivosContainer" class="objetivos-container">
                                        <div class="objetivo-item">
                                            <input type="text" class="objetivo-input" placeholder="Ex: Usar Present Perfect em situações adequadas">
                                            <button type="button" class="btn-remove-objetivo" onclick="removeObjetivo(this)">
                                                <i class="fas fa-times"></i>
                                            </button>
                                        </div>
                                    </div>
                                    <button type="button" class="btn btn-secondary btn-sm" onclick="addObjetivo()">
                                        <i class="fas fa-plus"></i> Adicionar Objetivo
                                    </button>
                                </div>
                                
                                <div class="form-group">
                                    <label class="form-label">Descrição Geral</label>
                                    <textarea id="planejamentoDescricao" class="form-textarea" rows="3" 
                                              placeholder="Descreva brevemente o conteúdo e abordagem da aula..."></textarea>
                                </div>
                            </div>

                            <!-- Aba Estrutura -->
                            <div id="tabEstrutura" class="tab-pane">
                                <div class="estrutura-header">
                                    <h4><i class="fas fa-list"></i> Estrutura da Aula</h4>
                                    <button type="button" class="btn btn-secondary btn-sm" onclick="addEtapaAula()">
                                        <i class="fas fa-plus"></i> Adicionar Etapa
                                    </button>
                                </div>
                                
                                <div id="estruturaContainer" class="estrutura-container">
                                    <!-- Etapas da aula serão adicionadas aqui -->
                                </div>
                                
                                <div class="estrutura-summary">
                                    <div class="summary-item">
                                        <strong>Duração Total: </strong>
                                        <span id="duracaoTotalEtapas">0 min</span>
                                    </div>
                                    <div class="summary-item">
                                        <strong>Etapas: </strong>
                                        <span id="totalEtapas">0</span>
                                    </div>
                                </div>
                            </div>

                            <!-- Aba Materiais -->
                            <div id="tabMateriais" class="tab-pane">
                                <div class="materiais-header">
                                    <h4><i class="fas fa-tools"></i> Materiais e Recursos</h4>
                                    <button type="button" class="btn btn-secondary btn-sm" onclick="addMaterial()">
                                        <i class="fas fa-plus"></i> Adicionar Material
                                    </button>
                                </div>
                                
                                <div id="materiaisContainer" class="materiais-container">
                                    <!-- Materiais serão adicionados aqui -->
                                </div>
                                
                                <div class="form-group">
                                    <label class="form-label">Recursos Digitais</label>
                                    <textarea id="recursosDigitais" class="form-textarea" rows="2" 
                                              placeholder="Links, aplicativos, plataformas online..."></textarea>
                                </div>
                                
                                <div class="form-group">
                                    <label class="form-label">Preparação Prévia</label>
                                    <textarea id="preparacaoPrevia" class="form-textarea" rows="2" 
                                              placeholder="O que precisa ser preparado antes da aula..."></textarea>
                                </div>
                            </div>

                            <!-- Aba Avaliação -->
                            <div id="tabAvaliacao" class="tab-pane">
                                <div class="form-group">
                                    <label class="form-label">Tipo de Avaliação</label>
                                    <select id="tipoAvaliacao" class="form-select">
                                        <option value="formativa">Formativa (durante a aula)</option>
                                        <option value="somativa">Somativa (teste/prova)</option>
                                        <option value="participacao">Participação</option>
                                        <option value="portfolio">Portfolio</option>
                                        <option value="projeto">Projeto</option>
                                        <option value="nenhuma">Sem avaliação formal</option>
                                    </select>
                                </div>
                                
                                <div class="form-group">
                                    <label class="form-label">Critérios de Avaliação</label>
                                    <textarea id="criteriosAvaliacao" class="form-textarea" rows="3" 
                                              placeholder="Como os alunos serão avaliados..."></textarea>
                                </div>
                                
                                <div class="form-group">
                                    <label class="form-label">Instrumentos de Avaliação</label>
                                    <textarea id="instrumentosAvaliacao" class="form-textarea" rows="2" 
                                              placeholder="Rubricas, listas de verificação, etc..."></textarea>
                                </div>
                                
                                <div class="form-group">
                                    <label class="form-label">Homework/Tarefa de Casa</label>
                                    <textarea id="homework" class="form-textarea" rows="2" 
                                              placeholder="Atividades para fazer em casa..."></textarea>
                                </div>
                                
                                <div class="form-group">
                                    <label class="form-label">Observações</label>
                                    <textarea id="observacoesPlanejamento" class="form-textarea" rows="2" 
                                              placeholder="Anotações adicionais, adaptações necessárias..."></textarea>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-secondary" onclick="closePlanejamentoModal('novoPlanejamentoModal')">
                        <i class="fas fa-times"></i> Cancelar
                    </button>
                    <button class="btn btn-info" onclick="salvarRascunhoPlanejamento()">
                        <i class="fas fa-save"></i> Salvar Rascunho
                    </button>
                    <button class="btn btn-success" onclick="criarPlanejamento()">
                        <i class="fas fa-check"></i> Criar Planejamento
                    </button>
                </div>
            </div>
        </div>

        <!-- Modal Templates -->
        <div id="templatesModal" class="modal">
            <div class="modal-content modal-lg">
                <div class="modal-header">
                    <h3><i class="fas fa-layer-group"></i> Templates de Aula</h3>
                    <button class="close" onclick="closePlanejamentoModal('templatesModal')">&times;</button>
                </div>
                <div class="modal-body">
                    <div class="templates-grid" id="templatesGrid">
                        <!-- Templates serão carregados aqui -->
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-primary" onclick="showNovoTemplateModal()">
                        <i class="fas fa-plus"></i> Novo Template
                    </button>
                    <button class="btn btn-secondary" onclick="closePlanejamentoModal('templatesModal')">
                        <i class="fas fa-times"></i> Fechar
                    </button>
                </div>
            </div>
        </div>

        <!-- Modal Biblioteca -->
        <div id="bibliotecaModal" class="modal">
            <div class="modal-content modal-lg">
                <div class="modal-header">
                    <h3><i class="fas fa-book"></i> Biblioteca de Atividades</h3>
                    <button class="close" onclick="closePlanejamentoModal('bibliotecaModal')">&times;</button>
                </div>
                <div class="modal-body">
                    <div class="biblioteca-filters">
                        <input type="text" id="bibliotecaSearch" class="search-input" 
                               placeholder="Buscar atividades..." onkeyup="filterAtividades()">
                        <select id="bibliotecaTipo" class="filter-select" onchange="filterAtividades()">
                            <option value="">Todos os tipos</option>
                            <option value="conversacao">Conversação</option>
                            <option value="gramatica">Gramática</option>
                            <option value="vocabulario">Vocabulário</option>
                            <option value="listening">Listening</option>
                        </select>
                    </div>
                    <div class="biblioteca-grid" id="bibliotecaGrid">
                        <!-- Atividades serão carregadas aqui -->
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-primary" onclick="showNovaAtividadeModal()">
                        <i class="fas fa-plus"></i> Nova Atividade
                    </button>
                    <button class="btn btn-secondary" onclick="closePlanejamentoModal('bibliotecaModal')">
                        <i class="fas fa-times"></i> Fechar
                    </button>
                </div>
            </div>
        </div>
    `;
}

// Continua no próximo bloco...

// ==================== FUNÇÕES DE CONFIGURAÇÃO ====================

// Configurar event listeners do sistema de planejamento
function setupPlanejamentoEventListeners() {
    console.log('⚙️ Configurando event listeners do planejamento...');
    
    // Busca em tempo real
    const searchInput = document.getElementById('planejamentosSearch');
    if (searchInput) {
        searchInput.addEventListener('input', debounce(filterPlanejamentos, 300));
    }
    
    // Limpar busca
    const clearButton = document.getElementById('clearPlanejamentosSearch');
    if (clearButton) {
        clearButton.addEventListener('click', clearPlanejamentosSearch);
    }
}

// Renderizar lista de planejamentos
function renderPlanejamentosList() {
    console.log('📋 Renderizando lista de planejamentos...');
    
    const container = document.getElementById('planejamentosList');
    const emptyState = document.getElementById('planejamentosEmpty');
    
    if (!container || !emptyState) return;
    
    // Aplicar filtros
    const planejamentosFiltrados = getPlanejamentosFiltrados();
    
    if (planejamentosFiltrados.length === 0) {
        container.style.display = 'none';
        emptyState.style.display = 'block';
        return;
    }
    
    container.style.display = 'grid';
    emptyState.style.display = 'none';
    
    // Renderizar cards
    container.innerHTML = planejamentosFiltrados.map(planejamento => 
        createPlanejamentoCard(planejamento)
    ).join('');
    
    // Atualizar info dos filtros
    updateFilterInfo(planejamentosFiltrados.length);
}

// Criar card de planejamento
function createPlanejamentoCard(planejamento) {
    const statusIcon = {
        'rascunho': '<i class="fas fa-pencil-alt"></i>',
        'planejado': '<i class="fas fa-calendar-check"></i>',
        'em_andamento': '<i class="fas fa-play-circle"></i>',
        'concluido': '<i class="fas fa-check-circle"></i>'
    };
    
    const tipoIcon = {
        'conversacao': '<i class="fas fa-comments"></i>',
        'gramatica': '<i class="fas fa-language"></i>',
        'leitura': '<i class="fas fa-book-open"></i>',
        'escrita': '<i class="fas fa-pen"></i>',
        'listening': '<i class="fas fa-headphones"></i>',
        'vocabulario': '<i class="fas fa-spell-check"></i>',
        'avaliacao': '<i class="fas fa-clipboard-check"></i>'
    };
    
    const dataFormatada = planejamento.dataPlanejada ? 
        new Date(planejamento.dataPlanejada).toLocaleDateString('pt-BR') : 
        'Sem data';
    
    return `
        <div class="planejamento-card" data-id="${planejamento.id}">
            <div class="card-header">
                <div class="card-title">
                    <h3>${planejamento.titulo}</h3>
                    <div class="card-meta">
                        <span class="tipo-badge ${planejamento.tipo}">
                            ${tipoIcon[planejamento.tipo] || '<i class="fas fa-chalkboard"></i>'}
                            ${planejamento.tipo.charAt(0).toUpperCase() + planejamento.tipo.slice(1)}
                        </span>
                        <span class="nivel-badge">${planejamento.nivel}</span>
                    </div>
                </div>
                <div class="card-status">
                    <span class="status-badge ${planejamento.status}">
                        ${statusIcon[planejamento.status] || '<i class="fas fa-question"></i>'}
                        ${planejamento.status.replace('_', ' ').toUpperCase()}
                    </span>
                </div>
            </div>
            
            <div class="card-body">
                <div class="card-info">
                    <div class="info-item">
                        <i class="fas fa-clock"></i>
                        <span>${planejamento.duracao} min</span>
                    </div>
                    <div class="info-item">
                        <i class="fas fa-calendar"></i>
                        <span>${dataFormatada}</span>
                    </div>
                    <div class="info-item">
                        <i class="fas fa-target"></i>
                        <span>${planejamento.objetivos ? planejamento.objetivos.length : 0} objetivos</span>
                    </div>
                </div>
                
                <div class="card-description">
                    <p>${planejamento.descricao || 'Sem descrição'}</p>
                </div>
                
                <div class="card-progress">
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${calculateProgress(planejamento)}%"></div>
                    </div>
                    <span class="progress-text">${calculateProgress(planejamento)}% completo</span>
                </div>
            </div>
            
            <div class="card-footer">
                <div class="card-actions">
                    <button class="btn btn-info btn-sm" onclick="viewPlanejamento('${planejamento.id}')" title="Visualizar">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="btn btn-warning btn-sm" onclick="editPlanejamento('${planejamento.id}')" title="Editar">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-success btn-sm" onclick="duplicatePlanejamento('${planejamento.id}')" title="Duplicar">
                        <i class="fas fa-copy"></i>
                    </button>
                    <button class="btn btn-danger btn-sm" onclick="deletePlanejamento('${planejamento.id}')" title="Excluir">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
                <div class="card-date">
                    <small>Criado em: ${new Date(planejamento.dataCriacao).toLocaleDateString('pt-BR')}</small>
                </div>
            </div>
        </div>
    `;
}

// Calcular progresso do planejamento
function calculateProgress(planejamento) {
    let progress = 0;
    
    // Informações básicas (30%)
    if (planejamento.titulo && planejamento.tipo && planejamento.nivel) progress += 30;
    
    // Objetivos (20%)
    if (planejamento.objetivos && planejamento.objetivos.length > 0) progress += 20;
    
    // Estrutura (30%)
    if (planejamento.estrutura && planejamento.estrutura.length > 0) progress += 30;
    
    // Avaliação (20%)
    if (planejamento.avaliacao && planejamento.avaliacao.tipo) progress += 20;
    
    return Math.min(progress, 100);
}

// Atualizar estatísticas
function updatePlanejamentosStats() {
    const totalElement = document.getElementById('totalPlanejamentos');
    const pendentesElement = document.getElementById('planejamentosPendentes');
    const completosElement = document.getElementById('planejamentosCompletos');
    const templatesElement = document.getElementById('totalTemplates');
    
    if (!totalElement || !pendentesElement || !completosElement || !templatesElement) return;
    
    const total = planejamentos.length;
    const pendentes = planejamentos.filter(p => p.status === 'rascunho' || p.status === 'planejado').length;
    const completos = planejamentos.filter(p => p.status === 'concluido').length;
    const templates = templatesAula.length;
    
    totalElement.textContent = total;
    pendentesElement.textContent = pendentes;
    completosElement.textContent = completos;
    templatesElement.textContent = templates;
}

// ==================== FUNÇÕES DE FILTROS ====================

// Filtrar planejamentos
function filterPlanejamentos() {
    renderPlanejamentosList();
    
    // Mostrar/esconder botão de limpar busca
    const searchInput = document.getElementById('planejamentosSearch');
    const clearButton = document.getElementById('clearPlanejamentosSearch');
    
    if (searchInput && clearButton) {
        clearButton.style.display = searchInput.value ? 'block' : 'none';
    }
}

// Obter planejamentos filtrados
function getPlanejamentosFiltrados() {
    const searchTerm = document.getElementById('planejamentosSearch')?.value.toLowerCase() || '';
    const nivelFilter = document.getElementById('filtroNivel')?.value || '';
    const tipoFilter = document.getElementById('filtroTipo')?.value || '';
    const statusFilter = document.getElementById('filtroStatus')?.value || '';
    
    return planejamentos.filter(planejamento => {
        const matchSearch = !searchTerm || 
            planejamento.titulo.toLowerCase().includes(searchTerm) ||
            planejamento.nivel.toLowerCase().includes(searchTerm) ||
            planejamento.tipo.toLowerCase().includes(searchTerm) ||
            (planejamento.descricao && planejamento.descricao.toLowerCase().includes(searchTerm));
        
        const matchNivel = !nivelFilter || planejamento.nivel === nivelFilter;
        const matchTipo = !tipoFilter || planejamento.tipo === tipoFilter;
        const matchStatus = !statusFilter || planejamento.status === statusFilter;
        
        return matchSearch && matchNivel && matchTipo && matchStatus;
    });
}

// Limpar busca de planejamentos
function clearPlanejamentosSearch() {
    const searchInput = document.getElementById('planejamentosSearch');
    const clearButton = document.getElementById('clearPlanejamentosSearch');
    
    if (searchInput) {
        searchInput.value = '';
        searchInput.focus();
    }
    
    if (clearButton) {
        clearButton.style.display = 'none';
    }
    
    filterPlanejamentos();
}

// Atualizar informações dos filtros
function updateFilterInfo(count) {
    const infoElement = document.getElementById('planejamentosFilterInfo');
    if (!infoElement) return;
    
    const total = planejamentos.length;
    
    if (count === total) {
        infoElement.innerHTML = '';
        return;
    }
    
    infoElement.innerHTML = `
        <div class="filter-result">
            <i class="fas fa-filter"></i>
            Exibindo ${count} de ${total} planejamentos
            <button class="btn btn-link btn-sm" onclick="clearAllFilters()">
                <i class="fas fa-times"></i> Limpar filtros
            </button>
        </div>
    `;
}

// Limpar todos os filtros
function clearAllFilters() {
    document.getElementById('planejamentosSearch').value = '';
    document.getElementById('filtroNivel').value = '';
    document.getElementById('filtroTipo').value = '';
    document.getElementById('filtroStatus').value = '';
    
    filterPlanejamentos();
}

// ==================== FUNÇÕES DE MODAIS ====================

// Mostrar modal de novo planejamento - VERSÃO SIMPLIFICADA
function showNovoPlanejamentoModal() {
    console.log('➕ Abrindo modal de novo planejamento...');
    
    try {
        const modal = document.getElementById('novoPlanejamentoModal');
        
        if (!modal) {
            console.error('❌ Modal não encontrado no DOM');
            showAlert('Erro: Modal não encontrado! Tente recarregar a página.', 'danger');
            return;
        }
        
        console.log('✅ Modal encontrado, configurando...');
        
        // Limpar formulário primeiro
        resetPlanejamentoForm();
        
        // Carregar templates no select
        loadTemplateOptions();
        
        // Exibir modal
        modal.style.display = 'flex';
        modal.style.alignItems = 'center';
        modal.style.justifyContent = 'center';
        modal.classList.add('show');
        
        console.log('✅ Modal exibido com sucesso');
        
        // Focar no primeiro campo após um pequeno delay
        setTimeout(() => {
            const firstInput = document.getElementById('planejamentoTitulo');
            if (firstInput) {
                firstInput.focus();
                console.log('✅ Foco definido no primeiro campo');
            }
        }, 200);
        
        // Event listener para fechar ao clicar fora (apenas uma vez)
        modal.removeEventListener('click', handleModalBackdropClick);
        modal.addEventListener('click', handleModalBackdropClick);
        
    } catch (error) {
        console.error('❌ Erro ao abrir modal:', error);
        showAlert('Erro ao abrir modal de planejamento!', 'danger');
    }
}

// Função para lidar com cliques no backdrop do modal
function handleModalBackdropClick(e) {
    if (e.target === e.currentTarget) {
        closePlanejamentoModal('novoPlanejamentoModal');
    }
}

// Fechar modal - VERSÃO MELHORADA
function closePlanejamentoModal(modalId) {
    console.log('🔒 Fechando modal:', modalId);
    
    try {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.style.display = 'none';
            modal.classList.remove('show');
            
            // Remover event listener do backdrop
            modal.removeEventListener('click', handleModalBackdropClick);
            
            console.log('✅ Modal fechado:', modalId);
        } else {
            console.warn('⚠️ Modal não encontrado para fechar:', modalId);
        }
    } catch (error) {
        console.error('❌ Erro ao fechar modal:', error);
    }
}

// Resetar formulário de planejamento
function resetPlanejamentoForm() {
    const form = document.getElementById('novoPlanejamentoForm');
    if (form) {
        form.reset();
        
        // Limpar containers dinâmicos
        const objetivosContainer = document.getElementById('objetivosContainer');
        if (objetivosContainer) {
            objetivosContainer.innerHTML = `
                <div class="objetivo-item">
                    <input type="text" class="objetivo-input" placeholder="Ex: Usar Present Perfect em situações adequadas">
                    <button type="button" class="btn-remove-objetivo" onclick="removeObjetivo(this)">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
            `;
        }
        
        const estruturaContainer = document.getElementById('estruturaContainer');
        if (estruturaContainer) {
            estruturaContainer.innerHTML = '';
        }
        
        const materiaisContainer = document.getElementById('materiaisContainer');
        if (materiaisContainer) {
            materiaisContainer.innerHTML = '';
        }
    }
    
    // Voltar para primeira aba
    switchPlanejamentoTab('basico');
}

// Trocar aba do planejamento
function switchPlanejamentoTab(tabName) {
    // Remover classe active de todas as abas
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    document.querySelectorAll('.tab-pane').forEach(pane => {
        pane.classList.remove('active');
    });
    
    // Ativar aba selecionada
    const tabBtn = document.querySelector(`[onclick="switchPlanejamentoTab('${tabName}')"]`);
    const tabPane = document.getElementById(`tab${tabName.charAt(0).toUpperCase() + tabName.slice(1)}`);
    
    if (tabBtn) tabBtn.classList.add('active');
    if (tabPane) tabPane.classList.add('active');
}

// ==================== FUNÇÕES DE OBJETIVOS ====================

// Adicionar objetivo
function addObjetivo() {
    const container = document.getElementById('objetivosContainer');
    if (!container) return;
    
    const objetivoHtml = `
        <div class="objetivo-item">
            <input type="text" class="objetivo-input" placeholder="Ex: Desenvolver habilidade específica">
            <button type="button" class="btn-remove-objetivo" onclick="removeObjetivo(this)">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;
    
    container.insertAdjacentHTML('beforeend', objetivoHtml);
}

// Remover objetivo
function removeObjetivo(button) {
    const container = document.getElementById('objetivosContainer');
    if (!container) return;
    
    const objetivoItem = button.closest('.objetivo-item');
    if (objetivoItem) {
        objetivoItem.remove();
    }
    
    // Garantir que sempre tenha pelo menos um objetivo
    if (container.children.length === 0) {
        addObjetivo();
    }
}

// ==================== FUNÇÕES DE ESTRUTURA ====================

// Adicionar etapa da aula
function addEtapaAula() {
    const container = document.getElementById('estruturaContainer');
    if (!container) return;
    
    const etapaIndex = container.children.length;
    
    const etapaHtml = `
        <div class="etapa-item">
            <div class="etapa-header">
                <h5>Etapa ${etapaIndex + 1}</h5>
                <button type="button" class="btn-remove-etapa" onclick="removeEtapa(this)">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="etapa-content">
                <div class="form-row">
                    <div class="form-group">
                        <label class="form-label">Nome da Etapa</label>
                        <input type="text" class="etapa-nome" placeholder="Ex: Warm-up, Presentation, Practice">
                    </div>
                    <div class="form-group">
                        <label class="form-label">Duração (min)</label>
                        <input type="number" class="etapa-duracao" min="1" max="60" onchange="updateDuracaoTotal()">
                    </div>
                </div>
                <div class="form-group">
                    <label class="form-label">Atividade</label>
                    <textarea class="etapa-atividade" rows="2" placeholder="Descreva a atividade desta etapa..."></textarea>
                </div>
                <div class="form-group">
                    <label class="form-label">Objetivos Específicos</label>
                    <input type="text" class="etapa-objetivos" placeholder="Ex: Ativar conhecimento prévio, introduzir vocabulário">
                </div>
            </div>
        </div>
    `;
    
    container.insertAdjacentHTML('beforeend', etapaHtml);
    updateDuracaoTotal();
    updateTotalEtapas();
}

// Remover etapa
function removeEtapa(button) {
    const etapaItem = button.closest('.etapa-item');
    if (etapaItem) {
        etapaItem.remove();
        updateDuracaoTotal();
        updateTotalEtapas();
        renumberEtapas();
    }
}

// Renumerar etapas
function renumberEtapas() {
    const etapas = document.querySelectorAll('.etapa-item');
    etapas.forEach((etapa, index) => {
        const header = etapa.querySelector('.etapa-header h5');
        if (header) {
            header.textContent = `Etapa ${index + 1}`;
        }
    });
}

// Atualizar duração total
function updateDuracaoTotal() {
    const duracaoInputs = document.querySelectorAll('.etapa-duracao');
    let total = 0;
    
    duracaoInputs.forEach(input => {
        const valor = parseInt(input.value) || 0;
        total += valor;
    });
    
    const totalElement = document.getElementById('duracaoTotalEtapas');
    if (totalElement) {
        totalElement.textContent = `${total} min`;
    }
}

// Atualizar total de etapas
function updateTotalEtapas() {
    const etapas = document.querySelectorAll('.etapa-item');
    const totalElement = document.getElementById('totalEtapas');
    
    if (totalElement) {
        totalElement.textContent = etapas.length;
    }
}

// ==================== FUNÇÕES DE MATERIAIS ====================

// Adicionar material
function addMaterial() {
    const container = document.getElementById('materiaisContainer');
    if (!container) return;
    
    const materialHtml = `
        <div class="material-item">
            <div class="form-row">
                <div class="form-group">
                    <label class="form-label">Material</label>
                    <input type="text" class="material-nome" placeholder="Ex: Livro didático, Slides, Worksheets">
                </div>
                <div class="form-group">
                    <label class="form-label">Quantidade</label>
                    <input type="text" class="material-quantidade" placeholder="Ex: 1 por aluno, 1 para a turma">
                </div>
                <div class="form-group">
                    <button type="button" class="btn-remove-material" onclick="removeMaterial(this)">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
            </div>
            <div class="form-group">
                <label class="form-label">Observações</label>
                <input type="text" class="material-observacoes" placeholder="Informações adicionais sobre o material...">
            </div>
        </div>
    `;
    
    container.insertAdjacentHTML('beforeend', materialHtml);
}

// Remover material
function removeMaterial(button) {
    const materialItem = button.closest('.material-item');
    if (materialItem) {
        materialItem.remove();
    }
}

// ==================== FUNÇÕES DE TEMPLATES ====================

// Carregar opções de templates
function loadTemplateOptions() {
    const select = document.getElementById('planejamentoTemplate');
    if (!select) return;
    
    // Limpar opções existentes (exceto a primeira)
    while (select.children.length > 1) {
        select.removeChild(select.lastChild);
    }
    
    // Adicionar templates
    templatesAula.forEach(template => {
        const option = document.createElement('option');
        option.value = template.id;
        option.textContent = `${template.nome} (${template.nivel} - ${template.duracao}min)`;
        select.appendChild(option);
    });
}

// Carregar dados do template
function loadTemplateData() {
    const select = document.getElementById('planejamentoTemplate');
    if (!select || !select.value) return;
    
    const template = templatesAula.find(t => t.id === select.value);
    if (!template) return;
    
    console.log('📋 Carregando template:', template.nome);
    
    // Preencher campos básicos
    document.getElementById('planejamentoTipo').value = template.tipo;
    document.getElementById('planejamentoNivel').value = template.nivel;
    document.getElementById('planejamentoDuracao').value = template.duracao;
    
    // Preencher objetivos
    const objetivosContainer = document.getElementById('objetivosContainer');
    if (objetivosContainer && template.objetivos) {
        objetivosContainer.innerHTML = '';
        template.objetivos.forEach(objetivo => {
            const objetivoHtml = `
                <div class="objetivo-item">
                    <input type="text" class="objetivo-input" value="${objetivo}">
                    <button type="button" class="btn-remove-objetivo" onclick="removeObjetivo(this)">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
            `;
            objetivosContainer.insertAdjacentHTML('beforeend', objetivoHtml);
        });
    }
    
    // Preencher estrutura
    const estruturaContainer = document.getElementById('estruturaContainer');
    if (estruturaContainer && template.estrutura) {
        estruturaContainer.innerHTML = '';
        template.estrutura.forEach((etapa, index) => {
            const etapaHtml = `
                <div class="etapa-item">
                    <div class="etapa-header">
                        <h5>Etapa ${index + 1}</h5>
                        <button type="button" class="btn-remove-etapa" onclick="removeEtapa(this)">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                    <div class="etapa-content">
                        <div class="form-row">
                            <div class="form-group">
                                <label class="form-label">Nome da Etapa</label>
                                <input type="text" class="etapa-nome" value="${etapa.etapa}">
                            </div>
                            <div class="form-group">
                                <label class="form-label">Duração (min)</label>
                                <input type="number" class="etapa-duracao" value="${etapa.duracao}" onchange="updateDuracaoTotal()">
                            </div>
                        </div>
                        <div class="form-group">
                            <label class="form-label">Atividade</label>
                            <textarea class="etapa-atividade" rows="2">${etapa.atividade}</textarea>
                        </div>
                        <div class="form-group">
                            <label class="form-label">Objetivos Específicos</label>
                            <input type="text" class="etapa-objetivos" value="">
                        </div>
                    </div>
                </div>
            `;
            estruturaContainer.insertAdjacentHTML('beforeend', etapaHtml);
        });
        
        updateDuracaoTotal();
        updateTotalEtapas();
    }
    
    // Preencher materiais
    const materiaisContainer = document.getElementById('materiaisContainer');
    if (materiaisContainer && template.materiais) {
        materiaisContainer.innerHTML = '';
        template.materiais.forEach(material => {
            const materialHtml = `
                <div class="material-item">
                    <div class="form-row">
                        <div class="form-group">
                            <label class="form-label">Material</label>
                            <input type="text" class="material-nome" value="${material}">
                        </div>
                        <div class="form-group">
                            <label class="form-label">Quantidade</label>
                            <input type="text" class="material-quantidade" placeholder="Ex: 1 por aluno">
                        </div>
                        <div class="form-group">
                            <button type="button" class="btn-remove-material" onclick="removeMaterial(this)">
                                <i class="fas fa-times"></i>
                            </button>
                        </div>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Observações</label>
                        <input type="text" class="material-observacoes" placeholder="Informações adicionais...">
                    </div>
                </div>
            `;
            materiaisContainer.insertAdjacentHTML('beforeend', materialHtml);
        });
    }
    
    // Preencher avaliação
    document.getElementById('criteriosAvaliacao').value = template.avaliacao || '';
    
    showAlert('Template carregado com sucesso!', 'success');
}

// Continua no próximo bloco...

// ==================== FUNÇÕES DE CRUD ====================

// Criar planejamento
function criarPlanejamento() {
    console.log('➕ Criando novo planejamento...');
    
    try {
        const planejamento = collectPlanejamentoData();
        if (!planejamento) return;
        
        // Validar dados obrigatórios
        if (!planejamento.titulo || !planejamento.tipo || !planejamento.nivel || !planejamento.duracao) {
            showAlert('Preencha todos os campos obrigatórios!', 'warning');
            return;
        }
        
        // Gerar ID único
        planejamento.id = 'plan_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
        planejamento.dataCriacao = new Date().toISOString();
        planejamento.dataAtualizacao = new Date().toISOString();
        planejamento.status = 'planejado';
        
        // Adicionar ao array
        window.planejamentos.push(planejamento);
        
        // Salvar no localStorage
        localStorage.setItem('planejamentos', JSON.stringify(planejamentos));
        
        // Fechar modal
        closePlanejamentoModal('novoPlanejamentoModal');
        
        // Atualizar interface
        renderPlanejamentosList();
        updatePlanejamentosStats();
        
        showAlert('Planejamento criado com sucesso!', 'success');
        
    } catch (error) {
        console.error('❌ Erro ao criar planejamento:', error);
        showAlert('Erro ao criar planejamento!', 'danger');
    }
}

// Salvar rascunho
function salvarRascunhoPlanejamento() {
    console.log('💾 Salvando rascunho...');
    
    try {
        const planejamento = collectPlanejamentoData();
        if (!planejamento) return;
        
        // Validar pelo menos o título
        if (!planejamento.titulo) {
            showAlert('Informe pelo menos o título do planejamento!', 'warning');
            return;
        }
        
        // Gerar ID único
        planejamento.id = 'plan_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
        planejamento.dataCriacao = new Date().toISOString();
        planejamento.dataAtualizacao = new Date().toISOString();
        planejamento.status = 'rascunho';
        
        // Adicionar ao array
        window.planejamentos.push(planejamento);
        
        // Salvar no localStorage
        localStorage.setItem('planejamentos', JSON.stringify(planejamentos));
        
        // Fechar modal
        closePlanejamentoModal('novoPlanejamentoModal');
        
        // Atualizar interface
        renderPlanejamentosList();
        updatePlanejamentosStats();
        
        showAlert('Rascunho salvo com sucesso!', 'info');
        
    } catch (error) {
        console.error('❌ Erro ao salvar rascunho:', error);
        showAlert('Erro ao salvar rascunho!', 'danger');
    }
}

// Coletar dados do formulário
function collectPlanejamentoData() {
    const planejamento = {
        titulo: document.getElementById('planejamentoTitulo')?.value || '',
        tipo: document.getElementById('planejamentoTipo')?.value || '',
        nivel: document.getElementById('planejamentoNivel')?.value || '',
        duracao: parseInt(document.getElementById('planejamentoDuracao')?.value) || 0,
        dataPlanejada: document.getElementById('planejamentoData')?.value || '',
        descricao: document.getElementById('planejamentoDescricao')?.value || '',
        objetivos: collectObjetivos(),
        estrutura: collectEstrutura(),
        materiais: collectMateriais(),
        avaliacao: collectAvaliacao()
    };
    
    return planejamento;
}

// Coletar objetivos
function collectObjetivos() {
    const inputs = document.querySelectorAll('.objetivo-input');
    const objetivos = [];
    
    inputs.forEach(input => {
        if (input.value.trim()) {
            objetivos.push(input.value.trim());
        }
    });
    
    return objetivos;
}

// Coletar estrutura
function collectEstrutura() {
    const etapas = document.querySelectorAll('.etapa-item');
    const estrutura = [];
    
    etapas.forEach(etapa => {
        const nome = etapa.querySelector('.etapa-nome')?.value || '';
        const duracao = parseInt(etapa.querySelector('.etapa-duracao')?.value) || 0;
        const atividade = etapa.querySelector('.etapa-atividade')?.value || '';
        const objetivos = etapa.querySelector('.etapa-objetivos')?.value || '';
        
        if (nome || atividade) {
            estrutura.push({
                etapa: nome,
                duracao: duracao,
                atividade: atividade,
                objetivos: objetivos
            });
        }
    });
    
    return estrutura;
}

// Coletar materiais
function collectMateriais() {
    const materiaisItems = document.querySelectorAll('.material-item');
    const materiais = [];
    
    materiaisItems.forEach(item => {
        const nome = item.querySelector('.material-nome')?.value || '';
        const quantidade = item.querySelector('.material-quantidade')?.value || '';
        const observacoes = item.querySelector('.material-observacoes')?.value || '';
        
        if (nome) {
            materiais.push({
                nome: nome,
                quantidade: quantidade,
                observacoes: observacoes
            });
        }
    });
    
    return {
        materiais: materiais,
        recursosDigitais: document.getElementById('recursosDigitais')?.value || '',
        preparacaoPrevia: document.getElementById('preparacaoPrevia')?.value || ''
    };
}

// Coletar avaliação
function collectAvaliacao() {
    return {
        tipo: document.getElementById('tipoAvaliacao')?.value || '',
        criterios: document.getElementById('criteriosAvaliacao')?.value || '',
        instrumentos: document.getElementById('instrumentosAvaliacao')?.value || '',
        homework: document.getElementById('homework')?.value || '',
        observacoes: document.getElementById('observacoesPlanejamento')?.value || ''
    };
}

// Visualizar planejamento
function viewPlanejamento(id) {
    console.log('👁️ Visualizando planejamento:', id);
    
    const planejamento = planejamentos.find(p => p.id === id);
    if (!planejamento) {
        showAlert('Planejamento não encontrado!', 'warning');
        return;
    }
    
    // Implementar modal de visualização
    showPlanejamentoDetailsModal(planejamento);
}

// Editar planejamento
function editPlanejamento(id) {
    console.log('✏️ Editando planejamento:', id);
    
    const planejamento = planejamentos.find(p => p.id === id);
    if (!planejamento) {
        showAlert('Planejamento não encontrado!', 'warning');
        return;
    }
    
    // Implementar modal de edição
    showEditPlanejamentoModal(planejamento);
}

// Duplicar planejamento
function duplicatePlanejamento(id) {
    console.log('📋 Duplicando planejamento:', id);
    
    const planejamento = planejamentos.find(p => p.id === id);
    if (!planejamento) {
        showAlert('Planejamento não encontrado!', 'warning');
        return;
    }
    
    // Confirmar duplicação
    if (confirm('Deseja duplicar este planejamento?')) {
        const duplicado = {
            ...planejamento,
            id: 'plan_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
            titulo: planejamento.titulo + ' (Cópia)',
            dataCriacao: new Date().toISOString(),
            dataAtualizacao: new Date().toISOString(),
            status: 'rascunho'
        };
        
        window.planejamentos.push(duplicado);
        localStorage.setItem('planejamentos', JSON.stringify(planejamentos));
        
        renderPlanejamentosList();
        updatePlanejamentosStats();
        
        showAlert('Planejamento duplicado com sucesso!', 'success');
    }
}

// Excluir planejamento
function deletePlanejamento(id) {
    console.log('🗑️ Excluindo planejamento:', id);
    
    const planejamento = planejamentos.find(p => p.id === id);
    if (!planejamento) {
        showAlert('Planejamento não encontrado!', 'warning');
        return;
    }
    
    // Confirmar exclusão
    if (confirm(`Tem certeza que deseja excluir o planejamento "${planejamento.titulo}"?`)) {
        const index = planejamentos.findIndex(p => p.id === id);
        if (index > -1) {
            planejamentos.splice(index, 1);
            localStorage.setItem('planejamentos', JSON.stringify(planejamentos));
            
            renderPlanejamentosList();
            updatePlanejamentosStats();
            
            showAlert('Planejamento excluído com sucesso!', 'success');
        }
    }
}

// ==================== FUNÇÕES DE BIBLIOTECA ====================

// Mostrar modal de biblioteca
function showBibliotecaModal() {
    console.log('📚 Abrindo biblioteca de atividades...');
    
    const modal = document.getElementById('bibliotecaModal');
    if (modal) {
        modal.style.display = 'block';
        renderBibliotecaAtividades();
    }
}

// Renderizar biblioteca de atividades
function renderBibliotecaAtividades() {
    const container = document.getElementById('bibliotecaGrid');
    if (!container) return;
    
    const atividades = getAtividadesFiltradas();
    
    container.innerHTML = atividades.map(atividade => `
        <div class="atividade-card">
            <div class="atividade-header">
                <h4>${atividade.nome}</h4>
                <span class="tipo-badge ${atividade.tipo}">${atividade.tipo}</span>
            </div>
            <div class="atividade-body">
                <p class="atividade-descricao">${atividade.descricao}</p>
                <div class="atividade-info">
                    <span class="info-item">
                        <i class="fas fa-clock"></i> ${atividade.duracao} min
                    </span>
                    <span class="info-item">
                        <i class="fas fa-layer-group"></i> ${atividade.nivel.join(', ')}
                    </span>
                </div>
                <div class="atividade-materiais">
                    <strong>Materiais:</strong> ${atividade.materiais.join(', ')}
                </div>
            </div>
            <div class="atividade-footer">
                <button class="btn btn-primary btn-sm" onclick="useAtividade('${atividade.id}')">
                    <i class="fas fa-plus"></i> Usar
                </button>
                <button class="btn btn-warning btn-sm" onclick="editAtividade('${atividade.id}')">
                    <i class="fas fa-edit"></i> Editar
                </button>
                <button class="btn btn-danger btn-sm" onclick="deleteAtividade('${atividade.id}')">
                    <i class="fas fa-trash"></i> Excluir
                </button>
            </div>
        </div>
    `).join('');
}

// Filtrar atividades
function filterAtividades() {
    renderBibliotecaAtividades();
}

// Obter atividades filtradas
function getAtividadesFiltradas() {
    const searchTerm = document.getElementById('bibliotecaSearch')?.value.toLowerCase() || '';
    const tipoFilter = document.getElementById('bibliotecaTipo')?.value || '';
    
    return bibliotecaAtividades.filter(atividade => {
        const matchSearch = !searchTerm || 
            atividade.nome.toLowerCase().includes(searchTerm) ||
            atividade.descricao.toLowerCase().includes(searchTerm);
        
        const matchTipo = !tipoFilter || atividade.tipo === tipoFilter;
        
        return matchSearch && matchTipo;
    });
}

// Usar atividade
function useAtividade(id) {
    const atividade = bibliotecaAtividades.find(a => a.id === id);
    if (!atividade) return;
    
    // Adicionar à estrutura da aula
    const estruturaContainer = document.getElementById('estruturaContainer');
    if (estruturaContainer) {
        const etapaIndex = estruturaContainer.children.length;
        
        const etapaHtml = `
            <div class="etapa-item">
                <div class="etapa-header">
                    <h5>Etapa ${etapaIndex + 1}</h5>
                    <button type="button" class="btn-remove-etapa" onclick="removeEtapa(this)">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="etapa-content">
                    <div class="form-row">
                        <div class="form-group">
                            <label class="form-label">Nome da Etapa</label>
                            <input type="text" class="etapa-nome" value="${atividade.nome}">
                        </div>
                        <div class="form-group">
                            <label class="form-label">Duração (min)</label>
                            <input type="number" class="etapa-duracao" value="${atividade.duracao}" onchange="updateDuracaoTotal()">
                        </div>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Atividade</label>
                        <textarea class="etapa-atividade" rows="2">${atividade.descricao}</textarea>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Objetivos Específicos</label>
                        <input type="text" class="etapa-objetivos" value="${atividade.objetivos.join(', ')}">
                    </div>
                </div>
            </div>
        `;
        
        estruturaContainer.insertAdjacentHTML('beforeend', etapaHtml);
        updateDuracaoTotal();
        updateTotalEtapas();
    }
    
    // Adicionar materiais
    const materiaisContainer = document.getElementById('materiaisContainer');
    if (materiaisContainer) {
        atividade.materiais.forEach(material => {
            const materialHtml = `
                <div class="material-item">
                    <div class="form-row">
                        <div class="form-group">
                            <label class="form-label">Material</label>
                            <input type="text" class="material-nome" value="${material}">
                        </div>
                        <div class="form-group">
                            <label class="form-label">Quantidade</label>
                            <input type="text" class="material-quantidade" placeholder="Ex: 1 por aluno">
                        </div>
                        <div class="form-group">
                            <button type="button" class="btn-remove-material" onclick="removeMaterial(this)">
                                <i class="fas fa-times"></i>
                            </button>
                        </div>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Observações</label>
                        <input type="text" class="material-observacoes" placeholder="Informações adicionais...">
                    </div>
                </div>
            `;
            materiaisContainer.insertAdjacentHTML('beforeend', materialHtml);
        });
    }
    
    // Fechar modal da biblioteca
    closePlanejamentoModal('bibliotecaModal');
    
    // Ir para aba de estrutura
    switchPlanejamentoTab('estrutura');
    
    showAlert('Atividade adicionada ao planejamento!', 'success');
}

// ==================== FUNÇÕES DE TEMPLATES ====================

// Mostrar modal de templates
function showTemplatesModal() {
    console.log('📑 Abrindo templates...');
    
    const modal = document.getElementById('templatesModal');
    if (modal) {
        modal.style.display = 'block';
        renderTemplates();
    }
}

// Renderizar templates
function renderTemplates() {
    const container = document.getElementById('templatesGrid');
    if (!container) return;
    
    container.innerHTML = templatesAula.map(template => `
        <div class="template-card">
            <div class="template-header">
                <h4>${template.nome}</h4>
                <div class="template-meta">
                    <span class="tipo-badge ${template.tipo}">${template.tipo}</span>
                    <span class="nivel-badge">${template.nivel}</span>
                </div>
            </div>
            <div class="template-body">
                <div class="template-info">
                    <span class="info-item">
                        <i class="fas fa-clock"></i> ${template.duracao} min
                    </span>
                    <span class="info-item">
                        <i class="fas fa-list"></i> ${template.estrutura.length} etapas
                    </span>
                </div>
                <div class="template-objetivos">
                    <strong>Objetivos:</strong>
                    <ul>
                        ${template.objetivos.map(obj => `<li>${obj}</li>`).join('')}
                    </ul>
                </div>
            </div>
            <div class="template-footer">
                <button class="btn btn-primary btn-sm" onclick="useTemplate('${template.id}')">
                    <i class="fas fa-plus"></i> Usar Template
                </button>
                <button class="btn btn-warning btn-sm" onclick="editTemplate('${template.id}')">
                    <i class="fas fa-edit"></i> Editar
                </button>
                <button class="btn btn-danger btn-sm" onclick="deleteTemplate('${template.id}')">
                    <i class="fas fa-trash"></i> Excluir
                </button>
            </div>
        </div>
    `).join('');
}

// Usar template
function useTemplate(id) {
    const template = templatesAula.find(t => t.id === id);
    if (!template) return;
    
    // Fechar modal de templates
    closePlanejamentoModal('templatesModal');
    
    // Abrir modal de novo planejamento
    showNovoPlanejamentoModal();
    
    // Aguardar um pouco para o modal carregar
    setTimeout(() => {
        // Selecionar template
        const templateSelect = document.getElementById('planejamentoTemplate');
        if (templateSelect) {
            templateSelect.value = id;
            loadTemplateData();
        }
    }, 100);
}

// ==================== FUNÇÕES AUXILIARES ====================

// Mostrar modal de detalhes do planejamento
function showPlanejamentoDetailsModal(planejamento) {
    // Implementar modal de visualização detalhada
    const modalHtml = `
        <div class="modal fade show" id="planejamentoDetailsModal" style="display: block;">
            <div class="modal-dialog modal-xl">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">
                            <i class="fas fa-eye"></i> ${planejamento.titulo}
                        </h5>
                        <button type="button" class="close" onclick="closePlanejamentoDetailsModal()">
                            <span>&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        ${createPlanejamentoDetailsContent(planejamento)}
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-warning" onclick="editPlanejamento('${planejamento.id}'); closePlanejamentoDetailsModal();">
                            <i class="fas fa-edit"></i> Editar
                        </button>
                        <button type="button" class="btn btn-secondary" onclick="closePlanejamentoDetailsModal()">
                            <i class="fas fa-times"></i> Fechar
                        </button>
                    </div>
                </div>
            </div>
        </div>
        <div class="modal-backdrop fade show"></div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHtml);
}

// Criar conteúdo dos detalhes do planejamento
function createPlanejamentoDetailsContent(planejamento) {
    return `
        <div class="planejamento-details">
            <div class="details-grid">
                <div class="detail-section">
                    <h6><i class="fas fa-info-circle"></i> Informações Básicas</h6>
                    <div class="detail-item">
                        <strong>Tipo:</strong> ${planejamento.tipo}
                    </div>
                    <div class="detail-item">
                        <strong>Nível:</strong> ${planejamento.nivel}
                    </div>
                    <div class="detail-item">
                        <strong>Duração:</strong> ${planejamento.duracao} minutos
                    </div>
                    <div class="detail-item">
                        <strong>Data Planejada:</strong> ${planejamento.dataPlanejada ? new Date(planejamento.dataPlanejada).toLocaleDateString('pt-BR') : 'Não definida'}
                    </div>
                </div>
                
                <div class="detail-section">
                    <h6><i class="fas fa-target"></i> Objetivos</h6>
                    <ul>
                        ${planejamento.objetivos ? planejamento.objetivos.map(obj => `<li>${obj}</li>`).join('') : '<li>Nenhum objetivo definido</li>'}
                    </ul>
                </div>
                
                <div class="detail-section">
                    <h6><i class="fas fa-list"></i> Estrutura da Aula</h6>
                    ${planejamento.estrutura && planejamento.estrutura.length > 0 ? 
                        planejamento.estrutura.map((etapa, index) => `
                            <div class="estrutura-item">
                                <h7>${index + 1}. ${etapa.etapa} (${etapa.duracao} min)</h7>
                                <p>${etapa.atividade}</p>
                                ${etapa.objetivos ? `<small><strong>Objetivos:</strong> ${etapa.objetivos}</small>` : ''}
                            </div>
                        `).join('') : 
                        '<p>Nenhuma estrutura definida</p>'
                    }
                </div>
                
                <div class="detail-section">
                    <h6><i class="fas fa-tools"></i> Materiais</h6>
                    ${planejamento.materiais && planejamento.materiais.materiais ? 
                        planejamento.materiais.materiais.map(material => `
                            <div class="material-item">
                                <strong>${material.nome}</strong>
                                ${material.quantidade ? ` - ${material.quantidade}` : ''}
                                ${material.observacoes ? `<br><small>${material.observacoes}</small>` : ''}
                            </div>
                        `).join('') : 
                        '<p>Nenhum material definido</p>'
                    }
                </div>
            </div>
        </div>
    `;
}

// Fechar modal de detalhes
function closePlanejamentoDetailsModal() {
    const modal = document.getElementById('planejamentoDetailsModal');
    const backdrop = document.querySelector('.modal-backdrop');
    
    if (modal) modal.remove();
    if (backdrop) backdrop.remove();
}

// Salvar dados no localStorage
function savePlanejamentosToStorage() {
    try {
        localStorage.setItem('planejamentos', JSON.stringify(window.planejamentos));
        localStorage.setItem('templatesAula', JSON.stringify(window.templatesAula));
        localStorage.setItem('bibliotecaAtividades', JSON.stringify(window.bibliotecaAtividades));
        console.log('💾 Dados salvos no localStorage');
    } catch (error) {
        console.error('❌ Erro ao salvar dados:', error);
    }
}

// Placeholder para outras funções
function showNovoTemplateModal() {
    showAlert('Funcionalidade em desenvolvimento!', 'info');
}

function showNovaAtividadeModal() {
    showAlert('Funcionalidade em desenvolvimento!', 'info');
}

function editTemplate(id) {
    showAlert('Funcionalidade em desenvolvimento!', 'info');
}

function deleteTemplate(id) {
    showAlert('Funcionalidade em desenvolvimento!', 'info');
}

function editAtividade(id) {
    showAlert('Funcionalidade em desenvolvimento!', 'info');
}

function deleteAtividade(id) {
    showAlert('Funcionalidade em desenvolvimento!', 'info');
}

function showEditPlanejamentoModal(planejamento) {
    showAlert('Funcionalidade em desenvolvimento!', 'info');
}

console.log('✅ Sistema de Planejamento de Aulas v3.0.0 carregado completamente!');
