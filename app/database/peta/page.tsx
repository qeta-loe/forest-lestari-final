"use client"

import Link from "next/link"

const stats = [
  {
    value: "6",
    label: "Lokasi aktif",
  },
  {
    value: "1.840",
    label: "Total bibit ditanam",
  },
  {
    value: "47,2",
    label: "Total luas (ha)",
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

export default function DatabasePetaPage() {
  return (
    <main className="min-h-screen bg-[#F7F6EF] px-4 py-10 text-[#113522] sm:px-6 lg:px-10">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-10">
        {/* Tabs */}
        <section className="flex flex-wrap gap-3 border-b border-black/10 pb-8">
          <TabButton href="/database/peta" active>
            Peta Lestari
          </TabButton>

          <TabButton href="/database/pohon">Pohon Lestari</TabButton>

          <TabButton href="/database/DAS">DAS Lestari</TabButton>
        </section>

        {/* Stats */}
        <section className="grid gap-4 border-b border-black/10 pb-8 sm:grid-cols-3">
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

        {/* Peta Lestari */}
        <section className="rounded-3xl border border-black bg-stone-50 p-5 sm:p-8 lg:p-10">
          <div className="relative min-h-[420px] overflow-hidden rounded-3xl bg-stone-50 sm:min-h-[560px] lg:min-h-[720px]">
              
          </div>
        </section>
      </div>
    </main>
  )
}