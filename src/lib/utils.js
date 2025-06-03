import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

// Original TypeScript signature: export function cn(...inputs: ClassValue[])
export function cn(...inputs) {
  return twMerge(clsx(inputs))
}
