import React, { useState, useCallback, useEffect } from 'react';
import { AppState, IELTSLevel, VocabularyWord, Test, TranscriptItem, SpeakingFeedback, Achievement, TutorChatMessage, AuthUser } from './types';
import { fetchTopics, fetchVocabulary, generateTest, generatePlacementTest, evaluatePlacementTest, fetchSpeakingAnalysis, fetchWordDetails, createTutorChatSession, generateImage } from './services/geminiService';
import { signInWithGoogle, signOutUser } from './services/firebaseService';
import { useAuth } from './hooks/useAuth';
import { useUserData } from './hooks/useUserData';
import { ALL_ACHIEVEMENTS } from './data/achievements';
import { Chat } from '@google/genai';

import IntroView from './components/IntroView';
import LevelSelector from './components/LevelSelector';
import TopicSelector from './components/TopicSelector';
import LessonView from './components/LessonView';
import TestView from './components/TestView';
import ResultsView from './ResultsView';
import Spinner from './components/Spinner';
import Header from './components/Header';
import PlacementTestView from './components/PlacementTestView';
import PlacementResultsView from './components/PlacementResultsView';
import ConversationButton from './components/ConversationButton';
import PracticeView from './components/PracticeView';
import ProgressView from './components/ProgressView';
import SpeakingIntroView from './components/SpeakingIntroView';
import SpeakingSimulatorView from './components/SpeakingSimulatorView';
import SpeakingFeedbackView from './components/SpeakingFeedbackView';
import DashboardView from './components/DashboardView';
import LeaderboardView from './components/LeaderboardView';
import AchievementToast from './components/AchievementToast';
import AITutorView from './components/AITutorView';
import AchievementsView from './components/AchievementsView';
import ReviewView from './components/ReviewView';
import LoginView from './components/LoginView';
import LandingPageView from './components/LandingPageView';
import PronunciationPracticeModal from './components/PronunciationPracticeModal';


