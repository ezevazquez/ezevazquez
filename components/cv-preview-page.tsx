"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { useLanguage } from "./language-provider"
import { ArrowLeft, Download, FileText } from "lucide-react"
import { useRouter } from "next/navigation"
import { Particles } from "./particles"
import { SecondaryCTA } from "@/components/shared/cta-buttons"

export function CVPreviewPage() {
  const { t } = useLanguage()
  const router = useRouter()
  const [pdfUrl, setPdfUrl] = useState<string>("")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    setPdfUrl("/cv/cv-en.pdf")
    setIsLoading(false)
  }, [])

  const downloadCV = () => {
    const link = document.createElement("a")
    link.href = "/cv/cv-en.pdf"
    link.setAttribute("download", "cv-en.pdf")
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="relative min-h-screen bg-black text-white overflow-hidden">
      <div
        className="fixed inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(59,130,246,0.1),transparent)] pointer-events-none"
        aria-hidden
      />
      <Particles className="fixed inset-0 pointer-events-none opacity-70" />

      <div className="relative z-10 section-container px-4 sm:px-6 py-10 md:py-14">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-6">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/15 border border-primary/25">
                <FileText className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h1 className="text-headline text-2xl md:text-3xl">{t("cvPreview.title")}</h1>
                <p className="text-body-muted mt-1">{t("cvPreview.subtitle")}</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2.5 justify-center sm:justify-end items-center">
              <SecondaryCTA href="/" className="!h-11 !px-5 text-sm inline-flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" />
                {t("cvPreview.backToHome")}
              </SecondaryCTA>
              <button type="button" onClick={downloadCV} className="btn-primary-glow !h-11 inline-flex items-center gap-2 text-sm">
                <Download className="h-4 w-4" />
                {t("cvPreview.downloadCV")}
              </button>
            </div>
          </div>

          <div className="glass-card overflow-hidden p-0">
            {isLoading ? (
              <div className="flex items-center justify-center h-[70vh] min-h-[400px]">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-10 w-10 border-2 border-primary/30 border-t-primary mx-auto mb-4" />
                  <p className="text-body-muted">{t("cvPreview.loading")}</p>
                </div>
              </div>
            ) : (
              <iframe
                src={pdfUrl}
                className="w-full h-[75vh] min-h-[480px] md:min-h-[600px]"
                title={t("cvPreview.title")}
                style={{ border: "none" }}
              />
            )}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-10 text-center"
          >
            <p className="text-body-muted mb-5">{t("cvPreview.additionalInfo")}</p>
            <button
              type="button"
              onClick={() => router.push("/#contact")}
              className="btn-primary-glow"
            >
              {t("cvPreview.getInTouch")}
            </button>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}
