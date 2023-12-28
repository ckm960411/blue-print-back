export interface CreateExpenditureReqDto {
  type: 'INCOME' | 'SPENDING';
  year: number;
  month: number;
  price: number;
  monthlyBudgetCategoryId?: number;
}
