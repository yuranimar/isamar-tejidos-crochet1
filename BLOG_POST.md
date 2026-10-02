# 🧶 Isamar Tejidos y Crochet: Tienda en Línea Full-Stack
## Guía completa del proyecto para portfolio y demostración

---

## Resumen ejecutivo

**Qué es:** Una tienda en línea completa + panel de administración privado para una marca de tejidos y crochet artesanales.

**Para quién:** Isamar (marca artesanal en Medellín que vende mantas, accesorios y piezas personalizadas).

**Tiempo:** 2 semanas

**Stack:** Next.js 15, React 19, Supabase, Tailwind CSS, Framer Motion, Vercel

**Estado:** ✅ En producción en https://isamar-tejidos-crochet1.vercel.app

---

## 1. El problema que resolvió

**Antes:**
- La dueña no tenía forma de vender en línea
- No había catálogo centralizado
- No había manera de actualizar productos sin conocimientos técnicos
- Las imágenes estaban dispersas

**Después:**
- Sitio de venta 24/7 accesible desde cualquier dispositivo
- Panel admin donde la dueña puede crear/editar/eliminar productos sin código
- Base de datos en tiempo real con Supabase
- Subida de fotos directa desde móvil o escritorio

---

## 2. Arquitectura del proyecto

### Estructura de carpetas

```
isamar-tejidos-crochet1/
├── app/
│   ├── admin/                    # Panel administrativo
│   │   ├── AdminPanel.jsx        # Componente principal del admin
│   │   └── page.jsx              # Página /admin
│   ├── api/admin/                # API routes protegidas
│   │   ├── product/route.js      # CRUD de productos
│   │   └── upload-image/route.js # Upload de imágenes a Supabase
│   ├── globals.css
│   ├── layout.jsx
│   └── page.jsx                  # Home (tienda)
├── components/                   # UI del storefront
│   ├── Catalog.jsx               # Grid de productos
│   ├── ProductCard.jsx           # Tarjeta individual
│   ├── ProductDetailModal.jsx    # Modal con detalles
│   ├── CartDrawer.jsx            # Carrito lateral
│   ├── Navbar.jsx
│   ├── Hero.jsx
│   ├── Testimonials.jsx
│   ├── FaqShipping.jsx
│   └── Footer.jsx
├── context/
│   └── CartContext.jsx           # Estado del carrito (React Context)
├── hooks/
│   ├── useProducts.js            # Hook para fetch de productos
│   ├── useTestimonials.js
│   └── useDocumentTitle.js
├── lib/
│   ├── supabase.js               # Cliente público Supabase
│   ├── supabaseAdmin.js          # Cliente admin Supabase
│   ├── whatsapp.js               # Generación de links WhatsApp
│   └── stockInfo.js              # Lógica de urgencia de stock
├── public/                       # Assets estáticos
├── package.json
├── README.md
├── README-MIGRACION.md
├── next.config.js
├── tailwind.config.js
└── supabase-*.sql               # Setup de base de datos
```

### Flujo de datos

```
HOME (/) 
  ├── useProducts() → fetch desde Supabase
  ├── Catalog.jsx → Muestra productos filtrados
  └── ProductCard.jsx → Click abre ProductDetailModal

MODAL
  ├── Muestra detalles, galería de fotos
  ├── Botón "Agregar al carrito" → CartContext.add()
  ├── Botón "Pedir por WhatsApp" → buildWhatsAppURL()
  └── Botón "Hacer pregunta" → Abre chat de WhatsApp

CARRITO
  ├── CartContext almacena items
  ├── CartDrawer muestra resumen
  └── Botón "Pedir" → Abre WhatsApp con carrito pre-llenado

ADMIN (/admin)
  ├── LoginScreen (validar ADMIN_SECRET)
  ├── AdminPanel
  │   ├── Listar productos
  │   ├── Crear → ProductForm → uploadImage() + createProduct()
  │   ├── Editar → ProductForm → updateProduct()
  │   └── Eliminar → Confirmación → deleteProduct()
  └── Productos actualizados en Supabase → Reflejan en home al instante
```

