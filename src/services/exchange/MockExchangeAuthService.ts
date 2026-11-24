import { ExchangeAuthCredentials, ExchangeConfig } from './types';

export interface IExchangeAuthService {
  authenticate(credentials: ExchangeAuthCredentials): Promise<{ success: boolean; token?: string; error?: string }>;
  validateApiKey(apiKey: string, apiSecret: string): Promise<boolean>;
  getExchangeStatus(): Promise<ExchangeConfig>;
}

export class MockExchangeAuthService implements IExchangeAuthService {
  private config: ExchangeConfig = {
    apiUrl: 'https://api.tgex-exchange.internal/v1',
    apiKey: 'tgex_mock_key_live_read_only',
    isMock: true,
    connected: true,
    exchangeName: 'TGEX Multi-Broker Liquidity Engine (Mock)',
    lastPingMs: 16
  };

  async authenticate(credentials: ExchangeAuthCredentials): Promise<{ success: boolean; token?: string; error?: string }> {
    // Simulating server-side HMAC-SHA256 signature verification
    await new Promise(resolve => setTimeout(resolve, 400));
    
    if (!credentials.apiKey || !credentials.apiSecret) {
      return { success: false, error: 'API Key and API Secret are required' };
    }

    return {
      success: true,
      token: `tgex_jwt_exchange_${Math.random().toString(36).substring(2, 15)}`
    };
  }

  async validateApiKey(apiKey: string, apiSecret: string): Promise<boolean> {
    await new Promise(resolve => setTimeout(resolve, 200));
    return Boolean(apiKey.length >= 8 && apiSecret.length >= 8);
  }

  async getExchangeStatus(): Promise<ExchangeConfig> {
    return {
      ...this.config,
      lastPingMs: Math.floor(Math.random() * 15) + 10
    };
  }
}

export const mockExchangeAuthService = new MockExchangeAuthService();
