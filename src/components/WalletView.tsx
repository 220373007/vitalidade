import React, { useMemo, useState } from 'react';
import { ArrowDownLeft, ArrowUpRight, Clock, Download, Search } from 'lucide-react';
import { Transaction, TransactionType } from '../types/vitalidade';
import { exportTransactionsCSV, formatBRL } from '../utils/format';

interface WalletViewProps {
  availableBalance: number;
  pendingBalance: number;
  annualSavings: number;
  transactions: Transaction[];
  onOpenRedeem: () => void;
}

export const WalletView: React.FC<WalletViewProps> = ({
  availableBalance,
  pendingBalance,
  annualSavings,
  transactions,
  onOpenRedeem,
}) => {
  const [filterType, setFilterType] = useState<'todos' | TransactionType>('todos');
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    return transactions.filter((tx) => {
      const typeOk = filterType === 'todos' || tx.type === filterType;
      const q = query.trim().toLowerCase();
      const qOk =
        !q ||
        tx.merchant.toLowerCase().includes(q) ||
        tx.title.toLowerCase().includes(q) ||
        tx.reference.toLowerCase().includes(q);
      return typeOk && qOk;
    });
  }, [transactions, filterType, query]);

  return (
    <div className="space-y-6 lg:space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <p className="text-[13px] font-medium text-[#7A8580]">
            Carteira Vitalidade <span aria-hidden="true">·</span> Transferências via Pix
          </p>
          <h1 className="mt-1 text-[26px] sm:text-[32px] font-bold tracking-[-0.02em] text-[#0F2D24]">
            Extrato e Cashback
          </h1>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => exportTransactionsCSV(filtered)}
            className="font-label h-[44px] px-4 rounded-full bg-[#FFFFFF] border border-[#E2E5E2] hover:bg-[#F1F2F1] text-[#0B4D3A] text-[13px] font-semibold inline-flex items-center gap-2 transition-colors whitespace-nowrap cursor-pointer"
          >
            <Download className="w-4 h-4" strokeWidth={1.75} />
            Exportar CSV
          </button>
          <button
            type="button"
            onClick={onOpenRedeem}
            className="font-label h-[44px] px-5 rounded-full bg-[#C8EE6B] hover:bg-[#b9e257] text-[#0F2D24] text-[13px] font-semibold inline-flex items-center gap-2 transition-colors whitespace-nowrap cursor-pointer"
          >
            Resgatar via Pix
            <ArrowUpRight className="w-4 h-4" strokeWidth={2} />
          </button>
        </div>
      </div>

      {/* 3-KPI Summary Strip */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="rounded-[22px] bg-[#0B4D3A] p-5 text-white card-elevation-hero">
          <p className="text-[12px] font-medium text-[#b2efd5]">
            Disponível para resgate imediato
          </p>
          <p className="mt-2 text-[30px] font-extrabold tracking-[-0.02em] tabular-nums">
            {formatBRL(availableBalance)}
          </p>
        </div>

        <div className="rounded-[22px] bg-[#FFFFFF] p-5 card-elevation-1">
          <p className="text-[12px] font-medium text-[#7A8580]">
            Em análise (liberação em até 48h)
          </p>
          <p className="mt-2 text-[30px] font-extrabold tracking-[-0.02em] text-[#0F2D24] tabular-nums">
            {formatBRL(pendingBalance)}
          </p>
        </div>

        <div className="rounded-[22px] bg-[#FFFFFF] p-5 card-elevation-1">
          <p className="text-[12px] font-medium text-[#7A8580]">
            Total acumulado em 2026
          </p>
          <p className="mt-2 text-[30px] font-extrabold tracking-[-0.02em] text-[#0B4D3A] tabular-nums">
            {formatBRL(annualSavings)}
          </p>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="rounded-[22px] bg-[#FFFFFF] p-5 sm:p-6 card-elevation-1 space-y-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div
            role="tablist"
            aria-label="Filtrar movimentações"
            className="inline-flex items-center p-1 bg-[#EAECEA] rounded-full self-start overflow-x-auto max-w-full"
          >
            {[
              { id: 'todos' as const, label: 'Todos' },
              { id: 'cashback' as const, label: 'Cashback ganho' },
              { id: 'resgate' as const, label: 'Resgates Pix' },
              { id: 'pendente' as const, label: 'Pendentes' },
            ].map((item) => {
              const active = filterType === item.id;
              return (
                <button
                  key={item.id}
                  role="tab"
                  type="button"
                  aria-selected={active}
                  onClick={() => setFilterType(item.id)}
                  className={`font-label min-h-[38px] px-4 py-1.5 rounded-full text-[13px] font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    active
                      ? 'bg-[#FFFFFF] text-[#0B4D3A]'
                      : 'text-[#404944] hover:text-[#0F2D24]'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </div>

          <div className="relative w-full lg:max-w-[320px]">
            <Search
              className="w-4 h-4 text-[#7A8580] absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none"
              strokeWidth={1.75}
            />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar no extrato..."
              aria-label="Buscar no extrato"
              className="w-full h-[46px] pl-11 pr-4 rounded-full bg-[#F4F5F4] border border-[#E2E5E2] text-[14px] text-[#0F2D24] placeholder:text-[#7A8580] focus:outline-none focus:border-[#0B4D3A] focus:bg-[#FFFFFF]"
            />
          </div>
        </div>

        {/* Ledger Rows */}
        {filtered.length === 0 ? (
          <div className="py-10 text-center">
            <p className="text-[15px] font-semibold text-[#0F2D24]">
              Nenhuma movimentação encontrada
            </p>
            <p className="text-[13px] text-[#7A8580] mt-1">
              Ajuste os filtros acima para visualizar seu histórico completo.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-[#E8EBE8]">
            {filtered.map((tx) => {
              const isRedeem = tx.type === 'resgate';
              const isPending = tx.type === 'pendente';
              return (
                <div
                  key={tx.id}
                  className="py-4 flex items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                        isRedeem
                          ? 'bg-[#F1F2F1] text-[#404944]'
                          : isPending
                          ? 'bg-[#EAECEA] text-[#7A8580]'
                          : 'bg-[#DDE9C8] text-[#0B4D3A]'
                      }`}
                    >
                      {isRedeem ? (
                        <ArrowUpRight className="w-4 h-4" strokeWidth={2} />
                      ) : isPending ? (
                        <Clock className="w-4 h-4" strokeWidth={2} />
                      ) : (
                        <ArrowDownLeft className="w-4 h-4" strokeWidth={2} />
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="text-[15px] font-semibold text-[#0F2D24] truncate">
                        {tx.title}
                      </p>
                      <p className="text-[12px] text-[#7A8580] truncate mt-0.5">
                        {tx.date} <span aria-hidden="true">·</span> {tx.merchant}{' '}
                        <span aria-hidden="true">·</span> {tx.reference}
                      </p>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <p
                      className={`text-[15px] font-bold tabular-nums ${
                        isRedeem
                          ? 'text-[#404944]'
                          : isPending
                          ? 'text-[#7A8580]'
                          : 'text-[#0B4D3A]'
                      }`}
                    >
                      {isRedeem ? '−' : '+'} {formatBRL(tx.amount)}
                    </p>
                    <p className="text-[11px] font-medium text-[#7A8580]">
                      {isRedeem
                        ? 'Pix enviado'
                        : isPending
                        ? 'Aguardando confirmação'
                        : 'Liberado'}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