---

## 3. Funcionalidades clave (y cómo se construyeron)

### 3.1 Storefront / Tienda principal

**Ubicación:** `app/page.jsx` + `components/`

**Qué incluye:**
- Hero animado (Framer Motion)
- Catálogo con filtros por categoría
- Modal de producto con galería
- Carrito lateral
- Testimonios
- FAQ de envíos
- Footer con redes sociales
- Botón flotante de WhatsApp

**Cómo funciona:**

1. El componente `Catalog.jsx` llama a `useProducts()`
2. `useProducts()` fetcha desde `lib/supabase.js` → `fetchProducts()`
3. Si Supabase no está configurado, cae a datos demo
4. Productos se renderean con `ProductCard.jsx`
5. Click en producto → abre `ProductDetailModal.jsx`
6. Dentro del modal: agregar al carrito, pedir por WhatsApp, preguntar

**Stocks / Urgencia:**

El archivo `lib/stockInfo.js` tiene la lógica:
- stock = null/undefined → sin badge
- stock = 1 → "¡Última unidad!" (rojo/borgoña)
- stock = 2-3 → "Últimas N unidades" (dorado)
- stock ≥ 4 → sin badge
- status = 'out' → "Agotado"

### 3.2 Carrito

**Ubicación:** `context/CartContext.jsx` + `components/CartDrawer.jsx`

**Qué incluye:**
- Agregar/quitar/editar cantidad
- Persistencia local (localStorage)
- Total calculado
- Botón "Pedir por WhatsApp" con carrito pre-llenado

**Cómo funciona:**

```javascript
// CartContext.jsx
const CartProvider = ({ children }) => {
  const [items, setItems] = useState([])
  
  const add = (product) => { /* agrega producto */ }
  const remove = (id) => { /* quita producto */ }
  const update = (id, qty) => { /* actualiza cantidad */ }
  
  return <CartContext.Provider value={{items, add, remove, update}}>
```

El carrito se muestra en `CartDrawer.jsx` y puede abrirse desde cualquier lado.

### 3.3 Integración con WhatsApp

**Ubicación:** `lib/whatsapp.js`

**Cómo funciona:**

Genera un link de WhatsApp pre-llenado con el mensaje. Ejemplos:

1. **Comprar un producto:**
   ```javascript
   buildWhatsAppURL(product, 'buy')
   // genera: https://wa.me/573001234567?text=Hola, interesado en "Manta Luna de Miel"...
   ```

2. **Pedir un producto personalizado:**
   ```javascript
   buildWhatsAppURL(product, 'custom')
   // genera: https://wa.me/573001234567?text=Hola, interesado en un producto personalizado...
   ```

3. **Pedir con carrito:**
   ```javascript
   buildWhatsAppURL(product, 'buy', { cart: [...] })
   // genera: mensaje con lista de productos y total
   ```

4. **Aviso de disponibilidad:**
   ```javascript
   buildWhatsAppURL(product, 'notify', { name, phone })
   // genera: https://wa.me/573001234567?text=Hola! Me avisan cuando esté disponible...
   ```

**Por qué:** No integré pasarela de pago (Stripe, MercadoPago, etc.). La dueña prefiere manejar pagos por WhatsApp/contraentrega.

### 3.4 Panel administrativo

**Ubicación:** `app/admin/` + `/api/admin/`

**Rutas:**
- `GET /admin` → Page que renderiza AdminPanel
- `POST /api/admin/product` → CRUD de productos
- `POST /api/admin/upload-image` → Upload de imágenes

#### Autenticación

En `/api/admin/product/route.js`:

```javascript
function isAuthorized(req) {
  const ADMIN_SECRET = process.env.ADMIN_SECRET
  if (!ADMIN_SECRET) return true // fallback en dev
  return req.headers.get('x-admin-secret') === ADMIN_SECRET
}
```

En el frontend (`AdminPanel.jsx`), hay un `LoginScreen` que valida:

