import React, { useState } from 'react';
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
}

const BackArrowIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
    </svg>
);

const SpeakerIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"> <path strokeLinecap="round" strokeLinejoin="round" d="M19.114 5.636a9 9 0 0 1 0 12.728M16.463 8.288a5.25 5.25 0 0 1 0 7.424M6.75 8.25l4.72-4.72a.75.75 0 0 1 1.28.53v15.88a.75.75 0 0 1-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 0 1 2.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75Z" /> </svg> );
const SpeakerWaveIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-indigo-500"> <path strokeLinecap="round" strokeLinejoin="round" d="M19.114 5.636a9 9 0 0 1 0 12.728M16.463 8.288a5.25 5.25 0 0 1 0 7.424M6.75 8.25l4.72-4.72a.75.75 0 0 1 1.28.53v15.88a.75.75 0 0 1-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 0 1 2.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75Z" /> </svg> );
const SparklesIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456Z" /></svg>);
const ChatBubbleIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 0 1-2.555-.337A5.972 5.972 0 0 1 5.41 20.97a5.969 5.969 0 0 1-.474-.065 4.48 4.48 0 0 0 .978-2.025c.09-.455.09-.934.09-1.425v-2.287a6.75 6.75 0 0 1 6.75-6.75h.75c4.97 0 9 3.694 9 8.25Z" /></svg>);


const LessonView: React.FC<LessonViewProps> = ({ vocabulary, onStartTest, onBack, onPlayAudio, audioState, onAskTutor }) => {
  const [selectedWord, setSelectedWord] = useState<VocabularyWord | null>(null);
  const [explanation, setExplanation] = useState<WordExplanation | null>(null);
  const [isModalLoading, setIsModalLoading] = useState(false);
  const [modalError, setModalError] = useState<string | null>(null);

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

  return (
    <div className="animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <button 
          onClick={onBack}
          className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
        >
            <BackArrowIcon />
            Đổi chủ đề
        </button>
        <h2 className="text-2xl sm:text-3xl font-bold text-center text-gray-900 dark:text-gray-100">Danh sách từ vựng</h2>
        <div className="w-32 hidden sm:block"></div> {/* Spacer */}
      </div>
      
      <div className="space-y-4">
        {vocabulary.map((v, index) => (
          <div key={index} className="bg-white dark:bg-gray-800 p-5 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-start justify-between mb-3">
               <div className="flex items-center gap-3">
                 <h3 className="text-xl font-bold text-indigo-600 dark:text-indigo-400">{v.word}</h3>
                 <button onClick={() => onPlayAudio(v.word)} className="text-gray-500 hover:text-indigo-500 transition-colors" aria-label={`Play pronunciation for ${v.word}`}>
                    {audioState === v.word ? <SpeakerWaveIcon /> : <SpeakerIcon />}
                 </button>
              </div>
              <p className="text-gray-500 dark:text-gray-400 italic text-sm sm:text-base text-right flex-shrink-0 ml-4">
                {v.phonetic} • {v.type}
              </p>
            </div>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                <div>
                    <p className="text-gray-700 dark:text-gray-300 mb-2">{v.definition}</p>
                    <p className="text-gray-600 dark:text-gray-400 border-l-4 border-gray-200 dark:border-gray-600 pl-4 py-1 text-sm italic">
                        "{v.example}"
                    </p>
                </div>
                <div className="border-t pt-4 md:pt-0 md:border-t-0 md:border-l md:pl-6 border-gray-200 dark:border-gray-700">
                    <p className="text-gray-700 dark:text-gray-300 mb-2 font-medium">{v.definition_vi}</p>
                    <p className="text-gray-600 dark:text-gray-400 border-l-4 border-indigo-200 dark:border-indigo-800 pl-4 py-1 text-sm italic">
                        "{v.example_vi}"
                    </p>
                </div>
            </div>
             <div className="mt-4 flex justify-end gap-4">
                <button 
                    onClick={() => onAskTutor(v)}
                    className="flex items-center text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100 transition-colors"
                >
                    <ChatBubbleIcon /> Hỏi Gia sư
                </button>
                <button 
                    onClick={() => handleExplainWord(v)}
                    className="flex items-center text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors"
                >
                    <SparklesIcon /> Giải thích
                </button>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-8 text-center">
        <button
          onClick={onStartTest}
          className="w-full sm:w-auto px-12 py-3 text-lg font-bold text-white bg-green-600 rounded-lg shadow-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 dark:focus:ring-offset-gray-900 transform hover:scale-105 transition-all duration-200"
        >
          Bắt đầu Test
        </button>
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