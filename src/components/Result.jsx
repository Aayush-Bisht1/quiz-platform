import React from 'react';

const Result = ({ score, total, onRestart }) => {
  const percentage = ((score / total) * 100).toFixed(2);
  const message = percentage >= 80 ? "Excellent! 🏆" : percentage >= 60 ? "Good job!" : "Keep practicing!";

  return (
    <div className="bg-white p-8 rounded-lg shadow-md text-center">
      <h1 className="text-3xl font-bold text-blue-600 mb-4">Quiz Completed</h1>
      <div className="mb-6">
        <p className="text-xl">Your Score:</p>
        <p className="text-4xl font-bold text-blue-500">{score} / {total}</p>
        <p className="text-lg text-gray-600 mt-2">{percentage}%</p>
      </div>
      <div className="mb-6">
        <p className="text-2xl">{message}</p>
      </div>
      <button 
        onClick={onRestart}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition"
      >
        Restart
      </button>
    </div>
  );
};

export default Result;