export interface CreateExpenditureReqDto {
  type: 'INCOME' | 'SPENDING';
  year: number;
  month: number;
  content: string;
  price: number;
  monthlyBudgetCategoryId?: number;
}
