"use client"

import { motion } from "motion/react"
import { useState } from "react"
import { Book, ChevronLeft, ChevronRight, Heart, ArrowRight } from "lucide-react"
import Image from "next/image"

export default function PhotoBookScreen({ onNext }) {
    const [isBookOpen, setIsBookOpen] = useState(false)
    const [currentPage, setCurrentPage] = useState(0)

    const photos = [
        {
            id: 1,
            src: "/images/SmartSelect_20251003_091403_Photo Editor.jpg",
        },
        {
            id: 2,
            src: "/images/Screenshot_20251113_210757_Instagram.jpg",
        },
        {
            id: 3,
            src: "/images/Screenshot_20251008_171231_Instagram.jpg",
        },
        {
            id: 4,
            src: "/images/Screenshot_20250120_200109_Gallery.jpg",
        },
    ]

    const openBook = () => {
        setIsBookOpen(true)
    }

    const nextPage = () => {
        if (currentPage < photos.length - 1) {
            setCurrentPage(currentPage + 1)
        }
    }

    const prevPage = () => {
        if (currentPage > 0) {
            setCurrentPage(currentPage - 1)
        }
    }

    return (
        <div className="min-h-screen">

            {/* Background effects */}
            <div className="absolute inset-0">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(6,182,212,0.06),transparent_70%)]" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(236,72,153,0.06),transparent_70%)]" />
            </div>

            <div className="relative z-10 min-h-screen flex items-center justify-center px-4">
                <div className="w-full max-w-4xl mx-auto">
                    <motion.h2
                        layout
                        className="text-4xl md:text-5xl text-center font-bold mb-12 py-1 bg-gradient-to-r from-cyan-400 to-pink-500 bg-clip-text text-transparent"
                        initial={{ opacity: 0, y: -30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3, duration: 0.8 }}
                    >
                        Our Memory Album
                    </motion.h2>
                    {!isBookOpen ? (
                        // Closed Book
                        <motion.div
                            className="text-center"
                            initial={{ opacity: 0, y: 50 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                        >

                            <motion.div
                                className="relative mx-auto w-72 h-80 cursor-pointer"
                                whileHover={{ scale: 1.05 }}
                                onClick={openBook}
                                initial={{ rotateY: -15 }}
                                animate={{ rotateY: 0 }}
                                transition={{ duration: 1 }}
                            >
                                {/* Book Shadow */}
                                <div className="absolute inset-0 bg-black/50 blur-xl transform translate-y-8 scale-110" />

                                {/* Book Cover */}
                                <motion.div
                                    className="relative w-full h-full bg-gradient-to-br from-purple-800 via-purple-700 to-indigo-800 rounded-r-2xl shadow-2xl border-l-8 border-purple-900"
                                    animate={{
                                        boxShadow: [
                                            "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
                                            "0 25px 50px -12px rgba(168, 85, 247, 0.3)",
                                            "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
                                        ],
                                    }}
                                    transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY }}
                                >
                                    <div className="absolute inset-6 border-2 border-cyan-400/30 rounded-lg flex flex-col items-center justify-center text-white">
                                        <motion.div
                                            animate={{ rotate: [0, 5, -5, 0] }}
                                            transition={{ duration: 4, repeat: Number.POSITIVE_INFINITY }}
                                        >
                                            <Book className="w-16 h-16 mb-6 text-cyan-400" />
                                        </motion.div>

                                        <h3 className="text-2xl font-bold mb-2 text-center">Friendship</h3>
                                        <h3 className="text-2xl font-bold mb-4 text-center">Memories</h3>

                                        <motion.div
                                            className="flex items-center gap-2 text-pink-400"
                                            animate={{ scale: [1, 1.1, 1] }}
                                            transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                                        >
                                            <Heart className="w-5 h-5" fill="currentColor" />
                                            <span className="text-sm">Tap to Open</span>
                                            <Heart className="w-5 h-5" fill="currentColor" />
                                        </motion.div>
                                    </div>

                                    {/* Book spine details */}
                                    <div className="absolute left-0 top-0 w-2 h-full bg-gradient-to-b from-purple-900 to-indigo-900" />
                                    <div className="absolute left-2 top-0 w-1 h-full bg-cyan-400/20" />
                                </motion.div>
                            </motion.div>

                            <motion.p
                                className="text-gray-400 text-lg mt-8"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 1, duration: 0.8 }}
                            >
                                Tap the book to explore our beautiful memories
                            </motion.p>
                        </motion.div>
                    ) : (
                        // Open Book
                        <motion.div
                            className="relative"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.8 }}
                        >
                            <div className="flex justify-center">
                                <motion.div
                                    className="relative w-full max-w-2xl h-96 bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl shadow-2xl overflow-hidden border-4 border-amber-200/50"
                                    initial={{ rotateY: -90, scale: 0.8 }}
                                    animate={{ rotateY: 0, scale: 1 }}
                                    transition={{ duration: 1.2, ease: "easeOut" }}
                                    style={{ transformStyle: "preserve-3d" }}
                                >
                                    {/* Decorative corners */}
                                    <div className="absolute top-4 left-4 w-8 h-8 border-l-4 border-t-4 border-amber-400/60 rounded-tl-lg" />
                                    <div className="absolute top-4 right-4 w-8 h-8 border-r-4 border-t-4 border-amber-400/60 rounded-tr-lg" />
                                    <div className="absolute bottom-4 left-4 w-8 h-8 border-l-4 border-b-4 border-amber-400/60 rounded-bl-lg" />
                                    <div className="absolute bottom-4 right-4 w-8 h-8 border-r-4 border-b-4 border-amber-400/60 rounded-br-lg" />

                                    {/* Photo Display */}
                                    <motion.div
                                        className="absolute inset-0 w-full h-full p-8 flex items-center justify-center"
                                        key={`photo-${currentPage}`}
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ duration: 0.8 }}
                                    >
                                        <motion.div
                                            className="relative w-64 h-80 rounded-xl overflow-hidden shadow-2xl border-4 border-cyan-50"
                                            whileHover={{ scale: 1.02 }}
                                            style={{
                                                background: "linear-gradient(145deg, #ffffff, #f0f0f0)",
                                                boxShadow: "20px 20px 40px #d1d1d1, -20px -20px 40px #ffffff",
                                            }}
                                        >
                                            {/* Photo frame inner shadow */}
                                            <div className="absolute inset-2 rounded-lg overflow-hidden">
                                                <Image
                                                    src={photos[currentPage]?.src}
                                                    alt={`Memory ${currentPage + 1}`}
                                                    fill
                                                    sizes="256px"
                                                    quality={90}
                                                    className="object-cover w-full h-full"
                                                />
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent" />
                                            </div>

                                            {/* Decorative elements */}
                                            <div className="absolute top-2 left-2 w-3 h-3 bg-pink-400/30 rounded-full" />
                                            <div className="absolute bottom-2 right-2 w-2 h-2 bg-cyan-400/30 rounded-full" />
                                        </motion.div>
                                    </motion.div>

                                    {/* Navigation arrows */}
                                    <motion.button
                                        onClick={prevPage}
                                        disabled={currentPage === 0}
                                        className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center text-cyan-600 disabled:opacity-30 disabled:cursor-not-allowed shadow-lg border border-amber-200/50 z-20"
                                        whileHover={{ scale: 1.1, backgroundColor: "rgba(255,255,255,0.9)" }}
                                        whileTap={{ scale: 0.9 }}
                                    >
                                        <ChevronLeft className="w-6 h-6" />
                                    </motion.button>

                                    <motion.button
                                        onClick={nextPage}
                                        disabled={currentPage === photos.length - 1}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center text-cyan-600 disabled:opacity-30 disabled:cursor-not-allowed shadow-lg border border-amber-200/50 z-20"
                                        whileHover={{ scale: 1.1, backgroundColor: "rgba(255,255,255,0.9)" }}
                                        whileTap={{ scale: 0.9 }}
                                    >
                                        <ChevronRight className="w-6 h-6" />
                                    </motion.button>

                                    {/* Page indicator at bottom */}
                                    <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 bg-white/80 backdrop-blur-sm rounded-full px-4 py-2 shadow-lg border border-amber-200/50 z-20">
                                        <span className="text-gray-700 text-sm font-medium">
                                            {currentPage + 1} of {photos.length}
                                        </span>
                                    </div>
                                </motion.div>
                            </div>

                            {/* Continue Button */}
                            {isBookOpen && (
                                <motion.div
                                    className="text-center mt-8 min-h-[60px]" // Reserve space always
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: currentPage === photos.length - 1 ? 1 : 0 }}
                                    transition={{ duration: 0.4 }}
                                >
                                    <motion.button
                                        onClick={onNext}
                                        className={`px-8 py-3 bg-gradient-to-r from-cyan-500 to-pink-500 text-white font-bold rounded-full shadow-lg hover:shadow-cyan-500/25 transition-all duration-300 ${currentPage !== photos.length - 1 ? "pointer-events-none opacity-0" : ""
                                            }`}
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        <span className="flex items-center gap-2">
                                            Continue to Final Message
                                            <ArrowRight className="w-5 h-5" />
                                        </span>
                                    </motion.button>
                                </motion.div>
                            )}

                        </motion.div>
                    )}
                </div>
            </div>
        </div>
    )
}
