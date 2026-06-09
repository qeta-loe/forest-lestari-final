"use client"

import { useState } from "react"
import { KontenHalaman } from "@/lib/konten.service"
import KontenList from "./KontenList"
import KontenForm from "./KontenForm"

type Props = {
  kontenList: KontenHalaman[]
  onRefresh: () => void
}

export default function KontenManager({ kontenList, onRefresh }: Props) {
  const [editingKonten, setEditingKonten] = useState<KontenHalaman | null>(null)

  if (editingKonten) {
    return (
      <KontenForm
        kontenList={kontenList}
        editingKonten={editingKonten}
        onSuccess={() => {
          setEditingKonten(null)
          onRefresh()
        }}
        onCancel={() => setEditingKonten(null)}
      />
    )
  }

  return (
    <KontenList
      kontenList={kontenList}
      onEdit={setEditingKonten}
    />
  )
}