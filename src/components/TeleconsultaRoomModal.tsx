import React, { useState } from 'react';
import { CheckCircle2, Mic, MicOff, Video, VideoOff, X } from 'lucide-react';
import { Appointment } from '../types/vitalidade';
import { formatBRL } from '../utils/format';

interface TeleconsultaRoomModalProps {
  appointment: Appointment;
  onClose: () => void;
  onCompleteSession: (appointment: Appointment, symptomNote: string) => void;
}

export const TeleconsultaRoomModal: React.FC<TeleconsultaRoomModalProps> = ({
  appointment,
  onClose,
  onCompleteSession,
}) => {
  const [micOn, setMicOn] = useState(true);
  const [camOn, setCamOn] = useState(true);
  const [symptomNote, setSymptomNote] = useState(appointment.notes ?? '');
  const [sessionDone, setSessionDone] = useState(false);

  const handleFinish = () => {
    onCompleteSession(appointment, symptomNote);
    setSessionDone(true);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="teleconsulta-modal-title"
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-[#0F2D24]/35 backdrop-blur-sm p-0 sm:p-4"
    >
      <div className="w-full sm:max-w-[520px] rounded-t-[24px] sm:rounded-[24px] bg-[#FFFFFF] p-6 modal-elevation space-y-5">
        <div className="sm:hidden w-10 h-1.5 bg-[#E2E5E2] rounded-full mx-auto" />

        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-[12px] font-semibold text-[#0B4D3A]">
              {appointment.dateLabel} · {appointment.timeSlot}
            </p>
            <h2
              id="teleconsulta-modal-title"
              className="mt-0.5 text-[20px] font-bold text-[#0F2D24]"
            >
              Sala de teleconsulta
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Fechar sala de teleconsulta"
            className="w-10 h-10 rounded-full bg-[#F1F2F1] hover:bg-[#E2E5E2] text-[#0F2D24] flex items-center justify-center cursor-pointer"
          >
            <X className="w-5 h-5" strokeWidth={1.75} />
          </button>
        </div>

        {sessionDone ? (
          <div className="py-4 text-center space-y-4">
            <div className="w-14 h-14 rounded-full bg-[#DDE9C8] text-[#0B4D3A] flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" strokeWidth={2} />
            </div>
            <div>
              <h3 className="text-[20px] font-bold text-[#0F2D24]">
                Check-in e consulta concluídos
              </h3>
              <p className="text-[14px] text-[#7A8580] mt-1">
                Seu bônus preventivo de{' '}
                <strong className="text-[#0B4D3A] tabular-nums">
                  +{formatBRL(appointment.bonusCashback)}
                </strong>{' '}
                foi creditado na sua carteira Vitalidade.
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="w-full font-label h-[48px] rounded-full bg-[#0B4D3A] text-white text-[14px] font-semibold cursor-pointer"
            >
              Voltar ao aplicativo
            </button>
          </div>
        ) : (
          <>
            {/* Video Preview Surface */}
            <div className="rounded-[20px] bg-[#0B4D3A] p-5 text-white flex flex-col justify-between min-h-[180px]">
              <div className="flex items-center justify-between gap-2">
                <div>
                  <p className="text-[15px] font-bold">{appointment.doctorName}</p>
                  <p className="text-[12px] text-[#b2efd5]">
                    {appointment.specialty} <span aria-hidden="true">·</span> {appointment.crm}
                  </p>
                </div>
                <span className="px-3 py-1 rounded-full bg-[#10503d] text-[#C8EE6B] text-[11px] font-semibold">
                  {camOn ? 'Câmera pronta' : 'Câmera pausada'}
                </span>
              </div>

              <div className="flex items-center justify-center gap-3 pt-6">
                <button
                  type="button"
                  onClick={() => setMicOn((v) => !v)}
                  className={`h-[44px] px-4 rounded-full text-[13px] font-semibold inline-flex items-center gap-2 transition-colors cursor-pointer ${
                    micOn
                      ? 'bg-[#10503d] text-white'
                      : 'bg-[#ffdad6] text-[#93000a]'
                  }`}
                >
                  {micOn ? (
                    <>
                      <Mic className="w-4 h-4" strokeWidth={1.75} />
                      Microfone ativo
                    </>
                  ) : (
                    <>
                      <MicOff className="w-4 h-4" strokeWidth={1.75} />
                      Microfone mudo
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => setCamOn((v) => !v)}
                  className={`h-[44px] px-4 rounded-full text-[13px] font-semibold inline-flex items-center gap-2 transition-colors cursor-pointer ${
                    camOn
                      ? 'bg-[#10503d] text-white'
                      : 'bg-[#ffdad6] text-[#93000a]'
                  }`}
                >
                  {camOn ? (
                    <>
                      <Video className="w-4 h-4" strokeWidth={1.75} />
                      Vídeo ativo
                    </>
                  ) : (
                    <>
                      <VideoOff className="w-4 h-4" strokeWidth={1.75} />
                      Vídeo desligado
                    </>
                  )}
                </button>
              </div>
            </div>

            <div>
              <label
                htmlFor="pre-consult-notes"
                className="block font-label text-[13px] font-semibold text-[#0F2D24] mb-1.5"
              >
                Motivo ou sintomas para enviar ao médico antes do atendimento
              </label>
              <textarea
                id="pre-consult-notes"
                rows={3}
                value={symptomNote}
                onChange={(e) => setSymptomNote(e.target.value)}
                placeholder="Ex.: Avaliação de rotina, dúvidas sobre dosagem ou resultados de exames..."
                className="w-full p-3.5 rounded-[16px] bg-[#FFFFFF] border-[1.5px] border-[#E2E5E2] text-[14px] text-[#0F2D24] focus:outline-none focus:border-[#0B4D3A] focus:ring-4 focus:ring-[#DDE9C8]/70"
              />
            </div>

            <button
              type="button"
              onClick={handleFinish}
              className="w-full font-label h-[52px] px-6 rounded-full bg-[#C8EE6B] hover:bg-[#b9e257] text-[#0F2D24] text-[15px] font-bold transition-transform active:scale-[0.98] cursor-pointer"
            >
              Concluir check-in e receber +{formatBRL(appointment.bonusCashback)} bônus
            </button>
          </>
        )}
      </div>
    </div>
  );
};
