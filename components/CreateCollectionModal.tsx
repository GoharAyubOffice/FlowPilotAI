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
  Star,
  BookOpen,
  Heart,
  Brain,
  Target,
  Lightbulb,
  Coffee,
  Briefcase,
  Palette,
  Music,
  Camera,
  Gamepad2,
  Plus
} from 'lucide-react-native';

interface Collection {
  id: string;
  name: string;
  description: string;
  itemCount: number;
  color: readonly [string, string];
  icon: React.ReactNode;
  items: any[];
  createdAt: string;
}

interface CreateCollectionModalProps {
  visible: boolean;
  onClose: () => void;
  onCreateCollection: (collection: Omit<Collection, 'id' | 'itemCount' | 'items' | 'createdAt'>) => void;
}

const collectionIcons = [
  { name: 'Inspiration', icon: <Star size={20} color="#FFFFFF" />, colors: ['#FF6B6B', '#FF8E53'] },
  { name: 'Learning', icon: <BookOpen size={20} color="#FFFFFF" />, colors: ['#4ECDC4', '#44A08D'] },
  { name: 'Wellness', icon: <Heart size={20} color="#FFFFFF" />, colors: ['#A8E6CF', '#7FCDCD'] },
  { name: 'Psychology', icon: <Brain size={20} color="#FFFFFF" />, colors: ['#FFD93D', '#6BCF7F'] },
  { name: 'Goals', icon: <Target size={20} color="#FFFFFF" />, colors: ['#6C5CE7', '#A29BFE'] },
  { name: 'Ideas', icon: <Lightbulb size={20} color="#FFFFFF" />, colors: ['#FD79A8', '#FDCB6E'] },
  { name: 'Habits', icon: <Coffee size={20} color="#FFFFFF" />, colors: ['#00B894', '#00CEC9'] },
  { name: 'Business', icon: <Briefcase size={20} color="#FFFFFF" />, colors: ['#0984E3', '#74B9FF'] },
  { name: 'Creativity', icon: <Palette size={20} color="#FFFFFF" />, colors: ['#E17055', '#FDCB6E'] },
  { name: 'Entertainment', icon: <Music size={20} color="#FFFFFF" />, colors: ['#A29BFE', '#6C5CE7'] },
  { name: 'Photography', icon: <Camera size={20} color="#FFFFFF" />, colors: ['#FD79A8', '#E84393'] },
  { name: 'Gaming', icon: <Gamepad2 size={20} color="#FFFFFF" />, colors: ['#00CEC9', '#55A3FF'] },
];

