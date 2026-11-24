import React from 'react';
import { Home, Stethoscope, Gift, ReceiptText, ShieldCheck } from 'lucide-react';
import { NavTab } from '../types/vitalidade';

interface MobileBottomNavProps {
  activeTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
}

const TABS: { id: NavTab; label: string; Icon: React.FC<{ className?: string; strokeWidth?: number }> }[] = [
  { id: 'inicio', label: 'Início', Icon: Home },
  { id: 'saude', label: 'Saúde', Icon: Stethoscope },
  { id: 'beneficios', label: 'Benefícios', Icon: Gift },
  { id: 'extrato', label: 'Extrato', Icon: ReceiptText },
  { id: 'apolice', label: 'Apólice', Icon: ShieldCheck },
];

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  activeTab,
  onSelectTab,
}) => {
  return (
    <nav
      aria-label="Navegação inferior"
      className="md:hidden fixed bottom-0 left-0 right-0 z-30 h-[60px] bg-[#FFFFFF]/95 backdrop-blur-md border-t border-[#E2E5E2] grid grid-cols-5 items-center px-2"
    >
      {TABS.map(({ id, label, Icon }) => {
        const isActive = activeTab === id;
        return (
          <button
            key={id}
            type="button"
            onClick={() => onSelectTab(id)}
            className="flex flex-col items-center justify-center min-h-[44px] w-full rounded-xl transition-colors focus-visible:outline-2 focus-visible:outline-[#0B4D3A]"
          >
            <div
              className={`flex items-center justify-center w-10 h-7 rounded-full transition-colors ${
                isActive ? 'bg-[#DDE9C8] text-[#0B4D3A]' : 'text-[#7A8580]'
              }`}
            >
              <Icon className="w-[19px] h-[19px]" strokeWidth={isActive ? 2 : 1.75} />
            </div>
            <span
              className={`font-label text-[10px] mt-0.5 leading-tight whitespace-nowrap ${
                isActive ? 'font-bold text-[#0B4D3A]' : 'font-semibold text-[#7A8580]'
              }`}
            >
              {label}
            </span>
          </button>
        );
      })}
    </nav>
  );
};
