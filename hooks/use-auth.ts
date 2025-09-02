"use client"

import useSWR from "swr"
import { useEffect } from "react"

type Session = { email: string; username: string; accessToken: string; refreshToken: string; userId: string } | null
const STORAGE_KEY = "demo_auth_session"

export function useSession() {
  // Initialize useSWR with fallbackData: null, and let useEffect handle loading from localStorage
  const { data, mutate } = useSWR<Session>(STORAGE_KEY, null, { fallbackData: null })

  useEffect(() => {
    // Only load from localStorage on the client-side after hydration
    if (typeof window !== "undefined") {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) {
        try {
          const parsed = JSON.parse(raw) as Session
          mutate(parsed, false) // Update SWR cache without revalidation
        } catch (e) {
          // Handle parsing errors, e.g., corrupted localStorage data
          console.error("Error parsing session from localStorage:", e);
          mutate(null, false); // Clear session if data is corrupted
        }
      }
    }
  }, []) // Empty dependency array means this runs once on mount

  const save = (s: Session) => {
    if (typeof window !== "undefined") {
      if (s) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(s))
      }
      else {
        localStorage.removeItem(STORAGE_KEY)
      }
    }
    mutate(s, false) // Update SWR cache immediately without revalidation
  }

  return { session: data, setSession: save, logout: () => save(null) }
}
