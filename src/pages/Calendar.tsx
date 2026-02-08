import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ChevronLeft, ChevronRight, Clock, BookOpen, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AddTaskDialog } from '@/components/dashboard/AddTaskDialog';
import { useNavigate } from 'react-router-dom';
import { useState, useMemo } from 'react';
import { cn } from '@/lib/utils';
import { 
  format, 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek, 
  addDays, 
  isSameMonth, 
  isSameDay, 
  addMonths, 
  subMonths,
  isToday
} from 'date-fns';
import { useDashboardData } from '@/hooks/useDashboardData';
import { Task } from '@/types/dashboard';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.02 }
  }
};

const dayVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { opacity: 1, scale: 1 }
};

const Calendar = () => {
  const navigate = useNavigate();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const { tasks } = useDashboardData();

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(monthStart);
  const calendarStart = startOfWeek(monthStart);
  const calendarEnd = endOfWeek(monthEnd);

  const calendarDays = useMemo(() => {
    const days: Date[] = [];
    let day = calendarStart;
    while (day <= calendarEnd) {
      days.push(day);
      day = addDays(day, 1);
    }
    return days;
  }, [currentMonth]);

  const getTasksForDate = (date: Date): Task[] => {
    return tasks.filter(task => isSameDay(task.dueDate, date));
  };

  const selectedDateTasks = selectedDate ? getTasksForDate(selectedDate) : [];

  const priorityColors = {
    high: 'bg-critical',
    medium: 'bg-urgency',
    low: 'bg-accent',
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-xl"
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate('/')}
              className="mr-4"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="font-display text-xl font-semibold">Calendar</h1>
          </div>
        </div>
      </motion.header>

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Calendar Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-2"
          >
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="font-display text-2xl">
                  {format(currentMonth, 'MMMM yyyy')}
                </CardTitle>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentMonth(new Date())}
                  >
                    Today
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {/* Weekday Headers */}
                <div className="grid grid-cols-7 mb-2">
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                    <div key={day} className="text-center text-sm font-medium text-muted-foreground py-2">
                      {day}
                    </div>
                  ))}
                </div>

                {/* Calendar Days */}
                <motion.div
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  className="grid grid-cols-7 gap-1"
                >
                  {calendarDays.map((day, index) => {
                    const dayTasks = getTasksForDate(day);
                    const isSelected = selectedDate && isSameDay(day, selectedDate);
                    const isCurrentMonth = isSameMonth(day, currentMonth);
                    const isCurrentDay = isToday(day);

                    return (
                      <motion.button
                        key={day.toISOString()}
                        variants={dayVariants}
                        whileHover={{ scale: 1.05, zIndex: 10 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setSelectedDate(day)}
                        className={cn(
                          "relative aspect-square p-2 rounded-xl transition-colors text-left flex flex-col",
                          !isCurrentMonth && "opacity-40",
                          isSelected && "bg-primary text-primary-foreground shadow-lg",
                          !isSelected && isCurrentDay && "bg-primary/10 border-2 border-primary",
                          !isSelected && !isCurrentDay && "hover:bg-muted"
                        )}
                      >
                        <span className={cn(
                          "text-sm font-medium",
                          isSelected && "text-primary-foreground"
                        )}>
                          {format(day, 'd')}
                        </span>
                        
                        {/* Task indicators */}
                        {dayTasks.length > 0 && (
                          <div className="flex gap-1 mt-auto flex-wrap">
                            {dayTasks.slice(0, 3).map((task, i) => (
                              <motion.div
                                key={task.id}
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: i * 0.1 }}
                                className={cn(
                                  "h-1.5 w-1.5 rounded-full",
                                  isSelected ? "bg-primary-foreground" : priorityColors[task.priority]
                                )}
                              />
                            ))}
                            {dayTasks.length > 3 && (
                              <span className={cn(
                                "text-[10px]",
                                isSelected ? "text-primary-foreground" : "text-muted-foreground"
                              )}>
                                +{dayTasks.length - 3}
                              </span>
                            )}
                          </div>
                        )}
                      </motion.button>
                    );
                  })}
                </motion.div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Selected Day Details */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="sticky top-24">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5 text-primary" />
                    {selectedDate ? format(selectedDate, 'EEEE, MMM d') : 'Select a date'}
                  </CardTitle>
                  {selectedDate && (
                    <AddTaskDialog 
                      variant="inline" 
                      preselectedDate={selectedDate}
                      triggerClassName="rounded-full"
                    />
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <AnimatePresence mode="wait">
                  {selectedDateTasks.length > 0 ? (
                    <motion.div
                      key={selectedDate?.toISOString()}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="space-y-3"
                    >
                      {selectedDateTasks.map((task, index) => (
                        <motion.div
                          key={task.id}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          whileHover={{ x: 4 }}
                          className="p-4 rounded-xl bg-muted/50 hover:bg-muted transition-colors space-y-2"
                        >
                          <div className="flex items-start justify-between">
                            <h4 className="font-medium text-sm">{task.title}</h4>
                            <Badge 
                              variant="outline" 
                              className={cn(
                                "text-xs",
                                task.priority === 'high' && "border-critical text-critical",
                                task.priority === 'medium' && "border-urgency text-urgency",
                                task.priority === 'low' && "border-accent text-accent"
                              )}
                            >
                              {task.priority}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {task.estimatedTime} min
                            </span>
                            <span>{task.course}</span>
                          </div>
                        </motion.div>
                      ))}
                    </motion.div>
                  ) : (
                    <motion.div
                      key="empty"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="py-12 text-center"
                    >
                      <div className="h-16 w-16 mx-auto rounded-full bg-muted flex items-center justify-center mb-4">
                        <BookOpen className="h-8 w-8 text-muted-foreground" />
                      </div>
                      <p className="text-muted-foreground">No tasks for this day</p>
                      <p className="text-sm text-muted-foreground mt-1">Enjoy your free time! 🎉</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default Calendar;
