"use client"

import type React from "react"

import { useEffect, useMemo, useRef, useState } from "react"
import { useToast } from "@/hooks/use-toast"
import { useSession } from "@/hooks/use-auth"
import { api } from "@/lib/api" // Import the centralized API client

type Category = { id: string; categoryName: string } // Changed name to categoryName to match backend

export default function ManageImagesPage() {
  const fileRef = useRef<HTMLInputElement | null>(null)
  const [files, setFiles] = useState<File[]>([])
  const [categoryId, setCategoryId] = useState<string>("")
  const { toast } = useToast()
  const { session } = useSession()
  console.log("ManageImagesPage: session", session) // Remove this console.log later

  const [categories, setCategories] = useState<Category[]>([]) // Manage categories state
  const [loadingCategories, setLoadingCategories] = useState(true) // Add loading state for categories
  const [gallery, setGallery] = useState<any[]>([]) // Manage gallery state
  const [loadingGallery, setLoadingGallery] = useState(true) // Add loading state for gallery

  // Function to fetch categories
  const fetchCategories = async () => {
    if (!session?.accessToken) {
      setLoadingCategories(false);
      return;
    }
    setLoadingCategories(true);
    try {
      const data = await api.get("/category", session.accessToken);
      setCategories(data.data); // Assuming backend returns { categories: [...] }
      // Set initial categoryId if categories are available and not already set
      if (data.data.length > 0 && !categoryId) {
        setCategoryId(data.data[0].id);
      }
    } catch (e: any) {
      toast({ title: "Error fetching categories", description: e.message, variant: "destructive" });
      setCategories([]);
    } finally {
      setLoadingCategories(false);
    }
  };

  // Function to fetch gallery
  const fetchGallery = async () => {
    if (!session?.accessToken) {
      setLoadingGallery(false);
      return;
    }
    setLoadingGallery(true);
    try {
      const data = await api.get("/gallery", session.accessToken);
      setGallery(data.data); // Assuming backend returns { gallery: [...] }
    } catch (e: any) {
      toast({ title: "Error fetching gallery", description: e.message, variant: "destructive" });
      setGallery([]);
    } finally {
      setLoadingGallery(false);
    }
  };

  // Fetch categories and gallery on component mount and when session.accessToken changes
  useEffect(() => {
    fetchCategories();
    fetchGallery();
  }, [session?.accessToken]); // Dependency on session.accessToken

  function openPicker() {
    fileRef.current?.click()
  }

  function onFilesChange(e: React.ChangeEvent<HTMLInputElement>) {
    const newFiles = Array.from(e.target.files || []).filter((x) => x.type.startsWith("image/"))
    setFiles((prevFiles) => {
      const combinedFiles = [...prevFiles, ...newFiles];
      // Limit to 10 files
      if (combinedFiles.length > 10) {
        toast({ title: "File limit reached", description: "You can only select up to 10 images at once.", variant: "destructive" });
        return combinedFiles.slice(0, 10);
      }
      return combinedFiles;
    });
    // Clear the input value to allow selecting the same files again
    e.target.value = '';
  }

  const previews = useMemo(() => {
    return files.map((f) => ({ name: f.name, url: URL.createObjectURL(f) }))
  }, [files])

  async function uploadAll() {
    if (!files.length) {
      toast({ title: "No files selected", description: "Choose images to upload." }) 
      return
    }
    if (!categoryId) {
      toast({ title: "No category selected", description: "Please select a category.", variant: "destructive" })
      return
    }

    if (!session?.userId || !session?.accessToken) { // Ensure userId and accessToken are available
      toast({ title: "Authentication error", description: "User not authenticated.", variant: "destructive" });
      return;
    }

    const formData = new FormData();
    files.forEach((file) => {
      formData.append("images", file); // 'images' should match the backend's expected field name
    });
    formData.append("categoryId", categoryId);
    formData.append("uploadedBy", session.userId); // Use userId from session

    try {
      // Pass token to api.upload
      const res = await api.upload("/gallery/upload", formData, session.accessToken); // Assuming backend endpoint is /gallery/upload

      setFiles([]);
      toast({ title: "Uploaded", description: "Images uploaded successfully." });
    } catch (e: any) {
      toast({ title: "Upload error", description: e.message, variant: "destructive" });
    }
  }

  return (
    <div className="space-y-8 p-4 bg-background">
      <h2 className="text-4xl font-extrabold tracking-tight text-foreground">Manage Images</h2>

      <div className="rounded-md border border-border bg-card shadow-sm p-4 space-y-4">
        <div className="border-b border-border pb-4">
          <div className="text-xl font-semibold text-foreground">Upload New Images</div>
          <div className="text-sm text-muted-foreground">Select images and upload to a category.</div>
        </div>
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:flex-wrap sm:items-center gap-4">
            <button
              onClick={openPicker}
              className="inline-flex h-10 items-center rounded-md bg-primary px-4 text-base font-medium text-primary-foreground shadow-sm hover:bg-primary/90 transition duration-200 w-full sm:w-auto"
            >
              Select Images
            </button>
            <input ref={fileRef} type="file" accept="image/*" multiple className="hidden" onChange={onFilesChange} />
            <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
              <label className="text-base font-medium text-foreground">Category:</label>
              {loadingCategories ? (
                <select
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  className="h-10 w-full sm:w-auto rounded-md border border-border bg-card px-3 text-base outline-none shadow-sm focus-visible:ring-2 focus-visible:ring-primary/50 transition duration-200"
                  disabled
                >
                  <option>Loading categories...</option>
                </select>
              ) : categories && categories.length === 0 ? (
                <select
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  className="h-10 w-full sm:w-auto rounded-md border border-border bg-card px-3 text-base outline-none shadow-sm focus-visible:ring-2 focus-visible:ring-primary/50 transition duration-200"
                  disabled
                >
                  <option>No categories available</option>
                </select>
              ) : (
                <select
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  className="h-10 w-full sm:w-auto rounded-md border border-border bg-card px-3 text-base outline-none shadow-sm focus-visible:ring-2 focus-visible:ring-primary/50 transition duration-200"
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.categoryName} {/* Use categoryName */}
                    </option>
                  ))}
                </select>
              )}
            </div>
            <div className="w-full sm:w-auto sm:ml-auto">
              <button
                onClick={uploadAll}
                className="inline-flex h-10 items-center rounded-md bg-primary px-4 text-base font-medium text-primary-foreground shadow-sm hover:bg-primary/90 transition duration-200 w-full sm:w-auto"
              >
                Upload Images
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {previews.map((p) => (
              <div key={p.url} className="overflow-hidden rounded-md border border-border bg-card shadow-sm">
                <div className="relative aspect-[4/3] w-full bg-muted">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={p.url || "/placeholder.svg"} alt={p.name} className="h-full w-full object-cover" />
                </div>
                <div className="p-3 text-base font-medium text-foreground">
                  {p.name}
                </div>
              </div>
            ))}
            {!previews.length && (
              <div className="col-span-full rounded-md border border-border bg-card p-4 text-center text-base text-muted-foreground shadow-sm">
                No images selected yet.
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="rounded-md border border-border bg-card shadow-sm p-4 space-y-4">
        <div className="border-b border-border pb-4">
          <div className="text-xl font-semibold text-foreground">Image Gallery</div>
          <div className="text-sm text-muted-foreground">All uploaded images.</div>
        </div>
        <div className="space-y-4">
          {loadingGallery ? (
            <div className="text-center text-base text-muted-foreground">
              Loading gallery...
            </div>
          ) : gallery.length === 0 ? (
            <div className="text-center text-base text-muted-foreground">
              No images in the gallery.
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {gallery.map((image: any) => (
                <div key={image.id} className="overflow-hidden rounded-md border border-border bg-card shadow-sm">
                  <div className="relative aspect-[4/3] w-full bg-muted">
                    <img src={image.url} alt={image.fileName} className="h-full w-full object-cover" />
                  </div>
                  <div className="p-3 text-base font-medium text-foreground">
                    {image.fileName}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
