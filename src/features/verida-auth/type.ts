export type VeridaAuthRequest = {
  appDid: string
  scopes: string[]
  redirectUrl: string
  state?: Record<string, unknown>
}
