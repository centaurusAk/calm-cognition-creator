import { motion } from 'framer-motion';
import { CheckCircle2, Clock, AlertTriangle, TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';

interface QuickStatsProps {
  focusMode: boolean;
  completedTasksCount: number;
  totalEstimatedMinutes: number;
  highPriorityCount: number;
  avgCourseProgress: number;
}

export function QuickStats({
  focusMode,
  completedTasksCount,
  totalEstimatedMinutes,
  highPriorityCount,
  avgCourseProgress,
}: QuickStatsProps) {
  if (focusMode) return null;

  const studyHours = totalEstimatedMinutes / 60;
  const studyLabel =
    studyHours < 1
      ? `${totalEstimatedMinutes}m`
      : studyHours % 1 === 0
        ? `${studyHours}h`
        : `${studyHours.toFixed(1)}h`;

  const stats = [
    {
      label: 'Tasks Done',
      value: completedTasksCount,
      change: 'Total completed',
      icon: CheckCircle2,
      iconColor: 'bg-gradient-to-br from-accent to-accent/80 text-accent-foreground',
      bgColor: 'bg-accent/10',
    },
    {
      label: 'Today\'s Load',
      value: studyLabel,
      change: 'Estimated study time',
      icon: Clock,
      iconColor: 'bg-gradient-to-br from-primary to-primary/80 text-primary-foreground',
      bgColor: 'bg-primary/10',
    },
    {
      label: 'High Priority',
      value: highPriorityCount,
      change: 'Tasks needing attention',
      icon: AlertTriangle,
      iconColor: 'bg-gradient-to-br from-urgency to-critical text-white',
      bgColor: 'bg-urgency/10',
    },
    {
      label: 'Avg Progress',
      value: `${avgCourseProgress}%`,
      change: 'Across all courses',
      icon: TrendingUp,
      iconColor: 'bg-gradient-to-br from-urgency to-urgency/80 text-white',
      bgColor: 'bg-urgency/10',
    },
  ];

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
          {/* Tinted background glow */}
          <div className={cn(
            'absolute top-0 right-0 h-16 w-16 sm:h-20 sm:w-20 opacity-40 blur-2xl',
            stat.bgColor
          )} />

          <div className="relative z-10">
            <div className="flex items-center justify-between mb-2 sm:mb-3">
              <motion.div
                whileHover={{ rotate: 10, scale: 1.1 }}
                className={cn(
                  'flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-lg sm:rounded-xl',
                  stat.iconColor
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
