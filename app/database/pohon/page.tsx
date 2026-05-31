import type { ReactNode } from "react"
import Link from "next/link"
import { supabase } from "@/lib/supabase"

export const dynamic = "force-dynamic"

async function getPohonData() {
  const { data, error } = await supabase
    .from("pohon")
    .select(`
      id,
      nama_umum,
      nama_ilmiah,
      jumlah,
      lokasi_penanaman (nama_lokasi)
    `)
    .order("jumlah", { ascending: false })

  if (error || !data) return []

  return data as {
    id: number
    nama_umum: string
    nama_ilmiah: string | null
    jumlah: number
    lokasi_penanaman: { nama_lokasi: string }[]
  }[]
}

function formatNumber(value: number) {
  return value.toLocaleString("id-ID")
}

function TabButton({
  href,
  active,
  children,
}: {
  href: string
  active?: boolean
  children: ReactNode
}) {
  return (
    <Link
      href={href}
      className={`inline-flex min-h-10 items-center justify-center rounded-full border border-emerald-950 px-5 py-2 text-sm transition active:scale-95 sm:text-base ${
        active
          ? "bg-emerald-900 text-stone-50 hover:bg-emerald-950"
          : "bg-stone-50 text-emerald-900 hover:bg-emerald-50"
      }`}
    >
      {children}
    </Link>
  )
}

export default async function DatabasePohonPage() {
  const pohonData = await getPohonData()

  const loading = false
  const errorMessage = ""

  const distributionMap = new Map<
    string,
    { nama_ilmiah: string | null; jumlah: number }
  >()

  for (const p of pohonData) {
    const existing = distributionMap.get(p.nama_umum)

    if (existing) {
      existing.jumlah += p.jumlah
    } else {
      distributionMap.set(p.nama_umum, {
        nama_ilmiah: p.nama_ilmiah,
        jumlah: p.jumlah,
      })
    }
  }

  const distributionRows = Array.from(distributionMap.entries())
    .map(([nama_umum, v]) => ({
      name: nama_umum,
      scientificName: v.nama_ilmiah ?? "",
      value: v.jumlah,
    }))
    .sort((a, b) => b.value - a.value)

  const lokasiMap = new Map<string, Map<string, number>>()

  for (const p of pohonData) {
    const lokasi = p.lokasi_penanaman?.[0]?.nama_lokasi ?? "Tidak diketahui"

    if (!lokasiMap.has(lokasi)) {
      lokasiMap.set(lokasi, new Map())
    }

    const jenisMasp = lokasiMap.get(lokasi)!

    jenisMasp.set(p.nama_umum, (jenisMasp.get(p.nama_umum) ?? 0) + p.jumlah)
  }

  const tableHeaders = ["Area", ...distributionRows.map((d) => d.name)]

  const tableRows = Array.from(lokasiMap.entries()).map(([area, jenisMap]) => ({
    area,
    values: distributionRows.map((d) => jenisMap.get(d.name) ?? 0),
  }))

  const totalPohon = distributionRows.reduce((sum, d) => sum + d.value, 0)
  const jenisTerbanyak = distributionRows[0]?.name ?? "—"
  const jumlahJenis = distributionRows.length
  const jumlahLokasi = lokasiMap.size

  const stats = [
    { value: totalPohon.toLocaleString("id-ID"), label: "Pohon tercatat" },
    { value: String(jumlahJenis), label: "Jenis pohon" },
    { value: jenisTerbanyak, label: "Jenis terbanyak" },
    { value: String(jumlahLokasi), label: "Area lokasi" },
  ]

  const maxValue = Math.max(...distributionRows.map((d) => d.value), 1)

  return (
    <main className="min-h-screen bg-[#F7F6EF] px-4 py-10 text-[#113522] sm:px-6 lg:px-10">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-10">
        {/* Tabs */}
        <section className="flex flex-wrap gap-3 border-b border-black/10 pb-8">
          <TabButton href="/database/peta">Peta Lestari</TabButton>

          <TabButton href="/database/pohon" active>
            Pohon Lestari
          </TabButton>

          <TabButton href="/database/DAS">DAS Lestari</TabButton>
        </section>

        {/* Stats */}
        <section className="grid gap-4 border-b border-black/10 pb-8 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((item) => (
            <div key={item.label} className="p-6 text-center">
              <p className="break-words text-3xl font-bold text-emerald-900 sm:text-4xl">
                {loading ? "..." : item.value}
              </p>

              <p className="mt-2 text-sm text-emerald-900">{item.label}</p>
            </div>
          ))}
        </section>

        {/* Distribusi keseluruhan */}
        <section className="rounded-3xl bg-stone-50 p-5 shadow-sm ring-1 ring-black/10 sm:p-8">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-emerald-900">
              Distribusi Keseluruhan Jenis Pohon
            </h2>

            <p className="mt-2 text-sm text-emerald-900/80">
              Jumlah individu berdasarkan jenis pohon yang tercatat.
            </p>
          </div>

          {loading ? (
            <p className="text-sm text-emerald-900">Memuat data pohon...</p>
          ) : errorMessage ? (
            <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
              {errorMessage}
            </p>
          ) : distributionRows.length === 0 ? (
            <p className="text-sm text-emerald-900">Belum ada data pohon.</p>
          ) : (
            <div className="space-y-6">
              {distributionRows.map((row) => {
                const percentage = (row.value / maxValue) * 100

                return (
                  <div
                    key={`${row.name}-${row.scientificName}`}
                    className="space-y-2"
                  >
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                      <div className="min-w-0">
                        <p className="break-words text-base font-semibold text-emerald-900">
                          {row.name}
                        </p>

                        <p className="break-words text-sm italic text-emerald-900/70">
                          {row.scientificName}
                        </p>
                      </div>

                      <span className="w-fit shrink-0 rounded-full border border-black px-3 py-1 text-sm font-semibold text-emerald-900">
                        {formatNumber(row.value)}
                      </span>
                    </div>

                    <div className="h-3 overflow-hidden rounded-full bg-emerald-900/10">
                      <div
                        className="h-full rounded-full bg-red-600 transition-all"
                        style={{
                          width: `${percentage}%`,
                        }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </section>

        {/* Sebaran per area */}
        <section className="rounded-3xl bg-stone-50 p-5 shadow-sm ring-1 ring-black/10 sm:p-8">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-emerald-900">
              Sebaran per Area Lokasi
            </h2>

            <p className="mt-2 text-sm text-emerald-900/80">
              Perbandingan jumlah pohon pada setiap area lokasi.
            </p>
          </div>

          {loading ? (
            <p className="text-sm text-emerald-900">Memuat sebaran area...</p>
          ) : errorMessage ? (
            <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
              {errorMessage}
            </p>
          ) : tableRows.length === 0 ? (
            <p className="text-sm text-emerald-900">
              Belum ada data sebaran area.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[900px] border-collapse text-sm">
                <thead>
                  <tr className="border-b border-black/10 text-left text-emerald-900">
                    {tableHeaders.map((header) => (
                      <th key={header} className="px-4 py-3 font-semibold">
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody>
                  {tableRows.map((row) => (
                    <tr
                      key={row.area}
                      className="border-b border-black/10 text-emerald-900 last:border-b-0"
                    >
                      <td className="px-4 py-4 font-semibold">{row.area}</td>

                      {row.values.map((value, index) => (
                        <td
                          key={`${row.area}-${tableHeaders[index + 1]}`}
                          className="px-4 py-4"
                        >
                          {formatNumber(value)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </main>
  )
}