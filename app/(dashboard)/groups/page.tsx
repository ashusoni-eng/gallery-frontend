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
    <div className="space-y-8 p-8 bg-gradient-to-br from-blue-50 to-purple-100 rounded-xl shadow-2xl">
      <h2 className="text-4xl font-extrabold tracking-tight text-gray-900">Image Groups</h2>

      <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-xl">
        <table className="w-full text-lg">
          <thead className="border-b-2 border-gray-300 bg-gray-100">
            <tr>
              <th className="h-14 px-5 text-left font-bold text-gray-800">SN</th>
              <th className="h-14 px-5 text-left font-bold text-gray-800">Group Name</th>
              <th className="h-14 px-5 text-left font-bold text-gray-800">Images</th>
              <th className="h-14 px-5 text-left font-bold text-gray-800">Created At</th>
              <th className="h-14 px-5 text-right font-bold text-gray-800">Action</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={5} className="p-8 text-center text-xl text-muted-foreground">
                  Loading groups...
                </td>
              </tr>
            ) : groups.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-8 text-center text-xl text-muted-foreground">
                  No image groups yet.
                </td>
              </tr>
            ) : (
              groups.map((group, idx) => (
                <tr key={group.id} className="border-b border-gray-100 odd:bg-gray-50 hover:bg-gray-100 transition duration-150">
                  <td className="p-5">{idx + 1}</td>
                  <td className="p-5 font-medium text-gray-800">{group.groupName}</td>
                  <td className="p-5 text-gray-600">{group.images.length}</td>
                  <td className="p-5 text-gray-600">{new Date(group.createdAt).toLocaleDateString()}</td>
                  <td className="p-5 text-right">
                    <Link
                      href={`/image-group/${group.id}`}
                      className="inline-flex h-10 items-center rounded-lg bg-blue-600 px-5 text-base font-medium text-white shadow-md hover:bg-blue-700 transition duration-200 transform hover:-translate-y-0.5"
                    >
                      View Group
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
