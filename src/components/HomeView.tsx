import React, { useState } from 'react';
import {
  ArrowRight,
  ArrowUpRight,
  Calendar,
  CreditCard,
  Percent,
  Sparkles,
  Stethoscope,
  Video,
} from 'lucide-react';
import {
  Appointment,
  NavTab,
  Partner,
  Transaction,
  UserProfile,
} from '../types/vitalidade';
import { formatBRL } from '../utils/format';

interface HomeViewProps {
  profile: UserProfile;
  availableBalance: number;
  pendingBalance: number;
  weeklyGain: number;
  appointments: Appointment[];
  partners: Partner[];
  transactions: Transaction[];
  onNavigate: (tab: NavTab) => void;
  onOpenRedeem: () => void;
  onOpenPartner: (partner: Partner) => void;
  onOpenTeleconsulta: (appointment: Appointment) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  profile,
  availableBalance,
  pendingBalance,
  weeklyGain,
  appointments,
  partners,
  transactions,
  onNavigate,
  onOpenRedeem,
  onOpenPartner,
  onOpenTeleconsulta,
}) => {
  const [focusSegment, setFocusSegment] = useState<'beneficios' | 'saude'>('beneficios');

  const activeAppointments = appointments.filter((a) => a.status === 'confirmada');
  const nextAppointment = activeAppointments[0];
  const featuredPartners = partners.filter((p) => p.featured).slice(0, 4);
  const recentTransactions = transactions.slice(0, 4);

  return (
    <div className="space-y-6 lg:space-y-8">
      {/* Header Greeting & Unboxed Plan Metadata */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <p className="text-[13px] font-medium text-[#7A8580]">
            {profile.company} <span aria-hidden="true">·</span> {profile.planName}
          </p>
          <h1 className="mt-1 text-[26px] sm:text-[32px] font-bold tracking-[-0.02em] text-[#0F2D24] leading-[1.2]">
            Olá, {profile.name.split(' ')[0]}
          </h1>
        </div>

        {/* Pill Tabs Control (Benefícios / Saúde) */}
        <div
          role="tablist"
          aria-label="Foco da tela inicial"
          className="inline-flex items-center p-1 bg-[#EAECEA] rounded-full self-start sm:self-auto"
        >
          <button
            role="tab"
            type="button"
            aria-selected={focusSegment === 'beneficios'}
            onClick={() => setFocusSegment('beneficios')}
            className={`font-label min-h-[40px] px-5 py-2 rounded-full text-[13px] font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              focusSegment === 'beneficios'
                ? 'bg-[#DDE9C8] text-[#0B4D3A]'
                : 'text-[#404944] hover:text-[#0F2D24]'
            }`}
          >
            Benefícios
          </button>
          <button
            role="tab"
            type="button"
            aria-selected={focusSegment === 'saude'}
            onClick={() => setFocusSegment('saude')}
            className={`font-label min-h-[40px] px-5 py-2 rounded-full text-[13px] font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              focusSegment === 'saude'
                ? 'bg-[#DDE9C8] text-[#0B4D3A]'
                : 'text-[#404944] hover:text-[#0F2D24]'
            }`}
          >
            Saúde
          </button>
        </div>
      </div>

      {/* Main 12-column responsive grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column (7 cols on desktop): Hero Cashback Card + Next Consultation or Partners */}
        <div className="lg:col-span-7 space-y-6">
          {/* Hero Cashback Card (#0B4D3A, radius 24px, luminous elevation) */}
          <section
            aria-label="Saldo de cashback acumulado"
            className="relative overflow-hidden rounded-[24px] bg-[#0B4D3A] p-6 sm:p-8 text-white card-elevation-hero"
          >
            {/* Subtle botanical vector motif in corner */}
            <svg
              aria-hidden="true"
              className="pointer-events-none absolute -right-10 -top-10 w-64 h-64 text-[#81bda4] opacity-15"
              viewBox="0 0 200 200"
              fill="none"
            >
              <circle cx="130" cy="70" r="90" stroke="currentColor" strokeWidth="1.5" />
              <circle cx="145" cy="85" r="62" stroke="currentColor" strokeWidth="1.5" />
              <path
                d="M70 150C95 100 135 65 190 45"
                stroke="#C8EE6B"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>

            <div className="relative z-10 flex flex-col gap-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <span className="font-label text-[13px] font-semibold tracking-[0.02em] text-[#b2efd5]">
                  Saldo de cashback disponível
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#C8EE6B] text-[#0B4D3A] font-label text-[11px] font-bold tracking-[0.02em] whitespace-nowrap">
                  <Sparkles className="w-3.5 h-3.5" strokeWidth={2} />
                  +15% cashback esta semana
                </span>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-baseline gap-2 sm:gap-5">
                <p className="text-[36px] sm:text-[42px] font-extrabold leading-[1.1] tracking-[-0.02em] text-white tabular-nums">
                  {formatBRL(availableBalance)}
                </p>
                <p className="text-[13px] text-[#b2efd5] tabular-nums">
                  +{formatBRL(weeklyGain)} nos últimos 7 dias{' '}
                  <span aria-hidden="true">·</span> {formatBRL(pendingBalance)} a liberar
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3 pt-1">
                <button
                  type="button"
                  onClick={onOpenRedeem}
                  className="font-label h-[48px] sm:h-[52px] px-6 rounded-full bg-[#C8EE6B] hover:bg-[#b9e257] text-[#0B4D3A] text-[15px] font-semibold inline-flex items-center gap-2 transition-transform active:scale-[0.98] whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C8EE6B]"
                >
                  Resgatar via Pix
                  <ArrowUpRight className="w-4 h-4" strokeWidth={2.2} />
                </button>
                <button
                  type="button"
                  onClick={() => onNavigate('extrato')}
                  className="font-label h-[48px] sm:h-[52px] px-5 rounded-full bg-[#10503d] hover:bg-[#16624b] text-[#e8f3ed] text-[14px] font-semibold inline-flex items-center gap-2 transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#b2efd5]"
                >
                  Extrato detalhado
                </button>
              </div>
            </div>
          </section>

          {/* Dynamic Primary Content depending on Benefícios vs Saúde segmented tab */}
          {focusSegment === 'beneficios' ? (
            <section
              aria-labelledby="partners-heading"
              className="rounded-[22px] bg-[#FFFFFF] p-5 sm:p-6 card-elevation-1"
            >
              <div className="flex items-center justify-between gap-4 pb-4 border-b border-[#E8EBE8]">
                <div>
                  <h2
                    id="partners-heading"
                    className="text-[18px] sm:text-[20px] font-bold text-[#0F2D24] tracking-[-0.01em]"
                  >
                    Parceiros com cashback turbinado
                  </h2>
                  <p className="text-[13px] text-[#7A8580] mt-0.5">
                    Ative o voucher antes da compra para receber retorno direto na carteira
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => onNavigate('beneficios')}
                  className="font-label text-[13px] font-semibold text-[#0B4D3A] hover:underline inline-flex items-center gap-1 whitespace-nowrap shrink-0 cursor-pointer min-h-[40px]"
                >
                  Ver todos
                  <ArrowRight className="w-4 h-4" strokeWidth={1.75} />
                </button>
              </div>

              <div className="divide-y divide-[#E8EBE8]">
                {featuredPartners.map((partner) => (
                  <button
                    key={partner.id}
                    type="button"
                    onClick={() => onOpenPartner(partner)}
                    className="w-full py-4 flex items-center justify-between gap-4 text-left hover:bg-[#F1FCF6]/70 -mx-2 px-2 rounded-xl transition-colors cursor-pointer group"
                  >
                    <div className="flex items-center gap-3.5 min-w-0">
                      <div className="w-11 h-11 rounded-2xl bg-[#F1F2F1] text-[#0B4D3A] flex items-center justify-center font-bold text-[14px] shrink-0 group-hover:bg-[#DDE9C8] transition-colors">
                        {partner.initials}
                      </div>
                      <div className="min-w-0">
                        <p className="text-[15px] font-semibold text-[#0F2D24] truncate">
                          {partner.name}
                        </p>
                        <p className="text-[12px] text-[#7A8580] truncate mt-0.5">
                          {partner.category} <span aria-hidden="true">·</span> Compra mínima{' '}
                          <span className="tabular-nums">{formatBRL(partner.minSpend)}</span>
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-[#DDE9C8] border border-[#C8EE6B] text-[#0B4D3A] font-label text-[12px] font-bold tabular-nums whitespace-nowrap">
                        <Percent className="w-3 h-3" strokeWidth={2.2} />
                        {partner.cashbackPercent}% volta
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </section>
          ) : (
            <section
              aria-labelledby="health-overview-heading"
              className="rounded-[22px] bg-[#FFFFFF] p-5 sm:p-6 card-elevation-1 space-y-5"
            >
              <div className="flex items-center justify-between gap-4 pb-4 border-b border-[#E8EBE8]">
                <div>
                  <h2
                    id="health-overview-heading"
                    className="text-[18px] sm:text-[20px] font-bold text-[#0F2D24] tracking-[-0.01em]"
                  >
                    Cuidados e telemedicina
                  </h2>
                  <p className="text-[13px] text-[#7A8580] mt-0.5">
                    Consultas por vídeo sem fila e com bônus preventivo em cashback
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => onNavigate('saude')}
                  className="font-label text-[13px] font-semibold text-[#0B4D3A] hover:underline inline-flex items-center gap-1 whitespace-nowrap shrink-0 cursor-pointer min-h-[40px]"
                >
                  Abrir Saúde
                  <ArrowRight className="w-4 h-4" strokeWidth={1.75} />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => onNavigate('saude')}
                  className="p-4 rounded-[18px] bg-[#F1F2F1] hover:bg-[#DDE9C8]/60 text-left transition-colors cursor-pointer"
                >
                  <Stethoscope className="w-5 h-5 text-[#0B4D3A]" strokeWidth={1.75} />
                  <p className="mt-3 text-[15px] font-bold text-[#0F2D24]">
                    Agendar teleconsulta
                  </p>
                  <p className="mt-1 text-[13px] text-[#404944]">
                    Clínica geral hoje ou especialistas com retorno em cashback.
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => onNavigate('apolice')}
                  className="p-4 rounded-[18px] bg-[#F1F2F1] hover:bg-[#DDE9C8]/60 text-left transition-colors cursor-pointer"
                >
                  <CreditCard className="w-5 h-5 text-[#0B4D3A]" strokeWidth={1.75} />
                  <p className="mt-3 text-[15px] font-bold text-[#0F2D24]">
                    Carteirinha digital
                  </p>
                  <p className="mt-1 text-[13px] text-[#404944]">
                    Cartão {profile.cardNumber.slice(-4)} · Titular e dependentes prontos para uso.
                  </p>
                </button>
              </div>
            </section>
          )}
        </div>

        {/* Right Column (5 cols on desktop): Next Appointment + Recent Activity */}
        <div className="lg:col-span-5 space-y-6">
          {/* Next Consultation Card */}
          <section
            aria-label="Próxima teleconsulta"
            className="rounded-[22px] bg-[#FFFFFF] p-5 sm:p-6 card-elevation-1"
          >
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-[17px] font-bold text-[#0F2D24]">
                Próxima consulta
              </h2>
              <button
                type="button"
                onClick={() => onNavigate('saude')}
                className="font-label text-[13px] font-semibold text-[#0B4D3A] hover:underline whitespace-nowrap cursor-pointer min-h-[36px]"
              >
                Gerenciar agenda
              </button>
            </div>

            {nextAppointment ? (
              <div className="mt-4 space-y-4">
                <div className="flex items-start gap-3.5">
                  <div className="w-12 h-12 rounded-2xl bg-[#0B4D3A] text-white flex items-center justify-center font-bold text-[14px] shrink-0">
                    {nextAppointment.doctorName
                      .replace('Dra. ', '')
                      .replace('Dr. ', '')
                      .split(' ')
                      .map((w) => w[0])
                      .slice(0, 2)
                      .join('')}
                  </div>
                  <div className="min-w-0">
                    <p className="text-[16px] font-bold text-[#0F2D24] leading-snug">
                      {nextAppointment.doctorName}
                    </p>
                    <p className="text-[13px] text-[#404944] mt-0.5">
                      {nextAppointment.specialty} <span aria-hidden="true">·</span>{' '}
                      {nextAppointment.crm}
                    </p>
                    <p className="text-[13px] font-semibold text-[#0B4D3A] mt-1.5 flex items-center gap-1.5">
                      <Calendar className="w-4 h-4 shrink-0" strokeWidth={1.75} />
                      <span>
                        {nextAppointment.dateLabel} às {nextAppointment.timeSlot}
                      </span>
                    </p>
                  </div>
                </div>

                <div className="pt-3 border-t border-[#E8EBE8] flex flex-wrap items-center justify-between gap-3">
                  <span className="text-[12px] text-[#7A8580]">
                    +{formatBRL(nextAppointment.bonusCashback)} bônus ao concluir
                  </span>
                  <button
                    type="button"
                    onClick={() => onOpenTeleconsulta(nextAppointment)}
                    className="font-label h-[44px] px-5 rounded-full bg-[#0B4D3A] hover:bg-[#003526] text-white text-[13px] font-semibold inline-flex items-center gap-2 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                  >
                    <Video className="w-4 h-4" strokeWidth={1.75} />
                    Preparar sala
                  </button>
                </div>
              </div>
            ) : (
              <div className="mt-4 py-4">
                <p className="text-[14px] text-[#7A8580]">
                  Nenhuma consulta agendada no momento.
                </p>
                <button
                  type="button"
                  onClick={() => onNavigate('saude')}
                  className="mt-3 font-label h-[44px] px-5 rounded-full bg-[#0B4D3A] text-white text-[13px] font-semibold inline-flex items-center gap-2 cursor-pointer"
                >
                  Agendar teleconsulta
                </button>
              </div>
            )}
          </section>

          {/* Recent Cashback Ledger */}
          <section
            aria-label="Movimentações recentes"
            className="rounded-[22px] bg-[#FFFFFF] p-5 sm:p-6 card-elevation-1"
          >
            <div className="flex items-center justify-between gap-3 pb-3 border-b border-[#E8EBE8]">
              <h2 className="text-[17px] font-bold text-[#0F2D24]">
                Últimas movimentações
              </h2>
              <button
                type="button"
                onClick={() => onNavigate('extrato')}
                className="font-label text-[13px] font-semibold text-[#0B4D3A] hover:underline whitespace-nowrap cursor-pointer min-h-[36px]"
              >
                Ver extrato
              </button>
            </div>

            <div className="divide-y divide-[#E8EBE8]">
              {recentTransactions.map((tx) => {
                const isRedemption = tx.type === 'resgate';
                const isPending = tx.type === 'pendente';
                return (
                  <div
                    key={tx.id}
                    className="py-3.5 flex items-center justify-between gap-3"
                  >
                    <div className="min-w-0">
                      <p className="text-[14px] font-semibold text-[#0F2D24] truncate">
                        {tx.merchant}
                      </p>
                      <p className="text-[12px] text-[#7A8580] truncate mt-0.5">
                        {tx.date} <span aria-hidden="true">·</span>{' '}
                        {isPending ? 'Em liberação' : tx.title}
                      </p>
                    </div>
                    <p
                      className={`text-[14px] font-bold tabular-nums whitespace-nowrap shrink-0 ${
                        isRedemption
                          ? 'text-[#404944]'
                          : isPending
                          ? 'text-[#7A8580]'
                          : 'text-[#0B4D3A]'
                      }`}
                    >
                      {isRedemption ? '−' : '+'} {formatBRL(tx.amount)}
                    </p>
                  </div>
                );
              })}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};
