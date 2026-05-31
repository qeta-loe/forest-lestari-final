"use client"

import { Artikel } from "./artikel/artikel.service"
import { Kegiatan } from "./kegiatan/kegiatan.service"
import { LokasiPenanaman } from "./lokasi/lokasi.service"
import { Das } from "./das/das.service"
import { PohonWithRelasi } from "./pohon/pohon.service"
import { TonggakPencapaian } from "../tentang/tonggak/tonggak.service"
import { Mitra } from "../tentang/mitra/mitra.service"
import { LaporanTahunan } from "../tentang/laporan/laporan.service"
import { Relawan } from "../tentang/relawan/relawan.service"
import { Program } from "../tentang/program/program.service"


import KegiatanUpload from "./kegiatan/uploadKegiatan"
import KegiatanList from "./kegiatan/listKegiatan"
import ArtikelForm from "./artikel/artikelForm"
import ArtikelList from "./artikel/artikelList"
import LokasiForm from "./lokasi/lokasiForm"
import LokasiList from "./lokasi/lokasiList"
import DasForm from "./das/dasForm"
import DasList from "./das/dasList"
import PohonForm from "./pohon/pohonForm"
import PohonList from "./pohon/pohonList"
import OrganisasiManager from "../tentang/organisasi/OrganisasiManager"
import TonggakForm from "../tentang/tonggak/TonggakForm"
import TonggakList from "../tentang/tonggak/TonggakList"
import MitraForm from "../tentang/mitra/MitraForm"
import MitraList from "../tentang/mitra/MitraList"
import LaporanForm from "../tentang/laporan/LaporanForm"
import LaporanList from "../tentang/laporan/LaporanList"
import RelawanForm from "../tentang/relawan/RelawanForm"
import RelawanList from "../tentang/relawan/RelawanList"
import ProgramForm from "../tentang/program/ProgramForm"
import ProgramList from "../tentang/program/ProgramList"

type MenuKey =
  | "upload" | "list"
  | "artikel" | "artikelList"
  | "database"
  | "lokasiPenanaman" | "daftarLokasiPenanaman"
  | "das" | "daftarDas"
  | "pohon" | "daftarPohon"
  | "profil"
  | "organisasi"
  | "tonggak" | "tonggakList"
  | "mitra" | "mitraList"
  | "laporan" | "laporanList"
  | "relawan" | "relawanList"
  | "program" | "programList"

type Props = {
  adminEmail: string
  menu: MenuKey
  setMenu: (menu: MenuKey) => void

  kegiatan: Kegiatan[]
  editingKegiatan: Kegiatan | null
  onEditKegiatan: (k: Kegiatan | null) => void
  onRefreshKegiatan: () => void | Promise<void>
  onDeleteKegiatan: (id: number) => void | Promise<void>
  onCancelEditKegiatan: () => void

  artikel: Artikel[]
  lokasiPenanaman: LokasiPenanaman[]
  editingArtikel: Artikel | null
  onCancelEditArtikel: () => void
  editingLokasi: LokasiPenanaman | null 
  onEditLokasi: (lokasi: LokasiPenanaman) => void 
  onCancelEditLokasi: () => void
  onDeleteLokasi: (id: number) => void

  onRefreshArtikel: () => void | Promise<void>
  onRefreshLokasi: () => void | Promise<void>
  onEditArtikel: (artikel: Artikel) => void
  onArtikelFormSuccess: () => void

  dasList: Das[]
  pohonList: PohonWithRelasi[]
  editingDas: Das | null
  editingPohon: PohonWithRelasi | null
  onRefreshDas: () => void | Promise<void>
  onRefreshPohon: () => void | Promise<void>
  onEditDas: (das: Das) => void
  onEditPohon: (pohon: PohonWithRelasi) => void
  onCancelEditDas: () => void
  onCancelEditPohon: () => void

  tonggakList: TonggakPencapaian[]
  mitraList: Mitra[]
  laporanList: LaporanTahunan[]
  relawanList: Relawan[]
  programList: Program[]
  editingTonggak: TonggakPencapaian | null
  editingMitra: Mitra | null
  editingLaporan: LaporanTahunan | null
  editingRelawan: Relawan | null
  editingProgram: Program | null

  onRefreshTonggak: () => void
  onRefreshMitra: () => void
  onRefreshLaporan: () => void
  onRefreshRelawan: () => void
  onRefreshProgram: () => void
  onEditTonggak: (t: TonggakPencapaian) => void
  onEditMitra: (m: Mitra) => void
  onEditLaporan: (l: LaporanTahunan) => void
  onEditRelawan: (r: Relawan) => void
  onEditProgram: (p: Program) => void
  onCancelEditTonggak: () => void
  onCancelEditMitra: () => void
  onCancelEditLaporan: () => void
  onCancelEditRelawan: () => void
  onCancelEditProgram: () => void
}

