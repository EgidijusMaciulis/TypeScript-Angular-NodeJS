export class Debt {
  id: number;
  amount: number;
  lender: number;
  debtor: number;
  dueDate: string;
  status: string;
  lenderName?: string;
  debtorName?: string;
  creator?: number;
}

export const DebtStatus = {
  Unconfirmed: 'unconfirmed',
  Pending: 'pending',
  Cancled: 'cancled',
  Done: 'done'
};
