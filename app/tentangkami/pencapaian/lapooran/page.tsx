import Link from "next/link"
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

async function getLaporanTahunan() {
  const { data, error } = await supabase
    .from("laporan_tahunan")
    .select("id, tahun, judul, deskripsi, tanggal_publikasi, file_url, created_at")
    .order("tahun", { ascending: false })

  if (error) {
    console.error("Gagal mengambil data laporan tahunan:", error.message)
    return []
  }

  return data as LaporanTahunan[]
}

function formatTanggal(tanggal: string | null) {
  if (!tanggal) return "Tanggal publikasi belum tersedia"

  return new Date(tanggal).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  })
}

export default async function LaporanTahunanPage() {
  const reports = await getLaporanTahunan()

  return (
    <main className="min-h-screen bg-stone-50">
      {/* HERO */}
      <section className="border-b border-black/10 bg-[#D9D9D9]">
        <div className="mx-auto max-w-7xl px-6 py-24 sm:py-28 lg:py-32">
          <div className="inline-flex items-center rounded-full bg-stone-400 px-5 py-2">
            <span className="text-sm font-semibold tracking-wide text-white">
              LAPORAN TAHUNAN
            </span>
          </div>

          <h1 className="mt-8 max-w-4xl text-4xl font-bold leading-tight text-emerald-900 sm:text-5xl lg:text-6xl">
            Laporan Dampak Tahunan
          </h1>

          <p className="mt-6 max-w-3xl text-base leading-relaxed text-zinc-700 sm:text-lg">
            Seluruh laporan tahunan Forest Lestari tersusun berdasarkan tahun
            dan akan muncul otomatis setelah admin menambahkan data baru.
          </p>
        </div>
      </section>

      {/* REPORT CARDS */}
      <section className="mx-auto max-w-7xl px-6 py-16 sm:py-20">
        {reports.length > 0 ? (
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-3">
            {reports.map((report) => (
              <article
                key={report.id}
                className="flex h-full flex-col overflow-hidden rounded-[32px] bg-[#5F6F65] shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="flex flex-1 flex-col p-6 sm:p-8">
                  <div className="flex items-start justify-between gap-4">
                    <h2 className="text-5xl font-bold text-emerald-100 sm:text-6xl">
                      {report.tahun}
                    </h2>

                    <span className="rounded-full bg-white/20 px-4 py-2 text-xs font-semibold text-white">
                      Laporan
                    </span>
                  </div>

                  <p className="mt-6 text-xs font-semibold uppercase tracking-wide text-white/60">
                    Dipublikasikan
                  </p>

                  <p className="mt-2 text-sm font-semibold text-white">
                    {formatTanggal(report.tanggal_publikasi)}
                  </p>

                  <h3 className="mt-6 text-xl font-bold leading-snug text-white">
                    {report.judul}
                  </h3>

                  <p className="mt-4 line-clamp-5 text-sm leading-relaxed text-white/80">
                    {report.deskripsi || "Deskripsi laporan belum tersedia."}
                  </p>

                  <div className="mt-auto flex flex-col gap-3 pt-8">
                    <Link
                      href={`/tentangkami/pencapaian/lapooran/${report.tahun}`}
                      className="inline-flex w-full items-center justify-center rounded-full border border-white px-5 py-3 text-sm font-semibold text-white transition hover:bg-white hover:text-emerald-900"
                    >
                      Baca detail
                    </Link>

                    {report.file_url && (
                      <a
                        href={report.file_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex w-full items-center justify-center rounded-full bg-white px-5 py-3 text-sm font-semibold text-emerald-900 transition hover:bg-emerald-100"
                      >
                        Unduh laporan
                      </a>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="rounded-[32px] border border-black/10 bg-white p-10 text-center">
            <h2 className="text-2xl font-bold text-emerald-900">
              Belum ada laporan tahunan
            </h2>

            <p className="mt-3 text-sm leading-relaxed text-zinc-600">
              Data akan muncul otomatis setelah admin menambahkan laporan
              tahunan di Supabase.
            </p>
          </div>
        )}
      </section>
    </main>
  )
}