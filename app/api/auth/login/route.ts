import { NextResponse } from "next/server"
import { api, dbInit } from "@/lib/mock-db"

export async function POST(req: Request) {
  dbInit()
  const { email } = await req.json()
  if (!email) return NextResponse.json({ error: "Email is required" }, { status: 400 })
  let user = api.findUserByEmail(email)
  if (!user) {
    const username = email.split("@")[0]
    user = api.createUser(username, email)
  }
  return NextResponse.json({ user })
}
