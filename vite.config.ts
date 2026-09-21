import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import tailwindcss from "@tailwindcss/vite"

// The `base` controls the public path when deployed.
// For GitHub Pages under a repo, set it to "/<repo-name>/".
// Override with the BASE_PATH env var in CI, defaults to "/javascript-weird/".
// Locally (dev) it falls back to "/".
const base = process.env.BASE_PATH ?? (process.env.NODE_ENV === "production" ? "/javascript-weird/" : "/")

export default defineConfig({
  base,
  plugins: [react(), tailwindcss()],
  server: {
    port: 3000,
    host: true,
    allowedHosts: true,
  },
})
