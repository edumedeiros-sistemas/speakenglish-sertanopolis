// CONFIGURAÇÃO SUPABASE PARA SISTEMA DE GESTÃO DE ALUNOS
// Integração com sistema atual existente

// Configuração do cliente Supabase
const SUPABASE_CONFIG = {
    url: 'https://hbucbipmbyclqbnnpdvj.supabase.co',
    anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhidWNiaXBtYnljbHFibm5wZHZqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMxMzYyMDUsImV4cCI6MjA2ODcxMjIwNX0.QvBfvOr7VOH_c9Pkw8-uDfHjYgkXQqIUHirL-el968A',
};

// Inicializar cliente Supabase
let supabase;

// Função para inicializar Supabase
function initSupabase() {
    if (typeof window !== 'undefined' && window.supabase) {
        supabase = window.supabase.createClient(SUPABASE_CONFIG.url, SUPABASE_CONFIG.anonKey);
        console.log('✅ Supabase inicializado!');
        return true;
    } else {
        console.warn('⚠️ Supabase client não encontrado. Incluindo via CDN...');
        loadSupabaseScript();
        return false;
    }
}

// Carregar Supabase via CDN se necessário
function loadSupabaseScript() {
    const script = document.createElement('script');
    script.src = 'https://unpkg.com/@supabase/supabase-js@2';
    script.onload = () => {
        console.log('✅ Supabase script carregado!');
        initSupabase();
    };
    document.head.appendChild(script);
}

// FUNÇÕES DE AUTENTICAÇÃO
class SupabaseAuth {
    // Login de aluno
    static async loginStudent(email, password) {
        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email: email,
                password: password
            });
            
            if (error) throw error;
            
            // Buscar dados do aluno
            const { data: studentData } = await supabase
                .from('students')
                .select('*')
                .eq('email', email)
                .single();
                
            return { success: true, user: data.user, student: studentData };
        } catch (error) {
            console.error('❌ Erro no login:', error);
            return { success: false, error: error.message };
        }
    }
    
    // Login de professor
    static async loginTeacher(email, password) {
        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email: email,
                password: password
            });
            
            if (error) throw error;
            
            // Buscar dados do professor
            const { data: teacherData } = await supabase
                .from('teachers')
                .select('*')
                .eq('email', email)
                .single();
                
            return { success: true, user: data.user, teacher: teacherData };
        } catch (error) {
            console.error('❌ Erro no login professor:', error);
            return { success: false, error: error.message };
        }
    }
    
    // Logout
    static async logout() {
        const { error } = await supabase.auth.signOut();
        if (!error) {
            localStorage.removeItem('currentUser');
            localStorage.removeItem('currentUserType');
        }
        return !error;
    }
    
    // Verificar se está logado
    static async getCurrentUser() {
        const { data: { user } } = await supabase.auth.getUser();
        return user;
    }
}

// FUNÇÕES PARA DADOS DOS ALUNOS
class SupabaseStudents {
    // Buscar todos os alunos
    static async getAll() {
        const { data, error } = await supabase
            .from('students')
            .select('*')
            .eq('active', true)
            .order('name');
            
        return error ? [] : data;
    }
    
    // Buscar aluno por ID
    static async getById(id) {
        const { data, error } = await supabase
            .from('students')
            .select('*')
            .eq('id', id)
            .single();
            
        return error ? null : data;
    }
    
    // Buscar dashboard do aluno
    static async getDashboard(studentId) {
        const { data, error } = await supabase
            .from('student_dashboard')
            .select('*')
            .eq('id', studentId)
            .single();
            
        return error ? null : data;
    }
    
    // Criar novo aluno
    static async create(studentData) {
        const { data, error } = await supabase
            .from('students')
            .insert([studentData])
            .select()
            .single();
            
        return error ? null : data;
    }
    
    // Atualizar aluno
    static async update(id, updates) {
        const { data, error } = await supabase
            .from('students')
            .update(updates)
            .eq('id', id)
            .select()
            .single();
            
        return error ? null : data;
    }
}

// FUNÇÕES PARA AULAS
class SupabaseClasses {
    // Buscar aulas do aluno
    static async getByStudent(studentId) {
        const { data, error } = await supabase
            .from('classes')
            .select(`
                *,
                teachers (name),
                attendance (status)
            `)
            .eq('student_id', studentId)
            .order('date', { ascending: false });
            
        return error ? [] : data;
    }
    
