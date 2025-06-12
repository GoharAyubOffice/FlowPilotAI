import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  TextInput,
  ScrollView,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { getColors } from '../constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { 
  X, 
  Coffee, 
  Droplets, 
  Dumbbell, 
  Heart, 
  Phone, 
  BookOpen, 
  Target, 
  Clock,
  Plus,
  Calendar,
  Bell
} from 'lucide-react-native';

interface Task {
  id: string;
  title: string;
  type: 'task' | 'wellness';
  time: string;
  completed: boolean;
  icon: React.ReactNode;
  category: string;
}

interface AddTaskModalProps {
  visible: boolean;
  onClose: () => void;
  onAddTask: (task: Omit<Task, 'id' | 'completed'>) => void;
}

const taskCategories = [
  { name: 'Work', icon: <Target size={20} />, type: 'task' as const },
  { name: 'Health', icon: <Heart size={20} />, type: 'wellness' as const },
  { name: 'Fitness', icon: <Dumbbell size={20} />, type: 'wellness' as const },
  { name: 'Learning', icon: <BookOpen size={20} />, type: 'wellness' as const },
  { name: 'Family', icon: <Phone size={20} />, type: 'wellness' as const },
  { name: 'Morning Routine', icon: <Coffee size={20} />, type: 'wellness' as const },
  { name: 'Hydration', icon: <Droplets size={20} />, type: 'wellness' as const },
];

const timeSlots = [
  '6:00 AM', '7:00 AM', '8:00 AM', '9:00 AM', '10:00 AM', '11:00 AM',
  '12:00 PM', '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM',
  '6:00 PM', '7:00 PM', '8:00 PM', '9:00 PM', '10:00 PM'
];

