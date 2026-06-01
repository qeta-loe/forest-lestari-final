"use client"

import { useEffect, useState } from "react"
import { createKegiatan, Kegiatan, updateKegiatan, TargetKegiatan } from "./kegiatan.service"

type Props = {
  editingKegiatan: Kegiatan | null
  onSuccess: () => void
  onCancel: () => void
}

const defaultTarget: TargetKegiatan = {
  nama_target: "",
  isi_target: "",
}

export default function KegiatanForm({
  editingKegiatan,
  onSuccess,
  onCancel,
}: Props) {
  const [namaKegiatan, setNamaKegiatan] = useState("")
  const [alamat, setAlamat] = useState("")
  const [kabupatenKota, setKabupatenKota] = useState("")
  const [provinsi, setProvinsi] = useState("")

  const [tanggalMulai, setTanggalMulai] = useState("")
  const [jamMulai, setJamMulai] = useState("")
  const [jamSelesai, setJamSelesai] = useState("")

  const [kategori, setKategori] = useState<Kegiatan["kategori"] | "">("")
  const [statusKegiatan, setStatusKegiatan] = useState<
    "upcoming" | "completed"
  >("upcoming")

  const [deskripsiKegiatan, setDeskripsiKegiatan] = useState("")
  const [tujuanKegiatan, setTujuanKegiatan] = useState("")
  const [linkPendaftaran, setLinkPendaftaran] = useState("")

  const [hasilKegiatan, setHasilKegiatan] = useState("")
  const [pressRelease, setPressRelease] = useState("")

  const [targets, setTargets] = useState<TargetKegiatan[]>([
    { ...defaultTarget },
  ])

  const [thumbnail, setThumbnail] = useState<File | null>(null)
  const [showKategori, setShowKategori] = useState(false)

  const resetForm = () => {
    setNamaKegiatan("")
    setAlamat("")
    setKabupatenKota("")
    setProvinsi("")
    setTanggalMulai("")
    setJamMulai("")
    setJamSelesai("")
    setKategori("")
    setStatusKegiatan("upcoming")
    setDeskripsiKegiatan("")
    setTujuanKegiatan("")
    setLinkPendaftaran("")
    setHasilKegiatan("")
    setPressRelease("")
    setTargets([{ ...defaultTarget }])
    setThumbnail(null)
  }

  useEffect(() => {
    if (editingKegiatan) {
      setNamaKegiatan(editingKegiatan.nama_kegiatan || "")
      setAlamat(editingKegiatan.alamat || "")
      setKabupatenKota(editingKegiatan.kabupaten_kota || "")
      setProvinsi(editingKegiatan.provinsi || "")

      setTanggalMulai(editingKegiatan.tanggal_mulai || "")
      setJamMulai(editingKegiatan.jam_mulai || "")
      setJamSelesai(editingKegiatan.jam_selesai || "")

      setKategori(editingKegiatan.kategori || "")
      setStatusKegiatan(
        editingKegiatan.status_kegiatan === "completed"
          ? "completed"
          : "upcoming"
      )

      setDeskripsiKegiatan(editingKegiatan.deskripsi_kegiatan || "")
      setTujuanKegiatan(editingKegiatan.tujuan_kegiatan || "")
      setLinkPendaftaran(editingKegiatan.link_pendaftaran || "")
      setHasilKegiatan(editingKegiatan.hasil_kegiatan || "")
      setPressRelease(editingKegiatan.press_release || "")

      setTargets(
        editingKegiatan.targets?.length
          ? editingKegiatan.targets
          : [{ ...defaultTarget }]
      )

      setThumbnail(null)
    } else {
      resetForm()
    }
  }, [editingKegiatan])

  useEffect(() => {
    if (!tanggalMulai || !jamSelesai) return

    const now = new Date()

    const kegiatanDate = new Date(`${tanggalMulai}T${jamSelesai}`)

    if (kegiatanDate < now) {
      setStatusKegiatan("completed")
    } else {
      setStatusKegiatan("upcoming")
    }
  }, [tanggalMulai, jamSelesai])

  const addTarget = () => {
    setTargets((prev) => [...prev, { ...defaultTarget }])
  }

  const removeTarget = (index: number) => {
    setTargets((prev) => prev.filter((_, i) => i !== index))
  }

  const updateTarget = (
    index: number,
    field: keyof TargetKegiatan,
    value: string
  ) => {
    setTargets((prev) =>
      prev.map((item, i) =>
        i === index ? { ...item, [field]: value } : item
      )
    )
  }

  const handleSubmit = async (isDraft: boolean) => {
    if (
      !namaKegiatan ||
      !alamat ||
      !kabupatenKota ||
      !provinsi ||
      !tanggalMulai ||
      !jamMulai ||
      !jamSelesai ||
      !kategori
    ) {
      return alert("Semua tabel wajib diisi")
    }

    if (!editingKegiatan && !thumbnail) {
      return alert("Thumbnail wajib diisi")
    }

    const payload = {
      nama_kegiatan: namaKegiatan,
      alamat,
      kabupaten_kota: kabupatenKota,
      provinsi,

      tanggal_mulai: tanggalMulai,
      jam_mulai: jamMulai,
      jam_selesai: jamSelesai,

      kategori,
      status_kegiatan: statusKegiatan,

      deskripsi_kegiatan: deskripsiKegiatan,
      tujuan_kegiatan: tujuanKegiatan,
      link_pendaftaran: linkPendaftaran,

      hasil_kegiatan: hasilKegiatan,
      press_release: pressRelease,

      targets,

      is_draft: isDraft,
    }

    try {
      if (editingKegiatan) {
        await updateKegiatan(editingKegiatan.id, payload, thumbnail)

        alert("Kegiatan berhasil diperbarui")
      } else {
        await createKegiatan(payload, thumbnail!)

        alert("Kegiatan berhasil ditambahkan")
        resetForm()
      }

      onSuccess()
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Terjadi kesalahan"
      alert(message)
    }
  }

  return (
    <div className="mx-auto max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#0F5139]">
          Tambah/Edit Kegiatan
        </h1>
      </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <div className="md:col-span-2">
            <label className="mb-2 block font-medium text-[#0F5139]">
              Nama Kegiatan
            </label>
            <input
              type="text"
              placeholder="Nama kegiatan"
              value={namaKegiatan}
              onChange={(e) => setNamaKegiatan(e.target.value)}
              className="w-full rounded-xl border p-3 transition duration-200 focus:border-[#0F5139] focus:ring-2 focus:ring-[#0F5139]/10 outline-none"
            />
          </div>

          <div>
            <div>
              <label className="mb-2 block font-medium text-[#0F5139]">
                Kategori
              </label>

              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowKategori(!showKategori)}
                  className="flex w-full items-center justify-between rounded-xl border p-3 transition duration-200 focus:border-[#0F5139] focus:ring-2 focus:ring-[#0F5139]/10 outline-none"
                >
                  <span>
                    {kategori || "Pilih kategori"}
                  </span>

                  <svg
                    className={`h-4 w-4 transition-transform duration-200 ${
                      showKategori ? "rotate-180" : ""
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>

                {showKategori && (
                  <div className="absolute left-0 right-0 z-50 mt-2 overflow-hidden rounded-xl border bg-white shadow-lg">

                    <button
                      type="button"
                      onClick={() => {
                        setKategori("Penanaman")
                        setShowKategori(false)
                      }}
                      className="w-full px-4 py-3 text-left text-sm hover:bg-gray-100"
                    >
                      Penanaman
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setKategori("Survei")
                        setShowKategori(false)
                      }}
                      className="w-full px-4 py-3 text-left text-sm hover:bg-gray-100"
                    >
                      Survei
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setKategori("Bersih Lingkungan")
                        setShowKategori(false)
                      }}
                      className="w-full px-4 py-3 text-left text-sm hover:bg-gray-100"
                    >
                      Bersih Lingkungan
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setKategori("Edukasi")
                        setShowKategori(false)
                      }}
                      className="w-full px-4 py-3 text-left text-sm hover:bg-gray-100"
                    >
                      Edukasi
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div>
            <label className="mb-2 block font-medium text-[#0F5139]">
              Tanggal Mulai
            </label>
            <input
              type="date"
              value={tanggalMulai}
              onChange={(e) => setTanggalMulai(e.target.value)}
              className="w-full rounded-xl border p-3"
            />
          </div>

          <div>
            <label className="mb-2 block font-medium text-[#0F5139]">
              Jam Mulai
            </label>
            <input
              type="time"
              value={jamMulai}
              onChange={(e) => setJamMulai(e.target.value)}
              className="w-full rounded-xl border p-3"
            />
          </div>

          <div>
            <label className="mb-2 block font-medium text-[#0F5139]">
              Jam Selesai
            </label>
            <input
              type="time"
              value={jamSelesai}
              onChange={(e) => setJamSelesai(e.target.value)}
              className="w-full rounded-xl border p-3"
            />
          </div>

          <div className="md:col-span-2">
            <label className="mb-2 block font-medium text-[#0F5139]">
              Alamat
            </label>
            <input
              type="text"
              placeholder="Alamat"
              value={alamat}
              onChange={(e) => setAlamat(e.target.value)}
              className="w-full rounded-xl border p-3 transition duration-200 focus:border-[#0F5139] focus:ring-2 focus:ring-[#0F5139]/10 outline-none"
            />
          </div>

          <div>
            <label className="mb-2 block font-medium text-[#0F5139]">
              Kabupaten / Kota
            </label>
            <input
              type="text"
              placeholder="Kabupaten/Kota"
              value={kabupatenKota}
              onChange={(e) => setKabupatenKota(e.target.value)}
              className="w-full rounded-xl border p-3 transition duration-200 focus:border-[#0F5139] focus:ring-2 focus:ring-[#0F5139]/10 outline-none"
            />
          </div>

          <div>
            <label className="mb-2 block font-medium text-[#0F5139]">
              Provinsi
            </label>
            <input
              type="text"
              placeholder="Provinsi"
              value={provinsi}
              onChange={(e) => setProvinsi(e.target.value)}
              className="w-full rounded-xl border p-3 transition duration-200 focus:border-[#0F5139] focus:ring-2 focus:ring-[#0F5139]/10 outline-none"
            />
          </div>
        </div>

        {statusKegiatan === "upcoming" && (
          <div className="mt-10 space-y-5">
            <label className="mb-2 block font-medium text-[#0F5139]">
              Deskripsi Kegiatan
            </label>
            <textarea
              placeholder="Deskripsi kegiatan"
              value={deskripsiKegiatan}
              onChange={(e) => setDeskripsiKegiatan(e.target.value)}
              className="min-h-32 w-full rounded-xl border p-4 transition duration-200 focus:border-[#0F5139] focus:ring-2 focus:ring-[#0F5139]/10 outline-none"
            />

            <label className="mb-2 block font-medium text-[#0F5139]">
              Tujuan Kegiatan
            </label>
            <textarea
              placeholder="Tujuan kegiatan"
              value={tujuanKegiatan}
              onChange={(e) => setTujuanKegiatan(e.target.value)}
              className="min-h-32 w-full rounded-xl border p-4 transition duration-200 focus:border-[#0F5139] focus:ring-2 focus:ring-[#0F5139]/10 outline-none"
            />

            <label className="mb-2 block font-medium text-[#0F5139]">
              Link Pendaftaran
            </label>
            <input
              type="text"
              placeholder="Link pendaftaran"
              value={linkPendaftaran}
              onChange={(e) => setLinkPendaftaran(e.target.value)}
              className="w-full rounded-xl border p-3 transition duration-200 focus:border-[#0F5139] focus:ring-2 focus:ring-[#0F5139]/10 outline-none"
            />

            <div>
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-xl font-semibold">Target Kegiatan</h2>

                <button
                  type="button"
                  onClick={addTarget}
                  className="rounded-xl bg-[#0F5139] px-4 py-2 text-white transition-all duration-200 hover:bg-[#0A3D2A] active:scale-95"
                >
                  + Tambah Target
                </button>
              </div>

              <div className="space-y-4">
                {targets.map((target, index) => (
                  <div key={index} className="rounded-2xl border p-5 transition duration-200 hover:shadow-sm">
                    <label className="mb-2 block font-medium text-[#0F5139]">
                      Nama Target
                    </label>
                    <input
                      type="text"
                      placeholder="Nama target"
                      value={target.nama_target}
                      onChange={(e) =>
                        updateTarget(index, "nama_target", e.target.value)
                      }
                      className="mb-3 w-full rounded-xl border p-3 transition duration-200 focus:border-[#0F5139] focus:ring-2 focus:ring-[#0F5139]/10 outline-none"
                    />

                    <label className="mb-2 block font-medium text-[#0F5139]">
                      Isi Target
                    </label>
                    <textarea
                      placeholder="Isi target"
                      value={target.isi_target}
                      onChange={(e) =>
                        updateTarget(index, "isi_target", e.target.value)
                      }
                      className="min-h-28 w-full rounded-xl border p-3 transition duration-200 focus:border-[#0F5139] focus:ring-2 focus:ring-[#0F5139]/10 outline-none"
                    />

                    {targets.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeTarget(index)}
                        className="mt-3 rounded-lg bg-red-600 px-4 py-2 text-sm text-white transition-all duration-200 hover:bg-red-700 active:scale-95"
                      >
                        Hapus
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {statusKegiatan === "completed" && (
          <div className="mt-10 space-y-5">
            <label className="mb-2 block font-medium text-[#0F5139]">
              Hasil Kegiatan
            </label>
            <textarea
              placeholder="Hasil kegiatan"
              value={hasilKegiatan}
              onChange={(e) => setHasilKegiatan(e.target.value)}
              className="min-h-32 w-full rounded-xl border p-4 transition duration-200 focus:border-[#0F5139] focus:ring-2 focus:ring-[#0F5139]/10 outline-none"
            />

            <label className="mb-2 block font-medium text-[#0F5139]">
              Press Release
            </label>
            <textarea
              placeholder="Press release"
              value={pressRelease}
              onChange={(e) => setPressRelease(e.target.value)}
              className="min-h-64 w-full rounded-xl border p-4 transition duration-200 focus:border-[#0F5139] focus:ring-2 focus:ring-[#0F5139]/10 outline-none"
            />
          </div>
        )}

        <div className="mt-10">
          <label className="mb-2 block font-medium text-[#0F5139]">
            Thumbnail
          </label>
          <label className="flex h-56 cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed transition-all duration-200 hover:bg-[#F5F5F5]">
            <p className="font-semibold">Upload Thumbnail</p>

            <p className="mt-1 text-sm text-gray-500">
                  PNG, JPG, JPEG
                </p>

            <p className="mt-1 text-sm">
              {thumbnail
                ? thumbnail.name
                : editingKegiatan?.thumbnail_url
                  ? "Thumbnail lama tetap digunakan"
                  : "Klik pilih gambar"}
            </p>

            <input
              type="file"
              accept="image/*"
              onChange={(e) => setThumbnail(e.target.files?.[0] || null)}
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
            {editingKegiatan ? "Update Draft" : "Simpan Draft"}
          </button>

          <button
            type="button"
            onClick={() => handleSubmit(false)}
            className="rounded-xl bg-[#0F5139] px-6 py-3 text-white transition hover:bg-[#0A3D2A] active:scale-95"
          >
            {editingKegiatan ? "Update & Publish" : "Publish Kegiatan"}
          </button>

          {editingKegiatan && (
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