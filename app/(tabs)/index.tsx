import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { getColors } from '../../constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useTheme } from '@/hooks/useTheme';
import { useNotifications } from '@/hooks/useNotifications';
import UserProfile from '../../components/UserProfile';
import AddTaskModal from '../../components/AddTaskModal';
import { CircleCheck as CheckCircle2, Circle, Coffee, Droplets, Dumbbell, Heart, Phone, BookOpen, Target, Clock, Sun, Moon, User, Plus } from 'lucide-react-native';

const { width } = Dimensions.get('window');

interface Task {
  id: string;
  title: string;
  type: 'task' | 'wellness';
  time: string;
  completed: boolean;
  icon: React.ReactNode;
  category: string;
}

interface MotivationCard {
  id: string;
  type: 'quote' | 'book' | 'mood';
  title: string;
  content: string;
  author?: string;
}

const motivationCards: MotivationCard[] = [
  {
    id: '1',
    type: 'quote',
    title: 'Daily Wisdom',
    content: 'The way to get started is to quit talking and begin doing.',
    author: 'Walt Disney',
  },
  {
    id: '2',
    type: 'book',
    title: 'Book Bite',
    content: 'Focus on systems, not goals. Systems are what lead to consistent progress.',
    author: 'Atomic Habits',
  },
  {
    id: '3',
    type: 'mood',
    title: 'Mood Booster',
    content: 'You are exactly where you need to be. Trust the process.',
  },
];

// Fresh start - reset all data
const getInitialTasks = (): Task[] => [
  {
    id: '1',
    title: 'Morning Coffee & Planning',
    type: 'wellness',
    time: '7:00 AM',
    completed: false,
    icon: <Coffee size={20} />,
    category: 'Morning Routine',
  },
  {
    id: '2',
    title: 'Drink Water (500ml)',
    type: 'wellness',
    time: '8:00 AM',
    completed: false,
    icon: <Droplets size={20} />,
    category: 'Health',
  },
  {
    id: '3',
    title: 'Complete Project Proposal',
    type: 'task',
    time: '9:00 AM',
    completed: false,
    icon: <Target size={20} />,
    category: 'Work',
  },
  {
    id: '4',
    title: '15-minute Workout',
    type: 'wellness',
    time: '11:00 AM',
    completed: false,
    icon: <Dumbbell size={20} />,
    category: 'Fitness',
  },
  {
    id: '5',
    title: 'Call Mom',
    type: 'wellness',
    time: '2:00 PM',
    completed: false,
    icon: <Phone size={20} />,
    category: 'Family',
  },
  {
    id: '6',
    title: 'Read for 20 minutes',
    type: 'wellness',
    time: '8:00 PM',
    completed: false,
    icon: <BookOpen size={20} />,
    category: 'Learning',
  },
];

