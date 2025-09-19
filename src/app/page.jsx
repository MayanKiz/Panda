"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "motion/react"
import Loader from "@/components/Loader"
import IntroScreen from "@/components/IntroScreen"
import MemoryGameScreen from "@/components/MemoryGameScreen"
import PhotoBookScreen from "@/components/PhotoBookScreen"
import FinalScreen from "@/components/FinalScreen"
import Music from "@/components/Music"

export default function Home() {
  const [currentScreen, setCurrentScreen] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [gameCompleted, setGameCompleted] = useState(false)
  const [musicStarted, setMusicStarted] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 3500)

    return () => clearTimeout(timer)
  }, [])

  const handleIntroComplete = () => {
    if (!musicStarted) {
      setMusicStarted(true)
    }
    setCurrentScreen(1)
  }

  const handleGameComplete = () => {
    setGameCompleted(true)
    setTimeout(() => {
      setCurrentScreen(2)
    }, 2000)
  }

  const nextScreen = () => {
    setCurrentScreen((prev) => prev + 1)
  }

  if (isLoading) {
    return <Loader />
  }

  const screens = [
    <IntroScreen key="intro" onNext={handleIntroComplete} />,
    <MemoryGameScreen key="game" onGameComplete={handleGameComplete} gameCompleted={gameCompleted} />,
    <PhotoBookScreen key="photos" onNext={nextScreen} />,
    <FinalScreen key="final" />,
  ]

  return (
    <div className="min-h-[100dvh] bg-gradient-to-br from-gray-900 via-black to-purple-950/70 overflow-hidden">

      {/* Background music */}
      <Music shouldPlay={musicStarted} />

      {/* Grid background */}
      <div className="fixed inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:50px_50px]" />

      <AnimatePresence mode="wait">
        <motion.div
          key={currentScreen}
          initial={{ opacity: 0, scale: 0.95, filter: "blur(10px)" }}
          animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
          exit={{ opacity: 0, scale: 1.05, filter: "blur(10px)" }}
          transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="min-h-screen"
        >
          {screens[currentScreen]}
        </motion.div>
      </AnimatePresence>

      {/* Watermark */}
      <motion.div
        initial={{ x: 100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{
          duration: 1,
          delay: 1,
        }}
        className="fixed bottom-4 right-4 text-[13px] text-white/50 pointer-events-none z-40 font-light">
        @m4y4nkydv
      </motion.div>
    </div>
  )
}
