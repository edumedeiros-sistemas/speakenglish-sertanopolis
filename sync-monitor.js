// MONITOR DE SINCRONIZAÇÃO - INTERFACE VISUAL
// Indicadores de status e controles para o usuário

console.log('📊 Carregando Monitor de Sincronização...');

class SyncMonitor {
    static isVisible = false;
    static updateInterval = null;
    
    // CRIAR INTERFACE VISUAL
    static createMonitorUI() {
        const monitor = document.createElement('div');
        monitor.id = 'syncMonitor';
        monitor.className = 'sync-monitor';
        monitor.innerHTML = `
            <div class="sync-monitor-header">
                <h4>
                    <i class="fas fa-sync-alt"></i>
                    Status da Sincronização
                </h4>
                <button class="sync-toggle-btn" onclick="SyncMonitor.toggleMonitor()">
                    <i class="fas fa-chevron-down"></i>
                </button>
            </div>
            
            <div class="sync-monitor-content" style="display: none;">
                <!-- Status da Conexão -->
                <div class="sync-status-row">
                    <div class="sync-status-item">
                        <div class="status-icon" id="connectionStatus">
                            <i class="fas fa-wifi"></i>
                        </div>
                        <div class="status-text">
                            <span class="status-label">Conexão</span>
                            <span class="status-value" id="connectionText">Verificando...</span>
                        </div>
                    </div>
                    
                    <div class="sync-status-item">
                        <div class="status-icon" id="supabaseStatus">
                            <i class="fas fa-database"></i>
                        </div>
                        <div class="status-text">
                            <span class="status-label">Supabase</span>
                            <span class="status-value" id="supabaseText">Verificando...</span>
                        </div>
                    </div>
                </div>
                
                <!-- Status da Sincronização -->
                <div class="sync-status-row">
                    <div class="sync-status-item">
                        <div class="status-icon" id="syncStatus">
                            <i class="fas fa-sync"></i>
                        </div>
                        <div class="status-text">
                            <span class="status-label">Sincronização</span>
                            <span class="status-value" id="syncText">Aguardando...</span>
                        </div>
                    </div>
                    
                    <div class="sync-status-item">
                        <div class="status-icon" id="lastSyncStatus">
                            <i class="fas fa-clock"></i>
                        </div>
                        <div class="status-text">
                            <span class="status-label">Última Sync</span>
                            <span class="status-value" id="lastSyncText">Nunca</span>
                        </div>
                    </div>
                </div>
                
                <!-- Contadores de Dados -->
                <div class="sync-data-counters">
                    <div class="data-counter">
                        <span class="counter-label">👥 Alunos</span>
                        <span class="counter-value" id="studentsCount">0</span>
                    </div>
                    <div class="data-counter">
                        <span class="counter-label">📋 Tarefas</span>
                        <span class="counter-value" id="tasksCount">0</span>
                    </div>
                    <div class="data-counter">
                        <span class="counter-label">💰 Pagamentos</span>
                        <span class="counter-value" id="paymentsCount">0</span>
                    </div>
                    <div class="data-counter">
                        <span class="counter-label">📝 Contratos</span>
                        <span class="counter-value" id="contractsCount">0</span>
                    </div>
                </div>
                
                <!-- Controles -->
                <div class="sync-controls">
                    <button class="sync-btn sync-btn-primary" onclick="SyncMonitor.forceSyncNow()">
                        <i class="fas fa-sync"></i> Sincronizar Agora
                    </button>
                    <button class="sync-btn sync-btn-secondary" onclick="SyncMonitor.toggleAutoSync()">
                        <i class="fas fa-robot"></i> <span id="autoSyncToggleText">Auto-Sync</span>
                    </button>
                    <button class="sync-btn sync-btn-info" onclick="SyncMonitor.downloadData()">
                        <i class="fas fa-download"></i> Baixar Backup
                    </button>
                </div>
                
                <!-- Log de Atividades -->
                <div class="sync-log">
                    <div class="sync-log-header">
                        <span>Log de Atividades</span>
                        <button class="clear-log-btn" onclick="SyncMonitor.clearLog()">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                    <div class="sync-log-content" id="syncLogContent">
                        <!-- Logs aparecerão aqui -->
                    </div>
                </div>
            </div>
        `;
        
        // Adicionar estilos
        const styles = document.createElement('style');
        styles.textContent = `
            .sync-monitor {
                position: fixed;
                top: 20px;
                right: 20px;
                width: 350px;
                background: white;
                border-radius: 10px;
                box-shadow: 0 4px 20px rgba(0,0,0,0.15);
                z-index: 9999;
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                border: 1px solid #e0e0e0;
            }
            
            .sync-monitor-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 15px 20px;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                border-radius: 10px 10px 0 0;
                cursor: pointer;
            }
            
            .sync-monitor-header h4 {
                margin: 0;
                font-size: 16px;
                font-weight: 600;
            }
            
            .sync-toggle-btn {
                background: none;
                border: none;
                color: white;
                cursor: pointer;
                font-size: 16px;
                transition: transform 0.3s ease;
            }
            
            .sync-toggle-btn.expanded {
                transform: rotate(180deg);
            }
            
            .sync-monitor-content {
                padding: 20px;
            }
            
            .sync-status-row {
                display: flex;
                gap: 15px;
                margin-bottom: 15px;
            }
            
            .sync-status-item {
                flex: 1;
                display: flex;
                align-items: center;
                gap: 10px;
                padding: 10px;
                background: #f8f9fa;
                border-radius: 8px;
            }
            
            .status-icon {
                width: 30px;
                height: 30px;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 14px;
            }
            
            .status-icon.online { background: #28a745; color: white; }
            .status-icon.offline { background: #dc3545; color: white; }
            .status-icon.syncing { background: #007bff; color: white; animation: pulse 1.5s infinite; }
            .status-icon.warning { background: #ffc107; color: #333; }
            
            @keyframes pulse {
                0% { transform: scale(1); }
                50% { transform: scale(1.1); }
                100% { transform: scale(1); }
            }
            
            .status-text {
                display: flex;
                flex-direction: column;
            }
            
            .status-label {
                font-size: 12px;
                color: #666;
                font-weight: 500;
            }
            
            .status-value {
                font-size: 14px;
                font-weight: 600;
                color: #333;
            }
            
            .sync-data-counters {
                display: grid;
                grid-template-columns: repeat(2, 1fr);
                gap: 10px;
                margin-bottom: 20px;
            }
            
            .data-counter {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 8px 12px;
                background: #e9ecef;
                border-radius: 6px;
                font-size: 14px;
            }
            
            .counter-label {
                color: #666;
            }
            
            .counter-value {
                font-weight: 600;
                color: #333;
            }
            
            .sync-controls {
                display: flex;
                gap: 8px;
                margin-bottom: 20px;
                flex-wrap: wrap;
            }
            
            .sync-btn {
                flex: 1;
                padding: 8px 12px;
                border: none;
                border-radius: 6px;
                cursor: pointer;
                font-size: 12px;
                font-weight: 500;
                transition: all 0.2s ease;
                min-width: 100px;
            }
            
            .sync-btn-primary {
                background: #007bff;
                color: white;
            }
            
            .sync-btn-secondary {
                background: #6c757d;
                color: white;
            }
            
            .sync-btn-info {
                background: #17a2b8;
                color: white;
            }
            
            .sync-btn:hover {
                transform: translateY(-1px);
                box-shadow: 0 2px 8px rgba(0,0,0,0.15);
            }
            
            .sync-btn:disabled {
                opacity: 0.5;
                cursor: not-allowed;
                transform: none;
            }
            
            .sync-log {
                border-top: 1px solid #e0e0e0;
                padding-top: 15px;
            }
            
            .sync-log-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 10px;
                font-size: 14px;
                font-weight: 600;
                color: #333;
            }
            
            .clear-log-btn {
                background: none;
                border: none;
                color: #dc3545;
                cursor: pointer;
                font-size: 12px;
            }
            
            .sync-log-content {
                max-height: 150px;
                overflow-y: auto;
                font-size: 12px;
                line-height: 1.4;
            }
            
            .log-entry {
                padding: 5px 0;
                border-bottom: 1px solid #f0f0f0;
                display: flex;
                align-items: center;
                gap: 8px;
            }
            
            .log-entry:last-child {
                border-bottom: none;
            }
            
            .log-time {
                color: #999;
                font-size: 11px;
                white-space: nowrap;
            }
            
            .log-message {
                color: #333;
            }
            
            .log-success { color: #28a745; }
            .log-error { color: #dc3545; }
            .log-warning { color: #ffc107; }
            .log-info { color: #007bff; }
            
            /* Responsividade */
            @media (max-width: 768px) {
                .sync-monitor {
                    width: 320px;
                    right: 10px;
                    top: 10px;
                }
                
                .sync-controls {
                    flex-direction: column;
                }
                
                .sync-btn {
                    flex: none;
                }
            }
        `;
        
        document.head.appendChild(styles);
        document.body.appendChild(monitor);
        
        console.log('✅ Interface do monitor criada');
    }
    
