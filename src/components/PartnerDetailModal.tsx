import React, { useState } from 'react';
import { Check, Copy, Percent, Ticket, X } from 'lucide-react';
import { Partner, Voucher } from '../types/vitalidade';
import { formatBRL } from '../utils/format';

interface PartnerDetailModalProps {
  partner: Partner;
  existingVoucher?: Voucher;
  onClose: () => void;
  onGenerateVoucher: (partner: Partner) => Voucher;
}

export const PartnerDetailModal: React.FC<PartnerDetailModalProps> = ({
  partner,
  existingVoucher,
  onClose,
  onGenerateVoucher,
}) => {
  const [voucher, setVoucher] = useState<Voucher | undefined>(existingVoucher);
  const [copied, setCopied] = useState(false);

  const handleActivate = () => {
    const created = onGenerateVoucher(partner);
    setVoucher(created);
  };

  const handleCopy = () => {
    if (!voucher) return;
    navigator.clipboard?.writeText(voucher.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="partner-modal-title"
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-[#0F2D24]/35 backdrop-blur-sm p-0 sm:p-4"
    >
      <div className="w-full sm:max-w-[500px] rounded-t-[24px] sm:rounded-[24px] bg-[#FFFFFF] p-6 modal-elevation space-y-5">
        <div className="sm:hidden w-10 h-1.5 bg-[#E2E5E2] rounded-full mx-auto" />

        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-[#0B4D3A] text-white flex items-center justify-center font-bold text-[15px] shrink-0">
              {partner.initials}
            </div>
            <div>
              <p className="text-[12px] font-medium text-[#7A8580]">{partner.category}</p>
              <h2 id="partner-modal-title" className="text-[20px] font-bold text-[#0F2D24]">
                {partner.name}
              </h2>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Fechar detalhes do parceiro"
            className="w-10 h-10 rounded-full bg-[#F1F2F1] hover:bg-[#E2E5E2] text-[#0F2D24] flex items-center justify-center cursor-pointer"
          >
            <X className="w-5 h-5" strokeWidth={1.75} />
          </button>
        </div>

        <div className="p-4 rounded-[18px] bg-[#DDE9C8] flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-[#0B4D3A] font-bold text-[15px]">
            <Percent className="w-4 h-4" strokeWidth={2.2} />
            <span>{partner.cashbackPercent}% de cashback garantido</span>
          </div>
          <span className="text-[12px] font-semibold text-[#0B4D3A] tabular-nums">
            Teto {formatBRL(partner.maxCashbackPerMonth)}/mês
          </span>
        </div>

        <div className="space-y-2">
          <h3 className="text-[14px] font-bold text-[#0F2D24]">Regras de utilização</h3>
          <p className="text-[14px] text-[#404944] leading-relaxed">{partner.rules}</p>
          <p className="text-[13px] text-[#7A8580]">
            Compra mínima elegível:{' '}
            <strong className="text-[#0F2D24] tabular-nums">
              {formatBRL(partner.minSpend)}
            </strong>
          </p>
        </div>

        {voucher ? (
          <div className="p-4 rounded-[18px] bg-[#F1F2F1] space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[12px] font-semibold text-[#0B4D3A] flex items-center gap-1.5">
                <Ticket className="w-4 h-4" strokeWidth={1.75} />
                Voucher ativo · Válido até {voucher.expiresAt}
              </span>
            </div>
            <div className="flex items-center justify-between gap-3">
              <code className="text-[17px] font-extrabold tracking-wider text-[#0F2D24] tabular-nums">
                {voucher.code}
              </code>
              <button
                type="button"
                onClick={handleCopy}
                className="font-label h-[42px] px-4 rounded-full bg-[#C8EE6B] text-[#0B4D3A] text-[13px] font-semibold inline-flex items-center gap-1.5 cursor-pointer"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4" strokeWidth={2.2} />
                    Copiado
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" strokeWidth={1.75} />
                    Copiar código
                  </>
                )}
              </button>
            </div>
          </div>
        ) : (
          <button
            type="button"
            onClick={handleActivate}
            className="w-full font-label h-[52px] px-6 rounded-full bg-[#C8EE6B] hover:bg-[#b9e257] text-[#0F2D24] text-[15px] font-bold transition-transform active:scale-[0.98] cursor-pointer"
          >
            Gerar voucher de {partner.cashbackPercent}% cashback
          </button>
        )}
      </div>
    </div>
  );
};
