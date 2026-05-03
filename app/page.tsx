const stats = [
  { value: "48", label: "Kegiatan Selesai" },
  { value: "12", label: "DAS Terdokumentasi" },
  { value: "37", label: "Spesies Endemik" },
  { value: "3", label: "Mitra Instansi" },
];

const activities = [
  {
    title: "Penanaman Pohon DAS Cisadane",
    location: "Bogor",
    date: "15 Februari 2026",
  },
  {
    title: "Survei Habitat Elang Jawa",
    location: "Bogor",
    date: "20 Maret 2026",
  },
  {
    title: "Bersih Sampah Sungai Ciliwung",
    location: "Jakarta",
    date: "9 Mei 2026",
  },
];

const articles = [
  {
    title: "Dampak Deforestasi terhadap Satwa Endemik Jawa",
    date: "12 April 2026",
  },
  {
    title: "Mengenal Daerah Aliran Sungai Cisadane",
    date: "28 Maret 2026",
  },
  {
    title: "Tips Konservasi Hutan Hujan Tropis",
    date: "9 Januari 2026",
  },
  {
    title: "Pengembangan Kehutanan Masyarakat Di Daerah Leuwiliang",
    date: "16 Februari 2026",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-[#F7F6EF] text-[#113522]">
      <div className="mx-auto max-w-[1280px] px-4 py-8 lg:px-10">

        <section className="mt-12 grid gap-8 lg:grid-cols-[1.4fr_1fr] lg:items-center">
          <div className="space-y-6">
            <span className="inline-flex rounded-full bg-emerald-900/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-emerald-900">
              Komunitas Lingkungan Bogor
            </span>

            <h1 className="text-4xl font-semibold leading-tight text-[#0F3926] sm:text-5xl">
              Bersama Menjaga Kelestarian Hutan & Alam Indonesia
            </h1>

            <p className="max-w-2xl text-sm leading-7 text-[#3d5f49] sm:text-base">
              Platform dokumentasi dan informasi kegiatan pelestarian lingkungan komunitas Forest Lestari.
            </p>

            <div className="flex flex-col gap-4 sm:flex-row">
              <button className="inline-flex items-center justify-center rounded-full bg-[#0F5139] px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#113f2f]">
                Lihat Kegiatan
              </button>
              <button className="inline-flex items-center justify-center rounded-full border border-[#0F5139] bg-white px-6 py-3 text-sm font-semibold text-[#0F5139] transition hover:bg-[#f4f8f3]">
                Database Lingkungan
              </button>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-[32px] bg-[#e8f2e9] p-6 shadow-[0_20px_80px_rgba(23,57,28,0.10)]">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(6,80,53,0.25),_transparent_40%)]" />
            <div className="relative grid h-full min-h-[320px] place-items-center rounded-[28px] border border-white/60 bg-[linear-gradient(135deg,_rgba(19,71,43,0.15),_rgba(196,240,209,0.12))] p-6">
              <div className="text-center">
                <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-3xl bg-emerald-950/10 text-white">
                  🌿
                </div>
                <p className="text-sm font-semibold uppercase tracking-[0.25em] text-emerald-900/80">
                  Foto Hutan Tropis
                </p>
                <p className="mt-4 text-base leading-7 text-[#15422F]/90">
                  Visualisasi suasana alam hijau dan lembap untuk memberi kesan lingkungan yang terjaga.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((item) => (
            <div key={item.label} className="rounded-3xl bg-white/90 p-6 shadow-sm ring-1 ring-black/5">
              <h3 className="text-3xl font-semibold text-[#0C3725]">{item.value}</h3>
              <p className="mt-2 text-sm text-[#4D6B57]">{item.label}</p>
            </div>
          ))}
        </section>

        <section className="mt-16 space-y-8">
          <div className="rounded-[32px] bg-white/90 p-8 shadow-sm ring-1 ring-black/5">
            <p className="text-sm uppercase tracking-[0.25em] text-[#48755e] font-semibold">
              Kegiatan Terbaru
            </p>

            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              {activities.map((item) => (
                <article key={item.title} className="rounded-3xl bg-[#4a7062] p-5 flex gap-4">
                  <div className="flex-shrink-0 w-24 h-24 rounded-2xl bg-gray-300" />
                  <div className="flex-1 flex flex-col justify-center">
                    <h4 className="text-sm font-semibold text-white">{item.title}</h4>
                    <p className="mt-2 text-xs text-[#C8DCD1]">{item.location}</p>
                    <p className="mt-1 text-xs text-[#A8B9B0]">{item.date}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>

          <div className="grid gap-8 lg:grid-cols-[1fr_1fr]">
            <section className="rounded-[32px] bg-white/90 p-8 shadow-sm ring-1 ring-black/5">
              <h2 className="text-lg font-semibold text-[#0F3926]">Artikel Terbaru</h2>
              <div className="mt-6 space-y-4">
                {articles.map((item) => (
                  <div key={item.title} className="flex flex-col gap-1 border-l-4 border-[#0F5139] pl-4 pb-4 last:pb-0">
                    <p className="text-sm font-medium text-[#234936]">{item.title}</p>
                    <span className="text-xs text-[#6B7F74]">{item.date}</span>
                  </div>
                ))}
              </div>
            </section>

            <section className="rounded-[32px] bg-[#4a7062] p-8 text-white shadow-sm ring-1 ring-black/5">
              <h3 className="text-lg font-semibold">Sebaran Kegiatan</h3>
              <div className="mt-6 h-48 rounded-3xl bg-[#3d5f51] p-4 flex items-center justify-center">
                <p className="text-sm leading-6 text-[#C8DCD1] text-center">
                  Area peta untuk menampilkan wilayah kegiatan pelestarian dan dokumentasi komunitas.
                </p>
              </div>
            </section>
          </div>
        </section>
      </div>
    </main>
  );
}
