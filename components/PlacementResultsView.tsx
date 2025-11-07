import React from 'react';
import { IELTSLevel } from '../types';

interface PlacementResultsViewProps {
  recommendedLevel: IELTSLevel;
  onAccept: (level: IELTSLevel) => void;
  onReject: () => void;
}

const PlacementResultsView: React.FC<PlacementResultsViewProps> = ({ recommendedLevel, onAccept, onReject }) => {
  return (
    <div className="text-center bg-surface p-8 rounded-xl shadow-lg border border-border animate-fade-in-up">
      <h2 className="text-3xl font-bold text-primary mb-4">Đã hoàn thành kiểm tra!</h2>
      <p className="text-lg text-secondary mb-6">Dựa trên kết quả của bạn, chúng tôi đề xuất bạn nên bắt đầu với:</p>
      
      <div className="my-8">
        <div className="inline-block bg-primary-light text-primary-text font-bold text-3xl px-8 py-4 rounded-lg border border-border-hover">
            {recommendedLevel}
        </div>
      </div>
      
      <p className="text-secondary mb-8 max-w-md mx-auto">Bạn có thể bắt đầu học ở cấp độ này hoặc chọn một cấp độ khác nếu bạn muốn.</p>

      <div className="flex flex-col sm:flex-row justify-center gap-4">
        <button
          onClick={() => onAccept(recommendedLevel)}
          className="px-6 py-3 font-semibold text-white bg-primary rounded-lg hover:bg-primary-hover transition-colors"
        >
          Bắt đầu với cấp độ này
        </button>
        <button
          onClick={onReject}
          className="px-6 py-3 font-semibold text-secondary bg-surface-muted rounded-lg hover:bg-border transition-colors"
        >
          Để tôi tự chọn
        </button>
      </div>
    </div>
  );
};

export default PlacementResultsView;