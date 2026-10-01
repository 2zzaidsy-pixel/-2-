import type { Localized } from "@/lib/i18n"

export interface Field {
  id: string
  title: Localized
  description: Localized
  icon: "brain" | "users" | "trending-up" | "activity" | "lightbulb"
  color: string
}

export const fields: Field[] = [
  {
    id: "psychology",
    title: { en: "Psychology", ar: "علم النفس" },
    description: {
      en: "How attention, memory, and motivation actually behave — and why the popular explanations are usually wrong.",
      ar: "كيف يتصرّف الانتباه والذاكرة والدافعية حقًا، ولماذا التفسيرات الشائعة خاطئة في الغالب.",
    },
    icon: "brain",
    color: "from-violet-500 to-purple-600",
  },
  {
    id: "behavior",
    title: { en: "Human behavior", ar: "السلوك البشري" },
    description: {
      en: "The gap between what people say they want and what they actually do with a free afternoon.",
      ar: "الفجوة بين ما يقوله الناس إنهم يريدونه وما يفعلونه فعلًا في وقت فراغ.",
    },
    icon: "activity",
    color: "from-amber-500 to-orange-600",
  },
  {
    id: "building",
    title: { en: "Building products", ar: "بناء المنتجات" },
    description: {
      en: "Shipping small, fast web products and reading the feedback the product gives you for free.",
      ar: "إطلاق منتجات ويب صغيرة وسريعة، وقراءة التغذية الراجعة التي يعطيها لك المنتج مجانًا.",
    },
    icon: "trending-up",
    color: "from-emerald-500 to-teal-600",
  },
  {
    id: "sociology",
    title: { en: "Social influence", ar: "التأثير الاجتماعي" },
    description: {
      en: "How groups shape individual judgment, from the comments under a video to the price on a page.",
      ar: "كيف تُشكّل الجماعات الحكم الفردي، من تعليقات الفيديو إلى السعر في الصفحة.",
    },
    icon: "users",
    color: "from-blue-500 to-cyan-600",
  },
  {
    id: "critical-thinking",
    title: { en: "Critical thinking", ar: "التفكير النقدي" },
    description: {
      en: "Checking claims before believing them, and building arguments you can defend without flinching.",
      ar: "التحقق من الادعاءات قبل تصديقها، وبناء حجج تستطيع الدفاع عنها دون تردد.",
    },
    icon: "lightbulb",
    color: "from-rose-500 to-pink-600",
  },
]
