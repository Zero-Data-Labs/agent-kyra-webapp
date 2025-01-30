import type { MetadataRoute } from "next"

import { APP_DESCRIPTION, APP_TITLE } from "@/constants/app"

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: APP_TITLE,
    short_name: APP_TITLE,
    description: APP_DESCRIPTION,
    start_url: "/",
    display: "standalone",
    theme_color: "#ffffff",
    background_color: "#ffffff",
    icons: [
      {
        src: "favicon.ico",
        type: "image/png",
        sizes: "64x64",
      },
      {
        src: "logo64.png",
        type: "image/png",
        sizes: "64x64",
      },
      {
        src: "logo128.png",
        type: "image/png",
        sizes: "128x128",
      },
      {
        src: "logo256.png",
        type: "image/png",
        sizes: "256x256",
      },
      {
        src: "logo512.png",
        type: "image/png",
        sizes: "512x512",
      },
    ],
  }
}
