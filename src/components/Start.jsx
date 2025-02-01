import React from 'react';

const Start = ({ total, onStart }) => (
  <div className="bg-white p-8 rounded-lg shadow-md text-center">
    <h1 className="text-3xl font-bold text-blue-600 mb-4">Quiz Challenge</h1>
    <p className="mb-6 text-gray-700">Get ready! This quiz has {total} questions.</p>
    <button 
      onClick={onStart}
      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition"
    >
      Start
    </button>
  </div>
);

export default Start;