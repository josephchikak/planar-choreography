import React from 'react';
import { useStore } from '../utils/useStore';

const CinemaInfo = () => {
  const { selectedCinema, clearSelectedCinema } = useStore();

  if (!selectedCinema) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 bg-black bg-opacity-90 text-white p-6 w-96 h-48 rounded-xl shadow-2xl font-inter ">
      <div className="font-bold  mb-3 ">{selectedCinema.fields.Name}</div>
      <div className="text-gray-300 text-xs mb-2 ">
        {selectedCinema.fields.City}, {selectedCinema.fields.Country}
      </div>
      <div className="text-gray-300 mb-2 text-xs">
        {selectedCinema.fields.Creation} - {selectedCinema.fields.Closure}
      </div>
      <div className="text-gray-400 text-xs">
        {selectedCinema.fields.Condition}
      </div>
      <button 
        onClick={clearSelectedCinema}
        className="absolute top-2 right-2 text-gray-400 hover:text-white text-xl"
      >
        ×
      </button>
    </div>
  );
};

export default CinemaInfo;
