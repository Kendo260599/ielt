import React from 'react';

interface IntroViewProps {
  onStartTest: () => void;
  onSkip: () => void;
}

const IntroView: React.FC<IntroViewProps> = ({ onStartTest, onSkip }) => {
  return (
    <div className="bg-white dark:bg-gray-800 p-8 sm:p-12 rounded-xl shadow-lg text-center animate-fade-in">
      <div className="w-24 h-24 mx-auto mb-6 bg-indigo-100 dark:bg-indigo-900/30 rounded-full flex items-center justify-center">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-12 h-12 text-indigo-600 dark:text-indigo-400">
            <path d="M11.25 4.533A9.707 9.707 0 0 0 6 3a9.735 9.735 0 0 0-3.25.555.75.75 0 0 0-.5.707v14.5a.75.75 0 0 0 .5.707A9.735 9.735 0 0 0 6 21a9.707 9.707 0 0 0 5.25-1.533v-1.162A.75.75 0 0 0 10.5 17.5v-1.5a.75.75 0 0 0-1.5 0v.338a7.22 7.22 0 0 1-3-.517.75.75 0 0 0-.527.24-1.5 1.5 0 0 0-.22 2.192A8.235 8.235 0 0 1 6 19.5a8.235 8.235 0 0 1-1.25-.138v-2.31a.75.75 0 0 0-1.5 0v2.31A9.735 9.735 0 0 0 6 21a9.707 9.707 0 0 0 5.25-1.533V18a.75.75 0 0 0 .75-.75V6a.75.75 0 0 0-.75-.75h-1.5V4.533Z" />
            <path d="M12.75 4.533A9.707 9.707 0 0 0 18 3a9.735 9.735 0 0 0 3.25.555.75.75 0 0 1 .5.707v14.5a.75.75 0 0 1-.5.707A9.735 9.735 0 0 1 18 21a9.707 9.707 0 0 1-5.25-1.533v-1.162a.75.75 0 0 1 .75.75v1.5a.75.75 0 0 1 1.5 0v-.338a7.22 7.22 0 0 0 3-.517.75.75 0 0 1 .527.24-1.5 1.5 0 0 1 .22 2.192A8.235 8.235 0 0 0 18 19.5a8.235 8.235 0 0 0 1.25-.138v-2.31a.75.75 0 0 1 1.5 0v2.31A9.735 9.735 0 0 1 18 21a9.707 9.707 0 0 1-5.25-1.533V18a.75.75 0 0 1-.75-.75V6a.75.75 0 0 1 .75-.75h1.5V4.533Z" />
        </svg>
      </div>

      <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">Chào mừng đến với IELTS Scholar!</h2>
      <p className="text-gray-600 dark:text-gray-400 mb-8 sm:mb-10">Nâng cao vốn từ vựng của bạn một cách hiệu quả và thông minh.</p>
      
      <div className="space-y-4 max-w-sm mx-auto">
        <button
          onClick={onStartTest}
          className="w-full py-4 px-6 text-lg font-semibold text-white bg-indigo-600 rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-800 transform hover:-translate-y-1 transition-all duration-200 ease-in-out"
        >
          Làm bài kiểm tra trình độ
        </button>
        <button
          onClick={onSkip}
          className="w-full py-3 px-6 text-md font-medium text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
        >
          Tôi muốn tự chọn cấp độ
        </button>
      </div>

      <div className="mt-10 text-left text-sm text-gray-500 dark:text-gray-400 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
          <h4 className="font-semibold text-gray-700 dark:text-gray-200 mb-2">Tại sao nên làm bài kiểm tra trình độ?</h4>
          <p>Bài kiểm tra nhanh này sẽ giúp chúng tôi xác định trình độ từ vựng hiện tại của bạn và đề xuất một band điểm phù hợp để bắt đầu, giúp bạn học hiệu quả hơn.</p>
      </div>
    </div>
  );
};

export default IntroView;