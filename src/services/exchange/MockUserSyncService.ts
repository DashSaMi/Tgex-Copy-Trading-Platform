import { UserSyncData } from './types';

export interface IUserSyncService {
  syncUserWithExchange(userId: string, email: string): Promise<UserSyncData>;
  getUserSyncStatus(userId: string): Promise<UserSyncData | null>;
}

export class MockUserSyncService implements IUserSyncService {
  private syncRecords: Record<string, UserSyncData> = {
    'user_1': {
      userId: 'user_1',
      externalTradingId: 'EX-SUB-482910',
      lastSyncedTimestamp: '2026-08-19 14:30:00 UTC',
      syncStatus: 'in_sync',
      recordedVolumeUsdt: 84200.00
    }
  };

  async syncUserWithExchange(userId: string, email: string): Promise<UserSyncData> {
    await new Promise(resolve => setTimeout(resolve, 300));
    const syncData: UserSyncData = {
      userId,
      externalTradingId: `EX-SUB-${Math.floor(100000 + Math.random() * 900000)}`,
      lastSyncedTimestamp: new Date().toISOString().replace('T', ' ').substring(0, 19) + ' UTC',
      syncStatus: 'in_sync',
      recordedVolumeUsdt: 12500.00
    };
    this.syncRecords[userId] = syncData;
    return syncData;
  }

  async getUserSyncStatus(userId: string): Promise<UserSyncData | null> {
    await new Promise(resolve => setTimeout(resolve, 150));
    return this.syncRecords[userId] || {
      userId,
      externalTradingId: `EX-SUB-${Math.floor(100000 + Math.random() * 900000)}`,
      lastSyncedTimestamp: '2026-08-19 12:00:00 UTC',
      syncStatus: 'in_sync',
      recordedVolumeUsdt: 0
    };
  }
}

export const mockUserSyncService = new MockUserSyncService();
