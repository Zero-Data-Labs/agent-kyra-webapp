import {
  type ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react"

import { AUTH_TOKEN_LOCAL_STORAGE_KEY } from "@/features/verida-auth/constants"
import { VeridaAuthContext } from "@/features/verida-auth/contexts/verida-auth-context"
import type { VeridaAuthStatus } from "@/features/verida-auth/type"

export interface VeridaAuthProviderProps {
  children: ReactNode
}

// TODO: Need to handle auth error when calling Verida's API (e.g. invalid token)

export function VeridaAuthProvider(props: VeridaAuthProviderProps) {
  const { children } = props

  const [token, setTokenInternal] = useState<string | null>(null)
  const [status, setStatus] = useState<VeridaAuthStatus>("loading")

  useEffect(() => {
    // Load token from localStorage on mount
    const storedToken = localStorage.getItem(AUTH_TOKEN_LOCAL_STORAGE_KEY)
    setTokenInternal(storedToken)
    setStatus(storedToken ? "authenticated" : "unauthenticated")
  }, [])

  const setToken = useCallback((newToken: string | null) => {
    if (newToken) {
      localStorage.setItem(AUTH_TOKEN_LOCAL_STORAGE_KEY, newToken)
      setTokenInternal(newToken)
      setStatus("authenticated")
    } else {
      localStorage.removeItem(AUTH_TOKEN_LOCAL_STORAGE_KEY)
      setTokenInternal(null)
      setStatus("unauthenticated")
    }
  }, [])

  const disconnect = useCallback(() => {
    setToken(null)
  }, [setToken])

  const contextValue = useMemo(
    () => ({
      token,
      status,
      setToken,
      disconnect,
    }),
    [token, status, setToken, disconnect]
  )

  return <VeridaAuthContext value={contextValue}>{children}</VeridaAuthContext>
}
VeridaAuthProvider.displayName = "VeridaAuthProvider"
