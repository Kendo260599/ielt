import React, { useState, useEffect, useRef, useCallback } from 'react';
import { TranscriptItem } from '../types';
import { speakingTestData } from '../data/staticData';

// Polyfill for cross-browser compatibility
const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

interface SpeakingSimulatorViewProps {
  topic: string;
  imagePromptUrl: string | null;
  onFinish: (transcript: TranscriptItem[]) => void;
}

type TestPart = 1 | 2 | 3;
type SimulatorState = 'READY' | 'PREPARING' | 'SPEAKING' | 'FINISHED_PART';

const MicIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6"> <path d="M8.25 4.5a3.75 3.75 0 1 1 7.5 0v8.25a3.75 3.75 0 1 1-7.5 0V4.5Z" /> <path d="M6 10.5a.75.75 0 0 1 .75.75v1.5a5.25 5.25 0 1 0 10.5 0v-1.5a.75.75 0 0 1 1.5 0v1.5a6.75 6.75 0 1 1-13.5 0v-1.5A.75.75 0 0 1 6 10.5Z" /> </svg> );

const SpeakingSimulatorView: React.FC<SpeakingSimulatorViewProps> = ({ topic, imagePromptUrl, onFinish }) => {
  const [currentPart, setCurrentPart] = useState<TestPart>(1);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [simulatorState, setSimulatorState] = useState<SimulatorState>('READY');
  const [transcript, setTranscript] = useState<TranscriptItem[]>([]);
  const [isListening, setIsListening] = useState(false);
  const [timer, setTimer] = useState(0);

  const recognitionRef = useRef<any>(null);
  const timerRef = useRef<number | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const questions = speakingTestData(topic);
  const currentQuestionText = questions[`part${currentPart}`][questionIndex];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [transcript]);

  const startListening = useCallback(() => {
    if (recognitionRef.current && !isListening) {
      setIsListening(true);
      recognitionRef.current.start();
    }
  }, [isListening]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current && isListening) {
      setIsListening(false);
      recognitionRef.current.stop();
    }
  }, [isListening]);
  
  const startTimer = useCallback((duration: number, onComplete: () => void) => {
    if (timerRef.current) clearInterval(timerRef.current);
    setTimer(duration);
    timerRef.current = window.setInterval(() => {
        setTimer(prev => {
            if (prev <= 1) {
                clearInterval(timerRef.current!);
                onComplete();
                return 0;
            }
            return prev - 1;
        });
    }, 1000);
  }, []);

  useEffect(() => {
    if (!SpeechRecognition) {
      alert("Trình duyệt của bạn không hỗ trợ nhận dạng giọng nói. Vui lòng sử dụng Chrome hoặc Edge.");
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onerror = (event: any) => console.error('Speech recognition error:', event.error);

    recognition.onresult = (event: any) => {
      let finalTranscript = '';
      let interimTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript;
        } else {
          interimTranscript += event.results[i][0].transcript;
        }
      }

      if (finalTranscript) {
          setTranscript(prev => [...prev.filter(t => t.speaker !== 'user_interim'), { speaker: 'user', text: finalTranscript.trim() }]);
      }
      if (interimTranscript) {
           setTranscript(prev => [...prev.filter(t => t.speaker !== 'user_interim'), { speaker: 'user_interim', text: interimTranscript.trim() }]);
      }
    };
    recognitionRef.current = recognition;

    return () => {
      recognition.stop();
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const handleNext = () => {
    stopListening();
    if (timerRef.current) clearInterval(timerRef.current);

    const partQuestions = questions[`part${currentPart}`];
    if (questionIndex < partQuestions.length - 1) {
      setQuestionIndex(prev => prev + 1);
      setSimulatorState('READY');
    } else {
      if (currentPart < 3) {
        setCurrentPart(prev => (prev + 1) as TestPart);
        setQuestionIndex(0);
        setSimulatorState('READY');
      } else {
        onFinish(transcript.filter(t => t.speaker !== 'user_interim'));
      }
    }
  };
  
  useEffect(() => {
      if (simulatorState === 'READY') {
          setTranscript(prev => [...prev.filter(t => t.speaker !== 'user_interim'), { speaker: 'model', text: currentQuestionText }]);
          if (currentPart === 2) {
            setSimulatorState('PREPARING');
          } else {
            setSimulatorState('SPEAKING');
          }
      }
  }, [simulatorState, currentPart, currentQuestionText]);

  useEffect(() => {
      if(simulatorState === 'PREPARING') {
          startTimer(60, () => setSimulatorState('SPEAKING'));
      }
      if(simulatorState === 'SPEAKING' && currentPart === 2) {
          startListening();
          startTimer(120, handleNext);
      }
       if(simulatorState === 'SPEAKING' && currentPart !== 2) {
          startListening();
      }
  }, [simulatorState, currentPart, startListening, startTimer, handleNext]);


  const renderContent = () => {
    const isPreparing = simulatorState === 'PREPARING';
    const isSpeaking = simulatorState === 'SPEAKING';
    
    return (
      <>
        <div className="bg-surface-muted p-4 rounded-xl min-h-[150px] flex flex-col justify-center text-center">
            {currentPart === 2 && imagePromptUrl && (
                <div className="mb-4">
                    <img src={imagePromptUrl} alt="Speaking prompt" className="rounded-md max-h-48 mx-auto" />
                </div>
            )}
            {isPreparing && (
                <>
                    <p className="text-lg font-semibold text-primary mb-2">Chuẩn bị trong 1 phút</p>
                    <p className="text-5xl font-bold text-primary">{timer}</p>
                </>
            )}
            {isSpeaking && currentPart === 2 && (
                <>
                    <p className="text-lg font-semibold text-primary mb-2">Nói trong tối đa 2 phút</p>
                    <p className="text-5xl font-bold text-primary">{timer}</p>
                </>
            )}
             {(isSpeaking && currentPart !== 2) && (
                <div className="flex flex-col items-center justify-center">
                    <p className="text-lg font-medium text-secondary">Đang lắng nghe...</p>
                    <div className="flex items-center text-primary mt-4">
                        <MicIcon />
                        <span className="ml-2 text-4xl">...</span>
                    </div>
                </div>
            )}
        </div>
        
        <div className="mt-4 flex-grow overflow-y-auto pr-2 space-y-4">
            {transcript.map((item, index) => (
                <div key={index} className={`flex items-start gap-3 ${item.speaker.startsWith('user') ? 'justify-end' : 'justify-start'}`}>
                    {item.speaker === 'model' && <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white font-bold flex-shrink-0 mt-1">G</div>}
                    <div className={`max-w-[85%] p-3 rounded-2xl ${
                        item.speaker.startsWith('user') ? 'bg-primary text-white rounded-br-none' : 'bg-surface-muted text-primary rounded-bl-none'
                    } ${item.speaker === 'user_interim' ? 'opacity-60' : ''}`}>
                        <p style={{ whiteSpace: 'pre-wrap' }}>{item.text}</p>
                    </div>
                </div>
            ))}
            <div ref={messagesEndRef} />
        </div>
      </>
    );
  }

  return (
    <div className="bg-surface w-full h-[80vh] max-h-[700px] rounded-2xl shadow-lg flex flex-col p-4 sm:p-6 animate-fade-in-up border border-border">
        <div className="flex-shrink-0 flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-primary">Part {currentPart}</h2>
            <span className="text-sm font-semibold text-secondary bg-surface-muted px-3 py-1 rounded-full">
                {questionIndex + 1} / {questions[`part${currentPart}`].length}
            </span>
        </div>
        {renderContent()}
         <div className="flex-shrink-0 pt-4 text-center">
             {simulatorState === 'SPEAKING' && currentPart !== 2 && (
                <button onClick={handleNext} className="px-8 py-3 bg-success text-white font-bold rounded-full hover:bg-success-hover transition-colors">
                    Câu tiếp theo
                </button>
             )}
             {currentPart === 3 && questionIndex === questions.part3.length - 1 && (
                 <button onClick={handleNext} className="px-8 py-3 bg-primary text-white font-bold rounded-full hover:bg-primary-hover transition-colors">
                    Hoàn thành & Nhận phân tích
                </button>
             )}
        </div>
    </div>
  );
};

export default SpeakingSimulatorView;