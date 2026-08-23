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
│   ├── (protected)/                   # Route group — authenticated pages
│   │   ├── layout.tsx                 # Auth shell (Navbar, Footer, background, verifySession)
│   │   ├── _actions/
│   │   │   └── navbar.action.ts       # Logout action
│   │   ├── _components/
│   │   │   ├── Navbar.tsx             # Navigation bar
│   │   │   └── Footer.tsx             # App footer
│   │   │
│   │   ├── dashboard/                 # URL: /dashboard — Home page
│   │   │   ├── page.tsx
│   │   │   ├── loading.tsx
│   │   │   └── _components/
│   │   │       └── InicioView.tsx
│   │   │
│   │   ├── productos/                 # URL: /productos — Products management
│   │   │   ├── page.tsx
│   │   │   ├── loading.tsx
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
│   │   ├── ventas/                    # URL: /ventas — Sales management
│   │   │   ├── page.tsx
│   │   │   ├── loading.tsx
│   │   │   ├── _actions/
│   │   │   │   └── crear-venta.action.ts
│   │   │   ├── _components/
│   │   │   │   ├── TablaVentas.tsx
│   │   │   │   ├── FiltrosVentas.tsx
│   │   │   │   ├── ModalRegistrarVenta.tsx
│   │   │   │   └── BuscadorProductos.tsx
│   │   │   ├── _schemas/
│   │   │   │   └── crear-venta.schema.ts
│   │   │   └── _types/
│   │   │       └── index.ts
│   │   │
│   │   └── usuarios/                  # URL: /usuarios — User management
│   │       ├── page.tsx               # Server component (DataTable wrapper)
│   │       ├── _actions/
│   │       │   ├── crear-usuario.ts
│   │       │   ├── editar-usuario.ts
│   │       │   └── deshabilitar-usuario.ts
│   │       ├── _components/
│   │       │   ├── TablaUsuarios.tsx
│   │       │   ├── FormUsuario.tsx     # Shared form (create + edit)
│   │       │   ├── ModalNuevoUsuario.tsx
│   │       │   ├── ModalEditarUsuario.tsx
│   │       │   └── AlertModalDeshabilitarUsuario.tsx
│   │       └── _schemas/
│   │           ├── crear-usuario.schema.ts
│   │           └── editar-usuario.schema.ts
│   │
│   ├── sandbox/                       # Dev/test playground (no auth, no shell)
│   │   ├── page.tsx
│   │   └── _components/
│   │       └── TablaPrueba.tsx
│
├── components/                        # Shared components
│   ├── AppShell.tsx                   # Auth shell wrapper (SessionProvider, Navbar, Footer)
│   ├── BotonPermiso.tsx               # Permission-aware button (renders disabled without handler if denied)
│   ├── DropdownMenuItemPermiso.tsx    # Permission-aware dropdown item
│   ├── ContenedorPagina.tsx           # Page container wrapper
│   ├── Datatable.tsx                  # Reusable data table
│   ├── Modal.tsx                      # Reusable modal wrapper (triggerButtonPermiso prop)
│   ├── Paginacion.tsx                 # Server-side pagination (URL-driven)
│   └── ui/                           # shadcn/ui primitives (27 components)
│
├── lib/                               # Utilities and business logic
│   ├── prisma.ts                      # Prisma client singleton (MariaDB adapter)
│   ├── session.ts                     # JWT session management (server-only)
│   ├── definitions.ts                 # Shared type definitions (SessionPayload)
│   ├── permisos.ts                    # RBAC: permission constants + role→permissions matrix + puede() + rolLabels
│   ├── form-state.ts                  # Generic FormState type for server actions
│   ├── money.ts                       # Currency formatting (MXN)
│   ├── text.ts                        # Text utilities (capitalize, normalize, accents)
│   ├── utils.ts                       # General utilities (cn, clsx, twMerge)
│   ├── prisma-errors.ts              # isPrismaError() helper (Prisma 7 compatible)
│   ├── contexts/
│   │   └── session-context.tsx       # SessionProvider + useSession() hook
│   ├── hooks/
│   │   └── useCopyToClipboard.ts     # Clipboard hook with auto-reset
│   ├── dal/                           # Data Access Layer (server-only, cached)
│   │   ├── auth.ts                    # verifySession() + requirePermiso() - auth/permission guards
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
import { isPrismaError } from "@/lib/prisma-errors";
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
    } else if (isPrismaError(error)) {
      switch (error.code) {
        case "P2002":
          message = "Duplicate record.";
          break;
        case "P2025":
          message = "Record not found.";
          break;
      }
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
- Custom shared components go in `components/` root (e.g., `ContenedorPagina.tsx`, `Datatable.tsx`, `Modal.tsx`)
- Route-specific components go in `_components/` alongside their page

### Route Organization

Each route uses co-located directories under a route group for shared layouts:

| Directory | Purpose |
|-----------|---------|
| `_actions/` | Server actions for this route |
| `_components/` | React components for this route |
| `_schemas/` | Zod validation schemas for this route |
| `_types/` | TypeScript type definitions for this route |

The `_` prefix ensures Next.js does not treat these as URL segments.

### Authentication Flow

1. User submits login form → `login.action.ts` validates with Zod, checks bcrypt hash (only for `activo: true` users), creates JWT session via `createSession()`
2. Session stored in httpOnly cookie (`session`), 7-day expiry, HS256
3. `verifySession()` in `lib/dal/auth.ts` decrypts cookie and redirects to `/api/sesion-expirada` if invalid. It then re-validates the user against the DB (`activo` flag) — disabled/deleted users are kicked out immediately even with an unexpired JWT. Both cases exit through the `/api/sesion-expirada` route handler, which clears the session cookie and lands on `/login`; redirecting straight to `/login` is not enough because the proxy (`proxy.ts`) bounces cookie-bearing visitors back to `/dashboard`, creating a loop. It returns fresh `nombre`/`rol` from the DB, so role changes apply on the next request without waiting for token expiry. Wrapped in React `cache()`, so this costs at most one PK query per request
4. Dashboard layout calls `verifySession()` to protect all dashboard routes
5. `AppShell` (`components/AppShell.tsx`) wraps protected routes with `<SessionProvider session={session}>`, making session data available to all client components
6. Client components access session via `useSession()` hook from `@/lib/contexts/session-context`
7. Logout via `cerrarSesion()` in `navbar.action.ts` deletes cookie and redirects

### Session Context

For accessing session data in client components, use the `useSession()` hook:

```typescript
"use client";

import { useSession } from "@/lib/contexts/session-context";

export function MyComponent() {
  const { id_usuario, nombre, rol, debe_cambiar_password } = useSession();
  
  return <div>Hola, {nombre}</div>;
}
```

**Pattern:** `SessionProvider` wraps all protected routes in `AppShell.tsx`. Session data comes from `verifySession()` in the server component layout.

### Role-Based Access Control (RBAC)

Granular permission system defined in **`lib/permisos.ts`** — the single source of truth for permissions and role assignments. It is client-safe (no `server-only` import) so both server and client code can use it.

- Permissions are string constants shaped `"resource.action"` (e.g., `"usuarios.crear"`) exported via the `PERMISOS` object.
- `PERMISOS_POR_ROL` maps each role to its permission list. **Deny by default**: unknown roles get no permissions.
- Helper: `puede(rol: string, permiso: Permiso): boolean`.

Current matrix:

| Resource | ADMIN | VENDEDOR |
|---|---|---|
| Dashboard | ✅ | ✅ |
| Products (ver/crear/editar/estado/stock) | ✅ | ✅ |
| Sales (ver/crear/cancelar propias) | ✅ | ✅ |
| Sales (cancelar cualquiera) | ✅ | ❌ |
| Users (ver/crear/editar/deshabilitar) | ✅ | ❌ |

**Ownership permissions:** `ventas.cancelar` only covers the seller's own sales; cancelling someone else's sale requires `ventas.cancelarCualquiera`. In list views, pick the permission per row based on ownership (`Number(id_usuario) === venta.usuario_id ? PERMISOS.ventasCancelar : PERMISOS.ventasCancelarCualquiera`) and let `BotonPermiso`/`DropdownMenuItemPermiso` decide — do not hardcode role checks in UI or actions. The server action rejects non-owner cancellations with "Solo puedes cancelar tus propias ventas."

**Three enforcement layers — all three are mandatory for any new page/action/button:**

#### 1. Pages (`requirePermiso`)

Every protected `page.tsx` starts with a permission guard. Unauthorized roles are redirected to `/dashboard` server-side (no flash):

```typescript
import { requirePermiso } from "@/lib/dal/auth";
import { PERMISOS } from "@/lib/permisos";

export default async function MiPagina() {
  await requirePermiso(PERMISOS.miRecursoVer);
  // ...
}
```

#### 2. Server Actions (guard)

Every mutating action adds an early guard right after `verifySession()`. This is the real security layer — UI state is never trusted. Returns a `FormState` rejection + logs a warning:

```typescript
import { puede, PERMISOS } from "@/lib/permisos";

const usuario = await verifySession();

if (!puede(usuario.rol, PERMISOS.usuariosCrear)) {
  log.warn("Intento de crear usuario sin permisos.", {
    id_usuario: usuario.id_usuario,
    rol: usuario.rol,
  });
  return {
    success: false,
    message: "No tienes permisos para realizar esta acción.",
    timestamp: Date.now(),
  };
}
```

Logout (`navbar.action.ts`) is universal and has no guard.

#### 3. UI Components

Action buttons are rendered through permission-aware wrappers that internally branch on the permission: if denied they render visually identical but `disabled` with **no handlers at all**; if allowed, a normal element with handlers.

- `components/BotonPermiso.tsx` → `<BotonPermiso permiso={PERMISOS.x} onClick={...} {...buttonProps}>`
- `components/DropdownMenuItemPermiso.tsx` → same pattern for dropdown items
- `Modal.tsx` accepts `triggerButtonPermiso?: Permiso` to protect creation triggers

Both wrappers derive their props from the underlying shadcn components and deliberately **omit `disabled` from their API** — lack of permission is the only way they disable. Do not reimplement this with inline `disabled={!tienePermiso}` conditionals.

Navigation links in `Navbar.tsx` declare a `permiso` per link and are **filtered out** (hidden) rather than disabled — navigation is not an action.

**Security principle:** disabled/hidden UI is UX only and has zero security value. Dev-tools manipulation cannot be prevented client-side; the server-side guards (layers 1–2) are what actually enforce access control and must never be skipped because "the button already handles it".

**How to extend:**

- Restrict an existing capability → remove the permission from the role's array in `PERMISOS_POR_ROL`. Pages redirect, actions reject, and buttons disable automatically.
- New capability → add it to `PERMISOS`, wire `requirePermiso` into the page, add the guard to the action(s), use `BotonPermiso`/`DropdownMenuItemPermiso`/`triggerButtonPermiso` in the UI.
- New role → add it to the Prisma `RolUsuario` enum; `PERMISOS_POR_ROL` and `rolLabels` (typed `Record<RolUsuario, ...>`) will then fail to compile until you give the role an explicit entry (it would have zero permissions otherwise).

### Styling

- Tailwind CSS v4 (no `tailwind.config.js`, uses CSS-based config in `globals.css`)
- Dark/light theme toggle via `@teispace/next-themes`
- CSS variables for theming (configured in `components.json`)
- `cn()` utility from `@/lib/utils` for conditional class merging

### Error Handling

- Prisma `PrismaClientInitializationError` → connection error message
- Prisma errors: use `isPrismaError()` from `@/lib/prisma-errors` (Prisma 7 compatible)
  - `P2002` → unique constraint violation
  - `P2025` → record not found
- **Do NOT** use `instanceof PrismaClientKnownRequestError` (breaks with driver adapters)
- All server action errors return a `FormState` with `success: false`
- Error messages in server actions are in **Spanish**

### Pagination Standard

All list views with potentially large datasets must use server-side pagination via URL search params. For small catalogs that fit entirely in memory, use `DataTable` which handles pagination internally.

#### 1. Pagination Component

- Location: `components/Paginacion.tsx`
- Self-contained client component that reads/writes URL search params internally
- Only prop required: `totalPages: number`
- Translates directly to URL params: `?page=N&pageSize=M`
- Includes page size selector (5, 10, 25, 50 items per page)
- Hides navigation buttons when `totalPages <= 1` (page size selector remains visible)
- Must be rendered within a `<Suspense>` boundary (uses `useSearchParams()`)
- **DO NOT** pass `onPageChange` or `onPageSizeChange` callbacks — the component manages navigation via `router.replace()` internally
- **Note:** `DataTable` (`components/Datatable.tsx`) has its own client-side pagination built-in. Do not use `Paginacion` with `DataTable`. `Paginacion` is for large datasets that are fetched page-by-page from the server (e.g., sales).

#### 2. DAL Pattern (lib/dal/*.ts)

Every data access function for list views must follow this pattern:

```typescript
import "server-only";
import { prisma } from "@/lib/prisma";
import { cache } from "react";

export const obtenerAlgo = cache(async (params?: {
  page?: number;
  pageSize?: number;
  // ...other filters
}): Promise<{ data: Something[]; totalPages: number; total: number }> => {
  const { page = 1, pageSize = 5 } = params ?? {};

  const [items, total] = await Promise.all([
    prisma.modelo.findMany({
      skip: (page - 1) * pageSize,
      take: pageSize,
      // where, orderBy, select...
    }),
    prisma.modelo.count({ where }),
  ]);

  return {
    data: items,
    totalPages: Math.ceil(total / pageSize),
    total,
  };
});
```

Existing reference: `lib/dal/ventas.ts` (`obtenerVentas`).

#### 3. Server Component Pattern (page.tsx)

```typescript
export default async function MiPagina(props: {
  searchParams?: Promise<{
    q?: string;
    page?: string;
    pageSize?: string;
  }>
}) {
  const searchParams = await props.searchParams;
  const page = Math.max(1, Number(searchParams?.page) || 1);
  const pageSize = Math.max(1, Number(searchParams?.pageSize) || 5);

  const { data, totalPages } = await obtenerAlgo({ page, pageSize });

  return (
    <Suspense fallback="Cargando...">
      <MiTabla data={data} totalPages={totalPages} />
    </Suspense>
  );
}
```

#### 4. Client Component Pattern (componentes que renderizan listas)

Receive `totalPages` from the server component and render `<Paginacion>`:

```typescript
import Paginacion from "@/components/Paginacion";

export default function MiTabla({ data, totalPages }: { data: Something[]; totalPages: number }) {
  return (
    <div>
      {data.map(item => <div key={item.id}>{item.name}</div>)}
      <Paginacion totalPages={totalPages} />
    </div>
  );
}
```

**Note:** `DataTable` (`components/Datatable.tsx`) has its own client-side pagination built-in. Do not use `Paginacion` with `DataTable`. `Paginacion` is for large datasets that are fetched page-by-page from the server (e.g., sales).

#### 5. Filter / Search Reset

When filters change (search text, date range, category, etc.), the filter handler **must** delete the `page` param so the view resets to page 1:

```typescript
const updateParams = (updates: Record<string, string | undefined>) => {
  const params = new URLSearchParams(searchParams);
  for (const [key, value] of Object.entries(updates)) {
    if (value) params.set(key, value);
    else params.delete(key);
  }
  params.delete("page"); // ← reset to page 1
  router.replace(`${pathname}?${params.toString()}`);
};
```

When clearing all filters, preserve `pageSize` if the user had changed it:

```typescript
const limpiarFiltros = () => {
  const params = new URLSearchParams();
  if (searchParams.has("pageSize")) {
    params.set("pageSize", searchParams.get("pageSize")!);
  }
  const qs = params.toString();
  router.replace(qs ? `${pathname}?${qs}` : pathname);
};
```

Existing reference: `app/(protected)/ventas/_components/FiltrosVentas.tsx`

#### 6. Page Validation (ensureValidPage)

When items are deleted or cancelled, the user may land on a page that no longer exists (e.g., page 2 with only 1 item left). To prevent showing an empty state, every `page.tsx` with server-side pagination **must** call `ensureValidPage()` after fetching data:

```typescript
import { ensureValidPage } from "@/lib/pagination";

// ... after fetching data
ensureValidPage(page, totalPages, "/ventas", {
  q: query,
  desde,
  hasta,
  offset,
}, pageSize);
```

The utility lives in `lib/pagination.ts` and uses `redirect()` from `next/navigation` (server-side, no flash). It redirects to the last valid page while preserving all current filters and `pageSize`.

**When to call it:** After every DAL call that returns `totalPages`, before the `return` statement.

Existing reference: `app/(protected)/ventas/page.tsx`

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
- There are **no business API routes** in this project. All server-side mutations go through Server Actions. The single exception is `app/api/sesion-expirada/route.ts` — session-lifecycle infrastructure (clears the cookie when a session is revoked/expired) that cannot be a Server Action because it must run during page-render redirects, where cookies are read-only.
- The `sandbox/` route is for development/testing only, inherits the root layout (no auth shell), and should not be deployed to production.
- The `app/api/` directory contains only `sesion-expirada/route.ts` (session-lifecycle, see Authentication Flow) and the placeholder `text.txt` file.
