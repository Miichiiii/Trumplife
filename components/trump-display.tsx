"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"

interface TrumpDisplayProps {
  level: number
  hasWall: boolean
}

export default function TrumpDisplay({ level, hasWall }: TrumpDisplayProps) {
  const [clickEffect, setClickEffect] = useState(false)
  const [position, setPosition] = useState({ x: 0, y: 0 })

  // Random gentle swaying motion
  useEffect(() => {
    const interval = setInterval(() => {
      setPosition({
        x: Math.sin(Date.now() / 2000) * 5,
        y: Math.sin(Date.now() / 1500) * 3,
      })
    }, 100)

    return () => clearInterval(interval)
  }, [])

  const handleClick = (e: React.MouseEvent) => {
    // Show click effect only
    setClickEffect(true)
    setTimeout(() => setClickEffect(false), 300)
  }

  return (
    <div className="relative flex justify-center items-center h-64 w-full" onClick={handleClick}>
      <motion.div
        animate={{ x: position.x, y: position.y }}
        transition={{ type: "spring", stiffness: 100 }}
        className="relative"
      >
     


     
        {/* Trump body */}
        <div className="relative">
          {/* Suit */}
          <div
            className={`w-40 h-60 ${level === 1 ? "bg-blue-600" : level === 2 ? "bg-red-600" : "bg-yellow-500"} rounded-t-3xl relative z-10`}
          >
            {/* Shirt */}
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-20 h-40 bg-white"></div>

            {/* Tie */}
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-10 h-40 bg-red-500 z-20"></div>

            {/* Suit lapels */}
            <div className="absolute top-0 left-0 w-0 h-0 border-t-[40px] border-t-transparent border-r-[60px] border-r-blue-600 z-15"></div>
            <div className="absolute top-0 right-0 w-0 h-0 border-t-[40px] border-t-transparent border-l-[60px] border-l-blue-600 z-15"></div>

            {/* Hands */}
            <div className="absolute bottom-10 -left-10 w-12 h-12 bg-orange-300 rounded-full z-20"></div>
            <div className="absolute bottom-10 -right-10 w-12 h-12 bg-orange-300 rounded-full z-20"></div>
          </div>

          {/* Head */}
          <div className="absolute -top-32 left-1/2 transform -translate-x-1/2 w-36 h-36 bg-orange-300 rounded-full z-30">
            {/* Eyes */}
            <div className="absolute top-16 left-8 w-6 h-3 bg-white rounded-full"></div>
            <div className="absolute top-16 right-8 w-6 h-3 bg-white rounded-full"></div>
            <div className="absolute top-17 left-10 w-2 h-2 bg-blue-600 rounded-full"></div>
            <div className="absolute top-17 right-10 w-2 h-2 bg-blue-600 rounded-full"></div>

            {/* Mouth */}
            <div className="absolute top-24 left-1/2 transform -translate-x-1/2 w-16 h-4 bg-red-400 rounded-full"></div>

            {/* Hair - different based on level */}
            <div
              className={`absolute -top-5 left-1/2 transform -translate-x-1/2 w-40 h-20 ${level >= 2 ? "bg-yellow-400" : "bg-yellow-300"} z-40`}
              style={{ borderRadius: "50% 50% 0 0" }}
            ></div>

            {/* Additional hair styling for higher levels */}
            {level >= 2 && (
              <div
                className="absolute -top-8 left-1/2 transform -translate-x-1/2 w-44 h-20 bg-yellow-400 z-39"
                style={{ borderRadius: "50% 50% 0 0" }}
              ></div>
            )}

            {level >= 3 && (
              <div
                className="absolute -top-10 left-1/2 transform -translate-x-1/2 w-48 h-20 bg-yellow-500 z-38"
                style={{ borderRadius: "50% 50% 0 0" }}
              ></div>
            )}
          </div>
        </div>

        {/* Wall - only if unlocked */}
        {hasWall && (
          <div className="absolute -bottom-10 left-1/2 transform -translate-x-1/2 w-200 h-20 bg-gray-300 z-5 flex">
            {Array.from({ length: 10 }).map((_, i) => (
              <div key={i} className="w-10 h-20 bg-gray-400 border-r-2 border-t-4 border-gray-500"></div>
            ))}
          </div>
        )}
      </motion.div>

      {/* Click effect */}
      <AnimatePresence>
        {clickEffect && (
          <motion.div
            initial={{ opacity: 1, scale: 0.5 }}
            animate={{ opacity: 0, scale: 1.5 }}
            exit={{ opacity: 0 }}
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-20 h-20 bg-green-300 rounded-full z-30 opacity-50"
          ></motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
