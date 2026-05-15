import Link from "next/link";

const achievements = [
  {
    id: 1,
    category: "Penanaman",
    date: "3 Maret 2025",
    title: "Penanaman 300 Pohon di DAS Cisadane",
    description:
      "Rehabilitasi kawasan riparian sepanjang 4,2 km di hulu DAS Cisadane bersama komunitas lokal dan mahasiswa IPB.",
    stats: "300 pohon · 4,2 km area riparian · 85 relawan",
    color: "bg-lime-300",
  },
  {
    id: 2,
    category: "Orangutan",
    date: "12 Februari 2025",
    title: "Pelepasliaran 3 Orangutan Sumatera",
    description:
      "Kolaborasi dengan BKSDA Sumatera Utara dan Tim Medis Wildlife untuk melepaskan 3 orangutan hasil rehabilitasi ke habitat alami.",
    stats: "3 individu · 24 bulan rehabilitasi · Kawasan Leuser",
    color: "bg-stone-400",
  },
  {
    id: 3,
    category: "DAS",
    date: "23 Desember 2024",
    title: "Monitoring Sedimentasi 5 DAS Prioritas",
    description:
      "Pelaksanaan pemantauan kualitas air dan laju sedimentasi di 5 daerah aliran sungai prioritas menggunakan metode sampling terpadu.",
    stats: "5 DAS · 18 titik monitoring · 12,5 ha rehabilitasi",
    color: "bg-blue-400",
  },
  {
    id: 4,
    category: "Kolaborasi",
    date: "4 November 2024",
    title: "Program Restorasi Bersama Mitra Konservasi",
    description:
      "Forest Lestari bersama mitra konservasi menjalankan program penghijauan dan monitoring DAS yang merehabilitasi sekitar 25 hektar area.",
    stats: "12 mitra · 300+ masyarakat terdampak · 25 ha area",
    color: "bg-orange-300",
  },
];

const partners = [
  "IPB University",
  "BKSDA",
  "WWF Indonesia",
  "Green Peace",
  "Leuser Foundation",
  "Komunitas DAS",
  "Universitas Indonesia",
  "Relawan Hijau",
  "Forest Watch",
  "Earth Care",
];

