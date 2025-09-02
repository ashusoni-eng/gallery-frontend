import { NextResponse } from "next/server"
import { api, dbInit } from "@/lib/mock-db"

export async function GET(req: Request) {
  dbInit()
  const { searchParams } = new URL(req.url)
  const categoryId = searchParams.get("categoryId") || undefined
  const list = api.listImages(categoryId)
  return NextResponse.json({ images: list })
}

export async function POST(req: Request) {
  dbInit()
  const { items } = await req.json()
  if (!Array.isArray(items) || items.length === 0) {
    return NextResponse.json({ error: "items[] required" }, { status: 400 })
  }
  const created = api.addImages(items)
  return NextResponse.json({ images: created }, { status: 201 })
}
