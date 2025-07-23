console.log('🎨 COLOR FIX: Corrigindo cores para ficarem idênticas ao professor');

// ===== CORRIGIR CORES PARA PROFESSOR =====
function fixStudentColors() {
    console.log('🎨 Aplicando cores EXATAS do professor...');
    
    // CSS MÍNIMO - apenas esconder azuis, não forçar cores
    const style = document.createElement('style');
    style.innerHTML = `
        /* APENAS esconder interfaces azuis */
        .student-interface,
        [style*="background: linear-gradient(135deg, #667eea"],
        [style*="background: linear-gradient(135deg, #4f46e5"] {
            display: none !important;
        }
        
        /* FUNDO BODY apenas */
        body {
            background-color: #f8f9fa !important;
        }
        
        /* DEIXAR TUDO MAIS usar styles.css NATURALMENTE */
        /* SEM !important nas cores dos elementos */
    `;
    document.head.appendChild(style);
    
    console.log('✅ Cores do professor aplicadas!');
}

// ===== GARANTIR ESTILO PROFESSOR =====
function ensureProfessorStyle() {
    console.log('👨‍🏫 Garantindo estilo EXATO do professor...');
    
    // Verificar se styles.css está carregado
    const hasStylesCSS = Array.from(document.styleSheets).some(sheet => 
        sheet.href && sheet.href.includes('styles.css')
    );
    
    if (!hasStylesCSS) {
        console.log('⚠️ styles.css não encontrado, carregando...');
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'styles.css';
        document.head.appendChild(link);
    }
    
    // Verificar se elementos têm as classes corretas
    const header = document.querySelector('.header');
    const tabs = document.querySelector('.tabs');
    const cards = document.querySelectorAll('.stat-card');
    
    console.log('🔍 Verificação de elementos:');
    console.log('  Header:', header ? '✅' : '❌');
    console.log('  Tabs:', tabs ? '✅' : '❌');
    console.log('  Cards:', cards.length > 0 ? `✅ (${cards.length})` : '❌');
    
    // Se elementos existem, as cores do styles.css devem aparecer automaticamente
    if (header && tabs && cards.length > 0) {
        console.log('✅ Elementos corretos encontrados - cores do professor devem aparecer!');
    } else {
        console.log('❌ Elementos faltando - interface precisa ser recriada');
    }
}

// ===== REMOVER FORÇAMENTO DE CORES =====
function removeForcedColors() {
    console.log('🧹 Removendo forçamento de cores...');
    
    // Remover qualquer style que force cores
    const forcedStyles = document.querySelectorAll('style');
    forcedStyles.forEach(style => {
        if (style.innerHTML.includes('!important') && 
           (style.innerHTML.includes('background-color') || style.innerHTML.includes('color'))) {
            console.log('🗑️ Removendo style forçado:', style);
            style.remove();
        }
    });
    
    // Aplicar CSS mínimo
    fixStudentColors();
    
    console.log('✅ Forçamento removido - cores naturais restauradas!');
}

// ===== COMANDO PRINCIPAL =====
window.colorFix = {
    fix: fixStudentColors,
    ensure: ensureProfessorStyle,
    removeForcedColors: removeForcedColors,
    
    complete: function() {
        console.log('🎨 CORREÇÃO COMPLETA DAS CORES...');
        removeForcedColors();
        ensureProfessorStyle();
        
        // Aguardar um pouco para CSS carregar
        setTimeout(() => {
            fixStudentColors();
            ensureProfessorStyle();
        }, 500);
        
        console.log('🎨 Cores corrigidas para ficarem IDÊNTICAS ao professor!');
    }
};

// ===== AUTO-EXECUÇÃO =====
if (localStorage.getItem('currentUserType') === 'aluno') {
    console.log('👨‍🎓 Aluno detectado - corrigindo cores automaticamente...');
    
    // Executar após outros scripts carregarem
    setTimeout(() => {
        colorFix.complete();
    }, 2000);
}

console.log('🎨 COLOR FIX carregado! Use colorFix.complete() se necessário.'); 