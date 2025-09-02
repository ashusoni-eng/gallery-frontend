"use client"

import { Button } from "@/components/ui/button"
import { useSession } from "@/hooks/use-auth"
import { SidebarTrigger } from "@/components/ui/sidebar"

export function Topbar() {
  const { logout, session } = useSession()
  return (
    <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b bg-background px-4">
      <div className="flex items-center gap-2">
        <SidebarTrigger aria-label="Toggle sidebar" />
        <h1 className="text-sm font-medium text-pretty">Gallery Admin</h1>
      </div>
      <div className="flex items-center gap-3">
        <span className="text-xs text-muted-foreground">Signed in as {session?.username}</span>
        <Button variant="outline" size="sm" onClick={logout} aria-label="Logout">
          Logout
        </Button>
      </div>
    </header>
  )
}
