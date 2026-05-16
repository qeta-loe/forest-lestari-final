"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { supabase } from "@/lib/supabase"

export default function ArticlesPage() {
  const [articles, setArticles] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const [selectedCategory, setSelectedCategory] = useState("Semua")
  const [search, setSearch] = useState("")

  const fetchArticles = async () => {
  setLoading(true)

  const { data, error } = await supabase
    .from("artikel")
    .select("*")

  console.log("DATA:", data)
  console.log("ERROR:", error)

  if (error) {
    console.log(error.message)
    setLoading(false)
    return
  }

  setArticles(data || [])
  setLoading(false)
}

  useEffect(() => {
    fetchArticles()
  }, [])

  const filteredArticles = useMemo(() => {
    return articles.filter((item) => {
      const matchCategory =
        selectedCategory === "Semua" ||
        item.category === selectedCategory

      const matchSearch =
        item.title?.toLowerCase().includes(search.toLowerCase()) ||
        item.overview?.toLowerCase().includes(search.toLowerCase())

      return matchCategory && matchSearch
    })
  }, [articles, selectedCategory, search])

  const featuredArticle = filteredArticles[0]
  const otherArticles = filteredArticles.slice(1)

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    })
  }

  console.log("ARTICLES:", articles)
  console.log("FILTERED:", filteredArticles)
  console.log("DATA DATABASE:", articles)

  return (
    <main className="min-h-screen bg-[#F7F6EF] px-4 py-10 text-[#113522] sm:px-6 lg:px-10">

      {/* SEARCH */}
      <div className="mb-8 flex justify-end">
        <div className="flex items-center gap-2 rounded-full border border-emerald-950 bg-stone-50 px-4 py-2">
          <input
            type="text"
            placeholder="Cari artikel..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-transparent text-sm text-emerald-900 outline-none"
          />

          <svg
            className="h-4 w-4 text-emerald-900"
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

          <div className="overflow-hidden rounded-3xl bg-emerald-100">
            {featuredArticle.image_url ? (
              <img
                src={featuredArticle.image_url}
                alt={featuredArticle.title}
                className="h-64 w-full object-cover lg:h-80"
              />
            ) : (
              <div className="flex h-64 items-center justify-center lg:h-80">
                <span className="text-5xl">🌿</span>
              </div>
            )}
          </div>

          <div>
            <div className="mb-4 inline-block">
              <span className="rounded-full border border-emerald-950 bg-stone-50 px-3 py-1 text-xs text-emerald-900">
                {featuredArticle.category}
              </span>
            </div>

            <h2 className="mb-4 text-2xl font-bold text-emerald-900 lg:text-3xl">
              {featuredArticle.title}
            </h2>

            <p className="mb-6 text-sm leading-7 text-emerald-900">
              {featuredArticle.overview}
            </p>

            <div className="flex items-center justify-between">
              <div className="text-emerald-900">
                <p className="font-semibold">
                  {featuredArticle.author}
                </p>

                <p className="text-xs">
                  {formatDate(featuredArticle.published_at)}
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
            className={`rounded-full border px-4 py-2 text-sm transition-colors cursor-pointer ${
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
      {!loading && filteredArticles.length > 0 && (
        <>
          <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">

            {otherArticles.slice(0, 4).map((item) => (
              <div
                key={item.id}
                className="overflow-hidden rounded-2xl bg-white shadow-sm transition hover:shadow-lg"
              >

                <div className="h-40 w-full overflow-hidden bg-emerald-100">
                  {item.image_url ? (
                    <img
                      src={item.image_url}
                      alt={item.title}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center">
                      <span className="text-4xl">🌿</span>
                    </div>
                  )}
                </div>

                <div className="p-5">
                  <div className="mb-2 flex items-center justify-between">
                    <span className="rounded-full bg-stone-50 px-2 py-1 text-xs text-emerald-900">
                      {formatDate(item.published_at)}
                    </span>
                  </div>

                  <h3 className="mb-2 line-clamp-2 text-lg font-bold text-emerald-900">
                    {item.title}
                  </h3>

                  <p className="mb-3 line-clamp-3 text-xs leading-6 text-emerald-900">
                    {item.overview}
                  </p>

                  <div className="flex items-center justify-between">
                    <span className="text-xs text-emerald-900">
                      👤 {item.author}
                    </span>

                    <Link
                      href={`/articles/${item.id}`}
                      className="flex items-center gap-2 text-xs text-emerald-900 hover:text-emerald-700"
                    >
                      Read More <span>→</span>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* LARGE ARTICLES */}
          <div className="mb-12 grid grid-cols-1 gap-6 md:grid-cols-2">

            {otherArticles.slice(4, 6).map((item) => (
              <div
                key={item.id}
                className="overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-300 to-emerald-400 shadow-sm"
              >
                <div className="p-6">

                  <div className="mb-3 flex items-center justify-between">
                    <span className="rounded-full bg-stone-50 px-2 py-1 text-xs text-emerald-900">
                      {formatDate(item.published_at)}
                    </span>
                  </div>

                  <h3 className="mb-3 text-xl font-bold text-white">
                    {item.title}
                  </h3>

                  <p className="mb-4 line-clamp-4 text-sm leading-7 text-white">
                    {item.overview}
                  </p>

                  <div className="flex items-center justify-between">
                    <span className="text-xs text-white">
                      👤 {item.author}
                    </span>

                    <Link
                      href={`/articles/${item.id}`}
                      className="flex items-center gap-2 text-xs text-white"
                    >
                      Read More <span>→</span>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* PAGINATION */}
      <div className="mb-12 flex justify-center">
        <div className="flex gap-2">

          <button className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-300 text-sm font-bold text-white hover:bg-emerald-400">
            1
          </button>

          <button className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-300 text-sm font-bold text-white hover:bg-emerald-400">
            2
          </button>

          <button className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-300 text-sm font-bold text-white hover:bg-emerald-400">
            3
          </button>

        </div>
      </div>
    </main>
  )
}