export interface GoldCountryPrice {
  country: string;
  code: string;
  currency: string;
  symbol: string;
  baseExchangeRateVsUSD: number; // 1 USD = X Local Currency
}

export const SUPPORTED_COUNTRIES: GoldCountryPrice[] = [
  { country: 'United States', code: 'US', currency: 'USD', symbol: '$', baseExchangeRateVsUSD: 1.0 },
  { country: 'United Kingdom', code: 'GB', currency: 'GBP', symbol: '£', baseExchangeRateVsUSD: 0.79 },
  { country: 'United Arab Emirates', code: 'AE', currency: 'AED', symbol: 'AED', baseExchangeRateVsUSD: 3.6725 },
  { country: 'Saudi Arabia', code: 'SA', currency: 'SAR', symbol: 'SAR', baseExchangeRateVsUSD: 3.75 },
  { country: 'Kuwait', code: 'KW', currency: 'KWD', symbol: 'KWD', baseExchangeRateVsUSD: 0.308 },
  { country: 'Qatar', code: 'QA', currency: 'QAR', symbol: 'QAR', baseExchangeRateVsUSD: 3.64 },
  { country: 'Turkey', code: 'TR', currency: 'TRY', symbol: '₺', baseExchangeRateVsUSD: 32.15 },
  { country: 'Germany', code: 'DE', currency: 'EUR', symbol: '€', baseExchangeRateVsUSD: 0.92 },
];

export const TROY_OUNCE_TO_GRAMS = 31.1034768;

export interface GoldPriceState {
  isConnected: boolean;
  spotPriceUSDPerOunce: number | null;
  lastUpdated: string | null;
  message: string;
}

export class GoldPriceService {
  private apiEndpoint: string;

  constructor(endpoint?: string) {
    this.apiEndpoint = endpoint || '';
  }

  /**
   * Fetch live gold price state.
   * If API endpoint is missing or not configured, returns unconnected state
   * rather than fabricated market figures.
   */
  async getLiveGoldPrices(): Promise<GoldPriceState> {
    if (!this.apiEndpoint) {
      return {
        isConnected: false,
        spotPriceUSDPerOunce: null,
        lastUpdated: null,
        message: 'Live gold prices are not connected yet',
      };
    }

    try {
      const response = await fetch(this.apiEndpoint);
      if (!response.ok) {
        throw new Error(`API response error: ${response.status}`);
      }
      const data = await response.json();
      return {
        isConnected: true,
        spotPriceUSDPerOunce: data.price_usd_per_ounce,
        lastUpdated: new Date(data.timestamp * 1000).toLocaleString(),
        message: 'Connected to live spot benchmark',
      };
    } catch (err) {
      return {
        isConnected: false,
        spotPriceUSDPerOunce: null,
        lastUpdated: null,
        message: 'Live market feed currently unreachable',
      };
    }
  }

  /**
   * Calculate indicative karat price per gram or per troy ounce for target currency
   */
  calculateKaratPrice(
    spotUSDPerOunce: number,
    karat: '24K' | '22K' | '21K' | '18K',
    unit: 'gram' | 'ounce',
    exchangeRate: number
  ): number {
    const karatMultiplierMap = {
      '24K': 24 / 24,
      '22K': 22 / 24,
      '21K': 21 / 24,
      '18K': 18 / 24,
    };

    const karatRatio = karatMultiplierMap[karat];
    const priceUSDPerOunceKarat = spotUSDPerOunce * karatRatio;

    if (unit === 'ounce') {
      return priceUSDPerOunceKarat * exchangeRate;
    }

    // Convert per troy ounce to per gram
    const priceUSDPerGramKarat = priceUSDPerOunceKarat / TROY_OUNCE_TO_GRAMS;
    return priceUSDPerGramKarat * exchangeRate;
  }
}
