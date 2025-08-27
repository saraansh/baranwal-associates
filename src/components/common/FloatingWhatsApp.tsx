'use client';

import { MessageCircle } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

export function FloatingWhatsApp() {
  const t = useTranslations('WhatsApp');
  const [isHovered, setIsHovered] = useState(false);

  const handleWhatsAppClick = () => {
    const phoneNumber = '+919415245083'; // Remove all non-digit characters
    const message = encodeURIComponent(t('message'));
    const whatsappURL = `https://wa.me/${phoneNumber}?text=${message}`;
    window.open(whatsappURL, '_blank');
  };

  return (
    <div className="fixed right-6 bottom-6 z-50">
      {/* Tooltip */}
      {isHovered && (
        <div className="animate-fade-in absolute right-0 bottom-16 mb-2 rounded-lg bg-gray-900 px-3 py-2 text-sm whitespace-nowrap text-white shadow-lg">
          {t('tooltip')}
          {/* Arrow */}
          <div className="absolute top-full right-4 h-0 w-0 border-t-4 border-r-4 border-l-4 border-t-gray-900 border-r-transparent border-l-transparent"></div>
        </div>
      )}

      {/* WhatsApp Button */}
      <button
        type="button"
        onClick={handleWhatsAppClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="group relative h-14 w-14 rounded-full bg-green-500 text-white shadow-lg transition-all duration-300 hover:scale-110 hover:bg-green-600 hover:shadow-2xl focus:ring-4 focus:ring-green-300 focus:outline-none"
        aria-label={t('tooltip')}
      >
        {/* Glow effect - only visible on hover */}
        <div className="absolute inset-0 rounded-full bg-green-500 opacity-0 transition-all duration-300 group-hover:animate-pulse group-hover:opacity-75" />
        <div className="absolute inset-0 scale-150 rounded-full bg-green-500 opacity-0 transition-all duration-300 group-hover:scale-175 group-hover:opacity-50" />

        {/* Icon container */}
        <div className="relative z-10 flex h-full w-full items-center justify-center">
          <MessageCircle className="h-7 w-7 transition-transform duration-300 group-hover:scale-110" />
        </div>

        {/* Ripple effect on click */}
        <div className="absolute inset-0 rounded-full bg-green-400 opacity-0 transition-all duration-200 group-active:scale-150 group-active:opacity-50" />

        {/* Notification badge (optional) */}
        <div className="absolute -top-1 -right-1 flex h-4 w-4 animate-bounce items-center justify-center rounded-full bg-red-500 text-xs text-white">
          !
        </div>
      </button>

      {/* Additional floating animation */}
      <style jsx>
        {`
        @keyframes floating {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-4px); }
        }

        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .group:hover {
          animation: floating 2s ease-in-out infinite;
        }

        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
      `}
      </style>
    </div>
  );
}
