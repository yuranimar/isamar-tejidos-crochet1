'use client'

/**
 * AdminPanel.jsx — Panel de administración de Isamar Crochet
 * Ruta: src/admin/AdminPanel.jsx
 *
 * Acceso: tusitio.com/admin
 * Requiere en .env: VITE_ADMIN_SECRET
 */

import { useState, useEffect, useRef, useCallback } from 'react'
import {
  fetchProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  updateStatus,
  uploadImage,
} from '../../lib/supabaseAdmin.js'

// ─── Tokens del proyecto ──────────────────────────────────────────────────────
// Usa los colores reales de tailwind.config.js
const C = {
  burgundy: '#5B0E1B',
  gold:     '#D4AF37',
  brown:    '#3D2E23',
  cream:    '#FAF6F3',
  rose:     '#F5E6E6',
}

const CATEGORIES = [
  { value: 'mantas',         label: 'Mantas' },
  { value: 'accesorios',     label: 'Accesorios' },
  { value: 'personalizados', label: 'Personalizados' },
]

const STATUSES = [
  { value: 'available', label: 'Disponible', color: '#2D6A4F', bg: '#D8F3DC' },
  { value: 'new',       label: 'Nuevo',      color: C.burgundy, bg: C.rose },
  { value: 'out',       label: 'Agotado',    color: C.brown,    bg: '#EDE0D4' },
]

const EMPTY_FORM = {
  name: '', category: 'mantas', price: '', originalPrice: '',
  description: '', status: 'available', stock: '',
  material: '', dimensions: '', deliveryTime: '', careInstructions: '', order: '',
}

const SECRET = process.env.NEXT_PUBLIC_ADMIN_SECRET || ''

// ─── Toast ────────────────────────────────────────────────────────────────────
function Toast({ message, type, onClose }) {
  useEffect(() => { const t = setTimeout(onClose, 3200); return () => clearTimeout(t) }, [onClose])
  return (
    <div className={`fixed bottom-6 right-6 z-[100] flex items-center gap-3 px-5 py-3 rounded-2xl shadow-2xl text-sm font-medium text-white ${type === 'error' ? 'bg-burgundy' : 'bg-[#2D6A4F]'}`}>
      <span>{type === 'error' ? '✕' : '✓'}</span>{message}
    </div>
  )
}

// ─── Confirm dialog ───────────────────────────────────────────────────────────
function ConfirmDialog({ message, onConfirm, onCancel }) {
  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl p-6 mx-4 max-w-sm w-full">
        <p className="text-brown text-sm mb-5 leading-relaxed">{message}</p>
        <div className="flex gap-3">
          <button onClick={onCancel} className="flex-1 py-2 rounded-xl border border-brown/20 text-brown/60 text-sm hover:bg-rose transition-colors">Cancelar</button>
          <button onClick={onConfirm} className="flex-1 py-2 rounded-xl bg-burgundy text-white text-sm hover:opacity-90 transition-opacity font-medium">Eliminar</button>
        </div>
      </div>
    </div>
  )
}

