'use client';
import { useEffect, useState } from 'react';

export default function AdminItineraries() {
  type Itinerary = {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    destinations: string;
    startDate: string;
    endDate: string;
    duration: number;
    budget: number;
    contacted: boolean;
    // add any other fields as needed
  };

  const [itineraries, setItineraries] = useState<Itinerary[]>([]);

  useEffect(() => {
    fetch('/api/itinerary/all')
      .then(res => res.json())
      .then(data => setItineraries(data));
  }, []);

  const markContacted = async (id: string) => {
    await fetch('/api/itinerary/mark-contacted', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });
    setItineraries(prev =>
      prev.map(i => i._id === id ? { ...i, contacted: true } : i)
    );
  };

  const deleteItinerary = async (id: string) => {
    await fetch('/api/itinerary/delete', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });
    setItineraries(prev => prev.filter(i => i._id !== id));
  };

  return (
    <div className="min-h-screen bg-white py-24 px-8">
      <h1 className="text-3xl font-bold text-[#002D37] mb-6">User-Curated Itineraries</h1>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border">
          <thead>
            <tr className="bg-[#D2AF94]/20 text-[#002D37] text-sm">
              <th className="p-3 border">Name</th>
              <th className="p-3 border">Email</th>
              <th className="p-3 border">Destinations</th>
              <th className="p-3 border">Dates</th>
              <th className="p-3 border">Duration</th>
              <th className="p-3 border">Budget</th>
              <th className="p-3 border">Status</th>
              <th className="p-3 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {itineraries.map((i: any) => (
              <tr key={i._id} className="border-t text-sm text-gray-700">
                <td className="p-3 border">{i.firstName} {i.lastName}</td>
                <td className="p-3 border">{i.email}</td>
                <td className="p-3 border">{i.destinations}</td>
                <td className="p-3 border">{i.startDate} → {i.endDate}</td>
                <td className="p-3 border text-center">{i.duration} days</td>
                <td className="p-3 border">₹{i.budget}</td>
                <td className="p-3 border text-center">
                  {i.contacted
                    ? <span className="text-green-600 font-semibold">Contacted</span>
                    : <span className="text-yellow-600 font-semibold">Pending</span>
                  }
                </td>
                <td className="p-3 border text-center space-x-2">
                  {!i.contacted && (
                    <button
                      onClick={() => markContacted(i._id)}
                      className="bg-green-100 text-green-800 text-xs px-3 py-1 rounded hover:bg-green-200"
                    >
                      Mark Contacted
                    </button>
                  )}
                  <button
                    onClick={() => deleteItinerary(i._id)}
                    className="bg-red-100 text-red-800 text-xs px-3 py-1 rounded hover:bg-red-200"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
