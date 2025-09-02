"use client"

import type React from "react"

import { useEffect, useRef, useState } from "react"

export function EditCategoryDialog({
  current,
  onSave,
  trigger,
}: {
  current: string
  onSave: (name: string) => Promise<void> | void
  trigger: React.ReactNode
}) {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState(current)
  const dlgRef = useRef<HTMLDialogElement | null>(null)

  useEffect(() => {
    const dlg = dlgRef.current
    if (!dlg) return
    if (open && !dlg.open) dlg.showModal()
    if (!open && dlg.open) dlg.close()
  }, [open])

  useEffect(() => {
    if (open) setName(current)
  }, [open, current])

  async function save() {
    await onSave(name.trim())
    setOpen(false)
  }

  return (
    <>
      <span onClick={() => setOpen(true)} className="inline-flex">
        {trigger}
      </span>
      <dialog
        ref={dlgRef}
        onClose={() => setOpen(false)}
        className="rounded-lg border bg-background p-0 shadow-lg backdrop:bg-black/40 w-[min(96vw,480px)]"
      >
        <form method="dialog">
          <div className="border-b p-4">
            <div className="text-lg font-semibold">Edit Category</div>
            <div className="text-sm text-muted-foreground">Update the category name and save changes.</div>
          </div>
          <div className="p-4">
            <input
              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoFocus
            />
          </div>
          <div className="flex justify-end gap-2 border-t p-3">
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="inline-flex h-9 items-center rounded-md border bg-background px-4 text-sm shadow-xs hover:bg-accent"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={save}
              className="inline-flex h-9 items-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground shadow-xs hover:bg-primary/90"
            >
              Save
            </button>
          </div>
        </form>
      </dialog>
    </>
  )
}
