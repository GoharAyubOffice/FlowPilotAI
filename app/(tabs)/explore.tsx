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
  Modal,
  FlatList,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { getColors } from '../../constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Search, Filter, BookOpen, Quote, Heart, Brain, Target, Zap, Star, ArrowUpRight, Check, Shuffle, Play, Video, Headphones, TrendingUp, Users, Lightbulb, Coffee, Briefcase, Palette, Code, Camera, Music, Gamepad2, Dumbbell, Utensils, Plane, Chrome as Home, DollarSign, Sparkles, X, ChevronLeft, ChevronRight } from 'lucide-react-native';

const { width, height } = Dimensions.get('window');

interface Category {
  id: string;
  name: string;
  icon: React.ReactElement<{ color?: string }>;
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
  content?: string;
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
  content?: string;
}

// Enhanced books data with content
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
      content: 'In today\'s digital landscape, creating content is not enough. You need to understand the psychology behind what makes content spread and resonate with audiences...',
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
      content: 'Building a platform is about creating a stage for your message. It\'s about gathering an audience around your expertise and passion...',
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
      content: 'Success in the modern economy requires authenticity, passion, and the willingness to hustle. Gary shares real stories of entrepreneurs who made it...',
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
      content: 'Deep work is the ability to focus without distraction on cognitively demanding tasks. It\'s a skill that allows you to quickly master complicated information...',
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
      content: 'The GTD methodology is about capturing all the things you need to do into a logical and trusted system outside of your head and then doing them...',
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
      content: 'This book challenges the traditional concept of retirement and the 9-5 lifestyle. Tim shows how to live more and work less through automation and outsourcing...',
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
      content: 'In a world full of brown cows, you need to be a purple cow. Being remarkable is the only way to cut through the noise and get noticed...',
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
      content: 'Understanding the psychology behind why people say "yes" and how to apply these principles ethically in business and life...',
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
      content: 'The Lean Startup methodology teaches you how to drive a startup through the Build-Measure-Learn feedback loop with minimum viable products...',
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
      content: 'Every moment in business happens only once. The next Bill Gates will not build an operating system. The next Larry Page won\'t make a search engine...',
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
      content: 'Our minds are made up of two systems: System 1 is fast, intuitive, and emotional; System 2 is slower, more deliberative, and logical...',
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
      content: 'The view you adopt for yourself profoundly affects the way you lead your life. Fixed mindset vs growth mindset can determine success...',
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
      content: 'Habits are the compound interest of self-improvement. Small changes can make a remarkable difference over time...',
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
      content: 'The present moment is the only time over which we have dominion. Learn to live in the now and find peace...',
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
      content: 'The rich don\'t work for money. They make money work for them. Learn the difference between assets and liabilities...',
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
      content: 'The intelligent investor is a realist who sells to optimists and buys from pessimists. Value investing principles that stand the test of time...',
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
      content: 'Great companies can fail by doing everything right. Disruptive innovation often comes from unexpected places...',
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
      content: 'Software construction is a craft that requires both technical knowledge and practical wisdom. Best practices for writing clean, maintainable code...',
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
      content: 'Creativity is sacred, and it is not sacred. What we make matters enormously, and it doesn\'t matter at all...',
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
      content: 'Resistance is the most toxic force on the planet. It is the root of more unhappiness than poverty, disease, and erectile dysfunction...',
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
      content: 'Good is the enemy of great. Most companies never become great because they settle for good...',
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
      content: 'People don\'t buy what you do; they buy why you do it. Great leaders inspire action by starting with why...',
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
        content: 'Habits are the compound interest of self-improvement...',
      },
      {
        id: '2',
        title: 'Deep Work',
        subtitle: 'Cal Newport',
        image: 'https://images.pexels.com/photos/590016/pexels-photo-590016.jpg',
        type: 'book',
        content: 'Deep work is the ability to focus without distraction...',
      },
      {
        id: '3',
        title: 'Mindset',
        subtitle: 'Carol Dweck',
        image: 'https://images.pexels.com/photos/1181424/pexels-photo-1181424.jpg',
        type: 'book',
        content: 'The view you adopt for yourself profoundly affects...',
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
        content: 'World-class performers share their tactics, routines, and habits...',
      },
      {
        id: '5',
        title: 'How I Built This',
        subtitle: 'Entrepreneurship Stories',
        image: 'https://images.pexels.com/photos/7130469/pexels-photo-7130469.jpeg',
        type: 'podcast',
        content: 'Stories behind some of the world\'s best known companies...',
      },
      {
        id: '6',
        title: 'The Knowledge Project',
        subtitle: 'Decision Making',
        image: 'https://images.pexels.com/photos/7130468/pexels-photo-7130468.jpeg',
        type: 'podcast',
        content: 'Master the best of what other people have already figured out...',
      },
    ],
  },
];

