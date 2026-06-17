import type { Metadata } from "next"
import { ProjectsContent } from "./ProjectsContent"
import { constructMetadata } from "@/lib/metadata"

export const metadata: Metadata = constructMetadata({
  title: "Projects",
  description: "Explore my projects including The System - a life management platform for self-development.",
  path: "/projects",
})

export default function ProjectsPage() {
  return <ProjectsContent />
}
