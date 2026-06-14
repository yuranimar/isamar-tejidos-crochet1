'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useProducts } from '../hooks/useProducts'
import ProductCard, { ProductSkeleton } from './ProductCard'
import ProductDetailModal from './ProductDetailModal'

const FILTERS = [
  { key: 'todos', label: 'Todos' },
  { key: 'mantas', label: 'Mantas' },
  { key: 'accesorios', label: 'Accesorios' },
  { key: 'personalizados', label: 'Personalizados' }
]

export default function Catalog() {
  const [activeFilter, setActiveFilter] = useState('todos')
  const [selectedProduct, setSelectedProduct] = useState(null)

  const { products, loading } = useProducts()

  const filtered =
    activeFilter === 'todos'
      ? products
      : products.filter((p) => p.category === activeFilter)

  useEffect(() => {
    const handler = (e) => setSelectedProduct(e.detail)

    window.addEventListener('open-product', handler)

    return () =>
      window.removeEventListener('open-product', handler)
  }, [])

  return (
    <>
      <section
        id="catalog"
        className="relative overflow-hidden py-20 md:py-28 px-6 lg:px-16 bg-gradient-to-b from-[#FFF9F7] via-[#F8F0F0] to-[#F4E5E5]"
      >
        {/* Textura artesanal */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
          <div
            className="w-full h-full"
            style={{
              backgroundImage:
                'radial-gradient(#8B3A45 1px, transparent 1px)',
              backgroundSize: '22px 22px'
            }}
          />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto">
          {/* Encabezado */}
          <div className="text-center mb-14">
            <span className="text-[0.7rem] tracking-[0.35em] uppercase text-[#8B3A45]/60 block mb-4">
              Tejido artesanal
            </span>

            <h2 className="font-serif text-5xl md:text-6xl text-[#8B3A45]">
              Colección
            </h2>

            <p className="mt-6 max-w-2xl mx-auto text-[#3d2e23]/70 font-serif italic text-lg">
              Piezas elaboradas a mano con dedicación, detalle y tradición.
            </p>
          </div>

          {/* Filtros */}
          <div className="flex flex-wrap justify-center gap-3 mb-14">
            {FILTERS.map((f) => (
              <button
                key={f.key}
                onClick={() => setActiveFilter(f.key)}
                className={`
                  px-5 py-2.5 rounded-full
                  text-[0.72rem]
                  tracking-[0.18em]
                  uppercase
                  border
                  transition-all
                  duration-300
                  ${
                    activeFilter === f.key
                      ? 'bg-[#8B3A45] text-white border-[#8B3A45] shadow-lg'
                      : 'bg-white text-[#8B3A45] border-[#8B3A45]/20 hover:border-[#8B3A45] hover:shadow-md'
                  }
                `}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* Separador */}
          <div className="flex items-center justify-center mb-14">
            <div className="w-12 h-px bg-[#C5A059]/40" />

            <span className="mx-4 text-2xl">
              🧶
            </span>

            <div className="w-12 h-px bg-[#C5A059]/40" />
          </div>

          {/* Frase */}
          <div className="text-center mb-12">
            <p className="font-serif italic text-[#8B3A45]/60 text-lg">
              Cada puntada cuenta una historia.
            </p>
          </div>

          {/* Productos */}
          <motion.div
            layout
            className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8"
          >
            {loading
              ? Array.from({ length: 8 }).map((_, i) => (
                  <ProductSkeleton key={i} />
                ))
              : filtered.map((product, index) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{
                      duration: 0.5,
                      delay: index * 0.05
                    }}
                  >
                    <ProductCard
                      product={product}
                      index={index}
                      onClick={() =>
                        setSelectedProduct(product)
                      }
                    />
                  </motion.div>
                ))}
          </motion.div>

          {!loading && filtered.length === 0 && (
            <div className="text-center py-24">
              <p className="font-serif italic text-[#8B3A45]/50 text-xl">
                Estamos preparando más piezas para esta categoría.
              </p>
            </div>
          )}
        </div>
      </section>

      <AnimatePresence>
        {selectedProduct && (
          <ProductDetailModal
            key={selectedProduct.id}
            product={selectedProduct}
            allProducts={products}
            onClose={() => setSelectedProduct(null)}
          />
        )}
      </AnimatePresence>
    </>
  )
}