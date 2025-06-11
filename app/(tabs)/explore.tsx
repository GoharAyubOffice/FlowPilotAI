import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Animated,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useColorScheme } from '@/hooks/useColorScheme';
import {
  Search,
  Filter,
  BookOpen,
  Quote,
  Heart,
  Brain,
  Target,
  Zap,
  Star,
  ArrowUpRight,
  Check,
  Shuffle,
  Play,
  Video,
  Headphones,
  TrendingUp,
  Users,
  Lightbulb,
  Coffee,
  Briefcase,
  Palette,
  Code,
  Camera,
  Music,
  Gamepad2,
  Dumbbell,
  Utensils,
  Plane,
  Home,
  DollarSign,
  Sparkles,
} from 'lucide-react-native';

const { width, height } = Dimensions.get('window');

interface Category {
  id: string;
  name: string;
  icon: React.ReactElement;
  color: string;
  books: Book[];
}

interface Book {
  id: string;
  title: string;
  author: string;
  description: string;
  image: string;
  rating: number;
  readTime: string;
  category: string;
}

interface TopicCarousel {
  id: string;
  title: string;
  items: TopicItem[];
}

interface TopicItem {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  type: 'book' | 'podcast' | 'video';
}

// Sample books data for different categories
const booksData: { [key: string]: Book[] } = {
  media: [
    {
      id: '1',
      title: 'The Content Code',
      author: 'Mark Schaefer',
      description: 'Why content is not enough and how to break through the noise.',
      image: 'https://images.pexels.com/photos/159711/books-bookstore-book-reading-159711.jpeg',
      rating: 4.5,
      readTime: '6 hours',
      category: 'Media',
    },
    {
      id: '2',
      title: 'Platform',
      author: 'Michael Hyatt',
      description: 'Get noticed in a noisy world by building your platform.',
      image: 'https://images.pexels.com/photos/1029141/pexels-photo-1029141.jpeg',
      rating: 4.3,
      readTime: '5 hours',
      category: 'Media',
    },
    {
      id: '3',
      title: 'Crushing It!',
      author: 'Gary Vaynerchuk',
      description: 'How great entrepreneurs build their business and influence.',
      image: 'https://images.pexels.com/photos/1370295/pexels-photo-1370295.jpeg',
      rating: 4.7,
      readTime: '7 hours',
      category: 'Media',
    },
  ],
  productivity: [
    {
      id: '4',
      title: 'Deep Work',
      author: 'Cal Newport',
      description: 'Rules for focused success in a distracted world.',
      image: 'https://images.pexels.com/photos/590016/pexels-photo-590016.jpg',
      rating: 4.8,
      readTime: '8 hours',
      category: 'Productivity',
    },
    {
      id: '5',
      title: 'Getting Things Done',
      author: 'David Allen',
      description: 'The art of stress-free productivity.',
      image: 'https://images.pexels.com/photos/1181244/pexels-photo-1181244.jpg',
      rating: 4.6,
      readTime: '9 hours',
      category: 'Productivity',
    },
    {
      id: '6',
      title: 'The 4-Hour Workweek',
      author: 'Tim Ferriss',
      description: 'Escape 9-5, live anywhere, and join the new rich.',
      image: 'https://images.pexels.com/photos/1181675/pexels-photo-1181675.jpg',
      rating: 4.4,
      readTime: '10 hours',
      category: 'Productivity',
    },
  ],
  marketing: [
    {
      id: '7',
      title: 'Purple Cow',
      author: 'Seth Godin',
      description: 'Transform your business by being remarkable.',
      image: 'https://images.pexels.com/photos/1181467/pexels-photo-1181467.jpg',
      rating: 4.5,
      readTime: '4 hours',
      category: 'Marketing',
    },
    {
      id: '8',
      title: 'Influence',
      author: 'Robert Cialdini',
      description: 'The psychology of persuasion.',
      image: 'https://images.pexels.com/photos/1181263/pexels-photo-1181263.jpg',
      rating: 4.9,
      readTime: '8 hours',
      category: 'Marketing',
    },
  ],
  business: [
    {
      id: '9',
      title: 'The Lean Startup',
      author: 'Eric Ries',
      description: 'How today\'s entrepreneurs use continuous innovation.',
      image: 'https://images.pexels.com/photos/1181396/pexels-photo-1181396.jpg',
      rating: 4.6,
      readTime: '7 hours',
      category: 'Business',
    },
    {
      id: '10',
      title: 'Zero to One',
      author: 'Peter Thiel',
      description: 'Notes on startups, or how to build the future.',
      image: 'https://images.pexels.com/photos/1181298/pexels-photo-1181298.jpg',
      rating: 4.7,
      readTime: '6 hours',
      category: 'Business',
    },
  ],
  psychology: [
    {
      id: '11',
      title: 'Thinking, Fast and Slow',
      author: 'Daniel Kahneman',
      description: 'The frailties of human judgment and decision-making.',
      image: 'https://images.pexels.com/photos/1181345/pexels-photo-1181345.jpg',
      rating: 4.8,
      readTime: '12 hours',
      category: 'Psychology',
    },
    {
      id: '12',
      title: 'Mindset',
      author: 'Carol Dweck',
      description: 'The new psychology of success.',
      image: 'https://images.pexels.com/photos/1181424/pexels-photo-1181424.jpg',
      rating: 4.5,
      readTime: '7 hours',
      category: 'Psychology',
    },
  ],
  health: [
    {
      id: '13',
      title: 'Atomic Habits',
      author: 'James Clear',
      description: 'An easy & proven way to build good habits & break bad ones.',
      image: 'https://images.pexels.com/photos/1181519/pexels-photo-1181519.jpg',
      rating: 4.9,
      readTime: '5 hours',
      category: 'Health',
    },
    {
      id: '14',
      title: 'The Power of Now',
      author: 'Eckhart Tolle',
      description: 'A guide to spiritual enlightenment.',
      image: 'https://images.pexels.com/photos/1181562/pexels-photo-1181562.jpg',
      rating: 4.4,
      readTime: '6 hours',
      category: 'Health',
    },
  ],
  finance: [
    {
      id: '15',
      title: 'Rich Dad Poor Dad',
      author: 'Robert Kiyosaki',
      description: 'What the rich teach their kids about money.',
      image: 'https://images.pexels.com/photos/1181605/pexels-photo-1181605.jpg',
      rating: 4.3,
      readTime: '6 hours',
      category: 'Finance',
    },
    {
      id: '16',
      title: 'The Intelligent Investor',
      author: 'Benjamin Graham',
      description: 'The definitive book on value investing.',
      image: 'https://images.pexels.com/photos/1181648/pexels-photo-1181648.jpg',
      rating: 4.7,
      readTime: '15 hours',
      category: 'Finance',
    },
  ],
  technology: [
    {
      id: '17',
      title: 'The Innovator\'s Dilemma',
      author: 'Clayton Christensen',
      description: 'When new technologies cause great firms to fail.',
      image: 'https://images.pexels.com/photos/1181691/pexels-photo-1181691.jpg',
      rating: 4.5,
      readTime: '8 hours',
      category: 'Technology',
    },
    {
      id: '18',
      title: 'Code Complete',
      author: 'Steve McConnell',
      description: 'A practical handbook of software construction.',
      image: 'https://images.pexels.com/photos/1181734/pexels-photo-1181734.jpg',
      rating: 4.8,
      readTime: '20 hours',
      category: 'Technology',
    },
  ],
  creativity: [
    {
      id: '19',
      title: 'Big Magic',
      author: 'Elizabeth Gilbert',
      description: 'Creative living beyond fear.',
      image: 'https://images.pexels.com/photos/1181777/pexels-photo-1181777.jpg',
      rating: 4.4,
      readTime: '5 hours',
      category: 'Creativity',
    },
    {
      id: '20',
      title: 'The War of Art',
      author: 'Steven Pressfield',
      description: 'Break through the blocks and win your inner creative battles.',
      image: 'https://images.pexels.com/photos/1181820/pexels-photo-1181820.jpg',
      rating: 4.6,
      readTime: '3 hours',
      category: 'Creativity',
    },
  ],
  leadership: [
    {
      id: '21',
      title: 'Good to Great',
      author: 'Jim Collins',
      description: 'Why some companies make the leap... and others don\'t.',
      image: 'https://images.pexels.com/photos/1181863/pexels-photo-1181863.jpg',
      rating: 4.7,
      readTime: '10 hours',
      category: 'Leadership',
    },
    {
      id: '22',
      title: 'Start with Why',
      author: 'Simon Sinek',
      description: 'How great leaders inspire everyone to take action.',
      image: 'https://images.pexels.com/photos/1181906/pexels-photo-1181906.jpg',
      rating: 4.5,
      readTime: '7 hours',
      category: 'Leadership',
    },
  ],
};

