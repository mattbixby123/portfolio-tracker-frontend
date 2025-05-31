import { apiService } from './api';
import { PositionDto } from '~/types/position';

export class PositionService {
  async getUserPositions(): Promise<PositionDto[]> {
    return apiService.get<PositionDto[]>('/positions');
  }

  async getPositionById(id: number): Promise<PositionDto> {
    return apiService.get<PositionDto>(`/positions/${id}`);
  }

  async getPortfolioValue(): Promise<Record<string, number>> {
    return apiService.get<Record<string, number>>('/positions/value');
  }

  async getLargestPositions(limit: number = 5): Promise<PositionDto[]> {
    return apiService.get<PositionDto[]>(`/positions/largest?limit=${limit}`);
  }

  async getPositionsWithGains(gainPercentage: number = 10): Promise<PositionDto[]> {
    return apiService.get<PositionDto[]>(`/positions/gains?gainPercentage=${gainPercentage}`);
  }

  async getSectorAllocation(): Promise<Record<string, number>> {
    return apiService.get<Record<string, number>>('/positions/sector-allocation');
  }
}

export const positionService = new PositionService();