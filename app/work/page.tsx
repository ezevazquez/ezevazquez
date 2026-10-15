import type { Metadata } from "next"
import WorkPage from "@/components/pages/work-page"

export const metadata: Metadata = {
  title: "Work | Eze Vazquez",
  description: "Technical project management, AI automation, and custom systems.",
}

export default function Work() {
  return <WorkPage />
}
