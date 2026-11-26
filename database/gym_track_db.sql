-- --------------------------------------------------------
-- Host:                         127.0.0.1
-- Versión del servidor:         10.4.32-MariaDB - mariadb.org binary distribution
-- SO del servidor:              Win64
-- HeidiSQL Versión:             12.16.0.7229
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


-- Volcando estructura de base de datos para gym_track_db
CREATE DATABASE IF NOT EXISTS `gym_track_db` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci */;
USE `gym_track_db`;

-- Volcando estructura para tabla gym_track_db.cache
CREATE TABLE IF NOT EXISTS `cache` (
  `key` varchar(255) NOT NULL,
  `value` mediumtext NOT NULL,
  `expiration` int(11) NOT NULL,
  PRIMARY KEY (`key`),
  KEY `cache_expiration_index` (`expiration`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Volcando datos para la tabla gym_track_db.cache: ~0 rows (aproximadamente)

-- Volcando estructura para tabla gym_track_db.cache_locks
CREATE TABLE IF NOT EXISTS `cache_locks` (
  `key` varchar(255) NOT NULL,
  `owner` varchar(255) NOT NULL,
  `expiration` int(11) NOT NULL,
  PRIMARY KEY (`key`),
  KEY `cache_locks_expiration_index` (`expiration`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Volcando datos para la tabla gym_track_db.cache_locks: ~0 rows (aproximadamente)

-- Volcando estructura para tabla gym_track_db.clases
CREATE TABLE IF NOT EXISTS `clases` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `nombre` varchar(255) NOT NULL,
  `instructor_id` char(36) NOT NULL,
  `sala` varchar(255) NOT NULL,
  `horario_inicio` time NOT NULL,
  `horario_fin` time NOT NULL,
  `capacidad_max` int(11) NOT NULL DEFAULT 20,
  `color` varchar(255) NOT NULL DEFAULT '#ff8c42',
  `estado` enum('programada','en progreso','completa') NOT NULL DEFAULT 'programada',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `clases_instructor_id_foreign` (`instructor_id`),
  CONSTRAINT `clases_instructor_id_foreign` FOREIGN KEY (`instructor_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Volcando datos para la tabla gym_track_db.clases: ~0 rows (aproximadamente)

-- Volcando estructura para tabla gym_track_db.clientes
CREATE TABLE IF NOT EXISTS `clientes` (
  `id` char(36) NOT NULL,
  `user_id` char(36) NOT NULL,
  `gimnasio_id` char(36) DEFAULT NULL,
  `ubicacion` varchar(255) DEFAULT NULL,
  `fecha_nacimiento` date DEFAULT NULL,
  `genero` varchar(255) DEFAULT NULL,
  `peso_kg` double DEFAULT NULL,
  `altura_cm` double DEFAULT NULL,
  `imc` double DEFAULT NULL,
  `nivel_actividad` varchar(255) DEFAULT NULL,
  `objetivo_principal` varchar(255) DEFAULT NULL,
  `condicion_medica` text DEFAULT NULL,
  `activo` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `vencimiento_membresia` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `clientes_user_id_foreign` (`user_id`),
  CONSTRAINT `clientes_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Volcando datos para la tabla gym_track_db.clientes: ~2 rows (aproximadamente)
INSERT INTO `clientes` (`id`, `user_id`, `gimnasio_id`, `ubicacion`, `fecha_nacimiento`, `genero`, `peso_kg`, `altura_cm`, `imc`, `nivel_actividad`, `objetivo_principal`, `condicion_medica`, `activo`, `created_at`, `vencimiento_membresia`) VALUES
	('01a21743-c442-70fb-b052-ecc28e065bf1', '01a21743-c428-70c4-8271-c9b0f5775bd0', NULL, NULL, '2006-03-17', 'M', 50, 164, 18.59, 'Principiante', 'Ganar masa muscular', '{"salud":"Regular","cirugia":"No","medicamentos":"No","condiciones":["Presión arterial alta"],"lesion":"No","sueno":"7-8"}', 1, '2026-11-26 09:50:46', '2027-01-26 14:50:46');

-- Volcando estructura para tabla gym_track_db.ejercicio_favoritos
CREATE TABLE IF NOT EXISTS `ejercicio_favoritos` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `user_id` char(36) NOT NULL,
  `ejercicio_id` char(36) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `ejercicio_favoritos_user_id_ejercicio_id_unique` (`user_id`,`ejercicio_id`),
  KEY `ejercicio_favoritos_ejercicio_id_foreign` (`ejercicio_id`),
  CONSTRAINT `ejercicio_favoritos_ejercicio_id_foreign` FOREIGN KEY (`ejercicio_id`) REFERENCES `ejercicios` (`id`) ON DELETE CASCADE,
  CONSTRAINT `ejercicio_favoritos_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Volcando datos para la tabla gym_track_db.ejercicio_favoritos: ~0 rows (aproximadamente)

-- Volcando estructura para tabla gym_track_db.ejercicios
CREATE TABLE IF NOT EXISTS `ejercicios` (
  `id` char(36) NOT NULL,
  `nombre` varchar(255) NOT NULL,
  `grupo_muscular` varchar(255) NOT NULL,
  `musculos_secundarios` varchar(255) DEFAULT NULL,
  `dificultad` varchar(255) NOT NULL,
  `equipamiento` varchar(255) DEFAULT NULL,
  `descripcion` text DEFAULT NULL,
  `video_url` varchar(255) DEFAULT NULL,
  `series_sugeridas` int(11) NOT NULL DEFAULT 3,
  `reps_sugeridas` varchar(255) NOT NULL DEFAULT '10-12',
  `tiempo_descanso` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Volcando datos para la tabla gym_track_db.ejercicios: ~33 rows (aproximadamente)
INSERT INTO `ejercicios` (`id`, `nombre`, `grupo_muscular`, `musculos_secundarios`, `dificultad`, `equipamiento`, `descripcion`, `video_url`, `series_sugeridas`, `reps_sugeridas`, `tiempo_descanso`, `created_at`, `updated_at`) VALUES
	('019e1e75-cc97-708d-811f-9501c942a1d4', 'Press de Banca', 'Pecho', 'Tríceps, Deltoides Anterior', 'Intermedio', 'Barra, Banco', 'Ejercicio básico para el desarrollo del pectoral mayor.', 'https://www.youtube.com/embed/TAH8RxOS0VI', 4, '8-10', '90', '2026-05-13 04:11:37', '2026-05-13 04:11:37'),
	('019e1e75-cc9f-7220-b374-cc32e6815e67', 'Press Inclinado', 'Pecho', 'Tríceps, Deltoides Anterior', 'Intermedio', 'Mancuernas, Banco Incl.', 'Enfoca la parte superior del pectoral.', 'https://www.youtube.com/embed/HzkHpIIo4IA', 3, '10-12', '60-90', '2026-05-13 04:11:37', '2026-05-13 04:11:37'),
	('019e1e75-cca2-7057-ae55-f5b2b1ecbee7', 'Aperturas', 'Pecho', 'Deltoides Anterior', 'Principiante', 'Mancuernas, Banco', 'Ejercicio de aislamiento para el pectoral.', 'https://www.youtube.com/embed/eozdVDA78K0', 3, '12-15', '60', '2026-05-13 04:11:37', '2026-05-13 04:11:37'),
	('019e1e75-cca7-71f9-9484-303fc9694e1a', 'Flexiones', 'Pecho', 'Core, Tríceps, Deltoides Anterior', 'Principiante', 'Ninguno', 'Ejercicio de peso corporal para pectoral y tríceps.', 'https://www.youtube.com/embed/oZQlr-lYc5Q', 3, 'Al fallo', '60', '2026-05-13 04:11:37', '2026-05-13 04:11:37'),
	('019e1e75-cca9-733b-8781-b7f1c3eb9742', 'Cruce de Poleas', 'Pecho', 'Deltoides Anterior', 'Intermedio', 'Poleas', 'Trabajo de tensión constante para el pectoral.', 'https://www.youtube.com/embed/34DK36aLhNg', 3, '12-15', '45-60', '2026-05-13 04:11:37', '2026-05-13 04:11:37'),
	('019e1e75-ccab-7216-9673-5be66f686a31', 'Dominadas', 'Espalda', 'Bíceps, Braquial, Core', 'Avanzado', 'Barra de Dominadas', 'Ejercicio de tracción vertical fundamental.', 'https://www.youtube.com/embed/npyLB-7o19o', 3, 'Fallo técnico', '90', '2026-05-13 04:11:37', '2026-05-13 04:11:37'),
	('019e1e75-ccae-732d-bc97-3bb511629be6', 'Remo con Barra', 'Espalda', 'Bíceps, Deltoides Posterior, Core', 'Intermedio', 'Barra', 'Ejercicio básico para grosor de espalda.', 'https://www.youtube.com/embed/CO5qxkz-KkY', 4, '8-10', '90', '2026-05-13 04:11:37', '2026-05-13 04:11:37'),
	('019e1e75-ccb0-729c-b402-462f01277c64', 'Remo con Mancuerna', 'Espalda', 'Bíceps, Deltoides Posterior', 'Principiante', 'Mancuernas, Banco', 'Ejercicio unilateral para el dorsal ancho.', 'https://www.youtube.com/embed/qTOaWaCxB8U', 4, '10-12', '60', '2026-05-13 04:11:37', '2026-05-13 04:11:37'),
	('019e1e75-ccb5-7067-8205-b7f8a982ea55', 'Jalón al Pecho', 'Espalda', 'Bíceps, Antebrazo', 'Principiante', 'Polea Alta', 'Ejercicio para amplitud en polea alta.', 'https://www.youtube.com/embed/TcYwpzaRS1I', 3, '12', '60', '2026-05-13 04:11:37', '2026-05-13 04:11:37'),
	('019e1e75-ccb7-7359-b647-f2454dbd19fc', 'Extensiones Lumbares', 'Espalda', 'Glúteos, Isquiotibiales', 'Principiante', 'Banco de Ext.', 'Fortalecimiento de la zona baja de la espalda.', 'https://www.youtube.com/embed/O8d8I7-qtGg', 3, '15', '45-60', '2026-05-13 04:11:37', '2026-05-13 04:11:37'),
	('019e1e75-ccba-72b9-9491-2a22cfd4753a', 'Sentadilla con Barra', 'Piernas', 'Glúteos, Isquiotibiales, Core', 'Avanzado', 'Barra, Rack', 'Desarrollo global de piernas y core.', 'https://www.youtube.com/embed/Ur-zj6AiO44', 4, '8-10', '120', '2026-05-13 04:11:37', '2026-05-13 04:11:37'),
	('019e1e75-ccbd-7261-bacf-7a7ca4ac6f2b', 'Prensa de Piernas', 'Piernas', 'Glúteos, Cuádriceps', 'Intermedio', 'Máquina de Prensa', 'Trabajo pesado de cuádriceps y glúteos.', 'https://www.youtube.com/embed/bNsrqXUIJqc', 3, '12-15', '90', '2026-05-13 04:11:37', '2026-05-13 04:11:37'),
	('019e1e75-ccbf-73af-a7d5-48f4e82457f8', 'Peso Muerto Rumano', 'Piernas', 'Glúteos, Lumbares, Core', 'Intermedio', 'Barra o Mancuernas', 'Enfocado en isquiotibiales y glúteos.', 'https://www.youtube.com/embed/JCXUYuzwNrM', 3, '10-12', '90', '2026-05-13 04:11:37', '2026-05-13 04:11:37'),
	('019e1e75-ccc3-72c3-890e-d2e09958b42b', 'Zancadas (Lunges)', 'Piernas', 'Isquiotibiales, Core', 'Principiante', 'Mancuernas', 'Trabajo unilateral para piernas y glúteos.', 'https://www.youtube.com/embed/D7KaRcUTQeE', 3, '12', '60', '2026-05-13 04:11:37', '2026-05-13 04:11:37'),
	('019e1e75-ccc6-73f0-9ff9-de32aca08950', 'Extensiones Pierna', 'Piernas', 'Ninguno', 'Principiante', 'Máquina de Ext.', 'Aislamiento de cuádriceps.', 'https://www.youtube.com/embed/YyvSfVjQeL0', 3, '15', '45-60', '2026-05-13 04:11:37', '2026-05-13 04:11:37'),
	('019e1e75-ccc9-7074-a6c4-94ef00b7de18', 'Curl Femoral', 'Piernas', 'Pantorrillas', 'Principiante', 'Máquina de Curl', 'Aislamiento de isquiotibiales.', 'https://www.youtube.com/embed/1Tq3QdYUuHs', 3, '15', '45-60', '2026-05-13 04:11:37', '2026-05-13 04:11:37'),
	('019e1e75-cccd-7154-b3e7-b24e092f9cd8', 'Curl Bíceps Barra', 'Bíceps', 'Antebrazo', 'Principiante', 'Barra', 'Desarrollo de masa en el bíceps.', 'https://www.youtube.com/embed/-QnKDiHhSro', 3, '10-12', '60', '2026-05-13 04:11:37', '2026-05-13 04:11:37'),
	('019e1e75-ccd1-70a5-8da3-47219f7e26c7', 'Curl Mancuerna', 'Bíceps', 'Antebrazo, Braquial', 'Principiante', 'Mancuernas', 'Trabajo con mayor rango de movimiento.', 'https://www.youtube.com/embed/CnKi1AOAE10', 3, '12', '45-60', '2026-05-13 04:11:37', '2026-05-13 04:11:37'),
	('019e1e75-ccd4-7053-870e-a85ddf15173a', 'Curl Martillo', 'Bíceps', 'Braquiorradial, Antebrazo', 'Principiante', 'Mancuernas', 'Enfocado en el braquial y antebrazo.', 'https://www.youtube.com/embed/PzmSQcFSNPI', 3, '12', '45-60', '2026-05-13 04:11:37', '2026-05-13 04:11:37'),
	('019e1e75-ccdf-734c-8fe1-e03eee977860', 'Concentración', 'Bíceps', 'Ninguno', 'Principiante', 'Mancuerna', 'Máxima contracción del bíceps.', 'https://www.youtube.com/embed/Jvj2wV0vOYU', 3, '15', '45', '2026-05-13 04:11:37', '2026-05-13 04:11:37'),
	('019e1e75-cce3-738f-8ed7-93331180b94d', 'Extensión Polea', 'Tríceps', 'Ancóneo', 'Principiante', 'Poleas', 'Aislamiento y definición de tríceps.', 'https://www.youtube.com/embed/yZmxX1ypJbE', 3, '12-15', '45', '2026-05-13 04:11:37', '2026-05-13 04:11:37'),
	('019e1e75-ccea-7295-ba6f-48675236b94d', 'Patada de Tríceps', 'Tríceps', 'Ninguno', 'Principiante', 'Mancuerna', 'Aislamiento de la cabeza lateral.', 'https://www.youtube.com/embed/6SS6K3lAwZ8', 3, '15', '45', '2026-05-13 04:11:37', '2026-05-13 04:11:37'),
	('019e1e75-ccec-7128-b12a-103bd31b448a', 'Press Francés', 'Tríceps', 'Ninguno', 'Intermedio', 'Barra Z', 'Uno de los mejores para masa en tríceps.', 'https://www.youtube.com/embed/d_KZxkY_0cM', 3, '10-12', '60-90', '2026-05-13 04:11:37', '2026-05-13 04:11:37'),
	('019e1e75-ccf0-7132-81f5-1975f987c843', 'Fondos Tríceps', 'Tríceps', 'Pecho, Deltoides Anterior', 'Intermedio', 'Paralelas', 'Trabajo intenso en paralelas.', 'https://www.youtube.com/embed/c3ZGl4pAwZ4', 3, 'Al fallo', '90', '2026-05-13 04:11:37', '2026-05-13 04:11:37'),
	('019e1e75-ccf3-71ac-9cd8-c17d01a243f9', 'Press Militar', 'Hombros', 'Tríceps, Core', 'Intermedio', 'Barra o Mancuernas', 'Ejercicio básico de fuerza para hombros.', 'https://www.youtube.com/embed/4JY1-jVNRqc', 3, '8-10', '90', '2026-05-13 04:11:37', '2026-05-13 04:11:37'),
	('019e1e75-ccf5-71c7-9d5b-c4c13113562a', 'Elevaciones Lat.', 'Hombros', 'Trapecio', 'Principiante', 'Mancuernas', 'Aislamiento del deltoides lateral.', 'https://www.youtube.com/embed/t9Cb4hLuGfE', 3, '15-20', '45-60', '2026-05-13 04:11:37', '2026-05-13 04:11:37'),
	('019e1e75-ccf8-731e-acad-d0c0489fbcaa', 'Frontales', 'Hombros', 'Pecho Superior', 'Principiante', 'Mancuerna o Disco', 'Aísla el deltoides anterior.', 'https://www.youtube.com/embed/-t7fuZ0KhDA', 3, '12-15', '45-60', '2026-05-13 04:11:37', '2026-05-13 04:11:37'),
	('019e1e75-ccfb-72ef-937e-68881932bd9b', 'Pájaros (Rear Delt)', 'Hombros', 'Trapecio, Espalda Superior', 'Intermedio', 'Mancuernas', 'Enfocado en el deltoides posterior.', 'https://www.youtube.com/embed/4otcO1StZHQ', 3, '15', '45-60', '2026-05-13 04:11:37', '2026-05-13 04:11:37'),
	('019e1e75-ccfe-70ab-b3d0-71669740bcc0', 'Crunch Abdominal', 'Abdomen', 'Ninguno', 'Principiante', 'Ninguno', 'Básico para el recto abdominal.', 'https://www.youtube.com/embed/irNCQSudRwM', 3, '15-20', '30-45', '2026-05-13 04:11:37', '2026-05-13 04:11:37'),
	('019e1e75-cd01-712d-b116-7af7c1eb1588', 'Elevación Piernas', 'Abdomen', 'Flexores de Cadera', 'Intermedio', 'Banco o Suelo', 'Enfocado en la parte inferior del abdomen.', 'https://www.youtube.com/embed/uUv5-S_J8OQ', 3, '12-15', '45', '2026-05-13 04:11:37', '2026-05-13 04:11:37'),
	('019e1e75-cd05-71a4-b1d5-245349235053', 'Plancha (Plank)', 'Abdomen', 'Hombros, Glúteos, Core Total', 'Principiante', 'Ninguno', 'Ejercicio isométrico para el core.', 'https://www.youtube.com/embed/EPbumTj3agk', 3, '45-60 segundos', '30-45', '2026-05-13 04:11:37', '2026-05-13 04:11:37'),
	('019e1e75-cd08-730c-931d-4769e8af4811', 'Toque Puntas', 'Abdomen', 'Core Superior', 'Principiante', 'Ninguno', 'Ejercicio para abdomen superior y flexibilidad.', 'https://www.youtube.com/embed/QiDNLfNKBYA', 3, '20', '30', '2026-05-13 04:11:37', '2026-05-13 04:11:37'),
	('019e1e75-cd0c-73b5-8a9c-b6792994a743', 'Rueda Abdominal', 'Abdomen', 'Hombros, Dorsales, Core Profundo', 'Avanzado', 'Rueda Abdom.', 'Ejercicio avanzado para todo el core.', 'https://www.youtube.com/embed/mN2gwXOUBlI', 3, '10-12', '60', '2026-05-13 04:11:37', '2026-05-13 04:11:37');

-- Volcando estructura para tabla gym_track_db.entrenador_certificados
CREATE TABLE IF NOT EXISTS `entrenador_certificados` (
  `id` char(36) NOT NULL,
  `entrenador_id` char(36) NOT NULL,
  `titulo` varchar(255) NOT NULL,
  `path` varchar(255) NOT NULL,
  `emisor` varchar(255) DEFAULT NULL,
  `fecha_obtencion` date DEFAULT NULL,
  `fecha_expiracion` date DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `entrenador_certificados_entrenador_id_foreign` (`entrenador_id`),
  CONSTRAINT `entrenador_certificados_entrenador_id_foreign` FOREIGN KEY (`entrenador_id`) REFERENCES `entrenadores` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Volcando datos para la tabla gym_track_db.entrenador_certificados: ~0 rows (aproximadamente)
INSERT INTO `entrenador_certificados` (`id`, `entrenador_id`, `titulo`, `path`, `emisor`, `fecha_obtencion`, `fecha_expiracion`, `created_at`) VALUES
	('01a21768-6028-7137-8b79-ae9d5339faaf', '01a21768-6022-70e7-a546-a8d28d693edc', 'Entrenador Personal', 'certificados/1795689046_Certificados y diplomas del entrenador.pdf', 'Pendiente', '2026-11-26', NULL, '2026-11-26 10:30:46');

-- Volcando estructura para tabla gym_track_db.entrenadores
CREATE TABLE IF NOT EXISTS `entrenadores` (
  `id` char(36) NOT NULL,
  `user_id` char(36) NOT NULL,
  `especialidad` varchar(255) DEFAULT NULL,
  `experiencia_anios` int(11) DEFAULT NULL,
  `certificacion` varchar(255) DEFAULT NULL,
  `certificado_path` varchar(255) DEFAULT NULL,
  `horarios` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`horarios`)),
  `tipos_entrenamiento` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`tipos_entrenamiento`)),
  `capacidad_maxima` int(11) DEFAULT NULL,
  `objetivos_profesionales` text DEFAULT NULL,
  `fecha_nacimiento` date DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `estado` varchar(255) NOT NULL DEFAULT 'pendiente',
  `motivo_rechazo` text DEFAULT NULL,
  `edad` int(11) DEFAULT NULL,
  `genero` varchar(255) DEFAULT NULL,
  `contacto` varchar(255) DEFAULT NULL,
  `direccion` varchar(255) DEFAULT NULL,
  `emergencia` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `entrenadores_user_id_foreign` (`user_id`),
  CONSTRAINT `entrenadores_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Volcando datos para la tabla gym_track_db.entrenadores: ~0 rows (aproximadamente)
INSERT INTO `entrenadores` (`id`, `user_id`, `especialidad`, `experiencia_anios`, `certificacion`, `certificado_path`, `horarios`, `tipos_entrenamiento`, `capacidad_maxima`, `objetivos_profesionales`, `fecha_nacimiento`, `created_at`, `estado`, `motivo_rechazo`, `edad`, `genero`, `contacto`, `direccion`, `emergencia`) VALUES
	('01a21768-6022-70e7-a546-a8d28d693edc', '01a21768-5fe8-71a8-838a-b9bbcaa3aaee', 'Fuerza', 4, 'Entrenador Personal', 'certificados/1795689046_Certificados y diplomas del entrenador.pdf', '["L-V (Ma\\u00f1ana)"]', '["Sesiones Individuales"]', 1, 'Me gustaria asesorar a las personas nuevas que estan entranando al mundo firness', '2004-09-04', '2026-11-26 10:30:46', 'aprobado', NULL, NULL, 'M', '3166666666', 'Calle 45 17-47', '312749877');

-- Volcando estructura para tabla gym_track_db.entrenamiento_ejercicios
CREATE TABLE IF NOT EXISTS `entrenamiento_ejercicios` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Volcando datos para la tabla gym_track_db.entrenamiento_ejercicios: ~0 rows (aproximadamente)

-- Volcando estructura para tabla gym_track_db.entrenamientos
CREATE TABLE IF NOT EXISTS `entrenamientos` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Volcando datos para la tabla gym_track_db.entrenamientos: ~0 rows (aproximadamente)

-- Volcando estructura para tabla gym_track_db.failed_jobs
CREATE TABLE IF NOT EXISTS `failed_jobs` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `uuid` varchar(255) NOT NULL,
  `connection` text NOT NULL,
  `queue` text NOT NULL,
  `payload` longtext NOT NULL,
  `exception` longtext NOT NULL,
  `failed_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `failed_jobs_uuid_unique` (`uuid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Volcando datos para la tabla gym_track_db.failed_jobs: ~0 rows (aproximadamente)

-- Volcando estructura para tabla gym_track_db.hitos
CREATE TABLE IF NOT EXISTS `hitos` (
  `id` char(36) NOT NULL,
  `cliente_id` char(36) NOT NULL,
  `titulo` varchar(255) NOT NULL,
  `descripcion` text DEFAULT NULL,
  `tipo` varchar(255) NOT NULL,
  `valor_inicial` double NOT NULL DEFAULT 0,
  `meta_valor` double NOT NULL,
  `valor_actual` double NOT NULL DEFAULT 0,
  `unidad` varchar(255) NOT NULL,
  `progreso_porcentaje` int(11) NOT NULL DEFAULT 0,
  `estado` enum('en_progreso','completado','abandonado') NOT NULL DEFAULT 'en_progreso',
  `fecha_limite` date DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `hitos_cliente_id_foreign` (`cliente_id`),
  CONSTRAINT `hitos_cliente_id_foreign` FOREIGN KEY (`cliente_id`) REFERENCES `clientes` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Volcando datos para la tabla gym_track_db.hitos: ~0 rows (aproximadamente)

-- Volcando estructura para tabla gym_track_db.ia_mensajes
CREATE TABLE IF NOT EXISTS `ia_mensajes` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `user_id` char(36) NOT NULL,
  `role` varchar(255) NOT NULL,
  `content` text NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Volcando datos para la tabla gym_track_db.ia_mensajes: ~2 rows (aproximadamente)
INSERT INTO `ia_mensajes` (`id`, `user_id`, `role`, `content`, `created_at`, `updated_at`) VALUES
	(17, '01a12d88-c267-7043-9904-a43d1dc1bf67', 'user', 'observa mi rutina', '2026-11-19 00:23:32', '2026-11-19 00:23:32'),
	(18, '01a12d88-c267-7043-9904-a43d1dc1bf67', 'model', '¡Hola Juan! Con gusto reviso tu rutina actual.\n\nTienes una distribución de tres días bastante clara y bien estructurada.\n\nEl Día 1 está dedicado a la Parte Superior, enfocado en Pecho y Espalda. Haces Press de Pecho en máquina o Push-ups, y Jalón al pecho o Remo, ambos ejercicios en 3 series de 10 a 12 repeticiones. Es un excelente trabajo para mantener el equilibrio entre los ejercicios de empuje y de tracción.\n\nEl Día 2 trabajas Core y Movilidad, con la ventaja de estar adaptado para evitar tu zona lesionada. Realizas Plancha abdominal durante 30 a 45 segundos y Crunches de 15 a 20 repeticiones, también en 3 series. Me parece un acierto total cuidar tu lesión mientras fortaleces la zona media.\n\nEl Día 3 se enfoca en Hombros y Brazos, incluyendo Elevaciones laterales de 12 a 15 repeticiones, Curl de Bíceps a 12 repeticiones y Extensión de Tríceps a 12 repeticiones, todo a 3 series.\n\nEn resumen, Juan, es una rutina muy práctica, segura y equilibrada. Te permite trabajar con buen volumen la parte superior y el abdomen de forma inteligente. ¡Sigue así! ¿Hay algún ejercicio en el que sientas que necesitas un ajuste o tienes alguna duda específica?', '2026-11-19 00:23:41', '2026-11-19 00:23:41');

-- Volcando estructura para tabla gym_track_db.job_batches
CREATE TABLE IF NOT EXISTS `job_batches` (
  `id` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `total_jobs` int(11) NOT NULL,
  `pending_jobs` int(11) NOT NULL,
  `failed_jobs` int(11) NOT NULL,
  `failed_job_ids` longtext NOT NULL,
  `options` mediumtext DEFAULT NULL,
  `cancelled_at` int(11) DEFAULT NULL,
  `created_at` int(11) NOT NULL,
  `finished_at` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Volcando datos para la tabla gym_track_db.job_batches: ~0 rows (aproximadamente)

-- Volcando estructura para tabla gym_track_db.jobs
CREATE TABLE IF NOT EXISTS `jobs` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `queue` varchar(255) NOT NULL,
  `payload` longtext NOT NULL,
  `attempts` tinyint(3) unsigned NOT NULL,
  `reserved_at` int(10) unsigned DEFAULT NULL,
  `available_at` int(10) unsigned NOT NULL,
  `created_at` int(10) unsigned NOT NULL,
  PRIMARY KEY (`id`),
  KEY `jobs_queue_index` (`queue`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Volcando datos para la tabla gym_track_db.jobs: ~0 rows (aproximadamente)

-- Volcando estructura para tabla gym_track_db.logro_usuario
CREATE TABLE IF NOT EXISTS `logro_usuario` (
  `id` char(36) NOT NULL,
  `user_id` char(36) NOT NULL,
  `logro_id` char(36) NOT NULL,
  `fecha_obtencion` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `logro_usuario_user_id_logro_id_unique` (`user_id`,`logro_id`),
  KEY `logro_usuario_logro_id_foreign` (`logro_id`),
  CONSTRAINT `logro_usuario_logro_id_foreign` FOREIGN KEY (`logro_id`) REFERENCES `logros` (`id`) ON DELETE CASCADE,
  CONSTRAINT `logro_usuario_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Volcando datos para la tabla gym_track_db.logro_usuario: ~4 rows (aproximadamente)

-- Volcando estructura para tabla gym_track_db.logros
CREATE TABLE IF NOT EXISTS `logros` (
  `id` char(36) NOT NULL,
  `nombre` varchar(255) NOT NULL,
  `descripcion` varchar(255) NOT NULL,
  `icono` varchar(255) NOT NULL,
  `categoria` varchar(255) NOT NULL,
  `meta_valor` int(11) NOT NULL,
  `puntos` int(11) NOT NULL DEFAULT 10,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Volcando datos para la tabla gym_track_db.logros: ~6 rows (aproximadamente)
INSERT INTO `logros` (`id`, `nombre`, `descripcion`, `icono`, `categoria`, `meta_valor`, `puntos`, `created_at`, `updated_at`) VALUES
	('5600c259-5bb4-4cc8-91e6-1d627de65b47', 'Superando Límites', 'Completa un hito de fuerza', 'TrendingUp', 'fuerza', 1, 200, NULL, NULL),
	('a781f1b0-59c6-4bde-bad6-ca1610c1bb9d', 'Disciplina Total', 'Entrena 30 días seguidos', 'Trophy', 'racha', 30, 1000, NULL, NULL),
	('c365367e-d6a3-4a81-a3af-5a23b8af7159', 'Primer Paso', 'Completa tu primer entrenamiento', 'Zap', 'entrenamiento', 1, 50, NULL, NULL),
	('c415270b-f5d6-4a09-9ea0-4a640b63066d', 'Racha de Fuego', 'Entrena 7 días seguidos', 'Flame', 'racha', 7, 250, NULL, NULL),
	('e473f6ff-cbeb-4e1a-af9c-1c19c21a19d0', 'Cuerpo en Cambio', 'Actualiza tus métricas 5 veces', 'Activity', 'metricas', 5, 150, NULL, NULL),
	('eff0e4f2-bd1d-417d-a51f-d362febe48ad', 'Constancia Inicial', 'Entrena 3 días seguidos', 'Flame', 'racha', 3, 100, NULL, NULL);

-- Volcando estructura para tabla gym_track_db.logros_tables
CREATE TABLE IF NOT EXISTS `logros_tables` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Volcando datos para la tabla gym_track_db.logros_tables: ~0 rows (aproximadamente)

-- Volcando estructura para tabla gym_track_db.metricas_corporales
CREATE TABLE IF NOT EXISTS `metricas_corporales` (
  `id` char(36) NOT NULL,
  `cliente_id` char(36) NOT NULL,
  `fecha` date NOT NULL,
  `peso_kg` double DEFAULT NULL,
  `altura_cm` double DEFAULT NULL,
  `imc` double DEFAULT NULL,
  `grasa_corporal` double DEFAULT NULL,
  `masa_muscular` double DEFAULT NULL,
  `pecho_cm` double DEFAULT NULL,
  `cintura_cm` double DEFAULT NULL,
  `cadera_cm` double DEFAULT NULL,
  `brazo_cm` double DEFAULT NULL,
  `muslo_cm` double DEFAULT NULL,
  `notas` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `metricas_corporales_cliente_id_foreign` (`cliente_id`),
  CONSTRAINT `metricas_corporales_cliente_id_foreign` FOREIGN KEY (`cliente_id`) REFERENCES `clientes` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Volcando datos para la tabla gym_track_db.metricas_corporales: ~5 rows (aproximadamente)
INSERT INTO `metricas_corporales` (`id`, `cliente_id`, `fecha`, `peso_kg`, `altura_cm`, `imc`, `grasa_corporal`, `masa_muscular`, `pecho_cm`, `cintura_cm`, `cadera_cm`, `brazo_cm`, `muslo_cm`, `notas`, `created_at`) VALUES
	('019e1d83-304d-734a-a206-ff1b3c9c8f5c', '019e1d82-c064-7166-bac5-27718b34dd2e', '2026-05-12', NULL, 170, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2026-05-12 18:46:37'),
	('019e1d8b-c0ee-7277-8a16-37255c2b6404', '019e1d82-c064-7166-bac5-27718b34dd2e', '2026-05-12', 70, 180, 21.6, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2026-05-12 18:55:58');

-- Volcando estructura para tabla gym_track_db.migrations
CREATE TABLE IF NOT EXISTS `migrations` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `migration` varchar(255) NOT NULL,
  `batch` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=32 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Volcando datos para la tabla gym_track_db.migrations: ~24 rows (aproximadamente)
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES
	(1, '0001_01_01_000000_create_users_table', 1),
	(2, '0001_01_01_000001_create_cache_table', 1),
	(3, '0001_01_01_000002_create_jobs_table', 1),
	(4, '2026_04_03_162331_create_personal_access_tokens_table', 1),
	(5, '2026_04_04_203325_create_clientes_table', 1),
	(6, '2026_04_06_205325_create_entrenadors_table', 1),
	(7, '2026_04_07_200000_create_metricas_corporales_table', 1),
	(8, '2026_04_07_200001_create_hitos_table', 1),
	(9, '2026_04_09_200000_create_rutinas_table', 1),
	(10, '2026_04_18_000000_create_ejercicios_table', 1),
	(11, '2026_04_18_205341_add_details_to_ejercicios_table', 1),
	(12, '2026_04_18_210735_create_ejercicio_favoritos_table', 1),
	(13, '2026_04_24_155928_create_entrenamientos_table', 1),
	(14, '2026_04_24_160023_create_entrenamiento_ejercicios_table', 1),
	(15, '2026_04_28_045402_create_sesiones_entrenamiento_table_v2', 1),
	(16, '2026_04_28_164924_add_ubicacion_to_clientes_table', 1),
	(17, '2026_04_28_201050_add_valor_inicial_to_hitos_table', 1),
	(18, '2026_04_28_205218_create_logros_tables', 1),
	(19, '2026_04_28_205225_create_logros_tables', 1),
	(20, '2026_04_30_181543_create_rutina_progresos_table', 1),
	(21, '2026_05_02_124322_add_certificado_path_to_entrenadores_table', 1),
	(22, '2026_05_03_130023_add_activo_to_users_table', 1),
	(23, '2026_05_08_235319_add_estado_to_entrenadores_table', 1),
	(24, '2026_05_09_001802_add_personal_info_to_entrenadores_table', 1),
	(25, '2026_05_12_225914_create_transacciones_table', 2),
	(26, '2026_05_12_234121_add_vencimiento_to_clientes_table', 3),
	(27, '2026_05_20_100000_create_clases_table', 4),
	(28, '2026_05_21_000000_create_entrenador_certificados_table', 5),
	(29, '2026_06_25_193651_add_fecha_nacimiento_to_entrenadores_table', 6),
	(30, '2026_07_01_212239_create_ia_mensajes_table', 99),
	(31, '2026_07_18_000001_create_planes_alimentacion_table', 100);

-- Volcando estructura para tabla gym_track_db.password_reset_tokens
CREATE TABLE IF NOT EXISTS `password_reset_tokens` (
  `email` varchar(255) NOT NULL,
  `token` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Volcando datos para la tabla gym_track_db.password_reset_tokens: ~0 rows (aproximadamente)

-- Volcando estructura para tabla gym_track_db.personal_access_tokens
CREATE TABLE IF NOT EXISTS `personal_access_tokens` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `tokenable_type` varchar(255) NOT NULL,
  `tokenable_id` char(36) NOT NULL,
  `name` text NOT NULL,
  `token` varchar(64) NOT NULL,
  `abilities` text DEFAULT NULL,
  `last_used_at` timestamp NULL DEFAULT NULL,
  `expires_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `personal_access_tokens_token_unique` (`token`),
  KEY `personal_access_tokens_tokenable_type_tokenable_id_index` (`tokenable_type`,`tokenable_id`),
  KEY `personal_access_tokens_expires_at_index` (`expires_at`)
) ENGINE=InnoDB AUTO_INCREMENT=104 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Volcando datos para la tabla gym_track_db.personal_access_tokens: ~6 rows (aproximadamente)
INSERT INTO `personal_access_tokens` (`id`, `tokenable_type`, `tokenable_id`, `name`, `token`, `abilities`, `last_used_at`, `expires_at`, `created_at`, `updated_at`) VALUES
	(1, 'App\\Models\\User', '019e1d7c-5425-73de-bb5d-bfcf8e5840af', 'auth_token', '60831bdf2ac96ced5c83bb36e4f85fd1b7dd144626f684164523795cb6d30205', '["*"]', '2026-05-12 23:56:05', NULL, '2026-05-12 23:42:33', '2026-05-12 23:56:05'),
	(24, 'App\\Models\\User', '019e437c-f1fc-710e-9d89-a9737726bfe6', 'auth_token', '11e961cb89a833e6927a922cb495a8948c2bb02be5d1956a26c80e56186694b4', '["*"]', NULL, NULL, '2026-05-20 08:45:22', '2026-05-20 08:45:22'),
	(37, 'App\\Models\\User', '019e47e1-b9ea-7336-a7d3-71259ca52246', 'auth_token', '3888f660297d012c83a76daef23733afeeb544e7274e9f8704898a8b694f991b', '["*"]', NULL, NULL, '2026-05-21 05:13:56', '2026-05-21 05:13:56'),
	(44, 'App\\Models\\User', '019de8d0-c582-70b8-9e0e-3a4b974986c7', 'auth_token', '89701a80bd26b757f73c71fb0a84f8a469a7c9b00f03e940188c253bfcab2041', '["*"]', '2026-05-21 22:10:53', NULL, '2026-05-21 21:59:21', '2026-05-21 22:10:53'),
	(57, 'App\\Models\\User', '019eb925-6b39-72d9-a208-be653741a0bd', 'auth_token', '9a373e104fe2ed4caf3a3d3fd375290f1cbf0219a8dd22b96e2db97bceae6859', '["*"]', NULL, NULL, '2026-06-12 05:05:00', '2026-06-12 05:05:00'),
	(77, 'App\\Models\\User', '019f0051-2a7d-71b0-b46b-c62964b657a4', 'auth_token', '0aa6f3a008a8ea71beda6ad92628a77204dff59d4e3559e5986cbb7a5bb8e5cd', '["*"]', '2026-07-18 08:20:47', NULL, '2026-07-07 01:00:16', '2026-07-18 08:20:47'),
	(93, 'App\\Models\\User', '01a21768-5fe8-71a8-838a-b9bbcaa3aaee', 'auth_token', '44b3e6748ef48dd0a44b7f1eb6853b4d70ddb8484672ff168e3d7ef8d7fae6f6', '["*"]', NULL, NULL, '2026-11-26 15:30:50', '2026-11-26 15:30:50'),
	(101, 'App\\Models\\User', '01a21768-5fe8-71a8-838a-b9bbcaa3aaee', 'auth_token', '0c12154932a3c8eb6443e2e2c69d93d0fc818f397eb3b4bd9817e047adb972d1', '["*"]', '2026-11-26 16:07:40', NULL, '2026-11-26 16:07:39', '2026-11-26 16:07:40');

-- Volcando estructura para tabla gym_track_db.planes_alimentacion
CREATE TABLE IF NOT EXISTS `planes_alimentacion` (
  `id` char(36) NOT NULL,
  `user_id` char(36) NOT NULL,
  `plan_json` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`plan_json`)),
  `activo` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `planes_alimentacion_user_id_index` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Volcando datos para la tabla gym_track_db.planes_alimentacion: ~2 rows (aproximadamente)
INSERT INTO `planes_alimentacion` (`id`, `user_id`, `plan_json`, `activo`, `created_at`, `updated_at`) VALUES
	('019f97ef-0919-7073-ad88-a509f6140bef', '019f0051-2a7d-71b0-b46b-c62964b657a4', '{"dias":[{"dia":"Lunes","comidas":[{"id":1,"hora":"08:00","nombre":"Desayuno","descripcion":"Porridge de avena templado con pl\\u00e1tano en rodajas, canela y nueces troceadas.","kcal":420,"p":15,"c":60,"g":12,"img_query":"oatmeal banana walnuts"},{"id":2,"hora":"11:00","nombre":"Media Ma\\u00f1ana","descripcion":"Yogur griego natural bajo en grasa acompa\\u00f1ado de un pu\\u00f1ado de almendras naturales.","kcal":180,"p":12,"c":8,"g":10,"img_query":"greek yogurt almonds"},{"id":3,"hora":"14:00","nombre":"Almuerzo","descripcion":"Pechuga de pollo a la plancha con arroz integral cocido y br\\u00f3coli al vapor con un hilo de aceite de oliva.","kcal":620,"p":45,"c":65,"g":18,"img_query":"chicken rice broccoli"},{"id":4,"hora":"17:00","nombre":"Merienda","descripcion":"Manzana laminada con una cucharada de crema de cacahuete 100% pura.","kcal":190,"p":5,"c":22,"g":10,"img_query":"apple peanut butter"},{"id":5,"hora":"20:30","nombre":"Cena","descripcion":"Filete de salm\\u00f3n al horno con esp\\u00e1rragos trigueros y patata cocida con piel.","kcal":480,"p":35,"c":35,"g":20,"img_query":"salmon asparagus potato"}]},{"dia":"Martes","comidas":[{"id":1,"hora":"08:00","nombre":"Desayuno","descripcion":"Tostadas de pan integral de centeno con aguacate machacado y un huevo poch\\u00e9 por encima.","kcal":400,"p":18,"c":35,"g":20,"img_query":"avocado egg toast"},{"id":2,"hora":"11:00","nombre":"Media Ma\\u00f1ana","descripcion":"Rodajas de pi\\u00f1a al natural acompa\\u00f1adas de tres nueces enteras.","kcal":150,"p":3,"c":18,"g":9,"img_query":"pineapple walnut snack"},{"id":3,"hora":"14:00","nombre":"Almuerzo","descripcion":"Garbanzos pedrosillanos salteados con espinacas frescas, ajo y bacalao desalado desmigado.","kcal":600,"p":38,"c":60,"g":20,"img_query":"chickpeas spinach cod"},{"id":4,"hora":"17:00","nombre":"Merienda","descripcion":"Yogur natural desnatado mezclado con una cucharadita de semillas de ch\\u00eda.","kcal":160,"p":10,"c":12,"g":8,"img_query":"yogurt chia seeds"},{"id":5,"hora":"20:30","nombre":"Cena","descripcion":"Pechuga de pavo a la plancha con pur\\u00e9 de calabaza casero y una ensalada verde de can\\u00f3nigos.","kcal":420,"p":38,"c":30,"g":15,"img_query":"turkey pumpkin puree"}]},{"dia":"Mi\\u00e9rcoles","comidas":[{"id":1,"hora":"08:00","nombre":"Desayuno","descripcion":"Batido saciante de prote\\u00edna de suero, espinacas baby, medio pl\\u00e1tano y leche de almendras sin az\\u00facar.","kcal":380,"p":28,"c":45,"g":8,"img_query":"spinach banana smoothie"},{"id":2,"hora":"11:00","nombre":"Media Ma\\u00f1ana","descripcion":"Dos tortitas de arroz integral untadas con queso fresco batido 0%.","kcal":170,"p":12,"c":20,"g":4,"img_query":"rice cakes cheese"},{"id":3,"hora":"14:00","nombre":"Almuerzo","descripcion":"Pasta integral con salsa bolo\\u00f1esa vegetariana a base de lentejas, zanahoria y tomate triturado natural.","kcal":650,"p":25,"c":90,"g":15,"img_query":"lentil bolognese pasta"},{"id":4,"hora":"17:00","nombre":"Merienda","descripcion":"Una naranja mediana y un pu\\u00f1ado peque\\u00f1o de pistachos tostados sin sal.","kcal":180,"p":5,"c":18,"g":11,"img_query":"orange pistachios"},{"id":5,"hora":"20:30","nombre":"Cena","descripcion":"Lubina al horno sobre lecho de pimientos rojos, verdes y cebolla asada.","kcal":440,"p":35,"c":25,"g":18,"img_query":"baked sea bass"}]},{"dia":"Jueves","comidas":[{"id":1,"hora":"08:00","nombre":"Desayuno","descripcion":"Tortilla de dos claras y un huevo entero con hojas de espinaca, servida con una rebanada de pan de centeno.","kcal":390,"p":25,"c":30,"g":15,"img_query":"spinach egg omelet"},{"id":2,"hora":"11:00","nombre":"Media Ma\\u00f1ana","descripcion":"Un kiwi maduro y un vaso de k\\u00e9fir natural sin az\\u00facares a\\u00f1adidos.","kcal":160,"p":9,"c":15,"g":6,"img_query":"kefir kiwi fruit"},{"id":3,"hora":"14:00","nombre":"Almuerzo","descripcion":"Bol de quinoa cocida con verduras variadas al wok (calabac\\u00edn, pimiento, champi\\u00f1\\u00f3n) y dados de tofu firme a la plancha.","kcal":580,"p":24,"c":75,"g":18,"img_query":"quinoa tofu vegetables"},{"id":4,"hora":"17:00","nombre":"Merienda","descripcion":"Hummus de garbanzo casero acompa\\u00f1ado de bastoncitos de zanahoria fresca.","kcal":190,"p":6,"c":20,"g":10,"img_query":"hummus carrots"},{"id":5,"hora":"20:30","nombre":"Cena","descripcion":"Hamburguesa de ternera magra a la plancha (sin pan) acompa\\u00f1ada de una ensalada de tomate de huerta y can\\u00f3nigos.","kcal":460,"p":40,"c":15,"g":25,"img_query":"beef patty salad"}]},{"dia":"Viernes","comidas":[{"id":1,"hora":"08:00","nombre":"Desayuno","descripcion":"Yogur griego ligero con copos de avena finos, fresas laminadas y una cucharadita de semillas de lino molidas.","kcal":410,"p":20,"c":50,"g":14,"img_query":"yogurt oats strawberries"},{"id":2,"hora":"11:00","nombre":"Media Ma\\u00f1ana","descripcion":"Una pera madura y un pu\\u00f1ado de almendras crudas con piel.","kcal":180,"p":5,"c":22,"g":10,"img_query":"almonds pear"},{"id":3,"hora":"14:00","nombre":"Almuerzo","descripcion":"Lentejas pardinas estofadas con abundante verdura (puerro, zanahoria, calabac\\u00edn) y un chorrito de aceite de oliva en crudo.","kcal":610,"p":30,"c":80,"g":14,"img_query":"lentil vegetable stew"},{"id":4,"hora":"17:00","nombre":"Merienda","descripcion":"Queso cottage bajo en grasa con trozos de pi\\u00f1a al natural.","kcal":160,"p":15,"c":15,"g":4,"img_query":"cottage cheese pineapple"},{"id":5,"hora":"20:30","nombre":"Cena","descripcion":"Brochetas de pechuga de pollo, pimiento rojo y cebolla al grill, acompa\\u00f1adas de una peque\\u00f1a porci\\u00f3n de quinoa.","kcal":450,"p":38,"c":40,"g":12,"img_query":"chicken vegetable skewers"}]},{"dia":"S\\u00e1bado","comidas":[{"id":1,"hora":"08:30","nombre":"Desayuno","descripcion":"Tortitas caseras de avena y claras de huevo, endulzadas con eritritol y coronadas con ar\\u00e1ndanos frescos.","kcal":400,"p":22,"c":55,"g":8,"img_query":"oat pancakes blueberries"},{"id":2,"hora":"11:30","nombre":"Media Ma\\u00f1ana","descripcion":"Batido ligero de k\\u00e9fir con fresas frescas trituradas.","kcal":150,"p":8,"c":18,"g":5,"img_query":"kefir strawberry smoothie"},{"id":3,"hora":"14:30","nombre":"Almuerzo","descripcion":"Fajitas integrales con tiras de pollo salteadas, pimientos de colores, cebolla y una cucharada de guacamole casero.","kcal":630,"p":42,"c":65,"g":18,"img_query":"chicken fajitas"},{"id":4,"hora":"17:30","nombre":"Merienda","descripcion":"Tres nueces enteras acompa\\u00f1as de una onza de chocolate negro con un porcentaje superior al 85% de cacao.","kcal":200,"p":4,"c":12,"g":16,"img_query":"walnuts dark chocolate"},{"id":5,"hora":"21:00","nombre":"Cena","descripcion":"Filete de trucha al horno con almendras laminadas y una ensalada mixta de lechuga, tomate y pepino.","kcal":470,"p":38,"c":15,"g":28,"img_query":"baked trout almonds"}]},{"dia":"Domingo","comidas":[{"id":1,"hora":"08:30","nombre":"Desayuno","descripcion":"Huevos revueltos (un huevo entero y dos claras) con champi\\u00f1ones laminados, servidos con una tostada de pan integral.","kcal":420,"p":22,"c":35,"g":18,"img_query":"scrambled eggs mushrooms"},{"id":2,"hora":"11:30","nombre":"Media Ma\\u00f1ana","descripcion":"Yogur natural entero sin az\\u00facar con media pieza de pl\\u00e1tano en rodajas.","kcal":180,"p":9,"c":26,"g":4,"img_query":"yogurt banana"},{"id":3,"hora":"14:30","nombre":"Almuerzo","descripcion":"Arroz caldoso marinero preparado con gambas, calamares, mejillones y un sofrito suave de verduras.","kcal":590,"p":35,"c":75,"g":12,"img_query":"seafood rice"},{"id":4,"hora":"17:30","nombre":"Merienda","descripcion":"Un pu\\u00f1ado peque\\u00f1o de pistachos y una infusi\\u00f3n de t\\u00e9 verde sin az\\u00facar.","kcal":160,"p":6,"c":10,"g":11,"img_query":"pistachios"},{"id":5,"hora":"21:00","nombre":"Cena","descripcion":"Filete de pechuga de pavo al horno con calabac\\u00edn y berenjena asados con hierbas provenzales.","kcal":430,"p":40,"c":25,"g":15,"img_query":"turkey roasted zucchini"}]}]}', 0, '2026-07-25 11:20:52', '2026-07-25 11:23:13'),
	('019f97f1-2d81-71c6-949c-6a87b4c53a23', '019f0051-2a7d-71b0-b46b-c62964b657a4', '{"dias":[{"dia":"Lunes","comidas":[{"id":1,"hora":"08:00","nombre":"Desayuno","descripcion":"Porridge de avena templado con ar\\u00e1ndanos frescos (bajo \\u00edndice gluc\\u00e9mico), canela y semillas de ch\\u00eda.","kcal":390,"p":15,"c":48,"g":12,"img_query":"oatmeal blueberries chia"},{"id":2,"hora":"11:00","nombre":"Media Ma\\u00f1ana","descripcion":"Yogur griego natural bajo en grasa con un pu\\u00f1ado peque\\u00f1o de nueces troceadas.","kcal":170,"p":12,"c":6,"g":11,"img_query":"greek yogurt walnuts"},{"id":3,"hora":"14:00","nombre":"Almuerzo","descripcion":"Pechuga de pollo a la plancha con quinoa cocida (carbohidrato complejo de absorci\\u00f3n lenta) y br\\u00f3coli al vapor.","kcal":580,"p":48,"c":55,"g":14,"img_query":"chicken quinoa broccoli"},{"id":4,"hora":"17:00","nombre":"Merienda","descripcion":"Bastones de apio y pepino para untar en hummus de garbanzo casero.","kcal":150,"p":5,"c":12,"g":9,"img_query":"hummus celery cucumber"},{"id":5,"hora":"20:30","nombre":"Cena","descripcion":"Filete de salm\\u00f3n al horno con esp\\u00e1rragos trigueros y ensalada de hojas verdes (cena reducida en carbohidratos).","kcal":410,"p":36,"c":8,"g":25,"img_query":"salmon asparagus salad"}]},{"dia":"Martes","comidas":[{"id":1,"hora":"08:00","nombre":"Desayuno","descripcion":"Tostada de pan de centeno integral con aguacate machacado y un huevo poch\\u00e9 (carbohidratos de liberaci\\u00f3n sostenida).","kcal":380,"p":18,"c":28,"g":20,"img_query":"avocado egg rye toast"},{"id":2,"hora":"11:00","nombre":"Media Ma\\u00f1ana","descripcion":"Un pu\\u00f1ado de almendras naturales y unas pocas frambuesas frescas.","kcal":140,"p":5,"c":8,"g":11,"img_query":"almonds raspberries"},{"id":3,"hora":"14:00","nombre":"Almuerzo","descripcion":"Garbanzos pedrosillanos salteados con espinacas frescas, ajo y bacalao desmigado (excelente aporte de fibra y prote\\u00edna).","kcal":550,"p":38,"c":48,"g":18,"img_query":"chickpeas spinach cod"},{"id":4,"hora":"17:00","nombre":"Merienda","descripcion":"Yogur natural desnatado mezclado con una cucharadita de semillas de calabaza.","kcal":150,"p":12,"c":8,"g":7,"img_query":"yogurt pumpkin seeds"},{"id":5,"hora":"20:30","nombre":"Cena","descripcion":"Pechuga de pavo a la plancha acompa\\u00f1ada de espaguetis de calabac\\u00edn (zoodles) al pesto ligero.","kcal":380,"p":40,"c":12,"g":18,"img_query":"turkey zucchini noodles pesto"}]},{"dia":"Mi\\u00e9rcoles","comidas":[{"id":1,"hora":"08:00","nombre":"Desayuno","descripcion":"Batido saciante de prote\\u00edna de suero, espinacas baby, fresas frescas y leche de almendras sin az\\u00facar.","kcal":320,"p":28,"c":25,"g":8,"img_query":"spinach strawberry protein smoothie"},{"id":2,"hora":"11:00","nombre":"Media Ma\\u00f1ana","descripcion":"Queso fresco batido 0% con un toque de canela y tres nueces enteras.","kcal":160,"p":15,"c":5,"g":9,"img_query":"cottage cheese walnuts"},{"id":3,"hora":"14:00","nombre":"Almuerzo","descripcion":"Lentejas estofadas con abundantes verduras y dados de tofu firme a la plancha (alta densidad de fibra).","kcal":520,"p":28,"c":55,"g":14,"img_query":"lentils vegetables tofu"},{"id":4,"hora":"17:00","nombre":"Merienda","descripcion":"Manzana verde laminada con una cucharadita de crema de almendras 100% pura.","kcal":180,"p":4,"c":18,"g":10,"img_query":"apple almond butter"},{"id":5,"hora":"20:30","nombre":"Cena","descripcion":"Lubina al horno sobre un lecho de esp\\u00e1rragos trigueros y champi\\u00f1ones laminados.","kcal":380,"p":36,"c":10,"g":18,"img_query":"baked sea bass mushrooms"}]},{"dia":"Jueves","comidas":[{"id":1,"hora":"08:00","nombre":"Desayuno","descripcion":"Tortilla de dos claras y un huevo entero con hojas de espinaca, servida con una rebanada de pan de centeno integral.","kcal":350,"p":24,"c":22,"g":16,"img_query":"spinach egg omelet rye"},{"id":2,"hora":"11:00","nombre":"Media Ma\\u00f1ana","descripcion":"Vaso de k\\u00e9fir natural sin az\\u00facar con una cucharadita de semillas de lino molidas.","kcal":130,"p":8,"c":8,"g":6,"img_query":"kefir flaxseeds"},{"id":3,"hora":"14:00","nombre":"Almuerzo","descripcion":"Tiras de pechuga de pavo salteadas con arroz salvaje integral y verduras variadas al wok.","kcal":540,"p":42,"c":50,"g":12,"img_query":"turkey wild rice vegetables"},{"id":4,"hora":"17:00","nombre":"Merienda","descripcion":"Guacamole casero (rico en grasas saludables) con bastoncitos de zanahoria fresca.","kcal":170,"p":3,"c":12,"g":12,"img_query":"guacamole carrots"},{"id":5,"hora":"20:30","nombre":"Cena","descripcion":"Hamburguesa de ternera magra a la plancha (sin pan) con ensalada de r\\u00facula, tomate de huerta y lascas de parmesano.","kcal":420,"p":38,"c":6,"g":26,"img_query":"beef patty arugula salad"}]},{"dia":"Viernes","comidas":[{"id":1,"hora":"08:00","nombre":"Desayuno","descripcion":"Yogur griego ligero con copos de avena finos, frutos rojos mezclados y una cucharadita de semillas de ch\\u00eda.","kcal":380,"p":20,"c":38,"g":12,"img_query":"greek yogurt oats berries"},{"id":2,"hora":"11:00","nombre":"Media Ma\\u00f1ana","descripcion":"Rodajas de pepino fresco con queso cottage bajo en grasa.","kcal":130,"p":14,"c":6,"g":4,"img_query":"cottage cheese cucumber"},{"id":3,"hora":"14:00","nombre":"Almuerzo","descripcion":"Garbanzos guisados con langostinos, ajo, perejil y un chorrito de aceite de oliva virgen extra.","kcal":540,"p":35,"c":48,"g":16,"img_query":"chickpeas prawns"},{"id":4,"hora":"17:00","nombre":"Merienda","descripcion":"Una onza de chocolate negro (m\\u00ednimo 85% cacao) y un pu\\u00f1ado de nueces enteras.","kcal":190,"p":4,"c":6,"g":17,"img_query":"dark chocolate walnuts"},{"id":5,"hora":"20:30","nombre":"Cena","descripcion":"Brochetas de pechuga de pollo, pimiento rojo y cebolla al grill, acompa\\u00f1adas de una ensalada verde mixta.","kcal":380,"p":38,"c":12,"g":14,"img_query":"chicken skewers salad"}]},{"dia":"S\\u00e1bado","comidas":[{"id":1,"hora":"08:30","nombre":"Desayuno","descripcion":"Tortitas caseras de avena integral y claras de huevo, endulzadas con eritritol y coronadas con ar\\u00e1ndanos.","kcal":360,"p":22,"c":40,"g":8,"img_query":"oat pancakes blueberries"},{"id":2,"hora":"11:30","nombre":"Media Ma\\u00f1ana","descripcion":"K\\u00e9fir natural sin az\\u00facar espolvoreado con un toque de canela de Ceil\\u00e1n.","kcal":110,"p":7,"c":8,"g":5,"img_query":"kefir cinnamon"},{"id":3,"hora":"14:30","nombre":"Almuerzo","descripcion":"Wraps en hojas de cogollo de lechuga (sustituyendo las tortillas de trigo) con pollo salteado, pimientos y guacamole.","kcal":480,"p":40,"c":15,"g":22,"img_query":"lettuce wrap chicken fajitas"},{"id":4,"hora":"17:30","nombre":"Merienda","descripcion":"Un pu\\u00f1ado de almendras crudas con piel.","kcal":160,"p":6,"c":5,"g":14,"img_query":"almonds"},{"id":5,"hora":"21:00","nombre":"Cena","descripcion":"Filete de trucha al horno con jud\\u00edas verdes salteadas y almendras laminadas.","kcal":420,"p":36,"c":10,"g":24,"img_query":"trout green beans"}]},{"dia":"Domingo","comidas":[{"id":1,"hora":"08:30","nombre":"Desayuno","descripcion":"Huevos revueltos (un huevo entero y dos claras) con champi\\u00f1ones, servidos con una tostada de pan integral de centeno.","kcal":380,"p":22,"c":20,"g":18,"img_query":"scrambled eggs mushrooms rye"},{"id":2,"hora":"11:30","nombre":"Media Ma\\u00f1ana","descripcion":"Yogur natural entero sin az\\u00facar con un pu\\u00f1ado de frambuesas.","kcal":140,"p":8,"c":10,"g":6,"img_query":"yogurt raspberries"},{"id":3,"hora":"14:30","nombre":"Almuerzo","descripcion":"Arroz integral marinero cocinado a fuego lento con gambas, mejillones y un sofrito abundante de verduras.","kcal":550,"p":32,"c":60,"g":12,"img_query":"seafood brown rice"},{"id":4,"hora":"17:30","nombre":"Merienda","descripcion":"Bastoncitos de apio fresco untados con una cucharadita de crema de cacahuete pura.","kcal":160,"p":5,"c":8,"g":12,"img_query":"celery peanut butter"},{"id":5,"hora":"21:00","nombre":"Cena","descripcion":"Filete de pechuga de pavo al horno con calabac\\u00edn, berenjena y pimiento rojo asados con hierbas provenzales.","kcal":390,"p":38,"c":18,"g":14,"img_query":"turkey roasted vegetables"}]}]}', 1, '2026-07-25 11:23:13', '2026-07-25 11:23:13'),
	('01a12d61-f225-71ac-b225-b9e1d1f3f76e', '01a12d5f-82bd-71ca-bdf4-9bdc6383b567', '{"dias":[{"dia":"Lunes","comidas":[{"id":1,"hora":"07:30","nombre":"Desayuno","descripcion":"Avena cocida con leche desnatada, pl\\u00e1tano en rodajas, semillas de ch\\u00eda y un pu\\u00f1ado de nueces.","kcal":450,"p":25,"c":60,"g":12,"img_query":"oatmeal banana nuts"},{"id":2,"hora":"10:30","nombre":"Media Ma\\u00f1ana","descripcion":"Yogur griego bajo en grasa mezclado con ar\\u00e1ndanos frescos.","kcal":200,"p":15,"c":20,"g":6,"img_query":"greek yogurt blueberries"},{"id":3,"hora":"13:30","nombre":"Almuerzo","descripcion":"Pechuga de pollo a la plancha acompa\\u00f1ada de arroz integral y salteado de verduras (pimiento, calabac\\u00edn y zanahoria).","kcal":650,"p":45,"c":70,"g":18,"img_query":"grilled chicken rice"},{"id":4,"hora":"16:30","nombre":"Merienda","descripcion":"Una manzana mediana verde junto con un pu\\u00f1ado peque\\u00f1o de almendras al natural.","kcal":200,"p":6,"c":25,"g":10,"img_query":"apple almonds snack"},{"id":5,"hora":"20:00","nombre":"Cena","descripcion":"Lomo de salm\\u00f3n al horno con esp\\u00e1rragos trigosos y patata peque\\u00f1a asada.","kcal":500,"p":38,"c":40,"g":18,"img_query":"baked salmon asparagus"}]},{"dia":"Martes","comidas":[{"id":1,"hora":"07:30","nombre":"Desayuno","descripcion":"Tostadas de pan de centeno con aguacate machacado y dos huevos escalfados.","kcal":450,"p":20,"c":45,"g":20,"img_query":"avocado egg toast"},{"id":2,"hora":"10:30","nombre":"Media Ma\\u00f1ana","descripcion":"Batido de prote\\u00edna de suero con fresas congeladas y agua o leche vegetal.","kcal":200,"p":22,"c":20,"g":3,"img_query":"strawberry protein smoothie"},{"id":3,"hora":"13:30","nombre":"Almuerzo","descripcion":"Lentejas estofadas con zanahoria, pimiento, tomate y una porci\\u00f3n de quinua.","kcal":650,"p":30,"c":90,"g":12,"img_query":"lentil quinoa soup"},{"id":4,"hora":"16:30","nombre":"Merienda","descripcion":"Queso fresco batido con un toque de canela y nueces troceadas.","kcal":200,"p":14,"c":8,"g":12,"img_query":"cottage cheese walnuts"},{"id":5,"hora":"20:00","nombre":"Cena","descripcion":"Filete de merluza a la plancha con ensalada mixta de can\\u00f3nigos, tomate y camote al horno.","kcal":500,"p":35,"c":45,"g":12,"img_query":"grilled fish salad"}]},{"dia":"Mi\\u00e9rcoles","comidas":[{"id":1,"hora":"07:30","nombre":"Desayuno","descripcion":"Tortitas caseras de avena y claras de huevo servidas con frutos rojos frescos.","kcal":450,"p":28,"c":55,"g":10,"img_query":"oatmeal pancakes berries"},{"id":2,"hora":"10:30","nombre":"Media Ma\\u00f1ana","descripcion":"K\\u00e9fir natural acompa\\u00f1ado de semillas de lino y rodajas de kiwi.","kcal":200,"p":10,"c":24,"g":6,"img_query":"kefir kiwi chia"},{"id":3,"hora":"13:30","nombre":"Almuerzo","descripcion":"Tofu firme salteado con br\\u00f3coli, champi\\u00f1ones y fideos de arroz integrales con salsa de soja baja en sodio.","kcal":650,"p":30,"c":80,"g":18,"img_query":"stir fry tofu noodles"},{"id":4,"hora":"16:30","nombre":"Merienda","descripcion":"Hummus tradicional con bastones de zanahoria y apio fresco.","kcal":200,"p":8,"c":22,"g":10,"img_query":"hummus carrot sticks"},{"id":5,"hora":"20:00","nombre":"Cena","descripcion":"Pechuga de pavo a la plancha con cusc\\u00fas integral y br\\u00f3coli al vapor al lim\\u00f3n.","kcal":500,"p":42,"c":45,"g":10,"img_query":"turkey broccoli couscous"}]},{"dia":"Jueves","comidas":[{"id":1,"hora":"07:30","nombre":"Desayuno","descripcion":"Bowl de yogur natural no azucarado con granola integral, semillas de calabaza y frambuesas.","kcal":450,"p":18,"c":65,"g":12,"img_query":"yogurt granola fruit"},{"id":2,"hora":"10:30","nombre":"Media Ma\\u00f1ana","descripcion":"Dos mandarinas y un pu\\u00f1ado peque\\u00f1o de anacardos tostados sin sal.","kcal":200,"p":6,"c":22,"g":11,"img_query":"cashews orange fruit"},{"id":3,"hora":"13:30","nombre":"Almuerzo","descripcion":"Filete de ternera magra a la plancha con pur\\u00e9 de patata casero y jud\\u00edas verdes al vapor.","kcal":650,"p":45,"c":60,"g":20,"img_query":"steak mashed potatoes"},{"id":4,"hora":"16:30","nombre":"Merienda","descripcion":"Tortitas de arroz integral untadas con crema de cacahuete 100% natural.","kcal":200,"p":8,"c":20,"g":10,"img_query":"rice cakes peanutbutter"},{" contract":5,"hora":"20:00","nombre":"Cena","descripcion":"Ensalada templada de at\\u00fan al natural, huevo duro, espinacas frescas, tomate cherry y quinoa.","kcal":500,"p":40,"c":35,"g":16,"img_query":"tuna egg salad"}]},{"dia":"Viernes","comidas":[{"id":1,"hora":"07:30","nombre":"Desayuno","descripcion":"Huevos revueltos con espinacas frescas servidos sobre pan integral tostado.","kcal":450,"p":25,"c":40,"g":18,"img_query":"scrambled eggs spinach"},{"id":2,"hora":"10:30","nombre":"Media Ma\\u00f1ana","descripcion":"Rodajas de pi\\u00f1a natural acompa\\u00f1adas de queso fresco tipo burgos.","kcal":200,"p":12,"c":25,"g":2,"img_query":"pineapple cottage cheese"},{"id":3,"hora":"13:30","nombre":"Almuerzo","descripcion":"Arroz con garbanzos, espinacas y cebolla pochada con aceite de oliva virgen extra.","kcal":650,"p":25,"c":95,"g":12,"img_query":"chickpea rice vegetables"},{"id":4,"hora":"16:30","nombre":"Merienda","descripcion":"Una pera jugosa con un pu\\u00f1ado peque\\u00f1o de pistachos pelados.","kcal":200,"p":7,"c":23,"g":10,"img_query":"pistachios fresh pear"},{"id":5,"hora":"20:00","nombre":"Cena","descripcion":"Lubina al horno sobre cama de pimientos, calabac\\u00edn y cebolla asada.","kcal":500,"p":38,"c":30,"g":18,"img_query":"baked sea bass"}]},{"dia":"S\\u00e1bado","comidas":[{"id":1,"hora":"08:00","nombre":"Desayuno","descripcion":"Porridge de avena con manzana picada, canela en polvo y semillas de girasol.","kcal":450,"p":20,"c":65,"g":10,"img_query":"apple cinnamon oatmeal"},{"id":2,"hora":"11:00","nombre":"Media Ma\\u00f1ana","descripcion":"Batido verde de espinacas, media manzana, prote\\u00edna en polvo y agua de coco.","kcal":200,"p":20,"c":20,"g":2,"img_query":"green protein smoothie"},{"id":3,"hora":"14:00","nombre":"Almuerzo","descripcion":"Fajitas integrales de pollo sazonado con pimientos, cebolla y un toque de guacamole.","kcal":650,"p":42,"c":60,"g":22,"img_query":"chicken fajitas guacamole"},{"id":4,"hora":"17:30","nombre":"Merienda","descripcion":"Dos onzas de chocolate negro (85% cacao) y unas cuantas avellanas.","kcal":200,"p":5,"c":12,"g":16,"img_query":"dark chocolate hazelnuts"},{"id":5,"hora":"20:30","nombre":"Cena","descripcion":"Crema casera de calabaza y zanahoria servida con pechuga de pollo desmenuzada y semillas.","kcal":500,"p":35,"c":40,"g":14,"img_query":"pumpkin soup chicken"}]},{"dia":"Domingo","comidas":[{"id":1,"hora":"08:30","nombre":"Desayuno","descripcion":"Tostada de pan de masa madre con queso crema ligero, salm\\u00f3n ahumado y eneldo.","kcal":450,"p":26,"c":40,"g":16,"img_query":"smoked salmon toast"},{"id":2,"hora":"11:30","nombre":"Media Ma\\u00f1ana","descripcion":"Yogur natural entero mezclado con trozos de kiwi fresco.","kcal":200,"p":10,"c":24,"g":5,"img_query":"yogurt kiwi fruit"},{"id":3,"hora":"14:00","nombre":"Almuerzo","descripcion":"Hamburguesa casera de pavo magro al plato con ensalada de la casa y boniato asado en gajos.","kcal":650,"p":40,"c":65,"g":18,"img_query":"turkey burger sweetpotato"},{"id":4,"hora":"17:30","nombre":"Merienda","descripcion":"Compota de manzana casera sin az\\u00facar a\\u00f1adido con canela y nueces troceadas.","kcal":200,"p":4,"c":28,"g":9,"img_query":"applesauce walnuts cinnamon"},{"id":5,"hora":"20:30","nombre":"Cena","descripcion":"Tortilla francesa de dos huevos con calabac\\u00edn y cebolla, acompa\\u00f1ada de ensalada de tomate.","kcal":500,"p":22,"c":30,"g":22,"img_query":"zucchini omelette salad"}]}]}', 1, '2026-10-12 04:52:36', '2026-10-12 04:52:36'),
	('01a1f03c-a12d-73e0-844b-a2c31d7a4b41', '01a1f028-ac68-714c-867a-1c4c80a1c382', '{"dias":[{"dia":"Lunes","comidas":[{"id":1,"hora":"07:00","nombre":"Desayuno","descripcion":"Avena con leche y frutas mixtas","kcal":420,"p":25,"c":55,"g":10,"img_query":"oatmeal berries"},{"id":2,"hora":"10:00","nombre":"Media Ma\\u00f1ana","descripcion":"Yogurt griego con nueces","kcal":210,"p":18,"c":20,"g":8,"img_query":"greek yogurt nuts"},{"id":3,"hora":"13:00","nombre":"Almuerzo","descripcion":"Pechuga de pollo con arroz integral y ensalada","kcal":620,"p":50,"c":65,"g":12,"img_query":"chicken breast rice"},{"id":4,"hora":"16:30","nombre":"Merienda","descripcion":"Manzana con mantequilla de man\\u00ed","kcal":190,"p":8,"c":24,"g":8,"img_query":"apple peanut butter"},{"id":5,"hora":"19:30","nombre":"Cena","descripcion":"Salm\\u00f3n al horno con br\\u00f3coli y batata","kcal":510,"p":42,"c":38,"g":18,"img_query":"salmon broccoli"}]},{"dia":"Martes","comidas":[{"id":1,"hora":"07:00","nombre":"Desayuno","descripcion":"Avena con leche y frutas mixtas","kcal":420,"p":25,"c":55,"g":10,"img_query":"oatmeal berries"},{"id":2,"hora":"10:00","nombre":"Media Ma\\u00f1ana","descripcion":"Yogurt griego con nueces","kcal":210,"p":18,"c":20,"g":8,"img_query":"greek yogurt nuts"},{"id":3,"hora":"13:00","nombre":"Almuerzo","descripcion":"Pechuga de pollo con arroz integral y ensalada","kcal":620,"p":50,"c":65,"g":12,"img_query":"chicken breast rice"},{"id":4,"hora":"16:30","nombre":"Merienda","descripcion":"Manzana con mantequilla de man\\u00ed","kcal":190,"p":8,"c":24,"g":8,"img_query":"apple peanut butter"},{"id":5,"hora":"19:30","nombre":"Cena","descripcion":"Salm\\u00f3n al horno con br\\u00f3coli y batata","kcal":510,"p":42,"c":38,"g":18,"img_query":"salmon broccoli"}]},{"dia":"Mi\\u00e9rcoles","comidas":[{"id":1,"hora":"07:00","nombre":"Desayuno","descripcion":"Avena con leche y frutas mixtas","kcal":420,"p":25,"c":55,"g":10,"img_query":"oatmeal berries"},{"id":2,"hora":"10:00","nombre":"Media Ma\\u00f1ana","descripcion":"Yogurt griego con nueces","kcal":210,"p":18,"c":20,"g":8,"img_query":"greek yogurt nuts"},{"id":3,"hora":"13:00","nombre":"Almuerzo","descripcion":"Pechuga de pollo con arroz integral y ensalada","kcal":620,"p":50,"c":65,"g":12,"img_query":"chicken breast rice"},{"id":4,"hora":"16:30","nombre":"Merienda","descripcion":"Manzana con mantequilla de man\\u00ed","kcal":190,"p":8,"c":24,"g":8,"img_query":"apple peanut butter"},{"id":5,"hora":"19:30","nombre":"Cena","descripcion":"Salm\\u00f3n al horno con br\\u00f3coli y batata","kcal":510,"p":42,"c":38,"g":18,"img_query":"salmon broccoli"}]},{"dia":"Jueves","comidas":[{"id":1,"hora":"07:00","nombre":"Desayuno","descripcion":"Avena con leche y frutas mixtas","kcal":420,"p":25,"c":55,"g":10,"img_query":"oatmeal berries"},{"id":2,"hora":"10:00","nombre":"Media Ma\\u00f1ana","descripcion":"Yogurt griego con nueces","kcal":210,"p":18,"c":20,"g":8,"img_query":"greek yogurt nuts"},{"id":3,"hora":"13:00","nombre":"Almuerzo","descripcion":"Pechuga de pollo con arroz integral y ensalada","kcal":620,"p":50,"c":65,"g":12,"img_query":"chicken breast rice"},{"id":4,"hora":"16:30","nombre":"Merienda","descripcion":"Manzana con mantequilla de man\\u00ed","kcal":190,"p":8,"c":24,"g":8,"img_query":"apple peanut butter"},{"id":5,"hora":"19:30","nombre":"Cena","descripcion":"Salm\\u00f3n al horno con br\\u00f3coli y batata","kcal":510,"p":42,"c":38,"g":18,"img_query":"salmon broccoli"}]},{"dia":"Viernes","comidas":[{"id":1,"hora":"07:00","nombre":"Desayuno","descripcion":"Avena con leche y frutas mixtas","kcal":420,"p":25,"c":55,"g":10,"img_query":"oatmeal berries"},{"id":2,"hora":"10:00","nombre":"Media Ma\\u00f1ana","descripcion":"Yogurt griego con nueces","kcal":210,"p":18,"c":20,"g":8,"img_query":"greek yogurt nuts"},{"id":3,"hora":"13:00","nombre":"Almuerzo","descripcion":"Pechuga de pollo con arroz integral y ensalada","kcal":620,"p":50,"c":65,"g":12,"img_query":"chicken breast rice"},{"id":4,"hora":"16:30","nombre":"Merienda","descripcion":"Manzana con mantequilla de man\\u00ed","kcal":190,"p":8,"c":24,"g":8,"img_query":"apple peanut butter"},{"id":5,"hora":"19:30","nombre":"Cena","descripcion":"Salm\\u00f3n al horno con br\\u00f3coli y batata","kcal":510,"p":42,"c":38,"g":18,"img_query":"salmon broccoli"}]},{"dia":"S\\u00e1bado","comidas":[{"id":1,"hora":"07:00","nombre":"Desayuno","descripcion":"Avena con leche y frutas mixtas","kcal":420,"p":25,"c":55,"g":10,"img_query":"oatmeal berries"},{"id":2,"hora":"10:00","nombre":"Media Ma\\u00f1ana","descripcion":"Yogurt griego con nueces","kcal":210,"p":18,"c":20,"g":8,"img_query":"greek yogurt nuts"},{"id":3,"hora":"13:00","nombre":"Almuerzo","descripcion":"Pechuga de pollo con arroz integral y ensalada","kcal":620,"p":50,"c":65,"g":12,"img_query":"chicken breast rice"},{"id":4,"hora":"16:30","nombre":"Merienda","descripcion":"Manzana con mantequilla de man\\u00ed","kcal":190,"p":8,"c":24,"g":8,"img_query":"apple peanut butter"},{"id":5,"hora":"19:30","nombre":"Cena","descripcion":"Salm\\u00f3n al horno con br\\u00f3coli y batata","kcal":510,"p":42,"c":38,"g":18,"img_query":"salmon broccoli"}]},{"dia":"Domingo","comidas":[{"id":1,"hora":"07:00","nombre":"Desayuno","descripcion":"Avena con leche y frutas mixtas","kcal":420,"p":25,"c":55,"g":10,"img_query":"oatmeal berries"},{"id":2,"hora":"10:00","nombre":"Media Ma\\u00f1ana","descripcion":"Yogurt griego con nueces","kcal":210,"p":18,"c":20,"g":8,"img_query":"greek yogurt nuts"},{"id":3,"hora":"13:00","nombre":"Almuerzo","descripcion":"Pechuga de pollo con arroz integral y ensalada","kcal":620,"p":50,"c":65,"g":12,"img_query":"chicken breast rice"},{"id":4,"hora":"16:30","nombre":"Merienda","descripcion":"Manzana con mantequilla de man\\u00ed","kcal":190,"p":8,"c":24,"g":8,"img_query":"apple peanut butter"},{"id":5,"hora":"19:30","nombre":"Cena","descripcion":"Salm\\u00f3n al horno con br\\u00f3coli y batata","kcal":510,"p":42,"c":38,"g":18,"img_query":"salmon broccoli"}]}]}', 1, '2026-11-19 00:57:47', '2026-11-19 00:57:47');

-- Volcando estructura para tabla gym_track_db.rutina_progresos
CREATE TABLE IF NOT EXISTS `rutina_progresos` (
  `id` char(36) NOT NULL,
  `user_id` char(36) NOT NULL,
  `rutina_id` char(36) NOT NULL,
  `progreso_json` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`progreso_json`)),
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `rutina_progresos_user_id_rutina_id_unique` (`user_id`,`rutina_id`),
  KEY `rutina_progresos_rutina_id_foreign` (`rutina_id`),
  CONSTRAINT `rutina_progresos_rutina_id_foreign` FOREIGN KEY (`rutina_id`) REFERENCES `rutinas` (`id`) ON DELETE CASCADE,
  CONSTRAINT `rutina_progresos_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Volcando datos para la tabla gym_track_db.rutina_progresos: ~2 rows (aproximadamente)

-- Volcando estructura para tabla gym_track_db.rutinas
CREATE TABLE IF NOT EXISTS `rutinas` (
  `id` char(36) NOT NULL,
  `user_id` char(36) NOT NULL,
  `plan_semanal` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`plan_semanal`)),
  `activa` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `rutinas_user_id_foreign` (`user_id`),
  CONSTRAINT `rutinas_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Volcando datos para la tabla gym_track_db.rutinas: ~4 rows (aproximadamente)
INSERT INTO `rutinas` (`id`, `user_id`, `plan_semanal`, `activa`, `created_at`, `updated_at`) VALUES
	('01a21743-e70c-7068-99c1-9df740c38316', '01a21743-c428-70c4-8271-c9b0f5775bd0', '{"dias":[{"dia":"D\\u00eda 1","grupo_muscular":"Parte Superior (Pecho y Espalda)","duracion_estimada":"60 min","intensidad":"Alta","semana_plan":1,"ejercicios":[{"nombre":"Press de Pecho en m\\u00e1quina \\/ Push-ups","series":3,"repeticiones":"10-12","descanso":"60s"},{"nombre":"Jal\\u00f3n al pecho \\/ Remo","series":3,"repeticiones":"10-12","descanso":"60s"}]},{"dia":"D\\u00eda 2","grupo_muscular":"Tren Inferior (Piernas)","duracion_estimada":"70 min","intensidad":"Alta","semana_plan":1,"ejercicios":[{"nombre":"Sentadillas \\/ Prensa de Piernas","series":3,"repeticiones":"12-15","descanso":"90s"},{"nombre":"Extensiones de Cu\\u00e1driceps","series":3,"repeticiones":"15","descanso":"60s"}]},{"dia":"D\\u00eda 3","grupo_muscular":"Hombros y Brazos","duracion_estimada":"55 min","intensidad":"Media","semana_plan":1,"ejercicios":[{"nombre":"Elevaciones laterales","series":3,"repeticiones":"12-15","descanso":"60s"},{"nombre":"Curl de B\\u00edceps","series":3,"repeticiones":"12","descanso":"60s"},{"nombre":"Extensi\\u00f3n de Tr\\u00edceps","series":3,"repeticiones":"12","descanso":"60s"}]}]}', 1, '2026-11-26 14:50:55', '2026-11-26 14:50:55');

-- Volcando estructura para tabla gym_track_db.sesiones_entrenamiento
CREATE TABLE IF NOT EXISTS `sesiones_entrenamiento` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `user_id` char(36) NOT NULL,
  `rutina_id` char(36) DEFAULT NULL,
  `dia_rutina` varchar(255) NOT NULL,
  `duracion_minutos` int(11) NOT NULL,
  `detalles_sesion` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`detalles_sesion`)),
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `sesiones_entrenamiento_user_id_foreign` (`user_id`),
  KEY `sesiones_entrenamiento_rutina_id_foreign` (`rutina_id`),
  CONSTRAINT `sesiones_entrenamiento_rutina_id_foreign` FOREIGN KEY (`rutina_id`) REFERENCES `rutinas` (`id`) ON DELETE SET NULL,
  CONSTRAINT `sesiones_entrenamiento_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Volcando datos para la tabla gym_track_db.sesiones_entrenamiento: ~7 rows (aproximadamente)

-- Volcando estructura para tabla gym_track_db.sessions
CREATE TABLE IF NOT EXISTS `sessions` (
  `id` varchar(255) NOT NULL,
  `user_id` char(36) DEFAULT NULL,
  `ip_address` varchar(45) DEFAULT NULL,
  `user_agent` text DEFAULT NULL,
  `payload` longtext NOT NULL,
  `last_activity` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `sessions_user_id_index` (`user_id`),
  KEY `sessions_last_activity_index` (`last_activity`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Volcando datos para la tabla gym_track_db.sessions: ~0 rows (aproximadamente)
INSERT INTO `sessions` (`id`, `user_id`, `ip_address`, `user_agent`, `payload`, `last_activity`) VALUES
	('VaGvgsKTMQJz5MhDWcI2Fwl6Oqe64LNC74CA9N5N', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36 Edg/149.0.0.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoicE56d0l4aXk1Y1dnSHMwSDNxYmpVUmdSSVBhZ0U3czZtVGpTM0VtOCI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6MjE6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMCI7czo1OiJyb3V0ZSI7Tjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1782308879);

-- Volcando estructura para tabla gym_track_db.transacciones
CREATE TABLE IF NOT EXISTS `transacciones` (
  `id` char(36) NOT NULL,
  `cliente_id` char(36) DEFAULT NULL,
  `concepto` varchar(255) NOT NULL,
  `monto` decimal(10,2) NOT NULL,
  `metodo_pago` varchar(255) NOT NULL,
  `estado` enum('completado','pendiente','rechazado') NOT NULL DEFAULT 'pendiente',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `transacciones_cliente_id_foreign` (`cliente_id`),
  CONSTRAINT `transacciones_cliente_id_foreign` FOREIGN KEY (`cliente_id`) REFERENCES `clientes` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Volcando datos para la tabla gym_track_db.transacciones: ~54 rows (aproximadamente)
INSERT INTO `transacciones` (`id`, `cliente_id`, `concepto`, `monto`, `metodo_pago`, `estado`, `created_at`, `updated_at`) VALUES
	('00e2d33b-cf16-47fd-9c68-dfd6545e6c1a', NULL, 'Renovación: Plan Trimestral', 480000.00, 'tarjeta', 'completado', '2026-06-11 01:21:17', '2026-06-11 01:21:17'),
	('019e1e6b-9ab5-71df-81f3-55340a37d5a9', '019e1d82-c064-7166-bac5-27718b34dd2e', 'Membresía Premium', 79.99, 'Tarjeta', 'completado', '2026-05-07 04:00:28', '2026-05-13 04:00:28'),
	('019e1e6b-9ac4-7389-9dd5-be6edb7eacad', '019e1d82-c064-7166-bac5-27718b34dd2e', 'Membresía Premium', 79.99, 'Transferencia', 'completado', '2026-04-16 04:00:28', '2026-05-13 04:00:28'),
	('019e1e6b-9ac8-7223-8f1a-b3ba3b92930e', '019e1d82-c064-7166-bac5-27718b34dd2e', 'Clase Personal - Yoga', 25.00, 'Efectivo', 'completado', '2026-05-13 04:00:29', '2026-05-13 04:00:29'),
	('019e1e6b-9ace-701a-8226-c0b621d8d093', '019e1d82-c064-7166-bac5-27718b34dd2e', 'Membresía Básica', 39.99, 'Tarjeta', 'completado', '2026-04-13 04:00:29', '2026-05-13 04:00:29'),
	('019e1e6b-9ad2-7166-9b57-3c32365be0cc', '019e1d82-c064-7166-bac5-27718b34dd2e', 'Renovación Membresía', 39.99, 'PayPal', 'completado', '2026-04-20 04:00:29', '2026-05-13 04:00:29'),
	('019e1e6b-9ad6-73cc-99d7-2b0f356eab5a', '019e1d82-c064-7166-bac5-27718b34dd2e', 'Clase Grupal - HIIT', 15.00, 'Tarjeta', 'pendiente', '2026-04-23 04:00:29', '2026-05-13 04:00:29'),
	('019e1e6b-9ad9-729b-98b8-4b2834994a6c', '019e1d82-c064-7166-bac5-27718b34dd2e', 'Suplementos Proteína', 45.50, 'Tarjeta', 'rechazado', '2026-05-02 04:00:29', '2026-05-13 04:00:29'),
	('019e1e6b-9adc-713c-a73e-da1719cac58c', '019e1d82-c064-7166-bac5-27718b34dd2e', 'Membresía Premium', 79.99, 'Transferencia', 'pendiente', '2026-05-01 04:00:29', '2026-05-13 04:00:29'),
	('019e1e6b-9adf-73da-b63c-d5fc7c6c3b0b', '019e1d82-c064-7166-bac5-27718b34dd2e', 'Entrenamiento Funcional', 30.00, 'Efectivo', 'completado', '2026-05-07 04:00:29', '2026-05-13 04:00:29'),
	('019e1e6b-9ae2-7188-9be9-f719080bad85', '019e1d82-c064-7166-bac5-27718b34dd2e', 'Membresía Básica', 39.99, 'PayPal', 'rechazado', '2026-04-26 04:00:29', '2026-05-13 04:00:29'),
	('019e1e71-07f2-7153-b1f1-aa40fc4c0a13', NULL, 'Membresía Premium', 79.99, 'Tarjeta', 'completado', '2026-05-04 04:06:24', '2026-05-13 04:06:24'),
	('019e1e71-07f6-713f-81a3-8a0e96d261a0', NULL, 'Membresía Premium', 79.99, 'Transferencia', 'completado', '2026-04-30 04:06:24', '2026-05-13 04:06:24'),
	('019e1e71-07f9-7221-84f3-6808dc91883f', NULL, 'Clase Personal - Yoga', 25.00, 'Efectivo', 'completado', '2026-04-29 04:06:24', '2026-05-13 04:06:24'),
	('019e1e71-07fc-725f-b0d7-c83a41ff2b4d', NULL, 'Membresía Básica', 39.99, 'Tarjeta', 'completado', '2026-04-17 04:06:24', '2026-05-13 04:06:24'),
	('019e1e71-07ff-73e4-9be8-c15e2eda58d7', NULL, 'Renovación Membresía', 39.99, 'PayPal', 'completado', '2026-04-16 04:06:24', '2026-05-13 04:06:24'),
	('019e1e71-0802-72bb-8a44-b5659931652d', NULL, 'Clase Grupal - HIIT', 15.00, 'Tarjeta', 'pendiente', '2026-04-21 04:06:24', '2026-05-13 04:06:24'),
	('019e1e71-0804-7348-a176-b9f601db3726', NULL, 'Suplementos Proteína', 45.50, 'Tarjeta', 'rechazado', '2026-04-24 04:06:24', '2026-05-13 04:06:24'),
	('019e1e71-0807-73bc-a947-c3cbd1c25cc8', NULL, 'Membresía Premium', 79.99, 'Transferencia', 'pendiente', '2026-04-16 04:06:24', '2026-05-13 04:06:24'),
	('019e1e71-080a-72dc-8c81-c7ee33ae0266', NULL, 'Entrenamiento Funcional', 30.00, 'Efectivo', 'completado', '2026-05-03 04:06:24', '2026-05-13 04:06:24'),
	('019e1e71-080c-726b-96cd-7a939c9aa7c5', NULL, 'Membresía Básica', 39.99, 'PayPal', 'rechazado', '2026-05-12 04:06:24', '2026-05-13 04:06:24'),
	('019e1e75-cd18-72c7-a001-8f3316172e58', NULL, 'Membresía Premium', 79.99, 'Tarjeta', 'completado', '2026-04-26 04:11:37', '2026-05-13 04:11:37'),
	('019e1e75-cd1b-713b-a4f0-2f51caa97295', NULL, 'Membresía Premium', 79.99, 'Transferencia', 'completado', '2026-04-24 04:11:37', '2026-05-13 04:11:37'),
	('019e1e75-cd1d-7040-bd03-217a5bc9014e', NULL, 'Clase Personal - Yoga', 25.00, 'Efectivo', 'completado', '2026-04-19 04:11:37', '2026-05-13 04:11:37'),
	('019e1e75-cd20-728b-996e-be53ce5a50ed', NULL, 'Membresía Básica', 39.99, 'Tarjeta', 'completado', '2026-05-05 04:11:37', '2026-05-13 04:11:37'),
	('019e1e75-cd24-7008-9e78-11391cd09a75', NULL, 'Renovación Membresía', 39.99, 'PayPal', 'completado', '2026-05-09 04:11:37', '2026-05-13 04:11:37'),
	('019e1e75-cd27-73c1-97fc-834795604452', NULL, 'Clase Grupal - HIIT', 15.00, 'Tarjeta', 'completado', '2026-05-07 04:11:37', '2026-05-14 00:51:29'),
	('019e1e75-cd29-73f5-8c0b-ce677de23242', NULL, 'Suplementos Proteína', 45.50, 'Tarjeta', 'rechazado', '2026-04-22 04:11:37', '2026-05-13 04:11:37'),
	('019e1e75-cd2c-7127-ba3a-cf6c18b16a13', NULL, 'Membresía Premium', 79.99, 'Transferencia', 'pendiente', '2026-05-06 04:11:37', '2026-05-13 04:11:37'),
	('019e1e75-cd2e-716e-a971-41a28f573d58', NULL, 'Entrenamiento Funcional', 30.00, 'Efectivo', 'completado', '2026-05-02 04:11:37', '2026-05-13 04:11:37'),
	('019e1e75-cd30-73d5-956a-37e8e2733abc', NULL, 'Membresía Básica', 39.99, 'PayPal', 'rechazado', '2026-04-16 04:11:37', '2026-05-13 04:11:37'),
	('019e1e83-36ee-7152-9233-3764c06db862', NULL, 'Membresía Premium', 120000.00, 'Tarjeta', 'completado', '2026-04-19 04:26:16', '2026-05-13 04:26:16'),
	('019e1e83-3705-7216-85c9-83b61dca4445', NULL, 'Membresía Premium', 120000.00, 'Transferencia', 'completado', '2026-05-08 04:26:16', '2026-05-13 04:26:16'),
	('019e1e83-3709-70c8-b138-2e9c8bf07aae', NULL, 'Clase Personal - Yoga', 45000.00, 'Efectivo', 'completado', '2026-04-21 04:26:16', '2026-05-13 04:26:16'),
	('019e1e83-370d-7355-afb3-611a842b3d1b', NULL, 'Membresía Básica', 60000.00, 'Tarjeta', 'completado', '2026-04-25 04:26:16', '2026-05-13 04:26:16'),
	('019e1e83-3711-727e-a4e7-17d99922b885', NULL, 'Renovación Membresía', 60000.00, 'PayPal', 'completado', '2026-05-10 04:26:16', '2026-05-13 04:26:16'),
	('019e1e83-3715-70ad-8ce0-5434912a71eb', NULL, 'Clase Grupal - HIIT', 25000.00, 'Tarjeta', 'completado', '2026-05-10 04:26:16', '2026-05-14 00:51:15'),
	('019e1e83-3718-73be-9033-550c9e51e7e5', NULL, 'Suplementos Proteína', 150000.00, 'Tarjeta', 'rechazado', '2026-04-19 04:26:16', '2026-05-13 04:26:16'),
	('019e1e83-3724-713e-87c9-51077b1c3146', NULL, 'Membresía Premium', 120000.00, 'Transferencia', 'pendiente', '2026-04-21 04:26:16', '2026-05-13 04:26:16'),
	('019e1e83-3728-73bc-ab39-2e79c0c293c1', NULL, 'Entrenamiento Funcional', 50000.00, 'Efectivo', 'completado', '2026-04-29 04:26:16', '2026-05-13 04:26:16'),
	('019e1e83-372b-7177-8772-a051688b3564', NULL, 'Membresía Básica', 60000.00, 'PayPal', 'rechazado', '2026-05-05 04:26:16', '2026-05-13 04:26:16'),
	('0e28a5ae-c92d-423b-aef2-bbb5aa123919', NULL, 'Renovación: Plan Trimestral', 480000.00, 'transferencia', 'completado', '2026-06-11 01:21:47', '2026-06-11 01:22:00'),
	('157544cd-89b4-4652-b5c7-a8a8a91bcdba', NULL, 'Renovación: Plan Trimestral', 480000.00, 'transferencia', 'completado', '2026-05-13 04:49:10', '2026-05-13 04:49:10'),
	('18932eef-3cd0-4c64-a228-c8908ff5e003', NULL, 'Renovación: Plan Trimestral', 480000.00, 'transferencia', 'completado', '2026-05-15 06:15:22', '2026-05-15 06:15:56'),
	('2880985a-779f-4cff-960d-cf3cf966b1aa', NULL, 'Renovación: Plan Mensual', 180000.00, 'tarjeta', 'completado', '2026-10-12 05:36:06', '2026-10-12 05:36:06'),
	('2c10830d-471a-4390-af52-456b3830da3b', NULL, 'Renovación: Plan Trimestral', 480000.00, 'transferencia', 'completado', '2026-06-26 00:46:00', '2026-06-26 00:46:21'),
	('420fb2fc-8ceb-4d7f-8c4f-4600727c9511', NULL, 'Renovación: Plan Mensual', 180000.00, 'tarjeta', 'completado', '2026-10-08 07:18:19', '2026-10-08 07:18:19'),
	('556c6d39-354f-4489-a1fe-49e9ae4707e3', NULL, 'Renovación: Plan Mensual', 180000.00, 'transferencia', 'completado', '2026-10-08 07:18:43', '2026-10-08 07:19:27'),
	('6536dbbc-0c3c-458d-a421-e71b5ce1e7ce', NULL, 'Renovación: Plan Mensual', 180000.00, 'transferencia', 'completado', '2026-06-12 04:54:28', '2026-06-12 04:56:05'),
	('87c35012-afe2-49da-8916-c4459eb024f0', '01a21743-c442-70fb-b052-ecc28e065bf1', 'Renovación: Plan Mensual', 180000.00, 'tarjeta', 'completado', '2026-11-26 14:51:12', '2026-11-26 14:51:12'),
	('9c4cdf01-3629-4e2a-b4d9-3b40e6ad77b2', NULL, 'Renovación: Plan Trimestral', 480000.00, 'tarjeta', 'rechazado', '2026-06-11 01:20:32', '2026-06-11 01:20:32'),
	('a7d0ca4a-3b77-4219-a6ae-569ce52a77cf', NULL, 'Renovación: Plan Mensual', 180000.00, 'tarjeta', 'completado', '2026-10-12 04:51:19', '2026-10-12 04:51:19'),
	('ac5c0527-4b18-4fc4-8740-fb7f491e1fcf', NULL, 'Renovación: Plan Trimestral', 480000.00, 'transferencia', 'completado', '2026-05-15 05:05:44', '2026-05-15 05:07:44'),
	('bba798b6-288a-49d4-9bc3-765c2d22c82e', NULL, 'Renovación: Plan Trimestral', 480000.00, 'transferencia', 'completado', '2026-06-26 00:42:09', '2026-06-26 00:42:42'),
	('bf041ac6-304b-4449-9182-9c15a837bf4f', NULL, 'Renovación: Plan Trimestral', 480000.00, 'tarjeta', 'completado', '2026-05-21 05:06:51', '2026-05-21 05:06:51'),
	('c6c361ba-0da6-434f-b815-7795a18b47f4', NULL, 'Renovación: Plan Mensual', 180000.00, 'tarjeta', 'completado', '2026-11-19 00:39:33', '2026-11-19 00:39:33'),
	('cd1222f5-79be-4538-bae9-cf21677c4699', NULL, 'Renovación: Plan Trimestral', 480000.00, 'tarjeta', 'rechazado', '2026-06-11 01:20:30', '2026-06-11 01:20:30'),
	('e95a6cd9-1ce7-4dc5-b776-835f96ed6bfa', NULL, 'Renovación: Plan Trimestral', 480000.00, 'transferencia', 'completado', '2026-05-15 06:08:49', '2026-05-15 06:16:01'),
	('f6541730-d47c-491c-9333-8b40951f56a3', NULL, 'Renovación: Plan Trimestral', 480000.00, 'transferencia', 'completado', '2026-05-15 05:12:10', '2026-05-15 05:40:15'),
	('fb701298-74bd-46a0-bdea-bcfd6039fd94', NULL, 'Renovación: Plan Trimestral', 480000.00, 'tarjeta', 'completado', '2026-05-15 06:03:25', '2026-05-15 06:03:25');

-- Volcando estructura para tabla gym_track_db.users
CREATE TABLE IF NOT EXISTS `users` (
  `id` char(36) NOT NULL,
  `nombre` varchar(255) NOT NULL,
  `apellido` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `rol` enum('admin','entrenador','cliente') NOT NULL,
  `activo` tinyint(1) NOT NULL DEFAULT 1,
  `foto_url` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `users_email_unique` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Volcando datos para la tabla gym_track_db.users: ~3 rows (aproximadamente)
INSERT INTO `users` (`id`, `nombre`, `apellido`, `email`, `password_hash`, `rol`, `activo`, `foto_url`, `created_at`) VALUES
	('019de8d0-c582-70b8-9e0e-3a4b974986c7', 'Admin', 'General', 'admin@gymtrack.com', '$2y$12$iFrJJFoiKBp1CGG5gTQ7JunNShp5CIz6D7gkR.0MaIbM6GYDYbV9S', 'admin', 0, NULL, '2026-05-02 13:11:29'),
	('01a21743-c428-70c4-8271-c9b0f5775bd0', 'Juan', 'Manuel Gongora', 'juan@gmail.com', '$2y$12$X51XNwGN64sNpC6LvMQrauwVUz6jXLrcxwjGwoAzbmm.DDnuDaxbC', 'cliente', 1, NULL, '2026-11-26 09:50:46'),
	('01a21768-5fe8-71a8-838a-b9bbcaa3aaee', 'Roberto', 'Martín', 'roberto@gmail.com', '$2y$12$IF8AO1gLkTn/kH3OprTTGe.1P3FP3ZhB2OS9Bnw/UTPGYPKjofo6W', 'entrenador', 1, NULL, '2026-11-26 10:30:45');

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
