import Link from "next/link"

type Laporan = {
  id: number
  tahun: number
  judul: string
  deskripsi: string | null
  tanggal_publikasi: string | null
  file_url?: string | null
  created_at?: string | null
}

type Stats = {
  totalKegiatan?: number
  totalBibit?: number
  totalPohon?: number
  totalLokasi?: number
  totalRelawan?: number
  totalProgram?: number

  pohon_ditanam?: number
  relawan_aktif?: number
  program_berjalan?: number
}

type Props = {
  laporan: Laporan
  stats?: Stats
  isLatest?: boolean
}

function formatBulanTahun(value?: string | null) {
  if (!value) return "Tanggal tidak tersedia"

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) return "Tanggal tidak tersedia"

  return date.toLocaleDateString("id-ID", {
    month: "long",
    year: "numeric",
  })
}

export default function LaporanCard({ laporan, stats, isLatest }: Props) {
  const tanggal = laporan.tanggal_publikasi || laporan.created_at

  const totalPohon =
  stats?.totalPohon ?? stats?.totalBibit ?? stats?.pohon_ditanam ?? 0

const totalRelawan =
  stats?.totalRelawan ?? stats?.relawan_aktif ?? 0

const totalProgram =
  stats?.totalProgram ?? stats?.totalKegiatan ?? stats?.program_berjalan ?? 0

  return (
    <div className="overflow-hidden rounded-3xl bg-emerald-900/50 shadow-sm">
      {/* BAGIAN ATAS CARD */}
      <div className="grid gap-8 px-8 py-10 sm:px-12 lg:grid-cols-[1fr_45%]">
        {/* KIRI */}
        <div>
          <div className="flex flex-wrap items-center gap-5">
            <h2 className="text-7xl font-bold leading-none text-emerald-900 sm:text-8xl">
              {laporan.tahun}
            </h2>

            {isLatest && (
              <span className="rounded-xl bg-gray-600 px-6 py-2 text-xs font-bold text-white">
                TERBARU
              </span>
            )}
          </div>

          <h3 className="mt-12 text-base font-bold text-white">
            {laporan.judul}
          </h3>

          {laporan.deskripsi && (
            <p className="mt-4 max-w-xl text-sm leading-relaxed text-white">
              {laporan.deskripsi}
            </p>
          )}
        </div>

        {/* KANAN */}
        <div className="pt-2 text-left lg:text-left">
          <p className="text-base font-bold text-white">Diterbitkan</p>
          <p className="mt-4 text-xl text-white">
            {formatBulanTahun(tanggal)}
          </p>
        </div>
      </div>

      {/* BAGIAN STATISTIK */}
      <div className="border-y border-black/10 bg-gray-300">
        <div className="grid grid-cols-1 sm:grid-cols-3">
          <div className="flex min-h-40 flex-col items-center justify-center border-b border-black/10 px-6 py-8 sm:border-b-0 sm:border-r">
            <p className="text-4xl font-bold text-emerald-900">
              {totalPohon}
            </p>
            <p className="mt-3 text-sm text-emerald-900">Pohon ditanam</p>
          </div>

          <div className="flex min-h-40 flex-col items-center justify-center border-b border-black/10 px-6 py-8 sm:border-b-0 sm:border-r">
            <p className="text-4xl font-bold text-emerald-900">
              {totalRelawan}
            </p>
            <p className="mt-3 text-sm text-emerald-900">Relawan aktif</p>
          </div>

          <div className="flex min-h-40 flex-col items-center justify-center px-6 py-8">
            <p className="text-4xl font-bold text-emerald-900">
              {totalProgram}
            </p>
            <p className="mt-3 text-sm text-emerald-900">Program berjalan</p>
          </div>
        </div>
      </div>

      {/* LINK BACA LAPORAN */}
      <div className="flex justify-end px-8 py-6 sm:px-12">
        <Link
          href={`/tentangkami/pencapaian/laporan/${laporan.tahun}`}
          className="inline-flex items-center gap-3 text-sm font-bold text-white transition hover:text-emerald-100"
        >
          Baca laporan lengkap
          <span className="text-base leading-none">→</span>
        </Link>
      </div>
    </div>
  )
}