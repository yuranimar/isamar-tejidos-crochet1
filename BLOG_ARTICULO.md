# Tienda en línea completa para marca de tejidos y crochet artesanales

## Resumen del proyecto

Desarrollé una plataforma de e-commerce de principio a fin para **Isamar**, una marca de tejidos y crochet artesanales en Medellín. El proyecto incluyó diseño visual personalizado, desarrollo frontend y backend, base de datos, panel administrativo y deploy en producción.

**Link en vivo:** https://isamar-tejidos-crochet1.vercel.app

---

## Lo que se construyó

### Tienda principal
- Hero animado con branding artesanal
- Catálogo de productos con filtros por categoría
- Modal de detalle con galería de imágenes y zoom
- Carrito de compras integrado
- Sección "Sobre la marca"
- Testimonios de clientes
- Preguntas frecuentes sobre envíos
- Política de entregas y contacto
- Footer con redes sociales
- Botón flotante de WhatsApp para consultas

### Panel de administración privado
- Login seguro con validación de contraseña
- CRUD completo de productos (crear, editar, eliminar)
- Subida de fotos desde celular o escritorio
- Cambio de precios en tiempo real
- Gestión de stock
- Control de estado: disponible, nuevo, agotado
- Interfaz intuitiva y responsiva

### Arquitectura técnica
- API routes server-side que protegen las claves secretas
- Credenciales de Supabase nunca se exponen al cliente
- Base de datos PostgreSQL con Supabase
- Políticas de seguridad RLS (Row Level Security)
- Storage de imágenes integrado
- Upload directo desde el panel admin

### Diseño
- Paleta de colores personalizada: borgoña, dorado y crema
- Tipografía: Cormorant Garamond (headers) + Jost (body)
- Animaciones fluidas con Framer Motion y GSAP
- Estética artesanal coherente en toda la interfaz
- 100% responsivo (móvil, tablet, desktop)

### Despliegue
- Deploy en Vercel con CI/CD automático
- Cada git push actualiza la web en segundos sin downtime
- Tiempo de deploy: menos de 2 minutos
- Certificado SSL incluido

---

## Stack tecnológico

**Frontend:**
- Next.js 15 (App Router)
- React 19
- Tailwind CSS
- Framer Motion (animaciones)
- GSAP (efectos visuales avanzados)
- react-icons

**Backend:**
- Next.js API Routes
- Supabase (PostgreSQL + Storage)
- Autenticación por header x-admin-secret

**Infraestructura:**
- Vercel (hosting + CI/CD)
- GitHub (control de versión)
- Supabase (base de datos + almacenamiento)

---

## Cómo funciona

### Flujo del cliente
1. Usuario entra a la tienda
2. Navega catálogo y filtra por categoría
3. Hace click en un producto → abre modal con detalles
4. Ve galería de fotos con zoom
5. Agrega al carrito
6. Consulta o compra por WhatsApp

### Flujo del administrador
1. Ingresa a `/admin`
2. Valida contraseña
3. Ve lista de productos con opciones de editar/eliminar
4. Crea nuevo producto:
   - Sube foto
   - Completa nombre, precio, categoría, stock, descripción
   - Guarda
5. La foto se sube a Supabase Storage
6. El producto aparece al instante en la tienda
7. Puede cambiar estado (disponible/nuevo/agotado) en tiempo real

### Base de datos en tiempo real
- Productos se actualizan al instante
- Cambios en admin se reflejan en la tienda sin recargar
- Stock sincronizado
- Imágenes servidas desde Supabase Storage

---

## Puntos técnicos destacados

### Seguridad
- Las credenciales secretas de Supabase se guardan en variables de servidor
- El cliente solo accede con credenciales públicas limitadas
- Las rutas de admin requieren validación de header `x-admin-secret`
- Imágenes se suben desde el servidor, no desde el cliente

### Conversión de datos
- Conversión automática camelCase ↔ snake_case
- Compatibilidad entre JavaScript y PostgreSQL

### Fallback a datos demo
- Si Supabase no está configurado, la tienda muestra productos de demostración
- Permite clonar, instalar y ver el sitio sin configuración inicial

