import Link from "next/link"
import { supabase } from "@/lib/supabase"

export const dynamic = "force-dynamic"

type Mitra = {
  id: string | number
  nama: string
  logo_url: string | null
  created_at: string
}

async function getMitra() {
  const { data, error } = await supabase
    .from("mitra")
    .select("id, nama, logo_url, created_at")
    .order("created_at", { ascending: true })

  if (error) {
    console.error("Gagal mengambil data mitra:", error.message)
    return []
  }

  return data as Mitra[]
}

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
]

export default async function RiwayatPencapaianPage() {
  const partners = await getMitra()

  return (
    <main className="min-h-screen bg-stone-50">
      {/* HERO */}
      <section className="border-b border-black/10">
        <div className="mx-auto max-w-7xl px-6 py-24">
          <span className="rounded-full bg-[#DCE8D5] px-5 py-2 text-sm font-semibold text-emerald-900">
            RIWAYAT PENCAPAIAN
          </span>

          <h1 className="mt-8 max-w-4xl text-5xl font-bold leading-tight text-emerald-900 md:text-6xl">
            Perjalanan menjaga bumi yang kita cintai
          </h1>

          <p className="mt-8 max-w-3xl text-lg leading-relaxed text-zinc-600">
            Sejak 2019 Forest Lestari telah menorehkan jejak nyata dalam
            pelestarian hutan, rehabilitasi satwa, dan pemberdayaan komunitas.
          </p>
        </div>
      </section>

      {/* IMPACT STATS */}
      <section className="border-b border-black/10">
        <div className="mx-auto grid max-w-7xl grid-cols-2 md:grid-cols-4">
          <div className="border-r border-black/10 py-12 text-center">
            <h2 className="text-4xl font-bold text-emerald-900">340</h2>
            <p className="mt-2 text-sm text-zinc-600">Pohon ditanam</p>
          </div>

          <div className="border-r border-black/10 py-12 text-center">
            <h2 className="text-4xl font-bold text-emerald-900">52</h2>
            <p className="mt-2 text-sm text-zinc-600">Total relawan</p>
          </div>

          <div className="border-r border-black/10 py-12 text-center">
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
      <section className="mx-auto max-w-7xl px-6 py-24">
        <div className="mb-16 flex flex-wrap gap-4">
          {[
            "Overview",
            "Penanaman",
            "Orangutan",
            "DAS",
            "Kolaborasi",
          ].map((item) => (
            <button
              key={item}
              className="rounded-full border border-emerald-900 px-6 py-2 text-emerald-900 transition hover:bg-emerald-900 hover:text-white"
            >
              {item}
            </button>
          ))}
        </div>

        <div className="relative space-y-16 border-l border-emerald-900 pl-10">
          {achievements.map((item) => (
            <div key={item.id} className="relative">
              <div className="absolute -left-[49px] top-8 h-5 w-5 rounded-full bg-emerald-900" />

              <div className="flex flex-col gap-10 rounded-3xl bg-[#5F6F65] p-8 lg:flex-row">
                <div className="flex-1">
                  <div className="flex items-center gap-4">
                    <span className="text-xs text-white">
                      {item.date}
                    </span>

                    <span
                      className={`rounded-full px-3 py-1 text-[10px] text-white ${item.color}`}
                    >
                      {item.category}
                    </span>
                  </div>

                  <h2 className="mt-5 text-3xl font-bold leading-snug text-white">
                    {item.title}
                  </h2>

                  <p className="mt-5 max-w-2xl text-sm leading-relaxed text-white/90">
                    {item.description}
                  </p>

                  <div className="mt-5 text-xs font-semibold text-white">
                    {item.stats}
                  </div>

                  <Link
                    href={`/tentang-kami/riwayat-pencapaian/${item.id}`}
                    className="mt-8 inline-flex items-center gap-3 text-sm text-white hover:underline"
                  >
                    Lihat detail
                  </Link>
                </div>

                <div className="h-56 w-full shrink-0 rounded-3xl bg-zinc-300 lg:w-80" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* PARTNERS */}
      <section className="mx-auto max-w-7xl px-6 py-24">
        <h2 className="mb-14 text-4xl font-bold text-emerald-900">
          Jaringan dan Mitra
        </h2>

        {partners.length > 0 ? (
          <div className="grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-5">
            {partners.map((partner) => (
              <div
                key={partner.id}
                className="flex flex-col items-center justify-center rounded-3xl border border-black/10 bg-white p-6"
              >
                <div className="mb-5 flex h-20 w-20 items-center justify-center overflow-hidden rounded-2xl bg-zinc-100">
                  <img
                    src={partner.logo_url || "https://placehold.co/160x160"}
                    alt={partner.nama}
                    className="h-full w-full object-contain p-2"
                  />
                </div>

                <p className="text-center text-sm text-emerald-900">
                  {partner.nama}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-3xl border border-black/10 bg-white p-8 text-center">
            <p className="text-sm text-zinc-600">
              Data mitra belum tersedia.
            </p>
          </div>
        )}
      </section>

      {/* REPORT */}
      <section className="mx-auto max-w-7xl px-6 pb-24">
        <div className="overflow-hidden rounded-3xl bg-[#5F6F65]">
          <div className="grid lg:grid-cols-2">
            <div className="p-10">
              <div className="flex items-center gap-4">
                <h2 className="text-7xl font-bold text-emerald-100">
                  2024
                </h2>

                <span className="rounded-xl bg-white/20 px-4 py-1 text-xs font-bold text-white">
                  TERBARU
                </span>
              </div>

              <h3 className="mt-10 text-2xl font-bold text-white">
                Laporan Tahunan - Rekap Dampak dan Program 2024
              </h3>

              <p className="mt-5 max-w-xl text-sm leading-relaxed text-white/80">
                Kompilasi lengkap seluruh program sepanjang 2024:
                penanaman pohon, rehabilitasi orangutan, monitoring DAS,
                edukasi masyarakat, dan jaringan kemitraan.
              </p>
            </div>

            <div className="grid grid-cols-3 border-t border-white/10 lg:border-l lg:border-t-0">
              <div className="flex flex-col items-center justify-center border-r border-white/10 p-8">
                <h4 className="text-4xl font-bold text-white">78</h4>
                <p className="mt-3 text-center text-sm text-white/70">
                  Pohon ditanam
                </p>
              </div>

              <div className="flex flex-col items-center justify-center border-r border-white/10 p-8">
                <h4 className="text-4xl font-bold text-white">23</h4>
                <p className="mt-3 text-center text-sm text-white/70">
                  Relawan aktif
                </p>
              </div>

              <div className="flex flex-col items-center justify-center p-8">
                <h4 className="text-4xl font-bold text-white">12</h4>
                <p className="mt-3 text-center text-sm text-white/70">
                  Program berjalan
                </p>
              </div>
            </div>
          </div>

          <div className="flex justify-end border-t border-white/10 px-10 py-6">
            <Link
              href="/tentangkami/pencapaian/lapooran"
              className="text-sm text-white hover:underline"
            >
              Baca laporan lengkap
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}