const categories: Category[] = [
  {
    id: 'media',
    name: 'Media',
    icon: <Camera size={16} />,
    color: '#FF6B6B',
    books: booksData.media,
  },
  {
    id: 'productivity',
    name: 'Productivity',
    icon: <Target size={16} />,
    color: '#4ECDC4',
    books: booksData.productivity,
  },
  {
    id: 'marketing',
    name: 'Marketing',
    icon: <TrendingUp size={16} />,
    color: '#45B7D1',
    books: booksData.marketing,
  },
  {
    id: 'business',
    name: 'Business',
    icon: <Briefcase size={16} />,
    color: '#96CEB4',
    books: booksData.business,
  },
  {
    id: 'psychology',
    name: 'Psychology',
    icon: <Brain size={16} />,
    color: '#FFEAA7',
    books: booksData.psychology,
  },
  {
    id: 'health',
    name: 'Health',
    icon: <Heart size={16} />,
    color: '#DDA0DD',
    books: booksData.health,
  },
  {
    id: 'finance',
    name: 'Finance',
    icon: <DollarSign size={16} />,
    color: '#98D8C8',
    books: booksData.finance,
  },
  {
    id: 'technology',
    name: 'Technology',
    icon: <Code size={16} />,
    color: '#F7DC6F',
    books: booksData.technology,
  },
  {
    id: 'creativity',
    name: 'Creativity',
    icon: <Palette size={16} />,
    color: '#BB8FCE',
    books: booksData.creativity,
  },
  {
    id: 'leadership',
    name: 'Leadership',
    icon: <Users size={16} />,
    color: '#85C1E9',
    books: booksData.leadership,
  },
];

