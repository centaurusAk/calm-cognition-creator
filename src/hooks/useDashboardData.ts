import { useMemo, useState, useCallback } from 'react';
import { Task, Course } from '@/types/dashboard';
import { addDays, addHours, startOfDay } from 'date-fns';

const today = startOfDay(new Date());

const initialTasks: Task[] = [
  {
    id: '1',
    title: 'Database Systems Quiz 3',
    course: 'CS301',
    dueDate: addHours(today, 4),
    estimatedTime: 45,
    priority: 'high',
    status: 'pending',
    type: 'quiz',
  },
  {
    id: '2',
    title: 'Algorithm Analysis Assignment',
    course: 'CS201',
    dueDate: addDays(today, 1),
    estimatedTime: 120,
    priority: 'high',
    status: 'in-progress',
    type: 'assignment',
  },
  {
    id: '3',
    title: 'OS Lab Report',
    course: 'CS305',
    dueDate: addDays(today, 2),
    estimatedTime: 90,
    priority: 'medium',
    status: 'pending',
    type: 'lab',
  },
  {
    id: '4',
    title: 'Machine Learning Reading',
    course: 'CS401',
    dueDate: addDays(today, 3),
    estimatedTime: 60,
    priority: 'low',
    status: 'pending',
    type: 'reading',
  },
  {
    id: '5',
    title: 'Capstone Project Milestone',
    course: 'CS499',
    dueDate: addDays(today, 5),
    estimatedTime: 180,
    priority: 'medium',
    status: 'in-progress',
    type: 'project',
  },
  {
    id: '6',
    title: 'Networks Assignment',
    course: 'CS302',
    dueDate: addDays(today, 7),
    estimatedTime: 75,
    priority: 'low',
    status: 'pending',
    type: 'assignment',
  },
];

export function useDashboardData() {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);

  const courses: Course[] = useMemo(() => [
    { id: '1', name: 'Database Systems', code: 'CS301', color: '#6366f1', progress: 72 },
    { id: '2', name: 'Data Structures & Algorithms', code: 'CS201', color: '#14b8a6', progress: 85 },
    { id: '3', name: 'Operating Systems', code: 'CS305', color: '#f59e0b', progress: 60 },
    { id: '4', name: 'Machine Learning', code: 'CS401', color: '#ec4899', progress: 45 },
    { id: '5', name: 'Capstone Project', code: 'CS499', color: '#8b5cf6', progress: 30 },
    { id: '6', name: 'Computer Networks', code: 'CS302', color: '#22c55e', progress: 55 },
  ], []);

  const addTask = useCallback((newTask: Task) => {
    setTasks(prev => [...prev, newTask]);
  }, []);

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
  };
}
