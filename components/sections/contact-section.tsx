"use client"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import { useLanguage } from "../language-provider"
import { Card, CardContent } from "@/components/ui/card"
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

  const contactLinks = [
    {
      name: "GitHub",
      icon: <Github className="h-5 w-5" />,
      url: "https://github.com/ezevazquez",
      displayUrl: "github.com/ezevazquez",
      color: "bg-gray-800 hover:bg-gray-700 text-white",
    },
    {
      name: "LinkedIn",
      icon: <Linkedin className="h-5 w-5" />,
      url: "https://linkedin.com/in/ezevazquez",
      displayUrl: "linkedin.com/in/ezevazquez",
      color: "bg-[#0077B5] hover:bg-[#0066a1] text-white",
    },
    {
      name: "Email",
      icon: <Mail className="h-5 w-5" />,
      url: `mailto:${t("contact.email")}`,
      displayUrl: t("contact.email"),
      color: "bg-purple-600 hover:bg-purple-700 text-white",
    },
  ]

  return (
    <section id="contact" className="py-20 px-4 relative bg-black/40">
      <div className="max-w-4xl mx-auto">
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

          <Card className="border border-white/20 bg-gray-900/80 backdrop-blur-xl overflow-hidden shadow-[0_0_15px_rgba(139,92,246,0.1)]">
            <CardContent className="p-8">
              <motion.p variants={itemVariants} className="text-lg mb-10 text-center text-gray-200">
                {t("contact.description")}
              </motion.p>

              <motion.div variants={itemVariants} className="flex flex-col space-y-4">
                {contactLinks.map((link, index) => (
                  <a
                    key={index}
                    href={link.url}
                    target={link.name !== "Email" ? "_blank" : undefined}
                    rel={link.name !== "Email" ? "noopener noreferrer" : undefined}
                    className="block w-full"
                  >
                    <div
                      className={`flex items-center p-4 rounded-lg ${link.color} transition-all duration-300 hover:translate-y-[-2px] hover:shadow-lg`}
                    >
                      <div className="flex items-center justify-center w-10 h-10 rounded-full bg-white/20 mr-4">
                        {link.icon}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-medium opacity-80">{link.name}</span>
                        <span className="font-medium">{link.displayUrl}</span>
                      </div>
                    </div>
                  </a>
                ))}
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <div className="absolute top-1/2 left-0 w-[300px] h-[300px] bg-gradient-radial from-purple-500/10 to-transparent rounded-full blur-3xl -z-10" />
    </section>
  )
}
