"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { useSession } from "@/hooks/use-auth"
import { api } from "@/lib/api"

type ImageGroup = { id: string; groupName: string; createdAt: string; images: { id: string; url: string; fileName: string }[] }

export default function ImageGroupDetailPage() {
  const params = useParams<{ id: string }>()
  const groupId = params.id
  const { toast } = useToast()
  const { session } = useSession()
  const [group, setGroup] = useState<ImageGroup | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (groupId && session?.accessToken) {
      fetchGroupDetails()
    }
  }, [groupId, session])

  const fetchGroupDetails = async () => {
    setLoading(true)
    try {
      const res = await api.get(`/image-group/${groupId}`, session!.accessToken)
      setGroup(res.data)
    } catch (e: any) {
      toast({ title: "Error fetching group details", description: e.message, variant: "destructive" })
      setGroup(null)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-pretty">{group?.groupName || "Image Group Details"}</h2>

      {loading ? (
        <div className="col-span-full rounded-lg border bg-card p-6 text-center text-muted-foreground">
          Loading group details...
        </div>
      ) : !group ? (
        <div className="col-span-full rounded-lg border bg-card p-6 text-center text-muted-foreground">
          Group not found.
        </div>
      ) : (
        <div className="rounded-xl border bg-card shadow-sm p-6">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {group.images.length === 0 ? (
              <div className="col-span-full text-center text-muted-foreground">
                No images in this group yet.
              </div>
            ) : (
              group.images.map((image) => (
                <div key={image.id} className="overflow-hidden rounded-lg border bg-card shadow-sm">
                  <div className="relative aspect-[4/3] w-full bg-muted">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={image.url} alt={image.fileName} className="h-full w-full object-cover" />
                  </div>
                  <div className="p-3 text-sm">
                    {image.fileName}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  )
}
