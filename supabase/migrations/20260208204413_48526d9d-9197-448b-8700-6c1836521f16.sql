-- Create tasks table for persistence
CREATE TABLE public.tasks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  course TEXT NOT NULL,
  due_date TIMESTAMP WITH TIME ZONE NOT NULL,
  estimated_time INTEGER NOT NULL DEFAULT 30,
  priority TEXT NOT NULL DEFAULT 'medium' CHECK (priority IN ('high', 'medium', 'low')),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'in-progress', 'completed')),
  type TEXT NOT NULL DEFAULT 'assignment' CHECK (type IN ('quiz', 'assignment', 'project', 'reading', 'lab')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create courses table for persistence
CREATE TABLE public.courses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  code TEXT NOT NULL,
  color TEXT NOT NULL DEFAULT '#6366f1',
  progress INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;

-- RLS policies for tasks - allow all operations for now (no auth yet)
-- Users can view all tasks (public for now, will restrict when auth is added)
CREATE POLICY "Allow public read for tasks" 
  ON public.tasks FOR SELECT 
  USING (true);

CREATE POLICY "Allow public insert for tasks" 
  ON public.tasks FOR INSERT 
  WITH CHECK (true);

CREATE POLICY "Allow public update for tasks" 
  ON public.tasks FOR UPDATE 
  USING (true);

CREATE POLICY "Allow public delete for tasks" 
  ON public.tasks FOR DELETE 
  USING (true);

-- RLS policies for courses
CREATE POLICY "Allow public read for courses" 
  ON public.courses FOR SELECT 
  USING (true);

CREATE POLICY "Allow public insert for courses" 
  ON public.courses FOR INSERT 
  WITH CHECK (true);

CREATE POLICY "Allow public update for courses" 
  ON public.courses FOR UPDATE 
  USING (true);

CREATE POLICY "Allow public delete for courses" 
  ON public.courses FOR DELETE 
  USING (true);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_tasks_updated_at
  BEFORE UPDATE ON public.tasks
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_courses_updated_at
  BEFORE UPDATE ON public.courses
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default courses
INSERT INTO public.courses (name, code, color, progress) VALUES
  ('Database Systems', 'CS301', '#6366f1', 72),
  ('Data Structures & Algorithms', 'CS201', '#14b8a6', 85),
  ('Operating Systems', 'CS305', '#f59e0b', 60),
  ('Machine Learning', 'CS401', '#ec4899', 45),
  ('Capstone Project', 'CS499', '#8b5cf6', 30),
  ('Computer Networks', 'CS302', '#22c55e', 55);