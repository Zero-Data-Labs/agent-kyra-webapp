export function getRootPageRoute() {
  return `/`
}

export function getAuthPageRoute(basePath?: string) {
  return `${basePath ?? ""}/auth`
}

export function getConnectPageRoute() {
  return `/connect`
}

export function getDefaultRedirectPathAfterAuthentication() {
  return getAgentsPageRoute()
}

export function getAgentsPageRoute() {
  return "/agents"
}

export function getAgentPageRoute({
  agentId,
  fromDeletion,
}: {
  agentId: string
  fromDeletion?: boolean
}) {
  // TODO: Try to use nuqs
  return `/agents/${agentId}${fromDeletion ? "?fromDeletion=true" : ""}`
}
