import type React from "react"
import Protected from "@/components/auth/protected"
import { Sidebar as AppSidebar } from "@/components/sidebar"
import { Sidebar as UISidebar, SidebarInset, SidebarProvider, SidebarRail } from "@/components/ui/sidebar"
import { Topbar } from "@/components/topbar"

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <Protected>
      <SidebarProvider>
        <div className="flex min-h-dvh w-full">
          <UISidebar collapsible="icon" className="bg-background">
            <AppSidebar />
            <SidebarRail />
          </UISidebar>

          <SidebarInset>
            <Topbar />
            <main className="p-4">{children}</main>
          </SidebarInset>
        </div>
      </SidebarProvider>
    </Protected>
  )
}
