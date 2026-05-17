"use client"

import { useState, useEffect } from "react"
import { Relawan, createRelawan, updateRelawan } from "./relawan.service"

type Props = {
  editingRelawan: Relawan | null
  onSuccess: () => void
  onCancel: () => void
}

export default function RelawanForm({ editingRelawan, onSuccess, onCancel }: Props) {
  const [nama, setNama] = useState("")
  const [status, setStatus] = useState("aktif")
  const [divisi, setDivisi] = useState("")
  const [nomorKontak, setNomorKontak] = useState("")
  const [tahunBergabung, setTahunBergabung] = useState("")

  useEffect(() => {
    if (editingRelawan) {
      setNama(editingRelawan.nama)
      setStatus(editingRelawan.status)
      setDivisi(editingRelawan.divisi || "")
      setNomorKontak(editingRelawan.nomor_kontak || "")
      setTahunBergabung(String(editingRelawan.tahun_bergabung))
    } else {
      setNama("")
      setStatus("aktif")
      setDivisi("")
      setNomorKontak("")
      setTahunBergabung("")
    }
  }, [editingRelawan])

  const handleSubmit = async () => {
    if (!nama || !tahunBergabung) {
      return alert("Nama dan tahun bergabung wajib diisi")
    }

    const input = {
      nama,
      status,
      divisi: divisi || null,
      nomor_kontak: nomorKontak || null,
      tahun_bergabung: Number(tahunBergabung),
    }

    try {
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

  const inputClass =
    "w-full rounded-xl border border-[#0F5139]/20 bg-white px-4 py-3 text-[#0F5139] outline-none transition focus:border-[#0F5139] focus:ring-2 focus:ring-[#0F5139]/10"
  const labelClass = "mb-2 block text-sm font-medium text-[#0F5139]"

  return (
    <div>
      <h1 className="text-xl font-semibold text-[#0F5139] mb-6">
        {editingRelawan ? "Edit Relawan" : "Tambah Relawan"}
      </h1>

      <div className="rounded-2xl border border-[#0F5139]/10 bg-white p-6 space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Nama</label>
            <input
              type="text"
              placeholder="Nama lengkap"
              value={nama}
              onChange={(e) => setNama(e.target.value)}
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass}>Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className={inputClass}
            >
              <option value="aktif">Aktif</option>
              <option value="alumni">Alumni</option>
            </select>
          </div>

          <div>
            <label className={labelClass}>Divisi (Opsional)</label>
            <input
              type="text"
              placeholder="Contoh: Biodiversity & Forest Carbon"
              value={divisi}
              onChange={(e) => setDivisi(e.target.value)}
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass}>Nomor Kontak (Opsional)</label>
            <input
              type="text"
              placeholder="Contoh: 08123456789"
              value={nomorKontak}
              onChange={(e) => setNomorKontak(e.target.value)}
              className={inputClass}
            />
          </div>

          <div className="md:col-span-2">
            <label className={labelClass}>Tahun Bergabung</label>
            <input
              type="number"
              placeholder="Contoh: 2024"
              value={tahunBergabung}
              onChange={(e) => setTahunBergabung(e.target.value)}
              className={inputClass}
            />
          </div>
        </div>

        <div className="flex gap-3 pt-2">
          <button
            onClick={handleSubmit}
            className="bg-emerald-900 hover:bg-emerald-950 active:scale-95 transition text-white px-6 py-2 rounded-xl text-sm"
          >
            {editingRelawan ? "Simpan Perubahan" : "Simpan Relawan"}
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