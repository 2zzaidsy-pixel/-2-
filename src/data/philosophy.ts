import type { Localized } from "@/lib/i18n"

export interface Philosophy {
  id: string
  quote: Localized
  author: Localized
  context: Localized
}

export const philosophies: Philosophy[] = [
  {
    id: "unexamined-life",
    quote: {
      en: "The unexamined life is not worth living.",
      ar: "الحياة التي لا تُفحص لا تستحق أن تُعاش.",
    },
    author: { en: "Socrates", ar: "سقراط" },
    context: {
      en: "A standing reminder: the cheapest available advantage is looking at your own defaults before you defend them.",
      ar: "تذكير دائم: أرخص ميزة متاحة هي أن تفحص افتراضاتك قبل أن تدافع عنها.",
    },
  },
  {
    id: "know-thyself",
    quote: {
      en: "Know thyself.",
      ar: "اعرف نفسك.",
    },
    author: {
      en: "Inscribed at the Temple of Apollo",
      ar: "منقوش على معبد أبولّون",
    },
    context: {
      en: "Self-knowledge is the only input you can optimize. Everything else is a symptom of what you already believe.",
      ar: "المعرفة بالنفس هي المُدخل الوحيد الذي يمكنك تحسينه. كل ما عداه عَرَض لما تصدّقه أصلًا.",
    },
  },
  {
    id: "attitudes",
    quote: {
      en: "The greatest discovery of my generation is that human beings can alter their lives by altering their attitudes of mind.",
      ar: "أعظم اكتشاف أضافه جيلي هو أن الإنسان يستطيع أن يغيّر حياته إذا غيّر طريقة تفكيره.",
    },
    author: {
      en: "Commonly attributed to Albert Schweitzer",
      ar: "يُنسب عادةً إلى ألبرت شفايتزر",
    },
    context: {
      en: "The attribution is disputed, which is exactly the point: attitudes are upstream of outcomes, and a claim you never check is a claim you never tested.",
      ar: "نسبة الاقتباس محلّ شكّ، وهذا هو بيت القصيد: الموقف يسبق النتائج، والادعاء الذي لا تتحقق منه هو ادعاء لم تختبره بعد.",
    },
  },
]

export const personalPhilosophy = {
  statement: {
    en: "Most problems people call psychological are engineering problems wearing a disguise. Once you can name the mechanism — attention, friction, defaults, social proof — you can change it, test it, and watch whether it actually changed. That is the loop I work in: understand the behavior, build the smallest thing that shifts it, write down what happened.",
    ar: "معظم ما يسمّيه الناس مشكلة نفسية هو في الحقيقة مشكلة تقنية يرتدي قناعًا. حين تستطيع تسمية الآلية — الانتباه، الاحتكاك، الافتراضات، الدليل الاجتماعي — تستطيع تغييرها، وقياسها، ومعرفة إن كانت تغيّرت فعلًا. هذه هي الحلقة التي أعمل فيها: افهم السلوك، ابنِ أصغر شيء يزيحه، ثم اكتب ما حدث.",
  },
}