### Integración WhatsApp
- Links pre-llenados con detalles del producto
- Carrito serializado en URL
- Aviso de disponibilidad
- Todo sin pasarela de pago compleja

---

## Desafíos resueltos

1. **Seguridad de credenciales** → API routes server-side
2. **Facilidad de uso para la dueña** → Panel admin intuitivo con upload mobile
3. **Diseño coherente** → Paleta personalizada y tipografía seleccionada
4. **Actualización en tiempo real** → Supabase realtime + React hooks
5. **Deploy automático** → Vercel + GitHub integration

---

## Métricas del proyecto

| Métrica | Resultado |
|---------|-----------|
| Responsividad | 100% (móvil, tablet, desktop) |
| Acceso admin desde celular | ✅ Totalmente funcional |
| Tiempo de deploy | < 2 minutos |
| Actualización de productos | Instantánea |
| Imágenes soportadas | JPG, PNG, WEBP (máx 10MB) |
| Dispositivos soportados | Todo navegador moderno |

---

## Tecnologías clave explicadas

### Next.js 15
Permite tener frontend y backend en el mismo proyecto. Los API routes protegen datos sensibles. El App Router es moderno y performante.

### Supabase
PostgreSQL como servicio. No requiere administración de servidor. Incluye storage, autenticación y realtime.

### Vercel
Plataforma de hosting optimizada para Next.js. CI/CD automático desde GitHub. Deploy en segundos.

### Tailwind CSS
Framework de utilidades CSS. Permite crear diseños responsivos sin escribir CSS personalizado. Muy customizable.

### Framer Motion
Librería de animaciones para React. Declarativa y fácil de controlar. Crea experencias fluidas.

---

## Resultado

Una tienda en línea profesional, funcional y hermosa que permite a Isamar vender sus productos artesanales sin depender de un desarrollador para cada cambio.

La dueña puede:
- Subir productos desde su celular
- Actualizar precios al instante
- Gestionar stock
- Ver cómo se ve en la tienda en tiempo real
- Operar el negocio de forma completamente independiente

---

## Aprendizajes

Este proyecto me permitió:
- Construir un e-commerce real con requisitos reales
- Integrar múltiples servicios (Next.js, Supabase, Vercel)
- Pensar en UX desde el lado del administrador, no solo del cliente
- Implementar autenticación y seguridad
- Manejar upload de archivos binarios
- Optimizar para mobile desde el inicio
- Deploy en producción sin complicaciones

---

## Mejoras futuras

- Tests automatizados (Jest + React Testing Library)
- Pasarela de pago real (Stripe/MercadoPago)
- Migración a TypeScript
- Analytics y tracking
- Notificaciones por email
- Multi-idioma
- Rate limiting en API routes

---

## Links importantes

- **Tienda en vivo:** https://isamar-tejidos-crochet1.vercel.app
- **Panel admin:** https://isamar-tejidos-crochet1.vercel.app/admin
- **Repositorio:** https://github.com/yuranimar/isamar-tejidos-crochet1
- **README del proyecto:** https://github.com/yuranimar/isamar-tejidos-crochet1/blob/main/README.md

---

## Información del proyecto

| Aspecto | Detalle |
|--------|---------|
| **Tipo** | E-commerce · Tienda artesanal · Panel admin |
| **Duración** | 2 semanas |
| **Rol** | Desarrollador Full Stack |
| **Complejidad** | Media-Alta |
| **Estado** | ✅ En producción |
| **Cliente** | Isamar Tejidos y Crochet |

---

## Conclusión

Isamar es un ejemplo de cómo la tecnología puede potenciar un negocio pequeño y artesanal. No se trata solo de código, sino de entender las necesidades reales, diseñar una solución hermosa y funcional, y entregar algo que el cliente pueda usar y mantener de forma independiente.

El proyecto demuestra capacidad de full-stack development, desde el diseño visual hasta la infraestructura en producción, pasando por seguridad, base de datos y UX/UI.

---

**Escrito por:** yuranimar  
**Fecha:** Octubre 2026  
**Actualizado:** 2026-10-02
