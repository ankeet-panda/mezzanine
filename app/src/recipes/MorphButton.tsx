import { type ButtonHTMLAttributes, type ReactNode, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { EASE_EXIT, EASE_OUT, cx, useReducedMotion } from './motion'

type MorphButtonProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> & {
  /** What the button says now. Change `stateKey` when it should morph to new content. */
  children: ReactNode
  /** Changes when the label changes meaning (idle → saving → saved). Same key: content updates in place. */
  stateKey: string
  variant?: 'primary' | 'secondary' | 'danger'
  size?: 'compact' | 'regular'
  /** The edge that stays put while the width changes: the side the button is aligned to. */
  anchor?: 'start' | 'end' | 'center'
  /** Text for screen readers when the state changes, e.g. "Saved". The live region is always mounted. */
  announce?: string
}

/**
 * A button whose width follows its label without animating width (width animation is avoided on purpose).
 * The box takes its new size at once; only a background layer scales from the old
 * width with a transform, while the old label fades out and the new one rises in.
 * State swaps on a timer, never on an animation event. The parent may re-render as
 * often as it likes: only a new `stateKey` starts a morph.
 */
export function MorphButton({
  children,
  stateKey,
  variant = 'primary',
  size = 'regular',
  anchor = 'end',
  announce,
  className,
  type = 'button',
  ...rest
}: MorphButtonProps) {
  const reduced = useReducedMotion()
  const button = useRef<HTMLButtonElement>(null)
  const bg = useRef<HTMLSpanElement>(null)
  const label = useRef<HTMLSpanElement>(null)
  const fromWidth = useRef<number | null>(null)
  const morphTimer = useRef(0)
  const [shownKey, setShownKey] = useState(stateKey)
  // What is on screen: the latest children for the shown key, or the last content while fading out
  const onScreen = useRef<ReactNode>(children)
  const content = stateKey === shownKey ? children : onScreen.current
  onScreen.current = content

  useEffect(() => () => window.clearTimeout(morphTimer.current), [])

  useEffect(() => {
    const el = label.current
    if (stateKey === shownKey) {
      // Back where we started (or never left): drop any half-done fade-out
      el?.getAnimations().forEach((a) => a.cancel())
      fromWidth.current = null
      return
    }
    if (reduced || !button.current) {
      setShownKey(stateKey)
      return
    }
    if (fromWidth.current === null) fromWidth.current = button.current.getBoundingClientRect().width
    el?.animate([{ opacity: 1, transform: 'none' }, { opacity: 0, transform: 'translateY(-3px)' }], {
      duration: 100,
      easing: EASE_EXIT,
      fill: 'forwards',
    })
    const timer = window.setTimeout(() => setShownKey(stateKey), 100)
    return () => window.clearTimeout(timer)
  }, [stateKey, shownKey, reduced])

  useLayoutEffect(() => {
    const from = fromWidth.current
    fromWidth.current = null
    label.current?.getAnimations().forEach((a) => a.cancel())
    if (from === null || !button.current || !bg.current || !label.current) return
    const to = button.current.getBoundingClientRect().width
    if (to > 0 && Math.abs(to - from) > 0.5) {
      const el = button.current
      // The layer stands in for the button's own face only while it scales; a timer, not
      // the animation's end, hands the face back.
      el.classList.add('is-morphing')
      window.clearTimeout(morphTimer.current)
      morphTimer.current = window.setTimeout(() => {
        // Hand the face back in one frame. With the normal background transition the button's
        // own face would fade in from transparent after the layer had already gone: a flicker.
        el.classList.add('is-handoff')
        el.classList.remove('is-morphing')
        void el.offsetWidth
        el.classList.remove('is-handoff')
      }, 240)
      bg.current.animate([{ transform: `scaleX(${from / to})` }, { transform: 'none' }], {
        duration: 220,
        easing: EASE_OUT,
      })
    }
    // No gap between the old label leaving and the new one arriving
    label.current.animate([{ opacity: 0, transform: 'translateY(3px)' }, { opacity: 1, transform: 'none' }], {
      duration: 180,
      easing: EASE_OUT,
    })
  }, [shownKey])

  return (
    <>
      <button
        ref={button}
        type={type}
        className={cx('ix-btn', `ix-btn--${variant}`, `ix-btn--${size}`, `ix-btn--anchor-${anchor}`, className)}
        {...rest}
      >
        <span ref={bg} className="ix-btn__bg" aria-hidden="true" />
        <span ref={label} className="ix-btn__label">
          {content}
        </span>
      </button>
      <span className="ix-sr" role="status">
        {announce ?? ''}
      </span>
    </>
  )
}
