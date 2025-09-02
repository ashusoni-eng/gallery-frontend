export type User = {
  id: string
  username: string
  email: string
}

export type Category = {
  id: string
  name: string
  createdBy: string // username
  createdAt: string
}

export type ImageItem = {
  id: string
  categoryId: string
  url: string
  uploadedBy: string // username
  createdAt: string
}

let initialized = false

const users = new Map<string, User>()
const categories = new Map<string, Category>()
const images = new Map<string, ImageItem>()

function uid(prefix = "") {
  return `${prefix}${Math.random().toString(36).slice(2, 10)}${Date.now().toString(36)}`
}

function init() {
  if (initialized) return
  initialized = true

  const admin: User = { id: uid("usr_"), username: "admin", email: "admin@example.com" }
  users.set(admin.id, admin)

  const cat1: Category = {
    id: uid("cat_"),
    name: "Nature",
    createdBy: admin.username,
    createdAt: new Date().toISOString(),
  }
  const cat2: Category = {
    id: uid("cat_"),
    name: "Architecture",
    createdBy: admin.username,
    createdAt: new Date().toISOString(),
  }
  categories.set(cat1.id, cat1)
  categories.set(cat2.id, cat2)

  const sample = (query: string) => `/placeholder.svg?height=320&width=480&query=${query} sample image`
  const img1: ImageItem = {
    id: uid("img_"),
    categoryId: cat1.id,
    url: sample("forest"),
    uploadedBy: admin.username,
    createdAt: new Date().toISOString(),
  }
  const img2: ImageItem = {
    id: uid("img_"),
    categoryId: cat1.id,
    url: sample("mountain"),
    uploadedBy: admin.username,
    createdAt: new Date().toISOString(),
  }
  const img3: ImageItem = {
    id: uid("img_"),
    categoryId: cat2.id,
    url: sample("building"),
    uploadedBy: admin.username,
    createdAt: new Date().toISOString(),
  }
  images.set(img1.id, img1)
  images.set(img2.id, img2)
  images.set(img3.id, img3)
}

export function dbInit() {
  init()
}

export const db = { users, categories, images }

export const api = {
  // Users
  createUser: (username: string, email: string): User => {
    const user: User = { id: uid("usr_"), username, email }
    db.users.set(user.id, user)
    return user
  },
  findUserByEmail: (email: string) => Array.from(db.users.values()).find((u) => u.email === email) || null,

  // Categories
  listCategories: (): Category[] => Array.from(db.categories.values()).sort((a, b) => a.name.localeCompare(b.name)),
  getCategory: (id: string): Category | null => db.categories.get(id) || null,
  createCategory: (name: string, createdBy: string): Category => {
    const cat: Category = { id: uid("cat_"), name, createdBy, createdAt: new Date().toISOString() }
    db.categories.set(cat.id, cat)
    return cat
  },
  updateCategory: (id: string, name: string): Category | null => {
    const c = db.categories.get(id)
    if (!c) return null
    const updated: Category = { ...c, name }
    db.categories.set(id, updated)
    return updated
  },
  deleteCategory: (id: string): boolean => {
    Array.from(db.images.values())
      .filter((i) => i.categoryId === id)
      .forEach((i) => db.images.delete(i.id))
    return db.categories.delete(id)
  },

  // Images
  listImages: (categoryId?: string): ImageItem[] => {
    const all = Array.from(db.images.values())
    return categoryId ? all.filter((i) => i.categoryId === categoryId) : all
  },
  addImages: (items: Omit<ImageItem, "id" | "createdAt">[]): ImageItem[] => {
    const created: ImageItem[] = []
    for (const it of items) {
      const img: ImageItem = { ...it, id: uid("img_"), createdAt: new Date().toISOString() }
      db.images.set(img.id, img)
      created.push(img)
    }
    return created
  },
  deleteImage: (id: string) => db.images.delete(id),
}

dbInit()
