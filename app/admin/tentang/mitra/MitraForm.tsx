"use client"

import { useState, useEffect } from "react"
import { Mitra, createMitra, updateMitra } from "./mitra.service"

type Props = {
  editingMitra: Mitra | null
  onSuccess: () => void
  onCancelEdit: () => void
}

export default function MitraForm({ editingMitra, onSuccess, onCancelEdit }: Props) {
  const [nama, setNama] = useState("")
  const [logo, setLogo] = useState<File | null>(null)

  const resetForm = () => {
    setNama("")
    setLogo(null)
  }

  useEffect(() => {
    if (editingMitra) {
      setNama(editingMitra.nama)
      setLogo(null)
    } else {
      setNama("")
      setLogo(null)
    }
  }, [editingMitra])

  const handleSubmit = async (isDraft: boolean) => {
    if (!nama) return alert("Nama mitra wajib diisi")
    if (!editingMitra && !logo) return alert("Logo wajib diupload")

    try {
      if (editingMitra) {
        await updateMitra(editingMitra.id, nama, logo, editingMitra.logo_url, isDraft)
        alert(
        isDraft
          ? "Draft berhasil diperbarui"
          : "Mitra berhasil dipublish"
        )
        onCancelEdit()
      } else {
        await createMitra(nama, logo!, isDraft)
        alert(
        isDraft
          ? "Draft berhasil disimpan"
          : "Mitra berhasil dipublish"
      )
      }
      resetForm() 
      onSuccess()
    } catch (err: any) {
      alert(err.message)
    }
  }

  const inputClass = "w-full rounded-xl border p-3"
  const labelClass = "mb-2 block font-medium text-[#0F5139]"

  return (
    <div>
      <div className="mx-auto max-w-6xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#0F5139]">
            Tambah/Edit Mitra
          </h1>
        </div>

      <div className="space-y-5">
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <div className="md:col-span-2">
            <label className={labelClass}>Nama Mitra</label>
            <input
              type="text"
              placeholder="Contoh: IPB University"
              value={nama}
              onChange={(e) => setNama(e.target.value)}
              className={inputClass}
            />
          </div>
        </div>

            <label className={labelClass}>
              Logo Mitra
            </label>

            {editingMitra?.logo_url && !logo && (
              <div className="mb-4 flex justify-center">
                <p className="mb-2 text-xs text-gray-400">
                  Logo saat ini
                </p>
                <img
                  src={editingMitra.logo_url}
                  alt={editingMitra.nama}
                  className="h-24 object-contain"
                />
              </div>
            )}

            <label className="flex h-56 cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed transition-all duration-200 hover:bg-[#F5F5F5]">
              <div className="text-center">
                <p className="text-lg font-semibold text-[#0F5139]">
                  Upload Logo Mitra
                </p>

                <p className="mt-1 text-sm text-gray-500">
                  PNG, JPG, SVG, atau WEBP
                </p>

                <p className="mt-3 text-sm font-medium text-[#0F5139]">
                  {logo ? logo.name : "Klik untuk memilih logo"}
                </p>
              </div>

              <input
                type="file"
                accept="image/*"
                onChange={(e) => setLogo(e.target.files?.[0] || null)}
                className="hidden"
              />
            </label>

          <div className="flex justify-end gap-3 pt-5">
            <button
              type="button"
              onClick={() => handleSubmit(true)}
              className="rounded-xl bg-gray-200 px-6 py-3 transition hover:bg-gray-300 active:scale-95"
            >
              {editingMitra ? "Update Draft" : "Simpan Draft"}
            </button>

            <button
              type="button"
              onClick={() => handleSubmit(false)}
              className="rounded-xl bg-[#0F5139] px-6 py-3 text-white transition hover:bg-[#0A3D2A] active:scale-95"
            >
              {editingMitra ? "Update & Publish" : "Publish Mitra"}
            </button>

            {editingMitra && (
            <button
              type="button"
              onClick={() => {
                resetForm()
                onCancelEdit()
              }}
              className="rounded-xl bg-gray-200 px-6 py-3 transition hover:bg-gray-300 active:scale-95"
            >
              Batal
            </button>
          )}
          </div>
      </div>
    </div>
    </div>
  )
}