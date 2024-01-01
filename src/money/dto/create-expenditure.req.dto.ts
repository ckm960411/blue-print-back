export interface CreateExpenditureReqDto {
  type: 'INCOME' | 'SPENDING';
  spendingType?: 'CARD' | 'CASH';
  year: number;
  month: number;
  date: number;
  hour?: number;
  minute?: number;
  content: string;
  price: number;
  monthlyBudgetCategoryId?: number;
  budgetCategoryId?: number;
}
