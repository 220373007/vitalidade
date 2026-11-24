import { Transaction } from '../types/vitalidade';

export function formatBRL(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

export function formatShortDate(isoOrLabel: string): string {
  return isoOrLabel;
}

export function exportTransactionsCSV(transactions: Transaction[]): void {
  const header = ['Data', 'Descrição', 'Estabelecimento', 'Referência', 'Tipo', 'Valor (BRL)'];
  const rows = transactions.map((t) => [
    t.date,
    `"${t.title.replace(/"/g, '""')}"`,
    `"${t.merchant.replace(/"/g, '""')}"`,
    t.reference,
    t.type,
    t.type === 'resgate' ? (-Math.abs(t.amount)).toFixed(2) : t.amount.toFixed(2),
  ]);

  const csvContent =
    '\uFEFF' + [header.join(';'), ...rows.map((row) => row.join(';'))].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `vitalidade-extrato-cashback.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
