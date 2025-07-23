-- SCHEMA FINAL DEFINITIVO - SPEAKENGLISH v3.0.1
-- SQL que resolve todos os problemas de schema identificados

-- ==================== CORREÇÃO COMPLETA ACHIEVEMENTS ====================
-- Verificar estrutura atual da tabela achievements
SELECT 'Verificando estrutura atual da tabela achievements...' as status;

-- Adicionar todas as colunas necessárias (case-sensitive)
ALTER TABLE achievements ADD COLUMN IF NOT EXISTS name VARCHAR(255);
ALTER TABLE achievements ADD COLUMN IF NOT EXISTS title VARCHAR(255);
ALTER TABLE achievements ADD COLUMN IF NOT EXISTS description TEXT;
ALTER TABLE achievements ADD COLUMN IF NOT EXISTS icon VARCHAR(100);
ALTER TABLE achievements ADD COLUMN IF NOT EXISTS points INTEGER DEFAULT 0;
ALTER TABLE achievements ADD COLUMN IF NOT EXISTS points_required INTEGER DEFAULT 0;
ALTER TABLE achievements ADD COLUMN IF NOT EXISTS category VARCHAR(100);
ALTER TABLE achievements ADD COLUMN IF NOT EXISTS condition VARCHAR(255) DEFAULT 'manual';
ALTER TABLE achievements ADD COLUMN IF NOT EXISTS target INTEGER DEFAULT 1;
ALTER TABLE achievements ADD COLUMN IF NOT EXISTS autocheck BOOLEAN DEFAULT true;  -- minúscula!
ALTER TABLE achievements ADD COLUMN IF NOT EXISTS createddate DATE DEFAULT CURRENT_DATE;  -- minúscula!
ALTER TABLE achievements ADD COLUMN IF NOT EXISTS student_id UUID;
ALTER TABLE achievements ADD COLUMN IF NOT EXISTS unlocked_at TIMESTAMP;
ALTER TABLE achievements ADD COLUMN IF NOT EXISTS created_at TIMESTAMP DEFAULT NOW();
ALTER TABLE achievements ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT NOW();

-- Atualizar dados existentes
UPDATE achievements SET 
    name = COALESCE(name, title, 'Achievement'),
    title = COALESCE(title, name, 'Achievement'),
    description = COALESCE(description, 'Conquista do sistema'),
    icon = COALESCE(icon, '🏆'),
    points = COALESCE(points, points_required, 0),
    points_required = COALESCE(points_required, points, 0),
    category = COALESCE(category, 'geral'),
    condition = COALESCE(condition, 'manual'),
    target = COALESCE(target, 1),
    autocheck = COALESCE(autocheck, true),
    createddate = COALESCE(createddate, CURRENT_DATE),
    created_at = COALESCE(created_at, NOW()),
    updated_at = COALESCE(updated_at, NOW())
WHERE name IS NULL OR title IS NULL OR autocheck IS NULL;

-- ==================== CORREÇÃO COMPLETA STUDENTS ====================
-- Adicionar todas as colunas necessárias na tabela students
ALTER TABLE students ADD COLUMN IF NOT EXISTS achievements JSONB DEFAULT '[]';
ALTER TABLE students ADD COLUMN IF NOT EXISTS completed_tasks JSONB DEFAULT '[]';
ALTER TABLE students ADD COLUMN IF NOT EXISTS completed_book_tasks JSONB DEFAULT '[]';
ALTER TABLE students ADD COLUMN IF NOT EXISTS points_history JSONB DEFAULT '[]';
ALTER TABLE students ADD COLUMN IF NOT EXISTS class_days JSONB DEFAULT '[]';
ALTER TABLE students ADD COLUMN IF NOT EXISTS attendance_count INTEGER DEFAULT 0;
ALTER TABLE students ADD COLUMN IF NOT EXISTS attendance_streak INTEGER DEFAULT 0;
ALTER TABLE students ADD COLUMN IF NOT EXISTS tasks_completed INTEGER DEFAULT 0;
ALTER TABLE students ADD COLUMN IF NOT EXISTS class_time TIME;
ALTER TABLE students ADD COLUMN IF NOT EXISTS join_date DATE DEFAULT CURRENT_DATE;
ALTER TABLE students ADD COLUMN IF NOT EXISTS phone VARCHAR(20);
ALTER TABLE students ADD COLUMN IF NOT EXISTS password VARCHAR(255) DEFAULT '123456';
ALTER TABLE students ADD COLUMN IF NOT EXISTS active BOOLEAN DEFAULT true;
ALTER TABLE students ADD COLUMN IF NOT EXISTS created_at TIMESTAMP DEFAULT NOW();
ALTER TABLE students ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT NOW();

