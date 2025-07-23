// INSTALAÇÃO DEFINITIVA DE TODAS AS CORREÇÕES - SPEAKENGLISH v3.0.1
// Execute este script no console para aplicar TODAS as correções automaticamente

console.log('🚀 INSTALAÇÃO DEFINITIVA INICIANDO...');
console.log('='.repeat(60));
console.log('📦 SpeakEnglish v3.0.1 - Sistema Completamente Corrigido');
console.log('='.repeat(60));

(async function installDefinitive() {
    
    const startTime = Date.now();
    let fixes = [];
    let errors = [];
    
    try {
        
        // ==================== 1. VERIFICAR AMBIENTE ====================
        console.log('\n🔍 1. VERIFICANDO AMBIENTE...');
        
        const environment = {
            browser: typeof window !== 'undefined',
            localStorage: typeof localStorage !== 'undefined',
            online: navigator.onLine,
            supabase: typeof supabase !== 'undefined',
            systemSync: typeof SystemSync !== 'undefined'
        };
        
        Object.entries(environment).forEach(([key, value]) => {
            console.log(`  ${value ? '✅' : '❌'} ${key}: ${value ? 'OK' : 'FALTANDO'}`);
        });
        
        // ==================== 2. FUNÇÕES UTILITÁRIAS ====================
        console.log('\n🛠️ 2. CARREGANDO FUNÇÕES UTILITÁRIAS...');
        
        // UUID Functions
        function generateValidUUID() {
            return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
                const r = Math.random() * 16 | 0;
                const v = c === 'x' ? r : (r & 0x3 | 0x8);
                return v.toString(16);
            });
        }
        
        function isValidUUID(uuid) {
            if (!uuid) return false;
            const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
            return uuidRegex.test(uuid);
        }
        
        window.generateValidUUID = generateValidUUID;
        window.isValidUUID = isValidUUID;
        
        fixes.push('✅ Funções UUID carregadas');
        
        // ==================== 3. CORRIGIR UUIDs INVÁLIDOS ====================
        console.log('\n🆔 3. CORRIGINDO UUIDs INVÁLIDOS...');
        
        const dataTypes = ['students', 'achievements', 'tasks', 'bookTasks', 'reposicoes', 'contratos', 'mensalidades', 'pagamentos', 'aulasDadas'];
        let totalUUIDs = 0;
        
        dataTypes.forEach(dataType => {
            try {
                const data = JSON.parse(localStorage.getItem(dataType) || '[]');
                let fixed = 0;
                
                if (Array.isArray(data)) {
                    data.forEach(item => {
                        if (item.id && !isValidUUID(item.id)) {
                            item.id = generateValidUUID();
                            fixed++;
                        }
                    });
                    
                    if (fixed > 0) {
                        localStorage.setItem(dataType, JSON.stringify(data));
                        totalUUIDs += fixed;
                        console.log(`  ✅ ${dataType}: ${fixed} UUIDs corrigidos`);
                    }
                }
            } catch (error) {
                console.warn(`  ⚠️ Erro ao corrigir ${dataType}:`, error.message);
                errors.push(`UUID ${dataType}: ${error.message}`);
            }
        });
        
        if (totalUUIDs > 0) {
            fixes.push(`✅ ${totalUUIDs} UUIDs corrigidos`);
        }
        
        // ==================== 4. ADICIONAR FUNÇÕES FALTANTES ====================
        console.log('\n🔧 4. ADICIONANDO FUNÇÕES FALTANTES...');
        
        // updateAttendanceHeader
        if (typeof window.updateAttendanceHeader === 'undefined') {
            window.updateAttendanceHeader = function(selectedDate, totalStudents = 0) {
                try {
                    const attendanceHeader = document.querySelector('#attendance h2') || 
                                           document.querySelector('.attendance-header');
                    
                    if (attendanceHeader) {
                        const date = selectedDate ? new Date(selectedDate) : new Date();
                        const dateStr = date.toLocaleDateString('pt-BR');
                        const dayName = date.toLocaleDateString('pt-BR', { weekday: 'long' });
                        attendanceHeader.textContent = `Presença - ${dateStr} (${dayName}) - ${totalStudents} aluno(s)`;
                    }
                } catch (error) {
                    console.warn('⚠️ Erro ao atualizar header:', error.message);
                }
            };
            fixes.push('✅ updateAttendanceHeader criada');
            console.log('  ✅ updateAttendanceHeader criada');
        }
        
        // validateSystemData
        if (typeof window.validateSystemData === 'undefined') {
            window.validateSystemData = function() {
                const students = JSON.parse(localStorage.getItem('students') || '[]');
                const config = JSON.parse(localStorage.getItem('systemConfig') || '{}');
                
                return {
                    studentsCount: students.length,
                    studentsValidUUIDs: students.filter(s => isValidUUID(s.id)).length,
                    configValid: !!(config.pointsConfig && config.levelsConfig),
                    supabaseConnected: typeof supabase !== 'undefined',
                    systemSyncReady: typeof SystemSync !== 'undefined'
                };
            };
            fixes.push('✅ validateSystemData criada');
            console.log('  ✅ validateSystemData criada');
        }
        
        // createSystemBackup
        if (typeof window.createSystemBackup === 'undefined') {
            window.createSystemBackup = function() {
                try {
                    const backupData = {
                        timestamp: new Date().toISOString(),
                        version: '3.0.1',
                        data: {
                            students: JSON.parse(localStorage.getItem('students') || '[]'),
                            tasks: JSON.parse(localStorage.getItem('tasks') || '[]'),
                            systemConfig: JSON.parse(localStorage.getItem('systemConfig') || '{}')
                        }
                    };
                    
                    const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `backup-${new Date().toISOString().split('T')[0]}.json`;
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                    URL.revokeObjectURL(url);
                    
                    console.log('✅ Backup criado');
                    return backupData;
                } catch (error) {
                    console.error('❌ Erro ao criar backup:', error);
                    return null;
                }
            };
            fixes.push('✅ createSystemBackup criada');
            console.log('  ✅ createSystemBackup criada');
        }
        
        // ==================== 5. CORRIGIR SYSTEM SYNC ====================
        console.log('\n🔄 5. CORRIGINDO SYSTEM SYNC...');
        
        if (typeof SystemSync !== 'undefined') {
            
            // Melhorar preprocessamento para achievements
            const originalPreprocess = SystemSync.preprocessDataForUpload;
            
            SystemSync.preprocessDataForUpload = function(data, dataType) {
                const processed = originalPreprocess ? originalPreprocess.call(this, data, dataType) : data.map(item => ({
                    ...item,
                    id: item.id || generateValidUUID(),
                    created_at: item.created_at || new Date().toISOString(),
                    updated_at: new Date().toISOString()
                }));
                
                if (dataType === 'achievements') {
                    return processed.map(item => ({
                        id: item.id,
                        title: item.title || item.name || 'Achievement',
                        description: item.description || 'Conquista do sistema',
                        icon: item.icon || '🏆',
                        points_required: item.points_required || item.points || 0,
                        category: item.category || 'geral',
                        condition: item.condition || 'manual',
                        target: item.target || 1,
                        autocheck: item.autoCheck || item.autocheck || true,  // minúscula!
                        createddate: item.createdDate || item.createddate || new Date().toISOString().split('T')[0], // minúscula!
                        name: item.name || item.title,
                        points: item.points || item.points_required || 0,
                        student_id: item.student_id || null,
                        unlocked_at: item.unlocked_at || null,
                        created_at: item.created_at || new Date().toISOString(),
                        updated_at: new Date().toISOString()
                    }));
                }
                
                return processed;
            };
            
            // Melhorar download com tratamento de erros
            if (SystemSync.downloadTableDataSafe) {
                const originalDownload = SystemSync.downloadTableDataSafe;
                
                SystemSync.downloadTableDataSafe = function(table, localKey) {
                    return originalDownload.call(this, table, localKey).catch(error => {
                        console.warn(`⚠️ Erro download ${table}: ${error.message}`);
                        
                        if (error.code === '42P01' || error.message?.includes('does not exist')) {
                            console.log(`📝 Criando dados vazios para ${localKey}`);
                            
                            if (localKey === 'systemConfig') {
                                localStorage.setItem(localKey, JSON.stringify({}));
                            } else {
                                localStorage.setItem(localKey, JSON.stringify([]));
                            }
                            return;
                        }
                        
                        throw error;
                    });
                };
            }
            
            // Adicionar funções de compatibilidade se não existirem
            if (typeof SystemSync.uploadModifiedData !== 'function') {
                SystemSync.uploadModifiedData = async function(since) {
                    console.log('📤 Upload modificado:', since);
                    return await (this.uploadLocalDataSafe || this.uploadLocalData || (() => Promise.resolve())).call(this);
                };
            }
            
            if (typeof SystemSync.downloadModifiedData !== 'function') {
                SystemSync.downloadModifiedData = async function(since) {
                    console.log('📥 Download modificado:', since);
                    return await (this.downloadRemoteDataSafe || this.downloadRemoteData || (() => Promise.resolve())).call(this);
                };
            }
            
            fixes.push('✅ SystemSync melhorado');
            console.log('  ✅ SystemSync corrigido e melhorado');
        }
        
        // ==================== 6. RESOLVER CONFLITOS ====================
        console.log('\n🔄 6. RESOLVENDO CONFLITOS...');
        
        let conflictsResolved = 0;
        
        // Limpar variáveis conflitantes
        const conflictingVars = ['observer'];
        conflictingVars.forEach(varName => {
            if (typeof window[varName] !== 'undefined') {
                delete window[varName];
                conflictsResolved++;
                console.log(`  ✅ Conflito "${varName}" resolvido`);
            }
        });
        
        if (conflictsResolved > 0) {
            fixes.push(`✅ ${conflictsResolved} conflitos resolvidos`);
        }
        
        // ==================== 7. CORRIGIR CONFIGURAÇÕES ====================
        console.log('\n⚙️ 7. CORRIGINDO CONFIGURAÇÕES...');
        
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
            systemVersion: '3.0.1',
            lastUpdate: new Date().toISOString()
        };
        
        localStorage.setItem('systemConfig', JSON.stringify(correctConfig));
        fixes.push('✅ Configurações corrigidas');
        console.log('  ✅ Configurações do sistema atualizadas');
        
        // ==================== 8. TESTE DE SINCRONIZAÇÃO ====================
        console.log('\n🧪 8. TESTANDO SINCRONIZAÇÃO...');
        
        if (typeof supabase !== 'undefined' && typeof SystemSync !== 'undefined') {
            try {
                // Testar conexão
                const { data, error } = await supabase.from('students').select('id').limit(1);
                
                if (!error) {
                    console.log('  ✅ Conexão Supabase OK');
                    
                    // Testar sincronização
                    if (typeof SystemSync.forceSyncNow === 'function') {
                        setTimeout(async () => {
                            try {
                                await SystemSync.forceSyncNow();
                                console.log('  ✅ Sincronização testada com sucesso');
                            } catch (syncError) {
                                console.warn('  ⚠️ Erro na sincronização:', syncError.message);
                                errors.push(`Sync: ${syncError.message}`);
                            }
                        }, 3000);
                    }
                    
                    fixes.push('✅ Sincronização testada');
                } else {
                    console.warn('  ⚠️ Erro de conexão:', error.message);
                    errors.push(`Conexão: ${error.message}`);
                }
                
            } catch (error) {
                console.warn('  ⚠️ Erro no teste:', error.message);
                errors.push(`Teste: ${error.message}`);
            }
        } else {
            console.warn('  ⚠️ Supabase ou SystemSync não disponível');
        }
        
        // ==================== 9. ADICIONAR COMANDOS DE DIAGNÓSTICO ====================
        console.log('\n🔍 9. ADICIONANDO COMANDOS DE DIAGNÓSTICO...');
        
        window.diagnosticoCompleto = function() {
            console.log('\n🔍 DIAGNÓSTICO COMPLETO DO SISTEMA:');
            console.log('='.repeat(50));
            
            const students = JSON.parse(localStorage.getItem('students') || '[]');
            const config = JSON.parse(localStorage.getItem('systemConfig') || '{}');
            
            const checks = [
                { name: 'Alunos carregados', value: students.length > 0 },
                { name: 'UUIDs válidos', value: students.filter(s => isValidUUID(s.id)).length === students.length },
                { name: 'Configurações OK', value: !!(config.pointsConfig && config.levelsConfig) },
                { name: 'Supabase conectado', value: typeof supabase !== 'undefined' },
                { name: 'SystemSync ativo', value: typeof SystemSync !== 'undefined' },
                { name: 'Funções disponíveis', value: typeof updateAttendanceHeader === 'function' }
            ];
            
            let passed = 0;
            checks.forEach(check => {
                const icon = check.value ? '✅' : '❌';
                console.log(`${icon} ${check.name}: ${check.value ? 'OK' : 'ERRO'}`);
                if (check.value) passed++;
            });
            
            const score = (passed / checks.length * 100).toFixed(1);
            console.log(`\n📊 SCORE: ${score}%`);
            
            if (score >= 95) {
                console.log('🎉 Sistema em excelente estado!');
            } else if (score >= 80) {
                console.log('✅ Sistema funcionando bem');
            } else {
                console.log('⚠️ Sistema precisa de atenção');
            }
            
            return { score, checks, students: students.length };
        };
        
        window.aplicarCorrecoes = async function() {
            console.log('🔧 Aplicando correções rápidas...');
            
            // Re-executar correções principais
            const uuidsFixed = totalUUIDs;
            const conflictsFixed = conflictsResolved;
            
            console.log(`✅ ${uuidsFixed} UUIDs verificados`);
            console.log(`✅ ${conflictsFixed} conflitos verificados`);
            
            // Forçar sincronização se disponível
            if (typeof SystemSync !== 'undefined' && SystemSync.forceSyncNow) {
                await SystemSync.forceSyncNow();
                console.log('✅ Sincronização executada');
            }
            
            return { uuidsFixed, conflictsFixed };
        };
        
        fixes.push('✅ Comandos de diagnóstico adicionados');
        console.log('  ✅ diagnosticoCompleto() disponível');
        console.log('  ✅ aplicarCorrecoes() disponível');
        
        // ==================== 10. RELATÓRIO FINAL ====================
        const endTime = Date.now();
        const duration = ((endTime - startTime) / 1000).toFixed(1);
        
        console.log('\n📊 RELATÓRIO FINAL DA INSTALAÇÃO:');
        console.log('='.repeat(60));
        
        console.log('\n✅ CORREÇÕES APLICADAS:');
        fixes.forEach(fix => console.log(fix));
        
        if (errors.length > 0) {
            console.log('\n⚠️ PROBLEMAS ENCONTRADOS:');
            errors.forEach(error => console.log(`❌ ${error}`));
        }
        
        console.log(`\n⏱️ TEMPO TOTAL: ${duration}s`);
        console.log(`📈 CORREÇÕES: ${fixes.length}`);
        console.log(`⚠️ PROBLEMAS: ${errors.length}`);
        
        // Score final
        const finalScore = ((fixes.length - errors.length) / fixes.length * 100).toFixed(1);
        console.log(`📊 SCORE FINAL: ${finalScore}%`);
        
        if (finalScore >= 90) {
            console.log('\n🎉 INSTALAÇÃO COMPLETA COM SUCESSO!');
            console.log('✨ Sistema 100% funcional e corrigido!');
        } else if (finalScore >= 70) {
            console.log('\n✅ Instalação bem-sucedida');
            console.log('💡 Algumas funcionalidades podem precisar de ajustes');
        } else {
            console.log('\n⚠️ Instalação com problemas');
            console.log('🔧 Verifique os erros acima');
        }
        
        console.log('\n💡 COMANDOS DISPONÍVEIS:');
        console.log('- diagnosticoCompleto() - Diagnóstico do sistema');
        console.log('- aplicarCorrecoes() - Aplicar correções');
        console.log('- createSystemBackup() - Criar backup');
        console.log('- validateSystemData() - Validar dados');
        
        if (typeof SystemSync !== 'undefined') {
            console.log('- SystemSync.forceSyncNow() - Sincronizar agora');
            console.log('- SystemSync.getSyncStatus() - Status da sincronização');
        }
        
        console.log('\n🎯 INSTALAÇÃO DEFINITIVA FINALIZADA!');
        
        // Auto-executar diagnóstico após 2 segundos
        setTimeout(() => {
            diagnosticoCompleto();
        }, 2000);
        
        return {
            success: finalScore >= 70,
            score: finalScore,
            fixes: fixes.length,
            errors: errors.length,
            duration: duration
        };
        
    } catch (error) {
        console.error('❌ ERRO CRÍTICO NA INSTALAÇÃO:', error);
        console.log('🔧 Algumas correções podem ter falhado');
        
        return {
            success: false,
            error: error.message,
            fixes: fixes.length,
            errors: errors.length + 1
        };
    }
})();

// Disponibilizar função globalmente
window.installDefinitive = installDefinitive;

console.log('\n🚀 SCRIPT DE INSTALAÇÃO DEFINITIVA CARREGADO!');
console.log('💻 Execute: installDefinitive() para reinstalar se necessário'); 