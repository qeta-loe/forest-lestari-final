"use client"

import { useState } from "react"
import { updateProfilKomunitas } from "./profil.service"

export default function ProfilForm() {
  const [informasiKomunitas, setInformasiKomunitas] = useState("")
  const [visiMisi, setVisiMisi] = useState("")
  const [sejarah, setSejarah] = useState("")
  const [strukturOrganisasi, setStrukturOrganisasi] = useState("")

  const handleSubmit = async () => {
    if (!informasiKomunitas || !visiMisi || !sejarah || !strukturOrganisasi) {
      return alert("Semua tabel harus diisi")
    }

    try {
      await updateProfilKomunitas(informasiKomunitas, visiMisi, sejarah, strukturOrganisasi)
      alert("Profil berhasil diperbarui")
    } catch (err: any) {
      alert(err.message)
    }
  }

  return (
    <div>
      <h1 className="text-xl text-[#0F5139] font-semibold mb-4">Kelola Profil Komunitas</h1>

      {[
        { label: "Informasi komunitas", value: informasiKomunitas, setter: setInformasiKomunitas },
        { label: "Visi-misi", value: visiMisi, setter: setVisiMisi },
        { label: "Sejarah", value: sejarah, setter: setSejarah },
        { label: "Struktur organisasi", value: strukturOrganisasi, setter: setStrukturOrganisasi },
      ].map(({ label, value, setter }) => (
        <textarea
          key={label}
          placeholder={label}
          value={value}
          onChange={(e) => setter(e.target.value)}
          className="text-[#0F5139] block min-h-32 w-full mb-3 p-2 border rounded border-[#0F5139]"
        />
      ))}

      <button
        onClick={handleSubmit}
        className="bg-emerald-900 hover:bg-emerald-950 active:bg-black active:scale-95 transition-all duration-150 text-white px-4 py-2 rounded cursor-pointer"
      >
        Simpan Profil
      </button>
    </div>
  )
}