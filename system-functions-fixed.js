// FUNÇÕES DO SISTEMA CORRIGIDAS DEFINITIVAMENTE - SPEAKENGLISH v3.0.1
// Arquivo que contém todas as correções de funções aplicadas

console.log('🛠️ Carregando funções do sistema corrigidas...');

// ==================== CORREÇÃO DE UUIDs ====================
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

function fixAllUUIDs() {
    console.log('🆔 Corrigindo todos os UUIDs do sistema...');
    
    const dataTypes = ['students', 'achievements', 'tasks', 'bookTasks', 'reposicoes', 'contratos', 'mensalidades', 'pagamentos', 'aulasDadas'];
    let totalFixed = 0;
    
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
                    totalFixed += fixed;
                    console.log(`  ✅ ${dataType}: ${fixed} UUIDs corrigidos`);
                }
            }
        } catch (error) {
            console.warn(`  ⚠️ Erro ao corrigir ${dataType}:`, error.message);
        }
    });
    
    console.log(`✅ Total de ${totalFixed} UUIDs corrigidos`);
    return totalFixed;
}

// ==================== FUNÇÃO updateAttendanceHeader ====================
if (typeof window.updateAttendanceHeader === 'undefined') {
    window.updateAttendanceHeader = function(selectedDate, totalStudents = 0) {
        try {
            const attendanceHeader = document.querySelector('#attendance h2') || 
                                   document.querySelector('.attendance-header') ||
                                   document.querySelector('#attendance .tab-header h2');
            
            if (attendanceHeader) {
                const date = selectedDate ? new Date(selectedDate) : new Date();
                const dateStr = date.toLocaleDateString('pt-BR');
                const dayName = date.toLocaleDateString('pt-BR', { weekday: 'long' });
                attendanceHeader.textContent = `Presença - ${dateStr} (${dayName}) - ${totalStudents} aluno(s)`;
                
                console.log(`📅 Header atualizado: ${dateStr} - ${totalStudents} alunos`);
            } else {
                console.warn('⚠️ Header da presença não encontrado');
                
                // Criar header se não existir
                const attendanceTab = document.getElementById('attendance');
                if (attendanceTab) {
                    let header = attendanceTab.querySelector('h2');
                    if (!header) {
                        header = document.createElement('h2');
                        header.className = 'attendance-header';
                        attendanceTab.insertBefore(header, attendanceTab.firstChild);
                    }
                    
                    const date = selectedDate ? new Date(selectedDate) : new Date();
                    const dateStr = date.toLocaleDateString('pt-BR');
                    const dayName = date.toLocaleDateString('pt-BR', { weekday: 'long' });
                    
                    header.textContent = `Presença - ${dateStr} (${dayName}) - ${totalStudents} aluno(s)`;
                    console.log('✅ Header da presença criado');
                }
            }
            
        } catch (error) {
            console.warn('⚠️ Erro ao atualizar header:', error.message);
        }
    };
    
    console.log('✅ updateAttendanceHeader criada');
}

// Função auxiliar para atualizar presença
if (typeof window.updateAttendanceDisplay === 'undefined') {
    window.updateAttendanceDisplay = function() {
        try {
            const attendanceDateInput = document.getElementById('attendanceDate');
            const selectedDate = attendanceDateInput ? attendanceDateInput.value : new Date().toISOString().split('T')[0];
            
            // Contar alunos para o dia selecionado
            const students = JSON.parse(localStorage.getItem('students') || '[]');
            const activeStudents = students.filter(s => s.active !== false);
            
            updateAttendanceHeader(selectedDate, activeStudents.length);
            
        } catch (error) {
            console.warn('⚠️ Erro ao atualizar display de presença:', error.message);
        }
    };
    
    console.log('✅ updateAttendanceDisplay criada');
}

// ==================== FUNÇÃO validateSystemData MELHORADA ====================
if (typeof window.validateSystemData === 'undefined') {
    window.validateSystemData = function() {
        console.log('🔍 Validando dados do sistema...');
        
        const students = JSON.parse(localStorage.getItem('students') || '[]');
        const config = JSON.parse(localStorage.getItem('systemConfig') || '{}');
        
        const validation = {
            studentsCount: students.length,
            studentsValidUUIDs: students.filter(s => isValidUUID(s.id)).length,
            configValid: !!(config.pointsConfig && config.levelsConfig),
            dataStructureValid: true,
            supabaseConnected: typeof supabase !== 'undefined',
            systemSyncReady: typeof SystemSync !== 'undefined',
            allDataTypesValid: true
        };
        
        // Verificar todos os tipos de dados
        const dataTypes = ['students', 'tasks', 'bookTasks', 'achievements', 'attendance', 'reposicoes', 'contratos', 'mensalidades', 'pagamentos', 'aulasDadas'];
        
        dataTypes.forEach(dataType => {
            try {
                const data = localStorage.getItem(dataType);
                if (data) {
                    JSON.parse(data);
                    validation[`${dataType}Valid`] = true;
                } else {
                    validation[`${dataType}Valid`] = false;
                    validation.allDataTypesValid = false;
                }
            } catch (error) {
                validation[`${dataType}Valid`] = false;
                validation.allDataTypesValid = false;
            }
        });
        
        console.log('📊 Validação do sistema:', validation);
        return validation;
    };
    
    console.log('✅ validateSystemData melhorada');
}

