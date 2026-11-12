import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'node:path'
import { fullMotion } from './full-motion.vite'

// One self-contained page for sharing: a single JS chunk, one stylesheet, fonts inlined as data URIs.
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
  build: {
    outDir: 'dist-showcase',
    emptyOutDir: true,
    cssCodeSplit: false,
    assetsInlineLimit: 100_000_000,
    modulePreload: false,
    rollupOptions: {
      input: { showcase: path.resolve(__dirname, 'showcase.html') },
      output: { inlineDynamicImports: true },
    },
  },
})
