import type { MetadataRoute } from "next"

import { APP_DESCRIPTION, APP_NAME, APP_TITLE } from "@/constants/app"

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: APP_TITLE,
    short_name: APP_NAME,
    description: APP_DESCRIPTION,
    start_url: "/",
    display: "standalone",
    theme_color: "#ffffff",
    background_color: "#ffffff",
    icons: [
      {
        src: "icon.png",
        type: "image/png",
        sizes: "512x512",
      },
    ],
  }
}
