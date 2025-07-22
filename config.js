// ==================== CONFIGURAÇÕES PERSONALIZÁVEIS ====================

// Configurações de Pontuação
window.APP_CONFIG = {
    points: {
        attendance: 5,          // Pontos por presença
        attendanceStreak: 2,    // Pontos extras por dia consecutivo
        taskBase: 10,           // Pontos padrão para tarefas
        achievementBonus: 5,    // Pontos extras por conquistas
        manualBonus: 1          // Multiplicador para pontos manuais
    },

    // Configurações de Interface
    interface: {
        schoolName: "SpeakEnglish",
        schoolTagline: "Sistema de Gestão e Gamificação de Alunos",
        schoolMotto: "Speak with Confidence",
        teacherName: "Prof. Diego Balzanello",
        teacherContact: {
            phone: "9186-1230",
            skype: "diego.balzanello",
            landline: "43. 3232-3791"
        },
        primaryColor: "#4169E1",  // Azul do logo
        successColor: "#4CAF50",
        warningColor: "#FF9800",
        dangerColor: "#FF4444",   // Vermelho do logo
        version: "3.1.1"
    },

    // Níveis de Inglês Personalizáveis (CEFR)
    levels: {
        'A1': 'A1 - Básico',
        'A2': 'A2 - Pré-Intermediário',
        'B1': 'B1 - Intermediário',
        'B2': 'B2 - Intermediário Superior',
        'C1': 'C1 - Avançado',
        'C2': 'C2 - Proficiente'
    },

    // Configurações de Gamificação
    gamification: {
        enableNotifications: true,
        enableSounds: false,
        achievementDelay: 2000,     // Delay para mostrar conquistas (ms)
        rankingAnimation: true,
        showStreakBonuses: true
    },

    // Mensagens Personalizáveis
    messages: {
        welcome: "Bem-vindo ao SpeakEnglish! 🎓",
        welcomeStudent: "Welcome to SpeakEnglish! Ready to learn online? 💻",
        achievementEarned: "🎉 Parabéns! Você conquistou:",
        attendanceMarked: "Presença online marcada com sucesso!",
        taskCompleted: "Tarefa completada! Keep going! 🚀",
        pointsAdded: "Pontos adicionados!",
        studentAdded: "Aluno adicionado à família SpeakEnglish Online!",
        taskCreated: "Tarefa criada com sucesso!",
        classMode: "Aulas Online - Particulares ou em Grupos",
        motivational: [
            "Speak with Confidence! 💬",
            "Every word counts! 📚",
            "You're making progress online! 🎯",
            "Keep speaking, keep growing! 🌱",
            "English fluency is your goal! 🏆",
            "Learning online, achieving worldwide! 🌍"
        ]
    },

    // Configurações Avançadas
    advanced: {
        autoSaveInterval: 30000,    // Auto-save a cada 30 segundos
        maxStudents: 100,          // Limite máximo de alunos
        maxTasks: 50,              // Limite máximo de tarefas ativas
        dataRetentionDays: 365,    // Quantos dias manter dados
        enableBackup: true,
        backupInterval: 300000     // Backup automático a cada 5 minutos
    },

    // Conquistas Personalizadas SpeakEnglish
    customAchievements: [
        {
            title: "Early Speaker",
            description: "Primeira pessoa a falar em inglês na aula",
            icon: "fas fa-microphone",
            condition: "custom",
            points: 5
        },
        {
            title: "Question Master",
            description: "Fazer 5 perguntas em inglês durante a aula",
            icon: "fas fa-question-circle",
            condition: "custom", 
            points: 10
        },
        {
            title: "Team Helper",
            description: "Ajudar um colega em inglês",
            icon: "fas fa-hands-helping",
            condition: "custom",
            points: 8
        },
        {
            title: "Conversation Starter",
            description: "Iniciar uma conversa em inglês",
            icon: "fas fa-comments",
            condition: "custom",
            points: 7
        },
        {
            title: "Vocabulary Collector",
            description: "Aprender 10 palavras novas em uma semana",
            icon: "fas fa-book-reader",
            condition: "custom",
            points: 15
        }
    ],

    // Categorias de Tarefas
    taskCategories: [
        { id: 'homework', name: 'Lição de Casa', color: '#2196F3', defaultPoints: 10 },
        { id: 'project', name: 'Projeto', color: '#9C27B0', defaultPoints: 25 },
        { id: 'presentation', name: 'Apresentação', color: '#FF9800', defaultPoints: 20 },
        { id: 'quiz', name: 'Quiz', color: '#4CAF50', defaultPoints: 15 },
        { id: 'reading', name: 'Leitura', color: '#795548', defaultPoints: 8 },
        { id: 'writing', name: 'Redação', color: '#607D8B', defaultPoints: 12 }
    ],

    // Configurações de Ranking
    ranking: {
        showTop: 10,               // Quantos alunos mostrar no ranking
        updateInterval: 5000,      // Atualizar ranking a cada 5 segundos
        highlightTop3: true,       // Destacar top 3
        showPercentageChange: true, // Mostrar mudança de posição
        enableSeasonalRanking: false // Ranking por período
    }
};

// Função para aplicar configurações personalizadas
function applyCustomConfig() {
    // Atualizar cores CSS
    const root = document.documentElement;
    root.style.setProperty('--primary-color', APP_CONFIG.interface.primaryColor);
    root.style.setProperty('--secondary-color', APP_CONFIG.interface.successColor);
    root.style.setProperty('--warning-color', APP_CONFIG.interface.warningColor);
    root.style.setProperty('--danger-color', APP_CONFIG.interface.dangerColor);

    // Título da escola removido - não aplicar ícone de graduação
    // const headerTitle = document.querySelector('.header h1');
    // if (headerTitle && APP_CONFIG.interface.schoolName !== "English Student Tracker") {
    //     headerTitle.innerHTML = `<i class="fas fa-graduation-cap"></i> ${APP_CONFIG.interface.schoolName}`;
    // }

    console.log('✅ Configurações personalizadas aplicadas!');
}

// Aplicar configurações quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', applyCustomConfig);

// Exportar configurações para uso global
window.POINTS_CONFIG = APP_CONFIG.points;
window.LEVELS = APP_CONFIG.levels;

// Funções auxiliares para configuração
window.CONFIG_HELPERS = {
    // Atualizar pontuação
    updatePoints: function(newPointsConfig) {
        Object.assign(APP_CONFIG.points, newPointsConfig);
        window.POINTS_CONFIG = APP_CONFIG.points;
        console.log('Configurações de pontuação atualizadas:', APP_CONFIG.points);
    },

    // Adicionar nível personalizado
    addLevel: function(key, name) {
        APP_CONFIG.levels[key] = name;
        window.LEVELS = APP_CONFIG.levels;
        console.log(`Nível "${name}" adicionado com sucesso!`);
    },

    // Exportar configurações atuais
    exportConfig: function() {
        const configBlob = new Blob([JSON.stringify(APP_CONFIG, null, 2)], 
            { type: 'application/json' });
        const url = URL.createObjectURL(configBlob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = 'english-tracker-config.json';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        console.log('Configurações exportadas!');
    },

    // Importar configurações
    importConfig: function(configData) {
        try {
            Object.assign(APP_CONFIG, configData);
            applyCustomConfig();
            console.log('Configurações importadas com sucesso!');
        } catch (error) {
            console.error('Erro ao importar configurações:', error);
        }
    }
};

console.log('📝 Arquivo de configuração carregado!'); 
