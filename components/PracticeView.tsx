import React, { useState } from 'react';
import { VocabularyWord } from '../types';
import { shuffle } from '../utils/array';

interface PracticeViewProps {
  vocabulary: VocabularyWord[];
  onBack: () => void;
  onPlayAudio: (word: string) => void;
  audioState: string | null;
  onStartPronunciationPractice: (word: VocabularyWord) => void;
}

const BackArrowIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-2"> <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" /> </svg> );
const CheckIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-8 h-8"> <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.052-.143Z" clipRule="evenodd" /> </svg> );
const XMarkIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-8 h-8"> <path d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z" /> </svg> );
const ReplayIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-2"> <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 11.667 0l3.181-3.183m-4.991-2.69a8.25 8.25 0 0 0-11.667 0l-3.181 3.183" /> </svg>);
const SpeakerIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"> <path strokeLinecap="round" strokeLinejoin="round" d="M19.114 5.636a9 9 0 0 1 0 12.728M16.463 8.288a5.25 5.25 0 0 1 0 7.424M6.75 8.25l4.72-4.72a.75.75 0 0 1 1.28.53v15.88a.75.75 0 0 1-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 0 1 2.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75Z" /> </svg> );
const SpeakerWaveIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-primary"> <path strokeLinecap="round" strokeLinejoin="round" d="M19.114 5.636a9 9 0 0 1 0 12.728M16.463 8.288a5.25 5.25 0 0 1 0 7.424M6.75 8.25l4.72-4.72a.75.75 0 0 1 1.28.53v15.88a.75.75 0 0 1-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 0 1 2.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75Z" /> </svg> );
const ImageIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12 text-secondary"><path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" /></svg>);
const MicIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 0 0 6-6v-1.5m-6 7.5a6 6 0 0 1-6-6v-1.5m12 0v-1.5a6 6 0 0 0-6-6v1.5m-6 0V5.25a6 6 0 0 1 6-6v1.5m0 0v1.5m0-1.5a6 6 0 0 0 0 12m0 0v-1.5" /></svg>);


type PracticeState = 'PRACTICING' | 'SUMMARY';

