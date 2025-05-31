import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData, Link } from "@remix-run/react";
import { requireAuthToken } from "~/utils/auth.server";
import { portfolioService } from "~/services/portfolio.service";
import { positionService } from "~/services/position.service";
import Layout from "~/components/Layout";
import PositionCard from "~/components/PositionCard";
import PerformanceChart from "~/components/PerformanceChart";

export async function loader({ request }: LoaderFunctionArgs) {
  const token = await requireAuthToken(request);
  
  try {
    const [summary, topHoldings, sectorAllocation] = await Promise.all([
      portfolioService.getPortfolioSummary(),
      portfolioService.getTopHoldings(5),
      portfolioService.getSectorAllocation(),
    ]);

    return json({ summary, topHoldings, sectorAllocation });
  } catch (error) {
    throw new Response("Failed to load dashboard data", { status: 500 });
  }
}

export default function Dashboard() {
  const { summary, topHoldings, sectorAllocation } = useLoaderData<typeof loader>();

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