"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useSession } from "@/hooks/use-auth"
import { api } from "@/lib/api"

type Category = { id: string; categoryName: string; createdBy: string; thumbnailUrl?: string; creatorName: string }

export function CategoryRow({ category, index }: { category: Category; index: number; thumbnailUrl?: string }) {
  return (
    <tr className="border-b odd:bg-muted/50">
      <td className="p-3">{index + 1}</td>
      <td className="p-3 font-medium">{category.categoryName}</td>
      <td className="p-3">
        <div className="relative h-12 w-20 overflow-hidden rounded-md border bg-muted">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={category.thumbnailUrl || "/placeholder.svg?height=80&width=120&query=no thumbnail"}
            alt={`Thumbnail for ${category.categoryName}`}
            className="h-full w-full object-cover"
          />
        </div>
      </td>
      <td className="p-3">{category.creatorName}</td>
      <td className="p-3 text-right">
        <Link
          href={`/category/${category.id}`}
          className="inline-flex h-8 items-center rounded-md bg-primary px-3 text-sm font-medium text-primary-foreground shadow-xs hover:bg-primary/90"
        >
          View
        </Link>
      </td>
    </tr>
  )
}
