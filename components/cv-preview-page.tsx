"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { useLanguage } from "./language-provider"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft, Download, FileText } from "lucide-react"
import { useRouter } from "next/navigation"
import { Particles } from "./particles"

export function CVPreviewPage() {
  const { t, language } = useLanguage()
  const router = useRouter()
  const [pdfUrl, setPdfUrl] = useState<string>("")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fileName = language === "en" ? "cv-en.pdf" : "cv-es.pdf"
    setPdfUrl(`/cv/${fileName}`)
    setIsLoading(false)
  }, [language])

  const downloadCV = () => {
    const fileName = language === "en" ? "cv-en.pdf" : "cv-es.pdf"
    const link = document.createElement("a")
    link.href = `/cv/${fileName}`
    link.setAttribute("download", fileName)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const goBack = () => {
    router.push("/")
  }

  return (
    <div className="relative min-h-screen bg-black text-white overflow-hidden">
      <Particles className="fixed inset-0 pointer-events-none" />

      <div className="relative z-10 container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-6xl mx-auto"
        >
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/20">
                <FileText className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold">{t("cvPreview.title")}</h1>
                <p className="text-gray-400 text-sm">{t("cvPreview.subtitle")}</p>
              </div>
            </div>

            <div className="flex gap-3">
              <Button variant="outline" onClick={goBack} className="border-white/20 hover:bg-white/10">
                <ArrowLeft className="mr-2 h-4 w-4" />
                {t("cvPreview.backToHome")}
              </Button>

              <Button
                onClick={downloadCV}
                className="bg-gradient-to-r from-purple-600 to-violet-500 hover:from-purple-700 hover:to-violet-600"
              >
                <Download className="mr-2 h-4 w-4" />
                {t("cvPreview.downloadCV")}
              </Button>
            </div>
          </div>

          {/* CV Preview */}
          <Card className="border border-white/20 bg-gray-900/80 backdrop-blur-xl overflow-hidden shadow-[0_0_15px_rgba(139,92,246,0.1)]">
            <CardContent className="p-0">
              {isLoading ? (
                <div className="flex items-center justify-center h-[800px]">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-gray-400">{t("cvPreview.loading")}</p>
                  </div>
                </div>
              ) : (
                <div className="relative">
                  <iframe
                    src={pdfUrl}
                    className="w-full h-[800px] md:h-[900px] lg:h-[1000px]"
                    title={t("cvPreview.title")}
                    style={{
                      border: "none",
                      borderRadius: "0 0 12px 12px",
                    }}
                  />
                </div>
              )}
            </CardContent>
          </Card>

          {/* Additional Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="mt-8 text-center"
          >
            <p className="text-gray-400 mb-4">{t("cvPreview.additionalInfo")}</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button
                variant="ghost"
                onClick={() => {
                  const contactSection = document.querySelector("#contact")
                  if (contactSection) {
                    router.push("/#contact")
                  } else {
                    router.push("/")
                  }
                }}
                className="hover:bg-white/10"
              >
                {t("cvPreview.getInTouch")}
              </Button>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Background gradients */}
      <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-gradient-radial from-purple-500/10 to-transparent rounded-full blur-3xl -z-10" />
      <div className="absolute bottom-1/4 right-1/4 w-[300px] h-[300px] bg-gradient-radial from-violet-500/10 to-transparent rounded-full blur-3xl -z-10" />
    </div>
  )
}
