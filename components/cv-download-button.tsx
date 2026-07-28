"use client"

import { useLanguage } from "./language-provider"
import { Button } from "@/components/ui/button"
import { FileDown } from "lucide-react"
import type { ButtonProps } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useRouter } from "next/navigation"

interface CVDownloadButtonProps extends ButtonProps {
  textKey: string
  className?: string
  directDownload?: boolean
}

export function CVDownloadButton({ textKey, className, directDownload = false, ...props }: CVDownloadButtonProps) {
  const { t } = useLanguage()
  const router = useRouter()

  const handleClick = () => {
    if (directDownload) {
      // Direct download functionality
      const fileName = "cv-en.pdf"
      const link = document.createElement("a")
      link.href = `/cv/${fileName}`
      link.setAttribute("download", fileName)
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    } else {
      // Navigate to CV preview page
      router.push("/cv")
    }
  }

  return (
    <Button onClick={handleClick} className={cn("group !rounded-full", className)} {...props}>
      <FileDown className="mr-2 h-5 w-5 transition-transform group-hover:scale-110" />
      {t(textKey)}
    </Button>
  )
}
