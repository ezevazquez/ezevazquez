import type { Metadata } from "next"
import { AboutView } from "@/components/redesign/about-view"
import { generatePageMetadata } from "@/lib/redesign/meta"

export async function generateMetadata(): Promise<Metadata> {
  return generatePageMetadata("about")
}

export default function About() {
  return <AboutView />
}
