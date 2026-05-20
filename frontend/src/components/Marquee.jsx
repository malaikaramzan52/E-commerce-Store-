import React from 'react';

const Marquee = ({ text, collectionText = "NEW COLLECTION", speed = '30s' }) => {
  return (
    <div className="bg-white border-y border-gray-100 overflow-hidden py-4 flex flex-col items-center select-none">
      {/* Small Upper Ticker */}
      <div className="flex animate-marquee whitespace-nowrap mb-2 italic" style={{ animationDuration: '40s' }}>
        {[...Array(15)].map((_, i) => (
          <span key={i} className="text-[10px] font-bold text-gray-300 mx-8 tracking-[0.4em] uppercase">
            / {collectionText} /
          </span>
        ))}
      </div>

      {/* Main Large Ticker */}
      <div className={`flex animate-marquee whitespace-nowrap`} style={{ animationDuration: speed }}>
        {[...Array(10)].map((_, i) => (
          <span key={i} className="text-2xl md:text-4xl font-serif italic text-gray-900 mx-12 tracking-[0.1em] uppercase">
            {text}
          </span>
        ))}
      </div>
    </div>
  );
};

export default Marquee;
