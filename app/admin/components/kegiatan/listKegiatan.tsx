"use client"

import { Kegiatan } from "./kegiatan.service"

type Props = {
  kegiatan: Kegiatan[]
  onEdit: (item: Kegiatan) => void
}

export default function KegiatanList({
  kegiatan,
  onEdit,
}: Props) {
  const published = kegiatan.filter(
    (item) => !item.is_draft
  )

  return (
    <div>
      <h1 className="mb-6 text-xl font-semibold text-[#0F5139]">
        Daftar Kegiatan
      </h1>

      {published.length === 0 ? (
        <p className="text-gray-500">
          Belum ada kegiatan.
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
          {published.map((item) => (
            <div
              key={item.id}
              className="overflow-hidden rounded-2xl border bg-white shadow-sm transition hover:shadow-md"
            >
              <img
                src={item.thumbnail_url}
                alt={item.nama_kegiatan}
                className="h-52 w-full object-cover"
              />

              <div className="p-5">
                <div className="mb-3 flex items-center gap-2">
                  <span className="rounded-full bg-[#0F5139]/10 px-3 py-1 text-xs text-[#0F5139]">
                    {item.kategori}
                  </span>

                  <span
                    className={`rounded-full px-3 py-1 text-xs ${
                      item.status_kegiatan ===
                      "completed"
                        ? "bg-blue-100 text-blue-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {item.status_kegiatan}
                  </span>
                </div>

                <h2 className="mb-2 text-lg font-semibold text-[#0F5139]">
                  {item.nama_kegiatan}
                </h2>

                <p className="mb-4 line-clamp-3 text-sm text-gray-600">
                  {item.status_kegiatan ===
                  "completed"
                    ? item.hasil_kegiatan
                    : item.deskripsi_kegiatan}
                </p>

                <div className="space-y-1 text-xs text-gray-500">
                  <p>
                    {item.kabupaten_kota},{" "}
                    {item.provinsi}
                  </p>

                  <p>
                    {new Date(
                      item.tanggal_mulai
                    ).toLocaleDateString()}
                  </p>

                  <p>
                    Last Modified:{" "}
                    {item.updated_at
                      ? new Date(
                          item.updated_at
                        ).toLocaleString()
                      : "-"}
                  </p>
                </div>

                <div className="mt-5">
                  <button
                    onClick={() => onEdit(item)}
                    className="rounded-lg bg-yellow-500 px-4 py-2 text-sm text-white"
                  >
                    Edit
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}