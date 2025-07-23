// ==================== CORREÇÃO SISTEMA DE MENSALIDADES ====================

// Função global para inicializar sistema de mensalidades
window.initializeMensalidadesSystem = function() {
    console.log('💰 [CORREÇÃO] Inicializando sistema de mensalidades...');
    
    // Verificar se há mensalidades salvas
    const savedMensalidades = localStorage.getItem('mensalidades');
    if (savedMensalidades) {
        try {
            window.mensalidades = JSON.parse(savedMensalidades);
            console.log(`📋 ${window.mensalidades.length} mensalidades carregadas do localStorage`);
        } catch (error) {
            console.error('❌ Erro ao carregar mensalidades:', error);
            window.mensalidades = [];
        }
    } else {
        window.mensalidades = [];
        console.log('📋 Nenhuma mensalidade encontrada - iniciando array vazio');
    }
    
    // Verificar se há contratos ativos
    if (window.contratos && window.contratos.length > 0) {
        const contratosAtivos = window.contratos.filter(c => c.status === 'ativo');
        console.log(`📄 Contratos ativos encontrados: ${contratosAtivos.length}`);
        
        let mensalidadesGeradas = 0;
        contratosAtivos.forEach(contrato => {
            // Verificar se já existem mensalidades para este contrato
            const mensalidadesExistentes = window.mensalidades.filter(m => m.contratoId === contrato.id);
            
            if (mensalidadesExistentes.length === 0) {
                console.log(`💰 Verificando mensalidades para: ${contrato.studentName}`);
                mensalidadesGeradas++;
            }
        });
        
        if (mensalidadesGeradas > 0) {
            console.log(`✅ Sistema verificou ${mensalidadesGeradas} contratos sem mensalidades`);
        }
    }
    
    console.log('✅ [CORREÇÃO] Sistema de mensalidades inicializado');
    return {
        totalMensalidades: window.mensalidades ? window.mensalidades.length : 0,
        contratosAtivos: window.contratos ? window.contratos.filter(c => c.status === 'ativo').length : 0
    };
};

// Garantir que a função está disponível imediatamente
if (typeof window !== 'undefined') {
    console.log('🔧 Função initializeMensalidadesSystem disponível globalmente');
} else {
    console.error('❌ Window não disponível!');
}

console.log('🛠️ Correção do sistema de mensalidades carregada'); 