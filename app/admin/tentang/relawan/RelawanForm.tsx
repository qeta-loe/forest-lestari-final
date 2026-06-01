"use client"

import { useState, useEffect } from "react"
import { Relawan, createRelawan, updateRelawan } from "./relawan.service"

type Props = {
  editingRelawan: Relawan | null
  onSuccess: () => void
  onCancel: () => void
}

export default function RelawanForm({ editingRelawan, onSuccess, onCancel }: Props) {
  const [namaKegiatan, setNamaKegiatan] = useState("")
  const [jumlahRelawan, setJumlahRelawan] = useState("")
  const [tanggalMulai, setTanggalMulai] = useState("")
  const [tanggalSelesai, setTanggalSelesai] = useState("")
  const [isDraft, setIsDraft] = useState(false)

  useEffect(() => {
    if (editingRelawan) {
      setNamaKegiatan(editingRelawan.nama_kegiatan)
      setJumlahRelawan(String(editingRelawan.jumlah_relawan))
      setTanggalMulai(editingRelawan.tanggal_mulai)
      setTanggalSelesai(editingRelawan.tanggal_selesai)
      setIsDraft(editingRelawan.is_draft)
    } else {
      setNamaKegiatan("")
      setJumlahRelawan("")
      setTanggalMulai("")
      setTanggalSelesai("")
      setIsDraft(false)
    }
  }, [editingRelawan])

  const handleSubmit = async (draft: boolean) => {
    if (!namaKegiatan || !jumlahRelawan || !tanggalMulai || !tanggalSelesai) {
      return alert("Semua field wajib diisi")
    }

    const input = {
      nama_kegiatan: namaKegiatan,
      jumlah_relawan: Number(jumlahRelawan),
      tanggal_mulai: tanggalMulai,
      tanggal_selesai: tanggalSelesai,
      is_draft: draft
    }

    try {

      if (tanggalSelesai < tanggalMulai) {
        return alert("Tanggal selesai tidak boleh lebih awal dari tanggal mulai")
      }
      if (editingRelawan) {
        await updateRelawan(editingRelawan.id, input)
        alert("Relawan berhasil diperbarui")
      } else {
        await createRelawan(input)
        alert("Relawan berhasil ditambahkan")
      }
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
            Tambah/Edit Relawan
          </h1>
        </div>

        <div className="space-y-5">
            <div className="md:col-span-2">
              <label className={labelClass}>
                Nama Kegiatan
              </label>

              <input
                type="text"
                placeholder="Nama kegiatan"
                value={namaKegiatan}
                onChange={(e) =>
                  setNamaKegiatan(e.target.value)
                }
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>
                Jumlah Relawan
              </label>

              <input
                type="number"
                placeholder="Jumlah relawan"
                value={jumlahRelawan}
                onChange={(e) =>
                  setJumlahRelawan(e.target.value)
                }
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>
                Tanggal Mulai
              </label>

              <input
                type="date"
                value={tanggalMulai}
                onChange={(e) =>
                  setTanggalMulai(e.target.value)
                }
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>
                Tanggal Selesai
              </label>

              <input
                type="date"
                value={tanggalSelesai}
                onChange={(e) =>
                  setTanggalSelesai(e.target.value)
                }
                className={inputClass}
              />
            </div>
            </div>

            <div className="mt-10 flex justify-end gap-4">
              <button
                type="button"
                onClick={() => handleSubmit(true)}
                className="rounded-xl bg-gray-200 px-6 py-3 transition hover:bg-gray-300 active:scale-95"
              >
                {editingRelawan ? "Update Draft" : "Simpan Draft"}
              </button>

              <button
                type="button"
                onClick={() => handleSubmit(false)}
                className="rounded-xl bg-[#0F5139] px-6 py-3 text-white transition hover:bg-[#0A3D2A] active:scale-95"
              >
                {editingRelawan ? "Update & Publish" : "Publish Kegiatan"}
              </button>

              {editingRelawan && (
                <button
                  type="button"
                  onClick={onCancel}
                  className="rounded-xl bg-gray-200 px-6 py-3 transition hover:bg-gray-300 active:scale-95"
                >
                  Batal
                </button>
              )}
            </div>
          </div>
        </div>
  )
}