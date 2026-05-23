"use client"

import { create } from "zustand"
import type { User } from "@/types"
import { mockCurrentUser } from "@/data/mock-users"

interface AuthState {
  user: User | null
  isLoading: boolean
  login: () => void
  logout: () => void
}

export const useAuth = create<AuthState>((set) => ({
  user: null,
  isLoading: false,
  login: () => set({ user: mockCurrentUser }),
  logout: () => set({ user: null }),
}))
