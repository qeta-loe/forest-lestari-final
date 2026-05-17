"use client"

import { useState, useEffect } from "react"
import { Mitra, createMitra, updateMitra } from "./mitra.service"

type Props = {
  editingMitra: Mitra | null
  onSuccess: () => void
  onCancel: () => void
}

export default function MitraForm({ editingMitra, onSuccess, onCancel }: Props) {
  const [nama, setNama] = useState("")
  const [logo, setLogo] = useState<File | null>(null)

  useEffect(() => {
    if (editingMitra) {
      setNama(editingMitra.nama)
      setLogo(null)
    } else {
      setNama("")
      setLogo(null)
    }
  }, [editingMitra])

  const handleSubmit = async () => {
    if (!nama) return alert("Nama mitra wajib diisi")
    if (!editingMitra && !logo) return alert("Logo wajib diupload")

    try {
      if (editingMitra) {
        await updateMitra(editingMitra.id, nama, logo, editingMitra.logo_url)
        alert("Mitra berhasil diperbarui")
      } else {
        await createMitra(nama, logo!)
        alert("Mitra berhasil ditambahkan")
      }
      onSuccess()
    } catch (err: any) {
      alert(err.message)
    }
  }

  const inputClass =
    "w-full rounded-xl border border-[#0F5139]/20 bg-white px-4 py-3 text-[#0F5139] outline-none transition focus:border-[#0F5139] focus:ring-2 focus:ring-[#0F5139]/10"
  const labelClass = "mb-2 block text-sm font-medium text-[#0F5139]"

  return (
    <div>
      <h1 className="text-xl font-semibold text-[#0F5139] mb-6">
        {editingMitra ? "Edit Mitra" : "Tambah Mitra"}
      </h1>

      <div className="rounded-2xl border border-[#0F5139]/10 bg-white p-6 space-y-5">
        <div>
          <label className={labelClass}>Nama Mitra</label>
          <input
            type="text"
            placeholder="Contoh: IPB University"
            value={nama}
            onChange={(e) => setNama(e.target.value)}
            className={inputClass}
          />
        </div>

        <div>
          <label className={labelClass}>
            Logo {editingMitra ? "(kosongkan jika tidak diganti)" : ""}
          </label>

          {editingMitra?.logo_url && !logo && (
            <div className="mb-3">
              <p className="text-xs text-gray-400 mb-1">Logo saat ini:</p>
              <img
                src={editingMitra.logo_url}
                alt={editingMitra.nama}
                className="w-24 h-24 object-contain rounded-xl border border-gray-200"
              />
            </div>
          )}

          <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-[#0F5139]/20 rounded-xl cursor-pointer hover:bg-gray-50 transition">
            <span className="text-sm text-[#0F5139]">
              {logo ? logo.name : "Klik untuk pilih logo"}
            </span>
            <span className="text-xs text-gray-400 mt-1">PNG, JPG, SVG, WEBP</span>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setLogo(e.target.files?.[0] || null)}
              className="hidden"
            />
          </label>
        </div>

        <div className="flex gap-3 pt-2">
          <button
            onClick={handleSubmit}
            className="bg-emerald-900 hover:bg-emerald-950 active:scale-95 transition text-white px-6 py-2 rounded-xl text-sm"
          >
            {editingMitra ? "Simpan Perubahan" : "Simpan Mitra"}
          </button>
          <button
            onClick={onCancel}
            className="bg-gray-300 hover:bg-gray-400 active:scale-95 transition text-gray-700 px-6 py-2 rounded-xl text-sm"
          >
            Batal
          </button>
        </div>
      </div>
    </div>
  )
}