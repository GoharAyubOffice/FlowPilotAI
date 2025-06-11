import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Flame, Calendar, Trophy, Target, TrendingUp, Star, Award, Zap, CircleCheck as CheckCircle2 } from 'lucide-react-native';

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: React.ReactElement;
  unlocked: boolean;
  progress?: number;
  maxProgress?: number;
  condition: (stats: UserStats) => boolean;
}

interface WeekDay {
  day: string;
  date: number;
  completed: boolean;
  today: boolean;
}

interface UserStats {
  totalDays: number;
  currentStreak: number;
  bestStreak: number;
  completedTasks: number;
  wellnessActivities: number;
  focusTasks: number;
  earlyPlanningDays: number;
  successRate: number;
}

// Fresh start - reset all data
const getCurrentWeekData = (): WeekDay[] => {
  const today = new Date();
  const currentDay = today.getDay(); // 0 = Sunday, 1 = Monday, etc.
  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - currentDay + 1); // Start from Monday

  const weekData: WeekDay[] = [];
  const dayNames = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

  for (let i = 0; i < 7; i++) {
    const date = new Date(startOfWeek);
    date.setDate(startOfWeek.getDate() + i);
    
    const isToday = date.toDateString() === today.toDateString();
    
    weekData.push({
      day: dayNames[i],
      date: date.getDate(),
      completed: false, // Fresh start - no completed days
      today: isToday,
    });
  }

  return weekData;
};

// Fresh start stats
const getInitialUserStats = (): UserStats => ({
  totalDays: 0,
  currentStreak: 0,
  bestStreak: 0,
  completedTasks: 0,
  wellnessActivities: 0,
  focusTasks: 0,
  earlyPlanningDays: 0,
  successRate: 0,
});

const createAchievements = (stats: UserStats): Achievement[] => [
  {
    id: '1',
    title: 'Early Bird',
    description: 'Plan your day before 10 AM',
    icon: <Star size={24} color="#FFFFFF" />,
    unlocked: stats.earlyPlanningDays >= 5,
    condition: (s) => s.earlyPlanningDays >= 5,
  },
  {
    id: '2',
    title: 'Consistency King',
    description: 'Complete 7 days in a row',
    icon: <Trophy size={24} color="#FFFFFF" />,
    unlocked: stats.currentStreak >= 7,
    condition: (s) => s.currentStreak >= 7,
  },
  {
    id: '3',
    title: 'Focus Master',
    description: 'Complete 50 focus tasks',
    icon: <Target size={24} color="#FFFFFF" />,
    unlocked: stats.focusTasks >= 50,
    progress: stats.focusTasks,
    maxProgress: 50,
    condition: (s) => s.focusTasks >= 50,
  },
  {
    id: '4',
    title: 'Mindful Warrior',
    description: 'Complete 30 wellness activities',
    icon: <Award size={24} color="#FFFFFF" />,
    unlocked: stats.wellnessActivities >= 30,
    progress: stats.wellnessActivities,
    maxProgress: 30,
    condition: (s) => s.wellnessActivities >= 30,
  },
  {
    id: '5',
    title: 'Streak Legend',
    description: 'Maintain a 30-day streak',
    icon: <Flame size={24} color="#FFFFFF" />,
    unlocked: stats.bestStreak >= 30,
    progress: stats.currentStreak,
    maxProgress: 30,
    condition: (s) => s.bestStreak >= 30,
  },
];

