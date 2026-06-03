"use client"

import { SiteShell } from "@/components/site-shell"
import { ContactCTA } from "@/components/shared/contact-cta"
import { useLanguage } from "@/components/language-provider"
import { HomeHeroSection } from "@/components/home/hero-section"
import { HomeProblemSection } from "@/components/home/problem-section"
import { HomeTransformationSection } from "@/components/home/transformation-section"
import { HomeSystemFlowSection } from "@/components/home/system-flow-section"
import { HomeWhatIBuildSection } from "@/components/home/what-i-build-section"
import { HomeHowIWorkSection } from "@/components/home/how-i-work-section"
import { HomeWhyMeSection } from "@/components/home/why-me-section"

export default function HomePage() {
  const { t } = useLanguage()

  return (
    <SiteShell>
      <HomeHeroSection />
      <HomeProblemSection />
      <HomeTransformationSection />
      <HomeSystemFlowSection />
      <HomeWhatIBuildSection />
      <HomeHowIWorkSection />
      <HomeWhyMeSection />
      <ContactCTA
        title={t("home.finalCta.title")}
        copy={t("home.finalCta.copy")}
      />
    </SiteShell>
  )
}
