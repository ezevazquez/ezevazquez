import type { Metadata } from "next"
import HomePage from "@/components/pages/home-page"
import { generatePageMetadata } from "@/lib/redesign/meta"

export async function generateMetadata(): Promise<Metadata> {
  return generatePageMetadata("home")
}

export default function Home() {
  return <HomePage />
}