export default function RiwayatPencapaianPage() {
  return (
    <main className="bg-stone-50 min-h-screen">
      {/* HERO */}
      <section className="border-b border-black/10">
        <div className="max-w-7xl mx-auto px-6 py-24">
          <span className="px-5 py-2 rounded-full bg-[#DCE8D5] text-sm font-semibold text-emerald-900">
            RIWAYAT PENCAPAIAN
          </span>

          <h1 className="mt-8 text-5xl md:text-6xl font-bold text-emerald-900 max-w-4xl leading-tight">
            Perjalanan menjaga bumi yang kita cintai
          </h1>

          <p className="mt-8 text-lg text-zinc-600 leading-relaxed max-w-3xl">
            Sejak 2019 Forest Lestari telah menorehkan jejak nyata dalam
            pelestarian hutan, rehabilitasi satwa, dan pemberdayaan komunitas.
          </p>
        </div>
      </section>

      {/* IMPACT STATS */}
      <section className="border-b border-black/10">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4">
          <div className="py-12 text-center border-r border-black/10">
            <h2 className="text-4xl font-bold text-emerald-900">340</h2>
            <p className="mt-2 text-sm text-zinc-600">Pohon ditanam</p>
          </div>

          <div className="py-12 text-center border-r border-black/10">
            <h2 className="text-4xl font-bold text-emerald-900">52</h2>
            <p className="mt-2 text-sm text-zinc-600">Total relawan</p>
          </div>

          <div className="py-12 text-center border-r border-black/10">
            <h2 className="text-4xl font-bold text-emerald-900">455</h2>
            <p className="mt-2 text-sm text-zinc-600">
              Area penghijauan (ha)
            </p>
          </div>

          <div className="py-12 text-center">
            <h2 className="text-4xl font-bold text-emerald-900">4</h2>
            <p className="mt-2 text-sm text-zinc-600">
              DAS dipantau aktif
            </p>
          </div>
        </div>
      </section>

      {/* TIMELINE */}
      <section className="max-w-7xl mx-auto px-6 py-24">
        <div className="flex flex-wrap gap-4 mb-16">
          {[
            "Overview",
            "Penanaman",
            "Orangutan",
            "DAS",
            "Kolaborasi",
          ].map((item) => (
            <button
              key={item}
              className="px-6 py-2 rounded-full border border-emerald-900 text-emerald-900 hover:bg-emerald-900 hover:text-white transition"
            >
              {item}
            </button>
          ))}
        </div>

        <div className="relative border-l border-emerald-900 pl-10 space-y-16">
          {achievements.map((item) => (
            <div key={item.id} className="relative">
              <div className="absolute -left-[49px] top-8 w-5 h-5 rounded-full bg-emerald-900" />

              <div className="bg-[#5F6F65] rounded-3xl p-8 flex flex-col lg:flex-row gap-10">
                {/* CONTENT */}
                <div className="flex-1">
                  <div className="flex items-center gap-4">
                    <span className="text-xs text-white">
                      {item.date}
                    </span>

                    <span
                      className={`px-3 py-1 rounded-full text-[10px] text-white ${item.color}`}
                    >
                      {item.category}
                    </span>
                  </div>

                  <h2 className="mt-5 text-3xl font-bold text-white leading-snug">
                    {item.title}
                  </h2>

                  <p className="mt-5 text-sm text-white/90 leading-relaxed max-w-2xl">
                    {item.description}
                  </p>

                  <div className="mt-5 text-xs font-semibold text-white">
                    {item.stats}
                  </div>

                  <Link
                    href={`/tentang-kami/riwayat-pencapaian/${item.id}`}
                    className="mt-8 inline-flex items-center gap-3 text-sm text-white hover:underline"
                  >
                    Lihat detail →
                  </Link>
                </div>

                {/* IMAGE */}
                <div className="w-full lg:w-80 h-56 bg-zinc-300 rounded-3xl shrink-0" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* PARTNERS */}
      <section className="max-w-7xl mx-auto px-6 py-24">
        <h2 className="text-4xl font-bold text-emerald-900 mb-14">
          Jaringan dan Mitra
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {partners.map((partner, index) => (
            <div
              key={index}
              className="bg-white border border-black/10 rounded-3xl p-6 flex flex-col items-center justify-center"
            >
              <div className="w-20 h-20 rounded-2xl bg-zinc-300 mb-5" />

              <p className="text-sm text-emerald-900 text-center">
                {partner}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* REPORT */}
      <section className="max-w-7xl mx-auto px-6 pb-24">
        <div className="bg-[#5F6F65] rounded-3xl overflow-hidden">
          <div className="grid lg:grid-cols-2">
            <div className="p-10">
              <div className="flex items-center gap-4">
                <h2 className="text-7xl font-bold text-emerald-100">
                  2024
                </h2>

                <span className="px-4 py-1 rounded-xl bg-white/20 text-xs text-white font-bold">
                  TERBARU
                </span>
              </div>

              <h3 className="mt-10 text-2xl font-bold text-white">
                Laporan Tahunan - Rekap Dampak dan Program 2024
              </h3>

              <p className="mt-5 text-sm text-white/80 leading-relaxed max-w-xl">
                Kompilasi lengkap seluruh program sepanjang 2024:
                penanaman pohon, rehabilitasi orangutan, monitoring DAS,
                edukasi masyarakat, dan jaringan kemitraan.
              </p>
            </div>

            <div className="border-t lg:border-t-0 lg:border-l border-white/10 grid grid-cols-3">
              <div className="p-8 border-r border-white/10 flex flex-col justify-center items-center">
                <h4 className="text-4xl font-bold text-white">78</h4>
                <p className="mt-3 text-sm text-white/70 text-center">
                  Pohon ditanam
                </p>
              </div>

              <div className="p-8 border-r border-white/10 flex flex-col justify-center items-center">
                <h4 className="text-4xl font-bold text-white">23</h4>
                <p className="mt-3 text-sm text-white/70 text-center">
                  Relawan aktif
                </p>
              </div>

              <div className="p-8 flex flex-col justify-center items-center">
                <h4 className="text-4xl font-bold text-white">12</h4>
                <p className="mt-3 text-sm text-white/70 text-center">
                  Program berjalan
                </p>
              </div>
            </div>
          </div>

          <div className="border-t border-white/10 px-10 py-6 flex justify-end">
            <Link
                href="/tentangkami/pencapaian/lapooran"
                className="mt-8 flex items-center gap-3 text-sm"
                >
                Baca laporan lengkap →
              </Link>
          </div>
        </div>
      </section>
    </main>
  );
}