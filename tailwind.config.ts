import tailwindContainerQueriesPlugin from "@tailwindcss/container-queries"
import tailwindFormsPlugin from "@tailwindcss/forms"
import tailwindTypographyPlugin from "@tailwindcss/typography"
import type { Config } from "tailwindcss"
import tailwindAnimatePlugin from "tailwindcss-animate"
import { fontFamily } from "tailwindcss/defaultTheme"

const config = {
  darkMode: ["class"],
  safelist: ["dark"],
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    fontFamily: {
      sans: ["var(--font-sora)", ...fontFamily.sans],
    },
    extend: {
      backgroundImage: {
        "gradient-conic":
          "conic-gradient(from -90deg at 50% 100%, #5354D1 0deg, #F7F8FA 234deg)", // TODO: To rework
        "radial-gradient":
          "radial-gradient(61% 61% at 50% 50%, #7986F7 0%, #5354D1 100%)", // TODO: To rework
        "ai-assistant-gradient":
          "radial-gradient(156% 83% at 27% 13%, #D14DF1 0%, #7755F1 44.01%, #37E0C9 100%)",
      },
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        surface: {
          DEFAULT: "hsl(var(--surface))",
          hover: "hsl(var(--surface-hover))",
          active: "hsl(var(--surface-active))",
        },
        overlay: "hsl(var(--overlay) / 0.4)",
        ring: "hsl(var(--ring))",
        input: "hsl(var(--input))",
        border: {
          DEFAULT: "hsl(var(--border))",
          hover: "hsl(var(--border-hover))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
          hover: "hsl(var(--accent-hover))",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
          hover: "hsl(var(--primary-hover))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
          hover: "hsl(var(--destructive-hover))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        status: {
          success: {
            DEFAULT: "hsl(var(--status-success))",
            foreground: "hsl(var(--status-success-foreground))",
          },
          added: {
            DEFAULT: "hsl(var(--status-added))",
            foreground: "hsl(var(--status-added-foreground))",
          },
          approved: {
            DEFAULT: "hsl(var(--status-approved))",
            foreground: "hsl(var(--status-approved-foreground))",
          },
          secured: {
            DEFAULT: "hsl(var(--status-secured))",
            foreground: "hsl(var(--status-secured-foreground))",
          },
          connected: {
            DEFAULT: "hsl(var(--status-connected))",
            foreground: "hsl(var(--status-connected-foreground))",
          },
          info: {
            DEFAULT: "hsl(var(--status-info))",
            foreground: "hsl(var(--status-info-foreground))",
          },
          warning: {
            DEFAULT: "hsl(var(--status-warning))",
            foreground: "hsl(var(--status-warning-foreground))",
          },
          error: {
            DEFAULT: "hsl(var(--status-error))",
            foreground: "hsl(var(--status-error-foreground))",
          },
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      fontSize: {
        "heading-1": [
          "2rem",
          {
            lineHeight: "130%",
            fontWeight: "700",
          },
        ],
        "heading-2": [
          "1.5rem",
          {
            lineHeight: "140%",
            fontWeight: "600",
          },
        ],
        "heading-3": [
          "1.25rem",
          {
            lineHeight: "140%",
            fontWeight: "600",
          },
        ],
        "heading-4": [
          "1.125rem",
          {
            lineHeight: "140%",
            fontWeight: "600",
          },
        ],
        "heading-5": [
          "1rem",
          {
            lineHeight: "140%",
            fontWeight: "600",
          },
        ],
        "base-l": [
          "1rem",
          {
            lineHeight: "140%",
            fontWeight: "400",
          },
        ],
        "base-s-regular": [
          "0.75rem",
          {
            lineHeight: "140%",
            fontWeight: "400",
          },
        ],
        "base-s-semibold": [
          "0.75rem",
          {
            lineHeight: "140%",
            fontWeight: "600",
          },
        ],
        "base-regular": [
          "0.875rem",
          {
            lineHeight: "140%",
            fontWeight: "400",
          },
        ],
        "base-semibold": [
          "0.875rem",
          {
            lineHeight: "140%",
            fontWeight: "600",
          },
        ],
        "desktop-heading-1": [
          "2.5rem",
          {
            lineHeight: "130%",
            fontWeight: "700",
          },
        ],
        "desktop-heading-2": [
          "2rem",
          {
            lineHeight: "140%",
            fontWeight: "600",
          },
        ],
        "desktop-heading-3": [
          "1.5rem",
          {
            lineHeight: "140%",
            fontWeight: "600",
          },
        ],
        "desktop-heading-4": [
          "1.25rem",
          {
            lineHeight: "140%",
            fontWeight: "600",
          },
        ],
        "desktop-heading-5": [
          "1rem",
          {
            lineHeight: "140%",
            fontWeight: "600",
          },
        ],
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "spin-slow": "spin 4s linear infinite",
      },
    },
  },
  plugins: [
    tailwindAnimatePlugin,
    tailwindFormsPlugin,
    tailwindTypographyPlugin,
    tailwindContainerQueriesPlugin,
  ],
} satisfies Config

export default config
