import Link from "next/link"
import { supabase } from "@/lib/supabase"

export const dynamic = "force-dynamic"

type NamaJabatan = {
  id: string | number
  section_id: string
  nama: string
  jabatan: string
  urutan: number | null
  foto_url: string | null
  linkedin_url: string | null
  created_at: string
}

async function getNamaJabatan() {
  const { data, error } = await supabase
    .from("nama_jabatan")
    .select(
      "id, section_id, nama, jabatan, urutan, foto_url, linkedin_url, created_at"
    )
    .order("urutan", { ascending: true })

  if (error) {
    console.error("Gagal mengambil data nama_jabatan:", error.message)
    return []
  }

  return data as NamaJabatan[]
}

export default async function TentangKamiPage() {
  const namaJabatan = await getNamaJabatan()

  const trustees = namaJabatan.filter(
    (item) => item.section_id === "trustees"
  )

  const executives = namaJabatan.filter(
    (item) => item.section_id === "executives"
  )

  const teams = namaJabatan.filter(
    (item) => item.section_id === "teams"
  )

  const stats = [
    ["340", "Pohon ditanam"],
    ["52", "Total relawan"],
    ["455", "Area penghijauan (ha)"],
    ["4", "DAS dipantau aktif"],
  ]

  const MemberCard = ({
    item,
    imageRatio = "aspect-[4/3]",
  }: {
    item: NamaJabatan
    imageRatio?: string
  }) => {
    return (
      <article className="flex h-full flex-col overflow-hidden rounded-[28px] bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md">
        <div className={`w-full overflow-hidden bg-zinc-300 ${imageRatio}`}>
          <img
            src={item.foto_url || "https://placehold.co/300x240"}
            alt={item.nama}
            className="h-full w-full object-cover"
          />
        </div>

        <div className="flex min-h-[96px] flex-1 flex-col items-center justify-center bg-[#6D6D6D] px-4 py-5 text-center">
          <h3 className="text-base font-bold leading-tight text-white sm:text-lg">
            {item.nama}
          </h3>

          <p className="mt-2 text-sm font-semibold leading-snug text-[#113522]">
            {item.jabatan}
          </p>

          {item.linkedin_url && (
            <a
              href={item.linkedin_url}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 text-xs font-semibold text-white underline underline-offset-4"
            >
              LinkedIn
            </a>
          )}
        </div>
      </article>
    )
  }

  return (
    <main className="min-h-screen bg-[#F7F6EF] text-[#113522]">
      {/* HERO */}
      <section className="relative h-[500px] overflow-hidden lg:h-[620px]">
        <img
          src="https://placehold.co/1440x620"
          alt="hero"
          className="absolute inset-0 h-full w-full object-cover"
        />

        <div className="absolute inset-0 bg-black/40" />

        <div className="relative mx-auto flex h-full max-w-7xl items-end px-6 pb-14 lg:px-10">
          <div className="max-w-3xl">
            <div className="inline-flex rounded-full bg-white/20 px-4 py-2 backdrop-blur-sm">
              <p className="text-xs font-semibold tracking-[0.2em] text-white">
                PROFIL KOMUNITAS
              </p>
            </div>

            <h1 className="mt-6 font-['Newsreader'] text-4xl leading-tight text-white sm:text-5xl lg:text-6xl">
              Menjaga Warisan, Melindungi Masa Depan
            </h1>

            <p className="mt-6 text-sm leading-7 text-white/90 sm:text-base">
              Forest Lestari lahir pada tanggal 13 September 2024 yang
              bermula dari gerakan mahasiswa yang gelisah terhadap
              keanekaragaman hayati Indonesia yang semakin terancam.
            </p>
          </div>
        </div>
      </section>

      {/* TUJUAN */}
      <section className="mx-auto max-w-7xl px-6 py-16 lg:px-10">
        <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
          <div>
            <div className="inline-flex rounded-2xl bg-[#D9E5DC] px-5 py-3">
              <h2 className="text-xl font-bold">Tujuan Strategis</h2>
            </div>

            <div className="mt-6 rounded-[24px] border border-black/10 bg-white p-6 sm:p-8">
              <p className="leading-8 text-zinc-700">
                Memberikan dampak pada rehabilitasi lingkungan melalui
                edukasi, diskusi, dan konservasi terhadap kelestarian
                satwa dan fauna.
              </p>
            </div>
          </div>

          <div className="aspect-[4/3] overflow-hidden rounded-[32px] bg-zinc-300 lg:aspect-auto lg:h-[420px]">
            <img
              src="https://placehold.co/600x420"
              alt="tujuan strategis"
              className="h-full w-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* STRUKTUR ORGANISASI */}
      <section className="border-y border-black/10 py-16">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <h2 className="text-center text-3xl font-bold">
            Struktur Organisasi
          </h2>

          {/* BOARD OF TRUSTEES */}
          {trustees.length > 0 && (
            <div className="mt-16">
              <div className="mx-auto mb-10 w-fit rounded-2xl bg-white px-6 py-3 shadow-sm">
                <p className="font-semibold text-[#113522]">
                  Board of Trustees
                </p>
              </div>

              <div className="mx-auto grid max-w-3xl grid-cols-1 gap-8 sm:grid-cols-2">
                {trustees.map((item) => (
                  <MemberCard
                    key={item.id}
                    item={item}
                    imageRatio="aspect-square"
                  />
                ))}
              </div>
            </div>
          )}

          {/* EXECUTIVES */}
          {executives.length > 0 && (
            <div className="mt-24">
              <div className="mx-auto mb-10 w-fit rounded-2xl bg-white px-6 py-3 shadow-sm">
                <p className="font-semibold text-[#113522]">
                  Executives
                </p>
              </div>

              <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {executives.map((item) => (
                  <MemberCard key={item.id} item={item} />
                ))}
              </div>
            </div>
          )}

          {/* THE TEAM */}
          {teams.length > 0 && (
            <div className="mt-24">
              <div className="mx-auto mb-10 w-fit rounded-2xl bg-white px-6 py-3 shadow-sm">
                <p className="font-semibold text-[#113522]">
                  The Team
                </p>
              </div>

              <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {teams.map((item) => (
                  <MemberCard key={item.id} item={item} />
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* RIWAYAT */}
      <section className="mx-auto max-w-7xl px-6 py-16 lg:px-10">
        <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#315B47]">
          Jejak Langkah
        </p>

        <div className="mt-3 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <h2 className="text-3xl font-bold">
            Riwayat Pencapaian
          </h2>

          <Link
            href="/tentangkami/pencapaian"
            className="w-fit rounded-full border border-[#113522] px-6 py-3 text-sm transition hover:bg-[#113522] hover:text-white"
          >
            Selengkapnya
          </Link>
        </div>

        <div className="mt-10 grid gap-8 lg:grid-cols-[1.6fr_1fr]">
          <article className="overflow-hidden rounded-[32px] bg-[#4F4F4F]">
            <div className="grid md:grid-cols-[280px_1fr]">
              <div className="aspect-[4/3] bg-zinc-300 md:aspect-auto md:min-h-[320px]">
                <img
                  src="https://placehold.co/300x400"
                  alt="program"
                  className="h-full w-full object-cover"
                />
              </div>

              <div className="flex flex-col justify-center p-6 text-white sm:p-8">
                <p className="text-xs">3 Maret 2025</p>

                <h3 className="mt-3 text-xl font-bold leading-tight text-[#D7F4E4] sm:text-2xl">
                  Penanaman 300 Pohon di DAS Cisadane
                </h3>

                <p className="mt-5 text-sm leading-7 text-white/90">
                  Rehabilitasi kawasan riparian sepanjang 4,2 km di
                  hulu DAS Cisadane bersama komunitas lokal dan
                  mahasiswa IPB.
                </p>

                <Link
                  href="/tentangkami/pencapaian"
                  className="mt-8 flex w-fit items-center gap-3 text-sm hover:underline"
                >
                  Lihat detail
                </Link>
              </div>
            </div>
          </article>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            {stats.map((item, index) => (
              <div
                key={index}
                className="rounded-[28px] border border-black bg-white p-6 text-center"
              >
                <h3 className="text-3xl font-bold text-[#113522] sm:text-4xl">
                  {item[0]}
                </h3>

                <p className="mt-3 text-sm text-[#315B47]">
                  {item[1]}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}