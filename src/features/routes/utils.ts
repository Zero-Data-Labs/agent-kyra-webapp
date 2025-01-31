export function getRootPageRoute() {
  return `/`
}

export function getAuthPageRoute(basePath?: string) {
  return `${basePath ?? ""}/auth`
}

export function getDefaultRedirectPathAfterAuthentication() {
  return getAgentsPageRoute()
}

export function getAgentsPageRoute() {
  return "/agents"
}
