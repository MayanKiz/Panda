"use client"

import { motion } from "motion/react"
import { useState } from "react"
import { GiftIcon, Heart } from "lucide-react"

export default function IntroScreen({ onNext }) {
    const [isClicked, setIsClicked] = useState(false)

    const handleStartJourney = () => {
        if (isClicked) return

        setIsClicked(true)

        // Move to next screen after a short delay
        setTimeout(onNext, 1000)
    }

    return (
        <motion.div
            
            className="min-h-screen relative">

            {/* Background effects */}
            <div className="absolute inset-0">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_70%,rgba(6,182,212,0.08),transparent_50%)]" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(236,72,153,0.08),transparent_50%)]" />
            </div>

            <div className="relative z-10 min-h-screen flex items-center justify-center px-4">
                <div className="text-center max-w-3xl mx-auto">
                    {/* Main message */}
                    <motion.div
                        className="mb-12"
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, ease: "easeOut" }}
                    >
                        <motion.div
                            className="mb-8"
                            animate={{ rotate: [0, 5, -5, 0] }}
                            transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY }}
                        >
                            <Heart className="w-20 h-20 text-pink-500 mx-auto mb-6" fill="currentColor" />
                        </motion.div>

                        <motion.h1
                            className="text-4xl md:text-6xl font-bold mb-8 leading-tight"
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5, duration: 0.8 }}
                        >
                            <span className="bg-gradient-to-r from-cyan-400 to-pink-500 bg-clip-text text-transparent">
                                To This Friendship...
                            </span>
                            <br />
                            <span className="bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">
                                I’ve Made Something
                            </span>
                            <br />
                            <span className="bg-gradient-to-r from-purple-500 to-cyan-400 bg-clip-text text-transparent">
                                Just For You!
                            </span>
                        </motion.h1>

                        <motion.p
                            className="text-xl md:text-2xl text-gray-300 leading-relaxed mb-12"
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 1, duration: 0.8 }}
                        >
                            Get ready for a little journey packed with memories, fun, and friendship magic! 💫
                        </motion.p>
                    </motion.div>

                    {/* Start button */}
                    <motion.button
                        onClick={handleStartJourney}
                        disabled={isClicked}
                        className="group px-12 py-4 bg-gradient-to-r from-cyan-500 to-pink-500 text-white text-xl font-bold rounded-full shadow-2xl hover:shadow-cyan-500/25 transition-all duration-300 border-2 border-white/80 hover:border-cyan-400/50 disabled:opacity-70"
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1.5, duration: 0.8 }}
                        whileHover={{ scale: isClicked ? 1 : 1.05 }}
                        whileTap={{ scale: isClicked ? 1 : 0.95 }}
                    >
                        <span className="flex items-center gap-2">
                            {isClicked ? "Starting Surprise..." : "Start the Surprise"}
                            <GiftIcon className="w-6 h-6" />
                        </span>
                    </motion.button>

                    <motion.p
                        className="text-gray-500 mt-6 text-sm"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 2, duration: 0.8 }}
                    >
                        Click to unwrap the surprise! ✨
                    </motion.p>
                </div>
            </div>
        </motion.div>
    )
}