    // INICIALIZAR MONITOR
    static initialize() {
        this.createMonitorUI();
        this.startUpdating();
        this.setupEventListeners();
        
        console.log('📊 Monitor de Sincronização inicializado');
    }
    
    // ATUALIZAR STATUS CONTINUAMENTE
    static startUpdating() {
        this.updateStatus();
        
        this.updateInterval = setInterval(() => {
            this.updateStatus();
        }, 2000);
    }
    
    // ATUALIZAR STATUS DA INTERFACE
    static updateStatus() {
        // Status da conexão
        const isOnline = navigator.onLine;
        const connectionIcon = document.getElementById('connectionStatus');
        const connectionText = document.getElementById('connectionText');
        
        if (connectionIcon && connectionText) {
            connectionIcon.className = `status-icon ${isOnline ? 'online' : 'offline'}`;
            connectionText.textContent = isOnline ? 'Online' : 'Offline';
        }
        
        // Status do Supabase
        const supabaseIcon = document.getElementById('supabaseStatus');
        const supabaseText = document.getElementById('supabaseText');
        
        if (supabaseIcon && supabaseText) {
            const hasSupabase = typeof supabase !== 'undefined' && supabase;
            supabaseIcon.className = `status-icon ${hasSupabase ? 'online' : 'offline'}`;
            supabaseText.textContent = hasSupabase ? 'Conectado' : 'Desconectado';
        }
        
        // Status da sincronização
        if (typeof SystemSync !== 'undefined') {
            const syncStatus = SystemSync.getSyncStatus();
            
            const syncIcon = document.getElementById('syncStatus');
            const syncText = document.getElementById('syncText');
            
            if (syncIcon && syncText) {
                if (syncStatus.syncInProgress) {
                    syncIcon.className = 'status-icon syncing';
                    syncText.textContent = 'Sincronizando...';
                } else if (syncStatus.autoSyncEnabled) {
                    syncIcon.className = 'status-icon online';
                    syncText.textContent = 'Auto-Sync Ativo';
                } else {
                    syncIcon.className = 'status-icon warning';
                    syncText.textContent = 'Manual';
                }
            }
            
            // Última sincronização
            const lastSyncText = document.getElementById('lastSyncText');
            if (lastSyncText) {
                const lastSync = parseInt(syncStatus.lastSyncTime);
                if (lastSync > 0) {
                    const timeAgo = this.formatTimeAgo(lastSync);
                    lastSyncText.textContent = timeAgo;
                } else {
                    lastSyncText.textContent = 'Nunca';
                }
            }
            
            // Atualizar botão auto-sync
            const autoSyncToggleText = document.getElementById('autoSyncToggleText');
            if (autoSyncToggleText) {
                autoSyncToggleText.textContent = syncStatus.autoSyncEnabled ? 'Desabilitar Auto' : 'Habilitar Auto';
            }
        }
        
        // Contadores de dados
        this.updateDataCounters();
    }
    
