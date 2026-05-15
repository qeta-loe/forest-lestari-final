const articleCards = [
  {
    date: "18 april 2025",
    title: "5 Langkah Sederhana Mengurangi Jejak Karbon ..",
    description:
      "Panduan praktis bagi warga perkotaan untuk memulai gaya hidup berkelanjutan melalui pengolahan limbah organik dan efisiensi energi.",
    author: "Siti Aminah",
  },
  {
    date: "6 Februari 2026",
    title: "Rangkuman Temu Wicara: Masa Depan Hutan ....",
    description:
      "Catatan dari pertemuan relawan Forest Lestari membahas tantangan ekspansi lahan dan solusi ekonomi kreaktif lokal.",
    author: "Darmawan J.",
  },
  {
    date: "19 Januari 2026",
    title: "Krisis Biodiversitas: Spesies Endemik yang Terancam ...",
    description:
      "Laporan mendalam mengenai hilangnya habitat fauna langka di wilayah Wallacea dan upaya konservasi mendesak yang diperlukan.",
    author: "Rina Wijaya",
  },
  {
    date: "Kabupaten Bogor · 18 April 2025",
    title: "5 Langkah Sederhana Mengurangi Jejak Karbon ..",
    description:
      "Panduan praktis bagi warga perkotaan untuk memulai gaya hidup berkelanjutan melalui pengolahan limbah organik dan efisiensi energi.",
    author: "Siti Aminah",
  },
];

const wideArticles = [
  {
    date: "27 Maret 2026",
    title: "Pemanfaatan AI dalam Deteksi Dini Kebakaran Hutan di Lahan Gambut",
    description:
      "Bagaimana algoritma kecerdasan buatan memprediksi titik api dengan akurasi 94% sebelum bencana terjadi.",
    author: "Taufik H.",
  },
  {
    date: "1 April 2026",
    title: "Pemanfaatan AI dalam Deteksi Dini Kebakaran Hutan di Lahan Gambut",
    description:
      "Bagaimana algoritma kecerdasan buatan memprediksi titik api dengan akurasi 94% sebelum bencana terjadi.",
    author: "Taufik H.",
  },
];

const filters = ["Semua", "Isu Lingkungan", "Edukasi dan Tips", "Berita Komunitas"];

function ArticleCard({ article }) {
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-3xl bg-emerald-900/50 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
      <div className="h-40 w-full shrink-0 bg-gray-300 transition group-hover:bg-gray-200" />

      <div className="flex flex-1 flex-col p-5">
        <div className="mb-2 flex items-center justify-between">
          <span className=" px-2 py-1  text-xs text-white">
            {article.date}
          </span>
        </div>

        <h3 className="mb-2  text-base font-bold leading-tight text-emerald-900 sm:text-lg">
          {article.title}
        </h3>

        <p className="mb-4 flex-1 text-xs leading-relaxed text-white">
          {article.description}
        </p>

        <div className="flex flex-col gap-2 text-xs text-white sm:flex-row sm:items-center sm:justify-between">
          <span>👤 {article.author}</span>
          <a
            href="#"
            className="flex w-fit items-center gap-2 font-medium transition hover:underline"
          >
            Read More <span>→</span>
          </a>
        </div>
      </div>
    </article>
  );
}

function WideArticleCard({ article }) {
  return (
    <article className="group flex min-h-80 overflow-hidden rounded-3xl bg-emerald-900/50 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
      <div className="w-1/2 shrink-0 bg-gray-300 transition group-hover:bg-gray-200" />

      <div className="flex w-1/2 flex-col justify-center p-6">
        <div className="mb-3 flex items-center justify-between">
          <span className=" px-3 py-1  text-xs text-white">
            {article.date}
          </span>
        </div>

        <h3 className="mb-3 text-lg font-bold leading-tight text-emerald-950 sm:text-xl">
          {article.title}
        </h3>

        <p className="mb-4 flex-1 text-sm leading-relaxed text-white">
          {article.description}
        </p>

        <div className="flex flex-col gap-2 text-xs text-white sm:flex-row sm:items-center sm:justify-between">
          <span>👤 {article.author}</span>
          <a
            href="#"
            className="flex w-fit items-center gap-2 font-medium transition hover:underline"
          >
            Read More <span>→</span>
          </a>
        </div>
      </div>
    </article>
  );
}