// ─── Login ────────────────────────────────────────────────────────────────────
function LoginScreen({ onLogin }) {
  const [input, setInput]       = useState('')
  const [error, setError]       = useState(false)
  const [shake, setShake]       = useState(false)
  const [showPass, setShowPass] = useState(false)

  const handleSubmit = e => {
    e.preventDefault()
    if (input === SECRET || (!SECRET && input === 'admin')) {
      onLogin()
    } else {
      setError(true); setShake(true)
      setTimeout(() => setShake(false), 500)
    }
  }

  return (
    <div className="min-h-screen bg-cream flex items-center justify-center px-4">
      <div className={shake ? 'animate-[shake_0.4s_ease]' : ''} style={{ width: '100%', maxWidth: 360 }}>
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4" style={{ background: `${C.burgundy}12` }}>
            <span className="text-3xl">🧶</span>
          </div>
          <h1 className="font-serif text-2xl text-brown mb-1">Isamar Crochet</h1>
          <p className="text-[0.7rem] tracking-[0.18em] uppercase text-brown/45">Panel de administración</p>
        </div>
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-brown/10 p-6">
          <label className="block text-[0.65rem] tracking-[0.12em] uppercase text-brown/55 mb-2">Contraseña de acceso</label>
          <div className="relative">
            <input
              type={showPass ? 'text' : 'password'} value={input} autoFocus
              onChange={e => { setInput(e.target.value); setError(false) }}
              placeholder="••••••••"
              className={`w-full px-4 py-2.5 pr-10 rounded-xl border text-sm text-brown outline-none transition-colors bg-cream ${error ? 'border-burgundy bg-rose/30' : 'border-brown/15 focus:border-burgundy/50'}`}
            />
            <button
              type="button"
              onClick={() => setShowPass(v => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-brown/40 hover:text-burgundy transition-colors text-sm select-none"
              tabIndex={-1}
            >
              {showPass ? '🙈' : '👁️'}
            </button>
          </div>
          {error && <p className="text-[0.65rem] text-burgundy mt-1.5">Contraseña incorrecta</p>}
          <button type="submit" className="mt-4 w-full py-2.5 bg-burgundy text-white rounded-xl text-sm font-medium tracking-wide hover:opacity-90 transition-opacity">
            Entrar
          </button>
        </form>
      </div>
      <style>{`@keyframes shake{0%,100%{transform:translateX(0)}20%,60%{transform:translateX(-8px)}40%,80%{transform:translateX(8px)}}`}</style>
    </div>
  )
}

// ─── Formulario de producto ───────────────────────────────────────────────────
function ProductForm({ initial, onSave, onCancel, loading }) {
  const [form, setForm]           = useState(initial || EMPTY_FORM)
  const [imageFile, setImageFile] = useState(null)
  const [preview, setPreview]     = useState(initial?.image ? initial?.image : null)
  const [uploading, setUploading] = useState(false)
  const [dragOver, setDragOver]   = useState(false)
  const fileRef = useRef()

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const handleImage = file => {
    if (!file?.type.startsWith('image/')) return
    setImageFile(file)
    setPreview(URL.createObjectURL(file))
  }

  const handleSubmit = async e => {
    e.preventDefault()
    if (!form.name || !form.price) return
    let imageRef = form.image
    if (imageFile) {
      setUploading(true)
      try { const uploaded = await uploadImage(imageFile); imageRef = uploaded.url }
      catch (err) { alert('Error subiendo imagen: ' + err.message); setUploading(false); return }
      setUploading(false)
    }
    onSave({ ...form, image: imageRef, stock: form.stock ? Number(form.stock) : undefined, order: form.order ? Number(form.order) : undefined })
  }

  const isEdit = !!initial?.id

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/40 backdrop-blur-sm overflow-y-auto py-6 px-4">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-brown/8">
          <h2 className="font-serif text-lg text-brown">{isEdit ? 'Editar producto' : 'Nuevo producto'}</h2>
          <button onClick={onCancel} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-rose text-brown/40 hover:text-brown transition-colors text-xl">×</button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Imagen */}
          <div>
            <label className="block text-[0.65rem] tracking-[0.12em] uppercase text-brown/55 mb-2">Imagen del producto</label>
            <div
              onClick={() => fileRef.current?.click()}
              onDrop={e => { e.preventDefault(); setDragOver(false); handleImage(e.dataTransfer.files[0]) }}
              onDragOver={e => { e.preventDefault(); setDragOver(true) }}
              onDragLeave={() => setDragOver(false)}
              className={`relative cursor-pointer rounded-xl border-2 border-dashed transition-colors overflow-hidden ${dragOver ? 'border-burgundy bg-rose/30' : 'border-brown/15 hover:border-gold/60 bg-cream'}`}
              style={{ minHeight: 160 }}
            >
              {preview ? (
                <div className="relative">
                  <img src={preview} alt="preview" className="w-full h-48 object-cover" />
                  <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                    <span className="text-white text-xs font-medium tracking-wide">Cambiar imagen</span>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-40 gap-2">
                  <span className="text-3xl opacity-30">📷</span>
                  <p className="text-xs text-brown/45">Arrastra una imagen o haz clic para seleccionar</p>
                  <p className="text-[0.6rem] text-brown/30">JPG, PNG, WEBP · máx. 10MB</p>
                </div>
              )}
              {uploading && (
                <div className="absolute inset-0 bg-white/80 flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-burgundy/30 border-t-burgundy rounded-full animate-spin" />
                </div>
              )}
            </div>
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={e => handleImage(e.target.files[0])} />
          </div>

          {/* Nombre + Categoría */}
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2 sm:col-span-1">
              <label className="block text-[0.65rem] tracking-[0.12em] uppercase text-brown/55 mb-1.5">Nombre <span className="text-burgundy">*</span></label>
              <input required value={form.name} onChange={e => set('name', e.target.value)} placeholder="Manta tejida beige"
                className="w-full px-3.5 py-2 rounded-xl border border-brown/15 text-sm text-brown bg-cream focus:border-burgundy/50 outline-none transition-colors" />
            </div>
            <div>
              <label className="block text-[0.65rem] tracking-[0.12em] uppercase text-brown/55 mb-1.5">Categoría</label>
              <select value={form.category} onChange={e => set('category', e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-brown/15 text-sm text-brown bg-cream focus:border-burgundy/50 outline-none transition-colors">
                {CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
              </select>
            </div>
          </div>

          {/* Precio + Precio original + Stock */}
          <div className="grid grid-cols-3 gap-4">
            {[
              { key: 'price', label: 'Precio', required: true, placeholder: '$85.000' },
              { key: 'originalPrice', label: 'Precio original', placeholder: '$100.000' },
              { key: 'stock', label: 'Stock', placeholder: '12', type: 'number' },
            ].map(f => (
              <div key={f.key}>
                <label className="block text-[0.65rem] tracking-[0.12em] uppercase text-brown/55 mb-1.5">
                  {f.label}{f.required && <span className="text-burgundy"> *</span>}
                </label>
                <input required={f.required} type={f.type || 'text'} min={f.type === 'number' ? 0 : undefined}
                  value={form[f.key] || ''} onChange={e => set(f.key, e.target.value)} placeholder={f.placeholder}
                  className="w-full px-3.5 py-2 rounded-xl border border-brown/15 text-sm text-brown bg-cream focus:border-burgundy/50 outline-none transition-colors" />
              </div>
            ))}
          </div>

          {/* Estado + Orden */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[0.65rem] tracking-[0.12em] uppercase text-brown/55 mb-1.5">Estado</label>
              <select value={form.status} onChange={e => set('status', e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-brown/15 text-sm text-brown bg-cream focus:border-burgundy/50 outline-none transition-colors">
                {STATUSES.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-[0.65rem] tracking-[0.12em] uppercase text-brown/55 mb-1.5">Orden en catálogo</label>
              <input type="number" min="0" value={form.order || ''} onChange={e => set('order', e.target.value)} placeholder="1"
                className="w-full px-3.5 py-2 rounded-xl border border-brown/15 text-sm text-brown bg-cream focus:border-burgundy/50 outline-none transition-colors" />
            </div>
          </div>

          {/* Descripción */}
          <div>
            <label className="block text-[0.65rem] tracking-[0.12em] uppercase text-brown/55 mb-1.5">Descripción</label>
            <textarea rows={3} value={form.description || ''} onChange={e => set('description', e.target.value)}
              placeholder="Describe el producto, sus colores y acabados…"
              className="w-full px-3.5 py-2 rounded-xl border border-brown/15 text-sm text-brown bg-cream focus:border-burgundy/50 outline-none transition-colors resize-none" />
          </div>

          {/* Detalles adicionales */}
          <details className="group">
            <summary className="cursor-pointer text-[0.65rem] tracking-[0.12em] uppercase text-gold mb-3 select-none list-none flex items-center gap-1.5">
              <span className="group-open:rotate-90 transition-transform inline-block">›</span>
              Detalles adicionales
            </summary>
            <div className="grid grid-cols-2 gap-4 mt-3">
              {[
                { key: 'material',         label: 'Material',          placeholder: 'Hilo 100% algodón' },
                { key: 'dimensions',       label: 'Dimensiones',       placeholder: '120 x 80 cm' },
                { key: 'deliveryTime',     label: 'Tiempo de entrega', placeholder: '3–5 días hábiles' },
                { key: 'careInstructions', label: 'Cuidado',           placeholder: 'Lavar a mano en agua fría' },
              ].map(f => (
                <div key={f.key}>
                  <label className="block text-[0.65rem] tracking-[0.12em] uppercase text-brown/55 mb-1.5">{f.label}</label>
                  <input value={form[f.key] || ''} onChange={e => set(f.key, e.target.value)} placeholder={f.placeholder}
                    className="w-full px-3.5 py-2 rounded-xl border border-brown/15 text-sm text-brown bg-cream focus:border-burgundy/50 outline-none transition-colors" />
                </div>
              ))}
            </div>
          </details>

          {/* Acciones */}
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onCancel}
              className="flex-1 py-2.5 rounded-xl border border-brown/20 text-brown/60 text-sm hover:bg-rose transition-colors">
              Cancelar
            </button>
            <button type="submit" disabled={loading || uploading}
              className="flex-1 py-2.5 rounded-xl bg-burgundy text-white text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2">
              {(loading || uploading) && <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
              {uploading ? 'Subiendo imagen…' : loading ? 'Guardando…' : isEdit ? 'Guardar cambios' : 'Crear producto'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// ─── Fila de producto ─────────────────────────────────────────────────────────
function ProductRow({ product, onEdit, onDelete, onStatusChange, statusLoading }) {
  const imgUrl = product.image
  const st = STATUSES.find(s => s.value === product.status) || STATUSES[0]

  return (
    <div className="flex items-center gap-4 px-5 py-3.5 hover:bg-cream transition-colors group border-b border-brown/6 last:border-0">
      <div className="w-12 h-12 rounded-xl overflow-hidden bg-rose flex-shrink-0 border border-brown/8">
        {imgUrl
          ? <img src={imgUrl} alt={product.name} className="w-full h-full object-cover" />
          : <div className="w-full h-full flex items-center justify-center text-xl">🧶</div>
        }
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-brown truncate">{product.name}</p>
        <p className="text-[0.65rem] text-brown/45 truncate">
          {CATEGORIES.find(c => c.value === product.category)?.label || product.category}
          {product.stock != null && ` · ${product.stock} en stock`}
        </p>
      </div>
      <span className="font-serif text-sm text-burgundy flex-shrink-0 hidden sm:block">{product.price}</span>

      {/* Estado — selector rápido */}
      <div className="flex-shrink-0">
        {statusLoading
          ? <div className="w-4 h-4 border-2 border-burgundy/20 border-t-burgundy rounded-full animate-spin" />
          : (
            <select value={product.status} onChange={e => onStatusChange(product.id, e.target.value)}
              onClick={e => e.stopPropagation()}
              className="text-[0.6rem] tracking-[0.1em] uppercase font-semibold rounded-full px-2.5 py-0.5 border-0 outline-none cursor-pointer"
              style={{ color: st.color, background: st.bg }}>
              {STATUSES.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
            </select>
          )
        }
      </div>

      {/* Acciones */}
      <div className="flex gap-1.5 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
        <button onClick={() => onEdit(product)} title="Editar"
          className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gold/15 text-gold transition-colors text-sm">✎</button>
        <button onClick={() => onDelete(product)} title="Eliminar"
          className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-rose text-brown/40 hover:text-burgundy transition-colors text-sm">✕</button>
      </div>
    </div>
  )
}

// ─── Panel principal ──────────────────────────────────────────────────────────
export default function AdminPanel() {
  const [authed, setAuthed]               = useState(false)
  const [products, setProducts]           = useState([])
  const [loading, setLoading]             = useState(true)
  const [saving, setSaving]               = useState(false)
  const [filterCat, setFilterCat]         = useState('all')
  const [filterStatus, setFilterStatus]   = useState('all')
  const [search, setSearch]               = useState('')
  const [showForm, setShowForm]           = useState(false)
  const [editing, setEditing]             = useState(null)
  const [toast, setToast]                 = useState(null)
  const [confirm, setConfirm]             = useState(null)
  const [statusLoading, setStatusLoading] = useState({})

  const showToast = useCallback((message, type = 'success') => setToast({ message, type }), [])

  const load = useCallback(async () => {
    setLoading(true)
    try { setProducts(await fetchProducts()) }
    catch (e) { showToast('Error cargando productos: ' + e.message, 'error') }
    finally { setLoading(false) }
  }, [showToast])

  useEffect(() => { if (authed) load() }, [authed, load])

  const handleLogin = () => { setAuthed(true) }
  const handleLogout = () => { setAuthed(false) }

  const filtered = products.filter(p => {
    if (filterCat !== 'all' && p.category !== filterCat) return false
    if (filterStatus !== 'all' && p.status !== filterStatus) return false
    if (search && !p.name?.toLowerCase().includes(search.toLowerCase())) return false
    return true
  })

  const handleSave = async payload => {
    setSaving(true)
    try {
      if (editing?.id) { await updateProduct(editing.id, payload); showToast('Producto actualizado') }
      else { await createProduct(payload); showToast('Producto creado') }
      setShowForm(false); setEditing(null); await load()
    } catch (e) { showToast(e.message, 'error') }
    finally { setSaving(false) }
  }

  const handleDeleteConfirm = async () => {
    if (!confirm) return
    try { await deleteProduct(confirm.product.id); showToast('Producto eliminado'); await load() }
    catch (e) { showToast(e.message, 'error') }
    finally { setConfirm(null) }
  }

  const handleStatusChange = async (id, status) => {
    setStatusLoading(s => ({ ...s, [id]: true }))
    try { await updateStatus(id, status); setProducts(ps => ps.map(p => p.id === id ? { ...p, status } : p)) }
    catch (e) { showToast(e.message, 'error') }
    finally { setStatusLoading(s => ({ ...s, [id]: false })) }
  }

  if (!authed) return <LoginScreen onLogin={handleLogin} />

  const stats = [
    { label: 'Total',       value: products.length,                              color: C.brown },
    { label: 'Disponibles', value: products.filter(p => p.status === 'available').length, color: '#2D6A4F' },
    { label: 'Nuevos',      value: products.filter(p => p.status === 'new').length,       color: C.burgundy },
    { label: 'Agotados',    value: products.filter(p => p.status === 'out').length,       color: C.brown },
  ]

  return (
    <div className="min-h-screen bg-cream">
      {/* Header */}
      <header className="bg-white border-b border-brown/8 sticky top-0 z-30">
        <div className="max-w-5xl mx-auto px-5 py-3.5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="text-xl">🧶</span>
            <div>
              <h1 className="font-serif text-base text-brown leading-none">Isamar Crochet</h1>
              <p className="text-[0.58rem] tracking-[0.12em] uppercase text-brown/40 mt-0.5">Catálogo</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => { setEditing(null); setShowForm(true) }}
              className="flex items-center gap-2 px-4 py-2 bg-burgundy text-white rounded-xl text-xs font-medium tracking-wide hover:opacity-90 transition-opacity">
              <span className="text-base leading-none">+</span> Nuevo producto
            </button>
            <button onClick={handleLogout}
              className="text-[0.65rem] tracking-[0.1em] uppercase text-brown/35 hover:text-brown/70 transition-colors px-2 py-1.5">
              Salir
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-5 py-6 space-y-5">
        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {stats.map(s => (
            <div key={s.label} className="bg-white rounded-2xl px-4 py-3 border border-brown/6">
              <p className="font-serif text-2xl leading-none" style={{ color: s.color }}>{s.value}</p>
              <p className="text-[0.6rem] tracking-[0.12em] uppercase text-brown/40 mt-1">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Filtros */}
        <div className="bg-white rounded-2xl border border-brown/6 px-4 py-3 flex flex-wrap gap-3 items-center">
          <input type="search" value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar producto…"
            className="flex-1 min-w-[160px] px-3.5 py-1.5 rounded-xl border border-brown/12 text-sm text-brown bg-cream outline-none focus:border-burgundy/40 transition-colors" />
          <select value={filterCat} onChange={e => setFilterCat(e.target.value)}
            className="px-3 py-1.5 rounded-xl border border-brown/12 text-xs text-brown bg-cream outline-none">
            <option value="all">Todas las categorías</option>
            {CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
          </select>
          <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}
            className="px-3 py-1.5 rounded-xl border border-brown/12 text-xs text-brown bg-cream outline-none">
            <option value="all">Todos los estados</option>
            {STATUSES.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
          </select>
          {(filterCat !== 'all' || filterStatus !== 'all' || search) && (
            <button onClick={() => { setFilterCat('all'); setFilterStatus('all'); setSearch('') }}
              className="text-[0.65rem] text-burgundy tracking-wide hover:underline">Limpiar</button>
          )}
        </div>

        {/* Lista */}
        <div className="bg-white rounded-2xl border border-brown/6 overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-16 gap-3">
              <div className="w-5 h-5 border-2 border-burgundy/20 border-t-burgundy rounded-full animate-spin" />
              <span className="text-sm text-brown/45">Cargando catálogo…</span>
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 gap-2">
              <span className="text-4xl opacity-20">🧶</span>
              <p className="text-sm text-brown/40">
                {products.length === 0 ? 'Aún no hay productos. Crea el primero.' : 'Ningún producto coincide con los filtros.'}
              </p>
            </div>
          ) : (
            <>
              <div className="px-5 py-2.5 border-b border-brown/6">
                <p className="text-[0.62rem] tracking-[0.12em] uppercase text-brown/40">
                  {filtered.length} producto{filtered.length !== 1 ? 's' : ''}{filtered.length !== products.length && ` de ${products.length}`}
                </p>
              </div>
              {filtered.map(p => (
                <ProductRow key={p.id} product={p}
                  onEdit={p => { setEditing(p); setShowForm(true) }}
                  onDelete={p => setConfirm({ product: p })}
                  onStatusChange={handleStatusChange}
                  statusLoading={statusLoading[p.id]} />
              ))}
            </>
          )}
        </div>
      </main>

      {showForm && <ProductForm initial={editing} onSave={handleSave} onCancel={() => { setShowForm(false); setEditing(null) }} loading={saving} />}
      {confirm && <ConfirmDialog message={`¿Eliminar "${confirm.product.name}"? Esta acción no se puede deshacer.`} onConfirm={handleDeleteConfirm} onCancel={() => setConfirm(null)} />}
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  )
}