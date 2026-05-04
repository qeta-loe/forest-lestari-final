"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"

export default function AdminPage() {
  const [menu, setMenu] = useState("upload")

  const [nama, setNama] = useState("")
  const [deskripsi, setDeskripsi] = useState("")
  const [file, setFile] = useState(null)

  const [kegiatan, setKegiatan] = useState([])
  const [editMode, setEditMode] = useState(false)
  const [selectedIds, setSelectedIds] = useState([])

  const [editingItem, setEditingItem] = useState(null)
  const [editNama, setEditNama] = useState("")
  const [editDeskripsi, setEditDeskripsi] = useState("")
  const [editFile, setEditFile] = useState(null)

  const fetchKegiatan = async () => {
    const { data, error } = await supabase
      .from("kegiatan")
      .select("*")
      .order("id", { ascending: false })

    if (error) {
      alert(error.message)
      return
    }

    setKegiatan(data || [])
  }

  useEffect(() => {
    if (menu === "list") {
      fetchKegiatan()
    }
  }, [menu])

  const uploadKegiatan = async () => {
    if (!nama || !deskripsi) return alert("Nama dan deskripsi wajib diisi")
    if (!file) return alert("Pilih gambar dulu")

    const fileName = `${Date.now()}-${file.name.replace(/\s+/g, "-")}`

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

  const toggleSelect = (id) => {
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
      .filter(Boolean)

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

    setEditingItem(item)
    setEditNama(item.nama)
    setEditDeskripsi(item.deskripsi)
    setEditFile(null)
  }

  const updateKegiatan = async () => {
    if (!editingItem) return

    let imageUrl = editingItem.image_url

    if (editFile) {
      const fileName = `${Date.now()}-${editFile.name.replace(/\s+/g, "-")}`

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

  return (
    <div className="flex min-h-screen bg-[#F7F6EF]">
      {/* Sidebar */}
      <div className="w-[250px] bg-white border-r p-4">
        <h2 className="text-[#0F5139] font-bold mb-6">Admin Panel</h2>

        <button
          onClick={() => setMenu("upload")}
          className={`w-full text-left px-4 py-2 rounded-md mb-2 transition-all duration-150 cursor-pointer active:scale-95 ${
            menu === "upload"
              ? "bg-[#0F5139] text-white hover:bg-[#0A3D2A] active:bg-[#06291C]"
              : "text-[#0F5139] hover:bg-gray-100 active:bg-gray-200"
          }`}
        >
          Upload Kegiatan
        </button>

        <button
          onClick={() => setMenu("list")}
          className={`w-full text-left px-4 py-2 rounded-md transition-all duration-150 cursor-pointer active:scale-95 ${
            menu === "list"
              ? "bg-[#0F5139] text-white hover:bg-[#0A3D2A] active:bg-[#06291C]"
              : "text-[#0F5139] hover:bg-gray-100 active:bg-gray-200"
          }`}
        >
          Daftar Kegiatan
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
      </div>
    </div>
  )
}