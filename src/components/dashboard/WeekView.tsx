import { motion } from 'framer-motion';
import { Calendar, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Task } from '@/types/dashboard';
import { format, addDays, startOfDay, isSameDay } from 'date-fns';
import { cn } from '@/lib/utils';

interface WeekViewProps {
  tasks: Task[];
}

export function WeekView({ tasks }: WeekViewProps) {
  const navigate = useNavigate();
  const today = startOfDay(new Date());
  const days = Array.from({ length: 7 }, (_, i) => addDays(today, i));

  const getTasksForDay = (date: Date) => 
    tasks.filter(t => isSameDay(t.dueDate, date));

  const priorityDots = {
    high: 'bg-critical',
    medium: 'bg-urgency',
    low: 'bg-accent',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="widget-container"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <motion.div 
            className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-accent to-accent/80 text-accent-foreground shadow-lg"
            whileHover={{ scale: 1.05, rotate: -5 }}
          >
            <Calendar className="h-5 w-5" />
          </motion.div>
          <div>
            <h2 className="font-display text-lg font-semibold text-foreground">
              This Week
            </h2>
            <p className="text-sm text-muted-foreground">
              {format(today, 'MMM d')} - {format(addDays(today, 6), 'MMM d')}
            </p>
          </div>
        </div>
        <motion.button
          whileHover={{ x: 3 }}
          onClick={() => navigate('/calendar')}
          className="flex items-center gap-1 text-sm text-primary hover:text-primary/80 transition-colors"
        >
          View calendar
          <ChevronRight className="h-4 w-4" />
        </motion.button>
      </div>

      {/* Week Grid */}
      <div className="grid grid-cols-7 gap-2">
        {days.map((day, index) => {
          const dayTasks = getTasksForDay(day);
          const isToday = isSameDay(day, today);
          
          return (
            <motion.div
              key={day.toISOString()}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + index * 0.05 }}
              whileHover={{ scale: 1.02 }}
              className={cn(
                'relative flex flex-col items-center p-3 rounded-xl cursor-pointer transition-all',
                isToday 
                  ? 'bg-primary text-primary-foreground shadow-lg' 
                  : 'bg-secondary hover:bg-secondary/80',
                dayTasks.length > 0 && !isToday && 'ring-2 ring-primary/20'
              )}
            >
              <span className={cn(
                'text-xs font-medium mb-1',
                isToday ? 'text-primary-foreground/80' : 'text-muted-foreground'
              )}>
                {format(day, 'EEE')}
              </span>
              <span className={cn(
                'text-lg font-semibold',
                isToday ? 'text-primary-foreground' : 'text-foreground'
              )}>
                {format(day, 'd')}
              </span>
              
              {/* Task indicators */}
              {dayTasks.length > 0 && (
                <div className="flex gap-1 mt-2">
                  {dayTasks.slice(0, 3).map((task, i) => (
                    <motion.div
                      key={task.id}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.4 + i * 0.1 }}
                      className={cn(
                        'h-2 w-2 rounded-full',
                        isToday ? 'bg-primary-foreground/80' : priorityDots[task.priority]
                      )}
                    />
                  ))}
                  {dayTasks.length > 3 && (
                    <span className={cn(
                      'text-xs',
                      isToday ? 'text-primary-foreground/70' : 'text-muted-foreground'
                    )}>
                      +{dayTasks.length - 3}
                    </span>
                  )}
                </div>
              )}

              {/* Today indicator */}
              {isToday && (
                <motion.div
                  className="absolute -bottom-1 left-1/2 -translate-x-1/2 h-1 w-6 rounded-full bg-primary-foreground"
                  layoutId="today-indicator"
                />
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Upcoming summary */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="mt-6 p-4 rounded-xl bg-secondary/50"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-foreground">{tasks.length}</p>
              <p className="text-xs text-muted-foreground">Total tasks</p>
            </div>
            <div className="h-8 w-px bg-border" />
            <div className="text-center">
              <p className="text-2xl font-bold text-critical">{tasks.filter(t => t.priority === 'high').length}</p>
              <p className="text-xs text-muted-foreground">High priority</p>
            </div>
            <div className="h-8 w-px bg-border" />
            <div className="text-center">
              <p className="text-2xl font-bold text-accent">{tasks.filter(t => t.status === 'in-progress').length}</p>
              <p className="text-xs text-muted-foreground">In progress</p>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
