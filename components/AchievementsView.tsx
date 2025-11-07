import React from 'react';
import { UserData, AchievementCategory } from '../types';
import { ALL_ACHIEVEMENTS } from '../data/achievements';

interface AchievementsViewProps {
  userData: UserData;
  onBack: () => void;
}

const BackArrowIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-2"> <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" /> </svg> );

const getTierColor = (tier: string) => {
    switch(tier) {
        case 'Bronze': return 'border-amber-700';
        case 'Silver': return 'border-slate-400';
        case 'Gold': return 'border-yellow-500';
        default: return 'border-slate-300';
    }
}
const getProgressBarColor = (tier: string) => {
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
        <div className="bg-white dark:bg-slate-800 p-6 sm:p-8 rounded-xl shadow-lg animate-fade-in">
             <div className="flex items-center justify-between mb-6">
                <button 
                    onClick={onBack}
                    className="flex items-center px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-600 transition-colors"
                >
                    <BackArrowIcon />
                    Quay lại
                </button>
                <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-100">Trung tâm Thành tích</h2>
                <div className="w-28 hidden sm:block"></div> {/* Spacer */}
            </div>

            <div className="text-center mb-8">
                <p className="text-lg text-slate-600 dark:text-slate-400">Bạn đã mở khóa</p>
                <p className="text-5xl font-bold text-yellow-500">{unlockedCount} / {totalCount}</p>
                <p className="text-lg text-slate-600 dark:text-slate-400">thành tích</p>
            </div>

            <div className="space-y-8">
                {Object.entries(achievementsByCategory).map(([category, achievements]) => (
                    <div key={category}>
                        <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200 mb-4">{category}</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {achievements.map(ach => {
                                const isUnlocked = !!userData.unlockedAchievements[ach.id];
                                const currentProgress = ach.getCurrentProgress(userData);
                                const progressPercentage = Math.min((currentProgress / ach.totalSteps) * 100, 100);
                                const unlockedDate = isUnlocked ? new Date(userData.unlockedAchievements[ach.id]).toLocaleDateString('vi-VN') : null;

                                return (
                                    <div key={ach.id} className={`p-4 rounded-lg flex items-start gap-4 transition-all ${isUnlocked ? 'bg-yellow-50 dark:bg-yellow-900/20' : 'bg-slate-50 dark:bg-slate-700/50'}`}>
                                        <div className={`flex-shrink-0 p-2 rounded-full border-4 ${getTierColor(ach.tier)} ${!isUnlocked && 'opacity-50'}`}>
                                            {ach.icon(isUnlocked)}
                                        </div>
                                        <div className="flex-grow">
                                            <h4 className={`font-bold ${isUnlocked ? 'text-slate-800 dark:text-slate-100' : 'text-slate-600 dark:text-slate-300'}`}>{ach.name}</h4>
                                            <p className="text-sm text-slate-500 dark:text-slate-400 mb-2">{ach.description}</p>
                                            
                                            {isUnlocked ? (
                                                <p className="text-xs font-semibold text-green-600 dark:text-green-400">Đã mở khóa vào {unlockedDate}</p>
                                            ) : (
                                                <div>
                                                    <div className="w-full bg-slate-200 dark:bg-slate-600 rounded-full h-2 my-1">
                                                        <div className={`h-2 rounded-full ${getProgressBarColor(ach.tier)}`} style={{ width: `${progressPercentage}%` }}></div>
                                                    </div>
                                                    <p className="text-xs text-slate-500 dark:text-slate-400">{currentProgress} / {ach.totalSteps}</p>
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