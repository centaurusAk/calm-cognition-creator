import { useState } from 'react';
import { motion } from 'framer-motion';
import { Clock, BookOpen, FlaskConical, FileText, Pencil, AlertCircle, Trash2 } from 'lucide-react';
import { Task } from '@/types/dashboard';
import { format, isToday, isTomorrow } from 'date-fns';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { EditTaskDialog } from './EditTaskDialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

const typeIcons = {
  quiz: BookOpen,
  assignment: Pencil,
  project: FileText,
  reading: BookOpen,
  lab: FlaskConical,
};

const priorityStyles = {
  high: 'border-l-critical bg-critical-soft/30',
  medium: 'border-l-urgency bg-urgency-soft/30',
  low: 'border-l-accent bg-accent-soft/30',
};

interface TaskCardProps {
  task: Task;
  index: number;
  compact?: boolean;
  onDelete?: (taskId: string) => void;
  onUpdate?: (task: Task) => Promise<void>;
}

export function TaskCard({ task, index, compact = false, onDelete, onUpdate }: TaskCardProps) {
  const Icon = typeIcons[task.type];
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  
  const formatDueDate = () => {
    if (isToday(task.dueDate)) {
      return `Today, ${format(task.dueDate, 'h:mm a')}`;
    }
    if (isTomorrow(task.dueDate)) {
      return `Tomorrow, ${format(task.dueDate, 'h:mm a')}`;
    }
    return format(task.dueDate, 'EEE, MMM d');
  };

  const isUrgent = task.priority === 'high' && isToday(task.dueDate);

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setEditDialogOpen(true);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -100, scale: 0.8 }}
      transition={{ 
        duration: 0.3, 
        delay: index * 0.05,
        ease: [0.25, 0.46, 0.45, 0.94]
      }}
      whileHover={{ 
        scale: 1.01, 
        transition: { duration: 0.2 } 
      }}
      className={cn(
        'group relative rounded-xl border-l-4 p-3 sm:p-4 transition-all duration-300',
        'bg-card hover:shadow-lg cursor-pointer',
        priorityStyles[task.priority],
        compact && 'p-2 sm:p-3'
      )}
    >
      {isUrgent && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute -top-2 -right-2 flex items-center gap-1 rounded-full bg-critical px-2 py-1 text-xs font-medium text-critical-foreground z-10"
        >
          <AlertCircle className="h-3 w-3" />
          Urgent
        </motion.div>
      )}
      
      <div className="flex items-start gap-2 sm:gap-3">
        <motion.div 
          className={cn(
            'flex h-8 w-8 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-lg',
            'bg-primary/10 text-primary',
            compact && 'h-7 w-7 sm:h-8 sm:w-8'
          )}
          whileHover={{ rotate: 5 }}
        >
          <Icon className={cn('h-4 w-4 sm:h-5 sm:w-5', compact && 'h-3.5 w-3.5 sm:h-4 sm:w-4')} />
        </motion.div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <h3 className={cn(
                'font-medium text-foreground line-clamp-2',
                compact ? 'text-xs sm:text-sm' : 'text-sm sm:text-base'
              )}>
                {task.title}
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                {task.course}
              </p>
            </div>
          </div>
          
          <div className={cn(
            'flex items-center gap-4 text-xs text-muted-foreground',
            compact ? 'mt-2' : 'mt-3'
          )}>
            <span className={cn(
              'flex items-center gap-1',
              isUrgent && 'text-critical font-medium'
            )}>
              <Clock className="h-3.5 w-3.5" />
              {formatDueDate()}
            </span>
            <span className="flex items-center gap-1">
              <motion.div 
                className="h-1.5 w-1.5 rounded-full bg-muted-foreground"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ repeat: Infinity, duration: 2 }}
              />
              {task.estimatedTime} min
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1 shrink-0">
          {task.status === 'in-progress' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-1 text-xs font-medium text-primary">
                <motion.span 
                  className="h-1.5 w-1.5 rounded-full bg-primary"
                  animate={{ opacity: [1, 0.5, 1] }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                />
                <span className="hidden sm:inline">In Progress</span>
              </span>
            </motion.div>
          )}

          {/* Edit button — always visible on touch screens, hover-reveal on pointer devices */}
          {onUpdate && (
            <Button
              variant="ghost"
              size="icon"
              onClick={handleEditClick}
              aria-label={`Edit task: ${task.title}`}
              className="h-7 w-7 sm:h-8 sm:w-8 text-muted-foreground/70 hover:text-primary hover:bg-primary/10 sm:opacity-0 sm:group-hover:opacity-100 transition-all"
            >
              <Pencil className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            </Button>
          )}

          {/* Delete button with confirmation — always visible on touch, hover-reveal on pointer devices */}
          {onDelete && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={(e) => e.stopPropagation()}
                  aria-label={`Delete task: ${task.title}`}
                  className="h-7 w-7 sm:h-8 sm:w-8 text-muted-foreground/70 hover:text-critical hover:bg-critical/10 sm:opacity-0 sm:group-hover:opacity-100 transition-all"
                >
                  <Trash2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete task?</AlertDialogTitle>
                  <AlertDialogDescription>
                    <strong>"{task.title}"</strong> will be permanently removed. This cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => onDelete(task.id)}
                    className="bg-critical text-critical-foreground hover:bg-critical/90"
                  >
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </div>
      </div>

      {/* Hover glow effect */}
      <motion.div
        className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
        style={{
          background: 'radial-gradient(400px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), hsl(var(--primary) / 0.06), transparent 40%)',
        }}
      />

      {/* Edit Dialog */}
      {onUpdate && (
        <EditTaskDialog
          task={task}
          open={editDialogOpen}
          onOpenChange={setEditDialogOpen}
          onTaskUpdate={onUpdate}
        />
      )}
    </motion.div>
  );
}
