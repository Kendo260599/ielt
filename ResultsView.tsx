import React from 'react';
import { VocabularyWord } from './types';

interface ResultsViewProps {
  score: number;
  totalQuestions: number;
  xpGained: number;
  onRestart: () => void;
  onRetry: () => void;
  incorrectWords: VocabularyWord[];
  onStartReview: (words: VocabularyWord[]) => void;
  isGuest: boolean;
  onRequestSignIn: () => void;
}

const ResultsView: React.FC<ResultsViewProps> = ({ score, totalQuestions, xpGained, onRestart, onRetry, incorrectWords, onStartReview, isGuest, onRequestSignIn }) => {
  const percentage = totalQuestions > 0 ? Math.round((score / totalQuestions) * 100) : 0;
  
  let feedbackMessage = "";
  let feedbackColor = "";
  let gradientStops = { from: 'var(--error)', to: '#f87171' };

  if (percentage >= 80) {
      feedbackMessage = "Xuất sắc! Bạn đã nắm vững các từ vựng này.";
      feedbackColor = "text-success";
      gradientStops = { from: 'var(--success)', to: '#4ade80' };
  } else if (percentage >= 60) {
      feedbackMessage = "Làm tốt lắm! Luyện tập thêm một chút nữa sẽ trở nên hoàn hảo.";
      feedbackColor = "text-yellow-500";
      gradientStops = { from: 'var(--warning)', to: '#facc15' };
  } else {
      feedbackMessage = "Hãy tiếp tục luyện tập! Ôn lại các từ và thử lại bài kiểm tra nhé.";
      feedbackColor = "text-error";
  }
  
  const showReviewButton = incorrectWords.length > 0;


  return (
    <div className="text-center bg-surface p-8 rounded-xl shadow-lg border border-border animate-scale-in">
      <h2 className="text-3xl font-bold text-primary mb-2 animate-fade-in-up">Hoàn thành bài Test!</h2>
      {!isGuest && <p className="text-lg text-yellow-500 font-bold mb-4 animate-fade-in-up" style={{ animationDelay: '100ms' }}>+{xpGained} XP</p>}
      
      <div className="relative w-48 h-48 mx-auto mb-6 animate-fade-in-up" style={{ animationDelay: '200ms' }}>
        <svg className="w-full h-full" viewBox="0 0 36 36">
           <defs>
            <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor={gradientStops.from} />
                <stop offset="100%" stopColor={gradientStops.to} />
            </linearGradient>
           </defs>
          <path
            className="text-surface-muted"
            d="M18 2.0845
              a 15.9155 15.9155 0 0 1 0 31.831
              a 15.9155 15.9155 0 0 1 0 -31.831"
            fill="none"
            stroke="currentColor"
            strokeWidth="3.5"
          />
          <path
            d="M18 2.0845
              a 15.9155 15.9155 0 0 1 0 31.831
              a 15.9155 15.9155 0 0 1 0 -31.831"
            fill="none"
            stroke="url(#scoreGradient)"
            strokeWidth="3.5"
            strokeDasharray={`${percentage}, 100`}
            strokeLinecap="round"
            transform="rotate(-90 18 18)"
            style={{transition: 'stroke-dasharray 0.8s ease-out'}}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-5xl font-bold text-primary">{score}
            <span className="text-2xl text-secondary">/{totalQuestions}</span></span>
        </div>
      </div>
      
      <p className={`text-xl font-semibold ${feedbackColor} mb-8 animate-fade-in-up`} style={{ animationDelay: '350ms' }}>{feedbackMessage}</p>

       {isGuest && (
        <div className="mb-8 p-4 bg-primary-light text-primary-text rounded-lg text-sm animate-fade-in-up" style={{ animationDelay: '400ms' }}>
            Tiến độ của bạn không được lưu ở chế độ khách. <button onClick={onRequestSignIn} className="font-bold underline hover:text-primary">Đăng nhập</button> để lưu kết quả!
        </div>
      )}
      
      <div className="flex flex-col sm:flex-row justify-center gap-4 animate-fade-in-up" style={{ animationDelay: '500ms' }}>
         {showReviewButton && (
           <button
            onClick={() => onStartReview(incorrectWords)}
            className="px-6 py-3 font-semibold text-white bg-warning rounded-xl hover:bg-warning-hover transition-colors order-first sm:order-none w-full sm:w-auto"
          >
            Ôn tập {incorrectWords.length} từ sai
          </button>
        )}
        <button
          onClick={onRestart}
          className="px-6 py-3 font-semibold text-secondary bg-surface-muted rounded-xl hover:bg-border transition-colors border border-border"
        >
          {isGuest ? 'Về trang chính' : 'Về Bảng điều khiển'}
        </button>
        <button
          onClick={onRetry}
          className="px-6 py-3 btn-primary"
        >
          Làm lại Test
        </button>
      </div>
    </div>
  );
};

export default ResultsView;