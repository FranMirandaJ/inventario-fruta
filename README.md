# 🧊 FrutaStock - Sistema de Gestión de Inventarios

Sistema de inventario y ventas diseñado específicamente para pequeños negocios de productos congelados de fruta. Gestiona categorías de productos, control de stock, movimientos de inventario y registro de ventas de manera eficiente.

## 📋 Descripción

**FrutaStock** es una aplicación web moderna que permite administrar el inventario de productos congelados (bolis de agua, bolis de leche, pulpas de fruta y concentrados), realizar seguimiento de ventas, controlar entradas y salidas de productos, y generar reportes para una mejor toma de decisiones.

### Características principales

- ✅ **Gestión de productos** - Alta, baja y modificación de productos por categoría
- 📦 **Control de inventario** - Seguimiento en tiempo real del stock actual y alertas de stock mínimo
- 💰 **Registro de ventas** - Sistema completo de ventas con detalles por producto
- 🔄 **Movimientos de inventario** - Registro de entradas, salidas y ajustes con motivos
- 👥 **Gestión de usuarios** - Sistema de roles (Admin/Vendedor) con autenticación segura
- 📊 **Dashboard** - Vista general del negocio con métricas clave
- 🎨 **Interfaz moderna** - UI responsiva con modo claro/oscuro

## 🛠️ Tecnologías

Este proyecto está construido con tecnologías modernas para garantizar rendimiento, escalabilidad y mantenibilidad:

