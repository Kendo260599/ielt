import React from 'react';
import { UserData, AuthUser } from '../types';
import FluencyScoreGauge from './FluencyScoreGauge';
import DailyGoalTracker from './DailyGoalTracker';

interface DashboardViewProps {
    userData: UserData;
    user: AuthUser | null;
    onSelectLevel: () => void;
    onStartPractice: (topic: string) => void;
    onStartWeaknessReview: () => void;
    onViewLeaderboard: () => void;
    onStartTutorChat: () => void;
    onStartSrsReview: () => void;
    wordsDueForReview: number;
}

const BrainIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-2"><path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456Z" /></svg>);
const FlagIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-2"><path strokeLinecap="round" strokeLinejoin="round" d="M3 3v1.5M3 21v-6m0 0 2.77-.693a9 9 0 0 1 6.208.682l.108.054a9 9 0 0 0 6.086.71l3.114-.732a48.524 48.524 0 0 1-.005-10.499l-3.11.732a9 9 0 0 1-6.085-.711l-.108-.054a9 9 0 0 0-6.208-.682L3 4.5M3 15V4.5" /></svg>);
const NewTopicIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-indigo-500"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>);
const TutorIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-purple-500"><path strokeLinecap="round" strokeLinejoin="round" d="M8.625 9.75a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>);
const LeaderboardIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-yellow-500"><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 18.75h-9a9.75 9.75 0 0 0 9 0Z" /><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 15.75c0-1.355-1.095-2.45-2.45-2.45H6.95c-1.355 0-2.45 1.095-2.45 2.45 0 1.355 1.095 2.45 2.45 2.45h10.1c1.355 0 2.45-1.095 2.45-2.45Zm-5.088-3.328-1.033-.516a1.875 1.875 0 0 0-1.758 0l-1.033.516a1.875 1.875 0 0 0-1.042 1.633v1.981a.75.75 0 0 0 .75.75h3.042a.75.75 0 0 0 .75-.75v-1.981a1.875 1.875 0 0 0-1.042-1.633Z" /><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.75a2.25 2.25 0 1 1 0 4.5 2.25 2.25 0 0 1 0-4.5Z" /></svg>);
const ReviewIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-2"><path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 11.667 0l3.181-3.183m-4.991-2.69a8.25 8.25 0 0 0-11.667 0l-3.181 3.183" /></svg>);


