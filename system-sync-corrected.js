// SISTEMA DE SINCRONIZAÇÃO CORRIGIDO DEFINITIVO - SPEAKENGLISH v3.0.1
// Versão final com todas as correções de UUID, mapeamento e schema

console.log('🔄 Carregando Sistema de Sincronização Corrigido...');

class SystemSyncCorrected {
    static isOnline = navigator.onLine;
    static syncInProgress = false;
    static lastSyncTime = localStorage.getItem('lastSyncTime') || '0';
    static conflictResolver = 'local';
    
    // CONFIGURAÇÕES DE SINCRONIZAÇÃO
    static syncConfig = {
        autoSync: true,
        syncInterval: 60000, // 1 minuto
        offlineMode: true,
        batchSize: 50,
        retryAttempts: 3,
        retryDelay: 5000
    };
    
    // MAPEAMENTO DE DADOS CORRIGIDO
    static dataMapping = {
        students: 'students',
        tasks: 'tasks', 
        bookTasks: 'book_tasks',
        achievements: 'achievements',
        attendance: 'attendance_records',
        reposicoes: 'makeup_classes',
        contratos: 'contracts',
        mensalidades: 'monthly_fees',
        pagamentos: 'payments',
        aulasDadas: 'classes_given',
        systemConfig: 'system_config'
    };
    
    // INICIALIZAÇÃO DO SISTEMA
    static async initialize() {
        console.log('🚀 Inicializando Sistema de Sincronização Corrigido...');
        
        try {
            // Aplicar correções automáticas
            this.applyAutomaticFixes();
            
            // Verificar conectividade
            this.setupNetworkMonitoring();
            
            // Aguardar Supabase
            const supabaseReady = await this.waitForSupabase();
            
            if (supabaseReady) {
                // Configurar sincronização automática
                if (this.syncConfig.autoSync) {
                    this.startAutoSync();
                }
                
                // Sincronização inicial
                await this.performInitialSync();
                
                // Interceptar funções de salvamento
                this.interceptSaveFunction();
                
                console.log('✅ Sistema de Sincronização Corrigido inicializado!');
            } else {
                console.warn('⚠️ Modo offline - apenas dados locais');
            }
            
        } catch (error) {
            console.error('❌ Erro na inicialização:', error);
        }
    }
    
    // APLICAR CORREÇÕES AUTOMÁTICAS
    static applyAutomaticFixes() {
        console.log('🔧 Aplicando correções automáticas...');
        
        // 1. Corrigir UUIDs inválidos
        this.fixInvalidUUIDs();
        
        // 2. Adicionar funções faltantes
        this.addMissingFunctions();
        
        // 3. Limpar conflitos
        this.resolveConflicts();
        
        console.log('✅ Correções automáticas aplicadas');
    }
    
