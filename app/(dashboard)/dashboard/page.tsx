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
  const [totalImages, setTotalImages] = useState<number>(0) // New state for total images
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (session?.accessToken) {
      fetchData()
    }
  }, [session])

  const fetchData = async () => {
    setLoading(true)
    try {
      const [catRes, imageCountRes] = await Promise.all([
        api.get("/category", session!.accessToken),
        api.get("/gallery/count", session!.accessToken), // Fetch total image count
      ])
      setCategories(catRes.data || [])
      setTotalImages(imageCountRes.data || 0) // Set total images
    } catch (e: any) {
      toast({ title: "Error fetching data", description: e.message, variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-8 p-8 bg-gradient-to-br from-purple-50 to-pink-100 rounded-xl shadow-2xl">
      <div className="flex items-center justify-between">
        <h2 className="text-4xl font-extrabold tracking-tight text-gray-900">Dashboard Overview</h2>
      </div>

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-purple-200 bg-white text-card-foreground shadow-xl transform transition duration-500 hover:scale-105 hover:shadow-2xl">
          <div className="p-7 flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="tracking-tight text-xl font-semibold text-purple-800">Total Categories</h3>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-8 w-8 text-purple-600"
            >
              <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
          </div>
          <div className="p-7 pt-0">
            <div className="text-4xl font-bold text-gray-900">{categories.length}</div>
            <p className="text-base text-muted-foreground">
              Number of categories created
            </p>
          </div>
        </div>

        <div className="rounded-2xl border border-pink-200 bg-white text-card-foreground shadow-xl transform transition duration-500 hover:scale-105 hover:shadow-2xl">
          <div className="p-7 flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="tracking-tight text-xl font-semibold text-pink-800">Total Images</h3>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-8 w-8 text-pink-600"
            >
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M22 21v-2a4 4 0 0 0-3-3.87m-3-1.13a4 4 0 0 1 0-7.75" />
            </svg>
          </div>
          <div className="p-7 pt-0">
            <div className="text-4xl font-bold text-gray-900">{totalImages}</div>
            <p className="text-base text-muted-foreground">
              Total images uploaded across all categories
            </p>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-xl">
        <table className="w-full text-lg">
          <thead className="border-b-2 border-gray-300 bg-gray-100">
            <tr>
              <th className="h-14 px-5 text-left font-bold text-gray-800">SN</th>
              <th className="h-14 px-5 text-left font-bold text-gray-800">Category</th>
              <th className="h-14 px-5 text-left font-bold text-gray-800">Thumbnail</th>
              <th className="h-14 px-5 text-left font-bold text-gray-800">Created By</th>
              <th className="h-14 px-5 text-right font-bold text-gray-800">Action</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={5} className="p-8 text-center text-xl text-muted-foreground">
                  Loading...
                </td>
              </tr>
            ) : categories.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-8 text-center text-xl text-muted-foreground">
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
