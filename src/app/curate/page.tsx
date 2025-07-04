'use client';
import { useState } from 'react';

export default function CurateItineraryPage() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    destinations: '',
    startDate: '',
    endDate: '',
    budget: '',
    specialRequirements: '',
  });

  const [duration, setDuration] = useState(0);
  const [success, setSuccess] = useState(false);

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    const updated = { ...formData, [name]: value };
    setFormData(updated);

    if (updated.startDate && updated.endDate) {
      const start = new Date(updated.startDate);
      const end = new Date(updated.endDate);
      const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
      setDuration(days);
    }
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    const fullData = { ...formData, duration };

    const res = await fetch('/api/itinerary/save', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(fullData),
    });

    if (res.ok) {
      setSuccess(true);
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        destinations: '',
        startDate: '',
        endDate: '',
        budget: '',
        specialRequirements: '',
      });
      setDuration(0);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-lg rounded-xl my-10 py-14">
      <h1 className="text-2xl font-bold mb-4 text-[#002D37]">Curate Your Own Itinerary</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <input className="input" name="firstName" placeholder="First Name" value={formData.firstName} onChange={handleChange} required />
          <input className="input" name="lastName" placeholder="Last Name" value={formData.lastName} onChange={handleChange} required />
        </div>
        <input className="input" type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
        <input className="input" type="tel" name="phone" placeholder="Phone Number" value={formData.phone} onChange={handleChange} required />
        <input className="input" name="destinations" placeholder="Destinations (e.g., Jaipur, Mumbai)" value={formData.destinations} onChange={handleChange} required />
        <div className="grid grid-cols-2 gap-4">
          <input className="input" type="date" name="startDate" value={formData.startDate} onChange={handleChange} required />
          <input className="input" type="date" name="endDate" value={formData.endDate} onChange={handleChange} required />
        </div>
        <p className="text-sm text-gray-500">Duration: {duration} day(s)</p>
        <input className="input" type="number" name="budget" placeholder="Budget (INR)" value={formData.budget} onChange={handleChange} required />
        <textarea className="input" rows={4} name="specialRequirements" placeholder="Any special requirements?" value={formData.specialRequirements} onChange={handleChange} />
        <button type="submit" className="bg-[#186663] text-white px-6 py-2 rounded-lg hover:bg-[#0f4b4b]">Submit</button>
      </form>

      {success && <p className="mt-4 text-green-600 font-medium">Itinerary submitted successfully!</p>}
    </div>
  );
}
