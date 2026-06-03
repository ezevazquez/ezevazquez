import type { Metadata } from "next"
import HomePage from "@/components/pages/home-page"

export const metadata: Metadata = {
  title: "Eze Vazquez | Digital Builder",
  description: "Simple websites, automations and AI workflows for small businesses.",
}

export default function Home() {
  return <HomePage />
}