export default function FlowDashboard() {
  const colorScheme = useColorScheme();
  const { toggleTheme, isDark } = useTheme();
  const { scheduleTaskNotification, cancelTaskNotifications } = useNotifications();
  const colors = getColors(colorScheme === 'dark');
  const [tasks, setTasks] = useState(getInitialTasks());
  const [currentMotivationIndex, setCurrentMotivationIndex] = useState(0);
  const [showProfile, setShowProfile] = useState(false);
  const [showAddTask, setShowAddTask] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);
  const fadeAnim = useRef(new Animated.Value(1)).current;

  // Schedule notifications for all tasks on component mount
  useEffect(() => {
    tasks.forEach(task => {
      if (!task.completed) {
        const taskTime = parseTaskTime(task.time);
        if (taskTime > new Date()) {
          scheduleTaskNotification(task.id, task.title, taskTime);
        }
      }
    });
  }, []);

  const parseTaskTime = (timeString: string): Date => {
    const today = new Date();
    const [time, period] = timeString.split(' ');
    const [hours, minutes] = time.split(':').map(Number);
    
    let hour24 = hours;
    if (period === 'PM' && hours !== 12) {
      hour24 += 12;
    } else if (period === 'AM' && hours === 12) {
      hour24 = 0;
    }
    
    const taskDate = new Date(today.getFullYear(), today.getMonth(), today.getDate(), hour24, minutes);
    
    // If the time has passed today, schedule for tomorrow
    if (taskDate <= new Date()) {
      taskDate.setDate(taskDate.getDate() + 1);
    }
    
    return taskDate;
  };

  const toggleTask = (taskId: string) => {
    setTasks(prev =>
      prev.map(task => {
        if (task.id === taskId) {
          const updatedTask = { ...task, completed: !task.completed };
          
          // Cancel notifications when task is completed
          if (updatedTask.completed) {
            cancelTaskNotifications(taskId);
          } else {
            // Reschedule notification when task is uncompleted
            const taskTime = parseTaskTime(task.time);
            if (taskTime > new Date()) {
              scheduleTaskNotification(taskId, task.title, taskTime);
            }
          }
          
          return updatedTask;
        }
        return task;
      })
    );
  };

  const handleAddTask = (newTaskData: Omit<Task, 'id' | 'completed'>) => {
    const newTask: Task = {
      ...newTaskData,
      id: Date.now().toString(),
      completed: false,
    };
    
    setTasks(prev => [...prev, newTask]);
    
    // Schedule notification for new task
    const taskTime = parseTaskTime(newTask.time);
    if (taskTime > new Date()) {
      scheduleTaskNotification(newTask.id, newTask.title, taskTime);
    }
  };

  const completedTasks = tasks.filter(task => task.completed).length;
  const progressPercentage = (completedTasks / tasks.length) * 100;

  const handleMotivationScroll = (event: any) => {
    const contentOffset = event.nativeEvent.contentOffset;
    const viewSize = event.nativeEvent.layoutMeasurement;
    const pageNum = Math.floor(contentOffset.x / viewSize.width);
    
    if (pageNum !== currentMotivationIndex && pageNum >= 0 && pageNum < motivationCards.length) {
      setCurrentMotivationIndex(pageNum);
    }
  };

  const renderMotivationCard = (card: MotivationCard, index: number) => (
    <View key={card.id} style={[styles.motivationCard, { width: width - 40 }]}>
      <LinearGradient
        colors={
          card.type === 'quote'
            ? [colors.primary, colors.accent]
            : card.type === 'book'
            ? [colors.coral, '#FF6B35']
            : [colors.accent, '#9B7EBD']
        }
        style={styles.motivationGradient}
      >
        <Text style={styles.motivationTitle}>{card.title}</Text>
        <Text style={styles.motivationContent}>{card.content}</Text>
        {card.author && (
          <Text style={styles.motivationAuthor}>— {card.author}</Text>
        )}
      </LinearGradient>
    </View>
  );

  const renderTaskItem = (task: Task) => (
    <TouchableOpacity
      key={task.id}
      style={[styles.taskItem, { backgroundColor: colors.card }, task.completed && styles.completedTask]}
      onPress={() => toggleTask(task.id)}
    >
      <View style={styles.taskLeft}>
        <View style={[styles.taskIcon, { backgroundColor: colors.surface }]}>
          {React.cloneElement(task.icon as React.ReactElement<{ color?: string }>, {
            color: task.completed ? colors.success : colors.primary,
          })}
        </View>
        <View style={styles.taskContent}>
          <Text style={[styles.taskTitle, { color: colors.text }, task.completed && styles.completedTaskText]}>
            {task.title}
          </Text>
          <Text style={[styles.taskCategory, { color: colors.textSecondary }]}>{task.category}</Text>
        </View>
      </View>
      <View style={styles.taskRight}>
        <Text style={[styles.taskTime, { color: colors.textSecondary }]}>{task.time}</Text>
        {task.completed ? (
          <CheckCircle2 size={24} color={colors.success} />
        ) : (
          <Circle size={24} color={colors.textLight} />
        )}
      </View>
    </TouchableOpacity>
  );

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    gradient: {
      flex: 1,
    },
    scrollView: {
      flex: 1,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: 20,
      paddingTop: 20,
      paddingBottom: 16,
    },
    headerLeft: {
      flex: 1,
    },
    greeting: {
      fontFamily: 'Inter-Regular',
      fontSize: 16,
      color: colors.textSecondary,
    },
    userName: {
      fontFamily: 'Inter-Bold',
      fontSize: 28,
      color: colors.text,
      marginTop: 4,
    },
    headerRight: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
    },
    themeToggle: {
      width: 44,
      height: 44,
      borderRadius: 22,
      backgroundColor: colors.card,
      alignItems: 'center',
      justifyContent: 'center',
      shadowColor: colors.text,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    },
    profileButton: {
      width: 44,
      height: 44,
      borderRadius: 22,
      backgroundColor: colors.card,
      alignItems: 'center',
      justifyContent: 'center',
      shadowColor: colors.text,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    },
    progressCircle: {
      width: 60,
      height: 60,
      borderRadius: 30,
      backgroundColor: colors.card,
      alignItems: 'center',
      justifyContent: 'center',
      shadowColor: colors.text,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    },
    progressText: {
      fontFamily: 'Inter-Bold',
      fontSize: 16,
      color: colors.primary,
    },
    motivationSection: {
      paddingVertical: 16,
    },
    motivationCarousel: {
      paddingLeft: 20,
    },
    motivationScrollContainer: {
      paddingRight: 20,
    },
    motivationCard: {
      marginRight: 0,
      borderRadius: 16,
      overflow: 'hidden',
    },
    motivationGradient: {
      padding: 24,
      minHeight: 140,
      justifyContent: 'center',
    },
    motivationTitle: {
      fontFamily: 'Nunito-SemiBold',
      fontSize: 14,
      color: colors.white,
      opacity: 0.9,
      marginBottom: 8,
      textTransform: 'uppercase',
      letterSpacing: 0.5,
    },
    motivationContent: {
      fontFamily: 'Nunito-Bold',
      fontSize: 18,
      color: colors.white,
      lineHeight: 24,
      marginBottom: 8,
    },
    motivationAuthor: {
      fontFamily: 'Nunito-Regular',
      fontSize: 14,
      color: colors.white,
      opacity: 0.8,
      fontStyle: 'italic',
    },
    paginationContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: 16,
      gap: 8,
    },
    paginationDot: {
      width: 8,
      height: 8,
      borderRadius: 4,
      backgroundColor: colors.border,
    },
    activePaginationDot: {
      backgroundColor: colors.primary,
      width: 20,
    },
    timelineSection: {
      paddingHorizontal: 20,
      paddingVertical: 24,
    },
    sectionHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 20,
    },
    sectionTitle: {
      fontFamily: 'Inter-Bold',
      fontSize: 22,
      color: colors.text,
    },
    progressInfo: {
      alignItems: 'flex-end',
    },
    progressLabel: {
      fontFamily: 'Inter-Medium',
      fontSize: 14,
      color: colors.textSecondary,
    },
    addTaskButton: {
      width: 36,
      height: 36,
      borderRadius: 18,
      backgroundColor: colors.primary,
      alignItems: 'center',
      justifyContent: 'center',
      shadowColor: colors.text,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 4,
      elevation: 3,
    },
    timeline: {
      gap: 12,
    },
    taskItem: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: 16,
      borderRadius: 12,
      shadowColor: colors.text,
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 2,
      elevation: 1,
    },
    completedTask: {
      opacity: 0.7,
    },
    taskLeft: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
    },
    taskIcon: {
      width: 40,
      height: 40,
      borderRadius: 20,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 12,
    },
    taskContent: {
      flex: 1,
    },
    taskTitle: {
      fontFamily: 'Inter-SemiBold',
      fontSize: 16,
      marginBottom: 2,
    },
    completedTaskText: {
      textDecorationLine: 'line-through',
      color: colors.textSecondary,
    },
    taskCategory: {
      fontFamily: 'Inter-Regular',
      fontSize: 12,
      textTransform: 'uppercase',
      letterSpacing: 0.5,
    },
    taskRight: {
      alignItems: 'flex-end',
      gap: 8,
    },
    taskTime: {
      fontFamily: 'Inter-Medium',
      fontSize: 12,
    },
    reflectionCard: {
      margin: 20,
      padding: 24,
      backgroundColor: colors.card,
      borderRadius: 16,
      alignItems: 'center',
      shadowColor: colors.text,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 3,
    },
    reflectionTitle: {
      fontFamily: 'Inter-Bold',
      fontSize: 18,
      color: colors.text,
      marginTop: 12,
      marginBottom: 8,
    },
    reflectionSubtitle: {
      fontFamily: 'Inter-Regular',
      fontSize: 14,
      color: colors.textSecondary,
      textAlign: 'center',
      marginBottom: 16,
      lineHeight: 20,
    },
    reflectionButton: {
      paddingVertical: 12,
      paddingHorizontal: 24,
      backgroundColor: colors.coral,
      borderRadius: 8,
    },
    reflectionButtonText: {
      fontFamily: 'Inter-SemiBold',
      fontSize: 14,
      color: colors.white,
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={[colors.background, colors.card]}
        style={styles.gradient}
      >
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <Text style={styles.greeting}>Good morning,</Text>
              <Text style={styles.userName}>Alex</Text>
            </View>
            <View style={styles.headerRight}>
              <TouchableOpacity style={styles.themeToggle} onPress={toggleTheme}>
                {isDark ? (
                  <Sun size={20} color={colors.textSecondary} />
                ) : (
                  <Moon size={20} color={colors.textSecondary} />
                )}
              </TouchableOpacity>
              <TouchableOpacity style={styles.profileButton} onPress={() => setShowProfile(true)}>
                <User size={20} color={colors.textSecondary} />
              </TouchableOpacity>
              <View style={styles.progressCircle}>
                <Text style={styles.progressText}>{Math.round(progressPercentage)}%</Text>
              </View>
            </View>
          </View>

          {/* Motivation Carousel */}
          <View style={styles.motivationSection}>
            <ScrollView
              ref={scrollViewRef}
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              onMomentumScrollEnd={handleMotivationScroll}
              contentContainerStyle={styles.motivationScrollContainer}
              style={styles.motivationCarousel}
              decelerationRate="fast"
              snapToInterval={width - 40}
              snapToAlignment="center"
            >
              {motivationCards.map((card, index) => renderMotivationCard(card, index))}
            </ScrollView>
            
            {/* Pagination Dots */}
            <View style={styles.paginationContainer}>
              {motivationCards.map((_, index) => (
                <View
                  key={index}
                  style={[
                    styles.paginationDot,
                    index === currentMotivationIndex && styles.activePaginationDot
                  ]}
                />
              ))}
            </View>
          </View>

          {/* Daily Timeline */}
          <View style={styles.timelineSection}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Today's Flow</Text>
              <View style={styles.progressInfo}>
                <TouchableOpacity 
                  style={styles.addTaskButton}
                  onPress={() => setShowAddTask(true)}
                >
                  <Plus size={20} color={colors.white} />
                </TouchableOpacity>
                <Text style={styles.progressLabel}>
                  {completedTasks} of {tasks.length} completed
                </Text>
              </View>
            </View>

            <View style={styles.timeline}>
              {tasks.map(renderTaskItem)}
            </View>
          </View>

          {/* Reflection Card */}
          <View style={styles.reflectionCard}>
            <Heart size={24} color={colors.coral} />
            <Text style={styles.reflectionTitle}>End-of-day Reflection</Text>
            <Text style={styles.reflectionSubtitle}>
              How did today feel? Tap to reflect on your progress.
            </Text>
            <TouchableOpacity style={styles.reflectionButton}>
              <Text style={styles.reflectionButtonText}>Reflect</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </LinearGradient>

      {/* User Profile Modal */}
      <UserProfile visible={showProfile} onClose={() => setShowProfile(false)} />
      
      {/* Add Task Modal */}
      <AddTaskModal 
        visible={showAddTask} 
        onClose={() => setShowAddTask(false)}
        onAddTask={handleAddTask}
      />
    </SafeAreaView>
  );
}