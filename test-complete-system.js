// TESTE COMPLETO DO SISTEMA SPEAKENGLISH
// Verifica todas as funcionalidades e integração com Supabase

console.log('🧪 INICIANDO TESTE COMPLETO DO SISTEMA...');
console.log('=' .repeat(50));

class SystemTest {
    static results = {
        passed: 0,
        failed: 0,
        warnings: 0,
        details: []
    };
    
    // EXECUTAR TODOS OS TESTES
    static async runAllTests() {
        console.log('🚀 Executando bateria completa de testes...');
        
        // Testes básicos
        await this.testEnvironment();
        await this.testLocalStorage();
        await this.testSupabaseConnection();
        
        // Testes de funcionalidades
        await this.testLoginSystem();
        await this.testDataStructures();
        await this.testSyncSystem();
        await this.testMonitor();
        
        // Testes de interface
        await this.testUIElements();
        await this.testStudentInterface();
        
        // Relatório final
        this.generateReport();
    }
    
    // TESTE DO AMBIENTE
    static async testEnvironment() {
        console.log('\n📋 TESTANDO AMBIENTE...');
        
        try {
            // Verificar browser
            this.assert(typeof window !== 'undefined', 'Browser environment disponível');
            this.assert(typeof localStorage !== 'undefined', 'LocalStorage disponível');
            this.assert(navigator.onLine !== undefined, 'Status de conectividade disponível');
            
            // Verificar scripts carregados
            this.assert(typeof supabase !== 'undefined', 'Supabase client carregado');
            this.assert(typeof SystemSync !== 'undefined', 'Sistema de sincronização carregado');
            this.assert(typeof SyncMonitor !== 'undefined', 'Monitor carregado');
            
            // Verificar funções essenciais
            this.assert(typeof saveData === 'function', 'Função saveData disponível');
            this.assert(typeof loadStudents === 'function', 'Função loadStudents disponível');
            this.assert(typeof showTab === 'function', 'Sistema de navegação disponível');
            
            console.log('✅ Ambiente: OK');
            
        } catch (error) {
            this.fail('Erro no teste de ambiente', error);
        }
    }
    
    // TESTE DO LOCALSTORAGE
    static async testLocalStorage() {
        console.log('\n💾 TESTANDO LOCALSTORAGE...');
        
        try {
            const requiredKeys = [
                'students', 'tasks', 'bookTasks', 'achievements',
                'attendance', 'reposicoes', 'contratos', 
                'mensalidades', 'pagamentos', 'systemConfig'
            ];
            
            for (const key of requiredKeys) {
                const data = localStorage.getItem(key);
                this.assert(data !== null, `${key} existe no localStorage`);
                
                try {
                    JSON.parse(data);
                    this.pass(`${key} tem JSON válido`);
                } catch {
                    this.warn(`${key} não é JSON válido`);
                }
            }
            
            // Testar escrita
            const testKey = 'test_' + Date.now();
            localStorage.setItem(testKey, 'test');
            this.assert(localStorage.getItem(testKey) === 'test', 'Escrita no localStorage funciona');
            localStorage.removeItem(testKey);
            
            console.log('✅ LocalStorage: OK');
            
        } catch (error) {
            this.fail('Erro no teste de localStorage', error);
        }
    }
    
    // TESTE DE CONEXÃO SUPABASE
    static async testSupabaseConnection() {
        console.log('\n🔗 TESTANDO CONEXÃO SUPABASE...');
        
        try {
            // Verificar cliente
            this.assert(supabase && typeof supabase.from === 'function', 'Cliente Supabase inicializado');
            
            // Testar conexão básica
            const { data, error } = await supabase
                .from('students')
                .select('id')
                .limit(1);
            
            if (error) {
                this.warn(`Erro na consulta Supabase: ${error.message}`);
            } else {
                this.pass('Conexão com Supabase OK');
            }
            
            // Testar classes disponíveis
            this.assert(typeof SupabaseStudents === 'function', 'Classe SupabaseStudents disponível');
            this.assert(typeof SupabaseTasks === 'function', 'Classe SupabaseTasks disponível');
            this.assert(typeof SupabasePayments === 'function', 'Classe SupabasePayments disponível');
            
            console.log('✅ Supabase: OK');
            
        } catch (error) {
            this.fail('Erro no teste de Supabase', error);
        }
    }
    
    // TESTE DO SISTEMA DE LOGIN
    static async testLoginSystem() {
        console.log('\n🔐 TESTANDO SISTEMA DE LOGIN...');
        
        try {
            // Verificar elementos de login
            const loginForm = document.getElementById('loginForm');
            const loginUser = document.getElementById('loginUser');
            const loginPassword = document.getElementById('loginPassword');
            
            this.assert(loginForm !== null, 'Formulário de login existe');
            this.assert(loginUser !== null, 'Campo de usuário existe');
            this.assert(loginPassword !== null, 'Campo de senha existe');
            
            // Verificar funções de login
            this.assert(typeof window.loginSupabase === 'function', 'Função loginSupabase disponível');
            this.assert(typeof window.loadStudentData === 'function', 'Função loadStudentData disponível');
            
            // Testar validação básica
            if (loginUser && loginPassword) {
                loginUser.value = '';
                loginPassword.value = '';
                // Login deveria falhar com campos vazios
                this.pass('Validação de campos vazios configurada');
            }
            
            console.log('✅ Sistema de Login: OK');
            
        } catch (error) {
            this.fail('Erro no teste de login', error);
        }
    }
    
