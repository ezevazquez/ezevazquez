/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import { useLanguage } from "../language-provider"
import { Card, CardContent } from "@/components/ui/card"

export function ToolsSection() {
  const { t } = useLanguage()
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, amount: 0.1 })

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
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

  const toolItemVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.4 },
    },
  }

  return (
    <section id="tools" className="py-20 px-4 relative">
      <div className="max-w-5xl mx-auto">
        <motion.div
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="space-y-12"
        >
          <motion.h2 variants={itemVariants} className="text-3xl md:text-4xl font-bold text-center mb-12">
            {t("tools.title")}
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {t("tools.categories").map((category: any, index: number) => (
              <motion.div key={index} variants={itemVariants}>
                <Card className="h-full border border-white/20 bg-gray-900/80 backdrop-blur-xl overflow-hidden shadow-[0_0_15px_rgba(139,92,246,0.1)]">
                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold mb-4 text-primary">{category.name}</h3>
                    <div className="flex flex-wrap gap-2">
                      {category.items.map((tool: string, i: number) => (
                        <motion.span
                          key={i}
                          variants={toolItemVariants}
                          className="px-3 py-1.5 bg-gray-800/80 rounded-full text-sm hover:bg-gray-700/80 transition-colors cursor-default text-gray-200"
                          whileHover={{ scale: 1.05 }}
                        >
                          {tool}
                        </motion.span>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] bg-gradient-radial from-violet-500/10 to-transparent rounded-full blur-3xl -z-10" />
    </section>
  )
}
