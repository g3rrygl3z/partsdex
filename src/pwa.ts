/// <reference types="vite-plugin-pwa/client" />

import { registerSW } from 'virtual:pwa-register'

export function registerPWA() {
  if (typeof window !== 'undefined') {
    registerSW({
      onNeedRefresh() {
        if (confirm('New content available. Reload?')) {
          location.reload()
        }
      },
      onOfflineReady() {
        console.log('App ready to work offline')
      },
    })
  }
}
