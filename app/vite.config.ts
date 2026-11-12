import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'node:path'
import { fullMotion } from './full-motion.vite'

// The demo kit components are vendored in src/kit.
const KIT = path.resolve(__dirname, 'src/kit')

export default defineConfig({
  plugins: [react(), fullMotion(KIT)],
  resolve: {
    alias: [
      { find: '@kit', replacement: KIT },
      { find: '@', replacement: path.resolve(__dirname, './src') },
    ],
    dedupe: ['react', 'react-dom', 'lucide-react'],
  },
  server: { fs: { allow: [__dirname, KIT] } },
  build: {
    rollupOptions: {
      input: {
        app: path.resolve(__dirname, 'index.html'),
        demo: path.resolve(__dirname, 'demo.html'),
      },
    },
  },
})
