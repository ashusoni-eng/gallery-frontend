"use client"

import type React from "react"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { useSession } from "@/hooks/use-auth"
import { useToast } from "@/hooks/use-toast"
import { api } from "@/lib/api" // Import the centralized API client

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("") // Add password state
  const [loading, setLoading] = useState(false)
  const { setSession } = useSession()
  const router = useRouter()
  const search = useSearchParams()
  const next = search.get("next") || "/dashboard"
  const { toast } = useToast()

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      // Use the centralized API client
      const data = await api.post("/auth/login", { email, password })       
      setSession({
        email: data.data.user.email,
        username: data.data.user.fullName, // Assuming fullName can be used as username for display
        userId: data.data.user.id, // Add userId
        accessToken: data.data.accessToken,
        refreshToken: data.data.refreshToken,
      })
      toast({ title: "Welcome back!", description: "Signed in successfully." })
      router.push(next)
    } catch (err: any) {
      toast({ title: "Login error", description: err.message, variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto flex min-h-dvh max-w-sm items-center justify-center p-4">
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-balance">Sign in</CardTitle>
          <CardDescription>Access your dashboard</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="space-y-4">
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
              {loading ? "Signing in..." : "Sign In"}
            </Button>
            <div className="text-center text-sm text-muted-foreground">
              No account?{" "}
              <Link className="underline" href="/register">
                Register
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}