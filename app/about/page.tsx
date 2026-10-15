import type { Metadata } from "next"
import AboutPage from "@/components/pages/about-page"
import { generatePageMetadata } from "@/lib/redesign/meta"

export async function generateMetadata(): Promise<Metadata> {
  return generatePageMetadata("about")
}

export default function About() {
  return <AboutPage />
}
