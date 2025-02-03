import { intlFormat, isToday, isYesterday } from "date-fns"

export const LONG_DATE_FORMAT_OPTIONS: Intl.DateTimeFormatOptions = {
  month: "short",
  day: "numeric",
  year: "numeric",
}

export const SHORT_DATE_FORMAT_OPTIONS: Intl.DateTimeFormatOptions = {
  month: "2-digit",
  day: "2-digit",
  year: "2-digit",
}

export const SHORT_TIME_FORMAT_OPTIONS: Intl.DateTimeFormatOptions = {
  hour: "numeric",
  minute: "2-digit",
  hour12: true,
}

export const LONG_DATE_TIME_FORMAT_OPTIONS: Intl.DateTimeFormatOptions = {
  month: "short",
  day: "numeric",
  year: "numeric",
  hour: "numeric",
  minute: "2-digit",
  hour12: true,
}

export const SHORT_DATE_TIME_FORMAT_OPTIONS: Intl.DateTimeFormatOptions = {
  month: "2-digit",
  day: "2-digit",
  year: "numeric",
  hour: "numeric",
  minute: "2-digit",
  hour12: true,
}

type FormatTimeDistanceOptions = {
  compact?: boolean
  format?: Intl.DateTimeFormatOptions
}

const defaultFormatTimeDistanceOptions: FormatTimeDistanceOptions = {
  compact: false,
  format: SHORT_TIME_FORMAT_OPTIONS,
}

/**
 * Formats the time distance from a date to the current time.
 * Wrapper around formatTimeDistance that uses current time as reference.
 *
 * @param date - The date to format
 * @param options - Formatting options (see formatTimeDistance)
 * @param options.compact - Use compact format (e.g. "2 min" vs "2 minutes")
 * @param options.format - Custom Intl.DateTimeFormatOptions for date/time
 * @returns Formatted time distance string
 */
export function formatTimeDistanceFromNow(
  date: Date,
  options?: FormatTimeDistanceOptions
): string {
  const resolvedOptions = Object.assign(
    {},
    defaultFormatTimeDistanceOptions,
    options
  )

  const now = new Date()

  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

  // If less than 1 minute ago, show seconds
  if (diffInSeconds < 60) {
    return `${diffInSeconds} ${resolvedOptions.compact ? "sec" : "seconds"} ago`
  }

  // If less than 1 hour ago, show minutes
  const diffInMinutes = Math.floor(diffInSeconds / 60)
  if (diffInMinutes < 60) {
    return `${diffInMinutes} ${resolvedOptions.compact ? "min" : "minutes"} ago`
  }

  // If same day, show time only
  if (isToday(date)) {
    return intlFormat(date, resolvedOptions.format || SHORT_TIME_FORMAT_OPTIONS)
  }

  // Otherwise show date only
  return intlFormat(date, resolvedOptions.format || SHORT_TIME_FORMAT_OPTIONS)
}
type FormatDateDistanceOptions = {
  format?: Intl.DateTimeFormatOptions
}

/**
 * Formats a date relative to today, showing "Today", "Yesterday", or the formatted date
 *
 * @param date - The date to format
 * @param options - Formatting options
 * @param options.format - Custom Intl.DateTimeFormatOptions for date formatting
 * @returns "Today", "Yesterday", or formatted date string using intlFormat
 */
export function formatDateDistanceFromNow(
  date: Date,
  options?: FormatDateDistanceOptions
): string {
  if (isToday(date)) {
    return "Today"
  }

  if (isYesterday(date)) {
    return `Yesterday`
  }

  return intlFormat(date, options?.format || SHORT_DATE_FORMAT_OPTIONS)
}
