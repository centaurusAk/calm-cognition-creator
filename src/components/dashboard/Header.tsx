import { motion } from 'framer-motion';
import { Bell, Settings, Sun, Moon, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';

interface HeaderProps {
  focusMode: boolean;
  onToggleDarkMode?: () => void;
  isDarkMode?: boolean;
}

export function Header({ focusMode, onToggleDarkMode, isDarkMode }: HeaderProps) {
  const navigate = useNavigate();
  const now = new Date();
  const hour = now.getHours();
  
  const greeting = hour < 12 
    ? 'Good morning' 
    : hour < 17 
      ? 'Good afternoon' 
      : 'Good evening';

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={cn(
        'sticky top-0 z-50 border-b backdrop-blur-xl transition-colors',
        focusMode 
          ? 'bg-focus/80 border-white/10' 
          : 'bg-background/80 border-border'
      )}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Left section - Greeting */}
          <div className="flex items-center gap-4">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              className={cn(
                'flex h-10 w-10 items-center justify-center rounded-xl',
                focusMode 
                  ? 'bg-primary/20 text-primary' 
                  : 'bg-gradient-to-br from-primary to-primary/80 text-primary-foreground'
              )}
            >
              <Sparkles className="h-5 w-5" />
            </motion.div>
            <div>
              <h1 className={cn(
                'font-display text-xl font-semibold',
                focusMode ? 'text-focus-foreground' : 'text-foreground'
              )}>
                {greeting}
              </h1>
              <p className={cn(
                'text-sm',
                focusMode ? 'text-focus-foreground/60' : 'text-muted-foreground'
              )}>
                {format(now, 'EEEE, MMMM d')}
              </p>
            </div>
          </div>

          {/* Right section - Actions */}
          <div className="flex items-center gap-2">
            {!focusMode && (
              <>
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={onToggleDarkMode}
                    className="relative"
                  >
                    {isDarkMode ? (
                      <Sun className="h-5 w-5" />
                    ) : (
                      <Moon className="h-5 w-5" />
                    )}
                  </Button>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <Button variant="ghost" size="icon" className="relative">
                    <Bell className="h-5 w-5" />
                    <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-critical" />
                  </Button>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <Button variant="ghost" size="icon">
                    <Settings className="h-5 w-5" />
                  </Button>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5, type: 'spring' }}
                  className="ml-2"
                >
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => navigate('/profile')}
                    className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent text-primary-foreground font-medium text-sm cursor-pointer"
                  >
                    A
                  </motion.button>
                </motion.div>
              </>
            )}

            {focusMode && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center gap-2 text-focus-foreground/60"
              >
                <motion.div
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="h-2 w-2 rounded-full bg-accent"
                />
                <span className="text-sm">Focus Mode Active</span>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </motion.header>
  );
}
