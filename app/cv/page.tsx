import type { Metadata } from "next"
import { CVPreviewPage } from "@/components/cv-preview-page"
import { generatePageMetadata } from "@/lib/redesign/meta"

export async function generateMetadata(): Promise<Metadata> {
  return generatePageMetadata("cv")
}

export default function CVPreview() {
    return <CVPreviewPage />
}