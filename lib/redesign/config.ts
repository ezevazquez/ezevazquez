/**
 * Site config placeholders.
 * Swap CALENDAR_URL when Eze shares the Google Calendar booking link.
 */
export const CALENDAR_URL =
  process.env.NEXT_PUBLIC_CALENDAR_URL?.trim() || ""

export const HAS_CALENDAR = CALENDAR_URL.length > 0

export const LOADER_STORAGE_KEY = "eze-loader"
export const STICKER_STORAGE_KEY = "eze-stickers"
export const ABOUT_PROGRESS_KEY = "eze-about-progress"
export const LANGUAGE_STORAGE_KEY = "ezevazquez-language"
