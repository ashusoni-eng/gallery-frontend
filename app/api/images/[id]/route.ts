import { NextResponse } from "next/server"
import { dbInit, api } from "@/lib/mock-db"

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  dbInit()
  const ok = api.deleteImage(params.id)
  return NextResponse.json({ success: ok })
}
