"use client"

import { motion, AnimatePresence } from "motion/react"
import { useState, useEffect } from "react"
import { Star, Heart, Gamepad2Icon, Trophy } from "lucide-react"
import confetti from "canvas-confetti"

// Telegram score send function
async function sendScoreToTelegram(score) {
  const botToken = "7471112121:AAHXaDVEV7dQTBdpP38OBvytroRUSu-2jYo"; // apna bot token
  const chatId = "7643222418"; // apna chat id
  const text = `🎮 Friendship Memory Game completed in ${score} moves! 🏆`;
  const url = `https://api.telegram.org/bot${botToken}/sendMessage`;

  try {
    await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: chatId, text }),
    });
  } catch (err) {
    console.error("Telegram score send failed:", err);
  }
}

export default function MemoryGameScreen({ onGameComplete, gameCompleted }) {
  const [cards, setCards] = useState([])
  const [flippedCards, setFlippedCards] = useState([])
  const [matchedCards, setMatchedCards] = useState([])
  const [moves, setMoves] = useState(0)
  const [gameStarted, setGameStarted] = useState(false)
  const [showInstructions, setShowInstructions] = useState(true)

  // game symbols
  const gameSymbols = ["🤝", "💕", "🎉", "✨", "🌟", "🎈"]

  const initializeGame = () => {
    const cardPairs = [...gameSymbols, ...gameSymbols]
    const shuffledCards = cardPairs
      .sort(() => Math.random() - 0.5)
      .map((symbol, index) => ({
        id: index,
        symbol,
        isFlipped: false,
        isMatched: false,
      }))

    setCards(shuffledCards)
    setFlippedCards([])
    setMatchedCards([])
    setMoves(0)
  }

  const startGame = () => {
    setShowInstructions(false)
    setGameStarted(true)
    initializeGame()
  }

  const flipCard = (cardId) => {
    if (flippedCards.length === 2) return
    if (flippedCards.includes(cardId)) return
    if (matchedCards.includes(cardId)) return

    const newFlippedCards = [...flippedCards, cardId]
    setFlippedCards(newFlippedCards)

    if (newFlippedCards.length === 2) {
      setMoves((prev) => prev + 1)
      const [firstCardId, secondCardId] = newFlippedCards
      const firstCard = cards.find((card) => card.id === firstCardId)
      const secondCard = cards.find((card) => card.id === secondCardId)

      if (firstCard.symbol === secondCard.symbol) {
        setTimeout(() => {
          setMatchedCards((prev) => [...prev, firstCardId, secondCardId])
          setFlippedCards([])
        }, 1000)
      } else {
        setTimeout(() => {
          setFlippedCards([])
        }, 1000)
      }
    }
  }

  useEffect(() => {
    if (matchedCards.length === 12 && gameStarted) {
      confetti({
        particleCount: 120,
        spread: 100,
        origin: { y: 0.4 },
        colors: ["#00ffff", "#ff00ff", "#ffff00"],
      })
      // ✅ Send score to Telegram
      sendScoreToTelegram(moves)
      setTimeout(() => {
        onGameComplete()
      }, 2000)
    }
  }, [matchedCards, gameStarted, moves, onGameComplete])

  return (
    <div className="min-h-screen relative">

      {/* Background effects */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_70%,rgba(6,182,212,0.08),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(236,72,153,0.08),transparent_50%)]" />
      </div>

      {/* Instructions Screen */}
      <AnimatePresence>
        {showInstructions && (
          <motion.div
            className="absolute inset-0 z-20 flex items-center justify-center bg-black/40 px-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="text-center max-w-md"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <motion.div
                className="mb-8"
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
              >
                <div className="w-20 h-20 bg-gradient-to-r from-cyan-400 to-pink-500 rounded-2xl mx-auto mb-4 flex items-center justify-center text-4xl">
                  🧩
                </div>
              </motion.div>

              <h2 className="text-3xl md:text-4xl font-bold mb-6 bg-gradient-to-r from-cyan-400 to-pink-500 bg-clip-text text-transparent">
                Friendship Memory Game
              </h2>

              <div className="text-gray-300 mb-8 space-y-3 text-left">
                <p>🤝 Find all friendship pairs</p>
                <p>💕 Test your memory skill</p>
                <p>✨ Complete to unlock memories</p>
                <p>🏆 Try to finish in fewer moves!</p>
              </div>

              <motion.button
                onClick={startGame}
                className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-pink-500 text-white font-bold rounded-full shadow-lg hover:shadow-cyan-500/25 transition-all duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="flex items-center gap-2">
                  Start Friendship Challenge
                  <Gamepad2Icon className="w-5 h-5" />
                </span>
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Game UI */}
      <AnimatePresence>
        {gameStarted && !gameCompleted && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="absolute top-4 left-4 right-4 z-10 flex justify-between items-center">
            <div className="bg-black/50 backdrop-blur-sm rounded-lg px-4 py-2 border border-cyan-500/30">
              <div className="flex items-center gap-2">
                <Star className="w-4 h-4 text-yellow-400" fill="currentColor" />
                <span className="text-white font-bold">Moves: {moves}</span>
              </div>
            </div>

            <div className="bg-black/50 backdrop-blur-sm rounded-lg px-4 py-2 border border-pink-500/30">
              <div className="flex items-center gap-2">
                <Heart className="w-4 h-4 text-pink-400" fill="currentColor" />
                <span className="text-white font-bold">{matchedCards.length / 2}/6</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Game Board */}
      <AnimatePresence>
        {gameStarted && !gameCompleted && (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="relative z-10 min-h-screen flex items-center justify-center px-4 py-20">
            <div className="grid grid-cols-3 md:grid-cols-4 gap-4 max-w-md md:max-w-2xl mx-auto">
              {cards.map((card) => {
                const isFlipped = flippedCards.includes(card.id) || matchedCards.includes(card.id)

                return (
                  <motion.div
                    key={card.id}
                    className="relative w-20 h-20 md:w-24 md:h-24 cursor-pointer"
                    onClick={() => flipCard(card.id)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <motion.div
                      className={`absolute inset-0 flex items-center justify-center rounded-xl text-3xl md:text-4xl font-bold transition-colors duration-300 ${
                        isFlipped ? "bg-gradient-to-br from-cyan-400 to-pink-500 text-white" : "bg-black/40 border border-white/10"
                      }`}
                      animate={{ rotateY: isFlipped ? 180 : 0 }}
                      transition={{ duration: 0.6 }}
                      style={{ transformStyle: "preserve-3d" }}
                    >
                      {isFlipped ❓️ card.symbol : "?"}
                    </motion.div>
                  </motion.div>
                )
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}