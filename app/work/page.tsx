import type { Metadata } from "next"
import WorkPage from "@/components/pages/work-page"
import { generatePageMetadata } from "@/lib/redesign/meta"

export async function generateMetadata(): Promise<Metadata> {
  return generatePageMetadata("work")
}

export default function Work() {
  return <WorkPage />
}