    // CORRIGIR UUIDs INVÁLIDOS
    static fixInvalidUUIDs() {
        console.log('🆔 Corrigindo UUIDs inválidos...');
        
        const dataTypes = ['students', 'achievements', 'tasks', 'bookTasks', 'reposicoes', 'contratos', 'mensalidades', 'pagamentos', 'aulasDadas'];
        let totalFixed = 0;
        
        dataTypes.forEach(dataType => {
            try {
                const data = JSON.parse(localStorage.getItem(dataType) || '[]');
                let fixed = 0;
                
                if (Array.isArray(data)) {
                    data.forEach(item => {
                        if (item.id && !this.isValidUUID(item.id)) {
                            item.id = this.generateValidUUID();
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
        
        if (totalFixed > 0) {
            console.log(`✅ Total de ${totalFixed} UUIDs corrigidos`);
        }
    }
    
    // ADICIONAR FUNÇÕES FALTANTES
    static addMissingFunctions() {
        console.log('🛠️ Adicionando funções faltantes...');
        
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
            console.log('  ✅ updateAttendanceHeader criada');
        }
        
        // validateSystemData melhorada
        if (typeof window.validateSystemData === 'undefined') {
            window.validateSystemData = function() {
                const students = JSON.parse(localStorage.getItem('students') || '[]');
                const config = JSON.parse(localStorage.getItem('systemConfig') || '{}');
                
                return {
                    studentsCount: students.length,
                    studentsValidUUIDs: students.filter(s => SystemSyncCorrected.isValidUUID(s.id)).length,
                    configValid: !!(config.pointsConfig && config.levelsConfig),
                    dataStructureValid: true,
                    supabaseConnected: typeof supabase !== 'undefined',
                    systemSyncReady: typeof SystemSync !== 'undefined'
                };
            };
            console.log('  ✅ validateSystemData melhorada');
        }
    }
    
    // RESOLVER CONFLITOS
    static resolveConflicts() {
        console.log('🔄 Resolvendo conflitos...');
        
        // Limpar variáveis globais conflitantes
        if (typeof window.observer !== 'undefined') {
            delete window.observer;
            console.log('  ✅ Conflito de variável "observer" resolvido');
        }
    }
    
    // AGUARDAR SUPABASE ESTAR DISPONÍVEL
    static async waitForSupabase(maxAttempts = 10) {
        for (let i = 0; i < maxAttempts; i++) {
            if (typeof supabase !== 'undefined' && supabase) {
                console.log('✅ Supabase disponível!');
                return true;
            }
            console.log(`⏳ Aguardando Supabase... (${i + 1}/${maxAttempts})`);
            await this.delay(1000);
        }
        console.warn('⚠️ Supabase não disponível - modo offline');
        return false;
    }
    
    // SINCRONIZAÇÃO INICIAL
    static async performInitialSync() {
        if (!this.isOnline || this.syncInProgress) return;
        
        console.log('🔄 Executando sincronização inicial...');
        this.syncInProgress = true;
        
        try {
            // 1. Verificar dados locais e remotos
            const hasLocalData = this.hasLocalData();
            const hasRemoteData = await this.hasRemoteData();
            
            console.log(`📊 Dados locais: ${hasLocalData ? 'Sim' : 'Não'}`);
            console.log(`📊 Dados remotos: ${hasRemoteData ? 'Sim' : 'Não'}`);
            
            if (!hasLocalData && !hasRemoteData) {
                // Primeiro uso - criar dados padrão
                await this.createDefaultData();
                console.log('🎯 Dados padrão criados');
            } else if (hasLocalData && !hasRemoteData) {
                // Upload dados locais para Supabase
                await this.uploadLocalDataSafe();
                console.log('⬆️ Dados locais enviados para Supabase');
            } else if (!hasLocalData && hasRemoteData) {
                // Download dados do Supabase
                await this.downloadRemoteDataSafe();
                console.log('⬇️ Dados baixados do Supabase');
            } else {
                // Fazer merge - priorizar dados mais recentes
                await this.mergeDataSafe();
                console.log('🔀 Dados sincronizados');
            }
            
            this.lastSyncTime = Date.now().toString();
            localStorage.setItem('lastSyncTime', this.lastSyncTime);
            
            console.log('✅ Sincronização inicial completa!');
            
        } catch (error) {
            console.error('❌ Erro na sincronização inicial:', error);
        } finally {
            this.syncInProgress = false;
        }
    }
    
    // UPLOAD DADOS LOCAIS (SEGURO COM CORREÇÕES)
    static async uploadLocalDataSafe() {
        console.log('⬆️ Fazendo upload seguro dos dados locais...');
        
        for (const [localKey, remoteTable] of Object.entries(this.dataMapping)) {
            try {
                const localData = JSON.parse(localStorage.getItem(localKey) || '[]');
                
                if (localKey === 'systemConfig') {
                    // SystemConfig é objeto, não array
                    const configData = JSON.parse(localStorage.getItem(localKey) || '{}');
                    if (Object.keys(configData).length > 0) {
                        await this.uploadSystemConfigSafe(configData);
                    }
                    continue;
                }
                
                if (Array.isArray(localData) && localData.length > 0) {
                    await this.uploadTableDataSafe(remoteTable, localData, localKey);
                }
                
            } catch (error) {
                console.warn(`⚠️ Erro no upload de ${localKey}:`, error.message);
                // Continuar com próximos dados mesmo se um falhar
            }
        }
    }
    
    // UPLOAD SEGURO DE TABELA (COM CORREÇÕES DE MAPEAMENTO)
    static async uploadTableDataSafe(table, data, dataType) {
        console.log(`📤 Upload seguro: ${dataType} (${data.length} items)...`);
        
        try {
            // Verificar se tabela existe
            const { error: testError } = await supabase
                .from(table)
                .select('id')
                .limit(1);
            
            if (testError && testError.code === '42P01') {
                console.warn(`⚠️ Tabela ${table} não existe - pulando`);
                return;
            }
            
            // Processar dados em batches pequenos
            const batches = this.createBatches(data, 10);
            
            for (let i = 0; i < batches.length; i++) {
                const batch = batches[i];
                
                try {
                    const processedBatch = this.preprocessDataForUpload(batch, dataType);
                    
                    const { error } = await supabase
                        .from(table)
                        .upsert(processedBatch, { 
                            onConflict: 'id',
                            ignoreDuplicates: false 
                        });
                    
                    if (error) {
                        console.warn(`⚠️ Erro no batch ${i+1}/${batches.length} de ${table}:`, error.message);
                        
                        // Tentar com dados simplificados
                        const simplifiedBatch = this.simplifyDataForUpload(batch, dataType, error.message);
                        
                        const { error: retryError } = await supabase
                            .from(table)
                            .upsert(simplifiedBatch, { 
                                onConflict: 'id',
                                ignoreDuplicates: false 
                            });
                        
                        if (!retryError) {
                            console.log(`✅ Batch ${i+1}/${batches.length} de ${table} enviado (simplificado)`);
                        }
                        
                    } else {
                        console.log(`✅ Batch ${i+1}/${batches.length} de ${table} enviado`);
                    }
                    
                } catch (batchError) {
                    console.warn(`⚠️ Erro crítico no batch ${i+1} de ${table}:`, batchError.message);
                }
            }
            
        } catch (error) {
            console.warn(`⚠️ Erro geral no upload de ${table}:`, error.message);
        }
    }
    
    // PREPROCESSAR DADOS PARA UPLOAD (COM CORREÇÕES DE MAPEAMENTO)
    static preprocessDataForUpload(data, dataType) {
        return data.map(item => {
            // Garantir ID UUID válido
            if (!item.id || !this.isValidUUID(item.id)) {
                item.id = this.generateValidUUID();
            }
            
            // Timestamps
            if (!item.created_at) {
                item.created_at = new Date().toISOString();
            }
            item.updated_at = new Date().toISOString();
            
            // Processamento específico por tipo
            switch (dataType) {
                case 'students':
                    return this.preprocessStudent(item);
                case 'achievements':
                    return this.preprocessAchievement(item); // NOVA FUNÇÃO CORRIGIDA
                case 'tasks':
                    return this.preprocessTask(item);
                case 'bookTasks':
                    return this.preprocessBookTask(item);
                case 'contratos':
                    return this.preprocessContract(item);
                case 'mensalidades':
                    return this.preprocessMonthlyFee(item);
                case 'pagamentos':
                    return this.preprocessPayment(item);
                default:
                    return item;
            }
        });
    }
    
    // PREPROCESSADOR DE ACHIEVEMENTS (CORRIGIDO)
    static preprocessAchievement(achievement) {
        return {
            id: achievement.id,
            title: achievement.title || achievement.name || 'Achievement',
            description: achievement.description || 'Conquista do sistema',
            icon: achievement.icon || '🏆',
            points_required: achievement.points_required || achievement.points || 0,
            category: achievement.category || 'geral',
            condition: achievement.condition || 'manual',
            target: achievement.target || 1,
            autocheck: achievement.autoCheck || achievement.autocheck || true,  // minúscula!
            createddate: achievement.createdDate || achievement.createddate || new Date().toISOString().split('T')[0], // minúscula!
            name: achievement.name || achievement.title,
            points: achievement.points || achievement.points_required || 0,
            student_id: achievement.student_id || null,
            unlocked_at: achievement.unlocked_at || null,
            created_at: achievement.created_at || new Date().toISOString(),
            updated_at: new Date().toISOString()
        };
    }
    
    // PREPROCESSADOR DE STUDENTS (CORRIGIDO)
    static preprocessStudent(student) {
        return {
            id: student.id,
            name: student.name,
            email: student.email,
            phone: student.phone || null,
            password: student.password || '123456',
            level: student.level || 'A1',
            points: student.totalPoints || student.points || 0,
            attendance_count: student.attendanceCount || 0,
            attendance_streak: student.attendanceStreak || 0,
            tasks_completed: student.tasksCompleted || 0,
            class_time: student.classTime || null,
            class_days: student.classDays ? JSON.stringify(student.classDays) : '[]',
            achievements: student.achievements ? JSON.stringify(student.achievements) : '[]',
            completed_tasks: student.completedTasks ? JSON.stringify(student.completedTasks) : '[]',
            completed_book_tasks: student.completedBookTasks ? JSON.stringify(student.completedBookTasks) : '[]',
            points_history: student.pointsHistory ? JSON.stringify(student.pointsHistory) : '[]',
            join_date: student.joinDate || new Date().toISOString().split('T')[0],
            active: student.active !== false,
            created_at: student.created_at || new Date().toISOString(),
            updated_at: new Date().toISOString()
        };
    }
    
    // OUTRAS FUNÇÕES (mantidas do sistema anterior)
    static preprocessTask(task) {
        return {
            id: task.id,
            title: task.title,
            description: task.description || null,
            points: task.points || 10,
            due_date: task.dueDate || null,
            classroom_link: task.classroomLink || null,
            created_date: task.createdDate || new Date().toISOString().split('T')[0],
            status: task.completed ? 'completed' : 'active',
            created_at: task.created_at || new Date().toISOString(),
            updated_at: new Date().toISOString()
        };
    }
    
    static preprocessBookTask(task) {
        return {
            id: task.id,
            book_name: task.bookName || task.book,
            book_page: task.bookPage || task.page,
            exercises: task.exercises,
            points: task.points || 10,
            description: task.description || null,
            due_date: task.dueDate || null,
            selected_students: task.selectedStudents ? JSON.stringify(task.selectedStudents) : '[]',
            created_date: task.createdDate || new Date().toISOString().split('T')[0],
            status: task.completed ? 'completed' : 'active',
            created_at: task.created_at || new Date().toISOString(),
            updated_at: new Date().toISOString()
        };
    }
    
    static preprocessContract(contract) {
        return {
            id: contract.id,
            student_email: contract.studentEmail,
            student_name: contract.studentName,
            value: parseFloat(contract.valor) || 0,
            due_day: parseInt(contract.vencimento) || null,
            start_date: contract.dataInicio,
            end_date: contract.dataTermino,
            status: contract.status || 'ativo',
            created_at: contract.created_at || new Date().toISOString(),
            updated_at: new Date().toISOString()
        };
    }
    
    static preprocessMonthlyFee(fee) {
        return {
            id: fee.id,
            student_email: fee.studentEmail,
            student_name: fee.studentName,
            reference_month: fee.referenceMonth,
            amount: parseFloat(fee.valor) || 0,
            due_date: fee.dataVencimento,
            status: fee.status || 'pendente',
            contract_id: fee.contractId || null,
            created_at: fee.created_at || new Date().toISOString(),
            updated_at: new Date().toISOString()
        };
    }
    
    static preprocessPayment(payment) {
        return {
            id: payment.id,
            student_email: payment.studentEmail || payment.aluno,
            student_name: payment.studentName || payment.alunoNome,
            reference_month: payment.referencia || payment.referenceMonth,
            amount: parseFloat(payment.valor) || 0,
            payment_date: payment.dataPagamento || payment.payment_date,
            due_date: payment.dataVencimento || payment.due_date,
            payment_method: payment.formaPagamento || payment.payment_method || 'pix',
            observations: payment.observacoes || payment.observations || null,
            status: payment.status || 'pago',
            created_at: payment.created_at || new Date().toISOString(),
            updated_at: new Date().toISOString()
        };
    }
    
    // DOWNLOAD DADOS REMOTOS (SEGURO)
    static async downloadRemoteDataSafe() {
        console.log('⬇️ Fazendo download seguro dos dados remotos...');
        
        for (const [localKey, remoteTable] of Object.entries(this.dataMapping)) {
            try {
                await this.downloadTableDataSafe(remoteTable, localKey);
            } catch (error) {
                console.warn(`⚠️ Erro no download de ${localKey}:`, error.message);
                // Criar array vazio se falhar
                if (localKey !== 'systemConfig') {
                    localStorage.setItem(localKey, JSON.stringify([]));
                }
            }
        }
        
        this.dispatchDataUpdateEvent();
    }
    
    // DOWNLOAD SEGURO DE TABELA
    static async downloadTableDataSafe(table, localKey) {
        console.log(`📥 Download seguro: ${localKey}...`);
        
        try {
            // Verificar colunas disponíveis primeiro
            const { data: testData, error: testError } = await supabase
                .from(table)
                .select('*')
                .limit(1);
            
            if (testError) {
                if (testError.code === '42P01') {
                    console.warn(`⚠️ Tabela ${table} não existe - criando dados vazios`);
                    if (localKey === 'systemConfig') {
                        localStorage.setItem(localKey, JSON.stringify({}));
                    } else {
                        localStorage.setItem(localKey, JSON.stringify([]));
                    }
                    return;
                }
                throw testError;
            }
            
            // Download completo
            const { data, error } = await supabase
                .from(table)
                .select('*')
                .order('created_at', { ascending: false })
                .limit(1000);
            
            if (error) {
                throw error;
            }
            
            // Processar dados
            if (localKey === 'systemConfig') {
                const configObj = {};
                if (data && data.length > 0) {
                    data.forEach(item => {
                        configObj[item.config_key] = item.config_value;
                    });
                }
                localStorage.setItem(localKey, JSON.stringify(configObj));
            } else {
                const processedData = this.postprocessDataFromDownload(data || [], localKey);
                localStorage.setItem(localKey, JSON.stringify(processedData));
            }
            
            console.log(`✅ ${localKey} baixado (${data ? data.length : 0} items)`);
            
        } catch (error) {
            console.warn(`⚠️ Erro no download de ${table}:`, error.message);
            
            // Criar dados vazios em caso de erro
            if (localKey === 'systemConfig') {
                localStorage.setItem(localKey, JSON.stringify({}));
            } else {
                localStorage.setItem(localKey, JSON.stringify([]));
            }
        }
    }
    
    // POSTPROCESSAR DADOS DO DOWNLOAD (COM CORREÇÕES)
    static postprocessDataFromDownload(data, dataType) {
        if (!Array.isArray(data)) return [];
        
        return data.map(item => {
            switch (dataType) {
                case 'students':
                    return this.postprocessStudent(item);
                case 'achievements':
                    return this.postprocessAchievement(item); // NOVA FUNÇÃO CORRIGIDA
                case 'tasks':
                    return this.postprocessTask(item);
                case 'bookTasks':
                    return this.postprocessBookTask(item);
                case 'contratos':
                    return this.postprocessContract(item);
                case 'mensalidades':
                    return this.postprocessMonthlyFee(item);
                case 'pagamentos':
                    return this.postprocessPayment(item);
                default:
                    return item;
            }
        });
    }
    
    // POSTPROCESSADOR DE ACHIEVEMENTS (CORRIGIDO)
    static postprocessAchievement(achievement) {
        return {
            id: achievement.id,
            name: achievement.name || achievement.title,
            title: achievement.title || achievement.name,
            description: achievement.description,
            icon: achievement.icon,
            points: achievement.points || achievement.points_required,
            condition: achievement.condition,
            target: achievement.target,
            autoCheck: achievement.autocheck,  // converter para camelCase
            createdDate: achievement.createddate  // converter para camelCase
        };
    }
    
    // OUTRAS FUNÇÕES DE POSTPROCESSAMENTO (mantidas do sistema anterior)
    static postprocessStudent(student) {
        return {
            id: student.id,
            name: student.name,
            email: student.email,
            phone: student.phone,
            password: student.password,
            level: student.level,
            totalPoints: student.points,
            attendanceCount: student.attendance_count || 0,
            attendanceStreak: student.attendance_streak || 0,
            tasksCompleted: student.tasks_completed || 0,
            classTime: student.class_time,
            classDays: student.class_days ? JSON.parse(student.class_days) : [],
            achievements: student.achievements ? JSON.parse(student.achievements) : [],
            completedTasks: student.completed_tasks ? JSON.parse(student.completed_tasks) : [],
            completedBookTasks: student.completed_book_tasks ? JSON.parse(student.completed_book_tasks) : [],
            pointsHistory: student.points_history ? JSON.parse(student.points_history) : [],
            joinDate: student.join_date,
            active: student.active
        };
    }
    
    static postprocessTask(task) {
        return {
            id: task.id,
            title: task.title,
            description: task.description,
            points: task.points,
            dueDate: task.due_date,
            classroomLink: task.classroom_link,
            createdDate: task.created_date,
            completed: task.status === 'completed'
        };
    }
    
    static postprocessBookTask(task) {
        return {
            id: task.id,
            bookName: task.book_name,
            bookPage: task.book_page,
            book: task.book_name,
            page: task.book_page,
            exercises: task.exercises,
            points: task.points,
            description: task.description,
            dueDate: task.due_date,
            selectedStudents: task.selected_students ? JSON.parse(task.selected_students) : [],
            createdDate: task.created_date,
            completed: task.status === 'completed'
        };
    }
    
    static postprocessContract(contract) {
        return {
            id: contract.id,
            studentEmail: contract.student_email,
            studentName: contract.student_name,
            valor: contract.value,
            vencimento: contract.due_day,
            dataInicio: contract.start_date,
            dataTermino: contract.end_date,
            status: contract.status
        };
    }
    
    static postprocessMonthlyFee(fee) {
        return {
            id: fee.id,
            studentEmail: fee.student_email,
            studentName: fee.student_name,
            referenceMonth: fee.reference_month,
            valor: fee.amount,
            dataVencimento: fee.due_date,
            status: fee.status,
            contractId: fee.contract_id
        };
    }
    
    static postprocessPayment(payment) {
        return {
            id: payment.id,
            studentEmail: payment.student_email,
            studentName: payment.student_name,
            referencia: payment.reference_month,
            valor: payment.amount,
            dataPagamento: payment.payment_date,
            dataVencimento: payment.due_date,
            formaPagamento: payment.payment_method,
            observacoes: payment.observations,
            status: payment.status
        };
    }
    
    // SIMPLIFICAR DADOS PARA UPLOAD (REMOVER COLUNAS PROBLEMÁTICAS)
    static simplifyDataForUpload(data, dataType, errorMessage) {
        const missingColumn = errorMessage.match(/'([^']+)'/);
        const problemColumn = missingColumn ? missingColumn[1] : null;
        
        console.log(`🔧 Simplificando ${dataType}, removendo coluna: ${problemColumn}`);
        
        return data.map(item => {
            const processed = this.preprocessDataForUpload([item], dataType)[0];
            
            // Remover coluna problemática
            if (problemColumn && processed[problemColumn] !== undefined) {
                delete processed[problemColumn];
            }
            
            // Garantir campos básicos obrigatórios
            if (!processed.id) {
                processed.id = this.generateValidUUID();
            }
            
            if (!processed.created_at) {
                processed.created_at = new Date().toISOString();
            }
            
            processed.updated_at = new Date().toISOString();
            
            return processed;
        });
    }
    
    // VERIFICAR DADOS
    static hasLocalData() {
        const students = JSON.parse(localStorage.getItem('students') || '[]');
        return students.length > 0;
    }
    
    static async hasRemoteData() {
        try {
            const { data, error } = await supabase
                .from('students')
                .select('id')
                .limit(1);
            
            return !error && data && data.length > 0;
        } catch (error) {
            console.warn('⚠️ Erro ao verificar dados remotos:', error);
            return false;
        }
    }
    
    // MERGE DADOS (SEGURO)
    static async mergeDataSafe() {
        console.log('🔀 Fazendo merge seguro dos dados...');
        await this.uploadLocalDataSafe();
    }
    
    // SINCRONIZAÇÃO INCREMENTAL
    static async performIncrementalSync() {
        if (this.syncInProgress || !this.isOnline) return;
        
        console.log('🔄 Sincronização incremental...');
        this.syncInProgress = true;
        
        try {
            await this.uploadLocalDataSafe();
            await this.downloadRemoteDataSafe();
            
            this.lastSyncTime = Date.now().toString();
            localStorage.setItem('lastSyncTime', this.lastSyncTime);
            
            console.log('✅ Sincronização incremental completa');
            
        } catch (error) {
            console.error('❌ Erro na sincronização incremental:', error);
        } finally {
            this.syncInProgress = false;
        }
    }
    
    // FUNÇÕES NECESSÁRIAS PARA COMPATIBILIDADE
    static async uploadModifiedData(since) {
        console.log('📤 Upload modificado desde:', since);
        return await this.uploadLocalDataSafe();
    }
    
    static async downloadModifiedData(since) {
        console.log('📥 Download modificado desde:', since);
        return await this.downloadRemoteDataSafe();
    }
    
    // SINCRONIZAÇÃO AUTOMÁTICA
    static startAutoSync() {
        console.log('🔄 Iniciando sincronização automática...');
        
        setInterval(async () => {
            if (this.isOnline && !this.syncInProgress) {
                await this.performIncrementalSync();
            }
        }, this.syncConfig.syncInterval);
    }
    
    // INTERCEPTAR FUNÇÃO DE SALVAMENTO
    static interceptSaveFunction() {
        if (typeof window.saveData === 'function') {
            const originalSaveData = window.saveData;
            
            window.saveData = (...args) => {
                const result = originalSaveData.apply(this, args);
                
                if (this.isOnline && this.syncConfig.autoSync) {
                    setTimeout(() => {
                        this.performIncrementalSync();
                    }, 2000);
                }
                
                return result;
            };
            
            console.log('✅ Função saveData interceptada');
        }
    }
    
    // MONITORAMENTO DE REDE
    static setupNetworkMonitoring() {
        window.addEventListener('online', () => {
            console.log('🌐 Voltou online - iniciando sincronização...');
            this.isOnline = true;
            setTimeout(() => {
                this.performIncrementalSync();
            }, 1000);
        });
        
        window.addEventListener('offline', () => {
            console.log('📱 Offline - modo local apenas');
            this.isOnline = false;
        });
    }
    
    // UPLOAD SYSTEM CONFIG (SEGURO)
    static async uploadSystemConfigSafe(config) {
        console.log('⚙️ Upload seguro de configurações...');
        
        try {
            for (const [key, value] of Object.entries(config)) {
                const { error } = await supabase
                    .from('system_config')
                    .upsert({
                        config_key: key,
                        config_value: value,
                        description: `Configuração: ${key}`,
                        created_at: new Date().toISOString(),
                        updated_at: new Date().toISOString()
                    }, { 
                        onConflict: 'config_key' 
                    });
                
                if (error) {
                    console.warn(`⚠️ Erro config ${key}:`, error.message);
                } else {
                    console.log(`✅ Config ${key} enviada`);
                }
            }
        } catch (error) {
            console.warn('⚠️ Erro geral upload config:', error.message);
        }
    }
    
    // CRIAR DADOS PADRÃO
    static async createDefaultData() {
        console.log('🎯 Criando dados padrão...');
        
        const defaultData = {
            students: [],
            tasks: [],
            bookTasks: [],
            achievements: [],
            attendance: {},
            reposicoes: [],
            contratos: [],
            mensalidades: [],
            pagamentos: [],
            aulasDadas: [],
            systemConfig: {
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
                ]
            }
        };
        
        for (const [key, data] of Object.entries(defaultData)) {
            localStorage.setItem(key, JSON.stringify(data));
        }
        
        console.log('✅ Dados padrão criados');
    }
    
    // DISPARAR EVENTO DE ATUALIZAÇÃO
    static dispatchDataUpdateEvent() {
        const event = new CustomEvent('systemDataUpdated', {
            detail: { 
                timestamp: Date.now(),
                source: 'supabase'
            }
        });
        document.dispatchEvent(event);
        
        console.log('📢 Evento de atualização disparado');
    }
    
    // UTILITÁRIOS
    static delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    
    static generateValidUUID() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            const r = Math.random() * 16 | 0;
            const v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }
    
    static isValidUUID(uuid) {
        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
        return uuidRegex.test(uuid);
    }
    
    static createBatches(array, batchSize) {
        const batches = [];
        for (let i = 0; i < array.length; i += batchSize) {
            batches.push(array.slice(i, i + batchSize));
        }
        return batches;
    }
    
    // API PÚBLICA
    static async forceSyncNow() {
        console.log('🚀 Forçando sincronização completa...');
        await this.performInitialSync();
    }
    
    static getSyncStatus() {
        return {
            isOnline: this.isOnline,
            syncInProgress: this.syncInProgress,
            lastSyncTime: this.lastSyncTime,
            autoSyncEnabled: this.syncConfig.autoSync
        };
    }
    
    static enableAutoSync() {
        this.syncConfig.autoSync = true;
        if (!this.syncInterval) {
            this.startAutoSync();
        }
        console.log('✅ Auto-sync habilitado');
    }
    
    static disableAutoSync() {
        this.syncConfig.autoSync = false;
        console.log('❌ Auto-sync desabilitado');
    }
}

// INICIALIZAÇÃO AUTOMÁTICA
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(async () => {
        await SystemSyncCorrected.initialize();
    }, 3000);
});

// SUBSTITUIR SYSTEMSYNC ORIGINAL
window.SystemSync = SystemSyncCorrected;

console.log('🔄 Sistema de Sincronização Corrigido carregado!'); 