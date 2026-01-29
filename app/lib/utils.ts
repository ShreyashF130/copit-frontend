import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// 🚀 ADD THIS FUNCTION
export function toSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')    // Remove special chars (like emojis, ?, &)
    .replace(/[\s_-]+/g, '-')    // Replace spaces/underscores with -
    .replace(/^-+|-+$/g, '');    // Remove dashes from start/end
}