/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"

import { useRef } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import { useLanguage } from "../language-provider"
import { Button } from "@/components/ui/button"
import { ChevronDown } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { CVDownloadButton } from "../cv-download-button"

export function HeroSection() {
  const { t, language } = useLanguage()
  const ref = useRef<HTMLDivElement>(null)

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  })

  const y = useTransform(scrollYProgress, [0, 1], [0, 200])
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])

  const scrollToAbout = () => {
    const aboutSection = document.querySelector("#about")
    if (aboutSection) {
      aboutSection.scrollIntoView({ behavior: "smooth" })
    }
  }

  return (
    <motion.div
      ref={ref}
      className="relative h-screen flex items-center justify-center px-4 overflow-hidden"
      style={{ opacity }}
    >
      <motion.div className="absolute inset-0 flex items-center justify-center" style={{ y }}>
        <div className="absolute inset-0 bg-gradient-radial from-blue-500/10 to-transparent opacity-50" />
      </motion.div>

      <div className="relative z-10 max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <Avatar className="mx-auto h-32 w-32 border-2 border-primary/50 p-1 shadow-lg">
            <AvatarImage src="/profile.png" className="rounded-full object-cover" />
            <AvatarFallback className="text-4xl">EV</AvatarFallback>
          </Avatar>
        </motion.div>

        <motion.p
          className="text-lg text-primary mb-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          {t("hero.greeting")}
        </motion.p>

        <motion.h1
          className="text-5xl md:text-7xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white to-blue-300"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          {t("hero.name")}
        </motion.h1>

        <motion.h2
          className="text-2xl md:text-3xl font-medium mb-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          {t("hero.title")}
        </motion.h2>

        <motion.p
          className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          {t("hero.subtitle")}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="flex flex-col sm:flex-row gap-2.5 justify-center items-center"
        >
          <Button
            size="lg"
            onClick={() => {
              const contactSection = document.querySelector("#contact")
              if (contactSection) {
                contactSection.scrollIntoView({ behavior: "smooth" })
              }
            }}
            className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600"
          >
            {t("hero.cta")}
          </Button>

          <CVDownloadButton
            textKey="hero.downloadCV"
            size="lg"
            variant="outline"
            className="border-white/20 hover:bg-white/10"
          />
        </motion.div>
      </div>

      <motion.div
        className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.5, repeat: Number.POSITIVE_INFINITY, repeatType: "reverse" }}
      >
        <Button variant="ghost" size="icon" onClick={scrollToAbout}>
          <ChevronDown className="h-6 w-6" />
        </Button>
      </motion.div>
    </motion.div>
  )
}
