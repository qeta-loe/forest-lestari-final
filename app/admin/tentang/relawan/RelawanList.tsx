"use client"

import { useState } from "react"
import { Relawan, deleteRelawan } from "./relawan.service"

type Props = {
  relawanList: Relawan[]
  onRefresh: () => void
  onEdit: (r: Relawan) => void
}

export default function RelawanList({ relawanList, onRefresh, onEdit }: Props) {

  const handleDelete = async (r: Relawan) => {
    if (!confirm(`Hapus kegiatan "${r.nama_kegiatan}"?`)) return
    try {
      await deleteRelawan(r.id)
      onRefresh()
    } catch (err: any) {
      alert(err.message)
    }
  }

  const [filterStatus, setFilterStatus] = useState<"semua" | "published" | "draft">("semua")

  const filtered = relawanList.filter((item) => {
    if (filterStatus === "draft") {
      return item.is_draft
    }

    if (filterStatus === "published") {
      return !item.is_draft
    }

    return true
  })

  const totalRelawan = relawanList.reduce(
    (sum, item) => sum + item.jumlah_relawan,
    0
  )

  return (
    <div>
      <h1 className="text-xl font-semibold text-[#0F5139] mb-6">
        Daftar Kegiatan Relawan
      </h1>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="rounded-xl bg-white border p-4">
          <p className="text-xs text-gray-500">
            Total Kegiatan
          </p>

          <p className="text-3xl font-bold text-[#0F5139]">
            {relawanList.length}
          </p>
        </div>

        <div className="rounded-xl bg-white border p-4">
          <p className="text-xs text-gray-500">
            Total Relawan
          </p>

          <p className="text-3xl font-bold text-[#0F5139]">
            {totalRelawan}
          </p>
        </div>
      </div>

      <div className="flex gap-3 mb-5">
        {(["semua", "published", "draft"] as const).map((status) => (
          <button
            key={status}
            onClick={() => setFilterStatus(status)}
            className={`rounded-full px-4 py-2 text-sm transition ${
              filterStatus === status
                ? "bg-[#0F5139] text-white"
                : "border bg-white text-[#0F5139]"
            }`}
          >
            {status === "semua"
              ? "Semua"
              : status === "published"
              ? "Published"
              : "Draft"}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <p className="text-gray-500">Belum ada relawan yang terdaftar.</p>
      ) : (
        <div className="rounded-xl border bg-white overflow-hidden shadow-sm">
          <table className="w-full text-sm">
            <thead className="bg-[#0F5139] text-white">
              <tr>
                <th className="text-left px-4 py-3 font-medium">
                  Nama Kegiatan
                </th>

                <th className="text-center px-4 py-3 font-medium">
                  Jumlah Relawan
                </th>

                <th className="text-center px-4 py-3 font-medium">
                  Tanggal Mulai
                </th>

                <th className="text-center px-4 py-3 font-medium">
                  Tanggal Selesai
                </th>

                <th className="text-center px-4 py-3 font-medium">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50 transition">
                  <td className="px-4 py-3 font-medium text-[#0F5139]">
                    {item.nama_kegiatan}
                  </td>

                  <td className="px-4 py-3 text-center">
                    {item.jumlah_relawan}
                  </td>

                  <td className="px-4 py-3 text-center text-gray-600">
                    {item.tanggal_mulai}
                  </td>

                  <td className="px-4 py-3 text-center text-gray-600">
                    {item.tanggal_selesai}
                  </td>

                  <td className="px-4 py-3">
                    <div className="flex justify-center gap-2">
                      <button
                        onClick={() => onEdit(item)}
                        className="bg-yellow-500 text-white px-2 py-1 rounded text-xs hover:bg-yellow-600"
                      >
                        Edit
                      </button>

                      <button
                        onClick={() => handleDelete(item)}
                        className="bg-red-600 text-white px-2 py-1 rounded text-xs hover:bg-red-700"
                      >
                        Hapus
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}