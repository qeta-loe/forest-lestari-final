import { Mitra } from "@/lib/queries"

type Props = {
  mitra: Mitra[]
}

export default function MitraGrid({ mitra }: Props) {
  if (mitra.length === 0) {
    return (
      <div className="rounded-3xl border border-black/10 bg-white p-8 text-center">
        <p className="text-sm text-zinc-600">Data mitra belum tersedia.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-5">
      {mitra.map((m) => (
        <div
          key={m.id}
          className="flex min-h-40 flex-col items-center justify-center rounded-3xl border border-black/10 bg-white p-5 text-center shadow-sm"
        >
          <div className="mb-4 flex h-20 w-20 items-center justify-center overflow-hidden rounded-2xl bg-zinc-100">
            <img
              src={m.logo_url ?? "https://placehold.co/160x160"}
              alt={m.nama}
              className="h-full w-full object-contain p-2"
            />
          </div>
          <p className="text-sm font-medium text-emerald-900">{m.nama}</p>
        </div>
      ))}
    </div>
  )
}