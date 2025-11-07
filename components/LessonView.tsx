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
  onStartPronunciationPractice: (word: VocabularyWord) => void;
}

const BackArrowIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-2"> <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" /> </svg> );
const SpeakerIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"> <path strokeLinecap="round" strokeLinejoin="round" d="M19.114 5.636a9 9 0 0 1 0 12.728M16.463 8.288a5.25 5.25 0 0 1 0 7.424M6.75 8.25l4.72-4.72a.75.75 0 0 1 1.28.53v15.88a.75.75 0 0 1-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 0 1 2.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75Z" /> </svg> );
const SpeakerWaveIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-primary"> <path strokeLinecap="round" strokeLinejoin="round" d="M19.114 5.636a9 9 0 0 1 0 12.728M16.463 8.288a5.25 5.25 0 0 1 0 7.424M6.75 8.25l4.72-4.72a.75.75 0 0 1 1.28.53v15.88a.75.75 0 0 1-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 0 1 2.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75Z" /> </svg> );
const SparklesIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456Z" /></svg>);
const ChatBubbleIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 0 1-2.555-.337A5.972 5.972 0 0 1 5.41 20.97a5.969 5.969 0 0 1-.474-.065 4.48 4.48 0 0 0 .978-2.025c.09-.455.09-.934.09-1.425v-2.287a6.75 6.75 0 0 1 6.75-6.75h.75c4.97 0 9 3.694 9 8.25Z" /></svg>);
const MicIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 0 0 6-6v-1.5m-6 7.5a6 6 0 0 1-6-6v-1.5m12 0v-1.5a6 6 0 0 0-6-6v1.5m-6 0V5.25a6 6 0 0 1 6-6v1.5m0 0v1.5m0-1.5a6 6 0 0 0 0 12m0 0v-1.5" /></svg>);

const LessonView: React.FC<LessonViewProps> = ({ vocabulary, onStartTest, onBack, onPlayAudio, audioState, onAskTutor, onStartPronunciationPractice }) => {
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
    <div className="animate-fade-in-up">
      <div className="flex justify-between items-center mb-6">
        <button 
          onClick={onBack}
          className="flex items-center px-4 py-2 text-sm font-medium text-secondary bg-surface rounded-lg border border-border hover:bg-surface-muted transition-colors"
        >
            <BackArrowIcon />
            Đổi chủ đề
        </button>
      </div>
       <h2 className="text-2xl sm:text-3xl font-bold text-center text-primary mb-8">Danh sách từ vựng</h2>

      
      <div className="space-y-3">
        {vocabulary.map((v, index) => (
          <div key={index} className="bg-surface p-4 rounded-xl shadow-sm border border-border flex items-center gap-4">
              <button onClick={() => onPlayAudio(v.word)} className="flex-shrink-0 w-12 h-12 rounded-lg text-secondary hover:text-primary hover:bg-primary-light transition-colors flex items-center justify-center" aria-label={`Play pronunciation for ${v.word}`}>
                {audioState === v.word ? <SpeakerWaveIcon /> : <SpeakerIcon />}
              </button>
              <div className="flex-grow">
                 <div className="flex items-baseline gap-3">
                     <h3 className="text-lg font-bold text-primary">{v.word}</h3>
                     <p className="text-secondary italic text-sm">{v.phonetic}</p>
                 </div>
                 <p className="text-secondary text-sm">{v.definition_vi}</p>
              </div>
              <div className="flex items-center gap-1">
                 <button onClick={() => onStartPronunciationPractice(v)} className="p-2 rounded-full text-secondary hover:bg-surface-muted transition-colors" title="Luyện phát âm"><MicIcon /></button>
                 <button onClick={() => onAskTutor(v)} className="p-2 rounded-full text-secondary hover:bg-surface-muted transition-colors" title="Hỏi Gia sư AI"><ChatBubbleIcon /></button>
                 <button onClick={() => handleExplainWord(v)} className="p-2 rounded-full text-secondary hover:bg-surface-muted transition-colors" title="Giải thích chi tiết"><SparklesIcon /></button>
              </div>
          </div>
        ))}
      </div>
      
       <div className="mt-8 text-center pb-8">
        <button
          onClick={onStartTest}
          className="w-full sm:w-auto px-12 py-4 text-lg btn-success shadow-lg transform hover:scale-105 transition-transform duration-200"
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