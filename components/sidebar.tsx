"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { LayoutDashboard, Folder, Images } from "lucide-react"
import {
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarSeparator,
} from "@/components/ui/sidebar"

const items = [
  { href: "/gallery-wall", label: "Gallery Wall", icon: Images },
  { href: "/dashboard", label: "Album", icon: LayoutDashboard },
  { href: "/category", label: "Category", icon: Folder },
  { href: "/manage-images", label: "Manage Images", icon: Images },
  { href: "/groups", label: "Groups", icon: Folder },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <>
      <SidebarContent className="p-4 bg-gradient-to-b from-blue-500 to-purple-600 text-white">
        <div className="p-6 text-center mb-4">
          {/* Replace with your actual logo or app title */}
          <h1 className="text-3xl font-extrabold text-white">GalleryApp</h1>
        </div>
        <SidebarGroup>
          <SidebarGroupLabel className="px-6 py-2 text-sm font-semibold text-blue-200 uppercase tracking-wider">Menu</SidebarGroupLabel>
          <SidebarMenu>
            {items.map((it) => {
              const active = pathname === it.href || pathname?.startsWith(it.href + "/")
              const Icon = it.icon
              return (
                <SidebarMenuItem key={it.href} className="mb-2">
                  <SidebarMenuButton asChild isActive={!!active}>
                    <Link
                      href={it.href}
                      className={cn("flex items-center gap-4 px-6 py-3 rounded-lg transition-all duration-200", active ? "bg-white bg-opacity-20 text-white shadow-md" : "text-blue-100 hover:bg-white hover:bg-opacity-10 hover:text-blue-900")}
                      aria-current={active ? "page" : undefined}
                    >
                      <Icon className="size-6" aria-hidden="true" />
                      <span className="text-lg font-medium">{it.label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )
            })}
          </SidebarMenu>
        </SidebarGroup>
        <SidebarSeparator className="my-6 border-blue-400" />
      </SidebarContent>
    </>
  )
}
