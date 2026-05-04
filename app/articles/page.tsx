import Link from "next/link"

const categories = [
  "Semua",
  "Isu Lingkungan",
  "Edukasi dan Tips",
  "Berita Komunitas",
]

const featuredArticle = {
  category: "Edukasi dan Tips",
  title: "Strategi Pemulihan Ekosistem Mangrove di Pesisir Utara",
  description:
    "Menelaah keberhasilan kolaborasi antara masyarakat adat dan teknologi pemantauan satelit dalam merevitalisasi 200 hektar hutan bakau yang terdampak abrasi.",
  author: "Dr. Aris Setyawan",
  role: "Dokter Hewan",
}

const articleCards = [
  {
    category: "Edukasi dan Tips",
    date: "18 April 2025",
    title: "5 Langkah Sederhana Mengurangi Jejak Karbon ...",
    author: "Siti Aminah",
  },
  {
    category: "Berita Komunitas",
    date: "6 Februari 2026",
    title: "Rangkuman Temu Wicara: Masa Depan Hutan ...",
    author: "Darwawan J.",
  },
  {
    category: "Edukasi dan Tips",
    date: "18 Januari 2026",
    title: "Krisis Biodiversitas: Spesies Endemik yang Terancam ...",
    author: "Rina Wijaya",
  },
  {
    category: "Edukasi dan Tips",
    date: "23 Maret 2026",
    title: "Pemanfaatan AI dalam Deteksi Dini Kebakaran Hutan di Lahan Gambut",
    author: "Taufik H.",
  },
  {
    category: "Edukasi dan Tips",
    date: "1 April 2026",
    title: "Pemanfaatan AI dalam Deteksi Dini Kebakaran Hutan di Lahan Gambut",
    author: "Taufik H.",
  },
]

export default function ArticlesPage() {
  return (
    <main className="min-h-screen bg-[#F7F6EF] text-[#113522]">
      <div className="mx-auto max-w-[1280px] px-4 py-10">

        {/* ===== FEATURED SECTION ===== */}
        <div className="grid gap-8 xl:grid-cols-[1.6fr_1fr]">

          {/* LEFT */}
          <div className="rounded-[32px] bg-white p-6 shadow-sm">
            <div className="grid gap-6 md:grid-cols-[1.4fr_1fr]">

              {/* IMAGE */}
              <div className="rounded-3xl bg-[#d8e3db] p-4">
                <div className="aspect-[16/10] w-full rounded-2xl bg-[#b0c4b4]" />
              </div>

              {/* TEXT */}
              <div className="flex flex-col justify-between">

                <div className="flex items-center justify-between">
                  <span className="rounded-full bg-[#EEF6EE] px-3 py-1 text-xs font-semibold text-[#0F5139]">
                    {featuredArticle.category}
                  </span>

                  <button className="flex items-center gap-1 rounded-full border px-6 py-1 text-xs">
                    Cari 🔍
                  </button>
                </div>

                <div className="mt-4 space-y-3">
                  <h1 className="text-2xl font-semibold leading-snug text-[#0F3926]">
                    {featuredArticle.title}
                  </h1>

                  <p className="text-sm text-[#4D6B57]">
                    {featuredArticle.description}
                  </p>
                </div>

                <div className="mt-4 flex items-center gap-3 bg-[#F3F7F2] p-3 rounded-2xl">
                  <div className="h-10 w-10 rounded-full flex items-center justify-center bg-[#d4e1d7]">
                    👤
                  </div>
                  <div>
                    <p className="text-sm font-semibold">
                      {featuredArticle.author}
                    </p>
                    <p className="text-xs text-gray-500">
                      {featuredArticle.role}
                    </p>
                  </div>
                </div>

              </div>
            </div>
          </div>

          {/* RIGHT SIDEBAR */}
          <div className="rounded-[32px] bg-white p-6 shadow-sm">

            {/* CATEGORY */}
            <div className="flex flex-wrap gap-2">
              {categories.map((label) => (
                <button
                  key={label}
                  className="rounded-full border px-6 py-1 text-sm hover:bg-[#eef7f1]"
                >
                  {label}
                </button>
              ))}
            </div>

            {/* MINI ARTICLES */}
            <div className="mt-0.25 space-y-2">
              {articleCards.slice(0, 3).map((item, index) => (
                <Link
                  key={index}
                  href="#"
                  className="block rounded-2xl bg-[#d9e2da] p-4 hover:shadow-md transition"
                >
                  <p className="text-xs text-[#0F5139]">{item.date}</p>
                  <h3 className="mt-1 text-sm font-semibold line-clamp-2">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-xs text-gray-600">
                    {item.author}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* ===== GRID ARTICLES ===== */}
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {articleCards.map((item, index) => (
            <Link
              key={index}
              href="#"
              className="group overflow-hidden rounded-[32px] bg-white p-6 shadow-sm ring-1 ring-black/5 transition-all duration-200 hover:-translate-y-1 hover:shadow-md active:scale-[0.98]"
            >
              <span className="inline-flex rounded-full border border-[#0F5139]/20 bg-[#EEF6EE] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-[#0F5139]">
                {item.category}
              </span>

              <p className="mt-4 text-xs text-[#0F5139]/80">{item.date}</p>

              <h3 className="mt-3 min-h-[5rem] text-lg font-semibold text-[#0F3926] line-clamp-3">
                {item.title}
              </h3>

              <div className="mt-6 flex items-center justify-between text-sm font-semibold text-[#0F5139]">
                <span>{item.author}</span>
                <span className="text-xl transition group-hover:translate-x-1">→</span>
              </div>
            </Link>
          ))}
        </div>

        {/* ===== PAGINATION ===== */}
        <div className="mt-10 flex justify-center gap-2">
          {[1, 2, 3, 4].map((page) => (
            <button
              key={page}
              className="h-10 w-10 rounded-full border text-sm hover:bg-[#eef7f1]"
            >
              {page}
            </button>
          ))}
          <button className="px-4 rounded-full border hover:bg-[#eef7f1]">
            ›
          </button>
        </div>

      </div>
    </main>
  )
}