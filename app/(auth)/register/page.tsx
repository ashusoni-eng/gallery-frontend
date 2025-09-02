"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { useSession } from "@/hooks/use-auth"
import { useToast } from "@/hooks/use-toast"
import { api } from "@/lib/api" // Import the centralized API client

export default function RegisterPage() {
  const [email, setEmail] = useState("")
  const [username, setUsername] = useState("")
  const [fullname, setFullname] = useState("")
  const [password, setPassword] = useState("") // Add password state
  const [loading, setLoading] = useState(false)
  const { setSession } = useSession()
  const router = useRouter()
  const { toast } = useToast()

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      // Use the centralized API client
      const data = await api.post("/auth/register", {fullName:fullname, email, username, password }) // Changed endpoint and added password
      setSession({
        email: data.user.email,
        username: data.user.fullName, // Use fullName for username
        userId: data.user.id, // Add userId
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
      })
      toast({ title: "Welcome!", description: "Account created." })
      router.push("/dashboard")
    } catch (err: any) {
      toast({ title: "Register error", description: err.message, variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto flex min-h-dvh max-w-sm items-center justify-center p-4">
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-balance">Create account</CardTitle>
          <CardDescription>Register to continue</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="username">Name</Label>
              <Input
                id="fullname"
                required
                placeholder="Name"
                value={fullname}
                onChange={(e) => setFullname(e.target.value)}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                required
                placeholder="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                required
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="grid gap-2"> {/* Add password input */}
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                required
                placeholder="********"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Creating..." : "Register"}
            </Button>
            <div className="text-center text-sm text-muted-foreground">
              Have an account?{" "}
              <Link className="underline" href="/login">
                Sign in
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}