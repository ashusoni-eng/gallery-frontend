"use client"

import { Button } from "@/components/ui/button"
import { useSession } from "@/hooks/use-auth"
import { SidebarTrigger } from "@/components/ui/sidebar"

export function Topbar() {
  const { logout, session } = useSession()
  return (
    <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-blue-200 bg-white/90 px-8 shadow-lg backdrop-blur-md supports-[backdrop-filter]:bg-white/80">
      <div className="flex items-center gap-6">
        <SidebarTrigger aria-label="Toggle sidebar" className="md:hidden"/>
        <h1 className="text-2xl font-bold text-gray-800">Gallery</h1>
      </div>
      <div className="flex items-center gap-5">
        <span className="text-base font-semibold text-gray-700">{session?.username}</span>
        <Button variant="outline" size="lg" onClick={logout} aria-label="Logout"
          className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:-translate-y-1"
        >
          Logout
        </Button>
      </div>
    </header>
  )
}
