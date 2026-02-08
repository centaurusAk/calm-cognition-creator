import { useState, useCallback, useEffect, useMemo } from 'react';
import { Task, Course } from '@/types/dashboard';
import { addDays, startOfDay } from 'date-fns';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const today = startOfDay(new Date());

export function useDashboardData() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Fetch tasks from Supabase
  const fetchTasks = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .order('due_date', { ascending: true });

      if (error) throw error;

      const formattedTasks: Task[] = (data || []).map(task => ({
        id: task.id,
        title: task.title,
        course: task.course,
        dueDate: new Date(task.due_date),
        estimatedTime: task.estimated_time,
        priority: task.priority as Task['priority'],
        status: task.status as Task['status'],
        type: task.type as Task['type'],
      }));

      setTasks(formattedTasks);
    } catch (error) {
      console.error('Error fetching tasks:', error);
      toast({
        title: 'Error loading tasks',
        description: 'Could not fetch tasks from the database.',
        variant: 'destructive',
      });
    }
  }, [toast]);

  // Fetch courses from Supabase
  const fetchCourses = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('courses')
        .select('*')
        .order('name', { ascending: true });

      if (error) throw error;

      const formattedCourses: Course[] = (data || []).map(course => ({
        id: course.id,
        name: course.name,
        code: course.code,
        color: course.color,
        progress: course.progress,
      }));

      setCourses(formattedCourses);
    } catch (error) {
      console.error('Error fetching courses:', error);
      toast({
        title: 'Error loading courses',
        description: 'Could not fetch courses from the database.',
        variant: 'destructive',
      });
    }
  }, [toast]);

  // Initial data fetch
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([fetchTasks(), fetchCourses()]);
      setLoading(false);
    };
    loadData();
  }, [fetchTasks, fetchCourses]);

  // Add a new task to Supabase
  const addTask = useCallback(async (newTask: Task) => {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .insert({
          title: newTask.title,
          course: newTask.course,
          due_date: newTask.dueDate.toISOString(),
          estimated_time: newTask.estimatedTime,
          priority: newTask.priority,
          status: newTask.status,
          type: newTask.type,
        })
        .select()
        .single();

      if (error) throw error;

      // Update local state with the inserted task
      const insertedTask: Task = {
        id: data.id,
        title: data.title,
        course: data.course,
        dueDate: new Date(data.due_date),
        estimatedTime: data.estimated_time,
        priority: data.priority as Task['priority'],
        status: data.status as Task['status'],
        type: data.type as Task['type'],
      };

      setTasks(prev => [...prev, insertedTask].sort((a, b) => 
        a.dueDate.getTime() - b.dueDate.getTime()
      ));

      toast({
        title: 'Task added',
        description: `"${newTask.title}" has been added to your tasks.`,
      });
    } catch (error) {
      console.error('Error adding task:', error);
      toast({
        title: 'Error adding task',
        description: 'Could not save the task to the database.',
        variant: 'destructive',
      });
    }
  }, [toast]);

  const todayTasks = useMemo(() => 
    tasks.filter(t => t.dueDate <= addDays(today, 1) && t.status !== 'completed')
      .sort((a, b) => {
        const priorityOrder = { high: 0, medium: 1, low: 2 };
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      }),
    [tasks]
  );

  const weekTasks = useMemo(() => 
    tasks.filter(t => t.dueDate <= addDays(today, 7) && t.status !== 'completed'),
    [tasks]
  );

  const totalEstimatedTime = useMemo(() => 
    todayTasks.reduce((acc, t) => acc + t.estimatedTime, 0),
    [todayTasks]
  );

  return {
    tasks,
    courses,
    todayTasks,
    weekTasks,
    totalEstimatedTime,
    addTask,
    loading,
    refetchTasks: fetchTasks,
    refetchCourses: fetchCourses,
  };
}
