import { SectionWithAnggota } from "@/lib/queries"

function AnggotaCard({ anggota }: { anggota: SectionWithAnggota["anggota"][0] }) {
  return (
    <article className="flex h-full flex-col overflow-hidden rounded-[28px] bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md">
      <div className="aspect-[4/3] w-full overflow-hidden bg-zinc-200">
        <img
          src={anggota.foto_url ?? "https://placehold.co/400x300"}
          alt={anggota.nama}
          className="h-full w-full object-cover"
        />
      </div>

      <div className="flex flex-1 flex-col items-center justify-center bg-[#6D6D6D] px-4 py-5 text-center">
        <h3 className="text-base font-bold leading-tight text-white sm:text-lg">
          {anggota.nama}
        </h3>
        <p className="mt-2 text-sm font-semibold leading-snug text-[#D7F4E4]">
          {anggota.jabatan}
        </p>
        {anggota.linkedin_url && (
          <a
            href={anggota.linkedin_url}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 text-xs font-semibold text-white/80 underline underline-offset-4 transition hover:text-white"
          >
            LinkedIn
          </a>
        )}
      </div>
    </article>
  )
}

type Props = {
  sections: SectionWithAnggota[]
}

export default function OrganisasiSection({ sections }: Props) {
  if (sections.length === 0) return null

  return (
    <div className="space-y-20">
      {sections.map((section) => (
        <div key={section.id}>
          {/* Label section */}
          <div className="mx-auto mb-10 w-fit rounded-2xl bg-white px-6 py-3 shadow-sm">
            <p className="font-semibold text-[#113522]">{section.nama_section}</p>
          </div>

          {/* Grid anggota — responsif berdasarkan jumlah */}
          <div
            className={`grid gap-6 ${
              section.anggota.length <= 2
                ? "mx-auto max-w-2xl grid-cols-1 sm:grid-cols-2"
                : section.anggota.length === 3
                ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
                : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
            }`}
          >
            {section.anggota.map((a) => (
              <AnggotaCard key={a.id} anggota={a} />
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}