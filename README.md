# 🏋️ GymTrack — Sistema de Gestión de Gimnasio con Microservicios

> **Proyecto Final — Desarrollo de Software III**
> Programa: Tecnología en Sistemas | Docente: Mg(c). Juan Pablo Pinillos Reina

GymTrack es una plataforma web integral para la gestión de gimnasios, construida con **arquitectura de microservicios**, **API Gateway nginx**, backend **Laravel (PHP 8.2)**, frontend **React (Vite)** y despliegue completo con **Docker**.

---

## 🚀 Levantar el sistema (con Docker)

```bash
# 1. Clonar el repositorio
git clone https://github.com/[usuario]/gymtrack.git
cd gymtrack

# 2. Levantar TODO el sistema con un solo comando
docker-compose up --build

# 3. Primera vez: ejecutar migraciones
docker-compose exec backend php artisan migrate

# 4. Cargar datos de prueba
docker-compose exec -T mysql mysql -u gymtrack -pgymtrack_pass gymtrack_db < database/data_inicial.sql
```

✅ La aplicación estará disponible en: **http://localhost:8080**

---

## 🔐 Credenciales de prueba

| Rol | Email | Contraseña |
|---|---|---|
| Administrador | admin@gymtrack.com | password123 |
| Entrenador | carlos@gymtrack.com | password123 |
| Cliente | juan@gymtrack.com | password123 |

---

## 🏗️ Arquitectura de Microservicios

```
                      ┌─────────────────────────────────────┐
   👤 Usuario  ──────►│   API GATEWAY (nginx) — :8080        │
   (Browser)          │   Punto único de entrada al sistema  │
                      └───────────────┬─────────────────────┘
                                      │
              ┌───────────────────────┼────────────────────────┐
              │                       │                        │
              ▼                       ▼                        ▼
   ┌─────────────────┐    ┌──────────────────────┐  ┌──────────────────┐
   │ Frontend React  │    │  Backend Laravel     │  │  Microservicios  │
   │ nginx — :80     │    │  PHP 8.2 — :80       │  │  Node.js         │
   └─────────────────┘    │  Auth · Clientes     │  │                  │
                          │  Rutinas · Pagos     │  │ Acceso QR :3007  │
                          │  Métricas · Logros   │  │ Calculadora :3000│
                          └──────────┬───────────┘  │ Chat :3006       │
                                     │              │ Notific. :3005   │
                                     ▼              │ Reportes :5001   │
                             ┌──────────────┐       │ Rutinas IA :3008 │
                             │  MySQL 8.0   │       └──────────────────┘
                             │  gymtrack_db │
                             └──────────────┘
```

---

## 🐳 Servicios Docker

| Contenedor | Imagen base | Puerto externo | Descripción |
|---|---|---|---|
| `gymtrack-gateway` | nginx:alpine | **8080** | API Gateway (único acceso público) |
| `gymtrack-backend` | php:8.2-apache | — | Backend Laravel (API REST) |
| `gymtrack-frontend` | nginx:alpine | — | Frontend React (SPA) |
| `gymtrack-mysql` | mysql:8.0 | 3306 | Base de datos principal |
| `gymtrack-acceso` | node:20-alpine | — | MS Acceso QR |
| `gymtrack-calculadora` | node:20-alpine | — | MS Calculadora IMC/Calorías |
| `gymtrack-chat` | node:20-alpine | — | MS Chat en tiempo real |
| `gymtrack-notificaciones` | node:20-alpine | — | MS Notificaciones |
| `gymtrack-reportes` | node:20-alpine | — | MS Reportes PDF/Excel |
| `gymtrack-rutinas` | node:20-alpine | — | MS Rutinas con IA (Gemini) |

---

## 📁 Estructura del Proyecto

```
gymtrack/
├── backend/                    # Laravel PHP 8.2 — API REST principal
│   ├── app/Http/Controllers/API/  # 18 controladores REST
│   ├── database/migrations/    # 31 migraciones
│   └── Dockerfile
├── frontend/                   # React + Vite — SPA
│   ├── src/vistas/             # Paneles por rol
│   ├── nginx.conf
│   └── Dockerfile
├── gateway/                    # API Gateway nginx
│   ├── nginx.conf              # Enrutamiento a microservicios
│   └── Dockerfile
├── microservicio-acceso/       # Control QR de acceso
├── microservicio-calculadora/  # IMC y calorías
├── microservicio-chat/         # Socket.IO chat en tiempo real
├── microservicio-notificaciones/
├── microservicio-reportes/     # PDF y Excel con PDFKit + ExcelJS
├── microservicio-rutinas/      # Generación IA con Gemini API
├── database/
│   └── data_inicial.sql        # Datos de prueba
├── docker-compose.yml          # Orquestación completa
└── DOCUMENTO_PROYECTO_FINAL.md # Documentación del proyecto
```

---

## 🛠️ Tecnologías Utilizadas

| Categoría | Tecnología |
|---|---|
| Backend principal | PHP 8.2 + Laravel 12 + Sanctum |
| Frontend | React 18 + Vite + Lucide Icons |
| Microservicios | Node.js 20 + Express |
| Chat en tiempo real | Socket.IO |
| Reportes | PDFKit + ExcelJS |
| Acceso QR | QRCode.js |
| Inteligencia Artificial | Google Gemini API |
| Base de datos | MySQL 8.0 |
| API Gateway | nginx |
| Contenedorización | Docker + Docker Compose |
| Control de versiones | Git + GitHub |

---

## 📋 Requisitos del Enunciado — Cumplimiento

| Requisito | Estado |
|---|---|
| Arquitectura microservicios | ✅ 7 servicios independientes |
| Patrón API Gateway | ✅ nginx como gateway en :8080 |
| Patrón DTO + Services + Repository | ✅ Eloquent ORM + 18 controllers |
| Mínimo 3 microservicios en contenedores separados | ✅ 7 microservicios |
| Mínimo 4 tablas con FK | ✅ 15 tablas relacionadas |
| CRUD completo en 3 entidades | ✅ Clientes, Rutinas, Métricas |
| API REST 100% funcional | ✅ 40+ endpoints documentados |
| Frontend con listado, formulario y menú | ✅ React con 3 paneles por rol |
| Dockerfile para cada microservicio | ✅ 9 Dockerfiles |
| docker-compose.yml funcionando | ✅ 10 servicios orquestados |
| Script SQL con datos iniciales | ✅ database/data_inicial.sql |
| Repositorio Git en GitHub | ✅ |
| Documento del proyecto (PDF) | ✅ DOCUMENTO_PROYECTO_FINAL.md |

---

## 📚 Documentación

Ver [DOCUMENTO_PROYECTO_FINAL.md](./DOCUMENTO_PROYECTO_FINAL.md) para la documentación completa del proyecto con:
- Descripción del problema
- Objetivos general y específicos
- Justificación
- Patrones de microservicios utilizados
- Diagrama de arquitectura
- Estructura de base de datos
- Ejemplos de CRUD con JSON
- Instrucciones de despliegue
- Conclusiones, dificultades y aprendizajes
