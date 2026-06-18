# Plan de Implementación: HU-005 Gestión de Membresías

## 1. Estructura de Archivos a Crear/Modificar

### Nuevos Componentes
```
components/
├── membresias/
│   ├── ListaMembresias.tsx          # Lista principal con filtros
│   ├── TarjetaMembresia.tsx         # Card de cada membresía
│   ├── ModalCambiarEstado.tsx       # Modal para pausar/revocar
│   ├── FormularioNuevaMembresia.tsx # Formulario de registro
│   ├── ModalRenovar.tsx             # Modal de renovación
│   ├── ReportesMembresias.tsx       # Panel de reportes
│   └── FiltrosMembresias.tsx        # Filtros de búsqueda
```

### Páginas/Rutas
```
app/
├── recepcionista/
│   └── membresias/
│       ├── page.tsx                 # Lista principal
│       ├── nueva/page.tsx           # Registro nueva membresía
│       ├── [id]/
│       │   ├── page.tsx             # Detalle de membresía
│       │   └── renovar/page.tsx     # Renovar membresía
│       └── reportes/page.tsx        # Generar reportes
```

### Utilidades
```
lib/
├── utils/
│   ├── membresias.ts               # Funciones de cálculo de fechas
│   └── reportes.ts                 # Generación de reportes
└── supabase/
    └── queries/
        └── membresias.ts           # Queries específicas
```

## 2. Dependencias

### Paquetes Necesarios
```json
{
  "dependencies": {
    "@radix-ui/react-dialog": "^1.x",
    "@radix-ui/react-select": "^2.x",
    "@radix-ui/react-alert-dialog": "^1.x",
    "date-fns": "^3.x",
    "jspdf": "^2.x",
    "xlsx": "^0.x",
    "recharts": "^2.x"
  }
}
```

### Componentes UI Existentes (shadcn)
- Button
- Card
- Dialog
- Select
- Table
- Badge
- Calendar
- Input
- Label
- Textarea

## 3. Implementación Paso a Paso

### Fase 1: Infraestructura (Día 1)
1. Crear queries de Supabase para membresías
2. Crear utilidades de cálculo de fechas
3. Definir tipos TypeScript para el dominio

### Fase 2: Componentes Base (Día 2)
1. `ListaMembresias.tsx` - Tabla con paginación
2. `TarjetaMembresia.tsx` - Card con acciones
3. `FiltrosMembresias.tsx` - Filtros de estado

### Fase 3: Funcionalidad Core (Día 3)
1. `ModalCambiarEstado.tsx` - Pausar/Revocar
2. `FormularioNuevaMembresia.tsx` - Registro
3. Validaciones de negocio

### Fase 4: Renovación y Reportes (Día 4)
1. `ModalRenovar.tsx` - Flujo de renovación
2. `ReportesMembresias.tsx` - Generación de reportes
3. Exportación PDF/Excel

### Fase 5: Integración (Día 5)
1. Crear páginas y rutas
2. Conectar con Supabase
3. Pruebas y ajustes

## 4. Queries de Supabase Requeridas

```sql
-- Obtener membresías con filtros
SELECT s.*, p.nombre, p.apellido, pm.nombre as plan_nombre
FROM suscripciones s
JOIN profiles p ON s.usuario_id = p.id
JOIN planes_membresia pm ON s.plan_id = pm.id
WHERE s.estado = $1
ORDER BY s.fecha_fin DESC;

-- Verificar membresía activa
SELECT COUNT(*) FROM suscripciones
WHERE usuario_id = $1 AND estado = 'activa';

-- Membresías próximas a vencer
SELECT * FROM suscripciones
WHERE fecha_fin BETWEEN CURRENT_DATE AND CURRENT_DATE + 7
AND estado = 'activa';
```

## 5. Estados de Membresía

```
activa    → Pausada → Reanudada → activa
activa    → Cancelada (revocada)
pausada   → Cancelada (revocada)
vencida   → Solo renovación
```

## 6. Validaciones Críticas

1. **Membresía duplicada**: Verificar antes de crear
2. **Límite de suspensiones**: Máximo 2 por membresía
3. **Renovación**: Solo para membresías activas o pausadas
4. **Cancelación**: Solicitar motivo obligatorio
5. **Fechas**: Fin > Inicio, no en el pasado

## 7. Estimación de Tiempo

| Fase | Tiempo |
|------|--------|
| Infraestructura | 4 horas |
| Componentes Base | 6 horas |
| Funcionalidad Core | 8 horas |
| Renovación/Reportes | 6 horas |
| Integración/Pruebas | 4 horas |
| **Total** | **28 horas (5-6 días)**