import React from 'react';
import { VocabularyWord, WordExplanation } from '../types';
import Spinner from './Spinner';

interface ExplanationModalProps {
  word: VocabularyWord;
  explanation: WordExplanation | null;
  isLoading: boolean;
  error: string | null;
  onClose: () => void;
}

const XMarkIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"> <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" /> </svg> );

const ExplanationModal: React.FC<ExplanationModalProps> = ({ word, explanation, isLoading, error, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-surface w-full max-w-lg rounded-2xl shadow-2xl flex flex-col max-h-[90vh] border border-border">
        <div className="flex-shrink-0 flex justify-between items-center p-4 sm:p-6 border-b border-border">
          <h2 className="text-xl font-bold text-primary">Giải thích: <span className="text-primary">{word.word}</span></h2>
          <button onClick={onClose} className="p-1 rounded-full text-secondary hover:bg-surface-muted transition-colors">
            <XMarkIcon />
          </button>
        </div>

        <div className="flex-grow overflow-y-auto p-4 sm:p-6">
          {isLoading && <div className="flex justify-center items-center h-48"><Spinner message="Đang tạo giải thích..." /></div>}
          {error && <div className="text-center text-error-text p-4 bg-error-light rounded-lg">{error}</div>}
          {explanation && (
            <div className="space-y-5">
              <div>
                <h3 className="font-semibold text-primary mb-2">Giải thích chi tiết</h3>
                <p className="text-secondary">{explanation.detailedExplanation}</p>
              </div>
               {explanation.collocations?.length > 0 && (
                 <div>
                    <h3 className="font-semibold text-primary mb-2">Collocations (Cụm từ phổ biến)</h3>
                    <ul className="list-disc list-inside space-y-1">
                      {explanation.collocations.map((item, i) => <li key={i} className="text-secondary">{item}</li>)}
                    </ul>
                 </div>
               )}
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                 {explanation.synonyms?.length > 0 && (
                    <div>
                        <h3 className="font-semibold text-primary mb-2">Từ đồng nghĩa</h3>
                        <div className="flex flex-wrap gap-2">
                        {explanation.synonyms.map((item, i) => <span key={i} className="px-3 py-1 text-sm bg-success-light text-success-text rounded-full">{item}</span>)}
                        </div>
                    </div>
                 )}
                 {explanation.antonyms?.length > 0 && (
                    <div>
                        <h3 className="font-semibold text-primary mb-2">Từ trái nghĩa</h3>
                        <div className="flex flex-wrap gap-2">
                         {explanation.antonyms.map((item, i) => <span key={i} className="px-3 py-1 text-sm bg-error-light text-error-text rounded-full">{item}</span>)}
                        </div>
                    </div>
                 )}
               </div>
            </div>
          )}
        </div>
        
        <div className="flex-shrink-0 p-4 bg-surface-muted border-t border-border text-right">
             <button onClick={onClose} className="px-6 py-2 bg-primary text-white font-semibold rounded-lg hover:bg-primary-hover transition-colors">
                Đã hiểu
            </button>
        </div>
      </div>
    </div>
  );
};

export default ExplanationModal;