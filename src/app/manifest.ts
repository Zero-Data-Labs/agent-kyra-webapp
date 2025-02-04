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
        src: "kyra.jpg",
        type: "image/jpg",
        sizes: "400x400",
      },
    ],
  }
}
