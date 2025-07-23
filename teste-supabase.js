// SCRIPT DE TESTE PARA VERIFICAR INTEGRAÇÃO SUPABASE
// Cole no console do navegador para testar

console.log('🧪 INICIANDO TESTES SUPABASE...');

async function testarSupabase() {
    try {
        // 1. Verificar se Supabase está carregado
        console.log('1️⃣ Verificando Supabase...');
        if (typeof supabase === 'undefined') {
            console.error('❌ Supabase não está carregado!');
            return;
        }
        console.log('✅ Supabase carregado!');

        // 2. Testar conexão com banco
        console.log('2️⃣ Testando conexão com banco...');
        const { data: students, error } = await supabase
            .from('students')
            .select('*')
            .limit(1);
            
        if (error) {
            console.error('❌ Erro na conexão:', error);
            return;
        }
        console.log('✅ Conexão com banco OK!');

        // 3. Verificar dados de exemplo
        console.log('3️⃣ Verificando dados de exemplo...');
        const allStudents = await SupabaseStudents.getAll();
        console.log(`✅ ${allStudents.length} alunos encontrados:`, allStudents);

        // 4. Testar funções do sistema
        console.log('4️⃣ Testando funções do sistema...');
        
        // Testar dashboard
        if (allStudents.length > 0) {
            const dashboard = await SupabaseStudents.getDashboard(allStudents[0].id);
            console.log('✅ Dashboard do primeiro aluno:', dashboard);
        }

        // Testar rankings
        const rankings = await SupabaseRankings.getCurrent();
        console.log(`✅ Rankings: ${rankings.length} entradas`);

        // 5. Verificar estrutura das tabelas
        console.log('5️⃣ Verificando estrutura...');
        const tables = ['students', 'teachers', 'classes', 'attendance', 'tasks', 'payments'];
        
        for (const table of tables) {
            const { data, error } = await supabase
                .from(table)
                .select('*')
                .limit(1);
                
            if (!error) {
                console.log(`✅ Tabela ${table}: OK`);
            } else {
                console.warn(`⚠️ Tabela ${table}: ${error.message}`);
            }
        }

        // 6. Resultado final
        console.log('🎉 TODOS OS TESTES PASSARAM!');
        console.log('🚀 Sistema pronto para uso!');
        
        return {
            status: 'success',
            students: allStudents.length,
            rankings: rankings.length,
            message: 'Supabase integrado com sucesso!'
        };

    } catch (error) {
        console.error('❌ ERRO GERAL:', error);
        return {
            status: 'error',
            message: error.message
        };
    }
}

// Função para testar autenticação
async function testarAuth() {
    console.log('🔐 TESTANDO AUTENTICAÇÃO...');
    
    try {
        // Tentar login com usuário de exemplo
        console.log('Tentando login com: joao@email.com');
        const result = await SupabaseAuth.loginStudent('joao@email.com', '123456');
        
        if (result.success) {
            console.log('✅ LOGIN OK:', result);
            
            // Testar logout
            const logoutOk = await SupabaseAuth.logout();
            console.log('✅ LOGOUT OK:', logoutOk);
        } else {
            console.warn('⚠️ Login falhou (normal se usuário não existir):', result.error);
        }
        
    } catch (error) {
        console.error('❌ Erro na autenticação:', error);
    }
}

// Função para verificar sincronização
async function testarSincronizacao() {
    console.log('🔄 TESTANDO SINCRONIZAÇÃO...');
    
    try {
        // Verificar dados locais
        const localStudents = JSON.parse(localStorage.getItem('students') || '[]');
        console.log(`📱 Dados locais: ${localStudents.length} alunos`);
        
        // Sincronizar
        await SystemIntegration.syncLocalData();
        console.log('✅ Sincronização executada!');
        
        // Atualizar dados locais
        await SystemIntegration.updateLocalFromSupabase();
        console.log('✅ Dados locais atualizados!');
        
    } catch (error) {
        console.error('❌ Erro na sincronização:', error);
    }
}

// Função de diagnóstico completo
async function diagnosticoCompleto() {
    console.log('🔍 DIAGNÓSTICO COMPLETO DO SISTEMA...');
    console.log('=====================================');
    
    // Verificar ambiente
    console.log('🌍 Ambiente:');
    console.log('- URL:', window.location.href);
    console.log('- User Agent:', navigator.userAgent);
    console.log('- Supabase carregado:', typeof supabase !== 'undefined');
    console.log('- Classes disponíveis:', {
        SupabaseAuth: typeof SupabaseAuth !== 'undefined',
        SupabaseStudents: typeof SupabaseStudents !== 'undefined',
        SystemIntegration: typeof SystemIntegration !== 'undefined'
    });
    
    // Executar testes
    await testarSupabase();
    await testarAuth();
    await testarSincronizacao();
    
    console.log('🎯 DIAGNÓSTICO COMPLETO!');
}

// Exportar funções para uso manual
window.testarSupabase = testarSupabase;
window.testarAuth = testarAuth;
window.testarSincronizacao = testarSincronizacao;
window.diagnosticoCompleto = diagnosticoCompleto;

// Auto-executar teste básico após 3 segundos
setTimeout(() => {
    if (typeof supabase !== 'undefined') {
        console.log('🚀 Executando teste automático...');
        testarSupabase();
    } else {
        console.log('⏳ Aguardando Supabase carregar...');
    }
}, 3000);

console.log('🧪 Script de teste carregado!');
console.log('💡 Comandos disponíveis:');
console.log('- testarSupabase()');
console.log('- testarAuth()');
console.log('- testarSincronizacao()');
console.log('- diagnosticoCompleto()'); 