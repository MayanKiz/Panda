"use client"

import { motion } from "motion/react"
import { useState, useEffect } from "react"
import { Heart, Sparkles, Star } from "lucide-react"
import confetti from "canvas-confetti"

export default function FinalMessageScreen() {
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0)
  const [displayedText, setDisplayedText] = useState("")
  const [allMessagesShown, setAllMessagesShown] = useState(false)
  const [startTyping, setStartTyping] = useState(false)
  const [titleComplete, setTitleComplete] = useState(false)
  const [floatingElements, setFloatingElements] = useState([])

  const messages = [
    "Hey bestie! 💕",
    "You mean the world to me...",
    "Through every laugh, every tear, every crazy adventure...",
    "You've been my constant, my support, my partner in crime! 🎉",
    "Thank you for being the most amazing friend anyone could ask for! ✨",
    "Here's to many more years of friendship, fun, and unforgettable memories! 🥳",
    "Happy New Year, my dear friend! 💖",
  ]

  const titleWords = ["HAPPY", "New", "Year"]  const isMobile = typeof window !"undefined" && window.innerWidth < 768

  // Special entrance effect
  useEffect(() => {
    // Trigger confetti after title complete
    setTimeout(() => {
      confetti({
        particleCount: isMobile ? 80 : 100,
        spread: 70,
        origin: { y: 0.6 },
        gravity: isMobile ? 1.5 : 1.1,
        ticks: isMobile ? 180 : 250,
        scalar: isMobile ? 0.8 : 1,
        colors: ["#00ffff", "#ffff00", "#ff69b4"],
      })
    }, 3000)

    // Start typing after title animation completes
    const timer = setTimeout(() => {
      setTitleComplete(true)
      setTimeout(() => {
        setStartTyping(true)
      }, 1000)
    }, 4000)

    return () => clearTimeout(timer)
  }, [])

  // typing effect
  useEffect(() => {
    if (!startTyping) return
    if (currentMessageIndex >= messages.length) return

    const currentMessage = messages[currentMessageIndex]
    if (!currentMessage) return

    let charIndex = 0
    setDisplayedText("")

    const typeNextChar = () => {
      if (charIndex <= currentMessage.length) {
        setDisplayedText(currentMessage.substring(0, charIndex))
        charIndex++

        if (charIndex <= currentMessage.length) {
          setTimeout(typeNextChar, 40)
        } else {
          // Message complete, wait then move to next
          setTimeout(() => {
            if (currentMessageIndex < messages.length - 1) {
              setCurrentMessageIndex((prev) => prev + 1)
            } else {
              setAllMessagesShown(true)
            }
          }, 2000)
        }
      }
    }

    typeNextChar()
  }, [startTyping, currentMessageIndex])

  // FLoating particles
  useEffect(() => {
    const hearts = [...Array(4)].map((_, i) => (
      <motion.div
        key={`heart-${i}`}
        className="absolute"
        style={{
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
        }}
        animate={{
          y: [0, -40, 0],
          opacity: [0.2, 0.5, 0.2],
          scale: [0.8, 1.2, 0.8],
        }}
        transition={{
          duration: 6 + Math.random() * 2,
          repeat: Number.POSITIVE_INFINITY,
          delay: Math.random() * 4,
        }}
      >
        <Heart className="w-4 h-4 text-pink-400/40 fill-current" />
      </motion.div>
    ))

    const sparkles = [...Array(4)].map((_, i) => (
      <motion.div
        key={`sparkle-${i}`}
        className="absolute"
        style={{
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
        }}
        animate={{
          // y: [0, -30, 0],
          y: ["0%", "20%", "-20%", "0%"],
          x: ["0%", "15%", "-15%", "0%"],
          opacity: [0.2, 0.4, 0.2],
          rotate: [0, 180, 360],
        }}
        transition={{
          duration: 8 + Math.random() * 2,
          repeat: Number.POSITIVE_INFINITY,
          delay: Math.random() * 3,
        }}
      >
        <Sparkles className="w-3 h-3 text-purple-400/35" />
      </motion.div>
    ))

    const stars = [...Array(4)].map((_, i) => (
      <motion.div
        key={`star-${i}`}
        className="absolute"
        style={{
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
        }}
        animate={{
          // y: [0, -25, 0],
          y: ["0%", "10%", "-10%", "0%"],
          x: ["0%", "5%", "-5%", "0%"],
          opacity: [0.2, 0.4, 0.2],
          rotate: [0, 360],
          scale: [0.5, 1, 0.5],
        }}
        transition={{
          duration: 7 + Math.random() * 2,
          repeat: Number.POSITIVE_INFINITY,
          delay: Math.random() * 5,
        }}
      >
        <Star className="w-3 h-3 text-yellow-400/35 fill-current" />
      </motion.div>
    ))

    setFloatingElements([...hearts, ...sparkles, ...stars])
  }, [])

  const triggerCelebration = () => {
    confetti({
      particleCount: isMobile ? 120 : 200,
      spread: 120,
      origin: { y: 0.5 },
      gravity: isMobile ? 1.6 : 1.1,
      ticks: isMobile ? 180 : 250,
      scalar: isMobile ? 0.8 : 1,
      colors: ["#00ffff", "#ff00ff", "#ffff00", "#ff69b4"],
    })

    setTimeout(() => {
      confetti({
        particleCount: isMobile ? 100 : 150,
        spread: 100,
        origin: { x: 0.2, y: 0.6 },
        gravity: isMobile ? 1.6 : 1.1,
        ticks: isMobile ? 180 : 250,
        scalar: isMobile ? 0.8 : 1,
        colors: ["#00ffff", "#ff00ff"],
      })
    }, 300)

    setTimeout(() => {
      confetti({
        particleCount: isMobile ? 100 : 150,
        spread: 100,
        origin: { x: 0.8, y: 0.6 },
        gravity: isMobile ? 1.6 : 1.1,
        ticks: isMobile ? 180 : 250,
        scalar: isMobile ? 0.8 : 1,
        colors: ["#ffff00", "#ff69b4"],
      })
    }, 600)
  }

  return (
    <div className="min-h-screen relative">
      {/* smooth background effects */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(6,182,212,0.08),transparent_70%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(236,72,153,0.08),transparent_70%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(168,85,247,0.04),transparent_70%)]" />
      </div>

      {/* Simple smooth floating particles */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="absolute inset-0 overflow-hidden pointer-events-none"
      >
        {floatingElements}
      </motion.div>

      <div className="relative z-10 min-h-screen flex items-center justify-center px-4 py-6">
        <div className="text-center max-w-3xl w-full mx-auto">
          {/* title animation */}
          <motion.div
            layout
            className="mb-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <motion.h1
              className="text-4xl md:text-6xl font-bold leading-tight text-balance text-center"
              animate={{
                textShadow: [
                  "0 0 20px rgba(6, 182, 212, 0.5)",
                  "0 0 40px rgba(236, 72, 153, 0.5)",
                  "0 0 20px rgba(6, 182, 212, 0.5)",
                ],
              }}
              transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY }}
            >
              <div className="inline-block bg-gradient-to-r from-cyan-400 via-pink-500 to-purple-500 bg-clip-text text-transparent">
                {titleWords.map((word, wordIndex) => (
                  <span key={wordIndex} className="inline-block mr-2">
                    {word.split("").map((letter, letterIndex) => {
                      const delay =
                        titleWords.slice(0, wordIndex).reduce((acc, w) => acc + w.length, 0) * 0.12 + letterIndex * 0.12
                      return (
                        <motion.span
                          key={letterIndex}
                          className="inline-block"
                          initial={{ opacity: 0, y: -50, scale: 0 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          transition={{
                            delay,
                            duration: 0.8,
                            ease: "backOut",
                          }}
                        >
                          {letter}
                        </motion.span>
                      )
                    })}
                  </span>
                ))}
              </div>
            </motion.h1>
          </motion.div>

          {/* Message container - appears after title */}
          {titleComplete && (
            <motion.div
              layout
              className="bg-black/60 backdrop-blur-xl rounded-3xl p-6 md:p-12 border border-cyan-500/30 shadow-2xl mb-12"
              initial={{ opacity: 0, scale: 0.8, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 1, ease: "backOut" }}
            >
              {!allMessagesShown ? (
                // typing effect display
                <div className="min-h-[120px] flex items-center justify-center">
                  <div className="text-xl md:text-2xl text-white leading-relaxed font-medium text-center">
                    {displayedText}
                    {!allMessagesShown && (
                      <motion.span
                        animate={{ opacity: [0, 1, 0] }}
                        transition={{ duration: 0.8, repeat: Infinity }}
                        className="inline-block w-0.5 h-5 bg-cyan-400" />
                    )}
                  </div>
                </div>
              ) : (
                // All messages display
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 1 }}
                >
                  <div className="space-y-3">
                    {messages.map((message, index) => (
                      <motion.p
                        key={index}
                        className="text-base md:text-lg text-gray-300 leading-relaxed"
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.15, duration: 0.6 }}
                      >
                        {message}
                      </motion.p>
                    ))}
                  </div>

                  <motion.div
                    className="flex justify-center items-center gap-4 mt-6 text-2xl font-bold"
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 1.5, duration: 0.8 }}
                  >
                    <Heart className="w-8 h-8 text-pink-500" fill="currentColor" />
                    <span className="bg-gradient-to-r from-cyan-400 to-pink-500 bg-clip-text text-transparent">
                      You're the Best!
                    </span>
                    <Heart className="w-8 h-8 text-pink-500" fill="currentColor" />
                  </motion.div>
                </motion.div>
              )}
            </motion.div>
          )}

          {/* Celebration button */}
          {allMessagesShown && (
            <motion.button
              onClick={triggerCelebration}
              className="group px-10 py-4 bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 text-white text-lg font-bold rounded-full shadow-2xl hover:shadow-cyan-500/25 transition-all duration-300 border-2 border-white/80 hover:border-cyan-400/50 "
              initial={{ opacity: 0, y: 50, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: 2, duration: 0.8, ease: "backOut" }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="flex items-center gap-2">
                Celebrate Our Friendship!
                <Sparkles className="w-5 h-5" />
              </span>
            </motion.button>
          )}
        </div>
      </div>
    </div>
  )
}
