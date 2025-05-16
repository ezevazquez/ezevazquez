"use client"

import { useLanguage } from "./language-provider"
import { Button } from "@/components/ui/button"
import { FileDown } from "lucide-react"
import type { ButtonProps } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface CVDownloadButtonProps extends ButtonProps {
  textKey: string
  className?: string
}

export function CVDownloadButton({ textKey, className, ...props }: CVDownloadButtonProps) {
  const { t, language } = useLanguage()

  const downloadCV = () => {
    const fileName = language === "en" ? "cv-en.pdf" : "cv-es.pdf"
    const link = document.createElement("a")
    link.href = `/cv/${fileName}`
    link.setAttribute("download", fileName)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <Button onClick={downloadCV} className={cn("group", className)} {...props}>
      <FileDown className="mr-2 h-5 w-5 transition-transform group-hover:scale-110" />
      {t(textKey)}
    </Button>
  )
}
