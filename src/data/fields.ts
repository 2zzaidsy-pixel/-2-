export interface Field {
  id: string
  title: string
  titleAr: string
  description: string
  icon: string
  color: string
}

export const fields: Field[] = [
  {
    id: "psychology",
    title: "Psychology",
    titleAr: "علم النفس",
    description: "Exploring the intricacies of the human mind, behavior patterns, and the cognitive processes that shape our perception of reality.",
    icon: "brain",
    color: "from-violet-500 to-purple-600",
  },
  {
    id: "sociology",
    title: "Sociology",
    titleAr: "علم الاجتماع",
    description: "Understanding how societies form, evolve, and influence individual behavior within the complex web of human relationships.",
    icon: "users",
    color: "from-blue-500 to-cyan-600",
  },
  {
    id: "self-development",
    title: "Self Development",
    titleAr: "تطوير الذات",
    description: "Practical frameworks and methodologies for personal growth, habit formation, and unlocking your full potential.",
    icon: "trending-up",
    color: "from-emerald-500 to-teal-600",
  },
  {
    id: "human-behavior",
    title: "Human Behavior",
    titleAr: "السلوك البشري",
    description: "Analyzing the underlying mechanisms of human actions, decision-making, and the subtle forces that drive our choices.",
    icon: "activity",
    color: "from-amber-500 to-orange-600",
  },
  {
    id: "critical-thinking",
    title: "Critical Thinking",
    titleAr: "التفكير النقدي",
    description: "Developing rigorous analytical frameworks to question assumptions, evaluate arguments, and arrive at well-reasoned conclusions.",
    icon: "lightbulb",
    color: "from-rose-500 to-pink-600",
  },
]
