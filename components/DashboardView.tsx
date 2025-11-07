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

const BookIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" /></svg>);
const TutorIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10"><path strokeLinecap="round" strokeLinejoin="round" d="M8.625 9.75a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>);
const LeaderboardIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10"><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 18.75h-9a9.75 9.75 0 0 0 9 0Z" /><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 15.75c0-1.355-1.095-2.45-2.45-2.45H6.95c-1.355 0-2.45 1.095-2.45 2.45 0 1.355 1.095 2.45 2.45 2.45h10.1c1.355 0 2.45-1.095 2.45-2.45Zm-5.088-3.328-1.033-.516a1.875 1.875 0 0 0-1.758 0l-1.033.516a1.875 1.875 0 0 0-1.042 1.633v1.981a.75.75 0 0 0 .75.75h3.042a.75.75 0 0 0 .75-.75v-1.981a1.875 1.875 0 0 0-1.042-1.633Z" /><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.75a2.25 2.25 0 1 1 0 4.5 2.25 2.25 0 0 1 0-4.5Z" /></svg>);
const ReviewIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-2"><path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 11.667 0l3.181-3.183m-4.991-2.69a8.25 8.25 0 0 0-11.667 0l-3.181 3.183" /></svg>);

const WelcomeHeader: React.FC<{name: string}> = ({name}) => {
    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return "Chào buổi sáng";
        if (hour < 18) return "Chào buổi chiều";
        return "Chào buổi tối";
    }

    return (
        <div className="bg-gradient-to-r from-primary to-blue-400 p-6 rounded-2xl text-white shadow-lg mb-8">
            <h2 className="text-3xl font-bold">{getGreeting()}, {name}!</h2>
            <p className="opacity-90 mt-1">Sẵn sàng chinh phục IELTS ngay hôm nay nào!</p>
        </div>
    )
}

const DashboardView: React.FC<DashboardViewProps> = ({ userData, user, onSelectLevel, onStartPractice, onStartWeaknessReview, onViewLeaderboard, onStartTutorChat, onStartSrsReview, wordsDueForReview }) => {
    
    const isGuest = !user;
    const weakVocabCount = userData.weakPoints?.vocabulary?.length || 0;
    const today = new Date().toISOString().split('T')[0];
    const xpToday = userData.xpToday?.date === today ? userData.xpToday.xp : 0;
    const goalCompleted = userData.dailyGoalCompleted?.date === today && userData.dailyGoalCompleted.completed;

    return (
        <div className="animate-fade-in-up space-y-8">
            <WelcomeHeader name={user?.displayName?.split(' ')[0] || 'bạn'} />
            
            {/* Main Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column: Main Actions */}
                <div className="lg:col-span-2 space-y-6">
                     <ActionCard 
                        icon={<BookIcon />} 
                        title="Học từ vựng mới" 
                        description="Khám phá các chủ đề và bắt đầu bài học của bạn." 
                        onClick={onSelectLevel} 
                        color="text-primary"
                        buttonText="Bắt đầu học"
                     />
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                         <ActionCard 
                            icon={<TutorIcon />} 
                            title="Gia sư AI" 
                            description="Hỏi và giải đáp thắc mắc." 
                            onClick={onStartTutorChat} 
                            isGuest={isGuest} 
                            color="text-purple-500"
                            buttonText="Trò chuyện"
                         />
                         <ActionCard 
                            icon={<LeaderboardIcon />} 
                            title="Bảng xếp hạng" 
                            description="Thi đua với mọi người." 
                            onClick={onViewLeaderboard} 
                            isGuest={isGuest} 
                            color="text-yellow-500"
                            buttonText="Xem hạng"
                         />
                     </div>
                </div>

                {/* Right Column: Stats & Reviews */}
                <div className="space-y-6">
                     <div className="bg-surface p-6 rounded-2xl border border-border flex flex-col items-center gap-4 text-center">
                        <h3 className="text-xl font-bold text-primary">Điểm Lưu Loát</h3>
                        <FluencyScoreGauge score={userData.fluencyScore} />
                        <p className="text-sm text-secondary">{isGuest ? "Đăng nhập để theo dõi điểm." : "Thước đo toàn diện về sự tiến bộ."}</p>
                    </div>

                    {!isGuest && <DailyGoalTracker xpToday={xpToday} dailyGoal={userData.dailyGoal} completed={goalCompleted} />}
                    
                    <div className={`bg-surface p-4 rounded-2xl border border-border ${isGuest ? 'opacity-60' : ''}`}>
                        <h4 className="font-semibold text-primary mb-2 flex items-center"><ReviewIcon /> Ôn tập Hàng ngày</h4>
                        <p className="text-sm text-secondary mb-3">
                           {isGuest ? "Đăng nhập để sử dụng tính năng này." : (wordsDueForReview > 0 ? `Bạn có ${wordsDueForReview} từ cần ôn tập.` : "Tuyệt vời! Bạn đã hoàn thành.")}
                        </p>
                        <button onClick={onStartSrsReview} disabled={isGuest || wordsDueForReview === 0} className="w-full btn-primary py-2 text-sm">
                            Bắt đầu ôn tập
                        </button>
                    </div>

                     <div className={`bg-surface p-4 rounded-2xl border border-border ${isGuest || weakVocabCount === 0 ? 'opacity-60' : ''}`}>
                        <h4 className="font-semibold text-primary mb-2">Ôn tập điểm yếu</h4>
                        <p className="text-sm text-secondary mb-3">
                           {isGuest ? "Đăng nhập để sử dụng." : `Bạn có ${weakVocabCount} từ cần xem lại.`}
                        </p>
                        <button onClick={onStartWeaknessReview} disabled={isGuest || weakVocabCount === 0} className="w-full bg-orange-500 text-white font-bold py-2 rounded-xl border-b-4 border-orange-700 hover:bg-orange-600 transition-transform duration-150 ease-in-out active:translate-y-0.5 active:border-b-2 text-sm">
                            Ôn tập
                        </button>
                    </div>
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
    color: string;
    buttonText: string;
}
const ActionCard: React.FC<ActionCardProps> = ({ icon, title, description, onClick, isGuest, color, buttonText }) => (
    <div 
        className={`bg-surface p-6 rounded-2xl border border-border transition-all duration-300 flex flex-col ${isGuest ? 'opacity-70' : ''}`}
        title={isGuest ? 'Đăng nhập để sử dụng tính năng này' : ''}
    >
        <div className={`w-16 h-16 flex items-center justify-center rounded-xl mb-4 ${color}`}>
            {icon}
        </div>
        <h4 className="font-bold text-xl text-primary">{title}</h4>
        <p className="text-secondary text-sm flex-grow mb-4">{description}</p>
        <button 
          onClick={onClick}
          disabled={isGuest}
          className="w-full btn-primary py-2 mt-auto"
        >
          {buttonText}
        </button>
    </div>
);

export default DashboardView;