```javascript
if (input === SECRET || (!SECRET && input === 'admin')) {
  onLogin()
}
```

Si `NEXT_PUBLIC_ADMIN_SECRET` no está configurado, muestra un login falso (dev mode).

#### CRUD de productos

**Crear:**
```javascript
POST /api/admin/product
{
  "action": "create",
  "data": {
    "name": "Manta Luna de Miel",
    "category": "mantas",
    "price": "$85.000",
    "stock": 5,
    "description": "...",
    "image": "https://..."
  }
}
```

**Editar:**
```javascript
POST /api/admin/product
{
  "action": "update",
  "id": "product-id",
  "data": { /* campos a actualizar */ }
}
```

**Eliminar:**
```javascript
POST /api/admin/product
{
  "action": "delete",
  "id": "product-id"
}
```

**Cambiar estado:**
```javascript
POST /api/admin/product
{
  "action": "status",
  "id": "product-id",
  "status": "available" | "new" | "out"
}
```

#### Upload de imágenes

**Ubicación:** `/api/admin/upload-image/route.js`

**Qué hace:**
1. Recibe imagen como binary (POST con Content-Type: image/*)
2. Valida que sea imagen y que no supere 10MB
3. Genera nombre único: `${timestamp}-${random}.jpg`
4. Sube a Supabase Storage en bucket `products`
5. Retorna URL pública

**En AdminPanel.jsx:**

```javascript
const handleImage = async (file) => {
  const uploaded = await uploadImage(file)
  // uploaded.url = "https://..."
  return uploaded.url
}
```

Cuando el usuario crea un producto, se sube la imagen primero, se obtiene la URL, y luego se guarda el producto.

### 3.5 Base de datos (Supabase)

**Tabla `products`:**

```sql
id (uuid, primary key)
name (text)
category (text) -- mantas, accesorios, personalizados
price (text)
original_price (text, nullable)
description (text, nullable)
image (text, nullable) -- URL pública
images (jsonb, nullable) -- array de URLs
material (text, nullable)
dimensions (text, nullable)
delivery_time (text, nullable)
care_instructions (text, nullable)
status (text) -- available, new, out
stock (integer, nullable) -- null = ilimitado
order (integer, nullable)
created_at (timestamp)
updated_at (timestamp)
```

**Storage:**

Bucket `products` con carpeta `productos/`

Políticas RLS (Row Level Security):
- Lectura pública para imágenes
- Escritura solo con `SUPABASE_SECRET_KEY` (desde API routes)

**Acceso desde código:**

```javascript
// Cliente público (frontend)
import { supabase } from '@/lib/supabase'
const { data } = await supabase.from('products').select('*')

// Cliente admin (API routes)
import { createClient } from '@supabase/supabase-js'
const sb = createClient(SUPABASE_URL, SUPABASE_SECRET_KEY)
await sb.from('products').insert([...])
```

---

## 4. Cómo explicar esto en entrevistas

### Pregunta: "¿Cuéntame sobre un proyecto full-stack que hayas hecho?"

**Respuesta estructura:**

> Desarrollé una tienda en línea para una marca artesanal de tejidos. El proyecto incluía:
>
> **Frontend:** Storefront con catálogo, filtros, modal de detalle, carrito y WhatsApp integrado. Usé React, Tailwind y Framer Motion para animaciones.
>
> **Backend:** API routes de Next.js para crear, editar y eliminar productos. Las rutas están protegidas con autenticación por header (x-admin-secret).
>
> **Base de datos:** Supabase con PostgreSQL. Tabla de productos, storage para imágenes, y políticas de seguridad RLS.
>
> **Admin panel:** Interfaz privada donde la dueña puede subir fotos, cambiar precios y stock sin código. El login valida una contraseña, y el upload de imágenes va directo a Supabase Storage.
>
> **Deploy:** Vercel con CI/CD automático. Cada push a main deploya en segundos.
>
> Lo más complejo fue la integración de WhatsApp: generé URLs pre-llenadas con detalles del producto y carrito. También implementé un fallback a datos demo si Supabase no estaba configurado, para poder testear sin credenciales.

### Pregunta: "¿Cómo aseguraste los datos sensibles?"

> Las credenciales de Supabase (secret key) nunca se envían al frontend. Usan variables de servidor (`SUPABASE_SECRET_KEY`). El cliente público solo tiene acceso de lectura con su clave pública limitada.
>
> La API de admin requiere un header `x-admin-secret` que se valida en el servidor. Si alguien intenta hacer POST sin ese header, recibe un 401.
>
> Las imágenes se suben desde el servidor, no desde el cliente, así que el archivo binario nunca expone credenciales.

### Pregunta: "¿Qué aprovecharías para mejorar?"

> Agregaría tests (Jest + React Testing Library) y un CI/CD pipeline en GitHub Actions. También implementaría rate limiting en las API routes para evitar abusos.
>
> Pasaría a TypeScript para mayor robustez.
>
> Añadiría una pasarela de pago real (Stripe o MercadoPago) aunque ahora manejan pagos por WhatsApp.

### Pregunta: "¿Por qué Next.js y no otro framework?"

> Next.js tiene API routes integradas, así que backend y frontend en un mismo proyecto. Vercel deploya automáticamente. Además, el App Router con server components es moderno y performante.
>
> Supabase integra bien con Next.js y no requiere backend separado.

---

## 5. Demostración en vivo

### URL: https://isamar-tejidos-crochet1.vercel.app

**Qué mostrar:**

1. **Storefront:**
   - Navega por categorías
   - Haz click en un producto → abre modal
   - Ve la galería de fotos con zoom
   - Nota el badge de stock urgency
   - Agrega al carrito
   - Abre el carrito lateral

2. **WhatsApp:**
   - Haz click en "Pedir por WhatsApp"
   - Se abre WhatsApp pre-llenado con detalles del producto
   - Muestra que está integrado sin pasarela de pago

3. **Admin (si tienes acceso):**
   - Entra a `/admin`
   - Ingresa la contraseña
   - Muestra la lista de productos
   - Crea un producto nuevo (con imagen)
   - Edita uno existente
   - Nota cómo cambia el estado (available/new/out)
   - Vuelve a home y recarga: el nuevo producto aparece al instante

**Nota:** Si no tienes credenciales de admin, explica el flujo:
> "Cuando la dueña crea un producto desde el admin, hace POST a `/api/admin/product`. El servidor valida el secret, sube la imagen a Supabase Storage, y inserta en la tabla `products`. El frontend fetcha desde Supabase y lo muestra en el catálogo en tiempo real."

---

## 6. Variables de entorno

Guarda este archivo como `.env.local` (NO comitear):

```bash
# Frontend (públicas)
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=tu_clave_publica
NEXT_PUBLIC_ADMIN_SECRET=tu_password_admin
NEXT_PUBLIC_WHATSAPP_NUMBER=573001234567

# Backend (privadas)
SUPABASE_URL=https://tu-proyecto.supabase.co
SUPABASE_SECRET_KEY=tu_clave_secreta
ADMIN_SECRET=tu_password_admin
```

**En Vercel:**
- Copia estas en Settings → Environment Variables

---

## 7. Stack técnico desglosado

| Componente | Herramienta | Por qué |
|-----------|-----------|---------|
| **Framework** | Next.js 15 | API routes integradas, App Router moderno, fácil deploy en Vercel |
| **UI** | React 19 | Hooks, Context API, componentes funcionales |
| **Estilos** | Tailwind CSS | Utility-first, responsive rápido, customizable |
| **Animaciones** | Framer Motion | Smooth, declarativo, fácil de controlar |
| **2D animaciones** | GSAP | Para efectos más complejos |
| **Base de datos** | Supabase (PostgreSQL) | Backend as a service, realtime, RLS integrado |
| **Storage** | Supabase Storage | Bucket para imágenes, fácil de usar |
| **Deploy** | Vercel | Integración perfecta con Next.js, CI/CD automático |
| **Control de versión** | Git + GitHub | Historial, colaboración, backup |
| **Integración externa** | WhatsApp API | Compras y consultas sin pasarela de pago |

---

## 8. Detalles técnicos importantes

### Conversión camelCase ↔ snake_case

En `/api/admin/product/route.js`:

```javascript
// Frontend envía: { originalPrice, deliveryTime, careInstructions }
// SQL espera: { original_price, delivery_time, care_instructions }

function toSnake(data) {
  const map = { 
    originalPrice: "original_price", 
    deliveryTime: "delivery_time", 
    careInstructions: "care_instructions" 
  }
  const result = {}
  for (const [key, val] of Object.entries(data)) {
    result[map[key] || key] = val
  }
  return result
}

function toCamel(row) {
  return { 
    ...row, 
    originalPrice: row.original_price, 
    deliveryTime: row.delivery_time, 
    careInstructions: row.care_instructions 
  }
}
```

### Fallback a datos demo

En `hooks/useProducts.js`:

```javascript
const DEMO_PRODUCTS = [...]

useEffect(() => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  if (!url || url.includes('your-supabase')) {
    // Supabase no configurado → mostrar demo
    setTimeout(() => { setProducts(DEMO_PRODUCTS); setLoading(false) }, 800)
    return
  }
  // Supabase configurado → fetchear
  fetchProducts()...
}, [])
```

**Por qué:** Permite clonar, npm install, npm run dev y ver la tienda sin configurar Supabase.

### CORS en API routes

En `/api/admin/product/route.js`:

```javascript
function corsHeaders() {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, x-admin-secret",
  }
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 200, headers: corsHeaders() })
}

export async function POST(req) {
  // ...
  return NextResponse.json({ ok: true, result }, { headers: corsHeaders() })
}
```

**Por qué:** Si el admin en el futuro se separa en dominio diferente, CORS estará listo.

---

## 9. Checklist de características

- [x] Catálogo de productos
- [x] Filtros por categoría
- [x] Modal de detalle
- [x] Carrito de compras
- [x] Persistencia de carrito (localStorage)
- [x] Integración WhatsApp
- [x] Panel admin privado
- [x] CRUD de productos
- [x] Upload de imágenes
- [x] Cambio de estado (stock)
- [x] Base de datos en Supabase
- [x] API routes protegidas
- [x] Responsive mobile
- [x] Deploy en Vercel
- [x] CI/CD automático

**No incluye (pero podrían agregarse):**
- [ ] Tests automatizados
- [ ] TypeScript
- [ ] Pasarela de pago (Stripe)
- [ ] Analytics
- [ ] Multi-idioma
- [ ] Notificaciones por email

---

## 10. Comandos útiles

```bash
# Clonar y setup
git clone https://github.com/yuranimar/isamar-tejidos-crochet1.git
cd isamar-tejidos-crochet1
npm install

# Desarrollo local
npm run dev
# → http://localhost:3000

# Build de producción
npm run build

# Servir producción
npm start

# Linter
npm run lint
```

---

## 11. Links y recursos

- **Demo en vivo:** https://isamar-tejidos-crochet1.vercel.app
- **Repositorio GitHub:** https://github.com/yuranimar/isamar-tejidos-crochet1
- **Panel admin:** https://isamar-tejidos-crochet1.vercel.app/admin
- **Commit del README:** https://github.com/yuranimar/isamar-tejidos-crochet1/commit/78cae2d5b2e0e44503d65f8bccda556a2290fef2

---

## 12. Notas personales (recordatorio para futuro)

- La dueña vende desde WhatsApp (no Stripe)
- El catálogo se actualiza en tiempo real desde Supabase
- Las fotos se suben desde celular directo
- El deploy es automático (cada git push)
- No hay tests aún (mejora futura)
- Migraré a TypeScript si piden más funcionalidades

---

**Última actualización:** Octubre 2026  
**Estado:** ✅ Producción  
**Duración del proyecto:** 2 semanas  
**Rol:** Desarrollador Full Stack