const PracticeView: React.FC<PracticeViewProps> = ({ vocabulary, onBack, onPlayAudio, audioState, onStartPronunciationPractice }) => {
    const [practiceWords, setPracticeWords] = useState<VocabularyWord[]>(() => shuffle(vocabulary));
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isFlipped, setIsFlipped] = useState(false);
    const [knownWords, setKnownWords] = useState<VocabularyWord[]>([]);
    const [reviewWords, setReviewWords] = useState<VocabularyWord[]>([]);
    const [practiceState, setPracticeState] = useState<PracticeState>('PRACTICING');
    const [animationClass, setAnimationClass] = useState('animate-fade-in-up');

    const currentWord = practiceWords[currentIndex];

    const handleMarkWord = (status: 'known' | 'review') => {
        if (status === 'known') {
            setKnownWords(prev => [...prev, currentWord]);
        } else {
            setReviewWords(prev => [...prev, currentWord]);
        }

        setAnimationClass('animate-fade-out');
        setTimeout(() => {
            if (currentIndex < practiceWords.length - 1) {
                setCurrentIndex(prev => prev + 1);
                setIsFlipped(false);
                setAnimationClass('animate-fade-in-up');
            } else {
                setPracticeState('SUMMARY');
                 setAnimationClass('animate-fade-in-up');
            }
        }, 300);
    };

    const handleRestartPractice = (onlyReview: boolean) => {
        const wordsToPractice = onlyReview ? reviewWords : vocabulary;
        setPracticeWords(shuffle(wordsToPractice));
        setCurrentIndex(0);
        setIsFlipped(false);
        setKnownWords([]);
        setReviewWords([]);
        setPracticeState('PRACTICING');
    };

    if (practiceState === 'SUMMARY') {
        return (
            <div className="bg-surface p-6 sm:p-8 rounded-2xl shadow-lg border border-border text-center animate-scale-in">
                <h2 className="text-2xl sm:text-3xl font-bold text-primary mb-4">Hoàn thành Lượt Luyện tập!</h2>
                <div className="flex justify-around items-center my-8">
                    <div className="text-center">
                        <p className="text-4xl font-bold text-success-text">{knownWords.length}</p>
                        <p className="text-lg text-secondary">Đã biết</p>
                    </div>
                    <div className="text-center">
                        <p className="text-4xl font-bold text-error-text">{reviewWords.length}</p>
                        <p className="text-lg text-secondary">Cần ôn lại</p>
                    </div>
                </div>
                <div className="flex flex-col sm:flex-row justify-center gap-4 mt-8">
                    {reviewWords.length > 0 && (
                        <button onClick={() => handleRestartPractice(true)} className="flex items-center justify-center px-6 py-3 font-semibold text-white bg-primary hover:bg-primary-hover rounded-xl transition-colors">
                            <ReplayIcon /> Ôn lại {reviewWords.length} từ
                        </button>
                    )}
                    <button onClick={() => handleRestartPractice(false)} className="px-6 py-3 font-semibold text-secondary bg-surface-muted rounded-xl hover:bg-border transition-colors border border-border">
                        Luyện tập lại tất cả
                    </button>
                     <button onClick={onBack} className="px-6 py-3 font-semibold text-secondary">
                        Quay lại
                    </button>
                </div>
            </div>
        );
    }

    if (!currentWord) {
        return (
            <div className="bg-surface p-6 sm:p-8 rounded-xl shadow-lg text-center animate-fade-in">
                <p className="text-secondary">Không có từ nào để luyện tập.</p>
                 <button onClick={onBack} className="mt-4 px-6 py-3 font-semibold text-white bg-primary hover:bg-primary-hover rounded-lg transition-colors">
                    Quay lại
                </button>
            </div>
        )
    }

    return (
        <div className="flex flex-col h-full">
            <div className={`flex-shrink-0 ${animationClass}`}>
                <div className="flex justify-between items-center mb-4">
                    <button 
                        onClick={onBack} 
                        className="flex items-center px-4 py-2 text-sm font-medium text-secondary bg-surface rounded-lg border border-border hover:bg-surface-muted transition-colors"
                    >
                        <BackArrowIcon />
                    </button>
                     <span className="text-sm font-semibold text-secondary">
                        {currentIndex + 1} / {practiceWords.length}
                    </span>
                </div>
                 <div className="w-full bg-surface-muted rounded-full h-4 border border-border p-0.5">
                    <div className="bg-primary h-full rounded-full" style={{ width: `${((currentIndex + 1) / practiceWords.length) * 100}%`, transition: 'width 0.5s ease-in-out' }}></div>
                </div>
            </div>

            <div className={`flex-grow flex flex-col justify-center items-center py-4 ${animationClass}`}>
                <div className="perspective-1000 w-full max-w-md">
                    <div 
                        className={`relative w-full h-80 transition-transform duration-700 transform-style-3d ${isFlipped ? 'rotate-y-180' : ''}`}
                        onClick={() => setIsFlipped(f => !f)}
                    >
                        {/* Front */}
                        <div className="absolute w-full h-full backface-hidden bg-surface rounded-2xl shadow-xl border border-border flex flex-col justify-center items-center p-6 text-center cursor-pointer">
                            <h3 className="text-4xl md:text-5xl font-bold text-primary">{currentWord.word}</h3>
                            <p className="text-secondary mt-2">{currentWord.phonetic}</p>
                            <p className="absolute bottom-4 text-xs text-secondary/70">Chạm để lật</p>
                        </div>
                        {/* Back */}
                        <div className="absolute w-full h-full backface-hidden bg-surface-muted rounded-2xl shadow-xl border border-border flex flex-col justify-center p-6 rotate-y-180 cursor-pointer">
                            <div className="flex items-center justify-center gap-4 mb-4">
                               <button 
                                    onClick={(e) => { e.stopPropagation(); onPlayAudio(currentWord.word); }} 
                                    className="text-secondary hover:text-primary transition-colors" 
                                    aria-label={`Play pronunciation for ${currentWord.word}`}
                                >
                                    {audioState === currentWord.word ? <SpeakerWaveIcon /> : <SpeakerIcon />}
                                </button>
                               <button 
                                    onClick={(e) => { e.stopPropagation(); onStartPronunciationPractice(currentWord); }}
                                    className="text-secondary hover:text-primary transition-colors" 
                                    aria-label={`Practice pronunciation for ${currentWord.word}`}
                                >
                                    <MicIcon />
                                </button>
                            </div>
                            <p className="text-lg text-primary text-center font-medium mb-2">{currentWord.definition_vi}</p>
                            <p className="text-center text-secondary italic">"{currentWord.example_vi}"</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className={`flex-shrink-0 transition-opacity duration-300 ${isFlipped ? 'opacity-100' : 'opacity-0 invisible'}`}>
                <div className="grid grid-cols-2 gap-4">
                    <button 
                        onClick={() => handleMarkWord('review')} 
                        className="flex flex-col sm:flex-row justify-center items-center gap-2 p-4 text-lg font-bold text-white bg-error hover:bg-error-hover rounded-xl border-b-4 border-red-700 active:border-b-2 active:translate-y-0.5 transition-all duration-150"
                    >
                        <XMarkIcon /> Cần ôn lại
                    </button>
                    <button 
                        onClick={() => handleMarkWord('known')} 
                        className="flex flex-col sm:flex-row justify-center items-center gap-2 p-4 text-lg font-bold text-white bg-success hover:bg-success-hover rounded-xl border-b-4 border-green-700 active:border-b-2 active:translate-y-0.5 transition-all duration-150"
                    >
                        <CheckIcon /> Đã biết
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PracticeView;