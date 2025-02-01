import React, { useState, useEffect } from 'react';
import Start from './components/Start';
import Questions from './components/Questions';
import Result from './components/Result';

const App = () => {
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [highestStreak, setHighestStreak] = useState(0);
  const [gameState, setGameState] = useState('start');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const response = await fetch(
          'https://api.allorigins.win/raw?url=https://api.jsonserve.com/Uw5CrX', 
          {
            headers: { 'Accept': 'application/json' }
          }
        );
    
        if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);
    
        const data = await response.json();
        setQuestions(data.questions || []);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      } finally {
        setLoading(false);
      }
    };
    fetchQuiz();
  }, []);

  const startQuiz = () => {
    setCurrentIndex(0);
    setScore(0);
    setGameState('quiz');
  };

  const handleAnswer = (isCorrect) => {
    if (isCorrect) setScore(score + 1);
    if (currentIndex < questions.length - 1) setCurrentIndex(currentIndex + 1);
    else setGameState('result');
  };

  const restartQuiz = () => {
    setGameState('start');
    setCurrentIndex(0);
    setScore(0);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="max-w-2xl mx-auto p-4 min-h-screen">
      {gameState === 'start' && (
        <Start total={questions.length} onStart={startQuiz} />
      )}
      {gameState === 'quiz' && (
        <Questions
          question={questions[currentIndex]}
          onAnswer={handleAnswer}
          current={currentIndex + 1}
          total={questions.length}
        />
      )}
      {gameState === 'result' && (
        <Result score={score} total={questions.length} onRestart={restartQuiz} />
      )}
    </div>
  );
};

export default App;