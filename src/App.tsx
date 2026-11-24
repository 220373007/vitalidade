import { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { CheckCircle2 } from 'lucide-react';
import { TopBar } from './components/TopBar';
import { MobileBottomNav } from './components/MobileBottomNav';
import { HomeView } from './components/HomeView';
import { HealthView } from './components/HealthView';
import { BenefitsView } from './components/BenefitsView';
import { WalletView } from './components/WalletView';
import { ProfileView } from './components/ProfileView';
import { PixRedeemModal } from './components/PixRedeemModal';
import { PartnerDetailModal } from './components/PartnerDetailModal';
import { TeleconsultaRoomModal } from './components/TeleconsultaRoomModal';
import { AuthModal } from './components/AuthModal';
import { supabase, User } from './lib/supabase';
import {
  DOCTORS,
  INITIAL_APPOINTMENTS,
  INITIAL_PROFILE,
  INITIAL_TRANSACTIONS,
  INITIAL_VOUCHERS,
  MEDICAL_RECORDS,
  PARTNERS,
} from './data/mockData';
import {
  Appointment,
  Doctor,
  NavTab,
  Partner,
  Transaction,
  UserProfile,
  Voucher,
} from './types/vitalidade';
import { formatBRL } from './utils/format';

const STORAGE_KEY = 'vitalidade_beneficios_state_v1';

interface PersistedState {
  availableBalance: number;
  transactions: Transaction[];
  appointments: Appointment[];
  vouchers: Voucher[];
  profile: UserProfile;
}

function loadInitialState(): PersistedState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      return JSON.parse(raw) as PersistedState;
    }
  } catch {
    // Fallback to initial defaults
  }
  return {
    availableBalance: 428.9,
    transactions: INITIAL_TRANSACTIONS,
    appointments: INITIAL_APPOINTMENTS,
    vouchers: INITIAL_VOUCHERS,
    profile: INITIAL_PROFILE,
  };
}

