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

const collaborationPrograms = [
  {
    id: 1,
    date: "4 November 2024",
    category: "Kolaborasi",
    title: "Program Restorasi Lingkungan bersama Mitra Konservasi",
    description:
      "Forest Lestari bersama mitra konservasi menjalankan program penghijauan dan monitoring DAS yang merehabilitasi sekitar 25 hektar area serta meningkatkan partisipasi masyarakat dalam pelestarian lingkungan.",
    stats: "12 mitra · 300+ masyarakat terdampak · 25 ha area rehabilitasi",
    image: "https://placehold.co/700x420",
  },
  {
    id: 2,
    date: "18 Desember 2024",
    category: "Kolaborasi",
    title: "Kemitraan Edukasi Konservasi bersama Kampus dan Komunitas",
    description:
      "Kegiatan ini memperkuat kolaborasi antara kampus, komunitas lokal, dan relawan dalam edukasi konservasi, penanaman pohon, serta pemantauan kawasan hijau.",
    stats: "5 kampus · 9 komunitas · 180 peserta",
    image: "https://placehold.co/700x420",
  },
  {
    id: 3,
    date: "15 Februari 2025",
    category: "Kolaborasi",
    title: "Gerakan Relawan Hijau untuk Rehabilitasi Riparian",
    description:
      "Program kolaboratif ini melibatkan relawan lintas komunitas untuk mendukung pemulihan area riparian melalui penanaman spesies lokal dan pendataan lokasi kritis.",
    stats: "120 relawan · 4 lokasi · 600 pohon",
    image: "https://placehold.co/700x420",
  },
  {
    id: 4,
    date: "26 Mei 2025",
    category: "Kolaborasi",
    title: "Forum Mitra untuk Penguatan Program Lingkungan",
    description:
      "Forest Lestari mengadakan forum bersama mitra untuk menyusun rencana program, membagi peran kolaboratif, dan memperluas dampak konservasi berbasis masyarakat.",
    stats: "16 mitra · 7 rencana aksi · 4 wilayah prioritas",
    image: "https://placehold.co/700x420",
  },
]

const stats = [
  {
    value: "16",
    label: "Mitra aktif",
  },
  {
    value: "300+",
    label: "Masyarakat terdampak",
  },
  {
    value: "25",
    label: "Area rehabilitasi (ha)",
  },
  {
    value: "7",
    label: "Program bersama",
  },
]

