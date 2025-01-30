import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

import { BREAKPOINTS } from "@/styles/constants"

/**
 * Combines multiple class names using clsx and tailwind-merge.
 * This utility ensures proper merging of Tailwind CSS classes while handling
 * conditional classes, arrays, and objects.
 *
 * @param inputs - Array of class values (strings, objects, arrays, etc.)
 * @returns Merged and deduplicated class string
 *
 * @example
 * ```ts
 * cn('p-4', { 'bg-blue-500': isActive }, ['text-white', 'rounded'])
 * ```
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Generates a CSS media query string for a given breakpoint.
 * Uses the breakpoints defined in the constants file to ensure
 * consistent responsive behavior across the application.
 *
 * @param breakpoint - Key of the BREAKPOINTS object ('sm', 'md', 'lg', etc.)
 * @returns Media query string in the format "(min-width: {size}px)"
 *
 * @example
 * ```ts
 * getMediaQuery('md') // Returns "(min-width: 768px)"
 * ```
 */
export function getMediaQuery(breakpoint: keyof typeof BREAKPOINTS) {
  return `(min-width: ${BREAKPOINTS[breakpoint]}px)`
}
