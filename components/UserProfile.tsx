import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  ScrollView,
  Switch,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { getColors } from '../constants/Colors';
import { useTheme } from '@/hooks/useTheme';
import { User, Settings, Bell, Shield, CircleHelp as HelpCircle, LogOut, Moon, Sun, ChevronRight, X, Mail, Phone, Calendar, Award } from 'lucide-react-native';

interface UserProfileProps {
  visible: boolean;
  onClose: () => void;
}

interface UserData {
  name: string;
  email: string;
  joinDate: string;
  isLoggedIn: boolean;
}

export default function UserProfile({ visible, onClose }: UserProfileProps) {
  const { themeMode, toggleTheme, isDark } = useTheme();
  const colors = getColors(isDark);
  
  const [userData, setUserData] = useState<UserData>({
    name: 'Alex Johnson',
    email: 'alex.johnson@example.com',
    joinDate: 'January 2024',
    isLoggedIn: true,
  });

  const [notifications, setNotifications] = useState({
    dailyReminders: true,
    weeklyProgress: true,
    achievements: true,
    motivationalQuotes: false,
  });

  const handleLogin = () => {
    // Simulate login
    setUserData(prev => ({ ...prev, isLoggedIn: true }));
  };

  const handleLogout = () => {
    // Simulate logout
    setUserData(prev => ({ 
      ...prev, 
      isLoggedIn: false,
      name: '',
      email: '',
    }));
  };

  const renderMenuItem = (
    icon: React.ReactNode,
    title: string,
    subtitle?: string,
    onPress?: () => void,
    rightElement?: React.ReactNode
  ) => (
    <TouchableOpacity
      style={[styles.menuItem, { backgroundColor: colors.card }]}
      onPress={onPress}
    >
      <View style={styles.menuItemLeft}>
        <View style={[styles.menuIcon, { backgroundColor: colors.surface }]}>
          {icon}
        </View>
        <View style={styles.menuItemContent}>
          <Text style={[styles.menuItemTitle, { color: colors.text }]}>{title}</Text>
          {subtitle && (
            <Text style={[styles.menuItemSubtitle, { color: colors.textSecondary }]}>
              {subtitle}
            </Text>
          )}
        </View>
      </View>
      {rightElement || <ChevronRight size={16} color={colors.textLight} />}
    </TouchableOpacity>
  );

  const renderNotificationSetting = (
    key: keyof typeof notifications,
    title: string,
    description: string
  ) => (
    <View key={key} style={[styles.notificationItem, { backgroundColor: colors.card }]}>
      <View style={styles.notificationContent}>
        <Text style={[styles.notificationTitle, { color: colors.text }]}>{title}</Text>
        <Text style={[styles.notificationDescription, { color: colors.textSecondary }]}>
          {description}
        </Text>
      </View>
      <Switch
        value={notifications[key]}
        onValueChange={(value) => setNotifications(prev => ({ ...prev, [key]: value }))}
        trackColor={{ false: colors.border, true: colors.primary }}
        thumbColor={colors.white}
      />
    </View>
  );

  const styles = StyleSheet.create({
    modal: {
      flex: 1,
      backgroundColor: colors.background,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: 20,
      paddingVertical: 16,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    headerTitle: {
      fontFamily: 'Inter-Bold',
      fontSize: 20,
      color: colors.text,
    },
    closeButton: {
      width: 32,
      height: 32,
      borderRadius: 16,
      backgroundColor: colors.surface,
      alignItems: 'center',
      justifyContent: 'center',
    },
    scrollView: {
      flex: 1,
    },
    profileSection: {
      paddingHorizontal: 20,
      paddingVertical: 24,
    },
    profileCard: {
      borderRadius: 16,
      overflow: 'hidden',
    },
    profileGradient: {
      padding: 24,
      alignItems: 'center',
    },
    avatarContainer: {
      width: 80,
      height: 80,
      borderRadius: 40,
      backgroundColor: 'rgba(255, 255, 255, 0.2)',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 16,
    },
    profileName: {
      fontFamily: 'Inter-Bold',
      fontSize: 24,
      color: colors.white,
      marginBottom: 4,
    },
    profileEmail: {
      fontFamily: 'Inter-Regular',
      fontSize: 14,
      color: colors.white,
      opacity: 0.9,
      marginBottom: 8,
    },
    profileJoinDate: {
      fontFamily: 'Inter-Medium',
      fontSize: 12,
      color: colors.white,
      opacity: 0.8,
    },
    loginSection: {
      paddingHorizontal: 20,
      paddingVertical: 24,
      alignItems: 'center',
    },
    loginCard: {
      backgroundColor: colors.card,
      borderRadius: 16,
      padding: 32,
      alignItems: 'center',
      width: '100%',
    },
    loginIcon: {
      width: 60,
      height: 60,
      borderRadius: 30,
      backgroundColor: colors.surface,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 16,
    },
    loginTitle: {
      fontFamily: 'Inter-Bold',
      fontSize: 20,
      color: colors.text,
      marginBottom: 8,
    },
    loginSubtitle: {
      fontFamily: 'Inter-Regular',
      fontSize: 14,
      color: colors.textSecondary,
      textAlign: 'center',
      marginBottom: 24,
      lineHeight: 20,
    },
    loginButton: {
      borderRadius: 12,
      overflow: 'hidden',
      width: '100%',
    },
    loginButtonGradient: {
      paddingVertical: 16,
      alignItems: 'center',
    },
    loginButtonText: {
      fontFamily: 'Inter-SemiBold',
      fontSize: 16,
      color: colors.white,
    },
    menuSection: {
      paddingHorizontal: 20,
      marginBottom: 24,
    },
    sectionTitle: {
      fontFamily: 'Inter-Bold',
      fontSize: 18,
      color: colors.text,
      marginBottom: 16,
    },
    menuItem: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: 16,
      borderRadius: 12,
      marginBottom: 8,
      shadowColor: colors.text,
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 2,
      elevation: 1,
    },
    menuItemLeft: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
    },
    menuIcon: {
      width: 40,
      height: 40,
      borderRadius: 20,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 12,
    },
    menuItemContent: {
      flex: 1,
    },
    menuItemTitle: {
      fontFamily: 'Inter-SemiBold',
      fontSize: 16,
      marginBottom: 2,
    },
    menuItemSubtitle: {
      fontFamily: 'Inter-Regular',
      fontSize: 12,
    },
    themeToggle: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
    },
    themeText: {
      fontFamily: 'Inter-Medium',
      fontSize: 14,
      color: colors.textSecondary,
    },
    notificationItem: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: 16,
      borderRadius: 12,
      marginBottom: 8,
      shadowColor: colors.text,
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 2,
      elevation: 1,
    },
    notificationContent: {
      flex: 1,
      marginRight: 16,
    },
    notificationTitle: {
      fontFamily: 'Inter-SemiBold',
      fontSize: 16,
      marginBottom: 2,
    },
    notificationDescription: {
      fontFamily: 'Inter-Regular',
      fontSize: 12,
      lineHeight: 16,
    },
    logoutSection: {
      paddingHorizontal: 20,
      paddingBottom: 32,
    },
    logoutButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.error,
      paddingVertical: 16,
      borderRadius: 12,
      gap: 8,
    },
    logoutButtonText: {
      fontFamily: 'Inter-SemiBold',
      fontSize: 16,
      color: colors.white,
    },
  });

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <SafeAreaView style={styles.modal}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Profile</Text>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <X size={16} color={colors.textSecondary} />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          {userData.isLoggedIn ? (
            <>
              {/* Profile Section */}
              <View style={styles.profileSection}>
                <View style={styles.profileCard}>
                  <LinearGradient
                    colors={[colors.primary, colors.accent]}
                    style={styles.profileGradient}
                  >
                    <View style={styles.avatarContainer}>
                      <User size={32} color={colors.white} />
                    </View>
                    <Text style={styles.profileName}>{userData.name}</Text>
                    <Text style={styles.profileEmail}>{userData.email}</Text>
                    <Text style={styles.profileJoinDate}>Member since {userData.joinDate}</Text>
                  </LinearGradient>
                </View>
              </View>

              {/* Settings Menu */}
              <View style={styles.menuSection}>
                <Text style={styles.sectionTitle}>Preferences</Text>
                
                {renderMenuItem(
                  isDark ? <Sun size={20} color={colors.primary} /> : <Moon size={20} color={colors.primary} />,
                  'Theme',
                  `Currently using ${isDark ? 'dark' : 'light'} mode`,
                  toggleTheme,
                  <View style={styles.themeToggle}>
                    <Text style={styles.themeText}>{isDark ? 'Dark' : 'Light'}</Text>
                  </View>
                )}

                {renderMenuItem(
                  <Bell size={20} color={colors.primary} />,
                  'Notifications',
                  'Manage your notification preferences'
                )}

                {renderMenuItem(
                  <Shield size={20} color={colors.primary} />,
                  'Privacy & Security',
                  'Control your data and privacy settings'
                )}

                {renderMenuItem(
                  <Award size={20} color={colors.primary} />,
                  'Achievements',
                  'View your progress and milestones'
                )}
              </View>

              {/* Notification Settings */}
              <View style={styles.menuSection}>
                <Text style={styles.sectionTitle}>Notifications</Text>
                
                {renderNotificationSetting(
                  'dailyReminders',
                  'Daily Reminders',
                  'Get reminded to check your daily flow'
                )}

                {renderNotificationSetting(
                  'weeklyProgress',
                  'Weekly Progress',
                  'Receive weekly progress summaries'
                )}

                {renderNotificationSetting(
                  'achievements',
                  'Achievements',
                  'Get notified when you unlock achievements'
                )}

                {renderNotificationSetting(
                  'motivationalQuotes',
                  'Motivational Quotes',
                  'Daily inspiration and motivation'
                )}
              </View>

              {/* Support Menu */}
              <View style={styles.menuSection}>
                <Text style={styles.sectionTitle}>Support</Text>
                
                {renderMenuItem(
                  <HelpCircle size={20} color={colors.primary} />,
                  'Help & Support',
                  'Get help and contact support'
                )}

                {renderMenuItem(
                  <Mail size={20} color={colors.primary} />,
                  'Feedback',
                  'Share your thoughts and suggestions'
                )}
              </View>

              {/* Logout */}
              <View style={styles.logoutSection}>
                <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                  <LogOut size={20} color={colors.white} />
                  <Text style={styles.logoutButtonText}>Sign Out</Text>
                </TouchableOpacity>
              </View>
            </>
          ) : (
            /* Login Section */
            <View style={styles.loginSection}>
              <View style={styles.loginCard}>
                <View style={styles.loginIcon}>
                  <User size={24} color={colors.primary} />
                </View>
                <Text style={styles.loginTitle}>Welcome to FlowPilot</Text>
                <Text style={styles.loginSubtitle}>
                  Sign in to sync your progress across devices and unlock personalized features
                </Text>
                <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
                  <LinearGradient
                    colors={[colors.primary, colors.accent]}
                    style={styles.loginButtonGradient}
                  >
                    <Text style={styles.loginButtonText}>Sign In</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
}