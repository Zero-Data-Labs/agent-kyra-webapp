// This file configures the initialization of Sentry for edge features (middleware, edge routes, and so on).
// The config you add here will be used whenever one of the edge features is loaded.
// Note that this config is unrelated to the Vercel Edge Runtime and is also required when running locally.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/
import * as Sentry from "@sentry/nextjs"

import { version } from "@/config/version"
import { APP_PACKAGE_NAME } from "@/constants/app"

Sentry.init({
  enabled: process.env.NEXT_PUBLIC_SENTRY_ENABLED === "true",
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.NEXT_PUBLIC_SENTRY_ENVIRONMENT,
  release: `${APP_PACKAGE_NAME}@${version}`,
  tracesSampleRate: Number(
    process.env.NEXT_PUBLIC_SENTRY_TRACE_SAMPLE_RATE || 0.1
  ),
  debug: false,
})
