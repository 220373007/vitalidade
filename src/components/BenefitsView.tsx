import React, { useMemo, useState } from 'react';
import { Check, Copy, Percent, PlusCircle, Search, Ticket } from 'lucide-react';
import { Partner, PartnerCategory, Voucher } from '../types/vitalidade';
import { formatBRL } from '../utils/format';

interface BenefitsViewProps {
  partners: Partner[];
  vouchers: Voucher[];
  onOpenPartner: (partner: Partner) => void;
  onLogPurchase: (partner: Partner, amount: number) => void;
}

const CATEGORIES: PartnerCategory[] = [
  'Todos',
  'Farmácias',
  'Exames & Labs',
  'Academia & Nutrição',
  'Saúde Mental',
];

export const BenefitsView: React.FC<BenefitsViewProps> = ({
  partners,
  vouchers,
  onOpenPartner,
  onLogPurchase,
}) => {
  const [category, setCategory] = useState<PartnerCategory>('Todos');
  const [query, setQuery] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Quick receipt registration form state
  const [selectedPartnerId, setSelectedPartnerId] = useState(partners[0]?.id ?? '');
  const [purchaseAmount, setPurchaseAmount] = useState('120');

  const filteredPartners = useMemo(() => {
    return partners.filter((p) => {
      const catOk = category === 'Todos' || p.category === category;
      const q = query.trim().toLowerCase();
      const qOk =
        !q ||
        p.name.toLowerCase().includes(q) ||
        p.tagline.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q);
      return catOk && qOk;
    });
  }, [partners, category, query]);

  const handleCopyCode = (voucher: Voucher) => {
    navigator.clipboard?.writeText(voucher.code);
    setCopiedId(voucher.id);
    setTimeout(() => setCopiedId(null), 1800);
  };

  const selectedPartner = partners.find((p) => p.id === selectedPartnerId) ?? partners[0];
  const parsedAmount = Number(purchaseAmount.replace(',', '.')) || 0;
  const estimatedCashback = selectedPartner
    ? Math.min(
        (parsedAmount * selectedPartner.cashbackPercent) / 100,
        selectedPartner.maxCashbackPerMonth
      )
    : 0;

  const handleRegisterReceipt = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPartner || parsedAmount < selectedPartner.minSpend) return;
    onLogPurchase(selectedPartner, parsedAmount);
  };

  return (
    <div className="space-y-6 lg:space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <p className="text-[13px] font-medium text-[#7A8580]">
            Rede conveniada <span aria-hidden="true">·</span> Vouchers e Cashback
          </p>
          <h1 className="mt-1 text-[26px] sm:text-[32px] font-bold tracking-[-0.02em] text-[#0F2D24]">
            Benefícios e Parceiros
          </h1>
        </div>
      </div>

      {/* Active Vouchers + Receipt Calculator Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Left 7 cols: Active Vouchers */}
        <section
          aria-label="Seus vouchers ativos"
          className="lg:col-span-7 rounded-[22px] bg-[#FFFFFF] p-5 sm:p-6 card-elevation-1 flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between gap-3 pb-3 border-b border-[#E8EBE8]">
              <h2 className="text-[17px] font-bold text-[#0F2D24] flex items-center gap-2">
                <Ticket className="w-5 h-5 text-[#0B4D3A]" strokeWidth={1.75} />
                Meus vouchers ativos
              </h2>
              <span className="text-[12px] font-semibold text-[#7A8580] tabular-nums">
                {vouchers.length} disponíveis
              </span>
            </div>

            {vouchers.length === 0 ? (
              <p className="py-6 text-[14px] text-[#7A8580]">
                Nenhum voucher gerado ainda. Selecione um parceiro abaixo para ativar seu código.
              </p>
            ) : (
              <div className="divide-y divide-[#E8EBE8]">
                {vouchers.map((voucher) => {
                  const isCopied = copiedId === voucher.id;
                  return (
                    <div
                      key={voucher.id}
                      className="py-3.5 flex flex-wrap items-center justify-between gap-3"
                    >
                      <div>
                        <p className="text-[15px] font-bold text-[#0F2D24]">
                          {voucher.partnerName}
                        </p>
                        <p className="text-[12px] text-[#7A8580]">
                          {voucher.cashbackPercent}% de cashback <span aria-hidden="true">·</span>{' '}
                          Válido até {voucher.expiresAt}
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <code className="px-3 py-1.5 rounded-xl bg-[#F1F2F1] text-[#0B4D3A] font-semibold text-[13px] tracking-wide tabular-nums">
                          {voucher.code}
                        </code>
                        <button
                          type="button"
                          onClick={() => handleCopyCode(voucher)}
                          className="font-label h-[38px] px-3.5 rounded-full bg-[#DDE9C8] hover:bg-[#C8EE6B] text-[#0B4D3A] text-[12px] font-semibold inline-flex items-center gap-1.5 transition-colors cursor-pointer"
                        >
                          {isCopied ? (
                            <>
                              <Check className="w-3.5 h-3.5" strokeWidth={2.2} />
                              Copiado
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5" strokeWidth={1.75} />
                              Copiar
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </section>

        {/* Right 5 cols: Register Receipt / Simulate Cashback */}
        <section
          aria-label="Registrar nota fiscal de parceiro"
          className="lg:col-span-5 rounded-[22px] bg-[#0B4D3A] p-5 sm:p-6 text-white card-elevation-hero"
        >
          <h2 className="text-[17px] font-bold text-white flex items-center gap-2">
            <PlusCircle className="w-5 h-5 text-[#C8EE6B]" strokeWidth={1.75} />
            Registrar compra com cupom fiscal
          </h2>
          <p className="text-[13px] text-[#b2efd5] mt-1">
            Comprou presencialmente sem informar o CPF? Lance o valor da nota para creditar seu retorno.
          </p>

          <form onSubmit={handleRegisterReceipt} className="mt-4 space-y-3.5">
            <div>
              <label
                htmlFor="partner-select"
                className="block font-label text-[12px] font-semibold text-[#b2efd5] mb-1.5"
              >
                Estabelecimento parceiro
              </label>
              <select
                id="partner-select"
                value={selectedPartnerId}
                onChange={(e) => setSelectedPartnerId(e.target.value)}
                className="w-full h-[48px] px-4 rounded-[16px] bg-[#FFFFFF] text-[#0F2D24] text-[14px] font-semibold focus:outline-none focus:ring-2 focus:ring-[#C8EE6B]"
              >
                {partners.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} ({p.cashbackPercent}% cashback)
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3 items-end">
              <div>
                <label
                  htmlFor="receipt-amount"
                  className="block font-label text-[12px] font-semibold text-[#b2efd5] mb-1.5"
                >
                  Valor da compra (R$)
                </label>
                <input
                  id="receipt-amount"
                  type="number"
                  min={selectedPartner?.minSpend ?? 1}
                  step="0.01"
                  value={purchaseAmount}
                  onChange={(e) => setPurchaseAmount(e.target.value)}
                  className="w-full h-[48px] px-4 rounded-[16px] bg-[#FFFFFF] text-[#0F2D24] text-[15px] font-bold tabular-nums focus:outline-none focus:ring-2 focus:ring-[#C8EE6B]"
                />
              </div>

              <div className="h-[48px] px-4 rounded-[16px] bg-[#10503d] flex flex-col justify-center">
                <span className="text-[11px] text-[#b2efd5]">Retorno estimado</span>
                <span className="text-[15px] font-extrabold text-[#C8EE6B] tabular-nums">
                  +{formatBRL(estimatedCashback)}
                </span>
              </div>
            </div>

            {selectedPartner && parsedAmount < selectedPartner.minSpend && (
              <p className="text-[12px] text-[#ffdad6]">
                Valor mínimo para {selectedPartner.name}: {formatBRL(selectedPartner.minSpend)}.
              </p>
            )}

            <button
              type="submit"
              disabled={!selectedPartner || parsedAmount < selectedPartner.minSpend}
              className="w-full font-label h-[48px] px-5 rounded-full bg-[#C8EE6B] hover:bg-[#b9e257] disabled:opacity-50 text-[#0B4D3A] text-[14px] font-bold transition-transform active:scale-[0.98] cursor-pointer"
            >
              Creditar cashback na carteira
            </button>
          </form>
        </section>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="relative w-full lg:max-w-[380px]">
          <Search
            className="w-4 h-4 text-[#7A8580] absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none"
            strokeWidth={1.75}
          />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar farmácia, laboratório ou academia..."
            aria-label="Buscar parceiro"
            className="w-full h-[52px] pl-11 pr-4 rounded-full bg-[#FFFFFF] border-[1.5px] border-[#E2E5E2] text-[14px] text-[#0F2D24] placeholder:text-[#7A8580] focus:outline-none focus:border-[#0B4D3A] focus:ring-4 focus:ring-[#DDE9C8]/70 transition-all"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {CATEGORIES.map((cat) => {
            const isSelected = category === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setCategory(cat)}
                className={`font-label min-h-[40px] px-4 py-2 rounded-full text-[13px] font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  isSelected
                    ? 'bg-[#0B4D3A] text-white'
                    : 'bg-[#FFFFFF] text-[#404944] border border-[#E2E5E2] hover:bg-[#F1F2F1]'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* Partner Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredPartners.map((partner) => (
          <article
            key={partner.id}
            className="rounded-[22px] bg-[#FFFFFF] p-5 sm:p-6 card-elevation-1 flex flex-col justify-between gap-5"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between gap-3">
                <div className="w-11 h-11 rounded-2xl bg-[#F1F2F1] text-[#0B4D3A] flex items-center justify-center font-bold text-[14px]">
                  {partner.initials}
                </div>
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#DDE9C8] border border-[#C8EE6B] text-[#0B4D3A] font-label text-[12px] font-bold tabular-nums">
                  <Percent className="w-3 h-3" strokeWidth={2.2} />
                  {partner.cashbackPercent}% cashback
                </span>
              </div>

              <div>
                <h3 className="text-[17px] font-bold text-[#0F2D24]">{partner.name}</h3>
                <p className="text-[12px] text-[#7A8580] mt-0.5">
                  {partner.category} <span aria-hidden="true">·</span> Mínimo{' '}
                  <span className="tabular-nums">{formatBRL(partner.minSpend)}</span>
                </p>
              </div>

              <p className="text-[13px] text-[#404944] leading-relaxed">
                {partner.tagline}
              </p>
            </div>

            <button
              type="button"
              onClick={() => onOpenPartner(partner)}
              className="w-full font-label h-[46px] px-5 rounded-full bg-[#F1F2F1] hover:bg-[#DDE9C8] text-[#0B4D3A] text-[13px] font-semibold transition-colors cursor-pointer"
            >
              Gerar voucher e ver regras
            </button>
          </article>
        ))}
      </div>
    </div>
  );
};
