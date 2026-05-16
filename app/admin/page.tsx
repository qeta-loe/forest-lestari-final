"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"

type MenuKey =
  | "upload"
  | "list"
  | "dokumen"
  | "dokumenList"
  | "artikel"
  | "artikelList"
  | "database"
  | "lokasiPenanaman"
  | "daftarLokasiPenanaman"
  | "das"
  | "daftarDas"
  | "pohon"
  | "daftarPohon"
  | "profil"

type Kegiatan = {
  id: number
  nama: string
  deskripsi: string
  image_url: string
}

type TargetKegiatan = {
  nama_target: string
  isi_target: string  
}

type Dokumen = {
  id: number
  judul: string
  file_url: string
}

type ArtikelSection = {
  title: string
  content: string
  quote: string
}

type Artikel = {
  id: number
  judul: string
  deskripsi_singkat: string
  kategori: string
  penulis: string
  tanggal_publikasi: string
  image_url: string
  sections: ArtikelSection[]
  is_draft: boolean
  created_at?: string
  updated_at?: string
}

type PolygonInputPoint = {
  lat: string
  lng: string
}

type PolygonCoordinate = {
  lat: number
  lng: number
}

type LokasiPenanaman = {
  id: number
  nama_lokasi: string
  latitude: number
  longitude: number
  deskripsi: string | null
  polygon_coordinates: PolygonCoordinate[] | null
}

