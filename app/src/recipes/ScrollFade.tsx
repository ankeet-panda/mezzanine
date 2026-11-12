import { type HTMLAttributes, useEffect, useRef } from 'react'
import { cx } from './motion'

type ScrollFadeProps = HTMLAttributes<HTMLDivElement> & {
  /** Names the region for screen readers; it is focusable so keyboards can scroll it. */
  label: string
  /** CSS max-height of the scroll area, e.g. "248px" or "40vh". */
  maxHeight: string
  /** Fade length in px on a side that has more content. Recommended range 24–32. */
  fade?: number
  /** Scroll direction. 'x' fades the left and right edges (a wide plan or table in a narrow column). */
  axis?: 'x' | 'y'
}

/**
 * A scroll container that says there is more. Each side that has content beyond it
 * fades out over `fade` px; the fade leaves as that end is reached. Works where
 * scrollbars are hidden (macOS, iOS, Android). The mask sits on an inner scroller, so
 * the outer frame keeps a visible focus ring (a mask would clip an outline). The fades
 * follow content that grows later (images, fonts, edits), not only the box.
 */
export function ScrollFade({ label, maxHeight, fade = 28, axis = 'y', className, style, children, ...rest }: ScrollFadeProps) {
  const box = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = box.current
    if (!el) return
    const update = () => {
      const [pos, size, total] = axis === 'x' ? [el.scrollLeft, el.clientWidth, el.scrollWidth] : [el.scrollTop, el.clientHeight, el.scrollHeight]
      el.style.setProperty('--ix-ft', pos > 2 ? `${fade}px` : '0px')
      el.style.setProperty('--ix-fb', pos + size < total - 2 ? `${fade}px` : '0px')
    }
    update()
    el.addEventListener('scroll', update, { passive: true })
    const ro = new ResizeObserver(update)
    ro.observe(el)
    Array.from(el.children).forEach((c) => ro.observe(c))
    const mo = new MutationObserver(() => {
      Array.from(el.children).forEach((c) => ro.observe(c))
      update()
    })
    mo.observe(el, { childList: true, subtree: true, characterData: true })
    return () => {
      el.removeEventListener('scroll', update)
      ro.disconnect()
      mo.disconnect()
    }
  }, [fade, axis])

  return (
    <div className={cx('ix-fade', className)} style={style} {...rest}>
      <div ref={box} role="region" aria-label={label} tabIndex={0} className="ix-fade__scroll" data-axis={axis} style={{ maxHeight }}>
        {children}
      </div>
    </div>
  )
}
