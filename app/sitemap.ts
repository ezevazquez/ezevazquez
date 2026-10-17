import type { MetadataRoute } from "next"
import { WEBSITE_URL } from "@/lib/constants"

const PATHS = ["", "/about", "/work", "/contact", "/cv"] as const

export default function sitemap(): MetadataRoute.Sitemap {
  return PATHS.map((path) => ({
    url: `${WEBSITE_URL}${path}`,
    changeFrequency: path === "" ? "weekly" : "monthly",
    priority: path === "" ? 1 : 0.7,
  }))
}
