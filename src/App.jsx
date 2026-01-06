import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useHabits } from './hooks/useHabits';
import { Header } from './components/Header';
import { TrackerView } from './components/TrackerView';
import { ReflectionView } from './components/ReflectionView';
import { ManageDashboard } from './components/ManageDashboard';

function AppContent() {
  // Global State for Month selection (shared across views)
  const [currentDate, setCurrentDate] = useState(new Date());

  const {
    habits,
    dailyLogs,
    reflection,
    isLoading,
    error,
    addHabit,
    toggleHabit,
    deleteHabit
  } = useHabits(currentDate);

  const location = useLocation();

  return (
    <div className="app-container">
      <Header activePath={location.pathname} />

      <main>
        {isLoading && <p>Loading your journal...</p>}
        {error && <p style={{ color: 'red' }}>Error: {error}</p>}

        {!isLoading && !error && (
          <Routes>
            <Route path="/" element={<Navigate to="/tracker" replace />} />

            <Route path="/tracker" element={
              <TrackerView
                currentDate={currentDate}
                setCurrentDate={setCurrentDate}
                habits={habits}
                dailyLogs={dailyLogs}
                onToggleHabit={toggleHabit}
                onAddHabit={addHabit}
              />
            } />

            <Route path="/charts" element={
              <ReflectionView
                currentDate={currentDate}
                habits={habits}
                dailyLogs={dailyLogs}
              />
            } />

            <Route path="/manage" element={<ManageDashboard />} />
          </Routes>
        )}
      </main>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}
