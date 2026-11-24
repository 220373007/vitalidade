export type NavTab = 'inicio' | 'saude' | 'beneficios' | 'extrato' | 'apolice';

export type PartnerCategory =
  | 'Todos'
  | 'Farmácias'
  | 'Exames & Labs'
  | 'Academia & Nutrição'
  | 'Saúde Mental';

export interface Partner {
  id: string;
  name: string;
  category: Exclude<PartnerCategory, 'Todos'>;
  cashbackPercent: number;
  tagline: string;
  rules: string;
  minSpend: number;
  maxCashbackPerMonth: number;
  featured?: boolean;
  accentTone: 'forest' | 'lime' | 'mint' | 'sage';
  initials: string;
  codePrefix: string;
}

export interface Voucher {
  id: string;
  partnerId: string;
  partnerName: string;
  code: string;
  cashbackPercent: number;
  createdAt: string;
  expiresAt: string;
  status: 'ativo' | 'utilizado';
}

export type TransactionType = 'cashback' | 'resgate' | 'pendente';

export interface Transaction {
  id: string;
  title: string;
  merchant: string;
  date: string;
  amount: number;
  type: TransactionType;
  reference: string;
}

export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  crm: string;
  experienceYears: number;
  bio: string;
  nextAvailableLabel: string;
  slots: string[];
  copayLabel: string;
  bonusCashback: number;
  initials: string;
  avatarBg: string;
}

export interface Appointment {
  id: string;
  doctorId: string;
  doctorName: string;
  specialty: string;
  crm: string;
  dateLabel: string;
  timeSlot: string;
  mode: 'Teleconsulta por vídeo' | 'Presencial credenciado';
  status: 'confirmada' | 'concluida' | 'cancelada';
  bonusCashback: number;
  notes?: string;
}

export interface MedicalRecord {
  id: string;
  title: string;
  type: 'Receita Digital' | 'Laudo de Exame';
  doctorName: string;
  date: string;
  summary: string;
  pharmacyEligible: boolean;
  details: string[];
}

export interface UserProfile {
  name: string;
  role: string;
  company: string;
  planName: string;
  cardNumber: string;
  cpfMasked: string;
  validUntil: string;
  pixKeyType: 'CPF' | 'E-mail' | 'Celular' | 'Chave Aleatória';
  pixKeyValue: string;
  dependents: {
    name: string;
    relation: string;
    cardNumber: string;
  }[];
  notifications: {
    cashbackAlerts: boolean;
    appointmentReminders: boolean;
    weeklySummary: boolean;
  };
}
