export function getSecretsVariables(type: string) {
  const isMobile = type === 'mobile'
  const client_id = isMobile
    ? process.env.GITHUB_CLIENT_ID_MOBILE
    : process.env.GITHUB_CLIENT_ID

  const client_secret = isMobile
    ? process.env.GITHUB_CLIENT_SECRET_MOBILE
    : process.env.GITHUB_CLIENT_SECRET

  return {
    client_id,
    client_secret,
  }
}
