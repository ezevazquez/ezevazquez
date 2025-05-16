"use client"

import { motion } from "framer-motion"
import { useLanguage } from "./language-provider"

export function Footer() {
  const { t } = useLanguage()

  return (
    <footer className="py-8 px-4 border-t border-white/10 bg-black/60 backdrop-blur-sm">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center text-sm text-gray-400"
        >
          {t("footer.copyright")}
        </motion.div>
      </div>
    </footer>
  )
}
