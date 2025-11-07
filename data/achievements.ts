import React from 'react';
import { Achievement, UserData, AchievementTier, AchievementCategory } from '../types';

const getIconClass = (unlocked: boolean, tier: AchievementTier) => {
    if (!unlocked) return 'text-slate-400';
    switch (tier) {
        case 'Bronze': return 'text-amber-700';
        case 'Silver': return 'text-slate-500';
        case 'Gold': return 'text-yellow-500';
        default: return 'text-slate-400';
    }
}

// --- Icon Components ---
// FIX: Replaced JSX with React.createElement to be compatible with a .ts file extension.
const LearningIcon = (unlocked: boolean, tier: AchievementTier): React.ReactNode => (
    React.createElement('svg', {
        xmlns: "http://www.w3.org/2000/svg",
        viewBox: "0 0 20 20",
        fill: "currentColor",
        className: `w-10 h-10 ${getIconClass(unlocked, tier)}`
    },
        React.createElement('path', {
            d: "M10.362 3.691a.75.75 0 0 0-1.425.808l.384 1.726a1.5 1.5 0 0 1-1.425 1.726 1.5 1.5 0 0 1-1.5-1.5.75.75 0 0 0-1.5 0 3 3 0 0 0 3 3 3 3 0 0 0 2.808-2.143l.384-1.726a.75.75 0 0 0-.626-.951ZM12.5 11.25a.75.75 0 0 0-1.5 0v2.69l-1.125.5-1.125-.5v-2.69a.75.75 0 0 0-1.5 0v3.19a.75.75 0 0 0 .513.714l1.75.875a.75.75 0 0 0 .474 0l1.75-.875a.75.75 0 0 0 .513-.714v-3.19Z"
        }),
        React.createElement('path', {
            fillRule: "evenodd",
            d: "M10 2a.75.75 0 0 1 .75.75v.51a4.493 4.493 0 0 1 2.366 1.483.75.75 0 1 1-1.043 1.081 3 3 0 0 0-1.323-.988V10.5a.75.75 0 0 1-1.5 0V4.836a3 3 0 0 0-1.323.988.75.75 0 1 1-1.043-1.081A4.493 4.493 0 0 1 8.5 2.76v-.51A.75.75 0 0 1 9.25 2H10ZM10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Z",
            clipRule: "evenodd"
        })
    )
);
const StreakIcon = (unlocked: boolean, tier: AchievementTier): React.ReactNode => (
    React.createElement('svg', {
        xmlns: "http://www.w3.org/2000/svg",
        viewBox: "0 0 20 20",
        fill: "currentColor",
        className: `w-10 h-10 ${getIconClass(unlocked, tier)}`
    },
        React.createElement('path', {
            fillRule: "evenodd",
            d: "M10 2c-1.716 0-3.408.106-5.07.31C3.806 2.45 3 3.414 3 4.517V5.25a.75.75 0 0 0 1.5 0V4.517c0-.28.164-.533.41-.631A20.74 20.74 0 0 1 10 3.5c1.64 0 3.26.095 4.839.277.247.1.411.35.411.631V5.25a.75.75 0 0 0 1.5 0V4.517c0-1.103-.806-2.068-1.93-2.207A21.91 21.91 0 0 0 10 2Z",
            clipRule: "evenodd"
        }),
        React.createElement('path', {
            d: "M5.53 5.603a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.06 0l2.25-2.25a.75.75 0 0 0-1.06-1.06L9 6.84V6.75a2.25 2.25 0 0 1 2.25-2.25c.34 0 .672.083.969.233a.75.75 0 0 0 .8-.433a3.75 3.75 0 0 0-1.769-.383C8.7 4.25 7.25 5.642 7.25 7.25v.01l-1.72-1.657Z"
        }),
        React.createElement('path', {
            d: "M9 8.25a.75.75 0 0 0-1.5 0v5.69l-1.72-1.657a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.06 0l2.25-2.25a.75.75 0 0 0-1.06-1.06L9 13.19V8.25Z"
        }),
        React.createElement('path', {
            d: "M11.25 5.25a2.25 2.25 0 0 0-2.25 2.25v.01l1.72-1.657a.75.75 0 0 0 1.06 1.06l-2.25 2.25a.75.75 0 0 0 0 1.06l2.25 2.25a.75.75 0 0 0 1.06-1.06l-1.72-1.657V7.5a2.25 2.25 0 0 0-2.25-2.25Z"
        })
    )
);
const MasteryIcon = (unlocked: boolean, tier: AchievementTier): React.ReactNode => (
    React.createElement('svg', {
        xmlns: "http://www.w3.org/2000/svg",
        viewBox: "0 0 20 20",
        fill: "currentColor",
        className: `w-10 h-10 ${getIconClass(unlocked, tier)}`
    },
        React.createElement('path', {
            fillRule: "evenodd",
            d: "M15.28 4.72a.75.75 0 0 1 0 1.06l-7.5 7.5a.75.75 0 0 1-1.06 0l-3.5-3.5a.75.75 0 1 1 1.06-1.06l2.97 2.97 6.97-6.97a.75.75 0 0 1 1.06 0Z",
            clipRule: "evenodd"
        }),
        React.createElement('path', {
            d: "M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0Zm-2 0a6 6 0 1 1-12 0 6 6 0 0 1 12 0Z"
        })
    )
);
const ExplorationIcon = (unlocked: boolean, tier: AchievementTier): React.ReactNode => (
    React.createElement('svg', {
        xmlns: "http://www.w3.org/2000/svg",
        viewBox: "0 0 20 20",
        fill: "currentColor",
        className: `w-10 h-10 ${getIconClass(unlocked, tier)}`
    },
        React.createElement('path', {
            d: "M3.5 2.75a.75.75 0 0 0-1.5 0v14.5a.75.75 0 0 0 1.5 0v-4.392l1.657-.348a6.44 6.44 0 0 1 3.26.316l.515.155a3.615 3.615 0 0 0 2.848 0l.515-.155a6.44 6.44 0 0 1 3.26-.316l1.657.348V2.75a.75.75 0 0 0-1.5 0v3.82a6.44 6.44 0 0 1-3.26-.316l-.515-.155a3.615 3.615 0 0 0-2.848 0l-.515.155a6.44 6.44 0 0 1-3.26.316V2.75Z"
        }),
        React.createElement('path', {
            d: "M15.5 2A1.5 1.5 0 0 0 14 3.5v13a1.5 1.5 0 0 0 1.5 1.5h1a1.5 1.5 0 0 0 1.5-1.5v-13A1.5 1.5 0 0 0 16.5 2h-1Z"
        })
    )
);

