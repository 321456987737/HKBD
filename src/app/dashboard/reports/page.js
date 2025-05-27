"use client";
import { useState, useEffect } from 'react';
import {
  MagnifyingGlassIcon,
  ChevronUpDownIcon,
  ExclamationTriangleIcon,
  UserCircleIcon
} from '@heroicons/react/24/outline';
import axios from 'axios';

const ReportsPage = () => {
  const [reports, setReports] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedReport, setSelectedReport] = useState(null);
  const [sortOrder, setSortOrder] = useState('newest');
  const [page, setPage] = useState(1);
  const [totalReports, setTotalReports] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch reports when page, searchQuery or sortOrder changes
  useEffect(() => {
    const fetchReports = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get('/api/reports', {
          params: {
            page: 1, // Always fetch first page when search/sort changes
            limit: 5,
            search: searchQuery,
            sort: sortOrder
          }
        });
        setReports(response.data.reports || []);
        setTotalReports(response.data.total || 0);
        setPage(1); // Reset to first page
      } catch (error) {
        console.error('Failed to fetch reports:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchReports();
  }, [searchQuery, sortOrder]);

  const loadMoreReports = async () => {
    try {
      setIsLoading(true);
      const nextPage = page + 1;
      const response = await axios.get('/api/reports', {
        params: {
          page: nextPage,
          limit: 5,
          search: searchQuery,
          sort: sortOrder
        }
      });
      
      setReports(prev => [...prev, ...(response.data.reports || [])]);
      setPage(nextPage);
    } catch (error) {
      console.error('Failed to load more reports:', error);
    } finally {
      setIsLoading(false);
    }
  };

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
        {reports.map((report) => (
          <div
            key={report._id}
            className="border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => setSelectedReport(report)}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-orange-100">
                  <UserCircleIcon className="h-5 w-5 text-orange-600" />
                </div>
                <div>
                  <h3 className="font-medium">{report.username || report.email}</h3>
                  <p className="text-gray-600 text-sm">{report.report}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500">
                  {new Date(report.date).toLocaleDateString()}
                </p>
                <p className="text-xs text-gray-400">
                  {new Date(report.date).toLocaleTimeString()}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Load More Button */}
      {reports.length < totalReports && (
        <div className='w-full flex justify-center items-center mt-6'>
          <button 
            onClick={loadMoreReports} 
            disabled={isLoading}
            className='bg-slate-100 cursor-pointer rounded-md transition-all px-4 py-1 hover:bg-slate-200 disabled:opacity-50 disabled:cursor-not-allowed'
          >
            {isLoading ? 'Loading...' : 'Load more'}
          </button>
        </div>
      )}

      {/* Report Detail Modal */}
      {selectedReport && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-[999]">
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
                  <h3 className="font-medium">{selectedReport.username || selectedReport.email}</h3>
                  <p className="text-sm text-gray-500">
                    Reported {new Date(selectedReport.date).toLocaleString()}
                  </p>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-800">{selectedReport.report}</p>
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