const App: React.FC = () => {
  const { user, loading: authLoading } = useAuth();
  const { userData, loading: userDataLoading, ...userActions } = useUserData(user);

  const [isGuestSession, setIsGuestSession] = useState(false);
  const [appState, setAppState] = useState<AppState>(AppState.SHOWING_LANDING_PAGE);
  const [lastAppState, setLastAppState] = useState<AppState>(AppState.SHOWING_DASHBOARD);
  const [selectedLevel, setSelectedLevel] = useState<IELTSLevel | null>(null);
  const [topics, setTopics] = useState<string[]>([]);
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [vocabulary, setVocabulary] = useState<VocabularyWord[]>([]);
  const [test, setTest] = useState<Test | null>(null);
  const [placementTest, setPlacementTest] = useState<Test | null>(null);
  const [recommendedLevel, setRecommendedLevel] = useState<IELTSLevel | null>(null);
  const [score, setScore] = useState<number>(0);
  const [incorrectWords, setIncorrectWords] = useState<VocabularyWord[]>([]);
  const [xpGained, setXpGained] = useState<number>(0);
  const [speakingFeedback, setSpeakingFeedback] = useState<SpeakingFeedback | null>(null);
  const [speakingPart2Image, setSpeakingPart2Image] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loadingMessage, setLoadingMessage] = useState<string>('Đang tải...');
  const [error, setError] = useState<string | null>(null);
  const [audioState, setAudioState] = useState<string | null>(null);
  const [showAchievement, setShowAchievement] = useState<Achievement | null>(null);
  const [reviewWords, setReviewWords] = useState<VocabularyWord[]>([]);
  const [wordToPractice, setWordToPractice] = useState<VocabularyWord | null>(null);


  // Sign In State
  const [signInState, setSignInState] = useState({ isLoading: false, error: null as string | null });


  // AI Tutor State
  const [tutorChat, setTutorChat] = useState<Chat | null>(null);
  const [tutorHistory, setTutorHistory] = useState<TutorChatMessage[]>([]);
  const [isTutorLoading, setIsTutorLoading] = useState(false);
  
  // Decide initial screen based on auth state
  useEffect(() => {
    if (authLoading) {
      return; // Wait for auth to finish
    }

    if (user && userData) {
      // User is logged in
      setIsGuestSession(false); // Logged in user cannot be a guest
      // If we are on the login/landing screen (e.g., just logged in), transition to the app
      if ([AppState.SHOWING_LOGIN, AppState.SHOWING_LANDING_PAGE].includes(appState)) {
        setAppState(userData.isNewUser ? AppState.SHOWING_INTRO : AppState.SHOWING_DASHBOARD);
      }
    } else if (!user && !isGuestSession) {
      // User is not logged in AND has not explicitly chosen guest mode
      // If they signed out from an internal page, send them to landing.
      if (appState !== AppState.SHOWING_LOGIN) {
        setAppState(AppState.SHOWING_LANDING_PAGE);
      }
    }
    // If !user and isGuestSession, we do nothing and let the user navigate as a guest.
  }, [user, authLoading, userData, isGuestSession]);


  // Achievement Check Logic
  useEffect(() => {
    if (!userData || !user) return; // Only check for logged-in users
    const checkAchievements = () => {
        ALL_ACHIEVEMENTS.forEach(achievement => {
            if (!userData.unlockedAchievements[achievement.id] && achievement.check(userData)) {
                userActions.unlockAchievement(achievement.id);
                setShowAchievement(achievement);
                setTimeout(() => setShowAchievement(null), 5000); // Hide after 5 seconds
            }
        });
    };
    checkAchievements();
  }, [userData, user, userActions.unlockAchievement]);


  const handlePlayAudio = useCallback((word: string) => {
    if ('speechSynthesis' in window) {
      if (audioState === word) {
        window.speechSynthesis.cancel();
        setAudioState(null);
        return;
      }
      
      window.speechSynthesis.cancel();
      
      const utterance = new SpeechSynthesisUtterance(word);
      utterance.lang = 'en-US';
      utterance.onstart = () => {
        setAudioState(word);
      };
      utterance.onend = () => {
        setAudioState(null);
      };
      utterance.onerror = () => {
        setAudioState(null);
        console.error("Speech synthesis error");
      };
      window.speechSynthesis.speak(utterance);
    } else {
      alert("Trình duyệt của bạn không hỗ trợ phát âm thanh.");
    }
  }, [audioState]);

  const handleStartPlacementTest = useCallback(async () => {
    setIsLoading(true);
    setLoadingMessage('Đang tạo bài kiểm tra đầu vào...');
    setError(null);
    try {
        const test = await generatePlacementTest();
        setPlacementTest(test);
        setAppState(AppState.TAKING_PLACEMENT_TEST);
    } catch (err) {
        setError(err instanceof Error ? err.message : 'Đã xảy ra lỗi không xác định.');
        setAppState(AppState.SHOWING_INTRO);
    } finally {
        setIsLoading(false);
    }
  }, []);
  
  const handleFinishPlacementTest = useCallback(async (answers: (string | null)[]) => {
    if (!placementTest) return;
    setIsLoading(true);
    setLoadingMessage('Đang phân tích kết quả của bạn...');
    setError(null);
    try {
        const level = await evaluatePlacementTest(placementTest, answers);
        userActions.updateUserStreak(); // Mark first activity
        userActions.markUserAsOld(); // No longer a new user
        setRecommendedLevel(level);
        setAppState(AppState.VIEWING_PLACEMENT_RESULTS);
    } catch (err) {
        setError(err instanceof Error ? err.message : 'Đã xảy ra lỗi không xác định.');
        setAppState(AppState.SHOWING_INTRO);
    } finally {
        setIsLoading(false);
    }
  }, [placementTest, userActions]);

  const handleSelectLevel = useCallback(async (level: IELTSLevel) => {
    setIsLoading(true);
    setLoadingMessage('Đang tạo gợi ý chủ đề...');
    setError(null);
    try {
      const fetchedTopics = await fetchTopics(level);
      setTopics(fetchedTopics);
      setSelectedLevel(level);
      setAppState(AppState.SELECTING_TOPIC);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Đã xảy ra lỗi không xác định.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleSelectTopic = useCallback(async (topic: string) => {
    if (!selectedLevel) return;
    setIsLoading(true);
    setError(null);
    try {
        setLoadingMessage(`Đang tạo từ vựng cho chủ đề "${topic}"...`);
        const words = await fetchVocabulary(selectedLevel, topic);
        setSelectedTopic(topic);
        
        setLoadingMessage(`Đang tạo hình ảnh minh họa... (1/${words.length})`);
        const wordsWithImages = await Promise.all(
            words.map(async (word, index) => {
                try {
                    const imageUrl = await generateImage(word.word);
                    // Update message for every word to show progress
                    setLoadingMessage(`Đang tạo hình ảnh minh họa... (${index + 2}/${words.length})`);
                    return { ...word, imageUrl };
                } catch (e) {
                    console.error(`Failed to generate image for ${word.word}:`, e);
                    // If image fails, continue without it
                    return word; 
                }
            })
        );
        
        setVocabulary(wordsWithImages);
        setAppState(AppState.IN_LESSON);
    } catch (err) {
        setError(err instanceof Error ? err.message : 'Đã xảy ra lỗi không xác định.');
    } finally {
        setIsLoading(false);
    }
  }, [selectedLevel]);
  
  const handleStartPractice = useCallback(async (topic: string) => {
    if (!selectedLevel) return;
    setIsLoading(true);
    setLoadingMessage('Đang chuẩn bị buổi luyện tập...');
    setError(null);
    try {
        if (topic === selectedTopic && vocabulary.length > 0) {
             setAppState(AppState.IN_VOCAB_PRACTICE);
        } else {
            setLoadingMessage(`Đang tạo từ vựng cho chủ đề "${topic}"...`);
            const words = await fetchVocabulary(selectedLevel, topic);
            setSelectedTopic(topic);
            
            setLoadingMessage(`Đang tạo hình ảnh minh họa... (1/${words.length})`);
            const wordsWithImages = await Promise.all(
                words.map(async (word, index) => {
                    try {
                        const imageUrl = await generateImage(word.word);
                        setLoadingMessage(`Đang tạo hình ảnh minh họa... (${index + 2}/${words.length})`);
                        return { ...word, imageUrl };
                    } catch (e) {
                        return word;
                    }
                })
            );
            
            setVocabulary(wordsWithImages);
            setAppState(AppState.IN_VOCAB_PRACTICE);
        }
    } catch (err) {
        setError(err instanceof Error ? err.message : 'Đã xảy ra lỗi không xác định.');
    } finally {
        setIsLoading(false);
    }
  }, [selectedLevel, selectedTopic, vocabulary]);

  const handleStartTest = useCallback(async () => {
    if (vocabulary.length === 0) return;
    setIsLoading(true);
    setLoadingMessage('Đang tạo bài kiểm tra bằng Gemini...');
    setError(null);
    try {
      const generatedTest = await generateTest(vocabulary);
      setTest(generatedTest);
      setAppState(AppState.TAKING_TEST);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Đã xảy ra lỗi không xác định.');
      setAppState(AppState.IN_LESSON);
    } finally {
      setIsLoading(false);
    }
  }, [vocabulary]);

  const handleUpdateMastery = useCallback((word: string, wasCorrect: boolean) => {
      userActions.updateWordMastery(word, wasCorrect);
  }, [userActions]);

  const handleFinishTest = useCallback((finalScore: number, incorrect: VocabularyWord[]) => {
    const totalQuestions = test ? test.mcqs.length + test.fillInTheBlanks.length + test.matchingPairs.length : 0;
    const earnedXp = finalScore * 10;
    const isPerfect = totalQuestions > 0 && finalScore === totalQuestions;
    const percentage = totalQuestions > 0 ? Math.round((finalScore / totalQuestions) * 100) : 0;
    
    userActions.updateUserXP(earnedXp, isPerfect);
    userActions.updateUserStreak();
    userActions.addTestResult(percentage);

    if (incorrect.length > 0) {
        userActions.addWeakPoints({ vocabulary: incorrect.map(w => w.word) });
    }

    if (selectedLevel && selectedTopic && (totalQuestions > 0 && finalScore / totalQuestions > 0.6)) {
        userActions.completeTopic(selectedLevel, selectedTopic);
    }
    
    userActions.addWordsToMastery(vocabulary.map(v => v.word));

    setIncorrectWords(incorrect);
    setXpGained(earnedXp);
    setScore(finalScore);
    setAppState(AppState.VIEWING_RESULTS);
  }, [test, selectedLevel, selectedTopic, vocabulary, userActions]);

  const handleStartReview = useCallback((words: VocabularyWord[]) => {
    setVocabulary(words);
    setSelectedTopic("Ôn tập từ khó");
    setAppState(AppState.IN_VOCAB_PRACTICE);
  }, []);
  
  const handleStartWeaknessReview = useCallback(async () => {
      if (!userData || !user) return; // Guests can't use this
      const weakWords = userData.weakPoints.vocabulary;
      if (weakWords.length === 0) return;
      setIsLoading(true);
      setLoadingMessage("Đang tạo buổi ôn tập cá nhân...");
      setError(null);
      try {
        const words = await fetchWordDetails(weakWords);
        setVocabulary(words);
        setSelectedTopic("Ôn tập điểm yếu");
        setAppState(AppState.IN_VOCAB_PRACTICE);
        userActions.clearWeakPoints('vocabulary'); // Clear after starting review
      } catch (err) {
         setError(err instanceof Error ? err.message : 'Đã xảy ra lỗi không xác định.');
      } finally {
          setIsLoading(false);
      }
  }, [userData, user, userActions]);

    const handleStartSrsReview = useCallback(async () => {
        if (!user) return; // Guests can't use this
        const wordsForReview = userActions.getWordsDueForReview();
        if (wordsForReview.length === 0) return;
        setIsLoading(true);
        setLoadingMessage("Đang tạo buổi ôn tập hàng ngày...");
        setError(null);
        try {
            const words = await fetchWordDetails(wordsForReview);
            setReviewWords(words);
            setAppState(AppState.IN_SRS_REVIEW);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Đã xảy ra lỗi không xác định.');
        } finally {
            setIsLoading(false);
        }
    }, [user, userActions]);

  const handleRestart = useCallback(() => {
    // Reset state
    setSelectedLevel(null);
    setTopics([]);
    setSelectedTopic(null);
    setVocabulary([]);
    setTest(null);
    setScore(0);
    setError(null);
    setPlacementTest(null);
    setRecommendedLevel(null);
    setXpGained(0);
    setIncorrectWords([]);
    setSpeakingFeedback(null);
    setSpeakingPart2Image(null);
    // Navigate to correct home
    setAppState(user || isGuestSession ? AppState.SHOWING_DASHBOARD : AppState.SHOWING_LANDING_PAGE);
  }, [user, isGuestSession]);
  
  const handleRetryTest = useCallback(() => {
    setScore(0);
    setXpGained(0);
    setIncorrectWords([]);
    setAppState(AppState.TAKING_TEST);
  }, []);

  const handleBackToLevelSelect = useCallback(() => {
      setAppState(AppState.SELECTING_LEVEL);
      setTopics([]);
      setSelectedLevel(null);
  }, []);
  
  const handleChooseLevelManually = useCallback(() => {
      userActions.updateUserStreak(); // Mark first activity
      userActions.markUserAsOld(); // No longer a new user
      setAppState(AppState.SELECTING_LEVEL);
  }, [userActions]);

  const handleBackToTopicSelect = useCallback(() => {
    setAppState(AppState.SELECTING_TOPIC);
    setVocabulary([]);
    setSelectedTopic(null);
    setIncorrectWords([]);
    setSpeakingFeedback(null);
  }, []);

  const handleBackToDashboard = useCallback(() => {
    setAppState(AppState.SHOWING_DASHBOARD);
    setSelectedLevel(null);
    setTopics([]);
    setSelectedTopic(null);
    setVocabulary([]);
    setTest(null);
    setError(null);
    setSpeakingFeedback(null);
  }, []);

  const handleGoHome = useCallback(() => {
    handleRestart();
  }, [handleRestart]);
  
  const handleViewProgress = useCallback(() => {
      setLastAppState(appState);
      setAppState(AppState.VIEWING_PROGRESS);
  }, [appState]);

  const handleViewAchievements = useCallback(() => {
    setLastAppState(appState);
    setAppState(AppState.VIEWING_ACHIEVEMENTS);
  }, [appState]);

  const handleViewLeaderboard = useCallback(() => {
    if (!user) {
        setSignInState({ isLoading: false, error: 'Vui lòng đăng nhập để xem bảng xếp hạng.' });
        setAppState(AppState.SHOWING_LOGIN);
        return;
    }
    setLastAppState(appState);
    setAppState(AppState.VIEWING_LEADERBOARD);
  }, [appState, user]);

  const handleBackToMain = useCallback(() => {
      setAppState(lastAppState);
  }, [lastAppState]);
  
  // --- Speaking Simulator Flow ---
  const handleStartSpeakingPractice = () => {
    if (!user) {
        setSignInState({ isLoading: false, error: 'Vui lòng đăng nhập để sử dụng tính năng luyện nói.' });
        setAppState(AppState.SHOWING_LOGIN);
        return;
    }
    setLastAppState(appState);
    setAppState(AppState.SHOWING_SPEAKING_INTRO);
  };
  
  const handleConfirmStartSimulator = useCallback(async () => {
    setIsLoading(true);
    setLoadingMessage('Đang tạo chủ đề hình ảnh cho Part 2...');
    setError(null);
    try {
        const imagePrompt = "A busy, vibrant outdoor market scene in a European city, with lots of details like fresh produce, people interacting, and old architecture.";
        const imageUrl = await generateImage(imagePrompt);
        setSpeakingPart2Image(imageUrl);
        setAppState(AppState.IN_SPEAKING_SIMULATOR);
    } catch (err) {
        setError(err instanceof Error ? err.message : 'Đã xảy ra lỗi không xác định.');
        setAppState(lastAppState); // Go back if image generation fails
    } finally {
        setIsLoading(false);
    }
  }, [lastAppState]);

  const handleFinishSpeakingTest = useCallback(async (transcript: TranscriptItem[]) => {
      setIsLoading(true);
      setLoadingMessage("Đang phân tích phần trình bày của bạn...");
      setError(null);
      try {
          const feedback = await fetchSpeakingAnalysis(transcript);
          setSpeakingFeedback(feedback);
          userActions.updateUserXP(50); // Award XP for completing a speaking test
          userActions.updateUserStreak();
          userActions.addSpeakingResult(feedback.overallBandScore);
          if (feedback.speakingWeakPoints) {
              userActions.addWeakPoints(feedback.speakingWeakPoints);
          }
          setAppState(AppState.VIEWING_SPEAKING_FEEDBACK);
      } catch (err)
 {
          setError(err instanceof Error ? err.message : 'Đã xảy ra lỗi không xác định.');
          setAppState(lastAppState); // Go back to where user was
      } finally {
          setIsLoading(false);
      }
  }, [lastAppState, userActions]);

  const handleBackFromSpeaking = () => {
      setSpeakingFeedback(null);
      setAppState(lastAppState);
  };

  // --- AI Tutor Flow ---
  const handleSendTutorMessage = useCallback(async (message: string) => {
    if (!tutorChat) return;

    setTutorHistory(prev => [...prev, { speaker: 'user', text: message }]);
    setIsTutorLoading(true);
    setTutorHistory(prev => [...prev, { speaker: 'tutor', text: '', isTyping: true }]);

    try {
        const stream = await tutorChat.sendMessageStream({ message });
        let fullResponse = "";
        for await (const chunk of stream) {
            fullResponse += chunk.text;
            setTutorHistory(prev => {
                const newHistory = [...prev];
                newHistory[newHistory.length - 1] = { speaker: 'tutor', text: fullResponse, isTyping: true };
                return newHistory;
            });
        }
        setTutorHistory(prev => {
            const newHistory = [...prev];
            newHistory[newHistory.length - 1] = { speaker: 'tutor', text: fullResponse, isTyping: false };
            return newHistory;
        });

    } catch (err) {
        const errorMsg = "Xin lỗi, tôi gặp sự cố khi trả lời. Vui lòng thử lại.";
        setTutorHistory(prev => {
            const newHistory = [...prev];
            newHistory[newHistory.length - 1] = { speaker: 'tutor', text: errorMsg, isTyping: false };
            return newHistory;
        });
        console.error("AI Tutor Error:", err);
    } finally {
        setIsTutorLoading(false);
    }
  }, [tutorChat]);

  const handleStartTutorChat = useCallback((initialMessage?: string) => {
    if (!user) {
        setSignInState({ isLoading: false, error: 'Vui lòng đăng nhập để trò chuyện với gia sư.' });
        setAppState(AppState.SHOWING_LOGIN);
        return;
    }
    let chatSession = tutorChat;
    if (!chatSession) {
        chatSession = createTutorChatSession();
        setTutorChat(chatSession);
    }
    setLastAppState(appState);
    setAppState(AppState.CHATTING_WITH_TUTOR);
    
    userActions.unlockAchievement('explore_tutor');

    if (initialMessage) {
        handleSendTutorMessage(initialMessage);
    }
  }, [appState, tutorChat, handleSendTutorMessage, user, userActions.unlockAchievement]);
  
  const handleAskTutorForWord = useCallback((word: VocabularyWord) => {
      const prompt = `Can you explain the word "${word.word}" in more detail? Give me some more examples and tell me about common mistakes Vietnamese learners make with it.`;
      handleStartTutorChat(prompt);
  }, [handleStartTutorChat]);

  const handleBackFromTutor = useCallback(() => {
    setAppState(lastAppState);
  }, [lastAppState]);
  
    // --- Auth Flow ---
    const handleContinueAsGuest = () => {
        setIsGuestSession(true);
        setAppState(AppState.SHOWING_DASHBOARD);
    };

    const handleSignIn = async () => {
        setSignInState({ isLoading: true, error: null });
        try {
            await signInWithGoogle();
            // The useEffect hook will handle transitioning the app state
        } catch (err: any) {
            console.error("Sign-in error:", err);
            let errorMessage;
            if (err.code === 'auth/unauthorized-domain') {
                 const domain = window.location.hostname;
                errorMessage = `<div class="text-left">...</div>`; // Keep existing detailed error
            } else {
                errorMessage = "Đăng nhập thất bại. Vui lòng thử lại.";
            }
            setSignInState({ isLoading: false, error: errorMessage });
        }
    };
    
  const handleSignOut = useCallback(async () => {
    try {
        await signOutUser();
        setIsGuestSession(false); // End guest session on sign out
        setAppState(AppState.SHOWING_LANDING_PAGE); // Go to landing page
    } catch (error) {
        console.error("Error signing out: ", error);
        alert("Đăng xuất thất bại. Vui lòng thử lại.");
    }
  }, []);

  const handleRequestSignIn = () => {
      setAppState(AppState.SHOWING_LOGIN);
  };

  // --- Pronunciation Practice Flow ---
  const handleStartPronunciationPractice = useCallback((word: VocabularyWord) => {
    if (!user) {
        setSignInState({ isLoading: false, error: 'Vui lòng đăng nhập để sử dụng tính năng luyện phát âm.' });
        setAppState(AppState.SHOWING_LOGIN);
        return;
    }
    setWordToPractice(word);
  }, [user]);

  const handleClosePronunciationPractice = () => {
      setWordToPractice(null);
  };

  const renderContent = () => {
    if (authLoading || (user && userDataLoading)) {
      return (
         <div className="flex h-screen w-screen items-center justify-center -mt-20">
              <Spinner message={authLoading ? "Đang xác thực..." : "Đang tải dữ liệu..."} />
          </div>
      );
    }
    
    if (isLoading) {
      return <div className="flex h-full items-center justify-center"><Spinner message={loadingMessage}/></div>;
    }
    
    if (error) {
      return (
        <div className="text-center p-8 bg-error-light rounded-xl border border-error">
          <h2 className="text-xl font-bold text-error-text">Đã xảy ra lỗi</h2>
          <p className="mt-2 text-error-text">{error}</p>
          <button
            onClick={handleRestart}
            className="mt-6 px-6 py-2 bg-error text-white font-semibold rounded-lg hover:bg-error-hover transition-colors"
          >
            Về trang chính
          </button>
        </div>
      );
    }
    
    if (!userData && !isGuestSession) {
        // This handles the case where user data is not yet available for a logged-in user
        // or the initial state before any user action.
        if (appState === AppState.SHOWING_LANDING_PAGE) {
             return <LandingPageView onStartLearningGuest={handleContinueAsGuest} onRequestSignIn={handleRequestSignIn} />;
        }
        if (appState === AppState.SHOWING_LOGIN) {
            return <LoginView onSignIn={handleSignIn} onBack={() => setAppState(AppState.SHOWING_LANDING_PAGE)} isLoading={signInState.isLoading} error={signInState.error} />;
        }
        return <div className="flex h-screen w-screen items-center justify-center -mt-20"><Spinner /></div>
    }
    
    if (!userData) return null; // Should not happen if logic is correct

    switch (appState) {
      case AppState.SHOWING_LANDING_PAGE:
        return <LandingPageView onStartLearningGuest={handleContinueAsGuest} onRequestSignIn={handleRequestSignIn} />;
      case AppState.SHOWING_LOGIN:
        return <LoginView onSignIn={handleSignIn} onBack={() => setAppState(AppState.SHOWING_LANDING_PAGE)} isLoading={signInState.isLoading} error={signInState.error} />;
      case AppState.SHOWING_INTRO:
        return <IntroView onStartTest={handleStartPlacementTest} onSkip={handleChooseLevelManually} />;
      case AppState.SHOWING_DASHBOARD:
        return <DashboardView 
                    userData={userData}
                    user={user}
                    onSelectLevel={() => setAppState(AppState.SELECTING_LEVEL)}
                    onStartPractice={handleStartPractice}
                    onStartWeaknessReview={handleStartWeaknessReview}
                    onViewLeaderboard={handleViewLeaderboard}
                    onStartTutorChat={() => handleStartTutorChat()}
                    onStartSrsReview={handleStartSrsReview}
                    wordsDueForReview={userActions.getWordsDueForReview().length}
                />;
      case AppState.TAKING_PLACEMENT_TEST:
        return placementTest && <PlacementTestView test={placementTest} onFinishTest={handleFinishPlacementTest} />;
      case AppState.VIEWING_PLACEMENT_RESULTS:
        return recommendedLevel && <PlacementResultsView recommendedLevel={recommendedLevel} onAccept={handleSelectLevel} onReject={handleChooseLevelManually} />;
      case AppState.SELECTING_LEVEL:
        return <LevelSelector onSelectLevel={handleSelectLevel} onBack={handleBackToDashboard} />;
      case AppState.SELECTING_TOPIC:
        return selectedLevel && <TopicSelector 
                    topics={topics} 
                    onSelectTopic={handleSelectTopic} 
                    onStartPractice={handleStartPractice}
                    onBack={handleBackToLevelSelect} 
                    completedTopics={userActions.getCompletedTopics(selectedLevel)}
                    favoriteTopics={userData.favoriteTopics?.[selectedLevel] || []}
                    difficultTopics={userData.difficultTopics?.[selectedLevel] || []}
                    onToggleFavorite={(topic) => userActions.toggleFavoriteTopic(selectedLevel, topic)}
                    onToggleDifficult={(topic) => userActions.toggleDifficultTopic(selectedLevel, topic)}
                    isGuest={!user}
                />;
      case AppState.IN_LESSON:
        return <LessonView vocabulary={vocabulary} onStartTest={handleStartTest} onBack={handleBackToTopicSelect} onPlayAudio={handlePlayAudio} audioState={audioState} onAskTutor={handleAskTutorForWord} onStartPronunciationPractice={handleStartPronunciationPractice} />;
      case AppState.TAKING_TEST:
        return test && <TestView test={test} vocabulary={vocabulary} onFinishTest={handleFinishTest} onUpdateMastery={handleUpdateMastery} />;
      case AppState.VIEWING_RESULTS:
        return <ResultsView 
                  score={score} 
                  totalQuestions={test ? test.mcqs.length + test.fillInTheBlanks.length + test.matchingPairs.length : 0} 
                  xpGained={xpGained} 
                  onRestart={handleGoHome} 
                  onRetry={handleRetryTest}
                  incorrectWords={incorrectWords}
                  onStartReview={handleStartReview}
                  isGuest={!user}
                  onRequestSignIn={handleRequestSignIn}
                />;
      case AppState.IN_VOCAB_PRACTICE:
        return <PracticeView vocabulary={vocabulary} onBack={handleBackToTopicSelect} onPlayAudio={handlePlayAudio} audioState={audioState} onStartPronunciationPractice={handleStartPronunciationPractice} />;
      case AppState.IN_SRS_REVIEW:
        return <ReviewView vocabulary={reviewWords} onBack={handleBackToDashboard} onPlayAudio={handlePlayAudio} audioState={audioState} onUpdateMastery={handleUpdateMastery} onStartPronunciationPractice={handleStartPronunciationPractice} />;
      case AppState.VIEWING_PROGRESS:
        return <ProgressView userData={userData} user={user!} onBack={handleBackToMain} onViewAchievements={handleViewAchievements} />;
      case AppState.VIEWING_ACHIEVEMENTS:
        return <AchievementsView userData={userData} onBack={handleBackToMain} />;
      case AppState.VIEWING_LEADERBOARD:
        return <LeaderboardView currentUserScore={userData.fluencyScore} onBack={handleBackToMain} />;
      case AppState.CHATTING_WITH_TUTOR:
        return <AITutorView history={tutorHistory} isLoading={isTutorLoading} onSendMessage={handleSendTutorMessage} onBack={handleBackFromTutor} />;
      case AppState.SHOWING_SPEAKING_INTRO:
        return <SpeakingIntroView onStart={handleConfirmStartSimulator} onCancel={handleBackFromSpeaking} />;
      case AppState.IN_SPEAKING_SIMULATOR:
        return <SpeakingSimulatorView topic={selectedTopic || 'a topic of your choice'} imagePromptUrl={speakingPart2Image} onFinish={handleFinishSpeakingTest} />;
      case AppState.VIEWING_SPEAKING_FEEDBACK:
        return speakingFeedback && <SpeakingFeedbackView feedback={speakingFeedback} onRestart={handleConfirmStartSimulator} onBack={handleBackFromSpeaking} />;
      default:
         return <p>Invalid App State</p>;
    }
  };

  const showSpeakingButton = user && ![
    AppState.SHOWING_LANDING_PAGE,
    AppState.SHOWING_LOGIN,
    AppState.SHOWING_INTRO,
    AppState.TAKING_PLACEMENT_TEST,
    AppState.VIEWING_PLACEMENT_RESULTS,
    AppState.TAKING_TEST,
    AppState.VIEWING_RESULTS,
    AppState.IN_VOCAB_PRACTICE,
    AppState.VIEWING_PROGRESS,
    AppState.SHOWING_SPEAKING_INTRO,
    AppState.IN_SPEAKING_SIMULATOR,
    AppState.VIEWING_SPEAKING_FEEDBACK,
    AppState.VIEWING_LEADERBOARD,
    AppState.CHATTING_WITH_TUTOR,
    AppState.VIEWING_ACHIEVEMENTS,
    AppState.IN_SRS_REVIEW,
  ].includes(appState) && !isLoading;

  const showHeader = appState !== AppState.SHOWING_LANDING_PAGE && appState !== AppState.SHOWING_LOGIN;

  return (
    <div className="min-h-screen flex flex-col">
      {showHeader && <Header user={user} isGuest={isGuestSession} streak={userData?.streak ?? 0} xp={userData?.totalXp ?? 0} onViewProgress={handleViewProgress} onHomeClick={handleGoHome} showHomeButton={appState !== AppState.SHOWING_DASHBOARD && appState !== AppState.SHOWING_INTRO} onSignOut={handleSignOut} onRequestSignIn={handleRequestSignIn} />}
      <main className="flex-grow flex flex-col w-full">
        <div className="w-full max-w-4xl mx-auto flex-grow p-4 sm:p-6 md:p-8">
          {renderContent()}
        </div>
      </main>
      {showSpeakingButton && <ConversationButton onClick={handleStartSpeakingPractice} />}
      {showAchievement && <AchievementToast achievement={showAchievement} />}
      {wordToPractice && <PronunciationPracticeModal word={wordToPractice} onClose={handleClosePronunciationPractice} />}
       {(appState !== AppState.SHOWING_LANDING_PAGE && appState !== AppState.SHOWING_LOGIN) && (
          <footer className="text-center p-4 text-sm text-secondary">
              <p>Phát triển với Google Gemini API</p>
          </footer>
      )}
    </div>
  );
};

export default App;