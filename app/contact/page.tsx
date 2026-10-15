import type { Metadata } from "next"
import { ContactView } from "@/components/redesign/contact-view"
import { generatePageMetadata } from "@/lib/redesign/meta"

export async function generateMetadata(): Promise<Metadata> {
  return generatePageMetadata("contact")
}

export default function ContactPage() {
  return <ContactView />
}
