"use client"

import { useState, useEffect } from "react"
import { Artikel, ArtikelSection, createArtikel, updateArtikel } from "./artikel.service"

type Props = {
  editingArtikel: Artikel | null
  onSuccess: () => void
  onCancel: () => void
}

const defaultSection: ArtikelSection = { title: "", content: "", quote: "" }

export default function ArtikelForm({ editingArtikel, onSuccess, onCancel }: Props) {
  const [judul, setJudul] = useState("")
  const [deskripsiSingkat, setDeskripsiSingkat] = useState("")
  const [kategori, setKategori] = useState("")
  const [penulis, setPenulis] = useState("")
  const [tanggalPublikasi, setTanggalPublikasi] = useState("")
  const [sections, setSections] = useState<ArtikelSection[]>([defaultSection])
  const [gambar, setGambar] = useState<File | null>(null)
  const resetForm = () => {
    setJudul("")
    setDeskripsiSingkat("")
    setKategori("")
    setPenulis("")
    setTanggalPublikasi("")
    setSections([{ ...defaultSection }])
    setGambar(null)
  }

  useEffect(() => {
    if (editingArtikel) {
      setJudul(editingArtikel.judul)
      setDeskripsiSingkat(editingArtikel.deskripsi_singkat)
      setKategori(editingArtikel.kategori)
      setPenulis(editingArtikel.penulis)
      setTanggalPublikasi(editingArtikel.tanggal_publikasi)
      setSections(editingArtikel.sections || [defaultSection])
      setGambar(null)
    } else {
      setJudul("")
      setDeskripsiSingkat("")
      setKategori("")
      setPenulis("")
      setTanggalPublikasi("")
      setSections([defaultSection])
      setGambar(null)
    }
  }, [editingArtikel])

  const addSection = () => setSections((prev) => [...prev, { ...defaultSection }])

  const removeSection = (index: number) =>
    setSections((prev) => prev.filter((_, i) => i !== index))

  const updateSection = (index: number, field: keyof ArtikelSection, value: string) =>
    setSections((prev) => prev.map((s, i) => (i === index ? { ...s, [field]: value } : s)))

  const handleSubmit = async (isDraft: boolean) => {
    if (!judul || !deskripsiSingkat || !kategori || !penulis || !tanggalPublikasi) {
      return alert("Semua tabel wajib diisi")
    }

    const invalidSection = sections.some((s) => !s.title || !s.content)
    if (invalidSection) return alert("Semua section wajib memiliki judul dan isi")

    if (!editingArtikel && !gambar) return alert("Semua tabel wajib diisi")

    const payload = {
      judul,
      deskripsi_singkat: deskripsiSingkat,
      kategori,
      penulis,
      tanggal_publikasi: tanggalPublikasi,
      sections,
      is_draft: isDraft,
    }

    try {
      if (editingArtikel) {
        await updateArtikel(editingArtikel.id, payload, gambar)
        alert("Artikel berhasil diperbarui")
      } else {
        await createArtikel(payload, gambar!)
        alert("Artikel berhasil ditambahkan")
      }
      onSuccess()
    } catch (err: any) {
      alert(err.message)
    }
  }

  return (
    <div className="mx-auto max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#0F5139]">Tambah/Edit Artikel</h1>
      </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <div className="md:col-span-2">
            <label className="mb-2 block font-medium text-[#0F5139]">
              Judul Artikel
            </label>
            <input
              type="text"
              placeholder="Masukkan judul artikel"
              value={judul}
              onChange={(e) => setJudul(e.target.value)}
              className="w-full rounded-xl border p-3"
            />
          </div>

          <div className="md:col-span-2">
            <label className="mb-2 block font-medium text-[#0F5139]">
              Deskripsi Singkat
            </label>
            <textarea
              placeholder="Tulis ringkasan artikel..."
              value={deskripsiSingkat}
              onChange={(e) => setDeskripsiSingkat(e.target.value)}
              className="min-h-32 w-full rounded-xl border p-4"
            />
          </div>

          <div>
            <label className="mb-2 block font-medium text-[#0F5139]">
              Kategori
            </label>
            <select
              value={kategori}
              onChange={(e) => setKategori(e.target.value)}
              className="w-full rounded-xl border p-3"
            >
              <option value="">Pilih kategori</option>
              <option value="Isu Lingkungan">Isu Lingkungan</option>
              <option value="Edukasi dan Tips">Edukasi dan Tips</option>
              <option value="Berita Komunitas">Berita Komunitas</option>
            </select>
          </div>

          <div>
            <label className="mb-2 block font-medium text-[#0F5139]">
              Penulis
            </label>
            <input
              type="text"
              placeholder="Nama penulis"
              value={penulis}
              onChange={(e) => setPenulis(e.target.value)}
              className="w-full rounded-xl border p-3"
            />
          </div>

          <div className="md:col-span-2">
            <label className="mb-2 block font-medium text-[#0F5139]">
              Tanggal Publikasi
            </label>
            <input
              type="date"
              value={tanggalPublikasi}
              onChange={(e) => setTanggalPublikasi(e.target.value)}
              className="w-full rounded-xl border p-3"
            />
          </div>
        </div>

        <div className="mt-10">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-[#0F5139]">Section Artikel</h2>
              <p className="text-sm text-gray-500">Tambahkan beberapa section untuk isi artikel.</p>
            </div>

            <button
              type="button"
              onClick={addSection}
              className="rounded-xl bg-[#0F5139] px-5 py-3 text-white transition hover:bg-[#0A3D2A] active:scale-95"
            >
              + Tambah Section
            </button>
          </div>

          <div className="space-y-5">
            {sections.map((section, index) => (
              <div key={index} className="rounded-2xl border p-5">
                <div className="mb-5 flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-[#0F5139]">Section {index + 1}</h3>
                    <p className="text-sm text-gray-500">Isi detail pembahasan artikel.</p>
                  </div>

                  {sections.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeSection(index)}
                      className="rounded-lg bg-red-600 px-4 py-2 text-sm text-white transition hover:bg-red-700 active:scale-95"
                    >
                      Hapus
                    </button>
                  )}
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="mb-2 block font-medium text-[#0F5139]">
                      Judul Section
                    </label>
                    <input
                      type="text"
                      placeholder="Contoh: Dampak Perubahan Iklim"
                      value={section.title}
                      onChange={(e) => updateSection(index, "title", e.target.value)}
                      className="w-full rounded-xl border p-3"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block font-medium text-[#0F5139]">
                      Isi Section
                    </label>
                    <textarea
                      placeholder="Tulis isi section artikel..."
                      value={section.content}
                      onChange={(e) => updateSection(index, "content", e.target.value)}
                      className="min-h-40 w-full rounded-xl border p-3"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block font-medium text-[#0F5139]">
                      Kutipan Narasumber (Opsional)
                    </label>
                    <textarea
                      placeholder="Masukkan kutipan penting..."
                      value={section.quote}
                      onChange={(e) => updateSection(index, "quote", e.target.value)}
                      className="min-h-24 w-full rounded-xl border p-4"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-10">
          <label className="mb-2 block font-medium text-[#0F5139]">
              Gambar Cover Artikel
            </label>
          <label className="flex h-56 cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed transition-all duration-200 hover:bg-[#F5F5F5]">
            <div className="text-center">
              <p className="text-lg font-semibold text-[#0F5139]">Upload Cover Artikel</p>
              <p className="mt-1 text-sm text-gray-500">PNG, JPG, atau WEBP</p>
              <p className="mt-3 text-sm text-[#0F5139] font-medium">
                {gambar ? gambar.name : "Klik untuk memilih gambar"}
              </p>
            </div>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setGambar(e.target.files?.[0] || null)}
              className="hidden"
            />
          </label>
        </div>

        <div className="mt-10 flex justify-end gap-4">
          <button
            type="button"
            onClick={() => handleSubmit(true)}
            className="rounded-xl bg-gray-200 px-6 py-3 transition hover:bg-gray-300 active:scale-95"
          >
            {editingArtikel ? "Update Draft" : "Simpan Draft"}
          </button>

          <button 
            type="button"
            onClick={() => handleSubmit(false)}
            className="rounded-xl bg-[#0F5139] px-6 py-3 text-white transition hover:bg-[#0A3D2A] active:scale-95"
          >
            {editingArtikel ? "Update & Publish" : "Publish Artikel"}
          </button>

          {editingArtikel && (
            <button
              type="button"
              onClick={() => {
                resetForm()
                onCancel()
              }}
              className="rounded-xl bg-gray-200 px-6 py-3 transition hover:bg-gray-300 active:scale-95"
            >
              Batal
            </button>
          )}
        </div>
    </div>
  )
}