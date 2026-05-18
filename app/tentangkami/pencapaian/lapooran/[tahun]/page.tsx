import Link from "next/link"
import { notFound } from "next/navigation"
import { supabase } from "@/lib/supabase"

export const dynamic = "force-dynamic"

type LaporanTahunan = {
  id: string | number
  tahun: string | number
  judul: string
  deskripsi: string | null
  tanggal_publikasi: string | null
  file_url: string | null
  created_at: string
}

async function getLaporanByTahun(tahun: string) {
  const { data, error } = await supabase
    .from("laporan_tahunan")
    .select("id, tahun, judul, deskripsi, tanggal_publikasi, file_url, created_at")
    .eq("tahun", tahun)
    .single()

  if (error || !data) {
    return null
  }

  return data as LaporanTahunan
}

function formatTanggal(tanggal: string | null) {
  if (!tanggal) return "Tanggal publikasi belum tersedia"

  return new Date(tanggal).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  })
}

export default async function DetailLaporanTahunanPage({
  params,
}: {
  params: {
    tahun: string
  }
}) {
  const report = await getLaporanByTahun(params.tahun)

  if (!report) {
    notFound()
  }

  return (
    <main className="min-h-screen bg-stone-50">
      <section className="border-b border-black/10">
        <div className="mx-auto max-w-7xl px-6 py-20">
          <Link
            href="/tentangkami/pencapaian/lapooran"
            className="text-sm font-semibold text-emerald-900 hover:underline"
          >
            Kembali ke laporan tahunan
          </Link>

          <div className="mt-10 rounded-[32px] bg-[#5F6F65] p-8 sm:p-10 lg:p-14">
            <div className="flex flex-wrap items-center gap-4">
              <h1 className="text-6xl font-bold text-emerald-100 sm:text-7xl">
                {report.tahun}
              </h1>

              <span className="rounded-full bg-white/20 px-4 py-2 text-xs font-semibold text-white">
                Laporan Tahunan
              </span>
            </div>

            <p className="mt-8 text-xs font-semibold uppercase tracking-wide text-white/60">
              Dipublikasikan
            </p>

            <p className="mt-2 text-sm font-semibold text-white">
              {formatTanggal(report.tanggal_publikasi)}
            </p>

            <h2 className="mt-8 max-w-4xl text-3xl font-bold leading-tight text-white sm:text-4xl">
              {report.judul}
            </h2>

            <p className="mt-6 max-w-4xl text-base leading-8 text-white/80">
              {report.deskripsi || "Deskripsi laporan belum tersedia."}
            </p>

            {report.file_url && (
              <a
                href={report.file_url}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-10 inline-flex rounded-full bg-white px-6 py-3 text-sm font-semibold text-emerald-900 transition hover:bg-emerald-100"
              >
                Unduh laporan lengkap
              </a>
            )}
          </div>
        </div>
      </section>
    </main>
  )
}