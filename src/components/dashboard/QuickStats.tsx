import { motion } from 'framer-motion';
import { CheckCircle2, Clock, Flame, Trophy } from 'lucide-react';
import { cn } from '@/lib/utils';

interface QuickStatsProps {
  focusMode: boolean;
}

const stats = [
  {
    label: 'Tasks Done',
    value: 12,
    change: '+3 today',
    icon: CheckCircle2,
    color: 'from-emerald-500 to-teal-600',
  },
  {
    label: 'Study Hours',
    value: '4.5h',
    change: 'This week',
    icon: Clock,
    color: 'from-blue-500 to-indigo-600',
  },
  {
    label: 'Day Streak',
    value: 7,
    change: 'Keep it up!',
    icon: Flame,
    color: 'from-orange-500 to-red-500',
  },
  {
    label: 'Focus Score',
    value: '85%',
    change: '+5% vs last week',
    icon: Trophy,
    color: 'from-amber-500 to-yellow-500',
  },
];

export function QuickStats({ focusMode }: QuickStatsProps) {
  if (focusMode) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="grid grid-cols-2 lg:grid-cols-4 gap-4"
    >
      {stats.map((stat, index) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: index * 0.1, type: 'spring', stiffness: 500 }}
          whileHover={{ y: -4, transition: { duration: 0.2 } }}
          className="relative overflow-hidden rounded-xl sm:rounded-2xl bg-card p-3 sm:p-4 shadow-md border border-border/50"
        >
          {/* Gradient Background */}
          <div className={cn(
            'absolute top-0 right-0 h-16 w-16 sm:h-20 sm:w-20 opacity-10 blur-2xl',
            `bg-gradient-to-br ${stat.color}`
          )} />
          
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-2 sm:mb-3">
              <motion.div
                whileHover={{ rotate: 10, scale: 1.1 }}
                className={cn(
                  'flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-lg sm:rounded-xl bg-gradient-to-br text-white',
                  stat.color
                )}
              >
                <stat.icon className="h-4 w-4 sm:h-5 sm:w-5" />
              </motion.div>
            </div>
            
            <motion.p 
              className="text-xl sm:text-2xl font-display font-bold text-foreground"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 + index * 0.1 }}
            >
              {stat.value}
            </motion.p>
            <p className="text-xs sm:text-sm font-medium text-muted-foreground">{stat.label}</p>
            <p className="text-xs text-muted-foreground/70 mt-0.5 sm:mt-1 hidden sm:block">{stat.change}</p>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
}
