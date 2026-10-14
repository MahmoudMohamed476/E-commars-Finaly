import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react'
import type { User as SupabaseUser } from '@supabase/supabase-js'
import type { User } from '../types'
import { supabase, isSupabaseConfigured } from '../lib/supabase'

interface AuthContextValue {
  user: User | null
  isAuthenticated: boolean
  login: (email: string, password?: string, name?: string) => Promise<void>
  register: (name: string, email: string, password?: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)
const STORAGE_KEY = 'shophub_auth_user'

const deriveName = (email: string) =>
  email
    .split('@')[0]
    .replace(/[._]/g, ' ')
    .replace(/\b\w/g, (l) => l.toUpperCase())

const avatarFor = (email: string) =>
  `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(email)}`

function mapSupabaseUser(su: SupabaseUser): User {
  const email = su.email ?? ''
  const name =
    (su.user_metadata?.name as string | undefined) || deriveName(email) || 'Shopper'
  return { id: su.id, name, email, avatar: avatarFor(email) }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    // In Supabase mode the session is restored from Supabase, not localStorage.
    if (isSupabaseConfigured) return null
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      return raw ? (JSON.parse(raw) as User) : null
    } catch {
      return null
    }
  })

  // Restore/refresh the Supabase session and react to sign-in/out events.
  useEffect(() => {
    if (!supabase) return
    supabase.auth
      .getSession()
      .then(({ data }) => setUser(data.session?.user ? mapSupabaseUser(data.session.user) : null))
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ? mapSupabaseUser(session.user) : null)
    })
    return () => sub.subscription.unsubscribe()
  }, [])

  // Demo mode only: persist the fake session.
  useEffect(() => {
    if (isSupabaseConfigured) return
    if (user) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(user))
    } else {
      localStorage.removeItem(STORAGE_KEY)
    }
  }, [user])

  const login = useCallback(
    async (email: string, password?: string, name?: string) => {
      if (supabase) {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password: password ?? '',
        })
        if (error) throw error
        return
      }

      // No keys configured → simulated login for the demo.
      await new Promise((resolve) => setTimeout(resolve, 500))
      setUser({
        id: 'usr_' + Math.random().toString(36).substring(2, 9),
        name: name || deriveName(email),
        email,
        avatar: avatarFor(email),
      })
    },
    [],
  )

  const register = useCallback(
    async (name: string, email: string, password?: string) => {
      if (supabase) {
        const { data, error } = await supabase.auth.signUp({
          email,
          password: password ?? '',
          options: { data: { name } },
        })
        if (error) throw error
        // If email confirmation is disabled Supabase returns a session immediately.
        if (data.user && data.session) setUser(mapSupabaseUser(data.user))
        return
      }

      await new Promise((resolve) => setTimeout(resolve, 500))
      setUser({
        id: 'usr_' + Math.random().toString(36).substring(2, 9),
        name,
        email,
        avatar: avatarFor(email),
      })
    },
    [],
  )

  const logout = useCallback(() => {
    if (supabase) {
      void supabase.auth.signOut()
      return
    }
    setUser(null)
  }, [])

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return ctx
}
