import Link from "next/link"
import { notFound } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { getLaporanByTahun, getStatsByTahun } from "@/lib/queries"

export const dynamic = "force-dynamic"

type Laporan = {
  id: number
  tahun: number
  judul: string
  deskripsi: string | null
  tanggal_publikasi: string | null
  file_url: string | null
  created_at: string | null
}

type Stats = {
  totalPohon?: number
  totalBibit?: number
  totalLokasi?: number
  totalKegiatan?: number
  totalProgram?: number
  totalRelawan?: number
  totalSpesies?: number
  totalVarietas?: number
}

type ProgramRow = {
  id: number
  nama_program: string
  tanggal: string | null
  lokasi: string | null
  penerima_manfaat: string | null
  realisasi: string | null
  status: string | null
  tahun: number | null
}

type DistribusiLokasi = {
  nama_lokasi: string
  jumlah_bibit: number
}

function formatMonthYear(value: string | null) {
  if (!value) return "Tanggal tidak tersedia"

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) return "Tanggal tidak tersedia"

  return date.toLocaleDateString("id-ID", {
    month: "long",
    year: "numeric",
  })
}

function formatNumber(value: number) {
  return new Intl.NumberFormat("id-ID").format(value)
}

async function getProgramTahunan(tahun: number): Promise<ProgramRow[]> {
  const { data, error } = await supabase
    .from("program")
    .select(
      "id, nama_program, tanggal, lokasi, penerima_manfaat, realisasi, status, tahun"
    )
    .eq("tahun", tahun)
    .order("tanggal", { ascending: true, nullsFirst: false })

  if (error) {
    console.error("FETCH PROGRAM TAHUNAN ERROR:", error.message)
    return []
  }

  return (data || []) as ProgramRow[]
}

async function getDistribusiPenanaman(
  tahun: number
): Promise<DistribusiLokasi[]> {
  const { data, error } = await supabase
    .from("lokasi_penanaman")
    .select("nama_lokasi, jumlah_bibit, tanggal_tanam")
    .gte("tanggal_tanam", `${tahun}-01-01`)
    .lte("tanggal_tanam", `${tahun}-12-31`)
    .order("jumlah_bibit", { ascending: false, nullsFirst: false })

  if (error) {
    console.error("FETCH DISTRIBUSI PENANAMAN ERROR:", error.message)
    return []
  }

  return (data || []).map((item) => ({
    nama_lokasi: item.nama_lokasi || "Lokasi tanpa nama",
    jumlah_bibit: Number(item.jumlah_bibit || 0),
  }))
}

