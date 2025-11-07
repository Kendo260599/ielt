import React from 'react';
import { IELTSLevel } from '../types';

interface PlacementResultsViewProps {
  recommendedLevel: IELTSLevel;
  onAccept: (level: IELTSLevel) => void;
  onReject: () => void;
}

const PlacementResultsView: React.FC<PlacementResultsViewProps> = ({ recommendedLevel, onAccept, onReject }) => {
  return (
    <div className="text-center bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg animate-fade-in">
      <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-4">Đã hoàn thành kiểm tra!</h2>
      <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">Dựa trên kết quả của bạn, chúng tôi đề xuất bạn nên bắt đầu với:</p>
      
      <div className="my-8">
        <div className="inline-block bg-indigo-100 dark:bg-indigo-900/40 text-indigo-800 dark:text-indigo-300 font-bold text-3xl px-8 py-4 rounded-lg border border-indigo-300 dark:border-indigo-700">
            {recommendedLevel}
        </div>
      </div>
      
      <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-md mx-auto">Bạn có thể bắt đầu học ở cấp độ này hoặc chọn một cấp độ khác nếu bạn muốn.</p>

      <div className="flex flex-col sm:flex-row justify-center gap-4">
        <button
          onClick={() => onAccept(recommendedLevel)}
          className="px-6 py-3 font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors"
        >
          Bắt đầu với cấp độ này
        </button>
        <button
          onClick={onReject}
          className="px-6 py-3 font-semibold text-gray-700 dark:text-gray-200 bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
        >
          Để tôi tự chọn
        </button>
      </div>
    </div>
  );
};

export default PlacementResultsView;