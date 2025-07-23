// ==================== DEBUG ESPECÍFICO PARA RELATÓRIOS DE ALUNOS ====================

console.log('🐛 Carregando debug específico para relatórios de alunos...');

// Função para debug dos relatórios de alunos
window.debugStudentReports = function() {
    console.log('🐛 === DEBUG RELATÓRIOS DE ALUNOS ===');
    
    // Verificar elementos DOM
    const selector = document.getElementById('studentSelector');
    const container = document.getElementById('studentReportData');
    const periodFilter = document.getElementById('studentPeriodFilter');
    
    console.log('📋 Elementos DOM:', {
        selector: !!selector,
        container: !!container,
        periodFilter: !!periodFilter
    });
    
    if (selector) {
        console.log('📋 Selector details:', {
            value: selector.value,
            options: selector.querySelectorAll('option').length,
            innerHTML: selector.innerHTML.substring(0, 200) + '...'
        });
    }
    
    if (container) {
        console.log('📋 Container details:', {
            innerHTML: container.innerHTML.substring(0, 200) + '...'
        });
    }
    
    // Verificar dados
    console.log('📊 Dados disponíveis:', {
        students: window.students ? students.length : 'undefined',
        mensalidades: window.mensalidades ? mensalidades.length : 'undefined',
        contratos: window.contratos ? contratos.length : 'undefined'
    });
    
    if (window.students && students.length > 0) {
        console.log('👥 Primeiros 3 alunos:', students.slice(0, 3).map(s => ({ name: s.name, email: s.email })));
    }
    
    // Verificar funções auxiliares
    console.log('🔧 Funções auxiliares:', {
        generateAvatar: typeof generateAvatar,
        getStudentLevel: typeof getStudentLevel,
        calculateStudentData: typeof calculateStudentData,
        loadStudentOptions: typeof loadStudentOptions,
        updateStudentReports: typeof updateStudentReports,
        loadReportsModule: typeof loadReportsModule
    });
    
    // Verificar se as abas estão funcionando
    const reportsTabContent = document.getElementById('reportsTabContent');
    const studentReportsContent = document.getElementById('studentReportsContent');
    
    console.log('📋 Estrutura de abas:', {
        reportsTabContent: !!reportsTabContent,
        studentReportsContent: !!studentReportsContent,
        studentReportsActive: studentReportsContent?.classList.contains('active')
    });
    
    console.log('🐛 === FIM DEBUG RELATÓRIOS DE ALUNOS ===');
};

// Função para forçar carregamento da aba de alunos
window.forceStudentReportsTab = function() {
    console.log('🔄 Forçando carregamento da aba de relatórios de alunos...');
    
    // Verificar se a função showReportsTab existe
    if (typeof showReportsTab === 'function') {
        showReportsTab('students');
        console.log('✅ Aba de alunos ativada');
        
        // Aguardar um pouco e verificar se carregou
        setTimeout(() => {
            const container = document.getElementById('studentReportData');
            const selector = document.getElementById('studentSelector');
            
            if (container && selector) {
                console.log('🔍 Estado após ativação:', {
                    containerHTML: container.innerHTML.substring(0, 100),
                    selectorOptions: selector.querySelectorAll('option').length
                });
                
                // Se o selector estiver vazio, tentar recarregar
                if (selector.querySelectorAll('option').length <= 1) {
                    console.log('⚠️ Selector vazio, tentando recarregar...');
                    if (typeof loadStudentOptions === 'function') {
                        loadStudentOptions();
                    }
                }
            }
        }, 500);
    } else {
        console.error('❌ Função showReportsTab não encontrada');
    }
};

