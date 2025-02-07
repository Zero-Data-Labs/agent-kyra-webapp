import { FlatCompat } from "@eslint/eslintrc"
import eslintConfigPrettier from "eslint-config-prettier"
import eslintPluginPrettierRecommended from "eslint-plugin-prettier/recommended"
import { dirname } from "path"
import { fileURLToPath } from "url"

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const compat = new FlatCompat({
  baseDirectory: __dirname,
})

/**
 * @type {import('eslint').Linter.Config[]}
 */
const config = [
  {
    files: ["src/**/*.{js,jsx,cjs,mjs,ts,tsx,json}"],
  },
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  eslintConfigPrettier,
  eslintPluginPrettierRecommended,
  {
    rules: {
      "@typescript-eslint/no-empty-object-type": "off",
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/no-unused-vars": "warn",
      "no-console": "warn",
      "prettier/prettier": "warn",
    },
  },
]

export default config
