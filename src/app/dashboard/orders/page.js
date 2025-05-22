"use client";
import { useState } from 'react';
import {
  ChevronUpDownIcon,
  EllipsisVerticalIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  ArrowDownTrayIcon,
} from '@heroicons/react/24/outline';

const OrdersPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [sortConfig, setSortConfig] = useState({ key: 'date', direction: 'desc' });
  const [selectedOrders, setSelectedOrders] = useState(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const [viewOrder, setViewOrder] = useState(null);

  // ✅ Store orders in state so we can update them
  const [orders, setOrders] = useState([
    {
      id: '#12345',
      customer: 'John Doe',
      date: '2024-03-15',
      status: 'pending',
      total: 249.99,
      payment: 'credit_card',
      items: 3,
      tracking: '1Z2345ABCD6789',
    },
    {
      id: '#12346',
      customer: 'Jane Smith',
      date: '2024-03-16',
      status: 'shipped',
      total: 139.5,
      payment: 'paypal',
      items: 2,
      tracking: '1Z9999XYZ1234',
    },
  ]);

  const statusOptions = [
    { value: 'all', label: 'All Orders' },
    { value: 'pending', label: 'Pending', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'processing', label: 'Processing', color: 'bg-blue-100 text-blue-800' },
    { value: 'shipped', label: 'Shipped', color: 'bg-purple-100 text-purple-800' },
    { value: 'delivered', label: 'Delivered', color: 'bg-green-100 text-green-800' },
    { value: 'cancelled', label: 'Cancelled', color: 'bg-red-100 text-red-800' },
  ];

  const filteredOrders = orders.filter((order) => {
    const matchesSearch = order.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          order.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = selectedStatus === 'all' || order.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const sortedOrders = [...filteredOrders].sort((a, b) => {
    if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === 'asc' ? -1 : 1;
    if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === 'asc' ? 1 : -1;
    return 0;
  });

  const itemsPerPage = 10;
  const paginatedOrders = sortedOrders.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // ✅ Function to update status
  const handleUpdateStatus = (orderId, newStatus) => {
    const updatedOrders = orders.map(order =>
      order.id === orderId ? { ...order, status: newStatus } : order
    );
    setOrders(updatedOrders);
    setViewOrder(null); // close modal
  };

  return (
    <div className="w-full p-6 bg-white rounded-lg shadow-sm">
      {/* Header */}
      <div className="mb-6 flex flex-col md:flex-row justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Order Management</h1>
          <p className="text-gray-600 mt-1">Manage and track customer orders</p>
        </div>
        <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
          Create New Order
        </button>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
        <div className="relative">
          <input
            type="text"
            placeholder="Search orders..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full p-2 pl-10 border rounded-lg"
          />
          <MagnifyingGlassIcon className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
        </div>
        <div className="relative">
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="w-full p-2 pl-10 border rounded-lg"
          >
            {statusOptions.map(option => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
          <FunnelIcon className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
        </div>
        <div className="flex gap-2">
          <button className="px-4 py-2 border rounded-lg hover:bg-gray-50">
            <ArrowDownTrayIcon className="h-5 w-5" /> Export
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-lg border">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-3"><input type="checkbox" /></th>
              {['id', 'date', 'customer', 'status', 'total', 'actions'].map((key) => (
                <th
                  key={key}
                  className="p-3 text-left text-sm font-medium cursor-pointer"
                  onClick={() => key !== 'actions' && setSortConfig({
                    key,
                    direction: sortConfig.key === key && sortConfig.direction === 'asc' ? 'desc' : 'asc'
                  })}
                >
                  <div className="flex items-center gap-1 capitalize">
                    {key}
                    <ChevronUpDownIcon className="h-4 w-4" />
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {paginatedOrders.map(order => (
              <tr key={order.id} className="hover:bg-gray-50">
                <td className="p-3"><input type="checkbox" /></td>
                <td className="p-3 font-medium">{order.id}</td>
                <td className="p-3">{new Date(order.date).toLocaleDateString()}</td>
                <td className="p-3">{order.customer}</td>
                <td className="p-3">
                  <span className={`px-2 py-1 rounded-full text-sm ${
                    statusOptions.find(s => s.value === order.status)?.color
                  }`}>
                    {order.status}
                  </span>
                </td>
                <td className="p-3 font-medium">${order.total.toFixed(2)}</td>
                <td className="p-3">
                  <button onClick={() => setViewOrder(order)} className="p-2 hover:bg-gray-100 rounded-lg">
                    <EllipsisVerticalIcon className="h-5 w-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="mt-6 flex justify-between items-center">
        <span className="text-sm text-gray-700">
          Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, sortedOrders.length)} of {sortedOrders.length}
        </span>
        <div className="flex gap-2">
          <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} className="px-3 py-1 rounded bg-gray-100 hover:bg-gray-200">Previous</button>
          {Array.from({ length: Math.ceil(sortedOrders.length / itemsPerPage) }).map((_, i) => (
            <button
              key={i + 1}
              onClick={() => setCurrentPage(i + 1)}
              className={`px-3 py-1 rounded ${currentPage === i + 1 ? 'bg-indigo-600 text-white' : 'bg-gray-100 hover:bg-gray-200'}`}
            >
              {i + 1}
            </button>
          ))}
          <button onClick={() => setCurrentPage(p => Math.min(p + 1, Math.ceil(sortedOrders.length / itemsPerPage)))} className="px-3 py-1 rounded bg-gray-100 hover:bg-gray-200">Next</button>
        </div>
      </div>

      {/* Modal */}
      {viewOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl shadow-lg">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-xl font-bold">Order Details - {viewOrder.id}</h2>
              <button onClick={() => setViewOrder(null)} className="text-gray-500 hover:text-gray-700">✕</button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="font-medium mb-2">Customer Information</h3>
                <p>{viewOrder.customer}</p>
                <p className="text-gray-600">Contact: customer@example.com</p>
              </div>
              <div>
                <h3 className="font-medium mb-2">Shipping Details</h3>
                <p>123 Main Street</p>
                <p>New York, NY 10001</p>
                <p className="text-blue-600">Tracking: {viewOrder.tracking}</p>
              </div>
            </div>

            {/* Status Update */}
            <div className="mt-6 flex flex-col md:flex-row justify-end gap-4">
              <select
                value={viewOrder.status}
                onChange={(e) => setViewOrder({ ...viewOrder, status: e.target.value })}
                className="border rounded-lg p-2"
              >
                {statusOptions.filter(s => s.value !== 'all').map((s) => (
                  <option key={s.value} value={s.value}>{s.label}</option>
                ))}
              </select>

              <button
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                onClick={() => handleUpdateStatus(viewOrder.id, viewOrder.status)}
              >
                Save Status
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrdersPage;
