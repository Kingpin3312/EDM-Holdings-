"use client";
import Link from "next/link";
import { ReactNode, useState } from "react";
import {
  LayoutDashboard, Users, FileText, Calculator, Building2, ClipboardList,
  GitPullRequest, MessageSquare, ShieldCheck, HardHat, ShoppingCart, Wallet,
  FolderOpen, Sparkles, Layers, Menu, X,
  Plug, UserCheck,
} from "lucide-react";

const nav = [
  { href: "/dashboard", label: "Executive", icon: LayoutDashboard },
  { href: "/tenders", label: "Tenders", icon: FileText },
  { href: "/projects", label: "Projects", icon: Building2 },
  { href: "/crm", label: "CRM", icon: Users },
  { href: "/estimating", label: "Estimating", icon: Calculator },
  { href: "/labour", label: "Labour", icon: UserCheck },
  { href: "/site", label: "Site reports", icon: ClipboardList },
  { href: "/trades", label: "Trade progress", icon: Layers },
  { href: "/variations", label: "Variations", icon: GitPullRequest },
  { href: "/rfis", label: "RFIs", icon: MessageSquare },
  { href: "/quality", label: "Quality", icon: ShieldCheck },
  { href: "/hse", label: "HSE", icon: HardHat },
  { href: "/procurement", label: "Procurement", icon: ShoppingCart },
  { href: "/finance", label: "Finance", icon: Wallet },
  { href: "/documents", label: "Documents", icon: FolderOpen },
  { href: "/ai", label: "AI assistant", icon: Sparkles },
  { href: "/settings/integrations", label: "Integrations", icon: Plug },
];

function SidebarBody({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <>
      <div className="px-5 py-5 border-b border-white/10 flex items-center gap-3">
        <img src="/edm-cube.svg" alt="EDM" className="w-8 h-8 bg-white rounded p-1 shrink-0" />
        <div>
          <div className="font-bold text-[15px] leading-none">EDM<span className="text-white/70"> OS</span></div>
          <div className="text-[9px] tracking-[0.3em] text-white/60 mt-1.5">CONSTRUCTION OS</div>
        </div>
      </div>
      <nav className="flex-1 py-3 overflow-y-auto">
        {nav.map((n) => (
          <Link key={n.href} href={n.href} onClick={onNavigate}
            className="flex items-center gap-3 px-5 py-2 text-[13px] text-white/80 hover:bg-white/10 hover:text-white transition-colors">
            <n.icon size={16} className="shrink-0" />{n.label}
          </Link>
        ))}
      </nav>
      <div className="px-5 py-3 border-t border-white/10 text-[11px] text-white/55">EDM Holdings · Dubai</div>
    </>
  );
}

export function Shell({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="min-h-screen flex">
      {/* Desktop sidebar */}
      <aside className="hidden md:flex w-56 shrink-0 bg-emerald text-white flex-col">
        <SidebarBody />
      </aside>

      {/* Mobile drawer */}
      {open && (
        <div className="md:hidden fixed inset-0 z-40">
          <div className="absolute inset-0 bg-black/40" onClick={() => setOpen(false)} aria-hidden />
          <aside className="absolute left-0 top-0 bottom-0 w-64 bg-emerald text-white flex flex-col shadow-xl">
            <button onClick={() => setOpen(false)} aria-label="Close menu" className="absolute top-4 right-4 text-white/80 hover:text-white"><X size={20} /></button>
            <SidebarBody onNavigate={() => setOpen(false)} />
          </aside>
        </div>
      )}

      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-14 bg-white border-b border-line flex items-center justify-between px-4 md:px-6">
          <div className="flex items-center gap-3">
            <button onClick={() => setOpen(true)} aria-label="Open menu" className="md:hidden text-charcoal-muted hover:text-charcoal"><Menu size={22} /></button>
            <div className="hidden md:block text-sm text-charcoal-muted">Dubai · Abu Dhabi · Sharjah</div>
            <div className="md:hidden flex items-center gap-2">
              <img src="/edm-cube.svg" alt="EDM" className="w-6 h-6" />
              <div className="font-bold text-[14px]">EDM<span className="text-emerald"> OS</span></div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <div className="text-[13px] font-semibold leading-none">Damien Meenan</div>
              <div className="text-[11px] text-charcoal-muted">Owner</div>
            </div>
            <div className="w-8 h-8 rounded-full bg-emerald text-white grid place-items-center text-[12px] font-bold">DM</div>
          </div>
        </header>
        <main className="flex-1 p-4 md:p-6 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
