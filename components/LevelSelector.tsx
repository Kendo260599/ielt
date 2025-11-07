import React from 'react';
import { IELTSLevel } from '../types';
import { IELTS_LEVELS } from '../constants';

interface LevelSelectorProps {
  onSelectLevel: (level: IELTSLevel) => void;
  onBack: () => void;
}

const BackArrowIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-2"> <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" /> </svg> );

const levelDetails = {
    'Band 5.0-5.5': { icon: '🌱', description: 'Nền tảng vững chắc' },
    'Band 6.0-6.5': { icon: '🚀', description: 'Tăng tốc hiệu quả' },
    'Band 7.0-7.5': { icon: '🎯', description: 'Chinh phục mục tiêu' },
    'Band 8.0+': { icon: '🏆', description: 'Bậc thầy ngôn ngữ' },
};

const LevelSelector: React.FC<LevelSelectorProps> = ({ onSelectLevel, onBack }) => {
  return (
    <div className="bg-white dark:bg-gray-800 p-6 sm:p-8 rounded-xl shadow-lg text-center animate-fade-in">
       <div className="relative flex justify-center items-center mb-6 sm:mb-8">
            <button 
                onClick={onBack}
                className="absolute left-0 flex items-center px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
            >
                <BackArrowIcon />
                Quay lại
            </button>
            <div className="text-center">
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">Mục tiêu của bạn</h2>
                <p className="text-gray-600 dark:text-gray-400">Vui lòng chọn band điểm IELTS mục tiêu.</p>
            </div>
        </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {IELTS_LEVELS.map((level) => (
          <button
            key={level}
            onClick={() => onSelectLevel(level)}
            className="group w-full p-6 text-center bg-gray-50 dark:bg-gray-700/50 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 hover:border-indigo-500 dark:hover:border-indigo-500 hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
          >
            <div className="text-4xl mb-3">{levelDetails[level].icon}</div>
            <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100">{level}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">{levelDetails[level].description}</p>
          </button>
        ))}
      </div>
    </div>
  );
};

export default LevelSelector;