import React from 'react';
import { UserData, AuthUser } from '../types';

interface ProgressViewProps {
  userData: UserData;
  user: AuthUser;
  onBack: () => void;
  onViewAchievements: () => void;
}

const BackArrowIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-2"> <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" /> </svg> );
const TrophyIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 mr-2"><path d="M15.5 2A1.5 1.5 0 0 0 14 3.5v.435a7.51 7.51 0 0 0-3.5-.935h-1A7.51 7.51 0 0 0 6 3.935V3.5A1.5 1.5 0 0 0 4.5 2h-1A1.5 1.5 0 0 0 2 3.5v1c0 .313.04.618.115.906a.75.75 0 0 0 .348.495l1.836.918A6.013 6.013 0 0 1 6 10.435V12a1.5 1.5 0 0 0 1.5 1.5h5A1.5 1.5 0 0 0 14 12v-1.565a6.013 6.013 0 0 1 1.699-2.618l1.838-.918a.75.75 0 0 0 .348-.495A3.982 3.982 0 0 0 18 4.5v-1A1.5 1.5 0 0 0 16.5 2h-1ZM9.5 15v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5V15h3Z" /><path d="M10.5 15h3v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5V15Z" /></svg>);

interface ChartDataPoint {
    label: string;
    value: number;
}

interface LineChartProps {
    data: ChartDataPoint[];
    width?: number;
    height?: number;
    color?: string;
    gradientId: string;
}

const LineChart: React.FC<LineChartProps> = ({ data, width = 300, height = 150, color = "#4338ca", gradientId }) => {
    if (data.length < 2) {
        return <div style={{height}} className="flex items-center justify-center text-slate-500">Cần thêm dữ liệu để vẽ biểu đồ.</div>;
    }

    const PADDING = 20;
    const chartWidth = width - PADDING * 2;
    const chartHeight = height - PADDING * 2;

    const maxValue = Math.max(...data.map(p => p.value), 0);
    const minValue = Math.min(...data.map(p => p.value), 0);
    const valueRange = maxValue - minValue === 0 ? 1 : maxValue - minValue;

    const points = data.map((point, i) => {
        const x = (i / (data.length - 1)) * chartWidth;
        const y = chartHeight - ((point.value - minValue) / valueRange) * chartHeight;
        return `${x},${y}`;
    }).join(' ');

    const lastPoint = data[data.length - 1];
    const lastX = chartWidth;
    const lastY = chartHeight - ((lastPoint.value - minValue) / valueRange) * chartHeight;

    const areaPoints = `${points} ${chartWidth},${chartHeight} 0,${chartHeight}`;

    return (
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto">
             <defs>
                <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={color} stopOpacity={0.2} />
                    <stop offset="100%" stopColor={color} stopOpacity={0} />
                </linearGradient>
            </defs>
            <g transform={`translate(${PADDING}, ${PADDING})`}>
                <polyline
                    fill={`url(#${gradientId})`}
                    stroke="none"
                    points={areaPoints}
                />
                <polyline
                    fill="none"
                    stroke={color}
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    points={points}
                />
                 <circle cx={lastX} cy={lastY} r="5" fill="white" stroke={color} strokeWidth="2.5" />
            </g>
        </svg>
    );
};


const ProgressView: React.FC<ProgressViewProps> = ({ userData, user, onBack, onViewAchievements }) => {
    
    // FIX: Correctly filter out undefined values before flattening the array to get an accurate count.
    const totalTopicsCompleted = Object.values(userData.completedTopics).filter(Array.isArray).flat().length;
    const totalAchievements = Object.keys(userData.unlockedAchievements).length;

    const testScoreData: ChartDataPoint[] = userData.testHistory.slice(-10).map((t, i) => ({ label: `T${i+1}`, value: t.percentage }));
    const speakingScoreData: ChartDataPoint[] = userData.speakingHistory.slice(-10).map((s, i) => ({ label: `S${i+1}`, value: s.score }));
    const fluencyTrendData: ChartDataPoint[] = [{label: 'Start', value: 0}, ...userData.testHistory.slice(-10).map((t, i) => ({ label: `D${i+1}`, value: t.percentage / 100 * 250 + userData.streak * 5 }))];


    return (
        <div className="bg-white dark:bg-slate-800 p-6 sm:p-8 rounded-xl shadow-lg animate-fade-in">
             <div className="flex items-start justify-between mb-8">
                <button 
                    onClick={onBack}
                    className="flex-shrink-0 flex items-center px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-600 transition-colors"
                >
                    <BackArrowIcon />
                    Quay lại
                </button>
                <div className="text-center">
                    <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-100">Tiến độ Học tập</h2>
                    <p className="text-slate-600 dark:text-slate-400 mt-1">của {user.displayName || 'Bạn'}</p>
                </div>
                <div className="w-28 hidden sm:block flex-shrink-0"></div> {/* Spacer */}
            </div>

            {/* Stats Overview */}
             <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-center mb-10">
                <div className="bg-slate-50 dark:bg-slate-700/50 p-6 rounded-lg">
                    <p className="text-4xl font-bold text-orange-500">{userData.streak}</p>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Ngày Streak</p>
                </div>
                <div className="bg-slate-50 dark:bg-slate-700/50 p-6 rounded-lg">
                    <p className="text-4xl font-bold text-yellow-500">{userData.totalXp}</p>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Tổng XP</p>
                </div>
                 <div className="bg-slate-50 dark:bg-slate-700/50 p-6 rounded-lg">
                    <p className="text-4xl font-bold text-indigo-500">{totalTopicsCompleted}</p>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Chủ đề Hoàn thành</p>
                </div>
                <div className="bg-slate-50 dark:bg-slate-700/50 p-6 rounded-lg">
                    <p className="text-4xl font-bold text-green-500">{totalAchievements}</p>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Thành tích</p>
                </div>
            </div>
            
            <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg flex items-center justify-between mb-10">
                <div>
                    <h4 className="font-semibold text-yellow-800 dark:text-yellow-200 flex items-center"><TrophyIcon /> Trung tâm Thành tích</h4>
                    <p className="text-sm text-yellow-700 dark:text-yellow-300">Xem tất cả thành tích và tiến trình của bạn.</p>
                </div>
                <button onClick={onViewAchievements} className="px-4 py-2 text-sm font-semibold bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors">
                    Xem
                </button>
            </div>

            {/* Performance Trends */}
             <div>
                <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-200 mb-4">Xu hướng Hiệu suất</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-slate-50 dark:bg-slate-700/50 p-4 rounded-lg">
                        <h4 className="font-bold text-slate-700 dark:text-slate-300 mb-2">Fluency Score</h4>
                        <LineChart data={fluencyTrendData} color="#4338ca" gradientId="fluencyGrad" />
                    </div>
                     <div className="bg-slate-50 dark:bg-slate-700/50 p-4 rounded-lg">
                        <h4 className="font-bold text-slate-700 dark:text-slate-300 mb-2">Điểm Test (%)</h4>
                        <LineChart data={testScoreData} color="#10b981" gradientId="testGrad" />
                    </div>
                     <div className="bg-slate-50 dark:bg-slate-700/50 p-4 rounded-lg">
                        <h4 className="font-bold text-slate-700 dark:text-slate-300 mb-2">Điểm Nói (Band)</h4>
                        <LineChart data={speakingScoreData} color="#a855f7" gradientId="speakingGrad" />
                    </div>
                </div>
             </div>

        </div>
    );
};

export default ProgressView;