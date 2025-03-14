"use client"

import { useRouter } from "next/navigation"
import { useEffect } from "react"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { ConnectButton } from "@/features/auth/components/connect-button"
import { getRootPageRoute } from "@/features/routes/utils"
import { VERIDA_AUTH_ERROR_MESSAGES } from "@/features/verida-auth/constants"
import { useVeridaAuth } from "@/features/verida-auth/hooks/use-verida-auth"
import { useVeridaAuthResponse } from "@/features/verida-auth/hooks/use-verida-auth-response"

export default function AuthPage() {
  const router = useRouter()
  const { setToken } = useVeridaAuth()
  const authResponse = useVeridaAuthResponse()

  useEffect(() => {
    if (authResponse.status === "success") {
      setToken(authResponse.token)
      // TODO: get the redirectPath from the state
      router.replace(getRootPageRoute())
    }
  }, [authResponse, router, setToken])

  if (authResponse.status === "error") {
    const errorInfo = VERIDA_AUTH_ERROR_MESSAGES[authResponse.error]

    return (
      <div className="mx-auto max-w-2xl p-6">
        <Alert variant="error" className="mb-6">
          <AlertTitle>{errorInfo.title}</AlertTitle>
          <AlertDescription>
            {authResponse.errorDescription || errorInfo.description}
          </AlertDescription>
        </Alert>
        <ConnectButton />
      </div>
    )
  }

  // TODO: Display something while processing the response or if there is no response at all
  return null
}
AuthPage.displayName = "AuthPage"
