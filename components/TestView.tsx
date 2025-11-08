import React, { useState, useMemo, useEffect } from 'react';
import { Test, MCQ, FillBlankQuestion, MatchingPair, VocabularyWord } from '../types';
import { shuffle } from '../utils/array';

interface TestViewProps {
  test: Test;
  vocabulary: VocabularyWord[];
  onFinishTest: (score: number, incorrectWords: VocabularyWord[]) => void;
  onUpdateMastery: (word: string, wasCorrect: boolean) => void;
}

interface IconProps {
  className?: string;
}

const CheckIcon = ({ className }: IconProps) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={`w-8 h-8 ${className}`}>
        <path fillRule="evenodd" d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm3.857-9.809a.75.75 0 0 0-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 1 0-1.06 1.061l2.5 2.5a.75.75 0 0 0 1.137-.089l4-5.5Z" clipRule="evenodd" />
    </svg>
);

const XMarkIcon = ({ className }: IconProps) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={`w-8 h-8 ${className}`}>
        <path fillRule="evenodd" d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16ZM8.28 7.22a.75.75 0 0 0-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 1 0 1.06 1.06L10 11.06l1.72 1.72a.75.75 0 1 0 1.06-1.06L11.06 10l1.72-1.72a.75.75 0 0 0-1.06-1.06L10 8.94 8.28 7.22Z" clipRule="evenodd" />
    </svg>
);


