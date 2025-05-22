"use client";
import Image from "next/image";
import images from "@/Assets/images";
import Link from "next/link";
import UseCartStore from "@/store/CartStore"; // adjust the path
import { useState } from "react";
import axios from "axios";
export default function CheckoutPage() {
  const { cartItems, removeFromCart } = UseCartStore();

  const [formData, setFormData] = useState({
    email: "",
    firstName: "",
    lastName: "",
    city: "",
    postalCode: "",
    phone: "",
    adress: "",
    paymentMethod: "card",
  });

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const handlePlaceOrder = async () => {
    try {
      const response = await axios.post("/api/payfast/initiate", {
        formData,
        cartItems,
        total,
      });
      console.log(response.data);

      const { url } = response.data;
      window.location.href = url; // redirect to PayFast
    } catch (error) {
      console.error("Payment error:", error);
      alert("Something went wrong during payment.");
    }
  };

  const handleRemoveItem = (id, size, color) => {
    removeFromCart(id, size, color);
  };

  const total = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  return (
    <>
      {/* Header */}
      <div className="flex w-full border-b border-[#E5E5E5] justify-between items-center px-[8.33%] py-4">
        <Link href="/">
          <Image src={images.logo} alt="logo" width={100} height={100} />
        </Link>
        <Link href="/cartPage">
          <Image src={images.cart} alt="cart" width={40} height={40} />
        </Link>
      </div>

      {/* Checkout Layout */}
      <div className="flex flex-col md:flex-row gap-8 px-[8.33%] py-10">
        {/* LEFT SIDE: Form */}
        <div className="w-full md:w-2/3">
          <h2 className="text-2xl font-semibold mb-6">Checkout</h2>
          <form className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              type="email"
              placeholder="Email"
              className="border p-3 rounded"
              required
            />
            <input
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              type="text"
              placeholder="Phone Number"
              className="border p-3 rounded"
              required
            />
            <input
              name="firstName"
              value={formData.firstName}
              onChange={handleInputChange}
              type="text"
              placeholder="First Name"
              className="border p-3 rounded"
              required
            />
            <input
              name="lastName"
              value={formData.lastName}
              onChange={handleInputChange}
              type="text"
              placeholder="Last Name"
              className="border p-3 rounded"
              required
            />
            <input
              name="city"
              value={formData.city}
              onChange={handleInputChange}
              type="text"
              placeholder="City"
              className="border p-3 rounded"
              required
            />
            <input
              name="postalCode"
              value={formData.postalCode}
              onChange={handleInputChange}
              type="text"
              placeholder="Postal Code"
              className="border p-3 rounded"
              required
            />
            <input
              name="adress"
              value={formData.adress}
              onChange={handleInputChange}
              type="text"
              placeholder="Adress"
              className="border p-3 rounded w-full"
              required
            />

            <div className="col-span-1 md:col-span-2 mt-6 bg-white p-4 rounded shadow">
              <h3 className="font-semibold text-lg mb-4 border-b pb-2">
                Payment Method
              </h3>

              {/* Payment Options */}
              <div className="space-y-2 mb-4">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="card"
                    checked={formData.paymentMethod === "card"}
                    onChange={handleInputChange}
                    className="mr-2"
                  />
                  <span>Credit / Debit Card</span>
                </label>

                <label className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="cod"
                    checked={formData.paymentMethod === "cod"}
                    onChange={handleInputChange}
                    className="mr-2"
                  />
                  <span>Cash on Delivery</span>
                </label>
              </div>

              {/* Card Payment Fields */}
              {formData.paymentMethod === "card" && (
                <div className="space-y-4 transition-all">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                      type="text"
                      name="cardNumber"
                      placeholder="Card Number"
                      className="border p-3 rounded w-full"
                    />
                    <input
                      type="text"
                      name="nameOnCard"
                      placeholder="Name on Card"
                      className="border p-3 rounded w-full"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <input
                      type="text"
                      name="expiryMonth"
                      placeholder="MM"
                      className="border p-3 rounded w-full"
                    />
                    <input
                      type="text"
                      name="expiryYear"
                      placeholder="YY"
                      className="border p-3 rounded w-full"
                    />
                  </div>

                  <input
                    type="text"
                    name="securityCode"
                    placeholder="Security Code (CVV)"
                    className="border p-3 rounded w-full"
                  />

                  <p className="text-green-600 text-sm font-medium">
                    ✅ Free Shipping All Over Pakistan
                  </p>
                </div>
              )}

              {/* COD Shipping Cost */}
              {formData.paymentMethod === "cod" && (
                <p className="text-red-600 text-sm font-medium">
                  🚚 Shipping Cost: Rs. 130
                </p>
              )}
            </div>
            <div className="w-full flex items-center justify-center">
              <button
                onClick={handlePlaceOrder}
                className="bg-black px-6 py-2 cursor-pointer text-white flex items-center justify-center"
              >
                Place Order
              </button>
            </div>
          </form>
        </div>

        {/* RIGHT SIDE: Cart Summary */}
        <div className="w-full md:w-1/3 bg-gray-100 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
          {cartItems.length === 0 ? (
            <p>No items in cart</p>
          ) : (
            <div className="space-y-4">
              {cartItems.map((item, index) => (
                <div key={index} className="flex justify-between items-start">
                  <div>
                    <Image
                      src={item.primaryimage}
                      alt={item.name}
                      width={100}
                      height={100}
                    />
                  </div>
                  <div>
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-gray-600">
                      Size: {item.size}, Color: {item.color}
                    </p>
                    <p className="text-sm text-gray-600">
                      Qty: {item.quantity}
                    </p>
                    <button
                      className="text-red-500 text-sm mt-1"
                      onClick={() =>
                        handleRemoveItem(item.id, item.size, item.color)
                      }
                    >
                      Remove
                    </button>
                  </div>
                  <p className="font-semibold">Rs. {item.price}</p>
                </div>
              ))}
              <hr />
              <div className="flex justify-between font-semibold">
                <p>Total</p>
                <p>Rs. {total}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
