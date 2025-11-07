import React from 'react';

export type IELTSLevel = 'Band 5.0-5.5' | 'Band 6.0-6.5' | 'Band 7.0-7.5' | 'Band 8.0+';

export enum AppState {
  SHOWING_LOGIN = 'SHOWING_LOGIN',
  SHOWING_INTRO = 'SHOWING_INTRO',
  SHOWING_DASHBOARD = 'SHOWING_DASHBOARD',
  TAKING_PLACEMENT_TEST = 'TAKING_PLACEMENT_TEST',
  VIEWING_PLACEMENT_RESULTS = 'VIEWING_PLACEMENT_RESULTS',
  SELECTING_LEVEL = 'SELECTING_LEVEL',
  SELECTING_TOPIC = 'SELECTING_TOPIC',
  IN_LESSON = 'IN_LESSON',
  TAKING_TEST = 'TAKING_TEST',
  VIEWING_RESULTS = 'VIEWING_RESULTS',
  IN_VOCAB_PRACTICE = 'IN_VOCAB_PRACTICE',
  REVIEWING_INCORRECT = 'REVIEWING_INCORRECT',
  VIEWING_PROGRESS = 'VIEWING_PROGRESS',
  VIEWING_LEADERBOARD = 'VIEWING_LEADERBOARD',
  CHATTING_WITH_TUTOR = 'CHATTING_WITH_TUTOR',
  VIEWING_ACHIEVEMENTS = 'VIEWING_ACHIEVEMENTS',
  IN_SRS_REVIEW = 'IN_SRS_REVIEW',

  // New Speaking Simulator States
  SHOWING_SPEAKING_INTRO = 'SHOWING_SPEAKING_INTRO',
  IN_SPEAKING_SIMULATOR = 'IN_SPEAKING_SIMULATOR',
  VIEWING_SPEAKING_FEEDBACK = 'VIEWING_SPEAKING_FEEDBACK',
}

export interface VocabularyWord {
  word: string;
  phonetic: string;
  type: string;
  definition: string;
  example: string;
  definition_vi: string;
  example_vi: string;
}

export interface WordExplanation {
    synonyms: string[];
    antonyms: string[];
    collocations: string[];
    detailedExplanation: string;
}

export interface MCQ {
  question: string;
  options: string[];
  correctAnswer: string;
}

export interface FillBlankQuestion {
  sentence: string;
  correctAnswer: string;
}

export interface MatchingPair {
  word: string;
  definition: string;
}

export interface Test {
  mcqs: MCQ[];
  fillInTheBlanks: FillBlankQuestion[];
  matchingPairs: MatchingPair[];
}

export interface WordMasteryInfo {
    level: number; // 0 = new, 1 = learning, 2 = familiar, etc.
    nextReviewDate: string; // ISO string
}

export interface UserData {
  totalXp: number;
  streak: number;
  lastActiveDate: string | null;
  completedTopics: {
    [level in IELTSLevel]?: string[];
  };
  favoriteTopics: {
    [level in IELTSLevel]?: string[];
  };
  difficultTopics: {
    [level in IELTSLevel]?: string[];
  };
  unlockedAchievements: { [id: string]: string }; // Store achievement ID and unlock date
  dailyGoal: number;
  xpToday: { date: string, xp: number };
  dailyGoalCompleted: { date: string, completed: boolean };
  weakPoints: {
      vocabulary: string[];
      grammar: string[];
  };
  fluencyScore: number;
  testHistory: { date: string, percentage: number }[];
  speakingHistory: { date: string, score: number }[];
  wordMastery: { [word: string]: WordMasteryInfo };
  isNewUser: boolean; // Flag to guide user to intro/placement
}

export interface AuthUser {
  uid: string;
  displayName: string | null;
  photoURL: string | null;
  email: string | null;
}

export type TranscriptItem = {
    // FIX: Add 'user_interim' to support temporary transcription results from the speech recognition API.
    speaker: 'user' | 'model' | 'feedback' | 'system' | 'user_interim';
    text: string;
};

export interface SpeakingFeedbackCriterion {
    score: number;
    feedback: string;
}

export interface SpeakingFeedback {
    overallBandScore: number;
    fluencyAndCoherence: SpeakingFeedbackCriterion;
    lexicalResource: SpeakingFeedbackCriterion;
    grammaticalRangeAndAccuracy: SpeakingFeedbackCriterion;
    pronunciation: SpeakingFeedbackCriterion;
    speakingWeakPoints: {
        vocabulary: string[];
        grammar: string[];
    };
    suggestions: string[];
}

export type AchievementTier = 'Bronze' | 'Silver' | 'Gold';
export type AchievementCategory = 'Learning' | 'Consistency' | 'Mastery' | 'Exploration';

export interface Achievement {
    id: string;
    name: string;
    description: string;
    icon: (unlocked: boolean) => React.ReactNode;
    tier: AchievementTier;
    category: AchievementCategory;
    totalSteps: number;
    getCurrentProgress: (userData: UserData) => number;
    check: (userData: UserData) => boolean;
}

export interface LeaderboardEntry {
    rank: number;
    name: string;
    fluencyScore: number;
    isCurrentUser?: boolean;
}

export interface TutorChatMessage {
    speaker: 'user' | 'tutor';
    text: string;
    isTyping?: boolean;
}