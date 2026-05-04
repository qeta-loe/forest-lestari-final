import Link from "next/link"
import { supabase } from "@/lib/supabase"

const getMapUrl = (latitude: number, longitude: number) => {
  const lat = Number(latitude)
  const lng = Number(longitude)
  const delta = 0.08

  return `https://www.openstreetmap.org/export/embed.html?bbox=${lng - delta}%2C${lat - delta}%2C${lng + delta}%2C${lat + delta}&layer=mapnik&marker=${lat}%2C${lng}`
}

export default async function MapKegiatanPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  const kegiatanId = Number(id)

  if (Number.isNaN(kegiatanId)) {
    return (
      <main className="min-h-screen bg-[#F7F6EF] px-4 py-10">
        <div className="mx-auto max-w-5xl">
          <p className="text-red-600">ID kegiatan tidak valid.</p>
          <p className="mt-2 text-sm text-red-600">ID dari URL: {id}</p>
        </div>
      </main>
    )
  }

  const { data: kegiatan, error } = await supabase
    .from("kegiatan")
    .select("*")
    .eq("id", kegiatanId)
    .maybeSingle()

  if (!kegiatan) {
    return (
      <main className="min-h-screen bg-[#F7F6EF] px-4 py-10">
        <div className="mx-auto max-w-5xl">
          <p className="text-[#0F3926]">Data kegiatan tidak ditemukan.</p>

          <p className="mt-2 text-sm text-red-600">
            ID dari URL: {id}
          </p>

          <p className="mt-2 text-sm text-red-600">
            Error: {error ? error.message : "Tidak ada pesan error"}
          </p>
        </div>
      </main>
    )
  }

  const hasMap = kegiatan.latitude && kegiatan.longitude

  return (
    <main className="min-h-screen bg-[#F7F6EF] text-[#113522]">
      <div className="mx-auto max-w-6xl px-4 py-8 lg:px-10">
        <Link
          href={`/kegiatan/${kegiatan.id}`}
          className="mb-6 inline-flex text-sm font-semibold text-[#0F5139]"
        >
          ← Kembali ke detail kegiatan
        </Link>

        <div className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[#48755e]">
            Peta Kegiatan
          </p>

          <h1 className="mt-2 text-3xl font-semibold text-[#0F3926]">
            {kegiatan.nama}
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-[#4D6B57]">
            {kegiatan.wilayah || "Wilayah Jawa Barat"}
          </p>
        </div>

        {hasMap ? (
          <>
            <section className="overflow-hidden rounded-[32px] bg-white shadow-sm ring-1 ring-black/5">
              <iframe
                title={`Peta ${kegiatan.nama}`}
                src={getMapUrl(kegiatan.latitude, kegiatan.longitude)}
                className="h-[520px] w-full border-0"
                loading="lazy"
              />
            </section>

            <section className="mt-8 grid gap-5 sm:grid-cols-3">
              <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-black/5">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#48755e]">
                  Wilayah
                </p>
                <p className="mt-2 font-semibold text-[#0F3926]">
                  {kegiatan.wilayah || "Jawa Barat"}
                </p>
              </div>

              <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-black/5">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#48755e]">
                  Ketinggian
                </p>
                <p className="mt-2 font-semibold text-[#0F3926]">
                  {kegiatan.mdpl ? `${kegiatan.mdpl} mdpl` : "Belum diisi"}
                </p>
              </div>

              <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-black/5">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#48755e]">
                  Koordinat
                </p>
                <p className="mt-2 font-semibold text-[#0F3926]">
                  {kegiatan.latitude}, {kegiatan.longitude}
                </p>
              </div>
            </section>
          </>
        ) : (
          <div className="rounded-3xl bg-white p-8 text-center shadow-sm ring-1 ring-black/5">
            <p className="text-sm text-[#4D6B57]">
              Data koordinat belum tersedia. Tambahkan latitude dan longitude dari halaman admin.
            </p>
          </div>
        )}
      </div>
    </main>
  )
}