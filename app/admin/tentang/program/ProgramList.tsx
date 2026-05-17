"use client"

import { useState } from "react"
import { Program, deleteProgram } from "./program.service"

type Props = {
  programList: Program[]
  onRefresh: () => void
  onEdit: (p: Program) => void
}

export default function ProgramList({ programList, onRefresh, onEdit }: Props) {
  const [filterTahun, setFilterTahun] = useState("")
  const [filterStatus, setFilterStatus] = useState<"semua" | "berjalan" | "selesai">("semua")

  const handleDelete = async (p: Program) => {
    if (!confirm(`Hapus program "${p.nama_program}"?`)) return
    try {
      await deleteProgram(p.id)
      onRefresh()
    } catch (err: any) {
      alert(err.message)
    }
  }

  const filtered = programList.filter((p) => {
    const tahunOk = !filterTahun || p.tahun === Number(filterTahun)
    const statusOk = filterStatus === "semua" || p.status === filterStatus
    return tahunOk && statusOk
  })

  const tahunList = [...new Set(programList.map((p) => p.tahun))].sort(
    (a, b) => b - a
  )

  return (
    <div>
      <h1 className="text-xl font-semibold text-[#0F5139] mb-6">Daftar Program</h1>

      {/* Filter */}
      <div className="flex gap-3 mb-4 flex-wrap items-center">
        <select
          value={filterTahun}
          onChange={(e) => setFilterTahun(e.target.value)}
          className="rounded-full border border-[#0F5139]/20 px-4 py-1.5 text-sm text-[#0F5139] outline-none"
        >
          <option value="">Semua tahun</option>
          {tahunList.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>

        {(["semua", "berjalan", "selesai"] as const).map((s) => (
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
      </div>

      {filtered.length === 0 ? (
        <p className="text-gray-500">Tidak ada program ditemukan.</p>
      ) : (
        <div className="rounded-xl border bg-white overflow-hidden shadow-sm">
          <table className="w-full text-sm">
            <thead className="bg-[#0F5139] text-white">
              <tr>
                <th className="text-left px-4 py-3 font-medium">Nama Program</th>
                <th className="text-left px-4 py-3 font-medium">Tanggal</th>
                <th className="text-left px-4 py-3 font-medium">Lokasi</th>
                <th className="text-left px-4 py-3 font-medium">Penerima Manfaat</th>
                <th className="text-left px-4 py-3 font-medium">Realisasi</th>
                <th className="text-center px-4 py-3 font-medium">Status</th>
                <th className="text-center px-4 py-3 font-medium">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50 transition">
                  <td className="px-4 py-3 font-medium text-[#0F5139]">
                    {item.nama_program}
                  </td>
                  <td className="px-4 py-3 text-gray-500">
                    {new Date(item.tanggal).toLocaleDateString("id-ID", {
                      day: "numeric", month: "short", year: "numeric",
                    })}
                  </td>
                  <td className="px-4 py-3 text-gray-500">{item.lokasi || "—"}</td>
                  <td className="px-4 py-3 text-gray-500">
                    {item.penerima_manfaat || "—"}
                  </td>
                  <td className="px-4 py-3 text-gray-500">{item.realisasi || "—"}</td>
                  <td className="px-4 py-3 text-center">
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                      item.status === "berjalan"
                        ? "bg-blue-100 text-blue-700"
                        : "bg-gray-100 text-gray-600"
                    }`}>
                      {item.status}
                    </span>
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