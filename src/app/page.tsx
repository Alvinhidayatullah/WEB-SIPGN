import { Info, RefreshCw, Eye, Edit, AlertCircle, Home, FileText, Briefcase, Users, HelpCircle, Ticket, Menu, Search, Bell, Grid, User, Plus } from "lucide-react";
import Image from "next/image";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import UserListClient from "@/components/UserListClient";
import LogoutButton from "@/components/LogoutButton";
import { redirect } from "next/navigation";

export default async function ProfilMitraSppg() {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    redirect("/login");
  }

  const isAdmin = (session?.user as { role?: string })?.role === "ADMIN";

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      {/* Sidebar */}
      {isAdmin && (
        <aside className="hidden md:flex w-16 bg-white border-r flex-col items-center py-4 space-y-8 z-10 shrink-0">
        <Image src="/Logo-mbg.png" alt="Logo MBG" width={40} height={40} className="object-contain" />
        <nav className="flex flex-col space-y-6">
          <button className="text-slate-400 hover:text-blue-600"><Home size={20} /></button>
          <button className="text-slate-400 hover:text-blue-600"><FileText size={20} /></button>
          <button className="text-blue-600 bg-blue-50 p-2 rounded-lg relative">
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            <Users size={20} />
          </button>
          <button className="text-slate-400 hover:text-blue-600"><Briefcase size={20} /></button>
          <button className="text-slate-400 hover:text-blue-600"><HelpCircle size={20} /></button>
          <button className="text-slate-400 hover:text-blue-600"><Ticket size={20} /></button>
        </nav>
        </aside>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        {isAdmin && (
          <header className="bg-white border-b h-14 flex items-center justify-between px-4 shrink-0">
          <div className="flex items-center space-x-6 h-full">
            <button className="text-slate-500"><Menu size={20} /></button>
            <nav className="hidden md:flex h-full text-sm font-medium">
              <a href="#" className="flex items-center px-4 h-full text-slate-600 hover:text-blue-600">Dashboards</a>
              <a href="#" className="flex items-center px-4 h-full text-blue-600 border-b-2 border-blue-600">Referensi</a>
              <a href="#" className="flex items-center px-4 h-full text-slate-600 hover:text-blue-600">Laporan Harian</a>
              <a href="#" className="flex items-center px-4 h-full text-slate-600 hover:text-blue-600">Keuangan</a>
              <a href="#" className="flex items-center px-4 h-full text-slate-600 hover:text-blue-600">Lain-lain</a>
            </nav>
          </div>
          <div className="flex items-center space-x-4 text-slate-500">
            <button><Grid size={18} /></button>
            <button><Bell size={18} /></button>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-sm">
                A
              </div>
              <LogoutButton isAdmin={isAdmin} />
            </div>
          </div>
          </header>
        )}

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <div className="w-full space-y-6">
            {/* User List and Actions */}
            <UserListClient isAdmin={isAdmin} />

          </div>
          
          <footer className="mt-12 pb-4 text-xs text-slate-500 text-left">
            Sistem Manajemen Operasional© 2026 All Right Reserved.
          </footer>
        </main>
      </div>

      {/* Floating Action Buttons */}
      <div className="fixed bottom-6 right-6 flex flex-col gap-3">
        <button className="w-12 h-12 bg-blue-600 hover:bg-blue-700 text-white rounded-full flex items-center justify-center shadow-lg relative">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m13 17 5-5-5-5M6 17l5-5-5-5"/></svg>
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center border-2 border-white">2</span>
        </button>
        <button className="w-12 h-12 bg-green-500 hover:bg-green-600 text-white rounded-full flex items-center justify-center shadow-lg relative">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 21l1.65-3.8a9 9 0 1 1 3.4 2.9L3 21"/></svg>
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center border-2 border-white">4</span>
        </button>
      </div>
    </div>
  );
}