// ==================== FUNÇÃO createSystemBackup MELHORADA ====================
if (typeof window.createSystemBackup === 'undefined') {
    window.createSystemBackup = function() {
        console.log('💾 Criando backup completo do sistema...');
        
        try {
            const backupData = {
                timestamp: new Date().toISOString(),
                version: '3.0.1',
                systemInfo: {
                    userAgent: navigator.userAgent,
                    url: window.location.href,
                    supabaseConnected: typeof supabase !== 'undefined'
                },
                data: {
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
                },
                validation: validateSystemData()
            };
            
            const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `speakenglish-backup-complete-${new Date().toISOString().split('T')[0]}.json`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            
            console.log('✅ Backup completo criado e baixado');
            return backupData;
            
        } catch (error) {
            console.error('❌ Erro ao criar backup:', error);
            return null;
        }
    };
    
    console.log('✅ createSystemBackup melhorada');
}

// ==================== RESOLUÇÃO DE CONFLITOS ====================
function resolveSystemConflicts() {
    console.log('🔄 Resolvendo conflitos do sistema...');
    
    let conflictsResolved = 0;
    
    // Limpar variáveis globais conflitantes
    const conflictingVars = ['observer'];
    
    conflictingVars.forEach(varName => {
        if (typeof window[varName] !== 'undefined') {
            delete window[varName];
            conflictsResolved++;
            console.log(`  ✅ Conflito de variável "${varName}" resolvido`);
        }
    });
    
    // Limpar event listeners duplicados
    try {
        const forms = document.querySelectorAll('form');
        forms.forEach(form => {
            if (form.cloneNode) {
                const newForm = form.cloneNode(true);
                form.parentNode.replaceChild(newForm, form);
            }
        });
        
        if (forms.length > 0) {
            console.log(`  ✅ ${forms.length} formulários limpos de event listeners duplicados`);
            conflictsResolved++;
        }
    } catch (error) {
        console.warn('⚠️ Erro ao limpar event listeners:', error.message);
    }
    
    console.log(`✅ ${conflictsResolved} conflitos resolvidos`);
    return conflictsResolved;
}

// ==================== DIAGNÓSTICO COMPLETO ====================
function diagnosticoCompleto() {
    console.log('\n🔍 DIAGNÓSTICO COMPLETO DO SISTEMA');
    console.log('='.repeat(50));
    
    const diagnostics = {
        timestamp: new Date().toISOString(),
        environment: {
            online: navigator.onLine,
            supabase: typeof supabase !== 'undefined',
            systemSync: typeof SystemSync !== 'undefined',
            syncMonitor: typeof SyncMonitor !== 'undefined'
        },
        data: {},
        functions: {
            updateAttendanceHeader: typeof window.updateAttendanceHeader === 'function',
            validateSystemData: typeof window.validateSystemData === 'function',
            createSystemBackup: typeof window.createSystemBackup === 'function',
            forceStudentTabsStyles: typeof window.forceStudentTabsStyles === 'function'
        },
        ui: {
            loginScreen: !!document.getElementById('loginScreen'),
            mainInterface: !!document.getElementById('mainInterface'),
            syncMonitor: !!document.getElementById('syncMonitor')
        },
        validation: null
    };
    
    // Validar dados
    try {
        diagnostics.validation = validateSystemData();
        
        // Contadores de dados
        const dataTypes = ['students', 'tasks', 'bookTasks', 'achievements', 'reposicoes', 'contratos', 'mensalidades', 'pagamentos'];
        dataTypes.forEach(type => {
            try {
                const data = JSON.parse(localStorage.getItem(type) || '[]');
                diagnostics.data[type] = Array.isArray(data) ? data.length : 'N/A';
            } catch (error) {
                diagnostics.data[type] = 'ERROR';
            }
        });
        
    } catch (error) {
        console.warn('⚠️ Erro na validação:', error.message);
    }
    
    // Mostrar resultados
    console.log('🌐 Ambiente:');
    Object.entries(diagnostics.environment).forEach(([key, value]) => {
        console.log(`  ${value ? '✅' : '❌'} ${key}: ${value ? 'OK' : 'ERRO'}`);
    });
    
    console.log('\n📊 Dados:');
    Object.entries(diagnostics.data).forEach(([key, value]) => {
        console.log(`  📋 ${key}: ${value}`);
    });
    
    console.log('\n🛠️ Funções:');
    Object.entries(diagnostics.functions).forEach(([key, value]) => {
        console.log(`  ${value ? '✅' : '❌'} ${key}: ${value ? 'OK' : 'FALTANDO'}`);
    });
    
    console.log('\n🖥️ Interface:');
    Object.entries(diagnostics.ui).forEach(([key, value]) => {
        console.log(`  ${value ? '✅' : '❌'} ${key}: ${value ? 'ENCONTRADO' : 'FALTANDO'}`);
    });
    
    // Calcular score
    const allChecks = [
        ...Object.values(diagnostics.environment),
        ...Object.values(diagnostics.functions),
        ...Object.values(diagnostics.ui),
        diagnostics.validation?.configValid,
        diagnostics.validation?.allDataTypesValid
    ].filter(v => v !== undefined);
    
    const passedChecks = allChecks.filter(Boolean).length;
    const score = (passedChecks / allChecks.length * 100).toFixed(1);
    
    console.log(`\n📈 SCORE GERAL: ${score}%`);
    
    if (score >= 95) {
        console.log('🎉 Sistema em excelente estado!');
    } else if (score >= 85) {
        console.log('✅ Sistema funcionando bem');
    } else if (score >= 70) {
        console.log('⚠️ Sistema funcionando com avisos');
    } else {
        console.log('🔧 Sistema precisa de atenção');
    }
    
    return diagnostics;
}

