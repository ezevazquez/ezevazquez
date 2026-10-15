import type { Metadata } from "next"
import { ContactView } from "@/components/redesign/contact-view"

export const metadata: Metadata = {
  title: "Contact | Eze Vazquez",
  description: "Let's work together. A short call. Tell me the problem.",
}

export default function ContactPage() {
  return <ContactView />
}
