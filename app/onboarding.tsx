import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { Colors } from '../constants/Colors';
import { ChevronLeft, ChevronRight, Sparkles, Target, Zap } from 'lucide-react-native';

const { width } = Dimensions.get('window');

interface OnboardingCard {
  id: number;
  question: string;
  options: string[];
  icon: React.ReactNode;
}

const onboardingCards: OnboardingCard[] = [
  {
    id: 1,
    question: "What time do you usually wake up?",
    options: ["5:00 - 6:00 AM", "6:00 - 7:00 AM", "7:00 - 8:00 AM", "8:00 AM or later"],
    icon: <Sparkles size={28} color={Colors.primary} />
  },
  {
    id: 2,
    question: "What's one goal this week?",
    options: ["Build better habits", "Complete a project", "Learn something new", "Improve health"],
    icon: <Target size={28} color={Colors.primary} />
  },
  {
    id: 3,
    question: "What motivates you more?",
    options: ["Rewards & achievements", "Reflection & growth", "Community & sharing", "Personal challenges"],
    icon: <Zap size={28} color={Colors.primary} />
  }
];

export default function OnboardingScreen() {
  const [currentCard, setCurrentCard] = useState(0);
  const [answers, setAnswers] = useState<{ [key: number]: string }>({});
  const scrollRef = useRef<ScrollView>(null);
  const progressAnim = useRef(new Animated.Value(0)).current;

  const handleAnswer = (answer: string) => {
    setAnswers(prev => ({ ...prev, [currentCard]: answer }));
    
    if (currentCard < onboardingCards.length - 1) {
      const nextCard = currentCard + 1;
      setCurrentCard(nextCard);
      
      // Animate progress
      Animated.timing(progressAnim, {
        toValue: (nextCard + 1) / onboardingCards.length,
        duration: 300,
        useNativeDriver: false,
      }).start();
      
      // Scroll to next card
      scrollRef.current?.scrollTo({
        x: nextCard * width,
        animated: true,
      });
    }
  };

  const handleBack = () => {
    if (currentCard > 0) {
      const prevCard = currentCard - 1;
      setCurrentCard(prevCard);
      
      Animated.timing(progressAnim, {
        toValue: (prevCard + 1) / onboardingCards.length,
        duration: 300,
        useNativeDriver: false,
      }).start();
      
      scrollRef.current?.scrollTo({
        x: prevCard * width,
        animated: true,
      });
    }
  };

  const handleComplete = (planType: 'ai' | 'manual') => {
    // Store onboarding data and navigate to main app
    router.replace('/(tabs)');
  };

  const renderCard = (card: OnboardingCard, index: number) => (
    <View key={card.id} style={[styles.card, { width }]}>
      <View style={styles.cardContent}>
        <View style={styles.iconContainer}>
          {card.icon}
        </View>
        
        <Text style={styles.question}>{card.question}</Text>
        
        <View style={styles.optionsContainer}>
          {card.options.map((option, optionIndex) => (
            <TouchableOpacity
              key={optionIndex}
              style={[
                styles.option,
                answers[index] === option && styles.selectedOption
              ]}
              onPress={() => handleAnswer(option)}
            >
              <Text style={[
                styles.optionText,
                answers[index] === option && styles.selectedOptionText
              ]}>
                {option}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </View>
  );

  const renderFinalChoice = () => (
    <View style={[styles.card, { width }]}>
      <View style={styles.cardContent}>
        <View style={styles.iconContainer}>
          <Sparkles size={32} color={Colors.coral} />
        </View>
        
        <Text style={styles.finalTitle}>You're all set!</Text>
        <Text style={styles.finalSubtitle}>How would you like to plan your days?</Text>
        
        <View style={styles.finalOptionsContainer}>
          <TouchableOpacity
            style={[styles.finalOption, styles.aiOption]}
            onPress={() => handleComplete('ai')}
          >
            <LinearGradient
              colors={[Colors.primary, Colors.accent]}
              style={styles.gradientButton}
            >
              <Text style={styles.finalOptionTitle}>🧠 Let AI structure my day</Text>
              <Text style={styles.finalOptionSubtitle}>Personalized, adaptive planning</Text>
            </LinearGradient>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.finalOption, styles.manualOption]}
            onPress={() => handleComplete('manual')}
          >
            <Text style={styles.finalOptionTitle}>📝 I'll plan manually</Text>
            <Text style={styles.finalOptionSubtitle}>With AI assistance</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={[Colors.background, Colors.white]}
        style={styles.gradient}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={[styles.backButton, currentCard === 0 && styles.hiddenButton]}
            onPress={handleBack}
            disabled={currentCard === 0}
          >
            <ChevronLeft size={24} color={Colors.text} />
          </TouchableOpacity>
          
          <View style={styles.progressContainer}>
            <View style={styles.progressTrack}>
              <Animated.View
                style={[
                  styles.progressBar,
                  {
                    width: progressAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: ['0%', '100%'],
                    }),
                  },
                ]}
              />
            </View>
            <Text style={styles.progressText}>
              {currentCard + 1} of {onboardingCards.length}
            </Text>
          </View>
          
          <View style={styles.placeholder} />
        </View>

        {/* Cards */}
        <ScrollView
          ref={scrollRef}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          scrollEnabled={false}
          style={styles.cardsContainer}
        >
          {onboardingCards.map((card, index) => renderCard(card, index))}
          {currentCard === onboardingCards.length - 1 && answers[currentCard] && renderFinalChoice()}
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  gradient: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.text,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  hiddenButton: {
    opacity: 0.3,
  },
  progressContainer: {
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 20,
  },
  progressTrack: {
    width: '100%',
    height: 6,
    backgroundColor: Colors.border,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: Colors.primary,
    borderRadius: 3,
  },
  progressText: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 8,
  },
  placeholder: {
    width: 40,
  },
  cardsContainer: {
    flex: 1,
  },
  card: {
    flex: 1,
    paddingHorizontal: 20,
  },
  cardContent: {
    flex: 1,
    backgroundColor: Colors.white,
    borderRadius: 20,
    padding: 32,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.text,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: `${Colors.primary}15`,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  question: {
    fontFamily: 'Inter-Bold',
    fontSize: 24,
    color: Colors.text,
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 32,
  },
  optionsContainer: {
    width: '100%',
    gap: 12,
  },
  option: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 12,
    backgroundColor: Colors.background,
    borderWidth: 2,
    borderColor: Colors.border,
  },
  selectedOption: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  optionText: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: Colors.text,
    textAlign: 'center',
  },
  selectedOptionText: {
    color: Colors.white,
  },
  finalTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 28,
    color: Colors.text,
    textAlign: 'center',
    marginBottom: 8,
  },
  finalSubtitle: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: 32,
  },
  finalOptionsContainer: {
    width: '100%',
    gap: 16,
  },
  finalOption: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  aiOption: {
    marginBottom: 8,
  },
  manualOption: {
    paddingVertical: 20,
    paddingHorizontal: 24,
    backgroundColor: Colors.background,
    borderWidth: 2,
    borderColor: Colors.border,
  },
  gradientButton: {
    paddingVertical: 20,
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  finalOptionTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 18,
    color: Colors.white,
    textAlign: 'center',
    marginBottom: 4,
  },
  finalOptionSubtitle: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: Colors.white,
    opacity: 0.9,
    textAlign: 'center',
  },
});