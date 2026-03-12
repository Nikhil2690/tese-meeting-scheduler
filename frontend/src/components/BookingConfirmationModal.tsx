import React from 'react';
import tickmarkImg from '../assets/tickmark.jpg';
import Stepper from './Stepper'; // Make sure the path is correct

const BookingConfirmationModal: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#f8fafc] p-4 font-sans antialiased text-[#1a3a5a]">
      
      {/* 1. Reusable Stepper Container */}
      <div className="w-full max-w-4xl mb-12 flex justify-center ml-10 ">
        <div className="w-[42%]">
          <Stepper currentStep={2} />
        </div>
      </div>

      {/* 2. Main Confirmation Modal */}
      <div className="w-full max-w-md bg-white rounded-lg shadow-[0_10px_50px_rgba(0,0,0,0.08)] p-12 flex flex-col items-center text-center">
        
        {/* Celebration Graphic */}
        <div className="mb-10 flex items-center justify-center w-28 h-28">
          <img 
            src={tickmarkImg} 
            alt="Confirmation" 
            className="w-full h-full object-contain" 
          />
        </div>

        {/* Title */}
        <h2 className="text-xl font-bold mb-4">
          Booking confirmed
        </h2>

        {/* Informative Text */}
        <p className="text-sm font-medium text-gray-600 mb-8 leading-relaxed">
          You’re booked with Victoire Serruys.<br />
          An invitation has been emailed to you.
        </p>

        {/* Confirmed DateTime */}
        <div className="border-t border-gray-100 w-full pt-6">
          <div className="text-xl font-bold tracking-tight">
            11 March 2026
          </div>
          <div className="text-xl font-bold tracking-tight mt-1">
            16:30
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingConfirmationModal;