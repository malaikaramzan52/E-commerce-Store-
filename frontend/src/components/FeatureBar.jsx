import React from 'react';
import { ShieldCheck, Truck, RotateCcw, MapPin } from 'lucide-react';

const FeatureBar = () => {
  const features = [
    {
      icon: <ShieldCheck className="w-6 h-6 md:w-8 md:h-8" />,
      title: "Secure Payments",
      desc: "Shop with confidence knowing your transactions are safeguarded."
    },
    {
      icon: <Truck className="w-6 h-6 md:w-8 md:h-8" />,
      title: "Free Shipping",
      desc: "Complimentary nationwide shipping on all pre-paid orders."
    },
    {
      icon: <RotateCcw className="w-6 h-6 md:w-8 md:h-8" />,
      title: "Easy Returns",
      desc: "Hassle-free 7-day return policy if you change your mind."
    },
    {
      icon: <MapPin className="w-6 h-6 md:w-8 md:h-8" />,
      title: "Order Tracking",
      desc: "Real-time updates from checkout to your doorstep."
    }
  ];

  return (
    <section className="bg-white py-10 md:py-14 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 md:gap-8">
          {features.map((f, i) => (
            <div key={i} className="flex flex-col items-center text-center group">
              <div className="mb-6 text-black transition-transform duration-500 group-hover:-translate-y-2">
                {f.icon}
              </div>
              <h3 className="text-sm font-bold tracking-[0.2em] uppercase mb-4 text-gray-900 group-hover:text-neutral-600 transition-colors">
                {f.title}
              </h3>
              <p className="text-xs text-gray-400 font-medium leading-relaxed max-w-[200px]">
                {f.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeatureBar;
