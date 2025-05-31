export interface TransactionDto {
  id?: number;
  stockId?: number;
  stockTicker: string;
  stockName?: string;
  transactionType: 'BUY' | 'SELL';
  quantity: number;
  price: number;
  fee?: number;
  value?: number;
  totalCost?: number;
  transactionDate?: string;
}