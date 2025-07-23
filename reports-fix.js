// ==================== CORREÇÃO AUTOMÁTICA DOS RELATÓRIOS DE ALUNOS ====================

console.log('🔧 Carregando correções automáticas para relatórios de alunos...');

// Função para verificar e corrigir relatórios de alunos
function autoFixStudentReports() {
    console.log('🔧 === CORREÇÃO AUTOMÁTICA DOS RELATÓRIOS ===');
    
    // Aguardar um pouco para garantir que tudo esteja carregado
    setTimeout(() => {
        console.log('🔍 Verificando se relatórios precisam de correção...');
        
        // Verificar se o módulo de relatórios está carregado
        if (typeof loadReportsModule !== 'function') {
            console.log('❌ Módulo de relatórios não carregado, aguardando...');
            setTimeout(autoFixStudentReports, 2000);
            return;
        }
        
        // Verificar se students está disponível
        if (!window.students) {
            console.log('⚠️ Students não disponível, tentando carregar do localStorage...');
            const storedStudents = localStorage.getItem('students');
            if (storedStudents) {
                try {
                    window.students = JSON.parse(storedStudents);
                    console.log(`✅ Carregados ${students.length} alunos do localStorage`);
                } catch (error) {
                    console.error('❌ Erro ao carregar students do localStorage:', error);
                }
            }
        }
        
        // Verificar se mensalidades está disponível
        if (!window.mensalidades) {
            console.log('⚠️ Mensalidades não disponível, tentando carregar do localStorage...');
            const storedMensalidades = localStorage.getItem('mensalidades');
            if (storedMensalidades) {
                try {
                    window.mensalidades = JSON.parse(storedMensalidades);
                    console.log(`✅ Carregadas ${mensalidades.length} mensalidades do localStorage`);
                } catch (error) {
                    console.error('❌ Erro ao carregar mensalidades do localStorage:', error);
                    window.mensalidades = [];
                }
            } else {
                window.mensalidades = [];
            }
        }
        
        console.log('✅ Correção automática concluída');
        
    }, 3000); // Aguardar 3 segundos para tudo carregar
}

// Função para monitorar e corrigir problemas em tempo real
function monitorStudentReports() {
    setInterval(() => {
        // Verificar se estamos na aba de relatórios
        const gestaoTab = document.querySelector('[data-tab="gestao"]');
        const isInGestao = gestaoTab && gestaoTab.classList.contains('active');
        
        if (!isInGestao) return;
        
        // Verificar se o container de relatórios existe
        const reportsContainer = document.querySelector('.reports-module');
        if (!reportsContainer) return;
        
        // Verificar se a aba de alunos está ativa
        const studentTab = document.getElementById('studentReportsTab');
        const studentContent = document.getElementById('studentReportsContent');
        
        if (studentTab && studentContent && studentContent.classList.contains('active')) {
            // Verificar se o selector tem opções
            const selector = document.getElementById('studentSelector');
            if (selector) {
                const options = selector.querySelectorAll('option');
                
                // Se só tem a opção padrão e existem alunos, recarregar
                if (options.length <= 1 && window.students && students.length > 0) {
                    console.log('🔧 Detectado problema no selector, corrigindo...');
                    if (typeof loadStudentOptions === 'function') {
                        loadStudentOptions();
                    }
                }
            }
        }
    }, 5000); // Verificar a cada 5 segundos
}

// Função para executar quando clicar na aba de relatórios
function onReportsTabClick() {
    console.log('📊 Aba de relatórios clicada, verificando...');
    
    setTimeout(() => {
        // Verificar se o módulo carregou
        const reportsModule = document.querySelector('.reports-module');
        if (!reportsModule) {
            console.log('🔧 Módulo não encontrado, tentando carregar...');
            if (typeof loadReportsModule === 'function') {
                loadReportsModule();
            }
        }
        
        // Ativar aba de alunos por padrão se nenhuma estiver ativa
        const activeTab = document.querySelector('.reports-tabs .tab-btn.active');
        if (!activeTab) {
            console.log('🔧 Nenhuma aba ativa, ativando aba de alunos...');
            const studentTab = document.getElementById('studentReportsTab');
            if (studentTab) {
                studentTab.click();
            }
        }
    }, 500);
}

// Interceptar cliques na aba de gestão
document.addEventListener('click', function(event) {
    const target = event.target;
    
    // Verificar se clicou na aba de gestão
    if (target.matches('[data-tab="gestao"]') || target.closest('[data-tab="gestao"]')) {
        onReportsTabClick();
    }
    
    // Verificar se clicou no botão de relatórios
    if (target.textContent && target.textContent.includes('Relatórios')) {
        onReportsTabClick();
    }
});

// Executar correção automática quando carregar
document.addEventListener('DOMContentLoaded', function() {
    console.log('📄 DOM carregado, iniciando correções...');
    autoFixStudentReports();
    monitorStudentReports();
});

// Também executar se o DOM já estiver carregado
if (document.readyState === 'complete' || document.readyState === 'interactive') {
    console.log('📄 DOM já carregado, executando correções...');
    autoFixStudentReports();
    monitorStudentReports();
}

// Função para forçar correção manual
window.fixStudentReports = function() {
    console.log('🔧 Forçando correção manual dos relatórios...');
    
    // Limpar e recarregar tudo
    if (typeof loadReportsModule === 'function') {
        const gestaoContent = document.getElementById('gestaoContent');
        if (gestaoContent) {
            gestaoContent.innerHTML = '<p>Corrigindo relatórios...</p>';
            
            setTimeout(() => {
                loadReportsModule();
                
                setTimeout(() => {
                    if (typeof showReportsTab === 'function') {
                        showReportsTab('students');
                    }
                }, 1000);
            }, 500);
        }
    }
};

console.log('✅ Correções automáticas carregadas!');
console.log('💡 Use fixStudentReports() para correção manual'); 