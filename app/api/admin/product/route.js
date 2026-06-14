import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const ADMIN_SECRET = process.env.ADMIN_SECRET

function getSupabase() {
  return createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SECRET_KEY)
}

function isAuthorized(req) {
  if (!ADMIN_SECRET) return true
  return req.headers.get("x-admin-secret") === ADMIN_SECRET
}

function corsHeaders() {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, x-admin-secret",
  }
}

function toSnake(data) {
  if (!data) return {}
  const map = { originalPrice: "original_price", deliveryTime: "delivery_time", careInstructions: "care_instructions" }
  const result = {}
  for (const [key, val] of Object.entries(data)) {
    if (val === undefined || val === "") continue
    result[map[key] || key] = val
  }
  return result
}

function toCamel(row) {
  if (!row) return row
  return { ...row, originalPrice: row.original_price, deliveryTime: row.delivery_time, careInstructions: row.care_instructions }
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 200, headers: corsHeaders() })
}

export async function POST(req) {
  if (!isAuthorized(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const body = await req.json().catch(() => ({}))
  const { action, id, data, status } = body
  const sb = getSupabase()
  try {
    let result
    switch (action) {
      case "create": {
        const { data: row, error } = await sb.from("products").insert([{ ...toSnake(data), created_at: new Date().toISOString() }]).select().single()
        if (error) throw error
        result = toCamel(row)
        break
      }
      case "update": {
        const { data: row, error } = await sb.from("products").update({ ...toSnake(data), updated_at: new Date().toISOString() }).eq("id", id).select().single()
        if (error) throw error
        result = toCamel(row)
        break
      }
      case "delete": {
        const { error } = await sb.from("products").delete().eq("id", id)
        if (error) throw error
        result = { deleted: id }
        break
      }
      case "status": {
        const { data: row, error } = await sb.from("products").update({ status, updated_at: new Date().toISOString() }).eq("id", id).select().single()
        if (error) throw error
        result = toCamel(row)
        break
      }
      default: return NextResponse.json({ error: "Unknown action" }, { status: 400 })
    }
    return NextResponse.json({ ok: true, result }, { headers: corsHeaders() })
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500, headers: corsHeaders() })
  }
}