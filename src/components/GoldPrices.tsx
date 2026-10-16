import { useState, useEffect, useMemo } from 'react';
import { Globe2, AlertCircle, RefreshCw, Layers } from 'lucide-react';
import {
  GoldPriceService,
  SUPPORTED_COUNTRIES,
  type GoldPriceState,
} from '../services/goldPriceService';
import { SITE_CONFIG } from '../config/site';

export const GoldPrices = () => {
  const [selectedCountryCode, setSelectedCountryCode] = useState<string>('US');
  const [selectedKarat, setSelectedKarat] = useState<'24K' | '22K' | '21K' | '18K'>('24K');
  const [selectedUnit, setSelectedUnit] = useState<'gram' | 'ounce'>('gram');
  const [priceState, setPriceState] = useState<GoldPriceState>({
    isConnected: false,
    spotPriceUSDPerOunce: null,
    lastUpdated: null,
    message: 'Live gold prices are not connected yet',
  });
  const [loading, setLoading] = useState<boolean>(false);

  const goldService = useMemo(() => new GoldPriceService(SITE_CONFIG.goldPriceApiEndpoint), []);

  const selectedCountry = useMemo(() => {
    return SUPPORTED_COUNTRIES.find((c) => c.code === selectedCountryCode) || SUPPORTED_COUNTRIES[0];
  }, [selectedCountryCode]);

  const fetchPrices = async () => {
    setLoading(true);
    const res = await goldService.getLiveGoldPrices();
    setPriceState(res);
    setLoading(false);
  };

  useEffect(() => {
    fetchPrices();
  }, [goldService]);

  return (
    <section id="gold-prices" className="py-24 px-6 md:px-12 bg-[#061D12] text-[#F5EBE1] border-t border-[#133D28]">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <p className="font-sans-luxury text-xs tracking-[0.3em] text-[#E3C27E] uppercase mb-3">
            Spot Market Rates & International Benchmarks
          </p>
          <h2 className="font-serif-luxury text-3xl md:text-5xl font-normal tracking-wide text-[#F5EBE1]">
            International Gold Prices
          </h2>
          <div className="w-16 h-px bg-[#D4AF37]/40 mx-auto mt-6" />
        </div>

        {/* Unconnected / Status Banner */}
        {!priceState.isConnected && (
          <div className="mb-12 p-6 rounded-2xl bg-[#0B2B1B]/80 border border-[#D4AF37]/20 backdrop-blur-sm flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
            <div className="flex items-center space-x-4">
              <div className="p-3 rounded-full bg-[#133D28] text-[#E3C27E]">
                <AlertCircle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-serif-luxury text-lg text-[#F5EBE1]">Market Feed Pending Configuration</h3>
                <p className="font-sans-luxury text-xs text-[#E3C27E]/80 mt-1">
                  {priceState.message} — Connect your preferred gold API key to stream real-time rates.
                </p>
              </div>
            </div>
            <button
              onClick={fetchPrices}
              disabled={loading}
              className="px-5 py-2.5 rounded-full border border-[#D4AF37]/40 text-xs font-sans-luxury tracking-wider text-[#F5EBE1] hover:bg-[#D4AF37]/20 transition-colors flex items-center space-x-2 shrink-0"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              <span>RECHECK FEED</span>
            </button>
          </div>
        )}

        {/* Controls Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {/* Country / Currency Selection */}
          <div className="bg-[#0B2B1B] p-6 rounded-xl border border-[#133D28]">
            <label className="block font-sans-luxury text-xs tracking-widest text-[#E3C27E] uppercase mb-3 flex items-center gap-2">
              <Globe2 className="w-4 h-4" /> Country & Currency
            </label>
            <select
              value={selectedCountryCode}
              onChange={(e) => setSelectedCountryCode(e.target.value)}
              className="w-full bg-[#061D12] border border-[#D4AF37]/30 text-[#F5EBE1] text-sm rounded-lg p-3 focus:outline-none focus:border-[#D4AF37] transition-colors"
            >
              {SUPPORTED_COUNTRIES.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.country} ({c.currency})
                </option>
              ))}
            </select>
          </div>

          {/* Karat Selection */}
          <div className="bg-[#0B2B1B] p-6 rounded-xl border border-[#133D28]">
            <label className="block font-sans-luxury text-xs tracking-widest text-[#E3C27E] uppercase mb-3 flex items-center gap-2">
              <Layers className="w-4 h-4" /> Karat Grade
            </label>
            <div className="grid grid-cols-4 gap-2">
              {(['24K', '22K', '21K', '18K'] as const).map((k) => (
                <button
                  key={k}
                  onClick={() => setSelectedKarat(k)}
                  className={`py-2 text-xs font-medium rounded-lg border transition-all ${
                    selectedKarat === k
                      ? 'bg-[#D4AF37] text-[#061D12] border-[#D4AF37]'
                      : 'border-[#133D28] text-[#F5EBE1] hover:border-[#D4AF37]/50'
                  }`}
                >
                  {k}
                </button>
              ))}
            </div>
          </div>

          {/* Weight Unit Selection */}
          <div className="bg-[#0B2B1B] p-6 rounded-xl border border-[#133D28]">
            <label className="block font-sans-luxury text-xs tracking-widest text-[#E3C27E] uppercase mb-3">
              Weight Unit
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setSelectedUnit('gram')}
                className={`py-2 text-xs font-medium rounded-lg border transition-all ${
                  selectedUnit === 'gram'
                    ? 'bg-[#D4AF37] text-[#061D12] border-[#D4AF37]'
                    : 'border-[#133D28] text-[#F5EBE1] hover:border-[#D4AF37]/50'
                }`}
              >
                Per Gram (g)
              </button>
              <button
                onClick={() => setSelectedUnit('ounce')}
                className={`py-2 text-xs font-medium rounded-lg border transition-all ${
                  selectedUnit === 'ounce'
                    ? 'bg-[#D4AF37] text-[#061D12] border-[#D4AF37]'
                    : 'border-[#133D28] text-[#F5EBE1] hover:border-[#D4AF37]/50'
                }`}
              >
                Troy Ounce (oz)
              </button>
            </div>
          </div>
        </div>

        {/* Price Display Grid across all Karats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {(['24K', '22K', '21K', '18K'] as const).map((karat) => {
            const isSelected = selectedKarat === karat;
            const displayValue = priceState.spotPriceUSDPerOunce
              ? goldService
                  .calculateKaratPrice(
                    priceState.spotPriceUSDPerOunce,
                    karat,
                    selectedUnit,
                    selectedCountry.baseExchangeRateVsUSD
                  )
                  .toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
              : '—';

            return (
              <div
                key={karat}
                onClick={() => setSelectedKarat(karat)}
                className={`p-6 rounded-xl border text-center cursor-pointer transition-all ${
                  isSelected
                    ? 'bg-[#0B2B1B] border-[#D4AF37] shadow-[0_0_25px_rgba(212,175,55,0.15)] scale-[1.02]'
                    : 'bg-[#061D12] border-[#133D28] hover:border-[#D4AF37]/40'
                }`}
              >
                <span className="font-sans-luxury text-xs tracking-widest text-[#E3C27E] uppercase block mb-2">
                  {karat} Gold
                </span>
                <p className="font-serif-luxury text-2xl md:text-3xl font-medium text-[#F5EBE1]">
                  {selectedCountry.symbol} {displayValue}
                </p>
                <span className="font-sans-luxury text-[10px] text-[#E3C27E]/60 uppercase tracking-wider block mt-2">
                  {selectedCountry.currency} / {selectedUnit}
                </span>
              </div>
            );
          })}
        </div>

        {/* Disclaimer */}
        <p className="font-sans-luxury text-[11px] text-[#E3C27E]/60 text-center mt-10 max-w-3xl mx-auto leading-relaxed">
          Indicative spot prices reflect raw bullion market benchmarks. Final retail jewelry prices incorporate manufacturing craftsmanship, design intricacy, metal purities, gemstone settings, taxes, and retailer duties.
        </p>
      </div>
    </section>
  );
};
