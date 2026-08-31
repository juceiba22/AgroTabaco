import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { format } from "date-fns"
import { es } from "date-fns/locale"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: string | Date, pattern = "d 'de' MMMM 'de' yyyy") {
  return format(new Date(date), pattern, { locale: es })
}

export function estimateReadingTime(html: string) {
  const text = html.replace(/<[^>]+>/g, " ")
  const words = text.trim().split(/\s+/).filter(Boolean).length
  const minutes = Math.max(1, Math.round(words / 200))
  return minutes
}
