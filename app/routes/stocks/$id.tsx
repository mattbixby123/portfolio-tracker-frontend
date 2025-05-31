import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData, Link } from "@remix-run/react";
import { requireAuthToken } from "~/utils/auth.server";
import { stockService } from "~/services/stock.service";
import { transactionService } from "~/services/transaction.service";
import Layout from "~/components/Layout";

export async function loader({ request, params }: LoaderFunctionArgs) {
  await requireAuthToken(request);
  
  if (!params.id) {
    throw new Response("Stock ID is required", { status: 400 });
  }

  try {
    const stock = await stockService.getStockById(parseInt(params.id));
    const transactions = await transactionService.getStockTransactions(parseInt(params.id));

    return json({ stock, transactions });
  } catch (error) {
    throw new Response("Stock not found", { status: 404 });
  }
}

export default function StockDetail() {
  const { stock, transactions } = useLoaderData<typeof loader>();

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{stock.ticker}</h1>
            <p className="text-xl text-gray-600">{stock.name}</p>
          </div>
          <div className="space-x-4">
            <Link
              to={`/transactions/buy?ticker=${stock.ticker}`}
              className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
            >
              Buy Stock
            </Link>
            <Link
              to={`/transactions/sell?ticker=${stock.ticker}`}
              className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
            >
              Sell Stock
            </Link>
          </div>
        </div>

        {/* Stock Information */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Stock Information</h3>
          </div>
          <div className="px-6 py-4">
            <dl className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <dt className="text-sm font-medium text-gray-500">Current Price</dt>
                <dd className="mt-1 text-2xl font-bold text-gray-900">
                  ${stock.currentPrice?.toFixed(2) || 'N/A'}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Exchange</dt>
                <dd className="mt-1 text-sm text-gray-900">{stock.exchange}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Currency</dt>
                <dd className="mt-1 text-sm text-gray-900">{stock.currency}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Sector</dt>
                <dd className="mt-1 text-sm text-gray-900">{stock.sector || 'N/A'}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Industry</dt>
                <dd className="mt-1 text-sm text-gray-900">{stock.industry || 'N/A'}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Last Updated</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {stock.lastUpdated 
                    ? new Date(stock.lastUpdated).toLocaleString()
                    : 'N/A'
                  }
                </dd>
              </div>
            </dl>
          </div>
        </div>

        {/* Transaction History */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Your Transaction History</h3>
          </div>
          <div className="px-6 py-4">
            {transactions.length === 0 ? (
              <p className="text-gray-500">No transactions for this stock yet.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead>
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Type
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Quantity
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Price
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Total
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {transactions.map((transaction) => (
                      <tr key={transaction.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {transaction.transactionDate 
                            ? new Date(transaction.transactionDate).toLocaleDateString()
                            : 'N/A'
                          }
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            transaction.transactionType === 'BUY'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {transaction.transactionType}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {transaction.quantity}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          ${transaction.price.toFixed(2)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          ${transaction.totalCost?.toLocaleString() || '0'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}