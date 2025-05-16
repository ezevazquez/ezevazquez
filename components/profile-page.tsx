"use client"

import { Particles } from "./particles"
import { Navbar } from "./navbar"
import { HeroSection } from "./sections/hero-section"
import { AboutSection } from "./sections/about-section"
import { ExperienceSection } from "./sections/experience-section"
import { ToolsSection } from "./sections/tools-section"
import { ContactSection } from "./sections/contact-section"
import { Footer } from "./footer"

export default function ProfilePage() {
  return (
    <div className="relative min-h-screen bg-black text-white overflow-hidden">
      <Particles className="fixed inset-0 pointer-events-none" />
      <Navbar />
      <main>
        <HeroSection />
        <AboutSection />
        <ExperienceSection />
        <ToolsSection />
        <ContactSection />
      </main>
      <Footer />
    </div>
  )
}
