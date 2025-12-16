"use client"

import { useEffect, useRef } from "react"

export default function Music({ shouldPlay }) {
    const audioRef = useRef(null)

    useEffect(() => {
        if (shouldPlay && audioRef.current) {
            audioRef.current.volume = 0.8
            audioRef.current.play().catch(console.log)
        }
    }, [shouldPlay])

    return (
        <audio ref={audioRef} loop preload="auto">
            <source src="public/audio/Dooron-Dooron-Official-Video-Paresh-Pahuja-Feat-Harleen-Seth (1).m4a" type="audio/mpeg" />
        </audio>
    )
}