export default function ArticlesPage() {
  return (
    <main className="min-h-screen bg-[#F7F6EF] px-4 py-10 text-[#113522] sm:px-6 lg:px-10">
      <div className="mx-auto flex w-full max-w-7xl flex-col">
        {/* Search Navigation */}
        <div className="mb-8 flex justify-center">
          <button className="flex w-full max-w-xs items-center justify-between rounded-full border border-emerald-950 bg-stone-50 px-8 py-2 text-emerald-900 transition hover:bg-emerald-50 active:scale-95 sm:max-w-sm">
            <span className=" text-sm">Cari</span>
            <svg
              className="h-4 w-4 text-emerald-900"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </button>
        </div>

        {/* Featured Article - 2 Column Layout */}
        <div className="mb-12 grid grid-cols-1 items-center gap-8 lg:grid-cols-2">
          <div className="h-64 overflow-hidden rounded-3xl bg-gray-400 shadow-xl lg:h-80" />

          <div>
            <div className="mb-4 inline-block">
              <span className="rounded-full font-bold border border-emerald-950 bg-stone-50 px-3 py-1 text-xs text-emerald-900 transition-colors hover:bg-emerald-50 active:scale-95">
                Edukasi dan Tips
              </span>
            </div>

            <h2 className="mb-4  text-2xl font-bold leading-tight text-emerald-900 lg:text-3xl">
              Strategi Pemulihan Ekosistem Mangrove di Pesisir Utara
            </h2>

            <p className="mb-6 text-sm font-normal leading-relaxed text-emerald-900">
              Menelaah keberhasilan kolaborasi antara masyarakat adat dan teknologi
              pemantauan satelit dalam merevitalisasi 200 hektar hutan bakau yang
              terdampak abrasi.
            </p>

            <div className="flex items-center">
              <div className="mr-3 h-12 w-12 rounded-full bg-zinc-300" />
              <div className="text-emerald-900">
                <p className="font-semibold">Dr. Aris Setyawan</p>
                <p className="text-xs">Dokter Hewan</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filter Buttons */}
        <div className="mb-10 flex flex-wrap gap-3">
          {filters.map((filter) => (
            <button
              key={filter}
              className="rounded-full border border-emerald-950 bg-stone-50 px-4 py-2 font-bold text-sm text-emerald-900 transition-colors hover:bg-emerald-50 active:scale-95"
            >
              {filter}
            </button>
          ))}
        </div>

        {/* Articles Grid - First 4 Articles (1 Row) */}
        <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
          {articleCards.map((article) => (
            <ArticleCard key={`${article.date}-${article.title}`} article={article} />
          ))}
        </div>

        {/* Articles Grid - Last 2 Articles (Wider) */}
        <div className="mb-12 grid grid-cols-1 gap-6 md:grid-cols-2">
          {wideArticles.map((article) => (
            <WideArticleCard key={`${article.date}-${article.title}`} article={article} />
          ))}
        </div>

        {/* Pagination */}
        <div className="mb-12 flex justify-center">
          <div className="flex gap-2">
            {[1, 2, 3, 4].map((page) => (
              <button
                key={page}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-900 text-sm font-bold text-stone-50 transition-colors hover:bg-emerald-950 active:scale-95"
              >
                {page}
              </button>
            ))}

            <button className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-900 font-bold text-stone-50 transition-colors hover:bg-emerald-950 active:scale-95">
              ›
            </button>
          </div>
        </div>

        {/* Footer */}
      </div>
    </main>
  );
}
