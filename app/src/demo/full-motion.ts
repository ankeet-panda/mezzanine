// Under reduced motion the demo shows its still; once the person presses Play, it plays in full
// (a demo the person chose to play keeps its motion). The kit reads the preference through matchMedia,
// so while html[data-motion='full'] is set that one query answers "no". The clickable app is unaffected.
const REDUCE = /prefers-reduced-motion:\s*reduce/
const native = window.matchMedia.bind(window)

window.matchMedia = (query: string) => {
  if (!REDUCE.test(query) || document.documentElement.dataset.motion !== 'full') return native(query)
  const noop = () => {}
  return {
    matches: false, media: query, onchange: null,
    addEventListener: noop, removeEventListener: noop, addListener: noop, removeListener: noop,
    dispatchEvent: () => false,
  } as MediaQueryList
}
