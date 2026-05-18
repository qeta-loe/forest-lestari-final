import { GlobalStats } from "@/lib/queries"

type Props = {
  stats: GlobalStats
}

export default function StatsBar({ stats }: Props) {
  const items = [
    { value: stats.pohon_ditanam.toLocaleString("id-ID"), label: "Pohon ditanam" },
    { value: stats.total_relawan.toLocaleString("id-ID"), label: "Total relawan" },
    { value: stats.area_ha.toLocaleString("id-ID"), label: "Area penghijauan (ha)" },
    { value: stats.das_aktif.toLocaleString("id-ID"), label: "DAS dipantau aktif" },
  ]

  return (
    <div className="grid grid-cols-2 md:grid-cols-4">
      {items.map((item, i) => (
        <div
          key={item.label}
          className={`py-10 text-center sm:py-12 ${
            i !== items.length - 1 ? "border-b border-black/10 md:border-b-0 md:border-r" : ""
          } ${i === 1 ? "border-r border-black/10 md:border-r" : ""}`}
        >
          <h2 className="text-3xl font-bold text-emerald-900 sm:text-4xl">
            {item.value}
          </h2>
          <p className="mt-2 text-sm text-zinc-600">{item.label}</p>
        </div>
      ))}
    </div>
  )
}