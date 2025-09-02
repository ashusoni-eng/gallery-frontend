"use client"

import { useEffect, useState } from "react"
import { useToast } from "@/hooks/use-toast"
import { useSession } from "@/hooks/use-auth"
import { api } from "@/lib/api"
import Link from "next/link"

type ImageGroup = { id: string; groupName: string; createdAt: string; images: { id: string; url: string }[] }

export default function GroupsPage() {
  const { toast } = useToast()
  const { session } = useSession()
  const [groups, setGroups] = useState<ImageGroup[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (session?.accessToken) {
      fetchGroups()
    }
  }, [session])

  const fetchGroups = async () => {
    setLoading(true)
    try {
      const res = await api.get("/image-group", session!.accessToken)
      setGroups(res.data || [])
    } catch (e: any) {
      toast({ title: "Error fetching groups", description: e.message, variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-pretty">Image Groups</h2>

      <div className="overflow-x-auto rounded-lg border bg-card">
        <table className="w-full text-sm">
          <thead className="border-b">
            <tr>
              <th className="h-10 px-3 text-left font-medium">SN</th>
              <th className="h-10 px-3 text-left font-medium">Group Name</th>
              <th className="h-10 px-3 text-left font-medium">Images</th>
              <th className="h-10 px-3 text-left font-medium">Created At</th>
              <th className="h-10 px-3 text-right font-medium">Action</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={5} className="p-6 text-center text-muted-foreground">
                  Loading groups...
                </td>
              </tr>
            ) : groups.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-6 text-center text-muted-foreground">
                  No image groups yet.
                </td>
              </tr>
            ) : (
              groups.map((group, idx) => (
                <tr key={group.id} className="border-b odd:bg-muted/50">
                  <td className="p-3">{idx + 1}</td>
                  <td className="p-3 font-medium">{group.groupName}</td>
                  <td className="p-3">{group.images.length}</td>
                  <td className="p-3">{new Date(group.createdAt).toLocaleDateString()}</td>
                  <td className="p-3 text-right">
                    <Link
                      href={`/image-group/${group.id}`}
                      className="inline-flex h-8 items-center rounded-md bg-primary px-3 text-sm font-medium text-primary-foreground shadow-xs hover:bg-primary/90"
                    >
                      View
                    </Link>
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
