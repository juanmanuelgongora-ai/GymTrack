-- =====================================================
-- GymTrack - Script de Datos Iniciales
-- Proyecto Final - Desarrollo de Software III
-- =====================================================

CREATE DATABASE IF NOT EXISTS gymtrack_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE gymtrack_db;

-- =====================================================
-- USUARIOS BASE (admin + entrenadores + clientes)
-- Password para todos: 'password123' (hash bcrypt Laravel)
-- =====================================================

INSERT INTO `users` (`id`, `name`, `email`, `email_verified_at`, `password`, `rol`, `activo`, `created_at`, `updated_at`) VALUES
(1, 'Administrador GymTrack', 'admin@gymtrack.com',    NOW(), '$2y$12$LjxBMVT5NLXH4lA8A2bw7OmMGqH9jkzPqQ6sL1eFdGnXrYtqN2Amu', 'admin',       1, NOW(), NOW()),
(2, 'Carlos Mendoza',        'carlos@gymtrack.com',    NOW(), '$2y$12$LjxBMVT5NLXH4lA8A2bw7OmMGqH9jkzPqQ6sL1eFdGnXrYtqN2Amu', 'entrenador',  1, NOW(), NOW()),
(3, 'Laura Rodríguez',       'laura@gymtrack.com',     NOW(), '$2y$12$LjxBMVT5NLXH4lA8A2bw7OmMGqH9jkzPqQ6sL1eFdGnXrYtqN2Amu', 'entrenador',  1, NOW(), NOW()),
(4, 'Juan García',           'juan@gymtrack.com',      NOW(), '$2y$12$LjxBMVT5NLXH4lA8A2bw7OmMGqH9jkzPqQ6sL1eFdGnXrYtqN2Amu', 'cliente',     1, NOW(), NOW()),
(5, 'María López',           'maria@gymtrack.com',     NOW(), '$2y$12$LjxBMVT5NLXH4lA8A2bw7OmMGqH9jkzPqQ6sL1eFdGnXrYtqN2Amu', 'cliente',     1, NOW(), NOW()),
(6, 'Pedro Sánchez',         'pedro@gymtrack.com',     NOW(), '$2y$12$LjxBMVT5NLXH4lA8A2bw7OmMGqH9jkzPqQ6sL1eFdGnXrYtqN2Amu', 'cliente',     1, NOW(), NOW());

-- =====================================================
-- ENTRENADORES (FK → users)
-- =====================================================

INSERT INTO `entrenadors` (`id`, `user_id`, `especialidad`, `nivel`, `bio`, `estado`, `created_at`, `updated_at`) VALUES
(1, 2, 'Musculación y Fuerza',       'Avanzado', 'Especialista en hipertrofia y powerlifting con 8 años de experiencia. Certificado NSCA-CPT.', 'aprobado', NOW(), NOW()),
(2, 3, 'Cardio y Entrenamiento Funcional', 'Intermedio', 'Entrenadora personal certificada en HIIT, yoga y movilidad funcional. Especialista en pérdida de peso.', 'aprobado', NOW(), NOW());

-- =====================================================
-- CLIENTES (FK → users)
-- =====================================================

INSERT INTO `clientes` (`id`, `user_id`, `nombre`, `apellido`, `telefono`, `fecha_nacimiento`, `genero`, `peso`, `estatura`, `nivel_actividad`, `objetivo_principal`, `condiciones_salud`, `lesiones`, `vencimiento_membresia`, `created_at`, `updated_at`) VALUES
(1, 4, 'Juan',  'García',   '3001234567', '1998-05-14', 'M', 75.0, 178, '3-4 veces',       'Ganar masa muscular',    'Ninguna', 'No',              DATE_ADD(NOW(), INTERVAL 1 MONTH), NOW(), NOW()),
(2, 5, 'María', 'López',    '3109876543', '2000-11-22', 'F', 65.0, 162, '2-3 veces',       'Perder peso',            'Ninguna', 'No',              DATE_ADD(NOW(), INTERVAL 1 MONTH), NOW(), NOW()),
(3, 6, 'Pedro', 'Sánchez',  '3156789012', '1995-03-08', 'M', 80.0, 175, '5 días por semana','Mejorar resistencia y condición física', 'Ninguna', 'Dolor leve en rodilla derecha', DATE_ADD(NOW(), INTERVAL 2 MONTH), NOW(), NOW());

-- =====================================================
-- RUTINAS (FK → users)
-- =====================================================

