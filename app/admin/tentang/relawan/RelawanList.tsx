"use client"

import { useState } from "react"
import { Relawan, deleteRelawan } from "./relawan.service"

type Props = {
  relawanList: Relawan[]
  onRefresh: () => void
  onEdit: (r: Relawan) => void
}

export default function RelawanList({ relawanList, onRefresh, onEdit }: Props) {
  const [filterStatus, setFilterStatus] = useState<"semua" | "aktif" | "alumni">("semua")
  const [filterTahun, setFilterTahun] = useState("")

  const handleDelete = async (r: Relawan) => {
    if (!confirm(`Hapus relawan "${r.nama}"?`)) return
    try {
      await deleteRelawan(r.id)
      onRefresh()
    } catch (err: any) {
      alert(err.message)
    }
  }

  const filtered = relawanList.filter((r) => {
    const statusOk = filterStatus === "semua" || r.status === filterStatus
    const tahunOk = !filterTahun || r.tahun_bergabung === Number(filterTahun)
    return statusOk && tahunOk
  })

  const totalAktif = relawanList.filter((r) => r.status === "aktif").length
  const totalAlumni = relawanList.filter((r) => r.status === "alumni").length

  return (
    <div>
      <h1 className="text-xl font-semibold text-[#0F5139] mb-6">Daftar Relawan</h1>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="rounded-xl bg-white border p-4">
          <p className="text-xs text-gray-500">Total Relawan</p>
          <p className="text-3xl font-bold text-[#0F5139]">{relawanList.length}</p>
        </div>
        <div className="rounded-xl bg-white border p-4">
          <p className="text-xs text-gray-500">Aktif</p>
          <p className="text-3xl font-bold text-emerald-600">{totalAktif}</p>
        </div>
        <div className="rounded-xl bg-white border p-4">
          <p className="text-xs text-gray-500">Alumni</p>
          <p className="text-3xl font-bold text-gray-400">{totalAlumni}</p>
        </div>
      </div>

      {/* Filter */}
      <div className="flex gap-3 mb-4 flex-wrap">
        {(["semua", "aktif", "alumni"] as const).map((s) => (
          <button
            key={s}
            onClick={() => setFilterStatus(s)}
            className={`px-4 py-1.5 rounded-full text-sm capitalize transition ${
              filterStatus === s
                ? "bg-[#0F5139] text-white"
                : "bg-white border text-[#0F5139] hover:bg-gray-50"
            }`}
          >
            {s}
          </button>
        ))}

        <input
          type="number"
          placeholder="Filter tahun"
          value={filterTahun}
          onChange={(e) => setFilterTahun(e.target.value)}
          className="rounded-full border border-[#0F5139]/20 px-4 py-1.5 text-sm text-[#0F5139] outline-none w-32"
        />
      </div>

      {filtered.length === 0 ? (
        <p className="text-gray-500">Tidak ada relawan ditemukan.</p>
      ) : (
        <div className="rounded-xl border bg-white overflow-hidden shadow-sm">
          <table className="w-full text-sm">
            <thead className="bg-[#0F5139] text-white">
              <tr>
                <th className="text-left px-4 py-3 font-medium">Nama</th>
                <th className="text-left px-4 py-3 font-medium">Divisi</th>
                <th className="text-center px-4 py-3 font-medium">Status</th>
                <th className="text-center px-4 py-3 font-medium">Tahun Bergabung</th>
                <th className="text-left px-4 py-3 font-medium">Kontak</th>
                <th className="text-center px-4 py-3 font-medium">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50 transition">
                  <td className="px-4 py-3 font-medium text-[#0F5139]">{item.nama}</td>
                  <td className="px-4 py-3 text-gray-500">{item.divisi || "—"}</td>
                  <td className="px-4 py-3 text-center">
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                      item.status === "aktif"
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-gray-100 text-gray-600"
                    }`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center text-gray-600">
                    {item.tahun_bergabung}
                  </td>
                  <td className="px-4 py-3 text-gray-500">
                    {item.nomor_kontak || "—"}
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