import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, TrendingUp, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import axios from 'axios';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

interface CryptoData {
  id: string;
  name: string;
  symbol: string;
  image: {
    large: string;
  };
  market_data: {
    current_price: {
      usd: number;
    };
    price_change_percentage_24h: number;
    market_cap: {
      usd: number;
    };
    total_volume: {
      usd: number;
    };
    high_24h: {
      usd: number;
    };
    low_24h: {
      usd: number;
    };
  };
  description: {
    en: string;
  };
}

interface PriceData {
  prices: [number, number][];
}

function CryptoDetails() {
  const { id } = useParams();
  const { t } = useTranslation();

  const { data: cryptoData, isLoading: isLoadingData } = useQuery({
    queryKey: ['cryptoDetails', id],
    queryFn: async () => {
      const response = await axios.get(
        `https://api.coingecko.com/api/v3/coins/${id}?localization=false&tickers=false&community_data=false&developer_data=false`
      );
      return response.data as CryptoData;
    }
  });

  const { data: priceHistory, isLoading: isLoadingHistory } = useQuery({
    queryKey: ['cryptoHistory', id],
    queryFn: async () => {
      const response = await axios.get(
        `https://api.coingecko.com/api/v3/coins/${id}/market_chart?vs_currency=usd&days=7&interval=daily`
      );
      return response.data as PriceData;
    }
  });

  const chartData = priceHistory?.prices.map(([timestamp, price]) => ({
    date: new Date(timestamp).toLocaleDateString(),
    price: price
  }));

  if (isLoadingData || isLoadingHistory) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-600 border-t-transparent"></div>
      </div>
    );
  }

  if (!cryptoData) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p className="text-red-600">Failed to load cryptocurrency data.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Link to="/" className="inline-flex items-center text-indigo-600 hover:text-indigo-800 mb-6">
        <ArrowLeft className="h-5 w-5 mr-2" />
        {t('crypto.back')}
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
            <div className="flex items-center mb-6">
              <img
                src={cryptoData.image.large}
                alt={cryptoData.name}
                className="h-16 w-16 rounded-full"
              />
              <div className="ml-4">
                <h1 className="text-3xl font-bold">{cryptoData.name}</h1>
                <p className="text-gray-500">{cryptoData.symbol.toUpperCase()}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-gray-500">{t('crypto.price')}</p>
                <p className="text-xl font-semibold">
                  ${cryptoData.market_data.current_price.usd.toLocaleString()}
                </p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-gray-500">{t('crypto.change')}</p>
                <p className={`text-xl font-semibold flex items-center ${
                  cryptoData.market_data.price_change_percentage_24h >= 0
                    ? 'text-green-600'
                    : 'text-red-600'
                }`}>
                  {cryptoData.market_data.price_change_percentage_24h >= 0 ? (
                    <ArrowUpRight className="h-5 w-5 mr-1" />
                  ) : (
                    <ArrowDownRight className="h-5 w-5 mr-1" />
                  )}
                  {Math.abs(cryptoData.market_data.price_change_percentage_24h).toFixed(2)}%
                </p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-gray-500">{t('crypto.marketCap')}</p>
                <p className="text-xl font-semibold">
                  ${cryptoData.market_data.market_cap.usd.toLocaleString()}
                </p>
              </div>
            </div>

            <div className="h-[400px]">
              <h2 className="text-xl font-semibold mb-4">Price History (7 Days)</h2>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="price"
                    stroke="#4f46e5"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4">About {cryptoData.name}</h2>
            <div
              className="prose prose-sm max-w-none"
              dangerouslySetInnerHTML={{ __html: cryptoData.description.en }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default CryptoDetails;