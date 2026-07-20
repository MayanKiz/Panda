"use client"

import { useState, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Mic, Square, Send, Heart, CheckCircle2, Play, Trash2 } from "lucide-react"

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
  const [audioBlob, setAudioBlob] = useState(null)
  const [audioUrl, setAudioUrl] = useState(null)
  const [isSendingAudio, setIsSendingAudio] = useState(false)
  const [audioSent, setAudioSent] = useState(false)
  const mediaRecorderRef = useRef(null)
  const audioChunksRef = useRef([])

  // --- VOICE NOTE LOGIC ---
  const startRecording = async () => {
    try {
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
        setTimeout(() => {
          setAudioSent(false)
          deleteRecording()
        }, 4000)
      }
    } catch (error) {
      console.error("Error sending voice note:", error)
    } finally {
      setIsSendingAudio(false)
    }
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
        setTextMessage("")
        setTimeout(() => setTextSent(false), 4000)
      }
    } catch (error) {
      console.error("Error sending message:", error)
    } finally {
      setIsSendingText(false)
    }
  }

  return (
    <div className="min-h-screen relative flex items-center justify-center px-4 py-12">
      {/* Container to restrict max width */}
      <div className="max-w-md w-full space-y-8 relative z-10">
        
        {/* Cute Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }} 
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-2"
        >
          <h2 className="text-pink-100 text-[11px] tracking-[0.4em] uppercase font-light italic flex items-center justify-center gap-2">
            <SparklesIcon /> I'd love to hear from you <SparklesIcon />
          </h2>
        </motion.div>

        {/* 1. VOICE NOTE SECTION (Pehle rakha gaya hai) */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }} 
          animate={{ opacity: 1, scale: 1 }} 
          transition={{ delay: 0.2 }}
          className="bg-white/5 backdrop-blur-xl border border-pink-500/20 rounded-3xl p-6 shadow-[0_0_30px_rgba(236,72,153,0.1)] text-center relative overflow-hidden"
        >
          <h3 className="text-white text-sm font-medium tracking-widest uppercase mb-6 flex items-center justify-center gap-2">
            <Mic className="w-4 h-4 text-pink-400" /> Voice Note
          </h3>

          {!audioBlob ? (
            <div className="flex flex-col items-center justify-center gap-4">
              <button
                onClick={isRecording ? stopRecording : startRecording}
                className={`w-20 h-20 rounded-full flex items-center justify-center transition-all duration-300 shadow-xl ${
                  isRecording 
                  ? "bg-red-500/20 border-2 border-red-500 animate-pulse text-red-500" 
                  : "bg-gradient-to-tr from-pink-500 to-purple-500 text-white hover:scale-105 hover:shadow-[0_0_20px_pink]"
                }`}
              >
                {isRecording ? <Square className="w-8 h-8 fill-current" /> : <Mic className="w-8 h-8" />}
              </button>
              <p className="text-pink-200/60 text-xs tracking-widest uppercase italic mt-2">
                {isRecording ? "Recording... Tap square to stop" : "Tap mic to record"}
              </p>
            </div>
          ) : (
            <AnimatePresence mode="wait">
              {!audioSent ? (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-4">
                  <div className="flex items-center justify-center gap-3">
                    <audio src={audioUrl} controls className="h-10 w-48 rounded-full [&::-webkit-media-controls-panel]:bg-white/10" />
                    <button onClick={deleteRecording} className="p-2 bg-red-500/20 text-red-400 rounded-full hover:bg-red-500/40 transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <button
                    onClick={sendVoiceNote}
                    disabled={isSendingAudio}
                    className="w-full py-3 px-6 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-full font-bold uppercase tracking-widest text-xs flex items-center justify-center gap-2 hover:shadow-[0_0_15px_pink] transition-all disabled:opacity-50"
                  >
                    {isSendingAudio ? (
                      <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                    ) : (
                      <><Send className="w-4 h-4" /> Send Voice Note</>
                    )}
                  </button>
                </motion.div>
              ) : (
                <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} className="py-4 flex flex-col items-center gap-2">
                  <CheckCircle2 className="w-12 h-12 text-pink-400" />
                  <p className="text-white text-xs tracking-widest uppercase">Sent Successfully!</p>
                </motion.div>
              )}
            </AnimatePresence>
          )}
        </motion.div>

        {/* 2. TEXT MESSAGE SECTION (Baad me rakha gaya hai) */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }} 
          animate={{ opacity: 1, scale: 1 }} 
          transition={{ delay: 0.4 }}
          className="bg-white/5 backdrop-blur-xl border border-cyan-500/20 rounded-3xl p-6 shadow-[0_0_30px_rgba(6,182,212,0.1)] text-center"
        >
           <h3 className="text-white text-sm font-medium tracking-widest uppercase mb-6 flex items-center justify-center gap-2">
            <Square className="w-4 h-4 text-cyan-400" /> Text Message
          </h3>

          <AnimatePresence mode="wait">
            {!textSent ? (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-4">
                <textarea
                  rows="4"
                  value={textMessage}
                  onChange={(e) => setTextMessage(e.target.value)}
                  placeholder="Type your feelings here... ✨"
                  className="w-full bg-black/40 border border-white/10 focus:border-cyan-400/50 rounded-2xl p-4 text-white placeholder:text-white/30 text-sm font-light italic resize-none focus:outline-none focus:ring-1 focus:ring-cyan-400/30 transition-all custom-scrollbar"
                />
                <button
                  onClick={sendTextMessage}
                  disabled={isSendingText || !textMessage.trim()}
                  className="w-full py-3 px-6 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-full font-bold uppercase tracking-widest text-xs flex items-center justify-center gap-2 hover:shadow-[0_0_15px_cyan] transition-all disabled:opacity-50"
                >
                  {isSendingText ? (
                    <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  ) : (
                    <><Send className="w-4 h-4" /> Send Message</>
                  )}
                </button>
              </motion.div>
            ) : (
               <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} className="py-8 flex flex-col items-center gap-2">
                  <CheckCircle2 className="w-12 h-12 text-cyan-400" />
                  <p className="text-white text-xs tracking-widest uppercase">Message Sent!</p>
                </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Footer */}
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          transition={{ delay: 0.6 }}
          className="text-center mt-8"
        >
          <p className="text-white/30 text-[10px] tracking-[0.3em] uppercase flex items-center justify-center gap-1">
            Made with <Heart className="w-3 h-3 text-pink-500 fill-current" /> Just For You
          </p>
        </motion.div>
        
      </div>
    </div>
  )
}

// Chota sa sparkle icon component top title ke liye
function SparklesIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-pink-300">
      <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/>
    </svg>
  )
}