INSERT INTO `rutinas` (`user_id`, `plan_semanal`, `activa`, `semana_actual`, `created_at`, `updated_at`) VALUES
(4, '{"dias":[{"dia":"Día 1","grupo_muscular":"Pecho y Tríceps","duracion_estimada":"60 min","intensidad":"Alta","ejercicios":[{"nombre":"Press de Banca","series":4,"repeticiones":"8-10","descanso":"90s"},{"nombre":"Fondos en paralelas","series":3,"repeticiones":"10-12","descanso":"60s"},{"nombre":"Extensiones de tríceps","series":3,"repeticiones":"12-15","descanso":"60s"}]},{"dia":"Día 2","grupo_muscular":"Espalda y Bíceps","duracion_estimada":"60 min","intensidad":"Alta","ejercicios":[{"nombre":"Dominadas","series":4,"repeticiones":"6-8","descanso":"90s"},{"nombre":"Remo con barra","series":4,"repeticiones":"8-10","descanso":"90s"},{"nombre":"Curl de bíceps","series":3,"repeticiones":"12","descanso":"60s"}]},{"dia":"Día 3","grupo_muscular":"Piernas","duracion_estimada":"70 min","intensidad":"Alta","ejercicios":[{"nombre":"Sentadilla con barra","series":4,"repeticiones":"8-10","descanso":"120s"},{"nombre":"Prensa de piernas","series":3,"repeticiones":"12","descanso":"90s"},{"nombre":"Curl femoral","series":3,"repeticiones":"12-15","descanso":"60s"}]}]}', 1, 1, NOW(), NOW()),
(5, '{"dias":[{"dia":"Día 1","grupo_muscular":"Cardio y Core","duracion_estimada":"45 min","intensidad":"Media","ejercicios":[{"nombre":"Carrera en cinta","series":1,"repeticiones":"20 min","descanso":"0s"},{"nombre":"Plancha abdominal","series":4,"repeticiones":"30-45s","descanso":"30s"},{"nombre":"Mountain climbers","series":3,"repeticiones":"20","descanso":"30s"}]},{"dia":"Día 2","grupo_muscular":"Tren Superior","duracion_estimada":"50 min","intensidad":"Media","ejercicios":[{"nombre":"Flexiones","series":4,"repeticiones":"12-15","descanso":"60s"},{"nombre":"Remo en polea","series":3,"repeticiones":"15","descanso":"60s"},{"nombre":"Elevaciones laterales","series":3,"repeticiones":"15","descanso":"45s"}]},{"dia":"Día 3","grupo_muscular":"Glúteos y Piernas","duracion_estimada":"55 min","intensidad":"Media","ejercicios":[{"nombre":"Sentadilla sumo","series":4,"repeticiones":"15","descanso":"60s"},{"nombre":"Hip thrust","series":4,"repeticiones":"12","descanso":"60s"},{"nombre":"Zancadas","series":3,"repeticiones":"12 c/lado","descanso":"60s"}]}]}', 1, 1, NOW(), NOW());

-- =====================================================
-- MÉTRICAS CORPORALES (FK → users)
-- =====================================================

INSERT INTO `metricas_corporales` (`user_id`, `peso`, `estatura`, `grasa_corporal`, `masa_muscular`, `fecha`, `created_at`, `updated_at`) VALUES
(4, 75.0, 178, 18.5, 62.0, DATE_SUB(NOW(), INTERVAL 30 DAY), NOW(), NOW()),
(4, 74.2, 178, 17.8, 62.5, DATE_SUB(NOW(), INTERVAL 15 DAY), NOW(), NOW()),
(4, 73.5, 178, 17.1, 63.0, NOW(),                             NOW(), NOW()),
(5, 65.0, 162, 28.0, 42.0, DATE_SUB(NOW(), INTERVAL 30 DAY), NOW(), NOW()),
(5, 64.0, 162, 27.0, 42.5, DATE_SUB(NOW(), INTERVAL 15 DAY), NOW(), NOW()),
(5, 63.0, 162, 26.0, 43.0, NOW(),                             NOW(), NOW()),
(6, 80.0, 175, 20.0, 65.0, DATE_SUB(NOW(), INTERVAL 30 DAY), NOW(), NOW()),
(6, 79.5, 175, 19.5, 65.5, NOW(),                             NOW(), NOW());

-- =====================================================
-- TRANSACCIONES / MEMBRESÍAS (FK → users)
-- =====================================================

INSERT INTO `transacciones` (`user_id`, `monto`, `estado`, `plan_nombre`, `metodo_pago`, `created_at`, `updated_at`) VALUES
(4, 50000,  'completado', 'Plan Básico 1 Mes',       'tarjeta',      NOW(), NOW()),
(5, 50000,  'completado', 'Plan Básico 1 Mes',       'efectivo',     NOW(), NOW()),
(6, 90000,  'completado', 'Plan Premium 2 Meses',    'tarjeta',      NOW(), NOW());

-- =====================================================
-- LOGROS (tabla estática de badges)
-- =====================================================

INSERT INTO `logros` (`nombre`, `descripcion`, `icono`, `tipo`, `created_at`, `updated_at`) VALUES
('Primera Semana',      '¡Completaste tu primera semana de entrenamiento!',         '🏅', 'asistencia',    NOW(), NOW()),
('Racha de 7 Días',     'Entrenaste 7 días consecutivos sin faltar.',                '🔥', 'racha',         NOW(), NOW()),
('Primera Rutina',      'Completaste tu primer día de rutina al 100%.',              '💪', 'rutina',        NOW(), NOW()),
('Meta de Peso',        'Alcanzaste tu primera meta de peso corporal.',              '⚖️',  'metrica',       NOW(), NOW()),
('Guerrero del Mes',    'Entrenaste más de 20 veces en un solo mes.',                '🏆', 'asistencia',    NOW(), NOW()),
('Fuerza Brutal',       'Superaste tu record personal en un ejercicio de fuerza.',   '🦾', 'fuerza',        NOW(), NOW()),
('Constancia es Clave', 'Llevas 30 días consecutivos cumpliendo tu plan.',           '📅', 'racha',         NOW(), NOW());

-- =====================================================
-- HITOS (metas personales, FK → users)
-- =====================================================

INSERT INTO `hitos` (`user_id`, `tipo`, `valor_meta`, `valor_actual`, `completado`, `created_at`, `updated_at`) VALUES
(4, 'peso_objetivo',          70.0,  73.5, 0, NOW(), NOW()),
(4, 'entrenamientos_semana',   4,     3,   0, NOW(), NOW()),
(5, 'peso_objetivo',          58.0,  63.0, 0, NOW(), NOW()),
(5, 'entrenamientos_semana',   3,     3,   1, NOW(), NOW()),
(6, 'entrenamientos_semana',   5,     4,   0, NOW(), NOW());
