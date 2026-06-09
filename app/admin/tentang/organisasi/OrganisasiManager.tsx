"use client"

import { useState, useEffect } from "react"
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core"
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
  arrayMove,
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import {
  SectionWithAnggota,
  AnggotaOrganisasi,
  fetchOrganisasi,
  createSection,
  updateSection,
  deleteSection,
  reorderSections,
  createAnggota,
  updateAnggota,
  deleteAnggota,
  reorderAnggota,
} from "./organisasi.service"

function SortableSectionCard({
  section,
  onRefresh,
  allSections,
}: {
  section: SectionWithAnggota
  onRefresh: () => void
  allSections: SectionWithAnggota[]
}) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: `section-${section.id}` })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  const [editingName, setEditingName] = useState(false)
  const [newName, setNewName] = useState(section.nama_section)
  const [showAddAnggota, setShowAddAnggota] = useState(false)
  const [anggotaList, setAnggotaList] = useState(section.anggota)

  const [formNama, setFormNama] = useState("")
  const [formJabatan, setFormJabatan] = useState("")
  const [formLinkedin, setFormLinkedin] = useState("")
  const [formFoto, setFormFoto] = useState<File | null>(null)
  const [editingAnggota, setEditingAnggota] =
    useState<AnggotaOrganisasi | null>(null)

  const sensors = useSensors(useSensor(PointerSensor))

  useEffect(() => {
    setAnggotaList(section.anggota)
  }, [section.anggota])

  const handleSaveSection = async () => {
    try {
      await updateSection(section.id, newName)
      setEditingName(false)
      onRefresh()
    } catch (err: any) {
      alert(err.message)
    }
  }

  const handleDeleteSection = async () => {
    if (!confirm(`Hapus section "${section.nama_section}" beserta semua anggotanya?`)) return
    try {
      await deleteSection(section.id)
      onRefresh()
    } catch (err: any) {
      alert(err.message)
    }
  }

  const resetForm = () => {
    setFormNama("")
    setFormJabatan("")
    setFormLinkedin("")
    setFormFoto(null)
    setEditingAnggota(null)
    setShowAddAnggota(false)
  }

  const handleSaveAnggota = async () => {
    if (!formNama || !formJabatan) return alert("Nama dan jabatan wajib diisi")
    if (!editingAnggota && !formFoto) return alert("Foto wajib diupload")

    try {
      if (editingAnggota) {
        await updateAnggota(
          editingAnggota.id,
          {
            nama: formNama,
            jabatan: formJabatan,
            linkedin_url: formLinkedin,
            section_id: editingAnggota.section_id,
          },
          formFoto,
          editingAnggota.foto_url
        )
        alert("Anggota berhasil diperbarui")
      } else {
        const urutan = anggotaList.length + 1
        await createAnggota(
          section.id,
          formNama,
          formJabatan,
          urutan,
          formLinkedin,
          formFoto!
        )
        alert("Anggota berhasil ditambahkan")
      }
      resetForm()
      onRefresh()
    } catch (err: any) {
      alert(err.message)
    }
  }

  const handleEditAnggota = (a: AnggotaOrganisasi) => {
    setEditingAnggota(a)
    setFormNama(a.nama)
    setFormJabatan(a.jabatan)
    setFormLinkedin(a.linkedin_url || "")
    setFormFoto(null)
    setShowAddAnggota(true)
  }

  const handleDeleteAnggota = async (a: AnggotaOrganisasi) => {
    if (!confirm(`Hapus ${a.nama}?`)) return
    try {
      await deleteAnggota(a.id, a.foto_url)
      onRefresh()
    } catch (err: any) {
      alert(err.message)
    }
  }

  const handleAnggotaDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event
    if (!over || active.id === over.id) return

    const oldIndex = anggotaList.findIndex(
      (a) => `anggota-${a.id}` === active.id
    )
    const newIndex = anggotaList.findIndex(
      (a) => `anggota-${a.id}` === over.id
    )

    const reordered = arrayMove(anggotaList, oldIndex, newIndex).map(
      (a: AnggotaOrganisasi, i: number) => ({ ...a, urutan: i + 1 })
    )
    setAnggotaList(reordered)

    try {
      await reorderAnggota(reordered.map((a: AnggotaOrganisasi) => ({ id: a.id, urutan: a.urutan })))
    } catch (err: any) {
      alert(err.message)
    }
  }

  const inputClass =
    "w-full rounded-xl border border-[#0F5139]/20 bg-white px-4 py-2 text-[#0F5139] outline-none text-sm focus:border-[#0F5139]"

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="rounded-2xl border border-[#0F5139]/20 bg-white shadow-sm mb-4"
    >
      <div className="flex items-center justify-between p-4 border-b border-[#0F5139]/10">
        <div className="flex items-center gap-3">
          <button
            {...attributes}
            {...listeners}
            className="cursor-grab text-gray-400 hover:text-gray-600 active:cursor-grabbing"
            title="Drag untuk reorder section"
          >
            ⠿
          </button>

          {editingName ? (
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className={inputClass}
              />
              <button
                onClick={handleSaveSection}
                className="text-xs bg-[#0F5139] text-white px-3 py-1.5 rounded-lg"
              >
                Simpan
              </button>
              <button
                onClick={() => setEditingName(false)}
                className="text-xs bg-gray-300 text-gray-700 px-3 py-1.5 rounded-lg"
              >
                Batal
              </button>
            </div>
          ) : (
            <h3 className="font-bold text-[#0F5139] text-lg">
              {section.nama_section}
            </h3>
          )}
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setEditingName(true)}
            className="text-xs bg-yellow-500 text-white px-3 py-1.5 rounded-lg hover:bg-yellow-600"
          >
            Edit Nama
          </button>
          <button
            onClick={handleDeleteSection}
            className="text-xs bg-red-600 text-white px-3 py-1.5 rounded-lg hover:bg-red-700"
          >
            Hapus Section
          </button>
        </div>
      </div>

      <div className="p-4">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleAnggotaDragEnd}
        >
          <SortableContext
            items={anggotaList.map((a) => `anggota-${a.id}`)}
            strategy={verticalListSortingStrategy}
          >
            {anggotaList.length === 0 ? (
              <p className="text-sm text-gray-400 mb-3">
                Belum ada anggota di section ini.
              </p>
            ) : (
              <div className="space-y-2 mb-4">
                {anggotaList.map((a) => (
                  <SortableAnggotaRow
                    key={a.id}
                    anggota={a}
                    onEdit={handleEditAnggota}
                    onDelete={handleDeleteAnggota}
                  />
                ))}
              </div>
            )}
          </SortableContext>
        </DndContext>

        {showAddAnggota ? (
          <div className="rounded-xl border border-[#0F5139]/10 bg-[#F8FAF8] p-4 space-y-3">
            <p className="text-sm font-semibold text-[#0F5139]">
              {editingAnggota ? "Edit Anggota" : "Tambah Anggota"}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-[#0F5139] mb-1 block">Nama</label>
                <input
                  type="text"
                  placeholder="Nama lengkap"
                  value={formNama}
                  onChange={(e) => setFormNama(e.target.value)}
                  className={inputClass}
                />
              </div>

              <div>
                <label className="text-xs text-[#0F5139] mb-1 block">Jabatan</label>
                <input
                  type="text"
                  placeholder="Nama jabatan"
                  value={formJabatan}
                  onChange={(e) => setFormJabatan(e.target.value)}
                  className={inputClass}
                />
              </div>

              <div>
                <label className="text-xs text-[#0F5139] mb-1 block">
                  LinkedIn URL (Opsional)
                </label>
                <input
                  type="text"
                  placeholder="https://linkedin.com/in/..."
                  value={formLinkedin}
                  onChange={(e) => setFormLinkedin(e.target.value)}
                  className={inputClass}
                />
              </div>

              <div>
                <label className="text-xs text-[#0F5139] mb-1 block">
                  Foto {editingAnggota ? "(kosongkan jika tidak diganti)" : ""}
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setFormFoto(e.target.files?.[0] || null)}
                  className="text-sm text-[#0F5139]"
                />

                <p className="mt-1 text-xs text-gray-500">
                  Disarankan menggunakan foto rasio 4:3
                  (contoh 1200 × 900 px atau 800 × 600 px).
                  Foto dengan rasio berbeda tetap dapat diunggah,
                  namun sebagian gambar mungkin terpotong pada halaman publik.
                </p>

                <div className="mt-3">
                  <p className="mb-2 text-xs font-medium text-[#0F5139]">
                    Preview rasio tampilan publik
                  </p>

                  <div className="aspect-[4/3] w-32 overflow-hidden rounded-lg border border-dashed border-gray-300 bg-gray-100" />
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={handleSaveAnggota}
                className="bg-[#0F5139] text-white text-sm px-4 py-2 rounded-lg hover:bg-[#0A3D2A]"
              >
                {editingAnggota ? "Simpan Perubahan" : "Tambah"}
              </button>
              <button
                onClick={resetForm}
                className="bg-gray-300 text-gray-700 text-sm px-4 py-2 rounded-lg hover:bg-gray-400"
              >
                Batal
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setShowAddAnggota(true)}
            className="text-sm bg-[#0F5139]/10 text-[#0F5139] px-4 py-2 rounded-lg hover:bg-[#0F5139]/20 transition"
          >
            + Tambah Anggota
          </button>
        )}
      </div>
    </div>
  )
}

