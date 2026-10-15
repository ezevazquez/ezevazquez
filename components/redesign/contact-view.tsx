"use client"

import { motion } from "framer-motion"
import { EMAIL_URL, GITHUB_URL, LINKEDIN_URL } from "@/lib/constants"
import { useCopy } from "@/lib/redesign/use-copy"

const LINKS = [
  { key: "mail" as const, href: EMAIL_URL },
  { key: "linkedin" as const, href: LINKEDIN_URL },
  { key: "github" as const, href: GITHUB_URL },
]

export function ContactView() {
  const { t } = useCopy()

  return (
    <div
      className="flex min-h-svh items-center justify-center overflow-hidden px-5 pb-32 pt-24"
      style={{
        backgroundColor: "#12131A",
        backgroundImage: "radial-gradient(circle, rgba(244,241,234,0.16) 1px, transparent 1px)",
        backgroundSize: "22px 22px",
      }}
    >
      <div className="flex flex-col items-center">
        <motion.article
          initial={{ y: -48, rotate: -8, opacity: 0 }}
          animate={{ y: 0, rotate: -3, opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.18, ease: [0.23, 1, 0.32, 1] }}
          className="w-[min(100%,26rem)] rounded-[1.6rem] bg-[#F4F1EA] px-7 py-8 text-[#12131A] shadow-[0_30px_80px_-28px_rgba(0,0,0,0.75)]"
        >
          <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-[#12131A]/50">{t.contactKicker}</p>
          <h1 className="mt-5 font-display text-5xl leading-[0.9] tracking-[-0.05em] sm:text-6xl">
            {t.contactTitle}
          </h1>
          <p className="mt-4 max-w-[16rem] text-[#12131A]/70">{t.contactSub}</p>
          <a
            href={EMAIL_URL}
            className="press mt-8 inline-flex rounded-full bg-[#1F4BFF] px-5 py-3 font-mono text-sm text-white"
          >
            {t.ctaButton}
          </a>
          <ul className="mt-10 flex gap-4 font-mono text-sm">
            {LINKS.map((link) => (
              <li key={link.key}>
                <a
                  href={link.href}
                  className="press text-[#12131A] underline-offset-4 hover:underline"
                  target={link.href.startsWith("http") ? "_blank" : undefined}
                  rel={link.href.startsWith("http") ? "noreferrer" : undefined}
                >
                  /{t[link.key].toLowerCase()}/
                </a>
              </li>
            ))}
          </ul>
        </motion.article>
      </div>
    </div>
  )
}
