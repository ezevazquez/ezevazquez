"use client"

import type { ReactNode } from "react"
import { Particles } from "./particles"
import { Navbar } from "./navbar"
import { Footer } from "./footer"

export function SiteShell({ children }: { children: ReactNode }) {
  return (
    <div className="relative min-h-screen bg-black text-white overflow-x-hidden selection:bg-primary/30">
      <div
        className="fixed inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(59,130,246,0.12),transparent)] pointer-events-none z-0"
        aria-hidden
      />
      <Particles className="fixed inset-0 pointer-events-none opacity-80" />
      <Navbar />
      <main className="relative z-[1]">{children}</main>
      <Footer />
    </div>
  )
}
