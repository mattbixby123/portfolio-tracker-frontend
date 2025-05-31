import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData, Link } from "@remix-run/react";
import { requireAuthToken } from "~/utils/auth.server";
import { portfolioService } from "~/services/portfolio.service";
import Layout from "~/components/Layout";
import PerformanceChart from "~/components/PerformanceChart";

export async function loader({ request }: LoaderFunctionArgs) {
  const token = await requireAuthToken(request);
  
  try {
    const [performance, monthlySummary, sectorAllocation] = await Promise.all([
      portfolioService.getPortfolioPerformance(),
      portfolioService.getMonthlyTransactionSummary(),
      portfolioService.getSectorAllocation(),
    ]);

    return json({ performance, monthlySummary, sectorAllocation });
  } catch (error) {
    throw new Response("Failed to load portfolio data", { status: 500 });
  }
}

export default function Portfolio() {
  const { performance, monthlySummary, sectorAllocation } = useLoaderData<typeof loader>();

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Portfolio Overview</h1>
          <div className="space-x-4">
            <Link
              to="/portfolio/positions"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              View Positions
            </Link>
            <Link
              to="/portfolio/performance"
              className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
            >
              Performance Details
            </Link>
          </div>
        </div>

        {/* Performance Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Performance Metrics</h3>
              <dl className="space-y-2">
                <div className="flex justify-between">
                  <dt className="text-sm text-gray-500">Total Value:</dt>
                  <dd className="text-sm font-medium text-gray-900">
                    ${performance.totalValue?.toLocaleString() || '0'}
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-sm text-gray-500">Total Cost:</dt>
                  <dd className="text-sm font-medium text-gray-900">
                    ${performance.totalCost?.toLocaleString() || '0'}
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-sm text-gray-500">Total Gain:</dt>
                  <dd className={`text-sm font-medium ${
                    (performance.totalGain || 0) >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    ${performance.totalGain?.toLocaleString() || '0'}
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-sm text-gray-500">Return %:</dt>
                  <dd className={`text-sm font-medium ${
                    (performance.percentageReturn || 0) >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {performance.percentageReturn?.toFixed(2) || '0.00'}%
                  </dd>
                </div>
              </dl>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Investment Summary</h3>
              <dl className="space-y-2">
                <div className="flex justify-between">
                  <dt className="text-sm text-gray-500">Total Investment:</dt>
                  <dd className="text-sm font-medium text-gray-900">
                    ${performance.totalInvestment?.toLocaleString() || '0'}
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-sm text-gray-500">Total Sales:</dt>
                  <dd className="text-sm font-medium text-gray-900">
                    ${performance.totalSales?.toLocaleString() || '0'}
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-sm text-gray-500">Realized Gain:</dt>
                  <dd className={`text-sm font-medium ${
                    (performance.realizedGain || 0) >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    ${performance.realizedGain?.toLocaleString() || '0'}
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-sm text-gray-500">Total Fees:</dt>
                  <dd className="text-sm font-medium text-gray-900">
                    ${performance.totalFees?.toLocaleString() || '0'}
                  </dd>
                </div>
              </dl>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Sector Allocation</h3>
              <PerformanceChart data={sectorAllocation} type="pie" />
            </div>
          </div>
        </div>

        {/* Monthly Activity Chart */}
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Monthly Transaction Activity</h3>
          <PerformanceChart data={monthlySummary} type="bar" />
        </div>
      </div>
    </Layout>
  );
}