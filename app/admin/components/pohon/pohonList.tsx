"use client"

import { PohonWithRelasi, deletePohon } from "./pohon.service"

type Props = {
  pohonList: PohonWithRelasi[]
  onRefresh: () => void
  onEdit: (pohon: PohonWithRelasi) => void
}

export default function PohonList({ pohonList, onRefresh, onEdit }: Props) {
  const handleDelete = async (pohon: PohonWithRelasi) => {
    if (!confirm(`Yakin hapus ${pohon.nama_umum}?`)) return
    try {
      await deletePohon(pohon.id)
      alert("Pohon berhasil dihapus")
      onRefresh()
    } catch (err: any) {
      alert(err.message)
    }
  }

  // Ringkasan per jenis untuk header stats
  const totalPohon = pohonList.reduce((sum, p) => sum + p.jumlah, 0)
  const jenisTerbanyak = pohonList.reduce(
    (max, p) => (p.jumlah > (max?.jumlah || 0) ? p : max),
    pohonList[0]
  )

  return (
    <div>
      <h1 className="text-xl text-[#0F5139] font-semibold mb-6">Daftar Pohon</h1>

      {pohonList.length === 0 ? (
        <p className="text-gray-500">Belum ada pohon yang ditambahkan.</p>
      ) : (
        <>
          {/* Stats ringkasan */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
            <div className="rounded-xl bg-white border p-4">
              <p className="text-xs text-gray-500">Total Pohon Tercatat</p>
              <p className="text-3xl font-bold text-[#0F5139]">{totalPohon}</p>
            </div>

            <div className="rounded-xl bg-white border p-4">
              <p className="text-xs text-gray-500">Jenis Pohon</p>
              <p className="text-3xl font-bold text-[#0F5139]">{pohonList.length}</p>
            </div>

            {jenisTerbanyak && (
              <div className="rounded-xl bg-white border p-4 col-span-2 md:col-span-1">
                <p className="text-xs text-gray-500">Jenis Terbanyak</p>
                <p className="text-xl font-bold text-[#0F5139]">{jenisTerbanyak.nama_umum}</p>
                <p className="text-sm text-gray-500">{jenisTerbanyak.jumlah} individu</p>
              </div>
            )}
          </div>

          {/* Tabel */}
          <div className="rounded-xl border bg-white overflow-hidden shadow-sm">
            <table className="w-full text-sm">
              <thead className="bg-[#0F5139] text-white">
                <tr>
                  <th className="text-left px-4 py-3 font-medium">Nama Umum</th>
                  <th className="text-left px-4 py-3 font-medium">Nama Ilmiah</th>
                  <th className="text-center px-4 py-3 font-medium">Jumlah</th>
                  <th className="text-left px-4 py-3 font-medium">Lokasi Penanaman</th>
                  <th className="text-left px-4 py-3 font-medium">DAS</th>
                  <th className="text-center px-4 py-3 font-medium">Aksi</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {pohonList.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50 transition">
                    <td className="px-4 py-3 font-medium text-[#0F5139]">{item.nama_umum}</td>

                    <td className="px-4 py-3 text-gray-500 italic">
                      {item.nama_ilmiah || "—"}
                    </td>

                    <td className="px-4 py-3 text-center">
                      <span className="inline-block rounded-full border border-black px-3 py-0.5 text-[#0F5139] font-medium">
                        {item.jumlah}
                      </span>
                    </td>

                    <td className="px-4 py-3 text-gray-600">
                      {item.lokasi_penanaman?.nama_lokasi || "—"}
                    </td>

                    <td className="px-4 py-3 text-gray-600">
                      {item.das?.nama_das || "—"}
                    </td>

                    <td className="px-4 py-3">
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={() => onEdit(item)}
                          className="rounded bg-yellow-500 hover:bg-yellow-600 active:scale-95 transition px-3 py-1 text-xs text-white"
                        >
                          Edit
                        </button>

                        <button
                          onClick={() => handleDelete(item)}
                          className="rounded bg-red-600 hover:bg-red-700 active:scale-95 transition px-3 py-1 text-xs text-white"
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
        </>
      )}
    </div>
  )
}