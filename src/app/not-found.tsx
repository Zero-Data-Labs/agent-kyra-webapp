import Link from "next/link"

import { Button } from "@/components/ui/button"
import {
  NotFoundBlock,
  NotFoundBlockDescription,
  NotFoundBlockImage,
  NotFoundBlockTitle,
} from "@/components/ui/not-found"
import { PlausibleScript } from "@/features/plausible/PlausibleScript"
import { getRootPageRoute } from "@/features/routes/utils"
import { sora } from "@/styles/fonts"
import { cn } from "@/styles/utils"

export default function NotFoundPage() {
  return (
    <html>
      <head>
        <PlausibleScript />
      </head>
      <body className={cn("h-dvh", sora.variable)}>
        <div className="flex h-full flex-1 flex-col items-center justify-center p-4">
          <NotFoundBlock>
            <NotFoundBlockImage />
            <NotFoundBlockTitle>Page Not Found</NotFoundBlockTitle>
            <NotFoundBlockDescription>
              The page you are looking for does not exist.
            </NotFoundBlockDescription>
            <Button asChild variant="outline">
              <Link href={getRootPageRoute()}>Go to the Home page</Link>
            </Button>
          </NotFoundBlock>
        </div>
      </body>
    </html>
  )
}
NotFoundPage.displayName = "NotFoundPage"