-- Atualizar dados existentes dos students
UPDATE students SET 
    achievements = COALESCE(achievements, '[]'::jsonb),
    completed_tasks = COALESCE(completed_tasks, '[]'::jsonb),
    completed_book_tasks = COALESCE(completed_book_tasks, '[]'::jsonb),
    points_history = COALESCE(points_history, '[]'::jsonb),
    class_days = COALESCE(class_days, '[]'::jsonb),
    attendance_count = COALESCE(attendance_count, 0),
    attendance_streak = COALESCE(attendance_streak, 0),
    tasks_completed = COALESCE(tasks_completed, 0),
    join_date = COALESCE(join_date, CURRENT_DATE),
    password = COALESCE(password, '123456'),
    active = COALESCE(active, true),
    created_at = COALESCE(created_at, NOW()),
    updated_at = COALESCE(updated_at, NOW())
WHERE achievements IS NULL OR completed_tasks IS NULL OR active IS NULL;

-- ==================== CORREÇÃO COMPLETA CONTRACTS ====================
-- Adicionar colunas faltantes na tabela contracts
ALTER TABLE contracts ADD COLUMN IF NOT EXISTS created_at TIMESTAMP DEFAULT NOW();
ALTER TABLE contracts ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT NOW();

-- Atualizar dados existentes dos contracts
UPDATE contracts SET 
    created_at = COALESCE(created_at, NOW()),
    updated_at = COALESCE(updated_at, NOW())
WHERE created_at IS NULL;

-- ==================== CORREÇÃO OUTRAS TABELAS ====================
-- Adicionar updated_at onde necessário
ALTER TABLE tasks ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT NOW();
ALTER TABLE payments ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT NOW();

-- Atualizar dados existentes
UPDATE tasks SET updated_at = COALESCE(updated_at, NOW()) WHERE updated_at IS NULL;
UPDATE payments SET updated_at = COALESCE(updated_at, NOW()) WHERE updated_at IS NULL;

-- ==================== CRIAR TABELAS FALTANTES ====================

