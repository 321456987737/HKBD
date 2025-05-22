"use client";
import React, { useState, useEffect, useRef } from "react";
import {
  TrashIcon,
  PencilSquareIcon,
  TagIcon,
  MagnifyingGlassIcon,
  CheckIcon,
  ChevronUpDownIcon,
} from "@heroicons/react/24/outline";
import Image from "next/image";
import axios from "axios";

const RemoveProduct = () => {
  // State management
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [updatedData, setUpdatedData] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSubcategory, setSelectedSubcategory] = useState("");
  const [selectedStatus, setSelectedStatus] = useState(""); // Added status filter
  const [sortConfig, setSortConfig] = useState({
    key: "name",
    direction: "asc",
  });
  const [selectedProducts, setSelectedProducts] = useState(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [data, setData] = useState([]);
  const [totalProducts, setTotalProducts] = useState(0);
  const [loading, setLoading] = useState(true);

  // Refs for checkboxes
  const mainCheckboxRef = useRef(null);

  // Categories and subcategories
  const categories = ["Men", "Women", "Boys", "Girls", "All"];
  const subcategories = {
    Men: ["polo", "tshirt", "shirt", "Accessories", "jean"],
    Women: ["jean", "shirt", "tshirt", "Dresses", "Accessories"],
    Boys: ["tshirt", "shirt", "jean", "Accessories", "polo"],
    Girls: ["tshirt", "shirt", "jean", "Dresses", "Accessories"],
    All: [],
  };

  const statusOptions = ["published", "draft", "archived"];

  // Fetch data with pagination and filters
  const fetchData = async (page = currentPage) => {
    try {
      setLoading(true);
      const res = await axios.get(
        `/api/fetchProductforadmin?page=${page}&limit=${itemsPerPage}&search=${debouncedQuery}&category=${selectedCategory}&subcategory=${selectedSubcategory}&status=${selectedStatus}`
      );

      // Make sure data is an array before setting it
      if (Array.isArray(res.data.allData)) {
        setData(res.data.allData);
      } else {
        setData([]);
        console.error("Data is not an array:", res.data);
      }

      setTotalProducts(res.data.totalProducts || 0);
    } catch (error) {
      console.error("Error fetching data:", error);
      setData([]);
      setTotalProducts(0);
    } finally {
      setLoading(false);
    }
  };

  // On mount and filter changes, fetch data
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchData(1); // Always fetch first page when filters change
    }, 300);

    return () => clearTimeout(timer);
  }, [
    debouncedQuery,
    selectedCategory,
    selectedSubcategory,
    selectedStatus,
    itemsPerPage,
  ]);

  // When changing page, fetch new data
  useEffect(() => {
    fetchData(currentPage);
  }, [currentPage]);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(searchQuery), 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Reset subcategory when category changes
  useEffect(() => {
    setSelectedSubcategory("");
    setCurrentPage(1); // Reset to first page when filters change
  }, [selectedCategory]);

  // Handle indeterminate state for main checkbox
  useEffect(() => {
    if (mainCheckboxRef.current) {
      if (selectedProducts.size > 0 && selectedProducts.size < data.length) {
        mainCheckboxRef.current.indeterminate = true;
      } else {
        mainCheckboxRef.current.indeterminate = false;
      }
    }
  }, [selectedProducts, data]);

  // Handle product selection
  const handleSelectProduct = (productId) => {
    const newSelection = new Set(selectedProducts);
    if (newSelection.has(productId)) {
      newSelection.delete(productId);
    } else {
      newSelection.add(productId);
    }
    setSelectedProducts(newSelection);
  };

  // Handle bulk select all
  const handleSelectAll = (e) => {
    const newSelection = new Set();
    if (e.target.checked) {
      data.forEach((p) => p._id && newSelection.add(p._id));
    }
    setSelectedProducts(newSelection);
  };

  // Handle bulk delete
  const handleBulkDelete = async () => {
    if (selectedProducts.size === 0) return;

    if (
      !confirm(
        `Are you sure you want to delete ${selectedProducts.size} products?`
      )
    ) {
      return;
    }

    try {
      await axios.post("/api/products/bulk-delete", {
        ids: Array.from(selectedProducts),
      });
      // Refresh data after deletion
      fetchData(currentPage);
      setSelectedProducts(new Set());
    } catch (error) {
      console.error("Error in bulk delete:", error);
      alert("Failed to delete products. Please try again.");
    }
  };

  // Handle individual delete
  const handleDelete = async (productId) => {
    if (!confirm("Are you sure you want to delete this product?")) {
      return;
    }

    try {
      await axios.delete("/api/fetchProductforadmin", {
        data: {
          ids: Array.from(selectedProducts), // can be one or many
        },
      });
      // Refresh data after deletion
      fetchData(currentPage);
    } catch (error) {
      console.error("Error deleting product:", error);
      alert("Failed to delete product. Please try again.");
    }
  };

  // Handle update
  const handleUpdate = (product) => {
    setSelectedProduct(product);
    setUpdatedData({ ...product });
    setIsEditing(true);
  };

  // Handle save changes
  const handleSaveChanges = async () => {
    try {
      const res = await axios.put(`/api/fetchProductforadmin`, {
        updatedData: updatedData, // Send all updated fields
      });

      if (res.data.success) {
        fetchData(currentPage);
        setIsEditing(false);
      } else {
        alert(res.data.error || "Failed to update product");
      }
    } catch (error) {
      console.error("Error updating product:", error);
      alert(error.response?.data?.error || "Failed to update product");
    }
  };

  // Handle input changes for edit modal
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUpdatedData({ ...updatedData, [name]: value });
  };

  // Handle sorting
  const handleSort = (key) => {
    if (key === "actions") return;

    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });

    // Sort the data
    const sortedData = [...data].sort((a, b) => {
      if (a[key] < b[key]) return direction === "asc" ? -1 : 1;
      if (a[key] > b[key]) return direction === "asc" ? 1 : -1;
      return 0;
    });

    setData(sortedData);
  };

  // Calculate total pages
  const totalPages = Math.max(1, Math.ceil(totalProducts / itemsPerPage));

  // Generate pagination range (showing max 5 pages at a time)
  const getPageRange = () => {
    const range = [];
    const maxVisiblePages = 5;
    let start = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let end = Math.min(totalPages, start + maxVisiblePages - 1);

    if (end - start < maxVisiblePages - 1) {
      start = Math.max(1, end - maxVisiblePages + 1);
    }

    for (let i = start; i <= end; i++) {
      range.push(i);
    }

    return range;
  };

  return (
    <div className="w-full p-6 bg-white rounded-lg shadow-sm">
      {/* Header and Controls */}
      <div className="mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h2 className="text-2xl font-semibold flex items-center">
          <TrashIcon className="h-6 w-6 mr-2 text-red-600" />
          Product Management
        </h2>
        <div className="flex items-center gap-4 w-full md:w-auto">
          <button
            onClick={handleBulkDelete}
            disabled={selectedProducts.size === 0}
            className="px-4 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Bulk Delete ({selectedProducts.size})
          </button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="relative">
          <input
            type="text"
            placeholder="Search by name or SKU..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              // Reset to first page is handled by useEffect
            }}
            className="w-full p-2 pl-10 border rounded-lg focus:ring-2 focus:ring-indigo-500"
          />
          <MagnifyingGlassIcon className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
        </div>

        <div className="relative">
          <select
            value={selectedCategory}
            onChange={(e) => {
              setSelectedCategory(e.target.value);
              // Reset to first page is handled by useEffect
            }}
            className="w-full p-2 pl-10 border rounded-lg focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
          <TagIcon className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
        </div>

        <div className="relative">
          <select
            value={selectedSubcategory}
            onChange={(e) => {
              setSelectedSubcategory(e.target.value);
              // Reset to first page is handled by useEffect
            }}
            disabled={!selectedCategory || selectedCategory === "All"}
            className="w-full p-2 pl-10 border rounded-lg focus:ring-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            <option value="">All Subcategories</option>
            {selectedCategory &&
              selectedCategory !== "All" &&
              subcategories[selectedCategory] &&
              subcategories[selectedCategory].map((subcat) => (
                <option key={subcat} value={subcat}>
                  {subcat}
                </option>
              ))}
          </select>
          <TagIcon className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
        </div>

        <div className="relative">
          <select
            value={selectedStatus}
            onChange={(e) => {
              setSelectedStatus(e.target.value);
              setCurrentPage(1); // Reset to first page when status changes
            }}
            className="w-full p-2 pl-10 border rounded-lg focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">All Statuses</option>
            {statusOptions.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
          <CheckIcon className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
        </div>
      </div>

      {/* Products Table */}
      <div className="overflow-x-auto rounded-lg border border-gray-200">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 w-12">
                <input
                  ref={mainCheckboxRef}
                  type="checkbox"
                  className="rounded border-gray-300"
                  onChange={handleSelectAll}
                  checked={
                    selectedProducts.size === data.length && data.length > 0
                  }
                />
              </th>
              {[
                { key: "name", label: "Product Name" },
                { key: "price", label: "Price" },
                { key: "category", label: "Category" },
                { key: "subcategory", label: "Subcategory" },
                { key: "stock", label: "Stock" },
                { key: "status", label: "Status" },
                { key: "actions", label: "Actions" },
              ].map((header) => (
                <th
                  key={header.key}
                  className="px-4 py-3 text-left text-sm font-medium text-gray-700 cursor-pointer"
                  onClick={() => handleSort(header.key)}
                >
                  <div className="flex items-center gap-1">
                    {header.label}
                    {header.key !== "actions" && (
                      <ChevronUpDownIcon
                        className={`w-4 h-4 ${
                          sortConfig.key === header.key
                            ? sortConfig.direction === "asc"
                              ? "rotate-180"
                              : ""
                            : ""
                        }`}
                      />
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {loading ? (
              <tr>
                <td colSpan="8" className="px-4 py-6 text-center">
                  <div className="flex justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                  </div>
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td colSpan="8" className="px-4 py-6 text-center">
                  No products found
                </td>
              </tr>
            ) : (
              data.map((product) => (
                <tr
                  key={product._id || Math.random()}
                  className="hover:bg-gray-50"
                >
                  <td className="px-4 py-3">
                    <input
                      type="checkbox"
                      checked={product._id && selectedProducts.has(product._id)}
                      onChange={() =>
                        product._id && handleSelectProduct(product._id)
                      }
                      className="rounded border-gray-300"
                    />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <Image
                        src={product.primaryimage || "/placeholder-product.jpg"}
                        alt={product.name || "Product"}
                        width={48}
                        height={48}
                        className="rounded-lg border"
                      />
                      <div>
                        <div className="font-medium">
                          {product.name || "Unnamed Product"}
                        </div>
                        <div className="text-sm text-gray-500">
                          {product.sku || "No SKU"}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">
                        ${product.discountedPrice || product.price || 0}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                      {product.category || "Uncategorized"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-sm">
                      {product.subcategory || "None"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-2 py-1 rounded-full text-sm ${
                        (product.stock || 0) > 0
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {product.stock || 0} in stock
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-2 py-1 rounded-full text-sm ${
                        product.status === "published"
                          ? "bg-green-100 text-green-800"
                          : product.status === "draft"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {product.status || "unknown"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleUpdate(product)}
                        className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg"
                        title="Edit"
                      >
                        <PencilSquareIcon className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => product._id && handleDelete(product._id)}
                        className="p-2 text-red-600 hover:bg-red-100 rounded-lg"
                        title="Delete"
                        disabled={!product._id}
                      >
                        <TrashIcon className="h-5 w-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="mt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
        <span className="text-sm text-gray-700">
          Showing{" "}
          {totalProducts === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1} to{" "}
          {Math.min(currentPage * itemsPerPage, totalProducts)} of{" "}
          {totalProducts} products
        </span>
        <div className="flex gap-2">
          <button
            onClick={() => setCurrentPage(1)}
            disabled={currentPage === 1 || totalPages === 0}
            className="px-3 py-1 rounded-lg bg-gray-100 hover:bg-gray-200 disabled:opacity-50"
            title="First Page"
          >
            «
          </button>
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1 || totalPages === 0}
            className="px-3 py-1 rounded-lg bg-gray-100 hover:bg-gray-200 disabled:opacity-50"
            title="Previous Page"
          >
            ‹
          </button>

          {getPageRange().map((page) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`px-3 py-1 rounded-lg ${
                currentPage === page
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 hover:bg-gray-200"
              }`}
            >
              {page}
            </button>
          ))}

          <button
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            disabled={currentPage === totalPages || totalPages === 0}
            className="px-3 py-1 rounded-lg bg-gray-100 hover:bg-gray-200 disabled:opacity-50"
            title="Next Page"
          >
            ›
          </button>
          <button
            onClick={() => setCurrentPage(totalPages)}
            disabled={currentPage === totalPages || totalPages === 0}
            className="px-3 py-1 rounded-lg bg-gray-100 hover:bg-gray-200 disabled:opacity-50"
            title="Last Page"
          >
            »
          </button>
        </div>
      </div>

      {/* Edit Modal */}
      {isEditing && selectedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
            <h3 className="text-xl font-semibold mb-4">Edit Product</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Product Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={updatedData.name || ""}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  SKU
                </label>
                <input
                  type="text"
                  name="sku"
                  value={updatedData.sku || ""}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Price
                </label>
                <input
                  type="number"
                  name="price"
                  value={updatedData.price || 0}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Discounted Price
                </label>
                <input
                  type="number"
                  name="discountedPrice"
                  value={updatedData.discountedPrice || ""}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Stock
                </label>
                <input
                  type="number"
                  name="stock"
                  value={updatedData.stock || 0}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  name="status"
                  value={updatedData.status || "draft"}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-lg"
                >
                  {statusOptions.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category
                </label>
                <select
                  name="category"
                  value={updatedData.category || ""}
                  onChange={(e) => {
                    const category = e.target.value;
                    setUpdatedData({
                      ...updatedData,
                      category,
                      subcategory: "",
                    });
                  }}
                  className="w-full p-2 border rounded-lg"
                >
                  <option value="">Select Category</option>
                  {categories
                    .filter((c) => c !== "All")
                    .map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Subcategory
                </label>
                <select
                  name="subcategory"
                  value={updatedData.subcategory || ""}
                  onChange={handleInputChange}
                  disabled={!updatedData.category}
                  className="w-full p-2 border rounded-lg"
                >
                  <option value="">Select Subcategory</option>
                  {updatedData.category &&
                    subcategories[updatedData.category] &&
                    subcategories[updatedData.category].map((subcat) => (
                      <option key={subcat} value={subcat}>
                        {subcat}
                      </option>
                    ))}
                </select>
              </div>
            </div>
            <div className="flex justify-end gap-4 mt-6">
              <button
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveChanges}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RemoveProduct;
