import React, { useState, useMemo, useEffect } from 'react';
import { Test, MCQ, FillBlankQuestion, MatchingPair, VocabularyWord } from '../types';
import { shuffle } from '../utils/array';

interface TestViewProps {
  test: Test;
  vocabulary: VocabularyWord[];
  onFinishTest: (score: number, incorrectWords: VocabularyWord[]) => void;
  onUpdateMastery: (word: string, wasCorrect: boolean) => void;
}

const CheckIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
        <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.052-.143Z" clipRule="evenodd" />
    </svg>
);

const XMarkIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
        <path d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z" />
    </svg>
);


const TestView: React.FC<TestViewProps> = ({ test, vocabulary, onFinishTest, onUpdateMastery }) => {
  const allQuestions = useMemo(() => [
    ...test.mcqs.map(q => ({ ...q, type: 'mcq' as const })),
    ...test.fillInTheBlanks.map(q => ({ ...q, type: 'fill' as const })),
    ...test.matchingPairs.length > 0 ? [{ pairs: test.matchingPairs, type: 'match' as const }] : []
  ], [test]);

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [incorrectWords, setIncorrectWords] = useState<VocabularyWord[]>([]);
  
  // State for current question
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [inputValue, setInputValue] = useState('');
  const [isAnswered, setIsAnswered] = useState(false);
  const [animationClass, setAnimationClass] = useState('animate-fade-in');

  // State for matching question
  const [shuffledDefinitions, setShuffledDefinitions] = useState<MatchingPair[]>([]);
  const [selectedWord, setSelectedWord] = useState<MatchingPair | null>(null);
  const [correctPairs, setCorrectPairs] = useState<string[]>([]);
  const [incorrectMatchAttempts, setIncorrectMatchAttempts] = useState<string[]>([]);


  const currentQuestion = allQuestions[currentQuestionIndex];

  useEffect(() => {
    if (currentQuestion.type === 'match') {
        setShuffledDefinitions(shuffle(currentQuestion.pairs));
    }
  }, [currentQuestion]);

  const findWord = (wordStr: string) => {
    return vocabulary.find(v => v.word.toLowerCase() === wordStr.toLowerCase());
  }

  const addIncorrectWord = (word: VocabularyWord) => {
    setIncorrectWords(prev => {
        if (!prev.find(w => w.word === word.word)) {
            return [...prev, word];
        }
        return prev;
    });
  }

  // FIX: Add handlers for MCQ selection and Fill-in-the-blank input.
  const handleSelectOption = (option: string) => {
    if (!isAnswered) {
      setSelectedOption(option);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!isAnswered) {
      setInputValue(e.target.value);
    }
  };

  const handleSubmit = () => {
    let isCorrect = false;
    let correctWordStr = '';
    
    if (currentQuestion.type === 'mcq') {
        correctWordStr = currentQuestion.correctAnswer;
        isCorrect = selectedOption === correctWordStr;
    } else if (currentQuestion.type === 'fill') {
        correctWordStr = currentQuestion.correctAnswer;
        isCorrect = inputValue.trim().toLowerCase() === correctWordStr.toLowerCase();
    }
    
    onUpdateMastery(correctWordStr, isCorrect);

    if (isCorrect) {
        setScore(s => s + 1);
    } else {
        const word = findWord(correctWordStr);
        if (word) addIncorrectWord(word);
    }
    setIsAnswered(true);
  };
  
  const handleSelectMatchWord = (wordPair: MatchingPair) => {
    if (correctPairs.includes(wordPair.word) || isAnswered) return;
    setSelectedWord(wordPair);
  }

  const handleSelectMatchDefinition = (defPair: MatchingPair) => {
    if (!selectedWord || isAnswered) return;
    const wasCorrect = selectedWord.word === defPair.word;
    onUpdateMastery(selectedWord.word, wasCorrect);

    if (wasCorrect) {
        setCorrectPairs(prev => [...prev, selectedWord.word]);
        setScore(s => s + 1);
    } else {
        // Incorrect match attempt, mark the word for review
        if (!incorrectMatchAttempts.includes(selectedWord.word)) {
            const word = findWord(selectedWord.word);
            if (word) addIncorrectWord(word);
            setIncorrectMatchAttempts(prev => [...prev, selectedWord.word]);
        }
    }
    setSelectedWord(null);
  }

  useEffect(() => {
    if (currentQuestion.type === 'match' && correctPairs.length === currentQuestion.pairs.length) {
        setIsAnswered(true);
    }
  }, [correctPairs, currentQuestion]);


  const handleNext = () => {
    setAnimationClass('animate-fade-out');
    setTimeout(() => {
        if (currentQuestionIndex < allQuestions.length - 1) {
            setCurrentQuestionIndex(prev => prev + 1);
            // Reset states
            setSelectedOption(null);
            setInputValue('');
            setIsAnswered(false);
            setSelectedWord(null);
            setCorrectPairs([]);
            setIncorrectMatchAttempts([]);
            setAnimationClass('animate-fade-in');
        } else {
            onFinishTest(score, incorrectWords);
        }
    }, 300);
  };
  
  const getButtonClass = (option: string) => {
    if (!isAnswered) {
        return selectedOption === option ? 'bg-blue-500 text-white ring-2 ring-blue-500' : 'bg-white dark:bg-slate-700 hover:bg-slate-100 dark:hover:bg-slate-600';
    }
    if (option === (currentQuestion as MCQ).correctAnswer) {
        return 'bg-green-100 dark:bg-green-900/30 border-green-500 text-green-800 dark:text-green-200';
    }
    if (option === selectedOption && option !== (currentQuestion as MCQ).correctAnswer) {
        return 'bg-red-100 dark:bg-red-900/30 border-red-500 text-red-800 dark:text-red-300';
    }
    return 'bg-white dark:bg-slate-700 opacity-60';
  };

  const getInputClass = () => {
    if (!isAnswered) {
        return "border-slate-300 dark:border-slate-600 focus:ring-blue-500 focus:border-blue-500";
    }
    const correctAnswer = (currentQuestion as FillBlankQuestion).correctAnswer;
    if (inputValue.trim().toLowerCase() === correctAnswer.toLowerCase()) {
        return "bg-green-100 dark:bg-green-900/30 border-green-500 text-green-800 dark:text-green-200";
    }
    return "bg-red-100 dark:bg-red-900/30 border-red-500 text-red-800 dark:text-red-300";
  }

  const renderFooter = () => {
      let message = '';
      let isCorrect = false;
      let correctAnswerText = '';

      if (isAnswered) {
        if(currentQuestion.type === 'mcq') {
            isCorrect = selectedOption === currentQuestion.correctAnswer;
            correctAnswerText = `Đáp án đúng: ${currentQuestion.correctAnswer}`;
        } else if (currentQuestion.type === 'fill') {
            isCorrect = inputValue.trim().toLowerCase() === currentQuestion.correctAnswer.toLowerCase();
            correctAnswerText = `Đáp án đúng: ${currentQuestion.correctAnswer}`;
        } else if (currentQuestion.type === 'match') {
            isCorrect = true; // Match questions are always "correct" when done
        }
        message = isCorrect ? 'Chính xác!' : 'Không đúng.';
      }

      return (
          <div className={`transition-all duration-300 ${isAnswered ? 'h-32 opacity-100' : 'h-0 opacity-0'}`}>
              {isAnswered && (
                  <div className={`p-4 rounded-b-xl -m-8 mt-6 flex items-center justify-between ${isCorrect ? 'bg-green-100 dark:bg-green-900/30' : 'bg-red-100 dark:bg-red-900/30'}`}>
                    <div>
                        <h4 className={`font-bold text-lg flex items-center gap-2 ${isCorrect ? 'text-green-700 dark:text-green-300' : 'text-red-700 dark:text-red-300'}`}>
                            {isCorrect ? <CheckIcon /> : <XMarkIcon />}
                            {message}
                        </h4>
                        {!isCorrect && <p className="text-slate-600 dark:text-slate-300 mt-1">{correctAnswerText}</p>}
                    </div>
                     <button onClick={handleNext} className={`px-8 py-3 text-white font-bold rounded-lg ${isCorrect ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'}`}>
                        {currentQuestionIndex < allQuestions.length - 1 ? 'Tiếp theo' : 'Hoàn thành'}
                    </button>
                  </div>
              )}
          </div>
      );
  }

  return (
    <div className="bg-white dark:bg-slate-800 p-8 rounded-xl shadow-lg animate-fade-in">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">Kiểm tra kiến thức</h2>
        <span className="text-sm font-semibold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-700 px-3 py-1 rounded-full">
          {currentQuestionIndex + 1} / {allQuestions.length}
        </span>
      </div>

      <div className={`my-6 min-h-[200px] ${animationClass}`}>
        {currentQuestion.type === 'mcq' && (
          <div>
            <p className="text-lg text-slate-700 dark:text-slate-300 mb-4">{currentQuestion.question}</p>
            <div className="space-y-3">
              {currentQuestion.options.map(option => (
                <button
                  key={option}
                  onClick={() => handleSelectOption(option)}
                  disabled={isAnswered}
                  className={`w-full text-left p-4 rounded-lg border border-slate-300 dark:border-slate-600 transition-colors duration-200 ${getButtonClass(option)}`}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        )}
        {currentQuestion.type === 'fill' && (
          <div>
            <p className="text-lg text-slate-700 dark:text-slate-300 mb-4" dangerouslySetInnerHTML={{ __html: currentQuestion.sentence.replace('___', '<span class="font-bold">___</span>') }} />
            <input
              type="text"
              value={inputValue}
              onChange={handleInputChange}
              disabled={isAnswered}
              className={`w-full p-3 rounded-lg border text-lg ${getInputClass()}`}
              placeholder="Nhập câu trả lời của bạn"
            />
          </div>
        )}
        {currentQuestion.type === 'match' && (
            <div>
                 <p className="text-lg text-slate-700 dark:text-slate-300 mb-4">Nối từ với định nghĩa đúng của nó.</p>
                 <div className="grid grid-cols-2 gap-4">
                    {/* Words Column */}
                    <div className="space-y-3">
                        {currentQuestion.pairs.map(pair => {
                            const isSelected = selectedWord?.word === pair.word;
                            const isCorrect = correctPairs.includes(pair.word);
                            return (
                                <button
                                key={pair.word}
                                onClick={() => handleSelectMatchWord(pair)}
                                disabled={isCorrect || isAnswered}
                                className={`w-full p-3 text-center rounded-lg border transition-colors ${
                                    isCorrect ? 'bg-green-100 dark:bg-green-900/30 border-green-500 !text-slate-500' :
                                    isSelected ? 'bg-blue-200 dark:bg-blue-900/50 border-blue-500 ring-2 ring-blue-500' :
                                    'bg-white dark:bg-slate-700 hover:bg-slate-100 dark:hover:bg-slate-600 border-slate-300 dark:border-slate-600'
                                }`}
                                >{pair.word}</button>
                            );
                        })}
                    </div>
                    {/* Definitions Column */}
                    <div className="space-y-3">
                        {shuffledDefinitions.map(pair => {
                             const isCorrect = correctPairs.includes(pair.word);
                            return (
                                <button
                                key={pair.word}
                                onClick={() => handleSelectMatchDefinition(pair)}
                                disabled={isCorrect || !selectedWord || isAnswered}
                                className={`w-full p-3 text-left text-sm rounded-lg border transition-colors ${
                                     isCorrect ? 'bg-green-100 dark:bg-green-900/30 border-green-500 !text-slate-500' :
                                     'bg-white dark:bg-slate-700 hover:bg-slate-100 dark:hover:bg-slate-600 border-slate-300 dark:border-slate-600 disabled:opacity-50'
                                }`}
                                >{pair.definition}</button>
                            );
                        })}
                    </div>
                 </div>
            </div>
        )}
      </div>

      <div className="mt-6 flex justify-end">
        {currentQuestion.type !== 'match' && !isAnswered && (
          <button onClick={handleSubmit} className="px-8 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 disabled:bg-slate-400 disabled:cursor-not-allowed transition-colors" disabled={currentQuestion.type === 'mcq' ? !selectedOption : !inputValue}>
            Kiểm tra
          </button>
        )}
      </div>
       {renderFooter()}
    </div>
  );
};

export default TestView;