export default function StreakScreen() {
  const { colorScheme, colors } = useColorScheme();
  const [selectedTab, setSelectedTab] = useState<'overview' | 'achievements'>('overview');
  const [weekData, setWeekData] = useState<WeekDay[]>([]);
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [achievements, setAchievements] = useState<Achievement[]>([]);

  useEffect(() => {
    const week = getCurrentWeekData();
    const stats = getInitialUserStats();
    const achievementsList = createAchievements(stats);
    
    setWeekData(week);
    setUserStats(stats);
    setAchievements(achievementsList);
  }, []);

  const getTodaysWin = (): string => {
    const today = new Date();
    const hour = today.getHours();
    
    if (hour < 10) {
      return "Ready to start your journey!";
    } else if (hour < 12) {
      return "Perfect time to begin building habits!";
    } else if (hour < 17) {
      return "Your consistency journey starts now!";
    } else {
      return "Evening is great for reflection and planning!";
    }
  };

  if (!userStats) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ color: colors.textSecondary }}>Loading your progress...</Text>
        </View>
      </SafeAreaView>
    );
  }

  const renderWeekDay = (day: WeekDay, index: number) => (
    <View key={index} style={styles.weekDay}>
      <Text style={[styles.weekDayLabel, { color: colors.textSecondary }]}>{day.day}</Text>
      <View style={[
        styles.weekDayCircle,
        { backgroundColor: colors.card, borderColor: colors.border },
        day.completed && { backgroundColor: colors.success, borderColor: colors.success },
        day.today && { borderColor: colors.primary, borderWidth: 3 },
      ]}>
        {day.completed && <CheckCircle2 size={16} color={colors.white} />}
        <Text style={[
          styles.weekDayDate,
          { color: colors.text },
          day.completed && { color: colors.white },
          day.today && { color: colors.primary },
        ]}>
          {day.date}
        </Text>
      </View>
    </View>
  );

  const renderAchievement = (achievement: Achievement) => (
    <View
      key={achievement.id}
      style={[
        styles.achievementCard,
        { backgroundColor: colors.card },
        !achievement.unlocked && styles.lockedAchievement
      ]}
    >
      <View style={styles.achievementLeft}>
        <View style={[
          styles.achievementIcon,
          { backgroundColor: colors.surface },
          achievement.unlocked && styles.unlockedIcon
        ]}>
          {achievement.unlocked ? (
            <LinearGradient
              colors={[colors.primary, colors.accent]}
              style={styles.iconGradient}
            >
              {achievement.icon}
            </LinearGradient>
          ) : (
            React.cloneElement(achievement.icon as React.ReactElement<any>, {
              props: { color: colors.textLight },
            })
          )}
        </View>
        
        <View style={styles.achievementContent}>
          <Text style={[
            styles.achievementTitle,
            { color: colors.text },
            !achievement.unlocked && { color: colors.textLight }
          ]}>
            {achievement.title}
          </Text>
          <Text style={[styles.achievementDescription, { color: colors.textSecondary }]}>
            {achievement.description}
          </Text>
          
          {achievement.progress !== undefined && achievement.maxProgress && (
            <View style={styles.progressContainer}>
              <View style={[styles.progressBar, { backgroundColor: colors.border }]}>
                <View
                  style={[
                    styles.progressFill,
                    { 
                      backgroundColor: colors.primary,
                      width: `${Math.min((achievement.progress / achievement.maxProgress) * 100, 100)}%` 
                    }
                  ]}
                />
              </View>
              <Text style={[styles.progressText, { color: colors.textSecondary }]}>
                {achievement.progress}/{achievement.maxProgress}
              </Text>
            </View>
          )}
        </View>
      </View>
      
      {achievement.unlocked && (
        <View style={[styles.achievementBadge, { backgroundColor: colors.success }]}>
          <Text style={[styles.badgeText, { color: colors.white }]}>✓</Text>
        </View>
      )}
    </View>
  );

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    loadingText: {
      fontFamily: 'Inter-Medium',
      fontSize: 16,
    },
    header: {
      paddingHorizontal: 20,
      paddingTop: 20,
      paddingBottom: 16,
    },
    title: {
      fontFamily: 'Inter-Bold',
      fontSize: 28,
      color: colors.text,
    },
    subtitle: {
      fontFamily: 'Inter-Regular',
      fontSize: 14,
      color: colors.textSecondary,
      marginTop: 2,
    },
    scrollView: {
      flex: 1,
    },
    streakSection: {
      paddingHorizontal: 20,
      marginBottom: 24,
    },
    streakCard: {
      borderRadius: 20,
      padding: 32,
      alignItems: 'center',
    },
    streakHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 8,
    },
    streakNumber: {
      fontFamily: 'Inter-Bold',
      fontSize: 48,
      color: colors.white,
      marginLeft: 12,
    },
    streakLabel: {
      fontFamily: 'Inter-SemiBold',
      fontSize: 18,
      color: colors.white,
      marginBottom: 4,
    },
    streakSubtext: {
      fontFamily: 'Inter-Regular',
      fontSize: 14,
      color: colors.white,
      opacity: 0.8,
    },
    winSection: {
      paddingHorizontal: 20,
      marginBottom: 24,
    },
    winCard: {
      backgroundColor: colors.card,
      borderRadius: 16,
      padding: 20,
      shadowColor: colors.text,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 3,
    },
    winHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 12,
    },
    winTitle: {
      fontFamily: 'Inter-Bold',
      fontSize: 18,
      color: colors.text,
      marginLeft: 8,
    },
    winText: {
      fontFamily: 'Inter-SemiBold',
      fontSize: 16,
      color: colors.primary,
      marginBottom: 12,
    },
    winMotivation: {
      fontFamily: 'Nunito-Regular',
      fontSize: 14,
      color: colors.textSecondary,
      fontStyle: 'italic',
      lineHeight: 20,
    },
    weekSection: {
      paddingHorizontal: 20,
      marginBottom: 24,
    },
    sectionTitle: {
      fontFamily: 'Inter-Bold',
      fontSize: 20,
      color: colors.text,
      marginBottom: 16,
    },
    weekContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    weekDay: {
      alignItems: 'center',
    },
    weekDayLabel: {
      fontFamily: 'Inter-Medium',
      fontSize: 12,
      marginBottom: 8,
    },
    weekDayCircle: {
      width: 36,
      height: 36,
      borderRadius: 18,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 2,
    },
    weekDayDate: {
      fontFamily: 'Inter-SemiBold',
      fontSize: 12,
    },
    tabNavigation: {
      flexDirection: 'row',
      marginHorizontal: 20,
      marginBottom: 20,
      backgroundColor: colors.card,
      borderRadius: 12,
      padding: 4,
    },
    tabButton: {
      flex: 1,
      paddingVertical: 12,
      alignItems: 'center',
      borderRadius: 8,
    },
    activeTab: {
      backgroundColor: colors.primary,
    },
    tabText: {
      fontFamily: 'Inter-SemiBold',
      fontSize: 14,
      color: colors.textSecondary,
    },
    activeTabText: {
      color: colors.white,
    },
    overviewSection: {
      paddingHorizontal: 20,
    },
    statsContainer: {
      flexDirection: 'row',
      gap: 16,
    },
    statCard: {
      flex: 1,
      backgroundColor: colors.card,
      borderRadius: 12,
      padding: 20,
      alignItems: 'center',
      shadowColor: colors.text,
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 2,
      elevation: 1,
    },
    statNumber: {
      fontFamily: 'Inter-Bold',
      fontSize: 24,
      color: colors.text,
      marginTop: 8,
      marginBottom: 4,
    },
    statLabel: {
      fontFamily: 'Inter-Regular',
      fontSize: 12,
      color: colors.textSecondary,
    },
    achievementsSection: {
      paddingHorizontal: 20,
      gap: 12,
    },
    achievementCard: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      borderRadius: 12,
      padding: 16,
      shadowColor: colors.text,
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 2,
      elevation: 1,
    },
    lockedAchievement: {
      opacity: 0.6,
    },
    achievementLeft: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
    },
    achievementIcon: {
      width: 48,
      height: 48,
      borderRadius: 24,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 16,
    },
    unlockedIcon: {
      backgroundColor: 'transparent',
    },
    iconGradient: {
      width: 48,
      height: 48,
      borderRadius: 24,
      alignItems: 'center',
      justifyContent: 'center',
    },
    achievementContent: {
      flex: 1,
    },
    achievementTitle: {
      fontFamily: 'Inter-SemiBold',
      fontSize: 16,
      marginBottom: 2,
    },
    achievementDescription: {
      fontFamily: 'Inter-Regular',
      fontSize: 14,
    },
    progressContainer: {
      marginTop: 8,
    },
    progressBar: {
      height: 4,
      borderRadius: 2,
      marginBottom: 4,
    },
    progressFill: {
      height: '100%',
      borderRadius: 2,
    },
    progressText: {
      fontFamily: 'Inter-Medium',
      fontSize: 12,
    },
    achievementBadge: {
      width: 24,
      height: 24,
      borderRadius: 12,
      alignItems: 'center',
      justifyContent: 'center',
    },
    badgeText: {
      fontFamily: 'Inter-Bold',
      fontSize: 12,
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Your Streak</Text>
        <Text style={styles.subtitle}>Keep the momentum going!</Text>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Streak Counter */}
        <View style={styles.streakSection}>
          <LinearGradient
            colors={[colors.coral, '#FF6B35']}
            style={styles.streakCard}
          >
            <View style={styles.streakHeader}>
              <Flame size={32} color={colors.white} />
              <Text style={styles.streakNumber}>{userStats.currentStreak}</Text>
            </View>
            <Text style={styles.streakLabel}>Day Streak</Text>
            <Text style={styles.streakSubtext}>
              Best: {userStats.bestStreak} days
            </Text>
          </LinearGradient>
        </View>

        {/* Today's Win */}
        <View style={styles.winSection}>
          <View style={styles.winCard}>
            <View style={styles.winHeader}>
              <Zap size={24} color={colors.coral} />
              <Text style={styles.winTitle}>Today's Win</Text>
            </View>
            <Text style={styles.winText}>{getTodaysWin()}</Text>
            <Text style={styles.winMotivation}>
              "Every expert was once a beginner. Every pro was once an amateur. Every icon was once an unknown."
            </Text>
          </View>
        </View>

        {/* Week Overview */}
        <View style={styles.weekSection}>
          <Text style={styles.sectionTitle}>This Week</Text>
          <View style={styles.weekContainer}>
            {weekData.map(renderWeekDay)}
          </View>
        </View>

        {/* Tab Navigation */}
        <View style={styles.tabNavigation}>
          <TouchableOpacity
            style={[
              styles.tabButton,
              selectedTab === 'overview' && styles.activeTab
            ]}
            onPress={() => setSelectedTab('overview')}
          >
            <Text style={[
              styles.tabText,
              selectedTab === 'overview' && styles.activeTabText
            ]}>
              Overview
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[
              styles.tabButton,
              selectedTab === 'achievements' && styles.activeTab
            ]}
            onPress={() => setSelectedTab('achievements')}
          >
            <Text style={[
              styles.tabText,
              selectedTab === 'achievements' && styles.activeTabText
            ]}>
              Achievements
            </Text>
          </TouchableOpacity>
        </View>

        {/* Content based on selected tab */}
        {selectedTab === 'overview' ? (
          <View style={styles.overviewSection}>
            <View style={styles.statsContainer}>
              <View style={styles.statCard}>
                <Calendar size={24} color={colors.primary} />
                <Text style={styles.statNumber}>{userStats.totalDays}</Text>
                <Text style={styles.statLabel}>Total Days</Text>
              </View>
              
              <View style={styles.statCard}>
                <TrendingUp size={24} color={colors.accent} />
                <Text style={styles.statNumber}>{userStats.successRate}%</Text>
                <Text style={styles.statLabel}>Success Rate</Text>
              </View>
            </View>
          </View>
        ) : (
          <View style={styles.achievementsSection}>
            {achievements.map(renderAchievement)}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}