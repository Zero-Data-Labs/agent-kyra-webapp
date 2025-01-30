/* eslint-disable no-console */
import type { CaptureContext } from "@sentry/types"

import { commonConfig } from "@/config/common"
import { Sentry } from "@/features/telemetry/sentry"
import type { LogLevel } from "@/features/telemetry/types"

const levelOrder: LogLevel[] = ["error", "warn", "info", "debug"]

const sentryLevelMapping = {
  error: "error",
  warn: "warning",
  info: "info",
  debug: "debug",
} as const

/**
 * Custom logger to use the console.
 *
 * The log level can be configured globally with the environment variable.
 *
 * The console will be used if in "dev" mode which is also defined by an environment variable.
 */
export class Logger {
  private static instances = new Map<string, Logger>()
  private static currentLevelIndex: number = levelOrder.indexOf(
    commonConfig.LOG_LEVEL
  )

  private readonly category: string

  private constructor(category: string) {
    this.category = category
  }

  /**
   * Creates a new instance of the logger.
   *
   * @param category Used to prefix the message in the console.
   */
  static create(category: string) {
    if (Logger.instances.has(category)) {
      return Logger.instances.get(category)!
    }
    const logger = new Logger(category)
    Logger.instances.set(category, logger)
    return logger
  }

  /**
   * Sets the log level for all instances at runtime.
   *
   * @param level The log level to set.
   */
  static setLogLevel(level: LogLevel) {
    Logger.currentLevelIndex = levelOrder.indexOf(level)
  }

  private shouldSkipPrint(level: LogLevel) {
    return (
      levelOrder.indexOf(level) > Logger.currentLevelIndex ||
      (commonConfig.isClient && !commonConfig.DEV_MODE)
    )
  }

  private formatMessage(message: string) {
    return `${new Date().toISOString()} - [${this.category}] ${message}`
  }

  private log(
    level: LogLevel,
    message: string,
    extra?: Record<string, unknown>
  ) {
    if (this.shouldSkipPrint(level)) {
      return
    }

    if (commonConfig.SENTRY_ENABLED && (level === "warn" || level === "info")) {
      Sentry.addBreadcrumb({
        category: this.category,
        level: sentryLevelMapping[level],
        message,
        data: extra,
      })
    }

    const formattedMessage = this.formatMessage(message)

    const formattedExtra: Record<string, unknown>[] = []
    if (extra) {
      formattedExtra.push(extra)
    }

    console[level](formattedMessage, ...formattedExtra)
  }

  public error(error: Error | unknown, sentryCaptureContext?: CaptureContext) {
    if (commonConfig.SENTRY_ENABLED) {
      Sentry.captureException(error, {
        ...sentryCaptureContext,
        tags: {
          // For some reason the `tags` property is not recognise while clearly defined. Not a big deal to ignore the warning given how we use this property here
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          ...sentryCaptureContext?.tags,
          feature: this.category,
        },
      })
    }

    if (this.shouldSkipPrint("error")) {
      return
    }

    // Log the error message with the formatting (timestamp, category)
    this.log("error", error instanceof Error ? error.message : "")

    // Use the standard error logging for the rest of the Error object
    console.error(error)
  }

  public warn(message: string, data?: Record<string, unknown>) {
    this.log("warn", message, data)
  }

  public info(message: string, data?: Record<string, unknown>) {
    this.log("info", message, data)
  }

  public debug(message: string, data?: Record<string, unknown>) {
    this.log("debug", message, data)
  }

  public startTimer(label: string) {
    if (this.shouldSkipPrint("debug")) {
      return () => this.endTimer(label)
    }
    this.debug(`Starting timer: ${label}`)
    console.time(label)
    return () => this.endTimer(label)
  }

  public logTimer(label: string, ...extra: string[]) {
    if (this.shouldSkipPrint("debug")) {
      return
    }
    console.timeLog(label, extra)
  }

  public endTimer(label: string) {
    if (this.shouldSkipPrint("debug")) {
      return
    }
    console.timeEnd(label)
    this.debug(`Timer ended: ${label}`)
  }

  public table(data: unknown[], properties?: string[]) {
    if (this.shouldSkipPrint("debug")) {
      return
    }
    console.table(data, properties)
  }
}
