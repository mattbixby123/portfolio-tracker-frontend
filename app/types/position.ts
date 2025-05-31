export interface PositionDto {
  id: number;
  stockId: number;
  stockTicker: string;
  stockName: string;
  quantity: number;
  averageCost: number;
  currentPrice?: number;
  firstPurchased: string;
  lastTransaction: string;
  currentValue?: number;
  totalCost?: number;
  unrealizedProfitLoss?: number;
  percentageReturn?: number;
  notes?: string;
}