export default function App() {
  const [state, setState] = useState<PersistedState>(loadInitialState);
  const [activeTab, setActiveTab] = useState<NavTab>('inicio');

  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  const [isRedeemOpen, setIsRedeemOpen] = useState(false);
  const [selectedPartner, setSelectedPartner] = useState<Partner | null>(null);
  const [activeTeleconsulta, setActiveTeleconsulta] = useState<Appointment | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setCurrentUser(session?.user ?? null);
      if (session?.user?.user_metadata?.full_name) {
        setState((prev) => ({
          ...prev,
          profile: {
            ...prev.profile,
            name: session.user.user_metadata.full_name,
          },
        }));
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setCurrentUser(session?.user ?? null);
      if (session?.user?.user_metadata?.full_name) {
        setState((prev) => ({
          ...prev,
          profile: {
            ...prev.profile,
            name: session.user.user_metadata.full_name,
          },
        }));
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // Ignore storage quota errors
    }
  }, [state]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((curr) => (curr === msg ? null : curr));
    }, 3200);
  };

  const pendingBalance = useMemo(
    () =>
      state.transactions
        .filter((t) => t.type === 'pendente')
        .reduce((acc, t) => acc + t.amount, 0),
    [state.transactions]
  );

  const annualSavings = useMemo(
    () =>
      1693.0 +
      state.transactions
        .filter((t) => t.type === 'cashback')
        .reduce((acc, t) => acc + t.amount, 0),
    [state.transactions]
  );

  const weeklyGain = useMemo(
    () =>
      state.transactions
        .filter((t) => t.type === 'cashback')
        .slice(0, 2)
        .reduce((acc, t) => acc + t.amount, 0),
    [state.transactions]
  );

  const handleConfirmRedeem = (amount: number, pixKey: string) => {
    const newTx: Transaction = {
      id: `tx-${Date.now()}`,
      title: 'Resgate instantâneo via Pix',
      merchant: `Transferência para ${pixKey}`,
      date: 'Hoje, 22 Nov 2026',
      amount,
      type: 'resgate',
      reference: `Comprovante #PX-${Math.floor(10000 + Math.random() * 89999)}`,
    };
    setState((prev) => ({
      ...prev,
      availableBalance: Math.max(0, Number((prev.availableBalance - amount).toFixed(2))),
      transactions: [newTx, ...prev.transactions],
    }));
  };

  const handleGenerateVoucher = (partner: Partner): Voucher => {
    const existing = state.vouchers.find(
      (v) => v.partnerId === partner.id && v.status === 'ativo'
    );
    if (existing) return existing;

    const newVoucher: Voucher = {
      id: `v-${Date.now()}`,
      partnerId: partner.id,
      partnerName: partner.name,
      code: `${partner.codePrefix}-${Math.floor(1000 + Math.random() * 8999)}`,
      cashbackPercent: partner.cashbackPercent,
      createdAt: '22 Nov 2026',
      expiresAt: '22 Dez 2026',
      status: 'ativo',
    };

    setState((prev) => ({
      ...prev,
      vouchers: [newVoucher, ...prev.vouchers],
    }));
    showToast(`Voucher ${newVoucher.code} ativado para ${partner.name}.`);
    return newVoucher;
  };

  const handleLogPurchase = (partner: Partner, spendAmount: number) => {
    const cashbackAmount = Number(
      Math.min(
        (spendAmount * partner.cashbackPercent) / 100,
        partner.maxCashbackPerMonth
      ).toFixed(2)
    );

    const newTx: Transaction = {
      id: `tx-${Date.now()}`,
      title: `Cashback registrado (${partner.cashbackPercent}% retorno)`,
      merchant: partner.name,
      date: 'Hoje, 22 Nov 2026',
      amount: cashbackAmount,
      type: 'cashback',
      reference: `Cupom ${formatBRL(spendAmount)}`,
    };

    setState((prev) => ({
      ...prev,
      availableBalance: Number((prev.availableBalance + cashbackAmount).toFixed(2)),
      transactions: [newTx, ...prev.transactions],
    }));
    showToast(`+${formatBRL(cashbackAmount)} de cashback creditado na sua carteira.`);
  };

  const handleBookAppointment = (doctor: Doctor, slot: string) => {
    const newApt: Appointment = {
      id: `apt-${Date.now()}`,
      doctorId: doctor.id,
      doctorName: doctor.name,
      specialty: doctor.specialty,
      crm: doctor.crm,
      dateLabel: doctor.nextAvailableLabel,
      timeSlot: slot,
      mode: 'Teleconsulta por vídeo',
      status: 'confirmada',
      bonusCashback: doctor.bonusCashback,
    };

    setState((prev) => ({
      ...prev,
      appointments: [newApt, ...prev.appointments],
    }));
    showToast(`Teleconsulta com ${doctor.name} agendada para ${slot}.`);
  };

  const handleCancelAppointment = (appointmentId: string) => {
    setState((prev) => ({
      ...prev,
      appointments: prev.appointments.map((apt) =>
        apt.id === appointmentId ? { ...apt, status: 'cancelada' } : apt
      ),
    }));
    showToast('Consulta cancelada sem cobrança.');
  };

  const handleCompleteTeleconsulta = (
    appointment: Appointment,
    symptomNote: string
  ) => {
    const bonusTx: Transaction = {
      id: `tx-${Date.now()}`,
      title: 'Bônus teleconsulta preventiva concluída',
      merchant: appointment.doctorName,
      date: 'Hoje, 22 Nov 2026',
      amount: appointment.bonusCashback,
      type: 'cashback',
      reference: `Check-in · ${appointment.specialty}`,
    };

    setState((prev) => ({
      ...prev,
      availableBalance: Number(
        (prev.availableBalance + appointment.bonusCashback).toFixed(2)
      ),
      appointments: prev.appointments.map((a) =>
        a.id === appointment.id
          ? { ...a, status: 'concluida', notes: symptomNote || a.notes }
          : a
      ),
      transactions: [bonusTx, ...prev.transactions],
    }));
  };

  const handleUpdateProfile = (updated: UserProfile) => {
    setState((prev) => ({ ...prev, profile: updated }));
    showToast('Preferências da apólice atualizadas.');
  };

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      setCurrentUser(null);
      showToast('Sessão encerrada com sucesso.');
    } catch {
      showToast('Erro ao encerrar a sessão.');
    }
  };

  const handleAuthSuccess = (_email: string, name?: string) => {
    if (name) {
      setState((prev) => ({
        ...prev,
        profile: {
          ...prev.profile,
          name,
        },
      }));
    }
    showToast('Autenticado com sucesso via Supabase!');
  };

  const handleUsePrescriptionAtPharmacy = () => {
    const drogasil = PARTNERS.find((p) => p.id === 'drogasil') ?? PARTNERS[0];
    setSelectedPartner(drogasil);
  };

  return (
    <div className="min-h-screen bg-[#F4F5F4] text-[#0F2D24] flex flex-col">
      <TopBar
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        onOpenRedeem={() => setIsRedeemOpen(true)}
        user={
          currentUser
            ? {
                email: currentUser.email,
                name: currentUser.user_metadata?.full_name,
              }
            : null
        }
        onOpenAuth={() => setIsAuthOpen(true)}
      />

      <main className="flex-1 w-full max-w-[1200px] mx-auto px-5 sm:px-8 lg:px-12 pt-6 pb-24 md:py-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.16, ease: [0.16, 1, 0.3, 1] }}
          >
            {activeTab === 'inicio' && (
              <HomeView
                profile={state.profile}
                availableBalance={state.availableBalance}
                pendingBalance={pendingBalance}
                weeklyGain={weeklyGain}
                appointments={state.appointments}
                partners={PARTNERS}
                transactions={state.transactions}
                onNavigate={setActiveTab}
                onOpenRedeem={() => setIsRedeemOpen(true)}
                onOpenPartner={(p) => setSelectedPartner(p)}
                onOpenTeleconsulta={(apt) => setActiveTeleconsulta(apt)}
              />
            )}

            {activeTab === 'saude' && (
              <HealthView
                doctors={DOCTORS}
                appointments={state.appointments}
                records={MEDICAL_RECORDS}
                onBookAppointment={handleBookAppointment}
                onCancelAppointment={handleCancelAppointment}
                onOpenTeleconsulta={(apt) => setActiveTeleconsulta(apt)}
                onUsePrescriptionAtPharmacy={handleUsePrescriptionAtPharmacy}
              />
            )}

            {activeTab === 'beneficios' && (
              <BenefitsView
                partners={PARTNERS}
                vouchers={state.vouchers}
                onOpenPartner={(p) => setSelectedPartner(p)}
                onLogPurchase={handleLogPurchase}
              />
            )}

            {activeTab === 'extrato' && (
              <WalletView
                availableBalance={state.availableBalance}
                pendingBalance={pendingBalance}
                annualSavings={annualSavings}
                transactions={state.transactions}
                onOpenRedeem={() => setIsRedeemOpen(true)}
              />
            )}

            {activeTab === 'apolice' && (
              <ProfileView
                profile={state.profile}
                onUpdateProfile={handleUpdateProfile}
                user={
                  currentUser
                    ? {
                        email: currentUser.email,
                        name: currentUser.user_metadata?.full_name,
                        id: currentUser.id,
                      }
                    : null
                }
                onOpenAuth={() => setIsAuthOpen(true)}
                onSignOut={handleSignOut}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      <footer className="hidden md:block border-t border-[#E2E5E2] bg-[#FFFFFF]/60">
        <div className="max-w-[1200px] mx-auto px-8 lg:px-12 py-5 flex items-center justify-between text-[12px] text-[#7A8580]">
          <span>Vitalidade &amp; Benefícios · Atendimento corporativo 24h</span>
          <span>Apólice {state.profile.planName}</span>
        </div>
      </footer>

      <MobileBottomNav activeTab={activeTab} onSelectTab={setActiveTab} />

      {isRedeemOpen && (
        <PixRedeemModal
          availableBalance={state.availableBalance}
          profile={state.profile}
          onClose={() => setIsRedeemOpen(false)}
          onConfirmRedeem={handleConfirmRedeem}
        />
      )}

      {selectedPartner && (
        <PartnerDetailModal
          partner={selectedPartner}
          existingVoucher={state.vouchers.find(
            (v) => v.partnerId === selectedPartner.id && v.status === 'ativo'
          )}
          onClose={() => setSelectedPartner(null)}
          onGenerateVoucher={handleGenerateVoucher}
        />
      )}

      {activeTeleconsulta && (
        <TeleconsultaRoomModal
          appointment={activeTeleconsulta}
          onClose={() => setActiveTeleconsulta(null)}
          onCompleteSession={handleCompleteTeleconsulta}
        />
      )}

      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onAuthSuccess={handleAuthSuccess}
      />

      {/* Subtle Toast Confirmation */}
      {toastMessage && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-20 md:bottom-6 right-5 left-5 sm:left-auto sm:max-w-[380px] z-50 rounded-full bg-[#0F2D24] text-white px-5 py-3 shadow-lg flex items-center gap-2.5 text-[13px] font-medium"
        >
          <CheckCircle2 className="w-4 h-4 text-[#C8EE6B] shrink-0" strokeWidth={2.2} />
          <span className="truncate">{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
