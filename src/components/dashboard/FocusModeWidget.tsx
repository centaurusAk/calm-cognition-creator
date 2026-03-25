import { motion, AnimatePresence } from 'framer-motion';
import { Focus, Play, Pause, X, Timer, Brain, Headphones, Moon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface FocusModeWidgetProps {
  focusMode: boolean;
  session: {
    duration: number;
    elapsed: number;
    isActive: boolean;
    isPaused: boolean;
  };
  onStart: (duration: number) => void;
  onPause: () => void;
  onResume: () => void;
  onEnd: () => void;
}

const presets = [
  { duration: 25, label: 'Pomodoro', icon: Timer },
  { duration: 45, label: 'Deep Work', icon: Brain },
  { duration: 60, label: 'Extended', icon: Headphones },
  { duration: 90, label: 'Flow State', icon: Moon },
];

export function FocusModeWidget({ 
  focusMode, 
  session, 
  onStart, 
  onPause, 
  onResume, 
  onEnd 
}: FocusModeWidgetProps) {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = session.isActive 
    ? (session.elapsed / (session.duration * 60)) * 100 
    : 0;

  const remaining = session.duration * 60 - session.elapsed;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className={cn(
        'widget-container relative overflow-hidden',
        focusMode && 'bg-focus text-focus-foreground'
      )}
    >
      {/* Ambient background animation for focus mode */}
      {focusMode && (
        <motion.div
          className="absolute inset-0 opacity-30"
          animate={{
            background: [
              'radial-gradient(circle at 20% 50%, hsl(234 89% 64% / 0.3) 0%, transparent 50%)',
              'radial-gradient(circle at 80% 50%, hsl(234 89% 64% / 0.3) 0%, transparent 50%)',
              'radial-gradient(circle at 50% 80%, hsl(234 89% 64% / 0.3) 0%, transparent 50%)',
              'radial-gradient(circle at 20% 50%, hsl(234 89% 64% / 0.3) 0%, transparent 50%)',
            ],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
        />
      )}

      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <motion.div 
              className={cn(
                'flex h-10 w-10 items-center justify-center rounded-xl shadow-lg',
                focusMode 
                  ? 'bg-primary text-primary-foreground' 
                  : 'bg-gradient-to-br from-primary to-primary/80 text-primary-foreground'
              )}
              animate={focusMode ? { scale: [1, 1.1, 1] } : {}}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Focus className="h-5 w-5" />
            </motion.div>
            <div>
              <h2 className={cn(
                'font-display text-lg font-semibold',
                focusMode ? 'text-focus-foreground' : 'text-foreground'
              )}>
                Focus Mode
              </h2>
              <p className={cn(
                'text-sm',
                focusMode ? 'text-focus-foreground/70' : 'text-muted-foreground'
              )}>
                {focusMode ? 'Deep work session active' : 'Minimize distractions'}
              </p>
            </div>
          </div>

          {focusMode && (
            <motion.button
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              onClick={onEnd}
              aria-label="End focus session"
              className="p-2 rounded-lg hover:bg-white/10 transition-colors"
            >
              <X className="h-5 w-5" />
            </motion.button>
          )}
        </div>

        <AnimatePresence mode="wait">
          {!session.isActive ? (
            /* Preset Selection */
            <motion.div
              key="presets"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-2 gap-3"
            >
              {presets.map((preset, index) => (
                <motion.button
                  key={preset.duration}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => onStart(preset.duration)}
                  className={cn(
                    'flex flex-col items-center gap-2 p-4 rounded-xl transition-all',
                    'bg-secondary hover:bg-secondary/80 hover:shadow-md',
                    'border border-transparent hover:border-primary/20'
                  )}
                >
                  <preset.icon className="h-6 w-6 text-primary" />
                  <div className="text-center">
                    <p className="font-medium text-foreground">{preset.duration}m</p>
                    <p className="text-xs text-muted-foreground">{preset.label}</p>
                  </div>
                </motion.button>
              ))}
            </motion.div>
          ) : (
            /* Active Session Timer */
            <motion.div
              key="timer"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="flex flex-col items-center"
            >
              {/* Circular Progress */}
              <div className="relative w-48 h-48 mb-6">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                  {/* Background circle */}
                  <circle
                    cx="50"
                    cy="50"
                    r="45"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="4"
                    className="text-white/10"
                  />
                  {/* Progress circle */}
                  <motion.circle
                    cx="50"
                    cy="50"
                    r="45"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="4"
                    strokeLinecap="round"
                    className="text-primary"
                    style={{
                      strokeDasharray: `${2 * Math.PI * 45}`,
                    }}
                    animate={{
                      strokeDashoffset: `${2 * Math.PI * 45 * (1 - progress / 100)}`,
                    }}
                    transition={{ duration: 0.5 }}
                  />
                </svg>
                
                {/* Timer Display */}
                <div
                  role="timer"
                  aria-live="polite"
                  aria-label={`${formatTime(remaining)} remaining`}
                  className="absolute inset-0 flex flex-col items-center justify-center"
                >
                  <motion.span 
                    className="text-4xl font-display font-bold tabular-nums"
                    key={formatTime(remaining)}
                    initial={{ opacity: 0.5, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.2 }}
                  >
                    {formatTime(remaining)}
                  </motion.span>
                  <span className="text-sm text-focus-foreground/60 mt-1">
                    remaining
                  </span>
                </div>

                {/* Breathing animation ring */}
                <motion.div
                  className="absolute inset-0 rounded-full border-2 border-primary/30"
                  animate={{
                    scale: session.isPaused ? 1 : [1, 1.05, 1],
                    opacity: session.isPaused ? 0.3 : [0.3, 0.6, 0.3],
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                />
              </div>

              {/* Controls */}
              <div className="flex items-center gap-4">
                <Button
                  variant="outline"
                  size="lg"
                  onClick={onEnd}
                  className="border-white/20 bg-white/5 hover:bg-white/10 text-focus-foreground"
                >
                  End Session
                </Button>
                <Button
                  size="lg"
                  onClick={session.isPaused ? onResume : onPause}
                  className="btn-primary-glow min-w-[120px]"
                >
                  {session.isPaused ? (
                    <>
                      <Play className="mr-2 h-4 w-4" />
                      Resume
                    </>
                  ) : (
                    <>
                      <Pause className="mr-2 h-4 w-4" />
                      Pause
                    </>
                  )}
                </Button>
              </div>

              {/* Status message */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-6 text-sm text-focus-foreground/60 text-center"
              >
                {session.isPaused 
                  ? '⏸️ Session paused. Take a breather.'
                  : '🧘 Stay focused. You\'ve got this.'}
              </motion.p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
