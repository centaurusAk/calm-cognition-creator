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

const Index = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const { focusMode, session, startFocus, pauseFocus, resumeFocus, endFocus } = useFocusMode();
  const { todayTasks, weekTasks, courses, totalEstimatedTime } = useDashboardData();

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => setIsDarkMode(!isDarkMode);

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

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
              className="space-y-8"
            >
              {/* Quick Stats Row */}
              <QuickStats focusMode={focusMode} />

              {/* Main Content Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column - Today's Focus (Larger) */}
                <div className="lg:col-span-2 space-y-6">
                  <TodayWidget 
                    tasks={todayTasks} 
                    totalTime={totalEstimatedTime} 
                  />
                  <WeekView tasks={weekTasks} />
                </div>

                {/* Right Column - Widgets */}
                <div className="space-y-6">
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

              {/* Footer hint */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
                className="text-center py-8"
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
