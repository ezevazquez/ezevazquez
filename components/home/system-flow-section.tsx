"use client"

import { useLanguage } from "@/components/language-provider"
import { Section } from "@/components/shared/section"
import { SectionHeader } from "@/components/shared/section-header"
import { SystemFlow } from "@/components/shared/system-flow"
import { ConversionStrip } from "@/components/shared/conversion-strip"

export function HomeSystemFlowSection() {
  const { t } = useLanguage()
  const nodes = t("home.systemFlow.nodes") as { label: string; description?: string }[]
  const midCta = t("home.midCta") as {
    title: string
    copy: string
    primary: string
    secondary: string
  }

  return (
    <Section variant="muted">
      <SectionHeader
        eyebrow={t("home.systemFlow.eyebrow")}
        title={t("home.systemFlow.title")}
        description={t("home.systemFlow.copy")}
      />
      <SystemFlow nodes={nodes} />
      <p className="mt-8 text-center text-subhead text-base md:text-lg max-w-2xl mx-auto text-gray-300/90">
        {t("home.systemFlow.callout")}
      </p>
      <div className="mt-12">
        <ConversionStrip
          title={midCta.title}
          copy={midCta.copy}
          primaryLabel={midCta.primary}
          secondaryLabel={midCta.secondary}
        />
      </div>
    </Section>
  )
}
