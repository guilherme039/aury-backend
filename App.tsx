



import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { Meal, DailyGoals, UserProfileData, OnboardingData, WaterLogEntry, UserSession } from './types';
import { DAILY_GOALS } from './constants';
import { storageService } from './services/storageService';
import Dashboard from './components/Dashboard';
import BottomNav from './components/BottomNav';
import AddMealModal from './components/AddMealModal';
import Analytics from './components/Analytics';
import DrinkTracker from './components/DrinkTracker';
import MealDetail from './components/MealDetail';
import SplashScreen from './components/SplashScreen';
import Settings from './components/Settings';
import OnboardingFlow from './components/OnboardingFlow';
import LoginScreen from './components/LoginScreen';
import Toast from './components/Toast';
import SubscriptionScreen from './components/SubscriptionScreen';

import { BACKEND_URL } from './backendConfig';

function App() {
  const [meals, setMeals] = useState<Meal[]>(() => {
    return storageService.getMeals();
  });
  const [dailyGoals, setDailyGoals] = useState<DailyGoals>(() => {
    const savedGoals = typeof window !== 'undefined' ? localStorage.getItem('dailyGoals') : null;
    if (savedGoals) {
      try {
        const parsedGoals = JSON.parse(savedGoals);
        return { ...DAILY_GOALS, ...parsedGoals };
      } catch (e) {
        console.error("Failed to parse daily goals from localStorage", e);
        return DAILY_GOALS;
      }
    }
    return DAILY_GOALS;
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeNav, setActiveNav] = useState<'Início' | 'Análises' | 'Drink'>('Início');
  const [activeDay, setActiveDay] = useState<'Hoje' | 'Ontem'>('Hoje');
  const [selectedMeal, setSelectedMeal] = useState<Meal | null>(null);
  const [waterLog, setWaterLog] = useState<WaterLogEntry[]>(() => {
    return storageService.getWaterLog();
  });
  const [isShowingSplash, setIsShowingSplash] = useState(true);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfileData>({
    name: 'John Doe',
    photoUrl: 'https://i.pravatar.cc/150?u=a042581f4e29026704d',
    goal: 'Manter Peso',
    age: 28,
    weight: 75,
    height: 180,
    isOwner: true, // Default to owner for this demo
  });
  const [isOnboardingComplete, setIsOnboardingComplete] = useState(() => {
    return typeof window !== 'undefined' && localStorage.getItem('onboardingComplete') === 'true';
  });
  const [userSession, setUserSession] = useState<UserSession>(() => {
    const savedSession = typeof window !== 'undefined' ? localStorage.getItem('userSession') : null;
    if (savedSession) {
      try {
        return JSON.parse(savedSession);
      } catch (e) {
        return { isLoggedIn: false, isOwner: false, analysesRemaining: 3, subscriptionStatus: 'none' };
      }
    }
    return { isLoggedIn: false, isOwner: false, analysesRemaining: 3, subscriptionStatus: 'none' };
  });

  const [toastMessage, setToastMessage] = useState('');

  const isLocked = !userSession.isOwner && userSession.analysesRemaining <= 0;

  const todaysWaterIntake = useMemo(() => {
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    return waterLog
      .filter(entry => entry.timestamp >= todayStart.getTime())
      .reduce((total, entry) => total + entry.amount, 0);
  }, [waterLog]);

  const handleLogin = useCallback((asOwner: boolean) => {
    const newSession = {
      isLoggedIn: true,
      isOwner: asOwner,
      analysesRemaining: asOwner ? 999 : 3, // Owners get unlimited, others get 3.
      subscriptionStatus: 'none',
    };
    setUserSession(newSession);
    localStorage.setItem('userSession', JSON.stringify(newSession));
  }, []);

  // Developer Bypass Function
  const handleDevBypass = useCallback(() => {
    const newSession = {
      ...userSession,
      isOwner: true, // Grant owner privileges
      analysesRemaining: 9999,
      subscriptionStatus: 'active' as const
    };
    setUserSession(newSession);
    localStorage.setItem('userSession', JSON.stringify(newSession));
    setToastMessage('Dev Mode: Acesso Ilimitado Ativado');
    setTimeout(() => setToastMessage(''), 2000);
  }, [userSession]);


  const handleUpdateProfile = useCallback((newProfileData: Partial<UserProfileData>) => {
    setUserProfile(prevProfile => ({ ...prevProfile, ...newProfileData }));
  }, []);

  const handleUpdateGoals = useCallback((updatedGoals: Partial<DailyGoals>) => {
    setDailyGoals(prevGoals => {
      const newGoals = { ...prevGoals, ...updatedGoals };
      if (typeof window !== 'undefined') {
        localStorage.setItem('dailyGoals', JSON.stringify(newGoals));
      }
      return newGoals;
    });
  }, []);


  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('meals', JSON.stringify(meals));
    }
  }, [meals]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('waterLog', JSON.stringify(waterLog));
    }
  }, [waterLog]);

  // Limpar dados expirados na inicialização
  useEffect(() => {
    storageService.cleanExpiredData();
    const stats = storageService.getStats();
    console.log('Storage stats:', stats);

    const timer = setTimeout(() => {
      setIsShowingSplash(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  // Backend Wake-up Ping
  useEffect(() => {
    fetch(`${BACKEND_URL}/ping`, {
      method: "GET",
    }).catch(() => { });
  }, []);

  const handleOnboardingComplete = useCallback((onboardingData: OnboardingData) => {
    handleUpdateProfile({
      goal: onboardingData.goal,
      workoutFrequency: onboardingData.workoutFrequency,
      obstacle: onboardingData.obstacle,
      howHeard: onboardingData.howHeard,
    });
    localStorage.setItem('onboardingComplete', 'true');
    setIsOnboardingComplete(true);
  }, [handleUpdateProfile]);

  const mealsForDisplay = useMemo(() => {
    return activeDay === 'Hoje' ? meals : [];
  }, [meals, activeDay]);

  const nutritionTotals = useMemo(() => {
    return mealsForDisplay.reduce(
      (acc, meal) => {
        acc.calories += meal.nutrition.calories;
        acc.protein += meal.nutrition.protein;
        acc.carbs += meal.nutrition.carbs;
        acc.fat += meal.nutrition.fat;
        return acc;
      },
      { calories: 0, protein: 0, carbs: 0, fat: 0 }
    );
  }, [mealsForDisplay]);

  const handleAddMeal = useCallback((newMeal: Omit<Meal, 'id' | 'time' | 'timestamp'>) => {
    if (isLocked) {
      console.log("Limite de análise atingido. Ação bloqueada.");
      return;
    }

    const mealWithId: Omit<Meal, 'timestamp'> = {
      ...newMeal,
      id: Date.now(),
      time: new Date().toLocaleTimeString('pt-BR', {
        hour: '2-digit',
        minute: '2-digit',
      }),
    };

    // Usa storageService que adiciona timestamp automaticamente
    const savedMeal = storageService.addMeal(mealWithId);
    setMeals(prevMeals => [savedMeal, ...prevMeals]);

    setIsModalOpen(false);
    setToastMessage('Concluído!');
    setTimeout(() => {
      setToastMessage('');
    }, 1000);

    if (!userSession.isOwner) {
      setUserSession(prev => {
        const newSession = { ...prev, analysesRemaining: Math.max(0, prev.analysesRemaining - 1) };
        localStorage.setItem('userSession', JSON.stringify(newSession));
        return newSession;
      });
    }
  }, [isLocked, userSession.isOwner]);

  const handleSelectMeal = useCallback((meal: Meal) => {
    setSelectedMeal(meal);
  }, []);

  const handleBackToDashboard = useCallback(() => {
    setSelectedMeal(null);
  }, [])

  const handleDeleteMeal = useCallback((mealId: number) => {
    storageService.deleteMeal(mealId);
    setMeals(prevMeals => prevMeals.filter(meal => meal.id !== mealId));
    setSelectedMeal(null);
  }, [])

  const handleClearHistory = useCallback(() => {
    setMeals([]);
    setWaterLog([]);
  }, []);

  const handleAddWater = useCallback((amount: number) => {
    const newEntry = storageService.addWaterEntry(amount);
    setWaterLog(prevLog => [...prevLog, newEntry]);
  }, []);

  const handleResetWater = useCallback(() => {
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    setWaterLog(prevLog => prevLog.filter(entry => entry.timestamp < todayStart.getTime()));
  }, []);

  const handleOpenSettings = useCallback(() => setIsSettingsOpen(true), []);
  const handleCloseSettings = useCallback(() => setIsSettingsOpen(false), []);
  const handleOpenModal = useCallback(() => setIsModalOpen(true), []);
  const handleCloseModal = useCallback(() => setIsModalOpen(false), []);

  const renderContent = () => {
    if (isSettingsOpen) {
      return <Settings goals={dailyGoals} onBack={handleCloseSettings} profile={userProfile} onUpdateProfile={handleUpdateProfile} />;
    }

    if (selectedMeal) {
      return <MealDetail meal={selectedMeal} onBack={handleBackToDashboard} onDelete={handleDeleteMeal} />;
    }

    switch (activeNav) {
      case 'Início':
        return (
          <Dashboard
            meals={mealsForDisplay}
            goals={dailyGoals}
            onUpdateGoals={handleUpdateGoals}
            totals={nutritionTotals}
            activeDay={activeDay}
            setActiveDay={setActiveDay}
            onSelectMeal={handleSelectMeal}
            onClearHistory={handleClearHistory}
            onGoToSettings={handleOpenSettings}
          />
        );
      case 'Análises':
        return <Analytics meals={meals} goals={dailyGoals} waterLog={waterLog} />;
      case 'Drink':
        return (
          <DrinkTracker
            currentIntake={todaysWaterIntake}
            goal={dailyGoals.water}
            onAddWater={handleAddWater}
            onReset={handleResetWater}
            waterLog={waterLog}
            userWeight={userProfile.weight}
            onUpdateGoal={(newGoal) => handleUpdateGoals({ water: newGoal })}
          />
        );
      default:
        return null;
    }
  };

  if (isShowingSplash) {
    return <SplashScreen />;
  }

  if (!userSession.isLoggedIn) {
    return <LoginScreen onLoginSuccess={handleLogin} />;
  }

  if (!isOnboardingComplete) {
    return <OnboardingFlow onComplete={handleOnboardingComplete} />;
  }

  if (isLocked) {
    return <SubscriptionScreen onBypass={handleDevBypass} />;
  }


  return (
    <div className="bg-[#0C0C0E] min-h-screen font-sans text-[#E5E7EB] antialiased body-bg-animate">
      <div className="container mx-auto max-w-lg p-4 pb-24 relative">
        {renderContent()}
      </div>
      {!selectedMeal && !isSettingsOpen && <BottomNav activeNav={activeNav} setActiveNav={setActiveNav} onAddMealClick={handleOpenModal} />}
      <AddMealModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onAddMeal={handleAddMeal}
        dailyGoals={dailyGoals}
        currentTotals={nutritionTotals}
      />
      <Toast message={toastMessage} show={toastMessage.length > 0} />
    </div>
  );
}

export default App;