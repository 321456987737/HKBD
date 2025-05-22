'use client';
import React from 'react';
import UseCartStore from '@/store/CartStore';
import Image from 'next/image';
import { FaTrashAlt } from 'react-icons/fa';
import Link from 'next/link';
const CartPage = () => {
  const cartItems = UseCartStore((state) => state.cartItems);
  const clearCart = UseCartStore((state) => state.clearCart);
  const removeFromCart = UseCartStore((state) => state.removeFromCart);

  const totalAmount = cartItems.reduce(
    (total, item) => total + item.discountedPrice * item.quantity,
    0
  );

  if (cartItems.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center mt-20 text-center">
        <h2 className="text-2xl font-semibold">Your cart is empty 🛒</h2>
        <p className="text-gray-500 mt-2">Add some products to get started!</p>
        <div className='w-full flex items-center justify-center'>
          <Link href={'/'}>
        <button className='px-6 py-2 rounded-sm text-white text-lg cursor-pointer bg-slate-400 hover:bg-slate-500 mt-4 '>Start Shopping</button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="my-14 max-w-4xl mx-auto px-4">
      <h1 className="text-3xl font-bold mb-6">Your Shopping Cart</h1>

      <div className="space-y-6">
        {cartItems.map((item, index) => (
          <div
            key={item.id + item.size + item.color + index}
            className="flex gap-4 border rounded-xl p-4 shadow-sm items-start"
          >
            <Image
              width={100}
              height={100}
              src={item.primaryimage}
              alt={item.name}
              className="w-24 h-24 object-cover rounded-lg"
            />
            <div className="flex-1">
              <h2 className="text-lg font-semibold">{item.name}</h2>
              <p className="text-sm text-gray-600 capitalize">
                Category: {item.category} / {item.subcategory}
              </p>
              <p className="text-sm mt-1">
                Size: <span className="font-medium">{item.size}</span>, Color:{' '}
                <span className="font-medium">{item.color}</span>
              </p>
              <p className="text-sm mt-1">
                Quantity: <span className="font-medium">{item.quantity}</span>
              </p>
              <p className="text-sm mt-1">
                Price:
                <span className="line-through text-gray-400 ml-1">
                  ${item.price}
                </span>
                <span className="text-green-600 font-bold ml-2">
                  ${item.discountedPrice}
                </span>
              </p>
            </div>
            <button
              onClick={() =>
                removeFromCart(item.id, item.size, item.color)
              }
              className="text-red-500 hover:text-red-700 p-2 rounded-full transition-colors duration-200"
              title="Remove from cart"
            >
              <FaTrashAlt size={18} />
            </button>
          </div>
        ))}
      </div>

      <div className="mt-10 border-t pt-6 flex justify-between items-center">
        <h3 className="text-xl font-semibold">Total:</h3>
        <p className="text-2xl font-bold text-green-600">${totalAmount.toFixed(2)}</p>
      </div>

      <div className="mt-6 flex justify-between flex-wrap gap-4">
        <button
          onClick={clearCart}
          className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
        >
          Clear Cart
        </button>
        <button className="px-6 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition">
          Continue Shopping
        </button>
        <Link href={'/checkout'}>
        <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
          Checkout
        </button>
        </Link>
      </div>
    </div>
  );
};

export default CartPage;
