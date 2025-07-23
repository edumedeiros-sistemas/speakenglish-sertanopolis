console.log('🎨 Forçando estilos das abas do aluno...');

function forceStudentTabsStyles() {
    // Criar style tag com todos os estilos necessários
    const style = document.createElement('style');
    style.innerHTML = `
        /* ESTILOS FORÇADOS PARA AS ABAS DO ALUNO */
        
        /* ===== RANKINGS ===== */
        .ranking-item {
            display: flex !important;
            align-items: center !important;
            padding: 12px 0 !important;
            border-bottom: 1px solid #eee !important;
        }
        
        .ranking-item:last-child {
            border-bottom: none !important;
        }
        
        .ranking-item.highlight {
            background-color: #fff3cd !important;
            border-radius: 8px !important;
            padding: 12px !important;
            margin-bottom: 8px !important;
            border: 2px solid #ffc107 !important;
        }
        
        .ranking-item .rank {
            font-weight: bold !important;
            font-size: 16px !important;
            width: 40px !important;
            color: #4169E1 !important;
        }
        
        .ranking-item .name {
            flex: 1 !important;
            font-weight: 600 !important;
            color: #333 !important;
        }
        
        .ranking-item .points {
            font-weight: 600 !important;
            color: #666 !important;
            margin-right: 10px !important;
        }
        
        .ranking-item .badge {
            padding: 4px 8px !important;
            border-radius: 12px !important;
            font-size: 12px !important;
            font-weight: 600 !important;
        }
        
        .badge.you {
            background-color: #4169E1 !important;
            color: white !important;
        }
        
        .badge.gold {
            background-color: #ffc107 !important;
            color: #333 !important;
        }
        
        .badge.silver {
            background-color: #6c757d !important;
            color: white !important;
        }
        
        .badge.bronze {
            background-color: #fd7e14 !important;
            color: white !important;
        }
        
        .evolution-item {
            display: flex !important;
            align-items: center !important;
            padding: 10px 0 !important;
            border-bottom: 1px solid #eee !important;
        }
        
        .evolution-item:last-child {
            border-bottom: none !important;
        }
        
        .evolution-item.current {
            background-color: #e7f3ff !important;
            border-radius: 6px !important;
            padding: 10px !important;
            border: 1px solid #4169E1 !important;
        }
        
        .evolution-item .month {
            width: 80px !important;
            font-weight: 600 !important;
        }
        
        .evolution-item .position {
            flex: 1 !important;
            color: #666 !important;
        }
        
        .evolution-item .change {
            padding: 2px 6px !important;
            border-radius: 4px !important;
            font-size: 12px !important;
            font-weight: 600 !important;
        }
        
        .change.up {
            background-color: #d4edda !important;
            color: #155724 !important;
        }
        
        .change.down {
            background-color: #f8d7da !important;
            color: #721c24 !important;
        }
        
        /* ===== PRESENÇAS ===== */
        .attendance-item {
            display: flex !important;
            align-items: center !important;
            padding: 12px 0 !important;
            border-bottom: 1px solid #eee !important;
        }
        
        .attendance-item:last-child {
            border-bottom: none !important;
        }
        
        .attendance-item .date {
            width: 80px !important;
            font-weight: 600 !important;
            color: #666 !important;
            font-size: 14px !important;
        }
        
        .attendance-item .class-info {
            flex: 1 !important;
            margin-left: 15px !important;
        }
        
        .attendance-item .class-info h4 {
            margin: 0 0 4px 0 !important;
            font-size: 15px !important;
            color: #333 !important;
        }
        
        .attendance-item .class-info p {
            margin: 0 !important;
            font-size: 13px !important;
            color: #666 !important;
        }
        
        .attendance-item .status {
            padding: 4px 12px !important;
            border-radius: 20px !important;
            font-size: 12px !important;
            font-weight: 600 !important;
        }
        
        .status.present {
            background-color: #d4edda !important;
            color: #155724 !important;
        }
        
        .status.absent {
            background-color: #f8d7da !important;
            color: #721c24 !important;
        }
        
        .frequency-item {
            display: flex !important;
            align-items: center !important;
            padding: 12px 0 !important;
            border-bottom: 1px solid #eee !important;
        }
        
        .frequency-item:last-child {
            border-bottom: none !important;
        }
        
        .frequency-item.current {
            background-color: #e7f3ff !important;
            border-radius: 6px !important;
            padding: 12px !important;
            border: 1px solid #4169E1 !important;
        }
        
        .frequency-item .month {
            width: 80px !important;
            font-weight: 600 !important;
        }
        
        .frequency-bar {
            flex: 1 !important;
            height: 8px !important;
            background-color: #e9ecef !important;
            border-radius: 4px !important;
            margin: 0 15px !important;
            position: relative !important;
        }
        
        .frequency-bar .fill {
            height: 100% !important;
            background-color: #28a745 !important;
            border-radius: 4px !important;
            transition: width 0.3s ease !important;
        }
        
        .frequency-item .percentage {
            font-weight: 600 !important;
            color: #28a745 !important;
            width: 50px !important;
            text-align: right !important;
        }
        
        /* ===== TAREFAS ===== */
        .task-item {
            display: flex !important;
            align-items: center !important;
            padding: 15px 0 !important;
            border-bottom: 1px solid #eee !important;
        }
        
        .task-item:last-child {
            border-bottom: none !important;
        }
        
        .task-item.urgent {
            background-color: #fff5f5 !important;
            border-radius: 8px !important;
            padding: 15px !important;
            border-left: 4px solid #dc3545 !important;
            margin-bottom: 8px !important;
        }
        
        .task-item.completed {
            opacity: 0.7 !important;
        }
        
        .task-item .task-info {
            flex: 1 !important;
        }
        
        .task-item .task-info h4 {
            margin: 0 0 6px 0 !important;
            font-size: 15px !important;
            color: #333 !important;
        }
        
        .task-item .task-info p {
            margin: 0 0 4px 0 !important;
            font-size: 14px !important;
            color: #666 !important;
        }
        
        .task-item .task-info small {
            font-size: 12px !important;
            color: #999 !important;
        }
        
        .task-item .task-actions,
        .task-item .task-score {
            margin-left: 15px !important;
        }
        
        .task-score .score {
            background-color: #28a745 !important;
            color: white !important;
            padding: 4px 8px !important;
            border-radius: 12px !important;
            font-size: 12px !important;
            font-weight: 600 !important;
        }
        
        /* ===== FINANCEIRO ===== */
        .payment-item {
            display: flex !important;
            align-items: center !important;
            padding: 15px 0 !important;
            border-bottom: 1px solid #eee !important;
        }
        
        .payment-item:last-child {
            border-bottom: none !important;
        }
        
        .payment-item.current {
            background-color: #fff3cd !important;
            border-radius: 8px !important;
            padding: 15px !important;
            border-left: 4px solid #ffc107 !important;
            margin-bottom: 8px !important;
        }
        
        .payment-item .payment-info {
            flex: 1 !important;
        }
        
        .payment-item .payment-info h4 {
            margin: 0 0 4px 0 !important;
            font-size: 15px !important;
            color: #333 !important;
        }
        
        .payment-item .payment-info p {
            margin: 0 !important;
            font-size: 13px !important;
            color: #666 !important;
        }
        
        .payment-item .payment-amount {
            font-weight: 600 !important;
            font-size: 16px !important;
            color: #333 !important;
            margin: 0 15px !important;
        }
        
        .payment-item .payment-status {
            padding: 4px 12px !important;
            border-radius: 20px !important;
            font-size: 12px !important;
            font-weight: 600 !important;
            margin: 0 15px !important;
        }
        
        .payment-status.pending {
            background-color: #fff3cd !important;
            color: #856404 !important;
        }
        
        .payment-status.paid {
            background-color: #d4edda !important;
            color: #155724 !important;
        }
        
        .payment-summary {
            margin-bottom: 20px !important;
        }
        
        .summary-item {
            display: flex !important;
            justify-content: space-between !important;
            padding: 8px 0 !important;
            border-bottom: 1px solid #eee !important;
        }
        
        .summary-item:last-child {
            border-bottom: none !important;
        }
        
        .summary-item .label {
            color: #666 !important;
        }
        
        .summary-item .value {
            font-weight: 600 !important;
            color: #333 !important;
        }
        
        .payment-methods {
            margin-top: 20px !important;
        }
        
        .payment-methods h4 {
            margin-bottom: 15px !important;
            color: #333 !important;
        }
        
        .method-item {
            display: flex !important;
            align-items: center !important;
            padding: 8px 0 !important;
            color: #666 !important;
        }
        
        .method-item i {
            margin-right: 10px !important;
            color: #4169E1 !important;
            width: 20px !important;
        }
        
        /* ===== PERFIL ===== */
        .profile-section {
            display: flex !important;
            align-items: center !important;
            margin-bottom: 30px !important;
        }
        
        .profile-avatar {
            width: 80px !important;
            height: 80px !important;
            border-radius: 50% !important;
            background-color: #4169E1 !important;
            color: white !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            font-size: 32px !important;
            font-weight: bold !important;
            margin-right: 20px !important;
        }
        
        .profile-info h3 {
            margin: 0 0 8px 0 !important;
            color: #333 !important;
        }
        
        .profile-info .email {
            color: #666 !important;
            margin-bottom: 4px !important;
        }
        
        .profile-info .level,
        .profile-info .points {
            margin: 2px 0 !important;
            color: #666 !important;
        }
        
        .info-grid {
            display: grid !important;
            grid-template-columns: 1fr 1fr !important;
            gap: 15px !important;
            margin-top: 20px !important;
        }
        
        .info-item {
            display: flex !important;
            flex-direction: column !important;
        }
        
        .info-item label {
            font-size: 12px !important;
            color: #999 !important;
            margin-bottom: 4px !important;
            text-transform: uppercase !important;
            font-weight: 600 !important;
        }
        
        .info-item span {
            color: #333 !important;
            font-weight: 500 !important;
        }
        
        .settings-section {
            margin-bottom: 30px !important;
        }
        
        .settings-section h4 {
            margin-bottom: 15px !important;
            color: #333 !important;
            font-size: 16px !important;
        }
        
        .setting-item {
            display: flex !important;
            align-items: center !important;
            justify-content: space-between !important;
            padding: 12px 0 !important;
            border-bottom: 1px solid #eee !important;
        }
        
        .setting-item:last-child {
            border-bottom: none !important;
        }
        
        /* Switch Toggle */
        .switch {
            position: relative !important;
            display: inline-block !important;
            width: 50px !important;
            height: 24px !important;
        }
        
        .switch input {
            opacity: 0 !important;
            width: 0 !important;
            height: 0 !important;
        }
        
        .slider {
            position: absolute !important;
            cursor: pointer !important;
            top: 0 !important;
            left: 0 !important;
            right: 0 !important;
            bottom: 0 !important;
            background-color: #ccc !important;
            transition: .4s !important;
            border-radius: 24px !important;
        }
        
        .slider:before {
            position: absolute !important;
            content: "" !important;
            height: 18px !important;
            width: 18px !important;
            left: 3px !important;
            bottom: 3px !important;
            background-color: white !important;
            transition: .4s !important;
            border-radius: 50% !important;
        }
        
        input:checked + .slider {
            background-color: #4169E1 !important;
        }
        
        input:checked + .slider:before {
            transform: translateX(26px) !important;
        }
        
        .profile-actions {
            margin-top: 30px !important;
            display: flex !important;
            gap: 10px !important;
        }
    `;
    
    document.head.appendChild(style);
    console.log('✅ Estilos das abas forçados!');
}

// Aplicar estilos quando aluno estiver logado
if (localStorage.getItem('currentUserType') === 'aluno') {
    // Aplicar imediatamente
    forceStudentTabsStyles();
    
    // Aplicar após mudança de aba
    const originalShowTab = window.showTabPersistent;
    if (originalShowTab) {
        window.showTabPersistent = function(...args) {
            const result = originalShowTab.apply(this, args);
            setTimeout(() => {
                forceStudentTabsStyles();
            }, 100);
            return result;
        };
    }
    
    // Aplicar periodicamente para garantir
    setInterval(() => {
        if (localStorage.getItem('currentUserType') === 'aluno') {
            forceStudentTabsStyles();
        }
    }, 5000);
}

// Comando manual
window.forceStudentTabsStyles = forceStudentTabsStyles;

console.log('🎨 Force Student Tabs Styles carregado!'); 