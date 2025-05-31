import { Link } from "@remix-run/react";
import type { StockDto } from "~/types/stock";

interface StockCardProps {
  stock: StockDto;
  showActions?: boolean;
}

export default function StockCard({ stock, showActions = true }: StockCardProps) {
  return (
    <div className="bg-white overflow-hidden shadow rounded-lg">
      <div className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mr-4">
              <span className="text-white font-bold">
                {stock.ticker.substring(0, 2)}
              </span>
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-900">{stock.ticker}</h3>
              <p className="text-sm text-gray-500">{stock.name}</p>
            </div>
          </div>
          {showActions && (
            <div className="flex space-x-2">
              <Link
                to={`/transactions/buy?ticker=${stock.ticker}`}
                className="bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-3 rounded text-sm"
              >
                Buy
              </Link>
              <Link
                to={`/stocks/${stock.id}`}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-3 rounded text-sm"
              >
                View
              </Link>
            </div>
          )}
        </div>

        <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <dt className="text-sm font-medium text-gray-500">Current Price</dt>
            <dd className="mt-1 text-lg font-medium text-gray-900">
              ${stock.currentPrice?.toFixed(2) || 'N/A'}
            </dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-gray-500">Exchange</dt>
            <dd className="mt-1 text-sm text-gray-900">{stock.exchange}</dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-gray-500">Sector</dt>
            <dd className="mt-1 text-sm text-gray-900">{stock.sector || 'N/A'}</dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-gray-500">Currency</dt>
            <dd className="mt-1 text-sm text-gray-900">{stock.currency}</dd>
          </div>
        </div>

        {stock.industry && (
          <div className="mt-4">
            <dt className="text-sm font-medium text-gray-500">Industry</dt>
            <dd className="mt-1 text-sm text-gray-900">{stock.industry}</dd>
          </div>
        )}

        {stock.lastUpdated && (
          <div className="mt-2">
            <span className="text-xs text-gray-500">
              Last updated: {new Date(stock.lastUpdated).toLocaleString()}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}