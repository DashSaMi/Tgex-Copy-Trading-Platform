import { TradingAccountInfo } from './types';

export interface ITradingAccountService {
  getAccountByUserId(userId: string): Promise<TradingAccountInfo | null>;
  connectAccount(userId: string, broker: string, accountId: string): Promise<TradingAccountInfo>;
  disconnectAccount(userId: string): Promise<boolean>;
}

export class MockTradingAccountService implements ITradingAccountService {
  private accounts: Record<string, TradingAccountInfo> = {
    'user_1': {
      accountId: 'MT5-904812',
      broker: 'Tgex Institutional Liquidity',
      server: 'Tgex-Live-Server01',
      accountType: 'live',
      balanceUsdt: 12500.00,
      equityUsdt: 13180.50,
      marginLevel: 940.5,
      openPositionsCount: 3,
      totalRealizedPnl: 4820.00,
      winRatePercent: 78.4,
      connectedAt: '2026-01-15T10:30:00Z'
    },
    'user_2': {
      accountId: 'MT5-783291',
      broker: 'Prime ECN Global',
      server: 'Prime-Live02',
      accountType: 'live',
      balanceUsdt: 8400.00,
      equityUsdt: 8450.00,
      marginLevel: 1200.0,
      openPositionsCount: 1,
      totalRealizedPnl: 1940.00,
      winRatePercent: 72.1,
      connectedAt: '2026-02-01T14:15:00Z'
    }
  };

  async getAccountByUserId(userId: string): Promise<TradingAccountInfo | null> {
    await new Promise(resolve => setTimeout(resolve, 200));
    return this.accounts[userId] || {
      accountId: `MT5-${Math.floor(100000 + Math.random() * 900000)}`,
      broker: 'Tgex Institutional ECN',
      server: 'Tgex-Live-01',
      accountType: 'live',
      balanceUsdt: 5000.00,
      equityUsdt: 5210.00,
      marginLevel: 850.0,
      openPositionsCount: 2,
      totalRealizedPnl: 1240.00,
      winRatePercent: 74.5,
      connectedAt: '2026-03-01T09:00:00Z'
    };
  }

  async connectAccount(userId: string, broker: string, accountId: string): Promise<TradingAccountInfo> {
    await new Promise(resolve => setTimeout(resolve, 400));
    const newAccount: TradingAccountInfo = {
      accountId,
      broker,
      server: 'Live-Server-Auto',
      accountType: 'live',
      balanceUsdt: 2500.00,
      equityUsdt: 2500.00,
      marginLevel: 1000,
      openPositionsCount: 0,
      totalRealizedPnl: 0,
      winRatePercent: 100,
      connectedAt: new Date().toISOString()
    };
    this.accounts[userId] = newAccount;
    return newAccount;
  }

  async disconnectAccount(userId: string): Promise<boolean> {
    await new Promise(resolve => setTimeout(resolve, 200));
    delete this.accounts[userId];
    return true;
  }
}

export const mockTradingAccountService = new MockTradingAccountService();
