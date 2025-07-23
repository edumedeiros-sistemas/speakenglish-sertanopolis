// ==================== TESTE DO MÓDULO DE RELATÓRIOS ====================

console.log('🧪 Teste do módulo de relatórios carregado');

// Função para testar se o módulo de relatórios está funcionando
window.testReportsModule = function() {
    console.log('🧪 === TESTE DO MÓDULO DE RELATÓRIOS ===');
    
    // Verificar se a função principal existe
    console.log('📊 loadReportsModule existe:', typeof loadReportsModule);
    
    // Verificar se o container existe
    const gestaoContent = document.getElementById('gestaoContent');
    console.log('📦 gestaoContent existe:', !!gestaoContent);
    
    // Tentar executar a função
    if (typeof loadReportsModule === 'function') {
        try {
            console.log('🚀 Executando loadReportsModule...');
            loadReportsModule();
            console.log('✅ loadReportsModule executada com sucesso');
        } catch (error) {
            console.error('❌ Erro ao executar loadReportsModule:', error);
        }
    } else {
        console.error('❌ loadReportsModule não encontrada');
    }
    
    // Verificar dependências
    console.log('🔍 Dependências:');
    console.log('- students:', window.students ? `${window.students.length} alunos` : 'não disponível');
    console.log('- mensalidades:', window.mensalidades ? `${window.mensalidades.length} mensalidades` : 'não disponível');
    console.log('- contratos:', window.contratos ? `${window.contratos.length} contratos` : 'não disponível');
    
    console.log('🧪 === FIM DO TESTE ===');
};

// Função para forçar carregamento dos relatórios
window.forceLoadReports = function() {
    console.log('🔄 Forçando carregamento dos relatórios...');
    
    const gestaoContent = document.getElementById('gestaoContent');
    if (!gestaoContent) {
        console.error('❌ gestaoContent não encontrado');
        return;
    }
    
    // Limpar conteúdo atual
    gestaoContent.innerHTML = '<p>Carregando...</p>';
    
    // Tentar carregar novamente
    setTimeout(() => {
        if (typeof loadReportsModule === 'function') {
            loadReportsModule();
        } else {
            gestaoContent.innerHTML = `
                <div class="error-state">
                    <h3>Módulo não carregado</h3>
                    <p>A função loadReportsModule não está disponível.</p>
                    <button onclick="location.reload()">Recarregar Página</button>
                </div>
            `;
        }
    }, 100);
};

// Disponibilizar no console
window.testReports = testReportsModule;
window.forceReports = forceLoadReports;

console.log('✅ Funções de teste disponíveis: testReports() e forceReports()'); 