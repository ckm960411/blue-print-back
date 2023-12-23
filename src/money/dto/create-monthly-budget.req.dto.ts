export interface CreateMonthlyBudgetReqDto {
  year: number;
  month: number;
  type: 'SUM' | 'SPECIFIED';
  start: string; // yyyy-MM-dd
  end: string; // yyyy-MM-dd
}
