"use client"

import { Mitra, deleteMitra } from "./mitra.service"
import { useState } from "react"

type Props = {
  mitraList: Mitra[]
  onRefresh: () => void
  onEdit: (m: Mitra) => void
}

type FilterStatus = | "semua" | "published" | "draft"

export default function MitraList({ mitraList, onRefresh, onEdit }: Props) {
  const [filterStatus, setFilterStatus] = useState<FilterStatus>("semua")
  const handleDelete = async (m: Mitra) => {
    if (!confirm(`Hapus mitra "${m.nama}"?`)) return
    try {
      await deleteMitra(m.id, m.logo_url)
      onRefresh()
    } catch (err: any) {
      alert(err.message)
    }
  }

  const filteredMitra = mitraList.filter((item) => {
    if (filterStatus === "published")
      return !item.is_draft

    if (filterStatus === "draft")
      return item.is_draft

    return true
  })

  return (
    <div>
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <h1 className="text-xl font-semibold text-[#0F5139]">
          Daftar Jaringan & Mitra
        </h1>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setFilterStatus("semua")}
            className={`rounded-full border px-4 py-2 text-sm ${
              filterStatus === "semua"
                ? "bg-[#0F5139] text-white"
                : "text-[#0F5139] border-[#0F5139]"
            }`}
          >
            Semua ({mitraList.length})
          </button>

          <button
            onClick={() => setFilterStatus("published")}
            className={`rounded-full border px-4 py-2 text-sm ${
              filterStatus === "published"
                ? "bg-[#0F5139] text-white"
                : "text-[#0F5139] border-[#0F5139]"
            }`}
          >
            Published ({mitraList.filter((m) => !m.is_draft).length})
          </button>

          <button
            onClick={() => setFilterStatus("draft")}
            className={`rounded-full border px-4 py-2 text-sm ${
              filterStatus === "draft"
                ? "bg-[#0F5139] text-white"
                : "text-[#0F5139] border-[#0F5139]"
            }`}
          >
            Draft ({mitraList.filter((m) => m.is_draft).length})
          </button>
        </div>
      </div>

        {mitraList.length === 0 ? (
          <p className="text-gray-500">Belum ada mitra yang ditambahkan.</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredMitra.map((item) => (
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
                  <div className="w-20 h-20 text-[#0F5139] border-[#0F5139] rounded-xl flex items-center justify-center text-gray-400 text-xs">
                    No logo
                  </div>
                )}

                <div className="text-center">
                  <p className="text-sm font-semibold text-[#0F5139]">
                    {item.nama}
                  </p>

                  <span
                    className={`mt-1 inline-block rounded-full px-2 py-1 text-[10px] ${
                      item.is_draft
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-green-100 text-green-700"
                    }`}
                  >
                    {item.is_draft ? "Draft" : "Published"}
                  </span>
                </div>

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