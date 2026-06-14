# Isamar • Tejidos y Crochet — Next.js

Migrado de Vite + React a Next.js App Router.

## Cambios principales

| Antes (Vite)                        | Ahora (Next.js)                          |
|-------------------------------------|------------------------------------------|
| `src/components/`                   | `components/`                            |
| `src/lib/`                          | `lib/`                                   |
| `api/admin/product.js` (Vercel)     | `app/api/admin/product/route.js`         |
| `api/admin/upload-image.js`         | `app/api/admin/upload-image/route.js`    |
| `VITE_SANITY_PROJECT_ID`            | `NEXT_PUBLIC_SANITY_PROJECT_ID`          |
| `import.meta.env.VITE_*`            | `process.env.NEXT_PUBLIC_*`              |

## Variables de entorno

Copia `.env.local.example` a `.env.local` y rellena los valores.

## Correr localmente

```bash
npm install
npm run dev
# → http://localhost:3000
```

## Deploy en Vercel

1. Push a GitHub
2. Importar en Vercel
3. Agregar las variables de entorno del `.env.local.example`
4. Deploy automático

## Rutas

- `/` — Tienda principal
- `/admin` — Panel de administración
- `/api/admin/product` — CRUD productos (POST)
- `/api/admin/upload-image` — Subir imágenes (POST)
