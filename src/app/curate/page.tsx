'use client';
import { useState } from 'react';
import Footer from '../components/FooterContent';
import { Plane } from 'lucide-react';

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
    <>
      <div className="bg-[#002D37] min-h-screen py-24 relative" style={{ backgroundImage: 'url(/bkgc.jpg)', backgroundSize: 'cover', backgroundPosition: 'center', backgroundAttachment: 'fixed' }}>
        <div className="absolute inset-0 opacity-20 bg-[#186663]"></div>
       

        <div className="max-w-2xl mx-auto p-8 bg-white rounded-xl shadow-lg z-10 relative">

          <h1 className="text-3xl font-semibold mb-8 text-[#186663]">Curate Your Own Itinerary</h1>
          <button className="absolute top-4 right-4 text-sm text-[#186663] bg-white border border-[#A6B5B4] py-2 px-4 rounded-md hover:bg-[#F5F5F5]" onClick={() => window.location.href = '/'}>
            Back to Home
          </button>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-2 gap-8">
              <input className="input bg-[#F5F5F5] text-[#002D37] border border-[#A6B5B4] rounded-lg py-3 px-6 focus:ring-2 focus:ring-[#186663]" name="firstName" placeholder="First Name" value={formData.firstName} onChange={handleChange} required />
              <input className="input bg-[#F5F5F5] text-[#002D37] border border-[#A6B5B4] rounded-lg py-3 px-6 focus:ring-2 focus:ring-[#186663]" name="lastName" placeholder="Last Name" value={formData.lastName} onChange={handleChange} required />
            </div>
            <input className="input bg-[#F5F5F5] text-[#002D37] border border-[#A6B5B4] rounded-lg py-3 px-6 focus:ring-2 focus:ring-[#186663]" type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
            <input className="input bg-[#F5F5F5] text-[#002D37] border border-[#A6B5B4] rounded-lg py-3 px-6 focus:ring-2 focus:ring-[#186663]" type="tel" name="phone" placeholder="Phone Number" value={formData.phone} onChange={handleChange} required />
            <input className="input bg-[#F5F5F5] text-[#002D37] border border-[#A6B5B4] rounded-lg py-3 px-6 focus:ring-2 focus:ring-[#186663]" name="destinations" placeholder="Destinations (e.g., Jaipur, Mumbai)" value={formData.destinations} onChange={handleChange} required />

            <div className="grid grid-cols-2 gap-8">
              <input className="input bg-[#F5F5F5] text-[#002D37] border border-[#A6B5B4] rounded-lg py-3 px-6 focus:ring-2 focus:ring-[#186663]" type="date" name="startDate" value={formData.startDate} onChange={handleChange} required />
              <input className="input bg-[#F5F5F5] text-[#002D37] border border-[#A6B5B4] rounded-lg py-3 px-6 focus:ring-2 focus:ring-[#186663]" type="date" name="endDate" value={formData.endDate} onChange={handleChange} required />
            </div>

            <p className="text-sm text-[#A6B5B4]">Duration: {duration} day(s)</p>

            <input className="input bg-[#F5F5F5] text-[#002D37] border border-[#A6B5B4] rounded-lg py-3 px-6 focus:ring-2 focus:ring-[#186663]" type="number" name="budget" placeholder="Budget (INR)" value={formData.budget} onChange={handleChange} required />
            <textarea className="input bg-[#F5F5F5] text-[#002D37] border border-[#A6B5B4] rounded-lg py-3 px-6 focus:ring-2 focus:ring-[#186663]" rows={4} name="specialRequirements" placeholder="Any special requirements?" value={formData.specialRequirements} onChange={handleChange} />

            <button type="submit" className="bg-[#186663] text-white px-8 py-3 rounded-lg hover:bg-[#0f4b4b] transition-all duration-300">Submit</button>

          </form>

          {success && <p className="mt-4 text-green-400 font-medium">Itinerary submitted successfully!</p>}
        </div>


      </div>


      <footer className="w-full bg-gradient-to-r from-transparent via-[#D2AF94] to-transparent">
        <Footer />
      </footer>
    </>
  );
}
