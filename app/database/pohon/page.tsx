"use client"

import { useEffect, useMemo, useState, type ReactNode } from "react"
import Link from "next/link"
import { supabase } from "@/lib/supabase"

type PohonRow = {
  id: number
  nama_umum: string | null
  nama_ilmiah: string | null
  jumlah: number | null
  lokasi_penanaman_id: number | null
  das_id: number | null
  created_at: string | null
  updated_at: string | null
}

type DistributionRow = {
  name: string
  scientificName: string
  value: number
}

type AreaRow = {
  area: string
  values: number[]
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

function formatNumber(value: number) {
  return new Intl.NumberFormat("id-ID").format(value)
}

function getAreaName(item: PohonRow) {
  if (item.lokasi_penanaman_id) {
    return `Lokasi ${item.lokasi_penanaman_id}`
  }

  return "Tanpa lokasi"
}

export default function DatabasePohonPage() {
  const [pohonList, setPohonList] = useState<PohonRow[]>([])
  const [loading, setLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState("")

  useEffect(() => {
    const fetchPohon = async () => {
      setLoading(true)
      setErrorMessage("")

      const { data, error } = await supabase
        .from("pohon")
        .select(
          "id, nama_umum, nama_ilmiah, jumlah, lokasi_penanaman_id, das_id, created_at, updated_at"
        )
        .order("id", { ascending: false })

      if (error) {
        console.error("FETCH POHON ERROR:", error.message)
        setErrorMessage(error.message)
        setLoading(false)
        return
      }

      setPohonList((data || []) as PohonRow[])
      setLoading(false)
    }

    fetchPohon()
  }, [])

  const distributionRows = useMemo<DistributionRow[]>((() => {
    const grouped = new Map<string, DistributionRow>()

    pohonList.forEach((item) => {
      const name = item.nama_umum || "Tanpa nama"
      const scientificName = item.nama_ilmiah || "-"
      const key = `${name}-${scientificName}`

      const current = grouped.get(key)

      if (current) {
        current.value += Number(item.jumlah || 0)
      } else {
        grouped.set(key, {
          name,
          scientificName,
          value: Number(item.jumlah || 0),
        })
      }
    })

    return Array.from(grouped.values()).sort((a, b) => b.value - a.value)
  }) as unknown as () => DistributionRow[], [pohonList])

  const maxValue = useMemo(() => {
    if (distributionRows.length === 0) return 1
    return Math.max(...distributionRows.map((item) => item.value), 1)
  }, [distributionRows])

  const totalPohon = useMemo(() => {
    return pohonList.reduce((sum, item) => sum + Number(item.jumlah || 0), 0)
  }, [pohonList])

  const jenisPohon = distributionRows.length
  const jenisTerbanyak = distributionRows[0]?.name || "-"

  const totalArea = useMemo(() => {
    const areas = new Set(
      pohonList
        .map((item) => item.lokasi_penanaman_id)
        .filter((id): id is number => Boolean(id))
    )

    return areas.size
  }, [pohonList])

  const stats = [
    {
      value: formatNumber(totalPohon),
      label: "Pohon tercatat",
    },
    {
      value: formatNumber(jenisPohon),
      label: "Jenis pohon",
    },
    {
      value: jenisTerbanyak,
      label: "Jenis terbanyak",
    },
    {
      value: formatNumber(totalArea),
      label: "Area lokasi",
    },
  ]

  const tableHeaders = useMemo(() => {
    return ["Area", ...distributionRows.map((item) => item.name)]
  }, [distributionRows])

  const tableRows = useMemo<AreaRow[]>(() => {
    const areaMap = new Map<string, Map<string, number>>()

    pohonList.forEach((item) => {
      const area = getAreaName(item)
      const jenis = item.nama_umum || "Tanpa nama"
      const jumlah = Number(item.jumlah || 0)

      if (!areaMap.has(area)) {
        areaMap.set(area, new Map())
      }

      const jenisMap = areaMap.get(area)!
      jenisMap.set(jenis, (jenisMap.get(jenis) || 0) + jumlah)
    })

    return Array.from(areaMap.entries())
      .map(([area, jenisMap]) => ({
        area,
        values: distributionRows.map((jenis) => jenisMap.get(jenis.name) || 0),
      }))
      .sort((a, b) => a.area.localeCompare(b.area))
  }, [pohonList, distributionRows])

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