function SortableAnggotaRow({
  anggota,
  onEdit,
  onDelete,
}: {
  anggota: AnggotaOrganisasi
  onEdit: (a: AnggotaOrganisasi) => void
  onDelete: (a: AnggotaOrganisasi) => void
}) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: `anggota-${anggota.id}` })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center gap-3 bg-white border border-gray-100 rounded-xl px-3 py-2"
    >
      <button
        {...attributes}
        {...listeners}
        className="cursor-grab text-gray-300 hover:text-gray-500 active:cursor-grabbing text-lg"
      >
        ⠿
      </button>

      {anggota.foto_url && (
        <img
          src={anggota.foto_url}
          alt={anggota.nama}
          className="w-9 h-9 rounded-full object-cover shrink-0"
        />
      )}

      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-[#0F5139] truncate">
          {anggota.nama}
        </p>
        <p className="text-xs text-gray-500 truncate">{anggota.jabatan}</p>
      </div>

      {anggota.linkedin_url && (
        <a
          href={anggota.linkedin_url}
          target="_blank"
          rel="noreferrer"
          className="text-xs text-blue-500 hover:underline shrink-0"
        >
          LinkedIn
        </a>
      )}

      <div className="flex gap-1 shrink-0">
        <button
          onClick={() => onEdit(anggota)}
          className="text-xs bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600"
        >
          Edit
        </button>
        <button
          onClick={() => onDelete(anggota)}
          className="text-xs bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700"
        >
          Hapus
        </button>
      </div>
    </div>
  )
}

