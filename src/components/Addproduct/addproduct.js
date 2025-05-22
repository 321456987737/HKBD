"use client";
import React, { useState, useEffect } from "react";
import {
  CloudArrowUpIcon,
  TagIcon,
  CurrencyDollarIcon,
  InformationCircleIcon,
  DocumentTextIcon,
  XMarkIcon,
  ReceiptPercentIcon,
} from "@heroicons/react/24/outline";
import Image from "next/image";
import axios from "axios";

const subcategories = {
  Men: ["Accessories", "tshirt", "jean", "shirt", "polo"],
  Women: ["Accessories", "tshirt", "shirt", "jean", "dress"],
  Girls: ["Accessories", "tshirt", "jean", "shirt", "dress"],
  Boys: ["Accessories", "jean", "tshirt", "Shirt", "shoe"],
};

const Addproduct = () => {
  const [primaryImage, setPrimaryImage] = useState(null);
  const [secondaryImages, setSecondaryImages] = useState([]);
  const [discountedPrice, setDiscountedPrice] = useState(0);
  const [errors, setErrors] = useState({});
  // Redesigned size selection - with categories
  const [selectedSizes, setSelectedSizes] = useState([]);

  // Define size categories with their respective options
  const sizeCategories = {
    Clothing: ["XS", "S", "M", "L", "XL", "XXL", "3XL"],
    Shoes: ["5", "6", "7", "7.5","8","8.5", "9", "9.5","10", "11", "12"],
  };

  const [activeCategory, setActiveCategory] = useState("Clothing");

  const handleSizeToggle = (size) => {
    setSelectedSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]
    );
  };

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    discount: "",
    category: "",
    subcategory: "",
    color: [],
    stock: "",
    discountedPrice: "",
  });

  useEffect(() => {
    calculateDiscount();
  }, [formData.price, formData.discount]);

  const calculateDiscount = () => {
    const price = parseFloat(formData.price);
    const discount = parseFloat(formData.discount);

    if (!isNaN(price) && !isNaN(discount) && discount > 0) {
      const discountAmount = price * (discount / 100);
      setDiscountedPrice(price - discountAmount);
      formData.discountedPrice = price - discountAmount;
    } else {
      setDiscountedPrice(0);
    }
  };

  const validateField = (name, value) => {
    let error = "";
    switch (name) {
      case "price":
        if (isNaN(value) || value < 0) error = "Invalid price";
        break;
      case "discount":
        if (isNaN(value) || value < 0 || value > 100)
          error = "Discount must be between 0-100%";
        break;
      default:
        break;
    }
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const handlePrimaryImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPrimaryImage({ file, preview: URL.createObjectURL(file) });
    }
  };

  const handleSecondaryImagesChange = (e) => {
    const files = Array.from(e.target.files);
    const newImages = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));
    setSecondaryImages((prev) => [...prev, ...newImages]);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    validateField(name, value);
    setFormData((prev) => ({
      ...prev,
      [name]: value,
      ...(name === "category" ? { subcategory: "" } : {}),
    }));
  };
  const handleAddProduct = async () => {
    const productData = new FormData();

    // Append primary image
    if (primaryImage) {
      productData.append("primaryImage", primaryImage.file);
    }

    // Append secondary images
    secondaryImages.forEach((image) => {
      productData.append("secondaryImages", image.file);
    });

    // Append other product details
    Object.keys(formData).forEach((key) => {
      productData.append(key, formData[key]);
    });
    productData.append("size", JSON.stringify(selectedSizes));

    try {
      const response = await axios.post("/api/addproduct", productData);

      if (response.status === 201) {
        alert("Product added successfully!");
        setFormData({
          name: "",
          description: "",
          price: "",
          discount: "",
          category: "",
          subcategory: "",
          color: [],
          stock: "",
          discountedPrice: 0,
        });
        setSelectedSizes([]);
        setPrimaryImage(null);
        setSecondaryImages([]);
      }
    } catch (error) {
      alert("Failed to add product. Please try again.");
      setFormData({
        name: "",
        description: "",
        price: "",
        discount: "",
        category: "",
        subcategory: "",
        color: [],
        stock: "",
        discountedPrice: 0,
      })
      setPrimaryImage(null);
      setSecondaryImages([]);
      setSelectedSizes([]);
    }
  };

  return (
    <div className=" w-[100%] p-6 space-y-6 bg-white rounded-lg shadow-sm">
      <h2 className="text-2xl font-semibold flex items-center">
        <TagIcon className="h-6 w-6 mr-2 text-indigo-600" />
        Add Product
      </h2>

      {/* Text Inputs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Product Name */}
        <div className="relative">
          <input
            type="text"
            name="name"
            placeholder="Product Name"
            value={formData.name}
            onChange={handleChange}
            className="border outline-none border-gray-300 p-2 pl-10 rounded-md w-full focus:ring-2 focus:ring-indigo-500"
          />
          <InformationCircleIcon className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
        </div>

        {/* Price Input */}
        <div className="relative">
          <input
            type="number"
            name="price"
            placeholder="Original Price"
            value={formData.price}
            onChange={handleChange}
            className={`border outline-none p-2 pl-10 rounded-md w-full focus:ring-2 ${
              errors.price
                ? "border-red-500 focus:ring-red-500"
                : "border-gray-300 focus:ring-indigo-500"
            }`}
            step="0.01"
          />
          <CurrencyDollarIcon className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
          {errors.price && (
            <span className="absolute right-2 top-3 text-red-500 text-sm">
              {errors.price}
            </span>
          )}
        </div>

        {/* Discount Input */}
        <div className="relative">
          <input
            type="number"
            name="discount"
            placeholder="Discount (%)"
            value={formData.discount}
            onChange={handleChange}
            className={`border outline-none p-2 pl-10 rounded-md w-full focus:ring-2 ${
              errors.discount
                ? "border-red-500 focus:ring-red-500"
                : "border-gray-300 focus:ring-indigo-500"
            }`}
            min="0"
            max="100"
          />
          <ReceiptPercentIcon className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
          {errors.discount && (
            <span className="absolute right-2 top-3 text-red-500 text-sm">
              {errors.discount}
            </span>
          )}
        </div>

        {/* Discounted Price Display */}
        <div className="relative col-span-1 md:col-span-3 ">
          <div className="border border-gray-300 p-2 md:pl-10 pl-2 rounded-md w-full bg-gray-50">
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <TagIcon className="h-5 w-5 text-green-600 mr-2" />
                <span className="text-gray-700">Discounted Price:</span>
              </div>
              <div className="flex items-center">
                <span className="text-xl font-semibold text-green-600 mr-2">
                  ${discountedPrice.toFixed(2)}
                </span>
                {formData.discount > 0 && (
                  <span className="text-sm text-gray-500">
                    (Save {formData.discount}%)
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="relative col-span-1 md:col-span-3">
          <textarea
            name="description"
            placeholder="Product Description"
            value={formData.description}
            onChange={handleChange}
            className="border outline-none border-gray-300 p-2 pl-10 rounded-md w-full focus:ring-2 focus:ring-indigo-500"
            rows="4"
          />
          <DocumentTextIcon className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
        </div>
      </div>

      {/* Category & Subcategory */}
      <div className="grid w-full grid-cols-2 md:grid-cols-4 gap-4">
        {/* Category */}
        <div className="relative">
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="border border-gray-300 p-2 pl-10 rounded-md w-full focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">Select Category</option>
            {Object.keys(subcategories).map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
          <InformationCircleIcon className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
        </div>

        {/* Subcategory */}
        <div className="relative">
          <select
            name="subcategory"
            value={formData.subcategory}
            onChange={handleChange}
            className="border border-gray-300 p-2 pl-10 rounded-md w-full focus:ring-2 focus:ring-indigo-500"
            disabled={!formData.category}
          >
            <option value="">Select Subcategory</option>
            {formData.category &&
              subcategories[formData.category].map((sub) => (
                <option key={sub} value={sub}>
                  {sub}
                </option>
              ))}
          </select>
          <InformationCircleIcon className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
        </div>
        <div>
          <input
            type="number"
            name="stock"
            className="border h-[36.8px] outline-none border-gray-300 p-2 pl-5 rounded-md w-full focus:ring-2 focus:ring-indigo-500"
            placeholder="stock"
            value={formData.stock}
            onChange={handleChange}
          />
        </div>
      </div>
      <div>
        {/* Color Selector */}
        <div className="col-span-2 md:col-span-1 mx-5">
          <label className="block mb-2 text-sm font-medium text-gray-700">
            Select Color(s)
          </label>
          <div className="flex flex-wrap gap-[6px]">
            {[
              "#0a0a0a",
              "#ffffff",
              "#dc143c",
              "#4169e1",
              "#556b2f",
              "#ffdb58",
              "#f9c0c4",
              "#36454f",
              "#7b3f00",
              "#f5f5dc",
              "#fffff0",
              "#000080",
              "#008080",
              "#800000",
              "#e6e6fa",
              "#50c878",
              "#ffe5b4",
              "#ff7f50",
              "#483c32",
              "#d4a5a5",
            ].map((hex) => {
              const isSelected = formData.color.includes(hex);
              return (
                <button
                  key={hex}
                  type="button"
                  onClick={() => {
                    const alreadySelected = formData.color.includes(hex);
                    const newColors = alreadySelected
                      ? formData.color.filter((c) => c !== hex)
                      : [...formData.color, hex];
                    setFormData({ ...formData, color: newColors });
                  }}
                  className={`w-8 h-8 rounded-full border ${
                    isSelected ? "ring-2 ring-indigo-500" : ""
                  }`}
                  style={{ backgroundColor: hex }}
                />
              );
            })}
          </div>
        </div>

        {/* Redesigned Size Selector */}
        <div className="col-span-2 md:col-span-1 mt-10 max-w-[550px]">
          <div className="w-full border border-gray-200 rounded-lg p-4 bg-white">
            <h3 className="text-lg font-medium text-gray-800 mb-3">
              Available Sizes
            </h3>

            {/* Size Category Toggle */}
            <div className="flex space-x-2 mb-4">
              {Object.keys(sizeCategories).map((category) => (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                    activeCategory === category
                      ? "bg-indigo-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>

            {/* Size Grid */}
            <div className="grid grid-cols-4 gap-2">
              {sizeCategories[activeCategory].map((size) => (
                <button
                  key={size}
                  onClick={() => handleSizeToggle(size)}
                  className={`
                    flex items-center justify-center h-10 rounded-md border-2 transition-all
                    ${
                      selectedSizes.includes(size)
                        ? "border-indigo-600 bg-indigo-50 text-indigo-700 font-medium"
                        : "border-gray-200 hover:border-gray-300 text-gray-700"
                    }
                  `}
                >
                  {size}
                </button>
              ))}
            </div>

            {/* Selected Sizes Display */}
            <div className="mt-4 pt-3 border-t border-gray-200">
              <div className="flex flex-wrap items-center">
                <span className="text-sm text-gray-600 mr-2">Selected:</span>
                <div className="flex flex-wrap gap-1">
                  {selectedSizes.length > 0 ? (
                    selectedSizes.map((size) => (
                      <span
                        key={size}
                        className="px-2 py-1 text-xs bg-indigo-100 text-indigo-800 rounded-full flex items-center"
                      >
                        {size}
                        <button
                          onClick={() => handleSizeToggle(size)}
                          className="ml-1 text-indigo-600 hover:text-indigo-800"
                        >
                          ×
                        </button>
                      </span>
                    ))
                  ) : (
                    <span className="text-sm text-gray-400 italic">
                      No sizes selected
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Image Upload Section */}
      <div className="flex justify-start flex-col md:flex-row gap-6 w-full">
        {/* Primary Image Upload */}
        <div className="max-w-[350px] md:w-1/2">
          <label className="relative w-full aspect-square flex flex-col items-center justify-center border-2 border-dashed border-gray-400 rounded-lg cursor-pointer bg-gray-100 hover:bg-gray-200">
            {primaryImage ? (
              <Image
                width={400}
                height={400}
                src={primaryImage.preview}
                alt="Primary"
                className="w-full h-full object-cover rounded-lg"
              />
            ) : (
              <>
                <CloudArrowUpIcon className="h-10 w-10 text-gray-500" />
                <span className="text-sm text-gray-500 mt-2">
                  Primary Image (Required)
                </span>
              </>
            )}
            <input
              type="file"
              accept="image/*"
              onChange={handlePrimaryImageChange}
              className="absolute inset-0 opacity-0 cursor-pointer"
              required
            />
          </label>
        </div>

        {/* Secondary Images Section */}
        <div className="max-w-[350px] md:w-1/2">
          <label className="relative w-full aspect-square flex flex-col items-center justify-center border-2 border-dashed border-gray-400 rounded-lg cursor-pointer bg-gray-100 hover:bg-gray-200 ">
            <div className="text-center">
              <CloudArrowUpIcon className="h-10 w-10 text-gray-500 mx-auto" />
              <span className="text-sm text-gray-500">
                Secondary Images (Up to 5)
              </span>
              <span className="block text-xs text-gray-400 mt-1">
                Click to upload or drag and drop
              </span>
            </div>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleSecondaryImagesChange}
              className="absolute inset-0 opacity-0 cursor-pointer"
              max="5"
            />
          </label>

          {/* Preview Secondary Images */}
          <div className="grid grid-cols-3 gap-2 mt-2">
            {secondaryImages.map((img, index) => (
              <div key={index} className="relative aspect-square">
                <Image
                  width={200}
                  height={200}
                  src={img.preview}
                  alt={`Secondary ${index + 1}`}
                  className="w-full h-full object-cover rounded-lg border border-gray-300"
                />
                <button
                  onClick={() =>
                    setSecondaryImages((prev) =>
                      prev.filter((_, i) => i !== index)
                    )
                  }
                  className="absolute top-1 right-1 p-1 bg-red-500 rounded-full hover:bg-red-600"
                >
                  <XMarkIcon className="h-4 w-4 text-white" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <div className="w-full flex justify-center">
        <button
          className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          onClick={() => {
            handleAddProduct();
          }}
        >
          Add Product
        </button>
      </div>
    </div>
  );
};

export default Addproduct;
