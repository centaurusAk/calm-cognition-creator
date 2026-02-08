import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Clock, Target, Sparkles, Calendar, Plus } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Task } from '@/types/dashboard';
import { TaskCard } from './TaskCard';
import { AddTaskDialog } from './AddTaskDialog';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface TodayWidgetProps {
  tasks: Task[];
  totalTime: number;
}

export function TodayWidget({ tasks, totalTime }: TodayWidgetProps) {
  const [expanded, setExpanded] = useState(false);
  const navigate = useNavigate();
  const displayTasks = expanded ? tasks : tasks.slice(0, 3);
  const hasMore = tasks.length > 3;

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours === 0) return `${mins}m`;
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="widget-container"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <motion.div 
            className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary/80 text-primary-foreground shadow-lg"
            whileHover={{ scale: 1.05, rotate: 5 }}
            whileTap={{ scale: 0.95 }}
          >
            <Target className="h-5 w-5" />
          </motion.div>
          <div>
            <h2 className="font-display text-lg font-semibold text-foreground">
              Today's Focus
            </h2>
            <p className="text-sm text-muted-foreground">
              {tasks.length} task{tasks.length !== 1 ? 's' : ''} • {formatTime(totalTime)} estimated
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="flex items-center gap-2 rounded-full bg-accent-soft px-3 py-1.5 text-sm font-medium text-accent"
          >
            <Sparkles className="h-4 w-4" />
            {tasks.filter(t => t.priority === 'high').length} urgent
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.35 }}
          >
            <AddTaskDialog 
              variant="inline" 
              triggerClassName="rounded-full"
            />
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
          >
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/calendar')}
              className="rounded-full"
            >
              <Calendar className="h-4 w-4 mr-2" />
              View Calendar
            </Button>
          </motion.div>
        </div>
      </div>

      {/* Time Summary Bar */}
      <motion.div 
        initial={{ opacity: 0, scaleX: 0 }}
        animate={{ opacity: 1, scaleX: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="mb-6 rounded-lg bg-secondary p-4"
      >
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-muted-foreground flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Estimated workload
          </span>
          <span className="text-sm font-medium text-foreground">{formatTime(totalTime)}</span>
        </div>
        <div className="h-2 rounded-full bg-muted overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${Math.min((totalTime / 240) * 100, 100)}%` }}
            transition={{ delay: 0.5, duration: 0.8, ease: 'easeOut' }}
            className={cn(
              'h-full rounded-full transition-colors',
              totalTime <= 120 ? 'bg-accent' : totalTime <= 180 ? 'bg-urgency' : 'bg-critical'
            )}
          />
        </div>
        <p className="text-xs text-muted-foreground mt-2">
          {totalTime <= 120 
            ? '✨ Light day ahead' 
            : totalTime <= 180 
              ? '⚡ Moderate workload' 
              : '🔥 Heavy workload - consider prioritizing'}
        </p>
      </motion.div>

      {/* Task List */}
      <div className="space-y-3">
        <AnimatePresence mode="popLayout">
          {displayTasks.map((task, index) => (
            <TaskCard key={task.id} task={task} index={index} />
          ))}
        </AnimatePresence>
      </div>

      {/* Expand/Collapse Button */}
      {hasMore && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-4"
        >
          <Button
            variant="ghost"
            className="w-full group"
            onClick={() => setExpanded(!expanded)}
          >
            <span className="text-muted-foreground group-hover:text-foreground transition-colors">
              {expanded ? 'Show less' : `Show ${tasks.length - 3} more`}
            </span>
            <motion.div
              animate={{ rotate: expanded ? 180 : 0 }}
              transition={{ duration: 0.3 }}
            >
              <ChevronDown className="ml-2 h-4 w-4 text-muted-foreground group-hover:text-foreground" />
            </motion.div>
          </Button>
        </motion.div>
      )}

      {/* Empty State */}
      {tasks.length === 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center justify-center py-12 text-center"
        >
          <motion.div
            animate={{ y: [0, -5, 0] }}
            transition={{ repeat: Infinity, duration: 3 }}
          >
            <Sparkles className="h-12 w-12 text-accent mb-4" />
          </motion.div>
          <h3 className="font-medium text-foreground mb-1">All caught up!</h3>
          <p className="text-sm text-muted-foreground">No tasks due today. Time to relax or get ahead.</p>
        </motion.div>
      )}
    </motion.div>
  );
}
