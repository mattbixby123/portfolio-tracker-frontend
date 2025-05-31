export interface StockDto {
  id: number;
  ticker: string;
  name: string;
  exchange: string;
  sector?: string;
  industry?: string;
  currency: string;
  currentPrice?: number;
  lastUpdated?: string;
}