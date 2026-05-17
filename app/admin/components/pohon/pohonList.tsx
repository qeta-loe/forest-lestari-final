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
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Gagal menghapus pohon"
      alert(message)
    }
  }

  const totalPohon = pohonList.reduce((sum, p) => {
    return sum + Number(p.jumlah || 0)
  }, 0)

  const jenisTerbanyak = pohonList.reduce<PohonWithRelasi | null>(
    (max, p) => {
      if (!max) return p
      return Number(p.jumlah || 0) > Number(max.jumlah || 0) ? p : max
    },
    null
  )

  return (
    <div>
      <h1 className="mb-6 text-xl font-semibold text-[#0F5139]">
        Daftar Pohon
      </h1>

      {pohonList.length === 0 ? (
        <p className="text-gray-500">Belum ada pohon yang ditambahkan.</p>
      ) : (
        <>
          <div className="mb-6 grid grid-cols-2 gap-4 md:grid-cols-3">
            <div className="rounded-xl border bg-white p-4">
              <p className="text-xs text-gray-500">Total Pohon Tercatat</p>
              <p className="text-3xl font-bold text-[#0F5139]">
                {totalPohon}
              </p>
            </div>

            <div className="rounded-xl border bg-white p-4">
              <p className="text-xs text-gray-500">Jenis Pohon</p>
              <p className="text-3xl font-bold text-[#0F5139]">
                {pohonList.length}
              </p>
            </div>

            {jenisTerbanyak && (
              <div className="col-span-2 rounded-xl border bg-white p-4 md:col-span-1">
                <p className="text-xs text-gray-500">Jenis Terbanyak</p>
                <p className="text-xl font-bold text-[#0F5139]">
                  {jenisTerbanyak.nama_umum}
                </p>
                <p className="text-sm text-gray-500">
                  {jenisTerbanyak.jumlah} individu
                </p>
              </div>
            )}
          </div>

          <div className="overflow-hidden rounded-xl border bg-white shadow-sm">
            <table className="w-full text-sm">
              <thead className="bg-[#0F5139] text-white">
                <tr>
                  <th className="px-4 py-3 text-left font-medium">
                    Nama Umum
                  </th>
                  <th className="px-4 py-3 text-left font-medium">
                    Nama Ilmiah
                  </th>
                  <th className="px-4 py-3 text-center font-medium">
                    Jumlah
                  </th>
                  <th className="px-4 py-3 text-left font-medium">
                    Lokasi Penanaman
                  </th>
                  <th className="px-4 py-3 text-left font-medium">DAS</th>
                  <th className="px-4 py-3 text-center font-medium">Aksi</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {pohonList.map((item) => (
                  <tr key={item.id} className="transition hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-[#0F5139]">
                      {item.nama_umum}
                    </td>

                    <td className="px-4 py-3 italic text-gray-500">
                      {item.nama_ilmiah || "-"}
                    </td>

                    <td className="px-4 py-3 text-center">
                      <span className="inline-block rounded-full border border-black px-3 py-0.5 font-medium text-[#0F5139]">
                        {item.jumlah}
                      </span>
                    </td>

                    <td className="px-4 py-3 text-gray-600">
                      {item.lokasi_penanaman?.nama_lokasi || "-"}
                    </td>

                    <td className="px-4 py-3 text-gray-600">
                      {item.das?.nama_das || "-"}
                    </td>

                    <td className="px-4 py-3">
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={() => onEdit(item)}
                          className="rounded bg-yellow-500 px-3 py-1 text-xs text-white transition hover:bg-yellow-600 active:scale-95"
                        >
                          Edit
                        </button>

                        <button
                          onClick={() => handleDelete(item)}
                          className="rounded bg-red-600 px-3 py-1 text-xs text-white transition hover:bg-red-700 active:scale-95"
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