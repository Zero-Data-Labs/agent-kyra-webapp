import {
  type ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react"

import { AUTH_TOKEN_LOCAL_STORAGE_KEY } from "@/features/verida-auth/constants"
import { VeridaAuthContext } from "@/features/verida-auth/contexts/verida-auth-context"
import { useGetVeridaAuthTokenDetails } from "@/features/verida-auth/hooks/use-get-verida-auth-token-details"
import type {
  VeridaAuthContextValue,
  VeridaAuthStatus,
} from "@/features/verida-auth/type"

export interface VeridaAuthProviderProps {
  children: ReactNode
}

export function VeridaAuthProvider(props: VeridaAuthProviderProps) {
  const { children } = props

  const [token, setTokenInternal] = useState<string | null>(null)

  const { authTokenDetails: authDetails, isLoading: isLoadingAuthDetails } =
    useGetVeridaAuthTokenDetails(token)

  useEffect(() => {
    // Load token from localStorage on mount
    const storedToken = localStorage.getItem(AUTH_TOKEN_LOCAL_STORAGE_KEY)
    setTokenInternal(storedToken)
  }, [])

  const setToken = useCallback((newToken: string) => {
    localStorage.setItem(AUTH_TOKEN_LOCAL_STORAGE_KEY, newToken)
    setTokenInternal(newToken)
  }, [])

  const disconnect = useCallback(() => {
    localStorage.removeItem(AUTH_TOKEN_LOCAL_STORAGE_KEY)
    setTokenInternal(null)
  }, [])

  const status: VeridaAuthStatus = useMemo(() => {
    if (token && authDetails && token === authDetails.token) {
      return "authenticated"
    }

    if (isLoadingAuthDetails) {
      return "loading"
    }

    return "unauthenticated"
  }, [token, authDetails, isLoadingAuthDetails])

  const contextValue: VeridaAuthContextValue = useMemo(
    () => ({
      // TODO: Need to handle invalid tokens, the status should be invalid and the UI must show some details to the user
      authDetails: status === "authenticated" ? (authDetails ?? null) : null,
      status,
      setToken,
      disconnect,
    }),
    [authDetails, status, setToken, disconnect]
  )

  return <VeridaAuthContext value={contextValue}>{children}</VeridaAuthContext>
}
VeridaAuthProvider.displayName = "VeridaAuthProvider"
