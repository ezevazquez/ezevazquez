import type { Metadata } from "next"
import { WorkView } from "@/components/redesign/work-view"
import { generatePageMetadata } from "@/lib/redesign/meta"

export async function generateMetadata(): Promise<Metadata> {
  return generatePageMetadata("work")
}

export default function Work() {
  return <WorkView />
}