// Função para testar seleção automática de um aluno
window.testStudentSelection = function() {
    console.log('🧪 Testando seleção automática de aluno...');
    
    const selector = document.getElementById('studentSelector');
    if (!selector) {
        console.error('❌ Selector não encontrado');
        return;
    }
    
    const options = selector.querySelectorAll('option');
    console.log(`📊 Opções disponíveis: ${options.length}`);
    
    if (options.length < 2) {
        console.error('❌ Nenhum aluno disponível para teste');
        console.log('🔄 Tentando recarregar opções...');
        
        if (typeof loadStudentOptions === 'function') {
            loadStudentOptions();
            
            // Tentar novamente após reload
            setTimeout(() => {
                const newOptions = selector.querySelectorAll('option');
                console.log(`📊 Opções após reload: ${newOptions.length}`);
                
                if (newOptions.length >= 2) {
                    // Selecionar primeiro aluno
                    const firstStudentOption = newOptions[1];
                    selector.value = firstStudentOption.value;
                    console.log(`👤 Aluno selecionado: ${firstStudentOption.textContent}`);
                    
                    // Chamar função de atualização
                    if (typeof updateStudentReports === 'function') {
                        updateStudentReports();
                    }
                }
            }, 1000);
        }
        
        return;
    }
    
    // Selecionar primeiro aluno (índice 1, pois 0 é "Selecione um aluno")
    const firstStudentOption = options[1];
    selector.value = firstStudentOption.value;
    
    console.log(`👤 Aluno selecionado para teste: ${firstStudentOption.textContent}`);
    
    // Simular mudança
    const event = new Event('change', { bubbles: true });
    selector.dispatchEvent(event);
    
    // Chamar função de atualização
    if (typeof updateStudentReports === 'function') {
        updateStudentReports();
        console.log('✅ Relatório atualizado');
    } else {
        console.error('❌ Função updateStudentReports não disponível');
    }
};

// Função para verificar se módulo de relatórios carregou corretamente
window.checkReportsModule = function() {
    console.log('🔍 === VERIFICAÇÃO DO MÓDULO DE RELATÓRIOS ===');
    
    // Verificar se as funções principais existem
    const functions = [
        'loadReportsModule',
        'showReportsTab', 
        'updateStudentReports',
        'updateFinancialReports',
        'updatePerformanceReports'
    ];
    
    functions.forEach(func => {
        console.log(`📋 ${func}:`, typeof window[func]);
    });
    
    // Verificar elementos DOM principais
    const elements = [
        'gestaoContent',
        'reportsTabContent',
        'studentReportsContent',
        'studentSelector',
        'studentReportData'
    ];
    
    elements.forEach(id => {
        const element = document.getElementById(id);
        console.log(`📋 ${id}:`, !!element);
    });
    
    console.log('🔍 === FIM VERIFICAÇÃO ===');
};

// Função para forçar recarga completa dos relatórios
window.forceReloadReports = function() {
    console.log('🔄 Forçando recarga completa dos relatórios...');
    
    // Limpar container
    const gestaoContent = document.getElementById('gestaoContent');
    if (gestaoContent) {
        gestaoContent.innerHTML = '<p>Recarregando relatórios...</p>';
        
        // Aguardar e recarregar
        setTimeout(() => {
            if (typeof loadReportsModule === 'function') {
                loadReportsModule();
                console.log('✅ Relatórios recarregados');
                
                // Ativar aba de alunos após reload
                setTimeout(() => {
                    forceStudentReportsTab();
                }, 1000);
            } else {
                console.error('❌ loadReportsModule não disponível');
                gestaoContent.innerHTML = `
                    <div class="error-state">
                        <h3>Erro</h3>
                        <p>Módulo de relatórios não carregado</p>
                        <button onclick="location.reload()">Recarregar Página</button>
                    </div>
                `;
            }
        }, 500);
    }
};

// Disponibilizar no console para debug manual
window.debugSR = debugStudentReports;
window.forceSR = forceStudentReportsTab;
window.testSR = testStudentSelection;
window.checkRM = checkReportsModule;
window.reloadReports = forceReloadReports;

console.log('✅ Debug avançado de relatórios carregado!');
console.log('💡 Comandos disponíveis:');
console.log('  - debugSR() - Debug completo');
console.log('  - forceSR() - Forçar aba de alunos');
console.log('  - testSR() - Testar seleção');
console.log('  - checkRM() - Verificar módulo');
console.log('  - reloadReports() - Recarregar tudo'); 