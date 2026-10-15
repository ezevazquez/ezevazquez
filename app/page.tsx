import type { Metadata } from "next"
import HomePage from "@/components/pages/home-page"

export const metadata: Metadata = {
  title: "Eze Vazquez | Technical PM",
  description:
    "Technical PM. I build systems that work for you. Teams, processes, and operations with AI, built around your problem.",
}

export default function Home() {
  return <HomePage />
}
