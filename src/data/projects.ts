import type { Localized } from "@/lib/i18n"

export type ProjectStatus = "live"

export interface LocalizedList {
  en: string[]
  ar: string[]
}

export interface Project {
  id: string
  name: string
  url: string
  monogram: string
  gradient: string
  status: ProjectStatus
  category: Localized
  description: Localized
  highlights: LocalizedList
}

export const projects: Project[] = [
  {
    id: "apex",
    name: "Apex",
    url: "https://apexifywalls.vercel.app/",
    monogram: "A",
    gradient: "from-indigo-500 via-violet-500 to-fuchsia-500",
    status: "live",
    category: {
      en: "Wallpaper discovery",
      ar: "اكتشاف خلفيات",
    },
    description: {
      en: "A wallpaper site for people who care what their screen looks like. Browse and preview instead of digging through image boards.",
      ar: "موقع خلفيات لمن يهتم بما يبدو على شاشته. تصفّح ومعاينة بدل البحث في منتديات الصور.",
    },
    highlights: {
      en: [
        "Built around one job: find a wallpaper, see it full, set it.",
        "Runs on a Vercel deployment with no backend to maintain.",
        "Optimized image delivery instead of shipping full-resolution files.",
      ],
      ar: [
        "مبني حول مهمة واحدة: تجد الخلفية، تراها كاملة، وتضعها.",
        "منشور على Vercel بدون خادم خلفية يحتاج صيانة.",
        "توصيل صور محسّن بدل إرسال الملفات كاملة الحجم.",
      ],
    },
  },
  {
    id: "ego-store",
    name: "EGO Store",
    url: "https://ego-1store.vercel.app/",
    monogram: "EGO",
    gradient: "from-emerald-500 via-teal-500 to-cyan-500",
    status: "live",
    category: {
      en: "Oversize streetwear store",
      ar: "متجر ملابس أوفرسايز",
    },
    description: {
      en: "Hoodies and oversized t-shirts, printed, blank, or printed with your own words. Every order goes through WhatsApp.",
      ar: "هوديز وتيشيرتات أوفرسايز، مطبوعة أو سادة أو بعبارتك أنت. كل طلب يتم عبر واتساب.",
    },
    highlights: {
      en: [
        "Arabic-first interface with a full product catalogue and a small admin panel to add products.",
        "Cash on delivery or cash-before-shipping, with the shipping page written out plainly.",
        "One-tap WhatsApp ordering: the cart message is already written when the chat opens.",
      ],
      ar: [
        "واجهة عربية أولًا، مع كتالوج منتجات ولوحة تحكم صغيرة لإضافة المنتجات.",
        "الدفع عند الاستلام أو الدفع كاشًا قبل الشحن، مع صفحة شحن مكتوبة بوضوح.",
        "طلب عبر واتساب بضغطة واحدة: رسالة الطلب جاهزة عند فتح المحادثة.",
      ],
    },
  },
  {
    id: "videoget",
    name: "VideoGet",
    url: "https://videodownloadr.vercel.app/",
    monogram: "V",
    gradient: "from-rose-500 via-pink-500 to-orange-500",
    status: "live",
    category: {
      en: "Free video downloader",
      ar: "أداة تنزيل فيديو مجانية",
    },
    description: {
      en: "Paste a link, pick a quality, download. No account, no watermark, and nothing kept on the server.",
      ar: "الصق الرابط، اختر الجودة، نزّل. بدون حساب، بدون علامة مائية، وبدون حفظ أي ملف على الخادم.",
    },
    highlights: {
      en: [
        "Supports YouTube, TikTok, Instagram, Facebook, Pinterest, X, Reddit, Vimeo and more.",
        "Quality choice from 4K down to audio-only, with a language toggle for Arabic.",
        "Streams straight to the device — the server never stores the file.",
      ],
      ar: [
        "يدعم يوتيوب وتيك توك وإنستغرام وفيسبوك وبنترست وX وريديت وVimeo وغيرها.",
        "اختيار الجودة من 4K حتى الصوت فقط، مع زر تبديل لغة للعربية.",
        "بث مباشر إلى جهازك — الخادم لا يخزّن الملف أبدًا.",
      ],
    },
  },
]
