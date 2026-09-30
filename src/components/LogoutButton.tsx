"use client";
import { LogOut } from "lucide-react";
import { signOut } from "next-auth/react";

export default function LogoutButton({ isAdmin = false }: { isAdmin?: boolean }) {
  return (
    <button 
      onClick={() => signOut({ callbackUrl: isAdmin ? '/secure-mbg' : '/login' })}
      className="flex items-center gap-2 text-sm text-slate-500 hover:text-red-600 transition-colors bg-slate-100 hover:bg-red-50 px-3 py-1.5 rounded-md border border-slate-200 hover:border-red-200 ml-2"
      title="Keluar"
    >
      <LogOut size={16} />
      <span className="hidden md:inline">Logout</span>
    </button>
  );
}
