"use client"

import { useEffect, useState, useRef, useCallback } from "react"
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion"
import { Particles } from "./particles"
import { Card } from "@/components/ui/card"
import { Github, Mail, Linkedin } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"


export default function WorkInProgressPage() {
  const [mounted, setMounted] = useState(false)
  const [progress, setProgress] = useState(0)
  const [height, setHeight] = useState(1000)
  const [width, setWidth] = useState(1000)

  const containerRef = useRef<HTMLDivElement>(null)

  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  const smoothMouseX = useSpring(mouseX, { damping: 50, stiffness: 400 })
  const smoothMouseY = useSpring(mouseY, { damping: 50, stiffness: 400 })

  const rotateX = useTransform(smoothMouseY, [0, height], [5, -5])
  const rotateY = useTransform(smoothMouseX, [0, width], [-5, 5])

  const handleMouseMove = useCallback((e: MouseEvent) => {
    const { clientX, clientY } = e
    mouseX.set(clientX)
    mouseY.set(clientY)
  }, [mouseX, mouseY])

  useEffect(() => {
    setMounted(true)
    if (typeof window !== "undefined") {
      setHeight(window.innerHeight)
      setWidth(window.innerWidth)
      window.addEventListener("mousemove", handleMouseMove)
    }

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 75) {
          clearInterval(timer)
          return 75
        }
        return prev + 1
      })
    }, 50)

    return () => {
      clearInterval(timer)
      window.removeEventListener("mousemove", handleMouseMove)
    }
  }, [handleMouseMove])

  if (!mounted) return null

  return (
    <div ref={containerRef} className="relative h-screen w-full overflow-hidden bg-black text-white">
      <Particles className="absolute inset-0" />

      <motion.div
        className="pointer-events-none absolute h-64 w-64 rounded-full bg-gradient-to-r from-purple-500/30 to-cyan-500/30 blur-3xl"
        style={{
          x: smoothMouseX,
          y: smoothMouseY,
          translateX: "-50%",
          translateY: "-50%",
        }}
      />

      <div className="relative z-10 flex h-full w-full items-center justify-center px-4">
        <motion.div
          style={{ rotateX, rotateY }}
          className="perspective-1000"
        >
          <Card className="w-full max-w-md border border-white/10 bg-black/60 p-8 backdrop-blur-xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-6"
            >
              <div className="space-y-2 text-center">
                <Avatar className="mx-auto mb-4 h-20 w-20 rounded-full p-1 shadow-lg">
                  <AvatarImage src="/profile.png" className="rounded-full object-cover" />
                  <AvatarFallback className="text-white">EV</AvatarFallback>
                </Avatar>
                <h1 className="text-3xl font-bold tracking-tight">Work in Progress</h1>
                <p className="text-muted-foreground">
                  My personal website is currently under construction. Something amazing is coming soon.
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Development progress</span>
                  <span>{progress}%</span>
                </div>
                <Progress value={progress} className="h-2 bg-white/10" />
              </div>

              <div className="flex justify-center space-x-4 pt-2">
                <motion.a
                  href="https://github.com/ezevazquez"
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ y: -3 }}
                  className="rounded-full bg-white/5 p-2 hover:bg-white/10"
                >
                  <Github className="h-5 w-5" />
                </motion.a>
                <motion.a
                  href="https://linkedin.com/in/ezevazquez"
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ y: -3 }}
                  className="rounded-full bg-white/5 p-2 hover:bg-white/10"
                >
                  <Linkedin className="h-5 w-5" />
                </motion.a>
                <motion.a
                  href="mailto:ezejvaz@gmail.com"
                  whileHover={{ y: -3 }}
                  className="rounded-full bg-white/5 p-2 hover:bg-white/10"
                >
                  <Mail className="h-5 w-5" />
                </motion.a>
              </div>
            </motion.div>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
