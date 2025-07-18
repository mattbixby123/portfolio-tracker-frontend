// app/routes/$.tsx
import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  
  // Handle Chrome DevTools requests
  if (url.pathname.includes('.well-known/appspecific/com.chrome.devtools.json')) {
    return json({}, { status: 404 });
  }
  
  // Handle other 404s
  throw new Response("Not Found", { status: 404 });
}

export default function CatchAll() {
  return null;
}