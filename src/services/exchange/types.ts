// Exchange Copy Trading API Types & Contracts

export interface ExchangeConfig {
  apiUrl: string;
  apiKey: string;
  isMock: boolean;
  connected: boolean;
  exchangeName: string;
  lastPingMs: number;
}

export interface ExchangeAuthCredentials {
  apiKey: string;
  apiSecret: string;
  passphrase?: string;
  exchangeType: 'binance' | 'bybit' | 'okx' | 'metatrader5' | 'mock';
}

export interface TradingAccountInfo {
  accountId: string;
  broker: string;
  server: string;
  accountType: 'live' | 'demo';
  balanceUsdt: number;
  equityUsdt: number;
  marginLevel: number;
  openPositionsCount: number;
  totalRealizedPnl: number;
  winRatePercent: number;
  connectedAt: string;
}

export interface ProfitRecord {
  id: string;
  userId: string;
  tradeId: string;
  symbol: string;
  side: 'BUY' | 'SELL';
  volume: number;
  openPrice: number;
  closePrice: number;
  profitAmountUsdt: number;
  commissionCalculatedUsdt: number;
  closedAt: string;
  strategyId: string;
  isDistributed: boolean;
}

export interface TraderProfile {
  id: string;
  name: string;
  avatar: string;
  bio: string;
  winRate: number;
  roiMonthly: number;
  totalSubscribers: number;
  aumUsdt: number;
  riskScore: number; // 1 to 5
  strategies: string[];
  exchangeSource: string;
}

export interface CopyTradingSubscription {
  subscriptionId: string;
  userId: string;
  traderId: string;
  traderName: string;
  allocatedAmountUsdt: number;
  copyRatioPercent: number;
  stopLossPercent: number;
  takeProfitPercent: number;
  status: 'active' | 'paused' | 'terminated';
  subscribedAt: string;
  totalPnlUsdt: number;
}

export interface UserSyncData {
  userId: string;
  externalTradingId: string;
  lastSyncedTimestamp: string;
  syncStatus: 'in_sync' | 'pending' | 'sync_error';
  recordedVolumeUsdt: number;
}
