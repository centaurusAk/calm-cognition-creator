import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Clock, BookOpen, Flag, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

const priorityOptions = [
  { value: 'high', label: 'High', color: 'bg-critical text-critical' },
  { value: 'medium', label: 'Medium', color: 'bg-urgency text-urgency' },
  { value: 'low', label: 'Low', color: 'bg-accent text-accent' },
];

const typeOptions = [
  { value: 'assignment', label: 'Assignment' },
  { value: 'quiz', label: 'Quiz' },
  { value: 'project', label: 'Project' },
  { value: 'reading', label: 'Reading' },
  { value: 'lab', label: 'Lab' },
];

interface CourseOption {
  value: string;
  label: string;
}

interface AddTaskDialogProps {
  onTaskAdd?: (task: any) => void;
  variant?: 'fab' | 'inline';
  triggerClassName?: string;
  preselectedDate?: Date;
}

export function AddTaskDialog({ onTaskAdd, variant = 'fab', triggerClassName, preselectedDate }: AddTaskDialogProps) {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [courseOptions, setCourseOptions] = useState<CourseOption[]>([]);
  
  const formatDateForInput = (date: Date) => {
    return date.toISOString().split('T')[0];
  };
  
  const [formData, setFormData] = useState({
    title: '',
    course: '',
    type: 'assignment',
    priority: 'medium',
    estimatedTime: '60',
    dueDate: preselectedDate ? formatDateForInput(preselectedDate) : '',
    description: '',
  });

  // Fetch courses from database
  useEffect(() => {
    const fetchCourses = async () => {
      const { data, error } = await supabase
        .from('courses')
        .select('code, name')
        .order('name', { ascending: true });

      if (error) {
        console.error('Error fetching courses:', error);
        return;
      }

      const options = (data || []).map(course => ({
        value: course.code,
        label: `${course.code} - ${course.name}`,
      }));

      setCourseOptions(options);
    };

    if (open) {
      fetchCourses();
    }
  }, [open]);

  // Update due date when preselectedDate changes
  useEffect(() => {
    if (preselectedDate) {
      setFormData(prev => ({
        ...prev,
        dueDate: formatDateForInput(preselectedDate),
      }));
    }
  }, [preselectedDate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      toast.error('Please enter a task title');
      return;
    }
    if (!formData.course) {
      toast.error('Please select a course');
      return;
    }
    if (!formData.dueDate) {
      toast.error('Please select a due date');
      return;
    }

    setIsSubmitting(true);
    
    const newTask = {
      id: Date.now().toString(),
      title: formData.title,
      course: formData.course,
      type: formData.type as 'quiz' | 'assignment' | 'project' | 'reading' | 'lab',
      priority: formData.priority as 'high' | 'medium' | 'low',
      estimatedTime: parseInt(formData.estimatedTime),
      dueDate: new Date(formData.dueDate),
      status: 'pending' as const,
    };
    
    await onTaskAdd?.(newTask);
    
    setFormData({
      title: '',
      course: '',
      type: 'assignment',
      priority: 'medium',
      estimatedTime: '60',
      dueDate: preselectedDate ? formatDateForInput(preselectedDate) : '',
      description: '',
    });
    
    setIsSubmitting(false);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {variant === 'fab' ? (
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              size="lg"
              className="fixed bottom-6 right-4 sm:bottom-8 sm:right-8 h-12 w-12 sm:h-14 sm:w-14 rounded-full shadow-lg bg-gradient-to-br from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 z-50"
            >
              <Plus className="h-5 w-5 sm:h-6 sm:w-6" />
            </Button>
          </motion.div>
        ) : (
          <Button
            variant="default"
            size="sm"
            className={cn("bg-gradient-to-r from-primary to-primary/80 h-8 sm:h-9", triggerClassName)}
          >
            <Plus className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
            <span className="hidden xs:inline">Add Task</span>
            <span className="xs:hidden">Add</span>
          </Button>
        )}
      </DialogTrigger>
      
      <DialogContent className="max-w-[calc(100vw-2rem)] sm:max-w-[500px] p-0 overflow-hidden max-h-[90vh] overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 sm:p-6"
        >
          <DialogHeader>
            <DialogTitle className="font-display text-xl sm:text-2xl flex items-center gap-2">
              <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <Plus className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
              </div>
              Add New Task
            </DialogTitle>
            <DialogDescription className="sr-only">
              Fill in the details below to create a new task
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="mt-4 sm:mt-6 space-y-4 sm:space-y-5">
            {/* Task Title */}
            <div className="space-y-1.5 sm:space-y-2">
              <Label htmlFor="title" className="text-sm">Task Title</Label>
              <Input
                id="title"
                placeholder="Enter task title..."
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="h-10 sm:h-11"
              />
            </div>

            {/* Course & Type Row */}
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              <div className="space-y-1.5 sm:space-y-2">
                <Label className="flex items-center gap-1.5 sm:gap-2 text-sm">
                  <BookOpen className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-muted-foreground" />
                  Course
                </Label>
                <Select
                  value={formData.course}
                  onValueChange={(value) => setFormData({ ...formData, course: value })}
                >
                  <SelectTrigger className="h-10 sm:h-11 text-sm">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    {courseOptions.map(course => (
                      <SelectItem key={course.value} value={course.value} className="text-sm">
                        {course.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5 sm:space-y-2">
                <Label className="text-sm">Type</Label>
                <Select
                  value={formData.type}
                  onValueChange={(value) => setFormData({ ...formData, type: value })}
                >
                  <SelectTrigger className="h-10 sm:h-11 text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {typeOptions.map(type => (
                      <SelectItem key={type.value} value={type.value} className="text-sm">
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Priority Selection */}
            <div className="space-y-1.5 sm:space-y-2">
              <Label className="flex items-center gap-1.5 sm:gap-2 text-sm">
                <Flag className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-muted-foreground" />
                Priority
              </Label>
              <div className="flex gap-2">
                {priorityOptions.map(priority => (
                  <motion.button
                    key={priority.value}
                    type="button"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setFormData({ ...formData, priority: priority.value })}
                    className={cn(
                      "flex-1 py-2 sm:py-3 px-2 sm:px-4 rounded-lg sm:rounded-xl border-2 transition-all font-medium text-xs sm:text-sm",
                      formData.priority === priority.value
                        ? cn(priority.color, "border-current bg-current/10")
                        : "border-muted hover:border-muted-foreground/30"
                    )}
                  >
                    {priority.label}
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Due Date & Estimated Time */}
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              <div className="space-y-1.5 sm:space-y-2">
                <Label className="flex items-center gap-1.5 sm:gap-2 text-sm">
                  <Calendar className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-muted-foreground" />
                  Due Date
                </Label>
                <Input
                  type="date"
                  value={formData.dueDate}
                  onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                  className="h-10 sm:h-11 text-sm"
                />
              </div>

              <div className="space-y-1.5 sm:space-y-2">
                <Label className="flex items-center gap-1.5 sm:gap-2 text-sm">
                  <Clock className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-muted-foreground" />
                  Time (min)
                </Label>
                <Input
                  type="number"
                  min="5"
                  max="480"
                  value={formData.estimatedTime}
                  onChange={(e) => setFormData({ ...formData, estimatedTime: e.target.value })}
                  className="h-10 sm:h-11 text-sm"
                />
              </div>
            </div>

            {/* Description - Hidden on mobile for cleaner UX */}
            <div className="space-y-1.5 sm:space-y-2 hidden sm:block">
              <Label htmlFor="description" className="text-sm">Description (Optional)</Label>
              <Textarea
                id="description"
                placeholder="Add any additional notes..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="resize-none text-sm"
                rows={2}
              />
            </div>

            {/* Actions */}
            <div className="flex gap-2 sm:gap-3 pt-2">
              <Button
                type="button"
                variant="outline"
                className="flex-1 h-10 sm:h-11 text-sm"
                onClick={() => setOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="flex-1 h-10 sm:h-11 text-sm bg-gradient-to-r from-primary to-primary/80"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  >
                    <Clock className="h-4 w-4" />
                  </motion.div>
                ) : (
                  <>
                    <Plus className="h-4 w-4 mr-1 sm:mr-2" />
                    Add Task
                  </>
                )}
              </Button>
            </div>
          </form>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}
