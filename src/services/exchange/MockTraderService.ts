import { TraderProfile } from './types';

export interface ITraderService {
  getFeaturedTraders(): Promise<TraderProfile[]>;
  getTraderById(traderId: string): Promise<TraderProfile | null>;
}

export class MockTraderService implements ITraderService {
  private mockTraders: TraderProfile[] = [
    {
      id: 'trader_alpha_1',
      name: 'Trend Momentum Grid (Alpha-1)',
      avatar: 'TG',
      bio: 'استراتژی الگوریتمی بر مبنای کانال‌های رگرسیون خطی و مومنتوم بیت‌کوین با حد ضرر خودکار.',
      winRate: 84.5,
      roiMonthly: 28.4,
      totalSubscribers: 420,
      aumUsdt: 2450000,
      riskScore: 2,
      strategies: ['BTC/USDT', 'ETH/USDT'],
      exchangeSource: 'Tgex Institutional Liquidity Pool'
    },
    {
      id: 'trader_macro_2',
      name: 'Macro Breakout Pro',
      avatar: 'MB',
      bio: 'معاملات سوئینگ بر روی ساختار امواج الیوت و شکست سطوح کلیدی نقدینگی.',
      winRate: 78.2,
      roiMonthly: 22.1,
      totalSubscribers: 280,
      aumUsdt: 1420000,
      riskScore: 3,
      strategies: ['SOL/USDT', 'AVAX/USDT', 'LINK/USDT'],
      exchangeSource: 'Binance VIP Institutional'
    },
    {
      id: 'trader_scalp_3',
      name: 'High-Frequency Delta Scalper',
      avatar: 'HF',
      bio: 'اسکالپ خودکار دفتر سفارشات (Orderbook Flow) در صرافی‌های متمرکز با زمان نگهداری کوتاه.',
      winRate: 74.8,
      roiMonthly: 19.5,
      totalSubscribers: 142,
      aumUsdt: 980000,
      riskScore: 2,
      strategies: ['BTC/USDT', 'ETH/USDT'],
      exchangeSource: 'Bybit Prime Master'
    }
  ];

  async getFeaturedTraders(): Promise<TraderProfile[]> {
    await new Promise(resolve => setTimeout(resolve, 200));
    return this.mockTraders;
  }

  async getTraderById(traderId: string): Promise<TraderProfile | null> {
    await new Promise(resolve => setTimeout(resolve, 150));
    return this.mockTraders.find(t => t.id === traderId) || null;
  }
}

export const mockTraderService = new MockTraderService();
