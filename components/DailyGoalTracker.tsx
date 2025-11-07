import React from 'react';

interface DailyGoalTrackerProps {
  xpToday: number;
  dailyGoal: number;
  completed: boolean;
}

const CheckIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5"> <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.052-.143Z" clipRule="evenodd" /> </svg> );

const DailyGoalTracker: React.FC<DailyGoalTrackerProps> = ({ xpToday, dailyGoal, completed }) => {
  const progress = Math.min((xpToday / dailyGoal) * 100, 100);

  return (
    <div className="bg-surface p-4 rounded-2xl border border-border">
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-bold text-primary">Mục tiêu hôm nay</h3>
        {completed ? (
          <div className="flex items-center gap-1 text-sm font-semibold text-success-text bg-success-light px-2 py-1 rounded-full">
            <CheckIcon />
            <span>Hoàn thành!</span>
          </div>
        ) : (
          <span className="text-sm font-semibold text-secondary">
            {xpToday} / {dailyGoal} XP
          </span>
        )}
      </div>
      <div className="w-full bg-surface-muted rounded-full h-4 border border-border p-0.5">
        <div
          className={`h-full rounded-full transition-all duration-500 ${completed ? 'bg-success' : 'bg-yellow-400'}`}
          style={{ width: `${progress}%` }}
        ></div>
      </div>
    </div>
  );
};

export default DailyGoalTracker;