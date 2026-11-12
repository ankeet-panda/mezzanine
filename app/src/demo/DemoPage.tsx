import { useEffect, useState } from 'react'
import './full-motion'
import { DeskDemo } from './DeskDemo'

/** A landing-hero setting for the demo: copy as page HTML above one stage. */
export function DemoPage({ appHref = './' }: { appHref?: string }) {
  // Mount once Archivo is in, so no text reflows under the first beat
  const [fonts, setFonts] = useState(false)
  useEffect(() => { document.fonts.ready.then(() => setFonts(true)) }, [])
  return (
    <main className="hero">
      <div className="hero__top">
        <span className="brand"><span className="brand__tile" aria-hidden="true">M</span><span className="brand__name">Mezzanine</span></span>
      </div>
      <div className="hero__copy">
        <h1 className="hero__title">Come in on the days your team does</h1>
        <div className="hero__side">
          <p className="hero__lede">
            Mezzanine shows who on your team is in each day, then finds the free desk beside them. Two clicks, and
            your team can see you’re in.
          </p>
          <a className="hero__action" href={appHref}>Plan next week</a>
        </div>
      </div>
      {fonts ? <DeskDemo /> : <div className="dd-figure dd-figure--pending" aria-hidden="true" />}
    </main>
  )
}
