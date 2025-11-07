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

  if (percentage >= 80) {
      feedbackMessage = "Xuất sắc! Bạn đã nắm vững các từ vựng này.";
      feedbackColor = "text-green-600 dark:text-green-400";
  } else if (percentage >= 60) {
      feedbackMessage = "Làm tốt lắm! Luyện tập thêm một chút nữa sẽ trở nên hoàn hảo.";
      feedbackColor = "text-yellow-600 dark:text-yellow-400";
  } else {
      feedbackMessage = "Hãy tiếp tục luyện tập! Ôn lại các từ và thử lại bài kiểm tra nhé.";
      feedbackColor = "text-red-600 dark:text-red-400";
  }
  
  const showReviewButton = incorrectWords.length > 0;


  return (
    <div className="text-center bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg animate-fade-in">
      <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-2 animate-fade-in-up">Hoàn thành bài Test!</h2>
      {!isGuest && <p className="text-lg text-yellow-500 font-bold mb-4 animate-fade-in-up" style={{ animationDelay: '100ms' }}>+{xpGained} XP</p>}
      
      <div className="relative w-40 h-40 mx-auto mb-6 animate-fade-in-up" style={{ animationDelay: '200ms' }}>
        <svg className="w-full h-full" viewBox="0 0 36 36">
           <defs>
            <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor={percentage >= 60 ? '#f59e0b' : '#ef4444'} />
                <stop offset="100%" stopColor={percentage >= 80 ? '#22c55e' : (percentage >=60 ? '#facc15' : '#f87171')} />
            </linearGradient>
           </defs>
          <path
            className="text-gray-200 dark:text-gray-700"
            d="M18 2.0845
              a 15.9155 15.9155 0 0 1 0 31.831
              a 15.9155 15.9155 0 0 1 0 -31.831"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
          />
          <path
            d="M18 2.0845
              a 15.9155 15.9155 0 0 1 0 31.831
              a 15.9155 15.9155 0 0 1 0 -31.831"
            fill="none"
            stroke="url(#scoreGradient)"
            strokeWidth="3"
            strokeDasharray={`${percentage}, 100`}
            strokeLinecap="round"
            style={{transition: 'stroke-dasharray 0.5s ease-in-out'}}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-4xl font-bold text-gray-800 dark:text-gray-100">{score}
            <span className="text-xl text-gray-500 dark:text-gray-400">/{totalQuestions}</span></span>
        </div>
      </div>
      
      <p className={`text-lg font-semibold ${feedbackColor} mb-8 animate-fade-in-up`} style={{ animationDelay: '350ms' }}>{feedbackMessage}</p>

       {isGuest && (
        <div className="mb-8 p-4 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-lg text-sm animate-fade-in-up" style={{ animationDelay: '400ms' }}>
            Tiến độ của bạn không được lưu ở chế độ khách. <button onClick={onRequestSignIn} className="font-bold underline hover:text-blue-500">Đăng nhập</button> để lưu kết quả và cải thiện Điểm Lưu Loát của bạn!
        </div>
      )}

      <div className="flex flex-col sm:flex-row justify-center gap-4 animate-fade-in-up" style={{ animationDelay: '500ms' }}>
        <button
          onClick={onRestart}
          className="px-6 py-3 font-semibold text-gray-700 dark:text-gray-200 bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
        >
          {isGuest ? 'Về trang chính' : 'Về Bảng điều khiển'}
        </button>
        <button
          onClick={onRetry}
          className="px-6 py-3 font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors"
        >
          Làm lại Test
        </button>
        {showReviewButton && (
           <button
            onClick={() => onStartReview(incorrectWords)}
            className="px-6 py-3 font-semibold text-white bg-orange-500 rounded-lg hover:bg-orange-600 transition-colors order-first sm:order-none w-full sm:w-auto"
          >
            Ôn tập {incorrectWords.length} từ sai
          </button>
        )}
      </div>
    </div>
  );
};

export default ResultsView;
