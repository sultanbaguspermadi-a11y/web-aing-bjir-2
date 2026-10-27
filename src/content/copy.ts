/**
 * All translatable copy. The `Copy` interface forces every language to
 * provide every key, and copy.test.ts guards the PRD invariants.
 */

export const LANGS = ["id", "en", "ar"] as const;
export type Lang = (typeof LANGS)[number];

export function isLang(value: unknown): value is Lang {
  return typeof value === "string" && (LANGS as readonly string[]).includes(value);
}

export interface HeadlineLine {
  text: string;
  /** Arabic only: render this line in the expressive Nastaliq face. */
  face?: "nastaliq";
}

export interface ProjectCopy {
  category: string;
  summary: string;
  platform: string;
  focus: string;
  imageAlt: string;
  /** Tarot arcana shown on the "social link" card (decorative framing). */
  arcana: { numeral: string; name: string };
}

interface MenuEntry {
  label: string;
  hint: string;
}

export interface Copy {
  meta: { title: string; description: string };
  a11y: { skip: string; newTab: string; menu: string; loading: string };
  home: { eyebrow: string; headline: readonly HeadlineLine[]; description: string };
  menu: { projects: MenuEntry; about: MenuEntry; contact: MenuEntry; language: MenuEntry };
  hud: { select: string; confirm: string; back: string; soundOn: string; soundOff: string };
  projects: {
    title: string;
    cta: string;
    cursor: string;
    labels: { category: string; platform: string; focus: string };
    lughoti: ProjectCopy;
    scrabble: ProjectCopy;
  };
  about: { title: string; focusTitle: string; focus: readonly [string, string, string]; credit: string };
  contact: { title: string; github: string };
  language: { title: string; current: string };
}

const id: Copy = {
  meta: {
    title: "Sultan Bagus Permadi — Media Pembelajaran Bahasa Arab & Eksperimen Digital",
    description:
      "Kumpulan proyek akademik dan interaktif yang mengeksplorasi pembelajaran bahasa Arab, teknologi pendidikan, dan desain antarmuka.",
  },
  a11y: {
    skip: "Lewati ke konten utama",
    newTab: "(membuka tab baru)",
    menu: "Menu utama",
    loading: "Memuat",
  },
  home: {
    eyebrow: "Karya Pilihan · 2026",
    headline: [{ text: "Media Pembelajaran Bahasa Arab" }, { text: "& Eksperimen Digital" }],
    description:
      "Kumpulan proyek akademik dan interaktif yang mengeksplorasi pembelajaran bahasa Arab, teknologi pendidikan, dan desain antarmuka.",
  },
  menu: {
    projects: { label: "Proyek", hint: "Lihat dua proyek pilihan." },
    about: { label: "Tentang", hint: "Profil dan bidang fokus." },
    contact: { label: "Kontak", hint: "Tautan dan kanal." },
    language: { label: "Bahasa", hint: "Ganti bahasa situs." },
  },
  hud: { select: "Pilih", confirm: "Konfirmasi", back: "Kembali", soundOn: "Suara: Hidup", soundOff: "Suara: Mati" },
  projects: {
    title: "Proyek",
    cta: "Lihat Proyek",
    cursor: "Lihat",
    labels: { category: "Kategori", platform: "Platform", focus: "Fokus" },
    lughoti: {
      category: "Kamus digital Arab–Indonesia",
      summary:
        "Kamus untuk siswa SMK: kosakata Arab per jurusan lengkap dengan harakat, transliterasi, dan contoh kalimat. Berjalan offline sebagai PWA.",
      platform: "Web · PWA offline",
      focus: "Kosakata Arab vokasi",
      imageAlt: "Pencarian kata \"jaringan\" di kamus jurusan RPL pada Lughoti Vokasi",
      arcana: { numeral: "V", name: "Hierophant" },
    },
    scrabble: {
      category: "Gim kata dua pemain",
      summary:
        "Scrabble Arab untuk dua pemain di satu perangkat: papan 15×15, dua mode huruf, empat tema, dan tahkim (penilaian kata) oleh pemain. Bisa dipasang dan berjalan offline.",
      platform: "Web · PWA offline",
      focus: "Kosakata dan menyusun kata",
      imageAlt: "Papan Arabic Scrabble dengan empat huruf yang baru diletakkan",
      arcana: { numeral: "I", name: "Magician" },
    },
  },
  about: {
    title: "Tentang",
    focusTitle: "Fokus",
    focus: ["Pendidikan Bahasa Arab", "Teknologi Pendidikan", "Desain Antarmuka"],
    credit: "© 2026 Sultan Bagus Permadi",
  },
  contact: { title: "Kontak", github: "Profil GitHub" },
  language: { title: "Bahasa", current: "Aktif" },
};

