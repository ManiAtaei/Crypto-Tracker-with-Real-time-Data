import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { TrendingUp, ArrowUpRight, ChevronRight, LineChart, Percent, DollarSign, BarChart3 } from 'lucide-react';
import axios from 'axios';

interface Crypto {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  price_change_percentage_24h: number;
  price_change_percentage_7d: number;
  price_change_percentage_30d: number;
  market_cap: number;
  total_volume: number;
  sparkline_in_7d: {
    price: number[];
  };
  ath_change_percentage: number;
  atl_change_percentage: number;
  circulating_supply: number;
  max_supply: number;
}

const Investments = () => {
  const { t } = useTranslation();

  const { data: cryptos, isLoading } = useQuery({
    queryKey: ['growingCryptos'],
    queryFn: async () => {
      const response = await axios.get(
        'https://api.coingecko.com/api/v3/coins/markets',
        {
          params: {
            vs_currency: 'usd',
            order: 'volume_desc', // Get high volume coins first
            per_page: 250, // Get more coins to filter
            sparkline: true,
            price_change_percentage: '24h,7d,30d'
          }
        }
      );
      return response.data as Crypto[];
    },
    refetchInterval: 30000 // Refetch every 30 seconds
  });

  // Advanced filtering for growing cryptocurrencies
  const growingCryptos = cryptos?.filter(crypto => {
    const hasPositiveGrowth = 
      crypto.price_change_percentage_24h > 0 && 
      crypto.price_change_percentage_7d > 0 &&
      crypto.price_change_percentage_30d > 0;
    
    const hasSignificantVolume = crypto.total_volume > 1000000; // $1M+ daily volume
    const hasMarketCap = crypto.market_cap > 10000000; // $10M+ market cap
    
    return hasPositiveGrowth && hasSignificantVolume && hasMarketCap;
  })
  .sort((a, b) => {
    // Calculate growth score based on multiple timeframes
    const scoreA = (a.price_change_percentage_24h + a.price_change_percentage_7d + a.price_change_percentage_30d) / 3;
    const scoreB = (b.price_change_percentage_24h + b.price_change_percentage_7d + b.price_change_percentage_30d) / 3;
    return scoreB - scoreA;
  })
  .slice(0, 10);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-600 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center mb-8">
        <TrendingUp className="h-8 w-8 text-indigo-600 mr-3" />
        <h1 className="text-3xl font-bold">Top Growing Cryptocurrencies</h1>
      </div>

      <div className="bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl shadow-lg p-6 mb-8 text-white">
        <h2 className="text-xl font-semibold mb-2">Growth Analysis Criteria</h2>
        <div className="grid md:grid-cols-3 gap-6 mb-4">
          <div className="flex items-start space-x-3">
            <Percent className="h-6 w-6 mt-1" />
            <div>
              <h3 className="font-semibold">Consistent Growth</h3>
              <p className="text-sm opacity-90">Positive growth across 24h, 7d, and 30d periods</p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <DollarSign className="h-6 w-6 mt-1" />
            <div>
              <h3 className="font-semibold">Market Stability</h3>
              <p className="text-sm opacity-90">Minimum $10M market cap for stability</p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <BarChart3 className="h-6 w-6 mt-1" />
            <div>
              <h3 className="font-semibold">Trading Activity</h3>
              <p className="text-sm opacity-90">Active trading with $1M+ daily volume</p>
            </div>
          </div>
        </div>
        <p className="text-sm opacity-80 mt-4">
          Note: Past performance does not guarantee future results. Always conduct thorough research before investing.
        </p>
      </div>

      <div className="grid gap-6">
        {growingCryptos?.map((crypto) => (
          <div key={crypto.id} className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                  <img
                    src={crypto.image}
                    alt={crypto.name}
                    className="h-12 w-12 rounded-full"
                  />
                  <div className="ml-4">
                    <h3 className="text-xl font-semibold">{crypto.name}</h3>
                    <p className="text-gray-500">{crypto.symbol.toUpperCase()}</p>
                  </div>
                </div>
                <Link
                  to={`/crypto/${crypto.id}`}
                  className="flex items-center text-indigo-600 hover:text-indigo-800"
                >
                  {t('crypto.details')}
                  <ChevronRight className="h-5 w-5 ml-1" />
                </Link>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-500">{t('crypto.price')}</p>
                  <p className="text-lg font-semibold">
                    ${crypto.current_price.toLocaleString()}
                  </p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-500">24h Growth</p>
                  <p className="text-lg font-semibold flex items-center text-green-600">
                    <ArrowUpRight className="h-5 w-5 mr-1" />
                    {crypto.price_change_percentage_24h.toFixed(2)}%
                  </p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-500">7d Growth</p>
                  <p className="text-lg font-semibold flex items-center text-green-600">
                    <ArrowUpRight className="h-5 w-5 mr-1" />
                    {crypto.price_change_percentage_7d.toFixed(2)}%
                  </p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-500">30d Growth</p>
                  <p className="text-lg font-semibold flex items-center text-green-600">
                    <ArrowUpRight className="h-5 w-5 mr-1" />
                    {crypto.price_change_percentage_30d.toFixed(2)}%
                  </p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4 mb-6">
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-500">Market Cap</p>
                  <p className="text-lg font-semibold">
                    ${crypto.market_cap.toLocaleString()}
                  </p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-500">24h Volume</p>
                  <p className="text-lg font-semibold">
                    ${crypto.total_volume.toLocaleString()}
                  </p>
                </div>
              </div>

              <div className="mt-6">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium">7-Day Price Trend</h4>
                  <div className="flex items-center text-green-600">
                    <LineChart className="h-4 w-4 mr-1" />
                    <span className="text-sm">Strong Upward Trend</span>
                  </div>
                </div>
                <div className="h-20 w-full bg-gray-50 rounded-lg overflow-hidden">
                  <div className="relative h-full">
                    <svg
                      className="absolute inset-0"
                      viewBox={`0 0 ${crypto.sparkline_in_7d.price.length} 100`}
                      preserveAspectRatio="none"
                    >
                      <path
                        d={`M0 ${100 - (crypto.sparkline_in_7d.price[0] / Math.max(...crypto.sparkline_in_7d.price) * 100)} ${crypto.sparkline_in_7d.price
                          .map((price, i) => `L${i} ${100 - (price / Math.max(...crypto.sparkline_in_7d.price) * 100)}`)
                          .join(' ')}`}
                        fill="none"
                        stroke="#4f46e5"
                        strokeWidth="2"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Investments;