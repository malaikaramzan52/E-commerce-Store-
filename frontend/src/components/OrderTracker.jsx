import React from 'react';
import { CheckCircle2, Package, Truck, Home, Clock } from 'lucide-react';

const steps = [
  { id: 'pending', label: 'Order Confirmed', icon: CheckCircle2 },
  { id: 'shipped', label: 'Order Shipped', icon: Package },
  { id: 'out_for_delivery', label: 'Out for Delivery', icon: Truck },
  { id: 'delivered', label: 'Order Delivered', icon: Home },
];

const OrderTracker = ({ currentStatus, onStatusChange, isAdmin = false }) => {
  const currentStepIndex = steps.findIndex(s => s.id === currentStatus);
  const isCancelled = currentStatus === 'cancelled';

  if (isCancelled) {
    return (
      <div className="flex items-center justify-center p-4 bg-rose-50 rounded-2xl border border-rose-100">
        <p className="text-rose-600 font-bold text-[10px] uppercase tracking-widest">Order has been cancelled</p>
      </div>
    );
  }

  return (
    <div className="w-full py-6">
      <div className="relative flex justify-between items-center w-full">
        {/* Background Line */}
        <div className="absolute top-1/2 left-0 w-full h-0.5 bg-slate-100 -translate-y-1/2 z-0" />
        
        {/* Progress Line */}
        <div 
          className="absolute top-1/2 left-0 h-0.5 bg-emerald-500 -translate-y-1/2 z-0 transition-all duration-500"
          style={{ width: `${(currentStepIndex / (steps.length - 1)) * 100}%` }}
        />

        {steps.map((step, index) => {
          const Icon = step.icon;
          const isCompleted = index <= currentStepIndex;
          const isActive = index === currentStepIndex;

          return (
            <div 
              key={step.id} 
              className="relative z-10 flex flex-col items-center flex-1"
              style={{ cursor: isAdmin && !isCompleted ? 'pointer' : 'default' }}
              onClick={() => isAdmin && onStatusChange && onStatusChange(step.id)}
            >
              {/* Node Circle */}
              <div 
                className={`w-7 h-7 rounded-full flex items-center justify-center transition-all duration-300 ${
                  isCompleted 
                    ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-200' 
                    : 'bg-white border-2 border-slate-200 text-slate-300'
                } ${isActive ? 'ring-4 ring-emerald-100 scale-110' : ''}`}
              >
                <Icon size={14} />
              </div>

              {/* Label */}
              <div className="absolute top-10 w-24 text-center">
                <p className={`text-[9px] md:text-[10px] font-black uppercase tracking-[0.1em] transition-all duration-300 leading-tight ${
                  isCompleted ? 'text-slate-900 scale-105' : 'text-slate-500'
                }`}>
                  {step.label}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default OrderTracker;
