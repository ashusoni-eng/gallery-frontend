"use client"

import type React from "react"

import { useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import { useSession } from "@/hooks/use-auth"

export default function Protected({ children }: { children: React.ReactNode }) {
  const { session } = useSession()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (!session) {
      router.replace(`/login?next=${encodeURIComponent(pathname || "/dashboard")}`)
    }
  }, [session, router, pathname])

  if (!session) return null
  return <>{children}</>
}
