import { ProfitRecord } from './types';

export interface IProfitService {
  getTradingProfitsByUserId(userId: string): Promise<ProfitRecord[]>;
  getGlobalProfitsSummary(): Promise<{ totalVolumeUsdt: number; totalProfitUsdt: number; totalDistributedCommissionUsdt: number }>;
}

export class MockProfitService implements IProfitService {
  private mockProfits: ProfitRecord[] = [
    {
      id: 'trade_log_101',
      userId: 'user_1',
      tradeId: 'TX-ORD-98210',
      symbol: 'BTC/USDT',
      side: 'BUY',
      volume: 1.45,
      openPrice: 94200.00,
      closePrice: 96850.00,
      profitAmountUsdt: 3842.50,
      commissionCalculatedUsdt: 461.10,
      closedAt: '2026-08-18 14:22:10',
      strategyId: 'trend_alpha_1',
      isDistributed: true
    },
    {
      id: 'trade_log_102',
      userId: 'user_1',
      tradeId: 'TX-ORD-98211',
      symbol: 'ETH/USDT',
      side: 'BUY',
      volume: 12.0,
      openPrice: 3420.00,
      closePrice: 3580.00,
      profitAmountUsdt: 1920.00,
      commissionCalculatedUsdt: 230.40,
      closedAt: '2026-08-17 19:45:00',
      strategyId: 'eth_momentum',
      isDistributed: true
    },
    {
      id: 'trade_log_103',
      userId: 'user_2',
      tradeId: 'TX-ORD-98212',
      symbol: 'SOL/USDT',
      side: 'BUY',
      volume: 85.0,
      openPrice: 182.50,
      closePrice: 198.20,
      profitAmountUsdt: 1334.50,
      commissionCalculatedUsdt: 160.14,
      closedAt: '2026-08-16 11:10:30',
      strategyId: 'sol_scalp_pro',
      isDistributed: true
    }
  ];

  async getTradingProfitsByUserId(userId: string): Promise<ProfitRecord[]> {
    await new Promise(resolve => setTimeout(resolve, 200));
    return this.mockProfits.filter(p => p.userId === userId || userId === 'all');
  }

  async getGlobalProfitsSummary(): Promise<{ totalVolumeUsdt: number; totalProfitUsdt: number; totalDistributedCommissionUsdt: number }> {
    await new Promise(resolve => setTimeout(resolve, 150));
    return {
      totalVolumeUsdt: 14850000.00,
      totalProfitUsdt: 3280000.00,
      totalDistributedCommissionUsdt: 412500.00
    };
  }
}

export const mockProfitService = new MockProfitService();
