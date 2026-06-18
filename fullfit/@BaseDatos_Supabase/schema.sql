-- WARNING: This schema is for context only and is not meant to be run.
-- Table order and constraints may not be valid for execution.

CREATE TABLE public.roles (
  id integer NOT NULL DEFAULT nextval('roles_id_seq'::regclass),
  nombre character varying NOT NULL UNIQUE,
  descripcion text,
  CONSTRAINT roles_pkey PRIMARY KEY (id)
);

CREATE TABLE public.profiles (
  id uuid NOT NULL,
  rol_id integer NOT NULL,
  nombre character varying NOT NULL,
  apellido character varying NOT NULL,
  dni character varying(8),
  email character varying(255),
  telefono character varying,
  fecha_nacimiento date,
  genero character varying CHECK (genero::text = ANY (ARRAY['masculino'::character varying, 'femenino'::character varying, 'otro'::character varying, 'prefiero_no_decir'::character varying]::text[])),
  activo boolean NOT NULL DEFAULT true,
  creado_en timestamp without time zone NOT NULL DEFAULT now(),
  actualizado_en timestamp without time zone NOT NULL DEFAULT now(),
  CONSTRAINT profiles_pkey PRIMARY KEY (id),
  CONSTRAINT profiles_id_fkey FOREIGN KEY (id) REFERENCES auth.users(id),
  CONSTRAINT profiles_rol_id_fkey FOREIGN KEY (rol_id) REFERENCES public.roles(id),
  CONSTRAINT profiles_dni_unique UNIQUE (dni),
  CONSTRAINT profiles_dni_check CHECK (dni ~ '^[0-9]{8}$'),
  CONSTRAINT profiles_email_unique UNIQUE (email)
);

CREATE TABLE public.planes_membresia (
  id integer NOT NULL DEFAULT nextval('planes_membresia_id_seq'::regclass),
  nombre character varying NOT NULL,
  descripcion text,
  precio numeric NOT NULL CHECK (precio >= 0::numeric),
  duracion_dias integer NOT NULL CHECK (duracion_dias > 0),
  activo boolean NOT NULL DEFAULT true,
  creado_en timestamp without time zone NOT NULL DEFAULT now(),
  CONSTRAINT planes_membresia_pkey PRIMARY KEY (id)
);

CREATE TABLE public.suscripciones (
  id integer NOT NULL DEFAULT nextval('suscripciones_id_seq'::regclass),
  usuario_id uuid NOT NULL,
  plan_id integer NOT NULL,
  auth_user_id uuid DEFAULT usuario_id,
  fecha_inicio date NOT NULL,
  fecha_fin date NOT NULL,
  estado character varying NOT NULL DEFAULT 'activa'::character varying CHECK (estado::text = ANY (ARRAY['activa'::character varying, 'vencida'::character varying, 'cancelada'::character varying, 'suspendida'::character varying]::text[])),
  creado_por uuid NOT NULL,
  creado_en timestamp without time zone NOT NULL DEFAULT now(),
  CONSTRAINT suscripciones_pkey PRIMARY KEY (id),
  CONSTRAINT suscripciones_usuario_id_fkey FOREIGN KEY (usuario_id) REFERENCES public.profiles(id),
  CONSTRAINT suscripciones_plan_id_fkey FOREIGN KEY (plan_id) REFERENCES public.planes_membresia(id),
  CONSTRAINT suscripciones_creado_por_fkey FOREIGN KEY (creado_por) REFERENCES public.profiles(id)
);

CREATE TABLE public.pagos (
  id integer NOT NULL DEFAULT nextval('pagos_id_seq'::regclass),
  suscripcion_id integer NOT NULL,
  usuario_id uuid NOT NULL,
  monto numeric NOT NULL CHECK (monto > 0::numeric),
  metodo_pago character varying NOT NULL CHECK (metodo_pago::text = ANY (ARRAY['efectivo'::character varying::text, 'tarjeta_debito'::character varying::text, 'tarjeta_credito'::character varying::text, 'transferencia'::character varying::text, 'yape'::character varying::text, 'plin'::character varying::text, 'mercadopago'::character varying::text])),
  estado character varying NOT NULL DEFAULT 'completado'::character varying CHECK (estado::text = ANY (ARRAY['completado'::character varying, 'pendiente'::character varying, 'fallido'::character varying, 'reembolsado'::character varying]::text[])),
  referencia character varying,
  observaciones text,
  registrado_por uuid NOT NULL,
  fecha_pago timestamp without time zone NOT NULL DEFAULT now(),
  CONSTRAINT pagos_pkey PRIMARY KEY (id),
  CONSTRAINT pagos_suscripcion_id_fkey FOREIGN KEY (suscripcion_id) REFERENCES public.suscripciones(id),
  CONSTRAINT pagos_usuario_id_fkey FOREIGN KEY (usuario_id) REFERENCES public.profiles(id),
  CONSTRAINT pagos_registrado_por_fkey FOREIGN KEY (registrado_por) REFERENCES public.profiles(id)
);

