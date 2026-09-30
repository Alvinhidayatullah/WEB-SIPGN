"use client";
import { Info, RefreshCw, Edit, Copy, CheckCircle2, Trash2 } from "lucide-react";
import { useState } from "react";

export default function ProfilDetailCard({ 
  isAdmin, 
  profile, 
  onEditAccount,
  onDeleteAccount,
  onCopyAccount,
  onEditProfile,
  onRefresh,
  isDeleting = false
}: { 
  isAdmin: boolean, 
  profile?: Record<string, any>, 
  onEditAccount?: () => void,
  onDeleteAccount?: () => void,
  onCopyAccount?: () => void,
  onEditProfile?: () => void,
  onRefresh?: () => void,
  isDeleting?: boolean
}) {

  return (
    <div className="bg-white rounded-b-lg shadow-sm overflow-hidden mb-8">
      <div className="p-4 border-b border-slate-100 flex flex-col md:flex-row justify-end items-start md:items-center bg-white gap-4">
        <div className="flex items-center gap-3">
          {isAdmin && (
            <>
              <button 
                onClick={onCopyAccount}
                className="flex items-center gap-2 px-3 py-1.5 text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-md text-sm font-medium transition-colors border border-blue-200"
              >
                <Copy size={14} /> Salin Akun
              </button>
              <button 
                onClick={onDeleteAccount}
                disabled={isDeleting}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors border ${isDeleting ? 'text-slate-500 bg-slate-100 border-slate-200 cursor-not-allowed' : 'text-red-700 bg-red-50 hover:bg-red-100 border-red-200'}`}
              >
                <Trash2 size={14} className={isDeleting ? 'animate-pulse' : ''} /> {isDeleting ? 'Menghapus...' : 'Hapus'}
              </button>
            </>
          )}
          <button onClick={onEditAccount} className="flex items-center gap-2 px-3 py-1.5 text-amber-700 bg-amber-50 hover:bg-amber-100 rounded-md text-sm font-medium transition-colors border border-amber-200">
            <Edit size={14} /> {isAdmin ? 'Edit Akun' : 'Ganti Akun & Kata Sandi'}
          </button>
          <button onClick={onRefresh} className="flex items-center gap-2 px-3 py-1.5 text-emerald-600 bg-emerald-50 hover:bg-emerald-100 rounded-md text-sm font-medium transition-colors">
            <RefreshCw size={14} /> Refresh Data
          </button>
        </div>
      </div>
      
      <div className="p-6 space-y-8">
        {/* Alert */}
        <div className="bg-blue-50 border border-blue-200 text-blue-800 rounded-lg p-4 flex gap-3 text-sm leading-relaxed">
          <div className="mt-0.5 shrink-0">
            <div className="w-5 h-5 bg-blue-200 rounded-full flex items-center justify-center text-blue-600 font-bold">!</div>
          </div>
          <p>
            {isAdmin ? (
              <>Silakan periksa kelengkapan maupun ketidaksesuaian data Profil SPPG & Yayasan ini beserta kelengkapan data lainnya, apabila terdapat kekurangan silakan klik tombol <button onClick={onEditProfile} className="inline-flex items-center text-slate-700 mx-1 font-medium bg-slate-100 hover:bg-slate-200 cursor-pointer px-1.5 py-0.5 rounded text-xs border border-slate-200 transition-colors"><Edit size={12} className="mr-1" /> Edit Profil</button> untuk melengkapi maupun memperbaiki data yang ada.</>
            ) : (
              <>Silakan periksa kelengkapan maupun kesesuaian data Profil SPPG & Yayasan Anda. Apabila terdapat ketidaksesuaian atau Anda perlu melakukan pembaruan data, harap hubungi Administrator untuk bantuan lebih lanjut.</>
            )}
          </p>
        </div>

        {/* Grid Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          
          {/* LEFT COLUMN */}
          <div className="space-y-8">
            {/* Section A: Identitas SPPG */}
            <section>
              <h3 className="text-base font-semibold text-slate-800 mb-4 flex items-center gap-2">
                Identitas SPPG
              </h3>
              <div className="border-t-2 border-dashed border-slate-200 mb-4"></div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-4">
                <DataItem label="ID SPPG" value={profile?.idSppg || "4NFI4MPR"} required info />
                <DataItem label="Nomor BA. Verval" value={profile?.nomorBaVerval || "440/BA/VERVAL/JAKARTA/XII/2025"} required info />
                <DataItem label="Tanggal BA. Verval" value={profile?.tanggalBaVerval ? new Date(profile.tanggalBaVerval).toLocaleDateString('id-ID') : "30-12-2025"} required info />
                <DataItem label="Status Operasional" value={profile?.statusOperasional || "Beroperasi"} required info />
                <DataItem label="Tanggal Operasional/Rencana" value={profile?.tanggalOperasional ? new Date(profile.tanggalOperasional).toLocaleDateString('id-ID') : "06-01-2026"} required info />
                <DataItem label="Kode SPPG" value={profile?.kodeSppg || "32.01.06.2001.15"} required info />
                <DataItem label="Nama SPPG" value={profile?.namaSppg || profile?.sppgName || "SPPG Bogor Jonggol Sukamaju 3"} required info />
                <DataItem label="Provinsi" value={profile?.provinsi || "JAWA BARAT"} required info />
                <DataItem label="Kab./Kota" value={profile?.kabKota || "BOGOR"} required info />
                <DataItem label="Kecamatan" value={profile?.kecamatan || "JONGGOL"} required info />
                <DataItem label="Kelurahan/Desa" value={profile?.kelurahanDesa || "SUKAMAJU"} required info />
                <DataItem label="Alamat" value={profile?.alamat || "Ciganitri Tengah No.29, RT 004, RW 003"} required info colSpan={2} />
                <DataItem label="Kode Pos" value={profile?.kodePos || "40287"} required info />
                <DataItem label="Posisi Latitude" value={profile?.posisiLatitude?.toString() || "-6.9690927"} info />
                <DataItem label="Posisi Longitude" value={profile?.posisiLongitude?.toString() || "107.6489864"} info />
                <DataItem label="Jenis / Asal Bangunan SPPG" value={profile?.jenisBangunan || "Rumah Tinggal"} required info />
                <DataItem label="Jenis SPPG" value={profile?.jenisSppg || "SPPG Mitra"} required info />
              </div>
            </section>

            {/* Section B: Data SPPI/Kasatpel/Ka SPPG */}
            <section>
              <h3 className="text-base font-semibold text-slate-800 mb-4 flex items-center gap-2">
                Data SPPI/Kasatpel/Ka SPPG
              </h3>
              <div className="border-t-2 border-dashed border-slate-200 mb-4"></div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-4">
                <DataItem label="Nama" value={profile?.kasatpel?.nama || "Ginanjar Surya Hardiansyah"} required info />
                <DataItem label="Email" value={profile?.kasatpel?.email || "ginanjarsuryah@gmail.com"} required info />
                <DataItem label="No. HP/Telepon" value={profile?.kasatpel?.noHp || "082120018449"} required info />
              </div>
              <p className="text-xs text-red-600 italic font-medium mt-4">Kelengkapan data Kasatpel/Ka SPPG lainnya terdapat di menu petugas *</p>
            </section>

            {/* Section C: Identitas Mitra */}
            <section>
              <h3 className="text-base font-semibold text-slate-800 mb-4 flex items-center gap-2">
                Identitas Mitra
              </h3>
              <div className="border-t-2 border-dashed border-slate-200 mb-4"></div>
              <p className="text-xs text-blue-600 font-medium italic mb-6 leading-relaxed">
                Data dibawah ini merupakan pihak lain yang bermitra dengan yayasan, jika dominan aset dimiliki oleh yayasan yang bermitra langsung dengan BGN maka silakan isi dengan identitas dan alamat lengkap yayasan tersebut, jika tidak silakan diisi dengan identitas dan alamat mitra yang bekerjasama dengan yayasan <span className="text-red-500">*</span>
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-4">
                <DataItem label="Jenis Mitra/Instansi" value={profile?.mitraEksternal?.jenisMitra || "Yayasan"} required info />
                <DataItem label="Nama Mitra/Instansi" value={profile?.mitraEksternal?.namaMitra || "Global Humanis Indonesia"} required info />
                <DataItem label="Nama Pimpinan" value={profile?.mitraEksternal?.namaPimpinan || "Yogie Subagya"} required info />
                <DataItem label="No. HP/Telepon" value={profile?.mitraEksternal?.noHp || "081210576976"} required info />
                <DataItem label="e-mail" value={profile?.mitraEksternal?.email || "globalhumanisindonesia@gmail.com"} info />
                <DataItem label="Bentuk dukungan/kepemilikan aset Mitra" value={profile?.mitraEksternal?.bentukDukungan || "Lahan, Bangunan, Alat Makan, Alat Masak, Kendaraan, Tenaga Kerja (Relawan)"} required info colSpan={2} />
                <DataItem label="Provinsi" value={profile?.mitraEksternal?.provinsi || "DKI JAKARTA"} required info />
                <DataItem label="Kab./Kota" value={profile?.mitraEksternal?.kabKota || "KOTA ADM. JAKARTA SELATAN"} required info />
                <DataItem label="Kecamatan" value={profile?.mitraEksternal?.kecamatan || "KEBAYORAN BARU"} required info />
                <DataItem label="Kelurahan/Desa" value={profile?.mitraEksternal?.kelurahanDesa || "GANDARIA UTARA"} required info />
                <DataItem label="Alamat" value={profile?.mitraEksternal?.alamat || "Komplek Ruko Radio Dalam Square Nomr 1B"} required info colSpan={2} />
                <DataItem label="Kode Pos" value={profile?.mitraEksternal?.kodePos || "12140"} required info />
              </div>
            </section>
          </div>

          {/* RIGHT COLUMN */}
          <div className="space-y-8">
            {/* Section D: Identitas Mitra/Yayasan */}
            <section>
              <h3 className="text-base font-semibold text-slate-800 mb-4 flex items-center gap-2">
                Identitas Mitra/Yayasan
              </h3>
              <div className="border-t-2 border-dashed border-slate-200 mb-4"></div>
              <p className="text-xs text-blue-600 font-medium italic mb-6 leading-relaxed">
                Data dibawah ini merupakan yayasan yang bermitra langsung dengan BGN, silakan isi dengan identitas dan alamat lengkap yayasan tersebut. <span className="text-red-500">*</span>
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-4">
                <DataItem label="Nama Mitra/Yayasan" value={profile?.yayasan?.namaYayasan || "Yayasan Darma Bandhawa Kulinari"} required info />
                <DataItem label="NPWP" value={profile?.yayasan?.npwp || "1000000003216833"} required info />
                <DataItem label="Provinsi" value={profile?.yayasan?.provinsi || "JAWA BARAT"} required info />
                <DataItem label="Kab./Kota" value={profile?.yayasan?.kabKota || "KOTA BANDUNG"} required info />
                <DataItem label="Kecamatan" value={profile?.yayasan?.kecamatan || "BANDUNG KULON"} required info />
                <DataItem label="Kelurahan/Desa" value={profile?.yayasan?.kelurahanDesa || "GEMPOL SARI"} required info />
                <DataItem label="Alamat" value={profile?.yayasan?.alamat || "Jl. Gempol Asri Raya No 84, Malausma, Kabupaten Majalengka, Jawa Barat"} required info colSpan={2} />
                <DataItem label="Kode Pos" value={profile?.yayasan?.kodePos || "40215"} required info />
                <DataItem label="Email" value={profile?.yayasan?.email || "darma.bhandawakulinari@gmail.com"} required info />
                <DataItem label="Telepon/HP" value={profile?.yayasan?.teleponHp || "082315167789"} info />
              </div>
              <p className="text-xs text-red-600 italic font-medium mt-4">Kelengkapan data yayasan lainnya terdapat di menu Kerjasama *</p>
            </section>

            {/* Section E: Data Bank/Rekening */}
            <section>
              <h3 className="text-base font-semibold text-slate-800 mb-4 flex items-center gap-2">
                Data Bank/Rekening
              </h3>
              <div className="border-t-2 border-dashed border-slate-200 mb-4"></div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-4">
                <DataItem label="Nama Bank" value={profile?.rekeningBank?.namaBank || "BANK BNI"} required info />
                <DataItem label="Nomor Rekening" value={profile?.rekeningBank?.nomorRekening || "2917122527"} required info />
                <DataItem label="Nama Pemilik Rekening" value={profile?.rekeningBank?.namaPemilikRekening || "Benteng Generasi Mandiri Yayasan"} required info colSpan={2} />
                <DataItem label="Nama Bank Virtual Account" value={profile?.rekeningBank?.namaBankVirtualAccount || "BANK BNI"} required info />
                <DataItem label="Nomor Virtual Account" value={profile?.rekeningBank?.nomorVirtualAccount || "5268080020571600"} required info />
                <DataItem label="Nama Virtual Account" value={profile?.rekeningBank?.namaVirtualAccount || "205716 OWJZUCPO DARMA BAND (IDR)"} required info colSpan={2} />
              </div>
            </section>

            {/* Section F: Data Perwakilan Yayasan di SPPG */}
            <section>
              <h3 className="text-base font-semibold text-slate-800 mb-4 flex items-center gap-2">
                Data Perwakilan Yayasan di SPPG
              </h3>
              <div className="border-t-2 border-dashed border-slate-200 mb-4"></div>
              <p className="text-xs text-blue-600 font-medium italic mb-6 leading-relaxed">
                Data dibawah merupakan Perwakilan/PIC/Penanggung Jawab Yayasan yang memegang akun Virtual Account. <span className="text-red-500">*</span>
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-4">
                <DataItem label="Nama Perwakilan" value={profile?.perwakilanYayasan?.namaPerwakilan || "DEVI NURJAMAN"} required info />
                <DataItem label="NIK" value={profile?.perwakilanYayasan?.nik || "3205121311960006"} required info />
                <DataItem label="Email" value={profile?.perwakilanYayasan?.email || "dnur9414@gmail.com"} required info />
                <DataItem label="No. HP/Telepon" value={profile?.perwakilanYayasan?.noHp || "089507760120"} required info />
              </div>
            </section>
          </div>

        </div>
      </div>
    </div>
  );
}

function DataItem({ label, value, required = false, info = false, colSpan = 1 }: { label: string, value: string, required?: boolean, info?: boolean, colSpan?: number }) {
  return (
    <div className={colSpan === 2 ? "col-span-1 md:col-span-2" : "col-span-1"}>
      <div className="flex items-center gap-1 mb-1.5">
        <span className="text-xs font-medium text-slate-500">{label}</span>
        {required && <span className="text-red-500 text-xs">*</span>}
        {info && (
          <button className="text-slate-300 hover:text-slate-500" title="Information">
            <Info size={12} />
          </button>
        )}
      </div>
      <div className="text-sm text-slate-800 font-medium break-words">
        {value}
      </div>
    </div>
  );
}
