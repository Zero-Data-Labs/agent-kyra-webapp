export function getRootPageRoute() {
  return `/`
}

export function getDefaultRedirectPathAfterConnection() {
  return getRootPageRoute()
}

export function getAuthPageRoute(basePath?: string) {
  return `${basePath ?? ""}/auth`
}
