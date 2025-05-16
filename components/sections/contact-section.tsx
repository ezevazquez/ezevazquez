"use client"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import { useLanguage } from "../language-provider"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Github, Linkedin, Mail } from "lucide-react"

export function ContactSection() {
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
    <section id="contact" className="py-20 px-4 relative bg-black/40">
      <div className="max-w-3xl mx-auto">
        <motion.div
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="space-y-8"
        >
          <motion.h2 variants={itemVariants} className="text-3xl md:text-4xl font-bold text-center mb-12">
            {t("contact.title")}
          </motion.h2>

          <Card className="border border-white/10 bg-black/60 backdrop-blur-xl overflow-hidden">
            <CardContent className="p-8 text-center">
              <motion.p variants={itemVariants} className="text-lg mb-8">
                {t("contact.description")}
              </motion.p>

              <motion.div
                variants={itemVariants}
                className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8"
              >
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full sm:w-auto border-white/20 hover:bg-white/5"
                  asChild
                >
                  <a href="https://github.com/ezevazquez" target="_blank" rel="noopener noreferrer">
                    <Github className="mr-2 h-5 w-5" />
                    {t("contact.social.github")}
                  </a>
                </Button>

                <Button
                  variant="outline"
                  size="lg"
                  className="w-full sm:w-auto border-white/20 hover:bg-white/5"
                  asChild
                >
                  <a href="https://linkedin.com/in/ezevazquez" target="_blank" rel="noopener noreferrer">
                    <Linkedin className="mr-2 h-5 w-5" />
                    {t("contact.social.linkedin")}
                  </a>
                </Button>

                <Button
                  variant="outline"
                  size="lg"
                  className="w-full sm:w-auto border-white/20 hover:bg-white/5"
                  asChild
                >
                  <a href={`mailto:${t("contact.email")}`}>
                    <Mail className="mr-2 h-5 w-5" />
                    {t("contact.social.email")}
                  </a>
                </Button>
              </motion.div>

              <motion.div variants={itemVariants} className="text-center">
                <p className="text-gray-400">{t("contact.email")}</p>
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <div className="absolute top-1/2 left-0 w-[300px] h-[300px] bg-gradient-radial from-purple-500/10 to-transparent rounded-full blur-3xl -z-10" />
    </section>
  )
}
