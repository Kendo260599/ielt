import { useState, useEffect, useCallback } from 'react';
import { User } from 'firebase/auth';
import { UserData, IELTSLevel, WordMasteryInfo } from '../types';
import { getUserDocument, createUserDocument, updateUserDocument } from '../services/firebaseService';

const MASTERY_LEVEL_INTERVALS: { [level: number]: number } = {
    0: 0,    // New -> review immediately
    1: 1,    // 1 day
    2: 3,    // 3 days
    3: 7,    // 1 week
    4: 14,   // 2 weeks
    5: 30,   // 1 month
    6: 90,   // 3 months
    7: 180,  // 6 months
};

const calculateFluencyScore = (data: UserData): number => {
    let score = 100; // Base score

    // 1. Streak bonus (max 150)
    score += Math.min(data.streak * 5, 150);

    // 2. XP bonus (max 200) - Logarithmic scale to reward activity without letting it dominate
    score += Math.min(Math.log(data.totalXp + 1) * 20, 200);

    // 3. Test Performance (max 250) - Average of last 5 tests
    if (data.testHistory.length > 0) {
        const recentTests = data.testHistory.slice(-5);
        const avgTestPerf = recentTests.reduce((acc, t) => acc + t.percentage, 0) / recentTests.length;
        score += (avgTestPerf / 100) * 250;
    }

    // 4. Speaking Performance (max 300) - Average of last 3 speaking tests
    if (data.speakingHistory.length > 0) {
        const recentSpeaking = data.speakingHistory.slice(-3);
        const avgSpeakingScore = recentSpeaking.reduce((acc, s) => acc + s.score, 0) / recentSpeaking.length;
        // Normalize from 9-band scale to our 300 points
        score += (avgSpeakingScore / 9) * 300;
    }

    // 5. Weak Points (penalty)
    const penalty = (data.weakPoints.vocabulary.length * 2) + (data.weakPoints.grammar.length * 2);
    score -= penalty;
    
    // Ensure score is within 0-1000 range
    return Math.max(0, Math.min(Math.round(score), 1000));
};

const createDefaultUserData = (): UserData => {
    const defaultData = {
        totalXp: 0,
        streak: 0,
        lastActiveDate: null,
        completedTopics: {},
        favoriteTopics: {},
        difficultTopics: {},
        unlockedAchievements: {},
        dailyGoal: 50,
        xpToday: { date: new Date().toISOString().split('T')[0], xp: 0 },
        dailyGoalCompleted: { date: '', completed: false },
        weakPoints: { vocabulary: [], grammar: [] },
        fluencyScore: 0,
        testHistory: [],
        speakingHistory: [],
        wordMastery: {},
        isNewUser: true,
    };
    defaultData.fluencyScore = calculateFluencyScore(defaultData);
    return defaultData;
};