export default async function KolaborasiPage() {
  const partners = await getMitra()

  return (
    <main className="min-h-screen bg-stone-50">
      {/* HERO */}
      <section className="border-b border-black/10 bg-[#D9D9D9]">
        <div className="mx-auto max-w-7xl px-6 py-24 sm:py-28 lg:py-32">
          <span className="rounded-full bg-[#DCE8D5] px-5 py-2 text-sm font-semibold text-emerald-900">
            KEGIATAN KOLABORASI
          </span>

          <h1 className="mt-8 max-w-4xl text-4xl font-bold leading-tight text-emerald-900 sm:text-5xl lg:text-6xl">
            Menguatkan dampak konservasi melalui kerja bersama
          </h1>

          <p className="mt-8 max-w-3xl text-base leading-relaxed text-zinc-700 sm:text-lg">
            Program kolaborasi Forest Lestari menghubungkan mitra konservasi,
            kampus, komunitas, relawan, dan masyarakat lokal untuk memperluas
            dampak pemulihan lingkungan.
          </p>
        </div>
      </section>

      {/* IMPACT STATS */}
      <section className="border-b border-black/10">
        <div className="mx-auto grid max-w-7xl grid-cols-2 md:grid-cols-4">
          {stats.map((item, index) => (
            <div
              key={item.label}
              className={`px-4 py-10 text-center sm:py-12 ${
                index === 0 || index === 1
                  ? "border-b border-black/10 md:border-b-0"
                  : ""
              } ${
                index !== stats.length - 1
                  ? "md:border-r md:border-black/10"
                  : ""
              } ${index === 0 ? "border-r border-black/10" : ""}`}
            >
              <h2 className="text-3xl font-bold text-emerald-900 sm:text-4xl">
                {item.value}
              </h2>

              <p className="mt-2 text-sm text-zinc-600">
                {item.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* TONGGAK PENCAPAIAN */}
      <section className="mx-auto max-w-7xl px-6 py-16 sm:py-20 lg:py-24">
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-emerald-900 sm:text-4xl">
            Tonggak Pencapaian
          </h2>

          <div className="mt-8 flex flex-wrap justify-start gap-3">
            <Link
              href="/tentangkami/pencapaian"
              className="rounded-full border border-emerald-900 px-5 py-2 text-sm text-emerald-900 transition hover:bg-emerald-900 hover:text-white"
            >
              Overview
            </Link>

            <Link
              href="/tentangkami/pencapaian/penanaman"
              className="rounded-full border border-emerald-900 px-5 py-2 text-sm text-emerald-900 transition hover:bg-emerald-900 hover:text-white"
            >
              Penanaman
            </Link>

            <Link
              href="/tentangkami/pencapaian/das"
              className="rounded-full border border-emerald-900 px-5 py-2 text-sm text-emerald-900 transition hover:bg-emerald-900 hover:text-white"
            >
              DAS
            </Link>

            <Link
              href="/tentangkami/pencapaian/kolaborasi"
              className="rounded-full border border-emerald-900 bg-emerald-900 px-5 py-2 text-sm text-white"
            >
              Kolaborasi
            </Link>
          </div>
        </div>

        <div className="relative border-l border-emerald-900 pl-6 sm:pl-10">
          <div className="space-y-10 sm:space-y-12">
            {collaborationPrograms.map((item) => (
              <article key={item.id} className="relative">
                <div className="absolute -left-[35px] top-8 h-5 w-5 rounded-full bg-emerald-900 sm:-left-[49px]" />

                <div className="overflow-hidden rounded-[32px] bg-[#5F6F65] shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
                  <div className="grid gap-0 lg:grid-cols-[1.3fr_0.7fr]">
                    <div className="flex flex-col justify-center p-6 sm:p-8 lg:p-10">
                      <div className="flex flex-wrap items-center gap-3">
                        <span className="text-xs font-semibold text-white/80">
                          {item.date}
                        </span>

                        <span className="rounded-full bg-orange-300 px-3 py-1 text-[10px] font-semibold text-emerald-950">
                          {item.category}
                        </span>
                      </div>

                      <h3 className="mt-5 text-2xl font-bold leading-snug text-white sm:text-3xl">
                        {item.title}
                      </h3>

                      <p className="mt-5 max-w-2xl text-sm leading-7 text-white/85">
                        {item.description}
                      </p>

                      <p className="mt-5 text-xs font-bold text-white">
                        {item.stats}
                      </p>

                      <Link
                        href={`/tentangkami/pencapaian/kolaborasi/${item.id}`}
                        className="mt-8 inline-flex w-fit items-center justify-center rounded-full border border-white px-5 py-3 text-sm font-semibold text-white transition hover:bg-white hover:text-emerald-900"
                      >
                        Lihat detail
                      </Link>
                    </div>

                    <div className="h-60 w-full bg-zinc-300 lg:h-auto">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* PARTNERS */}
      <section className="mx-auto max-w-7xl px-6 py-16 sm:py-20">
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-emerald-900 sm:text-4xl">
            Jaringan dan Mitra
          </h2>
        </div>

        {partners.length > 0 ? (
          <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-5">
            {partners.map((partner) => (
              <div
                key={partner.id}
                className="flex min-h-40 flex-col items-center justify-center rounded-3xl border border-black/10 bg-white p-5 text-center shadow-sm"
              >
                <div className="mb-5 flex h-20 w-20 items-center justify-center overflow-hidden rounded-2xl bg-zinc-100">
                  <img
                    src={partner.logo_url || "https://placehold.co/160x160"}
                    alt={partner.nama}
                    className="h-full w-full object-contain p-2"
                  />
                </div>

                <p className="text-sm font-medium text-emerald-900">
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

      {/* REPORT CTA */}
      <section className="mx-auto max-w-7xl px-6 pb-20 sm:pb-24">
        <div className="overflow-hidden rounded-[32px] bg-[#5F6F65]">
          <div className="grid lg:grid-cols-[1.2fr_0.8fr]">
            <div className="p-8 sm:p-10 lg:p-12">
              <p className="text-sm font-semibold uppercase tracking-wide text-white/60">
                Laporan Dampak
              </p>

              <h2 className="mt-4 max-w-2xl text-3xl font-bold leading-tight text-white sm:text-4xl">
                Lihat rekap kolaborasi dan dampak program tahunan
              </h2>

              <p className="mt-5 max-w-xl text-sm leading-7 text-white/80">
                Data mitra, jumlah masyarakat terdampak, area rehabilitasi,
                dan program bersama dikompilasi dalam laporan tahunan Forest
                Lestari.
              </p>
            </div>

            <div className="grid grid-cols-3 border-t border-white/10 lg:border-l lg:border-t-0">
              <div className="flex flex-col items-center justify-center border-r border-white/10 p-6 text-center">
                <h3 className="text-3xl font-bold text-white sm:text-4xl">
                  16
                </h3>

                <p className="mt-3 text-xs text-white/70 sm:text-sm">
                  Mitra
                </p>
              </div>

              <div className="flex flex-col items-center justify-center border-r border-white/10 p-6 text-center">
                <h3 className="text-3xl font-bold text-white sm:text-4xl">
                  300+
                </h3>

                <p className="mt-3 text-xs text-white/70 sm:text-sm">
                  Warga
                </p>
              </div>

              <div className="flex flex-col items-center justify-center p-6 text-center">
                <h3 className="text-3xl font-bold text-white sm:text-4xl">
                  25
                </h3>

                <p className="mt-3 text-xs text-white/70 sm:text-sm">
                  Hektare
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3 border-t border-white/10 px-8 py-6 sm:flex-row sm:items-center sm:justify-between sm:px-10">
            <p className="text-sm font-semibold text-white">
              Laporan lengkap tersedia berdasarkan tahun.
            </p>

            <Link
              href="/tentangkami/pencapaian/lapooran"
              className="inline-flex w-fit rounded-full bg-white px-5 py-3 text-sm font-semibold text-emerald-900 transition hover:bg-emerald-100"
            >
              Baca laporan lengkap
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}