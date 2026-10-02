# Isamar • Tejidos y Crochet

Aplicación web de e-commerce para una marca artesanal de tejidos y crochet, desarrollada con Next.js y Supabase.

La app combina una tienda de productos, carrito de compras, WhatsApp para ventas y un panel de administración para gestionar catálogo e imágenes.

## Descripción

Isamar Tejidos y Crochet es un sitio de venta online para productos artesanales como mantas, accesorios y piezas personalizadas. La experiencia está pensada para una marca cálida y artesanal, con un diseño editorial y una compra guiada por WhatsApp.

Incluye:
- Catálogo de productos con filtros por categoría
- Modal de detalle del producto
- Carrito lateral y flujo de compra
- Integración con WhatsApp para pedidos y consultas
- Panel administrativo para crear, editar, eliminar y cambiar el estado de productos
- Subida de imágenes a Supabase Storage
- Persistencia de productos y datos en Supabase

## Stack

- Next.js 15
- React 19
- JavaScript
- Tailwind CSS
- Supabase
- Framer Motion
- GSAP
- react-icons

## Estructura del proyecto

```text
app/
  admin/             Panel administrativo de productos
  api/admin/         API del admin para CRUD y subida de imágenes
  globals.css        Estilos globales
  layout.jsx         Layout raíz de la app
  page.jsx           Página principal

components/          UI reutilizable del storefront
context/             Contexto del carrito
hooks/               Hooks de productos y utilidades
lib/                 Clientes y utilidades de Supabase / WhatsApp
public/              Archivos estáticos
next.config.js       Configuración de Next.js
tailwind.config.js   Configuración de Tailwind
package.json         Scripts y dependencias
supabase-setup.sql   SQL de setup inicial
supabase-migration.sql  SQL de migración
```

## Requisitos

- Node.js >= 18
- npm
- Cuenta de Supabase
- Despliegue opcional en Vercel

## Instalación local

1. Clona el repositorio:

```bash
git clone https://github.com/yuranimar/isamar-tejidos-crochet1.git
cd isamar-tejidos-crochet1
```

2. Instala dependencias:

```bash
npm install
```

3. Crea un archivo `.env.local` en la raíz con las siguientes variables:

```bash
# Variables públicas para frontend
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=tu_clave_publica
NEXT_PUBLIC_ADMIN_SECRET=tu_password_admin
NEXT_PUBLIC_WHATSAPP_NUMBER=573001234567

# Variables del servidor (admin / API)
SUPABASE_URL=https://tu-proyecto.supabase.co
SUPABASE_SECRET_KEY=tu_clave_secreta
ADMIN_SECRET=tu_password_admin
```

> Si no configuras Supabase, la app puede caer a datos demo para poder visualizar el storefront localmente.

4. Inicia el servidor de desarrollo:

```bash
npm run dev
```

5. Abre en el navegador:

```text
http://localhost:3000
```

## Scripts disponibles

```bash
npm run dev     # desarrollo local
npm run build   # build de producción
npm run start   # servidor de producción
npm run lint    # linter de Next.js
```

## Panel administrativo

El panel admin está disponible en:

```text
http://localhost:3000/admin
```

Desde ahí puedes:
- crear nuevos productos
- editar productos existentes
- borrar productos
- cambiar el estado (`available`, `new`, `out`)
- subir imágenes para cada producto

### Seguridad del admin

La API del admin usa una cabecera `x-admin-secret` y compara con `ADMIN_SECRET` para proteger rutas sensibles.

En producción, asegúrate de configurar correctamente:
- `ADMIN_SECRET`
- `NEXT_PUBLIC_ADMIN_SECRET` si quieres la pantalla de login del admin en frontend

## Supabase

El proyecto usa Supabase para:
- catálogo de productos
- almacenamiento de imágenes
- API de administración

Las rutas relevantes son:
- `lib/supabase.js`
- `lib/supabaseAdmin.js`
- `app/api/admin/product/route.js`
- `app/api/admin/upload-image/route.js`

### Bucket de imágenes

La subida de imágenes se realiza al bucket `products` dentro de Supabase Storage.

## Despliegue

Este proyecto está pensado para desplegarse en Vercel, no en GitHub Pages.

### Vercel

1. Conecta el repositorio en Vercel
2. Configura las variables de entorno del `.env.local`
3. Haz deploy del proyecto
4. El sitio queda disponible en una URL de Vercel

> La app usa rutas API del lado del servidor y variables de entorno privadas, por lo que no es un proyecto compatible con una publicación estática de GitHub Pages como tal.

## Funcionalidades principales

### Frontend de tienda
- Hero principal con branding artesanal
- Sección de catálogo
- Filtros por categoría
- Modal con detalle del producto
- Carrito con selección local
- Botón de WhatsApp para compra o consulta
- Testimonios y FAQ

### Backend de administración
- CRUD de productos
- manejo de estado de stock
- subida de imagen a Supabase Storage
- edición de metadatos del producto

## Notas importantes

- No subas archivos `.env.local` al repositorio
- Si usas GitHub, guarda variables sensibles en Vercel / entorno de deploy
- Revisa que el bucket de Supabase y la tabla `products` estén creados antes de usar el admin en producción

## Créditos

Proyecto desarrollado para Isamar • Tejidos y Crochet.

## Licencia

Este proyecto no especifica licencia en el repositorio actual.
