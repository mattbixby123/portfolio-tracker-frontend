import type { LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData, Link } from "@remix-run/react";
import { requireAuthToken } from "~/utils/auth.server";
import { portfolioService } from "~/services/portfolio.service";

import Layout from "~/components/Layout";
import PositionCard from "~/components/PositionCard";
import PerformanceChart from "~/components/PerformanceChart";
import type { PositionDto } from "~/types/position";


// Mock data for when services aren't available
const mockData = {
  summary: {
    totalValue: 0,
    totalPositions: 0,
    totalGain: 0,
    percentageReturn: 0
  },
  topHoldings: [],
  sectorAllocation: {}
};

export async function loader({ request }: LoaderFunctionArgs) {
  const token = await requireAuthToken(request);
  
  try {
    // Try to fetch real data with individual error handling
    const [summary, topHoldings, sectorAllocation] = await Promise.allSettled([
      portfolioService.getPortfolioSummary().catch(() => mockData.summary),
      portfolioService.getTopHoldings(5).catch(() => mockData.topHoldings),
      portfolioService.getSectorAllocation().catch(() => mockData.sectorAllocation),
    ]);

    return {
      summary: summary.status === 'fulfilled' ? summary.value : mockData.summary,
      topHoldings: topHoldings.status === 'fulfilled' ? topHoldings.value : mockData.topHoldings,
      sectorAllocation: sectorAllocation.status === 'fulfilled' ? sectorAllocation.value : mockData.sectorAllocation,
      isUsingMockData: true // Flag to show user this is placeholder data
    };
  } catch (error) {
    // Fallback to mock data instead of throwing
    console.warn("Portfolio service unavailable, using mock data:", error);
    return {
      ...mockData,
      isUsingMockData: true
    };
  }
}

interface LoaderData {
  summary: Record<string, any>;
  topHoldings: PositionDto[];
  sectorAllocation: Record<string, number>;
  isUsingMockData: boolean;
}

export default function Dashboard() {
  const { summary, topHoldings, sectorAllocation } = useLoaderData<LoaderData>();

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Portfolio Dashboard</h1>
          <div className="space-x-4">
            <Link
              to="/transactions/buy"
              className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
            >
              Buy Stock
            </Link>
            <Link
              to="/transactions/sell"
              className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
            >
              Sell Stock
            </Link>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold">$</span>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Total Value</dt>
                    <dd className="text-lg font-medium text-gray-900">
                      ${summary.totalValue?.toLocaleString() || '0'}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold">#</span>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Total Positions</dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {summary.totalPositions || 0}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    (summary.totalGain || 0) >= 0 ? 'bg-green-500' : 'bg-red-500'
                  }`}>
                    <span className="text-white font-bold">%</span>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Total Gain/Loss</dt>
                    <dd className={`text-lg font-medium ${
                      (summary.totalGain || 0) >= 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      ${summary.totalGain?.toLocaleString() || '0'}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    (summary.percentageReturn || 0) >= 0 ? 'bg-green-500' : 'bg-red-500'
                  }`}>
                    <span className="text-white font-bold">%</span>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Return %</dt>
                    <dd className={`text-lg font-medium ${
                      (summary.percentageReturn || 0) >= 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {summary.percentageReturn?.toFixed(2) || '0.00'}%
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Charts and Top Holdings */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Sector Allocation Chart */}
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Sector Allocation</h3>
            <PerformanceChart data={sectorAllocation} />
          </div>

          {/* Top Holdings */}
          <div className="bg-white shadow rounded-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">Top Holdings</h3>
              <Link
                to="/portfolio/positions"
                className="text-blue-600 hover:text-blue-500 text-sm font-medium"
              >
                View all
              </Link>
            </div>
            <div className="space-y-4">
              {topHoldings.map((position) => (
                <PositionCard key={position.id} position={position} compact />
              ))}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link
              to="/portfolio"
              className="flex items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center mr-4">
                <span className="text-white font-bold">P</span>
              </div>
              <div>
                <h4 className="font-medium text-gray-900">View Portfolio</h4>
                <p className="text-sm text-gray-500">See all positions and performance</p>
              </div>
            </Link>
            <Link
              to="/stocks"
              className="flex items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center mr-4">
                <span className="text-white font-bold">S</span>
              </div>
              <div>
                <h4 className="font-medium text-gray-900">Browse Stocks</h4>
                <p className="text-sm text-gray-500">Search and discover new investments</p>
              </div>
            </Link>
            <Link
              to="/transactions"
              className="flex items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center mr-4">
                <span className="text-white font-bold">T</span>
              </div>
              <div>
                <h4 className="font-medium text-gray-900">Transaction History</h4>
                <p className="text-sm text-gray-500">Review your trading activity</p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
}