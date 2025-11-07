import React, { useState } from 'react';
import { VocabularyWord } from '../types';
import { shuffle } from '../utils/array';

interface PracticeViewProps {
  vocabulary: VocabularyWord[];
  onBack: () => void;
  onPlayAudio: (word: string) => void;
  audioState: string | null;
}

const BackArrowIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-2"> <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" /> </svg> );
const CheckIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-6 h-6"> <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.052-.143Z" clipRule="evenodd" /> </svg> );
const XMarkIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-6 h-6"> <path d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z" /> </svg> );
const ReplayIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-2"> <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 11.667 0l3.181-3.183m-4.991-2.69a8.25 8.25 0 0 0-11.667 0l-3.181 3.183" /> </svg>);
const SpeakerIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"> <path strokeLinecap="round" strokeLinejoin="round" d="M19.114 5.636a9 9 0 0 1 0 12.728M16.463 8.288a5.25 5.25 0 0 1 0 7.424M6.75 8.25l4.72-4.72a.75.75 0 0 1 1.28.53v15.88a.75.75 0 0 1-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 0 1 2.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75Z" /> </svg> );
const SpeakerWaveIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-indigo-500"> <path strokeLinecap="round" strokeLinejoin="round" d="M19.114 5.636a9 9 0 0 1 0 12.728M16.463 8.288a5.25 5.25 0 0 1 0 7.424M6.75 8.25l4.72-4.72a.75.75 0 0 1 1.28.53v15.88a.75.75 0 0 1-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 0 1 2.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75Z" /> </svg> );


type PracticeState = 'PRACTICING' | 'SUMMARY';

