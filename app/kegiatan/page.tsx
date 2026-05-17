"use client"

import { useEffect, useMemo, useState } from "react"

type Activity = {
  id: number
  category: string
  title: string
  location: string
  participants: string
  seed?: string
  date: string
  description?: string
}

const categories = ["Semua", "Penanaman", "Survei", "Bersih Lingkungan", "Edukasi"]

const locations = ["Semua Wilayah", "Kota Bogor", "Kabupaten Bogor", "Jakarta", "Depok"]

const sortOptions = ["Terbaru", "Terlama", "Peserta Terbanyak"]

const activities: Activity[] = [
  {
    id: 1,
    category: "Penanaman",
    title: "Penanaman Pohon DAS Cisadane",
    location: "Bogor Barat",
    participants: "42 Peserta",
    seed: "200 bibit",
    date: "26 Mei 2025",
    description:
      "Kegiatan penanaman 200 bibit pohon endemik di tepi DAS Cisadane wilayah Bogor bagian barat bersama komunitas dan instansi terkait.",
  },
  {
    id: 2,
    category: "Survei",
    title: "Survei Habitat Elang Jawa",
    location: "Kabupaten Bogor",
    participants: "18 Peserta",
    date: "18 April 2025",
  },
  {
    id: 3,
    category: "Edukasi",
    title: "Workshop Ecoprint",
    location: "Kota Sukabumi",
    participants: "30 Peserta",
    date: "7 Januari 2025",
  },
  {
    id: 4,
    category: "Survei",
    title: "Survei Habitat Elang Jawa",
    location: "Kabupaten Bogor",
    participants: "18 Peserta",
    date: "18 April 2025",
  },
  {
    id: 5,
    category: "Survei",
    title: "Survei Habitat Elang Jawa",
    location: "Kabupaten Bogor",
    participants: "18 Peserta",
    date: "18 April 2025",
  },
  {
    id: 6,
    category: "Penanaman",
    title: "Penanaman Pohon Hutan Kota",
    location: "Kota Bogor",
    participants: "25 Peserta",
    seed: "100 bibit",
    date: "12 Juni 2025",
    description:
      "Kegiatan penanaman pohon di kawasan hutan kota bersama relawan komunitas.",
  },
  {
    id: 7,
    category: "Bersih Lingkungan",
    title: "Bersih Sampah Sungai Ciliwung",
    location: "Jakarta",
    participants: "35 Peserta",
    date: "9 Mei 2025",
  },
  {
    id: 8,
    category: "Edukasi",
    title: "Edukasi Daur Ulang Sampah",
    location: "Depok",
    participants: "40 Peserta",
    date: "20 Mei 2025",
  },
]

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
      <div className="h-24 bg-zinc-300 transition group-hover:bg-gray-200" />

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
  const [selectedCategory, setSelectedCategory] = useState("Semua")
  const [selectedLocation, setSelectedLocation] = useState("Semua Wilayah")
  const [selectedSort, setSelectedSort] = useState("Terbaru")
  const [currentPage, setCurrentPage] = useState(1)

  const loading = false
  const activitiesPerPage = 5

  const filteredActivities = useMemo(() => {
    let result = activities.filter((activity) => {
      const matchCategory =
        selectedCategory === "Semua" || activity.category === selectedCategory

      const matchLocation =
        selectedLocation === "Semua Wilayah" ||
        activity.location.includes(selectedLocation)

      return matchCategory && matchLocation
    })

    if (selectedSort === "Terlama") {
      result = [...result].reverse()
    }

    return result
  }, [selectedCategory, selectedLocation, selectedSort])

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
  }, [selectedCategory, selectedLocation, selectedSort])

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
        <div className="mb-10 border border-black/10" />

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

          <button className="w-fit rounded-[10px] border border-emerald-950 bg-stone-50 px-5 py-2 text-base text-emerald-900 transition hover:bg-emerald-50 active:scale-95">
            Tahun: 2025
          </button>
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

            {featuredActivity && (
              <article className="group mb-8 grid overflow-hidden rounded-3xl bg-gray-400 shadow-sm transition hover:-translate-y-1 hover:shadow-lg lg:grid-cols-[42%_1fr]">
                <div className="min-h-72 bg-zinc-300 transition group-hover:bg-gray-200 lg:min-h-80" />

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

            <div className="grid gap-8 md:grid-cols-2">
              {otherActivities.map((activity) => (
                <ActivityCard key={activity.id} activity={activity} />
              ))}
            </div>

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