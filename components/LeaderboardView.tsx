import React, { useState, useEffect } from 'react';
import { LeaderboardEntry } from '../types';
import { fetchLeaderboardData } from '../services/geminiService';
import Spinner from './Spinner';

interface LeaderboardViewProps {
  currentUserScore: number;
  onBack: () => void;
}

const BackArrowIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-2"> <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" /> </svg> );
const TrophyIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-yellow-400"><path d="M15.5 2A1.5 1.5 0 0 0 14 3.5v.435a7.51 7.51 0 0 0-3.5-.935h-1A7.51 7.51 0 0 0 6 3.935V3.5A1.5 1.5 0 0 0 4.5 2h-1A1.5 1.5 0 0 0 2 3.5v1c0 .313.04.618.115.906a.75.75 0 0 0 .348.495l1.836.918A6.013 6.013 0 0 1 6 10.435V12a1.5 1.5 0 0 0 1.5 1.5h5A1.5 1.5 0 0 0 14 12v-1.565a6.013 6.013 0 0 1 1.699-2.618l1.838-.918a.75.75 0 0 0 .348-.495A3.982 3.982 0 0 0 18 4.5v-1A1.5 1.5 0 0 0 16.5 2h-1ZM9.5 15v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5V15h3Z" /><path d="M10.5 15h3v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5V15Z" /></svg> );


const LeaderboardView: React.FC<LeaderboardViewProps> = ({ currentUserScore, onBack }) => {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadLeaderboard = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await fetchLeaderboardData(currentUserScore);
        setLeaderboard(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Lỗi không xác định');
      } finally {
        setIsLoading(false);
      }
    };
    loadLeaderboard();
  }, [currentUserScore]);

  const getRankColor = (rank: number) => {
    if (rank === 1) return 'text-yellow-400';
    if (rank === 2) return 'text-gray-400';
    if (rank === 3) return 'text-amber-600';
    return 'text-gray-500';
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-6 sm:p-8 rounded-xl shadow-lg animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={onBack}
          className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
        >
          <BackArrowIcon />
          Quay lại
        </button>
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100">Bảng xếp hạng</h2>
        <div className="w-28 hidden sm:block"></div> {/* Spacer */}
      </div>

      {isLoading && <Spinner message="Đang tải bảng xếp hạng..." />}
      {error && <p className="text-center text-red-500">{error}</p>}
      {!isLoading && !error && (
        <div className="space-y-2">
          {leaderboard.map((entry) => (
            <div
              key={entry.rank}
              className={`flex items-center p-3 rounded-lg transition-colors ${
                entry.isCurrentUser
                  ? 'bg-indigo-100 dark:bg-indigo-900/40 border-2 border-indigo-500'
                  : 'bg-gray-50 dark:bg-gray-700/50'
              }`}
            >
              <div className="w-10 text-center">
                <span className={`text-lg font-bold ${getRankColor(entry.rank)}`}>
                  {entry.rank}
                </span>
              </div>
              <div className="flex-grow mx-4">
                <p className="font-semibold text-gray-800 dark:text-gray-200">{entry.name}</p>
              </div>
              <div className="flex items-center font-bold text-indigo-600 dark:text-indigo-400">
                <TrophyIcon />
                <span className="ml-2">{entry.fluencyScore}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default LeaderboardView;