export default function ExploreScreen() {
  const colorScheme = useColorScheme();
  const colors = getColors(colorScheme === 'dark');
  const [selectedCategory, setSelectedCategory] = useState(categories[0]);
  const [currentBookIndex, setCurrentBookIndex] = useState(0);
  const [readBooks, setReadBooks] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [selectedContent, setSelectedContent] = useState<Book | TopicItem | null>(null);
  const [showContentModal, setShowContentModal] = useState(false);
  const [readingProgress, setReadingProgress] = useState(0);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const categoryScrollRef = useRef<ScrollView>(null);

  // Auto-scroll categories
  useEffect(() => {
    const scrollInterval = setInterval(() => {
      if (categoryScrollRef.current) {
        categoryScrollRef.current.scrollTo({
          x: Math.random() * 200,
          animated: true,
        });
      }
    }, 3000);

    return () => clearInterval(scrollInterval);
  }, []);

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

  const handleContentPress = (content: Book | TopicItem) => {
    setSelectedContent(content);
    setShowContentModal(true);
    setReadingProgress(0);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setIsSearching(query.length > 0);
  };

  const getSearchResults = () => {
    if (!searchQuery) return [];
    
    const allContent = [
      ...Object.values(booksData).flat(),
      ...topicCarousels.flatMap(carousel => carousel.items),
    ];
    
    return allContent.filter(item => {
      const titleMatch = item.title.toLowerCase().includes(searchQuery.toLowerCase());
      if ('author' in item) {
        return titleMatch || item.author.toLowerCase().includes(searchQuery.toLowerCase());
      }
      return titleMatch || item.subtitle.toLowerCase().includes(searchQuery.toLowerCase());
    });
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
        {React.cloneElement(category.icon as React.ReactElement<{ color?: string }>, {
          color: selectedCategory.id === category.id ? colors.white : colors.textSecondary,
        })}
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
      <TouchableOpacity 
        style={[styles.bookCard, { backgroundColor: colors.card }]}
        onPress={() => handleContentPress(book)}
      >
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
      </TouchableOpacity>
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
          <TouchableOpacity 
            key={index} 
            style={[styles.diveDeepCard, { backgroundColor: colors.card }]}
            onPress={() => handleContentPress(item)}
          >
            <Image source={{ uri: item.image }} style={styles.diveDeepImage} />
            <View style={styles.diveDeepContent}>
              <Text style={[styles.diveDeepCardTitle, { color: colors.text }]} numberOfLines={2}>
                {item.title}
              </Text>
              <Text style={[styles.diveDeepCardSubtitle, { color: colors.textSecondary }]}>
                {item.subtitle || item.author}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );

  const renderTopicCarousel = (carousel: TopicCarousel, index: number) => (
    <View key={carousel.id} style={styles.topicCarouselContainer}>
      <Text style={[styles.topicCarouselTitle, { color: colors.text }]}>{carousel.title}</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.topicCarousel}>
        {carousel.items.map((item) => (
          <TouchableOpacity 
            key={item.id} 
            style={[styles.topicCard, { backgroundColor: colors.card }]}
            onPress={() => handleContentPress(item)}
          >
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

  const renderContentModal = () => {
    if (!selectedContent) return null;

    return (
      <Modal
        visible={showContentModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowContentModal(false)}
      >
        <SafeAreaView style={[styles.modalContainer, { backgroundColor: colors.background }]}>
          <View style={styles.modalHeader}>
            <TouchableOpacity 
              style={styles.modalCloseButton}
              onPress={() => setShowContentModal(false)}
            >
              <X size={24} color={colors.text} />
            </TouchableOpacity>
            <Text style={[styles.modalTitle, { color: colors.text }]}>
              {'author' in selectedContent ? 'Book' : 'Content'}
            </Text>
            <View style={styles.modalHeaderSpacer} />
          </View>

          <ScrollView style={styles.modalContent}>
            <Image source={{ uri: selectedContent.image }} style={styles.modalImage} />
            
            <View style={styles.modalInfo}>
              <Text style={[styles.modalContentTitle, { color: colors.text }]}>
                {selectedContent.title}
              </Text>
              <Text style={[styles.modalContentAuthor, { color: colors.textSecondary }]}>
                {'author' in selectedContent ? `by ${selectedContent.author}` : selectedContent.subtitle}
              </Text>
              
              {'rating' in selectedContent && (
                <View style={styles.modalRating}>
                  <Star size={16} color="#FFD700" fill="#FFD700" />
                  <Text style={[styles.modalRatingText, { color: colors.text }]}>
                    {selectedContent.rating}
                  </Text>
                  {'readTime' in selectedContent && (
                    <Text style={[styles.modalReadTime, { color: colors.textSecondary }]}>
                      • {selectedContent.readTime}
                    </Text>
                  )}
                </View>
              )}

              <Text style={[styles.modalDescription, { color: colors.text }]}>
                {'description' in selectedContent ? selectedContent.description : selectedContent.subtitle}
              </Text>

              {selectedContent.content && (
                <View style={styles.modalContentSection}>
                  <Text style={[styles.modalContentHeader, { color: colors.text }]}>Content Preview</Text>
                  <Text style={[styles.modalContentText, { color: colors.textSecondary }]}>
                    {selectedContent.content}
                  </Text>
                </View>
              )}
            </View>
          </ScrollView>

          <View style={styles.modalFooter}>
            <TouchableOpacity 
              style={[styles.modalReadButton, { backgroundColor: colors.primary }]}
              onPress={() => {
                if ('id' in selectedContent) {
                  handleReadBook(selectedContent.id);
                }
                setShowContentModal(false);
              }}
            >
              <Text style={styles.modalReadButtonText}>Start Reading</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </Modal>
    );
  };

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
    searchContainer: {
      paddingHorizontal: 20,
      paddingBottom: 16,
    },
    searchInput: {
      backgroundColor: colors.card,
      borderRadius: 12,
      paddingHorizontal: 16,
      paddingVertical: 12,
      fontFamily: 'Inter-Regular',
      fontSize: 16,
      color: colors.text,
      borderWidth: 1,
      borderColor: colors.border,
    },
    searchResults: {
      paddingHorizontal: 20,
      marginBottom: 24,
    },
    searchResultItem: {
      flexDirection: 'row',
      padding: 12,
      backgroundColor: colors.card,
      borderRadius: 12,
      marginBottom: 8,
      shadowColor: colors.text,
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 2,
      elevation: 1,
    },
    searchResultImage: {
      width: 60,
      height: 60,
      borderRadius: 8,
      marginRight: 12,
    },
    searchResultContent: {
      flex: 1,
    },
    searchResultTitle: {
      fontFamily: 'Inter-SemiBold',
      fontSize: 16,
      color: colors.text,
      marginBottom: 4,
    },
    searchResultAuthor: {
      fontFamily: 'Inter-Regular',
      fontSize: 14,
      color: colors.textSecondary,
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
      marginBottom: 24,
    },
    topicCarouselContainer: {
      marginBottom: 16,
    },
    topicCarouselTitle: {
      fontFamily: 'Inter-Bold',
      fontSize: 16,
      marginBottom: 12,
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
    // Modal Styles
    modalContainer: {
      flex: 1,
    },
    modalHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 20,
      paddingVertical: 16,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    modalCloseButton: {
      width: 32,
      height: 32,
      borderRadius: 16,
      backgroundColor: colors.surface,
      alignItems: 'center',
      justifyContent: 'center',
    },
    modalTitle: {
      fontFamily: 'Inter-Bold',
      fontSize: 18,
    },
    modalHeaderSpacer: {
      width: 32,
    },
    modalContent: {
      flex: 1,
    },
    modalImage: {
      width: '100%',
      height: 250,
      resizeMode: 'cover',
    },
    modalInfo: {
      padding: 20,
    },
    modalContentTitle: {
      fontFamily: 'Inter-Bold',
      fontSize: 24,
      marginBottom: 8,
    },
    modalContentAuthor: {
      fontFamily: 'Inter-Medium',
      fontSize: 16,
      marginBottom: 12,
    },
    modalRating: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 16,
      gap: 4,
    },
    modalRatingText: {
      fontFamily: 'Inter-SemiBold',
      fontSize: 14,
    },
    modalReadTime: {
      fontFamily: 'Inter-Regular',
      fontSize: 14,
    },
    modalDescription: {
      fontFamily: 'Inter-Regular',
      fontSize: 16,
      lineHeight: 24,
      marginBottom: 24,
    },
    modalContentSection: {
      marginTop: 16,
    },
    modalContentHeader: {
      fontFamily: 'Inter-Bold',
      fontSize: 18,
      marginBottom: 12,
    },
    modalContentText: {
      fontFamily: 'Inter-Regular',
      fontSize: 16,
      lineHeight: 24,
    },
    modalFooter: {
      paddingHorizontal: 20,
      paddingVertical: 16,
      borderTopWidth: 1,
      borderTopColor: colors.border,
    },
    modalReadButton: {
      paddingVertical: 16,
      borderRadius: 12,
      alignItems: 'center',
    },
    modalReadButtonText: {
      fontFamily: 'Inter-SemiBold',
      fontSize: 16,
      color: colors.white,
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Explore</Text>
          <Text style={styles.subtitle}>Discover wisdom & inspiration</Text>
        </View>
        <TouchableOpacity 
          style={styles.searchButton}
          onPress={() => setIsSearching(!isSearching)}
        >
          <Search size={20} color={colors.textSecondary} />
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      {isSearching && (
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search books, podcasts, videos..."
            placeholderTextColor={colors.textLight}
            value={searchQuery}
            onChangeText={handleSearch}
            autoFocus
          />
        </View>
      )}

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Search Results */}
        {isSearching && searchQuery.length > 0 && (
          <View style={styles.searchResults}>
            <Text style={styles.sectionTitle}>Search Results</Text>
            {getSearchResults().map((item, index) => (
              <TouchableOpacity
                key={index}
                style={styles.searchResultItem}
                onPress={() => handleContentPress(item)}
              >
                <Image source={{ uri: item.image }} style={styles.searchResultImage} />
                <View style={styles.searchResultContent}>
                  <Text style={styles.searchResultTitle}>{item.title}</Text>
                  <Text style={styles.searchResultAuthor}>
                    {'author' in item ? item.author : item.subtitle}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Show normal content when not searching */}
        {(!isSearching || searchQuery.length === 0) && (
          <>
            {/* Categories */}
            <View style={styles.categoriesSection}>
              <ScrollView
                ref={categoryScrollRef}
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
                { title: 'The Psychology of Money', author: 'Morgan Housel', image: 'https://images.pexels.com/photos/1181648/pexels-photo-1181648.jpg', content: 'Money decisions are not made on spreadsheets...' },
                { title: 'Sapiens', author: 'Yuval Noah Harari', image: 'https://images.pexels.com/photos/1181345/pexels-photo-1181345.jpg', content: 'How did our species succeed in the battle for dominance...' },
                { title: 'The Lean Startup', author: 'Eric Ries', image: 'https://images.pexels.com/photos/1181396/pexels-photo-1181396.jpg', content: 'Build-Measure-Learn feedback loop...' },
                { title: 'Thinking Fast and Slow', author: 'Daniel Kahneman', image: 'https://images.pexels.com/photos/1181424/pexels-photo-1181424.jpg', content: 'Two systems of thinking...' },
              ]
            )}

            {renderDiveDeepSection(
              'Dive Deep Into Podcasts',
              <Headphones size={20} color={colors.accent} />,
              [
                { title: 'The Joe Rogan Experience', subtitle: 'Long-form conversations', image: 'https://images.pexels.com/photos/7130560/pexels-photo-7130560.jpeg', content: 'Deep conversations with interesting people...' },
                { title: 'Masters of Scale', subtitle: 'Reid Hoffman', image: 'https://images.pexels.com/photos/7130469/pexels-photo-7130469.jpeg', content: 'How companies grow from zero to a gazillion...' },
                { title: 'The Daily', subtitle: 'The New York Times', image: 'https://images.pexels.com/photos/7130468/pexels-photo-7130468.jpeg', content: 'This is what the news should sound like...' },
                { title: 'Serial', subtitle: 'True crime stories', image: 'https://images.pexels.com/photos/7130467/pexels-photo-7130467.jpeg', content: 'One story told week by week...' },
              ]
            )}

            {renderDiveDeepSection(
              'Dive Deep Into Videos',
              <Video size={20} color={colors.coral} />,
              [
                { title: 'TED Talks', subtitle: 'Ideas worth spreading', image: 'https://images.pexels.com/photos/1181263/pexels-photo-1181263.jpg', content: 'Riveting talks by remarkable people...' },
                { title: 'Masterclass', subtitle: 'Learn from the best', image: 'https://images.pexels.com/photos/1181467/pexels-photo-1181467.jpg', content: 'Learn from the world\'s best instructors...' },
                { title: 'Khan Academy', subtitle: 'Free education', image: 'https://images.pexels.com/photos/1181675/pexels-photo-1181675.jpg', content: 'Free world-class education for anyone...' },
                { title: 'Coursera', subtitle: 'Online courses', image: 'https://images.pexels.com/photos/1181244/pexels-photo-1181244.jpg', content: 'Learn without limits...' },
              ]
            )}

            {/* Explore by Topic */}
            <View style={styles.exploreTopicsSection}>
              <Text style={styles.sectionTitle}>Explore by Topic</Text>
              
              <View style={styles.topicRow}>
                {renderTopicCarousel(topicCarousels[0], 0)}
              </View>
              
              <View style={styles.topicRow}>
                {renderTopicCarousel(topicCarousels[1], 1)}
              </View>
              
              <View style={styles.topicRow}>
                {renderTopicCarousel({
                  id: '3',
                  title: 'Self Development',
                  items: [
                    { id: '7', title: 'The 7 Habits', subtitle: 'Stephen Covey', image: 'https://images.pexels.com/photos/1181519/pexels-photo-1181519.jpg', type: 'book', content: 'Be proactive, begin with the end in mind...' },
                    { id: '8', title: 'Can\'t Hurt Me', subtitle: 'David Goggins', image: 'https://images.pexels.com/photos/590016/pexels-photo-590016.jpg', type: 'book', content: 'Master your mind and defy the odds...' },
                    { id: '9', title: 'Grit', subtitle: 'Angela Duckworth', image: 'https://images.pexels.com/photos/1181424/pexels-photo-1181424.jpg', type: 'book', content: 'The power of passion and perseverance...' },
                  ],
                }, 2)}
              </View>
              
              <View style={styles.topicRow}>
                {renderTopicCarousel({
                  id: '4',
                  title: 'Innovation',
                  items: [
                    { id: '10', title: 'The Innovator\'s Dilemma', subtitle: 'Clayton Christensen', image: 'https://images.pexels.com/photos/1181691/pexels-photo-1181691.jpg', type: 'book', content: 'When new technologies cause great firms to fail...' },
                    { id: '11', title: 'Blue Ocean Strategy', subtitle: 'W. Chan Kim', image: 'https://images.pexels.com/photos/1181777/pexels-photo-1181777.jpg', type: 'book', content: 'Create uncontested market space...' },
                    { id: '12', title: 'The Lean Startup', subtitle: 'Eric Ries', image: 'https://images.pexels.com/photos/1181396/pexels-photo-1181396.jpg', type: 'book', content: 'How today\'s entrepreneurs use continuous innovation...' },
                  ],
                }, 3)}
              </View>
            </View>
          </>
        )}
      </ScrollView>

      {/* Content Modal */}
      {renderContentModal()}
    </SafeAreaView>
  );
}