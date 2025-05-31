import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { requireAuthToken } from "~/utils/auth.server";
import { portfolioService } from "~/services/portfolio.service";
import Layout from "~/components/Layout";
import PerformanceChart from "~/components/PerformanceChart";

export async function loader({ request }: LoaderFunctionArgs) {
  const token = await requireAuthToken(request);
  
  try {
    const [performance, monthlySummary] = await Promise.all([
      portfolioService.getPortfolioPerformance(),
      portfolioService.getMonthlyTransactionSummary(),
    ]);

    return json({ performance, monthlySummary });
  } catch (error) {
    throw new Response("Failed to load performance data", { status: 500 });
  }
}

export default function Performance() {
  const { performance, monthlySummary } = useLoaderData<typeof loader>();

  return (
    <Layout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-gray-900">Portfolio Performance</h1>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
                      ${performance.totalValue?.toLocaleString() || '0'}
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
                  <div className="w-8 h-8 bg-gray-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold">C</span>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Total Cost</dt>
                    <dd className="text-lg font-medium text-gray-900">
                      ${performance.totalCost?.toLocaleString() || '0'}
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
                    (performance.totalGain || 0) >= 0 ? 'bg-green-500' : 'bg-red-500'
                  }`}>
                    <span className="text-white font-bold">G</span>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Total Gain</dt>
                    <dd className={`text-lg font-medium ${
                      (performance.totalGain || 0) >= 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      ${performance.totalGain?.toLocaleString() || '0'}
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
                    (performance.percentageReturn || 0) >= 0 ? 'bg-green-500' : 'bg-red-500'
                  }`}>
                    <span className="text-white font-bold">%</span>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Return %</dt>
                    <dd className={`text-lg font-medium ${
                      (performance.percentageReturn || 0) >= 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {performance.percentageReturn?.toFixed(2) || '0.00'}%
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Performance */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Investment Details</h3>
            <dl className="space-y-4">
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
              <div className="flex justify-between">
                <dt className="text-sm text-gray-500">Buy Fees:</dt>
                <dd className="text-sm font-medium text-gray-900">
                  ${performance.totalBuyFees?.toLocaleString() || '0'}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-sm text-gray-500">Sell Fees:</dt>
                <dd className="text-sm font-medium text-gray-900">
                  ${performance.totalSellFees?.toLocaleString() || '0'}
                </dd>
              </div>
            </dl>
          </div>

          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Monthly Activity</h3>
            <PerformanceChart data={monthlySummary} type="bar" />
          </div>
        </div>
      </div>
    </Layout>
  );
}