### Frontend
- **[Next.js 16](https://nextjs.org/)** - Framework React con App Router
- **[React 19](https://react.dev/)** - Biblioteca de UI con las últimas características
- **[TypeScript 5](https://www.typescriptlang.org/)** - Tipado estático para mayor seguridad
- **[Tailwind CSS v4](https://tailwindcss.com/)** - Framework de utilidades CSS
- **[shadcn/ui](https://ui.shadcn.com/)** - Componentes de UI accesibles y personalizables (new-york style)
- **[Lucide React](https://lucide.dev/)** - Iconos modernos
- **[@teispace/next-themes](https://github.com/teispace/next-themes)** - Soporte para tema claro/oscuro
- **[Sonner](https://sonner.emilkowal.dev/)** - Notificaciones toast

### Backend
- **[Next.js Server Actions](https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations)** - Mutaciones del lado del servidor
- **[Prisma 7](https://www.prisma.io/)** - ORM moderno para TypeScript con `@prisma/adapter-mariadb`
- **[MySQL/MariaDB](https://www.mysql.com/)** - Base de datos relacional
- **[Jose](https://github.com/panva/jose)** - Autenticación JWT (HS256, httpOnly cookies)
- **[bcryptjs](https://github.com/dcodeIO/bcrypt.js)** - Hash de contraseñas
- **[Zod v4](https://zod.dev/)** - Validación de esquemas y tipos

### Herramientas de desarrollo
- **[pnpm v11+](https://pnpm.io/)** - Gestor de paquetes eficiente
- **[ESLint](https://eslint.org/)** - Linter de código (flat config)
- **[tsx](https://github.com/esbuild-kit/tsx)** - Ejecución de TypeScript

## 📁 Estructura del proyecto

```
inventario-fruta/
├── app/                              # App Router de Next.js
│   ├── layout.tsx                     # Layout raíz (ThemeProvider, Toaster, TooltipProvider)
│   ├── page.tsx                       # Redirige a /login
│   ├── globals.css                    # Estilos globales (Tailwind v4)
│   │
│   ├── login/                         # Página de inicio de sesión
│   │   ├── page.tsx
│   │   ├── LoginForm.tsx              # Componente cliente (co-ubicado)
│   │   ├── login.action.ts            # Server Action
│   │   └── login.schema.ts           # Esquema de validación Zod
│   │
│   ├── dashboard/                     # Área autenticada (layout verifica sesión)
│   │   ├── layout.tsx                 # Shell del dashboard (Navbar, Footer, fondo)
│   │   ├── page.tsx                   # Inicio del dashboard
│   │   ├── _actions/                  # Server Actions del dashboard
│   │   │   └── dashboardNavbar.action.ts  # Acción de cerrar sesión
│   │   ├── _components/              # Componentes del dashboard
│   │   │   ├── ContenedorPagina.tsx        # Contenedor de página
│   │   │   ├── DashboardFooter.tsx
│   │   │   ├── DashboardNavbar.tsx
│   │   │   └── InicioView.tsx
│   │   │
│   │   ├── productos/                 # Gestión de productos
│   │   │   ├── page.tsx
│   │   │   ├── _actions/             # Server Actions de productos
│   │   │   │   ├── crear-producto.action.ts
│   │   │   │   ├── actualizar-producto.action.ts
│   │   │   │   ├── actualizar-estado-producto.action.ts
│   │   │   │   └── ajustar-stock.action.ts
│   │   │   ├── _components/          # Componentes de productos
│   │   │   │   ├── TablaProductos.tsx
│   │   │   │   ├── FormProducto.tsx
│   │   │   │   ├── ModalNuevoProducto.tsx
│   │   │   │   ├── ModalEditarProducto.tsx
│   │   │   │   ├── ModalAjustarStock.tsx
│   │   │   │   └── AlertModalEstadoProducto.tsx
│   │   │   └── _schemas/            # Esquemas Zod de productos
│   │   │       ├── crear-producto.schema.ts
│   │   │       └── ajustar-stock.schema.ts
│   │   │
│   │   └── ventas/                    # Gestión de ventas
│   │       ├── page.tsx
│   │       ├── _actions/
│   │       │   └── crear-venta.ts
│   │       ├── _components/
│   │       │   ├── VentasView.tsx
│   │       │   ├── ModalRegistrarVenta.tsx
│   │       │   └── BuscadorProductos.tsx
│   │       ├── _schemas/
│   │       │   └── crear-venta.schema.ts
│   │       └── _types/
│   │           └── index.ts
│   │
│   └── sandbox/                       # playground de desarrollo
│       ├── layout.tsx
│       ├── page.tsx
│       └── _components/
│           └── TablaPrueba.tsx
│
├── components/                        # Componentes reutilizables
│   ├── AutoBreadcrumb.tsx             # Navegación breadcrumb automática
│   ├── Datatable.tsx                  # Tabla de datos reutilizable
│   ├── Modal.tsx                      # Modal reutilizable
│   └── ui/                           # Componentes primitivos de shadcn/ui (27 componentes)
│
├── lib/                               # Utilidades y lógica de negocio
│   ├── prisma.ts                      # Singleton del cliente Prisma (adapter MariaDB)
│   ├── session.ts                     # Gestión de sesiones JWT (server-only)
│   ├── definitions.ts                 # Definiciones de tipos compartidos (SessionPayload)
│   ├── form-state.ts                  # Tipo genérico FormState para server actions
│   ├── money.ts                       # Formateo de moneda (MXN)
│   ├── text.ts                        # Utilidades de texto (capitalizar, normalizar, acentos)
│   ├── utils.ts                       # Utilidades generales (cn, clsx, twMerge)
│   ├── dal/                           # Data Access Layer (server-only, cacheado)
│   │   ├── auth.ts                    # verifySession() - guarda de auth + redirect
│   │   ├── categorias.ts             # Consultas de categorías
│   │   └── productos.ts             # Consultas de productos
│   ├── dto/                           # Data Transfer Objects (placeholder)
│   └── logger/                        # Logger de consola con colores
│       ├── index.ts                   # Factoría createLogger(prefijo)
│       └── consoleColors.ts           # Códigos de color ANSI
│
├── prisma/                            # Configuración de Prisma
│   ├── schema.prisma                  # Esquema de la base de datos
│   ├── seed.ts                        # Datos iniciales (admin + categorías + productos + ventas)
│   └── migrations/                    # Migraciones de BD
│
├── generated/prisma/                  # Output del cliente Prisma (NO node_modules/@prisma/client)
├── public/                            # Archivos estáticos
├── prisma.config.ts                   # Config de Prisma (dotenv, seed command)
├── next.config.ts
├── eslint.config.mjs                  # ESLint flat config
├── tsconfig.json                      # TypeScript config (alias @/*)
├── components.json                    # Config de shadcn/ui
├── postcss.config.mjs
└── package.json
```

## 🚀 Instalación y configuración

### Requisitos previos

Asegúrate de tener instalado:

- **Node.js** v24.0.0 o superior ([Descargar](https://nodejs.org/))
- **pnpm** v11.2.2 o superior ([Instalar](https://pnpm.io/installation))
- **MySQL/MariaDB** 8.0+ o 10.5+ ([Descargar MySQL](https://dev.mysql.com/downloads/mysql/) | [Descargar MariaDB](https://mariadb.org/download/))

### Pasos de instalación

1. **Clonar el repositorio**

```bash
git clone https://github.com/FranMirandaJ/inventario-fruta.git
cd inventario-fruta
```

2. **Cambiar a la rama de desarrollo**

```bash
git checkout dev
```

3. **Instalar dependencias**

```bash
pnpm install
```

4. **Configurar variables de entorno**

Crea un archivo `.env` en la raíz del proyecto copiando el archivo de ejemplo:

```bash
cp .env.example .env
```

Edita el archivo `.env` con tus credenciales:

```env
# Base de datos MySQL
DATABASE_URL=mysql://usuario:contraseña@localhost:3306/inventario_fruta
DATABASE_USER=tu_usuario
DATABASE_PASSWORD=tu_contraseña
DATABASE_NAME=inventario_fruta
DATABASE_HOST=localhost
DATABASE_PORT=3306

# Credenciales del administrador inicial
ADMIN_PASSWORD=tu_contraseña_admin
ADMIN_MAIL=admin@tuempresa.com

# Clave secreta para sesiones (genera una aleatoria)
SESSION_SECRET=tu_clave_secreta_muy_larga_y_aleatoria
```

5. **Crear la base de datos**

Conéctate a MySQL y crea la base de datos:

```sql
CREATE DATABASE inventario_fruta CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

6. **Ejecutar migraciones de Prisma**

Aplica el esquema de la base de datos:

```bash
pnpm prisma migrate deploy
```

O si estás en desarrollo y quieres crear las migraciones:

```bash
pnpm prisma migrate dev
```

7. **Poblar la base de datos con datos iniciales**

Ejecuta el seed para crear el usuario administrador y las categorías base:

```bash
pnpm prisma db seed
```

Esto creará:
- Usuario administrador con el email y contraseña definidos en `.env`
- Categorías predeterminadas: Bolis de agua, Bolis de leche, Pulpas de fruta, Concentrados

8. **Generar el cliente de Prisma**

```bash
pnpm prisma generate
```

9. **Iniciar el servidor de desarrollo**

```bash
pnpm dev
```

La aplicación estará disponible en [http://localhost:3000](http://localhost:3000)

## 🔐 Acceso inicial

Después de ejecutar el seed, puedes iniciar sesión con:

- **Email**: El configurado en `ADMIN_MAIL` (por defecto: `prueba@gmail.com`)
- **Contraseña**: La configurada en `ADMIN_PASSWORD` (por defecto: `admin`)

> ⚠️ **Importante**: Cambia estas credenciales en producción por razones de seguridad.

## 📊 Modelo de datos (Prisma)

El sistema utiliza las siguientes entidades principales:

- **Usuario** - Usuarios del sistema con roles (`ADMIN`/`VENDEDOR`) y flag `activo`
- **Categoría** - Categorías de productos (Bolis, Pulpas, etc.). `nombre` es único
- **Producto** - Productos congelados con precio (Decimal 10,2), stock actual, stock mínimo y flag `activo`
- **MovimientoInventario** - Registro de entradas, salidas y ajustes (`ENTRADA`/`SALIDA`/`AJUSTE`). Enlaza a `Producto`, `Usuario` y opcionalmente `Venta`
- **Venta** - Registro de ventas con total (Decimal 10,2) y estado (`ACTIVA`/`CANCELADA`)
- **DetalleVenta** - Detalle de productos vendidos por venta (cantidad, precio unitario, subtotal)

## 🧪 Scripts disponibles

```bash
# Desarrollo
pnpm dev              # Inicia el servidor de desarrollo

# Producción
pnpm build            # Construye la aplicación para producción
pnpm start            # Inicia el servidor de producción

# Base de datos
pnpm prisma migrate dev      # Crea y aplica migraciones
pnpm prisma migrate deploy   # Aplica migraciones (producción)
pnpm prisma db seed         # Ejecuta el seed
pnpm prisma generate        # Genera el cliente de Prisma (output: generated/prisma/)
pnpm prisma studio          # Abre Prisma Studio (GUI)

# Código
pnpm lint             # Ejecuta ESLint (flat config con core-web-vitals + typescript)
```

## 🏗️ Construir para producción

```bash
# 1. Construir la aplicación
pnpm build

# 2. Iniciar el servidor
pnpm start
```

## 🤝 Contribuciones

Este proyecto es de autoría de [FranMirandaJ](https://github.com/FranMirandaJ). Las contribuciones, issues y sugerencias son bienvenidas.

## 📝 Licencia

Este proyecto es privado y de uso exclusivo para el negocio.

## 👤 Autor

**Fran Miranda**
- GitHub: [@FranMirandaJ](https://github.com/FranMirandaJ)

---

⭐ Si este proyecto te fue útil, considera darle una estrella en GitHub
