import type { Metadata } from "next"
import WorkPage from "@/components/pages/work-page"

export const metadata: Metadata = {
  title: "Work | Eze Vazquez",
  description: "Digital systems, workflows and prototypes for small businesses.",
}

export default function Work() {
  return <WorkPage />
}
