/**
 * Service layer configuration.
 * All values are read from environment variables and support Vite's import.meta.env.
 */

export interface BackendConfig {
  baseUrl: string
  anonKey: string
}

export function getBackendConfig(): BackendConfig {
  const baseUrl = import.meta.env.VITE_INSFORGE_URL ?? import.meta.env.NEXT_PUBLIC_INSFORGE_URL ?? ''
  const anonKey = import.meta.env.VITE_INSFORGE_ANON_KEY ?? import.meta.env.NEXT_PUBLIC_INSFORGE_ANON_KEY ?? ''

  return {
    baseUrl,
    anonKey,
  }
}

export function isBackendConfigured(): boolean {
  const { baseUrl, anonKey } = getBackendConfig()
  return Boolean(baseUrl && anonKey)
}
