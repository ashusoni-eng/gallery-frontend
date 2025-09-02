import { NextResponse } from "next/server"
import { api, dbInit } from "@/lib/mock-db"

export async function GET() {
  dbInit()
  return NextResponse.json({ categories: api.listCategories() })
}

export async function POST(req: Request) {
  dbInit()
  const { name, createdBy } = await req.json()
  if (!name || !createdBy) return NextResponse.json({ error: "name and createdBy required" }, { status: 400 })
  const cat = api.createCategory(name, createdBy)
  return NextResponse.json({ category: cat }, { status: 201 })
}
