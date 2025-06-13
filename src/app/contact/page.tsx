// ContactPage.jsx
import React, { useState } from 'react';
import Head from 'next/head';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<null | 'success'>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitStatus('success');
      setFormData({ name: '', email: '', subject: '', message: '' });
      
      // Reset status after 5 seconds
      setTimeout(() => setSubmitStatus(null), 5000);
    }, 1500);
  };

  return (
    <>
      <Head>
        <title>Contact Us | Luxury Brand</title>
        <meta name="description" content="Reach out to our premium customer service team" />
      </Head>
      
      <div className="min-h-screen bg-[#002D37] text-[#f8f8f8] overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-b from-[#186663] to-transparent opacity-30"></div>
        <div className="absolute bottom-0 right-0 w-64 h-64 rounded-full bg-[#186663] opacity-20 blur-3xl transform translate-x-1/2 translate-y-1/2"></div>
        
        <div className="container mx-auto px-4 py-16 max-w-6xl relative z-10">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-serif font-light tracking-wider mb-4">
              Contact <span className="text-[#D2AF94]">Luxury</span> Experience
            </h1>
            <div className="w-24 h-0.5 bg-[#D2AF94] mx-auto mb-6"></div>
            <p className="text-[#A5B5B4] max-w-2xl mx-auto font-light">
              Our dedicated team is ready to provide personalized assistance for all your inquiries. 
              Experience the difference of premium service.
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Information */}
            <div className="bg-[#002D37] border border-[#186663] rounded-xl p-8 shadow-xl">
              <div className="flex items-start mb-8">
                <div className="bg-[#186663] p-3 rounded-lg mr-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="#D2AF94">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-medium mb-2">Phone</h3>
                  <p className="text-[#A5B5B4]">+1 (888) 123-4567</p>
                  <p className="text-[#A5B5B4]">+44 (0)20 1234 5678</p>
                </div>
              </div>
              
              <div className="flex items-start mb-8">
                <div className="bg-[#186663] p-3 rounded-lg mr-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="#D2AF94">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-medium mb-2">Email</h3>
                  <p className="text-[#A5B5B4]">contact@luxurybrand.com</p>
                  <p className="text-[#A5B5B4]">support@luxurybrand.com</p>
                </div>
              </div>
              
              <div className="flex items-start mb-8">
                <div className="bg-[#186663] p-3 rounded-lg mr-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="#D2AF94">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-medium mb-2">Location</h3>
                  <p className="text-[#A5B5B4]">123 Luxury Avenue</p>
                  <p className="text-[#A5B5B4]">Prestige District, NY 10001</p>
                  <p className="text-[#A5B5B4]">United States</p>
                </div>
              </div>
              
              <div className="mt-12 pt-8 border-t border-[#186663]">
                <h3 className="text-xl font-medium mb-4">Business Hours</h3>
                <div className="flex justify-between text-[#A5B5B4]">
                  <span>Monday - Friday</span>
                  <span>9:00 AM - 6:00 PM</span>
                </div>
                <div className="flex justify-between text-[#A5B5B4] mt-2">
                  <span>Saturday</span>
                  <span>10:00 AM - 4:00 PM</span>
                </div>
                <div className="flex justify-between text-[#A5B5B4] mt-2">
                  <span>Sunday</span>
                  <span>Closed</span>
                </div>
              </div>
            </div>
            
            {/* Contact Form */}
            <div className="bg-[#002D37] border border-[#186663] rounded-xl p-8 shadow-xl">
              <h2 className="text-2xl font-serif font-light mb-8">
                Send Us a <span className="text-[#D2AF94]">Message</span>
              </h2>
              
              {submitStatus === 'success' ? (
                <div className="bg-[#186663] text-white p-6 rounded-lg mb-8 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <h3 className="font-medium">Message Sent Successfully</h3>
                    <p className="text-sm mt-1">Our team will respond to your inquiry within 24 hours.</p>
                  </div>
                </div>
              ) : null}
              
              <form onSubmit={handleSubmit}>
                <div className="mb-6">
                  <label htmlFor="name" className="block text-[#A5B5B4] mb-2">Full Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full bg-[#0a3a43] border border-[#186663] rounded-lg px-4 py-3 focus:outline-none focus:ring-1 focus:ring-[#D2AF94] text-white"
                    placeholder="Enter your full name"
                  />
                </div>
                
                <div className="mb-6">
                  <label htmlFor="email" className="block text-[#A5B5B4] mb-2">Email Address</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full bg-[#0a3a43] border border-[#186663] rounded-lg px-4 py-3 focus:outline-none focus:ring-1 focus:ring-[#D2AF94] text-white"
                    placeholder="Enter your email"
                  />
                </div>
                
                <div className="mb-6">
                  <label htmlFor="subject" className="block text-[#A5B5B4] mb-2">Subject</label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full bg-[#0a3a43] border border-[#186663] rounded-lg px-4 py-3 focus:outline-none focus:ring-1 focus:ring-[#D2AF94] text-white"
                    placeholder="What is this regarding?"
                  />
                </div>
                
                <div className="mb-8">
                  <label htmlFor="message" className="block text-[#A5B5B4] mb-2">Your Message</label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={5}
                    className="w-full bg-[#0a3a43] border border-[#186663] rounded-lg px-4 py-3 focus:outline-none focus:ring-1 focus:ring-[#D2AF94] text-white resize-none"
                    placeholder="How can we assist you?"
                  ></textarea>
                </div>
                
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full py-4 px-6 rounded-lg font-medium transition-all duration-300 ${
                    isSubmitting 
                      ? 'bg-[#8C7361] cursor-not-allowed' 
                      : 'bg-[#D2AF94] hover:bg-[#c19e82] text-[#002D37]'
                  }`}
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </span>
                  ) : (
                    'Send Message'
                  )}
                </button>
              </form>
            </div>
          </div>
          
          {/* Map Section */}
          <div className="mt-16 bg-[#002D37] border border-[#186663] rounded-xl overflow-hidden">
            <div className="p-6 border-b border-[#186663]">
              <h3 className="text-xl font-serif font-light">Our <span className="text-[#D2AF94]">Headquarters</span></h3>
            </div>
            <div className="h-80 bg-gradient-to-r from-[#186663] to-[#002D37] flex items-center justify-center">
              <div className="text-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-[#D2AF94]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                </svg>
                <p className="mt-4 text-[#A5B5B4]">123 Luxury Avenue, Prestige District</p>
                <p className="text-[#A5B5B4]">New York, NY 10001</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ContactPage;