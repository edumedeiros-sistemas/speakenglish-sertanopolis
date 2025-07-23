console.log('🔧 Corrigindo layout das atividades...');

function fixActivityLayout() {
    // Aplicar CSS correto para as atividades
    const style = document.createElement('style');
    style.innerHTML = `
        /* CORREÇÃO LAYOUT ATIVIDADES */
        .activity-item {
            display: flex !important;
            align-items: flex-start !important;
            padding: 16px 0 !important;
            border-bottom: 1px solid #e9ecef !important;
            margin: 0 !important;
            width: 100% !important;
            box-sizing: border-box !important;
            clear: both !important;
        }
        
        .activity-item:last-child {
            border-bottom: none !important;
        }
        
        .activity-icon {
            margin-right: 16px !important;
            width: 50px !important;
            min-width: 50px !important;
            text-align: center !important;
            flex-shrink: 0 !important;
            padding-top: 3px !important;
            position: relative !important;
        }
        
        .activity-icon i {
            font-size: 1.4em !important;
            line-height: 1 !important;
        }
        
        .activity-content {
            flex: 1 !important;
            min-width: 0 !important;
            overflow: hidden !important;
            position: relative !important;
        }
        
        .activity-content h4 {
            margin: 0 0 8px 0 !important;
            font-size: 15px !important;
            font-weight: 600 !important;
            color: #333 !important;
            line-height: 1.3 !important;
            word-wrap: break-word !important;
        }
        
        .activity-content p {
            margin: 0 0 6px 0 !important;
            font-size: 14px !important;
            color: #666 !important;
            line-height: 1.3 !important;
            word-wrap: break-word !important;
        }
        
        .activity-content small {
            font-size: 12px !important;
            color: #999 !important;
            display: block !important;
            margin-top: 4px !important;
            line-height: 1.2 !important;
            clear: both !important;
        }
        
        /* Garantir que o card tenha espaço adequado */
        .card-body {
            padding: 20px !important;
            overflow: hidden !important;
        }
    `;
    
    document.head.appendChild(style);
    console.log('✅ CSS de correção aplicado!');
}

// Aplicar correção quando aluno estiver logado
if (localStorage.getItem('currentUserType') === 'aluno') {
    // Aplicar imediatamente
    fixActivityLayout();
    
    // Aplicar após outros scripts carregarem
    setTimeout(() => {
        fixActivityLayout();
    }, 2000);
    
    // Verificar e corrigir periodicamente
    setInterval(() => {
        const activityItems = document.querySelectorAll('.activity-item');
        if (activityItems.length > 0) {
            fixActivityLayout();
        }
    }, 5000);
}

// Comando manual
window.fixActivityLayout = fixActivityLayout;

console.log('🔧 Fix Activity Layout carregado!'); 