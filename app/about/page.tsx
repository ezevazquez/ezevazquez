import type { Metadata } from "next"
import AboutPage from "@/components/pages/about-page"

export const metadata: Metadata = {
  title: "About | Eze Vazquez",
  description:
    "Technical Product Manager and Digital Builder. Professional background, experience and capabilities.",
}

export default function About() {
  return <AboutPage />
}
