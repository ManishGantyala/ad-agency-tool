import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * Merges Tailwind classes with proper precedence.
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs))
}

/**
 * Formats a date string to a readable relative string.
 */
export function formatRelativeDate(dateStr: string): string {
  const date = new Date(dateStr)
  const today = new Date()
  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)

  if (date.toDateString() === today.toDateString()) return 'Today'
  if (date.toDateString() === tomorrow.toDateString()) return 'Tomorrow'
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

/**
 * Checks if a due date is in the past.
 */
export function isOverdue(dateStr: string): boolean {
  const date = new Date(dateStr)
  const now = new Date()
  date.setHours(23, 59, 59, 999)
  now.setHours(0, 0, 0, 0)
  return date < now
}

/**
 * Delays execution for the given duration.
 */
export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}
