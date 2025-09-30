/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import { useLanguage } from "../language-provider"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CVDownloadButton } from "../cv-download-button"

export function ExperienceSection() {
  const { t, language } = useLanguage()

  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, amount: 0.1 })

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
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  }

  return (
    <section id="experience" className="py-20 px-4 relative bg-black/40">
      <div className="max-w-5xl mx-auto">
        <motion.div
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="space-y-12"
        >
          <div className="flex flex-col md:flex-row justify-between items-center mb-12">
            <motion.h2
              variants={itemVariants}
              className="text-3xl md:text-4xl font-bold text-center md:text-left mb-4 md:mb-0"
            >
              {t("experience.title")}
            </motion.h2>

            <motion.div variants={itemVariants}>
              <CVDownloadButton
                textKey="experience.downloadCV"
                variant="outline"
                className="border-white/20 hover:bg-white/10"
                directDownload={true}
              />
            </motion.div>
          </div>

          <div className="space-y-8">
            {t("experience.items").map((item: any, index: number) => (
              <motion.div key={index} variants={itemVariants}>
                <Card className="border border-white/20 bg-gray-900/80 backdrop-blur-xl overflow-hidden shadow-[0_0_15px_rgba(139,92,246,0.1)]">
                  <CardContent className="p-6 md:p-8">
                    <div className="flex flex-col md:flex-row md:items-start gap-4 md:gap-8">
                      <div className="md:w-1/3">
                        <Badge
                          variant="outline"
                          className="mb-2 text-xs font-normal border-blue-400/30 text-blue-300"
                        >
                          {item.period}
                        </Badge>
                        <h3 className="text-xl font-bold mb-1 text-white">{item.role}</h3>
                        <p className="text-primary">{item.company}</p>
                      </div>

                      <div className="md:w-2/3">
                        <p className="text-gray-200 mb-4">{item.description}</p>
                        <div className="space-y-2">
                          <h4 className="text-sm font-medium text-gray-300">
                            {language === "es" ? "Experiencias:" : "Key Achievements:"}
                          </h4>
                          <ul className="list-disc pl-5 space-y-1">
                            {item.achievements.map((achievement: string, i: number) => (
                              <li key={i} className="text-sm text-gray-200">
                                {achievement}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      <div className="absolute top-1/2 right-0 w-[300px] h-[300px] bg-gradient-radial from-cyan-500/10 to-transparent rounded-full blur-3xl -z-10" />
    </section>
  )
}