    // ATUALIZAR CONTADORES
    static updateDataCounters() {
        const counters = {
            studentsCount: JSON.parse(localStorage.getItem('students') || '[]').length,
            tasksCount: JSON.parse(localStorage.getItem('tasks') || '[]').length + 
                       JSON.parse(localStorage.getItem('bookTasks') || '[]').length,
            paymentsCount: JSON.parse(localStorage.getItem('pagamentos') || '[]').length,
            contractsCount: JSON.parse(localStorage.getItem('contratos') || '[]').length
        };
        
        for (const [id, count] of Object.entries(counters)) {
            const element = document.getElementById(id);
            if (element) {
                element.textContent = count;
            }
        }
    }
    
    // FORMATAR TEMPO ATRÁS
    static formatTimeAgo(timestamp) {
        const now = Date.now();
        const diff = now - timestamp;
        const seconds = Math.floor(diff / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);
        
        if (days > 0) return `${days}d atrás`;
        if (hours > 0) return `${hours}h atrás`;
        if (minutes > 0) return `${minutes}m atrás`;
        return `${seconds}s atrás`;
    }
    
    // TOGGLE MONITOR
    static toggleMonitor() {
        const content = document.querySelector('.sync-monitor-content');
        const toggleBtn = document.querySelector('.sync-toggle-btn');
        
        if (content && toggleBtn) {
            const isHidden = content.style.display === 'none';
            content.style.display = isHidden ? 'block' : 'none';
            toggleBtn.classList.toggle('expanded', isHidden);
            this.isVisible = isHidden;
        }
    }
    
