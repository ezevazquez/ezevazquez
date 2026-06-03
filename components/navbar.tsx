"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { useLanguage } from "./language-provider"
import { LanguageSwitcher } from "./language-switch"
import { Menu, X } from "lucide-react"
import { useMobile } from "@/hooks/use-mobile"
import { BOOK_CALL_URL } from "@/lib/constants"
import { PrimaryCTA } from "@/components/shared/cta-buttons"
import { cn } from "@/lib/utils"

export function Navbar() {
  const { t } = useLanguage()
  const pathname = usePathname()
  const [scrolled, setScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const isMobile = useMobile()

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 16)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? "hidden" : ""
    return () => {
      document.body.style.overflow = ""
    }
  }, [mobileMenuOpen])

  const contactHref = pathname === "/" ? "#contact" : "/#contact"

  const navItems = [
    { label: t("nav.home"), href: "/", match: (p: string) => p === "/" },
    { label: t("nav.work"), href: "/work", match: (p: string) => p.startsWith("/work") },
    { label: t("nav.about"), href: "/about", match: (p: string) => p.startsWith("/about") },
    { label: t("nav.contact"), href: contactHref, isContact: true },
  ]

  const scrollToContact = () => {
    setMobileMenuOpen(false)
    if (pathname !== "/") {
      window.location.href = "/#contact"
      return
    }
    document.querySelector("#contact")?.scrollIntoView({ behavior: "smooth" })
  }

  const linkClass = (active: boolean) =>
    cn("nav-link relative py-1", active && "nav-link-active")

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 px-4 sm:px-6 pt-4">
        <motion.nav
          className={cn(
            "max-w-6xl mx-auto flex items-center justify-between gap-4 px-4 sm:px-6 py-3 rounded-2xl transition-all duration-500",
            scrolled
              ? "bg-black/75 backdrop-blur-xl border border-white/[0.08] shadow-[0_8px_32px_-8px_rgba(0,0,0,0.6)]"
              : "bg-transparent border border-transparent"
          )}
          initial={{ y: -24, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          <Link
            href="/"
            className="text-sm font-bold tracking-tight text-white hover:text-primary transition-colors shrink-0"
          >
            {t("nav.brand")}
          </Link>

          {!isMobile ? (
            <>
              <div className="flex items-center gap-7">
                {navItems.map((item) => {
                  const active = !item.isContact && item.match?.(pathname)
                  if (item.isContact) {
                    return (
                      <a
                        key="contact"
                        href={contactHref}
                        onClick={(e) => {
                          e.preventDefault()
                          scrollToContact()
                        }}
                        className={linkClass(false)}
                      >
                        {item.label}
                      </a>
                    )
                  }
                  return (
                    <Link key={item.href} href={item.href} className={linkClass(!!active)}>
                      {item.label}
                      {active && (
                        <span className="absolute -bottom-0.5 left-0 right-0 h-px bg-primary/80" />
                      )}
                    </Link>
                  )
                })}
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <LanguageSwitcher />
                <PrimaryCTA href={BOOK_CALL_URL} className="!h-10 !px-5 !text-xs">
                  {t("nav.bookCall")}
                </PrimaryCTA>
              </div>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <LanguageSwitcher compact />
              <button
                type="button"
                onClick={() => setMobileMenuOpen(true)}
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 text-white hover:bg-white/5 transition-colors"
                aria-label="Open menu"
              >
                <Menu className="h-5 w-5" />
              </button>
            </div>
          )}
        </motion.nav>
      </header>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            className="fixed inset-0 z-[60] bg-black/95 backdrop-blur-xl flex flex-col p-6 pt-24"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            <button
              type="button"
              onClick={() => setMobileMenuOpen(false)}
              className="absolute top-6 right-6 flex h-10 w-10 items-center justify-center rounded-xl border border-white/10"
              aria-label="Close menu"
            >
              <X className="h-5 w-5" />
            </button>

            <nav className="flex flex-col gap-2 flex-1">
              {navItems.map((item, index) => (
                <motion.div
                  key={item.href}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 * index }}
                >
                  {item.isContact ? (
                    <a
                      href={contactHref}
                      onClick={(e) => {
                        e.preventDefault()
                        scrollToContact()
                      }}
                      className="block py-4 text-2xl font-semibold tracking-tight hover:text-primary transition-colors"
                    >
                      {item.label}
                    </a>
                  ) : (
                    <Link
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={cn(
                        "block py-4 text-2xl font-semibold tracking-tight transition-colors",
                        item.match?.(pathname) ? "text-primary" : "text-white hover:text-primary"
                      )}
                    >
                      {item.label}
                    </Link>
                  )}
                </motion.div>
              ))}
            </nav>

            <PrimaryCTA href={BOOK_CALL_URL} className="w-full justify-center !h-12">
              {t("nav.bookCall")}
            </PrimaryCTA>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
