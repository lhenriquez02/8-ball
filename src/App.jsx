import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

const IMAGES = [
  '/images/option_1.png'
]

export default function App() {

  const [text, setText] = useState('')
  const [currentIdx, setCurrentIdx] = useState(0)
  const [nextIdx, setNextIdx] = useState(0)
  const [shaking, setShaking] = useState(false)
  const [showAlt, setShowAlt] = useState(false)

  const pickRandom = () => Math.floor(Math.random()*IMAGES.length)

  const handleSubmit = (e) => {
    e.preventDefault()
    const r =pickRandom(currentIdx)
    setShaking(true)
    setTimeout(() => setShaking(false), 2000)
    setText('')
  }

  const handleShakeEnd = () => {
    setShaking(false)
    setShowAlt(true)
  }

  const handleFadeEnd = () => {
    if (!showAlt) return 
    setCurrentIdx(nextIdx)
    setShowAlt(false)
  }

  return (
    <div className="flex flex-col items-center -translate-y-30">
      {/* current image*/}
      <img
        src="/images/normal_8_ball.png"
        alt="Logo"
        className={
          `w-200 h-200 object-contain ${shaking ? 'animate-shake': ''}`
        }
      />
      <form onSubmit={handleSubmit} className="flex items-center space-x-3 -mt-30 mb-50">

        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Enter Question Here"
          className="w-80 px-4 py-2 rounded-lg border border-gray-300
             bg-white text-gray-900 placeholder-gray-400 caret-black
             focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button type="submit">Shake</button>
      </form>
    </div>
  )
}



