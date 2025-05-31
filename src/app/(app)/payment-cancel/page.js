export default function PaymentCancel() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-gray-50">
      <h1 className="text-4xl font-bold text-red-600 mb-4">Payment Cancelled</h1>
      <p className="text-lg text-gray-700 mb-6">
        You have cancelled your payment. No charges were made.
      </p>
      <a
        href="/cartPage"
        className="px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
      >
        Return to Cart
      </a>
    </div>
  );
}