const TestView: React.FC<TestViewProps> = ({ test, vocabulary, onFinishTest, onUpdateMastery }) => {
  const allQuestions = useMemo(() => [
    ...test.mcqs.map(q => ({ ...q, type: 'mcq' as const })),
    ...test.fillInTheBlanks.map(q => ({ ...q, type: 'fill' as const })),
    ...test.matchingPairs.length > 0 ? [{ pairs: shuffle(test.matchingPairs), type: 'match' as const }] : []
  ], [test]);

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [incorrectWords, setIncorrectWords] = useState<VocabularyWord[]>([]);
  
  // State for current question
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [inputValue, setInputValue] = useState('');
  const [isAnswered, setIsAnswered] = useState(false);
  const [animationClass, setAnimationClass] = useState('animate-fade-in-up');

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
            setSelectedOption(null);
            setInputValue('');
            setIsAnswered(false);
            setSelectedWord(null);
            setCorrectPairs([]);
            setIncorrectMatchAttempts([]);
            setAnimationClass('animate-fade-in-up');
        } else {
            onFinishTest(score, incorrectWords);
        }
    }, 300);
  };
  
  const getButtonClass = (option: string) => {
    const baseClass = 'w-full text-left p-4 rounded-xl border-2 font-semibold transition-all duration-200';
    if (!isAnswered) {
        return `${baseClass} ${selectedOption === option ? 'bg-primary-light border-primary' : 'bg-surface hover:bg-surface-muted border-border hover:border-border-hover'}`;
    }
    if (option === (currentQuestion as MCQ).correctAnswer) {
        return `${baseClass} bg-success-light border-success text-success-text`;
    }
    if (option === selectedOption && option !== (currentQuestion as MCQ).correctAnswer) {
        return `${baseClass} bg-error-light border-error text-error-text opacity-50`;
    }
    return `${baseClass} bg-surface border-border opacity-50`;
  };

  const getInputClass = () => {
    if (!isAnswered) {
        return "border-border bg-surface-muted focus:ring-primary focus:border-primary";
    }
    const correctAnswer = (currentQuestion as FillBlankQuestion).correctAnswer;
    if (inputValue.trim().toLowerCase() === correctAnswer.toLowerCase()) {
        return "bg-success-light border-success text-success-text";
    }
    return "bg-error-light border-error text-error-text";
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
            isCorrect = true; // For matching, footer appears when all are correct.
        }
        message = isCorrect ? 'Tuyệt vời!' : 'Không sao, tiếp tục nào!';
      }

      return (
          <div className={`fixed bottom-0 left-0 right-0 transition-transform duration-500 ease-in-out ${isAnswered ? 'translate-y-0' : 'translate-y-full'}`}>
              <div className={`p-4 sm:p-6 ${isCorrect ? 'bg-success-light' : 'bg-error-light'}`}>
                  <div className="max-w-4xl mx-auto flex items-center justify-between">
                     <div className="flex items-center gap-4">
                        {isCorrect ? <CheckIcon className="text-success" /> : <XMarkIcon className="text-error" />}
                        <div>
                            <h4 className={`font-bold text-xl ${isCorrect ? 'text-success-text' : 'text-error-text'}`}>
                                {message}
                            </h4>
                            {!isCorrect && <p className="text-secondary mt-1">{correctAnswerText}</p>}
                        </div>
                    </div>
                    <button onClick={handleNext} className={`px-8 py-3 font-bold rounded-lg text-white ${isCorrect ? 'bg-success hover:bg-success-hover' : 'bg-error hover:bg-error-hover'}`}>
                        {currentQuestionIndex < allQuestions.length - 1 ? 'Tiếp theo' : 'Hoàn thành'}
                    </button>
                 </div>
              </div>
          </div>
      );
  }

  return (
    <div className={`relative ${animationClass} pb-40`}>
        <div className="p-2 sm:p-0">
            <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-primary">Kiểm tra kiến thức</h2>
            <span className="text-sm font-semibold text-secondary">
                {currentQuestionIndex + 1} / {allQuestions.length}
            </span>
            </div>
            <div className="w-full bg-surface-muted rounded-full h-4 border border-border p-0.5 mb-8">
                <div className="bg-success h-full rounded-full" style={{ width: `${((currentQuestionIndex + 1) / allQuestions.length) * 100}%`, transition: 'width 0.5s ease-in-out' }}></div>
            </div>

            <div className="my-6 min-h-[250px]">
            {currentQuestion.type === 'mcq' && (
                <div>
                <p className="text-xl text-primary mb-6">{currentQuestion.question}</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {currentQuestion.options.map(option => (
                    <button key={option} onClick={() => handleSelectOption(option)} disabled={isAnswered}
                        className={getButtonClass(option)}>
                        {option}
                    </button>
                    ))}
                </div>
                </div>
            )}
            {currentQuestion.type === 'fill' && (
                <div>
                <p className="text-xl text-primary mb-6" dangerouslySetInnerHTML={{ __html: currentQuestion.sentence.replace('___', '<span class="font-bold text-primary-text">___</span>') }} />
                <input type="text" value={inputValue} onChange={handleInputChange} disabled={isAnswered}
                    className={`w-full p-4 rounded-lg border-2 text-xl ${getInputClass()}`} placeholder="Nhập câu trả lời của bạn"/>
                </div>
            )}
            {currentQuestion.type === 'match' && (
                <div>
                    <p className="text-xl text-primary mb-6">Nối từ với định nghĩa đúng của nó.</p>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-3">
                            {currentQuestion.pairs.map(pair => {
                                const isSelected = selectedWord?.word === pair.word;
                                const isCorrect = correctPairs.includes(pair.word);
                                return (
                                    <button key={pair.word} onClick={() => handleSelectMatchWord(pair)} disabled={isCorrect || isAnswered}
                                    className={`w-full p-3 text-center rounded-xl border-2 font-semibold transition-colors ${
                                        isCorrect ? 'bg-success-light border-success !text-secondary cursor-default' :
                                        isSelected ? 'bg-primary-light border-primary ring-2 ring-primary' :
                                        'bg-surface hover:bg-surface-muted border-border'
                                    }`}>
                                        {pair.word}
                                    </button>
                                );
                            })}
                        </div>
                        <div className="space-y-3">
                            {shuffledDefinitions.map(pair => {
                                    const isCorrect = correctPairs.includes(pair.word);
                                return (
                                    <button key={pair.word} onClick={() => handleSelectMatchDefinition(pair)} disabled={isCorrect || !selectedWord || isAnswered}
                                    className={`w-full p-3 text-left text-sm rounded-xl border-2 transition-colors h-[50px] overflow-hidden ${
                                        isCorrect ? 'bg-success-light border-success !text-secondary cursor-default' :
                                        'bg-surface hover:bg-surface-muted border-border disabled:opacity-50'
                                    }`}>
                                        {pair.definition}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>
            )}
            </div>

            <div className="mt-6 flex justify-end">
            {currentQuestion.type !== 'match' && !isAnswered && (
                <button onClick={handleSubmit} className="px-12 py-3 btn-primary text-lg" disabled={currentQuestion.type === 'mcq' ? !selectedOption : !inputValue}>
                Kiểm tra
                </button>
            )}
            </div>
      </div>
      {renderFooter()}
    </div>
  );
};

export default TestView;