const DashboardView: React.FC<DashboardViewProps> = ({ userData, user, onSelectLevel, onStartPractice, onStartWeaknessReview, onViewLeaderboard, onStartTutorChat, onStartSrsReview, wordsDueForReview }) => {
    
    const isGuest = !user;
    const weakVocabCount = userData.weakPoints?.vocabulary?.length || 0;
    const difficultTopics = Object.values(userData.difficultTopics).flat();
    const today = new Date().toISOString().split('T')[0];
    const xpToday = userData.xpToday?.date === today ? userData.xpToday.xp : 0;
    const goalCompleted = userData.dailyGoalCompleted?.date === today && userData.dailyGoalCompleted.completed;

    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return "Chào buổi sáng!";
        if (hour < 18) return "Chào buổi chiều!";
        return "Chào buổi tối!";
    }

    return (
        <div className="bg-white dark:bg-slate-800 p-6 sm:p-8 rounded-xl shadow-lg animate-fade-in space-y-8">
            <div>
                <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-2">{getGreeting()}</h2>
                <p className="text-slate-600 dark:text-slate-400">Sẵn sàng chinh phục IELTS ngay hôm nay nào!</p>
            </div>
            
            {/* Fluency Score & Daily Goal */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-slate-50 dark:bg-slate-700/50 p-6 rounded-xl flex flex-col items-center gap-4 text-center">
                    <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100">Điểm Lưu Loát</h3>
                    <FluencyScoreGauge score={userData.fluencyScore} />
                    <p className="text-sm text-slate-600 dark:text-slate-400">{isGuest ? "Đăng nhập để theo dõi điểm của bạn." : "Thước đo toàn diện về sự tiến bộ của bạn."}</p>
                </div>
                <div className="space-y-4">
                    <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                        <h4 className="font-semibold text-blue-800 dark:text-blue-200 flex items-center mb-2"><ReviewIcon /> Ôn tập Hàng ngày</h4>
                        <p className="text-sm text-blue-700 dark:text-blue-300 mb-3">
                           {isGuest ? "Đăng nhập để sử dụng tính năng ôn tập cách quãng." : (wordsDueForReview > 0 ? `Bạn có ${wordsDueForReview} từ cần ôn tập để củng cố trí nhớ.` : "Tuyệt vời! Bạn đã hoàn thành tất cả các từ cần ôn tập.")}
                        </p>
                        <button onClick={onStartSrsReview} disabled={isGuest || wordsDueForReview === 0} className="w-full px-4 py-2 text-sm font-semibold bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-slate-400 disabled:cursor-not-allowed transition-colors">
                            Bắt đầu ôn tập
                        </button>
                    </div>
                    {!isGuest && <DailyGoalTracker xpToday={xpToday} dailyGoal={userData.dailyGoal} completed={goalCompleted} />}
                    <div className={`bg-indigo-50 dark:bg-indigo-900/20 p-4 rounded-lg flex items-center justify-between ${isGuest ? 'opacity-60' : ''}`}>
                        <div>
                            <h4 className="font-semibold text-indigo-800 dark:text-indigo-200 flex items-center"><BrainIcon /> Ôn tập điểm yếu</h4>
                            <p className="text-sm text-indigo-700 dark:text-indigo-300">
                                {isGuest ? "Đăng nhập để theo dõi điểm yếu." : `Bạn có ${weakVocabCount} từ cần xem lại.`}
                            </p>
                        </div>
                        <button onClick={onStartWeaknessReview} disabled={isGuest || weakVocabCount === 0} className="px-4 py-2 text-sm font-semibold bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:bg-slate-400 disabled:cursor-not-allowed transition-colors">
                            Ôn tập
                        </button>
                    </div>
                </div>
            </div>

            {/* Main Actions */}
            <div>
                 <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200 mb-4">Học tập & Thi đấu</h3>
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <ActionCard icon={<NewTopicIcon />} title="Chủ đề mới" description="Học từ vựng mới theo chủ đề." onClick={onSelectLevel} />
                    <ActionCard icon={<TutorIcon />} title="AI Tutor" description="Hỏi đáp và giải thích mọi thắc mắc." onClick={onStartTutorChat} isGuest={isGuest} />
                    <ActionCard icon={<LeaderboardIcon />} title="Bảng xếp hạng" description="Xem thứ hạng và thi đua." onClick={onViewLeaderboard} isGuest={isGuest} />
                 </div>
            </div>

        </div>
    );
};

interface ActionCardProps {
    icon: React.ReactNode;
    title: string;
    description: string;
    onClick: () => void;
    isGuest?: boolean;
}
const ActionCard: React.FC<ActionCardProps> = ({ icon, title, description, onClick, isGuest }) => (
    <button 
        onClick={onClick}
        className={`group text-left p-4 rounded-lg bg-slate-50 dark:bg-slate-700/50 hover:bg-white dark:hover:bg-slate-700 hover:shadow-lg border border-slate-200 dark:border-slate-700 transition-all duration-300 ${isGuest ? 'opacity-70' : ''}`}
        title={isGuest ? 'Đăng nhập để sử dụng tính năng này' : ''}
    >
        <div className="w-12 h-12 flex items-center justify-center bg-slate-100 dark:bg-slate-600 rounded-lg mb-3">
            {icon}
        </div>
        <h4 className="font-bold text-lg text-slate-800 dark:text-slate-100">{title}</h4>
        <p className="text-sm text-slate-600 dark:text-slate-400">{description}</p>
    </button>
);

export default DashboardView;
