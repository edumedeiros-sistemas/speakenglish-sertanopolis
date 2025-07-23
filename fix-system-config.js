// CORREÇÃO AUTOMÁTICA DAS CONFIGURAÇÕES DO SISTEMA
// Script que roda automaticamente para corrigir problemas

console.log('⚙️ Carregando correção de configurações...');

class SystemConfigFix {
    
    // EXECUTAR TODAS AS CORREÇÕES AUTOMATICAMENTE
    static autoFix() {
        console.log('🔧 Iniciando correção automática do sistema...');
        
        // Aguardar DOM estar pronto
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                setTimeout(() => this.runAllFixes(), 4000);
            });
        } else {
            setTimeout(() => this.runAllFixes(), 4000);
        }
    }
    
    // EXECUTAR TODAS AS CORREÇÕES
    static async runAllFixes() {
        try {
            console.log('🚀 Executando correções automáticas...');
            
            // 1. Corrigir configurações do sistema
            this.fixSystemConfig();
            
            // 2. Garantir estrutura de dados correta
            this.ensureDataStructure();
            
            // 3. Adicionar funções faltantes
            this.addMissingFunctions();
            
            // 4. Corrigir SystemSync se necessário
            this.fixSystemSync();
            
            // 5. Aplicar correções no monitor
            this.fixSyncMonitor();
            
            console.log('✅ Correções automáticas aplicadas!');
            
        } catch (error) {
            console.error('❌ Erro nas correções automáticas:', error);
        }
    }
    
    // CORRIGIR CONFIGURAÇÕES DO SISTEMA
    static fixSystemConfig() {
        console.log('⚙️ Corrigindo configurações do sistema...');
        
        // Configurações corretas do sistema
        const correctConfig = {
            pointsConfig: {
                presenca: 5,
                tarefa: 10,
                sequencia: 2,
                bonus: 5
            },
            levelsConfig: [
                { name: 'Bronze', points: 0, icon: '🥉', class: 'level-bronze' },
                { name: 'Prata', points: 300, icon: '🥈', class: 'level-prata' },
                { name: 'Ouro', points: 700, icon: '🥇', class: 'level-ouro' },
                { name: 'Platina', points: 1200, icon: '💎', class: 'level-platina' },
                { name: 'Diamante', points: 1800, icon: '💠', class: 'level-diamante' },
                { name: 'Mestre', points: 2500, icon: '👑', class: 'level-mestre' },
                { name: 'Lenda', points: 3500, icon: '🏆', class: 'level-lenda' }
            ],
            systemVersion: '3.0.0',
            syncEnabled: true,
            lastUpdate: new Date().toISOString()
        };
        
        // Salvar configurações corretas
        localStorage.setItem('systemConfig', JSON.stringify(correctConfig));
        
        // Verificar se foi salvo corretamente
        const savedConfig = JSON.parse(localStorage.getItem('systemConfig') || '{}');
        
        if (savedConfig.pointsConfig && savedConfig.levelsConfig) {
            console.log('✅ Configurações do sistema corrigidas');
        } else {
            console.warn('⚠️ Erro ao salvar configurações');
        }
    }
    
    // GARANTIR ESTRUTURA DE DADOS CORRETA
    static ensureDataStructure() {
        console.log('📊 Garantindo estrutura de dados correta...');
        
        // Arrays que devem existir
        const requiredArrays = [
            'students', 'tasks', 'bookTasks', 'achievements',
            'reposicoes', 'contratos', 'mensalidades', 'pagamentos', 'aulasDadas'
        ];
        
        // Objetos que devem existir
        const requiredObjects = ['attendance'];
        
        // Criar arrays se não existirem
        requiredArrays.forEach(key => {
            if (!localStorage.getItem(key)) {
                localStorage.setItem(key, JSON.stringify([]));
                console.log(`✅ Array ${key} criado`);
            } else {
                // Verificar se é array válido
                try {
                    const data = JSON.parse(localStorage.getItem(key));
                    if (!Array.isArray(data)) {
                        localStorage.setItem(key, JSON.stringify([]));
                        console.log(`🔧 ${key} corrigido para array`);
                    }
                } catch (error) {
                    localStorage.setItem(key, JSON.stringify([]));
                    console.log(`🔧 ${key} JSON inválido corrigido`);
                }
            }
        });
        
        // Criar objetos se não existirem
        requiredObjects.forEach(key => {
            if (!localStorage.getItem(key)) {
                localStorage.setItem(key, JSON.stringify({}));
                console.log(`✅ Objeto ${key} criado`);
            } else {
                // Verificar se é objeto válido
                try {
                    const data = JSON.parse(localStorage.getItem(key));
                    if (typeof data !== 'object' || Array.isArray(data)) {
                        localStorage.setItem(key, JSON.stringify({}));
                        console.log(`🔧 ${key} corrigido para objeto`);
                    }
                } catch (error) {
                    localStorage.setItem(key, JSON.stringify({}));
                    console.log(`🔧 ${key} JSON inválido corrigido`);
                }
            }
        });
        
        console.log('✅ Estrutura de dados garantida');
    }
    
    // ADICIONAR FUNÇÕES FALTANTES
    static addMissingFunctions() {
        console.log('🔧 Adicionando funções faltantes...');
        
        // Função forceStudentTabsStyles se não existir
        if (typeof window.forceStudentTabsStyles === 'undefined') {
            window.forceStudentTabsStyles = function() {
                console.log('🎨 Forçando estilos das abas do aluno...');
                
                const style = document.createElement('style');
                style.id = 'forced-student-styles';
                style.innerHTML = `
                    /* ESTILOS FORÇADOS PARA AS ABAS DO ALUNO */
                    .ranking-item { 
                        display: flex !important; 
                        align-items: center !important; 
                        padding: 12px 0 !important; 
                        border-bottom: 1px solid #eee !important; 
                    }
                    .student-tab-content {
                        display: block !important;
                        visibility: visible !important;
                        opacity: 1 !important;
                    }
                    .tab-content.active {
                        display: block !important;
                    }
                    .student-dashboard {
                        padding: 20px !important;
                    }
                `;
                
                // Remover estilo anterior se existir
                const existingStyle = document.getElementById('forced-student-styles');
                if (existingStyle) {
                    existingStyle.remove();
                }
                
                document.head.appendChild(style);
                console.log('✅ Estilos das abas forçados aplicados');
            };
            
            // Executar imediatamente
            window.forceStudentTabsStyles();
            console.log('✅ Função forceStudentTabsStyles criada');
        }
        
        // Função de validação de dados se não existir
        if (typeof window.validateSystemData === 'undefined') {
            window.validateSystemData = function() {
                console.log('🔍 Validando dados do sistema...');
                
                const students = JSON.parse(localStorage.getItem('students') || '[]');
                const config = JSON.parse(localStorage.getItem('systemConfig') || '{}');
                
                console.log(`👥 ${students.length} alunos encontrados`);
                console.log(`⚙️ Configurações: ${config.pointsConfig ? 'OK' : 'FALTANDO'}`);
                
                return {
                    studentsCount: students.length,
                    configValid: !!(config.pointsConfig && config.levelsConfig),
                    dataStructureValid: true
                };
            };
            console.log('✅ Função validateSystemData criada');
        }
        
        // Função de backup se não existir
        if (typeof window.createSystemBackup === 'undefined') {
            window.createSystemBackup = function() {
                console.log('💾 Criando backup do sistema...');
                
                const backupData = {
                    timestamp: new Date().toISOString(),
                    version: '3.0.0',
                    students: JSON.parse(localStorage.getItem('students') || '[]'),
                    tasks: JSON.parse(localStorage.getItem('tasks') || '[]'),
                    bookTasks: JSON.parse(localStorage.getItem('bookTasks') || '[]'),
                    achievements: JSON.parse(localStorage.getItem('achievements') || '[]'),
                    attendance: JSON.parse(localStorage.getItem('attendance') || '{}'),
                    reposicoes: JSON.parse(localStorage.getItem('reposicoes') || '[]'),
                    contratos: JSON.parse(localStorage.getItem('contratos') || '[]'),
                    mensalidades: JSON.parse(localStorage.getItem('mensalidades') || '[]'),
                    pagamentos: JSON.parse(localStorage.getItem('pagamentos') || '[]'),
                    aulasDadas: JSON.parse(localStorage.getItem('aulasDadas') || '[]'),
                    systemConfig: JSON.parse(localStorage.getItem('systemConfig') || '{}')
                };
                
                const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `speakenglish-backup-${new Date().toISOString().split('T')[0]}.json`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
                
                console.log('✅ Backup criado e baixado');
                return backupData;
            };
            console.log('✅ Função createSystemBackup criada');
        }
    }
    
    // CORRIGIR SYSTEMSYNC SE NECESSÁRIO
    static fixSystemSync() {
        console.log('🔄 Verificando SystemSync...');
        
        if (typeof SystemSync !== 'undefined') {
            // Adicionar funções faltantes se não existirem
            if (typeof SystemSync.uploadModifiedData !== 'function') {
                SystemSync.uploadModifiedData = async function(since) {
                    console.log('📤 Upload modificado desde:', since);
                    return await this.uploadLocalDataSafe ? this.uploadLocalDataSafe() : this.uploadLocalData();
                };
                console.log('✅ uploadModifiedData adicionada ao SystemSync');
            }
            
            if (typeof SystemSync.downloadModifiedData !== 'function') {
                SystemSync.downloadModifiedData = async function(since) {
                    console.log('📥 Download modificado desde:', since);
                    return await this.downloadRemoteDataSafe ? this.downloadRemoteDataSafe() : this.downloadRemoteData();
                };
                console.log('✅ downloadModifiedData adicionada ao SystemSync');
            }
            
            // Melhorar tratamento de erros
            if (SystemSync.downloadTableData) {
                const originalDownload = SystemSync.downloadTableData;
                SystemSync.downloadTableData = async function(table, localKey) {
                    try {
                        return await originalDownload.call(this, table, localKey);
                    } catch (error) {
                        if (error.code === '42P01' || error.message?.includes('does not exist')) {
                            console.warn(`⚠️ Tabela ${table} não existe - criando dados vazios`);
                            if (localKey === 'systemConfig') {
                                localStorage.setItem(localKey, JSON.stringify({}));
                            } else {
                                localStorage.setItem(localKey, JSON.stringify([]));
                            }
                            return;
                        }
                        console.warn(`⚠️ Erro em ${table}:`, error.message);
                        // Criar dados vazios em caso de erro
                        if (localKey === 'systemConfig') {
                            localStorage.setItem(localKey, JSON.stringify({}));
                        } else {
                            localStorage.setItem(localKey, JSON.stringify([]));
                        }
                    }
                };
                console.log('✅ SystemSync.downloadTableData melhorado');
            }
        }
    }
    
    // CORRIGIR SYNCMONITOR SE NECESSÁRIO
    static fixSyncMonitor() {
        console.log('📊 Verificando SyncMonitor...');
        
        if (typeof SyncMonitor !== 'undefined') {
            // Garantir que o monitor seja inicializado
            if (!document.getElementById('syncMonitor')) {
                console.log('🔧 Monitor não encontrado - inicializando...');
                setTimeout(() => {
                    if (typeof SyncMonitor.initialize === 'function') {
                        SyncMonitor.initialize();
                    }
                }, 1000);
            }
            
            // Adicionar função de diagnóstico se não existir
            if (typeof SyncMonitor.runDiagnostics === 'undefined') {
                SyncMonitor.runDiagnostics = function() {
                    console.log('🔍 Executando diagnóstico do monitor...');
                    
                    const diagnostics = {
                        monitorExists: !!document.getElementById('syncMonitor'),
                        supabaseConnected: typeof supabase !== 'undefined',
                        systemSyncReady: typeof SystemSync !== 'undefined',
                        lastSyncTime: localStorage.getItem('lastSyncTime'),
                        onlineStatus: navigator.onLine
                    };
                    
                    console.log('📊 Diagnóstico do monitor:', diagnostics);
                    return diagnostics;
                };
                console.log('✅ SyncMonitor.runDiagnostics criado');
            }
        }
    }
    
    // FUNÇÃO DE DIAGNÓSTICO COMPLETO
    static runCompleteDiagnostic() {
        console.log('\n🔍 === DIAGNÓSTICO COMPLETO DO SISTEMA ===');
        
        const diagnostics = {
            timestamp: new Date().toISOString(),
            environment: {
                online: navigator.onLine,
                supabase: typeof supabase !== 'undefined',
                systemSync: typeof SystemSync !== 'undefined',
                syncMonitor: typeof SyncMonitor !== 'undefined'
            },
            data: {
                students: JSON.parse(localStorage.getItem('students') || '[]').length,
                tasks: JSON.parse(localStorage.getItem('tasks') || '[]').length,
                config: Object.keys(JSON.parse(localStorage.getItem('systemConfig') || '{}')).length
            },
            functions: {
                forceStudentTabsStyles: typeof window.forceStudentTabsStyles === 'function',
                validateSystemData: typeof window.validateSystemData === 'function',
                createSystemBackup: typeof window.createSystemBackup === 'function'
            },
            ui: {
                loginScreen: !!document.getElementById('loginScreen'),
                mainInterface: !!document.getElementById('mainInterface'),
                syncMonitor: !!document.getElementById('syncMonitor')
            }
        };
        
        console.log('📊 Diagnóstico completo:', diagnostics);
        
        // Calcular score de saúde
        const checks = [
            diagnostics.environment.supabase,
            diagnostics.environment.systemSync,
            diagnostics.data.students > 0,
            diagnostics.data.config > 0,
            diagnostics.functions.forceStudentTabsStyles,
            diagnostics.ui.loginScreen,
            diagnostics.ui.mainInterface
        ];
        
        const healthScore = (checks.filter(Boolean).length / checks.length * 100).toFixed(1);
        
        console.log(`💯 Score de saúde do sistema: ${healthScore}%`);
        
        if (healthScore >= 90) {
            console.log('🎉 Sistema em excelente estado!');
        } else if (healthScore >= 70) {
            console.log('✅ Sistema funcionando bem');
        } else {
            console.log('⚠️ Sistema precisa de atenção');
        }
        
        return diagnostics;
    }
    
    // TESTE DE SINCRONIZAÇÃO
    static async testSync() {
        console.log('🧪 Testando sincronização...');
        
        if (typeof SystemSync !== 'undefined' && typeof supabase !== 'undefined') {
            try {
                // Testar conexão básica
                const { data, error } = await supabase.from('students').select('id').limit(1);
                
                if (!error) {
                    console.log('✅ Conexão Supabase OK');
                    
                    // Testar sincronização
                    if (typeof SystemSync.forceSyncNow === 'function') {
                        console.log('🔄 Testando sincronização...');
                        await SystemSync.forceSyncNow();
                        console.log('✅ Sincronização testada');
                    }
                } else {
                    console.warn('⚠️ Erro de conexão:', error.message);
                }
                
            } catch (error) {
                console.warn('⚠️ Erro no teste:', error.message);
            }
        } else {
            console.warn('⚠️ SystemSync ou Supabase não disponível');
        }
    }
}

// DISPONIBILIZAR GLOBALMENTE
window.SystemConfigFix = SystemConfigFix;

// EXECUTAR CORREÇÃO AUTOMÁTICA
SystemConfigFix.autoFix();

// COMANDOS DISPONÍVEIS NO CONSOLE
console.log('\n💡 COMANDOS DISPONÍVEIS:');
console.log('- SystemConfigFix.runAllFixes() - Executar todas as correções');
console.log('- SystemConfigFix.runCompleteDiagnostic() - Diagnóstico completo');
console.log('- SystemConfigFix.testSync() - Testar sincronização');
console.log('- validateSystemData() - Validar dados do sistema');
console.log('- createSystemBackup() - Criar backup completo');
console.log('- forceStudentTabsStyles() - Forçar estilos do aluno');

console.log('⚙️ Sistema de correção de configurações carregado!'); 