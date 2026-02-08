import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useMemo } from 'react';
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

type WorkloadLevel = 'light' | 'moderate' | 'heavy';

const Index = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const { focusMode, session, startFocus, pauseFocus, resumeFocus, endFocus } = useFocusMode();
  const { todayTasks, weekTasks, courses, totalEstimatedTime, addTask, updateTask, deleteTask, loading } = useDashboardData();

  // Calculate workload level based on estimated time
  const workloadLevel: WorkloadLevel = useMemo(() => {
    if (totalEstimatedTime <= 120) return 'light';
    if (totalEstimatedTime <= 180) return 'moderate';
    return 'heavy';
  }, [totalEstimatedTime]);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => setIsDarkMode(!isDarkMode);

  // Workload-based styling
  const workloadStyles = {
    light: {
      bg: 'bg-[hsl(var(--workload-light))]',
      glow1: 'bg-accent/10',
      glow2: 'bg-primary/8',
      message: '✨ Light day ahead',
    },
    moderate: {
      bg: 'bg-[hsl(var(--workload-moderate))]',
      glow1: 'bg-urgency/10',
      glow2: 'bg-primary/8',
      message: '⚡ Moderate workload',
    },
    heavy: {
      bg: 'bg-[hsl(var(--workload-heavy))]',
      glow1: 'bg-critical/10',
      glow2: 'bg-urgency/8',
      message: '🔥 Heavy workload - stay focused',
    },
  };

  const currentStyle = workloadStyles[workloadLevel];

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
    <motion.div 
      key={workloadLevel}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className={cn(
        'min-h-screen transition-colors duration-700',
        focusMode ? 'bg-focus' : currentStyle.bg
      )}
    >
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
                    onTaskDelete={deleteTask}
                    onTaskUpdate={updateTask}
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
                  {currentStyle.message} • 💡 Start a focus session to boost concentration
                </p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Ambient decoration - changes based on workload */}
      {!focusMode && (
        <>
          <motion.div 
            key={`glow1-${workloadLevel}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
            className={cn(
              "fixed top-0 left-0 w-80 sm:w-96 h-80 sm:h-96 rounded-full blur-3xl pointer-events-none transition-colors duration-700",
              currentStyle.glow1
            )} 
          />
          <motion.div 
            key={`glow2-${workloadLevel}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
            className={cn(
              "fixed bottom-0 right-0 w-80 sm:w-96 h-80 sm:h-96 rounded-full blur-3xl pointer-events-none transition-colors duration-700",
              currentStyle.glow2
            )} 
          />
          {/* Extra accent glow for heavy workload */}
          {workloadLevel === 'heavy' && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.5 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full blur-3xl pointer-events-none bg-critical/5"
            />
          )}
        </>
      )}
    </motion.div>
  );
};

export default Index;
