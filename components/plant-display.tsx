"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"

interface PlantDisplayProps {
  level: number
  hasFlowers: boolean
}

export default function PlantDisplay({ level, hasFlowers }: PlantDisplayProps) {
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
        className="relative mt-12"
      >
        {/* Plant pot */}
        <div className="w-40 h-20 bg-orange-300 rounded-b-full rounded-t-lg relative z-10">
          <div className="absolute bottom-0 left-0 w-full h-6 bg-orange-400 rounded-b-full"></div>
        </div>

        {/* Plant stem */}
        <div className="absolute bottom-16 left-1/2 transform -translate-x-1/2 w-4 h-40 bg-green-500 rounded-full z-0"></div>

        {/* Leaves - different based on level */}
        {level >= 1 && (
          <>
            <motion.div
              className="absolute bottom-32 left-1/2 transform -translate-x-1/2 -translate-y-2 -rotate-45 w-16 h-8 bg-green-400 rounded-full z-0"
              animate={{ rotate: -45 + Math.sin(Date.now() / 2000) * 5 }}
              transition={{ repeat: Number.POSITIVE_INFINITY, duration: 2 }}
            ></motion.div>
            <motion.div
              className="absolute bottom-32 left-1/2 transform -translate-x-1/2 -translate-y-2 rotate-45 w-16 h-8 bg-green-400 rounded-full z-0"
              animate={{ rotate: 45 + Math.sin(Date.now() / 2000) * 5 }}
              transition={{ repeat: Number.POSITIVE_INFINITY, duration: 2, delay: 0.5 }}
            ></motion.div>
          </>
        )}

        {level >= 2 && (
          <>
            <motion.div
              className="absolute bottom-48 left-1/2 transform -translate-x-1/2 -translate-y-2 -rotate-45 w-20 h-10 bg-green-400 rounded-full z-0"
              animate={{ rotate: -45 + Math.sin(Date.now() / 2000) * 5 }}
              transition={{ repeat: Number.POSITIVE_INFINITY, duration: 2, delay: 0.3 }}
            ></motion.div>
            <motion.div
              className="absolute bottom-48 left-1/2 transform -translate-x-1/2 -translate-y-2 rotate-45 w-20 h-10 bg-green-400 rounded-full z-0"
              animate={{ rotate: 45 + Math.sin(Date.now() / 2000) * 5 }}
              transition={{ repeat: Number.POSITIVE_INFINITY, duration: 2, delay: 0.8 }}
            ></motion.div>
          </>
        )}

        {level >= 3 && (
          <>
            <motion.div
              className="absolute bottom-60 left-1/2 transform -translate-x-1/2 -translate-y-2 -rotate-25 w-24 h-12 bg-green-400 rounded-full z-0"
              animate={{ rotate: -25 + Math.sin(Date.now() / 2000) * 5 }}
              transition={{ repeat: Number.POSITIVE_INFINITY, duration: 2, delay: 0.2 }}
            ></motion.div>
            <motion.div
              className="absolute bottom-60 left-1/2 transform -translate-x-1/2 -translate-y-2 rotate-25 w-24 h-12 bg-green-400 rounded-full z-0"
              animate={{ rotate: 25 + Math.sin(Date.now() / 2000) * 5 }}
              transition={{ repeat: Number.POSITIVE_INFINITY, duration: 2, delay: 0.7 }}
            ></motion.div>
          </>
        )}

        {/* Flowers - only if unlocked */}
        {hasFlowers && (
          <div className="absolute bottom-64 left-1/2 transform -translate-x-1/2 z-20">
            <div className="relative">
              <div className="absolute w-8 h-8 bg-pink-400 rounded-full -left-10 -top-4"></div>
              <div className="absolute w-10 h-10 bg-purple-400 rounded-full left-6 -top-8"></div>
              <div className="absolute w-12 h-12 bg-yellow-300 rounded-full -left-4 -top-12"></div>

              {/* Flower centers */}
              <div className="absolute w-3 h-3 bg-yellow-600 rounded-full -left-8 -top-2"></div>
              <div className="absolute w-4 h-4 bg-yellow-600 rounded-full left-9 -top-6"></div>
              <div className="absolute w-5 h-5 bg-purple-600 rounded-full -left-1 -top-8"></div>
            </div>
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
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-20 h-20 bg-yellow-300 rounded-full z-30 opacity-50"
          ></motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
