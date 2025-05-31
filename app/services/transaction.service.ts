import { apiService } from './api';
import { TransactionDto } from '~/types/transaction';

export class TransactionService {
  async getUserTransactions(): Promise<TransactionDto[]> {
    return apiService.get<TransactionDto[]>('/transactions');
  }

  async getPaginatedTransactions(page: number = 0, size: number = 20): Promise<TransactionDto[]> {
    return apiService.get<TransactionDto[]>(`/transactions/paged?page=${page}&size=${size}`);
  }

  async getStockTransactions(stockId: number): Promise<TransactionDto[]> {
    return apiService.get<TransactionDto[]>(`/transactions/stock/${stockId}`);
  }

  async getTransactionsByDateRange(startDate: string, endDate: string): Promise<TransactionDto[]> {
    return apiService.get<TransactionDto[]>(
      `/transactions/date-range?startDate=${startDate}&endDate=${endDate}`
    );
  }

  async getMonthlyTransactionSummary(): Promise<Array<Record<string, any>>> {
    return apiService.get<Array<Record<string, any>>>('/transactions/monthly-summary');
  }

  async buyStock(transaction: TransactionDto): Promise<TransactionDto> {
    return apiService.post<TransactionDto>('/transactions/buy', transaction);
  }

  async sellStock(transaction: TransactionDto): Promise<TransactionDto> {
    return apiService.post<TransactionDto>('/transactions/sell', transaction);
  }
}

export const transactionService = new TransactionService();