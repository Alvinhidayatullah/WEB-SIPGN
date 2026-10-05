'use client';
import { useState, useEffect, useRef } from 'react';
import { Plus, X, RefreshCw, Trash2, Upload } from 'lucide-react';
import ProfilDetailCard from './ProfilDetailCard';
import EditProfileModal from './EditProfileModal';
import Image from 'next/image';
import LogoutButton from './LogoutButton';

type UserData = {
  id: string;
  username: string;
  sppgName?: string;
  profilSppg?: Record<string, string>;
  profilSppgId?: string | null;
};

export default function UserListClient({ isAdmin }: { isAdmin: boolean }) {
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isImporting, setIsImporting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Modal states
  const [isEditProfileModalOpen, setIsEditProfileModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'edit' | 'copy' | 'create'>('edit');
  const [editingProfileData, setEditingProfileData] = useState<any>(null);
  const [isDeletingId, setIsDeletingId] = useState<string | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const fetchUsers = async (page = 1) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/users?page=${page}&limit=10`);
      if (res.ok) {
        const json = await res.json();
        setUsers(json.data || json); // Support both paginated and old unpaginated format
        if (json.meta) {
          setTotalPages(json.meta.totalPages);
          setCurrentPage(json.meta.page);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchMe = async () => {
    try {
      const res = await fetch('/api/users/me');
      if (res.ok) {
        const data = await res.json();
        setUsers([data]);
      } else {
        // Fallback to mock if failed
        setUsers([{ id: 'mock', username: 'user_sppg_bogor', sppgName: 'SPPG Bogor Jonggol Sukamaju 3' }]);
      }
    } catch (err) {
      console.error(err);
      setUsers([{ id: 'mock', username: 'user_sppg_bogor', sppgName: 'SPPG Bogor Jonggol Sukamaju 3' }]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAdmin) {
      fetchUsers(currentPage);
    } else {
      fetchMe();
    }
  }, [isAdmin]);

  const handleDeleteUser = async (id: string) => {
    setIsDeletingId(id);
    setDeleteConfirmId(null);
    try {
      const res = await fetch(`/api/users/${id}`, { method: 'DELETE' });
      if (res.ok) {
        alert('Data akun dan profil berhasil dihapus secara permanen.');
        fetchUsers();
      } else {
        alert('Gagal menghapus user. Silakan coba lagi.');
      }
    } catch (err) {
      alert('Error saat menghapus user.');
    } finally {
      setIsDeletingId(null);
    }
  };

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsImporting(true);
    try {
      const XLSX = await import('xlsx');
      const reader = new FileReader();
      reader.onload = async (evt) => {
        const bstr = evt.target?.result;
        const wb = XLSX.read(bstr, { type: 'binary' });
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];
        const data = XLSX.utils.sheet_to_json(ws);

        if (data.length === 0) {
          alert('File Excel kosong atau tidak terbaca.');
          setIsImporting(false);
          return;
        }

        // Map column names dynamically if they differ, but we assume exact mapping or fallback
        const formattedData = data.map((row: any) => ({
          username: row['Username'] || row['username'] || undefined,
          namaSppg: row['Nama SPPG'] || row['namaSppg'] || row['Nama'] || undefined,
          kodeSppg: row['Kode SPPG'] || row['kodeSppg'] || undefined,
          nomorBaVerval: row['No BA Verval'] || row['nomorBaVerval'] || undefined,
          provinsi: row['Provinsi'] || row['provinsi'] || undefined,
          kabKota: row['Kab/Kota'] || row['kabKota'] || undefined,
          kecamatan: row['Kecamatan'] || row['kecamatan'] || undefined,
          kelurahanDesa: row['Kelurahan'] || row['kelurahanDesa'] || undefined,
          alamat: row['Alamat'] || row['alamat'] || undefined,
          statusOperasional: row['Status'] || row['statusOperasional'] || undefined,
        }));

        const res = await fetch('/api/users/import', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ users: formattedData })
        });
        const result = await res.json();

        if (res.ok) {
          let msg = `Berhasil mengimpor ${result.successCount} data akun & profil.\n(Default password: mbg123)`;
          if (result.errors && result.errors.length > 0) {
            msg += `\n\nBeberapa data gagal diproses:\n${result.errors.slice(0, 5).join('\n')}`;
            if (result.errors.length > 5) msg += `\n...dan ${result.errors.length - 5} error lainnya.`;
          }
          alert(msg);
          fetchUsers();
        } else {
          alert(result.error || 'Gagal mengimpor data.');
        }
        setIsImporting(false);
      };
      reader.readAsBinaryString(file);
    } catch (error) {
      alert('Error membaca file Excel.');
      setIsImporting(false);
    }
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const openCreateModal = () => {
    setEditingProfileData({ username: '', password: '' });
    setModalMode('create');
    setIsEditProfileModalOpen(true);
  };

  const openCopyModal = (user: UserData) => {
    setEditingProfileData({
      ...user.profilSppg,
      username: '',
      password: '',
      sppgName: user.profilSppg?.namaSppg || user.sppgName
    });
    setModalMode('copy');
    setIsEditProfileModalOpen(true);
  };

  const openEditProfileModal = (user: UserData) => {
    setEditingProfileData({
      ...user.profilSppg,
      id: user.id, // We need to send to PUT /api/users/[user.id]
      profilSppgId: user.profilSppgId,
      username: user.username,
      password: ''
    });
    setModalMode('edit');
    setIsEditProfileModalOpen(true);
  };

  if (loading) return <div className="p-8 text-center">Loading...</div>;

  return (
    <>
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-4">
          <Image src="/Logo-mbg.png" alt="Logo MBG" width={56} height={56} className="object-contain" />
          <div>
            <h1 className="text-2xl font-semibold text-slate-800">Profil Mitra & SPPG</h1>
            <div className="text-sm text-slate-500 mt-1">
              Home - Mitra & SPPG - Profil Mitra & SPPG - <span className="text-slate-700">Profil SPPG & Yayasan</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {!isAdmin && (
            <>
              <a href="/" className="flex items-center gap-2 px-4 py-2 border border-slate-300 rounded-md text-slate-700 bg-white hover:bg-slate-50 text-sm font-medium shadow-sm">
                <RefreshCw size={16} /> Dashboards
              </a>
              <LogoutButton isAdmin={isAdmin} />
            </>
          )}
          {isAdmin && (
            <div className="flex gap-2">
              <input 
                type="file" 
                accept=".xlsx, .xls" 
                className="hidden" 
                ref={fileInputRef} 
                onChange={handleImport} 
              />
              <a 
                href="/Template_Import_MBG.xlsx"
                download
                className="flex items-center gap-2 px-4 py-2 border border-slate-300 text-slate-700 bg-white rounded-md hover:bg-slate-50 text-sm font-medium shadow-sm"
              >
                Unduh Template
              </a>
              <button 
                onClick={() => fileInputRef.current?.click()}
                disabled={isImporting}
                className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 text-sm font-medium shadow-sm disabled:opacity-50"
              >
                <Upload size={16} /> {isImporting ? 'Memproses...' : 'Import Excel'}
              </button>
              <button 
                onClick={openCreateModal}
                className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 text-sm font-medium shadow-sm"
              >
                <Plus size={16} /> Buat Akun & Profil Baru
              </button>
            </div>
          )}
        </div>
      </div>

      {/* User List */}
      <div className="w-full space-y-6">
        {users.map((user, i) => (
          <div key={user.id || i} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="bg-slate-50 px-4 md:px-6 py-4 border-b flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                <div className="flex items-center gap-4">
                  {isAdmin && (
                    <div className="flex-shrink-0 w-10 h-10 bg-indigo-100 text-indigo-700 font-bold rounded-full flex items-center justify-center shadow-sm border border-indigo-200 text-lg">
                      {(currentPage - 1) * 10 + i + 1}
                    </div>
                  )}
                  <div>
                    <h2 className="text-lg font-bold text-slate-800">Akun: {user.username}</h2>
                    <p className="text-sm text-slate-500">Profil SPPG & Yayasan</p>
                  </div>
                </div>
              </div>
            <ProfilDetailCard 
              isAdmin={isAdmin} 
              profile={{...user.profilSppg, username: user.username, sppgName: user.profilSppg?.namaSppg || user.sppgName}} 
              onEditAccount={() => openEditProfileModal(user)} 
              onDeleteAccount={() => setDeleteConfirmId(user.id)}
              isDeleting={isDeletingId === user.id}
              onCopyAccount={() => openCopyModal(user)}
              onEditProfile={() => openEditProfileModal(user)}
              onRefresh={() => fetchUsers()}
            />
          </div>
        ))}
      </div>

      {/* Pagination Controls */}
      {isAdmin && totalPages > 1 && (
        <div className="flex items-center justify-between bg-white px-4 py-3 border border-slate-200 sm:px-6 rounded-xl mt-6 shadow-sm">
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-slate-700">
                Menampilkan halaman <span className="font-medium">{currentPage}</span> dari <span className="font-medium">{totalPages}</span>
              </p>
            </div>
            <div>
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                <button
                  onClick={() => fetchUsers(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-slate-300 bg-white text-sm font-medium text-slate-500 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="sr-only">Previous</span>
                  <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </button>
                <button
                  onClick={() => fetchUsers(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-slate-300 bg-white text-sm font-medium text-slate-500 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="sr-only">Next</span>
                  <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                </button>
              </nav>
            </div>
          </div>
          {/* Mobile pagination */}
          <div className="flex flex-1 justify-between sm:hidden">
            <button
              onClick={() => fetchUsers(currentPage - 1)}
              disabled={currentPage === 1}
              className="relative inline-flex items-center px-4 py-2 border border-slate-300 text-sm font-medium rounded-md text-slate-700 bg-white hover:bg-slate-50 disabled:opacity-50"
            >
              Previous
            </button>
            <button
              onClick={() => fetchUsers(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="relative inline-flex items-center px-4 py-2 border border-slate-300 text-sm font-medium rounded-md text-slate-700 bg-white hover:bg-slate-50 disabled:opacity-50 ml-3"
            >
              Next
            </button>
          </div>
        </div>
      )}

      
      {/* Edit Profile Modal */}
      {isEditProfileModalOpen && editingProfileData && (
        <EditProfileModal 
          mode={modalMode}
          isAdmin={isAdmin}
          profile={editingProfileData} 
          onClose={() => setIsEditProfileModalOpen(false)} 
          onSuccess={() => {
            setIsEditProfileModalOpen(false);
            fetchUsers();
          }} 
        />
      )}

      {/* Custom Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6">
              <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mb-4 text-red-600">
                <Trash2 size={24} />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-2">Konfirmasi Penghapusan</h3>
              <p className="text-slate-600 mb-6 leading-relaxed">
                Apakah Anda yakin ingin menghapus akun ini? 
                <strong className="block mt-2 text-red-600">Peringatan:</strong> Segala data profil, yayasan, dan rekening terkait juga akan dihapus permanen dan tidak dapat dipulihkan.
              </p>
              <div className="flex gap-3 justify-end">
                <button 
                  onClick={() => setDeleteConfirmId(null)}
                  className="px-4 py-2 border border-slate-300 rounded-md text-slate-700 font-medium hover:bg-slate-50 transition-colors"
                >
                  Batal
                </button>
                <button 
                  onClick={() => handleDeleteUser(deleteConfirmId)}
                  className="px-4 py-2 bg-red-600 text-white rounded-md font-medium hover:bg-red-700 shadow-sm transition-colors"
                >
                  Ya, Hapus Permanen
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