export default function AdminPage() {
  const router = useRouter()
  const [checkingAuth, setCheckingAuth] = useState(true)
  const [menu, setMenu] = useState<MenuKey>("upload")
  const [isKegiatanOpen, setIsKegiatanOpen] = useState(true)
  const [isDokumenOpen, setIsDokumenOpen] = useState(false)
  const [isArtikelOpen, setIsArtikelOpen] = useState(false)
  const [isDatabaseOpen, setIsDatabaseOpen] = useState(false)
  const [isLokasiPenanamanOpen, setIsLokasiPenanamanOpen] = useState(false)
  const [isDasOpen, setIsDasOpen] = useState(false)
  const [isPohonOpen, setIsPohonOpen] = useState(false)

  const [nama, setNama] = useState("")
  const [deskripsi, setDeskripsi] = useState("")
  const [file, setFile] = useState<File | null>(null)

  const [judulDokumen, setJudulDokumen] = useState("")
  const [fileDokumen, setFileDokumen] = useState<File | null>(null)
  const [dokumen, setDokumen] = useState<Dokumen[]>([])

  const [judulArtikel, setJudulArtikel] = useState("")
  const [deskripsiSingkat, setDeskripsiSingkat] = useState("")
  const [kategoriArtikel, setKategoriArtikel] = useState("")
  const [penulisArtikel, setPenulisArtikel] = useState("")
  const [tanggalPublikasi, setTanggalPublikasi] = useState("")
  const [sectionsArtikel, setSectionsArtikel] = useState<
    {
      title: string
      content: string
      quote: string
    }[]
  >([
    {
      title: "",
      content: "",
      quote: "",
    },
  ])
  const [gambarArtikel, setGambarArtikel] = useState<File | null>(null)
  const [artikel, setArtikel] = useState<Artikel[]>([])
  const addArtikelSection = () => {
    setSectionsArtikel((prev) => [
      ...prev,
      {
        title: "",
        content: "",
        quote: "",
      },
    ])
  }
  const removeArtikelSection = (index: number) => {
    setSectionsArtikel((prev) => prev.filter((_, i) => i !== index))
  }
  const updateArtikelSection = (
    index: number,
    field: "title" | "content" | "quote",
    value: string
  ) => {
    setSectionsArtikel((prev) =>
      prev.map((item, i) =>
        i === index ? { ...item, [field]: value } : item
      )
    )
  }
  const [editingArtikelId, setEditingArtikelId] = useState<number | null>(null)

  const resetFormArtikel = () => {
    setEditingArtikelId(null)
    setJudulArtikel("")
    setDeskripsiSingkat("")
    setKategoriArtikel("")
    setPenulisArtikel("")
    setTanggalPublikasi("")
    setSectionsArtikel([
      { title: "", content: "", quote: "" }
    ])
    setGambarArtikel(null)
  }

  const [namaLokasi, setNamaLokasi] = useState("")
  const [deskripsiLokasi, setDeskripsiLokasi] = useState("")
  const [polygonPoints, setPolygonPoints] = useState<PolygonInputPoint[]>([
    { lat: "", lng: "" },
    { lat: "", lng: "" },
    { lat: "", lng: "" },
  ])
  const [lokasiPenanaman, setLokasiPenanaman] = useState<LokasiPenanaman[]>([])

  const [informasiKomunitas, setInformasiKomunitas] = useState("")
  const [visiMisi, setVisiMisi] = useState("")
  const [sejarah, setSejarah] = useState("")
  const [strukturOrganisasi, setStrukturOrganisasi] = useState("")

  const [kegiatan, setKegiatan] = useState<Kegiatan[]>([])
  const [editMode, setEditMode] = useState(false)
  const [selectedIds, setSelectedIds] = useState<number[]>([])

  const [editingItem, setEditingItem] = useState<Kegiatan | null>(null)
  const [editNama, setEditNama] = useState("")
  const [editDeskripsi, setEditDeskripsi] = useState("")
  const [editFile, setEditFile] = useState<File | null>(null)

  const menuItems: { key: "profil"; label: string }[] = [
    { key: "profil", label: "Kelola Profil Komunitas" },
  ]

  const isKegiatanActive = menu === "upload" || menu === "list"
  const isDokumenActive = menu === "dokumen" || menu === "dokumenList"
  const isArtikelActive = menu === "artikel" || menu === "artikelList"
  const isDatabaseActive =
    menu === "database" ||
    menu === "lokasiPenanaman" ||
    menu === "daftarLokasiPenanaman" ||
    menu === "das" ||
    menu === "daftarDas" ||
    menu === "pohon" ||
    menu === "daftarPohon"

  const mainMenuClass = (active: boolean) =>
    `w-full text-left px-4 py-2 rounded-md mb-2 transition-all duration-150 cursor-pointer active:scale-95 ${
      active
        ? "bg-[#0F5139] text-white hover:bg-[#0A3D2A] active:bg-[#06291C]"
        : "text-[#0F5139] hover:bg-gray-100 active:bg-gray-200"
    }`

  const subMenuClass = (active: boolean) =>
    `ml-4 w-[calc(100%-1rem)] text-left px-4 py-2 rounded-md mb-2 text-sm transition-all duration-150 cursor-pointer active:scale-95 ${
      active
        ? "bg-[#0F5139]/10 text-[#0F5139] font-semibold"
        : "text-[#0F5139] hover:bg-gray-100 active:bg-gray-200"
    }`

  const subSubMenuClass = (active: boolean) =>
    `ml-8 w-[calc(100%-2rem)] text-left px-4 py-2 rounded-md mb-2 text-sm transition-all duration-150 cursor-pointer active:scale-95 ${
      active
        ? "bg-[#0F5139]/10 text-[#0F5139] font-semibold"
        : "text-[#0F5139] hover:bg-gray-100 active:bg-gray-200"
    }`

  const fetchKegiatan = async () => {
    const { data, error } = await supabase
      .from("kegiatan")
      .select("*")
      .order("id", { ascending: false })

    if (error) {
      alert(error.message)
      return
    }

    setKegiatan((data || []) as Kegiatan[])
  }

  const fetchDokumen = async () => {
    const { data, error } = await supabase
      .from("dokumen")
      .select("*")
      .order("id", { ascending: false })

    if (error) {
      alert(error.message)
      return
    }

    setDokumen((data || []) as Dokumen[])
  }

  const fetchArtikel = async () => {
    const { data, error } = await supabase
      .from("artikel")
      .select("*")
      .order("id", { ascending: false })

    if (error) {
      alert(error.message)
      return
    }

    console.log("ARTIKEL DATA:", data)
    console.log("ERROR:", error)
    console.log("LENGTH:", data?.length)


    setArtikel((data || []) as Artikel[])
  }

  useEffect(() => {
    fetchArtikel()
  }, [])

  useEffect(() => {
    if (menu === "artikel" && !editingArtikelId) {
      resetFormArtikel()
    }
  }, [menu])

  useEffect(() => {
    if (menu === "artikel" && !editingArtikelId) {
      resetFormArtikel()
    }
  }, [menu])

  const fetchLokasiPenanaman = async () => {
    const { data, error } = await supabase
      .from("lokasi_penanaman")
      .select("*")
      .order("id", { ascending: false })

    if (error) {
      alert(error.message)
      return
    }

    setLokasiPenanaman((data || []) as LokasiPenanaman[])
  }

  useEffect(() => {
    const checkAuthAndLoadData = async () => {
      const { data } = await supabase.auth.getSession()

      if (!data.session) {
        router.push("/login")
        return
      }

      setCheckingAuth(false)

      fetchKegiatan()
      fetchDokumen()
      fetchArtikel()
      fetchLokasiPenanaman()
    }

    checkAuthAndLoadData()
  }, [router])

  const uploadKegiatan = async () => {
    if (!nama || !deskripsi) return alert("Nama dan deskripsi wajib diisi")
    if (!file) return alert("Pilih gambar dulu")

    const fileName = `${Date.now()}-${file.name.replaceAll(" ", "-")}`

    const { error: uploadError } = await supabase.storage
      .from("kegiatan")
      .upload(fileName, file)

    if (uploadError) {
      alert(uploadError.message)
      return
    }

    const imageUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/kegiatan/${fileName}`

    const { error } = await supabase.from("kegiatan").insert([
      {
        nama,
        deskripsi,
        image_url: imageUrl,
      },
    ])

    if (error) {
      alert(error.message)
      return
    }

    alert("Berhasil upload!")

    setNama("")
    setDeskripsi("")
    setFile(null)

    fetchKegiatan()
  }

  const uploadDokumen = async () => {
    if (!judulDokumen || !fileDokumen) {
      alert("Semua tabel harus diisi")
      return
    }

    const isPdf = fileDokumen.name.toLowerCase().endsWith(".pdf")

    if (!isPdf) {
      alert("Ekstensi file harus .pdf")
      return
    }

    const fileName = `${Date.now()}-${fileDokumen.name.replaceAll(" ", "-")}`

    const { error: uploadError } = await supabase.storage
      .from("dokumen")
      .upload(fileName, fileDokumen)

    if (uploadError) {
      alert(uploadError.message)
      return
    }

    const fileUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/dokumen/${fileName}`

    const { error } = await supabase.from("dokumen").insert([
      {
        judul: judulDokumen,
        file_url: fileUrl,
      },
    ])

    if (error) {
      alert(error.message)
      return
    }

    alert("Dokumen berhasil diunggah")

    setJudulDokumen("")
    setFileDokumen(null)

    fetchDokumen()
  }

  const uploadArtikel = async (draftStatus: boolean) => {
    if (
      !judulArtikel ||
      !deskripsiSingkat ||
      !kategoriArtikel ||
      !penulisArtikel ||
      !tanggalPublikasi ||
      !gambarArtikel
    ) {
      alert("Semua field wajib diisi")
      return
    }

    const invalidSection = sectionsArtikel.some(
      (section) => !section.title || !section.content
    )

    if (invalidSection) {
      alert("Semua section wajib memiliki judul dan isi")
      return
    }

    let imageUrl = ""

    if (gambarArtikel) {
      const fileName = `${Date.now()}-${gambarArtikel.name.replaceAll(" ", "-")}`

      const { error: uploadError } = await supabase.storage
        .from("artikel")
        .upload(fileName, gambarArtikel)

      if (uploadError) {
        alert(uploadError.message)
        return
      }

      imageUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/artikel/${fileName}`
    }

    const payload = {
      judul: judulArtikel,
      deskripsi_singkat: deskripsiSingkat,
      kategori: kategoriArtikel,
      penulis: penulisArtikel,
      tanggal_publikasi: tanggalPublikasi,
      sections: sectionsArtikel,
      is_draft: draftStatus,
      ...(imageUrl && { image_url: imageUrl }),
    }

    let error

    // edit/update 
    if (editingArtikelId) {
      const res = await supabase
        .from("artikel")
        .update(payload)
        .eq("id", editingArtikelId)

      error = res.error
    }

    // create/insert
    else {
      const res = await supabase.from("artikel").insert([payload])
      error = res.error
    }

    if (error) {
      alert(error.message)
      return
    }

    alert(editingArtikelId ? "Artikel berhasil diupdate" : "Artikel berhasil disimpan")

    // reset form
    setJudulArtikel("")
    setDeskripsiSingkat("")
    setKategoriArtikel("")
    setPenulisArtikel("")
    setTanggalPublikasi("")
    setGambarArtikel(null)
    setSectionsArtikel([
      { title: "", content: "", quote: "" }
    ])

    setEditingArtikelId(null)

    fetchArtikel()

    await fetchArtikel()
    setMenu("artikelList")
  }

  const startEditArtikel = (artikel: Artikel) => {
    setEditingArtikelId(artikel.id)

    setJudulArtikel(artikel.judul)
    setDeskripsiSingkat(artikel.deskripsi_singkat)
    setKategoriArtikel(artikel.kategori)
    setPenulisArtikel(artikel.penulis)
    setTanggalPublikasi(artikel.tanggal_publikasi)

    setSectionsArtikel(artikel.sections || [])
    setGambarArtikel(null)
  }

  const updatePolygonPoint = (
    index: number,
    field: "lat" | "lng",
    value: string
  ) => {
    setPolygonPoints((prev) =>
      prev.map((point, i) =>
        i === index ? { ...point, [field]: value } : point
      )
    )
  }

  const addPolygonPoint = () => {
    setPolygonPoints((prev) => [...prev, { lat: "", lng: "" }])
  }

  const removePolygonPoint = (index: number) => {
    if (polygonPoints.length <= 3) {
      alert("Polygon minimal harus memiliki 3 titik")
      return
    }

    setPolygonPoints((prev) => prev.filter((_, i) => i !== index))
  }

  const uploadLokasiPenanaman = async () => {
    if (!namaLokasi) {
      alert("Semua tabel harus diisi")
      return
    }

    if (polygonPoints.length < 3) {
      alert("Polygon minimal harus memiliki 3 titik")
      return
    }

    const hasEmptyPoint = polygonPoints.some(
      (point) => !point.lat || !point.lng
    )

    if (hasEmptyPoint) {
      alert("Semua titik polygon harus diisi")
      return
    }

    const parsedPoints = polygonPoints.map((point) => ({
      lat: Number(point.lat),
      lng: Number(point.lng),
    }))

    const hasInvalidPoint = parsedPoints.some(
      (point) => Number.isNaN(point.lat) || Number.isNaN(point.lng)
    )

    if (hasInvalidPoint) {
      alert("Latitude dan longitude harus berupa angka")
      return
    }

    const { error } = await supabase.from("lokasi_penanaman").insert([
      {
        nama_lokasi: namaLokasi,
        latitude: parsedPoints[0].lat,
        longitude: parsedPoints[0].lng,
        deskripsi: deskripsiLokasi || null,
        polygon_coordinates: parsedPoints,
      },
    ])

    if (error) {
      alert(error.message)
      return
    }

    alert("Lokasi penanaman berhasil ditambahkan")

    setNamaLokasi("")
    setDeskripsiLokasi("")
    setPolygonPoints([
      { lat: "", lng: "" },
      { lat: "", lng: "" },
      { lat: "", lng: "" },
    ])

    fetchLokasiPenanaman()
  }

  const updateProfilKomunitas = async () => {
    if (!informasiKomunitas || !visiMisi || !sejarah || !strukturOrganisasi) {
      alert("Semua tabel harus diisi")
      return
    }

    const { error } = await supabase.from("profil_komunitas").upsert([
      {
        id: 1,
        informasi_komunitas: informasiKomunitas,
        visi_misi: visiMisi,
        sejarah,
        struktur_organisasi: strukturOrganisasi,
      },
    ])

    if (error) {
      alert(error.message)
      return
    }

    alert("Profil berhasil diperbarui")
  }

  const toggleSelect = (id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    )
  }

  const deleteSelected = async () => {
    if (selectedIds.length === 0) return alert("Pilih kegiatan dulu")

    const confirmDelete = confirm("Yakin mau hapus kegiatan yang dipilih?")
    if (!confirmDelete) return

    const selectedItems = kegiatan.filter((item) => selectedIds.includes(item.id))

    const imagePaths = selectedItems
      .map((item) => item.image_url?.split("/kegiatan/")[1])
      .filter(Boolean) as string[]

    if (imagePaths.length > 0) {
      await supabase.storage.from("kegiatan").remove(imagePaths)
    }

    const { error } = await supabase
      .from("kegiatan")
      .delete()
      .in("id", selectedIds)

    if (error) {
      alert(error.message)
      return
    }

    alert("Berhasil hapus kegiatan")

    setSelectedIds([])
    setEditMode(false)
    setEditingItem(null)
    fetchKegiatan()
  }

  const startEditSelected = () => {
    if (selectedIds.length === 0) return alert("Pilih 1 kegiatan dulu")
    if (selectedIds.length > 1) return alert("Edit hanya bisa 1 kegiatan sekali")

    const item = kegiatan.find((k) => k.id === selectedIds[0])
    if (!item) return alert("Kegiatan tidak ditemukan")

    setEditingItem(item)
    setEditNama(item.nama)
    setEditDeskripsi(item.deskripsi)
    setEditFile(null)
  }

  const updateKegiatan = async () => {
    if (!editingItem) return

    let imageUrl = editingItem.image_url

    if (editFile) {
      const fileName = `${Date.now()}-${editFile.name.replaceAll(" ", "-")}`

      const { error: uploadError } = await supabase.storage
        .from("kegiatan")
        .upload(fileName, editFile)

      if (uploadError) {
        alert(uploadError.message)
        return
      }

      imageUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/kegiatan/${fileName}`
    }

    const { error } = await supabase
      .from("kegiatan")
      .update({
        nama: editNama,
        deskripsi: editDeskripsi,
        image_url: imageUrl,
      })
      .eq("id", editingItem.id)

    if (error) {
      alert(error.message)
      return
    }

    alert("Berhasil update kegiatan")

    setEditingItem(null)
    setSelectedIds([])
    setEditMode(false)
    setEditNama("")
    setEditDeskripsi("")
    setEditFile(null)

    fetchKegiatan()
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push("/login")
  }

  if (checkingAuth) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F7F6EF] text-[#0F5139]">
        Memeriksa akses admin...
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-[#F7F6EF]">
      {/* Sidebar */}
      <div className="w-[250px] bg-white border-r p-4">
        <h2 className="text-[#0F5139] font-bold mb-6">Admin Panel</h2>

        <button
          onClick={() => {
            setMenu("upload")
            setIsKegiatanOpen((prev) => !prev)
            setIsDokumenOpen(false)
            setIsArtikelOpen(false)
            setIsDatabaseOpen(false)
          }}
          className={`${mainMenuClass(isKegiatanActive)} flex items-center gap-2`}
        >
          <span
            className={`text-xs transition-transform duration-200 ${
              isKegiatanOpen ? "rotate-90" : "rotate-0"
            }`}
          >
            ▶
          </span>
          <span>Upload Kegiatan</span>
        </button>

        {isKegiatanOpen && (
          <button
            onClick={() => setMenu("list")}
            className={subMenuClass(menu === "list")}
          >
            Daftar Kegiatan
          </button>
        )}

        <button
          onClick={() => {
            setMenu("dokumen")
            setIsDokumenOpen((prev) => !prev)
            setIsKegiatanOpen(false)
            setIsArtikelOpen(false)
            setIsDatabaseOpen(false)
          }}
          className={`${mainMenuClass(isDokumenActive)} flex items-center gap-2`}
        >
          <span
            className={`text-xs transition-transform duration-200 ${
              isDokumenOpen ? "rotate-90" : "rotate-0"
            }`}
          >
            ▶
          </span>
          <span>Upload Dokumen</span>
        </button>

        {isDokumenOpen && (
          <button
            onClick={() => setMenu("dokumenList")}
            className={subMenuClass(menu === "dokumenList")}
          >
            Daftar Dokumen
          </button>
        )}

        <button
          onClick={() => {
            setMenu("artikel")
            setIsArtikelOpen((prev) => !prev)
            setIsKegiatanOpen(false)
            setIsDokumenOpen(false)
            setIsDatabaseOpen(false)
          }}
          className={`${mainMenuClass(isArtikelActive)} flex items-center gap-2`}
        >
          <span
            className={`text-xs transition-transform duration-200 ${
              isArtikelOpen ? "rotate-90" : "rotate-0"
            }`}
          >
            ▶
          </span>
          <span>Upload Artikel</span>
        </button>

        {isArtikelOpen && (
          <button
            onClick={() => setMenu("artikelList")}
            className={subMenuClass(menu === "artikelList")}
          >
            Daftar Artikel
          </button>
        )}

        <button
          onClick={() => {
            setMenu("database")
            setIsDatabaseOpen((prev) => !prev)
            setIsKegiatanOpen(false)
            setIsDokumenOpen(false)
            setIsArtikelOpen(false)
          }}
          className={`${mainMenuClass(isDatabaseActive)} flex items-center gap-2`}
        >
          <span
            className={`text-xs transition-transform duration-200 ${
              isDatabaseOpen ? "rotate-90" : "rotate-0"
            }`}
          >
            ▶
          </span>
          <span>Upload Database</span>
        </button>

        {isDatabaseOpen && (
          <>
            <button
              onClick={() => {
                setMenu("lokasiPenanaman")
                setIsLokasiPenanamanOpen((prev) => !prev)
              }}
              className={`${subMenuClass(
                menu === "lokasiPenanaman" || menu === "daftarLokasiPenanaman"
              )} flex items-center gap-2`}
            >
              <span
                className={`text-xs transition-transform duration-200 ${
                  isLokasiPenanamanOpen ? "rotate-90" : "rotate-0"
                }`}
              >
                ▶
              </span>
              <span>Lokasi Penanaman</span>
            </button>

            {isLokasiPenanamanOpen && (
              <button
                onClick={() => setMenu("daftarLokasiPenanaman")}
                className={subSubMenuClass(menu === "daftarLokasiPenanaman")}
              >
                Daftar Lokasi Penanaman
              </button>
            )}

            <button
              onClick={() => {
                setMenu("das")
                setIsDasOpen((prev) => !prev)
              }}
              className={`${subMenuClass(menu === "das" || menu === "daftarDas")} flex items-center gap-2`}
            >
              <span
                className={`text-xs transition-transform duration-200 ${
                  isDasOpen ? "rotate-90" : "rotate-0"
                }`}
              >
                ▶
              </span>
              <span>DAS</span>
            </button>

            {isDasOpen && (
              <button
                onClick={() => setMenu("daftarDas")}
                className={subSubMenuClass(menu === "daftarDas")}
              >
                Daftar DAS
              </button>
            )}

            <button
              onClick={() => {
                setMenu("pohon")
                setIsPohonOpen((prev) => !prev)
              }}
              className={`${subMenuClass(menu === "pohon" || menu === "daftarPohon")} flex items-center gap-2`}
            >
              <span
                className={`text-xs transition-transform duration-200 ${
                  isPohonOpen ? "rotate-90" : "rotate-0"
                }`}
              >
                ▶
              </span>
              <span>Pohon</span>
            </button>

            {isPohonOpen && (
              <button
                onClick={() => setMenu("daftarPohon")}
                className={subSubMenuClass(menu === "daftarPohon")}
              >
                Daftar Pohon
              </button>
            )}
          </>
        )}

        {menuItems.map((item) => (
          <button
            key={item.key}
            onClick={() => {
              setMenu(item.key)
              setIsKegiatanOpen(false)
              setIsDokumenOpen(false)
              setIsArtikelOpen(false)
              setIsDatabaseOpen(false)
              setIsLokasiPenanamanOpen(false)
              setIsDasOpen(false)
              setIsPohonOpen(false)
            }}
            className={mainMenuClass(menu === item.key)}
          >
            {item.label}
          </button>
        ))}

        <button
          onClick={handleLogout}
          className="mt-6 w-full rounded-md bg-red-600 px-4 py-2 text-left text-white transition hover:bg-red-700 active:scale-95"
        >
          Logout
        </button>
      </div>

      {/* Konten kanan */}
      <div className="flex-1 p-8">
        {menu === "upload" && (
          <div>
            <h1 className="text-xl text-[#0F5139] font-semibold mb-4">
              Upload Kegiatan
            </h1>

            <input
              type="text"
              placeholder="Nama kegiatan"
              value={nama}
              onChange={(e) => setNama(e.target.value)}
              className="text-[#0F5139] block w-full mb-3 p-2 border rounded border-[#0F5139]"
            />

            <textarea
              placeholder="Deskripsi"
              value={deskripsi}
              onChange={(e) => setDeskripsi(e.target.value)}
              className="text-[#0F5139] block w-full mb-3 p-2 border rounded border-[#0F5139]"
            />

            <div className="mb-4">
              <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-gray-400 rounded-xl cursor-pointer hover:bg-gray-50 active:bg-gray-100 transition-all duration-150">
                <span className="text-sm text-[#0F5139]">Pilih Gambar</span>

                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                  className="hidden"
                />
              </label>

              <p className="text-sm text-gray-500 mt-2">
                {file ? file.name : "No file chosen"}
              </p>
            </div>

            <button
              onClick={uploadKegiatan}
              className="bg-emerald-900 hover:bg-emerald-950 active:bg-black active:scale-95 transition-all duration-150 text-white px-4 py-2 rounded cursor-pointer"
            >
              Upload
            </button>
          </div>
        )}

        {menu === "list" && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-xl text-[#0F5139] font-semibold">
                Daftar Kegiatan
              </h1>

              <div className="flex gap-2">
                {editMode && (
                  <>
                    <button
                      onClick={startEditSelected}
                      className="bg-yellow-500 hover:bg-yellow-600 active:bg-yellow-700 active:scale-95 transition-all duration-150 text-white px-4 py-2 rounded cursor-pointer"
                    >
                      Edit Pilihan
                    </button>

                    <button
                      onClick={deleteSelected}
                      className="bg-red-600 hover:bg-red-700 active:bg-red-800 active:scale-95 transition-all duration-150 text-white px-4 py-2 rounded cursor-pointer"
                    >
                      Hapus Pilihan
                    </button>
                  </>
                )}

                <button
                  onClick={() => {
                    setEditMode(!editMode)
                    setSelectedIds([])
                    setEditingItem(null)
                  }}
                  className="bg-[#0F5139] hover:bg-[#0A3D2A] active:bg-[#06291C] active:scale-95 transition-all duration-150 text-white px-4 py-2 rounded cursor-pointer"
                >
                  {editMode ? "Selesai" : "Edit"}
                </button>
              </div>
            </div>

            {editingItem && (
              <div className="bg-white border border-[#0F5139] rounded-xl p-4 mb-6">
                <h2 className="text-[#0F5139] font-semibold mb-3">
                  Edit Kegiatan
                </h2>

                <input
                  type="text"
                  value={editNama}
                  onChange={(e) => setEditNama(e.target.value)}
                  className="text-[#0F5139] block w-full mb-3 p-2 border rounded border-[#0F5139]"
                />

                <textarea
                  value={editDeskripsi}
                  onChange={(e) => setEditDeskripsi(e.target.value)}
                  className="text-[#0F5139] block w-full mb-3 p-2 border rounded border-[#0F5139]"
                />

                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setEditFile(e.target.files?.[0] || null)}
                  className="mb-4 text-[#0F5139]"
                />

                <div className="flex gap-2">
                  <button
                    onClick={updateKegiatan}
                    className="bg-[#0F5139] hover:bg-[#0A3D2A] active:bg-[#06291C] active:scale-95 transition-all duration-150 text-white px-4 py-2 rounded cursor-pointer"
                  >
                    Simpan Perubahan
                  </button>

                  <button
                    onClick={() => setEditingItem(null)}
                    className="bg-gray-400 hover:bg-gray-500 active:bg-gray-600 active:scale-95 transition-all duration-150 text-white px-4 py-2 rounded cursor-pointer"
                  >
                    Batal
                  </button>
                </div>
              </div>
            )}

            {kegiatan.length === 0 ? (
              <p className="text-gray-500">Belum ada kegiatan yang diupload.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {kegiatan.map((item) => (
                  <div
                    key={item.id}
                    className={`relative bg-white rounded-xl border shadow-sm overflow-hidden transition-all duration-150 ${
                      selectedIds.includes(item.id)
                        ? "ring-2 ring-[#0F5139]"
                        : "hover:shadow-md"
                    }`}
                  >
                    {editMode && (
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(item.id)}
                        onChange={() => toggleSelect(item.id)}
                        className="absolute top-3 right-3 w-5 h-5 z-10 cursor-pointer"
                      />
                    )}

                    <img
                      src={item.image_url}
                      alt={item.nama}
                      className="w-full h-40 object-cover"
                    />

                    <div className="p-4">
                      <h2 className="text-[#0F5139] font-semibold mb-2">
                        {item.nama}
                      </h2>

                      <p className="text-sm text-gray-600">
                        {item.deskripsi}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {menu === "dokumen" && (
          <div>
            <h1 className="text-xl text-[#0F5139] font-semibold mb-4">
              Upload Dokumen
            </h1>

            <input
              type="text"
              placeholder="Judul dokumen"
              value={judulDokumen}
              onChange={(e) => setJudulDokumen(e.target.value)}
              className="text-[#0F5139] block w-full mb-3 p-2 border rounded border-[#0F5139]"
            />

            <div className="mb-4">
              <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-gray-400 rounded-xl cursor-pointer hover:bg-gray-50 active:bg-gray-100 transition-all duration-150">
                <span className="text-sm text-[#0F5139]">Pilih Dokumen PDF</span>

                <input
                  type="file"
                  accept=".pdf,application/pdf"
                  onChange={(e) => setFileDokumen(e.target.files?.[0] || null)}
                  className="hidden"
                />
              </label>

              <p className="text-sm text-gray-500 mt-2">
                {fileDokumen ? fileDokumen.name : "No file chosen"}
              </p>
            </div>

            <button
              onClick={uploadDokumen}
              className="bg-emerald-900 hover:bg-emerald-950 active:bg-black active:scale-95 transition-all duration-150 text-white px-4 py-2 rounded cursor-pointer"
            >
              Upload
            </button>
          </div>
        )}

        {menu === "dokumenList" && (
          <div>
            <h1 className="text-xl text-[#0F5139] font-semibold mb-6">
              Daftar Dokumen
            </h1>

            {dokumen.length === 0 ? (
              <p className="text-gray-500">Belum ada dokumen yang diupload.</p>
            ) : (
              <div className="space-y-3">
                {dokumen.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between rounded-xl border bg-white p-4 shadow-sm"
                  >
                    <div>
                      <h2 className="font-semibold text-[#0F5139]">
                        {item.judul}
                      </h2>
                      <p className="text-sm text-gray-500">PDF</p>
                    </div>

                    <a
                      href={item.file_url}
                      target="_blank"
                      rel="noreferrer"
                      className="rounded-md bg-[#0F5139] px-4 py-2 text-sm text-white transition hover:bg-[#0A3D2A] active:scale-95"
                    >
                      Buka Dokumen
                    </a>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {menu === "artikel" && (
          <div className="mx-auto max-w-5xl">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-[#0F5139]">
                Kelola Artikel
              </h1>

              <p className="mt-2 text-sm text-gray-500">
                Tambahkan artikel edukasi, berita komunitas, dan publikasi lingkungan.
              </p>
            </div>

            <div className="rounded-3xl border border-[#0F5139]/10 bg-white p-8 shadow-sm">
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                <div className="md:col-span-2">
                  <label className="mb-2 block text-sm font-medium text-[#0F5139]">
                    Judul Artikel
                  </label>

                  <input
                    type="text"
                    placeholder="Masukkan judul artikel"
                    value={judulArtikel}
                    onChange={(e) => setJudulArtikel(e.target.value)}
                    className="w-full rounded-xl border border-[#0F5139]/20 bg-white px-4 py-3 text-[#0F5139] outline-none transition focus:border-[#0F5139] focus:ring-2 focus:ring-[#0F5139]/10"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="mb-2 block text-sm font-medium text-[#0F5139]">
                    Deskripsi Singkat
                  </label>

                  <textarea
                    placeholder="Tulis ringkasan artikel..."
                    value={deskripsiSingkat}
                    onChange={(e) => setDeskripsiSingkat(e.target.value)}
                    className="min-h-32 w-full rounded-xl border border-[#0F5139]/20 bg-white px-4 py-3 text-[#0F5139] outline-none transition focus:border-[#0F5139] focus:ring-2 focus:ring-[#0F5139]/10"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-[#0F5139]">
                    Kategori
                  </label>

                  <select
                    value={kategoriArtikel}
                    onChange={(e) => setKategoriArtikel(e.target.value)}
                    className="w-full rounded-xl border border-[#0F5139]/20 bg-white px-4 py-3 text-[#0F5139] outline-none transition focus:border-[#0F5139] focus:ring-2 focus:ring-[#0F5139]/10"
                  >
                    <option value="">Pilih kategori</option>
                    <option value="Isu Lingkungan">Isu Lingkungan</option>
                    <option value="Edukasi dan Tips">Edukasi dan Tips</option>
                    <option value="Berita Komunitas">Berita Komunitas</option>
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-[#0F5139]">
                    Penulis
                  </label>

                  <input
                    type="text"
                    placeholder="Nama penulis"
                    value={penulisArtikel}
                    onChange={(e) => setPenulisArtikel(e.target.value)}
                    className="w-full rounded-xl border border-[#0F5139]/20 bg-white px-4 py-3 text-[#0F5139] outline-none transition focus:border-[#0F5139] focus:ring-2 focus:ring-[#0F5139]/10"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="mb-2 block text-sm font-medium text-[#0F5139]">
                    Tanggal Publikasi
                  </label>

                  <input
                    type="date"
                    value={tanggalPublikasi}
                    onChange={(e) => setTanggalPublikasi(e.target.value)}
                    className="w-full rounded-xl border border-[#0F5139]/20 bg-white px-4 py-3 text-[#0F5139] outline-none transition focus:border-[#0F5139] focus:ring-2 focus:ring-[#0F5139]/10"
                  />
                </div>
              </div>

              <div className="mt-10">
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-semibold text-[#0F5139]">
                      Section Artikel
                    </h2>

                    <p className="text-sm text-gray-500">
                      Tambahkan beberapa section untuk isi artikel.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={addArtikelSection}
                    className="rounded-xl bg-[#0F5139] px-5 py-3 text-sm font-medium text-white transition hover:bg-[#0A3D2A] active:scale-95"
                  >
                    + Tambah Section
                  </button>
                </div>

                <div className="space-y-5">
                  {sectionsArtikel.map((section, index) => (
                    <div
                      key={index}
                      className="rounded-2xl border border-[#0F5139]/10 bg-[#F8FAF8] p-6"
                    >
                      <div className="mb-5 flex items-center justify-between">
                        <div>
                          <h3 className="text-lg font-semibold text-[#0F5139]">
                            Section {index + 1}
                          </h3>

                          <p className="text-sm text-gray-500">
                            Isi detail pembahasan artikel.
                          </p>
                        </div>

                        {sectionsArtikel.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeArtikelSection(index)}
                            className="rounded-lg bg-red-600 px-4 py-2 text-sm text-white transition hover:bg-red-700 active:scale-95"
                          >
                            Hapus
                          </button>
                        )}
                      </div>

                      <div className="space-y-4">
                        <div>
                          <label className="mb-2 block text-sm font-medium text-[#0F5139]">
                            Judul Section
                          </label>

                          <input
                            type="text"
                            placeholder="Contoh: Dampak Perubahan Iklim"
                            value={section.title}
                            onChange={(e) =>
                              updateArtikelSection(index, "title", e.target.value)
                            }
                            className="w-full rounded-xl border border-[#0F5139]/20 bg-white px-4 py-3 text-[#0F5139] outline-none transition focus:border-[#0F5139] focus:ring-2 focus:ring-[#0F5139]/10"
                          />
                        </div>

                        <div>
                          <label className="mb-2 block text-sm font-medium text-[#0F5139]">
                            Isi Section
                          </label>

                          <textarea
                            placeholder="Tulis isi section artikel..."
                            value={section.content}
                            onChange={(e) =>
                              updateArtikelSection(index, "content", e.target.value)
                            }
                            className="min-h-40 w-full rounded-xl border border-[#0F5139]/20 bg-white px-4 py-3 text-[#0F5139] outline-none transition focus:border-[#0F5139] focus:ring-2 focus:ring-[#0F5139]/10"
                          />
                        </div>

                        <div>
                          <label className="mb-2 block text-sm font-medium text-[#0F5139]">
                            Kutipan Narasumber (Opsional)
                          </label>

                          <textarea
                            placeholder="Masukkan kutipan penting..."
                            value={section.quote}
                            onChange={(e) =>
                              updateArtikelSection(index, "quote", e.target.value)
                            }
                            className="min-h-24 w-full rounded-xl border border-[#0F5139]/20 bg-white px-4 py-3 text-[#0F5139] outline-none transition focus:border-[#0F5139] focus:ring-2 focus:ring-[#0F5139]/10"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-10">
                <label className="mb-3 block text-sm font-medium text-[#0F5139]">
                  Gambar Artikel
                </label>

                <label className="flex h-56 w-full cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-[#0F5139]/20 bg-[#F8FAF8] transition hover:bg-[#F1F5F2]">
                  <div className="text-center">
                    <p className="text-lg font-semibold text-[#0F5139]">
                      Upload Cover Artikel
                    </p>

                    <p className="mt-1 text-sm text-gray-500">
                      PNG, JPG, atau WEBP
                    </p>

                    <p className="mt-3 text-sm text-[#0F5139] font-medium">
                      {gambarArtikel
                        ? gambarArtikel.name
                        : "Klik untuk memilih gambar"}
                    </p>
                  </div>

                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) =>
                      setGambarArtikel(e.target.files?.[0] || null)
                    }
                    className="hidden"
                  />
                </label>
              </div>

              <div className="mt-10 flex flex-wrap gap-4">
                <button onClick={() => uploadArtikel(false)}>
                  {editingArtikelId ? "Update Draft" : "Simpan Draft"}
                </button>

                <button onClick={() => uploadArtikel(true)}>
                  {editingArtikelId ? "Update & Publish" : "Publish Artikel"}
                </button>
              </div>
            </div>
          </div>
        )}

        {menu === "artikelList" && (
          <div>
            <h1 className="text-xl text-[#0F5139] font-semibold mb-6">
              Daftar Artikel
            </h1>

            {artikel.length === 0 ? (
              <p className="text-gray-500">Belum ada artikel yang diupload.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {artikel.filter(a => !a.is_draft).map((item) => (
                  <div
                    key={item.id}
                    className="overflow-hidden rounded-xl border bg-white shadow-sm transition hover:shadow-md"
                  >
                    <img
                      src={item.image_url}
                      alt={item.judul}
                      className="h-40 w-full object-cover"
                    />

                    <div className="p-4">
                      <h2 className="mb-2 font-semibold text-[#0F5139]">
                        {item.judul}
                      </h2>

                      <p className="text-sm text-gray-500 mb-2">
                        {item.kategori}
                      </p>

                      <p className="line-clamp-3 text-sm text-gray-600 mb-3">
                        {item.deskripsi_singkat}
                      </p>

                      <div className="text-xs text-gray-500 space-y-1">
                        <p>Penulis: {item.penulis}</p>
                        <p>
                          Last Modified:
                          {" "}
                          {item.updated_at
                            ? new Date(item.updated_at).toLocaleString()
                            : "-"}
                        </p>

                        <p>
                          Status:
                          {" "}
                          {item.is_draft ? "Draft" : "Published"}
                        </p>
                      </div>

                      <div className="mt-4 flex gap-2">
                        <button
                          onClick={() => {
                            startEditArtikel(item)
                            setMenu("artikel") // pindah ke form edit
                          }}
                          className="bg-yellow-500 text-white px-3 py-1 rounded text-sm"
                        >
                          Edit Draft
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {menu === "database" && <div />}

        {menu === "lokasiPenanaman" && (
          <div>
            <h1 className="text-xl text-[#0F5139] font-semibold mb-4">
              Lokasi Penanaman
            </h1>

            <input
              type="text"
              placeholder="Nama lokasi"
              value={namaLokasi}
              onChange={(e) => setNamaLokasi(e.target.value)}
              className="text-[#0F5139] block w-full mb-3 p-2 border rounded border-[#0F5139]"
            />

            <div className="mb-4 rounded-xl border border-[#0F5139]/30 bg-white p-4">
              <h2 className="mb-3 font-semibold text-[#0F5139]">
                Titik Polygon
              </h2>

              <div className="space-y-3">
                {polygonPoints.map((point, index) => (
                  <div
                    key={index}
                    className="grid grid-cols-1 gap-3 rounded-lg border border-gray-200 p-3 md:grid-cols-[1fr_1fr_auto]"
                  >
                    <input
                      type="number"
                      step="any"
                      placeholder={`Latitude titik ${index + 1}`}
                      value={point.lat}
                      onChange={(e) =>
                        updatePolygonPoint(index, "lat", e.target.value)
                      }
                      className="text-[#0F5139] block w-full rounded border border-[#0F5139] p-2"
                    />

                    <input
                      type="number"
                      step="any"
                      placeholder={`Longitude titik ${index + 1}`}
                      value={point.lng}
                      onChange={(e) =>
                        updatePolygonPoint(index, "lng", e.target.value)
                      }
                      className="text-[#0F5139] block w-full rounded border border-[#0F5139] p-2"
                    />

                    <button
                      type="button"
                      onClick={() => removePolygonPoint(index)}
                      className="rounded bg-red-600 px-3 py-2 text-sm text-white transition hover:bg-red-700 active:scale-95"
                    >
                      Hapus
                    </button>
                  </div>
                ))}
              </div>

              <button
                type="button"
                onClick={addPolygonPoint}
                className="mt-3 rounded bg-[#0F5139] px-4 py-2 text-sm text-white transition hover:bg-[#0A3D2A] active:scale-95"
              >
                Tambah Titik
              </button>

              <p className="mt-2 text-xs text-gray-500">
                Minimal 3 titik. Urutan titik menentukan bentuk polygon.
              </p>
            </div>

            <textarea
              placeholder="Deskripsi lokasi"
              value={deskripsiLokasi}
              onChange={(e) => setDeskripsiLokasi(e.target.value)}
              className="text-[#0F5139] block min-h-32 w-full mb-4 p-2 border rounded border-[#0F5139]"
            />

            <button
              onClick={uploadLokasiPenanaman}
              className="bg-emerald-900 hover:bg-emerald-950 active:bg-black active:scale-95 transition-all duration-150 text-white px-4 py-2 rounded cursor-pointer"
            >
              Simpan Lokasi
            </button>
          </div>
        )}

        {menu === "daftarLokasiPenanaman" && (
          <div>
            <h1 className="text-xl text-[#0F5139] font-semibold mb-6">
              Daftar Lokasi Penanaman
            </h1>

            {lokasiPenanaman.length === 0 ? (
              <p className="text-gray-500">Belum ada lokasi penanaman yang ditambahkan.</p>
            ) : (
              <div className="space-y-3">
                {lokasiPenanaman.map((item) => (
                  <div
                    key={item.id}
                    className="rounded-xl border bg-white p-4 shadow-sm"
                  >
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <h2 className="font-semibold text-[#0F5139]">
                          {item.nama_lokasi}
                        </h2>
                        <p className="mt-1 text-sm text-gray-600">
                          Titik utama: {item.latitude}, {item.longitude}
                        </p>
                        <p className="mt-1 text-sm text-gray-600">
                          Jumlah titik polygon: {item.polygon_coordinates?.length || 0}
                        </p>
                        {item.deskripsi && (
                          <p className="mt-2 text-sm text-gray-600">
                            {item.deskripsi}
                          </p>
                        )}
                      </div>

                      <a
                        href={`https://www.google.com/maps?q=${item.latitude},${item.longitude}`}
                        target="_blank"
                        rel="noreferrer"
                        className="w-fit rounded-md bg-[#0F5139] px-4 py-2 text-sm text-white transition hover:bg-[#0A3D2A] active:scale-95"
                      >
                        Buka Maps
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {menu === "das" && <div />}
        {menu === "daftarDas" && <div />}
        {menu === "pohon" && <div />}
        {menu === "daftarPohon" && <div />}
        {menu === "profil" && (
          <div>
            <h1 className="text-xl text-[#0F5139] font-semibold mb-4">
              Kelola Profil Komunitas
            </h1>

            <textarea
              placeholder="Informasi komunitas"
              value={informasiKomunitas}
              onChange={(e) => setInformasiKomunitas(e.target.value)}
              className="text-[#0F5139] block min-h-32 w-full mb-3 p-2 border rounded border-[#0F5139]"
            />

            <textarea
              placeholder="Visi-misi"
              value={visiMisi}
              onChange={(e) => setVisiMisi(e.target.value)}
              className="text-[#0F5139] block min-h-32 w-full mb-3 p-2 border rounded border-[#0F5139]"
            />

            <textarea
              placeholder="Sejarah"
              value={sejarah}
              onChange={(e) => setSejarah(e.target.value)}
              className="text-[#0F5139] block min-h-32 w-full mb-3 p-2 border rounded border-[#0F5139]"
            />

            <textarea
              placeholder="Struktur organisasi"
              value={strukturOrganisasi}
              onChange={(e) => setStrukturOrganisasi(e.target.value)}
              className="text-[#0F5139] block min-h-32 w-full mb-4 p-2 border rounded border-[#0F5139]"
            />

            <button
              onClick={updateProfilKomunitas}
              className="bg-emerald-900 hover:bg-emerald-950 active:bg-black active:scale-95 transition-all duration-150 text-white px-4 py-2 rounded cursor-pointer"
            >
              Simpan Profil
            </button>
          </div>
        )}
      </div>
    </div>
  )
}





