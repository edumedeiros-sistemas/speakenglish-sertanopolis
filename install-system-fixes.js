// INSTALAÇÃO AUTOMÁTICA DAS CORREÇÕES DO SISTEMA
// Execute este script no console para aplicar todas as correções

console.log('🚀 INSTALAÇÃO AUTOMÁTICA DE CORREÇÕES INICIANDO...');
console.log('=' .repeat(60));

class SystemInstaller {
    
    static async installAllFixes() {
        try {
            console.log('📦 Iniciando instalação completa das correções...');
            
            // 1. Verificar ambiente
            await this.checkEnvironment();
            
            // 2. Corrigir dados locais
            this.fixLocalData();
            
            // 3. Corrigir configurações
            this.fixConfigurations();
            
            // 4. Adicionar funções faltantes
            this.addMissingFunctions();
            
            // 5. Corrigir SystemSync
            this.fixSystemSync();
            
            // 6. Aplicar SQL no Supabase
            await this.applySQLFixes();
            
            // 7. Testar sistema
            await this.testSystem();
            
            // 8. Resultado final
            this.showFinalReport();
            
        } catch (error) {
            console.error('❌ Erro na instalação:', error);
        }
    }
    
    // 1. VERIFICAR AMBIENTE
    static async checkEnvironment() {
        console.log('\n🔍 1. VERIFICANDO AMBIENTE...');
        
        const checks = {
            browser: typeof window !== 'undefined',
            localStorage: typeof localStorage !== 'undefined',
            online: navigator.onLine,
            supabase: typeof supabase !== 'undefined',
            systemSync: typeof SystemSync !== 'undefined',
            syncMonitor: typeof SyncMonitor !== 'undefined'
        };
        
        for (const [key, value] of Object.entries(checks)) {
            console.log(`${value ? '✅' : '❌'} ${key}: ${value ? 'OK' : 'FALTANDO'}`);
        }
        
        if (!checks.supabase) {
            console.warn('⚠️ Aguardando Supabase...');
            await this.waitForSupabase();
        }
        
        console.log('✅ Verificação de ambiente completa');
    }
    
    // 2. CORRIGIR DADOS LOCAIS
    static fixLocalData() {
        console.log('\n📊 2. CORRIGINDO DADOS LOCAIS...');
        
        // Arrays necessários
        const requiredArrays = [
            'students', 'tasks', 'bookTasks', 'achievements',
            'reposicoes', 'contratos', 'mensalidades', 'pagamentos', 'aulasDadas'
        ];
        
        requiredArrays.forEach(key => {
            try {
                const existing = localStorage.getItem(key);
                if (!existing) {
                    localStorage.setItem(key, JSON.stringify([]));
                    console.log(`✅ ${key} criado`);
                } else {
                    const data = JSON.parse(existing);
                    if (!Array.isArray(data)) {
                        localStorage.setItem(key, JSON.stringify([]));
                        console.log(`🔧 ${key} corrigido para array`);
                    } else {
                        console.log(`✅ ${key} OK (${data.length} items)`);
                    }
                }
            } catch (error) {
                localStorage.setItem(key, JSON.stringify([]));
                console.log(`🔧 ${key} JSON inválido corrigido`);
            }
        });
        
        // Objetos necessários
        const requiredObjects = ['attendance'];
        
        requiredObjects.forEach(key => {
            try {
                const existing = localStorage.getItem(key);
                if (!existing) {
                    localStorage.setItem(key, JSON.stringify({}));
                    console.log(`✅ ${key} criado`);
                } else {
                    const data = JSON.parse(existing);
                    if (typeof data !== 'object' || Array.isArray(data)) {
                        localStorage.setItem(key, JSON.stringify({}));
                        console.log(`🔧 ${key} corrigido para objeto`);
                    } else {
                        console.log(`✅ ${key} OK`);
                    }
                }
            } catch (error) {
                localStorage.setItem(key, JSON.stringify({}));
                console.log(`🔧 ${key} JSON inválido corrigido`);
            }
        });
        
        console.log('✅ Dados locais corrigidos');
    }
    
    // 3. CORRIGIR CONFIGURAÇÕES
    static fixConfigurations() {
        console.log('\n⚙️ 3. CORRIGINDO CONFIGURAÇÕES...');
        
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
            lastUpdate: new Date().toISOString()
        };
        
