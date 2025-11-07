import React, { useState, useEffect, useRef } from 'react';
import { TutorChatMessage } from '../types';

interface AITutorViewProps {
  history: TutorChatMessage[];
  isLoading: boolean;
  onSendMessage: (message: string) => void;
  onBack: () => void;
}

const BackArrowIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-2"> <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" /> </svg> );
const SendIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5"> <path d="M3.105 2.289a.75.75 0 0 0-.826.95l1.414 4.949a.75.75 0 0 0 .95.545l4.624-1.32a.75.75 0 0 1 0 1.346l-4.624-1.32a.75.75 0 0 0-.95.545l-1.414 4.95a.75.75 0 0 0 .826.95l12.622-4.207a.75.75 0 0 0 0-1.498L3.105 2.289Z" /> </svg> );

const AITutorView: React.FC<AITutorViewProps> = ({ history, isLoading, onSendMessage, onBack }) => {
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [history]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isLoading) {
      onSendMessage(input.trim());
      setInput('');
    }
  };

  return (
    <div className="bg-surface w-full h-[80vh] max-h-[700px] rounded-2xl shadow-lg flex flex-col p-4 sm:p-6 animate-fade-in-up border border-border">
        <div className="flex-shrink-0 flex justify-between items-center pb-4 border-b border-border">
            <button onClick={onBack} className="flex items-center text-sm font-medium text-secondary hover:text-primary transition-colors">
                <BackArrowIcon />
                Quay lại
            </button>
             <h2 className="text-xl font-bold text-primary">Gemini Tutor</h2>
             <div className="w-24"></div>
        </div>

        <div className="flex-grow overflow-y-auto pr-2 space-y-4 py-4">
            {history.map((item, index) => (
                <div key={index} className={`flex items-start gap-3 ${item.speaker === 'user' ? 'justify-end' : 'justify-start'}`}>
                    {item.speaker === 'tutor' && <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white font-bold flex-shrink-0 mt-1">G</div>}
                    <div className={`max-w-[85%] p-3 rounded-2xl ${
                        item.speaker === 'user' ? 'bg-primary text-white rounded-br-none' : 'bg-surface-muted text-primary rounded-bl-none'
                    }`}>
                        {item.isTyping ? 
                            <div className="flex items-center space-x-1 p-2">
                                <span className="w-2 h-2 bg-secondary/50 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                                <span className="w-2 h-2 bg-secondary/50 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                                <span className="w-2 h-2 bg-secondary/50 rounded-full animate-bounce"></span>
                            </div>
                            : <p className="whitespace-pre-wrap">{item.text}</p>
                        }
                    </div>
                </div>
            ))}
             <div ref={messagesEndRef} />
        </div>

        <div className="flex-shrink-0 pt-4 border-t border-border">
            <form onSubmit={handleSubmit} className="flex items-center gap-2">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ask your tutor anything..."
                    className="flex-grow w-full p-3 rounded-xl border-2 border-border bg-surface-muted focus:ring-2 focus:ring-primary focus:border-primary"
                    disabled={isLoading}
                />
                <button type="submit" className="p-3 bg-primary text-white rounded-xl shadow-sm hover:bg-primary-hover disabled:bg-slate-400 disabled:cursor-not-allowed transition-colors">
                    <SendIcon />
                </button>
            </form>
        </div>
    </div>
  );
};

export default AITutorView;