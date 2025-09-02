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
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/category", label: "Category", icon: Folder },
  { href: "/manage-images", label: "Manage Images", icon: Images },
  { href: "/groups", label: "Groups", icon: Folder },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menu</SidebarGroupLabel>
          <SidebarMenu>
            {items.map((it) => {
              const active = pathname === it.href || pathname?.startsWith(it.href + "/")
              const Icon = it.icon
              return (
                <SidebarMenuItem key={it.href}>
                  <SidebarMenuButton asChild isActive={!!active}>
                    <Link
                      href={it.href}
                      className={cn("flex items-center gap-2")}
                      aria-current={active ? "page" : undefined}
                    >
                      <Icon className="size-4" aria-hidden="true" />
                      <span>{it.label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )
            })}
          </SidebarMenu>
        </SidebarGroup>
        <SidebarSeparator />
      </SidebarContent>
    </>
  )
}
