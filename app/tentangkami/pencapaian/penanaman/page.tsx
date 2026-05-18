import { getTonggak, getMitra } from "@/lib/queries"
import TonggakTimeline from "@/components/tentang/TonggakTimeline"
import MitraGrid from "@/components/tentang/MitraGrid"
import PencapaianFilter from "@/components/tentang/PencapaianFilter"
import Link from "next/link"

export const dynamic = "force-dynamic"

export default async function PenanamanPage() {
  const [tonggakList, mitra] = await Promise.all([
    getTonggak("penanaman"),
    getMitra(),
  ])

  return (
    <main className="min-h-screen bg-stone-50">
      <section className="border-b border-black/10 bg-[#D9D9D9]">
        <div className="mx-auto max-w-7xl px-6 py-16 sm:py-20 lg:py-24">
          <span className="rounded-full bg-[#DCE8D5] px-5 py-2 text-sm font-semibold text-emerald-900">
            KEGIATAN PENANAMAN
          </span>
          <h1 className="mt-8 max-w-4xl text-4xl font-bold leading-tight text-emerald-900 sm:text-5xl lg:text-6xl">
            Menumbuhkan kembali ruang hidup yang rusak
          </h1>
          <p className="mt-6 max-w-3xl text-base leading-relaxed text-zinc-700 sm:text-lg">
            Program penanaman Forest Lestari berfokus pada pemulihan kawasan
            riparian, penghijauan area kritis, dan pelibatan masyarakat dalam
            konservasi berbasis aksi nyata.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-16 sm:py-20 lg:py-24">
        <div className="mb-12">
          <h2 className="mb-8 text-3xl font-bold text-emerald-900 sm:text-4xl">
            Tonggak Pencapaian
          </h2>
          <PencapaianFilter active="penanaman" />
        </div>
        <TonggakTimeline tonggakList={tonggakList} />
      </section>

      <section className="mx-auto max-w-7xl px-6 py-16 sm:py-20">
        <h2 className="mb-10 text-3xl font-bold text-emerald-900 sm:text-4xl">
          Jaringan dan Mitra
        </h2>
        <MitraGrid mitra={mitra} />
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-20 sm:pb-24">
        <div className="overflow-hidden rounded-[32px] bg-[#5F6F65] p-8 sm:p-10">
          <p className="text-sm font-semibold uppercase tracking-wide text-white/60">
            Laporan Dampak
          </p>
          <h2 className="mt-3 max-w-2xl text-2xl font-bold text-white sm:text-3xl">
            Lihat rekap dampak dan program penanaman tahunan
          </h2>
          <Link
            href="/tentangkami/pencapaian/laporan"
            className="mt-6 inline-flex rounded-full bg-white px-6 py-3 text-sm font-semibold text-emerald-900 transition hover:bg-emerald-100"
          >
            Baca laporan lengkap
          </Link>
        </div>
      </section>
    </main>
  )
}