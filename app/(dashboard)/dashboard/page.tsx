"use client"

import { useEffect, useState } from "react"
import { useSession } from "@/hooks/use-auth"
import { api } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"
import { CategoryRow } from "@/components/dashboard/category-row"

type Category = { id: string; categoryName: string; createdBy: string; thumbnailUrl?: string; creatorName: string }

export default function DashboardPage() {
  const { session } = useSession()
  const { toast } = useToast()
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (session?.accessToken) {
      fetchData()
    }
  }, [session])

  const fetchData = async () => {
    setLoading(true)
    try {
      const catRes = await api.get("/category", session!.accessToken)
      setCategories(catRes.data || [])
    } catch (e: any) {
      toast({ title: "Error fetching data", description: e.message, variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-pretty">Dashboard</h2>
      <div className="overflow-x-auto rounded-lg border bg-card">
        <table className="w-full text-sm">
          <thead className="border-b">
            <tr>
              <th className="h-10 px-3 text-left font-medium">SN</th>
              <th className="h-10 px-3 text-left font-medium">Category</th>
              <th className="h-10 px-3 text-left font-medium">Thumbnail</th>
              <th className="h-10 px-3 text-left font-medium">Created By</th>
              <th className="h-10 px-3 text-right font-medium">Action</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={5} className="p-6 text-center text-muted-foreground">
                  Loading...
                </td>
              </tr>
            ) : categories.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-6 text-center text-muted-foreground">
                  No categories yet.
                </td>
              </tr>
            ) : (
              categories.map((c, idx) => (
                <CategoryRow key={c.id} category={c} index={idx} thumbnailUrl={c.thumbnailUrl} />
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