// FIX: Correctly filter out undefined values before flattening the array of completed topics.
const getCompletedTopics = (userData: UserData) => Object.values(userData.completedTopics).filter(Array.isArray).flat();

export const ALL_ACHIEVEMENTS: Achievement[] = [
    // --- Learning Category ---
    {
        id: 'learning_1',
        name: 'Bước khởi đầu',
        description: 'Hoàn thành chủ đề đầu tiên của bạn.',
        icon: (unlocked) => LearningIcon(unlocked, 'Bronze'),
        category: 'Learning',
        tier: 'Bronze',
        totalSteps: 1,
        getCurrentProgress: (userData) => getCompletedTopics(userData).length,
        check: (userData) => getCompletedTopics(userData).length >= 1,
    },
    {
        id: 'learning_5',
        name: 'Nhà thám hiểm',
        description: 'Hoàn thành 5 chủ đề khác nhau.',
        icon: (unlocked) => LearningIcon(unlocked, 'Silver'),
        category: 'Learning',
        tier: 'Silver',
        totalSteps: 5,
        getCurrentProgress: (userData) => getCompletedTopics(userData).length,
        check: (userData) => getCompletedTopics(userData).length >= 5,
    },
    {
        id: 'learning_15',
        name: 'Học giả',
        description: 'Hoàn thành 15 chủ đề khác nhau.',
        icon: (unlocked) => LearningIcon(unlocked, 'Gold'),
        category: 'Learning',
        tier: 'Gold',
        totalSteps: 15,
        getCurrentProgress: (userData) => getCompletedTopics(userData).length,
        check: (userData) => getCompletedTopics(userData).length >= 15,
    },

    // --- Consistency Category ---
    {
        id: 'streak_3',
        name: 'Người học chăm chỉ',
        description: 'Duy trì chuỗi 3 ngày học liên tiếp.',
        icon: (unlocked) => StreakIcon(unlocked, 'Bronze'),
        category: 'Consistency',
        tier: 'Bronze',
        totalSteps: 3,
        getCurrentProgress: (userData) => userData.streak,
        check: (userData) => userData.streak >= 3,
    },
     {
        id: 'streak_7',
        name: 'Người học tận tụy',
        description: 'Duy trì chuỗi 7 ngày học liên tiếp.',
        icon: (unlocked) => StreakIcon(unlocked, 'Silver'),
        category: 'Consistency',
        tier: 'Silver',
        totalSteps: 7,
        getCurrentProgress: (userData) => userData.streak,
        check: (userData) => userData.streak >= 7,
    },
    {
        id: 'streak_30',
        name: 'Ngọn lửa bất diệt',
        description: 'Duy trì chuỗi 30 ngày học liên tiếp.',
        icon: (unlocked) => StreakIcon(unlocked, 'Gold'),
        category: 'Consistency',
        tier: 'Gold',
        totalSteps: 30,
        getCurrentProgress: (userData) => userData.streak,
        check: (userData) => userData.streak >= 30,
    },

    // --- Mastery Category ---
    {
        id: 'mastery_perfect_score',
        name: 'Hoàn hảo',
        description: 'Đạt điểm tuyệt đối trong một bài kiểm tra.',
        icon: (unlocked) => MasteryIcon(unlocked, 'Bronze'),
        category: 'Mastery',
        tier: 'Bronze',
        totalSteps: 1,
        getCurrentProgress: (userData) => userData.testHistory.some(t => t.percentage === 100) ? 1 : 0,
        check: (userData) => userData.testHistory.some(t => t.percentage === 100),
    },
    {
        id: 'mastery_fluent_250',
        name: 'Người giao tiếp Tự tin',
        description: 'Đạt 250 điểm Fluency Score.',
        icon: (unlocked) => MasteryIcon(unlocked, 'Bronze'),
        category: 'Mastery',
        tier: 'Bronze',
        totalSteps: 250,
        getCurrentProgress: (userData) => userData.fluencyScore,
        check: (userData) => userData.fluencyScore >= 250,
    },
    {
        id: 'mastery_fluent_500',
        name: 'Người giao tiếp Lưu loát',
        description: 'Đạt 500 điểm Fluency Score.',
        icon: (unlocked) => MasteryIcon(unlocked, 'Silver'),
        category: 'Mastery',
        tier: 'Silver',
        totalSteps: 500,
        getCurrentProgress: (userData) => userData.fluencyScore,
        check: (userData) => userData.fluencyScore >= 500,
    },
    {
        id: 'mastery_fluent_800',
        name: 'Bậc thầy Ngôn ngữ',
        description: 'Đạt 800 điểm Fluency Score.',
        icon: (unlocked) => MasteryIcon(unlocked, 'Gold'),
        category: 'Mastery',
        tier: 'Gold',
        totalSteps: 800,
        getCurrentProgress: (userData) => userData.fluencyScore,
        check: (userData) => userData.fluencyScore >= 800,
    },

    // --- Exploration Category ---
     {
        id: 'explore_speaking',
        name: 'Nhà hùng biện',
        description: 'Hoàn thành một bài thi nói mô phỏng.',
        icon: (unlocked) => ExplorationIcon(unlocked, 'Bronze'),
        category: 'Exploration',
        tier: 'Bronze',
        totalSteps: 1,
        getCurrentProgress: (userData) => userData.speakingHistory.length,
        check: (userData) => userData.speakingHistory.length >= 1,
    },
    {
        id: 'explore_tutor',
        name: 'Tò mò',
        description: 'Trò chuyện với Gia sư AI.',
        icon: (unlocked) => ExplorationIcon(unlocked, 'Bronze'),
        category: 'Exploration',
        tier: 'Bronze',
        totalSteps: 1,
        // This one is harder to track, we'll unlock it from the app logic directly.
        // For progress, we'll just show 0 or 1.
        getCurrentProgress: (userData) => userData.unlockedAchievements['explore_tutor'] ? 1 : 0,
        check: () => false, // Manual unlock
    },
    {
        id: 'explore_favorite',
        name: 'Nhà sưu tập',
        description: 'Đánh dấu một chủ đề là yêu thích.',
        icon: (unlocked) => ExplorationIcon(unlocked, 'Bronze'),
        category: 'Exploration',
        tier: 'Bronze',
        totalSteps: 1,
        getCurrentProgress: (userData) => Object.values(userData.favoriteTopics).flat().length,
        check: (userData) => Object.values(userData.favoriteTopics).flat().length >= 1,
    },
];