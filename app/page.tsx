import type { Metadata } from "next"
import { HomeView } from "@/components/redesign/home-view"
import { generatePageMetadata } from "@/lib/redesign/meta"

export async function generateMetadata(): Promise<Metadata> {
  return generatePageMetadata("home")
}

export default function Home() {
  return <HomeView />
}
