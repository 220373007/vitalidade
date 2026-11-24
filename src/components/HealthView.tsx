import React, { useMemo, useState } from 'react';
import {
  CalendarCheck,
  Clock,
  FileText,
  Pill,
  Search,
  Video,
  X,
} from 'lucide-react';
import { Appointment, Doctor, MedicalRecord } from '../types/vitalidade';
import { formatBRL } from '../utils/format';

interface HealthViewProps {
  doctors: Doctor[];
  appointments: Appointment[];
  records: MedicalRecord[];
  onBookAppointment: (doctor: Doctor, slot: string) => void;
  onCancelAppointment: (appointmentId: string) => void;
  onOpenTeleconsulta: (appointment: Appointment) => void;
  onUsePrescriptionAtPharmacy: () => void;
}

const SPECIALTIES = [
  'Todas',
  'Clínica Geral',
  'Cardiologia',
  'Dermatologia',
  'Psicologia',
  'Nutrição',
];

export const HealthView: React.FC<HealthViewProps> = ({
  doctors,
  appointments,
  records,
  onBookAppointment,
  onCancelAppointment,
  onOpenTeleconsulta,
  onUsePrescriptionAtPharmacy,
}) => {
  const [subTab, setSubTab] = useState<'agendar' | 'minhas' | 'documentos'>('agendar');
  const [selectedSpecialty, setSelectedSpecialty] = useState('Todas');
  const [query, setQuery] = useState('');
  const [selectedSlots, setSelectedSlots] = useState<Record<string, string>>({});
  const [expandedRecordId, setExpandedRecordId] = useState<string | null>(null);

  const activeAppointments = appointments.filter((a) => a.status !== 'cancelada');

  const filteredDoctors = useMemo(() => {
    return doctors.filter((doc) => {
      const matchesSpecialty =
        selectedSpecialty === 'Todas' || doc.specialty === selectedSpecialty;
      const q = query.trim().toLowerCase();
      const matchesQuery =
        !q ||
        doc.name.toLowerCase().includes(q) ||
        doc.specialty.toLowerCase().includes(q) ||
        doc.bio.toLowerCase().includes(q);
      return matchesSpecialty && matchesQuery;
    });
  }, [doctors, selectedSpecialty, query]);

  return (
    <div className="space-y-6 lg:space-y-8">
      {/* Header + Segmented Pill Tabs */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <p className="text-[13px] font-medium text-[#7A8580]">
            Telemedicina 24h <span aria-hidden="true">·</span> Rede Vitalidade
          </p>
          <h1 className="mt-1 text-[26px] sm:text-[32px] font-bold tracking-[-0.02em] text-[#0F2D24]">
            Saúde e Teleconsultas
          </h1>
        </div>

        <div
          role="tablist"
          aria-label="Seções de saúde"
          className="inline-flex items-center p-1 bg-[#EAECEA] rounded-full self-start md:self-auto overflow-x-auto max-w-full"
        >
          {[
            { id: 'agendar' as const, label: 'Agendar consulta' },
            {
              id: 'minhas' as const,
              label: `Agendadas (${activeAppointments.length})`,
            },
            { id: 'documentos' as const, label: 'Receitas e laudos' },
          ].map((tab) => {
            const active = subTab === tab.id;
            return (
              <button
                key={tab.id}
                role="tab"
                type="button"
                aria-selected={active}
                onClick={() => setSubTab(tab.id)}
                className={`font-label min-h-[40px] px-4 sm:px-5 py-2 rounded-full text-[13px] font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  active
                    ? 'bg-[#FFFFFF] text-[#0B4D3A] shadow-xs'
                    : 'text-[#404944] hover:text-[#0F2D24]'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* TAB 1: AGENDAR CONSULTA */}
      {subTab === 'agendar' && (
        <div className="space-y-6">
          {/* Search & Specialty Filter Row */}
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
                placeholder="Buscar especialidade ou médico..."
                aria-label="Buscar especialidade ou médico"
                className="w-full h-[52px] pl-11 pr-4 rounded-full bg-[#FFFFFF] border-[1.5px] border-[#E2E5E2] text-[14px] text-[#0F2D24] placeholder:text-[#7A8580] focus:outline-none focus:border-[#0B4D3A] focus:ring-4 focus:ring-[#DDE9C8]/70 transition-all"
              />
            </div>

            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              {SPECIALTIES.map((spec) => {
                const isSelected = selectedSpecialty === spec;
                return (
                  <button
                    key={spec}
                    type="button"
                    onClick={() => setSelectedSpecialty(spec)}
                    className={`font-label min-h-[40px] px-4 py-2 rounded-full text-[13px] font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                      isSelected
                        ? 'bg-[#0B4D3A] text-white'
                        : 'bg-[#FFFFFF] text-[#404944] border border-[#E2E5E2] hover:bg-[#F1F2F1]'
                    }`}
                  >
                    {spec}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Doctors Grid */}
          {filteredDoctors.length === 0 ? (
            <div className="rounded-[22px] bg-[#FFFFFF] p-8 text-center card-elevation-1">
              <p className="text-[16px] font-semibold text-[#0F2D24]">
                Nenhum profissional encontrado para "{query}"
              </p>
              <p className="text-[14px] text-[#7A8580] mt-1">
                Tente limpar o filtro de especialidade ou buscar outro termo.
              </p>
              <button
                type="button"
                onClick={() => {
                  setQuery('');
                  setSelectedSpecialty('Todas');
                }}
                className="mt-4 font-label h-[44px] px-5 rounded-full bg-[#DDE9C8] text-[#0B4D3A] text-[13px] font-semibold cursor-pointer"
              >
                Limpar filtros
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {filteredDoctors.map((doc) => {
                const chosenSlot = selectedSlots[doc.id] ?? doc.slots[0];
                return (
                  <article
                    key={doc.id}
                    className="rounded-[22px] bg-[#FFFFFF] p-5 sm:p-6 card-elevation-1 flex flex-col justify-between gap-5"
                  >
                    <div className="space-y-3">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3.5">
                          <div
                            style={{ backgroundColor: doc.avatarBg }}
                            className="w-12 h-12 rounded-2xl text-white flex items-center justify-center font-bold text-[15px] shrink-0"
                          >
                            {doc.initials}
                          </div>
                          <div>
                            <h2 className="text-[17px] font-bold text-[#0F2D24]">
                              {doc.name}
                            </h2>
                            <p className="text-[13px] text-[#7A8580]">
                              {doc.specialty} <span aria-hidden="true">·</span> {doc.crm}{' '}
                              <span aria-hidden="true">·</span> {doc.experienceYears} anos
                            </p>
                          </div>
                        </div>
                      </div>

                      <p className="text-[14px] text-[#404944] leading-relaxed">
                        {doc.bio}
                      </p>

                      <p className="text-[12px] font-medium text-[#0B4D3A]">
                        {doc.copayLabel} <span aria-hidden="true">·</span> +
                        {formatBRL(doc.bonusCashback)} cashback preventivo
                      </p>
                    </div>

                    <div className="pt-4 border-t border-[#E8EBE8] space-y-4">
                      <div>
                        <p className="text-[12px] font-semibold text-[#7A8580] mb-2 flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5" strokeWidth={1.75} />
                          Horários disponíveis ({doc.nextAvailableLabel})
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {doc.slots.map((slot) => {
                            const isPicked = chosenSlot === slot;
                            return (
                              <button
                                key={slot}
                                type="button"
                                onClick={() =>
                                  setSelectedSlots((prev) => ({
                                    ...prev,
                                    [doc.id]: slot,
                                  }))
                                }
                                className={`font-label min-h-[38px] px-3.5 py-1.5 rounded-full text-[13px] font-semibold tabular-nums transition-colors cursor-pointer ${
                                  isPicked
                                    ? 'bg-[#DDE9C8] border border-[#C8EE6B] text-[#0B4D3A]'
                                    : 'bg-[#F1F2F1] text-[#404944] hover:bg-[#E5F1EA]'
                                }`}
                              >
                                {slot}
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          onBookAppointment(doc, chosenSlot);
                          setSubTab('minhas');
                        }}
                        className="w-full font-label h-[48px] px-5 rounded-full bg-[#0B4D3A] hover:bg-[#003526] text-white text-[14px] font-semibold transition-transform active:scale-[0.98] cursor-pointer"
                      >
                        Confirmar teleconsulta às {chosenSlot}
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: MINHAS CONSULTAS */}
      {subTab === 'minhas' && (
        <div className="space-y-4">
          {activeAppointments.length === 0 ? (
            <div className="rounded-[22px] bg-[#FFFFFF] p-8 text-center card-elevation-1">
              <CalendarCheck
                className="w-8 h-8 text-[#0B4D3A] mx-auto"
                strokeWidth={1.75}
              />
              <h2 className="mt-3 text-[18px] font-bold text-[#0F2D24]">
                Você ainda não tem consultas agendadas
              </h2>
              <p className="mt-1 text-[14px] text-[#7A8580]">
                Escolha um especialista na aba ao lado para atendimento por vídeo sem espera.
              </p>
              <button
                type="button"
                onClick={() => setSubTab('agendar')}
                className="mt-4 font-label h-[46px] px-6 rounded-full bg-[#C8EE6B] text-[#0F2D24] text-[14px] font-semibold cursor-pointer"
              >
                Agendar agora
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              {activeAppointments.map((apt) => (
                <article
                  key={apt.id}
                  className="rounded-[22px] bg-[#FFFFFF] p-5 sm:p-6 card-elevation-1 flex flex-col justify-between gap-5"
                >
                  <div className="space-y-2">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-[12px] font-semibold text-[#0B4D3A]">
                          {apt.status === 'concluida'
                            ? 'Concluída · Cashback creditado'
                            : `${apt.dateLabel} · ${apt.timeSlot}`}
                        </p>
                        <h2 className="text-[18px] font-bold text-[#0F2D24] mt-1">
                          {apt.doctorName}
                        </h2>
                        <p className="text-[13px] text-[#7A8580]">
                          {apt.specialty} <span aria-hidden="true">·</span> {apt.crm}{' '}
                          <span aria-hidden="true">·</span> {apt.mode}
                        </p>
                      </div>
                    </div>
                    {apt.notes && (
                      <p className="text-[13px] text-[#404944] pt-1">{apt.notes}</p>
                    )}
                  </div>

                  <div className="pt-4 border-t border-[#E8EBE8] flex flex-wrap items-center justify-between gap-3">
                    <span className="text-[12px] font-medium text-[#7A8580]">
                      Bônus preventivo:{' '}
                      <strong className="text-[#0B4D3A] tabular-nums">
                        +{formatBRL(apt.bonusCashback)}
                      </strong>
                    </span>

                    {apt.status === 'confirmada' && (
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => onCancelAppointment(apt.id)}
                          className="font-label h-[42px] px-4 rounded-full bg-[#F1F2F1] hover:bg-[#ffdad6] hover:text-[#93000a] text-[#404944] text-[13px] font-semibold inline-flex items-center gap-1.5 transition-colors cursor-pointer"
                        >
                          <X className="w-3.5 h-3.5" strokeWidth={2} />
                          Cancelar
                        </button>
                        <button
                          type="button"
                          onClick={() => onOpenTeleconsulta(apt)}
                          className="font-label h-[42px] px-5 rounded-full bg-[#0B4D3A] hover:bg-[#003526] text-white text-[13px] font-semibold inline-flex items-center gap-2 transition-colors cursor-pointer"
                        >
                          <Video className="w-4 h-4" strokeWidth={1.75} />
                          Entrar na sala
                        </button>
                      </div>
                    )}
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 3: RECEITAS E LAUDOS */}
      {subTab === 'documentos' && (
        <div className="space-y-4">
          {records.map((rec) => {
            const isExpanded = expandedRecordId === rec.id;
            return (
              <article
                key={rec.id}
                className="rounded-[22px] bg-[#FFFFFF] p-5 sm:p-6 card-elevation-1"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-start gap-3.5">
                    <div className="w-11 h-11 rounded-2xl bg-[#F1F2F1] text-[#0B4D3A] flex items-center justify-center shrink-0">
                      {rec.type === 'Receita Digital' ? (
                        <Pill className="w-5 h-5" strokeWidth={1.75} />
                      ) : (
                        <FileText className="w-5 h-5" strokeWidth={1.75} />
                      )}
                    </div>
                    <div>
                      <p className="text-[12px] font-medium text-[#7A8580]">
                        {rec.type} <span aria-hidden="true">·</span> {rec.date}{' '}
                        <span aria-hidden="true">·</span> {rec.doctorName}
                      </p>
                      <h2 className="text-[16px] font-bold text-[#0F2D24] mt-0.5">
                        {rec.title}
                      </h2>
                      <p className="text-[13px] text-[#404944] mt-1">{rec.summary}</p>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 shrink-0">
                    {rec.pharmacyEligible && (
                      <button
                        type="button"
                        onClick={onUsePrescriptionAtPharmacy}
                        className="font-label h-[42px] px-4 rounded-full bg-[#C8EE6B] hover:bg-[#b9e257] text-[#0F2D24] text-[13px] font-semibold transition-colors whitespace-nowrap cursor-pointer"
                      >
                        Comprar com 12% cashback
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() =>
                        setExpandedRecordId(isExpanded ? null : rec.id)
                      }
                      className="font-label h-[42px] px-4 rounded-full bg-[#DDE9C8] text-[#0B4D3A] text-[13px] font-semibold transition-colors whitespace-nowrap cursor-pointer"
                    >
                      {isExpanded ? 'Ocultar detalhes' : 'Ver detalhes'}
                    </button>
                  </div>
                </div>

                {isExpanded && (
                  <div className="mt-4 pt-4 border-t border-[#E8EBE8] space-y-2">
                    {rec.details.map((line, i) => (
                      <p key={i} className="text-[13px] text-[#404944] leading-relaxed">
                        • {line}
                      </p>
                    ))}
                  </div>
                )}
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
};
