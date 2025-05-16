"use client"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import { useLanguage } from "../language-provider"
import { Card, CardContent } from "@/components/ui/card"

export function AboutSection() {
  const { t } = useLanguage()
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, amount: 0.2 })

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  }

  return (
    <section id="about" className="py-20 px-4 relative">
      <div className="max-w-5xl mx-auto">
        <motion.div
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="space-y-8"
        >
          <motion.h2 variants={itemVariants} className="text-3xl md:text-4xl font-bold text-center mb-12">
            {t("about.title")}
          </motion.h2>

          <Card className="border border-white/10 bg-black/60 backdrop-blur-xl overflow-hidden">
            <CardContent className="p-8">
              <div className="space-y-6">
                {t("about.content").map((paragraph: string, index: number) => (
                  <motion.p key={index} variants={itemVariants} className="text-lg leading-relaxed">
                    {paragraph}
                  </motion.p>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-radial from-purple-500/10 to-transparent rounded-full blur-3xl -z-10" />
    </section>
  )
}
