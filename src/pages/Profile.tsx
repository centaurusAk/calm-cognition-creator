import { motion } from 'framer-motion';
import { ArrowLeft, Camera, Mail, BookOpen, Trophy, Clock, Target, Edit2, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { cn } from '@/lib/utils';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

const Profile = () => {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    name: 'Aarav Sharma',
    email: 'aarav.sharma@university.edu',
    major: 'Computer Science',
    year: 'First Year',
    gpa: '3.8',
    completedCredits: 24,
    totalCredits: 120,
  });

  const achievements = [
    { id: 1, title: 'Early Bird', description: 'Complete 5 tasks before 9 AM', progress: 80, icon: Clock },
    { id: 2, title: 'Focus Master', description: '10 hours of focus time', progress: 65, icon: Target },
    { id: 3, title: 'Course Champion', description: 'Complete all assignments on time', progress: 90, icon: Trophy },
  ];

  const stats = [
    { label: 'Tasks Completed', value: '47', change: '+12 this week' },
    { label: 'Focus Hours', value: '24h', change: '+3h this week' },
    { label: 'Streak', value: '7 days', change: 'Personal best!' },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-xl"
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate('/')}
              className="mr-4"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="font-display text-xl font-semibold">Profile</h1>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsEditing(!isEditing)}
            >
              {isEditing ? <Save className="h-5 w-5" /> : <Edit2 className="h-5 w-5" />}
            </Button>
          </div>
        </div>
      </motion.header>

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-8"
        >
          {/* Profile Card */}
          <motion.div variants={itemVariants}>
            <Card className="overflow-hidden">
              <div className="h-32 bg-gradient-to-r from-primary via-primary/80 to-accent" />
              <CardContent className="relative pt-0">
                <div className="flex flex-col sm:flex-row items-center sm:items-end gap-4 -mt-16">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="relative"
                  >
                    <div className="h-32 w-32 rounded-full border-4 border-background bg-gradient-to-br from-primary to-accent flex items-center justify-center text-primary-foreground text-4xl font-bold shadow-xl">
                      A
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      className="absolute bottom-0 right-0 h-10 w-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-lg"
                    >
                      <Camera className="h-4 w-4" />
                    </motion.button>
                  </motion.div>
                  
                  <div className="flex-1 text-center sm:text-left pb-4">
                    {isEditing ? (
                      <div className="space-y-2">
                        <Input
                          value={profile.name}
                          onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                          className="text-2xl font-display font-bold"
                        />
                      </div>
                    ) : (
                      <>
                        <h2 className="text-2xl font-display font-bold">{profile.name}</h2>
                        <p className="text-muted-foreground flex items-center justify-center sm:justify-start gap-2">
                          <Mail className="h-4 w-4" />
                          {profile.email}
                        </p>
                        <p className="text-muted-foreground flex items-center justify-center sm:justify-start gap-2 mt-1">
                          <BookOpen className="h-4 w-4" />
                          {profile.major} • {profile.year}
                        </p>
                      </>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Stats Grid */}
          <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02, y: -4 }}
              >
                <Card className="relative overflow-hidden group">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <CardContent className="p-6">
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                    <p className="text-3xl font-display font-bold mt-1">{stat.value}</p>
                    <p className="text-xs text-accent mt-2">{stat.change}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>

          {/* Academic Progress */}
          <motion.div variants={itemVariants}>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-primary" />
                  Academic Progress
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Credits Completed</span>
                      <span className="font-medium">{profile.completedCredits} / {profile.totalCredits}</span>
                    </div>
                    <Progress value={(profile.completedCredits / profile.totalCredits) * 100} className="h-3" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Current GPA</span>
                      <span className="font-medium">{profile.gpa} / 4.0</span>
                    </div>
                    <Progress value={(parseFloat(profile.gpa) / 4) * 100} className="h-3" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Achievements */}
          <motion.div variants={itemVariants}>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="h-5 w-5 text-urgency" />
                  Achievements
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {achievements.map((achievement, index) => (
                    <motion.div
                      key={achievement.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ x: 4 }}
                      className="flex items-center gap-4 p-4 rounded-xl bg-muted/50 hover:bg-muted transition-colors"
                    >
                      <div className={cn(
                        "h-12 w-12 rounded-xl flex items-center justify-center",
                        achievement.progress >= 80 ? "bg-accent/20 text-accent" : "bg-primary/20 text-primary"
                      )}>
                        <achievement.icon className="h-6 w-6" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium">{achievement.title}</h4>
                        <p className="text-sm text-muted-foreground">{achievement.description}</p>
                        <div className="mt-2">
                          <Progress value={achievement.progress} className="h-2" />
                        </div>
                      </div>
                      <span className="text-sm font-medium">{achievement.progress}%</span>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </main>
    </div>
  );
};

export default Profile;
