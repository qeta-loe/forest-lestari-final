import Link from "next/link"
import { LaporanTahunan } from "@/lib/queries"

type Props = {
  laporan: LaporanTahunan
  stats?: {
    pohon_ditanam: number
    relawan_aktif: number
    program_berjalan: number
  }
  isLatest?: boolean
}

export default function LaporanCard({ laporan, stats, isLatest }: Props) {
  const tanggal = laporan.tanggal_publikasi
    ? new Date(laporan.tanggal_publikasi).toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : null

  return (
    <div className="overflow-hidden rounded-3xl bg-[#5F6F65] shadow-sm">
      {/* Header */}
      <div className="p-8 sm:p-10">
        <div className="flex flex-wrap items-center gap-4">
          <h2 className="text-6xl font-bold text-emerald-100 sm:text-7xl">
            {laporan.tahun}
          </h2>
          {isLatest && (
            <span className="rounded-xl bg-white/20 px-4 py-1 text-xs font-bold text-white">
              TERBARU
            </span>
          )}
        </div>

        {tanggal && (
          <p className="mt-4 text-xs font-semibold uppercase tracking-wide text-white/60">
            Dipublikasikan — {tanggal}
          </p>
        )}

        <h3 className="mt-4 text-xl font-bold leading-snug text-white">
          {laporan.judul}
        </h3>

        {laporan.deskripsi && (
          <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-white/80">
            {laporan.deskripsi}
          </p>
        )}
      </div>

      {/* Stats */}
      {stats && (
        <div className="grid grid-cols-3 border-t border-white/10">
          <div className="flex flex-col items-center justify-center border-r border-white/10 p-6 text-center">
            <h4 className="text-3xl font-bold text-white sm:text-4xl">
              {stats.pohon_ditanam}
            </h4>
            <p className="mt-2 text-xs text-white/70 sm:text-sm">Pohon ditanam</p>
          </div>
          <div className="flex flex-col items-center justify-center border-r border-white/10 p-6 text-center">
            <h4 className="text-3xl font-bold text-white sm:text-4xl">
              {stats.relawan_aktif}
            </h4>
            <p className="mt-2 text-xs text-white/70 sm:text-sm">Relawan aktif</p>
          </div>
          <div className="flex flex-col items-center justify-center p-6 text-center">
            <h4 className="text-3xl font-bold text-white sm:text-4xl">
              {stats.program_berjalan}
            </h4>
            <p className="mt-2 text-xs text-white/70 sm:text-sm">Program berjalan</p>
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="flex flex-col gap-3 border-t border-white/10 px-8 py-5 sm:flex-row sm:items-center sm:justify-between">
        <Link
          href={`/tentang-kami/pencapaian/laporan/${laporan.tahun}`}
          className="text-sm font-semibold text-white hover:underline"
        >
          Baca laporan lengkap →
        </Link>
        {laporan.file_url && (
          <a
            href={laporan.file_url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex w-fit rounded-full bg-white px-5 py-2 text-sm font-semibold text-emerald-900 transition hover:bg-emerald-100"
          >
            Unduh PDF
          </a>
        )}
      </div>
    </div>
  )
}