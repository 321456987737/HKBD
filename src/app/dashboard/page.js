"use client";

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
  ScatterChart,
  Scatter,
} from "recharts";

// Custom tooltip component for consistent styling
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-lg">
        <p className="font-semibold text-gray-800">{label}</p>
        {payload.map((entry, index) => (
          <p key={`tooltip-${index}`} className="flex items-center" style={{ color: entry.color }}>
            <span className="inline-block w-3 h-3 rounded-full mr-2" style={{ backgroundColor: entry.color }} />
            {entry.name}: <span className="font-medium ml-1">{entry.value}</span>
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

  useEffect(() => {
    // Simulate API call with timeout
    const fetchData = async () => {
      try {
        await new Promise(resolve => setTimeout(resolve, 800)); // Simulate network delay
        
        const mockAnalytics = {
          salesData: [
            { name: "Jan", sales: 4000, revenue: 2400 },
            { name: "Feb", sales: 3000, revenue: 1398 },
            { name: "Mar", sales: 5000, revenue: 9800 },
            { name: "Apr", sales: 2780, revenue: 3908 },
            { name: "May", sales: 1890, revenue: 4800 },
            { name: "Jun", sales: 2390, revenue: 3800 },
          ],
          productPerformance: [
            { name: "Electronics", value: 400 },
            { name: "Clothing", value: 300 },
            { name: "Home Goods", value: 200 },
            { name: "Accessories", value: 100 },
          ],
          customerSatisfaction: [
            { subject: "Quality", A: 100, B: 110, fullMark: 150 },
            { subject: "Service", A: 98, B: 130, fullMark: 150 },
            { subject: "Price", A: 86, B: 130, fullMark: 150 },
            { subject: "Delivery", A: 99, B: 100, fullMark: 150 },
            { subject: "Support", A: 85, B: 90, fullMark: 150 },
          ],
          trafficSources: [
            { name: "Direct", value: 35 },
            { name: "Social", value: 25 },
            { name: "Email", value: 20 },
            { name: "Referral", value: 15 },
            { name: "Organic", value: 5 },
          ],
          salesVsReturns: [
            { date: "Week 1", orders: 100, returns: 5 },
            { date: "Week 2", orders: 120, returns: 8 },
            { date: "Week 3", orders: 150, returns: 12 },
            { date: "Week 4", orders: 180, returns: 10 },
          ],
          customerActivity: [
            { hour: "12a", active: 100 },
            { hour: "3a", active: 60 },
            { hour: "6a", active: 80 },
            { hour: "9a", active: 300 },
            { hour: "12p", active: 450 },
            { hour: "3p", active: 400 },
            { hour: "6p", active: 500 },
            { hour: "9p", active: 350 },
          ],
          recentOrders: [
            { id: "#12345", customer: "John Doe", amount: "$129.99", status: "Delivered", date: "2024-05-28" },
            { id: "#12346", customer: "Jane Smith", amount: "$89.50", status: "Processing", date: "2024-05-28" },
            { id: "#12347", customer: "Bob Johnson", amount: "$199.99", status: "Shipped", date: "2024-05-27" },
            { id: "#12348", customer: "Alice Brown", amount: "$59.99", status: "Pending", date: "2024-05-27" },
            { id: "#12349", customer: "Charlie Wilson", amount: "$299.99", status: "Delivered", date: "2024-05-26" },
          ],
          topProducts: [
            { name: "iPhone 15 Pro", sales: 142, revenue: "$142,000", trend: "+12%" },
            { name: "MacBook Air M2", sales: 89, revenue: "$89,000", trend: "+8%" },
            { name: "AirPods Pro", sales: 156, revenue: "$31,200", trend: "+15%" },
            { name: "iPad Air", sales: 78, revenue: "$46,800", trend: "-2%" },
            { name: "Apple Watch", sales: 234, revenue: "$93,600", trend: "+22%" },
          ]
        };
        
        setAnalytics(mockAnalytics);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
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
  const RADAR_COLORS = ["#6366F1", "#EC4899"];
  const AREA_GRADIENT = ["#6366F1", "#6366F100"];

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'shipped': return 'bg-blue-100 text-blue-800';
      case 'processing': return 'bg-yellow-100 text-yellow-800';
      case 'pending': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen w-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">E-commerce Analytics</h1>
          <p className="text-gray-500">Key metrics and performance indicators</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          {[
            { title: "Total Sales", value: "$24,780", change: "+12%", trend: "up" },
            { title: "Avg. Order", value: "$89.50", change: "+3.2%", trend: "up" },
            { title: "Conversion", value: "3.42%", change: "-0.5%", trend: "down" },
            { title: "Customers", value: "1,842", change: "+24%", trend: "up" },
          ].map((stat, index) => (
            <div key={index} className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
              <p className="text-sm font-medium text-gray-500">{stat.title}</p>
              <p className="text-2xl font-bold mt-1 text-gray-900">{stat.value}</p>
              <div className={`flex items-center mt-2 text-sm ${stat.trend === "up" ? "text-green-500" : "text-red-500"}`}>
                {stat.trend === "up" ? (
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
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
              <h2 className="text-lg font-semibold text-gray-900">Sales Trend</h2>
              <div className="flex space-x-2">
                <button className="px-3 py-1 text-xs bg-indigo-50 text-indigo-600 rounded-full">Monthly</button>
                <button className="px-3 py-1 text-xs bg-gray-50 text-gray-600 rounded-full">Weekly</button>
              </div>
            </div>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={analytics.salesData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                  <defs>
                    <linearGradient id="salesGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366F1" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#6366F1" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                  <XAxis 
                    dataKey="name" 
                    tick={{ fill: '#6B7280' }}
                    axisLine={{ stroke: '#E5E7EB' }}
                  />
                  <YAxis 
                    tick={{ fill: '#6B7280' }}
                    axisLine={{ stroke: '#E5E7EB' }}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend 
                    wrapperStyle={{ paddingTop: '20px' }}
                    formatter={(value) => <span className="text-gray-600 text-sm">{value}</span>}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="sales" 
                    stroke="#6366F1" 
                    strokeWidth={2}
                    dot={{ r: 4, fill: '#6366F1', strokeWidth: 2 }}
                    activeDot={{ r: 6, stroke: '#4F46E5', strokeWidth: 2 }}
                    name="Total Sales"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="revenue" 
                    stroke="#EC4899" 
                    strokeWidth={2}
                    dot={{ r: 4, fill: '#EC4899', strokeWidth: 2 }}
                    activeDot={{ r: 6, stroke: '#DB2777', strokeWidth: 2 }}
                    name="Revenue"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Pie Chart */}
          <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-semibold text-gray-900">Product Categories</h2>
              <button className="text-indigo-600 text-sm font-medium">View details</button>
            </div>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={analytics.productPerformance}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={2}
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    labelLine={false}
                  >
                    {analytics.productPerformance.map((entry, index) => (
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
                    formatter={(value) => [`${value} units`, 'Sales']}
                  />
                  <Legend 
                    wrapperStyle={{ paddingTop: '20px' }}
                    formatter={(value) => <span className="text-gray-600 text-sm">{value}</span>}
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
              <h2 className="text-lg font-semibold text-gray-900">Customer Activity</h2>
              <div className="text-sm text-gray-500">Last 24 hours</div>
            </div>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={analytics.customerActivity}>
                  <defs>
                    <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366F1" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#6366F1" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                  <XAxis 
                    dataKey="hour" 
                    tick={{ fill: '#6B7280' }}
                    axisLine={{ stroke: '#E5E7EB' }}
                  />
                  <YAxis 
                    tick={{ fill: '#6B7280' }}
                    axisLine={{ stroke: '#E5E7EB' }}
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
              <h2 className="text-lg font-semibold text-gray-900">Customer Satisfaction</h2>
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
                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={analytics.customerSatisfaction}>
                  <PolarGrid stroke="#E5E7EB" />
                  <PolarAngleAxis 
                    dataKey="subject" 
                    tick={{ fill: '#6B7280' }}
                  />
                  <PolarRadiusAxis 
                    angle={30} 
                    domain={[0, 150]} 
                    tick={{ fill: '#6B7280' }}
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
                    wrapperStyle={{ paddingTop: '20px' }}
                    formatter={(value) => <span className="text-gray-600 text-sm">{value}</span>}
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
              <h2 className="text-lg font-semibold text-gray-900">Sales vs Returns</h2>
              <button className="text-indigo-600 text-sm font-medium">Export data</button>
            </div>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={analytics.salesVsReturns}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                  <XAxis 
                    dataKey="date" 
                    tick={{ fill: '#6B7280' }}
                    axisLine={{ stroke: '#E5E7EB' }}
                  />
                  <YAxis 
                    tick={{ fill: '#6B7280' }}
                    axisLine={{ stroke: '#E5E7EB' }}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend 
                    wrapperStyle={{ paddingTop: '20px' }}
                    formatter={(value) => <span className="text-gray-600 text-sm">{value}</span>}
                  />
                  <Bar 
                    dataKey="orders" 
                    fill="#6366F1" 
                    name="Orders"
                    radius={[4, 4, 0, 0]}
                  />
                  <Bar 
                    dataKey="returns" 
                    fill="#F43F5E" 
                    name="Returns"
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
              <h2 className="text-lg font-semibold text-gray-900">Recent Orders</h2>
              <button className="text-indigo-600 text-sm font-medium">View all</button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 text-sm font-medium text-gray-500">Order ID</th>
                    <th className="text-left py-3 text-sm font-medium text-gray-500">Customer</th>
                    <th className="text-left py-3 text-sm font-medium text-gray-500">Amount</th>
                    <th className="text-left py-3 text-sm font-medium text-gray-500">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {analytics.recentOrders.map((order, index) => (
                    <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 text-sm font-medium text-gray-900">{order.id}</td>
                      <td className="py-3 text-sm text-gray-600">{order.customer}</td>
                      <td className="py-3 text-sm font-medium text-gray-900">{order.amount}</td>
                      <td className="py-3">
                        <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(order.status)}`}>
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
              <h2 className="text-lg font-semibold text-gray-900">Top Products</h2>
              <button className="text-indigo-600 text-sm font-medium">View all</button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 text-sm font-medium text-gray-500">Product</th>
                    <th className="text-left py-3 text-sm font-medium text-gray-500">Sales</th>
                    <th className="text-left py-3 text-sm font-medium text-gray-500">Revenue</th>
                    <th className="text-left py-3 text-sm font-medium text-gray-500">Trend</th>
                  </tr>
                </thead>
                <tbody>
                  {analytics.topProducts.map((product, index) => (
                    <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 text-sm font-medium text-gray-900">{product.name}</td>
                      <td className="py-3 text-sm text-gray-600">{product.sales}</td>
                      <td className="py-3 text-sm font-medium text-gray-900">{product.revenue}</td>
                      <td className="py-3">
                        <span className={`text-sm ${product.trend.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>
                          {product.trend}
                        </span>
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