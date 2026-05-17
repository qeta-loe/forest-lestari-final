"use client"

import { useState } from "react"
import { uploadLokasiPenanaman } from "./lokasi.service"

type PolygonInputPoint = {
  lat: string
  lng: string
}

type Props = {
  onSuccess: () => void
}

export default function LokasiForm({ onSuccess }: Props) {
  const [namaLokasi, setNamaLokasi] = useState("")
  const [slug, setSlug] = useState("")
  const [deskripsi, setDeskripsi] = useState("")
  const [provinsi, setProvinsi] = useState("")
  const [kabupatenKota, setKabupatenKota] = useState("")
  const [alamatLengkap, setAlamatLengkap] = useState("")

  const [latitude, setLatitude] = useState("")
  const [longitude, setLongitude] = useState("")

  const [luasArea, setLuasArea] = useState("")
  const [jumlahBibit, setJumlahBibit] = useState("")
  const [tanggalTanam, setTanggalTanam] = useState("")

  const [gambarUtama, setGambarUtama] = useState("")
  const [gambar1, setGambar1] = useState("")
  const [gambar2, setGambar2] = useState("")
  const [gambar3, setGambar3] = useState("")

  const [statusLokasi, setStatusLokasi] = useState("aktif")

  const [polygonPoints, setPolygonPoints] = useState<PolygonInputPoint[]>([
    { lat: "", lng: "" },
    { lat: "", lng: "" },
    { lat: "", lng: "" },
  ])

  const updatePoint = (
    index: number,
    field: "lat" | "lng",
    value: string
  ) => {
    setPolygonPoints((prev) =>
      prev.map((p, i) =>
        i === index ? { ...p, [field]: value } : p
      )
    )
  }

  const addPoint = () => {
    setPolygonPoints((prev) => [
      ...prev,
      { lat: "", lng: "" },
    ])
  }

  const removePoint = (index: number) => {
    if (polygonPoints.length <= 3) {
      return alert("Polygon minimal harus memiliki 3 titik")
    }

    setPolygonPoints((prev) =>
      prev.filter((_, i) => i !== index)
    )
  }

  const resetForm = () => {
    setNamaLokasi("")
    setSlug("")
    setDeskripsi("")
    setProvinsi("")
    setKabupatenKota("")
    setAlamatLengkap("")
    setLatitude("")
    setLongitude("")
    setLuasArea("")
    setJumlahBibit("")
    setTanggalTanam("")
    setGambarUtama("")
    setGambar1("")
    setGambar2("")
    setGambar3("")
    setStatusLokasi("aktif")

    setPolygonPoints([
      { lat: "", lng: "" },
      { lat: "", lng: "" },
      { lat: "", lng: "" },
    ])
  }

  const handleSubmit = async () => {
    if (
      !namaLokasi ||
      !slug ||
      !deskripsi ||
      !provinsi ||
      !kabupatenKota ||
      !latitude ||
      !longitude ||
      !luasArea ||
      !jumlahBibit ||
      !tanggalTanam
    ) {
      return alert("Semua field wajib diisi")
    }

    const hasEmptyPolygon = polygonPoints.some(
      (point) => !point.lat || !point.lng
    )

    if (hasEmptyPolygon) {
      return alert("Semua titik polygon wajib diisi")
    }

    try {
      await uploadLokasiPenanaman({
        nama_lokasi: namaLokasi,
        slug,
        deskripsi,
        provinsi,
        kabupaten_kota: kabupatenKota,
        alamat_lengkap: alamatLengkap,

        latitude: Number(latitude),
        longitude: Number(longitude),

        luas_area: Number(luasArea),
        jumlah_bibit: Number(jumlahBibit),

        tanggal_tanam: tanggalTanam,

        gambar_utama: gambarUtama,
        gambar_1: gambar1,
        gambar_2: gambar2,
        gambar_3: gambar3,

        status_lokasi: statusLokasi,

        polygon_coordinates: polygonPoints.map((point) => ({
          lat: Number(point.lat),
          lng: Number(point.lng),
        })),
      })

      alert("Lokasi penanaman berhasil ditambahkan")

      resetForm()
      onSuccess()
    } catch (error: any) {
      alert(error.message)
    }
  }

  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-bold text-[#0F5139]">
        Tambah Lokasi Penanaman
      </h1>

      {/* Nama */}
      <div>
        <label className="mb-2 block font-medium text-[#0F5139]">
          Nama Lokasi
        </label>

        <input
          type="text"
          value={namaLokasi}
          onChange={(e) => setNamaLokasi(e.target.value)}
          placeholder="Contoh: Area Pondok Ambung"
          className="w-full rounded border border-[#0F5139] p-3 text-[#0F5139]"
        />
      </div>

      {/* Slug */}
      <div>
        <label className="mb-2 block font-medium text-[#0F5139]">
          Slug
        </label>

        <input
          type="text"
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
          placeholder="contoh: area-pondok-ambung"
          className="w-full rounded border border-[#0F5139] p-3 text-[#0F5139]"
        />
      </div>

      {/* Deskripsi */}
      <div>
        <label className="mb-2 block font-medium text-[#0F5139]">
          Deskripsi
        </label>

        <textarea
          value={deskripsi}
          onChange={(e) => setDeskripsi(e.target.value)}
          placeholder="Deskripsi lokasi penanaman"
          className="min-h-32 w-full rounded border border-[#0F5139] p-3 text-[#0F5139]"
        />
      </div>

      {/* Provinsi */}
      <div>
        <label className="mb-2 block font-medium text-[#0F5139]">
          Provinsi
        </label>

        <input
          type="text"
          value={provinsi}
          onChange={(e) => setProvinsi(e.target.value)}
          placeholder="Jawa Barat"
          className="w-full rounded border border-[#0F5139] p-3 text-[#0F5139]"
        />
      </div>

      {/* Kabupaten */}
      <div>
        <label className="mb-2 block font-medium text-[#0F5139]">
          Kabupaten / Kota
        </label>

        <input
          type="text"
          value={kabupatenKota}
          onChange={(e) => setKabupatenKota(e.target.value)}
          placeholder="Bogor"
          className="w-full rounded border border-[#0F5139] p-3 text-[#0F5139]"
        />
      </div>

      {/* Alamat */}
      <div>
        <label className="mb-2 block font-medium text-[#0F5139]">
          Alamat Lengkap
        </label>

        <textarea
          value={alamatLengkap}
          onChange={(e) => setAlamatLengkap(e.target.value)}
          placeholder="Alamat lengkap lokasi"
          className="min-h-24 w-full rounded border border-[#0F5139] p-3 text-[#0F5139]"
        />
      </div>

      {/* Latitude Longitude */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <label className="mb-2 block font-medium text-[#0F5139]">
            Latitude
          </label>

          <input
            type="number"
            step="any"
            value={latitude}
            onChange={(e) => setLatitude(e.target.value)}
            placeholder="-6.12345"
            className="w-full rounded border border-[#0F5139] p-3 text-[#0F5139]"
          />
        </div>

        <div>
          <label className="mb-2 block font-medium text-[#0F5139]">
            Longitude
          </label>

          <input
            type="number"
            step="any"
            value={longitude}
            onChange={(e) => setLongitude(e.target.value)}
            placeholder="106.12345"
            className="w-full rounded border border-[#0F5139] p-3 text-[#0F5139]"
          />
        </div>
      </div>

      {/* Luas dan Bibit */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <label className="mb-2 block font-medium text-[#0F5139]">
            Luas Area (ha)
          </label>

          <input
            type="number"
            step="any"
            value={luasArea}
            onChange={(e) => setLuasArea(e.target.value)}
            placeholder="7.4"
            className="w-full rounded border border-[#0F5139] p-3 text-[#0F5139]"
          />
        </div>

        <div>
          <label className="mb-2 block font-medium text-[#0F5139]">
            Jumlah Bibit
          </label>

          <input
            type="number"
            value={jumlahBibit}
            onChange={(e) => setJumlahBibit(e.target.value)}
            placeholder="140"
            className="w-full rounded border border-[#0F5139] p-3 text-[#0F5139]"
          />
        </div>
      </div>

      {/* Tanggal */}
      <div>
        <label className="mb-2 block font-medium text-[#0F5139]">
          Tanggal Tanam
        </label>

        <input
          type="date"
          value={tanggalTanam}
          onChange={(e) => setTanggalTanam(e.target.value)}
          className="w-full rounded border border-[#0F5139] p-3 text-[#0F5139]"
        />
      </div>

      {/* Status */}
      <div>
        <label className="mb-2 block font-medium text-[#0F5139]">
          Status Lokasi
        </label>

        <select
          value={statusLokasi}
          onChange={(e) => setStatusLokasi(e.target.value)}
          className="w-full rounded border border-[#0F5139] p-3 text-[#0F5139]"
        >
          <option value="aktif">Aktif</option>
          <option value="selesai">Selesai</option>
          <option value="perencanaan">Perencanaan</option>
        </select>
      </div>

      {/* Gambar */}
      <div className="space-y-4 rounded-xl border border-[#0F5139]/20 bg-white p-4">
        <h2 className="text-lg font-bold text-[#0F5139]">
          Gambar Lokasi
        </h2>

        <input
          type="text"
          value={gambarUtama}
          onChange={(e) => setGambarUtama(e.target.value)}
          placeholder="URL gambar utama"
          className="w-full rounded border border-[#0F5139] p-3 text-[#0F5139]"
        />

        <input
          type="text"
          value={gambar1}
          onChange={(e) => setGambar1(e.target.value)}
          placeholder="URL gambar 1"
          className="w-full rounded border border-[#0F5139] p-3 text-[#0F5139]"
        />

        <input
          type="text"
          value={gambar2}
          onChange={(e) => setGambar2(e.target.value)}
          placeholder="URL gambar 2"
          className="w-full rounded border border-[#0F5139] p-3 text-[#0F5139]"
        />

        <input
          type="text"
          value={gambar3}
          onChange={(e) => setGambar3(e.target.value)}
          placeholder="URL gambar 3"
          className="w-full rounded border border-[#0F5139] p-3 text-[#0F5139]"
        />
      </div>

      {/* Polygon */}
      <div className="rounded-xl border border-[#0F5139]/30 bg-white p-4">
        <h2 className="mb-4 text-lg font-bold text-[#0F5139]">
          Polygon Koordinat
        </h2>

        <div className="space-y-4">
          {polygonPoints.map((point, index) => (
            <div
              key={index}
              className="grid grid-cols-1 gap-3 rounded-lg border border-gray-200 p-4 md:grid-cols-[1fr_1fr_auto]"
            >
              <input
                type="number"
                step="any"
                placeholder={`Latitude titik ${index + 1}`}
                value={point.lat}
                onChange={(e) =>
                  updatePoint(index, "lat", e.target.value)
                }
                className="rounded border border-[#0F5139] p-3 text-[#0F5139]"
              />

              <input
                type="number"
                step="any"
                placeholder={`Longitude titik ${index + 1}`}
                value={point.lng}
                onChange={(e) =>
                  updatePoint(index, "lng", e.target.value)
                }
                className="rounded border border-[#0F5139] p-3 text-[#0F5139]"
              />

              <button
                type="button"
                onClick={() => removePoint(index)}
                className="rounded bg-red-600 px-4 py-3 text-white hover:bg-red-700"
              >
                Hapus
              </button>
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={addPoint}
          className="mt-4 rounded bg-[#0F5139] px-4 py-3 text-white hover:bg-[#0A3D2A]"
        >
          Tambah Titik
        </button>

        <p className="mt-3 text-sm text-gray-500">
          Minimal 3 titik polygon.
        </p>
      </div>

      {/* Submit */}
      <button
        onClick={handleSubmit}
        className="rounded bg-emerald-900 px-6 py-3 text-white transition hover:bg-emerald-950 active:scale-95"
      >
        Simpan Lokasi
      </button>
    </div>
  )
}