import Link from "next/link";

const reports = [
  {
    year: "2024",
    published: "Januari 2025",
    title: "Laporan Tahunan - Rekap Dampak dan Program 2024",
    description:
      "Kompilasi lengkap seluruh program sepanjang 2024: penanaman pohon, rehabilitasi orangutan, monitoring DAS, edukasi masyarakat, dan jaringan kemitraan.",
    trees: 4200,
    volunteers: 850,
    programs: 12,
    latest: true,
  },
  {
    year: "2023",
    published: "Januari 2024",
    title: "Laporan Tahunan - Rekap Dampak dan Program 2023",
    description:
      "Dokumentasi perkembangan program konservasi, rehabilitasi lingkungan, dan kolaborasi masyarakat sepanjang tahun 2023.",
    trees: 3500,
    volunteers: 620,
    programs: 10,
    latest: false,
  },
  {
    year: "2022",
    published: "Januari 2023",
    title: "Laporan Tahunan - Rekap Dampak dan Program 2022",
    description:
      "Rekap kegiatan penghijauan, monitoring DAS, serta pengembangan jaringan relawan Forest Lestari.",
    trees: 2700,
    volunteers: 480,
    programs: 8,
    latest: false,
  },
  {
    year: "2021",
    published: "Januari 2022",
    title: "Laporan Tahunan - Rekap Dampak dan Program 2021",
    description:
      "Laporan awal pengembangan program konservasi dan keterlibatan masyarakat dalam rehabilitasi lingkungan.",
    trees: 1800,
    volunteers: 300,
    programs: 5,
    latest: false,
  },
];

export default function LaporanTahunanPage() {
  return (
    <main className="bg-stone-50 min-h-screen">
      {/* HERO */}
      <section className="relative h-[520px] overflow-hidden border-b border-black/10">
        <div className="absolute inset-0 bg-zinc-300" />

        <div className="relative z-10 max-w-7xl mx-auto px-6 pt-40">
          <div className="inline-flex items-center rounded-full bg-stone-400 px-5 py-2">
            <span className="text-sm font-semibold tracking-wide text-white">
              LAPORAN TAHUNAN
            </span>
          </div>

          <h1 className="mt-8 max-w-4xl text-5xl md:text-6xl font-bold text-emerald-900 leading-tight">
            Laporan Dampak Tahunan
          </h1>

          <p className="mt-6 max-w-3xl text-lg leading-relaxed text-zinc-700">
            Seluruh program, data lapangan, dan pencapaian Forest
            Lestari sepanjang tahun — terdokumentasi dan terverifikasi.
          </p>

          {/* FILTER */}
          <div className="mt-10">
            <button className="flex items-center gap-3 rounded-xl border border-emerald-900 bg-white px-5 py-3 text-emerald-900">
              Tahun: 2024
              <span>⌄</span>
            </button>
          </div>
        </div>
      </section>

      {/* REPORT LIST */}
      <section className="max-w-7xl mx-auto px-6 py-20 space-y-16">
        {reports.map((report) => (
          <div
            key={report.year}
            className="overflow-hidden rounded-[32px] bg-[#5F6F65]"
          >
            {/* TOP */}
            <div className="grid lg:grid-cols-2">
              {/* LEFT */}
              <div className="p-10 lg:p-14">
                <div className="flex items-center gap-4">
                  <h2 className="text-7xl md:text-8xl font-bold text-emerald-100">
                    {report.year}
                  </h2>

                  {report.latest && (
                    <span className="rounded-xl bg-white/20 px-4 py-1 text-xs font-bold text-white">
                      TERBARU
                    </span>
                  )}
                </div>

                <h3 className="mt-10 text-2xl font-bold text-white leading-snug">
                  {report.title}
                </h3>

                <p className="mt-5 max-w-xl text-sm leading-relaxed text-white/80">
                  {report.description}
                </p>
              </div>

              {/* RIGHT */}
              <div className="border-t border-white/10 lg:border-l lg:border-t-0 border-white/10 p-10 lg:p-14 flex flex-col justify-center">
                <span className="text-sm font-semibold text-white/70">
                  Diterbitkan
                </span>

                <p className="mt-3 text-2xl text-white">
                  {report.published}
                </p>
              </div>
            </div>

            {/* STATS */}
            <div className="grid grid-cols-1 md:grid-cols-3 border-t border-white/10 bg-[#D9D9D9]">
              <div className="border-b md:border-b-0 md:border-r border-black/10 py-10 text-center">
                <h4 className="text-4xl font-bold text-emerald-900">
                  {report.trees.toLocaleString()}
                </h4>

                <p className="mt-3 text-sm text-emerald-900">
                  Pohon ditanam
                </p>
              </div>

              <div className="border-b md:border-b-0 md:border-r border-black/10 py-10 text-center">
                <h4 className="text-4xl font-bold text-emerald-900">
                  {report.volunteers}
                </h4>

                <p className="mt-3 text-sm text-emerald-900">
                  Relawan aktif
                </p>
              </div>

              <div className="py-10 text-center">
                <h4 className="text-4xl font-bold text-emerald-900">
                  {report.programs}
                </h4>

                <p className="mt-3 text-sm text-emerald-900">
                  Program berjalan
                </p>
              </div>
            </div>

            {/* FOOTER */}
            <div className="flex justify-end border-t border-white/10 px-10 py-6">
              <Link
                href={`/tentang-kami/laporan-tahunan/${report.year}`}
                className="flex items-center gap-3 text-sm font-semibold text-white hover:underline"
              >
                Baca laporan lengkap →
              </Link>
            </div>
          </div>
        ))}
      </section>
    </main>
  );
}