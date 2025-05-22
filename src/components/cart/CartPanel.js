"use client";
import Image from "next/image";
import Link from "next/link";
import UseCartStore from '@/store/CartStore';
import images from "@/Assets/images";

function CartPanel({ isVisible, onClose }) {
  const cartItems = UseCartStore((state) => state.cartItems);
  const removeFromCart = UseCartStore((state) => state.removeFromCart);

  const totalAmount = cartItems.reduce(
    (total, item) => total + item.discountedPrice * item.quantity,
    0
  );

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Overlay */}
      <div
        className="w-full h-full bg-black/50"
        onClick={onClose}
      ></div>

      {/* Cart Panel */}
      <div
        className="absolute right-0 w-[350px] h-full bg-white shadow-lg p-4 animate-slide-in-right overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between border-b pb-4">
          <h2 className="text-xl font-bold">Your Cart ({cartItems.length})</h2>
          <button onClick={onClose}>
            <Image
              className="hover:rotate-180 transition-transform"
              src="/close.png"
              alt="close"
              width={24}
              height={24}
            />
          </button>
        </div>

        {/* Cart Items */}
        <div className="mt-4 space-y-4 max-h-[320px] overflow-y-auto">
          {cartItems.length === 0 ? (
            <p className="text-center text-gray-500">Your cart is empty.</p>
          ) : (
            cartItems.map((item, index) => (
              <div key={item.id + item.size + item.color + index} className="flex border-b pb-4">
                <div className="w-1/3 flex items-center justify-center">
                  <Image
                    src={item.primaryimage}
                    alt={item.name}
                    width={75}
                    height={75}
                    className="rounded shadow"
                  />
                </div>
                <div className="w-2/3 pl-2">
                  <h3 className="font-semibold">{item.name}</h3>
                  <p className="text-sm text-gray-600">Size: {item.size}</p>
                  <p className="text-sm text-gray-600">Color: {item.color}</p>
                  <p className="text-sm font-semibold text-green-600">
                    ${item.discountedPrice} x {item.quantity}
                  </p>
                  <button
                    onClick={() => removeFromCart(item)}
                    className="text-sm text-red-600 mt-1 hover:underline"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Promo Section */}
        <div className="my-4 border-y py-4 space-y-2">
          <Image src={images.Giftcart} alt="Giftcart" width={100} height={100} />
          <input
            className="w-full border px-3 py-1 outline-none"
            type="text"
            placeholder="Enter Promo Code"
          />
          <p className="text-xs text-gray-500">
            Format: GK-Gift Card Number-Security Code
          </p>
        </div>

        {/* Total + Actions */}
        <div className="flex justify-between font-bold text-lg mt-2 mb-4">
          <span>Total:</span>
          <span>${totalAmount.toFixed(2)}</span>
        </div>

        <div className="space-y-2">
          <Link
            href="/checkout"
            onClick={onClose}
            className="block text-center bg-black text-white py-2 rounded hover:bg-gray-800"
          >
            Checkout
          </Link>
          <Link href="/cartPage">
            <button
              onClick={onClose}
              className="w-full border border-black text-black py-2 rounded hover:bg-gray-100"
            >
              View Cart
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default CartPanel;
