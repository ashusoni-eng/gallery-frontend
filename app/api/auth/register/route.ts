import { NextResponse } from "next/server"
import { api, dbInit } from "@/lib/mock-db"

export async function POST(req: Request) {
  dbInit()
  const { email, username } = await req.json()
  if (!email || !username) {
    return NextResponse.json({ error: "Email and username are required" }, { status: 400 })
  }
  const existing = api.findUserByEmail(email)
  if (existing) return NextResponse.json({ user: existing })
  const user = api.createUser(username, email)
  return NextResponse.json({ user }, { status: 201 })
}
