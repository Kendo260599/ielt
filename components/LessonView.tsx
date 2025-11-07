import React, { useState, useEffect } from 'react';
import { VocabularyWord, WordExplanation } from '../types';
import { fetchWordExplanation } from '../services/geminiService';
import ExplanationModal from './ExplanationModal';

interface LessonViewProps {
  vocabulary: VocabularyWord[];
  onStartTest: () => void;
  onBack: () => void;
  onPlayAudio: (word: string) => void;
  audioState: string | null;
  onAskTutor: (word: VocabularyWord) => void;
  onStartPronunciationPractice: (word: VocabularyWord) => void;
}

const BackArrowIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-2"> <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" /> </svg> );
const PrevArrowIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-7 h-7"> <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" /> </svg> );
const NextArrowIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-7 h-7"> <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" /> </svg> );
const SpeakerWaveIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-primary"> <path strokeLinecap="round" strokeLinejoin="round" d="M19.114 5.636a9 9 0 0 1 0 12.728M16.463 8.288a5.25 5.25 0 0 1 0 7.424M6.75 8.25l4.72-4.72a.75.75 0 0 1 1.28.53v15.88a.75.75 0 0 1-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 0 1 2.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75Z" /> </svg> );
const SparklesIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-2"><path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456Z" /></svg>);
const ChatBubbleIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-2"><path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 0 1-2.555-.337A5.972 5.972 0 0 1 5.41 20.97a5.969 5.969 0 0 1-.474-.065 4.48 4.48 0 0 0 .978-2.025c.09-.455.09-.934.09-1.425v-2.287a6.75 6.75 0 0 1 6.75-6.75h.75c4.97 0 9 3.694 9 8.25Z" /></svg>);
const MicIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 0 0 6-6v-1.5m-6 7.5a6 6 0 0 1-6-6v-1.5m12 0v-1.5a6 6 0 0 0-6-6v1.5m-6 0V5.25a6 6 0 0 1 6-6v1.5m0 0v1.5m0-1.5a6 6 0 0 0 0 12m0 0v-1.5" /></svg>);
const ImageIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-16 h-16 text-secondary/40"><path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" /></svg>);

