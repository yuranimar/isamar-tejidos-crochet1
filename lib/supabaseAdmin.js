'use client'

/**
 * lib/supabaseAdmin.js — Cliente admin para Supabase
 * Lectura: cliente público (publishable key)
 * Escritura: va al servidor via /api/admin/* (usa secret key)
 */

import { supabase, urlFor } from './supabase'

const ADMIN_SECRET = process.env.NEXT_PUBLIC_ADMIN_SECRET || ''

export { urlFor as urlForAdmin }

export async function fetchProducts() {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .order('order', { ascending: true, nullsFirst: false })
    .order('created_at', { ascending: false })

  if (error) throw error
  return data
}

async function adminFetch(path, body) {
  const res = await fetch(path, {
    method:  'POST',
    headers: {
      'Content-Type':   'application/json',
      'x-admin-secret': ADMIN_SECRET,
    },
    body: JSON.stringify(body),
  })

  const data = await res.json().catch(() => ({ error: res.statusText }))
  if (!res.ok) throw new Error(data.error || `HTTP ${res.status}`)
  return data
}

export async function uploadImage(file) {
  const res = await fetch('/api/admin/upload-image', {
    method:  'POST',
    headers: {
      'Content-Type':   file.type,
      'x-admin-secret': ADMIN_SECRET,
    },
    body: file,
  })

  const data = await res.json()
  if (!res.ok) throw new Error(data.error || 'Upload failed')
  return data
}

export async function createProduct(data) {
  return adminFetch('/api/admin/product', { action: 'create', data })
}

export async function updateProduct(id, data) {
  return adminFetch('/api/admin/product', { action: 'update', id, data })
}

export async function deleteProduct(id) {
  return adminFetch('/api/admin/product', { action: 'delete', id })
}

export async function updateStatus(id, status) {
  return adminFetch('/api/admin/product', { action: 'status', id, status })
}

export const isWriteConfigured = true
