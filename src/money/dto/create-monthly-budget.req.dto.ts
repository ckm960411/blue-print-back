export interface CreateMonthlyBudgetReqDto {
  year: number;
  month: number;
  date: Date | string;
  type: 'SUM' | 'SPECIFIED';
  budget?: number;
}
