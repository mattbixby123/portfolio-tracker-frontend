import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { useActionData, useSearchParams } from "@remix-run/react";
import { requireAuthToken } from "~/utils/auth.server";
import { transactionService } from "~/services/transaction.service";
import Layout from "~/components/Layout";
import TransactionForm from "~/components/TransactionForm";

interface ActionData {
  errors?: {
    stockTicker?: string;
    quantity?: string;
    price?: string;
    fee?: string;
    transactionDate?: string;
    submit?: string;
  };
}

export async function loader({ request }: LoaderFunctionArgs) {
  await requireAuthToken(request);
  return json({});
}

export async function action({ request }: ActionFunctionArgs) {
  await requireAuthToken(request);
  
  const formData = await request.formData();
  const stockTicker = formData.get("stockTicker")?.toString()?.toUpperCase();
  const quantity = parseFloat(formData.get("quantity")?.toString() || '0');
  const price = parseFloat(formData.get("price")?.toString() || '0');
  const fee = formData.get("fee")?.toString();
  const transactionDate = formData.get("transactionDate")?.toString();

  const errors: Record<string, string> = {};

  if (!stockTicker) errors.stockTicker = "Stock ticker is required";
  if (!quantity || quantity <= 0) errors.quantity = "Quantity must be greater than 0";
  if (!price || price <= 0) errors.price = "Price must be greater than 0";

  if (Object.keys(errors).length > 0) {
    return json({ errors }, { status: 400 });
  }

  try {
    await transactionService.sellStock({
      stockTicker: stockTicker!,
      transactionType: 'SELL',
      quantity,
      price,
      fee: fee ? parseFloat(fee) : undefined,
      transactionDate: transactionDate || undefined,
    });

    return redirect("/portfolio/positions");
  } catch (error: any) {
    return json({
      errors: { submit: error.response?.data?.message || "Failed to sell stock" }
    }, { status: 400 });
  }
}

export default function SellStock() {
  const actionData = useActionData<ActionData>();
  const [searchParams] = useSearchParams();
  const defaultTicker = searchParams.get("ticker") || "";

  return (
    <Layout>
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Sell Stock</h1>
          <p className="text-gray-600">Reduce or close a position in your portfolio</p>
        </div>
        
        <TransactionForm
          type="SELL"
          defaultTicker={defaultTicker}
          errors={actionData?.errors}
        />
      </div>
    </Layout>
  );
}