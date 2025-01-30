import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  typescript: {
    // TODO: Enable the check again. This is now to disable next.js checking node_modules type errors on building the app
    ignoreBuildErrors: true,
  },
  webpack: (config, { isServer }) => {
    config.node = {
      __dirname: true,
    }

    config.module.rules.push({
      test: /\.(woff|woff2|eot|ttf|otf)$/,
      use: {
        loader: "file-loader",
        options: {
          name: "[name].[ext]",
          publicPath: "/_next/static/fonts/",
          outputPath: `${isServer ? "../" : ""}static/fonts/`,
        },
      },
    })

    return config
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*",
        port: "",
      },
      {
        protocol: "https",
        hostname: "127.0.0.1",
        port: "5021",
      },
    ],
  },
}

export default nextConfig
