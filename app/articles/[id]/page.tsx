"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { supabase } from "@/lib/supabase"

type Artikel = {
  id: number
  judul: string
  deskripsi_singkat: string
  kategori: string | null
  penulis: string | null
  tanggal_publikasi: string | null
  sections: any[] | null
  is_draft: boolean | null
  updated_at: string | null
  created_at: string | null
  image_url: string | null
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

  return (
    <main className="min-h-screen bg-[#F7F6EF] px-4 py-10 text-[#113522] sm:px-6 lg:px-10">
      <article className="mx-auto max-w-4xl">
        <Link
          href="/articles"
          className="mb-8 inline-block text-sm font-semibold text-emerald-900 hover:underline"
        >
          ← Kembali ke artikel
        </Link>

        <div className="mb-4">
          <span className="rounded-full border border-emerald-950 bg-stone-50 px-3 py-1 text-xs text-emerald-900">
            {article.kategori || "Berita Komunitas"}
          </span>
        </div>

        <h1 className="mb-4 text-3xl font-bold leading-tight text-emerald-900 sm:text-4xl">
          {article.judul}
        </h1>

        <div className="mb-8 text-sm text-emerald-900">
          <span>{article.penulis || "Admin Forest Lestari"}</span>
          <span className="mx-2">·</span>
          <span>{formattedDate}</span>
        </div>

        {article.image_url && (
          <img
            src={article.image_url}
            alt={article.judul}
            className="mb-8 h-72 w-full rounded-3xl object-cover sm:h-96"
          />
        )}

        <p className="mb-8 text-lg leading-8 text-emerald-900">
          {article.deskripsi_singkat}
        </p>

        {Array.isArray(article.sections) && article.sections.length > 0 && (
          <div className="space-y-8">
            {article.sections.map((section, index) => (
              <section key={index}>
                {section.heading && (
                  <h2 className="mb-3 text-2xl font-bold text-emerald-900">
                    {section.heading}
                  </h2>
                )}

                {section.content && (
                  <p className="leading-8 text-emerald-900">
                    {section.content}
                  </p>
                )}
              </section>
            ))}
          </div>
        )}
      </article>
    </main>
  )
}