export default function OrganisasiManager() {
  const [sections, setSections] = useState<SectionWithAnggota[]>([])
  const [loading, setLoading] = useState(true)
  const [showAddSection, setShowAddSection] = useState(false)
  const [newSectionName, setNewSectionName] = useState("")
  const [newSectionUrutan, setNewSectionUrutan] = useState<string>("")

  const sensors = useSensors(useSensor(PointerSensor))

  const load = async () => {
    try {
      const data = await fetchOrganisasi()
      setSections(data)
    } catch (err: any) {
      alert(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  const handleAddSection = async () => {
    if (!newSectionName) return alert("Nama section wajib diisi")
    const maxUrutan = sections.length > 0
      ? Math.max(...sections.map((s) => s.urutan))
      : 0
    const urutan = newSectionUrutan
      ? Number(newSectionUrutan)
      : maxUrutan + 1

    try {
      await createSection(newSectionName, urutan)
      setNewSectionName("")
      setNewSectionUrutan("")
      setShowAddSection(false)
      load()
    } catch (err: any) {
      alert(err.message)
    }
  }

  const handleSectionDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event
    if (!over || active.id === over.id) return

    const oldIndex = sections.findIndex(
      (s) => `section-${s.id}` === active.id
    )
    const newIndex = sections.findIndex(
      (s) => `section-${s.id}` === over.id
    )

    const reordered = arrayMove(sections, oldIndex, newIndex).map(
      (s: SectionWithAnggota, i: number) => ({ ...s, urutan: i + 1 })
    )
    setSections(reordered)

    try {
      await reorderSections(
        reordered.map((s: SectionWithAnggota) => ({ id: s.id, urutan: s.urutan }))
      )
    } catch (err: any) {
      alert(err.message)
    }
  }

  if (loading) return <p className="text-gray-400">Memuat struktur organisasi...</p>

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-semibold text-[#0F5139]">
          Struktur Organisasi
        </h1>
        <button
          onClick={() => setShowAddSection(true)}
          className="bg-[#0F5139] text-white text-sm px-4 py-2 rounded-xl hover:bg-[#0A3D2A] active:scale-95 transition"
        >
          + Tambah Section
        </button>
      </div>

      {/* Form tambah section */}
      {showAddSection && (
        <div className="rounded-2xl border border-[#0F5139]/20 bg-white p-4 mb-4 space-y-3">
          <p className="text-sm font-semibold text-[#0F5139]">Section Baru</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-[#0F5139] mb-1 block">
                Nama Section
              </label>
              <input
                type="text"
                placeholder="Contoh: Board of Trustees"
                value={newSectionName}
                onChange={(e) => setNewSectionName(e.target.value)}
                className="w-full rounded-xl border border-[#0F5139]/20 px-4 py-2 text-sm text-[#0F5139] outline-none focus:border-[#0F5139]"
              />
            </div>

            <div>
              <label className="text-xs text-[#0F5139] mb-1 block">
                Posisi (urutan ke-) — kosongkan untuk di akhir
              </label>
              <input
                type="number"
                min="1"
                placeholder={`Contoh: 2 (dari ${sections.length + 1} section)`}
                value={newSectionUrutan}
                onChange={(e) => setNewSectionUrutan(e.target.value)}
                className="w-full rounded-xl border border-[#0F5139]/20 px-4 py-2 text-sm text-[#0F5139] outline-none focus:border-[#0F5139]"
              />
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleAddSection}
              className="bg-[#0F5139] text-white text-sm px-4 py-2 rounded-lg hover:bg-[#0A3D2A]"
            >
              Simpan Section
            </button>
            <button
              onClick={() => setShowAddSection(false)}
              className="bg-gray-300 text-gray-700 text-sm px-4 py-2 rounded-lg"
            >
              Batal
            </button>
          </div>
        </div>
      )}

      {sections.length === 0 ? (
        <p className="text-gray-400 text-sm">Belum ada section organisasi.</p>
      ) : (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleSectionDragEnd}
        >
          <SortableContext
            items={sections.map((s) => `section-${s.id}`)}
            strategy={verticalListSortingStrategy}
          >
            {sections.map((section) => (
              <SortableSectionCard
                key={section.id}
                section={section}
                onRefresh={load}
                allSections={sections}
              />
            ))}
          </SortableContext>
        </DndContext>
      )}
    </div>
  )
}