import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData, Form, useSubmit } from "@remix-run/react";
import { useState } from "react";
import { requireAuthToken } from "~/utils/auth.server";
import { stockService } from "~/services/stock.service";
import Layout from "~/components/Layout";
import StockCard from "~/components/StockCard";

export async function loader({ request }: LoaderFunctionArgs) {
  await requireAuthToken(request);
  
  const url = new URL(request.url);
  const query = url.searchParams.get("q");
  
  try {
    const stocks = query
      ? await stockService.searchStocks(query)
      : await stockService.getTopStocks(20);

    return json({ stocks, query });
  } catch (error) {
    throw new Response("Failed to load stocks", { status: 500 });
  }
}

export default function Stocks() {
  const { stocks, query } = useLoaderData<typeof loader>();
  const submit = useSubmit();
  const [searchQuery, setSearchQuery] = useState(query || "");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    submit({ q: searchQuery }, { method: "get" });
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Browse Stocks</h1>
        </div>

        {/* Search Form */}
        <div className="bg-white shadow rounded-lg p-6">
          <Form onSubmit={handleSearch} className="flex space-x-4">
            <div className="flex-1">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search stocks by ticker or company name..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              Search
            </button>
          </Form>
        </div>

        {/* Results */}
        <div className="space-y-4">
          {query && (
            <p className="text-gray-600">
              {stocks.length} results for "{query}"
            </p>
          )}
          
          {stocks.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-24 h-24 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <span className="text-gray-400 text-4xl">🔍</span>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {query ? "No stocks found" : "No stocks available"}
              </h3>
              <p className="text-gray-500">
                {query 
                  ? "Try searching with a different term or ticker symbol."
                  : "Stocks will appear here once they're added to the system."
                }
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {stocks.map((stock) => (
                <StockCard key={stock.id} stock={stock} />
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}