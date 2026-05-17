"use client"

import { Das, deleteDas } from "./das.service"

type Props = {
  dasList: Das[]
  onRefresh: () => void
  onEdit: (das: Das) => void
}

export default function DasList({ dasList, onRefresh, onEdit }: Props) {
  const handleDelete = async (das: Das) => {
    if (!confirm(`Yakin hapus ${das.nama_das}?`)) return
    try {
      await deleteDas(das.id)
      alert("DAS berhasil dihapus")
      onRefresh()
    } catch (err: any) {
      alert(err.message)
    }
  }

  return (
    <div>
      <h1 className="text-xl text-[#0F5139] font-semibold mb-6">Daftar DAS</h1>

      {dasList.length === 0 ? (
        <p className="text-gray-500">Belum ada DAS yang ditambahkan.</p>
      ) : (
        <div className="space-y-4">
          {dasList.map((item) => (
            <div
              key={item.id}
              className="rounded-xl border bg-white p-5 shadow-sm"
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-3">
                    <h2 className="font-semibold text-lg text-[#0F5139]">
                      {item.nama_das}
                    </h2>

                    <span
                      className={`text-xs font-semibold px-3 py-1 rounded-full capitalize ${
                        item.kondisi === "baik"
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {item.kondisi}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-x-8 gap-y-1 mt-2 text-sm text-gray-600">
                    <p>Luas DAS: <span className="font-medium">{item.luas_ha.toLocaleString()} ha</span></p>
                    <p>Tutupan Hutan: <span className="font-medium">{item.tutupan_hutan_persen}%</span></p>
                    <p>Kemiringan: <span className="font-medium">{item.kemiringan_min}° – {item.kemiringan_max}°</span></p>
                    <p>Panjang Sungai: <span className="font-medium">{item.panjang_sungai_km || "—"} km</span></p>
                    <p>Jenis Tanah: <span className="font-medium">{item.jenis_tanah || "—"}</span></p>
                    <p>Titik Polygon: <span className="font-medium">{item.polygon_coordinates?.length || 0} titik</span></p>
                  </div>

                  {(item.koordinat_hulu || item.koordinat_muara) && (
                    <div className="mt-1 text-xs text-gray-400">
                      {item.koordinat_hulu && <p>Hulu: {item.koordinat_hulu}</p>}
                      {item.koordinat_muara && <p>Muara: {item.koordinat_muara}</p>}
                    </div>
                  )}
                </div>

                <div className="flex gap-2 shrink-0">
                  <button
                    onClick={() => onEdit(item)}
                    className="rounded-md bg-yellow-500 hover:bg-yellow-600 active:scale-95 transition-all px-4 py-2 text-sm text-white"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => handleDelete(item)}
                    className="rounded-md bg-red-600 hover:bg-red-700 active:scale-95 transition-all px-4 py-2 text-sm text-white"
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