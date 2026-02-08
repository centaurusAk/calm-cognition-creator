import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Header } from '@/components/dashboard/Header';
import { TodayWidget } from '@/components/dashboard/TodayWidget';
import { WeekView } from '@/components/dashboard/WeekView';
import { FocusModeWidget } from '@/components/dashboard/FocusModeWidget';
import { CourseProgress } from '@/components/dashboard/CourseProgress';
import { QuickStats } from '@/components/dashboard/QuickStats';
import { useFocusMode } from '@/hooks/useFocusMode';
import { useDashboardData } from '@/hooks/useDashboardData';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

const Index = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const { focusMode, session, startFocus, pauseFocus, resumeFocus, endFocus } = useFocusMode();
  const { todayTasks, weekTasks, courses, totalEstimatedTime, addTask, loading } = useDashboardData();

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => setIsDarkMode(!isDarkMode);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center gap-4"
        >
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading your dashboard...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className={cn(
      'min-h-screen transition-colors duration-500',
      focusMode ? 'bg-focus' : 'bg-background'
    )}>
      <Header 
        focusMode={focusMode} 
        onToggleDarkMode={toggleDarkMode}
        isDarkMode={isDarkMode}
      />

      <main className="container mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8">
        <AnimatePresence mode="wait">
          {focusMode ? (
            /* Focus Mode Layout - Minimal, distraction-free */
            <motion.div
              key="focus-layout"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="max-w-2xl mx-auto"
            >
              <FocusModeWidget
                focusMode={focusMode}
                session={session}
                onStart={startFocus}
                onPause={pauseFocus}
                onResume={resumeFocus}
                onEnd={endFocus}
              />
            </motion.div>
          ) : (
            /* Regular Dashboard Layout */
            <motion.div
              key="dashboard-layout"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-4 sm:space-y-8"
            >
              {/* Quick Stats Row */}
              <QuickStats focusMode={focusMode} />

              {/* Main Content Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
                {/* Left Column - Today's Focus (Larger) */}
                <div className="lg:col-span-2 space-y-4 sm:space-y-6">
                  <TodayWidget 
                    tasks={todayTasks} 
                    totalTime={totalEstimatedTime}
                    onTaskAdd={addTask}
                  />
                  <WeekView tasks={weekTasks} />
                </div>

                {/* Right Column - Widgets */}
                <div className="space-y-4 sm:space-y-6">
                  <FocusModeWidget
                    focusMode={focusMode}
                    session={session}
                    onStart={startFocus}
                    onPause={pauseFocus}
                    onResume={resumeFocus}
                    onEnd={endFocus}
                  />
                  <CourseProgress courses={courses} />
                </div>
              </div>

              {/* Footer hint - hidden on mobile */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
                className="text-center py-4 sm:py-8 hidden sm:block"
              >
                <p className="text-sm text-muted-foreground">
                  💡 Tip: Start a focus session to hide distractions and boost concentration
                </p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Ambient decoration */}
      {!focusMode && (
        <>
          <div className="fixed top-0 left-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
          <div className="fixed bottom-0 right-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl pointer-events-none" />
        </>
      )}
    </div>
  );
};

export default Index;
