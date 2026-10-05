'use client';
import { useState } from 'react';
import { X } from 'lucide-react';

export default function EditProfileModal({ 
  profile, 
  mode = 'edit',
  isAdmin = true,
  onClose, 
  onSuccess 
}: { 
  profile: any, 
  mode?: 'edit' | 'copy' | 'create',
  isAdmin?: boolean,
  onClose: () => void, 
  onSuccess: () => void 
}) {
  const [formData, setFormData] = useState(() => {
    // Merge provided profile with default mockup data so the form is never blank
    const d = { ...profile };
    return {
      username: d.username || '',
      password: d.password || '',
      idSppg: d.idSppg || '4NFI4MPR',
      nomorBaVerval: d.nomorBaVerval || '440/BA/VERVAL/JAKARTA/XII/2025',
      tanggalBaVerval: d.tanggalBaVerval || '2025-12-30T00:00:00Z',
      statusOperasional: d.statusOperasional || 'Beroperasi',
      tanggalOperasional: d.tanggalOperasional || '2026-01-06T00:00:00Z',
      kodeSppg: d.kodeSppg || '32.01.06.2001.15',
      namaSppg: d.namaSppg || d.sppgName || 'SPPG Bogor Jonggol Sukamaju 3',
      provinsi: d.provinsi || 'JAWA BARAT',
      kabKota: d.kabKota || 'BOGOR',
      kecamatan: d.kecamatan || 'JONGGOL',
      kelurahanDesa: d.kelurahanDesa || 'SUKAMAJU',
      alamat: d.alamat || 'Ciganitri Tengah No.29, RT 004, RW 003',
      kodePos: d.kodePos || '40287',
      posisiLatitude: d.posisiLatitude || -6.9690927,
      posisiLongitude: d.posisiLongitude || 107.6489864,
      jenisBangunan: d.jenisBangunan || 'Rumah Tinggal',
      jenisSppg: d.jenisSppg || 'SPPG Mitra',
      yayasan: {
        namaYayasan: d.yayasan?.namaYayasan || 'Yayasan Darma Bandhawa Kulinari',
        npwp: d.yayasan?.npwp || '1000000003216833',
        provinsi: d.yayasan?.provinsi || 'JAWA BARAT',
        kabKota: d.yayasan?.kabKota || 'KOTA BANDUNG',
        kecamatan: d.yayasan?.kecamatan || 'BANDUNG KULON',
        kelurahanDesa: d.yayasan?.kelurahanDesa || 'GEMPOL SARI',
        alamat: d.yayasan?.alamat || 'Jl. Gempol Asri Raya No 84, Malausma, Kabupaten Majalengka, Jawa Barat',
        kodePos: d.yayasan?.kodePos || '40215',
        email: d.yayasan?.email || 'darma.bhandawakulinari@gmail.com',
        teleponHp: d.yayasan?.teleponHp || '082315167789'
      },
      rekeningBank: {
        namaBank: d.rekeningBank?.namaBank || 'BANK BNI',
        nomorRekening: d.rekeningBank?.nomorRekening || '2917122527',
        namaPemilikRekening: d.rekeningBank?.namaPemilikRekening || 'Benteng Generasi Mandiri Yayasan',
        namaBankVirtualAccount: d.rekeningBank?.namaBankVirtualAccount || 'BANK BNI',
        nomorVirtualAccount: d.rekeningBank?.nomorVirtualAccount || '5268080020571600',
        namaVirtualAccount: d.rekeningBank?.namaVirtualAccount || '205716 OWJZUCPO DARMA BAND (IDR)'
      },
      kasatpel: {
        nama: d.kasatpel?.nama || 'Ginanjar Surya Hardiansyah',
        email: d.kasatpel?.email || 'ginanjarsuryah@gmail.com',
        noHp: d.kasatpel?.noHp || '082120018449'
      },
      mitraEksternal: {
        jenisMitra: d.mitraEksternal?.jenisMitra || 'Yayasan',
        namaMitra: d.mitraEksternal?.namaMitra || 'Global Humanis Indonesia',
        namaPimpinan: d.mitraEksternal?.namaPimpinan || 'Yogie Subagya',
        noHp: d.mitraEksternal?.noHp || '081210576976',
        email: d.mitraEksternal?.email || 'globalhumanisindonesia@gmail.com',
        bentukDukungan: d.mitraEksternal?.bentukDukungan || 'Lahan, Bangunan, Alat Makan, Alat Masak, Kendaraan, Tenaga Kerja (Relawan)',
        provinsi: d.mitraEksternal?.provinsi || 'DKI JAKARTA',
        kabKota: d.mitraEksternal?.kabKota || 'KOTA ADM. JAKARTA SELATAN',
        kecamatan: d.mitraEksternal?.kecamatan || 'KEBAYORAN BARU',
        kelurahanDesa: d.mitraEksternal?.kelurahanDesa || 'GANDARIA UTARA',
        alamat: d.mitraEksternal?.alamat || 'Komplek Ruko Radio Dalam Square Nomr 1B',
        kodePos: d.mitraEksternal?.kodePos || '12140'
      },
      perwakilanYayasan: {
        namaPerwakilan: d.perwakilanYayasan?.namaPerwakilan || 'DEVI NURJAMAN',
        nik: d.perwakilanYayasan?.nik || '3205121311960006',
        email: d.perwakilanYayasan?.email || 'dnur9414@gmail.com',
        noHp: d.perwakilanYayasan?.noHp || '089507760120'
      },
      id: d.id,
      profilSppgId: d.profilSppgId
    };
  });
  const [loading, setLoading] = useState(false);

  // Helper to handle nested state updates
  const handleNestedChange = (section: string, field: string, value: string) => {
    setFormData((prev: any) => ({
      ...prev,
      [section]: {
        ...(prev[section] || {}),
        [field]: value
      }
    }));
  };

  const handleChange = (field: string, value: any) => {
    setFormData((prev: any) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Remove fields that should not be updated directly like id, user, createdAt
      const { id, user, createdAt, updatedAt, sppgName, idSppg: _skip, profilSppgId, ...updateData } = formData as any;
      // Note: id here is user.id, not profilSppgId because we pass user object
      
      let res;
      if (mode === 'edit') {
        res = await fetch(`/api/users/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updateData)
        });
      } else {
        res = await fetch(`/api/users`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updateData)
        });
      }
      if (res.ok) {
        onSuccess();
      } else {
        const errorData = await res.json().catch(() => ({}));
        alert(`Gagal menyimpan profil. ${errorData.error || ''}`);
      }
    } catch (error) {
      alert('Terjadi kesalahan.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-xl w-full max-w-4xl shadow-xl overflow-hidden max-h-[90vh] flex flex-col">
        <div className="flex justify-between items-center px-6 py-4 border-b border-slate-200 sticky top-0 bg-white z-10">
          <h3 className="font-bold text-slate-800 text-lg">
            {mode === 'edit' ? 'Edit Data Profil SPPG & Yayasan' : (mode === 'copy' ? 'Salin & Buat Profil Baru' : 'Buat Akun & Profil Baru')}
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 bg-slate-100 p-1.5 rounded-full">
            <X size={20} />
          </button>
        </div>
        
        <div className="p-6 overflow-y-auto flex-1">
          <form id="edit-profile-form" onSubmit={handleSubmit} className="space-y-8">
            
            {/* Informasi Akun Login */}
            <section>
              <h4 className="font-semibold text-slate-700 mb-4 border-b pb-2">Informasi Akun Login</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input label="Username" value={formData.username || ''} onChange={(v) => handleChange('username', v)} />
                <Input label="Password Baru" value={formData.password || ''} onChange={(v) => handleChange('password', v)} type="password" />
                <p className="col-span-1 md:col-span-2 text-xs text-slate-500 italic">
                  * Biarkan password kosong jika tidak ingin mengubahnya.
                </p>
              </div>
            </section>
            
            {isAdmin && (
              <>
                {/* Identitas SPPG */}
                <section>
                  <h4 className="fontsemibold text-slate-700 mb-4 border-b pb-2">Identitas SPPG</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input label="ID SPPG" value={formData.idSppg || ''} onChange={(v) => handleChange('idSppg', v)} />
                <Input label="Nomor BA. Verval" value={formData.nomorBaVerval || ''} onChange={(v) => handleChange('nomorBaVerval', v)} />
                <Input label="Tanggal BA. Verval" type="date" value={formData.tanggalBaVerval ? new Date(formData.tanggalBaVerval).toISOString().split('T')[0] : ''} onChange={(v) => handleChange('tanggalBaVerval', v ? new Date(v).toISOString() : '')} />
                <Input label="Status Operasional" value={formData.statusOperasional || ''} onChange={(v) => handleChange('statusOperasional', v)} />
                <Input label="Tanggal Operasional" type="date" value={formData.tanggalOperasional ? new Date(formData.tanggalOperasional).toISOString().split('T')[0] : ''} onChange={(v) => handleChange('tanggalOperasional', v ? new Date(v).toISOString() : '')} />
                <Input label="Kode SPPG" value={formData.kodeSppg || ''} onChange={(v) => handleChange('kodeSppg', v)} />
                <Input label="Nama SPPG" value={formData.namaSppg || ''} onChange={(v) => handleChange('namaSppg', v)} />
                <Input label="Provinsi" value={formData.provinsi || ''} onChange={(v) => handleChange('provinsi', v)} />
                <Input label="Kab./Kota" value={formData.kabKota || ''} onChange={(v) => handleChange('kabKota', v)} />
                <Input label="Kecamatan" value={formData.kecamatan || ''} onChange={(v) => handleChange('kecamatan', v)} />
                <Input label="Kelurahan/Desa" value={formData.kelurahanDesa || ''} onChange={(v) => handleChange('kelurahanDesa', v)} />
                <Input label="Alamat" value={formData.alamat || ''} onChange={(v) => handleChange('alamat', v)} />
                <Input label="Kode Pos" value={formData.kodePos || ''} onChange={(v) => handleChange('kodePos', v)} />
                <Input label="Posisi Latitude" type="number" value={formData.posisiLatitude || ''} onChange={(v) => handleChange('posisiLatitude', v ? parseFloat(v) : null)} />
                <Input label="Posisi Longitude" type="number" value={formData.posisiLongitude || ''} onChange={(v) => handleChange('posisiLongitude', v ? parseFloat(v) : null)} />
                <Input label="Jenis Bangunan" value={formData.jenisBangunan || ''} onChange={(v) => handleChange('jenisBangunan', v)} />
                <Input label="Jenis SPPG" value={formData.jenisSppg || ''} onChange={(v) => handleChange('jenisSppg', v)} />
              </div>
            </section>

            {/* Identitas Yayasan */}
            <section>
              <h4 className="font-semibold text-slate-700 mb-4 border-b pb-2">Identitas Yayasan</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input label="Nama Yayasan" value={formData.yayasan?.namaYayasan || ''} onChange={(v) => handleNestedChange('yayasan', 'namaYayasan', v)} />
                <Input label="NPWP" value={formData.yayasan?.npwp || ''} onChange={(v) => handleNestedChange('yayasan', 'npwp', v)} />
                <Input label="Provinsi" value={formData.yayasan?.provinsi || ''} onChange={(v) => handleNestedChange('yayasan', 'provinsi', v)} />
                <Input label="Kab./Kota" value={formData.yayasan?.kabKota || ''} onChange={(v) => handleNestedChange('yayasan', 'kabKota', v)} />
                <Input label="Kecamatan" value={formData.yayasan?.kecamatan || ''} onChange={(v) => handleNestedChange('yayasan', 'kecamatan', v)} />
                <Input label="Kelurahan/Desa" value={formData.yayasan?.kelurahanDesa || ''} onChange={(v) => handleNestedChange('yayasan', 'kelurahanDesa', v)} />
                <Input label="Alamat" value={formData.yayasan?.alamat || ''} onChange={(v) => handleNestedChange('yayasan', 'alamat', v)} />
                <Input label="Kode Pos" value={formData.yayasan?.kodePos || ''} onChange={(v) => handleNestedChange('yayasan', 'kodePos', v)} />
                <Input label="Email" type="email" value={formData.yayasan?.email || ''} onChange={(v) => handleNestedChange('yayasan', 'email', v)} />
                <Input label="Telepon/HP" value={formData.yayasan?.teleponHp || ''} onChange={(v) => handleNestedChange('yayasan', 'teleponHp', v)} />
              </div>
            </section>

            {/* Rekening Bank */}
            <section>
              <h4 className="font-semibold text-slate-700 mb-4 border-b pb-2">Data Bank/Rekening</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input label="Nama Bank" value={formData.rekeningBank?.namaBank || ''} onChange={(v) => handleNestedChange('rekeningBank', 'namaBank', v)} />
                <Input label="Nomor Rekening" value={formData.rekeningBank?.nomorRekening || ''} onChange={(v) => handleNestedChange('rekeningBank', 'nomorRekening', v)} />
                <Input label="Nama Pemilik Rekening" value={formData.rekeningBank?.namaPemilikRekening || ''} onChange={(v) => handleNestedChange('rekeningBank', 'namaPemilikRekening', v)} />
                <Input label="Nama Bank Virtual Account" value={formData.rekeningBank?.namaBankVirtualAccount || ''} onChange={(v) => handleNestedChange('rekeningBank', 'namaBankVirtualAccount', v)} />
                <Input label="Nomor Virtual Account" value={formData.rekeningBank?.nomorVirtualAccount || ''} onChange={(v) => handleNestedChange('rekeningBank', 'nomorVirtualAccount', v)} />
                <Input label="Nama Virtual Account" value={formData.rekeningBank?.namaVirtualAccount || ''} onChange={(v) => handleNestedChange('rekeningBank', 'namaVirtualAccount', v)} />
              </div>
            </section>

            {/* Kasatpel */}
            <section>
              <h4 className="font-semibold text-slate-700 mb-4 border-b pb-2">Data SPPI/Kasatpel/Ka SPPG</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input label="Nama" value={formData.kasatpel?.nama || ''} onChange={(v) => handleNestedChange('kasatpel', 'nama', v)} />
                <Input label="Email" type="email" value={formData.kasatpel?.email || ''} onChange={(v) => handleNestedChange('kasatpel', 'email', v)} />
                <Input label="No. HP/Telepon" value={formData.kasatpel?.noHp || ''} onChange={(v) => handleNestedChange('kasatpel', 'noHp', v)} />
              </div>
            </section>

            {/* Mitra Eksternal */}
            <section>
              <h4 className="font-semibold text-slate-700 mb-4 border-b pb-2">Identitas Mitra</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input label="Jenis Mitra/Instansi" value={formData.mitraEksternal?.jenisMitra || ''} onChange={(v) => handleNestedChange('mitraEksternal', 'jenisMitra', v)} />
                <Input label="Nama Mitra/Instansi" value={formData.mitraEksternal?.namaMitra || ''} onChange={(v) => handleNestedChange('mitraEksternal', 'namaMitra', v)} />
                <Input label="Nama Pimpinan" value={formData.mitraEksternal?.namaPimpinan || ''} onChange={(v) => handleNestedChange('mitraEksternal', 'namaPimpinan', v)} />
                <Input label="No. HP/Telepon" value={formData.mitraEksternal?.noHp || ''} onChange={(v) => handleNestedChange('mitraEksternal', 'noHp', v)} />
                <Input label="Email" type="email" value={formData.mitraEksternal?.email || ''} onChange={(v) => handleNestedChange('mitraEksternal', 'email', v)} />
                <Input label="Bentuk dukungan/aset" value={formData.mitraEksternal?.bentukDukungan || ''} onChange={(v) => handleNestedChange('mitraEksternal', 'bentukDukungan', v)} />
                <Input label="Provinsi" value={formData.mitraEksternal?.provinsi || ''} onChange={(v) => handleNestedChange('mitraEksternal', 'provinsi', v)} />
                <Input label="Kab./Kota" value={formData.mitraEksternal?.kabKota || ''} onChange={(v) => handleNestedChange('mitraEksternal', 'kabKota', v)} />
                <Input label="Kecamatan" value={formData.mitraEksternal?.kecamatan || ''} onChange={(v) => handleNestedChange('mitraEksternal', 'kecamatan', v)} />
                <Input label="Kelurahan/Desa" value={formData.mitraEksternal?.kelurahanDesa || ''} onChange={(v) => handleNestedChange('mitraEksternal', 'kelurahanDesa', v)} />
                <Input label="Alamat" value={formData.mitraEksternal?.alamat || ''} onChange={(v) => handleNestedChange('mitraEksternal', 'alamat', v)} />
                <Input label="Kode Pos" value={formData.mitraEksternal?.kodePos || ''} onChange={(v) => handleNestedChange('mitraEksternal', 'kodePos', v)} />
              </div>
            </section>

            {/* Perwakilan Yayasan */}
            <section>
              <h4 className="font-semibold text-slate-700 mb-4 border-b pb-2">Data Perwakilan Yayasan</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input label="Nama Perwakilan" value={formData.perwakilanYayasan?.namaPerwakilan || ''} onChange={(v) => handleNestedChange('perwakilanYayasan', 'namaPerwakilan', v)} />
                <Input label="NIK" value={formData.perwakilanYayasan?.nik || ''} onChange={(v) => handleNestedChange('perwakilanYayasan', 'nik', v)} />
                <Input label="Email" type="email" value={formData.perwakilanYayasan?.email || ''} onChange={(v) => handleNestedChange('perwakilanYayasan', 'email', v)} />
                <Input label="No. HP/Telepon" value={formData.perwakilanYayasan?.noHp || ''} onChange={(v) => handleNestedChange('perwakilanYayasan', 'noHp', v)} />
              </div>
            </section>
            </>
            )}

          </form>
        </div>
        
        <div className="p-6 border-t border-slate-200 bg-slate-50 flex justify-end gap-3 rounded-b-xl shrink-0">
          <button type="button" onClick={onClose} disabled={loading} className="px-5 py-2.5 border border-slate-300 rounded-lg text-slate-700 bg-white hover:bg-slate-100 font-medium shadow-sm transition-colors">
            Batal
          </button>
          <button type="submit" form="edit-profile-form" disabled={loading} className="px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium shadow-sm transition-colors flex items-center gap-2">
            {loading ? 'Menyimpan...' : 'Simpan Perubahan'}
          </button>
        </div>
      </div>
    </div>
  );
}

function Input({ label, value, onChange, type = 'text' }: { label: string, value: string | number, onChange: (v: any) => void, type?: string }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">{label}</label>
      <input 
        type={type} 
        value={value} 
        onChange={(e) => onChange(e.target.value)} 
        className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm text-slate-900 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-white" 
      />
    </div>
  );
}
