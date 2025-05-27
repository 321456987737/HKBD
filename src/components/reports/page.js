"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import {
  ExclamationTriangleIcon,
  MagnifyingGlassIcon,
  ChevronUpDownIcon,
  UserCircleIcon,
} from "@heroicons/react/24/outline";

const ReportsPage = () => {
  const [reports, setReports] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState("newest");
  const [selectedReport, setSelectedReport] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchReports = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        `/api/reports?page=1&limit=100&search=${encodeURIComponent(
          searchQuery
        )}&sort=${sortOrder}`
      );
      setReports(res.data.reports || []);
    } catch (error) {
      console.error("Error fetching reports:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, [searchQuery, sortOrder]);

  const filteredReports = reports
    .filter(
      (report) =>
        report.username?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        report.report?.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      return sortOrder === "newest"
        ? new Date(b.date) - new Date(a.date)
        : new Date(a.date) - new Date(b.date);
    });

  return (
    <div className="w-full p-6 bg-white rounded-lg shadow-sm">
      <div className="mb-6 ml-8">
        <h1 className="text-2xl font-bold flex items-center">
          <ExclamationTriangleIcon className="h-6 w-6 mr-2 text-red-500" />
          User Reports
        </h1>
        <p className="text-gray-600 mt-1">
          Manage and review user-submitted reports
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="relative">
          <input
            type="text"
            placeholder="Search reports..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full p-2 pl-10 border rounded-lg focus:ring-2 focus:ring-red-500 focus:outline-none"
          />
          <MagnifyingGlassIcon className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
        </div>
        <div className="relative">
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            className="w-full p-2 pl-10 border rounded-lg focus:ring-2 focus:ring-red-500 focus:outline-none appearance-none"
          >
            <option value="newest">latest First</option>
            <option value="oldest">konatareen First</option>
          </select>
          <ChevronUpDownIcon className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
        </div>
        
      </div>
          

      {loading ? (
        <div className="text-center py-10">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-red-500"></div>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredReports.length === 0 ? (
            <div className="text-center py-10 text-gray-500">
              No reports found {searchQuery && `for "${searchQuery}"`}
            </div>
          ) : (
            filteredReports.map((report) => (
              <div
                key={report._id}
                className="border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => setSelectedReport(report)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className={`p-2 rounded-full ${
                        report.status === "resolved"
                          ? "bg-green-100"
                          : "bg-red-100"
                      }`}
                    >
                      <UserCircleIcon
                        className={`h-5 w-5 ${
                          report.status === "resolved"
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      />
                    </div>
                    <div>
                      <h3 className="font-medium">{report.username}</h3>
                      <p className="text-gray-600 text-sm line-clamp-1">
                        {report.report}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">
                      {new Date(report.date).toLocaleDateString()}
                    </p>
                    <p className="text-xs text-gray-400">
                      {new Date(report.date).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
      {selectedReport && (
        <div className="fixed inset-0 bg-black/75 bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-xl font-bold">Report Details</h2>
              <button
                onClick={() => setSelectedReport(null)}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                &times;
              </button>
            </div>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div
                  className={`p-2 rounded-full ${
                    selectedReport.status === "resolved"
                      ? "bg-green-100"
                      : "bg-red-100"
                  }`}
                >
                  <UserCircleIcon
                    className={`h-8 w-8 ${
                      selectedReport.status === "resolved"
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  />
                </div>
                <div>
                  <h3 className="font-medium">{selectedReport.username}</h3>
                  <p className="text-sm text-gray-500">
                    Reported {new Date(selectedReport.date).toLocaleString()}
                  </p>
                </div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-800 whitespace-pre-line">
                  {selectedReport.report}
                </p>
              </div>
              <div className="mt-4 flex gap-4 justify-end">
                <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                  Mark as Resolved
                </button>
                <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
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
