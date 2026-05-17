"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { supabase } from "@/lib/supabase"

type Artikel = {
  id: number
  judul: string
  deskripsi_singkat: string
  kategori: string | null
  penulis: string | null
  tanggal_publikasi: string | null
  sections: unknown[] | null
  is_draft: boolean | null
  updated_at: string | null
  created_at: string | null
  image_url: string | null
}

export default function ArticlesPage() {
  const [articles, setArticles] = useState<Artikel[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState("Semua")
  const [search, setSearch] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const articlesPerPage = 7

  const fetchArticles = async () => {
    setLoading(true)

    const { data, error } = await supabase
      .from("artikel")
      .select("id, judul, deskripsi_singkat, kategori, penulis, tanggal_publikasi, sections, is_draft, updated_at, created_at, image_url")
      .eq("is_draft", false)
      .order("id", { ascending: false })

    if (error) {
      console.error(error.message)
      setLoading(false)
      return
    }

    setArticles((data || []) as Artikel[])
    setLoading(false)
  }

  useEffect(() => {
    fetchArticles()
  }, [])

  const filteredArticles = useMemo(() => {
    return articles.filter((item) => {
      const category = item.kategori || "Berita Komunitas"

      const matchCategory =
        selectedCategory === "Semua" || category === selectedCategory

      const matchSearch =
        item.judul?.toLowerCase().includes(search.toLowerCase()) ||
        item.deskripsi_singkat?.toLowerCase().includes(search.toLowerCase())

      return matchCategory && matchSearch
    })
  }, [articles, selectedCategory, search])

  const totalPages = Math.max(1, Math.ceil(filteredArticles.length / articlesPerPage))

  const currentArticles = useMemo(() => {
    const startIndex = (currentPage - 1) * articlesPerPage
    const endIndex = startIndex + articlesPerPage

    return filteredArticles.slice(startIndex, endIndex)
  }, [filteredArticles, currentPage])

  useEffect(() => {
    setCurrentPage(1)
  }, [selectedCategory, search])

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages)
    }
  }, [currentPage, totalPages])

  const featuredArticle = currentArticles[0]
  const otherArticles = currentArticles.slice(1)

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

  const formatDate = (date?: string | null) => {
    if (!date) return "Tanggal tidak tersedia"

    return new Date(date).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    })
  }

  return (
    <main className="min-h-screen bg-[#F7F6EF] px-4 py-10 text-[#113522] sm:px-6 lg:px-10">
      <div className="mx-auto flex w-full max-w-7xl flex-col">
        {/* SEARCH */}
        <div className="mb-8 flex justify-center">
          <div className="flex w-full max-w-md items-center justify-between rounded-full border border-emerald-950 bg-stone-50 px-6 py-2 text-emerald-900">
            <input
              type="text"
              placeholder="Cari artikel..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-transparent text-sm text-emerald-900 outline-none"
            />

            <svg
              className="h-4 w-4 shrink-0 text-emerald-900"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>

        {/* FEATURED ARTICLE */}
        {!loading && featuredArticle && (
          <div className="mb-12 grid grid-cols-1 items-center gap-8 lg:grid-cols-2">
            <Link
              href={`/articles/${featuredArticle.id}`}
              className="block overflow-hidden rounded-3xl bg-gray-400 shadow-xl transition hover:-translate-y-1 hover:shadow-lg"
            >
              {featuredArticle.image_url ? (
                <img
                  src={featuredArticle.image_url}
                  alt={featuredArticle.judul}
                  className="h-64 w-full object-cover lg:h-80"
                />
              ) : (
                <div className="flex h-64 items-center justify-center lg:h-80">
                  <span className="text-5xl">🌿</span>
                </div>
              )}
            </Link>

            <div>
              <div className="mb-4 inline-block">
                <span className="rounded-full border border-emerald-950 bg-stone-50 px-3 py-1 text-xs text-emerald-900">
                  {featuredArticle.kategori || "Berita Komunitas"}
                </span>
              </div>

              <h2 className="mb-4 text-2xl font-bold leading-tight text-emerald-900 lg:text-3xl">
                {featuredArticle.judul}
              </h2>

              <p className="mb-6 text-sm leading-7 text-emerald-900">
                {featuredArticle.deskripsi_singkat}
              </p>

              <div className="flex items-center justify-between gap-4">
                <div className="text-emerald-900">
                  <p className="font-semibold">
                    {featuredArticle.penulis || "Admin Forest Lestari"}
                  </p>

                  <p className="text-xs">
                    {formatDate(featuredArticle.tanggal_publikasi || featuredArticle.created_at)}
                  </p>
                </div>

                <Link
                  href={`/articles/${featuredArticle.id}`}
                  className="flex items-center gap-2 text-sm font-medium text-emerald-900 hover:text-emerald-700"
                >
                  Read More <span>→</span>
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* FILTER */}
        <div className="mb-10 flex flex-wrap gap-3">
          {[
            "Semua",
            "Isu Lingkungan",
            "Edukasi dan Tips",
            "Berita Komunitas",
          ].map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`cursor-pointer rounded-full border px-4 py-2 text-sm transition-colors ${
                selectedCategory === category
                  ? "border-emerald-900 bg-emerald-900 text-white"
                  : "border-emerald-950 bg-stone-50 text-emerald-900 hover:bg-emerald-50"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* LOADING */}
        {loading && (
          <div className="py-20 text-center text-emerald-900">
            Loading artikel...
          </div>
        )}

        {/* EMPTY */}
        {!loading && filteredArticles.length === 0 && (
          <div className="py-20 text-center text-emerald-900">
            Artikel tidak ditemukan.
          </div>
        )}

        {/* ARTICLES GRID */}
        {!loading && currentArticles.length > 0 && (
          <>
            <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
              {otherArticles.slice(0, 4).map((item) => (
                <Link
                  key={item.id}
                  href={`/articles/${item.id}`}
                  className="group overflow-hidden rounded-3xl bg-emerald-900/50 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
                >
                  <div className="h-40 w-full overflow-hidden bg-gray-300 transition group-hover:bg-gray-200">
                    {item.image_url ? (
                      <img
                        src={item.image_url}
                        alt={item.judul}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center">
                        <span className="text-4xl">🌿</span>
                      </div>
                    )}
                  </div>

                  <div className="flex min-h-64 flex-col p-5">
                    <div className="mb-2 flex items-center justify-between">
                      <span className="rounded-full bg-stone-50 px-2 py-1 text-xs text-emerald-900">
                        {formatDate(item.tanggal_publikasi || item.created_at)}
                      </span>
                    </div>

                    <h3 className="mb-2 line-clamp-2 text-lg font-bold leading-tight text-emerald-900">
                      {item.judul}
                    </h3>

                    <p className="mb-3 line-clamp-3 flex-1 text-xs leading-6 text-white">
                      {item.deskripsi_singkat}
                    </p>

                    <div className="flex items-center justify-between gap-3 text-xs text-white">
                      <span>👤 {item.penulis || "Admin"}</span>

                      <Link
                        href={`/articles/${item.id}`}
                        className="flex items-center gap-2 hover:underline"
                      >
                        Read More <span>→</span>
                      </Link>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {/* LARGE ARTICLES */}
            <div className="mb-12 grid grid-cols-1 gap-6 md:grid-cols-2">
              {otherArticles.slice(4, 6).map((item) => (
                <Link
                  key={item.id}
                  href={`/articles/${item.id}`}
                  className="group flex min-h-80 overflow-hidden rounded-3xl bg-emerald-900/50 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
                >
                  <div className="w-1/2 shrink-0 bg-gray-300 transition group-hover:bg-gray-200">
                    {item.image_url && (
                      <img
                        src={item.image_url}
                        alt={item.judul}
                        className="h-full w-full object-cover"
                      />
                    )}
                  </div>

                  <div className="flex w-1/2 flex-col justify-center p-6">
                    <div className="mb-3 flex items-center justify-between">
                      <span className="rounded-full bg-stone-50 px-2 py-1 text-xs text-emerald-900">
                        {formatDate(item.tanggal_publikasi || item.created_at)}
                      </span>
                    </div>

                    <h3 className="mb-3 text-xl font-bold leading-tight text-emerald-900">
                      {item.judul}
                    </h3>

                    <p className="mb-4 line-clamp-4 flex-1 text-sm leading-7 text-white">
                      {item.deskripsi_singkat}
                    </p>

                    <div className="flex items-center justify-between gap-3 text-xs text-white">
                      <span>👤 {item.penulis || "Admin"}</span>

                      <Link
                        href={`/articles/${item.id}`}
                        className="flex items-center gap-2 hover:underline"
                      >
                        Read More <span>→</span>
                      </Link>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </>
        )}

        {/* PAGINATION */}
        {!loading && filteredArticles.length > 0 && (
          <div className="mb-12 flex justify-center">
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
                  onClick={() => goToPage(Math.min(totalPages, currentPage + 1))}
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
    </main>
  )
}
