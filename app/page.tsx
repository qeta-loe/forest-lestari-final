//top dikurang 179

export default function BerandaPage() {
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

  return (
    <main className="min-h-screen bg-[#F7F6EF] px-4 py-8 text-[#113522] sm:px-6 lg:px-10">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-14">
        <div>
        {/* Hero */}
        <section className="grid items-center gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="flex flex-col items-start gap-6">
            <div className="max-w-3xl space-y-3 sm:space-y-4">
              <div className="w-fit rounded-full bg-yellow-800/50 px-4 py-2 text-xs font-semibold tracking-wide text-orange-50 sm:text-sm">
                KOMUNITAS LINGKUNGAN BOGOR
              </div>

              <h1 className="font-['Newsreader'] text-4xl font-normal leading-tight text-emerald-950 sm:text-5xl lg:text-6xl">
                Bersama Menjaga Kelestarian Hutan & Alam Indonesia
              </h1>

              <p className="max-w-2xl  text-base leading-7 text-zinc-700 sm:text-lg">
                Platform dokumentasi dan informasi kegiatan pelestarian lingkungan komunitas Forest Lestari.
              </p>
            </div>

            <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
              <a
                href="#kegiatan"
                className="inline-flex h-14 items-center justify-center rounded-full bg-emerald-900 px-7 text-base font-bold text-stone-50 transition hover:bg-emerald-950 active:scale-95 sm:text-lg"
              >
                Lihat Kegiatan
              </a>

              <a
                href="#database"
                className="inline-flex h-14 items-center justify-center rounded-full border border-emerald-950 bg-stone-50 px-7 text-base font-bold text-emerald-900 transition hover:bg-emerald-50 active:scale-95 sm:text-lg"
              >
                Database Lingkungan
              </a>
            </div>
          </div>

          <div className="relative aspect-[4/3] w-full overflow-hidden rounded-3xl bg-white shadow-xl sm:aspect-[5/3] lg:aspect-square">
            <img
              className="h-full w-full object-cover"
              src="https://placehold.co/700x700"
              alt="Dokumentasi kegiatan lingkungan"
            />
            <div className="absolute inset-0 bg-gradient-to-l from-emerald-950/40 to-emerald-950/0" />
          </div>
        </section>
        </div>

        {/* Statistik */}
        <section className="border-y border-black/10 py-6">
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:divide-x md:divide-black/10">
            {stats.map((item) => (
              <div key={item.label} className="px-4 py-4 text-center">
                <p className=" text-4xl font-bold text-emerald-900 sm:text-5xl">
                  {item.value}
                </p>
                <p className="mt-2 text-xs text-emerald-900 sm:text-sm">
                  {item.label}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Kegiatan terbaru */}
        <section id="kegiatan" className="space-y-6 scroll-mt-10">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <h2 className="text-3xl font-bold text-emerald-900 sm:text-4xl">
              Kegiatan Terbaru
            </h2>
            <a href="#" className="text-sm font-semibold text-emerald-900 hover:underline">
              Lihat semua kegiatan
            </a>
          </div>

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {activities.map((activity) => (
              <article
                key={activity.title}
                className="group flex overflow-hidden rounded-3xl bg-gray-400 shadow-sm transition hover:-translate-y-1 hover:shadow-lg sm:min-h-56"
              >
                <div className="w-2/5 bg-gray-300 transition group-hover:bg-gray-200" />

                <div className="flex flex-1 flex-col justify-center px-4 py-8 text-center">
                  <h3 className=" text-lg font-bold leading-tight text-emerald-900 sm:text-xl">
                    {activity.title}
                  </h3>
                  <p className="mt-2 text-sm text-white">
                    {activity.location}, {activity.date}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* Artikel dan peta */}
        <section id="database" className="grid gap-10 border-t border-black/10 pt-10 lg:grid-cols-2 scroll-mt-10">
          <div className="space-y-6">
            <h2 className=" text-3xl font-bold text-emerald-900 sm:text-4xl">
              Artikel Terbaru
            </h2>

            <div className="divide-y divide-black/10 rounded-3xl bg-stone-50/70 px-5 py-2">
              {articles.map((article) => (
                <article key={article.title} className="py-5">
                  <a
                    href="#"
                    className=" text-lg font-normal text-emerald-900 transition hover:text-emerald-700 hover:underline sm:text-xl"
                  >
                    {article.title}
                  </a>
                  <p className="mt-2 text-xs text-emerald-900/80">
                    {article.date}
                  </p>
                </article>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <h2 className=" text-3xl font-bold text-emerald-900 sm:text-4xl">
              Peta Lokasi Penanaman
            </h2>

            <div className="flex aspect-[4/3] w-full items-center justify-center rounded-3xl bg-gray-400 p-6 text-center text-sm font-semibold text-white sm:aspect-[16/9] lg:aspect-[4/3]">
              Area peta lokasi penanaman
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
