import React, { useState, useEffect } from "react";
import { Timer, Flame } from "lucide-react";

const Questions = ({ question, onAnswer, current, total }) => {
  const [selectedOption, setSelectedOption] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [remainingOptions, setRemainingOptions] = useState([]);
  const [fiftyFiftyUsed, setFiftyFiftyUsed] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(600);
  const [isShaking, setIsShaking] = useState(false);
  const [streak, setStreak] = useState(0);
  const [highestStreak, setHighestStreak] = useState(0);

  useEffect(() => {
    setRemainingOptions(question.options);
  }, [question]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 0) {
          clearInterval(timer);
          setStreak(0); 
          onAnswer(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [onAnswer]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleOptionClick = (option) => {
    if (!isAnswered) {
      setSelectedOption(option);
      setIsAnswered(true);

      if (option.is_correct) {
        setStreak(prev => {
          const newStreak = prev + 1;
          if (newStreak > highestStreak) {
            setHighestStreak(newStreak);
          }
          return newStreak;
        });

        const colors = ['#FFD700', '#FFA500', '#FF69B4'];
        for (let i = 0; i < 3; i++) {
          setTimeout(() => {
            const sparkle = document.createElement('div');
            sparkle.className = 'absolute w-4 h-4 bg-yellow-400 rounded-full animate-ping';
            sparkle.style.left = `${Math.random() * 100}%`;
            sparkle.style.top = `${Math.random() * 100}%`;
            document.querySelector('.options-container')?.appendChild(sparkle);
            setTimeout(() => sparkle.remove(), 1000);
          }, i * 200);
        }
      } else {
        setStreak(0);
        setIsShaking(true);
        setTimeout(() => setIsShaking(false), 500);
      }
    }
  };

  const handleFiftyFifty = () => {
    if (!fiftyFiftyUsed && !isAnswered) {
      const correctOption = question.options.find(opt => opt.is_correct);
      const wrongOptions = question.options.filter(opt => !opt.is_correct);
      const randomWrongOption = wrongOptions[Math.floor(Math.random() * wrongOptions.length)];
      setRemainingOptions([correctOption, randomWrongOption]);
      setFiftyFiftyUsed(true);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Timer className="w-5 h-5 text-blue-500" />
              <span className={`font-mono text-lg ${timeRemaining < 60 ? 'text-red-500 animate-pulse' : ''}`}>
                {formatTime(timeRemaining)}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Flame className={`w-5 h-5 ${streak > 0 ? 'text-orange-500' : 'text-gray-400'}`} />
              <span className="font-bold">{streak}</span>
              <span className="text-sm text-gray-500">(Best: {highestStreak})</span>
            </div>
          </div>
          <span className="text-gray-600">
            Question {current} of {total}
          </span>
        </div>
        <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
          <div 
            className="h-full bg-blue-500 transition-all duration-300 ease-out"
            style={{ width: `${(current / total) * 100}%` }}
          />
        </div>
      </div>

      {streak > 0 && streak % 3 === 0 && (
        <div className="mb-4 p-2 bg-orange-100 text-orange-800 rounded-lg flex items-center gap-2 animate-bounce">
          <Flame className="w-4 h-4" />
          {streak} answers correct in a row! Keep it up! 🔥
        </div>
      )}

      <h2 className="text-xl font-semibold mb-4">{question.description}</h2>

      <button
        onClick={handleFiftyFifty}
        disabled={fiftyFiftyUsed || isAnswered}
        className={`mb-4 px-4 py-2 rounded-lg transition
          ${fiftyFiftyUsed 
            ? 'bg-gray-300 cursor-not-allowed' 
            : 'bg-purple-500 hover:bg-purple-600 text-white'}`}
      >
        50:50 Lifeline
      </button>

      <div 
        className={`options-container grid grid-cols-1 md:grid-cols-2 gap-4 relative ${
          isShaking ? 'animate-[shake_0.5s_ease-in-out]' : ''
        }`}
      >
        {remainingOptions.map((option, i) => (
          <button
            key={i}
            onClick={() => handleOptionClick(option)}
            disabled={isAnswered}
            className={`
              p-3 rounded-lg text-left transition border focus:outline-none
              ${isAnswered && selectedOption === option 
                ? option.is_correct 
                  ? 'bg-green-300 border-green-500 animate-[success_0.5s_ease-in-out]'
                  : 'bg-red-300 border-red-500 animate-[failure_0.5s_ease-in-out]'
                : 'hover:bg-blue-100 border-gray-300'
              }
            `}
          >
            {option.description}
          </button>
        ))}
      </div>

      {isAnswered && (
        <div className="mt-6 p-4 bg-gray-100 rounded-lg border-l-4 border-blue-500 animate-[fadeIn_0.3s_ease-out]">
          <h3 className="font-semibold text-lg mb-2 text-blue-600">Explanation:</h3>
          <p className="text-gray-700">{question.detailed_solution}</p>
        </div>
      )}

      {isAnswered && (
        <button
          onClick={() => {
            onAnswer(selectedOption.is_correct);
            setSelectedOption(null);
            setIsAnswered(false);
          }}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition animate-bounce"
        >
          {current === total ? 'Finish Quiz' : 'Next Question'}
        </button>
      )}

      {timeRemaining <= 60 && !isAnswered && (
        <div className="mt-4 p-4 bg-red-50 border-l-4 border-red-500 text-red-700">
          Less than a minute remaining!
        </div>
      )}
    </div>
  );
};

export default Questions;