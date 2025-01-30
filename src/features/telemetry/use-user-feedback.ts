import { useCallback, useEffect, useMemo, useState } from "react"

import { Sentry } from "@/features/telemetry/sentry"

export function useUserFeedback() {
  const [feedback, setFeedback] = useState<ReturnType<
    typeof Sentry.getFeedback
  > | null>(null)

  useEffect(() => {
    setFeedback(Sentry.getFeedback())
  }, [])

  const openForm = useCallback(async () => {
    if (!feedback) {
      return
    }
    const form = await feedback.createForm()
    form.appendToDom()
    form.open()
  }, [feedback])

  const isReady = useMemo(() => !!feedback, [feedback])

  return {
    isReady,
    openForm,
  }
}
