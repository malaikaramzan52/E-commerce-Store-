import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Mail, Phone, MapPin, Send, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

const Contact = () => {
  const { user, token: authContextToken } = useAuth();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  // Pre-fill form if user is logged in
  useEffect(() => {
    if (user) {
      const names = (user.name || "").split(' ');
      setFormData(prev => ({
        ...prev,
        firstName: names[0] || '',
        lastName: names.slice(1).join(' ') || '',
        email: user.email || '',
        phone: user.phoneNumber || ''
      }));
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch(`${API_BASE}/api/contact/submit`, {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json',
            ...(authContextToken && { Authorization: `Bearer ${authContextToken}` })
        },
        body: JSON.stringify({
          name: `${formData.firstName} ${formData.lastName}`.trim(),
          email: formData.email,
          phone: formData.phone,
          subject: formData.subject,
          message: formData.message
        })
      });

      const data = await res.json();
      if (data.success) {
        setSubmitted(true);
        setFormData({ firstName: '', lastName: '', email: '', phone: '', subject: '', message: '' });
      } else {
        setError(data.message || 'Something went wrong. Please try again.');
      }
    } catch (err) {
      setError('Connection failed. Please check your internet.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F9F9F9]">
      <Navbar />
      
      <main className="flex-grow pt-28 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center mb-20 animate-fade-in">
            <p className="text-[10px] md:text-xs font-bold tracking-[0.5em] text-gray-400 uppercase mb-4">
              CONCIERGE SERVICES
            </p>
            <h1 className="text-4xl md:text-5xl lg:text-7xl font-serif italic tracking-wider mb-6 text-gray-900">
              Get in Touch
            </h1>
            <div className="w-16 h-px bg-black/10 mx-auto" />
          </div>

          <div className="flex flex-col lg:flex-row gap-16 bg-white overflow-hidden shadow-sm border border-gray-100 p-8 md:p-12">
            
            {/* Contact Info */}
            <div className="w-full lg:w-1/3 flex flex-col gap-10">
              <div>
                <h3 className="text-lg font-serif italic text-gray-900 mb-6">Contact Information</h3>
                <p className="text-sm font-light text-gray-500 leading-relaxed mb-8">
                  Whether you have a question about our collections, sizing, or styling advice, our concierge team is at your service.
                </p>
              </div>

              <div className="flex items-start gap-4">
                <Phone className="w-5 h-5 text-gray-400 mt-1" />
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-widest text-gray-900 mb-2">Phone</h4>
                  <p className="text-sm text-gray-600 font-light">+92 300 1234567</p>
                  <p className="text-xs text-gray-400 mt-1">Mon - Sat, 10:00 AM to 6:00 PM</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <Mail className="w-5 h-5 text-gray-400 mt-1" />
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-widest text-gray-900 mb-2">Email</h4>
                  <p className="text-sm text-gray-600 font-light">concierge@elegancecouture.com</p>
                  <p className="text-xs text-gray-400 mt-1">We typically reply within 24 hours</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <MapPin className="w-5 h-5 text-gray-400 mt-1" />
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-widest text-gray-900 mb-2">Flagship Studio</h4>
                  <p className="text-sm text-gray-600 font-light leading-relaxed">
                    123 Couture Avenue,<br />
                    Gulberg III, Lahore,<br />
                    Pakistan
                  </p>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="w-full lg:w-2/3">
              <h3 className="text-lg font-serif italic text-gray-900 mb-8 border-b border-gray-100 pb-4">
                Send us a Message
              </h3>

              {submitted ? (
                <div className="py-20 text-center animate-in zoom-in duration-500">
                  <div className="w-20 h-20 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle2 size={40} />
                  </div>
                  <h4 className="text-2xl font-serif italic mb-4">Message Sent</h4>
                  <p className="text-slate-500 text-sm max-w-sm mx-auto">Thank you for reaching out. Our concierge team will review your inquiry and get back to you shortly.</p>
                  <button 
                    onClick={() => setSubmitted(false)}
                    className="mt-8 text-[10px] uppercase font-black border-b-2 border-black pb-1 hover:opacity-50 transition-opacity"
                  >
                    Send another message
                  </button>
                </div>
              ) : (
                <form className="space-y-6" onSubmit={handleSubmit}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2">First Name</label>
                      <input 
                        required
                        type="text" 
                        value={formData.firstName}
                        onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                        className="w-full bg-gray-50 border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:border-black transition-colors"
                        placeholder="Jane"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2">Last Name</label>
                      <input 
                        required
                        type="text" 
                        value={formData.lastName}
                        onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                        className="w-full bg-gray-50 border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:border-black transition-colors"
                        placeholder="Doe"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2">Email Address</label>
                    <input 
                      required
                      type="email" 
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="w-full bg-gray-50 border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:border-black transition-colors"
                      placeholder="jane@example.com"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2">Phone Number</label>
                    <input 
                      type="tel" 
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      className="w-full bg-gray-50 border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:border-black transition-colors"
                      placeholder="+92 300 0000000"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2">Subject</label>
                    <input 
                      required
                      type="text" 
                      value={formData.subject}
                      onChange={(e) => setFormData({...formData, subject: e.target.value})}
                      className="w-full bg-gray-50 border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:border-black transition-colors"
                      placeholder="How can we help?"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2">Message</label>
                    <textarea 
                      required
                      rows="5"
                      value={formData.message}
                      onChange={(e) => setFormData({...formData, message: e.target.value})}
                      className="w-full bg-gray-50 border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:border-black transition-colors resize-none"
                      placeholder="Your message here..."
                    ></textarea>
                  </div>

                  {error && <p className="text-rose-600 text-[11px] font-bold uppercase tracking-wider">{error}</p>}

                  <div className="pt-4">
                    <button 
                      type="submit" 
                      disabled={loading}
                      className="bg-black text-white px-10 py-5 text-[10px] uppercase font-bold tracking-[0.2em] hover:bg-zinc-800 transition-all w-full md:w-auto flex items-center justify-center gap-3 disabled:bg-zinc-400 group shadow-lg"
                    >
                      {loading ? 'Processing...' : (
                        <>
                          Submit Inquiry
                          <Send size={14} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>

          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Contact;
