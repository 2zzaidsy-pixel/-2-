import { z } from "zod"

export const localized = z.object({
  en: z.string(),
  ar: z.string(),
})

export const siteSchema = z.object({
  image: z.string().min(1),
  description: z.string(),
  contact: z.object({
    email: z.email(),
  }),
})

export const socialSchema = z.array(
  z.object({
    id: z
      .string()
      .min(1)
      .regex(/^[a-z0-9-]+$/, "المعرّف يقبل الحروف اللاتينية الصغيرة والأرقام والشرطة فقط."),
    name: z.string().min(1),
    handle: z.string(),
    url: z.url(),
    color: z.string().min(1),
    description: localized,
    followers: z.number().int().nonnegative().nullable(),
  })
)

export const projectsSchema = z.array(
  z.object({
    id: z
      .string()
      .min(1)
      .regex(/^[a-z0-9-]+$/, "المعرّف يقبل الحروف اللاتينية الصغيرة والأرقام والشرطة فقط."),
    name: z.string().min(1),
    url: z.url(),
    monogram: z.string().min(1),
    gradient: z.string().min(1),
    status: z.literal("live"),
    category: localized,
    description: localized,
    highlights: z.object({
      en: z.array(z.string()),
      ar: z.array(z.string()),
    }),
  })
)

export const fieldIcon = z.enum([
  "brain",
  "users",
  "trending-up",
  "activity",
  "lightbulb",
  "landmark",
  "network",
])

export const fieldsSchema = z.array(
  z.object({
    id: z
      .string()
      .min(1)
      .regex(/^[a-z0-9-]+$/, "المعرّف يقبل الحروف اللاتينية الصغيرة والأرقام والشرطة فقط."),
    title: localized,
    description: localized,
    icon: fieldIcon,
    color: z.string().min(1),
  })
)

export const philosophySchema = z.object({
  philosophies: z.array(
    z.object({
      id: z.string().min(1),
      quote: localized,
      author: localized,
      context: localized,
    })
  ),
  personalPhilosophy: z.object({
    statement: localized,
  }),
})

export const isoDate = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "الصيغة المطلوبة: YYYY-MM-DD")

export const articleFrontmatterSchema = z.object({
  title: z.string().min(1, "العنوان مطلوب"),
  date: isoDate,
  updatedDate: isoDate.optional(),
  category: z.string().min(1, "التصنيف مطلوب"),
  categoryAr: z.string().optional(),
  tags: z.array(z.string()).default([]),
  description: z.string().default(""),
  featured: z.boolean().default(false),
  published: z.boolean().default(true),
})

export const slugSchema = z
  .string()
  .regex(
    /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
    "الرابط المختصر يقبل حروفًا لاتينية صغيرة وأرقامًا وشرطات فقط."
  )

export const articleWriteSchema = z.object({
  locale: z.enum(["en", "ar"]),
  slug: slugSchema,
  renameFrom: slugSchema.optional(),
  frontmatter: articleFrontmatterSchema,
  content: z.string(),
})

export type ArticleFrontmatterInput = z.infer<typeof articleFrontmatterSchema>
export type ArticleWriteInput = z.infer<typeof articleWriteSchema>

export type SiteContent = z.infer<typeof siteSchema>
export type SocialContent = z.infer<typeof socialSchema>
export type ProjectsContent = z.infer<typeof projectsSchema>
export type FieldsContent = z.infer<typeof fieldsSchema>
export type PhilosophyContent = z.infer<typeof philosophySchema>
