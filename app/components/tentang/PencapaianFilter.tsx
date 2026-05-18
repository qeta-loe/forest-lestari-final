import Link from "next/link"

type Props = {
  active: "overview" | "penanaman" | "das" | "kolaborasi"
}

const filters = [
  { key: "overview", label: "Overview", href: "/tentangkami/pencapaian" },
  { key: "penanaman", label: "Penanaman", href: "/tentangkami/pencapaian/penanaman" },
  { key: "das", label: "DAS", href: "/tentangkami/pencapaian/das" },
  { key: "kolaborasi", label: "Kolaborasi", href: "/tentangkami/pencapaian/kolaborasi" },
] as const

export default function PencapaianFilter({ active }: Props) {
  return (
    <div className="flex flex-wrap gap-3">
      {filters.map((f) => (
        <Link
          key={f.key}
          href={f.href}
          className={`rounded-full border border-emerald-900 px-5 py-2 text-sm transition ${
            active === f.key
              ? "bg-emerald-900 text-white"
              : "text-emerald-900 hover:bg-emerald-900 hover:text-white"
          }`}
        >
          {f.label}
        </Link>
      ))}
    </div>
  )
}