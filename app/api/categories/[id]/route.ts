import { NextResponse } from "next/server"
import { api, dbInit } from "@/lib/mock-db"

export async function GET(_: Request, { params }: { params: { id: string } }) {
  dbInit()
  const cat = api.getCategory(params.id)
  if (!cat) return NextResponse.json({ error: "Not found" }, { status: 404 })
  return NextResponse.json({ category: cat })
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  dbInit()
  const { name } = await req.json()
  if (!name) return NextResponse.json({ error: "name required" }, { status: 400 })
  const updated = api.updateCategory(params.id, name)
  if (!updated) return NextResponse.json({ error: "Not found" }, { status: 404 })
  return NextResponse.json({ category: updated })
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  dbInit()
  const ok = api.deleteCategory(params.id)
  return NextResponse.json({ success: ok })
}
