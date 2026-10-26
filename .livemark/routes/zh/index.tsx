import { createFileRoute } from "@tanstack/react-router"
import { Landing } from "../-landing/Landing.tsx"

export const Route = createFileRoute("/zh/")({
  component: Landing,
})
