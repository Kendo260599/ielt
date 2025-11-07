import React, { useEffect, useState } from 'react';
import { Achievement } from '../types';

interface AchievementToastProps {
  achievement: Achievement;
}

const AchievementToast: React.FC<AchievementToastProps> = ({ achievement }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (achievement) {
      setVisible(true);
      const timer = setTimeout(() => {
        setVisible(false);
      }, 4500); // A little less than the parent timer to allow for exit animation
      return () => clearTimeout(timer);
    }
  }, [achievement]);

  if (!achievement) return null;

  return (
    <div
      className={`fixed top-5 right-5 z-50 flex items-center gap-4 w-full max-w-sm p-4 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-yellow-300 dark:border-yellow-600 transition-all duration-500 ${
        visible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
      }`}
    >
      <div className="flex-shrink-0">{achievement.icon(true)}</div>
      <div>
        <p className="font-bold text-yellow-600 dark:text-yellow-400">Thành tích Mở khóa!</p>
        <h3 className="font-semibold text-gray-800 dark:text-gray-100">{achievement.name}</h3>
        <p className="text-sm text-gray-600 dark:text-gray-300">{achievement.description}</p>
      </div>
    </div>
  );
};

export default AchievementToast;