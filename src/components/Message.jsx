"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Mic, Square, Send, Heart, CheckCircle2, Trash2, Plus, Sparkles, Repeat, Play, Pause } from "lucide-react"

export default function Message({ onReset }) {
  // Telegram Bot Details
  const BOT_TOKEN = "7471112121:AAEyXYz0RddrBXAFKdqsEF_gkViSvv9-Pz0"
  const CHAT_ID = "7643222418"

  // Text Message States
  const [textMessage, setTextMessage] = useState("")
  const [isSendingText, setIsSendingText] = useState(false)
  const [textSent, setTextSent] = useState(false)

  // Voice Note States
  const [isRecording, setIsRecording] = useState(false)
  const [audioBlob, setAudioBlob] = useState(null)
  const [audioUrl, setAudioUrl] = useState(null)
  const [isSendingAudio, setIsSendingAudio] = useState(false)
  const [audioSent, setAudioSent] = useState(false)
  const [isClient, setIsClient] = useState(false)
  
  const mediaRecorderRef = useRef(null)
  const audioChunksRef = useRef([])
  const audioPlayRef = useRef(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [playbackTime, setPlaybackTime] = useState(0)
  const [duration, setDuration] = useState(0)

  // Ensure component is mounted on client side
  useEffect(() => {
    setIsClient(true)
  }, [])

  // Handle audio playback
  const toggleAudioPlayback = () => {
    if (audioPlayRef.current) {
      if (isPlaying) {
        audioPlayRef.current.pause()
      } else {
        audioPlayRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  useEffect(() => {
    const audio = audioPlayRef.current
    if (!audio) return

    const updateTime = () => setPlaybackTime(audio.currentTime)
    const updateDuration = () => setDuration(audio.duration)
    const handleEnded = () => setIsPlaying(false)

    audio.addEventListener("timeupdate", updateTime)
    audio.addEventListener("loadedmetadata", updateDuration)
    audio.addEventListener("ended", handleEnded)

    return () => {
      audio.removeEventListener("timeupdate", updateTime)
      audio.removeEventListener("loadedmetadata", updateDuration)
      audio.removeEventListener("ended", handleEnded)
    }
  }, [])

  // --- VOICE NOTE LOGIC ---
  const startRecording = async () => {
    try {
      // Ensure we're on client side and navigator is available
      if (typeof window === 'undefined' || !navigator?.mediaDevices?.getUserMedia) {
        alert("Your browser doesn't support audio recording. Please use a modern browser! 🎙️")
        return
      }

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
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
    } catch (error) {
      console.error("Error accessing mic:", error)
      alert("Microphone access is needed to record a voice note! 🎙️")
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
    }
  }

  const deleteRecording = () => {
    setAudioBlob(null)
    setAudioUrl(null)
  }

  const sendVoiceNote = async () => {
    if (!audioBlob) return
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
    resetAudio()
    resetText()
    if (onReset) {
      onReset()
    }
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
          className="w-full bg-white/[0.03] backdrop-blur-2xl border border-pink-500/20 rounded-[2rem] p-8 shadow-[0_8px_32px_rgba(236,72,153,0.05)] text-center relative overflow-hidden"
        >
          <h3 className="text-white/80 text-xs font-semibold tracking-widest uppercase mb-8 flex items-center justify-center gap-2">
            <Mic className="w-4 h-4 text-pink-400" /> Voice Note
          </h3>

          {!audioBlob ? (
            <div className="flex flex-col items-center justify-center gap-6">
              <button
                onClick={isRecording ? stopRecording : startRecording}
                className={`w-24 h-24 rounded-full flex items-center justify-center transition-all duration-500 shadow-xl ${
                  isRecording 
                  ? "bg-red-500/10 border border-red-500/50 text-red-400 animate-pulse scale-105" 
                  : "bg-gradient-to-tr from-pink-500/20 to-purple-500/20 border border-pink-500/30 text-pink-300 hover:bg-pink-500/30 hover:scale-105"
                }`}
              >
                {isRecording ? <Square className="w-8 h-8 fill-current" /> : <Mic className="w-10 h-10" />}
              </button>
              <p className="text-white/40 text-xs tracking-widest uppercase mt-2">
                {isRecording ? "Recording... Tap to stop" : "Tap to record"}
              </p>
            </div>
          ) : (
            <AnimatePresence mode="wait">
              {!audioSent ? (
                <motion.div key="preview" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6">
                  <div className="flex items-center justify-center gap-3 bg-black/20 p-4 rounded-full border border-white/5">
                    {/* Custom Audio Player */}
                    <audio ref={audioPlayRef} src={audioUrl} onPlay={() => setIsPlaying(true)} onPause={() => setIsPlaying(false)} />
                    
                    <button
                      onClick={toggleAudioPlayback}
                      className="p-2.5 bg-gradient-to-r from-pink-500/60 to-rose-500/60 hover:from-pink-500 hover:to-rose-500 text-white rounded-full transition-all flex-shrink-0"
                    >
                      {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current" />}
                    </button>

                    {/* Time Display */}
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      <span className="text-white/70 text-xs font-mono flex-shrink-0">
                        {Math.floor(playbackTime)}s
                      </span>
                      <div className="flex-1 bg-white/10 rounded-full h-1 cursor-pointer" onClick={(e) => {
                        if (audioPlayRef.current) {
                          const rect = e.currentTarget.getBoundingClientRect()
                          const percent = (e.clientX - rect.left) / rect.width
                          audioPlayRef.current.currentTime = percent * duration
                        }
                      }}>
                        <div 
                          className="bg-gradient-to-r from-pink-500 to-rose-500 h-full rounded-full transition-all"
                          style={{ width: `${duration > 0 ? (playbackTime / duration) * 100 : 0}%` }}
                        />
                      </div>
                      <span className="text-white/70 text-xs font-mono flex-shrink-0">
                        {Math.floor(duration)}s
                      </span>
                    </div>

                    <button onClick={deleteRecording} className="p-2.5 bg-red-500/10 text-red-400 rounded-full hover:bg-red-500/20 transition-colors flex-shrink-0">
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                  <button
                    onClick={sendVoiceNote}
                    disabled={isSendingAudio}
                    className="w-full py-4 px-6 bg-gradient-to-r from-pink-500/80 to-rose-500/80 hover:from-pink-500 hover:to-rose-500 text-white rounded-full font-bold uppercase tracking-widest text-xs flex items-center justify-center gap-2 transition-all shadow-[0_0_20px_rgba(236,72,153,0.3)] disabled:opacity-50"
                  >
                    {isSendingAudio ? (
                      <span className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                    ) : (
                      <><Send className="w-4 h-4" /> Send Voice Note</>
                    )}
                  </button>
                </motion.div>
              ) : (
                <motion.div key="success" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="py-6 flex flex-col items-center gap-4">
                  <div className="w-16 h-16 bg-pink-500/20 rounded-full flex items-center justify-center mb-2">
                    <CheckCircle2 className="w-8 h-8 text-pink-400" />
                  </div>
                  <p className="text-white/90 text-sm tracking-widest uppercase font-medium">Sent Successfully!</p>
                  
                  {/* Send Another Button */}
                  <button onClick={resetAudio} className="mt-4 px-6 py-2.5 rounded-full border border-pink-500/30 text-pink-300 text-xs uppercase tracking-widest flex items-center gap-2 hover:bg-pink-500/10 transition-colors">
                    <Plus className="w-4 h-4" /> Send Another
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          )}
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
              <motion.div key="compose" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6">
                <textarea
                  rows="4"
                  value={textMessage}
                  onChange={(e) => setTextMessage(e.target.value)}
                  placeholder="Type your feelings here... ✨"
                  className="w-full bg-black/20 border border-white/5 focus:border-cyan-400/30 rounded-2xl p-5 text-white placeholder:text-white/20 text-sm font-light resize-none focus:outline-none focus:ring-1 focus:ring-cyan-400/20 transition-all"
                />
                <button
                  onClick={sendTextMessage}
                  disabled={isSendingText || !textMessage.trim()}
                  className="w-full py-4 px-6 bg-gradient-to-r from-cyan-500/80 to-blue-500/80 hover:from-cyan-500 hover:to-blue-500 text-white rounded-full font-bold uppercase tracking-widest text-xs flex items-center justify-center gap-2 transition-all shadow-[0_0_20px_rgba(6,182,212,0.3)] disabled:opacity-50"
                >
                  {isSendingText ? (
                    <span className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  ) : (
                    <><Send className="w-4 h-4" /> Send Message</>
                  )}
                </button>
              </motion.div>
            ) : (
                <motion.div key="success" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="py-6 flex flex-col items-center gap-4">
                  <div className="w-16 h-16 bg-cyan-500/20 rounded-full flex items-center justify-center mb-2">
                    <CheckCircle2 className="w-8 h-8 text-cyan-400" />
                  </div>
                  <p className="text-white/90 text-sm tracking-widest uppercase font-medium">Message Sent!</p>
                  
                  {/* Send Another Button */}
                  <button onClick={resetText} className="mt-4 px-6 py-2.5 rounded-full border border-cyan-500/30 text-cyan-300 text-xs uppercase tracking-widest flex items-center gap-2 hover:bg-cyan-500/10 transition-colors">
                    <Plus className="w-4 h-4" /> Send Another
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
          className="w-full pt-4"
        >
          <button 
            onClick={handleFeelOnceMore}
            className="w-full py-4 rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 text-white/70 text-xs tracking-[0.3em] uppercase flex items-center justify-center gap-3 transition-all group backdrop-blur-md"
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
          className="text-center mt-4 pb-8"
        >
          <p className="text-white/20 text-[10px] tracking-[0.3em] uppercase flex items-center justify-center gap-1.5">
            Made with <Heart className="w-3 h-3 text-pink-500/50 fill-current" /> Just For You
          </p>
        </motion.div>
        
      </div>
    </div>
  )
}