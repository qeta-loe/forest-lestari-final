"use client"

import { Artikel } from "./artikel/artikel.service"
import { Dokumen } from "./dokumen/dokumen.service"
import { Kegiatan } from "./kegiatan/kegiatan.service"
import { LokasiPenanaman } from "./lokasi/lokasi.service"

import KegiatanUpload from "./kegiatan/uploadKegiatan"
import KegiatanList from "./kegiatan/listKegiatan"
import DokumenUpload from "./dokumen/uploadDokumen"
import DokumenList from "./dokumen/listDokumen"
import ArtikelForm from "./artikel/artikelForm"
import ArtikelList from "./artikel/artikelList"
import LokasiForm from "./lokasi/lokasiForm"
import LokasiList from "./lokasi/lokasiList"
import ProfilForm from "./profil/profilForm"
import DasForm from "./das/dasForm"
import DasList from "./das/dasList"
import PohonForm from "./pohon/pohonForm"
import PohonList from "./pohon/pohonList"

type MenuKey =
  | "upload" | "list"
  | "dokumen" | "dokumenList"
  | "artikel" | "artikelList"
  | "database"
  | "lokasiPenanaman" | "daftarLokasiPenanaman"
  | "das" | "daftarDas"
  | "pohon" | "daftarPohon"
  | "profil"

type Props = {
  menu: MenuKey
  setMenu: (menu: MenuKey) => void
  kegiatan: Kegiatan[]
  dokumen: Dokumen[]
  artikel: Artikel[]
  lokasiPenanaman: LokasiPenanaman[]
  editingArtikel: Artikel | null
  onRefreshKegiatan: () => void
  onRefreshDokumen: () => void
  onRefreshArtikel: () => void
  onRefreshLokasi: () => void
  onEditArtikel: (artikel: Artikel) => void
  onArtikelFormSuccess: () => void
}

export default function AdminContent({
  menu,
  setMenu,
  kegiatan,
  dokumen,
  artikel,
  lokasiPenanaman,
  editingArtikel,
  onRefreshKegiatan,
  onRefreshDokumen,
  onRefreshArtikel,
  onRefreshLokasi,
  onEditArtikel,
  onArtikelFormSuccess,
}: Props) {
  return (
    <div className="flex-1 p-8">
      {menu === "upload" && <KegiatanUpload onSuccess={onRefreshKegiatan} />}
      {menu === "list" && <KegiatanList kegiatan={kegiatan} onRefresh={onRefreshKegiatan} />}
      {menu === "dokumen" && <DokumenUpload onSuccess={onRefreshDokumen} />}
      {menu === "dokumenList" && <DokumenList dokumen={dokumen} />}
      {menu === "artikel" && (
        <ArtikelForm
          editingArtikel={editingArtikel}
          onSuccess={() => {
            onArtikelFormSuccess()
            setMenu("artikelList")
          }}
        />
      )}
      {menu === "artikelList" && (
        <ArtikelList
          artikel={artikel}
          onEdit={(a: Artikel) => {
            onEditArtikel(a)
            setMenu("artikel")
          }}
        />
      )}
      {menu === "database" && <div />}
      {menu === "lokasiPenanaman" && <LokasiForm onSuccess={onRefreshLokasi} />}
      {menu === "daftarLokasiPenanaman" && <LokasiList lokasiPenanaman={lokasiPenanaman} />}
      {menu === "das" && <DasForm />}
      {menu === "daftarDas" && <DasList />}
      {menu === "pohon" && <PohonForm />}
      {menu === "daftarPohon" && <PohonList />}
      {menu === "profil" && <ProfilForm />}
    </div>
  )
}