import React from 'react';
import { IELTSLevel } from '../types';
import { IELTS_LEVELS } from '../constants';

interface LevelSelectorProps {
  onSelectLevel: (level: IELTSLevel) => void;
  onBack: () => void;
}

const BackArrowIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-2"> <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" /> </svg> );

const levelDetails = {
    'Band 5.0-5.5': { icon: '🌱', description: 'Nền tảng vững chắc', color: 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300', hover: 'hover:border-green-500' },
    'Band 6.0-6.5': { icon: '🚀', description: 'Tăng tốc hiệu quả', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300', hover: 'hover:border-blue-500'},
    'Band 7.0-7.5': { icon: '🎯', description: 'Chinh phục mục tiêu', color: 'bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300', hover: 'hover:border-purple-500'},
    'Band 8.0+': { icon: '🏆', description: 'Bậc thầy ngôn ngữ', color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300', hover: 'hover:border-yellow-500' },
};

const LevelSelector: React.FC<LevelSelectorProps> = ({ onSelectLevel, onBack }) => {
  return (
    <div className="bg-surface p-6 sm:p-8 rounded-2xl shadow-lg border border-border text-center animate-scale-in">
       <div className="relative flex justify-center items-center mb-6 sm:mb-8">
            <button 
                onClick={onBack}
                className="absolute left-0 flex items-center px-4 py-2 text-sm font-medium text-secondary bg-surface rounded-lg border border-border hover:bg-surface-muted transition-colors"
            >
                <BackArrowIcon />
                Quay lại
            </button>
            <div className="text-center">
                <h2 className="text-2xl sm:text-3xl font-bold text-primary mb-1">Mục tiêu của bạn</h2>
                <p className="text-secondary">Vui lòng chọn band điểm IELTS mục tiêu.</p>
            </div>
        </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {IELTS_LEVELS.map((level) => (
          <button
            key={level}
            onClick={() => onSelectLevel(level)}
            className={`group w-full p-6 text-center bg-surface rounded-2xl shadow-sm border-2 border-border hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 ${levelDetails[level].hover}`}
          >
            <div className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center ${levelDetails[level].color} transition-colors`}>
                <span className="text-4xl">{levelDetails[level].icon}</span>
            </div>
            <h3 className="text-xl font-bold text-primary">{level}</h3>
            <p className="text-sm text-secondary">{levelDetails[level].description}</p>
          </button>
        ))}
      </div>
    </div>
  );
};

export default LevelSelector;