import React from 'react';
import { LogIn, UserCheck } from 'lucide-react';
import { NavTab } from '../types/vitalidade';

interface TopBarProps {
  activeTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  onOpenRedeem: () => void;
  user?: { email?: string; name?: string } | null;
  onOpenAuth: () => void;
}

const NAV_ITEMS: { id: NavTab; label: string }[] = [
  { id: 'inicio', label: 'Início' },
  { id: 'saude', label: 'Saúde' },
  { id: 'beneficios', label: 'Benefícios' },
  { id: 'extrato', label: 'Extrato' },
  { id: 'apolice', label: 'Apólice' },
];

export const TopBar: React.FC<TopBarProps> = ({
  activeTab,
  onSelectTab,
  onOpenRedeem,
  user,
  onOpenAuth,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-[#FFFFFF]/95 backdrop-blur-md border-b border-[#E2E5E2]">
      {/* Desktop Top Bar */}
      <div className="hidden md:flex max-w-[1200px] mx-auto items-center justify-between gap-6 px-8 lg:px-12 h-[68px]">
        {/* Zone 1: Wordmark */}
        <button
          type="button"
          onClick={() => onSelectTab('inicio')}
          className="text-[20px] font-extrabold tracking-[-0.02em] text-[#0B4D3A] whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#0B4D3A] rounded-lg"
        >
          Vitalidade
        </button>

        {/* Zone 2: Navigation Links */}
        <nav className="flex items-center gap-7" aria-label="Navegação principal">
          {NAV_ITEMS.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onSelectTab(item.id)}
                className={`relative py-2 text-[14px] font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#0B4D3A] rounded-md ${
                  isActive
                    ? 'text-[#0B4D3A]'
                    : 'text-[#7A8580] hover:text-[#0F2D24]'
                }`}
              >
                {item.label}
                {isActive && (
                  <span
                    aria-hidden="true"
                    className="absolute left-0 right-0 -bottom-[1px] h-[2.5px] rounded-full bg-[#0B4D3A]"
                  />
                )}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: Actions (Auth + Pix CTA) */}
        <div className="flex items-center gap-3 shrink-0">
          {user ? (
            <button
              type="button"
              onClick={() => onSelectTab('apolice')}
              className="h-[40px] px-3.5 rounded-full border border-[#E2E5E2] hover:bg-[#F2F4F2] text-[#0F2D24] text-[13px] font-medium flex items-center gap-2 transition-colors cursor-pointer"
              title={user.email}
            >
              <span className="w-2 h-2 rounded-full bg-[#0B4D3A] animate-pulse" />
              <UserCheck className="w-4 h-4 text-[#0B4D3A]" />
              <span className="max-w-[120px] truncate">{user.name || user.email?.split('@')[0]}</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={onOpenAuth}
              className="h-[40px] px-4 rounded-full border border-[#0B4D3A] text-[#0B4D3A] hover:bg-[#0B4D3A]/5 text-[13px] font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <LogIn className="w-4 h-4" />
              <span>Entrar</span>
            </button>
          )}

          <button
            type="button"
            onClick={onOpenRedeem}
            className="font-label h-[44px] px-5 rounded-full bg-[#C8EE6B] hover:bg-[#b9e257] text-[#0F2D24] text-[14px] font-semibold transition-transform active:scale-[0.98] whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0B4D3A]"
          >
            Resgatar Pix
          </button>
        </div>
      </div>

      {/* Mobile Compact Header */}
      <div className="flex md:hidden items-center justify-between px-5 h-[52px]">
        <button
          type="button"
          onClick={() => onSelectTab('inicio')}
          className="text-[18px] font-extrabold tracking-[-0.02em] text-[#0B4D3A] whitespace-nowrap shrink-0"
        >
          Vitalidade
        </button>

        <div className="flex items-center gap-2">
          {user ? (
            <button
              type="button"
              onClick={() => onSelectTab('apolice')}
              className="p-1.5 rounded-full text-[#0B4D3A] bg-[#0B4D3A]/10"
              title={user.email}
            >
              <UserCheck className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={onOpenAuth}
              className="px-3 py-1 text-[12px] font-semibold text-[#0B4D3A] border border-[#0B4D3A] rounded-full"
            >
              Entrar
            </button>
          )}

          <button
            type="button"
            onClick={onOpenRedeem}
            className="font-label min-h-[36px] px-4 py-1.5 rounded-full bg-[#C8EE6B] text-[#0F2D24] text-[13px] font-semibold active:scale-[0.98] transition-transform whitespace-nowrap shrink-0"
          >
            Resgatar Pix
          </button>
        </div>
      </div>
    </header>
  );
};
