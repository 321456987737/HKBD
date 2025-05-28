"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import axios from "axios";

export default function ContactPopup({ onClose }) {
  const { data: session, status } = useSession();
  const [report, setReport] = useState("");
  const [loading, setLoading] = useState(false);

  // Wait for session to load
  if (status === "loading") {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 px-4">
        <div className="text-white text-lg">Loading...</div>
      </div>
    );
  }

  // Optionally, block unauthenticated users
  if (status === "unauthenticated") {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 px-4">
        <div className="bg-white p-6 rounded-lg w-full max-w-lg shadow-xl text-center">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">Contact Us</h2>
          <p className="mb-4 text-gray-700">Please sign in to send a message.</p>
          <button
            onClick={onClose}
            className="w-full mt-2 bg-gray-200 text-gray-700 py-2 rounded hover:bg-gray-300 transition"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  const username = session?.user?.username || "";
  const email = session?.user?.email || "";

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!report.trim()) {
      alert("Please enter your message.");
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post("/api/reports", {
        email,
        username,
        report,
      });
      console.log("✅ Report created:", response.data);
      alert("Your message was sent successfully.");
      onClose(); // Close modal after successful submission
    } catch (error) {
      console.error("❌ Error creating report:", error);
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 px-4">
      <div
        className="bg-white p-6 rounded-lg w-full max-w-lg shadow-xl relative"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">Contact Us</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <textarea
            className="w-full h-32 p-3 border border-gray-300 rounded resize-none focus:outline-none focus:ring-2 focus:ring-red-500"
            placeholder="Write your message here..."
            value={report}
            onChange={(e) => setReport(e.target.value)}
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-red-600 text-white py-2 rounded hover:bg-red-700 transition disabled:opacity-50"
          >
            {loading ? "Sending..." : "Send"}
          </button>

          <button
            type="button"
            onClick={onClose}
            className="w-full mt-2 bg-gray-200 text-gray-700 py-2 rounded hover:bg-gray-300 transition"
          >
            Cancel
          </button>
        </form>
      </div>
    </div>
  );
}