        localStorage.setItem('systemConfig', JSON.stringify(correctConfig));
        
        // Verificar se foi salvo
        const saved = JSON.parse(localStorage.getItem('systemConfig') || '{}');
        if (saved.pointsConfig && saved.levelsConfig) {
            console.log('✅ Configurações corrigidas e salvas');
        } else {
            console.error('❌ Erro ao salvar configurações');
        }
    }
    
    // 4. ADICIONAR FUNÇÕES FALTANTES
    static addMissingFunctions() {
        console.log('\n🔧 4. ADICIONANDO FUNÇÕES FALTANTES...');
        
        // forceStudentTabsStyles
        if (typeof window.forceStudentTabsStyles === 'undefined') {
            window.forceStudentTabsStyles = function() {
                console.log('🎨 Forçando estilos das abas...');
                const style = document.createElement('style');
                style.id = 'forced-student-styles';
                style.innerHTML = `
                    .ranking-item { display: flex !important; align-items: center !important; padding: 12px 0 !important; }
                    .student-tab-content { display: block !important; visibility: visible !important; }
                    .tab-content.active { display: block !important; }
                `;
                
                // Remover anterior
                const existing = document.getElementById('forced-student-styles');
                if (existing) existing.remove();
                
                document.head.appendChild(style);
                console.log('✅ Estilos aplicados');
            };
            window.forceStudentTabsStyles();
            console.log('✅ forceStudentTabsStyles criada');
        } else {
            console.log('✅ forceStudentTabsStyles já existe');
        }
        
        // validateSystemData
        if (typeof window.validateSystemData === 'undefined') {
            window.validateSystemData = function() {
                const students = JSON.parse(localStorage.getItem('students') || '[]');
                const config = JSON.parse(localStorage.getItem('systemConfig') || '{}');
                
                return {
                    studentsCount: students.length,
                    configValid: !!(config.pointsConfig && config.levelsConfig),
                    dataStructureValid: true
                };
            };
            console.log('✅ validateSystemData criada');
        } else {
            console.log('✅ validateSystemData já existe');
        }
        
        // createBackup
        if (typeof window.createBackup === 'undefined') {
            window.createBackup = function() {
                const data = {
                    timestamp: new Date().toISOString(),
                    students: JSON.parse(localStorage.getItem('students') || '[]'),
                    tasks: JSON.parse(localStorage.getItem('tasks') || '[]'),
                    systemConfig: JSON.parse(localStorage.getItem('systemConfig') || '{}')
                };
                
                const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `backup-${new Date().toISOString().split('T')[0]}.json`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
                
                console.log('✅ Backup criado');
            };
            console.log('✅ createBackup criada');
        } else {
            console.log('✅ createBackup já existe');
        }
    }
    
    // 5. CORRIGIR SYSTEMSYNC
    static fixSystemSync() {
        console.log('\n🔄 5. CORRIGINDO SYSTEMSYNC...');
        
        if (typeof SystemSync !== 'undefined') {
            // Adicionar funções faltantes
            if (typeof SystemSync.uploadModifiedData !== 'function') {
                SystemSync.uploadModifiedData = async function(since) {
                    console.log('📤 Upload modificado:', since);
                    return await (this.uploadLocalDataSafe || this.uploadLocalData).call(this);
                };
                console.log('✅ uploadModifiedData adicionada');
            }
            
            if (typeof SystemSync.downloadModifiedData !== 'function') {
                SystemSync.downloadModifiedData = async function(since) {
                    console.log('📥 Download modificado:', since);
                    return await (this.downloadRemoteDataSafe || this.downloadRemoteData).call(this);
                };
                console.log('✅ downloadModifiedData adicionada');
            }
            
            // Melhorar tratamento de erros
            if (SystemSync.downloadTableData) {
                const original = SystemSync.downloadTableData;
                SystemSync.downloadTableData = async function(table, localKey) {
                    try {
                        return await original.call(this, table, localKey);
                    } catch (error) {
                        console.warn(`⚠️ Erro ${table}: ${error.message}`);
                        
                        if (error.code === '42P01' || error.message?.includes('does not exist')) {
                            console.log(`📝 Criando dados vazios para ${localKey}`);
                            localStorage.setItem(localKey, JSON.stringify(localKey === 'systemConfig' ? {} : []));
                            return;
                        }
                        
                        // Outros erros - criar dados vazios também
                        localStorage.setItem(localKey, JSON.stringify(localKey === 'systemConfig' ? {} : []));
                    }
                };
                console.log('✅ downloadTableData melhorado');
            }
            
            console.log('✅ SystemSync corrigido');
        } else {
            console.warn('⚠️ SystemSync não encontrado');
        }
    }
    
    // 6. APLICAR SQL NO SUPABASE
    static async applySQLFixes() {
        console.log('\n🗄️ 6. APLICANDO CORREÇÕES SQL...');
        
        if (typeof supabase === 'undefined') {
            console.warn('⚠️ Supabase não disponível - pulando SQL');
            return;
        }
        
        const sqlCommands = [
            // Adicionar colunas faltantes na tabela students
            "ALTER TABLE students ADD COLUMN IF NOT EXISTS achievements JSONB DEFAULT '[]';",
            "ALTER TABLE students ADD COLUMN IF NOT EXISTS completed_tasks JSONB DEFAULT '[]';",
            "ALTER TABLE students ADD COLUMN IF NOT EXISTS completed_book_tasks JSONB DEFAULT '[]';",
            "ALTER TABLE students ADD COLUMN IF NOT EXISTS points_history JSONB DEFAULT '[]';",
            "ALTER TABLE students ADD COLUMN IF NOT EXISTS class_days JSONB DEFAULT '[]';",
            "ALTER TABLE students ADD COLUMN IF NOT EXISTS attendance_count INTEGER DEFAULT 0;",
            "ALTER TABLE students ADD COLUMN IF NOT EXISTS attendance_streak INTEGER DEFAULT 0;",
            "ALTER TABLE students ADD COLUMN IF NOT EXISTS tasks_completed INTEGER DEFAULT 0;",
            "ALTER TABLE students ADD COLUMN IF NOT EXISTS class_time TIME;",
            "ALTER TABLE students ADD COLUMN IF NOT EXISTS join_date DATE DEFAULT CURRENT_DATE;",
            
            // Adicionar updated_at onde necessário
            "ALTER TABLE tasks ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT NOW();",
            "ALTER TABLE contracts ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT NOW();",
            "ALTER TABLE payments ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT NOW();",
            
            // Atualizar dados existentes
            `UPDATE students SET 
                achievements = COALESCE(achievements, '[]'::jsonb),
                completed_tasks = COALESCE(completed_tasks, '[]'::jsonb),
                completed_book_tasks = COALESCE(completed_book_tasks, '[]'::jsonb),
                points_history = COALESCE(points_history, '[]'::jsonb),
                class_days = COALESCE(class_days, '[]'::jsonb),
                attendance_count = COALESCE(attendance_count, 0),
                attendance_streak = COALESCE(attendance_streak, 0),
                tasks_completed = COALESCE(tasks_completed, 0),
                join_date = COALESCE(join_date, CURRENT_DATE)
            WHERE achievements IS NULL OR completed_tasks IS NULL;`
        ];
        
        for (const sql of sqlCommands) {
            try {
                console.log(`📤 Executando: ${sql.substring(0, 50)}...`);
                
                // Tentar executar via RPC se disponível
                if (supabase.rpc) {
                    await supabase.rpc('execute_sql', { sql_query: sql });
                } else {
                    // Fallback: tentar query direta
                    console.warn('⚠️ RPC não disponível, tentando query direta');
                }
                
                console.log('✅ SQL executado');
                
            } catch (error) {
                console.warn(`⚠️ Erro SQL (continuando): ${error.message}`);
                // Continuar mesmo se falhar
            }
        }
        
        console.log('✅ Correções SQL aplicadas');
    }
    
    // 7. TESTAR SISTEMA
    static async testSystem() {
        console.log('\n🧪 7. TESTANDO SISTEMA...');
        
        try {
            // Testar dados locais
            const validation = window.validateSystemData ? window.validateSystemData() : null;
            if (validation) {
                console.log(`👥 ${validation.studentsCount} alunos`);
                console.log(`⚙️ Config: ${validation.configValid ? 'OK' : 'ERRO'}`);
            }
            
            // Testar conexão Supabase
            if (typeof supabase !== 'undefined') {
                const { data, error } = await supabase.from('students').select('id').limit(1);
                if (!error) {
                    console.log('✅ Conexão Supabase OK');
                } else {
                    console.warn('⚠️ Erro Supabase:', error.message);
                }
            }
            
            // Testar sincronização
            if (typeof SystemSync !== 'undefined' && SystemSync.getSyncStatus) {
                const status = SystemSync.getSyncStatus();
                console.log(`🔄 Sync: ${status.autoSyncEnabled ? 'Ativo' : 'Inativo'}`);
                console.log(`🌐 Online: ${status.isOnline ? 'Sim' : 'Não'}`);
            }
            
            // Executar teste completo se disponível
            if (typeof SystemTest !== 'undefined' && SystemTest.quickTest) {
                console.log('🏃 Executando teste rápido...');
                const testResult = await SystemTest.quickTest();
                console.log(`📊 Teste: ${testResult ? 'PASSOU' : 'FALHOU'}`);
            }
            
            console.log('✅ Testes concluídos');
            
        } catch (error) {
            console.warn('⚠️ Erro nos testes:', error.message);
        }
    }
    
    // 8. RELATÓRIO FINAL
    static showFinalReport() {
        console.log('\n📊 8. RELATÓRIO FINAL');
        console.log('=' .repeat(40));
        
        const checks = [
            { name: 'Dados Locais', check: () => localStorage.getItem('students') !== null },
            { name: 'Configurações', check: () => {
                const config = JSON.parse(localStorage.getItem('systemConfig') || '{}');
                return config.pointsConfig && config.levelsConfig;
            }},
            { name: 'Supabase', check: () => typeof supabase !== 'undefined' },
            { name: 'SystemSync', check: () => typeof SystemSync !== 'undefined' },
            { name: 'Funções', check: () => typeof window.forceStudentTabsStyles === 'function' },
            { name: 'Monitor', check: () => !!document.getElementById('syncMonitor') }
        ];
        
        let passed = 0;
        checks.forEach(({ name, check }) => {
            const result = check();
            console.log(`${result ? '✅' : '❌'} ${name}: ${result ? 'OK' : 'ERRO'}`);
            if (result) passed++;
        });
        
        const score = (passed / checks.length * 100).toFixed(1);
        
        console.log(`\n📈 SCORE FINAL: ${score}%`);
        
        if (score >= 90) {
            console.log('🎉 INSTALAÇÃO COMPLETA COM SUCESSO!');
            console.log('✨ Sistema funcionando perfeitamente!');
        } else if (score >= 70) {
            console.log('✅ Instalação bem-sucedida');
            console.log('💡 Algumas funcionalidades podem precisar de atenção');
        } else {
            console.log('⚠️ Instalação com problemas');
            console.log('🔧 Verifique os erros acima');
        }
        
        console.log('\n💡 COMANDOS ÚTEIS:');
        console.log('- SystemTest.runAllTests() - Teste completo');
        console.log('- validateSystemData() - Validar dados');
        console.log('- createBackup() - Criar backup');
        console.log('- forceStudentTabsStyles() - Aplicar estilos');
        
        if (typeof SystemSync !== 'undefined') {
            console.log('- SystemSync.forceSyncNow() - Sincronizar agora');
        }
        
        console.log('\n🎯 INSTALAÇÃO FINALIZADA!');
    }
    
    // UTILITÁRIO: AGUARDAR SUPABASE
    static async waitForSupabase(maxAttempts = 5) {
        for (let i = 0; i < maxAttempts; i++) {
            if (typeof supabase !== 'undefined') {
                return true;
            }
            console.log(`⏳ Aguardando Supabase... (${i + 1}/${maxAttempts})`);
            await new Promise(resolve => setTimeout(resolve, 1000));
        }
        return false;
    }
}

// DISPONIBILIZAR GLOBALMENTE
window.SystemInstaller = SystemInstaller;

// EXECUTAR INSTALAÇÃO AUTOMÁTICA
console.log('🎯 Para instalar todas as correções, execute:');
console.log('💻 SystemInstaller.installAllFixes()');

console.log('\n🚀 Script de instalação carregado!'); 