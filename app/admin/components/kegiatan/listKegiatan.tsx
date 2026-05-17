"use client"

import { useState } from "react"
import { Kegiatan, updateKegiatan, deleteKegiatan } from "./kegiatan.service"

type Props = {
  kegiatan: Kegiatan[]
  onRefresh: () => void
}

export default function KegiatanList({ kegiatan, onRefresh }: Props) {
  const [editMode, setEditMode] = useState(false)
  const [selectedIds, setSelectedIds] = useState<number[]>([])
  const [editingItem, setEditingItem] = useState<Kegiatan | null>(null)
  const [editNama, setEditNama] = useState("")
  const [editDeskripsi, setEditDeskripsi] = useState("")
  const [editFile, setEditFile] = useState<File | null>(null)

  const toggleSelect = (id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    )
  }

  const handleDeleteSelected = async () => {
    if (selectedIds.length === 0) return alert("Pilih kegiatan dulu")
    if (!confirm("Yakin mau hapus kegiatan yang dipilih?")) return

    try {
      await deleteKegiatan(selectedIds, kegiatan)
      alert("Berhasil hapus kegiatan")
      setSelectedIds([])
      setEditMode(false)
      setEditingItem(null)
      onRefresh()
    } catch (err: any) {
      alert(err.message)
    }
  }

  const handleStartEdit = () => {
    if (selectedIds.length === 0) return alert("Pilih 1 kegiatan dulu")
    if (selectedIds.length > 1) return alert("Edit hanya bisa 1 kegiatan sekali")

    const item = kegiatan.find((k) => k.id === selectedIds[0])
    if (!item) return alert("Kegiatan tidak ditemukan")

    setEditingItem(item)
    setEditNama(item.nama)
    setEditDeskripsi(item.deskripsi)
    setEditFile(null)
  }

  const handleUpdate = async () => {
    if (!editingItem) return

    try {
      await updateKegiatan(editingItem.id, editNama, editDeskripsi, editingItem.image_url, editFile)
      alert("Berhasil update kegiatan")
      setEditingItem(null)
      setSelectedIds([])
      setEditMode(false)
      setEditNama("")
      setEditDeskripsi("")
      setEditFile(null)
      onRefresh()
    } catch (err: any) {
      alert(err.message)
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl text-[#0F5139] font-semibold">Daftar Kegiatan</h1>

        <div className="flex gap-2">
          {editMode && (
            <>
              <button
                onClick={handleStartEdit}
                className="bg-yellow-500 hover:bg-yellow-600 active:bg-yellow-700 active:scale-95 transition-all duration-150 text-white px-4 py-2 rounded cursor-pointer"
              >
                Edit Pilihan
              </button>

              <button
                onClick={handleDeleteSelected}
                className="bg-red-600 hover:bg-red-700 active:bg-red-800 active:scale-95 transition-all duration-150 text-white px-4 py-2 rounded cursor-pointer"
              >
                Hapus Pilihan
              </button>
            </>
          )}

          <button
            onClick={() => {
              setEditMode(!editMode)
              setSelectedIds([])
              setEditingItem(null)
            }}
            className="bg-[#0F5139] hover:bg-[#0A3D2A] active:bg-[#06291C] active:scale-95 transition-all duration-150 text-white px-4 py-2 rounded cursor-pointer"
          >
            {editMode ? "Selesai" : "Edit"}
          </button>
        </div>
      </div>

      {editingItem && (
        <div className="bg-white border border-[#0F5139] rounded-xl p-4 mb-6">
          <h2 className="text-[#0F5139] font-semibold mb-3">Edit Kegiatan</h2>

          <input
            type="text"
            value={editNama}
            onChange={(e) => setEditNama(e.target.value)}
            className="text-[#0F5139] block w-full mb-3 p-2 border rounded border-[#0F5139]"
          />

          <textarea
            value={editDeskripsi}
            onChange={(e) => setEditDeskripsi(e.target.value)}
            className="text-[#0F5139] block w-full mb-3 p-2 border rounded border-[#0F5139]"
          />

          <input
            type="file"
            accept="image/*"
            onChange={(e) => setEditFile(e.target.files?.[0] || null)}
            className="mb-4 text-[#0F5139]"
          />

          <div className="flex gap-2">
            <button
              onClick={handleUpdate}
              className="bg-[#0F5139] hover:bg-[#0A3D2A] active:bg-[#06291C] active:scale-95 transition-all duration-150 text-white px-4 py-2 rounded cursor-pointer"
            >
              Simpan Perubahan
            </button>

            <button
              onClick={() => setEditingItem(null)}
              className="bg-gray-400 hover:bg-gray-500 active:bg-gray-600 active:scale-95 transition-all duration-150 text-white px-4 py-2 rounded cursor-pointer"
            >
              Batal
            </button>
          </div>
        </div>
      )}

      {kegiatan.length === 0 ? (
        <p className="text-gray-500">Belum ada kegiatan yang diupload.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {kegiatan.map((item) => (
            <div
              key={item.id}
              className={`relative bg-white rounded-xl border shadow-sm overflow-hidden transition-all duration-150 ${
                selectedIds.includes(item.id) ? "ring-2 ring-[#0F5139]" : "hover:shadow-md"
              }`}
            >
              {editMode && (
                <input
                  type="checkbox"
                  checked={selectedIds.includes(item.id)}
                  onChange={() => toggleSelect(item.id)}
                  className="absolute top-3 right-3 w-5 h-5 z-10 cursor-pointer"
                />
              )}

              <img src={item.image_url} alt={item.nama} className="w-full h-40 object-cover" />

              <div className="p-4">
                <h2 className="text-[#0F5139] font-semibold mb-2">{item.nama}</h2>
                <p className="text-sm text-gray-600">{item.deskripsi}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}