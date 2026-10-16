"use client"

import { useState } from "react"
import { EMAIL_URL, GITHUB_URL, LINKEDIN_URL, SITE_EMAIL } from "@/lib/constants"
import { CALENDAR_URL, HAS_CALENDAR } from "@/lib/redesign/config"
import { useCopy } from "@/lib/redesign/use-copy"

const LINKS = [
  { key: "mail" as const, href: EMAIL_URL },
  { key: "linkedin" as const, href: LINKEDIN_URL },
  { key: "github" as const, href: GITHUB_URL },
]

export function ContactView() {
  const { t } = useCopy()
  const [flipped, setFlipped] = useState(false)
  const [copied, setCopied] = useState(false)

  const copyMail = async () => {
    try {
      await navigator.clipboard.writeText(SITE_EMAIL)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1800)
    } catch {
      setCopied(false)
    }
  }

  return (
    <div
      className="relative flex min-h-svh items-center justify-center overflow-hidden px-5 pb-32 pt-24"
      style={{
        backgroundColor: "#12131A",
        backgroundImage: "radial-gradient(circle, rgba(244,241,234,0.16) 1px, transparent 1px)",
        backgroundSize: "22px 22px",
      }}
    >
      <div className={`contact-card w-[min(100%,26rem)] ${flipped ? "is-flipped" : ""}`}>
        <article className="contact-face rounded-[1.6rem] bg-[#F4F1EA] px-7 py-8 text-[#12131A] shadow-[0_30px_80px_-28px_rgba(0,0,0,0.75)]">
          <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-[#12131A]/50">{t.contactKicker}</p>
          <h1 className="mt-5 font-display text-5xl leading-[0.9] tracking-[-0.05em] sm:text-6xl">{t.contactTitle}</h1>
          <p className="mt-4 max-w-[18rem] text-[#12131A]/70">{t.contactSub}</p>
          {HAS_CALENDAR ? (
            <a
              href={CALENDAR_URL}
              className="press mt-8 inline-flex rounded-full bg-[#1F4BFF] px-5 py-3 font-mono text-sm text-white"
              target="_blank"
              rel="noreferrer"
            >
              {t.ctaButton}
            </a>
          ) : (
            <a
              href={EMAIL_URL}
              className="press mt-8 inline-flex rounded-full bg-[#1F4BFF] px-5 py-3 font-mono text-sm text-white"
            >
              {t.ctaButton}
            </a>
          )}
          <div className="mt-6 flex flex-wrap gap-3">
            <button
              type="button"
              className="press rounded-full border border-[#12131A]/15 px-3 py-2 font-mono text-xs"
              onClick={() => setFlipped(true)}
            >
              {t.contactFlip}
            </button>
            <button
              type="button"
              className="press rounded-full bg-[#12131A] px-3 py-2 font-mono text-xs text-[#F4F1EA]"
              onClick={() => void copyMail()}
            >
              {copied ? t.contactCopied : t.contactCopy}
            </button>
          </div>
          <ul className="mt-8 flex gap-4 font-mono text-sm">
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
        </article>

        <article className="contact-face contact-back flex min-h-full flex-col justify-between rounded-[1.6rem] bg-[#1F4BFF] px-7 py-8 text-[#F4F1EA] shadow-[0_30px_80px_-28px_rgba(0,0,0,0.75)]">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-white/70">mail</p>
            <p className="mt-6 break-all font-display text-4xl tracking-[-0.04em]">{SITE_EMAIL}</p>
          </div>
          <div className="mt-10 flex gap-3">
            <button
              type="button"
              className="press rounded-full bg-[#F4F1EA] px-4 py-2 font-mono text-xs text-[#12131A]"
              onClick={() => void copyMail()}
            >
              {copied ? t.contactCopied : t.contactCopy}
            </button>
            <button
              type="button"
              className="press rounded-full border border-white/30 px-4 py-2 font-mono text-xs"
              onClick={() => setFlipped(false)}
            >
              ←
            </button>
          </div>
        </article>
      </div>
    </div>
  )
}
