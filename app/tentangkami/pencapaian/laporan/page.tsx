import { getLaporanTahunan, getStatsByTahun } from "@/lib/queries"
import LaporanCard from "@/components/tentang/LaporanCard"

export const dynamic = "force-dynamic"

export default async function LaporanPage() {
  const laporanList = await getLaporanTahunan()

  // fetch stats untuk tiap laporan secara paralel
  const statsPerLaporan = await Promise.all(
    laporanList.map((l) => getStatsByTahun(l.tahun))
  )

  return (
    <main className="min-h-screen bg-stone-50">
      <section className="border-b border-black/10 bg-[#D9D9D9]">
        <div className="mx-auto max-w-7xl px-6 py-16 sm:py-20 lg:py-24">
          <div className="inline-flex rounded-full bg-stone-400 px-5 py-2">
            <span className="text-sm font-semibold tracking-wide text-white">
              LAPORAN TAHUNAN
            </span>
          </div>

          <h1 className="mt-8 max-w-4xl text-4xl font-bold leading-tight text-emerald-900 sm:text-5xl lg:text-6xl">
            Laporan Dampak Tahunan
          </h1>

          <p className="mt-6 max-w-3xl text-base leading-relaxed text-zinc-700 sm:text-lg">
            Seluruh program, data lapangan, dan pencapaian Forest Lestari
            sepanjang tahun — terdokumentasi dan terverifikasi.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-16 sm:py-20">
        {laporanList.length === 0 ? (
          <div className="rounded-[32px] border border-black/10 bg-white p-10 text-center">
            <h2 className="text-2xl font-bold text-emerald-900">
              Belum ada laporan tahunan
            </h2>
            <p className="mt-3 text-sm text-zinc-600">
              Data akan muncul otomatis setelah admin menambahkan laporan.
            </p>
          </div>
        ) : (
          <div className="space-y-8">
            {laporanList.map((laporan, i) => (
              <LaporanCard
                key={laporan.id}
                laporan={laporan}
                stats={statsPerLaporan[i]}
                isLatest={i === 0}
              />
            ))}
          </div>
        )}
      </section>
    </main>
  )
}