export default function CreateCollectionModal({ visible, onClose, onCreateCollection }: CreateCollectionModalProps) {
  const colorScheme = useColorScheme();
  const colors = getColors(colorScheme === 'dark');
  
  const [collectionName, setCollectionName] = useState('');
  const [collectionDescription, setCollectionDescription] = useState('');
  const [selectedIcon, setSelectedIcon] = useState(collectionIcons[0]);

  const handleCreateCollection = () => {
    if (!collectionName.trim()) {
      Alert.alert('Error', 'Please enter a collection name');
      return;
    }

    const newCollection = {
      name: collectionName.trim(),
      description: collectionDescription.trim() || 'My personal collection',
      color: [selectedIcon.colors[0], selectedIcon.colors[1]] as readonly [string, string],
      icon: selectedIcon.icon,
    };

    onCreateCollection(newCollection);
    
    // Reset form
    setCollectionName('');
    setCollectionDescription('');
    setSelectedIcon(collectionIcons[0]);
    
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
      marginBottom: 12,
    },
    textArea: {
      height: 100,
      textAlignVertical: 'top',
    },
    iconsGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 16,
    },
    iconItem: {
      width: '22%',
      aspectRatio: 1,
      borderRadius: 16,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 3,
      borderColor: 'transparent',
    },
    selectedIcon: {
      borderColor: colors.primary,
      transform: [{ scale: 1.1 }],
    },
    iconContent: {
      width: '100%',
      height: '100%',
      borderRadius: 13,
      alignItems: 'center',
      justifyContent: 'center',
    },
    iconLabel: {
      fontFamily: 'Inter-Medium',
      fontSize: 10,
      color: colors.white,
      marginTop: 4,
      textAlign: 'center',
    },
    previewSection: {
      marginVertical: 24,
    },
    previewCard: {
      borderRadius: 16,
      overflow: 'hidden',
      shadowColor: colors.text,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 12,
      elevation: 4,
    },
    previewGradient: {
      padding: 24,
      minHeight: 140,
    },
    previewHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: 16,
    },
    previewIcon: {
      width: 32,
      height: 32,
      borderRadius: 16,
      backgroundColor: 'rgba(255, 255, 255, 0.2)',
      alignItems: 'center',
      justifyContent: 'center',
    },
    previewContent: {
      flex: 1,
      justifyContent: 'flex-end',
    },
    previewName: {
      fontFamily: 'Inter-Bold',
      fontSize: 16,
      color: colors.white,
      marginBottom: 4,
    },
    previewDescription: {
      fontFamily: 'Inter-Regular',
      fontSize: 12,
      color: colors.white,
      opacity: 0.8,
      marginBottom: 8,
    },
    previewCount: {
      fontFamily: 'Inter-Medium',
      fontSize: 12,
      color: colors.white,
      opacity: 0.9,
    },
    footer: {
      paddingHorizontal: 20,
      paddingVertical: 24,
      borderTopWidth: 1,
      borderTopColor: colors.border,
    },
    createButton: {
      borderRadius: 12,
      overflow: 'hidden',
    },
    createButtonGradient: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 16,
      gap: 8,
    },
    createButtonText: {
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
          <Text style={styles.headerTitle}>Create Collection</Text>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <X size={16} color={colors.textSecondary} />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          {/* Collection Details */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Collection Details</Text>
            <TextInput
              style={styles.input}
              placeholder="Collection name"
              placeholderTextColor={colors.textLight}
              value={collectionName}
              onChangeText={setCollectionName}
              autoFocus
            />
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Description (optional)"
              placeholderTextColor={colors.textLight}
              value={collectionDescription}
              onChangeText={setCollectionDescription}
              multiline
              numberOfLines={4}
            />
          </View>

          {/* Icon Selection */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Choose an Icon</Text>
            <View style={styles.iconsGrid}>
              {collectionIcons.map((iconOption, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.iconItem,
                    selectedIcon.name === iconOption.name && styles.selectedIcon
                  ]}
                  onPress={() => setSelectedIcon(iconOption)}
                >
                  <LinearGradient
                    colors={[iconOption.colors[0], iconOption.colors[1]]}
                    style={styles.iconContent}
                  >
                    {iconOption.icon}
                  </LinearGradient>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Preview */}
          <View style={styles.previewSection}>
            <Text style={styles.sectionTitle}>Preview</Text>
            <View style={styles.previewCard}>
              <LinearGradient colors={[selectedIcon.colors[0], selectedIcon.colors[1]]} style={styles.previewGradient}>
                <View style={styles.previewHeader}>
                  <View style={styles.previewIcon}>
                    {selectedIcon.icon}
                  </View>
                </View>
                
                <View style={styles.previewContent}>
                  <Text style={styles.previewName}>
                    {collectionName || 'Collection Name'}
                  </Text>
                  <Text style={styles.previewDescription}>
                    {collectionDescription || 'Collection description'}
                  </Text>
                  <Text style={styles.previewCount}>0 items</Text>
                </View>
              </LinearGradient>
            </View>
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <TouchableOpacity style={styles.createButton} onPress={handleCreateCollection}>
            <LinearGradient
              colors={[colors.primary, colors.accent]}
              style={styles.createButtonGradient}
            >
              <Plus size={20} color={colors.white} />
              <Text style={styles.createButtonText}>Create Collection</Text>
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