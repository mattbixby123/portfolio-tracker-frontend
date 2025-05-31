import { Link } from "@remix-run/react";
import type { PositionDto } from "~/types/position";

interface PositionCardProps {
  position: PositionDto;
  compact?: boolean;
}

export default function PositionCard({ position, compact = false }: PositionCardProps) {
  const isPositive = (position.unrealizedProfitLoss || 0) >= 0;
  const percentageReturn = position.percentageReturn || 0;

  if (compact) {
    return (
      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
        <div className="flex items-center">
          <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center mr-3">
            <span className="text-white font-bold text-sm">
              {position.stockTicker.substring(0, 2)}
            </span>
          </div>
          <div>
            <h4 className="font-medium text-gray-900">{position.stockTicker}</h4>
            <p className="text-sm text-gray-500">{position.quantity} shares</p>
          </div>
        </div>
        <div className="text-right">
          <p className="font-medium text-gray-900">
            ${position.currentValue?.toLocaleString() || '0'}
          </p>
          <p className={`text-sm ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
            {percentageReturn.toFixed(2)}%
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white overflow-hidden shadow rounded-lg">
      <div className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mr-4">
              <span className="text-white font-bold">
                {position.stockTicker.substring(0, 2)}
              </span>
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-900">
                {position.stockTicker}
              </h3>
              <p className="text-sm text-gray-500">{position.stockName}</p>
            </div>
          </div>
          <Link
            to={`/portfolio/positions/${position.id}`}
            className="text-blue-600 hover:text-blue-500 text-sm font-medium"
          >
            View Details
          </Link>
        </div>

        <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <dt className="text-sm font-medium text-gray-500">Quantity</dt>
            <dd className="mt-1 text-sm text-gray-900">{position.quantity}</dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-gray-500">Avg Cost</dt>
            <dd className="mt-1 text-sm text-gray-900">
              ${position.averageCost?.toFixed(2) || '0'}
            </dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-gray-500">Current Price</dt>
            <dd className="mt-1 text-sm text-gray-900">
              ${position.currentPrice?.toFixed(2) || '0'}
            </dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-gray-500">Current Value</dt>
            <dd className="mt-1 text-sm text-gray-900">
              ${position.currentValue?.toLocaleString() || '0'}
            </dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-gray-500">Total Cost</dt>
            <dd className="mt-1 text-sm text-gray-900">
              ${position.totalCost?.toLocaleString() || '0'}
            </dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-gray-500">Unrealized P&L</dt>
            <dd className={`mt-1 text-sm font-medium ${
              isPositive ? 'text-green-600' : 'text-red-600'
            }`}>
              ${position.unrealizedProfitLoss?.toLocaleString() || '0'}
            </dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-gray-500">Return %</dt>
            <dd className={`mt-1 text-sm font-medium ${
              isPositive ? 'text-green-600' : 'text-red-600'
            }`}>
              {percentageReturn.toFixed(2)}%
            </dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-gray-500">First Purchased</dt>
            <dd className="mt-1 text-sm text-gray-900">
              {new Date(position.firstPurchased).toLocaleDateString()}
            </dd>
          </div>
        </div>

        {position.notes && (
          <div className="mt-4">
            <dt className="text-sm font-medium text-gray-500">Notes</dt>
            <dd className="mt-1 text-sm text-gray-900">{position.notes}</dd>
          </div>
        )}
      </div>
    </div>
  );
}