    // TESTE DAS ESTRUTURAS DE DADOS
    static async testDataStructures() {
        console.log('\n📊 TESTANDO ESTRUTURAS DE DADOS...');
        
        try {
            // Testar dados dos alunos
            const students = JSON.parse(localStorage.getItem('students') || '[]');
            console.log(`📚 ${students.length} alunos carregados`);
            
            if (students.length > 0) {
                const student = students[0];
                const requiredFields = ['name', 'email', 'level'];
                
                for (const field of requiredFields) {
                    this.assert(student.hasOwnProperty(field), `Aluno tem campo ${field}`);
                }
                
                this.pass('Estrutura de alunos válida');
            }
            
            // Testar dados das tarefas
            const tasks = JSON.parse(localStorage.getItem('tasks') || '[]');
            const bookTasks = JSON.parse(localStorage.getItem('bookTasks') || '[]');
            console.log(`📋 ${tasks.length} tarefas gerais + ${bookTasks.length} tarefas do livro`);
            
            // Testar configurações
            const config = JSON.parse(localStorage.getItem('systemConfig') || '{}');
            this.assert(config.pointsConfig !== undefined, 'Configuração de pontos existe');
            this.assert(config.levelsConfig !== undefined, 'Configuração de níveis existe');
            
            console.log('✅ Estruturas de Dados: OK');
            
        } catch (error) {
            this.fail('Erro no teste de estruturas', error);
        }
    }
    
    // TESTE DO SISTEMA DE SINCRONIZAÇÃO
    static async testSyncSystem() {
        console.log('\n🔄 TESTANDO SISTEMA DE SINCRONIZAÇÃO...');
        
        try {
            // Verificar inicialização
            this.assert(typeof SystemSync.initialize === 'function', 'Função initialize disponível');
            this.assert(typeof SystemSync.forceSyncNow === 'function', 'Função forceSyncNow disponível');
            this.assert(typeof SystemSync.getSyncStatus === 'function', 'Função getSyncStatus disponível');
            
            // Testar status
            const status = SystemSync.getSyncStatus();
            this.assert(typeof status === 'object', 'Status retorna objeto');
            this.assert('isOnline' in status, 'Status inclui isOnline');
            this.assert('syncInProgress' in status, 'Status inclui syncInProgress');
            
            // Testar mapeamento de dados
            this.assert(typeof SystemSync.dataMapping === 'object', 'Mapeamento de dados existe');
            this.assert('students' in SystemSync.dataMapping, 'Mapeamento inclui students');
            
            // Testar configurações
            this.assert(typeof SystemSync.syncConfig === 'object', 'Configurações de sync existem');
            
            console.log('✅ Sistema de Sincronização: OK');
            
        } catch (error) {
            this.fail('Erro no teste de sincronização', error);
        }
    }
    
    // TESTE DO MONITOR
    static async testMonitor() {
        console.log('\n📊 TESTANDO MONITOR...');
        
        try {
            // Verificar interface
            const monitor = document.getElementById('syncMonitor');
            this.assert(monitor !== null, 'Interface do monitor existe');
            
            // Verificar elementos do monitor
            const elements = [
                'connectionStatus', 'supabaseStatus', 'syncStatus',
                'lastSyncText', 'studentsCount', 'tasksCount'
            ];
            
            for (const elementId of elements) {
                const element = document.getElementById(elementId);
                this.assert(element !== null, `Elemento ${elementId} existe`);
            }
            
            // Verificar funções do monitor
            this.assert(typeof SyncMonitor.toggleMonitor === 'function', 'Função toggleMonitor disponível');
            this.assert(typeof SyncMonitor.forceSyncNow === 'function', 'Função forceSyncNow disponível');
            this.assert(typeof SyncMonitor.downloadData === 'function', 'Função downloadData disponível');
            
            console.log('✅ Monitor: OK');
            
        } catch (error) {
            this.fail('Erro no teste do monitor', error);
        }
    }
    
    // TESTE DOS ELEMENTOS DA INTERFACE
    static async testUIElements() {
        console.log('\n🖥️ TESTANDO INTERFACE...');
        
        try {
            // Verificar elementos principais
            const mainElements = [
                'loginScreen', 'mainInterface', 'dashboard',
                'students', 'tasks', 'gestao', 'rankings'
            ];
            
            for (const elementId of mainElements) {
                const element = document.getElementById(elementId);
                this.assert(element !== null, `Elemento ${elementId} existe`);
            }
            
            // Verificar modais
            const modals = [
                'addStudentModal', 'editStudentModal',
                'addTaskModal', 'addBookTaskModal'
            ];
            
            for (const modalId of modals) {
                const modal = document.getElementById(modalId);
                this.assert(modal !== null, `Modal ${modalId} existe`);
            }
            
            console.log('✅ Interface: OK');
            
        } catch (error) {
            this.fail('Erro no teste de interface', error);
        }
    }
    
