"use client"

import { useState, useEffect } from "react"
import { KontenHalaman, upsertKonten } from "@/lib/konten.service"

type Props = {
  kontenList: KontenHalaman[]
  editingKonten: KontenHalaman | null
  onSuccess: () => void
  onCancel: () => void
}

const HALAMAN_OPTIONS = [
  { value: "beranda", label: "Beranda" },
  { value: "tentang_kami", label: "Tentang Kami" },
]

export default function KontenForm({
  kontenList,
  editingKonten,
  onSuccess,
  onCancel,
}: Props) {
  const [halaman, setHalaman] = useState<string>(editingKonten?.halaman ?? "")
  const [badgeText, setBadgeText] = useState("")
  const [judul, setJudul] = useState("")
  const [deskripsi, setDeskripsi] = useState("")
  const [tujuanStrategis, setTujuanStrategis] = useState("")
  const [heroFile, setHeroFile] = useState<File | null>(null)
  const [tujuanFile, setTujuanFile] = useState<File | null>(null)

  // Saat halaman dipilih dari dropdown, isi form dengan data yang ada
  useEffect(() => {
    if (!halaman) return

    const existing =
      editingKonten?.halaman === halaman
        ? editingKonten
        : kontenList.find((k) => k.halaman === halaman) ?? null

    if (existing) {
      setBadgeText(existing.badge_text ?? "")
      setJudul(existing.judul ?? "")
      setDeskripsi(existing.deskripsi ?? "")
      setTujuanStrategis(existing.tujuan_strategis ?? "")
    } else {
      setBadgeText("")
      setJudul("")
      setDeskripsi("")
      setTujuanStrategis("")
    }

    setHeroFile(null)
    setTujuanFile(null)
  }, [halaman])

  const handleSubmit = async (isPublished: boolean) => {
    if (!halaman) return alert("Pilih halaman dulu")
    if (!judul) return alert("Judul wajib diisi")

    const existing = kontenList.find((k) => k.halaman === halaman)
    if (!existing) return alert("Data konten tidak ditemukan")

    try {
      await upsertKonten(
        existing,
        {
          halaman,
          badge_text: badgeText,
          judul,
          deskripsi,
          tujuan_strategis: halaman === "tentang_kami" ? tujuanStrategis : undefined,
          is_published: isPublished,
        },
        heroFile,
        tujuanFile
      )

      alert(isPublished ? "Konten berhasil dipublish" : "Draft berhasil disimpan")
      onSuccess()
    } catch (err: any) {
      alert(err.message)
    }
  }

  const selectedKonten = kontenList.find((k) => k.halaman === halaman)

  return (
    <div className="mx-auto max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#0F5139]">Edit Konten Halaman</h1>
      </div>

      {/* Dropdown pilih halaman */}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <div className="md:col-span-2">
          <label className="mb-2 block font-medium text-[#0F5139]">
            Pilih Halaman
          </label>
          <select
            value={halaman}
            onChange={(e) => setHalaman(e.target.value)}
            className="w-full rounded-xl border p-3"
          >
            <option value="">-- Pilih halaman --</option>
            {HALAMAN_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Form fields — hanya muncul setelah halaman dipilih */}
      {halaman && (
        <>
          <div className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-2">
            <div className="md:col-span-2">
              <label className="mb-2 block font-medium text-[#0F5139]">
                Badge Text
              </label>
              <input
                type="text"
                placeholder={
                  halaman === "beranda"
                    ? "Contoh: KOMUNITAS LINGKUNGAN BOGOR"
                    : "Contoh: PROFIL KOMUNITAS"
                }
                value={badgeText}
                onChange={(e) => setBadgeText(e.target.value)}
                className="w-full rounded-xl border p-3"
              />
            </div>

            <div className="md:col-span-2">
              <label className="mb-2 block font-medium text-[#0F5139]">
                Judul
              </label>
              <input
                type="text"
                placeholder={
                  halaman === "beranda"
                    ? "Contoh: Bersama Menjaga Kelestarian Hutan & Alam Indonesia"
                    : "Contoh: Menjaga Warisan, Melindungi Masa Depan"
                }
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
                placeholder="Tulis deskripsi singkat..."
                value={deskripsi}
                onChange={(e) => setDeskripsi(e.target.value)}
                className="min-h-32 w-full rounded-xl border p-4"
              />
            </div>
          </div>

          {/* Tujuan Strategis — hanya untuk tentang_kami */}
          {halaman === "tentang_kami" && (
            <div className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-2">
              <div className="md:col-span-2">
                <label className="mb-2 block font-medium text-[#0F5139]">
                  Tujuan Strategis
                </label>
                <textarea
                  placeholder="Tulis tujuan strategis komunitas..."
                  value={tujuanStrategis}
                  onChange={(e) => setTujuanStrategis(e.target.value)}
                  className="min-h-32 w-full rounded-xl border p-4"
                />
              </div>
            </div>
          )}

          {/* Hero Image */}
          <div className="mt-10">
            <label className="mb-2 block font-medium text-[#0F5139]">
              Gambar Hero (kosongkan jika tidak diganti)
            </label>

            {selectedKonten?.hero_image_url && !heroFile && (
              <div className="mb-4">
                <p className="mb-2 text-xs text-gray-400">Gambar saat ini:</p>
                <img
                  src={selectedKonten.hero_image_url}
                  alt="Hero"
                  className="h-40 w-full rounded-xl object-cover"
                />
              </div>
            )}

            <label className="flex h-56 cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed transition-all duration-200 hover:bg-[#F5F5F5]">
              <div className="text-center">
                <p className="text-lg font-semibold text-[#0F5139]">
                  Upload Gambar Hero
                </p>
                <p className="mt-1 text-sm text-gray-500">PNG, JPG, atau WEBP</p>
                <p className="mt-3 text-sm font-medium text-[#0F5139]">
                  {heroFile ? heroFile.name : "Klik untuk memilih gambar"}
                </p>
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setHeroFile(e.target.files?.[0] || null)}
                className="hidden"
              />
            </label>
          </div>

          {/* Tujuan Image — hanya untuk tentang_kami */}
          {halaman === "tentang_kami" && (
            <div className="mt-10">
              <label className="mb-2 block font-medium text-[#0F5139]">
                Gambar Tujuan Strategis (kosongkan jika tidak diganti)
              </label>

              {selectedKonten?.tujuan_image_url && !tujuanFile && (
                <div className="mb-4">
                  <p className="mb-2 text-xs text-gray-400">Gambar saat ini:</p>
                  <img
                    src={selectedKonten.tujuan_image_url}
                    alt="Tujuan Strategis"
                    className="h-40 w-full rounded-xl object-cover"
                  />
                </div>
              )}

              <label className="flex h-56 cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed transition-all duration-200 hover:bg-[#F5F5F5]">
                <div className="text-center">
                  <p className="text-lg font-semibold text-[#0F5139]">
                    Upload Gambar Tujuan Strategis
                  </p>
                  <p className="mt-1 text-sm text-gray-500">PNG, JPG, atau WEBP</p>
                  <p className="mt-3 text-sm font-medium text-[#0F5139]">
                    {tujuanFile ? tujuanFile.name : "Klik untuk memilih gambar"}
                  </p>
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setTujuanFile(e.target.files?.[0] || null)}
                  className="hidden"
                />
              </label>
            </div>
          )}

          {/* Buttons */}
          <div className="mt-10 flex justify-end gap-4">
            <button
              type="button"
              onClick={onCancel}
              className="rounded-xl bg-gray-200 px-6 py-3 transition hover:bg-gray-300 active:scale-95"
            >
              Batal
            </button>

            <button
              type="button"
              onClick={() => handleSubmit(false)}
              className="rounded-xl bg-gray-200 px-6 py-3 transition hover:bg-gray-300 active:scale-95"
            >
              Simpan Draft
            </button>

            <button
              type="button"
              onClick={() => handleSubmit(true)}
              className="rounded-xl bg-[#0F5139] px-6 py-3 text-white transition hover:bg-[#0A3D2A] active:scale-95"
            >
              Publish
            </button>
          </div>
        </>
      )}
    </div>
  )
}