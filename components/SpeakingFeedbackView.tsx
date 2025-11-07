import React from 'react';
import { SpeakingFeedback } from '../types';

interface SpeakingFeedbackViewProps {
  feedback: SpeakingFeedback;
  onRestart: () => void;
  onBack: () => void;
}

interface CriterionCardProps {
    title: string;
    score: number;
    feedbackText: string;
    colorClass: string;
    textColorClass: string;
}

const LightbulbIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 mr-2"> <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 0 0 1.5-.189m-1.5.189a6.01 6.01 0 0 1-1.5-.189m3.75 7.478a12.06 12.06 0 0 1-4.5 0m3.75 2.311a7.5 7.5 0 0 1-7.5 0c-1.421-.664-2.58-1.89-3.236-3.354a7.5 7.5 0 0 1-1.255-5.254V8.25a7.5 7.5 0 0 1 15 0v3.398a7.5 7.5 0 0 1-1.255 5.254 7.5 7.5 0 0 1-3.236 3.354Z" /> </svg> );

const CriterionCard: React.FC<CriterionCardProps> = ({ title, score, feedbackText, colorClass, textColorClass }) => (
    <div className={`bg-surface-muted p-4 rounded-lg border-l-4 ${colorClass}`}>
        <div className="flex justify-between items-center mb-2">
            <h3 className="text-lg font-semibold text-primary">{title}</h3>
            <span className={`text-xl font-bold ${textColorClass}`}>{score.toFixed(1)}</span>
        </div>
        <p className="text-sm text-secondary">{feedbackText}</p>
    </div>
);


const SpeakingFeedbackView: React.FC<SpeakingFeedbackViewProps> = ({ feedback, onRestart, onBack }) => {
  return (
    <div className="bg-surface p-6 sm:p-8 rounded-xl shadow-lg border border-border animate-fade-in-up">
        <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-primary mb-2">Phân tích Kết quả</h2>
            <p className="text-secondary">Đây là đánh giá chi tiết về phần thi nói của bạn.</p>
            <div className="mt-6 inline-block bg-surface-muted p-6 rounded-full">
                <p className="text-sm uppercase text-secondary">Overall Band Score</p>
                <p className="text-7xl font-bold text-primary">{feedback.overallBandScore.toFixed(1)}</p>
            </div>
        </div>

        <div className="space-y-4 mb-8">
            <CriterionCard 
                title="Fluency and Coherence"
                score={feedback.fluencyAndCoherence.score}
                feedbackText={feedback.fluencyAndCoherence.feedback}
                colorClass="border-primary"
                textColorClass="text-primary-text"
            />
             <CriterionCard 
                title="Lexical Resource"
                score={feedback.lexicalResource.score}
                feedbackText={feedback.lexicalResource.feedback}
                colorClass="border-success"
                textColorClass="text-success-text"
            />
             <CriterionCard 
                title="Grammatical Range and Accuracy"
                score={feedback.grammaticalRangeAndAccuracy.score}
                feedbackText={feedback.grammaticalRangeAndAccuracy.feedback}
                colorClass="border-purple-500"
                textColorClass="text-purple-500"
            />
             <CriterionCard 
                title="Pronunciation"
                score={feedback.pronunciation.score}
                feedbackText={feedback.pronunciation.feedback}
                colorClass="border-orange-500"
                textColorClass="text-orange-500"
            />
        </div>

        {feedback.suggestions && feedback.suggestions.length > 0 && (
            <div className="mb-8 bg-surface-muted p-4 rounded-lg">
                 <h3 className="text-lg font-semibold text-primary mb-3 flex items-center">
                    <LightbulbIcon />
                    Gợi ý Cải thiện
                 </h3>
                 <ul className="list-disc list-inside space-y-2 text-sm text-secondary">
                    {feedback.suggestions.map((suggestion, index) => (
                        <li key={index}>{suggestion}</li>
                    ))}
                 </ul>
            </div>
        )}

        <div className="flex flex-col sm:flex-row justify-center gap-4">
             <button
                onClick={onBack}
                className="px-6 py-3 font-semibold text-secondary bg-surface-muted rounded-lg hover:bg-border transition-colors"
            >
                Quay lại
            </button>
            <button
                onClick={onRestart}
                className="px-6 py-3 font-semibold text-white bg-primary rounded-lg hover:bg-primary-hover transition-colors"
            >
                Thử lại
            </button>
        </div>
    </div>
  );
};

export default SpeakingFeedbackView;