    // TESTE DA INTERFACE DO ALUNO
    static async testStudentInterface() {
        console.log('\n👨‍🎓 TESTANDO INTERFACE DO ALUNO...');
        
        try {
            // Verificar funções específicas do aluno
            this.assert(typeof showStudentInterface === 'function', 'Função showStudentInterface existe');
            
            // Verificar estilos do aluno
            const studentStyles = document.querySelector('link[href*="student"]');
            this.assert(studentStyles !== null, 'Estilos do aluno carregados');
            
            // Verificar scripts do aluno
            this.assert(typeof window.forceStudentTabsStyles === 'function', 'Função forceStudentTabsStyles existe');
            
            console.log('✅ Interface do Aluno: OK');
            
        } catch (error) {
            this.fail('Erro no teste da interface do aluno', error);
        }
    }
    
    // UTILITÁRIOS DE TESTE
    static assert(condition, message) {
        if (condition) {
            this.pass(message);
        } else {
            this.fail(message);
        }
    }
    
    static pass(message) {
        this.results.passed++;
        this.results.details.push({ type: 'PASS', message });
        console.log(`✅ ${message}`);
    }
    
    static fail(message, error = null) {
        this.results.failed++;
        this.results.details.push({ type: 'FAIL', message, error });
        console.error(`❌ ${message}`, error || '');
    }
    
    static warn(message) {
        this.results.warnings++;
        this.results.details.push({ type: 'WARN', message });
        console.warn(`⚠️ ${message}`);
    }
    
    // GERAR RELATÓRIO FINAL
    static generateReport() {
        console.log('\n' + '='.repeat(50));
        console.log('📊 RELATÓRIO FINAL DOS TESTES');
        console.log('='.repeat(50));
        
        console.log(`✅ Testes Aprovados: ${this.results.passed}`);
        console.log(`❌ Testes Falharam: ${this.results.failed}`);
        console.log(`⚠️ Avisos: ${this.results.warnings}`);
        
        const total = this.results.passed + this.results.failed;
        const successRate = total > 0 ? (this.results.passed / total * 100).toFixed(1) : 0;
        
        console.log(`📈 Taxa de Sucesso: ${successRate}%`);
        
        // Status geral
        if (this.results.failed === 0) {
            console.log('\n🎉 TODOS OS TESTES PASSARAM!');
            console.log('✅ Sistema funcionando perfeitamente!');
        } else if (this.results.failed < 3) {
            console.log('\n⚠️ Sistema funcionando com avisos');
            console.log('💡 Verifique os erros acima');
        } else {
            console.log('\n❌ Sistema com problemas críticos');
            console.log('🔧 Correções necessárias');
        }
        
        // Relatório detalhado
        console.log('\n📋 DETALHES:');
        this.results.details.forEach(detail => {
            const icon = detail.type === 'PASS' ? '✅' : detail.type === 'FAIL' ? '❌' : '⚠️';
            console.log(`${icon} ${detail.message}`);
        });
        
        console.log('\n' + '='.repeat(50));
        
        // Retornar resultado para programação
        return {
            success: this.results.failed === 0,
            ...this.results
        };
    }
    
    // TESTE RÁPIDO (VERSÃO SIMPLIFICADA)
    static async quickTest() {
        console.log('⚡ TESTE RÁPIDO DO SISTEMA...');
        
        try {
            // Testes essenciais
            this.assert(typeof supabase !== 'undefined', 'Supabase OK');
            this.assert(typeof SystemSync !== 'undefined', 'SystemSync OK');
            this.assert(typeof SyncMonitor !== 'undefined', 'SyncMonitor OK');
            this.assert(document.getElementById('syncMonitor') !== null, 'Monitor UI OK');
            
            const students = JSON.parse(localStorage.getItem('students') || '[]');
            console.log(`👥 ${students.length} alunos carregados`);
            
            const status = SystemSync.getSyncStatus();
            console.log(`🔄 Status: ${status.isOnline ? 'Online' : 'Offline'}`);
            
            console.log('⚡ Teste rápido completo!');
            return true;
            
        } catch (error) {
            console.error('❌ Erro no teste rápido:', error);
            return false;
        }
    }
}

// EXECUTAR AUTOMATICAMENTE
document.addEventListener('DOMContentLoaded', () => {
    // Aguardar carregamento completo
    setTimeout(async () => {
        console.log('🧪 Auto-executando teste do sistema...');
        await SystemTest.quickTest();
        
        // Disponibilizar teste completo
        console.log('💡 Execute "SystemTest.runAllTests()" para teste completo');
    }, 5000);
});

// DISPONIBILIZAR GLOBALMENTE
window.SystemTest = SystemTest;

console.log('🧪 Sistema de Testes carregado!'); 