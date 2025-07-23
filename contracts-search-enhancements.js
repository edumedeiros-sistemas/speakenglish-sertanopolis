// ==================== MELHORIAS DO SISTEMA DE BUSCA DE CONTRATOS ====================

// Função para garantir que a busca de contratos funcione perfeitamente
window.enhanceContractsSearch = function() {
    console.log('🔧 Aplicando melhorias na busca de contratos...');
    
    // Aguardar o carregamento do DOM
    setTimeout(() => {
        const searchInput = document.getElementById('contractsSearchInput');
        const statusFilter = document.getElementById('statusFilter');
        const tipoFilter = document.getElementById('tipoFilter');
        const clearBtn = document.getElementById('clearContractSearchBtn');
        
        if (!searchInput) {
            console.log('⚠️ Input de busca de contratos não encontrado ainda');
            return;
        }
        
        console.log('✅ Elementos de busca encontrados, aplicando melhorias...');
        
        // Melhorar comportamento do input de busca
        searchInput.addEventListener('input', function(e) {
            const value = e.target.value;
            
            // Mostrar/ocultar botão de limpar
            if (clearBtn) {
                clearBtn.style.display = value.trim() || 
                    (statusFilter && statusFilter.value) || 
                    (tipoFilter && tipoFilter.value) ? 'flex' : 'none';
            }
            
            // Adicionar feedback visual durante a digitação
            e.target.style.borderColor = value.trim() ? '#4285f4' : '#e9ecef';
        });
        
        // Melhorar comportamento dos filtros
        if (statusFilter) {
            statusFilter.addEventListener('change', function(e) {
                if (clearBtn) {
                    clearBtn.style.display = e.target.value || 
                        (searchInput && searchInput.value.trim()) || 
                        (tipoFilter && tipoFilter.value) ? 'flex' : 'none';
                }
            });
        }
        
        if (tipoFilter) {
            tipoFilter.addEventListener('change', function(e) {
                if (clearBtn) {
                    clearBtn.style.display = e.target.value || 
                        (searchInput && searchInput.value.trim()) || 
                        (statusFilter && statusFilter.value) ? 'flex' : 'none';
                }
            });
        }
        
        // Melhorar comportamento do botão de limpar
        if (clearBtn) {
            clearBtn.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                
                // Limpar todos os campos
                if (searchInput) {
                    searchInput.value = '';
                    searchInput.style.borderColor = '#e9ecef';
                }
                if (statusFilter) statusFilter.value = '';
                if (tipoFilter) tipoFilter.value = '';
                
                // Ocultar botão
                clearBtn.style.display = 'none';
                
                // Executar busca vazia
                if (typeof window.filterContractsRealTime === 'function') {
                    window.filterContractsRealTime();
                }
                
                // Focar no input
                if (searchInput) searchInput.focus();
            });
        }
        
        // Adicionar atalhos de teclado
        if (searchInput) {
            searchInput.addEventListener('keydown', function(e) {
                // ESC para limpar
                if (e.key === 'Escape') {
                    if (clearBtn) clearBtn.click();
                }
                
                // Enter para garantir que a busca seja executada
                if (e.key === 'Enter') {
                    if (typeof window.filterContractsRealTime === 'function') {
                        window.filterContractsRealTime();
                    }
                }
            });
        }
        
        // Aplicar correções de CSS dinâmicas se necessário
        const searchHeader = document.querySelector('.contracts-search-header');
        if (searchHeader) {
            // Garantir que a header tenha o layout correto
            searchHeader.style.display = 'block';
            searchHeader.style.width = '100%';
            searchHeader.style.order = '1';
            searchHeader.style.flexShrink = '0';
        }
        
        // Garantir que os inputs tenham o padding correto
        if (searchInput) {
            searchInput.style.paddingLeft = '45px';
            searchInput.style.paddingRight = '45px';
        }
        
        console.log('✅ Melhorias da busca de contratos aplicadas com sucesso!');
        
    }, 500);
};

// Função para corrigir problemas visuais específicos
window.fixContractsSearchLayout = function() {
    const searchContainer = document.querySelector('.contracts-search-header');
    const inputGroup = document.querySelector('.contracts-search-header .search-input-group');
    const searchInput = document.getElementById('contractsSearchInput');
    const clearBtn = document.getElementById('clearContractSearchBtn');
    const searchIcon = document.querySelector('.contracts-search-header .search-input-group i.fa-search');
    
    if (!searchContainer) return;
    
    // Aplicar correções de layout
    if (inputGroup) {
        inputGroup.style.position = 'relative';
        inputGroup.style.display = 'flex';
        inputGroup.style.alignItems = 'center';
        inputGroup.style.flex = '1';
        inputGroup.style.minWidth = '300px';
        inputGroup.style.maxWidth = '500px';
    }
    
    if (searchInput) {
        searchInput.style.width = '100%';
        searchInput.style.paddingLeft = '45px';
        searchInput.style.paddingRight = '45px';
        searchInput.style.boxSizing = 'border-box';
    }
    
    if (searchIcon) {
        searchIcon.style.position = 'absolute';
        searchIcon.style.left = '15px';
        searchIcon.style.zIndex = '3';
        searchIcon.style.pointerEvents = 'none';
    }
    
    if (clearBtn) {
        clearBtn.style.position = 'absolute';
        clearBtn.style.right = '12px';
        clearBtn.style.zIndex = '4';
        clearBtn.style.display = 'flex';
        clearBtn.style.alignItems = 'center';
        clearBtn.style.justifyContent = 'center';
        clearBtn.style.width = '30px';
        clearBtn.style.height = '30px';
    }
    
    console.log('🎨 Layout da busca de contratos corrigido');
};

// Executar melhorias quando a página carregar
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(() => {
        enhanceContractsSearch();
        fixContractsSearchLayout();
    }, 1000);
});

// Executar melhorias quando contratos forem carregados
window.addEventListener('load', function() {
    setTimeout(() => {
        enhanceContractsSearch();
        fixContractsSearchLayout();
    }, 2000);
});

// Observador para garantir que as melhorias sejam aplicadas quando elementos aparecerem
const observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
        if (mutation.type === 'childList') {
            mutation.addedNodes.forEach(function(node) {
                if (node.nodeType === 1) { // Element node
                    if (node.id === 'contractsSearchInput' || 
                        node.classList?.contains('contracts-search-header') ||
                        node.querySelector?.('#contractsSearchInput')) {
                        setTimeout(() => {
                            enhanceContractsSearch();
                            fixContractsSearchLayout();
                        }, 100);
                    }
                }
            });
        }
    });
});

// Iniciar observador
observer.observe(document.body, {
    childList: true,
    subtree: true
});

console.log('🔧 Sistema de melhorias da busca de contratos carregado');

// ==================== FIM DAS MELHORIAS ==================== 