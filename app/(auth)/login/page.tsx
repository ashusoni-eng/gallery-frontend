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
  const next = search.get("next") || "/gallery-wall"
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
      router.push("/gallery-wall")
    } catch (err: any) {
      toast({ title: "Login error", description: err.message, variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative flex min-h-dvh items-center justify-center p-8 bg-gradient-to-br from-blue-100 to-purple-200">
      <Card className="w-full max-w-md p-6 shadow-2xl rounded-xl border-2 border-blue-300 bg-white bg-opacity-90 transform transition duration-500 hover:scale-105">
        <CardHeader className="text-center mb-6">
          <CardTitle className="text-4xl font-extrabold text-gray-900 mb-2">Welcome Back!</CardTitle>
          <CardDescription className="text-lg text-gray-600">Sign in to access your dashboard</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="space-y-6">
            <div className="grid gap-3">
              <Label htmlFor="email" className="text-lg font-medium text-gray-700">Email</Label>
              <Input
                id="email"
                type="email"
                required
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-12 text-lg rounded-lg border-gray-400 focus:border-blue-500 focus:ring-blue-500 shadow-sm"
              />
            </div>
            <div className="grid gap-3"> {/* Add password input */}
              <Label htmlFor="password" className="text-lg font-medium text-gray-700">Password</Label>
              <Input
                id="password"
                type="password"
                required
                placeholder="********"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-12 text-lg rounded-lg border-gray-400 focus:border-blue-500 focus:ring-blue-500 shadow-sm"
              />
            </div>
            <Button type="submit" className="w-full h-12 text-xl font-bold rounded-lg bg-blue-600 hover:bg-blue-700 text-white shadow-lg transition duration-300 ease-in-out transform hover:-translate-y-1" disabled={loading}>
              {loading ? "Signing in..." : "Sign In"}
            </Button>
            <div className="text-center text-base text-gray-600">
              No account?{" "}
              <Link className="underline text-blue-600 hover:text-blue-800 font-semibold" href="/register">
                Register Here
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
