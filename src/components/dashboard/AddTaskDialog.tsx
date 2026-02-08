import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, X, Clock, BookOpen, Flag, Calendar } from 'lucide-react';
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

const courseOptions = [
  { value: 'CS301', label: 'CS301 - Database Systems' },
  { value: 'CS201', label: 'CS201 - Data Structures' },
  { value: 'CS305', label: 'CS305 - Operating Systems' },
  { value: 'CS401', label: 'CS401 - Machine Learning' },
  { value: 'CS499', label: 'CS499 - Capstone Project' },
  { value: 'CS302', label: 'CS302 - Computer Networks' },
];

interface AddTaskDialogProps {
  onTaskAdd?: (task: any) => void;
}

export function AddTaskDialog({ onTaskAdd }: AddTaskDialogProps) {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    course: '',
    type: 'assignment',
    priority: 'medium',
    estimatedTime: '60',
    dueDate: '',
    description: '',
  });

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
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const newTask = {
      id: Date.now().toString(),
      ...formData,
      estimatedTime: parseInt(formData.estimatedTime),
      dueDate: new Date(formData.dueDate),
      status: 'pending' as const,
    };
    
    onTaskAdd?.(newTask);
    
    toast.success('Task added successfully!', {
      description: `"${formData.title}" has been added to your tasks.`,
    });
    
    setFormData({
      title: '',
      course: '',
      type: 'assignment',
      priority: 'medium',
      estimatedTime: '60',
      dueDate: '',
      description: '',
    });
    
    setIsSubmitting(false);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Button
            size="lg"
            className="fixed bottom-8 right-8 h-14 w-14 rounded-full shadow-lg bg-gradient-to-br from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 z-50"
          >
            <Plus className="h-6 w-6" />
          </Button>
        </motion.div>
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-6"
        >
          <DialogHeader>
            <DialogTitle className="font-display text-2xl flex items-center gap-2">
              <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <Plus className="h-5 w-5 text-primary" />
              </div>
              Add New Task
            </DialogTitle>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="mt-6 space-y-5">
            {/* Task Title */}
            <div className="space-y-2">
              <Label htmlFor="title">Task Title</Label>
              <Input
                id="title"
                placeholder="Enter task title..."
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="h-11"
              />
            </div>

            {/* Course & Type Row */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4 text-muted-foreground" />
                  Course
                </Label>
                <Select
                  value={formData.course}
                  onValueChange={(value) => setFormData({ ...formData, course: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select course" />
                  </SelectTrigger>
                  <SelectContent>
                    {courseOptions.map(course => (
                      <SelectItem key={course.value} value={course.value}>
                        {course.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Type</Label>
                <Select
                  value={formData.type}
                  onValueChange={(value) => setFormData({ ...formData, type: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {typeOptions.map(type => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Priority Selection */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Flag className="h-4 w-4 text-muted-foreground" />
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
                      "flex-1 py-3 px-4 rounded-xl border-2 transition-all font-medium",
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
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  Due Date
                </Label>
                <Input
                  type="date"
                  value={formData.dueDate}
                  onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                  className="h-11"
                />
              </div>

              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  Est. Time (min)
                </Label>
                <Input
                  type="number"
                  min="5"
                  max="480"
                  value={formData.estimatedTime}
                  onChange={(e) => setFormData({ ...formData, estimatedTime: e.target.value })}
                  className="h-11"
                />
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Description (Optional)</Label>
              <Textarea
                id="description"
                placeholder="Add any additional notes..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="resize-none"
                rows={3}
              />
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-2">
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={() => setOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="flex-1 bg-gradient-to-r from-primary to-primary/80"
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
                    <Plus className="h-4 w-4 mr-2" />
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
