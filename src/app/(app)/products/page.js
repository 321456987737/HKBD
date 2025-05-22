"use client"
import { useSearchParams } from "next/navigation";

import { useEffect, useState } from "react";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";

const ProductsPage = () => {
  const searchParams = useSearchParams();
  const category = searchParams.get("category");
  const subcategory = searchParams.get("subcategory");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  console.log(products);

  useEffect(() => {
    const fetchProducts = async () => {
      if (!category) {
        setLoading(false);
        setError("No category specified");
        return;
      }

      setLoading(true);
      setError(null);

      try {
        let url = `/api/product/filter?category=${category}`;
        if (subcategory) {
          url += `&subcategory=${subcategory}`;
        }

        const res = await axios.get(url);

        if (res.data.success) {
          setProducts(res.data.products);
        } else {
          setError(res.data.error || "Failed to load products");
        }
      } catch (error) {
        setError(error.response?.data?.error || "Failed to connect to server");
        console.error("Failed to fetch products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [category, subcategory]); // <== include subcategory as a dependency

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 "></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-center">
        <h1 className="text-xl font-semibold mb-4 text-red-500">Error</h1>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <>
      <div className=" mt-18">
        {products.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-gray-500">No products found in this category.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
            {products.map((product) => {
              const discountedPrice = product.discountedPrice;
              console.log(product, "product");

              return (
                <Link
                  href={`/singalproduct/${product._id}?category=${category}&subcategory=${product.subcategory}`}
                  key={product._id}
                >
                  <div
                    key={product._id}
                    className="group   overflow-hidden  bg-white"
                  >
                    {/* Product Image */}
                    <div className="relative h-56 w-full bg-gray-100">
                      {product.primaryimage ? (
                        <Image
                          src={product.primaryimage}
                          alt={product.name}
                          fill
                          className="object-cover cursor-pointer  transition-transform duration-300"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                          No image
                        </div>
                      )}
                      {Number(product.totaldiscount) > 0 && (
                        <span className="absolute top-2 left-2 bg-red-600 text-white text-xs font-semibold px-2 py-1 rounded">
                          {product.totaldiscount}% OFF
                        </span>
                      )}
                    </div>

                    {/* Product Info */}
                    <div className="p-4 space-y-1">
                      <h2 className="font-semibold text-lg truncate capitalize text-gray-800">
                        {product.name}
                      </h2>
                      <p className="text-sm text-gray-500 capitalize">
                        {product.subcategory}
                      </p>
                      <div className="flex items-baseline gap-2 mt-1">
                        <p className="text-lg font-bold text-gray-800">
                          ${discountedPrice}
                        </p>
                        {Number(product.totaldiscount) > 0 && (
                          <p className="text-sm text-gray-400 line-through">
                            ${Number(product.originalprice)}
                          </p>
                        )}
                      </div>
                      <p className="text-sm text-green-600">
                        In Stock: {product.stock}
                      </p>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
};

export default ProductsPage;