const PracticeView: React.FC<PracticeViewProps> = ({ vocabulary, onBack, onPlayAudio, audioState }) => {
    const [practiceWords, setPracticeWords] = useState<VocabularyWord[]>(() => shuffle(vocabulary));
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isFlipped, setIsFlipped] = useState(false);
    const [knownWords, setKnownWords] = useState<VocabularyWord[]>([]);
    const [reviewWords, setReviewWords] = useState<VocabularyWord[]>([]);
    const [practiceState, setPracticeState] = useState<PracticeState>('PRACTICING');

    const currentWord = practiceWords[currentIndex];

    const handleMarkWord = (status: 'known' | 'review') => {
        if (status === 'known') {
            setKnownWords(prev => [...prev, currentWord]);
        } else {
            setReviewWords(prev => [...prev, currentWord]);
        }

        if (currentIndex < practiceWords.length - 1) {
            setCurrentIndex(prev => prev + 1);
            setIsFlipped(false);
        } else {
            setPracticeState('SUMMARY');
        }
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
            <div className="bg-white dark:bg-gray-800 p-6 sm:p-8 rounded-xl shadow-lg text-center animate-fade-in">
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">Hoàn thành Lượt Luyện tập!</h2>
                <div className="flex justify-around items-center my-8">
                    <div className="text-green-600 dark:text-green-400">
                        <p className="text-4xl font-bold">{knownWords.length}</p>
                        <p className="text-lg">Đã biết</p>
                    </div>
                    <div className="text-red-600 dark:text-red-400">
                        <p className="text-4xl font-bold">{reviewWords.length}</p>
                        <p className="text-lg">Cần ôn lại</p>
                    </div>
                </div>
                <div className="flex flex-col sm:flex-row justify-center gap-4 mt-8">
                    {reviewWords.length > 0 && (
                        <button onClick={() => handleRestartPractice(true)} className="flex items-center justify-center px-6 py-3 font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors">
                            <ReplayIcon /> Ôn lại {reviewWords.length} từ
                        </button>
                    )}
                    <button onClick={() => handleRestartPractice(false)} className="px-6 py-3 font-semibold text-gray-700 dark:text-gray-200 bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors">
                        Luyện tập lại tất cả
                    </button>
                     <button onClick={onBack} className="px-6 py-3 font-semibold">
                        Quay lại
                    </button>
                </div>
            </div>
        );
    }

    if (!currentWord) {
        return (
            <div className="bg-white dark:bg-gray-800 p-6 sm:p-8 rounded-xl shadow-lg text-center animate-fade-in">
                <p>Không có từ nào để luyện tập.</p>
                 <button onClick={onBack} className="mt-4 px-6 py-3 font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors">
                    Quay lại
                </button>
            </div>
        )
    }

    return (
        <div className="animate-fade-in">
            <div className="flex justify-between items-center mb-6">
                <button onClick={onBack} className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
                    <BackArrowIcon />
                    Quay lại
                </button>
                <h2 className="text-2xl sm:text-3xl font-bold text-center text-gray-900 dark:text-gray-100">Luyện tập Từ vựng</h2>
                 <span className="text-sm font-semibold text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full">
                    {currentIndex + 1} / {practiceWords.length}
                </span>
            </div>

            {/* Flashcard */}
            <div className="perspective-1000">
                <div className={`relative w-full h-80 transition-transform duration-700 transform-style-3d ${isFlipped ? 'rotate-y-180' : ''}`}>
                    {/* Front */}
                    <div className="absolute w-full h-full backface-hidden bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 flex flex-col justify-center items-center p-6 text-center">
                        <div className="flex items-center gap-4">
                            <h3 className="text-4xl md:text-5xl font-bold text-indigo-600 dark:text-indigo-400">{currentWord.word}</h3>
                            <button onClick={() => onPlayAudio(currentWord.word)} className="text-gray-500 hover:text-indigo-500 transition-colors" aria-label={`Play pronunciation for ${currentWord.word}`}>
                                {audioState === currentWord.word ? <SpeakerWaveIcon /> : <SpeakerIcon />}
                            </button>
                        </div>
                        <p className="text-gray-500 dark:text-gray-400 mt-2">{currentWord.phonetic}</p>
                    </div>
                    {/* Back */}
                    <div className="absolute w-full h-full backface-hidden bg-white dark:bg-gray-700 rounded-xl shadow-lg border border-gray-200 dark:border-gray-600 flex flex-col justify-center p-6 rotate-y-180">
                         <p className="text-lg text-gray-700 dark:text-gray-200 mb-2"><strong>({currentWord.type})</strong> {currentWord.definition}</p>
                         <p className="text-sm text-gray-600 dark:text-gray-400 italic mb-4">"{currentWord.example}"</p>
                         <hr className="border-gray-200 dark:border-gray-600 my-2" />
                         <p className="text-lg text-gray-700 dark:text-gray-200 font-medium mb-2">{currentWord.definition_vi}</p>
                         <p className="text-sm text-gray-600 dark:text-gray-400 italic">"{currentWord.example_vi}"</p>
                    </div>
                </div>
            </div>

            {/* Controls */}
            <div className="mt-8 flex justify-center">
                {!isFlipped ? (
                    <button onClick={() => setIsFlipped(true)} className="px-12 py-3 text-lg font-bold text-white bg-indigo-600 rounded-lg shadow-md hover:bg-indigo-700 transform hover:scale-105 transition-all duration-200">
                        Hiển thị đáp án
                    </button>
                ) : (
                    <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                        <button onClick={() => handleMarkWord('review')} className="flex-1 flex justify-center items-center gap-2 px-8 py-3 text-lg font-bold text-white bg-red-600 rounded-lg shadow-md hover:bg-red-700 transform hover:scale-105 transition-all duration-200">
                           <XMarkIcon /> Cần ôn lại
                        </button>
                        <button onClick={() => handleMarkWord('known')} className="flex-1 flex justify-center items-center gap-2 px-8 py-3 text-lg font-bold text-white bg-green-600 rounded-lg shadow-md hover:bg-green-700 transform hover:scale-105 transition-all duration-200">
                            <CheckIcon /> Đã biết
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PracticeView;