export default async function DetailLaporanPage({
  params,
}: {
  params: Promise<{ tahun: string }>
}) {
  const { tahun } = await params
  const tahunNum = Number(tahun)

  if (Number.isNaN(tahunNum)) {
    notFound()
  }

  const [laporanRaw, statsRaw, programList, distribusiList] =
    await Promise.all([
      getLaporanByTahun(tahunNum),
      getStatsByTahun(tahunNum),
      getProgramTahunan(tahunNum),
      getDistribusiPenanaman(tahunNum),
    ])

  const laporan = laporanRaw as Laporan | null
  const stats = (statsRaw || {}) as Stats

  if (!laporan) {
    notFound()
  }

  const tanggal = laporan.tanggal_publikasi || laporan.created_at

  const totalPohon = stats.totalPohon ?? stats.totalBibit ?? 0
  const totalLokasi = stats.totalLokasi ?? distribusiList.length
  const totalSpesies = stats.totalSpesies ?? stats.totalVarietas ?? 0

  const maxDistribusi = Math.max(
    ...distribusiList.map((item) => item.jumlah_bibit),
    1
  )

  const distribusiTampil =
    distribusiList.length > 0
      ? distribusiList
      : [
          {
            nama_lokasi: "Belum ada data lokasi",
            jumlah_bibit: 0,
          },
        ]

  return (
    <main className="min-h-screen bg-stone-50">
      {/* HERO */}
      <section className="relative border-b border-black/10 bg-zinc-300">
        <div className="mx-auto max-w-7xl px-6 py-28 sm:py-32 lg:py-36">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="inline-flex rounded-full bg-stone-400 px-6 py-2">
                <span className="text-sm font-semibold tracking-wide text-rose-100">
                  LAPORAN TAHUNAN
                </span>
              </div>

              <h1 className="mt-8 max-w-4xl text-4xl font-bold leading-tight text-emerald-900 sm:text-5xl lg:text-6xl">
                Laporan Dampak Tahunan {laporan.tahun}
              </h1>

              <p className="mt-6 max-w-3xl text-base leading-relaxed text-zinc-700 sm:text-lg">
                Seluruh program, data lapangan, dan pencapaian Forest Lestari
                sepanjang tahun — terdokumentasi dan terverifikasi.
              </p>
            </div>

            <div className="w-fit rounded-[10px] border border-emerald-950 bg-stone-50 px-5 py-2 text-base text-emerald-900">
              Tahun: {laporan.tahun}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-16 sm:py-20">
        {/* CARD PENANAMAN */}
        <div className="rounded-3xl border border-emerald-950 bg-stone-50">
          {/* Header card */}
          <div className="flex flex-col gap-6 border-b border-black/50 px-8 py-8 sm:px-10 lg:flex-row lg:items-center">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center text-4xl leading-none">
              🌳
            </div>

            <h2 className="text-2xl font-bold text-emerald-900 sm:text-3xl">
              Penanaman dan Reforestasi
            </h2>
          </div>

          {/* Statistik */}
          <div className="grid grid-cols-1 border-b border-black/10 sm:grid-cols-3">
            <div className="flex min-h-44 flex-col items-center justify-center border-b border-black/50 px-6 py-8 text-center sm:border-b-0 sm:border-r">
              <p className="text-4xl font-bold text-emerald-900">
                {formatNumber(totalPohon)}
              </p>
              <p className="mt-3 text-base text-emerald-900">Pohon ditanam</p>
              <p className="mt-4 text-sm font-bold text-emerald-900">
                Tercatat tahun {laporan.tahun}
              </p>
            </div>

            <div className="flex min-h-44 flex-col items-center justify-center border-b border-black/50 px-6 py-8 text-center sm:border-b-0 sm:border-r">
              <p className="text-4xl font-bold text-emerald-900">
                {formatNumber(totalLokasi)}
              </p>
              <p className="mt-3 text-base text-emerald-900">
                Lokasi penanaman
              </p>
              <p className="mt-4 text-sm font-bold text-emerald-900">
                Data lokasi aktif
              </p>
            </div>

            <div className="flex min-h-44 flex-col items-center justify-center px-6 py-8 text-center">
              <p className="text-4xl font-bold text-emerald-900">
                {formatNumber(totalSpesies)}
              </p>
              <p className="mt-3 text-base text-emerald-900">
                Spesies varietas ditanam
              </p>
              <p className="mt-4 text-sm font-bold text-emerald-900">
                Data pohon tercatat
              </p>
            </div>
          </div>

          {/* Distribusi */}
          <div className="px-8 py-8 sm:px-10">
            <h3 className="mb-8 text-base font-bold text-emerald-900">
              Distribusi Penanaman per Lokasi
            </h3>

            <div className="space-y-7">
              {distribusiTampil.map((item) => {
                const width =
                  maxDistribusi > 0
                    ? Math.max(
                        4,
                        Math.round((item.jumlah_bibit / maxDistribusi) * 100)
                      )
                    : 0

                return (
                  <div
                    key={item.nama_lokasi}
                    className="grid gap-4 lg:grid-cols-[220px_1fr_120px] lg:items-center"
                  >
                    <p className="text-left text-base text-emerald-900 lg:text-right">
                      {item.nama_lokasi}
                    </p>

                    <div className="h-2 w-full bg-stone-300">
                      <div
                        className="h-2 bg-emerald-900"
                        style={{ width: `${width}%` }}
                      />
                    </div>

                    <p className="text-base font-bold text-emerald-900">
                      {formatNumber(item.jumlah_bibit)}
                    </p>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* REKAP PROGRAM */}
        <div className="mt-16 rounded-3xl border border-emerald-950 bg-stone-50">
          <div className="flex flex-col gap-6 border-b border-black/50 px-8 py-8 sm:px-10 lg:flex-row lg:items-center">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center text-gray-400">
              <svg
                viewBox="0 0 32 40"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="h-10 w-10"
              >
                <rect
                  x="4"
                  y="2"
                  width="24"
                  height="36"
                  rx="2"
                  stroke="currentColor"
                  strokeWidth="2"
                />
                <path
                  d="M10 12H22M10 20H22M10 28H18"
                  stroke="currentColor"
                  strokeWidth="2"
                />
              </svg>
            </div>

            <h2 className="text-2xl font-bold text-emerald-900 sm:text-3xl">
              Rekap Seluruh Program {laporan.tahun}
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[960px] border-collapse">
              <thead>
                <tr className="border-b border-black/50 text-left text-emerald-900">
                  <th className="px-8 py-5 text-xl font-bold">Program</th>
                  <th className="px-8 py-5 text-xl font-bold">Q</th>
                  <th className="px-8 py-5 text-xl font-bold">Lokasi</th>
                  <th className="px-8 py-5 text-xl font-bold">
                    Penerima Manfaat
                  </th>
                  <th className="px-8 py-5 text-xl font-bold">Realisasi</th>
                  <th className="px-8 py-5 text-xl font-bold">Status</th>
                </tr>
              </thead>

              <tbody>
                {programList.length === 0 ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-8 py-10 text-center text-emerald-900"
                    >
                      Belum ada data program pada tahun {laporan.tahun}.
                    </td>
                  </tr>
                ) : (
                  programList.map((program) => (
                    <tr
                      key={program.id}
                      className="border-b border-black/10 text-emerald-900 last:border-b-0"
                    >
                      <td className="px-8 py-5 text-base">
                        {program.nama_program}
                      </td>
                      <td className="px-8 py-5 text-base">
                        {program.tanggal
                          ? `Q${Math.ceil(
                              (new Date(program.tanggal).getMonth() + 1) / 3
                            )}`
                          : "-"}
                      </td>
                      <td className="px-8 py-5 text-base">
                        {program.lokasi || "-"}
                      </td>
                      <td className="px-8 py-5 text-base">
                        {program.penerima_manfaat || "-"}
                      </td>
                      <td className="px-8 py-5 text-base">
                        {program.realisasi || "-"}
                      </td>
                      <td className="px-8 py-5 text-base">
                        <span className="inline-flex items-center gap-2 rounded-3xl bg-gray-600 px-3 py-1 text-xs text-white">
                          <span className="h-1.5 w-1.5 rounded-sm border border-white" />
                          {program.status || "Selesai"}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* BUTTON PDF */}
        <div className="mt-12">
          {laporan.file_url ? (
            <a
              href={laporan.file_url}
              target="_blank"
              rel="noreferrer"
              className="flex min-h-14 w-full items-center justify-center gap-4 rounded-full border border-emerald-950 bg-gray-400 px-6 py-4 text-xl font-bold text-emerald-900 transition hover:bg-gray-300 active:scale-[0.99]"
            >
              <svg
                viewBox="0 0 36 40"
                xmlns="http://www.w3.org/2000/svg"
                className="h-9 w-9 text-emerald-900"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M18 0L36 18H26V40H10V18H0L18 0Z" />
              </svg>

              Unduh PDF Lengkap
            </a>
          ) : (
            <div className="flex min-h-14 w-full items-center justify-center gap-4 rounded-full border border-emerald-950 bg-gray-300 px-6 py-4 text-xl font-bold text-emerald-900/60">
              <svg
                viewBox="0 0 36 40"
                xmlns="http://www.w3.org/2000/svg"
                className="h-9 w-9 text-emerald-900/40"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M18 0L36 18H26V40H10V18H0L18 0Z" />
              </svg>

              PDF belum tersedia
            </div>
          )}
        </div>

        <div className="mt-10">
          <Link
            href="/tentangkami/pencapaian/laporan"
            className="text-sm font-semibold text-emerald-900 hover:underline"
          >
            ← Kembali ke daftar laporan
          </Link>
        </div>
      </section>
    </main>
  )
}