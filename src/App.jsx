import { useEffect, useRef, useState } from 'react'
import './App.css'

const BASE   = '/images/normal_8_ball.png'
const OTHERS = ['/images/option_1.png']  // add more as needed

export default function App() {
  const [text, setText] = useState('')

  const [showAlt, setShowAlt] = useState(false)   // false: show base; true: show alt
  const [altSrc, setAltSrc]   = useState(OTHERS[0])
  const [shaking, setShaking] = useState(false)

  // how many times to shake + how long each cycle lasts
  const SHAKE_ITERS = 3          // 👈 change this
  const SHAKE_DUR   = '600ms'    // 👈 change this

  useEffect(() => {
    ;[BASE, ...OTHERS].forEach(s => { const i = new Image(); i.src = s })
  }, [])

  const pickRandom = () => OTHERS[Math.floor(Math.random() * OTHERS.length)]

  const startCycle = () => {
    setShowAlt(false)         // ensure base is visible
    setAltSrc(pickRandom())   // choose next image (can be same)
    // retrigger the CSS animation: turn it off, then on next frame turn it on
    setShaking(false)
    requestAnimationFrame(() => setShaking(true))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!showAlt) {
      startCycle()            // on base → shake, then fade to alt
    } else {
      setShowAlt(false)       // on alt → fade back to base
      // after base is fully visible, next submit will startCycle again
    }
    setText('')
  }

  const handleTyping = (val) => {
    setText(val)
    if (showAlt) setShowAlt(false) // typing returns to base (no auto-restart)
  }

  // fires AFTER all iterations finish
  const onBaseAnimationEnd = () => {
    setShaking(false)
    setShowAlt(true)          // now cross-fade to the alt image
  }

  return (
    <div className="min-h-[100svh] w-full flex flex-col items-center bg-white pt-8">
      <div className="relative w-[800px] h-[800px]">
        {/* BASE image (the one that shakes) */}
        <img
          src={BASE}
          alt="base"
          onAnimationEnd={onBaseAnimationEnd}
          // pass iteration count + duration via CSS vars
          style={shaking ? { '--iters': SHAKE_ITERS, '--dur': SHAKE_DUR } : undefined}
          className={[
            "absolute inset-0 w-full h-full object-contain",
            "transition-opacity duration-700",
            showAlt ? "opacity-0" : "opacity-100",
            shaking ? "shake" : ""
          ].join(' ')}
        />

        {/* ALT image (fades in/out) */}
        <img
          src={altSrc}
          alt="alt"
          className={[
            "absolute inset-0 w-full h-full object-contain",
            "transition-opacity duration-700",
            showAlt ? "opacity-100" : "opacity-0"
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
