import React from 'react';

interface SpeakingIntroViewProps {
  onStart: () => void;
  onCancel: () => void;
}

const SpeakingIntroView: React.FC<SpeakingIntroViewProps> = ({ onStart, onCancel }) => {
  return (
    <div className="bg-surface p-6 sm:p-8 rounded-xl shadow-lg border border-border text-center animate-fade-in-up">
      <h2 className="text-2xl sm:text-3xl font-bold text-primary mb-2">IELTS Speaking Simulator</h2>
      <p className="text-secondary mb-6 sm:mb-8">Sẵn sàng cho một bài thi nói mô phỏng đầy đủ?</p>
      
      <div className="text-left bg-surface-muted p-6 rounded-lg space-y-4 mb-8">
        <div className="flex items-start">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold mr-4">1</div>
            <div>
                <h3 className="font-semibold text-primary">Part 1: Introduction & Interview</h3>
                <p className="text-sm text-secondary">Bạn sẽ trả lời các câu hỏi chung về bản thân, gia đình, công việc, v.v.</p>
            </div>
        </div>
        <div className="flex items-start">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold mr-4">2</div>
            <div>
                <h3 className="font-semibold text-primary">Part 2: Individual Long Turn</h3>
                <p className="text-sm text-secondary">Bạn sẽ nhận một chủ đề hình ảnh, có 1 phút để chuẩn bị và sau đó nói trong 1-2 phút.</p>
            </div>
        </div>
         <div className="flex items-start">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold mr-4">3</div>
            <div>
                <h3 className="font-semibold text-primary">Part 3: Two-way Discussion</h3>
                <p className="text-sm text-secondary">Bạn sẽ thảo luận các câu hỏi trừu tượng hơn liên quan đến chủ đề ở Part 2.</p>
            </div>
        </div>
      </div>

      <div className="space-y-4 max-w-sm mx-auto">
        <button
          onClick={onStart}
          className="w-full py-4 px-6 text-lg font-semibold text-white bg-primary rounded-lg shadow-md hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transform hover:-translate-y-1 transition-all duration-200 ease-in-out"
        >
          Bắt đầu Thi
        </button>
        <button
          onClick={onCancel}
          className="w-full py-3 px-6 text-md font-medium text-secondary hover:text-primary transition-colors"
        >
          Quay lại
        </button>
      </div>
    </div>
  );
};

export default SpeakingIntroView;