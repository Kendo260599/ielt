import React, { useState, useEffect, useRef } from 'react';
import { VocabularyWord, PronunciationFeedback } from '../types';
import { fetchPronunciationAnalysis } from '../services/geminiService';
import Spinner from './Spinner';

// Polyfill for cross-browser compatibility
const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

const XMarkIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"> <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" /> </svg> );
const MicIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10"> <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 0 0 6-6v-1.5m-6 7.5a6 6 0 0 1-6-6v-1.5m12 0v-1.5a6 6 0 0 0-6-6v1.5m-6 0V5.25a6 6 0 0 1 6-6v1.5m0 0v1.5m0-1.5a6 6 0 0 0 0 12m0 0v-1.5" /> </svg> );
const StopIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10"> <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 7.5A2.25 2.25 0 0 1 7.5 5.25h9a2.25 2.25 0 0 1 2.25 2.25v9a2.25 2.25 0 0 1-2.25 2.25h-9a2.25 2.25 0 0 1-2.25-2.25v-9Z" /> </svg> );
const CheckCircleIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-16 h-16 text-success"> <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm13.36-1.814a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z" clipRule="evenodd" /> </svg>);
const ExclamationTriangleIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-16 h-16 text-warning"> <path fillRule="evenodd" d="M9.401 3.003c1.155-2 4.043-2 5.197 0l7.355 12.748c1.154 2-.29 4.5-2.598 4.5H4.644C2.336 20.25.892 17.75 2.046 15.75L9.4 3.003ZM12 8.25a.75.75 0 0 1 .75.75v3.75a.75.75 0 0 1-1.5 0V9a.75.75 0 0 1 .75-.75Zm0 8.25a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Z" clipRule="evenodd" /> </svg>);

type PracticeState = 'IDLE' | 'LISTENING' | 'ANALYZING' | 'FEEDBACK' | 'ERROR';

interface PronunciationPracticeModalProps {
  word: VocabularyWord;
  onClose: () => void;
}

const PronunciationPracticeModal: React.FC<PronunciationPracticeModalProps> = ({ word, onClose }) => {
    const [state, setState] = useState<PracticeState>('IDLE');
    const [feedback, setFeedback] = useState<PronunciationFeedback | null>(null);
    const [error, setError] = useState<string | null>(null);
    const recognitionRef = useRef<any>(null);

    useEffect(() => {
        if (!SpeechRecognition) {
            setError("Trình duyệt của bạn không hỗ trợ nhận dạng giọng nói. Vui lòng sử dụng Chrome hoặc Edge.");
            setState('ERROR');
            return;
        }

        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = 'en-US';

        recognition.onresult = async (event: any) => {
            const transcript = event.results[0][0].transcript;
            setState('ANALYZING');
            try {
                const analysis = await fetchPronunciationAnalysis(word, transcript);
                setFeedback(analysis);
                setState('FEEDBACK');
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Lỗi không xác định.');
                setState('ERROR');
            }
        };

        recognition.onerror = (event: any) => {
            console.error('Speech recognition error:', event.error);
            setError(`Lỗi nhận dạng giọng nói: ${event.error}`);
            setState('ERROR');
        };

        recognition.onend = () => {
            if (state === 'LISTENING') {
                setState('IDLE');
            }
        };

        recognitionRef.current = recognition;
    }, [word, state]);

    const handleMicClick = () => {
        if (state === 'IDLE' && recognitionRef.current) {
            setState('LISTENING');
            recognitionRef.current.start();
        } else if (state === 'LISTENING' && recognitionRef.current) {
            recognitionRef.current.stop();
            // onend will handle state change
        }
    };

    const handleTryAgain = () => {
        setFeedback(null);
        setError(null);
        setState('IDLE');
    };

    const renderContent = () => {
        switch (state) {
            case 'LISTENING':
            case 'IDLE':
                return (
                    <div className="text-center py-8">
                        <p className="text-lg text-secondary mb-4">Nhấn nút và đọc to từ bên dưới:</p>
                        <h3 className="text-4xl font-bold text-primary mb-2">{word.word}</h3>
                        <p className="text-secondary mb-8">{word.phonetic}</p>
                        <button 
                            onClick={handleMicClick}
                            className={`w-24 h-24 rounded-full text-white flex items-center justify-center transition-all duration-300 shadow-lg ${state === 'LISTENING' ? 'bg-error animate-pulse' : 'bg-primary hover:bg-primary-hover'}`}
                        >
                            {state === 'LISTENING' ? <StopIcon /> : <MicIcon />}
                        </button>
                    </div>
                );
            case 'ANALYZING':
                return <div className="flex justify-center items-center h-48"><Spinner message="Đang phân tích phát âm..." /></div>;
            case 'FEEDBACK':
                if (!feedback) return null;
                const isCorrect = feedback.isCorrect;
                return (
                     <div className="space-y-4 text-center animate-scale-in">
                        {isCorrect ? <CheckCircleIcon /> : <ExclamationTriangleIcon />}
                        <h3 className={`text-2xl font-bold ${isCorrect ? 'text-success-text' : 'text-warning-text'}`}>
                            {feedback.feedback}
                        </h3>

                        <div>
                            <p className="text-sm text-secondary">Chúng tôi nghe được:</p>
                            <p className="text-2xl font-semibold text-primary">"{feedback.transcript}"</p>
                        </div>

                        {!isCorrect && feedback.tip && (
                             <div className="p-4 bg-surface-muted rounded-lg text-left">
                                <h4 className="font-semibold text-primary">💡 Mẹo cải thiện:</h4>
                                <p className="text-secondary">{feedback.tip}</p>
                            </div>
                        )}
                    </div>
                );
            case 'ERROR':
                return <div className="text-center text-error-text p-4 bg-error-light rounded-lg">{error}</div>;
        }
    }

    return (
        <div className="fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in" onClick={onClose}>
            <div className={`w-full max-w-md rounded-2xl shadow-2xl flex flex-col max-h-[90vh] transition-all duration-300 ${
                state === 'FEEDBACK' && feedback?.isCorrect ? 'bg-success-light' : 
                state === 'FEEDBACK' && !feedback?.isCorrect ? 'bg-warning-light' : 'bg-surface'
                }`} onClick={e => e.stopPropagation()}>
                <div className="flex-shrink-0 flex justify-between items-center p-4 sm:p-5 border-b border-border">
                    <h2 className="text-lg font-bold text-primary">Luyện Phát Âm</h2>
                    <button onClick={onClose} className="p-1 rounded-full text-secondary hover:bg-surface-muted transition-colors">
                        <XMarkIcon />
                    </button>
                </div>

                <div className="flex-grow overflow-y-auto p-4 sm:p-6">
                    {renderContent()}
                </div>
                
                <div className="flex-shrink-0 p-4 bg-surface/50 border-t border-border flex justify-end gap-3">
                    {state === 'FEEDBACK' || state === 'ERROR' ? (
                        <>
                            <button onClick={onClose} className="px-4 py-2 text-secondary bg-surface rounded-lg border border-border hover:bg-surface-muted transition-colors">
                                Đóng
                            </button>
                            <button onClick={handleTryAgain} className="px-4 py-2 btn-primary">
                                Thử lại
                            </button>
                        </>
                    ) : (
                         <button onClick={onClose} className="px-6 py-2 btn-primary">
                            Đóng
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PronunciationPracticeModal;