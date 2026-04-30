
import React, { useState } from 'react';
import { MessageCircle } from 'lucide-react';

const WhatsAppFloat = () => {
  const [isOpen, setIsOpen] = useState(false);

  const handleWhatsAppClick = () => {
    const phoneNumber = '573013317868';
    const message = '¡Hola! Me gustaría agendar una cita para terapia psicológica.';
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <>
      {/* WhatsApp Float Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={handleWhatsAppClick}
          onMouseEnter={() => setIsOpen(true)}
          onMouseLeave={() => setIsOpen(false)}
          className="bg-green-500 hover:bg-green-600 text-white rounded-full p-4 shadow-2xl hover:shadow-3xl transform hover:scale-110 transition-all duration-300 group"
        >
          <MessageCircle className="h-6 w-6 group-hover:rotate-12 transition-transform duration-300" />
          
          {/* Subtle pulse effect */}
          <div className="absolute inset-0 bg-green-400 rounded-full animate-ping opacity-20"></div>
        </button>

        {/* Tooltip */}
        {isOpen && (
          <div className="absolute bottom-full right-0 mb-4 bg-gray-900 text-white px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap animate-fade-in shadow-xl">
            ¡Chatea con nosotros!
          </div>
        )}
      </div>
    </>
  );
};

export default WhatsAppFloat;
