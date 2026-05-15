
const categories = ["Semua", "Penanaman", "Survei", "Bersih Lingkungan", "Edukasi"];

const locations = ["Semua Wilayah", "Kota Bogor", "Kabupaten Bogor", "Jakarta", "Depok"];

const sortOptions = ["Terbaru", "Terlama", "Peserta Terbanyak"];

const featuredActivity = {
  category: "Penanaman",
  title: "Penanaman Pohon DAS Cisadane",
  description:
    "Kegiatan penanaman 200 bibit pohon endemik di tepi DAS Cisadane wilayah Bogor bagian barat bersama komunitas dan instansi terkait.",
  location: "Bogor Barat",
  participants: "42 Peserta",
  seed: "200 bibit",
  date: "26 Mei 2025",
};

const activities = [
  {
    category: "Survei",
    title: "Survei Habitat Elang Jawa",
    meta: "Kabupaten Bogor · 18 Peserta · 18 April 2025",
  },
  {
    category: "Edukasi",
    title: "Workshop Ecoprint",
    meta: "Kota Sukabumi · 30 Peserta · 7 Januari 2025",
  },
  {
    category: "Survei",
    title: "Survei Habitat Elang Jawa",
    meta: "Kabupaten Bogor · 18 Peserta · 18 April 2025",
  },
  {
    category: "Survei",
    title: "Survei Habitat Elang Jawa",
    meta: "Kabupaten Bogor · 18 Peserta · 18 April 2025",
  },
];

function FilterItem({ label }) {
  return (
    <label className="flex cursor-pointer items-center gap-3 text-base text-emerald-900">
      <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-gray-600 p-px">
        <span className="h-full w-full rounded-lg bg-white" />
      </span>
      <span>{label}</span>
    </label>
  );
}

function ActivityCard({ activity }) {
  return (
    <article className="group overflow-hidden rounded-3xl bg-gray-400 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
      <div className="h-24 bg-zinc-300 transition group-hover:bg-gray-200" />

      <div className="flex min-h-40 flex-col justify-end p-7">
        <span className="mb-3 w-fit rounded-full border border-emerald-950 bg-stone-50 px-4 py-2 text-xs text-emerald-900">
          {activity.category}
        </span>

        <h3 className="text-xl font-bold leading-tight text-emerald-900">
          {activity.title}
        </h3>

        <p className="mt-4 text-center text-xs text-white sm:text-left">
          {activity.meta}
        </p>
      </div>
    </article>
  );
}

export default function KegiatanPage() {
  return (
    <main className="min-h-screen bg-[#F7F6EF] px-4 py-10 text-[#113522] sm:px-6 lg:px-10">
      <div className="mx-auto w-full max-w-7xl">

        {/* Header */}
        <section className="mb-10 space-y-3">
          <h1 className="text-3xl font-bold text-emerald-900 sm:text-4xl">
            Kegiatan Komunitas
          </h1>
          <p className="max-w-3xl text-base text-emerald-900 sm:text-xl">
            Rekam Jejak Seluruh Kegiatan Pelestarian Lingkungan yang Telah Dilakukan
          </p>
        </section>

        {/* Category filter */}
        <section className="mb-10 flex flex-col gap-5 border-b font-bold border-black/10 pb-10 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap gap-3">
            {categories.map((category) => (
              <button
                key={category}
                className="rounded-full border border-emerald-950 bg-stone-50 px-5 py-2 text-base text-emerald-900 transition hover:bg-emerald-50 active:scale-95"
              >
                {category}
              </button>
            ))}
          </div>

          <button className="w-fit rounded-[10px] border border-emerald-950 bg-stone-50 px-5 py-2 text-base text-emerald-900 transition hover:bg-emerald-50 active:scale-95">
            Tahun: 2025
          </button>
        </section>

        {/* Content */}
        <section className="grid gap-10 lg:grid-cols-[260px_1fr]">
          {/* Sidebar filter */}
          <aside className="space-y-10 lg:border-r lg:border-black/10 lg:pr-8">
            <div>
              <h2 className="mb-5 text-xl text-emerald-900">Lokasi</h2>
              <div className="space-y-4">
                {locations.map((location) => (
                  <FilterItem key={location} label={location} />
                ))}
              </div>
            </div>

            <div>
              <h2 className="mb-5 text-xl text-emerald-900">Urutkan</h2>
              <div className="space-y-4">
                {sortOptions.map((option) => (
                  <FilterItem key={option} label={option} />
                ))}
              </div>
            </div>
          </aside>

          {/* Cards */}
          <div>
            <p className="mb-8 text-base text-emerald-900">Menampilkan 48 kegiatan</p>

            <article className="group mb-8 grid overflow-hidden rounded-3xl bg-gray-400 shadow-sm transition hover:-translate-y-1 hover:shadow-lg lg:grid-cols-[42%_1fr]">
              <div className="min-h-72 bg-zinc-300 transition group-hover:bg-gray-200 lg:min-h-80" />

              <div className="flex min-h-80 flex-col justify-center p-7">
                <div className="mb-4 flex flex-wrap items-center gap-3">
                  <span className="w-fit rounded-full border border-emerald-950 bg-stone-50 px-5 py-2 text-base text-emerald-900">
                    {featuredActivity.category}
                  </span>
                  <span className="ml-auto text-xs text-white">{featuredActivity.date}</span>
                </div>

                <h2 className="text-2xl font-bold leading-tight text-emerald-900">
                  {featuredActivity.title}
                </h2>

                <p className="mt-4 max-w-xl text-base leading-relaxed text-white">
                  {featuredActivity.description}
                </p>

                <div className="mt-5 flex flex-wrap gap-4 text-xs text-white">
                  <span>📍 {featuredActivity.location}</span>
                  <span>👥 {featuredActivity.participants}</span>
                  <span>🌱 {featuredActivity.seed}</span>
                </div>

                <div className="mt-5 flex flex-wrap gap-3">
                  <button className="rounded-[10px] border border-emerald-950 bg-stone-50 px-4 py-2 text-xs text-emerald-900 transition hover:bg-emerald-50 active:scale-95">
                    Lihat Laporan
                  </button>
                  <button className="rounded-[10px] border border-emerald-950 bg-stone-50 px-4 py-2 text-xs text-emerald-900 transition hover:bg-emerald-50 active:scale-95">
                    Unduh Dokumentasi
                  </button>
                </div>
              </div>
            </article>

            <div className="grid gap-8 md:grid-cols-2">
              {activities.map((activity, index) => (
                <ActivityCard key={`${activity.title}-${index}`} activity={activity} />
              ))}
            </div>

            {/* Pagination */}
            <div className="mt-16 flex justify-center">
              <div className="flex gap-6 sm:gap-7">
                {[1, 2, 3, 4].map((page) => (
                  <button
                    key={page}
                    className="flex h-11 w-11 items-center justify-center rounded-[10px] bg-gray-400 text-xl font-bold text-stone-50 transition hover:bg-emerald-900 active:scale-95"
                  >
                    {page}
                  </button>
                ))}
                <button className="flex h-11 w-11 items-center justify-center rounded-[10px] bg-gray-400 text-xl font-bold text-stone-50 transition hover:bg-emerald-900 active:scale-95">
                  −
                </button>
              </div>
            </div>
          </div>
        </section>

        
      </div>
    </main>
  );
}
