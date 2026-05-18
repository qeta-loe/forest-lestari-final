import Link from "next/link"
import { getOrganisasi, getTonggak, getGlobalStats } from "@/lib/queries"
import OrganisasiSection from "@/components/tentang/OrganisasiSection"
import TonggakTimeline from "@/components/tentang/TonggakTimeline"
import StatsBar from "@/components/tentang/StatsBar"

export const dynamic = "force-dynamic"

export default async function TentangKamiPage() {
  const [sections, tonggakAll, stats] = await Promise.all([
    getOrganisasi(),
    getTonggak(),
    getGlobalStats(),
  ])

  // ambil tonggak terbaru untuk preview di halaman utama
  const tonggakPreview = tonggakAll.slice(0, 1)

  return (
    <main className="min-h-screen bg-[#F7F6EF] text-[#113522]">
      {/* HERO */}
      <section className="relative h-[500px] overflow-hidden lg:h-[620px]">
        <img
          src="https://placehold.co/1440x620"
          alt="hero tentang kami"
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

            <p className="mt-6 text-sm leading-7 text-white/90 sm:text-base lg:max-w-2xl">
              Forest Lestari lahir pada tanggal 13 September 2024 yang bermula
              dari gerakan mahasiswa yang gelisah terhadap keanekaragaman hayati
              Indonesia yang semakin terancam.
            </p>
          </div>
        </div>
      </section>

      {/* TUJUAN STRATEGIS */}
      <section className="mx-auto max-w-7xl px-6 py-16 lg:px-10">
        <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
          <div>
            <div className="inline-flex rounded-2xl bg-[#D9E5DC] px-5 py-3">
              <h2 className="text-xl font-bold">Tujuan Strategis</h2>
            </div>

            <div className="mt-6 rounded-[24px] border border-black/10 bg-white p-6 sm:p-8">
              <p className="leading-8 text-zinc-700">
                Memberikan dampak pada rehabilitasi lingkungan melalui edukasi,
                diskusi, dan konservasi terhadap kelestarian satwa dan fauna serta
                berupaya mengurangi dampak kerusakan lingkungan yang terjadi, baik
                di Indonesia maupun di dunia.
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
          <h2 className="mb-16 text-center text-3xl font-bold">
            Struktur Organisasi
          </h2>
          <OrganisasiSection sections={sections} />
        </div>
      </section>

      {/* STATS */}
      <section className="border-b border-black/10">
        <div className="mx-auto max-w-7xl">
          <StatsBar stats={stats} />
        </div>
      </section>

      {/* RIWAYAT PENCAPAIAN PREVIEW */}
      <section className="mx-auto max-w-7xl px-6 py-16 lg:px-10">
        <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#315B47]">
          Jejak Langkah
        </p>

        <div className="mt-3 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-3xl font-bold">Riwayat Pencapaian</h2>
          <Link
            href="/tentangkami/pencapaian"
            className="w-fit rounded-full border border-[#113522] px-6 py-3 text-sm transition hover:bg-[#113522] hover:text-white"
          >
            Selengkapnya
          </Link>
        </div>

        {/* Preview tonggak terbaru */}
        {tonggakPreview.length > 0 && (
          <div className="mt-10">
            <TonggakTimeline tonggakList={tonggakPreview} />
          </div>
        )}
      </section>
    </main>
  )
}