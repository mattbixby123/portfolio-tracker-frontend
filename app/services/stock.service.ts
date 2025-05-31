import { apiService } from './api';
import { StockDto } from '~/types/stock';

export class StockService {
  async getAllStocks(): Promise<StockDto[]> {
    return apiService.get<StockDto[]>('/stocks');
  }

  async getStockById(id: number): Promise<StockDto> {
    return apiService.get<StockDto>(`/stocks/${id}`);
  }

  async getStockByTicker(ticker: string): Promise<StockDto> {
    return apiService.get<StockDto>(`/stocks/ticker/${ticker}`);
  }

  async searchStocks(query: string): Promise<StockDto[]> {
    return apiService.get<StockDto[]>(`/stocks/search?query=${encodeURIComponent(query)}`);
  }

  async getTopStocks(limit: number = 10): Promise<StockDto[]> {
    return apiService.get<StockDto[]>(`/stocks/top?limit=${limit}`);
  }

  async getAveragePriceBySector(): Promise<Record<string, number>> {
    return apiService.get<Record<string, number>>('/stocks/sectors/average-price');
  }

  async createStock(stock: Omit<StockDto, 'id'>): Promise<StockDto> {
    return apiService.post<StockDto>('/stocks', stock);
  }

  async updateStock(id: number, stock: Partial<StockDto>): Promise<StockDto> {
    return apiService.put<StockDto>(`/stocks/${id}`, stock);
  }

  async updateStockPrice(id: number, price: number): Promise<void> {
    return apiService.patch<void>(`/stocks/${id}/price?price=${price}`);
  }

  async updateStockPriceByTicker(ticker: string, price: number): Promise<void> {
    return apiService.patch<void>(`/stocks/ticker/${ticker}/price?price=${price}`);
  }

  async deleteStock(id: number): Promise<void> {
    return apiService.delete<void>(`/stocks/${id}`);
  }

  async refreshStockPrice(ticker: string): Promise<StockDto> {
    return apiService.put<StockDto>(`/stocks/ticker/${ticker}/refresh`);
  }

  async refreshAllStocks(): Promise<string> {
    return apiService.put<string>('/stocks/refresh-all');
  }

  async addStockFromAlphaVantage(ticker: string): Promise<StockDto> {
    return apiService.post<StockDto>(`/stocks/lookup/${ticker}`);
  }

  async clearCache(): Promise<void> {
    return apiService.post<void>('/stocks/cache/clear');
  }
}

export const stockService = new StockService();