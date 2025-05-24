export async function POST(req) {
  const { formData, cartItems, total } = await req.json();

  const merchant_id = "10000100";
  const merchant_key = "46f0cd694581a";
  const return_url = "http://localhost:3000/payment-success";
  const cancel_url = "https://localhost:3000/payment-cancel";
  const notify_url = "https://localhost:3000/api/payfast/ipn";
   
     const item_name = cartItems.map((item) => item.name).join(", ");
  const amount = total.toFixed(2);
  const data = {
    merchant_id,
    merchant_key,
    return_url,
    cancel_url,
    notify_url,
    amount,
    item_name,
    email_address: formData.email,
  };

  const queryString = new URLSearchParams(data).toString();
  const paymentUrl = `https://sandbox.payfast.co.za/eng/process?${queryString}`;

  return Response.json({ url: paymentUrl });
}
