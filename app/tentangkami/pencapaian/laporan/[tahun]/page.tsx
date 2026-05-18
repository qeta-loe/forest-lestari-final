import { notFound } from "next/navigation"
import Link from "next/link"
import { getLaporanByTahun, getStatsByTahun } from "@/lib/queries"

export const dynamic = "force-dynamic"

export default async function DetailLaporanPage({
  params,
}: {
  params: { tahun: string }
}) {
  const tahunNum = Number(params.tahun)
  if (isNaN(tahunNum)) notFound()

  const [laporan, stats] = await Promise.all([
    getLaporanByTahun(tahunNum),
    getStatsByTahun(tahunNum),
  ])

  if (!laporan) notFound()

  const tanggal = laporan.tanggal_publikasi
    ? new Date(laporan.tanggal_publikasi).toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : null

  return (
    <main className="min-h-screen bg-stone-50">
      <section className="mx-auto max-w-7xl px-6 py-16 sm:py-20">
        <Link
          href="/tentang-kami/pencapaian/laporan"
          className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-900 hover:underline"
        >
          ← Kembali ke laporan tahunan
        </Link>

        <div className="mt-10 overflow-hidden rounded-[32px] bg-[#5F6F65]">
          {/* Header */}
          <div className="p-8 sm:p-10 lg:p-14">
            <div className="flex flex-wrap items-center gap-4">
              <h1 className="text-6xl font-bold text-emerald-100 sm:text-7xl lg:text-8xl">
                {laporan.tahun}
              </h1>
              <span className="rounded-full bg-white/20 px-4 py-2 text-xs font-semibold text-white">
                Laporan Tahunan
              </span>
            </div>

            {tanggal && (
              <>
                <p className="mt-8 text-xs font-semibold uppercase tracking-wide text-white/60">
                  Dipublikasikan
                </p>
                <p className="mt-1 text-sm font-semibold text-white">{tanggal}</p>
              </>
            )}

            <h2 className="mt-6 max-w-4xl text-2xl font-bold leading-tight text-white sm:text-3xl lg:text-4xl">
              {laporan.judul}
            </h2>

            <p className="mt-5 max-w-4xl text-base leading-8 text-white/80">
              {laporan.deskripsi ?? "Deskripsi laporan belum tersedia."}
            </p>

            {laporan.file_url && (
              <a
                href={laporan.file_url}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-8 inline-flex rounded-full bg-white px-6 py-3 text-sm font-semibold text-emerald-900 transition hover:bg-emerald-100"
              >
                Unduh laporan lengkap
              </a>
            )}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 border-t border-white/10">
            <div className="flex flex-col items-center justify-center border-r border-white/10 p-6 text-center sm:p-8">
              <h3 className="text-3xl font-bold text-white sm:text-4xl">
                {stats.pohon_ditanam}
              </h3>
              <p className="mt-2 text-xs text-white/70 sm:text-sm">Pohon ditanam</p>
            </div>
            <div className="flex flex-col items-center justify-center border-r border-white/10 p-6 text-center sm:p-8">
              <h3 className="text-3xl font-bold text-white sm:text-4xl">
                {stats.relawan_aktif}
              </h3>
              <p className="mt-2 text-xs text-white/70 sm:text-sm">Relawan aktif</p>
            </div>
            <div className="flex flex-col items-center justify-center p-6 text-center sm:p-8">
              <h3 className="text-3xl font-bold text-white sm:text-4xl">
                {stats.program_berjalan}
              </h3>
              <p className="mt-2 text-xs text-white/70 sm:text-sm">Program berjalan</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}