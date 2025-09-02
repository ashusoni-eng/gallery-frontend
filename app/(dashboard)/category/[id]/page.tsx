"use client"

import { useParams } from "next/navigation"
import { useState, useMemo, useEffect } from "react"
import { useToast } from "@/hooks/use-toast"
import { api } from "@/lib/api"
import { useSession } from "@/hooks/use-auth"
import { selectedImages } from "@/lib/selected-images"
import { CreateGroupDialog } from "@/components/image-group/create-group-dialog"

type Category = { id: string; name: string }
type ImageItem = { id: string; categoryId: string; url: string; uploadedBy: string; uploadedByName: string }

export default function CategoryDetailPage() {
  const params = useParams<{ id: string }>()
  const id = params.id
  const { toast } = useToast()
  const { session } = useSession()
  console.log("CategoryDetailPage: session", session)

  const [category, setCategory] = useState<Category | null>(null)
  const [images, setImages] = useState<ImageItem[]>([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState<Record<string, boolean>>(() => {
    const initialSelected: Record<string, boolean> = {};
    selectedImages.get().forEach(imgId => {
      initialSelected[imgId] = true;
    });
    return initialSelected;
  });

  // Function to fetch category details and images
  const fetchData = async () => {
    if (!id || !session?.accessToken) {
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      // Fetch category details
      const categoryData = await api.get(`/category/${id}`, session.accessToken);
      setCategory(categoryData.category); // Assuming backend returns { category: {...} }

      // Fetch images for the category
      const imagesData = await api.get(`/gallery?categoryId=${id}`, session.accessToken);
      setImages(imagesData.data);

    } catch (e: any) {
      toast({ title: "Error fetching data", description: e.message, variant: "destructive" });
      setCategory(null);
      setImages([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch data on component mount and when id or session.accessToken changes
  useEffect(() => {
    fetchData();
  }, [id, session?.accessToken]); // Dependencies on id and session.accessToken

  // const [selected, setSelected] = useState<Record<string, boolean>>({})

  const selectedCount = useMemo(() => Object.values(selected).filter(Boolean).length, [selected])

  function toggle(imgId: string) {
    setSelected((s) => {
      const newState = { ...s, [imgId]: !s[imgId] };
      if (newState[imgId]) {
        selectedImages.add(imgId);
      } else {
        selectedImages.remove(imgId);
      }
      return newState;
    });
  }

  async function addToGroup(groupName: string) {
    const allSelectedImageIds = selectedImages.get();
    if (allSelectedImageIds.length === 0) {
      toast({ title: "No images selected", description: "Select images to add to a group." });
      return;
    }

    if (!session?.accessToken) {
      toast({ title: "Authentication error", description: "User not authenticated.", variant: "destructive" });
      return;
    }

    if (!groupName || groupName.trim() === "") {
      toast({ title: "Group name required", description: "Please enter a valid name for the image group.", variant: "destructive" });
      return;
    }

    try {
      await api.post("/image-group", { imageIds: allSelectedImageIds, groupName }, session.accessToken);
      toast({ title: "Group Created", description: `${allSelectedImageIds.length} image(s) added to a new group: ${groupName}.` });
      selectedImages.clear(); // Clear selected images after successful group creation
      setSelected({}); // Clear local state as well
    } catch (e: any) {
      toast({ title: "Error creating group", description: e.message, variant: "destructive" });
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-2">
        <h2 className="text-xl font-semibold text-pretty">{category?.name || "Category"}</h2>
        <CreateGroupDialog onConfirm={addToGroup}>
          <button
            className="inline-flex h-9 items-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground shadow-xs hover:bg-primary/90"
          >
            Add to Group
          </button>
        </CreateGroupDialog>
      </div>

      {loading ? (
        <div className="col-span-full rounded-lg border bg-card p-6 text-center text-muted-foreground">
          Loading images...
        </div>
      ) : images && images.length === 0 ? (
        <div className="col-span-full rounded-lg border bg-card p-6 text-center text-muted-foreground">
          No images in this category yet.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {images && images.map((img) => (
            <div key={img.id} className="overflow-hidden rounded-lg border bg-card shadow-sm">
              <div className="relative aspect-[4/3] w-full bg-muted">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={img.url || "/placeholder.svg"}
                  alt={`Image uploaded by ${img.uploadedByName}`}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="flex items-center justify-between p-3">
                <div className="text-sm">
                  <div className="text-muted-foreground">Uploaded by</div>
                  <div className="font-medium">{img.uploadedByName}</div>
                </div>
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    className="size-4"
                    checked={!!selected[img.id]}
                    onChange={() => toggle(img.id)}
                    aria-label="Select image"
                  />
                  Select
                </label>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
