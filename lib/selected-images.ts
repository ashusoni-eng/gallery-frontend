const LOCAL_STORAGE_KEY = "selectedImageIds";

export const selectedImages = {
  get(): string[] {
    if (typeof window === "undefined") {
      return [];
    }
    const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  },

  add(id: string): void {
    if (typeof window === "undefined") {
      return;
    }
    const current = this.get();
    if (!current.includes(id)) {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify([...current, id]));
    }
  },

  remove(id: string): void {
    if (typeof window === "undefined") {
      return;
    }
    const current = this.get();
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(current.filter((item) => item !== id)));
  },

  clear(): void {
    if (typeof window === "undefined") {
      return;
    }
    localStorage.removeItem(LOCAL_STORAGE_KEY);
  },

  has(id: string): boolean {
    if (typeof window === "undefined") {
      return false;
    }
    return this.get().includes(id);
  },
};
