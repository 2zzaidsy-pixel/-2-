export interface Project {
  id: string
  title: string
  description: string
  longDescription: string
  status: "active" | "coming-soon" | "archived"
  href: string
  tags: string[]
  gradient: string
}

export const projects: Project[] = [
  {
    id: "the-system",
    title: "The System",
    description: "A life management platform for self-development, turning goals into an interactive, measurable journey.",
    longDescription: "The System is a comprehensive platform designed to transform how you approach life management and personal development. It combines psychological principles, data-driven insights, and gamification to create an engaging framework for achieving your goals. Track your progress, build habits, and unlock your full potential through a structured yet flexible system that adapts to your unique journey.",
    status: "active",
    href: "https://example.com/the-system",
    tags: ["Life Management", "Self Development", "Goal Tracking", "Habit Building"],
    gradient: "from-indigo-500 via-purple-500 to-pink-500",
  },
  {
    id: "coming-soon",
    title: "More Coming Soon",
    description: "New projects and explorations are on the horizon.",
    longDescription: "I'm constantly working on new ideas and projects. Stay tuned for more tools, frameworks, and explorations at the intersection of psychology, technology, and human potential.",
    status: "coming-soon",
    href: "#",
    tags: ["Psychology", "Technology", "Human Potential"],
    gradient: "from-slate-400 to-slate-600",
  },
]
