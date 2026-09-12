import React from 'react';
import { Laptop, ArrowLeft, Monitor } from 'lucide-react';
import { useNavigate } from 'react-router';

interface ViewportRestrictionModalProps {
  minWidth?: number;
  minHeight?: number;
}

export function ViewportRestrictionModal({ 
  minWidth = 780, 
  minHeight = 680 
}: ViewportRestrictionModalProps) {
  const navigate = useNavigate();

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-gray-950/80 backdrop-blur-md p-4 animate-in fade-in-0 duration-300">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-800 max-w-md w-full overflow-hidden p-8 text-center animate-in zoom-in-95 duration-300">
        
        {/* Visual Header / Premium Icon */}
        <div className="mx-auto mb-6 w-16 h-16 bg-blue-50 dark:bg-blue-950/50 rounded-2xl flex items-center justify-center border border-blue-100 dark:border-blue-900/50 shadow-inner">
          <Laptop className="w-8 h-8 text-blue-600 dark:text-blue-400 animate-pulse" />
        </div>

        {/* Heading */}
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
          Desktop Experience Recommended
        </h2>

        {/* Message */}
        <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed mb-6">
          We’re committed to making SoloOS fully accessible across all devices. At the moment, the full dashboard experience is optimized for desktop, laptops, and larger tablets.
        </p>

        {/* Requirements Tag */}
        <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4 mb-6 border border-gray-100 dark:border-gray-800 text-left">
          <div className="flex items-center gap-2 mb-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
            <Monitor className="w-4 h-4 text-blue-500" />
            <span>Minimum Screen Requirement</span>
          </div>
          <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">
            {minWidth}px width <span className="text-gray-400 font-normal">×</span> {minHeight}px height
          </p>
          <p className="text-[11px] text-gray-400 dark:text-gray-500 mt-1">
            Thank you for your patience — mobile workspace support is coming soon.
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-3">
          <button
            onClick={() => navigate('/')}
            className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white py-3 px-4 rounded-xl font-semibold transition-all shadow-md shadow-blue-600/10 hover:shadow-lg cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Continue to Landing Page</span>
          </button>
        </div>

      </div>
    </div>
  );
}
