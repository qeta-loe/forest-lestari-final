import { getTonggak, getMitra, getGlobalStats } from "@/lib/queries"
import TonggakTimeline from "@/components/tentang/TonggakTimeline"
import MitraGrid from "@/components/tentang/MitraGrid"
import StatsBar from "@/components/tentang/StatsBar"
import PencapaianFilter from "@/components/tentang/PencapaianFilter"
import Link from "next/link"

export const dynamic = "force-dynamic"

export default async function PencapaianPage() {
  const [tonggakList, mitra, stats] = await Promise.all([
    getTonggak(),
    getMitra(),
    getGlobalStats(),
  ])

  return (
    <main className="min-h-screen bg-stone-50">
      {/* HERO */}
      <section className="border-b border-black/10">
        <div className="mx-auto max-w-7xl px-6 py-16 sm:py-20 lg:py-24">
          <span className="rounded-full bg-[#DCE8D5] px-5 py-2 text-sm font-semibold text-emerald-900">
            RIWAYAT PENCAPAIAN
          </span>

          <h1 className="mt-8 max-w-4xl text-4xl font-bold leading-tight text-emerald-900 sm:text-5xl lg:text-6xl">
            Perjalanan menjaga bumi yang kita cintai
          </h1>

          <p className="mt-6 max-w-3xl text-base leading-relaxed text-zinc-600 sm:text-lg">
            Sejak berdiri, Forest Lestari telah menorehkan jejak nyata dalam
            pelestarian hutan, rehabilitasi satwa, dan pemberdayaan komunitas.
          </p>
        </div>
      </section>

      {/* STATS */}
      <section className="border-b border-black/10">
        <div className="mx-auto max-w-7xl">
          <StatsBar stats={stats} />
        </div>
      </section>

      {/* TIMELINE */}
      <section className="mx-auto max-w-7xl px-6 py-16 sm:py-20 lg:py-24">
        <div className="mb-12">
          <h2 className="mb-8 text-3xl font-bold text-emerald-900 sm:text-4xl">
            Tonggak Pencapaian
          </h2>
          <PencapaianFilter active="overview" />
        </div>

        <TonggakTimeline tonggakList={tonggakList} />
      </section>

      {/* MITRA */}
      <section className="mx-auto max-w-7xl px-6 py-16 sm:py-20">
        <h2 className="mb-10 text-3xl font-bold text-emerald-900 sm:text-4xl">
          Jaringan dan Mitra
        </h2>
        <MitraGrid mitra={mitra} />
      </section>

      {/* CTA LAPORAN */}
      <section className="mx-auto max-w-7xl px-6 pb-20 sm:pb-24">
        <div className="overflow-hidden rounded-[32px] bg-[#5F6F65] p-8 sm:p-10">
          <h2 className="text-2xl font-bold text-white sm:text-3xl">
            Laporan Dampak & Program
          </h2>
          <p className="mt-3 max-w-xl text-sm leading-relaxed text-white/80">
            Seluruh data program, capaian lapangan, dan dampak Forest Lestari
            tersusun dalam laporan tahunan.
          </p>
          <Link
            href="/tentangkami/pencapaian/laporan"
            className="mt-6 inline-flex rounded-full bg-white px-6 py-3 text-sm font-semibold text-emerald-900 transition hover:bg-emerald-100"
          >
            Lihat semua laporan
          </Link>
        </div>
      </section>
    </main>
  )
}