# ✅ CHECKLIST DE PRODUCCIÓN — GymTrack
### Mitigación del Riesgo: Pasarela de Pagos Rechaza Transacciones

Ejecutar este checklist completo ANTES de cada deploy a Hostinger.
Un ✅ en cada ítem garantiza que el flujo de pagos esté operativo en producción.

---

## 1. Variables de Entorno (`.env`)

| Variable | Descripción | Estado |
|---|---|---|
| `APP_ENV` | Debe ser `production` (no `local`) | ☐ |
| `APP_DEBUG` | Debe ser `false` en producción | ☐ |
| `APP_URL` | URL completa del dominio (ej: `https://gymtrack.com`) | ☐ |
| `DB_CONNECTION` | Confirmar que apunta a la BD de Hostinger | ☐ |
| `PAYMENT_GATEWAY_KEY` | API Key real de la pasarela (Wompi, PayU, Stripe, etc.) | ☐ |
| `PAYMENT_GATEWAY_SECRET` | Secret Key del proveedor de pagos | ☐ |
| `PAYMENT_WEBHOOK_SECRET` | Firma secreta para validar webhooks | ☐ |

> ⚠️ **NUNCA cargar el archivo `.env` al repositorio de GitHub.**

---

## 2. HTTPS / Certificado SSL

- ☐ El dominio tiene HTTPS activo (`https://`).
- ☐ El certificado SSL no está vencido (revisar en el Panel de Hostinger).
- ☐ Todas las URLs de la API en el frontend usan `https://` (no `http://`).

> Las pasarelas de pago reales REQUIEREN HTTPS para procesar transacciones. Sin SSL, el pago será rechazado automáticamente.

---

## 3. Configuración de Webhooks

Los webhooks son notificaciones que la pasarela envía a la app cuando un pago cambia de estado (ej: confirmar una transferencia pendiente).

- ☐ URL del Webhook configurada en el dashboard del proveedor de pagos:
  `https://tu-dominio.com/api/pagos/webhook`
- ☐ La ruta `/api/pagos/webhook` existe en `routes/api.php`.
- ☐ El endpoint valida la firma (`PAYMENT_WEBHOOK_SECRET`) antes de procesar.
- ☐ El endpoint actualiza el estado de la transacción de `pendiente` → `completado` o `rechazado`.

---

## 4. Smoke Test Post-Deploy (Prueba en Vivo)

Ejecutar estas pruebas DESPUÉS de cada deploy, en el dominio real:

- ☐ **Test 1 — Tarjeta exitosa**: Pagar con una tarjeta de prueba del proveedor. Verificar que la membresía se activa y el recibo aparece.
- ☐ **Test 2 — Tarjeta rechazada**: Usar la tarjeta de rechazo del proveedor. Verificar que el modal muestra el error inline (sin cerrar el modal).
- ☐ **Test 3 — Transferencia pendiente**: Iniciar un pago por transferencia. Verificar que el usuario ve la pantalla naranja de "Verificación". Luego aprobarlo desde el Admin y verificar que la membresía se activa.
- ☐ **Test 4 — Método alternativo**: Tras un rechazo de tarjeta, cambiar a PayPal o Transferencia y completar el flujo sin recargar la página.

---

## 5. Método de Pago Alternativo (Failover)

- ☐ Los 3 métodos de pago (Tarjeta, PayPal, Transferencia) están visible y habilitados.
- ☐ Si un método falla, el modal muestra el error y resalta las alternativas.
- ☐ La transferencia bancaria como último recurso siempre está disponible.

---

## 6. Microservicio de Reportes

- ☐ El microservicio `microservicio-reportes` (Puerto 5001) está corriendo en el servidor de producción.
- ☐ El proceso está siendo reiniciado automáticamente (PM2, supervisor, o similar).
- ☐ La URL en `IngresosAdminTab.jsx` apunta al servidor correcto en producción (no `localhost`).

---

*Última actualización: 18 de Mayo de 2026*
