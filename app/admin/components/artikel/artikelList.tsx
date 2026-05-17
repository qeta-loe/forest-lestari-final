"use client"

import { Artikel } from "./artikel.service"

type Props = {
  artikel: Artikel[]
  onEdit: (artikel: Artikel) => void
}

export default function ArtikelList({ artikel, onEdit }: Props) {
  const published = artikel.filter((a) => !a.is_draft)

  return (
    <div>
      <h1 className="text-xl text-[#0F5139] font-semibold mb-6">Daftar Artikel</h1>

      {published.length === 0 ? (
        <p className="text-gray-500">Belum ada artikel yang diupload.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {published.map((item) => (
            <div
              key={item.id}
              className="overflow-hidden rounded-xl border bg-white shadow-sm transition hover:shadow-md"
            >
              <img src={item.image_url} alt={item.judul} className="h-40 w-full object-cover" />

              <div className="p-4">
                <h2 className="mb-2 font-semibold text-[#0F5139]">{item.judul}</h2>
                <p className="text-sm text-gray-500 mb-2">{item.kategori}</p>
                <p className="line-clamp-3 text-sm text-gray-600 mb-3">{item.deskripsi_singkat}</p>

                <div className="text-xs text-gray-500 space-y-1">
                  <p>Penulis: {item.penulis}</p>
                  <p>
                    Last Modified:{" "}
                    {item.updated_at ? new Date(item.updated_at).toLocaleString() : "-"}
                  </p>
                  <p>Status: {item.is_draft ? "Draft" : "Published"}</p>
                </div>

                <div className="mt-4 flex gap-2">
                  <button
                    onClick={() => onEdit(item)}
                    className="bg-yellow-500 text-white px-3 py-1 rounded text-sm"
                  >
                    Edit Draft
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