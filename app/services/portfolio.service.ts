import { apiService } from './api';
import { PositionDto } from '~/types/position';

export class PortfolioService {
  async getPortfolioSummary(): Promise<Record<string, any>> {
    return apiService.get<Record<string, any>>('/portfolio/summary');
  }

  async getPortfolioPerformance(): Promise<Record<string, number>> {
    return apiService.get<Record<string, number>>('/portfolio/performance');
  }

  async getTopHoldings(limit: number = 5): Promise<PositionDto[]> {
    return apiService.get<PositionDto[]>(`/portfolio/top-holdings?limit=${limit}`);
  }

  async getMonthlyTransactionSummary(): Promise<Array<Record<string, any>>> {
    return apiService.get<Array<Record<string, any>>>('/portfolio/monthly-summary');
  }

  async getSectorAllocation(): Promise<Record<string, number>> {
    return apiService.get<Record<string, number>>('/portfolio/allocation');
  }
}

export const portfolioService = new PortfolioService();