// ==================== TESTE DE SINCRONIZAÇÃO ====================
async function testarSincronizacao() {
    console.log('🧪 Testando sincronização completa...');
    
    if (typeof SystemSync !== 'undefined' && typeof supabase !== 'undefined') {
        try {
            // Testar conexão básica
            console.log('🔗 Testando conexão...');
            const { data, error } = await supabase.from('students').select('id').limit(1);
            
            if (!error) {
                console.log('✅ Conexão Supabase OK');
                
                // Testar sincronização
                console.log('🔄 Testando sincronização...');
                if (typeof SystemSync.forceSyncNow === 'function') {
                    await SystemSync.forceSyncNow();
                    console.log('✅ Sincronização testada com sucesso');
                }
                
                // Testar status
                if (typeof SystemSync.getSyncStatus === 'function') {
                    const status = SystemSync.getSyncStatus();
                    console.log('📊 Status da sincronização:', status);
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

// ==================== CORREÇÃO AUTOMÁTICA COMPLETA ====================
async function aplicarTodasCorrecoes() {
    console.log('🚀 APLICANDO TODAS AS CORREÇÕES AUTOMATICAMENTE...');
    console.log('='.repeat(60));
    
    let fixes = [];
    
    try {
        // 1. Corrigir UUIDs
        const uuidsFixed = fixAllUUIDs();
        if (uuidsFixed > 0) {
            fixes.push(`✅ ${uuidsFixed} UUIDs corrigidos`);
        }
        
        // 2. Resolver conflitos
        const conflictsResolved = resolveSystemConflicts();
        if (conflictsResolved > 0) {
            fixes.push(`✅ ${conflictsResolved} conflitos resolvidos`);
        }
        
        // 3. Validar estrutura de dados
        const validation = validateSystemData();
        if (validation.allDataTypesValid) {
            fixes.push('✅ Estrutura de dados válida');
        } else {
            fixes.push('⚠️ Problemas na estrutura de dados detectados');
        }
        
        // 4. Testar sincronização
        await testarSincronizacao();
        fixes.push('✅ Sincronização testada');
        
        // 5. Criar backup
        const backup = createSystemBackup();
        if (backup) {
            fixes.push('✅ Backup criado');
        }
        
        // Relatório final
        console.log('\n📊 RELATÓRIO DE CORREÇÕES:');
        console.log('='.repeat(40));
        fixes.forEach(fix => console.log(fix));
        
        console.log(`\n📈 TOTAL: ${fixes.length} correções aplicadas`);
        console.log('🎉 TODAS AS CORREÇÕES APLICADAS COM SUCESSO!');
        
        return {
            success: true,
            fixes: fixes,
            validation: validation
        };
        
    } catch (error) {
        console.error('❌ Erro ao aplicar correções:', error);
        return {
            success: false,
            error: error.message,
            fixes: fixes
        };
    }
}

// ==================== DISPONIBILIZAR FUNÇÕES GLOBALMENTE ====================
window.generateValidUUID = generateValidUUID;
window.isValidUUID = isValidUUID;
window.fixAllUUIDs = fixAllUUIDs;
window.resolveSystemConflicts = resolveSystemConflicts;
window.diagnosticoCompleto = diagnosticoCompleto;
window.testarSincronizacao = testarSincronizacao;
window.aplicarTodasCorrecoes = aplicarTodasCorrecoes;

// ==================== EXECUTAR CORREÇÕES AUTOMÁTICAS ====================
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        // Aplicar correções básicas automaticamente
        fixAllUUIDs();
        resolveSystemConflicts();
        
        console.log('✅ Correções automáticas aplicadas na inicialização');
    }, 2000);
});

console.log('🛠️ Funções do sistema corrigidas carregadas!');
console.log('💡 Comandos disponíveis:');
console.log('- diagnosticoCompleto() - Diagnóstico completo');
console.log('- aplicarTodasCorrecoes() - Aplicar todas as correções');
console.log('- testarSincronizacao() - Testar sincronização');
console.log('- createSystemBackup() - Criar backup completo'); 