const topicCarousels: TopicCarousel[] = [
  {
    id: '1',
    title: 'Trending Books',
    items: [
      {
        id: '1',
        title: 'Atomic Habits',
        subtitle: 'James Clear',
        image: 'https://images.pexels.com/photos/1181519/pexels-photo-1181519.jpg',
        type: 'book',
      },
      {
        id: '2',
        title: 'Deep Work',
        subtitle: 'Cal Newport',
        image: 'https://images.pexels.com/photos/590016/pexels-photo-590016.jpg',
        type: 'book',
      },
      {
        id: '3',
        title: 'Mindset',
        subtitle: 'Carol Dweck',
        image: 'https://images.pexels.com/photos/1181424/pexels-photo-1181424.jpg',
        type: 'book',
      },
    ],
  },
  {
    id: '2',
    title: 'Popular Podcasts',
    items: [
      {
        id: '4',
        title: 'The Tim Ferriss Show',
        subtitle: 'Productivity & Performance',
        image: 'https://images.pexels.com/photos/7130560/pexels-photo-7130560.jpeg',
        type: 'podcast',
      },
      {
        id: '5',
        title: 'How I Built This',
        subtitle: 'Entrepreneurship Stories',
        image: 'https://images.pexels.com/photos/7130469/pexels-photo-7130469.jpeg',
        type: 'podcast',
      },
      {
        id: '6',
        title: 'The Knowledge Project',
        subtitle: 'Decision Making',
        image: 'https://images.pexels.com/photos/7130468/pexels-photo-7130468.jpeg',
        type: 'podcast',
      },
    ],
  },
];

