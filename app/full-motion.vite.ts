import { normalizePath, type Plugin } from 'vite'

// The demo always plays in full (see src/demo/full-motion.ts): neutralise the kit's reduced-motion CSS rules.
// Only the demo imports kit CSS, so the clickable app's own reduced-motion rules are untouched.
export function fullMotion(kit: string): Plugin {
  const root = normalizePath(kit)
  return {
    name: 'demo-full-motion',
    enforce: 'pre',
    transform(code, id) {
      const file = id.split('?')[0]
      if (!file.endsWith('.css') || !normalizePath(file).startsWith(root)) return
      return code.replace(/prefers-reduced-motion:\s*reduce/g, 'prefers-reduced-motion: reduce) and (max-width: 0px')
    },
  }
}
