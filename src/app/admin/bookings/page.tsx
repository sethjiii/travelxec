"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";

interface Booking {
  _id: string;
  user?: { name: string };
  package?: { name: string };
  startDate: string;
  numberOfTravelers: number;
}

const BookingsPage = () => {
  const { data: session, status } = useSession();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const token = localStorage.getItem("token");
        const isGoogleUser = !token && session?.user;

        if (!token && !isGoogleUser) {
          toast.error("Please log in to view bookings.");
          setError("Not authenticated");
          setLoading(false);
          return;
        }

        const response = await fetch("/api/admin/bookings", {
          method: "GET",
          headers: {
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          credentials: isGoogleUser ? "include" : "same-origin",
        });

        if (!response.ok) {
          const data = await response.json();
          throw new Error(data?.error || "Failed to fetch bookings.");
        }

        const data = await response.json();
        setBookings(data);
      } catch (err: any) {
        console.error("Error fetching bookings:", err);
        toast.error(err.message);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (status !== "loading") {
      fetchBookings();
    }
  }, [status, session]);

  return (
    <div className="container mx-auto px-4 py-24 playfair">
      <h1 className="text-4xl font-bold text-center text-blue-600">Bookings</h1>

      {loading ? (
        <p className="text-center">Loading bookings...</p>
      ) : error ? (
        <p className="text-center text-red-600">{error}</p>
      ) : bookings.length === 0 ? (
        <p className="text-center text-gray-600">No bookings available.</p>
      ) : (
        <div className="mt-6 overflow-x-auto">
          <table className="min-w-full bg-white shadow-md rounded-lg table-auto">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-6 py-3 border-b text-sm text-left text-gray-500 font-medium">User Name</th>
                <th className="px-6 py-3 border-b text-sm text-left text-gray-500 font-medium">Package Name</th>
                <th className="px-6 py-3 border-b text-sm text-left text-gray-500 font-medium">Start Date</th>
                <th className="px-6 py-3 border-b text-sm text-left text-gray-500 font-medium">Travelers</th>
                <th className="px-6 py-3 border-b text-sm text-left text-gray-500 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((booking) => (
                <tr key={booking._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 border-b text-sm text-gray-800">
                    {booking.user?.name || "N/A"}
                  </td>
                  <td className="px-6 py-4 border-b text-sm text-gray-800">
                    {booking.package?.name || "N/A"}
                  </td>
                  <td className="px-6 py-4 border-b text-sm text-gray-800">
                    {booking.startDate || "N/A"}
                  </td>
                  <td className="px-6 py-4 border-b text-sm text-gray-800">
                    {booking.numberOfTravelers}
                  </td>
                  <td className="px-6 py-4 border-b text-sm">
                    <Link
                      href={`/admin/bookings/${booking._id}`}
                      className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                    >
                      View Details
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default BookingsPage;
