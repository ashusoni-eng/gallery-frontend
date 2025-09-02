"use client"

import { useEffect, useState, useCallback } from "react"
import { useInView } from "react-intersection-observer"
import { useToast } from "@/hooks/use-toast"
import { useSession } from "@/hooks/use-auth"
import { api } from "@/lib/api"
import Image from "next/image"
import { formatDistanceToNow } from 'date-fns'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"

type GalleryImage = {
  id: string;
  url: string;
  fileName: string;
  mimetype: string;
  size: number;
  uploadedBy: string;
  categoryId: string | null;
  createdAt: string;
  updatedAt: string;
  uploadedByName: string;
  categoryName: string;
  categoryDescription: string;
}

export default function GalleryWallPage() {
  const { toast } = useToast()
  const { session } = useSession()
  const [images, setImages] = useState<GalleryImage[]>([])
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const { ref, inView } = useInView({
    threshold: 0,
  })

  const fetchImages = useCallback(async () => {
    if (!session?.accessToken || !hasMore || loading) return

    setLoading(true)
    try {
      const response = await api.get(`/gallery/paginated?page=${page}&limit=10`, session.accessToken)
      const newImages: GalleryImage[] = response.data.data
      const totalPages = response.data.lastPage

      setImages((prevImages) => [...prevImages, ...newImages])
      setHasMore(page < totalPages)
      setPage((prevPage) => prevPage + 1)
    } catch (e: any) {
      toast({ title: "Error fetching images", description: e.message, variant: "destructive" })
      setHasMore(false)
    } finally {
      setLoading(false)
    }
  }, [page, session?.accessToken, hasMore, loading, toast])

  useEffect(() => {
    if (inView && hasMore && !loading) {
      fetchImages()
    }
  }, [inView, fetchImages, hasMore, loading])

  useEffect(() => {
    // Reset state when session changes (e.g., user logs out/in)
    setImages([])
    setPage(1)
    setHasMore(true)
    setLoading(false)
  }, [session?.accessToken])

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 mb-8 text-center">Gallery Wall</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {images.map((image) => (
          <div
            key={image.id}
            className="bg-white rounded-lg shadow-md overflow-hidden transform transition duration-300 hover:scale-105 cursor-pointer"
            onClick={() => {
              setSelectedImage(image)
              setIsModalOpen(true)
            }}
          >
            <div className="relative w-full h-64">
              <Image
                src={image.url}
                alt={image.fileName}
                layout="fill"
                objectFit="cover"
                className="rounded-t-lg"
              />
            </div>
            <div className="p-4">
              {/* <h3 className="text-xl font-semibold text-gray-800 mb-2">{image.fileName}</h3> */}
              <p className="text-sm text-gray-600 mb-1"><strong>Category:</strong> {image.categoryName}</p>
              <p className="text-sm text-gray-600 mb-1 truncate whitespace-nowrap"><strong>Description:</strong> {image.categoryDescription}</p>
              <p className="text-sm text-gray-600 mb-1"><strong>Uploaded by:</strong> {image.uploadedByName}</p>
              <p className="text-sm text-gray-600"><strong>Uploaded:</strong> {formatDistanceToNow(new Date(image.createdAt), { addSuffix: true })}</p>
            </div>
          </div>
        ))}
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[800px] p-0 overflow-hidden">
          {selectedImage && (
            <div className="flex flex-col md:flex-row">
              <div className="relative w-full md:w-1/2 h-96">
                <Image
                  src={selectedImage.url}
                  alt={selectedImage.fileName}
                  layout="fill"
                  objectFit="contain"
                />
              </div>
              <div className="w-full md:w-1/2 p-6 flex flex-col justify-between">
                <div>
                  <DialogHeader className="mb-4">
                    {/* <DialogTitle className="text-2xl font-bold">{selectedImage.fileName}</DialogTitle> */}
                    <DialogDescription className="text-gray-600">
                      Full details of the image.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-2 text-lg">
                    <p><strong>Category:</strong> {selectedImage.categoryName}</p>
                    <p><strong>Description:</strong> {selectedImage.categoryDescription}</p>
                    <p><strong>Uploaded by:</strong> {selectedImage.uploadedByName}</p>
                    <p><strong>Uploaded:</strong> {new Date(selectedImage.createdAt).toLocaleString()}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {hasMore && (
        <div ref={ref} className="text-center py-8">
          {loading ? (
            <p className="text-lg text-gray-600">Loading more images...</p>
          ) : (
            <p className="text-lg text-gray-600">Scroll down to load more</p>
          )}
        </div>
      )}
      {!hasMore && images.length === 0 && !loading && (
        <p className="text-center text-xl text-gray-600 py-8">No images to display.</p>
      )}
      {!hasMore && images.length > 0 && !loading && (
        <p className="text-center text-xl text-gray-600 py-8">You have reached the end of the gallery.</p>
      )}
    </div>
  )
}