export const useUserData = (user: User | null) => {
    const [userData, setUserData] = useState<UserData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Handle guest user: provide default data without fetching
        if (!user) {
            setUserData(createDefaultUserData());
            setLoading(false);
            return;
        }

        // Handle logged-in user
        const loadUserData = async () => {
            setLoading(true);
            const existingData = await getUserDocument(user.uid);
            if (existingData) {
                // Recalculate score on load to apply any new logic
                const freshScore = calculateFluencyScore(existingData);
                if (freshScore !== existingData.fluencyScore) {
                    await updateUserDocument(user.uid, { fluencyScore: freshScore });
                    setUserData({ ...existingData, fluencyScore: freshScore });
                } else {
                    setUserData(existingData);
                }
            } else {
                // New user, create their document
                const defaultData = createDefaultUserData();
                await createUserDocument(user.uid, defaultData);
                setUserData(defaultData);
            }
            setLoading(false);
        };

        loadUserData();
    }, [user]);

    const updateRemoteData = useCallback(async (data: Partial<UserData>) => {
        // This check prevents writes for guest users (when user is null)
        if (!user?.uid) return;
        await updateUserDocument(user.uid, data);
    }, [user]);

    const updateLocalAndRemote = useCallback((updates: Partial<UserData>) => {
        setUserData(prev => {
            if (!prev) return null;
            const newData = { ...prev, ...updates };
            // Only calculate and save fluency score for logged-in users
            if (user) {
                const newScore = calculateFluencyScore(newData);
                newData.fluencyScore = newScore;
                updateRemoteData({ ...updates, fluencyScore: newScore });
            } else {
                 updateRemoteData(updates);
            }
            
            return newData;
        });
    }, [updateRemoteData, user]);


    const updateUserXP = useCallback((xpGained: number, isPerfectScore: boolean = false) => {
        if (!userData) return;
        const today = new Date().toISOString().split('T')[0];
        const currentXpToday = userData.xpToday?.date === today ? userData.xpToday.xp : 0;
        const newXpToday = currentXpToday + xpGained;

        let bonusXp = 0;
        let goalCompleted = userData.dailyGoalCompleted?.date === today && userData.dailyGoalCompleted?.completed;
        
        let newDailyGoalCompleted = userData.dailyGoalCompleted;
        if (!goalCompleted && newXpToday >= userData.dailyGoal) {
            bonusXp = 25; // Award 25 bonus XP for completing the goal
            newDailyGoalCompleted = { date: today, completed: true };
        }
        
        const updates: Partial<UserData> = {
            totalXp: userData.totalXp + xpGained + bonusXp,
            xpToday: { date: today, xp: newXpToday },
            dailyGoalCompleted: newDailyGoalCompleted,
        };
        updateLocalAndRemote(updates);
    }, [userData, updateLocalAndRemote]);

    const updateUserStreak = useCallback(() => {
        if (!userData) return;
        const today = new Date().toISOString().split('T')[0];
        
        if (userData.lastActiveDate === today) return;

        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = yesterday.toISOString().split('T')[0];

        const newStreak = userData.lastActiveDate === yesterdayStr ? userData.streak + 1 : 1;
        
        const updates: Partial<UserData> = {
            streak: newStreak,
            lastActiveDate: today,
        };
        updateLocalAndRemote(updates);
    }, [userData, updateLocalAndRemote]);

    const completeTopic = useCallback((level: IELTSLevel, topic: string) => {
        if (!userData) return;
        const completedForLevel = userData.completedTopics[level] || [];
        if (completedForLevel.includes(topic)) return;

        const updates: Partial<UserData> = {
            completedTopics: {
                ...userData.completedTopics,
                [level]: [...completedForLevel, topic],
            }
        };
        updateLocalAndRemote(updates);
    }, [userData, updateLocalAndRemote]);

    const getCompletedTopics = useCallback((level: IELTSLevel | 'all'): string[] => {
        if (!userData) return [];
        if (level === 'all') {
            // FIX: Replaced the faulty reduce implementation with a cleaner and more robust
            // method using filter and flat to correctly handle optional topic arrays.
            return Object.values(userData.completedTopics).filter(Array.isArray).flat();
        }
        return userData.completedTopics[level] || [];
    }, [userData?.completedTopics]);
    
    const toggleFavoriteTopic = useCallback((level: IELTSLevel, topic: string) => {
        if (!userData) return;
        const favoritesForLevel = userData.favoriteTopics?.[level] || [];
        const isFavorite = favoritesForLevel.includes(topic);
        const newFavorites = isFavorite
            ? favoritesForLevel.filter(t => t !== topic)
            : [...favoritesForLevel, topic];

        const updates = {
            favoriteTopics: { ...userData.favoriteTopics, [level]: newFavorites }
        };
        updateLocalAndRemote(updates);
    }, [userData, updateLocalAndRemote]);
    
    const toggleDifficultTopic = useCallback((level: IELTSLevel, topic: string) => {
        if (!userData) return;
        const difficultsForLevel = userData.difficultTopics?.[level] || [];
        const isDifficult = difficultsForLevel.includes(topic);
        const newDifficults = isDifficult
            ? difficultsForLevel.filter(t => t !== topic)
            : [...difficultsForLevel, topic];
            
        const updates = {
             difficultTopics: { ...userData.difficultTopics, [level]: newDifficults },
        };
        updateLocalAndRemote(updates);
    }, [userData, updateLocalAndRemote]);

    const unlockAchievement = useCallback((achievementId: string) => {
        if (!userData || userData.unlockedAchievements[achievementId]) return;

        const updates: Partial<UserData> = {
            unlockedAchievements: {
                ...userData.unlockedAchievements,
                [achievementId]: new Date().toISOString()
            }
        };
        updateLocalAndRemote(updates);
    }, [userData, updateLocalAndRemote]);

    const addWeakPoints = useCallback((points: { vocabulary?: string[], grammar?: string[] }) => {
        if (!userData) return;
        const newVocab = new Set([...userData.weakPoints.vocabulary, ...(points.vocabulary || [])]);
        const newGrammar = new Set([...userData.weakPoints.grammar, ...(points.grammar || [])]);
        const updates: Partial<UserData> = {
            weakPoints: {
                vocabulary: Array.from(newVocab),
                grammar: Array.from(newGrammar),
            }
        };
        updateLocalAndRemote(updates);
    }, [userData, updateLocalAndRemote]);

    const clearWeakPoints = useCallback((type: 'vocabulary' | 'grammar') => {
        if (!userData) return;
        const updates: Partial<UserData> = {
            weakPoints: {
                ...userData.weakPoints,
                [type]: []
            }
        };
        updateLocalAndRemote(updates);
    }, [userData, updateLocalAndRemote]);

    const addTestResult = useCallback((percentage: number) => {
        if (!userData) return;
        const newHistory = [...userData.testHistory, { date: new Date().toISOString(), percentage }];
        const updates: Partial<UserData> = {
            testHistory: newHistory,
        };
        updateLocalAndRemote(updates);
    }, [userData, updateLocalAndRemote]);

    const addSpeakingResult = useCallback((score: number) => {
        if (!userData) return;
        const newHistory = [...userData.speakingHistory, { date: new Date().toISOString(), score }];
        const updates: Partial<UserData> = {
            speakingHistory: newHistory,
        };
        updateLocalAndRemote(updates);
    }, [userData, updateLocalAndRemote]);
    
    const markUserAsOld = useCallback(() => {
        if (!userData || !userData.isNewUser) return;
        updateLocalAndRemote({ isNewUser: false });
    }, [userData, updateLocalAndRemote]);


    // --- Spaced Repetition System (SRS) Logic ---
    const addWordsToMastery = useCallback((words: string[]) => {
        if (!userData) return;
        const newMastery = { ...userData.wordMastery };
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        let hasChanges = false;
        words.forEach(word => {
            if (!newMastery[word]) {
                newMastery[word] = { level: 0, nextReviewDate: today.toISOString() };
                hasChanges = true;
            }
        });

        if(hasChanges) {
            updateLocalAndRemote({ wordMastery: newMastery });
        }
    }, [userData, updateLocalAndRemote]);

    const updateWordMastery = useCallback((word: string, wasCorrect: boolean) => {
        if (!userData) return;
        const currentMastery = userData.wordMastery[word];
        if (!currentMastery) return;

        const newLevel = wasCorrect
            ? Math.min(currentMastery.level + 1, Object.keys(MASTERY_LEVEL_INTERVALS).length - 1)
            : Math.max(0, currentMastery.level - 1);

        const intervalDays = MASTERY_LEVEL_INTERVALS[newLevel];
        const nextReview = new Date();
        nextReview.setDate(nextReview.getDate() + intervalDays);
        nextReview.setHours(0, 0, 0, 0);

        const newMasteryData = {
            level: newLevel,
            nextReviewDate: nextReview.toISOString(),
        };

        const updates = {
            wordMastery: { ...userData.wordMastery, [word]: newMasteryData }
        };
        updateLocalAndRemote(updates);
    }, [userData, updateLocalAndRemote]);

    const getWordsDueForReview = useCallback((): string[] => {
        if (!userData) return [];
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const todayStr = today.toISOString();

        return Object.entries(userData.wordMastery)
            // FIX: Added explicit type annotation for masteryInfo to resolve property access error.
            .filter(([, masteryInfo]: [string, WordMasteryInfo]) => masteryInfo.nextReviewDate <= todayStr)
            .map(([word]) => word);
    }, [userData?.wordMastery]);


    return { userData, loading, updateUserXP, updateUserStreak, completeTopic, getCompletedTopics, toggleFavoriteTopic, toggleDifficultTopic, unlockAchievement, addWeakPoints, clearWeakPoints, addTestResult, addSpeakingResult, addWordsToMastery, updateWordMastery, getWordsDueForReview, markUserAsOld };
};