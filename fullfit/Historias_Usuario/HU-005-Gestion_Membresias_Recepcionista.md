# HU-005: Gestión de Membresías por Recepcionista

## Historia de Usuario
**Como** Recepcionista,
**Quiero** gestionar las membresías de los clientes (cambiar estado, registrar, renovar, suspender y generar reportes),
**Para** manejar la membresía del cliente acorde a su situación.

## Criterios de Aceptación

### 1. Cambiar Estado de Membresía
- [ ] El recepcionista puede pausar una membresía activa
- [ ] El recepcionista puede revocar (cancelar) una membresía
- [ ] El recepcionista puede reactivar una membresía pausada
- [ ] Se registra quién hizo el cambio y cuándo
- [ ] Se muestra confirmación antes de cambiar el estado

### 2. Registrar Nueva Membresía
- [ ] Puede seleccionar cliente existente o crear nuevo
- [ ] Puede elegir el plan de membresía
- [ ] Sistema valida que no tenga membresía activa duplicada
- [ ] Calcula automáticamente fecha de inicio y fin
- [ ] Solicita método de pago y monto
- [ ] Genera registro de pago asociado

### 3. Renovar Membresía
- [ ] Muestra membresías próximas a vencer (7 días)
- [ ] Permite renovar con mismo plan o diferente
- [ ] Calcula nuevas fechas desde la fecha de expiración
- [ ] Genera nuevo registro de pago

### 4. Suspender Membresía
- [ ] Puede pausar membresía con motivo
- [ ] Limita suspensiones a máximo 2 por membresía
- [ ] Registra fecha de reanudación estimada
- [ ] Notifica al cliente la suspensión

### 5. Generar Reportes
- [ ] Reporte de membresías activas/vencidas/canceladas
- [ ] Reporte de pagos por período
- [ ] Reporte de nuevos clientes en el mes
- [ ] Exportar reportes en PDF/Excel

## Reglas de Negocio
1. No se pueden tener dos membresías activas simultáneas por cliente
2. Una membresía vencida no puede reactivarse, solo renovarse
3. Las suspensiones no pueden exceder 30 días totales
4. Todo cambio de estado genera registro en auditoría
5. Los reportes incluyen datos de la sede del recepcionista

## Diseño Visual
- Lista de membresías con filtros (activas, vencidas, todas)
- Modal de confirmación para cambios de estado
- Formulario de registro con validación en tiempo real
- Dashboard de reportes con gráficos