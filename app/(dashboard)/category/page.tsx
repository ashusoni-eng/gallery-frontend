"use client"

import { useEffect, useState } from "react" // Import useEffect and useState
import { EditCategoryDialog } from "@/components/category/edit-category-dialog"
import { useToast } from "@/hooks/use-toast"
import { useSession } from "@/hooks/use-auth"
import { api } from "@/lib/api" // Import the centralized API client

type Category = { id: string; categoryName: string; creatorName: string } // Changed name to categoryName to match backend

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

  async function updateName(id: string, name: string) {
    if (!name) return
    if (!session?.accessToken) {
      toast({ title: "Authentication error", description: "User not authenticated.", variant: "destructive" });
      return;
    }
    try {
      await api.patch(`/category/${id}`, { categoryName: name }, session.accessToken) // Use api.put, pass token
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
    if (!name) return
    if (!session?.userId || !session?.accessToken) { // Ensure userId and accessToken are available
      toast({ title: "Authentication error", description: "User not authenticated.", variant: "destructive" });
      return;
    }
    try {
      await api.post("/category", { categoryName: name }, session.accessToken) // Use api.post, use userId, pass token
      ;(document.getElementById("new-cat-form") as HTMLFormElement)?.reset()
      toast({ title: "Created", description: "New category added." })
      fetchCategories(); // Re-fetch categories after create
    } catch (e: any) {
      toast({ title: "Create failed", description: e.message, variant: "destructive" })
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-2">
        <h2 className="text-xl font-semibold text-pretty">Categories</h2>
        <form id="new-cat-form" action={async (fd) => createCat(fd)} className="flex items-center gap-2">
          <input
            name="name"
            placeholder="New category name"
            className="h-9 w-56 rounded-md border border-input bg-transparent px-3 text-sm outline-none shadow-xs focus-visible:ring-2 focus-visible:ring-ring/50"
          />
          <button
            type="submit"
            className="inline-flex h-9 items-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground shadow-xs hover:bg-primary/90"
          >
            Add
          </button>
        </form>
      </div>

      <div className="overflow-x-auto rounded-lg border bg-card">
        <table className="w-full text-sm">
          <thead className="border-b">
            <tr>
              <th className="h-10 px-3 text-left font-medium">SN</th>
              <th className="h-10 px-3 text-left font-medium">Category Name</th>
              <th className="h-10 px-3 text-left font-medium">Created By</th>
              <th className="h-10 px-3 text-right font-medium">Action</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={4} className="p-6 text-center text-muted-foreground">
                  Loading categories...
                </td>
              </tr>
            ) : categories && categories.length === 0 ? (
              <tr>
                <td colSpan={4} className="p-6 text-center text-muted-foreground">
                  No categories yet.
                </td>
              </tr>
            ) : (
              categories && categories.map((c, idx) => (
                <tr key={c.id} className="border-b odd:bg-muted/50">
                  <td className="p-3">{idx + 1}</td>
                  <td className="p-3 font-medium">{c.categoryName}</td> {/* Use categoryName */}
                  <td className="p-3">{c.creatorName}</td>
                  <td className="p-3 text-right">
                    <div className="inline-flex gap-2">
                      <EditCategoryDialog
                        current={c.categoryName} // Use categoryName
                        onSave={(name) => updateName(c.id, name)}
                        trigger={
                          <button className="inline-flex h-8 items-center rounded-md border bg-background px-3 text-sm shadow-xs hover:bg-accent">
                            Edit
                          </button>
                        }
                      />
                      <button
                        onClick={() => deleteCat(c.id)}
                        className="inline-flex h-8 items-center rounded-md bg-destructive px-3 text-sm font-medium text-white shadow-xs hover:bg-destructive/90"
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
