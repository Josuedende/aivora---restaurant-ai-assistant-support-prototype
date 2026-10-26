/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ScreenId, OnboardingStep, RestaurantProfile, KnowledgeDocument, CustomerConversation } from './types';
import { initialRestaurantProfile, initialKnowledgeDocuments, initialConversations } from './data/mockData';
import { LandingPage } from './components/landing/LandingPage';
import { AuthScreen } from './components/auth/AuthScreen';
import { RestaurantOnboarding } from './components/onboarding/RestaurantOnboarding';
import { AppLayout } from './components/layout/AppLayout';
import { MainDashboard } from './components/dashboard/MainDashboard';
import { KnowledgeManagement } from './components/knowledge/KnowledgeManagement';
import { ConversationsScreen } from './components/conversations/ConversationsScreen';
import { SettingsView } from './components/settings/SettingsView';
import { BookingsView } from './components/bookings/BookingsView';
import { DesignSystemView } from './components/designSystem/DesignSystemView';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<ScreenId>('landing');
  const [onboardingStep, setOnboardingStep] = useState<OnboardingStep>(1);
  const [restaurant, setRestaurant] = useState<RestaurantProfile>(initialRestaurantProfile);
  const [documents, setDocuments] = useState<KnowledgeDocument[]>(initialKnowledgeDocuments);
  const [conversations, setConversations] = useState<CustomerConversation[]>(initialConversations);
  const [selectedConversationId, setSelectedConversationId] = useState<string>('');

  // Navigation callbacks
  const handleLoginSuccess = () => {
    setCurrentScreen('dashboard');
  };

  const handleRegisterSuccess = (restaurantName: string, managerName: string) => {
    setRestaurant((prev) => ({
      ...prev,
      name: restaurantName,
    }));
    setOnboardingStep(1);
    setCurrentScreen('onboarding');
  };

  const handleOnboardingComplete = () => {
    setCurrentScreen('dashboard');
  };

  const handleLogout = () => {
    setCurrentScreen('login');
  };

  const handleGoToLogin = () => {
    setCurrentScreen('login');
  };

  const handleGoToRegister = () => {
    setCurrentScreen('register');
  };

  const handleGoToHome = () => {
    setCurrentScreen('landing');
  };

  const handleToggleTakeover = (convId: string) => {
    setConversations((prev) =>
      prev.map((c) => {
        if (c.id === convId) {
          const isCurrentlyTakenOver = c.status === 'In Human Control';
          return {
            ...c,
            status: isCurrentlyTakenOver ? 'Answered' : 'In Human Control',
          };
        }
        return c;
      })
    );
  };

  const unreadAttentionCount = conversations.filter((c) => c.status === 'Human Required').length;

  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col font-sans">
      {/* Primary Screen View */}
      {currentScreen === 'landing' ? (
        <LandingPage
          onGoToLogin={handleGoToLogin}
          onGoToRegister={handleGoToRegister}
          onLoginSuccess={handleLoginSuccess}
        />
      ) : currentScreen === 'login' || currentScreen === 'register' ? (
        <AuthScreen
          initialMode={currentScreen}
          onLoginSuccess={handleLoginSuccess}
          onRegisterSuccess={handleRegisterSuccess}
          onSwitchMode={(mode) => setCurrentScreen(mode)}
          restaurant={restaurant}
          onGoToHome={handleGoToHome}
        />
      ) : currentScreen === 'onboarding' ? (
        <RestaurantOnboarding
          currentStep={onboardingStep}
          setStep={setOnboardingStep}
          restaurant={restaurant}
          setRestaurant={setRestaurant}
          onComplete={handleOnboardingComplete}
          onBackToPreviousPage={() => setCurrentScreen('register')}
        />
      ) : (
        <AppLayout
          currentScreen={currentScreen}
          onNavigate={(screen) => setCurrentScreen(screen)}
          restaurant={restaurant}
          setRestaurant={setRestaurant}
          unreadCount={unreadAttentionCount}
          docCount={documents.length}
          onLogout={handleLogout}
        >
          {currentScreen === 'dashboard' && (
            <MainDashboard
              restaurant={restaurant}
              conversations={conversations}
              onNavigate={(screen) => setCurrentScreen(screen)}
              onSelectConversation={(id) => {
                setSelectedConversationId(id);
                setCurrentScreen('conversations');
              }}
              onToggleTakeover={handleToggleTakeover}
              onLogout={handleLogout}
            />
          )}

          {currentScreen === 'knowledge' && (
            <KnowledgeManagement
              documents={documents}
              setDocuments={setDocuments}
              restaurant={restaurant}
              setRestaurant={setRestaurant}
            />
          )}

          {currentScreen === 'conversations' && (
            <ConversationsScreen
              conversations={conversations}
              setConversations={setConversations}
              selectedId={selectedConversationId}
              setSelectedId={setSelectedConversationId}
            />
          )}

          {currentScreen === 'settings' && (
            <SettingsView
              restaurant={restaurant}
              setRestaurant={setRestaurant}
            />
          )}

          {currentScreen === 'bookings' && (
            <BookingsView
              restaurant={restaurant}
              conversations={conversations}
              onSelectConversation={(id) => {
                setSelectedConversationId(id);
                setCurrentScreen('conversations');
              }}
            />
          )}

          {currentScreen === 'design-system' && <DesignSystemView />}
        </AppLayout>
      )}
    </div>
  );
}
