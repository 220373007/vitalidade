import React, { useState } from 'react';
import { Check, Copy, ShieldCheck, Users, LogIn, LogOut, CheckCircle2 } from 'lucide-react';
import { UserProfile } from '../types/vitalidade';

interface ProfileViewProps {
  profile: UserProfile;
  onUpdateProfile: (updated: UserProfile) => void;
  user?: { email?: string; name?: string; id?: string } | null;
  onOpenAuth: () => void;
  onSignOut: () => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  profile,
  onUpdateProfile,
  user,
  onOpenAuth,
  onSignOut,
}) => {
  const [copiedCard, setCopiedCard] = useState(false);
  const [pixType, setPixType] = useState(profile.pixKeyType);
  const [pixValue, setPixValue] = useState(profile.pixKeyValue);
  const [savedNotice, setSavedNotice] = useState(false);

  const handleCopyCard = () => {
    navigator.clipboard?.writeText(profile.cardNumber.replace(/\s+/g, ''));
    setCopiedCard(true);
    setTimeout(() => setCopiedCard(false), 1800);
  };

  const handleSavePix = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pixValue.trim()) return;
    onUpdateProfile({
      ...profile,
      pixKeyType: pixType,
      pixKeyValue: pixValue.trim(),
    });
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 2200);
  };

  const toggleNotification = (key: keyof UserProfile['notifications']) => {
    onUpdateProfile({
      ...profile,
      notifications: {
        ...profile.notifications,
        [key]: !profile.notifications[key],
      },
    });
  };

  return (
    <div className="space-y-6 lg:space-y-8">
      <div>
        <p className="text-[13px] font-medium text-[#7A8580]">
          {profile.company} <span aria-hidden="true">·</span> Titular e dependentes
        </p>
        <h1 className="mt-1 text-[26px] sm:text-[32px] font-bold tracking-[-0.02em] text-[#0F2D24]">
          Minha Apólice e Carteirinha
        </h1>
      </div>

      {/* Supabase Auth Banner / Status */}
      <section
        aria-label="Status de Autenticação Supabase"
        className="rounded-[22px] bg-white p-5 sm:p-6 card-elevation-1 border border-[#E2E5E2]"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${user ? 'bg-emerald-100 text-emerald-800' : 'bg-[#0B4D3A]/10 text-[#0B4D3A]'}`}>
              {user ? <CheckCircle2 className="w-6 h-6 text-emerald-700" /> : <ShieldCheck className="w-6 h-6 text-[#0B4D3A]" />}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-[16px] font-bold text-[#0F2D24]">
                  {user ? 'Conta Supabase Conectada' : 'Acesse sua conta corporativa'}
                </h2>
                {user ? (
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800">
                    Ativo
                  </span>
                ) : (
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-[#F2F4F2] text-[#7A8580]">
                    Desconectado
                  </span>
                )}
              </div>
              <p className="text-[13px] text-[#7A8580] mt-0.5">
                {user
                  ? `Sessão ativa com o e-mail: ${user.email}`
                  : 'Faça login com seu e-mail e senha para sincronizar seus dados em nuvem com o Supabase.'}
              </p>
            </div>
          </div>

          <div className="shrink-0">
            {user ? (
              <button
                type="button"
                onClick={onSignOut}
                className="font-label h-[42px] px-5 rounded-full border border-red-200 text-red-600 hover:bg-red-50 text-[13px] font-semibold inline-flex items-center gap-2 transition-colors cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                Sair da conta
              </button>
            ) : (
              <button
                type="button"
                onClick={onOpenAuth}
                className="font-label h-[42px] px-5 rounded-full bg-[#0B4D3A] hover:bg-[#003526] text-white text-[13px] font-semibold inline-flex items-center gap-2 transition-colors cursor-pointer shadow-sm"
              >
                <LogIn className="w-4 h-4" />
                Entrar ou Cadastrar
              </button>
            )}
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left 6 cols: Digital Health Card + Dependents */}
        <div className="lg:col-span-6 space-y-6">
          {/* Carteirinha Digital */}
          <section
            aria-label="Carteirinha digital do plano"
            className="rounded-[24px] bg-[#0B4D3A] p-6 sm:p-7 text-white card-elevation-hero space-y-6"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="font-label text-[12px] font-semibold text-[#b2efd5]">
                  {profile.planName}
                </p>
                <h2 className="mt-1 text-[22px] font-bold text-white">
                  {profile.name}
                </h2>
                <p className="text-[13px] text-[#b2efd5] mt-0.5">
                  Titular <span aria-hidden="true">·</span> CPF {profile.cpfMasked}
                </p>
              </div>
              <ShieldCheck className="w-7 h-7 text-[#C8EE6B] shrink-0" strokeWidth={1.75} />
            </div>

            <div className="pt-4 border-t border-[#16624b] flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="text-[11px] font-medium text-[#b2efd5]">
                  Número da carteirinha
                </p>
                <p className="mt-1 text-[19px] font-bold tracking-[0.04em] tabular-nums text-white">
                  {profile.cardNumber}
                </p>
                <p className="text-[12px] text-[#b2efd5] mt-1 tabular-nums">
                  Validade {profile.validUntil} <span aria-hidden="true">·</span> Rede Nacional
                </p>
              </div>

              <button
                type="button"
                onClick={handleCopyCard}
                className="font-label h-[42px] px-4 rounded-full bg-[#C8EE6B] hover:bg-[#b9e257] text-[#0B4D3A] text-[13px] font-semibold inline-flex items-center gap-2 transition-colors cursor-pointer"
              >
                {copiedCard ? (
                  <>
                    <Check className="w-4 h-4" strokeWidth={2.2} />
                    Copiado
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" strokeWidth={1.75} />
                    Copiar número
                  </>
                )}
              </button>
            </div>
          </section>

          {/* Dependents */}
          <section
            aria-label="Dependentes vinculados"
            className="rounded-[22px] bg-[#FFFFFF] p-5 sm:p-6 card-elevation-1"
          >
            <h2 className="text-[17px] font-bold text-[#0F2D24] flex items-center gap-2 pb-3 border-b border-[#E8EBE8]">
              <Users className="w-5 h-5 text-[#0B4D3A]" strokeWidth={1.75} />
              Dependentes incluídos na apólice
            </h2>

            <div className="divide-y divide-[#E8EBE8]">
              {profile.dependents.map((dep) => (
                <div
                  key={dep.cardNumber}
                  className="py-3.5 flex items-center justify-between gap-3"
                >
                  <div>
                    <p className="text-[15px] font-semibold text-[#0F2D24]">{dep.name}</p>
                    <p className="text-[12px] text-[#7A8580]">{dep.relation}</p>
                  </div>
                  <p className="text-[13px] font-semibold text-[#0B4D3A] tabular-nums">
                    {dep.cardNumber}
                  </p>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Right 6 cols: Pix Key & Notification Checkboxes */}
        <div className="lg:col-span-6 space-y-6">
          <section
            aria-label="Chave Pix padrão para resgates"
            className="rounded-[22px] bg-[#FFFFFF] p-5 sm:p-6 card-elevation-1"
          >
            <h2 className="text-[17px] font-bold text-[#0F2D24]">
              Chave Pix para resgate de cashback
            </h2>
            <p className="text-[13px] text-[#7A8580] mt-1">
              Os resgates são transferidos instantaneamente sem taxa para a chave cadastrada.
            </p>

            <form onSubmit={handleSavePix} className="mt-5 space-y-4">
              <div>
                <label
                  htmlFor="pix-type"
                  className="block font-label text-[13px] font-semibold text-[#0F2D24] mb-1.5"
                >
                  Tipo de chave
                </label>
                <select
                  id="pix-type"
                  value={pixType}
                  onChange={(e) =>
                    setPixType(e.target.value as UserProfile['pixKeyType'])
                  }
                  className="w-full h-[52px] px-4 rounded-[16px] bg-[#FFFFFF] border-[1.5px] border-[#E2E5E2] text-[14px] text-[#0F2D24] focus:outline-none focus:border-[#0B4D3A] focus:ring-4 focus:ring-[#DDE9C8]/70"
                >
                  <option value="CPF">CPF</option>
                  <option value="E-mail">E-mail</option>
                  <option value="Celular">Celular</option>
                  <option value="Chave Aleatória">Chave Aleatória</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="pix-value"
                  className="block font-label text-[13px] font-semibold text-[#0F2D24] mb-1.5"
                >
                  Chave Pix
                </label>
                <input
                  id="pix-value"
                  type="text"
                  value={pixValue}
                  onChange={(e) => setPixValue(e.target.value)}
                  className="w-full h-[52px] px-4 rounded-[16px] bg-[#FFFFFF] border-[1.5px] border-[#E2E5E2] text-[14px] text-[#0F2D24] focus:outline-none focus:border-[#0B4D3A] focus:ring-4 focus:ring-[#DDE9C8]/70"
                />
              </div>

              <div className="flex items-center justify-between gap-3 pt-1">
                <button
                  type="submit"
                  className="font-label h-[48px] px-6 rounded-full bg-[#0B4D3A] hover:bg-[#003526] text-white text-[14px] font-semibold transition-colors cursor-pointer"
                >
                  Salvar chave Pix
                </button>
                {savedNotice && (
                  <span className="text-[13px] font-semibold text-[#0B4D3A] inline-flex items-center gap-1.5">
                    <Check className="w-4 h-4" strokeWidth={2.2} />
                    Atualizado
                  </span>
                )}
              </div>
            </form>
          </section>

          {/* Notification Checkboxes */}
          <section
            aria-label="Preferências de notificações"
            className="rounded-[22px] bg-[#FFFFFF] p-5 sm:p-6 card-elevation-1 space-y-4"
          >
            <h2 className="text-[17px] font-bold text-[#0F2D24]">
              Preferências de avisos
            </h2>

            {[
              {
                key: 'cashbackAlerts' as const,
                title: 'Avisar quando um cashback for liberado',
                subtitle: 'Receba confirmação imediata ao atingir compras em parceiros.',
              },
              {
                key: 'appointmentReminders' as const,
                title: 'Lembretes de teleconsulta (1h antes)',
                subtitle: 'Link direto da sala de vídeo por e-mail e aplicativo.',
              },
              {
                key: 'weeklySummary' as const,
                title: 'Resumo semanal de economia e saúde',
                subtitle: 'Consolidado às segundas-feiras com ofertas de farmácias.',
              },
            ].map((item) => {
              const checked = profile.notifications[item.key];
              return (
                <label
                  key={item.key}
                  className="flex items-start gap-3.5 py-2 cursor-pointer select-none"
                >
                  <button
                    type="button"
                    role="checkbox"
                    aria-checked={checked}
                    onClick={() => toggleNotification(item.key)}
                    className={`mt-0.5 w-6 h-6 rounded-[8px] border-2 flex items-center justify-center shrink-0 transition-colors cursor-pointer ${
                      checked
                        ? 'bg-[#0B4D3A] border-[#0B4D3A] text-[#C8EE6B]'
                        : 'bg-[#FFFFFF] border-[#707974]'
                    }`}
                  >
                    {checked && <Check className="w-4 h-4" strokeWidth={2.5} />}
                  </button>
                  <div>
                    <p className="text-[14px] font-semibold text-[#0F2D24]">{item.title}</p>
                    <p className="text-[12px] text-[#7A8580] mt-0.5">{item.subtitle}</p>
                  </div>
                </label>
              );
            })}
          </section>
        </div>
      </div>
    </div>
  );
};
