// SISTEMA DE SINCRONIZAÇÃO COMPLETO - SPEAKENGLISH
// Integração bidirecional entre localStorage e Supabase
// Mantém performance local + backup em nuvem

console.log('🔄 Carregando Sistema de Sincronização...');

class SystemSync {
    static isOnline = navigator.onLine;
    static syncInProgress = false;
    static lastSyncTime = localStorage.getItem('lastSyncTime') || '0';
    static conflictResolver = 'local'; // 'local', 'remote', 'merge'
    
    // CONFIGURAÇÕES DE SINCRONIZAÇÃO
    static syncConfig = {
        autoSync: true,
        syncInterval: 30000, // 30 segundos
        offlineMode: true,
        batchSize: 50, // Itens por batch
        retryAttempts: 3,
        retryDelay: 5000
    };
    
    // MAPEAMENTO DE DADOS
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
        console.log('🚀 Inicializando Sistema de Sincronização...');
        
        // Verificar conectividade
        this.setupNetworkMonitoring();
        
        // Aguardar Supabase
        await this.waitForSupabase();
        
        // Configurar sincronização automática
        if (this.syncConfig.autoSync) {
            this.startAutoSync();
        }
        
        // Sincronização inicial
        await this.performInitialSync();
        
        // Interceptar funções de salvamento
        this.interceptSaveFunction();
        
