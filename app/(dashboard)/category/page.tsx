"use client"

import { useEffect, useState } from "react" // Import useEffect and useState
import { EditCategoryDialog } from "@/components/category/edit-category-dialog"
import { useToast } from "@/hooks/use-toast"
import { useSession } from "@/hooks/use-auth"
import { api } from "@/lib/api" // Import the centralized API client
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"

type Category = { id: string; categoryName: string; description: string; creatorName: string } // Changed name to categoryName to match backend

export default function CategoryPage() {
  const { toast } = useToast()
  const { session } = useSession()
  console.log("CategoryPage: session", session)

  const [categories, setCategories] = useState<Category[]>([]) // Manage categories state
  const [loading, setLoading] = useState(true) // Add loading state

  // Function to fetch categories
  const fetchCategories = async () => {
    if (!session?.accessToken) {
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const data = await api.get("/category", session.accessToken);
      setCategories(data.data); // Assuming backend returns { categories: [...] }
    } catch (e: any) {
      toast({ title: "Error fetching categories", description: e.message, variant: "destructive" });
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch categories on component mount and when session.accessToken changes
  useEffect(() => {
    fetchCategories();
  }, [session?.accessToken]); // Dependency on session.accessToken

  async function updateName(id: string, name: string, description: string) {
    if (!name) return
    if (!session?.accessToken) {
      toast({ title: "Authentication error", description: "User not authenticated.", variant: "destructive" });
      return;
    }
    try {
      await api.patch(`/category/${id}`, { categoryName: name, description }, session.accessToken) // Use api.put, pass token
      toast({ title: "Updated", description: "Category name changed." })
      fetchCategories(); // Re-fetch categories after update
    } catch (e: any) {
      toast({ title: "Update failed", description: e.message, variant: "destructive" })
    }
  }

  async function deleteCat(id: string) {
    if (!session?.accessToken) {
      toast({ title: "Authentication error", description: "User not authenticated.", variant: "destructive" });
      return;
    }
    try {
      await api.delete(`/category/${id}`, session.accessToken) // Use api.delete, pass token
      toast({ title: "Deleted", description: "Category removed." })
      fetchCategories(); // Re-fetch categories after delete
    } catch (e: any) {
      toast({ title: "Delete failed", description: e.message, variant: "destructive" })
    }
  }

  async function createCat(formData: FormData) {
    const name = String(formData.get("name") || "").trim()
    const description = String(formData.get("description") || "").trim()
    if (!name) return
    if (!session?.userId || !session?.accessToken) { // Ensure userId and accessToken are available
      toast({ title: "Authentication error", description: "User not authenticated.", variant: "destructive" });
      return;
    }
    try {
      await api.post("/category", { categoryName: name, description }, session.accessToken) // Use api.post, use userId, pass token
      ;(document.getElementById("new-cat-form") as HTMLFormElement)?.reset()
      toast({ title: "Created", description: "New category added." })
      fetchCategories(); // Re-fetch categories after create
    } catch (e: any) {
      toast({ title: "Create failed", description: e.message, variant: "destructive" })
    }
  }

  return (
    <div className="space-y-8 p-8 bg-gradient-to-br from-green-50 to-teal-100 rounded-xl shadow-2xl">
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-4xl font-extrabold tracking-tight text-gray-900">Categories</h2>
        <form id="new-cat-form" action={async (fd) => createCat(fd)} className="flex items-center gap-4">
          <input
            name="name"
            placeholder="New category name"
            className="h-12 w-64 rounded-lg border border-gray-300 bg-white px-4 text-lg outline-none shadow-sm focus-visible:ring-2 focus-visible:ring-blue-500/50 transition duration-200"
          />
          <input
            name="description"
            placeholder="Category description"
            className="h-12 w-64 rounded-lg border border-gray-300 bg-white px-4 text-lg outline-none shadow-sm focus-visible:ring-2 focus-visible:ring-blue-500/50 transition duration-200"
          />
          <button
            type="submit"
            className="inline-flex h-12 items-center rounded-lg bg-blue-600 px-6 text-lg font-medium text-white shadow-md hover:bg-blue-700 transition duration-200 transform hover:-translate-y-0.5"
          >
            Add Category
          </button>
        </form>
      </div>

      <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-xl">
        <table className="w-full text-lg">
          <thead className="border-b-2 border-gray-300 bg-gray-100">
            <tr>
              <th className="h-14 px-5 text-left font-bold text-gray-800">SN</th>
              <th className="h-14 px-5 text-left font-bold text-gray-800">Category Name</th>
              <th className="h-14 px-5 text-left font-bold text-gray-800">Description</th>
              <th className="h-14 px-5 text-left font-bold text-gray-800">Created By</th>
              <th className="h-14 px-5 text-right font-bold text-gray-800">Action</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={5} className="p-8 text-center text-xl text-muted-foreground">
                  Loading categories...
                </td>
              </tr>
            ) : categories && categories.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-8 text-center text-xl text-muted-foreground">
                  No categories yet.
                </td>
              </tr>
            ) : (
              categories && categories.map((c, idx) => (
                <tr key={c.id} className="border-b border-gray-100 odd:bg-gray-50 hover:bg-gray-100 transition duration-150">
                  <td className="p-5">{idx + 1}</td>
                  <td className="p-5 font-medium text-gray-800 max-w-xs truncate">{c.categoryName}</td>
                  <td className="p-5 text-gray-600 max-w-md truncate">
                    <Tooltip>
                      <TooltipTrigger>{c.description}</TooltipTrigger>
                      <TooltipContent>
                        <p>{c.description}</p>
                      </TooltipContent>
                    </Tooltip>
                  </td>
                  <td className="p-5 text-gray-600">{c.creatorName}</td>
                  <td className="p-5 text-right">
                    <div className="inline-flex gap-3">
                      <EditCategoryDialog
                        current={c.categoryName} // Use categoryName
                        currentDescription={c.description}
                        onSave={(name, description) => updateName(c.id, name, description)}
                        trigger={
                          <button className="inline-flex h-10 items-center rounded-lg border border-blue-400 bg-blue-500 px-4 text-base font-medium text-white shadow-sm hover:bg-blue-600 transition duration-200">
                            Edit
                          </button>
                        }
                      />
                      <button
                        onClick={() => deleteCat(c.id)}
                        className="inline-flex h-10 items-center rounded-lg bg-red-500 px-4 text-base font-medium text-white shadow-sm hover:bg-red-600 transition duration-200"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
