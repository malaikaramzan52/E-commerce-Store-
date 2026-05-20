import React from 'react';
import { Mail } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-100 pt-8 pb-0 flex flex-col">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-10 w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-x-8 gap-y-8">
          
          {/* Brand & Newsletter */}
          <div className="lg:col-span-1">
            <Link to="/" className="text-xl font-bold tracking-tighter text-gray-900 mb-4 block">
              ELEGANCE<span className="text-gray-500">COUTURE</span>
            </Link>
            <p className="text-xs text-gray-500 mb-4 leading-relaxed">
              Elevating everyday essentials with modern design and premium materials. Experience authentic streetwear.
            </p>
            <div className="flex space-x-4 text-gray-400">
              <a href="#" className="hover:text-black transition-colors text-xs font-medium">FB</a>
              <a href="#" className="hover:text-black transition-colors text-xs font-medium">TW</a>
              <a href="#" className="hover:text-black transition-colors text-xs font-medium">IG</a>
              <a href="#" className="hover:text-black transition-colors text-xs font-medium">YT</a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-bold text-gray-900 uppercase tracking-widest mb-4">Shop</h4>
            <ul className="space-y-2">
              <li><Link to="#" className="text-xs text-gray-500 hover:text-black transition-colors">New Arrivals</Link></li>
              <li><Link to="#" className="text-xs text-gray-500 hover:text-black transition-colors">Women's Collection</Link></li>
              <li><Link to="#" className="text-xs text-gray-500 hover:text-black transition-colors">Sale</Link></li>
            </ul>
          </div>

          {/* Pages */}
          <div>
            <h4 className="text-xs font-bold text-gray-900 uppercase tracking-widest mb-4">Pages</h4>
            <ul className="space-y-2">
              <li><Link to="/" className="text-xs text-gray-500 hover:text-black transition-colors">Home</Link></li>
              <li><Link to="/shop" className="text-xs text-gray-500 hover:text-black transition-colors">Shop</Link></li>
              <li><Link to="/sale" className="text-xs text-gray-500 hover:text-black transition-colors">Sale</Link></li>
              <li><Link to="/about" className="text-xs text-gray-500 hover:text-black transition-colors">About Us</Link></li>
              <li><Link to="/contact" className="text-xs text-gray-500 hover:text-black transition-colors">Contact Us</Link></li>
            </ul>
          </div>

          {/* Help & Information */}
          <div>
            <h4 className="text-xs font-bold text-gray-900 uppercase tracking-widest mb-4">Support</h4>
            <ul className="space-y-2">
              <li><Link to="#" className="text-xs text-gray-500 hover:text-black transition-colors">FAQ</Link></li>
              <li><Link to="#" className="text-xs text-gray-500 hover:text-black transition-colors">Shipping & Returns</Link></li>
              <li><Link to="#" className="text-xs text-gray-500 hover:text-black transition-colors">Size Guide</Link></li>
              <li><Link to="/contact" className="text-xs text-gray-500 hover:text-black transition-colors">Contact Us</Link></li>
              <li><Link to="#" className="text-xs text-gray-500 hover:text-black transition-colors">Track Your Order</Link></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="text-xs font-bold text-gray-900 uppercase tracking-widest mb-4">Newsletter</h4>
            <p className="text-xs text-gray-500 mb-3 leading-relaxed">
              Subscribe to get special offers, free giveaways, and once-in-a-lifetime deals.
            </p>
            <form className="mt-2 sm:flex sm:max-w-md">
              <label htmlFor="email-address" className="sr-only">Email address</label>
              <div className="relative flex-1">
                <div className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none">
                  <Mail className="h-4 w-4 text-gray-400" />
                </div>
                <input 
                  type="email" 
                  name="email-address" 
                  id="email-address" 
                  autoComplete="email" 
                  required 
                  className="w-full bg-white border border-gray-300 text-gray-900 pl-8 px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-black focus:border-black transition-colors placeholder-gray-400" 
                  placeholder="Enter your email" 
                />
              </div>
              <div className="mt-2 rounded-md sm:mt-0 sm:ml-2 sm:flex-shrink-0">
                <button type="submit" className="w-full bg-black border border-transparent px-4 py-2 text-xs font-bold text-white hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black transition-colors">
                  Subscribe
                </button>
              </div>
            </form>
          </div>

        </div>
      </div>

      {/* Bottom */}
      <div className="bg-black py-4 border-t border-gray-900 mt-auto w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-xs text-white/80">
            &copy; 2026 All rights reserved HAT Tech Media.
          </p>
          <div className="mt-2 md:mt-0 flex space-x-6">
            <Link to="#" className="text-xs text-white/80 hover:text-white transition-colors">Privacy Policy</Link>
            <Link to="#" className="text-xs text-white/80 hover:text-white transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
