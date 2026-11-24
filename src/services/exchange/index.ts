// Unified TGEX External Exchange Integration Layer
// In development & stage: delegates to Mock services
// In production: effortlessly swaps to Live Exchange API without touching frontend React components

export * from './types';
export * from './MockExchangeAuthService';
export * from './MockTradingAccountService';
export * from './MockProfitService';
export * from './MockTraderService';
export * from './MockCopyTradingService';
export * from './MockUserSyncService';

import { mockExchangeAuthService, IExchangeAuthService } from './MockExchangeAuthService';
import { mockTradingAccountService, ITradingAccountService } from './MockTradingAccountService';
import { mockProfitService, IProfitService } from './MockProfitService';
import { mockTraderService, ITraderService } from './MockTraderService';
import { mockCopyTradingService, ICopyTradingService } from './MockCopyTradingService';
import { mockUserSyncService, IUserSyncService } from './MockUserSyncService';

export interface ExchangeApiClients {
  auth: IExchangeAuthService;
  account: ITradingAccountService;
  profit: IProfitService;
  trader: ITraderService;
  copyTrading: ICopyTradingService;
  userSync: IUserSyncService;
}

// Global Service Container
export const exchangeService: ExchangeApiClients = {
  auth: mockExchangeAuthService,
  account: mockTradingAccountService,
  profit: mockProfitService,
  trader: mockTraderService,
  copyTrading: mockCopyTradingService,
  userSync: mockUserSyncService
};
