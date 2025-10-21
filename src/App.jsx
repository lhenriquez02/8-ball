import { useEffect, useRef, useState } from 'react'
import './App.css'

const BASE   = '/images/normal_8_ball.png'
const OTHERS = [
  '/images/option_1.png',
  '/images/option_2.png',
  '/images/option_3.png',
  '/images/option_4.png',
  '/images/option_5.png',
  '/images/option_6.png',
  '/images/option_7.png',
  '/images/option_8.png',
  '/images/option_9.png',
  '/images/option_10.png',
  '/images/option_11.png',
  '/images/option_12.png',
  '/images/option_13.png',
  '/images/option_14.png',
  '/images/option_15.png',
  '/images/option_16.png',
  '/images/option_17.png'
]

export default function App() {
  const [text, setText] = useState('')

  const [showAlt, setShowAlt] = useState(false)   // false: show base; true: show alt
  const [altSrc, setAltSrc]   = useState(OTHERS[0])
  const [altReady, setAltReady] = useState(false) // wait for decode before showing
  const [shaking, setShaking] = useState(false)
  const [altKey, setAltKey] = useState(0)         // force fresh <img> to avoid stale frame

  // keep shake at 3 iterations, 600ms each (controlled via CSS vars on the <img>)
  const SHAKE_ITERS = 3
  const SHAKE_DUR   = '600ms'

  // holds the current preload promise
  const preloadRef = useRef(Promise.resolve())

  useEffect(() => {
    ;[BASE, ...OTHERS].forEach(s => { const i = new Image(); i.src = s })
  }, [])

  const pickRandom = () => OTHERS[Math.floor(Math.random() * OTHERS.length)]

  // Preload + decode helper
  const preload = (src) => new Promise((resolve) => {
    const img = new Image()
    img.src = src
    if (img.decode) {
      img.decode().then(resolve).catch(() => resolve())
    } else {
      img.onload = () => resolve()
      img.onerror = () => resolve()
    }
  })

  const startCycle = () => {
    // base must be visible while shaking
    setShowAlt(false)

    // pick next and start preloading it now
    const next = pickRandom()
    setAltSrc(next)
    setAltReady(false)
    setAltKey(k => k + 1)              // ensure new node (prevents stale bitmap)
    preloadRef.current = preload(next)

    // retrigger CSS animation cleanly
    setShaking(false)
    requestAnimationFrame(() => setShaking(true))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!showAlt) {
      startCycle()            // on base → shake, then (after decode) fade to alt
    } else {
      setShowAlt(false)       // on alt → fade back to base
    }
    setText('')
  }

  const handleTyping = (val) => {
    setText(val)
    if (showAlt) setShowAlt(false) // typing returns to base (no auto-restart)
  }

  // fires AFTER all iterations finish; only fade once next image is decoded
  const onBaseAnimationEnd = () => {
    setShaking(false)
    preloadRef.current.then(() => {
      setAltReady(true)
      setShowAlt(true)        // cross-fade in; no flash
    })
  }

  return (
    <div className="min-h-[100svh] w-full flex flex-col items-center bg-white pt-8 -mt-[50px]">
      <div className="relative w-[700px] h-[700px] -mt-20">
        {/* BASE image (the one that shakes) */}
        <img
          src={BASE}
          alt="base"
          onAnimationEnd={onBaseAnimationEnd}
          // pass iteration count + duration via CSS vars
          style={shaking ? { ['--iters']: SHAKE_ITERS, ['--dur']: SHAKE_DUR } : undefined}
          className={[
            "absolute inset-0 w-full h-full object-contain",
            "transition-opacity duration-700 [will-change:opacity,transform]",
            showAlt ? "opacity-0" : "opacity-100",
            shaking ? "shake" : ""
          ].join(' ')}
        />

        {/* ALT image (only fades in after decode completes) */}
        <img
          key={altKey}
          src={altSrc}
          alt="alt"
          className={[
            "absolute inset-0 w-full h-full object-contain",
            "transition-opacity duration-700 [will-change:opacity,transform]",
            altReady && showAlt ? "opacity-100" : "opacity-0"
          ].join(' ')}
        />
      </div>

      <form onSubmit={handleSubmit} className="flex items-center space-x-3 -mt-4">
        <input
          type="text"
          value={text}
          onChange={(e) => handleTyping(e.target.value)}
          placeholder="Enter Question Here"
          className="w-80 px-4 py-2 rounded-lg border border-gray-300
                     bg-white text-gray-900 placeholder-gray-400 caret-black
                     focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          className="px-6 py-2 rounded-lg !bg-black hover:!bg-gray-800 !text-white font-semibold shadow transition-colors"
        >
          Shake
        </button>
      </form>
    </div>
  )
}
