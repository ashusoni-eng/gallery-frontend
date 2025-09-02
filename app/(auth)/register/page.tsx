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
import { api } from "@/lib/api"

export default function RegisterPage() {
  const [email, setEmail] = useState("")
  const [username, setUsername] = useState("")
  const [fullname, setFullname] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const { setSession } = useSession()
  const router = useRouter()
  const { toast } = useToast()

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const data = await api.post("/auth/register", { fullName: fullname, email, username, password })
      setSession({
        email: data.data.user.email,
        username: data.data.user.fullName,
        userId: data.data.user.id,
        accessToken: data.data.accessToken,
        refreshToken: data.data.refreshToken,
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
    <div className="relative flex min-h-dvh items-center justify-center p-8 bg-gradient-to-br from-blue-100 to-purple-200">
      <Card className="w-full max-w-md p-6 shadow-2xl rounded-xl border-2 border-blue-300 bg-white bg-opacity-90 transform transition duration-500 hover:scale-105">
        <CardHeader className="text-center mb-6">
          <CardTitle className="text-4xl font-extrabold text-gray-900 mb-2">Create an Account</CardTitle>
          <CardDescription className="text-lg text-gray-600">Join us today!</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="space-y-6">
            <div className="grid gap-3">
              <Label htmlFor="fullname" className="text-lg font-medium text-gray-700">Full Name</Label>
              <Input
                id="fullname"
                required
                placeholder="John Doe"
                value={fullname}
                onChange={(e) => setFullname(e.target.value)}
                className="h-12 text-lg rounded-lg border-gray-400 focus:border-blue-500 focus:ring-blue-500 shadow-sm"
              />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="username" className="text-lg font-medium text-gray-700">Username</Label>
              <Input
                id="username"
                required
                placeholder="johndoe"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="h-12 text-lg rounded-lg border-gray-400 focus:border-blue-500 focus:ring-blue-500 shadow-sm"
              />
            </div>
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
            <div className="grid gap-3">
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
              {loading ? "Creating Account..." : "Register"}
            </Button>
            <div className="text-center text-base text-gray-600">
              Already have an account?{" "}
              <Link className="underline text-blue-600 hover:text-blue-800 font-semibold" href="/login">
                Sign In
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}