-- BOOK_TASKS
CREATE TABLE IF NOT EXISTS book_tasks (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    book_name VARCHAR(255) NOT NULL,
    book_page VARCHAR(100) NOT NULL,
    exercises TEXT NOT NULL,
    points INTEGER DEFAULT 10,
    description TEXT,
    due_date DATE,
    selected_students JSONB DEFAULT '[]',
    created_date DATE DEFAULT CURRENT_DATE,
    status VARCHAR(50) DEFAULT 'active',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- ATTENDANCE_RECORDS
CREATE TABLE IF NOT EXISTS attendance_records (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    student_id UUID,
    date DATE NOT NULL,
    status VARCHAR(50) DEFAULT 'present',
    points_awarded INTEGER DEFAULT 0,
    notes TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- MAKEUP_CLASSES (reposicoes)
CREATE TABLE IF NOT EXISTS makeup_classes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    student_emails JSONB NOT NULL,
    student_names JSONB NOT NULL,
    reason VARCHAR(500) NOT NULL,
    original_date DATE,
    makeup_date DATE,
    status VARCHAR(50) DEFAULT 'pending',
    notes TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- MONTHLY_FEES (mensalidades)
CREATE TABLE IF NOT EXISTS monthly_fees (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    student_email VARCHAR(255) NOT NULL,
    student_name VARCHAR(255) NOT NULL,
    reference_month VARCHAR(7) NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    due_date DATE NOT NULL,
    status VARCHAR(50) DEFAULT 'pendente',
    contract_id UUID,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- CLASSES_GIVEN (aulasDadas)
CREATE TABLE IF NOT EXISTS classes_given (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    teacher_name VARCHAR(255) NOT NULL,
    date DATE NOT NULL,
    time TIME NOT NULL,
    duration INTEGER DEFAULT 60,
    students_present JSONB DEFAULT '[]',
    topic VARCHAR(255),
    notes TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- SYSTEM_CONFIG
CREATE TABLE IF NOT EXISTS system_config (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    config_key VARCHAR(255) UNIQUE NOT NULL,
    config_value JSONB NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- ==================== FUNÇÃO PARA UPDATED_AT ====================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- ==================== APLICAR TRIGGERS ====================
-- Remover triggers existentes e recriar
DROP TRIGGER IF EXISTS update_students_updated_at ON students;
CREATE TRIGGER update_students_updated_at BEFORE UPDATE ON students FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_achievements_updated_at ON achievements;
CREATE TRIGGER update_achievements_updated_at BEFORE UPDATE ON achievements FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_tasks_updated_at ON tasks;
CREATE TRIGGER update_tasks_updated_at BEFORE UPDATE ON tasks FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_contracts_updated_at ON contracts;
CREATE TRIGGER update_contracts_updated_at BEFORE UPDATE ON contracts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_payments_updated_at ON payments;
CREATE TRIGGER update_payments_updated_at BEFORE UPDATE ON payments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_book_tasks_updated_at ON book_tasks;
CREATE TRIGGER update_book_tasks_updated_at BEFORE UPDATE ON book_tasks FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_attendance_records_updated_at ON attendance_records;
CREATE TRIGGER update_attendance_records_updated_at BEFORE UPDATE ON attendance_records FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_makeup_classes_updated_at ON makeup_classes;
CREATE TRIGGER update_makeup_classes_updated_at BEFORE UPDATE ON makeup_classes FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_monthly_fees_updated_at ON monthly_fees;
CREATE TRIGGER update_monthly_fees_updated_at BEFORE UPDATE ON monthly_fees FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_classes_given_updated_at ON classes_given;
CREATE TRIGGER update_classes_given_updated_at BEFORE UPDATE ON classes_given FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_system_config_updated_at ON system_config;
CREATE TRIGGER update_system_config_updated_at BEFORE UPDATE ON system_config FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ==================== INSERIR CONFIGURAÇÕES PADRÃO ====================
INSERT INTO system_config (config_key, config_value, description) VALUES
('pointsConfig', '{"presenca": 5, "tarefa": 10, "sequencia": 2, "bonus": 5}', 'Configurações de pontuação do sistema'),
('levelsConfig', '[
    {"name": "Bronze", "points": 0, "icon": "🥉", "class": "level-bronze"},
    {"name": "Prata", "points": 300, "icon": "🥈", "class": "level-prata"},
    {"name": "Ouro", "points": 700, "icon": "🥇", "class": "level-ouro"},
    {"name": "Platina", "points": 1200, "icon": "💎", "class": "level-platina"},
    {"name": "Diamante", "points": 1800, "icon": "💠", "class": "level-diamante"},
    {"name": "Mestre", "points": 2500, "icon": "👑", "class": "level-mestre"},
    {"name": "Lenda", "points": 3500, "icon": "🏆", "class": "level-lenda"}
]', 'Configurações de níveis e rankings'),
('systemVersion', '"3.0.1"', 'Versão atual do sistema'),
('syncEnabled', 'true', 'Sincronização automática habilitada'),
('lastBackup', null, 'Timestamp do último backup completo')
ON CONFLICT (config_key) DO UPDATE SET 
    config_value = EXCLUDED.config_value,
    description = EXCLUDED.description,
    updated_at = NOW();

-- ==================== INSERIR ACHIEVEMENTS PADRÃO ====================
INSERT INTO achievements (id, name, title, description, icon, points_required, category, condition, target, autocheck, createddate) VALUES
(gen_random_uuid(), 'Primeira Aula', 'Primeira Aula', 'Completou a primeira aula', '🎓', 0, 'inicio', 'attendance', 1, true, CURRENT_DATE),
(gen_random_uuid(), 'Primeira Tarefa', 'Primeira Tarefa', 'Completou a primeira tarefa', '📚', 10, 'tarefas', 'task_completion', 1, true, CURRENT_DATE),
(gen_random_uuid(), 'Sequência de 5', 'Sequência de 5', 'Frequência de 5 aulas seguidas', '🔥', 25, 'frequencia', 'attendance_streak', 5, true, CURRENT_DATE),
(gen_random_uuid(), 'Bronze', 'Bronze', 'Alcançou 100 pontos', '🥉', 100, 'pontos', 'points', 100, true, CURRENT_DATE),
(gen_random_uuid(), 'Prata', 'Prata', 'Alcançou 300 pontos', '🥈', 300, 'pontos', 'points', 300, true, CURRENT_DATE),
(gen_random_uuid(), 'Ouro', 'Ouro', 'Alcançou 700 pontos', '🥇', 700, 'pontos', 'points', 700, true, CURRENT_DATE),
(gen_random_uuid(), '10 Tarefas', '10 Tarefas', 'Completou 10 tarefas', '💯', 100, 'tarefas', 'task_completion', 10, true, CURRENT_DATE),
(gen_random_uuid(), 'Mês Perfeito', 'Mês Perfeito', 'Frequência perfeita no mês', '⭐', 50, 'frequencia', 'monthly_perfect', 1, true, CURRENT_DATE)
ON CONFLICT (id) DO NOTHING;

-- ==================== DESABILITAR RLS PARA DESENVOLVIMENTO ====================
ALTER TABLE students DISABLE ROW LEVEL SECURITY;
ALTER TABLE tasks DISABLE ROW LEVEL SECURITY;
ALTER TABLE book_tasks DISABLE ROW LEVEL SECURITY;
ALTER TABLE achievements DISABLE ROW LEVEL SECURITY;
ALTER TABLE attendance_records DISABLE ROW LEVEL SECURITY;
ALTER TABLE makeup_classes DISABLE ROW LEVEL SECURITY;
ALTER TABLE contracts DISABLE ROW LEVEL SECURITY;
ALTER TABLE monthly_fees DISABLE ROW LEVEL SECURITY;
ALTER TABLE payments DISABLE ROW LEVEL SECURITY;
ALTER TABLE classes_given DISABLE ROW LEVEL SECURITY;
ALTER TABLE system_config DISABLE ROW LEVEL SECURITY;

-- ==================== CRIAR ÍNDICES PARA PERFORMANCE ====================
CREATE INDEX IF NOT EXISTS idx_students_email ON students(email);
CREATE INDEX IF NOT EXISTS idx_students_active ON students(active);
CREATE INDEX IF NOT EXISTS idx_students_level ON students(level);
CREATE INDEX IF NOT EXISTS idx_tasks_status ON tasks(status);
CREATE INDEX IF NOT EXISTS idx_tasks_due_date ON tasks(due_date);
CREATE INDEX IF NOT EXISTS idx_achievements_category ON achievements(category);
CREATE INDEX IF NOT EXISTS idx_achievements_autocheck ON achievements(autocheck);
CREATE INDEX IF NOT EXISTS idx_attendance_date ON attendance_records(date);
CREATE INDEX IF NOT EXISTS idx_attendance_student ON attendance_records(student_id);
CREATE INDEX IF NOT EXISTS idx_payments_student ON payments(student_email);
CREATE INDEX IF NOT EXISTS idx_payments_reference ON payments(reference_month);
CREATE INDEX IF NOT EXISTS idx_contracts_student ON contracts(student_email);
CREATE INDEX IF NOT EXISTS idx_contracts_status ON contracts(status);
CREATE INDEX IF NOT EXISTS idx_monthly_fees_student ON monthly_fees(student_email);
CREATE INDEX IF NOT EXISTS idx_monthly_fees_status ON monthly_fees(status);
CREATE INDEX IF NOT EXISTS idx_system_config_key ON system_config(config_key);

-- ==================== VERIFICAÇÃO FINAL ====================
-- Verificar estrutura da tabela achievements
SELECT 
    'Estrutura final da tabela achievements:' as info,
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'achievements' 
ORDER BY ordinal_position;

-- Verificar estrutura da tabela students
SELECT 
    'Estrutura final da tabela students:' as info,
    COUNT(*) as total_colunas
FROM information_schema.columns 
WHERE table_name = 'students';

-- Mostrar todas as tabelas criadas
SELECT 
    'Tabelas do sistema:' as info,
    table_name
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN (
    'students', 'tasks', 'book_tasks', 'achievements', 
    'attendance_records', 'makeup_classes', 'contracts', 
    'monthly_fees', 'payments', 'classes_given', 'system_config'
)
ORDER BY table_name;

-- Verificar achievements inseridos
SELECT 
    'Achievements padrão inseridos:' as info,
    COUNT(*) as total_achievements
FROM achievements;

-- Verificar configurações inseridas
SELECT 
    'Configurações inseridas:' as info,
    COUNT(*) as total_configs
FROM system_config;

-- ==================== CONCLUÍDO ====================
SELECT '🎉 Schema final definitivo aplicado com sucesso!' as status;
SELECT '✅ Todas as correções de mapeamento implementadas!' as status;
SELECT '🚀 Sistema pronto para sincronização 100% funcional!' as status; 