    // Buscar aulas do dia
    static async getToday() {
        const today = new Date().toISOString().split('T')[0];
        const { data, error } = await supabase
            .from('classes')
            .select(`
                *,
                students (name),
                teachers (name)
            `)
            .eq('date', today)
            .order('time');
            
        return error ? [] : data;
    }
}

// FUNÇÕES PARA TAREFAS
class SupabaseTasks {
    // Buscar tarefas do aluno
    static async getByStudent(studentId) {
        const { data, error } = await supabase
            .from('tasks')
            .select('*')
            .eq('student_id', studentId)
            .order('due_date');
            
        return error ? [] : data;
    }
    
    // Marcar tarefa como completa
    static async complete(taskId, points = 10) {
        const { data, error } = await supabase
            .from('tasks')
            .update({ 
                status: 'completed', 
                completed_at: new Date().toISOString(),
                points: points 
            })
            .eq('id', taskId)
            .select()
            .single();
            
        return error ? null : data;
    }
}

// FUNÇÕES PARA MENSALIDADES
class SupabasePayments {
    // Buscar mensalidades do aluno
    static async getByStudent(studentId) {
        const { data, error } = await supabase
            .from('payments')
            .select('*')
            .eq('student_id', studentId)
            .order('due_date', { ascending: false });
            
        return error ? [] : data;
    }
    
    // Mensalidades pendentes
    static async getPending() {
        const { data, error } = await supabase
            .from('payments')
            .select(`
                *,
                students (name, email)
            `)
            .eq('status', 'pending')
            .order('due_date');
            
        return error ? [] : data;
    }
}

// FUNÇÕES PARA RANKINGS
class SupabaseRankings {
    // Buscar ranking atual
    static async getCurrent() {
        const currentMonth = new Date().toISOString().slice(0, 7); // YYYY-MM
        const { data, error } = await supabase
            .from('rankings')
            .select(`
                *,
                students (name, level)
            `)
            .eq('month_year', currentMonth)
            .order('position');
            
        return error ? [] : data;
    }
    
    // Atualizar rankings
    static async update() {
        const { error } = await supabase.rpc('update_rankings');
        return !error;
    }
}

// INTEGRAÇÃO COM SISTEMA ATUAL
class SystemIntegration {
    // Sincronizar dados do localStorage com Supabase
    static async syncLocalData() {
        console.log('🔄 Sincronizando dados locais com Supabase...');
        
        try {
            // Buscar dados do localStorage
            const students = JSON.parse(localStorage.getItem('students') || '[]');
            const tasks = JSON.parse(localStorage.getItem('tasks') || '[]');
            
            // Sincronizar alunos
            for (const student of students) {
                const exists = await SupabaseStudents.getById(student.id);
                if (!exists) {
                    await SupabaseStudents.create({
                        id: student.id,
                        name: student.name,
                        email: student.email || `${student.name.toLowerCase().replace(/\s+/g, '')}@temp.com`,
                        level: student.level || 'A1',
                        points: student.points || 0
                    });
                }
            }
            
            console.log('✅ Sincronização completa!');
        } catch (error) {
            console.error('❌ Erro na sincronização:', error);
        }
    }
    
    // Atualizar sistema atual com dados do Supabase
    static async updateLocalFromSupabase() {
        try {
            const students = await SupabaseStudents.getAll();
            localStorage.setItem('students', JSON.stringify(students));
            
            // Disparar evento para atualizar interface
            window.dispatchEvent(new CustomEvent('dataUpdated', { detail: { students } }));
            
            console.log('✅ Dados locais atualizados do Supabase!');
        } catch (error) {
            console.error('❌ Erro ao atualizar dados locais:', error);
        }
    }
}

// AUTO-INICIALIZAÇÃO
document.addEventListener('DOMContentLoaded', () => {
    initSupabase();
    
    // Tentar sincronização após 2 segundos
    setTimeout(() => {
        if (supabase) {
            SystemIntegration.syncLocalData();
        }
    }, 2000);
});

// EXPORTAR PARA USO GLOBAL
window.SupabaseAuth = SupabaseAuth;
window.SupabaseStudents = SupabaseStudents;
window.SupabaseClasses = SupabaseClasses;
window.SupabaseTasks = SupabaseTasks;
window.SupabasePayments = SupabasePayments;
window.SupabaseRankings = SupabaseRankings;
window.SystemIntegration = SystemIntegration;

console.log('🚀 Supabase Config carregado!'); 