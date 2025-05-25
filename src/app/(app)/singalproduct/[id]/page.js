"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import UseCartStore from "../../../../store/CartStore";

export default function Page() {
  const addToCartStore = UseCartStore((state) => state.addToCart);
  const router = useRouter();

  const params = useParams();
  const searchParams = useSearchParams();
  const id = params.id;
  const category = searchParams.get("category");
  const subcategory = searchParams.get("subcategory");

  const [product, setProduct] = useState(null);
  const [extraProducts, setExtraProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // User-selected values
  const [selectedSize, setSelectedSize] = useState(""); // <-- fixed from []
  const [selectedColor, setSelectedColor] = useState(""); // <-- fixed from []
  const [selectedQuantity, setSelectedQuantity] = useState(1);

  useEffect(() => {
    if (!id || !category) {
      setError("Missing required parameters");
      setLoading(false);
      return;
    }

    const fetchProduct = async () => {
      try {
        const res = await axios.get(
          `/api/findsingleProduct?id=${id}&category=${category}&subcategory=${subcategory}`
        );
        setProduct(res.data.product);
        setExtraProducts(res.data.extraproduct);
      } catch (err) {
        console.error("Error fetching product:", err);
        setError("Failed to fetch product");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id, category, subcategory]);

  const handleAdd = () => {
    if (!selectedSize || !selectedColor) {
      alert("Please select size and color.");
      return;
    }

    const payload = {
      id: product._id,
      name: product.name,
      size: selectedSize,
      color: selectedColor,
      quantity: selectedQuantity,
      price: product.originalprice,
      discount: product.totaldiscount,
      discountedPrice: product.discountedPrice,
      primaryimage: product.primaryimage,
      category: product.category,
      subcategory: product.subcategory,
    };

    addToCartStore(payload);
    alert("Product added to cart!");
  };

  const handleBuyNow = () => {
    if (!selectedSize || !selectedColor) {
      alert("Please select size and color.");
      return;
    }

    handleAdd(); // optionally add to cart as well
    router.push("/checkout");
  };

  if (loading)
    return (
      <div className="flex items-center justify-center w-screen h-screen bg-white">
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 border-4 border-gray-300 rounded-full animate-spin border-t-black"></div>
          <div className="absolute inset-2 border-4 border-gray-100 rounded-full"></div>
        </div>
      </div>
    );

  if (error) return <div>Error: {error}</div>;
  if (!product) return <div>Product not found</div>;

  const colors = product.color?.split(",") || [];
  const allImages = [product.primaryimage, ...(product.secondaryimage || [])];

  return (
    <>
      <div className="max-w-7xl mx-auto px-4 py-10 mt-14">
        <div className="grid md:grid-cols-2 gap-10">
          {/* Images */}
          <div className="space-y-4 gap-4 max-w-[500px]">
            {allImages.map((img, idx) => (
              <Link
                key={idx}
                href={`/singalproduct/${id}/image-gallery?idx=${idx}&category=${category}`}
                scroll={false}
              >
                <Image
                  src={img}
                  alt={idx === 0 ? product.name : `secondary-${idx}`}
                  width={600}
                  height={600}
                  className="w-full h-[80vh] mt-4 object-cover rounded-xl"
                />
              </Link>
            ))}
          </div>

          {/* Product Info */}
          <div className="flex flex-col justify-between">
            <div className="sticky top-16">
              <h1 className="text-3xl font-bold capitalize">{product.name}</h1>
              <p className="text-gray-600 text-sm capitalize mt-1">
                {product.category} / {product.subcategory}
              </p>

              <div className="mt-4 flex items-center gap-4">
                <p className="text-2xl font-bold text-green-600">
                  Rs {product.discountedPrice}
                </p>
                {product.totaldiscount > 0 && (
                  <>
                    <p className="text-sm line-through text-gray-500">
                      Rs {product.originalprice}
                    </p>
                    <p className="text-sm text-red-500">
                      ({product.totaldiscount}% OFF)
                    </p>
                  </>
                )}
              </div>

              {/* Size Selection */}
              <div className="mt-6">
                <h2 className="font-medium mb-2">Select Size:</h2>
                <div className="flex gap-2">
                  {product.sizes.map((size, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedSize(size)}
                      className={`h-10 w-10 text-sm border rounded-full hover:bg-gray-100 transition ${
                        selectedSize === size ? "bg-black text-white" : ""
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity Dropdown */}
              <div className="my-4">
                <label
                  htmlFor="quantity"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Quantity
                </label>
                <select
                  name="quantity"
                  id="quantity"
                  value={selectedQuantity}
                  onChange={(e) => setSelectedQuantity(Number(e.target.value))}
                  className="rounded-md px-6 py-2 text-gray-700 shadow-sm outline-none"
                  style={{ width: "auto", minWidth: "100px" }}
                >
                  {Array.from({ length: 12 }, (_, i) => (
                    <option key={i} value={i + 1}>
                      {i + 1}
                    </option>
                  ))}
                </select>
              </div>

              {/* Color Selection */}
              <div className="mb-4">
                <h2 className="font-medium mb-2">Available Colors:</h2>
                <div className="flex gap-2">
                  {colors.map((color, index) => (
                    <div
                      key={index}
                      onClick={() => setSelectedColor(color)}
                      className={`w-8 h-8 rounded-full border cursor-pointer ${
                        selectedColor === color ? "ring-2 ring-black" : ""
                      }`}
                      style={{ backgroundColor: color }}
                      title={color}
                      aria-label={color}
                    />
                  ))}
                </div>
              </div>

              {/* Buttons */}
              <div className="flex gap-4">
                <button
                  onClick={handleAdd}
                  className="text-md cursor-pointer hover:scale-105 transition-all font-semibold px-4 py-2 rounded-md bg-black text-white"
                >
                  Add to Cart
                </button>
                <button
                  onClick={handleBuyNow}
                  className="text-md cursor-pointer hover:scale-105 transition-all font-semibold px-4 py-2 rounded-md bg-black text-white"
                >
                  Buy Now
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Extra Products */}
      <div className="w-full flex overflow-x-auto gap-4 py-6 px-4">
        {extraProducts.map((item) => (
          <Link
            key={item._id}
            href={`/singalproduct/${item._id}?category=${item.category}&subcategory=${item.subcategory}`}
            className="relative w-[30vw] min-w-[30vw] flex-shrink-0 bg-white shadow overflow-hidden rounded-xl"
          >
            <Image
              src={item.primaryimage}
              alt={item.name}
              width={300}
              height={300}
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-0 left-0 w-full bg-black/60 text-white p-3">
              <p className="text-sm font-semibold truncate">{item.name}</p>
              <div className="flex items-center gap-2 text-sm">
                <span className="line-through text-red-600">
                  Rs {item.originalprice}
                </span>
                <span>({item.totaldiscount}% OFF)</span>
                <span className="text-green-400 font-bold">
                  Rs {item.discountedPrice}
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </>
  );
}
