import React, { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import { Test, MCQ, FillBlankQuestion } from '../types';

interface PlacementTestViewProps {
  test: Test;
  onFinishTest: (answers: (string | null)[]) => void;
}

const TIME_PER_QUESTION = 25; // 25 seconds

const PlacementTestView: React.FC<PlacementTestViewProps> = ({ test, onFinishTest }) => {
  const allQuestions = useMemo(() => [
    ...test.mcqs.map(q => ({ ...q, type: 'mcq' as const })),
    ...test.fillInTheBlanks.map(q => ({ ...q, type: 'fill' as const }))
  ], [test]);

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<(string | null)[]>(new Array(allQuestions.length).fill(null));
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [inputValue, setInputValue] = useState('');
  const [timeLeft, setTimeLeft] = useState(TIME_PER_QUESTION);
  const [animationClass, setAnimationClass] = useState('animate-fade-in');
  const timerRef = useRef<number | null>(null);

  const currentQuestion = allQuestions[currentQuestionIndex];
  const isMcq = currentQuestion.type === 'mcq';

  const handleNext = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    
    setAnimationClass('animate-fade-out');

    setTimeout(() => {
        const answer = isMcq ? selectedOption : inputValue.trim() || null;
        const newAnswers = [...userAnswers];
        newAnswers[currentQuestionIndex] = answer;
        setUserAnswers(newAnswers);

        if (currentQuestionIndex < allQuestions.length - 1) {
            setCurrentQuestionIndex(prev => prev + 1);
            setSelectedOption(null);
            setInputValue('');
            setTimeLeft(TIME_PER_QUESTION);
            setAnimationClass('animate-fade-in');
        } else {
            onFinishTest(newAnswers);
        }
    }, 300); // Duration of fade-out animation
  }, [isMcq, selectedOption, inputValue, userAnswers, currentQuestionIndex, allQuestions.length, onFinishTest]);
  
  useEffect(() => {
    timerRef.current = window.setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);
    return () => {
      if(timerRef.current) clearInterval(timerRef.current);
    };
  }, [currentQuestionIndex]);
  
  useEffect(() => {
      if (timeLeft <= 0) {
        handleNext();
      }
  }, [timeLeft, handleNext]);

  return (
    <div className="bg-white dark:bg-gray-800 p-6 sm:p-8 rounded-xl shadow-lg animate-fade-in">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">Kiểm tra trình độ</h2>
        <div className="flex items-center gap-3">
             <div className="relative h-10 w-10">
                 <svg className="w-full h-full" viewBox="0 0 36 36">
                    <path
                        className="text-gray-200 dark:text-gray-700"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none" stroke="currentColor" strokeWidth="4" />
                    <path
                        className="text-indigo-600 dark:text-indigo-500"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none" stroke="currentColor" strokeWidth="4" strokeDasharray={`${(timeLeft / TIME_PER_QUESTION) * 100}, 100`}
                        strokeLinecap="round" style={{ transition: 'stroke-dasharray 0.3s linear' }} />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-lg font-bold">{timeLeft}</span>
                </div>
            </div>
            <span className="text-sm font-semibold text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full">
                {currentQuestionIndex + 1} / {allQuestions.length}
            </span>
        </div>
      </div>

      <div className={`my-6 min-h-[120px] ${animationClass}`}>
        {isMcq ? (
          <div>
            <p className="text-lg text-gray-700 dark:text-gray-300 mb-4">{(currentQuestion as MCQ).question}</p>
            <div className="space-y-3">
              {(currentQuestion as MCQ).options.map(option => (
                <button
                  key={option}
                  onClick={() => setSelectedOption(option)}
                  className={`w-full text-left p-4 rounded-lg border transition-colors duration-200 ${selectedOption === option ? 'bg-indigo-500 text-white ring-2 ring-indigo-500 border-indigo-500' : 'bg-white dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 border-gray-300 dark:border-gray-600'}`}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div>
            <p className="text-lg text-gray-700 dark:text-gray-300 mb-4" dangerouslySetInnerHTML={{ __html: (currentQuestion as FillBlankQuestion).sentence.replace('___', '<span class="font-bold">___</span>') }} />
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="w-full p-3 rounded-lg border text-lg border-gray-300 dark:border-gray-600 focus:ring-indigo-500 focus:border-indigo-500 bg-gray-50 dark:bg-gray-700"
              placeholder="Nhập câu trả lời của bạn"
            />
          </div>
        )}
      </div>

      <div className="mt-6 flex justify-end">
          <button onClick={handleNext} className="px-8 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors">
            {currentQuestionIndex < allQuestions.length - 1 ? 'Tiếp theo' : 'Hoàn thành'}
          </button>
      </div>
    </div>
  );
};

export default PlacementTestView;