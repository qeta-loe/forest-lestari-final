"use client"

import { useEffect, useMemo, useState } from "react"
import { supabase } from "@/lib/supabase"

type TargetKegiatan = {
  nama_target: string
  isi_target: string
}

type Activity = {
  id: number
  category: string
  title: string
  location: string
  participants: string
  seed?: string
  date: string
  description?: string
  thumbnail_url?: string | null
  rawLocation?: string
  year?: string
}

type KegiatanRow = {
  id: number
  nama_kegiatan: string
  alamat: string | null
  kabupaten_kota: string | null
  provinsi: string | null
  tanggal_mulai: string | null
  jam_mulai: string | null
  jam_selesai: string | null
  kategori: string | null
  status_kegiatan: string | null
  deskripsi_kegiatan: string | null
  tujuan_kegiatan: string | null
  link_pendaftaran: string | null
  targets: TargetKegiatan[] | null
  hasil_kegiatan: string | null
  press_release: string | null
  is_draft: boolean | null
  updated_at: string | null
  thumbnail_url: string | null
  draft_status: string | null
  slug: string | null
}

const categories = [
  "Semua",
  "Penanaman",
  "Survei",
  "Bersih Lingkungan",
  "Edukasi",
]

const locations = [
  "Semua Wilayah",
  "Kota Bogor",
  "Kabupaten Bogor",
  "Jakarta",
  "Depok",
]

const sortOptions = ["Terbaru", "Terlama", "Peserta Terbanyak"]

function formatDate(date?: string | null) {
  if (!date) return "Tanggal belum tersedia"

  return new Date(date).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  })
}

function getYear(date?: string | null) {
  if (!date) return ""

  return String(new Date(date).getFullYear())
}

function getParticipantsText(targets: TargetKegiatan[] | null) {
  if (!targets || targets.length === 0) return "0 Target"

  return `${targets.length} Target`
}

function getSeedText(targets: TargetKegiatan[] | null) {
  if (!targets || targets.length === 0) return undefined

  const bibitTarget = targets.find((target) =>
    `${target.nama_target} ${target.isi_target}`.toLowerCase().includes("bibit")
  )

  return bibitTarget?.isi_target
}

function mapKegiatanToActivity(item: KegiatanRow): Activity {
  const location = [item.kabupaten_kota, item.provinsi]
    .filter(Boolean)
    .join(", ")

  return {
    id: item.id,
    category: item.kategori || "Tanpa Kategori",
    title: item.nama_kegiatan,
    location: location || "-",
    rawLocation: item.kabupaten_kota || "",
    participants: getParticipantsText(item.targets),
    seed: getSeedText(item.targets),
    date: formatDate(item.tanggal_mulai),
    year: getYear(item.tanggal_mulai),
    description:
      item.status_kegiatan === "completed"
        ? item.hasil_kegiatan ||
          item.deskripsi_kegiatan ||
          "Dokumentasi kegiatan komunitas dalam pelestarian lingkungan."
        : item.deskripsi_kegiatan ||
          item.tujuan_kegiatan ||
          "Dokumentasi kegiatan komunitas dalam pelestarian lingkungan.",
    thumbnail_url: item.thumbnail_url,
  }
}

function FilterItem({
  label,
  active,
  onClick,
}: {
  label: string
  active: boolean
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className="flex cursor-pointer items-center gap-3 text-base text-emerald-900"
    >
      <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-gray-600 p-px">
        <span
          className={`h-full w-full rounded-lg ${
            active ? "bg-emerald-900" : "bg-white"
          }`}
        />
      </span>
      <span>{label}</span>
    </button>
  )
}

function ActivityCard({ activity }: { activity: Activity }) {
  return (
    <article className="group overflow-hidden rounded-3xl bg-gray-400 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
      <div className="h-24 bg-zinc-300 transition group-hover:bg-gray-200">
        {activity.thumbnail_url && (
          <img
            src={activity.thumbnail_url}
            alt={activity.title}
            className="h-full w-full object-cover"
          />
        )}
      </div>

      <div className="flex min-h-40 flex-col justify-end p-7">
        <span className="mb-3 w-fit rounded-full border border-emerald-950 bg-stone-50 px-4 py-2 text-xs text-emerald-900">
          {activity.category}
        </span>

        <h3 className="text-xl font-bold leading-tight text-emerald-900">
          {activity.title}
        </h3>

        <p className="mt-4 text-center text-xs text-white sm:text-left">
          {activity.location} · {activity.participants} · {activity.date}
        </p>
      </div>
    </article>
  )
}

