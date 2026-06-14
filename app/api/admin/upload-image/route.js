/**
 * app/api/admin/upload-image/route.js — Sube imágenes a Supabase Storage
 * La secret key nunca sale al cliente.
 */

import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const ADMIN_SECRET = process.env.ADMIN_SECRET
const MAX_MB       = 10

function getSupabase() {
  return createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SECRET_KEY
  )
}

function isAuthorized(req) {
  if (!ADMIN_SECRET) return true
  return req.headers.get('x-admin-secret') === ADMIN_SECRET
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 200, headers: corsHeaders() })
}

export async function POST(req) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const buffer      = Buffer.from(await req.arrayBuffer())
    const contentType = req.headers.get('content-type') || 'image/jpeg'

    if (!contentType.startsWith('image/')) {
      return NextResponse.json({ error: 'Solo se permiten imágenes' }, { status: 400 })
    }

    if (buffer.byteLength > MAX_MB * 1024 * 1024) {
      return NextResponse.json({ error: `Imagen demasiado grande (máx ${MAX_MB}MB)` }, { status: 413 })
    }

    const ext      = contentType.split('/')[1].replace('jpeg', 'jpg')
    const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
    const path     = `productos/${filename}`

    const sb = getSupabase()
    const { error } = await sb.storage
      .from('products')
      .upload(path, buffer, { contentType, upsert: false })

    if (error) throw error

    const { data: urlData } = sb.storage.from('products').getPublicUrl(path)

    return NextResponse.json(
      { path, url: urlData.publicUrl },
      { headers: corsHeaders() }
    )
  } catch (e) {
    console.error('upload-image error:', e)
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}

function corsHeaders() {
  return {
    'Access-Control-Allow-Origin':  '*',
    'Access-Control-Allow-Headers': 'Content-Type, x-admin-secret',
  }
}
