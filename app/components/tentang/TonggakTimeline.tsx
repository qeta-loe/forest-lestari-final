"use client"

import { useState } from "react"
import { TonggakPencapaian } from "@/lib/queries"
import TonggakCard from "./TonggakCard"
import TonggakPopup from "./TonggakPopup"

type Props = {
  tonggakList: TonggakPencapaian[]
}

export default function TonggakTimeline({ tonggakList }: Props) {
  const [selected, setSelected] = useState<TonggakPencapaian | null>(null)

  if (tonggakList.length === 0) {
    return (
      <div className="rounded-3xl border border-black/10 bg-white p-8 text-center">
        <p className="text-sm text-zinc-600">Belum ada tonggak pencapaian.</p>
      </div>
    )
  }

  return (
    <>
      <div className="relative border-l border-emerald-900 pl-6 sm:pl-10">
        <div className="space-y-10 sm:space-y-12">
          {tonggakList.map((t) => (
            <div key={t.id} className="relative">
              <div className="absolute -left-[35px] top-8 h-5 w-5 rounded-full bg-emerald-900 sm:-left-[49px]" />
              <TonggakCard tonggak={t} onClick={setSelected} />
            </div>
          ))}
        </div>
      </div>

      {selected && (
        <TonggakPopup tonggak={selected} onClose={() => setSelected(null)} />
      )}
    </>
  )
}