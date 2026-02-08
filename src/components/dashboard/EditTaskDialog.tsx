import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Pencil, Clock, BookOpen, Flag, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
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
import { Task } from '@/types/dashboard';

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

interface EditTaskDialogProps {
  task: Task;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onTaskUpdate: (task: Task) => Promise<void>;
}

export function EditTaskDialog({ task, open, onOpenChange, onTaskUpdate }: EditTaskDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [courseOptions, setCourseOptions] = useState<CourseOption[]>([]);
  
  const formatDateForInput = (date: Date) => {
    return date.toISOString().split('T')[0];
  };
  
  const [formData, setFormData] = useState({
    title: task.title,
    course: task.course,
    type: task.type,
    priority: task.priority,
    estimatedTime: task.estimatedTime.toString(),
    dueDate: formatDateForInput(task.dueDate),
  });

  // Update form data when task changes
  useEffect(() => {
    setFormData({
      title: task.title,
      course: task.course,
      type: task.type,
      priority: task.priority,
      estimatedTime: task.estimatedTime.toString(),
      dueDate: formatDateForInput(task.dueDate),
    });
  }, [task]);

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
    
    const updatedTask: Task = {
      ...task,
      title: formData.title.trim(),
      course: formData.course,
      type: formData.type as Task['type'],
      priority: formData.priority as Task['priority'],
      estimatedTime: parseInt(formData.estimatedTime),
      dueDate: new Date(formData.dueDate),
    };
    
    await onTaskUpdate(updatedTask);
    
    setIsSubmitting(false);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[calc(100vw-2rem)] sm:max-w-[500px] p-0 overflow-hidden max-h-[90vh] overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 sm:p-6"
        >
          <DialogHeader>
            <DialogTitle className="font-display text-xl sm:text-2xl flex items-center gap-2">
              <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <Pencil className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
              </div>
              Edit Task
            </DialogTitle>
            <DialogDescription className="sr-only">
              Update the task details below
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="mt-4 sm:mt-6 space-y-4 sm:space-y-5">
            {/* Task Title */}
            <div className="space-y-1.5 sm:space-y-2">
              <Label htmlFor="edit-title" className="text-sm">Task Title</Label>
              <Input
                id="edit-title"
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
                  onValueChange={(value: Task['type']) => setFormData({ ...formData, type: value })}
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
                    onClick={() => setFormData({ ...formData, priority: priority.value as Task['priority'] })}
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

            {/* Actions */}
            <div className="flex gap-2 sm:gap-3 pt-2">
              <Button
                type="button"
                variant="outline"
                className="flex-1 h-10 sm:h-11 text-sm"
                onClick={() => onOpenChange(false)}
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
                    <Pencil className="h-4 w-4 mr-1 sm:mr-2" />
                    Save Changes
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
