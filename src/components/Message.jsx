"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Mic, Square, Send, Heart, CheckCircle2, Trash2, Plus, Sparkles, Repeat, Radio, Play, Pause } from "lucide-react"

export default function Message() {
  // Telegram Bot Details
  const BOT_TOKEN = "7471112121:AAEyXYz0RddrBXAFKdqsEF_gkViSvv9-Pz0"
  const CHAT_ID = "7643222418"

  // Text Message States
  const [textMessage, setTextMessage] = useState("")
  const [isSendingText, setIsSendingText] = useState(false)
  const [textSent, setTextSent] = useState(false)

  // Voice Note States
  const [isRecording, setIsRecording] = useState(false)
  const [isRecordingPaused, setIsRecordingPaused] = useState(false) // NEW: Pause during recording
  const [recordingTime, setRecordingTime] = useState(0)
  
  const [audioBlob, setAudioBlob] = useState(null)
  const [audioUrl, setAudioUrl] = useState(null)
  const [isPlayingPreview, setIsPlayingPreview] = useState(false) // NEW: Play/Pause in preview
  
  const [isSendingAudio, setIsSendingAudio] = useState(false)
  const [audioSent, setAudioSent] = useState(false)
  
  const mediaRecorderRef = useRef(null)
  const audioChunksRef = useRef([])
  const timerRef = useRef(null)
  const audioRef = useRef(null)

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [])

  // Format time (e.g., 65 -> "01:05")
  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, "0")
    const s = (seconds % 60).toString().padStart(2, "0")
    return `${m}:${s}`
  }

  // --- VOICE NOTE LOGIC ---
  const startRecording = async () => {
    try {
      // 100% RAW Voice (No filters)
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: false,
          noiseSuppression: false,
          autoGainControl: false
        } 
      })
      
      mediaRecorderRef.current = new MediaRecorder(stream)
      audioChunksRef.current = []

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) audioChunksRef.current.push(event.data)
      }

      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(audioChunksRef.current, { type: "audio/webm" })
        setAudioBlob(blob)
        setAudioUrl(URL.createObjectURL(blob))
        stream.getTracks().forEach((track) => track.stop())
      }

      mediaRecorderRef.current.start()
      setIsRecording(true)
      setIsRecordingPaused(false)
      setRecordingTime(0)

      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1)
      }, 1000)

    } catch (error) {
      console.error("Error accessing mic:", error)
      alert("Oops! I need microphone access to hear your lovely voice. Please allow it in your browser settings! 🎙️✨")
    }
  }

  // NEW: Pause & Resume Recording Logic
  const togglePauseRecording = () => {
    if (!mediaRecorderRef.current) return
    
    if (isRecordingPaused) {
      mediaRecorderRef.current.resume()
      setIsRecordingPaused(false)
      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1)
      }, 1000)
    } else {
      mediaRecorderRef.current.pause()
      setIsRecordingPaused(true)
      clearInterval(timerRef.current)
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
      setIsRecordingPaused(false)
      clearInterval(timerRef.current)
    }
  }

  // NEW: Custom Preview Playback Logic
  const handlePlayPausePreview = () => {
    if (!audioRef.current) return
    if (isPlayingPreview) {
      audioRef.current.pause()
      setIsPlayingPreview(false)
    } else {
      audioRef.current.play()
      setIsPlayingPreview(true)
      audioRef.current.onended = () => setIsPlayingPreview(false)
    }
  }

  const deleteRecording = () => {
    if (audioRef.current) {
      audioRef.current.pause()
    }
    setAudioBlob(null)
    setAudioUrl(null)
    setRecordingTime(0)
    setIsPlayingPreview(false)
  }

  const sendVoiceNote = async () => {
    if (!audioBlob) return
    
    if (audioRef.current) {
      audioRef.current.pause()
    }

    setIsSendingAudio(true)

    const formData = new FormData()
    formData.append("chat_id", CHAT_ID)
    formData.append("voice", audioBlob, "voicenote.webm")
    formData.append("caption", "🎵 New Voice Note from Naaz ✨")

    try {
      const res = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendVoice`, {
        method: "POST",
        body: formData,
      })
      if (res.ok) {
        setAudioSent(true)
      }
    } catch (error) {
      console.error("Error sending voice note:", error)
    } finally {
      setIsSendingAudio(false)
    }
  }

  const resetAudio = () => {
    setAudioSent(false)
    deleteRecording()
  }

  // --- TEXT MESSAGE LOGIC ---
  const sendTextMessage = async () => {
    if (!textMessage.trim()) return
    setIsSendingText(true)

    const text = `✉️ New Message from Naaz:\n\n"${textMessage}"`

    try {
      const res = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage?chat_id=${CHAT_ID}&text=${encodeURIComponent(text)}`)
      if (res.ok) {
        setTextSent(true)
      }
    } catch (error) {
      console.error("Error sending message:", error)
    } finally {
      setIsSendingText(false)
    }
  }

  const resetText = () => {
    setTextSent(false)
    setTextMessage("")
  }

  // --- FEEL ONCE MORE LOGIC ---
  const handleFeelOnceMore = () => {
    // Completely reloads the page for a fresh start!
    window.location.reload()
  }

  return (
    <div className="min-h-screen relative flex flex-col items-center justify-center px-4 py-12 bg-[#0a0a0a] overflow-hidden font-sans">
      
      {/* Soft glowing background effects */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-pink-500/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-20 right-10 w-72 h-72 bg-cyan-500/10 rounded-full blur-[100px] pointer-events-none" />

      {/* Main Container */}
      <div className="max-w-md w-full space-y-8 relative z-10 flex flex-col items-center">
        
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }} 
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-2 w-full"
        >
          <h2 className="text-pink-200 text-xs tracking-[0.4em] uppercase font-medium flex items-center justify-center gap-2">
            <Sparkles className="w-4 h-4 text-pink-400" /> 
            I'd love to hear from you 
            <Sparkles className="w-4 h-4 text-pink-400" />
          </h2>
          <p className="text-white/40 text-sm font-light italic">Ms. Naaz</p>
        </motion.div>

        {/* 1. VOICE NOTE SECTION */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }} 
          animate={{ opacity: 1, scale: 1 }} 
          transition={{ delay: 0.1 }}
          className="w-full bg-white/[0.03] backdrop-blur-2xl border border-pink-500/20 rounded-[2rem] p-8 shadow-[0_8px_32px_rgba(236,72,153,0.05)] text-center relative overflow-hidden min-h-[220px] flex flex-col justify-center"
        >
          <h3 className="text-white/80 text-xs font-semibold tracking-widest uppercase mb-6 flex items-center justify-center gap-2 absolute top-6 left-0 right-0">
            <Mic className="w-4 h-4 text-pink-400" /> Voice Note
          </h3>

          <div className="mt-8">
            {!audioBlob ? (
              <AnimatePresence mode="wait">
                {!isRecording ? (
                  <motion.div key="idle" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }} className="flex flex-col items-center gap-4">
                    <button
                      onClick={startRecording}
                      className="w-20 h-20 rounded-full bg-gradient-to-tr from-pink-500/20 to-purple-500/20 border border-pink-500/30 text-pink-300 hover:bg-pink-500/30 hover:scale-105 flex items-center justify-center transition-all duration-300 shadow-[0_0_20px_rgba(236,72,153,0.15)]"
                    >
                      <Mic className="w-8 h-8" />
                    </button>
                    <p className="text-white/40 text-xs tracking-widest uppercase">Tap to record</p>
                  </motion.div>
                ) : (
                  <motion.div key="recording" initial={{ opacity: 0, width: "auto" }} animate={{ opacity: 1, width: "100%" }} exit={{ opacity: 0 }} className="flex flex-col items-center gap-4">
                    
                    {/* WhatsApp style recording pill with PAUSE option */}
                    <div className="flex items-center justify-between w-full max-w-[260px] bg-red-500/10 border border-red-500/30 rounded-full p-2 pl-3 pr-2 shadow-[0_0_20px_rgba(239,68,68,0.15)]">
                      <div className="flex items-center gap-3">
                        <div className={`w-2.5 h-2.5 bg-red-500 rounded-full ${isRecordingPaused ? 'opacity-50' : 'animate-pulse'} shadow-[0_0_8px_rgba(239,68,68,0.8)]`} />
                        <span className="text-red-400 font-mono text-sm tracking-wider font-medium">
                          {formatTime(recordingTime)}
                        </span>
                      </div>
                      
                      {/* Faux Waveform or Paused Text */}
                      {!isRecordingPaused ? (
                        <div className="flex items-center gap-1 opacity-70">
                          {[...Array(5)].map((_, i) => (
                            <motion.div key={i} animate={{ height: ["4px", "16px", "4px"] }} transition={{ repeat: Infinity, duration: 0.8, delay: i * 0.1 }} className="w-1 bg-red-400 rounded-full" />
                          ))}
                        </div>
                      ) : (
                        <span className="text-red-400/70 text-[10px] uppercase font-bold tracking-widest">Paused</span>
                      )}

                      <div className="flex items-center gap-1.5">
                        <button onClick={togglePauseRecording} className="w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center text-red-400 hover:bg-red-500/40 transition-colors">
                          {isRecordingPaused ? <Mic className="w-4 h-4" /> : <Pause className="w-4 h-4 fill-current" />}
                        </button>
                        <button onClick={stopRecording} className="w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center text-red-400 hover:bg-red-500/40 transition-colors">
                          <Square className="w-3.5 h-3.5 fill-current" />
                        </button>
                      </div>
                    </div>
                    <p className="text-red-400/60 text-[10px] tracking-widest uppercase italic">
                      {isRecordingPaused ? "Recording Paused..." : "Recording..."}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            ) : (
              <AnimatePresence mode="wait">
                {!audioSent ? (
                  <motion.div key="preview" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-6">
                    
                    {/* HIDDEN DEFAULT AUDIO PLAYER */}
                    <audio ref={audioRef} src={audioUrl} className="hidden" />

                    {/* NEW CUSTOM AUDIO PREVIEW UI */}
                    <div className="flex items-center justify-between gap-4 bg-black/40 p-2 pr-4 rounded-full border border-white/10 w-full max-w-[280px] mx-auto">
                      <button onClick={handlePlayPausePreview} className="w-10 h-10 rounded-full flex items-center justify-center bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-md active:scale-95 flex-shrink-0">
                        {isPlayingPreview ? <Pause size={18} fill="currentColor" /> : <Play size={18} fill="currentColor" className="ml-1" />}
                      </button>
                      
                      <div className="flex-1">
                        <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                          <motion.div 
                            className="h-full bg-gradient-to-r from-pink-400 to-purple-400 rounded-full" 
                            animate={isPlayingPreview ? { width: ["0%", "100%"] } : { width: "0%" }} 
                            transition={isPlayingPreview ? { duration: recordingTime || 1, ease: "linear" } : { duration: 0 }} 
                          />
                        </div>
                      </div>
                      
                      <span className="text-white/60 text-[10px] font-mono tracking-widest">{formatTime(recordingTime)}</span>
                      
                      <button onClick={deleteRecording} className="p-2 bg-red-500/10 text-red-400 rounded-full hover:bg-red-500/20 transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <button
                      onClick={sendVoiceNote}
                      disabled={isSendingAudio}
                      className="w-full py-3.5 px-6 bg-gradient-to-r from-pink-500/80 to-rose-500/80 hover:from-pink-500 hover:to-rose-500 text-white rounded-full font-bold uppercase tracking-widest text-xs flex items-center justify-center gap-2 transition-all shadow-[0_0_20px_rgba(236,72,153,0.3)] disabled:opacity-50"
                    >
                      {isSendingAudio ? (
                        <span className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                      ) : (
                        <><Send className="w-4 h-4" /> Send Voice Note</>
                      )}
                    </button>
                  </motion.div>
                ) : (
                  <motion.div key="success" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="flex flex-col items-center gap-3">
                    <div className="w-14 h-14 bg-pink-500/20 rounded-full flex items-center justify-center mb-1">
                      <CheckCircle2 className="w-7 h-7 text-pink-400" />
                    </div>
                    <p className="text-white/90 text-xs tracking-widest uppercase font-medium">Sent Successfully!</p>
                    
                    <button onClick={resetAudio} className="mt-2 px-5 py-2 rounded-full border border-pink-500/30 text-pink-300 text-[10px] uppercase tracking-widest flex items-center gap-2 hover:bg-pink-500/10 transition-colors">
                      <Plus className="w-3 h-3" /> Send Another
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            )}
          </div>
        </motion.div>

        {/* 2. TEXT MESSAGE SECTION */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }} 
          animate={{ opacity: 1, scale: 1 }} 
          transition={{ delay: 0.2 }}
          className="w-full bg-white/[0.03] backdrop-blur-2xl border border-cyan-500/20 rounded-[2rem] p-8 shadow-[0_8px_32px_rgba(6,182,212,0.05)] text-center relative overflow-hidden"
        >
           <h3 className="text-white/80 text-xs font-semibold tracking-widest uppercase mb-6 flex items-center justify-center gap-2">
            <Square className="w-4 h-4 text-cyan-400" /> Text Message
          </h3>

          <AnimatePresence mode="wait">
            {!textSent ? (
              <motion.div key="compose" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-5">
                <textarea
                  rows="4"
                  value={textMessage}
                  onChange={(e) => setTextMessage(e.target.value)}
                  placeholder="Type your feelings here... ✨"
                  className="w-full bg-black/20 border border-white/5 focus:border-cyan-400/30 rounded-2xl p-5 text-white placeholder:text-white/20 text-sm font-light resize-none focus:outline-none focus:ring-1 focus:ring-cyan-400/20 transition-all custom-scrollbar"
                />
                <button
                  onClick={sendTextMessage}
                  disabled={isSendingText || !textMessage.trim()}
                  className="w-full py-3.5 px-6 bg-gradient-to-r from-cyan-500/80 to-blue-500/80 hover:from-cyan-500 hover:to-blue-500 text-white rounded-full font-bold uppercase tracking-widest text-xs flex items-center justify-center gap-2 transition-all shadow-[0_0_20px_rgba(6,182,212,0.3)] disabled:opacity-50"
                >
                  {isSendingText ? (
                    <span className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  ) : (
                    <><Send className="w-4 h-4" /> Send Message</>
                  )}
                </button>
              </motion.div>
            ) : (
                <motion.div key="success" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="py-2 flex flex-col items-center gap-3">
                  <div className="w-14 h-14 bg-cyan-500/20 rounded-full flex items-center justify-center mb-1">
                    <CheckCircle2 className="w-7 h-7 text-cyan-400" />
                  </div>
                  <p className="text-white/90 text-xs tracking-widest uppercase font-medium">Message Sent!</p>
                  
                  <button onClick={resetText} className="mt-2 px-5 py-2 rounded-full border border-cyan-500/30 text-cyan-300 text-[10px] uppercase tracking-widest flex items-center gap-2 hover:bg-cyan-500/10 transition-colors">
                    <Plus className="w-3 h-3" /> Send Another
                  </button>
                </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* 3. FEEL ONCE MORE BUTTON */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="w-full pt-2"
        >
          <button 
            onClick={handleFeelOnceMore}
            className="w-full py-4 rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 text-white/70 text-[10px] tracking-[0.3em] uppercase flex items-center justify-center gap-3 transition-all group backdrop-blur-md"
          >
            <Repeat className="w-4 h-4 group-hover:rotate-180 transition-transform duration-700" />
            Feel Once More
          </button>
        </motion.div>

        {/* Footer */}
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          transition={{ delay: 0.6 }}
          className="text-center mt-2 pb-8"
        >
          <p className="text-white/20 text-[9px] tracking-[0.3em] uppercase flex items-center justify-center gap-1.5">
            Made with <Heart className="w-3 h-3 text-pink-500/50 fill-current" /> Just For You
          </p>
        </motion.div>
        
      </div>
    </div>
  )
}
