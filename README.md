# MarketSoft Frontend

SPA (Single Page Application) para la gestión del sistema de supermercado **MarketSoft**, desarrollada con React + TypeScript y consumo de API REST.

---

## Integrantes

Jhonathan Salazar Muñoz — Arquitecto de soluciones y desarrollador

---

## Instrucciones de Ejecución

### Prerrequisitos
- Node.js >= 18
- El backend de MarketSoft corriendo en `http://localhost:3000`

> Para cambiar la URL del backend, editar `src/api/axiosInstance.ts` → campo `baseURL`.

### Instalación y arranque

```bash
git clone 
cd markesoft-frontend
npm install
npm start
```

La aplicación se abrirá en `http://localhost:5173`.

---

## Autenticación

El login solicita únicamente el **correo electrónico** del usuario. El sistema busca ese correo en la API (`GET /api/users`) y, si existe, inicia la sesión localmente.

> La sesión se almacena en `sessionStorage`: persiste al recargar la página y se elimina al cerrar el tab o al hacer clic en **Cerrar sesión**.

### Primera vez / sin usuarios en la base de datos

Si la base de datos está vacía, no habrá usuarios con los que iniciar sesión. En ese caso:

1. En la pantalla de login, hacer clic en la pestaña **Registrarse**.
2. Completar Nombre, Correo y Rol (se recomienda crear el primer usuario como `Admin`).
3. Al enviar el formulario el usuario se crea en la API y la sesión se inicia automáticamente.

> A partir de ahí se pueden crear más usuarios desde el módulo **Usuarios** dentro de la aplicación.

---

## Roles y Permisos

El sistema implementa control de acceso basado en el campo `role` del usuario registrado en la base de datos. Se contemplan tres roles:

### `admin`
- Accede a **todas** las pestañas: Productos, Usuarios, Proveedores, Ventas.
- Puede **crear, editar y eliminar** registros en todos los módulos.

### `cashier` (Cajero)
- Accede a **todas** las pestañas: Productos, Usuarios, Proveedores, Ventas.
- Solo puede **crear, editar y eliminar** en el módulo de **Productos**.
- En Usuarios, Proveedores y Ventas solo puede **visualizar** (sin columna de acciones).

### `usuario`
- Accede únicamente a **Productos** y **Proveedores**.
- Solo puede **visualizar** ambos módulos (sin columna de acciones, sin botón crear).
- Las rutas `/users` y `/sales` redirigen automáticamente a `/products`.

### Resumen de permisos

| Módulo      | admin          | cashier        | usuario        |
|-------------|----------------|----------------|----------------|
| Productos   | Ver + Escribir | Ver + Escribir | Ver (solo)     |
| Usuarios    | Ver + Escribir | Ver (solo)     | Sin acceso     |
| Proveedores | Ver + Escribir | Ver (solo)     | Ver (solo)     |
| Ventas      | Ver + Escribir | Ver (solo)     | Sin acceso     |

> **"Escribir"** implica: botón crear visible, columna Acciones visible con botones Editar y Eliminar.
> **"Ver (solo)"** implica: tabla visible, sin columna Acciones, sin botón crear.
> **"Sin acceso"** implica: pestaña oculta en el navbar y ruta protegida con redirección.

---

## Descripción de la Arquitectura

