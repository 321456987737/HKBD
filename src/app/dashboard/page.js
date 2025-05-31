"use client";

import axios from "axios";
import { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts";

// Custom tooltip component for consistent styling
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-lg">
        <p className="font-semibold text-gray-800">{label}</p>
        {payload.map((entry, index) => (
          <p
            key={`tooltip-${index}`}
            className="flex items-center"
            style={{ color: entry.color }}
          >
            <span
              className="inline-block w-3 h-3 rounded-full mr-2"
              style={{ backgroundColor: entry.color }}
            />
            {entry.name}:{" "}
            <span className="font-medium ml-1">{entry.value}</span>
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [analytics, setAnalytics] = useState(null);
  const [Orders, setOrders] = useState([]);
  useEffect(() => {
    const getdata = async () => {
      try {
        const response = await axios.get("/api/analytics");
        setAnalytics(response.data);
      } catch (error) {
        console.error("Error fetching analytics data:", error);
      } finally {
        setLoading(false);
      }
    };
    getdata();
  }, []);

  const getRevcentOrders = async () => {
    const res = await axios.get("/api/orders");
    setOrders(res.data.orders);
    console.log("Recent Orders:", res.data.orders);
  };
  useEffect(() => {
    getRevcentOrders();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center w-full h-full items-center bg-gray-50">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-12 w-12 bg-blue-500 rounded-full mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <div className="text-center">
          <div className="text-4xl mb-4">📊</div>
          <p className="text-gray-600">No data available</p>
        </div>
      </div>
    );
  }

  // Color palette
  const COLORS = ["#6366F1", "#8B5CF6", "#EC4899", "#F43F5E", "#F59E0B"];

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "delivered":
        return "bg-green-100 text-green-800";
      case "shipped":
        return "bg-blue-100 text-blue-800";
      case "processing":
        return "bg-yellow-100 text-yellow-800";
      case "pending":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  //delete that after few times
  const customerSatisfaction = [
    {
      subject: "Orders",
      A: 320, // 2023 delivered orders
      B: 280, // 2022 delivered orders
    },
    {
      subject: "Users",
      A: 520,
      B: 490,
    },
    {
      subject: "Reports",
      A: 110,
      B: 140,
    },
    {
      subject: "Products",
      A: 420,
      B: 390,
    },
  ];

  return (
    <div className="min-h-screen w-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            E-commerce Analytics
          </h1>
          <p className="text-gray-500">
            Key metrics and performance indicators
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          {[
            {
              title: "Total Sales",
              value: analytics.totalRevenue
                ? `$${analytics.totalRevenue}`
                : "-",
              change: "+12%",
              trend: "up",
            },
            {
              title: "Last Month Sales",
              value: analytics.thismonthrevenue
                ? `$${analytics.thismonthrevenue}`
                : "-",
              change: "+3.2%",
              trend: "up",
            },
            {
              title: "Total Orders",
              value: analytics.totalorders,
              change: "-0.5%",
              trend: "down",
            },
            {
              title: "Customers",
              value: analytics.totalUsers,
              change: "+24%",
              trend: "up",
            },
          ].map((stat, index) => (
            <div
              key={index}
              className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow"
            >
              <p className="text-sm font-medium text-gray-500">{stat.title}</p>
              <p className="text-2xl font-bold mt-1 text-gray-900">
                {stat.value}
              </p>
              <div
                className={`flex items-center mt-2 text-sm ${
                  stat.trend === "up" ? "text-green-500" : "text-red-500"
                }`}
              >
                {stat.trend === "up" ? (
                  <svg
                    className="w-4 h-4 mr-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 15l7-7 7 7"
                    />
                  </svg>
                ) : (
                  <svg
                    className="w-4 h-4 mr-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                )}
                {stat.change}
              </div>
            </div>
          ))}
        </div>

        {/* First Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Line Chart */}
          <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-semibold text-gray-900">
                Sales Trend
              </h2>
              <div className="flex space-x-2">
                <button className="px-3 py-1 text-xs bg-indigo-50 text-indigo-600 rounded-full">
                  Monthly
                </button>
                <button className="px-3 py-1 text-xs bg-gray-50 text-gray-600 rounded-full">
                  Weekly
                </button>
              </div>
            </div>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={analytics.monthlyStats}
                  margin={{ top: 5, right: 20, bottom: 5, left: 0 }}
                >
                  <defs>
                    <linearGradient
                      id="salesGradient"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="5%" stopColor="#6366F1" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#6366F1" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="#E5E7EB"
                  />
                  <XAxis
                    dataKey="name"
                    tick={{ fill: "#6B7280" }}
                    axisLine={{ stroke: "#E5E7EB" }}
                  />
                  <YAxis
                    tick={{ fill: "#6B7280" }}
                    axisLine={{ stroke: "#E5E7EB" }}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend
                    wrapperStyle={{ paddingTop: "20px" }}
                    formatter={(value) => (
                      <span className="text-gray-600 text-sm">{value}</span>
                    )}
                  />
                  <Line
                    type="monotone"
                    dataKey="sales"
                    stroke="#6366F1"
                    strokeWidth={2}
                    dot={{ r: 4, fill: "#6366F1", strokeWidth: 2 }}
                    activeDot={{ r: 6, stroke: "#4F46E5", strokeWidth: 2 }}
                    name="Total Sales"
                  />
                  <Line
                    type="monotone"
                    dataKey="revenue"
                    stroke="#EC4899"
                    strokeWidth={2}
                    dot={{ r: 4, fill: "#EC4899", strokeWidth: 2 }}
                    activeDot={{ r: 6, stroke: "#DB2777", strokeWidth: 2 }}
                    name="Revenue"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Pie Chart */}
          <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-semibold text-gray-900">
                Product Categories
              </h2>
              <button className="text-indigo-600 text-sm font-medium">
                View details
              </button>
            </div>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={analytics.categoryPercentages}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={2}
                    dataKey="value"
                    label={({ name, percent }) =>
                      `${name} ${(percent * 100).toFixed(0)}%`
                    }
                    labelLine={false}
                  >
                    {analytics.categoryPercentages.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                        stroke="#fff"
                        strokeWidth={2}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    content={<CustomTooltip />}
                    formatter={(value) => [`${value} units`, "Sales"]}
                  />
                  <Legend
                    wrapperStyle={{ paddingTop: "20px" }}
                    formatter={(value) => (
                      <span className="text-gray-600 text-sm">{value}</span>
                    )}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Second Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Area Chart */}
          <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-semibold text-gray-900">
                Customer Activity
              </h2>
              <div className="text-sm text-gray-500">Last 24 hours</div>
            </div>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={analytics.customerActivity}>
                  <defs>
                    <linearGradient
                      id="areaGradient"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="5%" stopColor="#6366F1" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#6366F1" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="#E5E7EB"
                  />
                  <XAxis
                    dataKey="hour"
                    tick={{ fill: "#6B7280" }}
                    axisLine={{ stroke: "#E5E7EB" }}
                  />
                  <YAxis
                    tick={{ fill: "#6B7280" }}
                    axisLine={{ stroke: "#E5E7EB" }}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Area
                    type="monotone"
                    dataKey="active"
                    stroke="#6366F1"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#areaGradient)"
                    name="Active Users"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Radar Chart */}
          <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-semibold text-gray-900">
                Customer Satisfaction
              </h2>
              <div className="flex space-x-2">
                <span className="flex items-center">
                  <span className="w-2 h-2 rounded-full bg-indigo-500 mr-1"></span>
                  <span className="text-xs text-gray-500">2023</span>
                </span>
                <span className="flex items-center">
                  <span className="w-2 h-2 rounded-full bg-pink-500 mr-1"></span>
                  <span className="text-xs text-gray-500">2022</span>
                </span>
              </div>
            </div>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart
                  cx="50%"
                  cy="50%"
                  outerRadius="80%"
                  data={analytics.customerSatisfaction}
                >
                  <PolarGrid stroke="#E5E7EB" />
                  <PolarAngleAxis
                    dataKey="subject"
                    tick={{ fill: "#6B7280" }}
                  />
                  <PolarRadiusAxis
                    angle={30}
                    domain={[0, 150]}
                    tick={{ fill: "#6B7280" }}
                  />
                  <Radar
                    name="2023"
                    dataKey="A"
                    stroke="#6366F1"
                    strokeWidth={2}
                    fill="#6366F1"
                    fillOpacity={0.2}
                  />
                  <Radar
                    name="2022"
                    dataKey="B"
                    stroke="#EC4899"
                    strokeWidth={2}
                    fill="#EC4899"
                    fillOpacity={0.2}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend
                    wrapperStyle={{ paddingTop: "20px" }}
                    formatter={(value) => (
                      <span className="text-gray-600 text-sm">{value}</span>
                    )}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Third Row */}
        <div className="grid grid-cols-1 gap-6 mb-8">
          {/* Bar Chart */}
          <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-semibold text-gray-900">
                Sales vs Returns
              </h2>
              <button className="text-indigo-600 text-sm font-medium hover:underline">
                Export data
              </button>
            </div>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={analytics.ordersStatusByMonth}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="#E5E7EB"
                  />
                  <XAxis
                    dataKey="month"
                    tick={{ fill: "#6B7280" }}
                    axisLine={{ stroke: "#E5E7EB" }}
                  />
                  <YAxis
                    tick={{ fill: "#6B7280" }}
                    axisLine={{ stroke: "#E5E7EB" }}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend
                    wrapperStyle={{ paddingTop: "20px" }}
                    formatter={(value) => (
                      <span className="text-gray-600 text-sm">{value}</span>
                    )}
                  />
                  <Bar
                    dataKey="completed"
                    fill="#6366F1"
                    name="Completed"
                    radius={[4, 4, 0, 0]}
                  />
                  <Bar
                    dataKey="cancelled"
                    fill="#F43F5E"
                    name="Cancelled"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Fourth Row - Data Tables */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Orders Table */}
          <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-semibold text-gray-900">
                Recent Orders
              </h2>
              <button className="text-indigo-600 text-sm font-medium">
                View all
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 text-sm font-medium text-gray-500">
                      Order ID
                    </th>
                    <th className="text-left py-3 text-sm font-medium text-gray-500">
                      Customer
                    </th>
                    <th className="text-left py-3 text-sm font-medium text-gray-500">
                      Amount
                    </th>
                    <th className="text-left py-3 text-sm font-medium text-gray-500">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {Orders.map((order, index) => (
                    <tr
                      key={order._id}
                      className="border-b border-gray-100 hover:bg-gray-50"
                    >
                      <td className="py-3 text-sm font-medium text-gray-900">
                        {order._id.slice(-6)} {/* short order ID */}
                      </td>
                      <td className="py-3 text-sm text-gray-600 leading-relaxed">
                        <div>
                          <strong>
                            {order.customer.firstName} {order.customer.lastName}
                          </strong>
                        </div>
                        <div>{order.customer.email}</div>
                        <div>{order.customer.phone}</div>
                      </td>
                      <td className="py-3 text-sm font-medium text-gray-900">
                        Rs. {order.total.toLocaleString()}
                      </td>
                      <td className="py-3">
                        <span
                          className={`px-2 py-1 text-xs rounded-full ${getStatusColor(
                            order.status
                          )}`}
                        >
                          {order.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Top Products Table */}
          <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-semibold text-gray-900">
                Top Products
              </h2>
              <button className="text-indigo-600 text-sm font-medium">
                View all
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 text-sm font-medium text-gray-500">
                      Product ID
                    </th>
                    <th className="text-left py-3 text-sm font-medium text-gray-500">
                      Sales
                    </th>
                    <th className="text-left py-3 text-sm font-medium text-gray-500">
                      Revenue
                    </th>
                    <th className="text-left py-3 text-sm font-medium text-gray-500">
                      Trend
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {analytics.topProducts.map((product, index) => (
                    <tr
                      key={product.productId}
                      className="border-b border-gray-100 hover:bg-gray-50"
                    >
                      <td className="py-3 text-sm font-medium text-gray-900">
                        {product.productId}
                      </td>
                      <td className="py-3 text-sm text-gray-600">
                        {product.totalQuantity}
                      </td>
                      <td className="py-3 text-sm font-medium text-gray-900">
                        {/* Placeholder, replace with actual revenue if available */}
                        {"—"}
                      </td>
                      <td className="py-3">
                        {/* Placeholder, replace with actual trend if available */}
                        <span className="text-sm text-gray-400">—</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
