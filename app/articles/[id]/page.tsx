"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { supabase } from "@/lib/supabase"

type ArtikelSection = {
  title?: string
  heading?: string
  content?: string
  quote?: string
}

type Artikel = {
  id: number
  judul: string
  deskripsi_singkat: string
  kategori: string | null
  penulis: string | null
  tanggal_publikasi: string | null
  sections: ArtikelSection[] | string | null
  is_draft: boolean | null
  updated_at: string | null
  created_at: string | null
  image_url: string | null
}

function parseSections(sections: Artikel["sections"]): ArtikelSection[] {
  if (!sections) return []

  if (typeof sections === "string") {
    try {
      const parsed = JSON.parse(sections)

      if (Array.isArray(parsed)) {
        return parsed.filter(
          (section) => typeof section === "object" && section !== null
        )
      }

      return []
    } catch {
      return []
    }
  }

  if (!Array.isArray(sections)) return []

  return sections.filter(
    (section) => typeof section === "object" && section !== null
  )
}

function renderTextWithBreaks(text: string) {
  return text
    .split("\n")
    .filter((line) => line.trim() !== "")
    .map((line, index) => (
      <p key={index} className="mb-4 leading-8 text-emerald-900 last:mb-0">
        {line}
      </p>
    ))
}

export default function ArticleDetailPage() {
  const params = useParams()
  const id = params.id as string

  const [article, setArticle] = useState<Artikel | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchArticle = async () => {
      setLoading(true)

      const { data, error } = await supabase
        .from("artikel")
        .select(
          "id, judul, deskripsi_singkat, kategori, penulis, tanggal_publikasi, sections, is_draft, updated_at, created_at, image_url"
        )
        .eq("id", Number(id))
        .single()

      console.log("ARTICLE ID:", id)
      console.log("ARTICLE DATA:", data)
      console.log("ARTICLE ERROR:", error)

      if (error) {
        console.error(error.message)
        setArticle(null)
        setLoading(false)
        return
      }

      setArticle(data as Artikel)
      setLoading(false)
    }

    if (id) {
      fetchArticle()
    }
  }, [id])

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#F7F6EF] text-[#0F5139]">
        Loading artikel...
      </main>
    )
  }

  if (!article) {
    return (
      <main className="min-h-screen bg-[#F7F6EF] px-4 py-10 text-[#113522] sm:px-6 lg:px-10">
        <div className="mx-auto max-w-4xl">
          <h1 className="text-2xl font-bold text-emerald-900">
            Artikel tidak ditemukan
          </h1>

          <Link
            href="/articles"
            className="mt-6 inline-block text-sm font-semibold text-emerald-900 hover:underline"
          >
            ← Kembali ke daftar artikel
          </Link>
        </div>
      </main>
    )
  }

  const tanggal = article.tanggal_publikasi || article.created_at

  const formattedDate = tanggal
    ? new Date(tanggal).toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "Tanggal tidak tersedia"

  const sections = parseSections(article.sections)

  return (
    <main className="min-h-screen bg-[#F7F6EF] px-4 py-10 text-[#113522] sm:px-6 lg:px-10">
      <article className="mx-auto max-w-5xl">
        <Link
          href="/articles"
          className="mb-8 inline-block text-sm font-semibold text-emerald-900 hover:underline"
        >
          ← Kembali ke artikel
        </Link>

        {/* Header Artikel */}
        <section className="grid gap-8 lg:grid-cols-[1fr_46%] lg:items-start">
          <div>
            <div className="mb-4">
              <span className="rounded-full border border-emerald-950 bg-stone-50 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-emerald-900">
                {article.kategori || "Berita Komunitas"}
              </span>
            </div>

            <h1 className="mb-5 text-3xl font-bold leading-tight text-emerald-900 sm:text-4xl lg:text-5xl">
              {article.judul}
            </h1>

            <div className="mb-8 flex flex-wrap items-center gap-3 text-sm text-emerald-900">
              <span>{article.penulis || "Admin Forest Lestari"}</span>
              <span>·</span>
              <span>{formattedDate}</span>
            </div>
          </div>

          {article.image_url ? (
            <img
              src={article.image_url}
              alt={article.judul}
              className="h-72 w-full rounded-3xl object-cover sm:h-96 lg:h-[340px]"
            />
          ) : (
            <div className="h-72 w-full rounded-3xl bg-zinc-300 sm:h-96 lg:h-[340px]" />
          )}
        </section>

        {/* Deskripsi Singkat */}
        <section className="mt-10">
          <p className="text-lg leading-8 text-emerald-900">
            {article.deskripsi_singkat}
          </p>
        </section>

        {/* Section Artikel */}
        {sections.length > 0 && (
          <section className="mt-10 space-y-10">
            {sections.map((section, index) => {
              const sectionTitle = section.title || section.heading || ""
              const sectionContent = section.content || ""
              const sectionQuote = section.quote || ""

              return (
                <div key={index}>
                  {sectionTitle && (
                    <h2 className="mb-4 text-2xl font-bold leading-tight text-emerald-900 sm:text-3xl">
                      {sectionTitle}
                    </h2>
                  )}

                  {sectionContent && (
                    <div className="text-base text-emerald-900 sm:text-lg">
                      {renderTextWithBreaks(sectionContent)}
                    </div>
                  )}

                  {sectionQuote && (
                    <blockquote className="my-8 border-l-4 border-yellow-950 pl-6">
                      <p className="text-xl font-bold italic leading-8 text-emerald-900 sm:text-2xl">
                        “{sectionQuote}”
                      </p>
                    </blockquote>
                  )}
                </div>
              )
            })}
          </section>
        )}
      </article>
    </main>
  )
}