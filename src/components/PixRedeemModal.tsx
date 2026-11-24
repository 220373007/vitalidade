import React, { useState } from 'react';
import { ArrowUpRight, CheckCircle2, X } from 'lucide-react';
import { UserProfile } from '../types/vitalidade';
import { formatBRL } from '../utils/format';

interface PixRedeemModalProps {
  availableBalance: number;
  profile: UserProfile;
  onClose: () => void;
  onConfirmRedeem: (amount: number, pixKey: string) => void;
}

export const PixRedeemModal: React.FC<PixRedeemModalProps> = ({
  availableBalance,
  profile,
  onClose,
  onConfirmRedeem,
}) => {
  const [amountInput, setAmountInput] = useState(
    availableBalance >= 100 ? '100' : availableBalance.toFixed(2)
  );
  const [pixKey, setPixKey] = useState(profile.pixKeyValue);
  const [completedAmount, setCompletedAmount] = useState<number | null>(null);

  const parsedAmount = Number(amountInput.replace(',', '.')) || 0;
  const isValid = parsedAmount > 0 && parsedAmount <= availableBalance && pixKey.trim().length > 2;

  const quickPresets = [50, 100, 200].filter((v) => v < availableBalance);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) return;
    onConfirmRedeem(parsedAmount, pixKey.trim());
    setCompletedAmount(parsedAmount);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="pix-modal-title"
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-[#0F2D24]/35 backdrop-blur-sm p-0 sm:p-4"
    >
      <div className="w-full sm:max-w-[480px] rounded-t-[24px] sm:rounded-[24px] bg-[#FFFFFF] p-6 modal-elevation">
        {/* Mobile grab handle */}
        <div className="sm:hidden w-10 h-1.5 bg-[#E2E5E2] rounded-full mx-auto mb-4" />

        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="font-label text-[12px] font-semibold text-[#0B4D3A]">
              Transferência gratuita instantânea
            </p>
            <h2
              id="pix-modal-title"
              className="mt-0.5 text-[22px] font-bold text-[#0F2D24]"
            >
              Resgatar cashback via Pix
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Fechar janela de resgate"
            className="w-10 h-10 rounded-full bg-[#F1F2F1] hover:bg-[#E2E5E2] text-[#0F2D24] flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" strokeWidth={1.75} />
          </button>
        </div>

        {completedAmount !== null ? (
          <div className="mt-6 py-4 text-center space-y-4">
            <div className="w-14 h-14 rounded-full bg-[#DDE9C8] text-[#0B4D3A] flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" strokeWidth={2} />
            </div>
            <div>
              <h3 className="text-[20px] font-bold text-[#0F2D24]">
                Pix de {formatBRL(completedAmount)} enviado
              </h3>
              <p className="text-[14px] text-[#7A8580] mt-1">
                Transferido para a chave {profile.pixKeyType}: {pixKey}. O comprovante já está disponível no seu extrato.
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="w-full font-label h-[50px] rounded-full bg-[#0B4D3A] text-white text-[15px] font-semibold cursor-pointer"
            >
              Concluir
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-5 space-y-5">
            <div className="p-4 rounded-[16px] bg-[#F1F2F1] flex items-center justify-between">
              <span className="text-[13px] text-[#404944]">Saldo disponível</span>
              <span className="text-[18px] font-extrabold text-[#0B4D3A] tabular-nums">
                {formatBRL(availableBalance)}
              </span>
            </div>

            <div>
              <label
                htmlFor="redeem-amount"
                className="block font-label text-[13px] font-semibold text-[#0F2D24] mb-1.5"
              >
                Quanto deseja resgatar? (R$)
              </label>
              <input
                id="redeem-amount"
                type="number"
                step="0.01"
                min="1"
                max={availableBalance}
                value={amountInput}
                onChange={(e) => setAmountInput(e.target.value)}
                className="w-full h-[52px] px-4 rounded-[16px] bg-[#FFFFFF] border-[1.5px] border-[#E2E5E2] text-[18px] font-bold text-[#0F2D24] tabular-nums focus:outline-none focus:border-[#0B4D3A] focus:ring-4 focus:ring-[#DDE9C8]/70"
              />

              <div className="flex flex-wrap gap-2 mt-2.5">
                {quickPresets.map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => setAmountInput(preset.toString())}
                    className="font-label h-[34px] px-3.5 rounded-full bg-[#F1F2F1] hover:bg-[#DDE9C8] text-[#0B4D3A] text-[12px] font-semibold tabular-nums transition-colors cursor-pointer"
                  >
                    {formatBRL(preset)}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => setAmountInput(availableBalance.toFixed(2))}
                  className="font-label h-[34px] px-3.5 rounded-full bg-[#DDE9C8] text-[#0B4D3A] text-[12px] font-semibold transition-colors cursor-pointer"
                >
                  Saldo total
                </button>
              </div>
            </div>

            <div>
              <label
                htmlFor="redeem-pix-key"
                className="block font-label text-[13px] font-semibold text-[#0F2D24] mb-1.5"
              >
                Chave Pix ({profile.pixKeyType})
              </label>
              <input
                id="redeem-pix-key"
                type="text"
                value={pixKey}
                onChange={(e) => setPixKey(e.target.value)}
                className="w-full h-[52px] px-4 rounded-[16px] bg-[#FFFFFF] border-[1.5px] border-[#E2E5E2] text-[14px] text-[#0F2D24] focus:outline-none focus:border-[#0B4D3A] focus:ring-4 focus:ring-[#DDE9C8]/70"
              />
            </div>

            {parsedAmount > availableBalance && (
              <p className="text-[13px] text-[#ba1a1a]">
                O valor informado excede seu saldo disponível ({formatBRL(availableBalance)}).
              </p>
            )}

            <button
              type="submit"
              disabled={!isValid}
              className="w-full font-label h-[52px] px-6 rounded-full bg-[#C8EE6B] hover:bg-[#b9e257] disabled:opacity-50 text-[#0F2D24] text-[15px] font-bold inline-flex items-center justify-center gap-2 transition-transform active:scale-[0.98] cursor-pointer"
            >
              Confirmar transferência Pix
              <ArrowUpRight className="w-4 h-4" strokeWidth={2.2} />
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
