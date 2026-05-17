"use client"

import { Mitra, deleteMitra } from "./mitra.service"

type Props = {
  mitraList: Mitra[]
  onRefresh: () => void
  onEdit: (m: Mitra) => void
}

export default function MitraList({ mitraList, onRefresh, onEdit }: Props) {
  const handleDelete = async (m: Mitra) => {
    if (!confirm(`Hapus mitra "${m.nama}"?`)) return
    try {
      await deleteMitra(m.id, m.logo_url)
      onRefresh()
    } catch (err: any) {
      alert(err.message)
    }
  }

  return (
    <div>
      <h1 className="text-xl font-semibold text-[#0F5139] mb-6">
        Daftar Jaringan & Mitra
      </h1>

      {mitraList.length === 0 ? (
        <p className="text-gray-500">Belum ada mitra yang ditambahkan.</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {mitraList.map((item) => (
            <div
              key={item.id}
              className="rounded-2xl border bg-white p-4 shadow-sm flex flex-col items-center gap-3"
            >
              {item.logo_url ? (
                <img
                  src={item.logo_url}
                  alt={item.nama}
                  className="w-20 h-20 object-contain rounded-xl"
                />
              ) : (
                <div className="w-20 h-20 bg-gray-100 rounded-xl flex items-center justify-center text-gray-400 text-xs">
                  No logo
                </div>
              )}

              <p className="text-sm font-semibold text-[#0F5139] text-center">
                {item.nama}
              </p>

              <div className="flex gap-2">
                <button
                  onClick={() => onEdit(item)}
                  className="text-xs bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(item)}
                  className="text-xs bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                >
                  Hapus
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}