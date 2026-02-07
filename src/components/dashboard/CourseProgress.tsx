import { motion } from 'framer-motion';
import { BookOpen, TrendingUp } from 'lucide-react';
import { Course } from '@/types/dashboard';
import { cn } from '@/lib/utils';

interface CourseProgressProps {
  courses: Course[];
}

export function CourseProgress({ courses }: CourseProgressProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="widget-container"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <motion.div 
            className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-lg"
            whileHover={{ scale: 1.05 }}
          >
            <TrendingUp className="h-5 w-5" />
          </motion.div>
          <div>
            <h2 className="font-display text-lg font-semibold text-foreground">
              Course Progress
            </h2>
            <p className="text-sm text-muted-foreground">
              {courses.length} active courses
            </p>
          </div>
        </div>
      </div>

      {/* Course List */}
      <div className="space-y-4">
        {courses.map((course, index) => (
          <motion.div
            key={course.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 + index * 0.1 }}
            whileHover={{ x: 4 }}
            className="group cursor-pointer"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-3">
                <motion.div
                  className="h-3 w-3 rounded-full"
                  style={{ backgroundColor: course.color }}
                  whileHover={{ scale: 1.3 }}
                />
                <span className="font-medium text-foreground group-hover:text-primary transition-colors">
                  {course.code}
                </span>
                <span className="text-sm text-muted-foreground hidden sm:inline">
                  {course.name}
                </span>
              </div>
              <span className="text-sm font-medium text-foreground">
                {course.progress}%
              </span>
            </div>
            
            <div className="h-2 rounded-full bg-secondary overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${course.progress}%` }}
                transition={{ 
                  delay: 0.6 + index * 0.1, 
                  duration: 0.8, 
                  ease: 'easeOut' 
                }}
                className="h-full rounded-full transition-all"
                style={{ backgroundColor: course.color }}
              />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Overall Stats */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="mt-6 pt-4 border-t border-border"
      >
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Overall Progress</span>
          <span className="text-lg font-semibold text-foreground">
            {Math.round(courses.reduce((acc, c) => acc + c.progress, 0) / courses.length)}%
          </span>
        </div>
        <div className="h-3 rounded-full bg-secondary mt-2 overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ 
              width: `${Math.round(courses.reduce((acc, c) => acc + c.progress, 0) / courses.length)}%` 
            }}
            transition={{ delay: 1, duration: 1, ease: 'easeOut' }}
            className="h-full rounded-full bg-gradient-to-r from-accent via-primary to-primary"
          />
        </div>
      </motion.div>
    </motion.div>
  );
}