export default function ExploreScreen() {
  const { colorScheme, colors } = useColorScheme();
  const [selectedCategory, setSelectedCategory] = useState(categories[0]);
  const [currentBookIndex, setCurrentBookIndex] = useState(0);
  const [readBooks, setReadBooks] = useState<Set<string>>(new Set());
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const handleCategoryPress = (category: Category) => {
    setSelectedCategory(category);
    setCurrentBookIndex(0);
  };

  const handleRandomizeBook = () => {
    const randomIndex = Math.floor(Math.random() * selectedCategory.books.length);
    setCurrentBookIndex(randomIndex);
  };

  const handleReadBook = (bookId: string) => {
    setReadBooks(prev => new Set([...prev, bookId]));
    
    // Animate check mark
    Animated.sequence([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.delay(1000),
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const renderCategoryTab = (category: Category) => (
    <TouchableOpacity
      key={category.id}
      style={[
        styles.categoryTab,
        {
          backgroundColor: selectedCategory.id === category.id ? category.color : colors.surface,
          borderColor: selectedCategory.id === category.id ? category.color : colors.border,
        }
      ]}
      onPress={() => handleCategoryPress(category)}
    >
      <View style={styles.categoryIconContainer}>
        {React.cloneElement(category.icon, {
          color: selectedCategory.id === category.id ? colors.white : colors.textSecondary,
        } as { color: string })}
      </View>
      <Text style={[
        styles.categoryTabText,
        {
          color: selectedCategory.id === category.id ? colors.white : colors.textSecondary,
        }
      ]}>
        {category.name}
      </Text>
    </TouchableOpacity>
  );

  const renderBookCard = (book: Book) => {
    const isRead = readBooks.has(book.id);
    
    return (
      <View style={[styles.bookCard, { backgroundColor: colors.card }]}>
        <Image source={{ uri: book.image }} style={styles.bookImage} />
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.8)']}
          style={styles.bookOverlay}
        >
          <View style={styles.bookContent}>
            <View style={styles.bookHeader}>
              <View style={styles.bookRating}>
                <Star size={12} color="#FFD700" fill="#FFD700" />
                <Text style={styles.ratingText}>{book.rating}</Text>
              </View>
              {isRead && (
                <Animated.View style={[styles.readIndicator, { opacity: fadeAnim }]}>
                  <Check size={16} color={colors.white} />
                </Animated.View>
              )}
            </View>
            
            <Text style={styles.bookTitle}>{book.title}</Text>
            <Text style={styles.bookAuthor}>by {book.author}</Text>
            <Text style={styles.bookDescription} numberOfLines={2}>
              {book.description}
            </Text>
            <Text style={styles.readTime}>{book.readTime}</Text>
            
            <View style={styles.bookActions}>
              <TouchableOpacity
                style={[styles.readButton, isRead && styles.readButtonCompleted]}
                onPress={() => handleReadBook(book.id)}
                disabled={isRead}
              >
                <Text style={[styles.readButtonText, isRead && styles.readButtonTextCompleted]}>
                  {isRead ? 'Read' : 'Read'}
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.randomButton} onPress={handleRandomizeBook}>
                <Shuffle size={20} color={colors.white} />
              </TouchableOpacity>
            </View>
          </View>
        </LinearGradient>
      </View>
    );
  };

  const renderDiveDeepSection = (title: string, icon: React.ReactNode, items: any[]) => (
    <View style={styles.diveDeepSection}>
      <View style={styles.diveDeepHeader}>
        <View style={styles.diveDeepTitleContainer}>
          {icon}
          <Text style={[styles.diveDeepTitle, { color: colors.text }]}>{title}</Text>
        </View>
        <TouchableOpacity>
          <Text style={[styles.seeAllText, { color: colors.primary }]}>See all</Text>
        </TouchableOpacity>
      </View>
      
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.diveDeepScroll}>
        {items.map((item, index) => (
          <TouchableOpacity key={index} style={[styles.diveDeepCard, { backgroundColor: colors.card }]}>
            <Image source={{ uri: item.image }} style={styles.diveDeepImage} />
            <View style={styles.diveDeepContent}>
              <Text style={[styles.diveDeepCardTitle, { color: colors.text }]} numberOfLines={2}>
                {item.title}
              </Text>
              <Text style={[styles.diveDeepCardSubtitle, { color: colors.textSecondary }]}>
                {item.subtitle}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );

  const renderTopicCarousel = (carousel: TopicCarousel, index: number) => (
    <View key={carousel.id} style={styles.topicCarouselContainer}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.topicCarousel}>
        {carousel.items.map((item) => (
          <TouchableOpacity key={item.id} style={[styles.topicCard, { backgroundColor: colors.card }]}>
            <Image source={{ uri: item.image }} style={styles.topicImage} />
            <View style={styles.topicContent}>
              <Text style={[styles.topicTitle, { color: colors.text }]} numberOfLines={1}>
                {item.title}
              </Text>
              <Text style={[styles.topicSubtitle, { color: colors.textSecondary }]}>
                {item.subtitle}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
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
    searchButton: {
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
    categoriesSection: {
      paddingVertical: 16,
    },
    categoriesContainer: {
      paddingHorizontal: 20,
      gap: 12,
    },
    categoryTab: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 12,
      paddingHorizontal: 16,
      borderRadius: 25,
      borderWidth: 1,
      gap: 8,
      minHeight: 44,
    },
    categoryIconContainer: {
      width: 20,
      height: 20,
      alignItems: 'center',
      justifyContent: 'center',
    },
    categoryTabText: {
      fontFamily: 'Inter-SemiBold',
      fontSize: 14,
    },
    bookSection: {
      paddingHorizontal: 20,
      marginBottom: 32,
    },
    sectionTitle: {
      fontFamily: 'Inter-Bold',
      fontSize: 20,
      color: colors.text,
      marginBottom: 16,
    },
    bookCard: {
      height: 400,
      borderRadius: 20,
      overflow: 'hidden',
      shadowColor: colors.text,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 12,
      elevation: 4,
    },
    bookImage: {
      width: '100%',
      height: '100%',
      resizeMode: 'cover',
    },
    bookOverlay: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      height: '60%',
      justifyContent: 'flex-end',
    },
    bookContent: {
      padding: 24,
    },
    bookHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 12,
    },
    bookRating: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: 'rgba(255, 255, 255, 0.2)',
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 12,
      gap: 4,
    },
    ratingText: {
      fontFamily: 'Inter-SemiBold',
      fontSize: 12,
      color: colors.white,
    },
    readIndicator: {
      width: 24,
      height: 24,
      borderRadius: 12,
      backgroundColor: 'rgba(34, 197, 94, 0.9)',
      alignItems: 'center',
      justifyContent: 'center',
    },
    bookTitle: {
      fontFamily: 'Inter-Bold',
      fontSize: 24,
      color: colors.white,
      marginBottom: 4,
    },
    bookAuthor: {
      fontFamily: 'Inter-Medium',
      fontSize: 16,
      color: colors.white,
      opacity: 0.9,
      marginBottom: 8,
    },
    bookDescription: {
      fontFamily: 'Inter-Regular',
      fontSize: 14,
      color: colors.white,
      opacity: 0.8,
      lineHeight: 20,
      marginBottom: 8,
    },
    readTime: {
      fontFamily: 'Inter-Medium',
      fontSize: 12,
      color: colors.white,
      opacity: 0.7,
      marginBottom: 16,
    },
    bookActions: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
    },
    readButton: {
      flex: 1,
      backgroundColor: colors.primary,
      paddingVertical: 12,
      borderRadius: 12,
      alignItems: 'center',
    },
    readButtonCompleted: {
      backgroundColor: 'rgba(34, 197, 94, 0.9)',
    },
    readButtonText: {
      fontFamily: 'Inter-SemiBold',
      fontSize: 16,
      color: colors.white,
    },
    readButtonTextCompleted: {
      color: colors.white,
    },
    randomButton: {
      width: 44,
      height: 44,
      borderRadius: 22,
      backgroundColor: 'rgba(255, 255, 255, 0.2)',
      alignItems: 'center',
      justifyContent: 'center',
    },
    diveDeepSection: {
      paddingHorizontal: 20,
      marginBottom: 32,
    },
    diveDeepHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 16,
    },
    diveDeepTitleContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
    },
    diveDeepTitle: {
      fontFamily: 'Inter-Bold',
      fontSize: 18,
    },
    seeAllText: {
      fontFamily: 'Inter-SemiBold',
      fontSize: 14,
    },
    diveDeepScroll: {
      marginLeft: -20,
      paddingLeft: 20,
    },
    diveDeepCard: {
      width: 140,
      marginRight: 16,
      borderRadius: 12,
      overflow: 'hidden',
      shadowColor: colors.text,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    },
    diveDeepImage: {
      width: '100%',
      height: 80,
      resizeMode: 'cover',
    },
    diveDeepContent: {
      padding: 12,
    },
    diveDeepCardTitle: {
      fontFamily: 'Inter-SemiBold',
      fontSize: 12,
      marginBottom: 4,
      lineHeight: 16,
    },
    diveDeepCardSubtitle: {
      fontFamily: 'Inter-Regular',
      fontSize: 10,
    },
    exploreTopicsSection: {
      paddingHorizontal: 20,
      marginBottom: 32,
    },
    topicRow: {
      flexDirection: 'row',
      gap: 16,
      marginBottom: 16,
    },
    topicCarouselContainer: {
      flex: 1,
    },
    topicCarousel: {
      marginLeft: -20,
      paddingLeft: 20,
    },
    topicCard: {
      width: 120,
      marginRight: 12,
      borderRadius: 12,
      overflow: 'hidden',
      shadowColor: colors.text,
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 2,
      elevation: 1,
    },
    topicImage: {
      width: '100%',
      height: 60,
      resizeMode: 'cover',
    },
    topicContent: {
      padding: 8,
    },
    topicTitle: {
      fontFamily: 'Inter-SemiBold',
      fontSize: 10,
      marginBottom: 2,
    },
    topicSubtitle: {
      fontFamily: 'Inter-Regular',
      fontSize: 8,
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Explore</Text>
          <Text style={styles.subtitle}>Discover wisdom & inspiration</Text>
        </View>
        <TouchableOpacity style={styles.searchButton}>
          <Search size={20} color={colors.textSecondary} />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Categories */}
        <View style={styles.categoriesSection}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoriesContainer}
          >
            {categories.map(renderCategoryTab)}
          </ScrollView>
        </View>

        {/* Featured Book */}
        <View style={styles.bookSection}>
          <Text style={styles.sectionTitle}>Featured in {selectedCategory.name}</Text>
          {selectedCategory.books[currentBookIndex] && renderBookCard(selectedCategory.books[currentBookIndex])}
        </View>

        {/* Dive Deep Sections */}
        {renderDiveDeepSection(
          'Dive Deep Into Books',
          <BookOpen size={20} color={colors.primary} />,
          [
            { title: 'The Psychology of Money', subtitle: 'Morgan Housel', image: 'https://images.pexels.com/photos/1181648/pexels-photo-1181648.jpg' },
            { title: 'Sapiens', subtitle: 'Yuval Noah Harari', image: 'https://images.pexels.com/photos/1181345/pexels-photo-1181345.jpg' },
            { title: 'The Lean Startup', subtitle: 'Eric Ries', image: 'https://images.pexels.com/photos/1181396/pexels-photo-1181396.jpg' },
            { title: 'Thinking Fast and Slow', subtitle: 'Daniel Kahneman', image: 'https://images.pexels.com/photos/1181424/pexels-photo-1181424.jpg' },
          ]
        )}

        {renderDiveDeepSection(
          'Dive Deep Into Podcasts',
          <Headphones size={20} color={colors.accent} />,
          [
            { title: 'The Joe Rogan Experience', subtitle: 'Long-form conversations', image: 'https://images.pexels.com/photos/7130560/pexels-photo-7130560.jpeg' },
            { title: 'Masters of Scale', subtitle: 'Reid Hoffman', image: 'https://images.pexels.com/photos/7130469/pexels-photo-7130469.jpeg' },
            { title: 'The Daily', subtitle: 'The New York Times', image: 'https://images.pexels.com/photos/7130468/pexels-photo-7130468.jpeg' },
            { title: 'Serial', subtitle: 'True crime stories', image: 'https://images.pexels.com/photos/7130467/pexels-photo-7130467.jpeg' },
          ]
        )}

        {renderDiveDeepSection(
          'Dive Deep Into Videos',
          <Video size={20} color={colors.coral} />,
          [
            { title: 'TED Talks', subtitle: 'Ideas worth spreading', image: 'https://images.pexels.com/photos/1181263/pexels-photo-1181263.jpg' },
            { title: 'Masterclass', subtitle: 'Learn from the best', image: 'https://images.pexels.com/photos/1181467/pexels-photo-1181467.jpg' },
            { title: 'Khan Academy', subtitle: 'Free education', image: 'https://images.pexels.com/photos/1181675/pexels-photo-1181675.jpg' },
            { title: 'Coursera', subtitle: 'Online courses', image: 'https://images.pexels.com/photos/1181244/pexels-photo-1181244.jpg' },
          ]
        )}

        {/* Explore by Topic */}
        <View style={styles.exploreTopicsSection}>
          <Text style={styles.sectionTitle}>Explore by Topic</Text>
          
          <View style={styles.topicRow}>
            {renderTopicCarousel(topicCarousels[0], 0)}
            {renderTopicCarousel(topicCarousels[1], 1)}
          </View>
          
          <View style={styles.topicRow}>
            {renderTopicCarousel({
              id: '3',
              title: 'Self Development',
              items: [
                { id: '7', title: 'The 7 Habits', subtitle: 'Stephen Covey', image: 'https://images.pexels.com/photos/1181519/pexels-photo-1181519.jpg', type: 'book' },
                { id: '8', title: 'Can\'t Hurt Me', subtitle: 'David Goggins', image: 'https://images.pexels.com/photos/590016/pexels-photo-590016.jpg', type: 'book' },
                { id: '9', title: 'Grit', subtitle: 'Angela Duckworth', image: 'https://images.pexels.com/photos/1181424/pexels-photo-1181424.jpg', type: 'book' },
              ],
            }, 2)}
            {renderTopicCarousel({
              id: '4',
              title: 'Innovation',
              items: [
                { id: '10', title: 'The Innovator\'s Dilemma', subtitle: 'Clayton Christensen', image: 'https://images.pexels.com/photos/1181691/pexels-photo-1181691.jpg', type: 'book' },
                { id: '11', title: 'Blue Ocean Strategy', subtitle: 'W. Chan Kim', image: 'https://images.pexels.com/photos/1181777/pexels-photo-1181777.jpg', type: 'book' },
                { id: '12', title: 'The Lean Startup', subtitle: 'Eric Ries', image: 'https://images.pexels.com/photos/1181396/pexels-photo-1181396.jpg', type: 'book' },
              ],
            }, 3)}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}