"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { LayoutDashboard, Folder, Images, HomeIcon } from "lucide-react"
import { useIsMobile } from "@/hooks/use-mobile"

const navItems = [
  { href: "/gallery-wall", label: "Home", icon: HomeIcon },
  { href: "/dashboard", label: "Album", icon: LayoutDashboard },
  { href: "/category", label: "Category", icon: Folder },
  { href: "/groups", label: "Groups", icon: Folder },
  { href: "/manage-images", label: "Gallery", icon: Images },
]

export function MobileBottomNav() {
  const pathname = usePathname()
  const isMobile = useIsMobile()

  if (!isMobile) {
    return null // Only render on mobile
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-background border-t border-border shadow-lg md:hidden">
      <nav className="flex justify-around h-16 items-center">
        {navItems.map((item) => {
          const active = pathname === item.href || pathname?.startsWith(item.href + "/")
          const Icon = item.icon
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center text-sm font-medium transition-colors duration-200",
                active ? "text-primary" : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Icon className="w-6 h-6 mb-1" />
              <span>{item.label}</span>
            </Link>
          )
        })}
      </nav>
    </div>
  )
}
