import React, { useState } from 'react';
import { VocabularyWord } from '../types';
import { shuffle } from '../utils/array';

interface ReviewViewProps {
  vocabulary: VocabularyWord[];
  onBack: () => void;
  onPlayAudio: (word: string) => void;
  audioState: string | null;
  onUpdateMastery: (word: string, wasCorrect: boolean) => void;
  onStartPronunciationPractice: (word: VocabularyWord) => void;
}

const BackArrowIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-2"> <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" /> </svg> );
const CheckIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-6 h-6"> <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.052-.143Z" clipRule="evenodd" /> </svg> );
const XMarkIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-6 h-6"> <path d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z" /> </svg> );
const SpeakerIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"> <path strokeLinecap="round" strokeLinejoin="round" d="M19.114 5.636a9 9 0 0 1 0 12.728M16.463 8.288a5.25 5.25 0 0 1 0 7.424M6.75 8.25l4.72-4.72a.75.75 0 0 1 1.28.53v15.88a.75.75 0 0 1-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 0 1 2.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75Z" /> </svg> );
const SpeakerWaveIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-primary"> <path strokeLinecap="round" strokeLinejoin="round" d="M19.114 5.636a9 9 0 0 1 0 12.728M16.463 8.288a5.25 5.25 0 0 1 0 7.424M6.75 8.25l4.72-4.72a.75.75 0 0 1 1.28.53v15.88a.75.75 0 0 1-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 0 1 2.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75Z" /> </svg> );
const MicIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 0 0 6-6v-1.5m-6 7.5a6 6 0 0 1-6-6v-1.5m12 0v-1.5a6 6 0 0 0-6-6v1.5m-6 0V5.25a6 6 0 0 1 6-6v1.5m0 0v1.5m0-1.5a6 6 0 0 0 0 12m0 0v-1.5" /></svg>);


const ReviewView: React.FC<ReviewViewProps> = ({ vocabulary, onBack, onPlayAudio, audioState, onUpdateMastery, onStartPronunciationPractice }) => {
    const [reviewWords] = useState<VocabularyWord[]>(() => shuffle(vocabulary));
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isFlipped, setIsFlipped] = useState(false);

    if (currentIndex >= reviewWords.length) {
        return (
            <div className="bg-surface p-6 sm:p-8 rounded-xl shadow-lg border border-border text-center animate-fade-in-up">
                <h2 className="text-2xl sm:text-3xl font-bold text-primary mb-4">Hoàn thành Ôn tập!</h2>
                <p className="text-secondary mb-6">Bạn đã ôn tập tất cả các từ trong hôm nay. Hãy quay lại vào ngày mai!</p>
                <button onClick={onBack} className="flex items-center justify-center w-full sm:w-auto mx-auto px-6 py-3 font-semibold text-white bg-primary rounded-lg hover:bg-primary-hover transition-colors">
                    Về Bảng điều khiển
                </button>
            </div>
        );
    }

    const currentWord = reviewWords[currentIndex];

    const handleMarkWord = (wasCorrect: boolean) => {
        onUpdateMastery(currentWord.word, wasCorrect);
        // Add a small delay for the user to see the feedback before the card animates away
        setTimeout(() => {
            if (currentIndex < reviewWords.length - 1) {
                setCurrentIndex(prev => prev + 1);
                setIsFlipped(false);
            } else {
                setCurrentIndex(prev => prev + 1); // Go to summary screen
            }
        }, 300);
    };


    return (
        <div className="animate-fade-in-up">
            <div className="flex justify-between items-center mb-6">
                <button onClick={onBack} className="flex items-center px-4 py-2 text-sm font-medium text-secondary bg-surface rounded-lg border border-border hover:bg-surface-muted transition-colors">
                    <BackArrowIcon />
                    Quay lại
                </button>
                <h2 className="text-2xl sm:text-3xl font-bold text-center text-primary">Ôn tập Hàng ngày</h2>
                 <span className="text-sm font-semibold text-secondary bg-surface-muted px-3 py-1 rounded-full">
                    {currentIndex + 1} / {reviewWords.length}
                </span>
            </div>

            {/* Flashcard */}
            <div className="perspective-1000">
                <div 
                    className={`relative w-full h-80 transition-transform duration-700 transform-style-3d ${isFlipped ? 'rotate-y-180' : ''}`}
                    onClick={() => setIsFlipped(f => !f)}
                >
                    {/* Front */}
                    <div className="absolute w-full h-full backface-hidden bg-surface rounded-xl shadow-2xl border border-border flex flex-col justify-center items-center p-6 text-center cursor-pointer">
                        <div className="flex items-center gap-4">
                            <h3 className="text-4xl md:text-5xl font-bold text-primary">{currentWord.word}</h3>
                            <button 
                                onClick={(e) => { e.stopPropagation(); onStartPronunciationPractice(currentWord); }} 
                                className="text-secondary hover:text-primary transition-colors" 
                                aria-label={`Practice pronunciation for ${currentWord.word}`}
                            >
                                <MicIcon />
                            </button>
                            <button 
                                onClick={(e) => { e.stopPropagation(); onPlayAudio(currentWord.word); }} 
                                className="text-secondary hover:text-primary transition-colors" 
                                aria-label={`Play pronunciation for ${currentWord.word}`}
                            >
                                {audioState === currentWord.word ? <SpeakerWaveIcon /> : <SpeakerIcon />}
                            </button>
                        </div>
                        <p className="text-secondary mt-2">{currentWord.phonetic}</p>
                        <p className="absolute bottom-4 text-xs text-secondary/70">Chạm để lật</p>
                    </div>
                    {/* Back */}
                    <div className="absolute w-full h-full backface-hidden bg-surface-muted rounded-xl shadow-2xl border border-border flex flex-col justify-center p-6 rotate-y-180 cursor-pointer">
                         <p className="text-lg text-primary mb-2"><strong>({currentWord.type})</strong> {currentWord.definition}</p>
                         <p className="text-sm text-secondary italic mb-4">"{currentWord.example}"</p>
                         <hr className="border-border my-2" />
                         <p className="text-lg text-primary font-medium mb-2">{currentWord.definition_vi}</p>
                         <p className="text-sm text-secondary italic">"{currentWord.example_vi}"</p>
                    </div>
                </div>
            </div>

            {/* Controls */}
            <div className="mt-8 flex justify-center h-16 items-center">
                {isFlipped && (
                     <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto animate-fade-in-up">
                        <button onClick={() => handleMarkWord(false)} className="flex-1 flex justify-center items-center gap-2 px-8 py-3 text-lg font-bold text-white bg-error hover:bg-error-hover rounded-lg shadow-md transform hover:scale-105 transition-all duration-200">
                           <XMarkIcon /> Cần ôn lại
                        </button>
                        <button onClick={() => handleMarkWord(true)} className="flex-1 flex justify-center items-center gap-2 px-8 py-3 text-lg font-bold text-white bg-success hover:bg-success-hover rounded-lg shadow-md transform hover:scale-105 transition-all duration-200">
                            <CheckIcon /> Đã biết
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ReviewView;