export interface UpdateMonthlyBudgetReqDto {
  type?: 'SUM' | 'SPECIFIED';
  budget?: number;
}
