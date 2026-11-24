import { CopyTradingSubscription } from './types';

export interface ICopyTradingService {
  getUserSubscriptions(userId: string): Promise<CopyTradingSubscription[]>;
  createSubscription(
    userId: string,
    traderId: string,
    traderName: string,
    allocatedAmountUsdt: number,
    copyRatioPercent: number,
    stopLossPercent: number,
    takeProfitPercent: number
  ): Promise<CopyTradingSubscription>;
  cancelSubscription(subscriptionId: string): Promise<boolean>;
}

export class MockCopyTradingService implements ICopyTradingService {
  private subscriptions: CopyTradingSubscription[] = [
    {
      subscriptionId: 'sub_89210',
      userId: 'user_1',
      traderId: 'trader_alpha_1',
      traderName: 'Trend Momentum Grid (Alpha-1)',
      allocatedAmountUsdt: 2500.00,
      copyRatioPercent: 100,
      stopLossPercent: 10,
      takeProfitPercent: 35,
      status: 'active',
      subscribedAt: '2026-02-10T11:00:00Z',
      totalPnlUsdt: 742.50
    }
  ];

  async getUserSubscriptions(userId: string): Promise<CopyTradingSubscription[]> {
    await new Promise(resolve => setTimeout(resolve, 200));
    return this.subscriptions.filter(s => s.userId === userId);
  }

  async createSubscription(
    userId: string,
    traderId: string,
    traderName: string,
    allocatedAmountUsdt: number,
    copyRatioPercent: number,
    stopLossPercent: number,
    takeProfitPercent: number
  ): Promise<CopyTradingSubscription> {
    await new Promise(resolve => setTimeout(resolve, 300));
    const newSub: CopyTradingSubscription = {
      subscriptionId: `sub_${Math.floor(10000 + Math.random() * 90000)}`,
      userId,
      traderId,
      traderName,
      allocatedAmountUsdt,
      copyRatioPercent,
      stopLossPercent,
      takeProfitPercent,
      status: 'active',
      subscribedAt: new Date().toISOString(),
      totalPnlUsdt: 0
    };
    this.subscriptions.push(newSub);
    return newSub;
  }

  async cancelSubscription(subscriptionId: string): Promise<boolean> {
    await new Promise(resolve => setTimeout(resolve, 200));
    this.subscriptions = this.subscriptions.filter(s => s.subscriptionId !== subscriptionId);
    return true;
  }
}

export const mockCopyTradingService = new MockCopyTradingService();
