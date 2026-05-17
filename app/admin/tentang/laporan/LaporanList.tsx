"use client"

import { LaporanTahunan, deleteLaporan } from "./laporan.service"

type Props = {
  laporanList: LaporanTahunan[]
  onRefresh: () => void
  onEdit: (l: LaporanTahunan) => void
}

export default function LaporanList({ laporanList, onRefresh, onEdit }: Props) {
  const handleDelete = async (l: LaporanTahunan) => {
    if (!confirm(`Hapus laporan "${l.judul}"?`)) return
    try {
      await deleteLaporan(l.id, l.file_url)
      onRefresh()
    } catch (err: any) {
      alert(err.message)
    }
  }

  return (
    <div>
      <h1 className="text-xl font-semibold text-[#0F5139] mb-6">
        Daftar Laporan Tahunan
      </h1>

      {laporanList.length === 0 ? (
        <p className="text-gray-500">Belum ada laporan yang ditambahkan.</p>
      ) : (
        <div className="space-y-4">
          {laporanList.map((item) => (
            <div
              key={item.id}
              className="rounded-xl border bg-white p-5 shadow-sm"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <span className="text-4xl font-bold text-[#0F5139]">
                      {item.tahun}
                    </span>
                    <span className="text-xs bg-gray-600 text-white px-3 py-1 rounded-xl font-bold">
                      {new Date(item.tanggal_publikasi).getFullYear() === new Date().getFullYear()
                        ? "TERBARU" : ""}
                    </span>
                  </div>

                  <h2 className="font-semibold text-[#0F5139] mb-1">{item.judul}</h2>

                  {item.deskripsi && (
                    <p className="text-sm text-gray-500 line-clamp-2 mb-2">
                      {item.deskripsi}
                    </p>
                  )}

                  <p className="text-xs text-gray-400">
                    Dipublikasikan:{" "}
                    {new Date(item.tanggal_publikasi).toLocaleDateString("id-ID", {
                      day: "numeric", month: "long", year: "numeric",
                    })}
                  </p>
                </div>

                <div className="flex flex-col gap-2 shrink-0">
                  <a
                    href={item.file_url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs bg-[#0F5139] text-white px-3 py-1.5 rounded text-center hover:bg-[#0A3D2A]"
                  >
                    Buka PDF
                  </a>
                  <button
                    onClick={() => onEdit(item)}
                    className="text-xs bg-yellow-500 text-white px-3 py-1.5 rounded hover:bg-yellow-600"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(item)}
                    className="text-xs bg-red-600 text-white px-3 py-1.5 rounded hover:bg-red-700"
                  >
                    Hapus
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