import type { Metadata } from "next"
import AboutPage from "@/components/pages/about-page"

export const metadata: Metadata = {
  title: "About | Eze Vazquez",
  description: "From 2018 to now. Work, studies, and side projects.",
}

export default function About() {
  return <AboutPage />
}