export default function AdminContent({
  adminEmail,
  menu,
  setMenu,
  kegiatan,
  editingKegiatan,
  onCancelEditKegiatan,
  artikel,
  lokasiPenanaman,
  editingLokasi, 
  onEditLokasi, 
  onCancelEditLokasi,
  onDeleteLokasi,
  editingArtikel,
  onCancelEditArtikel,
  onDeleteKegiatan,
  onRefreshKegiatan,
  onRefreshArtikel,
  onRefreshLokasi,
  onEditArtikel,
  onArtikelFormSuccess,
  onEditKegiatan,
  dasList,
  pohonList,
  editingDas,
  editingPohon,
  onRefreshDas,
  onRefreshPohon,
  onEditDas,
  onEditPohon,
  onCancelEditDas,
  onCancelEditPohon,
  tonggakList,
  mitraList,
  laporanList,
  relawanList,
  programList,
  editingTonggak,
  editingMitra,
  editingLaporan,
  editingRelawan,
  editingProgram,
  onRefreshTonggak, 
  onRefreshMitra, 
  onRefreshLaporan, 
  onRefreshRelawan, 
  onRefreshProgram,
  onEditTonggak, 
  onEditMitra, 
  onEditLaporan, 
  onEditRelawan, 
  onEditProgram,
  onCancelEditTonggak, 
  onCancelEditMitra, 
  onCancelEditLaporan, 
  onCancelEditRelawan, 
  onCancelEditProgram,
}: Props) {
  return (
     <div className="flex-1">
        <div className="p-8">
      {menu === "upload" && (
        <KegiatanUpload
          editingKegiatan={editingKegiatan}
          onSuccess={async () => {
            await onRefreshKegiatan()
            onEditKegiatan(null)
            setMenu("list")
          }}
          onCancel={onCancelEditKegiatan}
        />
      )}

      {menu === "list" && (
        <KegiatanList
          kegiatan={kegiatan}
          onEdit={(item) => {
            onEditKegiatan(item)
            setMenu("upload")
          }}
          onDelete={onDeleteKegiatan}
        />
      )}

      {menu === "artikel" && (
        <ArtikelForm
          editingArtikel={editingArtikel}
          onSuccess={() => { onArtikelFormSuccess(); setMenu("artikelList") }}
          onCancel={() => { onCancelEditArtikel(); setMenu("artikelList") }}
        />
      )}

      {menu === "artikelList" && (
        <ArtikelList
          artikel={artikel}
          onEdit={(item) => {
            onEditArtikel(item)
            setMenu("artikel")
          }}
        />
      )}

      {menu === "database" && <div />}

      {menu === "lokasiPenanaman" && (
        <LokasiForm 
          editingLokasi={editingLokasi}
          onSuccess={() => {
            onRefreshLokasi()
            onCancelEditLokasi()
            setMenu("daftarLokasiPenanaman")
          }}
          onCancelEdit={() => { onCancelEditLokasi(); setMenu("daftarLokasiPenanaman") }}
        />
      )}

      {menu === "daftarLokasiPenanaman" && (
        <LokasiList
          lokasiPenanaman={lokasiPenanaman}
          onEdit={(item) => { 
            onEditLokasi(item)
            setMenu("lokasiPenanaman")
          }}
          onDelete={onDeleteLokasi}
        />
      )}

      {menu === "das" && (
        <DasForm
          editingDas={editingDas}
          onSuccess={() => {
            onRefreshDas()
            setMenu("daftarDas")
          }}
          onCancelEdit={() => { onCancelEditDas(); setMenu("daftarDas") }}
        />
      )}

      {menu === "daftarDas" && (
        <DasList
          dasList={dasList}
          onRefresh={onRefreshDas}
          onEdit={(das) => {
            onEditDas(das)
            setMenu("das")
          }}
          setMenu={setMenu}
        />
      )}

      {menu === "pohon" && (
        <PohonForm
          editingPohon={editingPohon}
          onSuccess={() => {
            onRefreshPohon()
            setMenu("daftarPohon")
          }}
          onCancelEdit={() => { onCancelEditPohon(); setMenu("daftarPohon") }}
        />
      )}

      {menu === "daftarPohon" && (
        <PohonList
          pohonList={pohonList}
          onRefresh={onRefreshPohon}
          onEdit={(pohon) => {
            onEditPohon(pohon)
            setMenu("pohon")
          }}
          setMenu={setMenu}
        />
      )}

      {menu === "organisasi" && <OrganisasiManager />}
      {menu === "tonggak" && (
        <TonggakForm
          editingTonggak={editingTonggak}
          onSuccess={() => { onRefreshTonggak(); setMenu("tonggakList") }}
          onCancelEdit={() => { onCancelEditTonggak(); setMenu("tonggakList") }}
        />
      )}
      {menu === "tonggakList" && (
        <TonggakList
          tonggakList={tonggakList}
          onRefresh={onRefreshTonggak}
          onEdit={(t) => { onEditTonggak(t); setMenu("tonggak") }}
        />
      )}
      {menu === "mitra" && (
        <MitraForm
          editingMitra={editingMitra}
          onSuccess={() => { onRefreshMitra(); setMenu("mitraList") }}
          onCancelEdit={() => { onCancelEditMitra(); setMenu("mitraList") }}
        />
      )}
      {menu === "mitraList" && (
        <MitraList
          mitraList={mitraList}
          onRefresh={onRefreshMitra}
          onEdit={(m) => { onEditMitra(m); setMenu("mitra") }}
        />
      )}
      {menu === "laporan" && (
        <LaporanForm
          key={editingLaporan?.id ?? "new"}
          editingLaporan={editingLaporan}
          onSuccess={() => { onRefreshLaporan(); setMenu("laporanList") }}
          onCancel={() => { onCancelEditLaporan(); setMenu("laporanList") }}
        />
      )}
      {menu === "laporanList" && (
        <LaporanList
          laporanList={laporanList}
          onRefresh={onRefreshLaporan}
          onEdit={(l) => { onEditLaporan(l); setMenu("laporan") }}
        />
      )}
      {menu === "relawan" && (
        <RelawanForm
          editingRelawan={editingRelawan}
          onSuccess={() => { onRefreshRelawan(); setMenu("relawanList") }}
          onCancel={() => { onCancelEditRelawan(); setMenu("relawanList") }}
        />
      )}
      {menu === "relawanList" && (
        <RelawanList
          relawanList={relawanList}
          onRefresh={onRefreshRelawan}
          onEdit={(r) => { onEditRelawan(r); setMenu("relawan") }}
        />
      )}
      {menu === "program" && (
        <ProgramForm
          editingProgram={editingProgram}
          onSuccess={() => { onRefreshProgram(); setMenu("programList") }}
          onCancel={() => { onCancelEditProgram(); setMenu("programList") }}
        />
      )}
      {menu === "programList" && (
        <ProgramList
          programList={programList}
          onRefresh={onRefreshProgram}
          onEdit={(p) => { onEditProgram(p); setMenu("program") }}
        />
      )}
    </div>
    </div>
  )
}