export default function KegiatanPage() {
  const [activities, setActivities] = useState<Activity[]>([])
  const [loading, setLoading] = useState(true)

  const [selectedCategory, setSelectedCategory] = useState("Semua")
  const [selectedLocation, setSelectedLocation] = useState("Semua Wilayah")
  const [selectedSort, setSelectedSort] = useState("Terbaru")
  const [selectedYear, setSelectedYear] = useState("Semua Tahun")
  const [isYearDropdownOpen, setIsYearDropdownOpen] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)

  const activitiesPerPage = 5

  const fetchActivities = async () => {
    setLoading(true)

    const { data, error } = await supabase
      .from("kegiatan")
      .select(
        "id, nama_kegiatan, alamat, kabupaten_kota, provinsi, tanggal_mulai, jam_mulai, jam_selesai, kategori, status_kegiatan, deskripsi_kegiatan, tujuan_kegiatan, link_pendaftaran, targets, hasil_kegiatan, press_release, is_draft, updated_at, thumbnail_url, draft_status, slug"
      )
      .eq("is_draft", false)
      .order("tanggal_mulai", { ascending: false, nullsFirst: false })
      .order("updated_at", { ascending: false })

    if (error) {
      console.error(error.message)
      setLoading(false)
      return
    }

    const mappedActivities = ((data || []) as KegiatanRow[]).map(
      mapKegiatanToActivity
    )

    setActivities(mappedActivities)
    setLoading(false)
  }

  useEffect(() => {
    fetchActivities()
  }, [])

  const availableYears = useMemo(() => {
    const years = activities
      .map((activity) => activity.year)
      .filter((year): year is string => Boolean(year))

    return Array.from(new Set(years)).sort(
      (a, b) => Number(b) - Number(a)
    )
  }, [activities])

  useEffect(() => {
    if (
      selectedYear !== "Semua Tahun" &&
      !availableYears.includes(selectedYear)
    ) {
      setSelectedYear("Semua Tahun")
    }
  }, [availableYears, selectedYear])

  const filteredActivities = useMemo(() => {
    let result = activities.filter((activity) => {
      const matchCategory =
        selectedCategory === "Semua" || activity.category === selectedCategory

      const matchLocation =
        selectedLocation === "Semua Wilayah" ||
        activity.location.includes(selectedLocation) ||
        activity.rawLocation?.includes(selectedLocation)

      const matchYear =
        selectedYear === "Semua Tahun" || activity.year === selectedYear

      return matchCategory && matchLocation && matchYear
    })

    if (selectedSort === "Terlama") {
      result = [...result].reverse()
    }

    if (selectedSort === "Peserta Terbanyak") {
      result = [...result].sort((a, b) => {
        const totalA = Number(a.participants.replace(/\D/g, "")) || 0
        const totalB = Number(b.participants.replace(/\D/g, "")) || 0

        return totalB - totalA
      })
    }

    return result
  }, [
    activities,
    selectedCategory,
    selectedLocation,
    selectedSort,
    selectedYear,
  ])

  const totalPages = Math.max(
    1,
    Math.ceil(filteredActivities.length / activitiesPerPage)
  )

  const currentActivities = useMemo(() => {
    const startIndex = (currentPage - 1) * activitiesPerPage
    const endIndex = startIndex + activitiesPerPage

    return filteredActivities.slice(startIndex, endIndex)
  }, [filteredActivities, currentPage])

  useEffect(() => {
    setCurrentPage(1)
  }, [selectedCategory, selectedLocation, selectedSort, selectedYear])

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages)
    }
  }, [currentPage, totalPages])

  const featuredActivity = currentActivities[0]
  const otherActivities = currentActivities.slice(1)

  const goToPage = (page: number) => {
    setCurrentPage(page)

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    })
  }

  const visiblePages = useMemo(() => {
    if (totalPages <= 3) {
      return Array.from({ length: totalPages }, (_, index) => index + 1)
    }

    if (currentPage === 1) {
      return [1, 2, 3]
    }

    if (currentPage === totalPages) {
      return [totalPages - 2, totalPages - 1, totalPages]
    }

    return [currentPage - 1, currentPage, currentPage + 1]
  }, [currentPage, totalPages])

  return (
    <main className="min-h-screen bg-[#F7F6EF] px-4 py-10 text-[#113522] sm:px-6 lg:px-10">
      <div className="mx-auto w-full max-w-7xl">
        {/* Header */}
        <section className="mb-10 space-y-3">
          <h1 className="text-3xl font-bold text-emerald-900 sm:text-4xl">
            Kegiatan Komunitas
          </h1>

          <p className="max-w-3xl text-base text-emerald-900 sm:text-xl">
            Rekam Jejak Seluruh Kegiatan Pelestarian Lingkungan yang Telah Dilakukan
          </p>
        </section>

        {/* Category filter */}
        <section className="mb-10 flex flex-col gap-5 border-b border-black/10 pb-10 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap gap-3">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`rounded-full border px-5 py-2 text-base transition active:scale-95 ${
                  selectedCategory === category
                    ? "border-emerald-950 bg-emerald-900 text-white"
                    : "border-emerald-950 bg-stone-50 text-emerald-900 hover:bg-emerald-50"
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          <div className="relative w-fit">
          <button
            type="button"
            onClick={() => setIsYearDropdownOpen((prev) => !prev)}
            className="flex items-center gap-2 rounded-[10px] border border-emerald-950 bg-stone-50 px-5 py-2 text-base text-emerald-900 transition hover:bg-emerald-50 active:scale-95"
          >
            <span>
              Tahun: {selectedYear === "Semua Tahun" ? "Semua" : selectedYear}
            </span>

            <span
              className={`text-lg leading-none transition-transform ${
                isYearDropdownOpen ? "rotate-90" : ""
              }`}
            >
              ›
            </span>
          </button>

            {isYearDropdownOpen && (
              <div className="absolute right-0 z-20 mt-2 w-44 overflow-hidden rounded-xl border border-emerald-950 bg-stone-50 shadow-lg">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedYear("Semua Tahun")
                    setIsYearDropdownOpen(false)
                  }}
                  className={`block w-full px-4 py-3 text-left text-sm transition hover:bg-emerald-50 ${
                    selectedYear === "Semua Tahun"
                      ? "text-emerald-900"
                      : "text-emerald-900/50"
                  }`}
                >
                  Semua Tahun
                </button>

                {availableYears.map((year) => (
                  <button
                    key={year}
                    type="button"
                    onClick={() => {
                      setSelectedYear(year)
                      setIsYearDropdownOpen(false)
                    }}
                    className={`block w-full px-4 py-3 text-left text-sm transition hover:bg-emerald-50 ${
                      selectedYear === year
                        ? "bg-emerald-900 text-white"
                        : "text-emerald-900"
                    }`}
                  >
                    {year}
                  </button>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Content */}
        <section className="grid gap-10 lg:grid-cols-[260px_1fr]">
          {/* Sidebar filter */}
          <aside className="space-y-10 lg:border-r lg:border-black/10 lg:pr-8">
            <div>
              <h2 className="mb-5 text-xl text-emerald-900">Lokasi</h2>

              <div className="space-y-4">
                {locations.map((location) => (
                  <FilterItem
                    key={location}
                    label={location}
                    active={selectedLocation === location}
                    onClick={() => setSelectedLocation(location)}
                  />
                ))}
              </div>
            </div>

            <div>
              <h2 className="mb-5 text-xl text-emerald-900">Urutkan</h2>

              <div className="space-y-4">
                {sortOptions.map((option) => (
                  <FilterItem
                    key={option}
                    label={option}
                    active={selectedSort === option}
                    onClick={() => setSelectedSort(option)}
                  />
                ))}
              </div>
            </div>
          </aside>

          {/* Cards */}
          <div>
            <p className="mb-8 text-base text-emerald-900">
              Menampilkan {filteredActivities.length} kegiatan
            </p>

            {loading && (
              <div className="py-20 text-center text-emerald-900">
                Memuat kegiatan...
              </div>
            )}

            {!loading && filteredActivities.length === 0 && (
              <div className="py-20 text-center text-emerald-900">
                Belum ada kegiatan.
              </div>
            )}

            {!loading && featuredActivity && (
              <article className="group mb-8 grid overflow-hidden rounded-3xl bg-emerald-900/50 shadow-sm transition hover:-translate-y-1 hover:shadow-lg lg:grid-cols-[42%_1fr]">
                <div className="min-h-72 bg-zinc-300 transition group-hover:bg-gray-200 lg:min-h-80">
                  {featuredActivity.thumbnail_url && (
                    <img
                      src={featuredActivity.thumbnail_url}
                      alt={featuredActivity.title}
                      className="h-full w-full object-cover"
                    />
                  )}
                </div>

                <div className="flex min-h-80 flex-col justify-center p-7">
                  <div className="mb-4 flex flex-wrap items-center gap-3">
                    <span className="w-fit rounded-full border border-emerald-950 bg-stone-50 px-5 py-2 text-base text-emerald-900">
                      {featuredActivity.category}
                    </span>

                    <span className="ml-auto text-xs text-white">
                      {featuredActivity.date}
                    </span>
                  </div>

                  <h2 className="text-2xl font-bold leading-tight text-emerald-900">
                    {featuredActivity.title}
                  </h2>

                  <p className="mt-4 max-w-xl text-base leading-relaxed text-white">
                    {featuredActivity.description ||
                      "Dokumentasi kegiatan komunitas dalam pelestarian lingkungan."}
                  </p>

                  <div className="mt-5 flex flex-wrap gap-4 text-xs text-white">
                    <span>📍 {featuredActivity.location}</span>
                    <span>👥 {featuredActivity.participants}</span>
                    {featuredActivity.seed && <span>🌱 {featuredActivity.seed}</span>}
                  </div>

                  <div className="mt-5 flex flex-wrap gap-3">
                    <button className="rounded-[10px] border border-emerald-950 bg-stone-50 px-4 py-2 text-xs text-emerald-900 transition hover:bg-emerald-50 active:scale-95">
                      Lihat Laporan
                    </button>

                    <button className="rounded-[10px] border border-emerald-950 bg-stone-50 px-4 py-2 text-xs text-emerald-900 transition hover:bg-emerald-50 active:scale-95">
                      Unduh Dokumentasi
                    </button>
                  </div>
                </div>
              </article>
            )}

            {!loading && (
              <div className="grid gap-8 md:grid-cols-2">
                {otherActivities.map((activity) => (
                  <ActivityCard key={activity.id} activity={activity} />
                ))}
              </div>
            )}

            {/* PAGINATION */}
            {!loading && filteredActivities.length > 0 && (
              <div className="mb-12 mt-16 flex justify-center">
                <div className="flex items-center justify-center gap-2">
                  {totalPages > 3 && (
                    <button
                      onClick={() => goToPage(Math.max(1, currentPage - 1))}
                      disabled={currentPage === 1}
                      className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-900 text-sm font-bold text-stone-50 transition hover:bg-emerald-950 active:scale-95 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      ‹
                    </button>
                  )}

                  <div className="flex max-w-[140px] items-center justify-center gap-2 overflow-hidden">
                    {visiblePages.map((page) => (
                      <button
                        key={page}
                        onClick={() => goToPage(page)}
                        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-bold transition active:scale-95 ${
                          currentPage === page
                            ? "bg-emerald-950 text-stone-50"
                            : "bg-emerald-900 text-stone-50 hover:bg-emerald-950"
                        }`}
                      >
                        {page}
                      </button>
                    ))}
                  </div>

                  {totalPages > 3 && (
                    <button
                      onClick={() =>
                        goToPage(Math.min(totalPages, currentPage + 1))
                      }
                      disabled={currentPage === totalPages}
                      className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-900 text-sm font-bold text-stone-50 transition hover:bg-emerald-950 active:scale-95 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      ›
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  )
}