CREATE TABLE public.accesos (
  id integer NOT NULL DEFAULT nextval('accesos_id_seq'::regclass),
  usuario_id uuid NOT NULL,
  tipo character varying NOT NULL DEFAULT 'entrada'::character varying CHECK (tipo::text = ANY (ARRAY['entrada'::character varying, 'salida'::character varying]::text[])),
  metodo character varying NOT NULL DEFAULT 'manual'::character varying CHECK (metodo::text = ANY (ARRAY['manual'::character varying, 'qr'::character varying, 'tarjeta'::character varying]::text[])),
  registrado_por uuid,
  fecha_hora timestamp without time zone NOT NULL DEFAULT now(),
  CONSTRAINT accesos_pkey PRIMARY KEY (id),
  CONSTRAINT accesos_usuario_id_fkey FOREIGN KEY (usuario_id) REFERENCES public.profiles(id),
  CONSTRAINT accesos_registrado_por_fkey FOREIGN KEY (registrado_por) REFERENCES public.profiles(id)
);

CREATE TABLE public.notificaciones (
  id integer NOT NULL DEFAULT nextval('notificaciones_id_seq'::regclass),
  usuario_id uuid NOT NULL,
  tipo character varying NOT NULL CHECK (tipo::text = ANY (ARRAY['membresia_por_vencer'::character varying, 'membresia_vencida'::character varying, 'pago_pendiente'::character varying, 'bienvenida'::character varying, 'general'::character varying]::text[])),
  titulo character varying NOT NULL,
  mensaje text NOT NULL,
  leida boolean NOT NULL DEFAULT false,
  creado_en timestamp without time zone NOT NULL DEFAULT now(),
  CONSTRAINT notificaciones_pkey PRIMARY KEY (id),
  CONSTRAINT notificaciones_usuario_id_fkey FOREIGN KEY (usuario_id) REFERENCES public.profiles(id)
);

CREATE TABLE public.auditoria (
  id integer NOT NULL DEFAULT nextval('auditoria_id_seq'::regclass),
  usuario_id uuid NOT NULL,
  tabla_afectada character varying NOT NULL,
  accion character varying NOT NULL CHECK (accion::text = ANY (ARRAY['INSERT'::character varying, 'UPDATE'::character varying, 'DELETE'::character varying, 'SELECT'::character varying]::text[])),
  registro_id integer,
  detalle jsonb,
  ip_origen inet,
  fecha timestamp without time zone NOT NULL DEFAULT now(),
  CONSTRAINT auditoria_pkey PRIMARY KEY (id),
  CONSTRAINT auditoria_usuario_id_fkey FOREIGN KEY (usuario_id) REFERENCES public.profiles(id)
);

CREATE TABLE public.sedes (
  id integer NOT NULL DEFAULT nextval('sedes_id_seq'::regclass),
  nombre character varying NOT NULL,
  direccion character varying NOT NULL UNIQUE,
  latitud numeric,
  longitud numeric,
  telefono character varying NOT NULL,
  email character varying NOT NULL,
  imagen_url text,
  apertura_lv time without time zone NOT NULL DEFAULT '06:00:00'::time without time zone,
  cierre_lv time without time zone NOT NULL DEFAULT '22:00:00'::time without time zone,
  apertura_sab time without time zone NOT NULL DEFAULT '07:00:00'::time without time zone,
  cierre_sab time without time zone NOT NULL DEFAULT '22:00:00'::time without time zone,
  estado character varying NOT NULL DEFAULT 'activa'::character varying CHECK (estado::text = ANY (ARRAY['activa'::character varying, 'inactiva'::character varying]::text[])),
  creado_en timestamp without time zone NOT NULL DEFAULT now(),
  actualizado_en timestamp without time zone NOT NULL DEFAULT now(),
  CONSTRAINT sedes_pkey PRIMARY KEY (id)
);