const en: Copy = {
  meta: {
    title: "Sultan Bagus Permadi — Arabic Learning Media & Digital Experiments",
    description:
      "Selected academic and interactive projects exploring Arabic education, educational technology, and interface design.",
  },
  a11y: { skip: "Skip to main content", newTab: "(opens in a new tab)", menu: "Main menu", loading: "Loading" },
  home: {
    eyebrow: "Selected Works · 2026",
    headline: [{ text: "Arabic Learning Media" }, { text: "& Digital Experiments" }],
    description:
      "Selected academic and interactive projects exploring Arabic education, educational technology, and interface design.",
  },
  menu: {
    projects: { label: "Projects", hint: "Browse the two selected projects." },
    about: { label: "About", hint: "Profile and areas of focus." },
    contact: { label: "Contact", hint: "Links and channels." },
    language: { label: "Language", hint: "Change the site language." },
  },
  hud: { select: "Select", confirm: "Confirm", back: "Back", soundOn: "Sound: On", soundOff: "Sound: Off" },
  projects: {
    title: "Projects",
    cta: "View Project",
    cursor: "View",
    labels: { category: "Category", platform: "Platform", focus: "Focus" },
    lughoti: {
      category: "Arabic–Indonesian digital dictionary",
      summary:
        "A dictionary for vocational high-school students: Arabic vocabulary by major, with harakat, transliteration and example sentences. Works offline as a PWA.",
      platform: "Web · offline PWA",
      focus: "Vocational Arabic vocabulary",
      imageAlt: "Searching for \"jaringan\" in the RPL dictionary of Lughoti Vokasi",
      arcana: { numeral: "V", name: "Hierophant" },
    },
    scrabble: {
      category: "Two-player word game",
      summary:
        "Arabic Scrabble for two players on one device: a 15×15 board, two tile modes, four themes, and human tahkim (word judging). Installable and offline-capable.",
      platform: "Web · offline PWA",
      focus: "Vocabulary and word building",
      imageAlt: "The Arabic Scrabble board with four tiles just placed",
      arcana: { numeral: "I", name: "Magician" },
    },
  },
  about: {
    title: "About",
    focusTitle: "Focus",
    focus: ["Arabic Education", "Educational Technology", "Interface Design"],
    credit: "© 2026 Sultan Bagus Permadi",
  },
  contact: { title: "Contact", github: "GitHub profile" },
  language: { title: "Language", current: "Active" },
};

const ar: Copy = {
  meta: {
    title: "Sultan Bagus Permadi — وسائط تعليم اللغة العربية والتجارب الرقمية",
    description:
      "مجموعة من المشاريع الأكاديمية والتفاعلية التي تستكشف تعليم اللغة العربية، والتقنية التعليمية، وتصميم الواجهات.",
  },
  a11y: { skip: "تخطَّ إلى المحتوى الرئيسي", newTab: "(يفتح في تبويب جديد)", menu: "القائمة الرئيسية", loading: "جارٍ التحميل" },
  home: {
    eyebrow: "الأعمال المختارة · 2026",
    headline: [{ text: "وسائط تعليم اللغة العربية" }, { text: "والتجارب الرقمية", face: "nastaliq" }],
    description:
      "مجموعة من المشاريع الأكاديمية والتفاعلية التي تستكشف تعليم اللغة العربية، والتقنية التعليمية، وتصميم الواجهات.",
  },
  menu: {
    projects: { label: "المشاريع", hint: "تصفّح المشروعين المختارين." },
    about: { label: "نبذة", hint: "الملف الشخصي ومجالات التركيز." },
    contact: { label: "تواصل", hint: "الروابط والقنوات." },
    language: { label: "اللغة", hint: "تغيير لغة الموقع." },
  },
  hud: { select: "اختيار", confirm: "تأكيد", back: "رجوع", soundOn: "الصوت: مفعّل", soundOff: "الصوت: مغلق" },
  projects: {
    title: "المشاريع",
    cta: "عرض المشروع",
    cursor: "عرض",
    labels: { category: "الفئة", platform: "المنصة", focus: "المجال" },
    lughoti: {
      category: "قاموس رقمي عربي–إندونيسي",
      summary: "قاموس لطلاب المدارس المهنية: مفردات عربية حسب التخصص مع التشكيل والنطق اللاتيني وأمثلة. يعمل دون إنترنت كتطبيق ويب تقدّمي.",
      platform: "ويب · يعمل دون إنترنت",
      focus: "مفردات عربية مهنية",
      imageAlt: "البحث عن كلمة «jaringan» في قاموس تخصص RPL ضمن Lughoti Vokasi",
      arcana: { numeral: "V", name: "الكاهن الأعظم" },
    },
    scrabble: {
      category: "لعبة كلمات للاعبَين",
      summary: "سكرابل عربي للاعبَين على جهاز واحد: لوحة 15×15، ونمطان للحروف، وأربعة مظاهر، وتحكيم الكلمات بين اللاعبين. قابل للتثبيت ويعمل دون إنترنت.",
      platform: "ويب · يعمل دون إنترنت",
      focus: "المفردات وتكوين الكلمات",
      imageAlt: "لوحة Arabic Scrabble مع أربعة أحرف موضوعة حديثًا",
      arcana: { numeral: "I", name: "الساحر" },
    },
  },
  about: {
    title: "نبذة",
    focusTitle: "المجالات",
    focus: ["تعليم اللغة العربية", "التقنية التعليمية", "تصميم الواجهات"],
    credit: "© 2026 Sultan Bagus Permadi",
  },
  contact: { title: "تواصل", github: "الملف على GitHub" },
  language: { title: "اللغة", current: "الحالية" },
};

export const copy: Record<Lang, Copy> = { id, en, ar };

/** Each language is shown in its own script, whatever the active language is. */
export const LANG_NAMES: Record<Lang, string> = { id: "Bahasa Indonesia", en: "English", ar: "العربية" };
export const LANG_CODES: Record<Lang, string> = { id: "ID", en: "EN", ar: "AR" };

export function dirOf(lang: Lang): "ltr" | "rtl" {
  return lang === "ar" ? "rtl" : "ltr";
}

/** 1 -> "01" (Latin digits) or "٠١" (Arabic-Indic digits in Arabic). */
export function formatIndex(n: number, lang: Lang): string {
  const text = String(n).padStart(2, "0");
  return lang === "ar" ? text.replace(/\d/g, (d) => String.fromCharCode(0x0660 + Number(d))) : text;
}
