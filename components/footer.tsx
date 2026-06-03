"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { useLanguage } from "./language-provider"

export function Footer() {
  const { t } = useLanguage()

  return (
    <footer className="relative py-12 px-4 sm:px-6 border-t border-white/[0.06] bg-black/80">
      <div className="section-glow-top top-0" aria-hidden />
      <div className="section-container">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="flex flex-col md:flex-row items-center justify-between gap-6"
        >
          <p className="text-body-muted text-center md:text-left">{t("footer.copyright")}</p>
          <nav className="flex gap-8" aria-label="Footer">
            {[
              { label: t("nav.home"), href: "/" },
              { label: t("nav.work"), href: "/work" },
              { label: t("nav.about"), href: "/about" },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm font-medium text-gray-500 hover:text-primary transition-colors duration-200"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </motion.div>
      </div>
    </footer>
  )
}
