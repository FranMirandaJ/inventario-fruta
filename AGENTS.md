# AGENTS.md

Instructions for AI coding agents working on this project.

## Project Overview

**FrutaStock** — Inventory and sales management system for a small frozen fruit products business (bolis, pulps, concentrates). Built for the Miranda Jaramillo family business.

The app manages product categories, stock control, inventory movements (entries/exits/adjustments), and sales recording.

## Tech Stack

- **Framework**: Next.js 16 (App Router, RSC)
- **UI**: React 19, TypeScript 5, Tailwind CSS v4, shadcn/ui (new-york style)
- **ORM**: Prisma 7 with `@prisma/adapter-mariadb`
- **Database**: MySQL/MariaDB
- **Auth**: JWT via `jose` + `bcryptjs`, httpOnly cookies, 7-day sessions
- **Validation**: Zod v4
- **Icons**: Lucide React
- **Package Manager**: pnpm v11+
- **Runtime**: Node.js v24+
- **Linting**: ESLint flat config with `eslint-config-next` (core-web-vitals + typescript)
- **Theming**: `@teispace/next-themes` (light/dark)
- **Toasts**: Sonner

## Commands

```bash
pnpm dev                    # Start development server (http://localhost:3000)
pnpm build                  # Production build
pnpm start                  # Start production server
pnpm lint                   # Run ESLint (flat config)
pnpm prisma migrate dev     # Create and apply migrations (development)
pnpm prisma migrate deploy  # Apply migrations (production)
pnpm prisma db seed         # Seed database (uses tsx prisma/seed.ts)
pnpm prisma generate        # Generate Prisma client to generated/prisma/
pnpm prisma studio          # Open Prisma Studio GUI
```

**Always run `pnpm lint` after making code changes.**

## Environment Variables

Required in `.env` (see `.env.example`):

```
DATABASE_URL=mysql://user:password@localhost:3306/inventario_fruta
DATABASE_USER=root
DATABASE_PASSWORD=root
DATABASE_NAME=inventario_fruta
DATABASE_HOST=localhost
DATABASE_PORT=3306
ADMIN_PASSWORD=admin
ADMIN_MAIL=prueba@gmail.com
SESSION_SECRET=<random-secret-key>
```

## Project Structure

```
inventario-fruta/
├── app/                              # Next.js App Router
│   ├── layout.tsx                     # Root layout (ThemeProvider, Toaster, TooltipProvider)
│   ├── page.tsx                       # Redirects to /login
│   ├── globals.css                    # Global styles (Tailwind v4)
│   │
│   ├── login/                         # Login page
│   │   ├── page.tsx
│   │   ├── LoginForm.tsx              # Client component (co-located)
│   │   ├── login.action.ts            # Server action
│   │   └── login.schema.ts            # Zod validation schema
│   │
│   ├── dashboard/                     # Authenticated area (layout verifies session)
│   │   ├── layout.tsx                 # Dashboard shell (Navbar, Footer, background image)
│   │   ├── page.tsx                   # Dashboard home/inicio
│   │   ├── _actions/                  # Dashboard-level server actions
│   │   │   └── dashboardNavbar.action.ts  # Logout action
│   │   ├── _components/               # Dashboard-level components
│   │   │   ├── ContenedorPagina.tsx        # Page container wrapper
│   │   │   ├── DashboardFooter.tsx
│   │   │   ├── DashboardNavbar.tsx
│   │   │   └── InicioView.tsx
│   │   │
│   │   ├── productos/                 # Products management page
│   │   │   ├── page.tsx
│   │   │   ├── _actions/
│   │   │   │   ├── crear-producto.action.ts
│   │   │   │   ├── actualizar-producto.action.ts
│   │   │   │   ├── actualizar-estado-producto.action.ts
│   │   │   │   └── ajustar-stock.action.ts
│   │   │   ├── _components/
│   │   │   │   ├── TablaProductos.tsx
│   │   │   │   ├── FormProducto.tsx
│   │   │   │   ├── ModalNuevoProducto.tsx
│   │   │   │   ├── ModalEditarProducto.tsx
│   │   │   │   ├── ModalAjustarStock.tsx
│   │   │   │   └── AlertModalEstadoProducto.tsx
│   │   │   └── _schemas/
│   │   │       ├── crear-producto.schema.ts
│   │   │       └── ajustar-stock.schema.ts
│   │   │
│   │   └── ventas/                    # Sales management page
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
│   └── sandbox/                       # Dev/test playground
│       ├── layout.tsx
│       ├── page.tsx
│       └── _components/
│           └── TablaPrueba.tsx
│
├── components/                        # Shared components
│   ├── AutoBreadcrumb.tsx             # Auto breadcrumb navigation
│   ├── Datatable.tsx                  # Reusable data table
│   ├── Modal.tsx                      # Reusable modal wrapper
│   └── ui/                           # shadcn/ui primitives (27 components)
│
├── lib/                               # Utilities and business logic
│   ├── prisma.ts                      # Prisma client singleton (MariaDB adapter)
│   ├── session.ts                     # JWT session management (server-only)
│   ├── definitions.ts                 # Shared type definitions (SessionPayload)
│   ├── form-state.ts                  # Generic FormState type for server actions
│   ├── money.ts                       # Currency formatting (MXN)
│   ├── text.ts                        # Text utilities (capitalize, normalize, accents)
│   ├── utils.ts                       # General utilities (cn, clsx, twMerge)
│   ├── dal/                           # Data Access Layer (server-only, cached)
│   │   ├── auth.ts                    # verifySession() - auth guard + redirect
│   │   ├── categorias.ts             # Category queries
│   │   └── productos.ts              # Product queries
│   ├── dto/                           # Data Transfer Objects (placeholder)
│   └── logger/                        # Colored console logger
│       ├── index.ts                   # createLogger(prefix) factory
│       └── consoleColors.ts           # ANSI color codes
│
├── prisma/                            # Prisma configuration
│   ├── schema.prisma                  # Database schema
│   ├── seed.ts                        # Seed script (admin user + categories + products + sales)
│   └── migrations/                    # Database migrations
│
├── generated/prisma/                  # Prisma client output (NOT node_modules/@prisma/client)
├── public/                            # Static assets
├── prisma.config.ts                   # Prisma config (dotenv, seed command)
├── next.config.ts
├── eslint.config.mjs                  # ESLint flat config
├── tsconfig.json                      # TypeScript config (@/* path alias)
├── components.json                    # shadcn/ui config
├── postcss.config.mjs
└── package.json
```

