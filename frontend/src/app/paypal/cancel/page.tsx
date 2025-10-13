// src/app/paypal/cancel/page.tsx
'use client';
import { useRouter } from 'next/navigation';

export default function PayPalCancel() {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#f8f6f3]">
      <h2 className="text-xl font-semibold text-red-600">
        ❌ Payment canceled
      </h2>
      <button
        onClick={() => router.push('/dashboard/buyer-dashboard')}
        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
      >
        Back to Dashboard
      </button>
    </div>
  );
}