```
src/
├── api/
│   └── axiosInstance.ts              # Instancia base de Axios (baseURL configurable)
├── context/
│   ├── authContextInstance.ts        # Instancia del contexto de autenticación
│   ├── AuthContext.tsx               # AuthProvider (proveedor de sesión)
│   └── useAuth.ts                    # Hook useAuth()
├── hooks/
│   └── usePermissions.ts             # Hook canView() / canWrite() por módulo
├── services/
│   ├── productService.ts             # CRUD → /api/products
│   ├── userService.ts                # CRUD → /api/users
│   ├── providerService.ts            # CRUD → /api/providers
│   └── saleService.ts                # CRUD → /api/sales
├── components/
│   ├── Navbar.tsx                    # Navbar con tabs filtradas por rol + logout
│   └── ProtectedRoute.tsx            # Guard de rutas (requiere sesión y/o permiso de módulo)
├── modules/
│   ├── auth/
│   │   └── LoginPage.tsx             # Página de login (solo email)
│   ├── products/
│   │   ├── Product.types.ts
│   │   ├── ProductList.tsx
│   │   └── ProductForm.tsx
│   ├── users/
│   │   ├── User.types.ts
│   │   ├── UserList.tsx
│   │   └── UserForm.tsx
│   ├── providers/
│   │   ├── Provider.types.ts
│   │   ├── ProviderList.tsx
│   │   └── ProviderForm.tsx
│   └── sales/
│       ├── Sale.types.ts
│       ├── SaleList.tsx              # Lista con detalle (GET /sales/:id por cada venta)
│       ├── SaleForm.tsx              # Modal de nueva venta con carrito interactivo
│       └── SaleEditModal.tsx         # Modal de edición de venta existente
├── App.tsx                           # Configuración de rutas + AuthProvider
└── main.tsx                          # Entry point + Bootstrap CSS
```

### Stack tecnológico

| Capa | Tecnología | Propósito |
|------|-----------|-----------|
| UI | React 19 + TypeScript | Componentes reactivos tipados |
| Estilos | Bootstrap 5 | Diseño responsivo sin CSS propio |
| Routing | react-router-dom v6 | Navegación SPA y rutas protegidas |
| HTTP | Axios | Consumo de API REST |
| Auth | Context API + sessionStorage | Sesión local basada en rol |

### Decisiones de diseño

- **Separación de responsabilidades**: toda la lógica HTTP vive en `services/`; los componentes solo manejan estado de UI.
- **Control de acceso en dos niveles**: `ProtectedRoute` protege rutas completas; `usePermissions` oculta botones y columnas dentro de cada vista.
- **Un módulo por entidad**: cada módulo contiene su tipo, su lista y su formulario, minimizando duplicación.
- **Refetch por trigger**: las mutaciones (crear/editar/eliminar) incrementan un contador que dispara el `useEffect` de carga, garantizando datos frescos desde la API.
- **Modal inline**: los formularios usan Bootstrap CSS puro sin depender de `bootstrap.js` ni `react-bootstrap`.
- **Ventas con detalle**: la lista de ventas realiza primero `GET /api/sales` para obtener los IDs y luego `Promise.all` con `GET /api/sales/:id` para cargar el detalle completo (productos, usuario, total).

---

## Limitaciones conocidas

| # | Limitación | Detalle |
|---|-----------|---------|
| 1 | **Sin autenticación real** | No hay JWT ni tokens. El "login" solo verifica que el email exista en la API. Cualquiera puede iniciar sesión con el email de otro usuario. |
| 2 | **Rol sensible a mayúsculas** | El campo `role` del usuario debe estar almacenado exactamente como `admin`, `cashier` o `usuario` (minúsculas). Cualquier variación (`Admin`, `CASHIER`) hará que el sistema trate al usuario como sin permisos. |
| 3 | **Sesión no persistente entre tabs** | Se usa `sessionStorage`, no `localStorage`. Al abrir una nueva pestaña del navegador la sesión no se comparte. |
| 4 | **Sin refresh de tokens** | Al recargar la página la sesión se restaura solo si el tab sigue abierto (sessionStorage). No hay mecanismo de expiración de sesión. |
| 5 | **Ventas: N+1 requests** | `SaleList` hace `1 + N` peticiones HTTP (una para obtener IDs, N para obtener detalles). Con volúmenes grandes esto puede ser lento. Se resuelve si el backend agrega un endpoint `GET /sales?include=details`. |
| 6 | **Sin paginación** | Todos los listados cargan la colección completa. Si la base de datos crece, el rendimiento se degrada. |
| 7 | **Sin validación de backend duplicada** | Los formularios validan solo en el frontend (campos requeridos). Errores devueltos por el servidor (ej: email duplicado) se muestran como alerta genérica. |
| 8 | **Edición de venta limitada** | `SaleEditModal` solo permite editar la fecha y el total directamente. No se pueden modificar los ítems/productos de una venta existente. |
