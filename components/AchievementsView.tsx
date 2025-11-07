import React from 'react';
import { UserData, AchievementCategory, AchievementTier } from '../types';
import { ALL_ACHIEVEMENTS } from '../data/achievements';

interface AchievementsViewProps {
  userData: UserData;
  onBack: () => void;
}

const BackArrowIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-2"> <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" /> </svg> );

const getTierColor = (tier: AchievementTier) => {
    switch(tier) {
        case 'Bronze': return 'border-amber-700';
        case 'Silver': return 'border-slate-400';
        case 'Gold': return 'border-yellow-500';
        default: return 'border-border';
    }
}
const getProgressBarColor = (tier: AchievementTier) => {
    switch(tier) {
        case 'Bronze': return 'bg-amber-700';
        case 'Silver': return 'bg-slate-500';
        case 'Gold': return 'bg-yellow-500';
        default: return 'bg-slate-400';
    }
}


const AchievementsView: React.FC<AchievementsViewProps> = ({ userData, onBack }) => {
    const unlockedCount = Object.keys(userData.unlockedAchievements).length;
    const totalCount = ALL_ACHIEVEMENTS.length;

    const achievementsByCategory = ALL_ACHIEVEMENTS.reduce((acc, ach) => {
        if (!acc[ach.category]) {
            acc[ach.category] = [];
        }
        acc[ach.category].push(ach);
        return acc;
    }, {} as Record<AchievementCategory, typeof ALL_ACHIEVEMENTS>);

    return (
        <div className="bg-surface p-6 sm:p-8 rounded-xl shadow-lg border border-border animate-fade-in-up">
             <div className="flex items-center justify-between mb-6">
                <button 
                    onClick={onBack}
                    className="flex items-center px-4 py-2 text-sm font-medium text-secondary bg-surface rounded-lg border border-border hover:bg-surface-muted transition-colors"
                >
                    <BackArrowIcon />
                    Quay lại
                </button>
                <h2 className="text-2xl sm:text-3xl font-bold text-primary">Trung tâm Thành tích</h2>
                <div className="w-28 hidden sm:block"></div> {/* Spacer */}
            </div>

            <div className="text-center mb-8">
                <p className="text-lg text-secondary">Bạn đã mở khóa</p>
                <p className="text-5xl font-bold text-warning">{unlockedCount} / {totalCount}</p>
                <p className="text-lg text-secondary">thành tích</p>
            </div>

            <div className="space-y-8">
                {Object.entries(achievementsByCategory).map(([category, achievements]) => (
                    <div key={category}>
                        <h3 className="text-xl font-bold text-primary mb-4">{category}</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {achievements.map(ach => {
                                const isUnlocked = !!userData.unlockedAchievements[ach.id];
                                const currentProgress = ach.getCurrentProgress(userData);
                                const progressPercentage = Math.min((currentProgress / ach.totalSteps) * 100, 100);
                                const unlockedDate = isUnlocked ? new Date(userData.unlockedAchievements[ach.id]).toLocaleDateString('vi-VN') : null;

                                return (
                                    <div key={ach.id} className={`p-4 rounded-lg flex items-start gap-4 transition-all ${isUnlocked ? 'bg-warning-light' : 'bg-surface-muted'}`}>
                                        <div className={`flex-shrink-0 p-2 rounded-full border-4 ${getTierColor(ach.tier)} ${!isUnlocked && 'opacity-50'}`}>
                                            {ach.icon(isUnlocked)}
                                        </div>
                                        <div className="flex-grow">
                                            <h4 className={`font-bold ${isUnlocked ? 'text-primary' : 'text-secondary'}`}>{ach.name}</h4>
                                            <p className="text-sm text-secondary mb-2">{ach.description}</p>
                                            
                                            {isUnlocked ? (
                                                <p className="text-xs font-semibold text-success-text">Đã mở khóa vào {unlockedDate}</p>
                                            ) : (
                                                <div>
                                                    <div className="w-full bg-border rounded-full h-2 my-1">
                                                        <div className={`h-2 rounded-full ${getProgressBarColor(ach.tier)}`} style={{ width: `${progressPercentage}%` }}></div>
                                                    </div>
                                                    <p className="text-xs text-secondary">{currentProgress} / {ach.totalSteps}</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AchievementsView;