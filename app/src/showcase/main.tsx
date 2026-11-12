import { StrictMode, useEffect, useState } from 'react'
import { createRoot } from 'react-dom/client'
import '../styles/tokens.css'
import '../recipes/recipes.css'
import '../styles/app.css'
import '../demo/demo.css'
import './showcase.css'
import { App } from '../App'
import { DemoPage } from '../demo/DemoPage'
import { Concept } from './Concept'

type View = 'concept' | 'app' | 'demo'
const fromHash = (): View => (location.hash === '#app' ? 'app' : location.hash === '#demo' ? 'demo' : 'concept')
const LINKS: [View, string][] = [['concept', 'Concept'], ['app', 'Clickable app'], ['demo', 'Product demo']]

/** One page for sharing: the concept, the clickable screen and the self-playing demo, switched by the hash. */
function Showcase() {
  const [view, setView] = useState<View>(fromHash)
  useEffect(() => {
    const on = () => { setView(fromHash()); scrollTo(0, 0) }
    addEventListener('hashchange', on)
    return () => removeEventListener('hashchange', on)
  }, [])
  return (
    <div className="showcase-host">
      <nav className="showcase" aria-label="Mezzanine concept">
        <span className="showcase__name">Mezzanine, a product concept</span>
        <span className="showcase__views">
          {LINKS.map(([id, label]) => (
            <a key={id} href={`#${id}`} aria-current={view === id ? 'page' : undefined}>{label}</a>
          ))}
        </span>
      </nav>
      {view === 'concept' ? <Concept /> : view === 'app' ? <App /> : <DemoPage appHref="#app" />}
    </div>
  )
}

createRoot(document.getElementById('root')!).render(<StrictMode><Showcase /></StrictMode>)
