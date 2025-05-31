import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData, Link } from "@remix-run/react";
import { requireAuthToken } from "~/utils/auth.server";
import { positionService } from "~/services/position.service";
import Layout from "~/components/Layout";
import PositionCard from "~/components/PositionCard";

export async function loader({ request }: LoaderFunctionArgs) {
  const token = await requireAuthToken(request);
  
  try {
    const [positions, portfolioValue] = await Promise.all([
      positionService.getUserPositions(),
      positionService.getPortfolioValue(),
    ]);

    return json({ positions, portfolioValue });
  } catch (error) {
    throw new Response("Failed to load positions", { status: 500 });
  }
}

export default function Positions() {
  const { positions, portfolioValue } = useLoaderData<typeof loader>();

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Positions</h1>
            <p className="text-gray-600">
              Total Portfolio Value: ${portfolioValue.totalValue?.toLocaleString() || '0'}
            </p>
          </div>
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

        {positions.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-24 h-24 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <span className="text-gray-400 text-4xl">📊</span>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No positions yet</h3>
            <p className="text-gray-500 mb-6">
              Start building your portfolio by buying your first stock.
            </p>
            <Link
              to="/transactions/buy"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              Buy Your First Stock
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {positions.map((position) => (
              <PositionCard key={position.id} position={position} />
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}