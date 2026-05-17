"use client"

import { useState } from "react"
import { uploadDokumen } from "./dokumen.service"

type Props = {
  onSuccess: () => void
}

export default function DokumenUpload({ onSuccess }: Props) {
  const [judul, setJudul] = useState("")
  const [file, setFile] = useState<File | null>(null)

  const handleUpload = async () => {
    if (!judul || !file) return alert("Semua tabel harus diisi")

    try {
      await uploadDokumen(judul, file)
      alert("Dokumen berhasil diunggah")
      setJudul("")
      setFile(null)
      onSuccess()
    } catch (err: any) {
      alert(err.message)
    }
  }

  return (
    <div>
      <h1 className="text-xl text-[#0F5139] font-semibold mb-4">Upload Dokumen</h1>

      <input
        type="text"
        placeholder="Judul dokumen"
        value={judul}
        onChange={(e) => setJudul(e.target.value)}
        className="text-[#0F5139] block w-full mb-3 p-2 border rounded border-[#0F5139]"
      />

      <div className="mb-4">
        <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-gray-400 rounded-xl cursor-pointer hover:bg-gray-50 active:bg-gray-100 transition-all duration-150">
          <span className="text-sm text-[#0F5139]">Pilih Dokumen PDF</span>
          <input
            type="file"
            accept=".pdf,application/pdf"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            className="hidden"
          />
        </label>
        <p className="text-sm text-gray-500 mt-2">{file ? file.name : "No file chosen"}</p>
      </div>

      <button
        onClick={handleUpload}
        className="bg-emerald-900 hover:bg-emerald-950 active:bg-black active:scale-95 transition-all duration-150 text-white px-4 py-2 rounded cursor-pointer"
      >
        Upload
      </button>
    </div>
  )
}