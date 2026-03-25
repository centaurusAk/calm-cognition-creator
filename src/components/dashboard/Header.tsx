import { motion } from 'framer-motion';
import { Bell, Settings, Sun, Moon, Sparkles, LayoutDashboard, Calendar, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { NavLink } from '@/components/NavLink';
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

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    cn(
      'flex items-center gap-1.5 rounded-lg px-2 sm:px-3 py-1.5 text-xs sm:text-sm font-medium transition-colors',
      isActive
        ? 'bg-primary/10 text-primary'
        : 'text-muted-foreground hover:bg-muted hover:text-foreground'
    );

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
      <div className="container mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex h-14 sm:h-16 items-center justify-between gap-2">
          {/* Left section - Greeting */}
          <div className="flex items-center gap-2 sm:gap-4 min-w-0">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              className={cn(
                'flex h-8 w-8 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-xl',
                focusMode 
                  ? 'bg-primary/20 text-primary' 
                  : 'bg-gradient-to-br from-primary to-primary/80 text-primary-foreground'
              )}
            >
              <Sparkles className="h-4 w-4 sm:h-5 sm:w-5" />
            </motion.div>
            <div className="min-w-0">
              <h1 className={cn(
                'font-display text-sm sm:text-xl font-semibold truncate',
                focusMode ? 'text-focus-foreground' : 'text-foreground'
              )}>
                {greeting}
              </h1>
              <p className={cn(
                'text-xs sm:text-sm truncate hidden sm:block',
                focusMode ? 'text-focus-foreground/60' : 'text-muted-foreground'
              )}>
                {format(now, 'EEE, MMM d')}
              </p>
            </div>
          </div>

          {/* Centre navigation */}
          {!focusMode && (
            <nav aria-label="Main navigation" className="flex items-center gap-0.5 sm:gap-1">
              <NavLink to="/" end className={navLinkClass}>
                <LayoutDashboard className="h-4 w-4 shrink-0" />
                <span className="hidden sm:inline">Dashboard</span>
              </NavLink>
              <NavLink to="/calendar" className={navLinkClass}>
                <Calendar className="h-4 w-4 shrink-0" />
                <span className="hidden sm:inline">Calendar</span>
              </NavLink>
              <NavLink to="/profile" className={navLinkClass}>
                <User className="h-4 w-4 shrink-0" />
                <span className="hidden sm:inline">Profile</span>
              </NavLink>
            </nav>
          )}

          {/* Right section - Actions */}
          <div className="flex items-center gap-1 sm:gap-2 shrink-0">
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
                    aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
                    className="relative h-8 w-8 sm:h-10 sm:w-10"
                  >
                    {isDarkMode ? (
                      <Sun className="h-4 w-4 sm:h-5 sm:w-5" />
                    ) : (
                      <Moon className="h-4 w-4 sm:h-5 sm:w-5" />
                    )}
                  </Button>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label="Notifications"
                    className="relative h-8 w-8 sm:h-10 sm:w-10"
                  >
                    <Bell className="h-4 w-4 sm:h-5 sm:w-5" />
                  </Button>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                  className="hidden sm:block"
                >
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label="Settings"
                    className="h-8 w-8 sm:h-10 sm:w-10"
                  >
                    <Settings className="h-4 w-4 sm:h-5 sm:w-5" />
                  </Button>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5, type: 'spring' }}
                  className="ml-1 sm:ml-2"
                >
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => navigate('/profile')}
                    aria-label="Go to profile"
                    className="flex h-7 w-7 sm:h-9 sm:w-9 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent text-primary-foreground font-medium text-xs sm:text-sm cursor-pointer"
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