    // FORÇAR SINCRONIZAÇÃO
    static async forceSyncNow() {
        this.addLogEntry('🚀 Sincronização forçada pelo usuário', 'info');
        
        const btn = event.target.closest('.sync-btn');
        if (btn) {
            btn.disabled = true;
            btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sincronizando...';
        }
        
        try {
            if (typeof SystemSync !== 'undefined') {
                await SystemSync.forceSyncNow();
                this.addLogEntry('✅ Sincronização completa!', 'success');
            } else {
                this.addLogEntry('❌ Sistema de sincronização não disponível', 'error');
            }
        } catch (error) {
            this.addLogEntry(`❌ Erro na sincronização: ${error.message}`, 'error');
        } finally {
            if (btn) {
                btn.disabled = false;
                btn.innerHTML = '<i class="fas fa-sync"></i> Sincronizar Agora';
            }
        }
    }
    
    // TOGGLE AUTO-SYNC
    static toggleAutoSync() {
        if (typeof SystemSync !== 'undefined') {
            const status = SystemSync.getSyncStatus();
            
            if (status.autoSyncEnabled) {
                SystemSync.disableAutoSync();
                this.addLogEntry('❌ Auto-sync desabilitado', 'warning');
            } else {
                SystemSync.enableAutoSync();
                this.addLogEntry('✅ Auto-sync habilitado', 'success');
            }
        }
    }
    
    // DOWNLOAD BACKUP
    static downloadData() {
        const data = {
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
            systemConfig: JSON.parse(localStorage.getItem('systemConfig') || '{}'),
            backupInfo: {
                timestamp: new Date().toISOString(),
                version: '3.0.0',
                source: 'SpeakEnglish System'
            }
        };
        
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `speakenglish-backup-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        this.addLogEntry('💾 Backup baixado com sucesso', 'success');
    }
    
    // ADICIONAR ENTRADA NO LOG
    static addLogEntry(message, type = 'info') {
        const logContent = document.getElementById('syncLogContent');
        if (!logContent) return;
        
        const entry = document.createElement('div');
        entry.className = 'log-entry';
        entry.innerHTML = `
            <span class="log-time">${new Date().toLocaleTimeString()}</span>
            <span class="log-message log-${type}">${message}</span>
        `;
        
        logContent.insertBefore(entry, logContent.firstChild);
        
        // Limitar a 20 entradas
        while (logContent.children.length > 20) {
            logContent.removeChild(logContent.lastChild);
        }
    }
    
    // LIMPAR LOG
    static clearLog() {
        const logContent = document.getElementById('syncLogContent');
        if (logContent) {
            logContent.innerHTML = '';
            this.addLogEntry('🗑️ Log limpo', 'info');
        }
    }
    
    // EVENT LISTENERS
    static setupEventListeners() {
        // Escutar eventos do sistema
        document.addEventListener('systemDataUpdated', (e) => {
            this.addLogEntry(`📊 Dados atualizados (${e.detail.source})`, 'success');
        });
        
        // Escutar mudanças de conectividade
        window.addEventListener('online', () => {
            this.addLogEntry('🌐 Conexão restaurada', 'success');
        });
        
        window.addEventListener('offline', () => {
            this.addLogEntry('📱 Conexão perdida - modo offline', 'warning');
        });
    }
    
    // DESTRUIR MONITOR
    static destroy() {
        if (this.updateInterval) {
            clearInterval(this.updateInterval);
            this.updateInterval = null;
        }
        
        const monitor = document.getElementById('syncMonitor');
        if (monitor) {
            monitor.remove();
        }
        
        console.log('🗑️ Monitor de sincronização removido');
    }
}

// INICIALIZAÇÃO AUTOMÁTICA
document.addEventListener('DOMContentLoaded', () => {
    // Aguardar um pouco para garantir que outros scripts carregaram
    setTimeout(() => {
        SyncMonitor.initialize();
    }, 4000);
});

// EXPORTAR PARA USO GLOBAL
window.SyncMonitor = SyncMonitor;

console.log('📊 Monitor de Sincronização carregado!'); 