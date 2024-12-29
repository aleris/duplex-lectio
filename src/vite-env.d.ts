/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SITE_PREFIX: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
