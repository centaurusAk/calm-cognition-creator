export type Priority = 'high' | 'medium' | 'low';
export type TaskStatus = 'pending' | 'in-progress' | 'completed';

export interface Task {
  id: string;
  title: string;
  course: string;
  dueDate: Date;
  estimatedTime: number; // in minutes
  priority: Priority;
  status: TaskStatus;
  type: 'quiz' | 'assignment' | 'project' | 'reading' | 'lab';
}

export interface Course {
  id: string;
  name: string;
  code: string;
  color: string;
  progress: number;
}

export interface FocusSession {
  duration: number; // in minutes
  completed: number; // completed minutes
  isActive: boolean;
  startTime?: Date;
}

export interface UserPreferences {
  persona: 'aarav' | 'meera' | 'rahul';
  showCompleted: boolean;
  focusModeEnabled: boolean;
  adaptiveMode: boolean;
}