## Code Conventions

### Path Aliases

- `@/*` maps to the project root (configured in `tsconfig.json`)
- Prisma types import from `@/generated/prisma`, **NOT** from `@prisma/client`
- Example: `import { TipoMovimiento } from "@/generated/prisma"`

### Server Actions

- File naming: `kebab-case.action.ts` (e.g., `crear-producto.action.ts`)
- Must start with `"use server";` as the first line
- Always call `verifySession()` from `@/lib/dal/auth` at the start to authenticate and get user info
- Return type must be a `FormState` variant from `@/lib/form-state`
- Call `revalidatePath()` after successful mutations
- Use `createLogger("Section/Subsection")` for server-side logging

### Server Action Pattern

```typescript
"use server";

import { verifySession } from "@/lib/dal/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { createLogger } from "@/lib/logger";
import { SomeFormSchema, type SomeFormState } from "../_schemas/some-form.schema";

const log = createLogger("Section/Action");

export const someAction = async (_state: SomeFormState, formData: FormData): Promise<SomeFormState> => {
  const usuario = await verifySession();
  const id_usuario = Number(usuario.id_usuario);

  const rawFormData = {
    field: formData.get("field")?.toString() || "",
  };

  const validatedFields = SomeFormSchema.safeParse(rawFormData);

  if (!validatedFields.success) {
    return {
      success: false,
      errors: validatedFields.error.flatten((issue) => issue.message).fieldErrors,
      message: "Error message.",
      timestamp: Date.now(),
      inputs: rawFormData,
    };
  }

  try {
    // ... database operations
    revalidatePath("/dashboard/some-path");
    log.success({ ... }, "Success message");
    return { success: true, message: "Success.", timestamp: Date.now() };
  } catch (error) {
    log.error("Error message: ", error);
    let message = "Default error message.";
    if (error instanceof PrismaClientInitializationError) {
      message = "Connection error. Check your connection and try again.";
    } else if (error instanceof PrismaClientKnownRequestError && error.code === "P2025") {
      message = "Record not found.";
    }
    return { success: false, message, timestamp: Date.now() };
  }
};
```

### Zod Schemas

- File naming: `kebab-case.schema.ts` (e.g., `crear-producto.schema.ts`)
- Placed in `_schemas/` directory alongside their `_actions/`
- Always export the schema and a `FormState` type derived from `@/lib/form-state`
- Error messages are in **Spanish**

### Data Access Layer (DAL)

- All files in `lib/dal/` must have `import "server-only";` as the first import
- All query functions must be wrapped in `cache()` from React
- Example: `export const obtenerProductos = cache(async () => { ... })`