const LessonView: React.FC<LessonViewProps> = ({ vocabulary, onStartTest, onBack, onPlayAudio, audioState, onAskTutor, onStartPronunciationPractice }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [animationClass, setAnimationClass] = useState('animate-fade-in-up');

  const [selectedWord, setSelectedWord] = useState<VocabularyWord | null>(null);
  const [explanation, setExplanation] = useState<WordExplanation | null>(null);
  const [isModalLoading, setIsModalLoading] = useState(false);
  const [modalError, setModalError] = useState<string | null>(null);

  const currentWord = vocabulary[currentIndex];

  const handleNavigate = (direction: 'next' | 'prev') => {
    const nextIndex = direction === 'next' ? currentIndex + 1 : currentIndex - 1;
    if (nextIndex < 0 || nextIndex >= vocabulary.length) return;

    setAnimationClass('animate-fade-out');
    setTimeout(() => {
        setIsFlipped(false);
        setCurrentIndex(nextIndex);
        setAnimationClass('animate-fade-in');
    }, 250);
  };

  const handleExplainWord = async (word: VocabularyWord) => {
    setSelectedWord(word);
    setIsModalLoading(true);
    setModalError(null);
    setExplanation(null);
    try {
        const result = await fetchWordExplanation(word);
        setExplanation(result);
    } catch (err) {
        setModalError(err instanceof Error ? err.message : "Lỗi không xác định");
    } finally {
        setIsModalLoading(false);
    }
  };
  
  const closeModal = () => {
    setSelectedWord(null);
    setExplanation(null);
    setModalError(null);
  }

  if (!currentWord) {
      return (
          <div className="text-center">
              <p className="text-secondary mb-4">Không có từ vựng nào trong chủ đề này.</p>
              <button onClick={onBack} className="flex items-center mx-auto px-4 py-2 text-sm font-medium text-secondary bg-surface rounded-lg border border-border hover:bg-surface-muted transition-colors">
                  <BackArrowIcon />
                  Đổi chủ đề
              </button>
          </div>
      );
  }

  return (
    <div className="flex flex-col h-full animate-fade-in-up">
      <div className="flex-shrink-0 flex justify-between items-center mb-4">
        <button 
          onClick={onBack}
          className="flex items-center px-4 py-2 text-sm font-medium text-secondary bg-surface rounded-lg border border-border hover:bg-surface-muted transition-colors"
        >
          <BackArrowIcon />
          Đổi chủ đề
        </button>
      </div>

      <div className="flex-grow flex items-center justify-center py-4">
        <div className="w-full flex items-center justify-center gap-2 sm:gap-4">
            <button onClick={() => handleNavigate('prev')} disabled={currentIndex === 0} className="p-2 rounded-full text-secondary hover:bg-surface-muted disabled:opacity-30 disabled:cursor-not-allowed transition-colors"><PrevArrowIcon /></button>
            
            <div className={`w-full max-w-md ${animationClass}`}>
                <div className="perspective-1000">
                    <div 
                        className={`relative w-full h-96 transition-transform duration-700 transform-style-3d ${isFlipped ? 'rotate-y-180' : ''}`}
                        onClick={() => setIsFlipped(f => !f)}
                    >
                        {/* Front Side */}
                        <div className="absolute w-full h-full backface-hidden bg-surface rounded-2xl shadow-xl border border-border flex flex-col justify-between p-6 cursor-pointer overflow-hidden">
                            <div className="flex-shrink-0 h-32 flex items-center justify-center bg-surface-muted rounded-lg my-4">
                                {currentWord.imageUrl ? 
                                    <img src={currentWord.imageUrl} alt={currentWord.word} className="w-full h-full object-cover rounded-lg"/> : 
                                    <ImageIcon />}
                            </div>
                            <div className="text-center">
                                <h3 className="text-4xl font-bold text-primary">{currentWord.word}</h3>
                                <p className="text-secondary mt-2">{currentWord.phonetic}</p>
                            </div>
                            <div className="flex justify-center items-center gap-4 mt-4">
                               <button 
                                    onClick={(e) => { e.stopPropagation(); onPlayAudio(currentWord.word); }} 
                                    className="p-3 rounded-full text-secondary bg-surface-muted hover:bg-border transition-colors" 
                                    aria-label={`Play pronunciation for ${currentWord.word}`}
                                >
                                    <SpeakerWaveIcon />
                                </button>
                            </div>
                            <p className="absolute bottom-4 left-0 right-0 text-center text-xs text-secondary/70">Chạm để xem nghĩa</p>
                        </div>
                        {/* Back Side */}
                        <div className="absolute w-full h-full backface-hidden bg-surface-muted rounded-2xl shadow-xl border border-border flex flex-col justify-center p-6 rotate-y-180 cursor-pointer">
                            <div className="text-center">
                                <p className="text-xl text-primary font-semibold mb-2">{currentWord.definition_vi}</p>
                                <p className="text-secondary italic mb-4">"{currentWord.example_vi}"</p>
                                <hr className="border-border my-4" />
                                <p className="text-lg text-primary mb-2"><strong>({currentWord.type})</strong> {currentWord.definition}</p>
                                <p className="text-sm text-secondary italic">"{currentWord.example}"</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <button onClick={() => handleNavigate('next')} disabled={currentIndex === vocabulary.length - 1} className="p-2 rounded-full text-secondary hover:bg-surface-muted disabled:opacity-30 disabled:cursor-not-allowed transition-colors"><NextArrowIcon /></button>
        </div>
      </div>

      <div className="flex-shrink-0 space-y-5 pb-4">
        <p className="text-center font-semibold text-secondary">{currentIndex + 1} / {vocabulary.length}</p>
        
        <div className="flex flex-col sm:flex-row justify-center items-center gap-3">
             <button onClick={() => onStartPronunciationPractice(currentWord)} className="flex items-center justify-center w-full sm:w-auto px-4 py-2 text-sm font-medium text-secondary bg-surface rounded-lg border border-border hover:bg-surface-muted transition-colors"><MicIcon /> Luyện phát âm</button>
             <button onClick={() => onAskTutor(currentWord)} className="flex items-center justify-center w-full sm:w-auto px-4 py-2 text-sm font-medium text-secondary bg-surface rounded-lg border border-border hover:bg-surface-muted transition-colors"><ChatBubbleIcon /> Hỏi Gia sư AI</button>
             <button onClick={() => handleExplainWord(currentWord)} className="flex items-center justify-center w-full sm:w-auto px-4 py-2 text-sm font-medium text-secondary bg-surface rounded-lg border border-border hover:bg-surface-muted transition-colors"><SparklesIcon /> Giải thích chi tiết</button>
        </div>
        
        <div className="text-center pt-2">
            <button
            onClick={onStartTest}
            className="w-full sm:w-auto px-12 py-3 text-lg btn-success shadow-lg transform hover:scale-105 transition-transform duration-200"
            >
            Bắt đầu Test
            </button>
        </div>
      </div>

      {selectedWord && (
        <ExplanationModal 
            word={selectedWord}
            explanation={explanation}
            isLoading={isModalLoading}
            error={modalError}
            onClose={closeModal}
        />
      )}
    </div>
  );
};

export default LessonView;