export default function AddTaskModal({ visible, onClose, onAddTask }: AddTaskModalProps) {
  const colorScheme = useColorScheme();
  const colors = getColors(colorScheme === 'dark');
  
  const [taskTitle, setTaskTitle] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(taskCategories[0]);
  const [selectedTime, setSelectedTime] = useState(timeSlots[0]);
  const [enableNotification, setEnableNotification] = useState(true);

  const handleAddTask = () => {
    if (!taskTitle.trim()) {
      Alert.alert('Error', 'Please enter a task title');
      return;
    }

    const newTask = {
      title: taskTitle.trim(),
      type: selectedCategory.type,
      time: selectedTime,
      icon: selectedCategory.icon,
      category: selectedCategory.name,
    };

    onAddTask(newTask);
    
    // Reset form
    setTaskTitle('');
    setSelectedCategory(taskCategories[0]);
    setSelectedTime(timeSlots[0]);
    setEnableNotification(true);
    
    onClose();
  };

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
      paddingHorizontal: 20,
    },
    section: {
      marginVertical: 24,
    },
    sectionTitle: {
      fontFamily: 'Inter-Bold',
      fontSize: 18,
      color: colors.text,
      marginBottom: 16,
    },
    input: {
      backgroundColor: colors.card,
      borderRadius: 12,
      paddingHorizontal: 16,
      paddingVertical: 16,
      fontFamily: 'Inter-Regular',
      fontSize: 16,
      color: colors.text,
      borderWidth: 1,
      borderColor: colors.border,
    },
    categoriesGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 12,
    },
    categoryItem: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 16,
      paddingVertical: 12,
      borderRadius: 12,
      borderWidth: 2,
      borderColor: colors.border,
      backgroundColor: colors.card,
      minWidth: '45%',
    },
    selectedCategory: {
      borderColor: colors.primary,
      backgroundColor: colors.primary,
    },
    categoryIcon: {
      marginRight: 8,
    },
    categoryText: {
      fontFamily: 'Inter-Medium',
      fontSize: 14,
      color: colors.text,
    },
    selectedCategoryText: {
      color: colors.white,
    },
    timeGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 12,
    },
    timeItem: {
      paddingHorizontal: 16,
      paddingVertical: 12,
      borderRadius: 12,
      borderWidth: 2,
      borderColor: colors.border,
      backgroundColor: colors.card,
      minWidth: '30%',
      alignItems: 'center',
    },
    selectedTime: {
      borderColor: colors.primary,
      backgroundColor: colors.primary,
    },
    timeText: {
      fontFamily: 'Inter-Medium',
      fontSize: 14,
      color: colors.text,
    },
    selectedTimeText: {
      color: colors.white,
    },
    notificationToggle: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      backgroundColor: colors.card,
      paddingHorizontal: 16,
      paddingVertical: 16,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: colors.border,
    },
    notificationLeft: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
    },
    notificationIcon: {
      marginRight: 12,
    },
    notificationContent: {
      flex: 1,
    },
    notificationTitle: {
      fontFamily: 'Inter-SemiBold',
      fontSize: 16,
      color: colors.text,
      marginBottom: 2,
    },
    notificationSubtitle: {
      fontFamily: 'Inter-Regular',
      fontSize: 12,
      color: colors.textSecondary,
    },
    notificationToggleButton: {
      width: 50,
      height: 30,
      borderRadius: 15,
      backgroundColor: colors.border,
      justifyContent: 'center',
      paddingHorizontal: 2,
    },
    notificationToggleActive: {
      backgroundColor: colors.primary,
    },
    notificationToggleThumb: {
      width: 26,
      height: 26,
      borderRadius: 13,
      backgroundColor: colors.white,
      shadowColor: colors.text,
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.2,
      shadowRadius: 2,
      elevation: 2,
    },
    notificationToggleThumbActive: {
      alignSelf: 'flex-end',
    },
    footer: {
      paddingHorizontal: 20,
      paddingVertical: 24,
      borderTopWidth: 1,
      borderTopColor: colors.border,
    },
    addButton: {
      borderRadius: 12,
      overflow: 'hidden',
    },
    addButtonGradient: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 16,
      gap: 8,
    },
    addButtonText: {
      fontFamily: 'Inter-SemiBold',
      fontSize: 16,
      color: colors.white,
    },
    cancelButton: {
      alignItems: 'center',
      paddingVertical: 16,
      marginTop: 12,
    },
    cancelButtonText: {
      fontFamily: 'Inter-Medium',
      fontSize: 16,
      color: colors.textSecondary,
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
          <Text style={styles.headerTitle}>Add New Task</Text>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <X size={16} color={colors.textSecondary} />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          {/* Task Title */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Task Title</Text>
            <TextInput
              style={styles.input}
              placeholder="What do you want to accomplish?"
              placeholderTextColor={colors.textLight}
              value={taskTitle}
              onChangeText={setTaskTitle}
              autoFocus
            />
          </View>

          {/* Category Selection */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Category</Text>
            <View style={styles.categoriesGrid}>
              {taskCategories.map((category, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.categoryItem,
                    selectedCategory.name === category.name && styles.selectedCategory
                  ]}
                  onPress={() => setSelectedCategory(category)}
                >
                  <View style={styles.categoryIcon}>
                    {React.cloneElement(category.icon as React.ReactElement<{ color?: string }>, {
                      color: selectedCategory.name === category.name ? colors.white : colors.primary,
                    })}
                  </View>
                  <Text style={[
                    styles.categoryText,
                    selectedCategory.name === category.name && styles.selectedCategoryText
                  ]}>
                    {category.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Time Selection */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Scheduled Time</Text>
            <View style={styles.timeGrid}>
              {timeSlots.map((time, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.timeItem,
                    selectedTime === time && styles.selectedTime
                  ]}
                  onPress={() => setSelectedTime(time)}
                >
                  <Text style={[
                    styles.timeText,
                    selectedTime === time && styles.selectedTimeText
                  ]}>
                    {time}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Notification Toggle */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Reminder</Text>
            <TouchableOpacity
              style={styles.notificationToggle}
              onPress={() => setEnableNotification(!enableNotification)}
            >
              <View style={styles.notificationLeft}>
                <View style={styles.notificationIcon}>
                  <Bell size={20} color={colors.primary} />
                </View>
                <View style={styles.notificationContent}>
                  <Text style={styles.notificationTitle}>Enable Reminder</Text>
                  <Text style={styles.notificationSubtitle}>
                    Get notified when it's time for this task
                  </Text>
                </View>
              </View>
              <View style={[
                styles.notificationToggleButton,
                enableNotification && styles.notificationToggleActive
              ]}>
                <View style={[
                  styles.notificationToggleThumb,
                  enableNotification && styles.notificationToggleThumbActive
                ]} />
              </View>
            </TouchableOpacity>
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <TouchableOpacity style={styles.addButton} onPress={handleAddTask}>
            <LinearGradient
              colors={[colors.primary, colors.accent]}
              style={styles.addButtonGradient}
            >
              <Plus size={20} color={colors.white} />
              <Text style={styles.addButtonText}>Add Task</Text>
            </LinearGradient>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </Modal>
  );
}