### Prisma Client

- Singleton pattern in `lib/prisma.ts` using `@prisma/adapter-mariadb`
- Client output is `generated/prisma/` (not default `node_modules`)
- Import: `import { prisma } from "@/lib/prisma"`
- Types/enums: `import { SomeType } from "@/generated/prisma"`
- Sales use `$transaction()` for atomic stock updates + movement creation

### Components

- **shadcn/ui** components live in `components/ui/` (installed via `shadcn` CLI)
- Use `new-york` style variant (see `components.json`)
- Custom shared components go in `components/` root (e.g., `Datatable.tsx`, `Modal.tsx`, `AutoBreadcrumb.tsx`)
- Route-specific components go in `_components/` alongside their page

### Route Organization

Each dashboard route uses co-located directories:

| Directory | Purpose |
|-----------|---------|
| `_actions/` | Server actions for this route |
| `_components/` | React components for this route |
| `_schemas/` | Zod validation schemas for this route |
| `_types/` | TypeScript type definitions for this route |

The `_` prefix ensures Next.js does not treat these as URL segments.

### Authentication Flow

1. User submits login form → `login.action.ts` validates with Zod, checks bcrypt hash, creates JWT session via `createSession()`
2. Session stored in httpOnly cookie (`session`), 7-day expiry, HS256
3. `verifySession()` in `lib/dal/auth.ts` decrypts cookie, redirects to `/login` if invalid
4. Dashboard layout calls `verifySession()` to protect all dashboard routes
5. Logout via `cerrarSesion()` in `dashboardNavbar.action.ts` deletes cookie and redirects

### Styling

- Tailwind CSS v4 (no `tailwind.config.js`, uses CSS-based config in `globals.css`)
- Dark/light theme toggle via `@teispace/next-themes`
- CSS variables for theming (configured in `components.json`)
- `cn()` utility from `@/lib/utils` for conditional class merging

### Error Handling

- Prisma `PrismaClientInitializationError` → connection error message
- Prisma `PrismaClientKnownRequestError` code `P2025` → record not found
- All server action errors return a `FormState` with `success: false`
- Error messages in server actions are in **Spanish**

### Language

- Code comments: Spanish
- User-facing messages (form errors, toasts): Spanish
- UI labels: Spanish
- Variable/function names: Spanish (e.g., `crearProducto`, `obtenerProductos`, `cerrarSesion`)
- File names: Spanish kebab-case (e.g., `crear-producto.action.ts`)

## Database Schema

Models in `prisma/schema.prisma`:

| Model | Description |
|-------|-------------|
| `Usuario` | Users with roles: `ADMIN`, `VENDEDOR`. Has `activo` flag. |
| `Categoria` | Product categories (e.g., "Bolis de agua", "Pulpas de fruta"). `nombre` is unique. |
| `Producto` | Products with `precio` (Decimal 10,2), `stock_actual`, `stock_minimo`, `activo` flag. Belongs to `Categoria`. |
| `MovimientoInventario` | Inventory movements: `ENTRADA`, `SALIDA`, `AJUSTE`. Links to `Producto`, `Usuario`, and optionally `Venta`. |
| `Venta` | Sales with `total` (Decimal 10,2), `estado`: `ACTIVA` or `CANCELADA`. Has many `DetalleVenta`. |
| `DetalleVenta` | Line items per sale: `cantidad`, `precio_unitario`, `subtotal`. Cascade delete with `Venta`. |

### Key Constraints

- `Producto.categoria_id` → `Categoria.id` (indexed)
- `MovimientoInventario` indexed on `producto_id`, `usuario_id`, `fecha`, `venta_id`
- `DetalleVenta` indexed on `venta_id`, `producto_id`
- `Venta.fecha` indexed

## Seed Data

Running `pnpm prisma db seed` creates:
1. Admin user (from `ADMIN_MAIL` / `ADMIN_PASSWORD` env vars, bcrypt-hashed, role `ADMIN`)
2. 4 base categories: "Bolis de agua", "Bolis de leche", "Pulpas de fruta", "Concentrados"
3. 7 sample products with initial stock movements
4. 2 sample sales with details and stock deductions

All seed operations are idempotent (upserts, skipDuplicates, existence checks).

## Important Notes

- The Prisma client output directory is `generated/prisma/`, not the default `node_modules/@prisma/client`. Always import from `@/generated/prisma`.
- There are **no API routes** (`route.ts` files) in this project. All server-side mutations go through Server Actions.
- The `sandbox/` route is for development/testing only and should not be deployed to production.
- The `app/api/` directory exists but contains only a placeholder `text.txt` file.