        console.log('✅ Sistema de Sincronização inicializado!');
    }
    
    // AGUARDAR SUPABASE ESTAR DISPONÍVEL
    static async waitForSupabase(maxAttempts = 10) {
        for (let i = 0; i < maxAttempts; i++) {
            if (typeof supabase !== 'undefined' && supabase) {
                return true;
            }
            console.log(`⏳ Aguardando Supabase... (${i + 1}/${maxAttempts})`);
            await this.delay(1000);
        }
        console.warn('⚠️ Supabase não disponível - modo offline apenas');
        return false;
    }
    
    // SINCRONIZAÇÃO INICIAL
    static async performInitialSync() {
        if (!this.isOnline || this.syncInProgress) return;
        
        console.log('🔄 Executando sincronização inicial...');
        this.syncInProgress = true;
        
        try {
            // 1. Verificar se existem dados locais
            const hasLocalData = this.hasLocalData();
            
            // 2. Verificar dados remotos
            const hasRemoteData = await this.hasRemoteData();
            
            if (!hasLocalData && !hasRemoteData) {
                // Primeiro uso - criar dados padrão
                await this.createDefaultData();
            } else if (hasLocalData && !hasRemoteData) {
                // Upload dados locais para Supabase
                await this.uploadLocalData();
            } else if (!hasLocalData && hasRemoteData) {
                // Download dados do Supabase
                await this.downloadRemoteData();
            } else {
                // Merge dados (prioridade local por padrão)
                await this.mergeData();
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
    
    // VERIFICAR SE HÁ DADOS LOCAIS
    static hasLocalData() {
        const students = JSON.parse(localStorage.getItem('students') || '[]');
        return students.length > 0;
    }
    
    // VERIFICAR SE HÁ DADOS REMOTOS
    static async hasRemoteData() {
        try {
            const { data, error } = await supabase
                .from('students')
                .select('id')
                .limit(1);
            
            return !error && data && data.length > 0;
        } catch (error) {
            return false;
        }
    }
    
    // UPLOAD DADOS LOCAIS PARA SUPABASE
    static async uploadLocalData() {
        console.log('⬆️ Fazendo upload dos dados locais...');
        
        for (const [localKey, remoteTable] of Object.entries(this.dataMapping)) {
            try {
                const localData = JSON.parse(localStorage.getItem(localKey) || '[]');
                if (localData.length > 0) {
                    await this.uploadTableData(remoteTable, localData, localKey);
                }
            } catch (error) {
                console.error(`❌ Erro no upload de ${localKey}:`, error);
            }
        }
    }
    
    // UPLOAD DE TABELA ESPECÍFICA
    static async uploadTableData(table, data, dataType) {
        console.log(`📤 Uploading ${dataType} (${data.length} items)...`);
        
        // Processar em batches
        const batches = this.createBatches(data, this.syncConfig.batchSize);
        
        for (const batch of batches) {
            try {
                const processedBatch = this.preprocessDataForUpload(batch, dataType);
                
                const { error } = await supabase
                    .from(table)
                    .upsert(processedBatch, { 
                        onConflict: 'id',
                        ignoreDuplicates: false 
                    });
                
                if (error) {
                    console.error(`❌ Erro no batch de ${table}:`, error);
                } else {
                    console.log(`✅ Batch de ${table} enviado (${batch.length} items)`);
                }
            } catch (error) {
                console.error(`❌ Erro crítico no upload de ${table}:`, error);
            }
        }
    }
    
    // PREPROCESSAR DADOS PARA UPLOAD
    static preprocessDataForUpload(data, dataType) {
        return data.map(item => {
            // Garantir que cada item tenha um ID
            if (!item.id) {
                item.id = this.generateId();
            }
            
            // Adicionar timestamps
            if (!item.created_at) {
                item.created_at = new Date().toISOString();
            }
            item.updated_at = new Date().toISOString();
            
            // Processamento específico por tipo
            switch (dataType) {
                case 'students':
                    return this.preprocessStudent(item);
                case 'tasks':
                    return this.preprocessTask(item);
                case 'bookTasks':
                    return this.preprocessBookTask(item);
                case 'attendance':
                    return this.preprocessAttendance(item);
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
    
    // PREPROCESSADORES ESPECÍFICOS
    static preprocessStudent(student) {
        return {
            id: student.id || this.generateId(),
            name: student.name,
            email: student.email || `${student.name.toLowerCase().replace(/\s+/g, '')}@temp.com`,
            phone: student.phone || null,
            password: student.password || '123456',
            level: student.level || 'A1',
            points: student.totalPoints || student.points || 0,
            attendance_count: student.attendanceCount || 0,
            attendance_streak: student.attendanceStreak || 0,
            tasks_completed: student.tasksCompleted || 0,
            class_time: student.classTime || null,
            class_days: student.classDays ? JSON.stringify(student.classDays) : null,
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
    
    static preprocessTask(task) {
        return {
            id: task.id || this.generateId(),
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
            id: task.id || this.generateId(),
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
    
    static preprocessAttendance(record) {
        return {
            id: record.id || this.generateId(),
            student_id: record.studentId,
            date: record.date,
            status: record.status || 'present',
            points_awarded: record.pointsAwarded || 0,
            created_at: record.created_at || new Date().toISOString(),
            updated_at: new Date().toISOString()
        };
    }
    
    static preprocessContract(contract) {
        return {
            id: contract.id || this.generateId(),
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
            id: fee.id || this.generateId(),
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
            id: payment.id || this.generateId(),
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
    
    // DOWNLOAD DADOS DO SUPABASE
    static async downloadRemoteData() {
        console.log('⬇️ Fazendo download dos dados remotos...');
        
        for (const [localKey, remoteTable] of Object.entries(this.dataMapping)) {
            try {
                await this.downloadTableData(remoteTable, localKey);
            } catch (error) {
                console.error(`❌ Erro no download de ${localKey}:`, error);
            }
        }
        
        // Disparar evento de atualização
        this.dispatchDataUpdateEvent();
    }
    
    // DOWNLOAD DE TABELA ESPECÍFICA
    static async downloadTableData(table, localKey) {
        console.log(`📥 Downloading ${localKey}...`);
        
        try {
            const { data, error } = await supabase
                .from(table)
                .select('*')
                .order('updated_at', { ascending: false });
            
            if (error) {
                console.error(`❌ Erro no download de ${table}:`, error);
                return;
            }
            
            // Processar dados para formato local
            const processedData = this.postprocessDataFromDownload(data, localKey);
            
            // Salvar no localStorage
            localStorage.setItem(localKey, JSON.stringify(processedData));
            
            console.log(`✅ ${localKey} baixado (${processedData.length} items)`);
            
        } catch (error) {
            console.error(`❌ Erro crítico no download de ${table}:`, error);
        }
    }
    
    // POSTPROCESSAR DADOS DO DOWNLOAD
    static postprocessDataFromDownload(data, dataType) {
        return data.map(item => {
            switch (dataType) {
                case 'students':
                    return this.postprocessStudent(item);
                case 'tasks':
                    return this.postprocessTask(item);
                case 'bookTasks':
                    return this.postprocessBookTask(item);
                case 'attendance':
                    return this.postprocessAttendance(item);
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
    
    // POSTPROCESSADORES ESPECÍFICOS
    static postprocessStudent(student) {
        return {
            id: student.id,
            name: student.name,
            email: student.email,
            phone: student.phone,
            password: student.password,
            level: student.level,
            totalPoints: student.points,
            attendanceCount: student.attendance_count,
            attendanceStreak: student.attendance_streak,
            tasksCompleted: student.tasks_completed,
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
            book: task.book_name, // Compatibilidade
            page: task.book_page, // Compatibilidade
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
    
    // SINCRONIZAÇÃO AUTOMÁTICA
    static startAutoSync() {
        console.log('🔄 Iniciando sincronização automática...');
        
        setInterval(async () => {
            if (this.isOnline && !this.syncInProgress) {
                await this.performIncrementalSync();
            }
        }, this.syncConfig.syncInterval);
    }
    
    // SINCRONIZAÇÃO INCREMENTAL
    static async performIncrementalSync() {
        if (this.syncInProgress) return;
        
        console.log('🔄 Sincronização incremental...');
        this.syncInProgress = true;
        
        try {
            // Sync apenas dados modificados desde último sync
            const lastSync = new Date(parseInt(this.lastSyncTime));
            
            // Upload modificações locais
            await this.uploadModifiedData(lastSync);
            
            // Download modificações remotas
            await this.downloadModifiedData(lastSync);
            
            this.lastSyncTime = Date.now().toString();
            localStorage.setItem('lastSyncTime', this.lastSyncTime);
            
        } catch (error) {
            console.error('❌ Erro na sincronização incremental:', error);
        } finally {
            this.syncInProgress = false;
        }
    }
    
    // INTERCEPTAR FUNÇÃO DE SALVAMENTO
    static interceptSaveFunction() {
        if (typeof window.saveData === 'function') {
            const originalSaveData = window.saveData;
            
            window.saveData = (...args) => {
                // Executar save original
                const result = originalSaveData.apply(this, args);
                
                // Trigger sync se online
                if (this.isOnline && this.syncConfig.autoSync) {
                    setTimeout(() => {
                        this.performIncrementalSync();
                    }, 1000);
                }
                
                return result;
            };
            
            console.log('✅ Função saveData interceptada para auto-sync');
        }
    }
    
    // MONITORAMENTO DE REDE
    static setupNetworkMonitoring() {
        window.addEventListener('online', () => {
            console.log('🌐 Voltou online - iniciando sincronização...');
            this.isOnline = true;
            this.performIncrementalSync();
        });
        
        window.addEventListener('offline', () => {
            console.log('📱 Offline - modo local apenas');
            this.isOnline = false;
        });
    }
    
    // UTILITÁRIOS
    static delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    
    static generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }
    
    static createBatches(array, batchSize) {
        const batches = [];
        for (let i = 0; i < array.length; i += batchSize) {
            batches.push(array.slice(i, i + batchSize));
        }
        return batches;
    }
    
    // CRIAR DADOS PADRÃO
    static async createDefaultData() {
        console.log('🎯 Criando dados padrão do sistema...');
        
        // Dados padrão mínimos
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
                    { name: 'Bronze', points: 0, icon: '', class: 'level-bronze' },
                    { name: 'Prata', points: 300, icon: '', class: 'level-prata' },
                    { name: 'Ouro', points: 700, icon: '', class: 'level-ouro' },
                    { name: 'Platina', points: 1200, icon: '', class: 'level-platina' },
                    { name: 'Diamante', points: 1800, icon: '', class: 'level-diamante' },
                    { name: 'Mestre', points: 2500, icon: '', class: 'level-mestre' },
                    { name: 'Lenda', points: 3500, icon: '', class: 'level-lenda' }
                ]
            }
        };
        
        // Salvar localmente
        for (const [key, data] of Object.entries(defaultData)) {
            localStorage.setItem(key, JSON.stringify(data));
        }
        
        console.log('✅ Dados padrão criados!');
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
        
        console.log('📢 Evento de atualização de dados disparado');
    }
    
    // MERGE DE DADOS
    static async mergeData() {
        console.log('🔀 Fazendo merge dos dados...');
        
        // Por enquanto, priorizar dados locais
        // Em versões futuras, implementar merge inteligente
        await this.uploadLocalData();
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
        this.startAutoSync();
        console.log('✅ Auto-sync habilitado');
    }
    
    static disableAutoSync() {
        this.syncConfig.autoSync = false;
        console.log('❌ Auto-sync desabilitado');
    }
}

// INICIALIZAÇÃO AUTOMÁTICA
document.addEventListener('DOMContentLoaded', () => {
    console.log('📱 DOM carregado - preparando sincronização...');
    
    // Aguardar um pouco para garantir que outros scripts carregaram
    setTimeout(async () => {
        await SystemSync.initialize();
    }, 3000);
});

// EXPORTAR PARA USO GLOBAL
window.SystemSync = SystemSync;

console.log('🔄 Sistema de Sincronização carregado!'); 