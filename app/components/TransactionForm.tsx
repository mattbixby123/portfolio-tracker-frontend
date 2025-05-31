import { Form, useNavigation } from "@remix-run/react";
import { useState } from "react";
import type { TransactionDto } from "~/types/transaction";

interface TransactionFormProps {
  type: 'BUY' | 'SELL';
  defaultTicker?: string;
  onSubmit?: (data: TransactionDto) => void;
  errors?: Record<string, string>;
}

export default function TransactionForm({ 
  type, 
  defaultTicker = '', 
  errors = {} 
}: TransactionFormProps) {
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";
  const [transactionDate, setTransactionDate] = useState(
    new Date().toISOString().slice(0, 16)
  );

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-lg font-medium text-gray-900 mb-6">
        {type === 'BUY' ? 'Buy Stock' : 'Sell Stock'}
      </h2>
      
      <Form method="post" className="space-y-6">
        <input type="hidden" name="transactionType" value={type} />
        
        <div>
          <label htmlFor="stockTicker" className="block text-sm font-medium text-gray-700">
            Stock Ticker
          </label>
          <input
            type="text"
            id="stockTicker"
            name="stockTicker"
            defaultValue={defaultTicker}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 uppercase"
            placeholder="e.g., AAPL"
          />
          {errors.stockTicker && (
            <p className="text-red-600 text-sm mt-1">{errors.stockTicker}</p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="quantity" className="block text-sm font-medium text-gray-700">
              Quantity
            </label>
            <input
              type="number"
              id="quantity"
              name="quantity"
              min="0.000001"
              step="0.000001"
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="100"
            />
            {errors.quantity && (
              <p className="text-red-600 text-sm mt-1">{errors.quantity}</p>
            )}
          </div>

          <div>
            <label htmlFor="price" className="block text-sm font-medium text-gray-700">
              Price per Share
            </label>
            <input
              type="number"
              id="price"
              name="price"
              min="0.0001"
              step="0.01"
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="150.00"
            />
            {errors.price && (
              <p className="text-red-600 text-sm mt-1">{errors.price}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="fee" className="block text-sm font-medium text-gray-700">
              Transaction Fee (Optional)
            </label>
            <input
              type="number"
              id="fee"
              name="fee"
              min="0"
              step="0.01"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="9.95"
            />
            {errors.fee && (
              <p className="text-red-600 text-sm mt-1">{errors.fee}</p>
            )}
          </div>

          <div>
            <label htmlFor="transactionDate" className="block text-sm font-medium text-gray-700">
              Transaction Date
            </label>
            <input
              type="datetime-local"
              id="transactionDate"
              name="transactionDate"
              value={transactionDate}
              onChange={(e) => setTransactionDate(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
            {errors.transactionDate && (
              <p className="text-red-600 text-sm mt-1">{errors.transactionDate}</p>
            )}
          </div>
        </div>

        {errors.submit && (
          <div className="bg-red-50 border border-red-200 rounded-md p-4">
            <p className="text-red-600 text-sm">{errors.submit}</p>
          </div>
        )}

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => window.history.back()}
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className={`font-bold py-2 px-4 rounded text-white ${
              type === 'BUY'
                ? 'bg-green-500 hover:bg-green-700'
                : 'bg-red-500 hover:bg-red-700'
            } disabled:opacity-50`}
          >
            {isSubmitting ? 'Processing...' : `${type === 'BUY' ? 'Buy' : 'Sell'} Stock`}
          </button>
        </div>
      </Form>
    </div>
  );
}