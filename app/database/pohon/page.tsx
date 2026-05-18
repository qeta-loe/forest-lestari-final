"use client"

import Link from "next/link"

const distributionRows = [
  {
    name: "Meranti Merah",
    scientificName: "Shorea sp.",
    value: 135,
  },
  {
    name: "Ramin",
    scientificName: "Gonystylus bancanus",
    value: 55,
  },
  {
    name: "Jelutung",
    scientificName: "Dyera costulata",
    value: 45,
  },
  {
    name: "Ulin",
    scientificName: "Eusideroxylon zwageri",
    value: 40,
  },
  {
    name: "Gaharu",
    scientificName: "Aquilaria malaccensis",
    value: 30,
  },
  {
    name: "Karet Hutan",
    scientificName: "Hevea sp.",
    value: 20,
  },
  {
    name: "Tengkawang",
    scientificName: "Shorea stenoptera",
    value: 15,
  },
]

const tableHeaders = [
  "Area",
  "Meranti",
  "Tengkawang",
  "Ramin",
  "Jelutung",
  "Ulin",
  "Gaharu",
  "Karet Hutan",
]

const tableRows = [
  {
    area: "Pondok Ambung",
    values: [50, 5, 25, 20, 15, 15, 10],
  },
  {
    area: "Tanjung Harapan",
    values: [40, 5, 20, 15, 15, 10, 5],
  },
  {
    area: "Teluk Pulai",
    values: [45, 5, 10, 10, 10, 5, 5],
  },
]

const stats = [
  {
    value: "340",
    label: "Pohon tercatat",
  },
  {
    value: "7",
    label: "Jenis pohon",
  },
  {
    value: "Meranti",
    label: "Jenis terbanyak",
  },
  {
    value: "3",
    label: "Area lokasi",
  },
]

function TabButton({
  href,
  active,
  children,
}: {
  href: string
  active?: boolean
  children: React.ReactNode
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

export default function DatabasePohonPage() {
  const maxValue = Math.max(...distributionRows.map((item) => item.value))

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
            <div
              key={item.label}
              className=" p-6 text-center "
            >
              <p className="text-3xl font-bold text-emerald-900 sm:text-4xl">
                {item.value}
              </p>

              <p className="mt-2 text-sm text-emerald-900">
                {item.label}
              </p>
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

          <div className="space-y-6">
            {distributionRows.map((row) => {
              const percentage = (row.value / maxValue) * 100

              return (
                <div key={row.name} className="space-y-2">
                  <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                      <p className="text-base font-semibold text-emerald-900">
                        {row.name}
                      </p>

                      <p className="text-sm italic text-emerald-900/70">
                        {row.scientificName}
                      </p>
                    </div>

                    <span className="w-fit rounded-full border border-black px-3 py-1 text-sm font-semibold text-emerald-900">
                      {row.value}
                    </span>
                  </div>

                  <div className="h-3 overflow-hidden rounded-full bg-emerald-900/10">
                    <div
                      className="h-full rounded-full bg-red-600"
                      style={{
                        width: `${percentage}%`,
                      }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
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
                    <td className="px-4 py-4 font-semibold">
                      {row.area}
                    </td>

                    {row.values.map((value, index) => (
                      <td key={`${row.area}-${index}`} className="px-4 py-4">
                        {value}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </main>
  )
}