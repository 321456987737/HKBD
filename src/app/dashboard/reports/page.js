"use client";
import { useState } from 'react';
import {
  MagnifyingGlassIcon,
  ChevronUpDownIcon,
  ExclamationTriangleIcon,
  UserCircleIcon,
  ClockIcon
} from '@heroicons/react/24/outline';

const ReportsPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedReport, setSelectedReport] = useState(null);
  const [sortOrder, setSortOrder] = useState('newest');
  
  // Sample reports data
  const [reports] = useState([
    {
      id: 1,
      user: 'john@example.com',
      content: 'Unauthorized transaction noticed in my account',
      timestamp: '2024-03-15T14:30:00',
      status: 'pending',
      type: 'financial'
    },
    {
      id: 2,
      user: 'sarah_connor',
      content: 'Bug found in payment gateway integration',
      timestamp: '2024-03-14T09:15:00',
      status: 'resolved',
      type: 'technical'
    },
    // Add 10+ more sample reports
  ]);

  // Sort and filter reports
  const filteredReports = reports
    .filter(report => 
      report.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.content.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => 
      sortOrder === 'newest' 
        ? new Date(b.timestamp) - new Date(a.timestamp)
        : new Date(a.timestamp) - new Date(b.timestamp)
    );

  return (
    <div className="w-full p-6 bg-white rounded-lg shadow-sm">
      {/* Header */}
      <div className="mb-6 ml-8">
        <h1 className="text-2xl font-bold flex items-center">
          <ExclamationTriangleIcon className="h-6 w-6 mr-2 text-orange-500" />
          User Reports
        </h1>
        <p className="text-gray-600 mt-1">Manage and review user-submitted reports</p>
      </div>

      {/* Controls */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="relative">
          <input
            type="text"
            placeholder="Search reports..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full p-2 pl-10 border rounded-lg focus:ring-2 focus:ring-blue-500"
          />
          <MagnifyingGlassIcon className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
        </div>

        <div className="relative">
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            className="w-full p-2 pl-10 border rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
          </select>
          <ChevronUpDownIcon className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
        </div>
      </div>

      {/* Reports List */}
      <div className="space-y-4">
        {filteredReports.map((report) => (
          <div 
            key={report.id}
            className="border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => setSelectedReport(report)}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-full ${
                  report.status === 'resolved' ? 'bg-green-100' : 'bg-orange-100'
                }`}>
                  <UserCircleIcon className={`h-5 w-5 ${
                    report.status === 'resolved' ? 'text-green-600' : 'text-orange-600'
                  }`} />
                </div>
                <div>
                  <h3 className="font-medium">{report.user}</h3>
                  <p className="text-gray-600 text-sm">{report.content}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500">
                  {new Date(report.timestamp).toLocaleDateString()}
                </p>
                <p className="text-xs text-gray-400">
                  {new Date(report.timestamp).toLocaleTimeString()}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Report Detail Modal */}
      {selectedReport && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-xl font-bold">Report Details</h2>
              <button 
                onClick={() => setSelectedReport(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <UserCircleIcon className="h-8 w-8 text-blue-600" />
                <div>
                  <h3 className="font-medium">{selectedReport.user}</h3>
                  <p className="text-sm text-gray-500">
                    Reported {new Date(selectedReport.timestamp).toLocaleString()}
                  </p>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-800">{selectedReport.content}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-600">Status</label>
                  <div className={`px-2 py-1 rounded-full inline-block ${
                    selectedReport.status === 'resolved' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-orange-100 text-orange-800'
                  }`}>
                    {selectedReport.status}
                  </div>
                </div>
                <div>
                  <label className="text-sm text-gray-600">Report Type</label>
                  <p className="capitalize">{selectedReport.type}</p>
                </div>
              </div>

              <div className="mt-4 flex gap-4 justify-end">
                <button className="px-4 py-2 border rounded-lg hover:bg-gray-50">
                  Mark as Resolved
                </button>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                  Contact User
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReportsPage;