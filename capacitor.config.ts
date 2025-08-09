import type { CapacitorConfig } from '@capacitor/cli'

const config: CapacitorConfig = {
  appId: 'com.otobusumanlik.app',
  appName: 'Otobüsüm Anlık',
  webDir: '.output/public',
  server: {
    url: 'http://192.168.1.52:3000/',
    cleartext: true,
  },
}

export default config
