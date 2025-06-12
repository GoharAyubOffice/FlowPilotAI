import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { BookOpen, Heart, Folder, Plus, Search, Grid3x3 as Grid3X3, List, Star, Clock, Quote, ArrowRight, MoveHorizontal as MoreHorizontal, X } from 'lucide-react-native';
import { Colors } from '@/constants/Colors';

const colors = Colors.light;

interface Collection {
  id: string;
  name: string;
  description: string;
  itemCount: number;
  color: readonly [string, string];
  icon: React.ReactElement;
  items: SavedItem[];
  createdAt: string;
}

interface SavedItem {
  id: string;
  title: string;
  content: string;
  author?: string;
  type: 'quote' | 'book' | 'tip';
  savedAt: string;
}

// Fresh start - empty collections and items
const getInitialCollections = (colors: any): Collection[] => [
  {
    id: '1',
    name: 'My Inspiration',
    description: 'Quotes and ideas that motivate me',
    itemCount: 0,
    color: [colors.primary, colors.accent],
    icon: <Star size={20} color="#FFFFFF" />,
    createdAt: 'Just created',
    items: [],
  },
  {
    id: '2',
    name: 'Learning Journey',
    description: 'Books and insights for growth',
    itemCount: 0,
    color: [colors.coral, '#FF6B35'],
    icon: <BookOpen size={20} color="#FFFFFF" />,
    createdAt: 'Just created',
    items: [],
  },
  {
    id: '3',
    name: 'Mindfulness',
    description: 'Peaceful moments and reflections',
    itemCount: 0,
    color: [colors.accent, '#9B7EBD'],
    icon: <Heart size={20} color="#FFFFFF" />,
    createdAt: 'Just created',
    items: [],
  },
];

const getInitialRecentItems = (): SavedItem[] => [];

export default function LibraryScreen() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedCollection, setSelectedCollection] = useState<Collection | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<SavedItem[]>([]);
  const [collections, setCollections] = useState(getInitialCollections(colors));
  const [recentItems, setRecentItems] = useState(getInitialRecentItems());

  // All searchable content
  const allContent = [
    ...collections.flatMap(collection => collection.items),
    ...recentItems,
  ];

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    
    if (query.trim() === '') {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    
    // Search through all content
    const results = allContent.filter(item => 
      item.title.toLowerCase().includes(query.toLowerCase()) ||
      item.content.toLowerCase().includes(query.toLowerCase()) ||
      (item.author && item.author.toLowerCase().includes(query.toLowerCase()))
    );
    
    setSearchResults(results);
  };

  const clearSearch = () => {
    setSearchQuery('');
    setSearchResults([]);
    setIsSearching(false);
  };

  const renderCollectionCard = (collection: Collection) => (
    <TouchableOpacity
      key={collection.id}
      style={[styles.collectionCard, { backgroundColor: colors.card }]}
      onPress={() => setSelectedCollection(collection)}
    >
      <LinearGradient colors={collection.color} style={styles.collectionGradient}>
        <View style={styles.collectionHeader}>
          <View style={styles.collectionIcon}>
            {collection.icon}
          </View>
          <TouchableOpacity style={styles.collectionOptions}>
            <MoreHorizontal size={16} color={colors.white} />
          </TouchableOpacity>
        </View>
        
        <View style={styles.collectionContent}>
          <Text style={styles.collectionName}>{collection.name}</Text>
          <Text style={styles.collectionDescription}>{collection.description}</Text>
          <Text style={styles.collectionCount}>{collection.itemCount} items</Text>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );

  const renderCollectionList = (collection: Collection) => (
    <TouchableOpacity
      key={collection.id}
      style={[styles.collectionListItem, { backgroundColor: colors.card }]}
      onPress={() => setSelectedCollection(collection)}
    >
      <LinearGradient colors={collection.color} style={styles.collectionListIcon}>
        {collection.icon}
      </LinearGradient>
      
      <View style={styles.collectionListContent}>
        <Text style={[styles.collectionListName, { color: colors.text }]}>{collection.name}</Text>
        <Text style={[styles.collectionListMeta, { color: colors.textSecondary }]}>
          {collection.itemCount} items • {collection.createdAt}
        </Text>
      </View>
      
      <ArrowRight size={16} color={colors.textLight} />
    </TouchableOpacity>
  );

  const renderSearchResult = (item: SavedItem) => (
    <TouchableOpacity key={item.id} style={[styles.searchResultItem, { backgroundColor: colors.card }]}>
      <View style={[styles.searchResultIcon, { backgroundColor: colors.surface }]}>
        {item.type === 'quote' && <Quote size={16} color={colors.primary} />}
        {item.type === 'book' && <BookOpen size={16} color={colors.coral} />}
        {item.type === 'tip' && <Star size={16} color={colors.accent} />}
      </View>
      
      <View style={styles.searchResultContent}>
        <Text style={[styles.searchResultTitle, { color: colors.text }]}>{item.title}</Text>
        <Text style={[styles.searchResultText, { color: colors.textSecondary }]} numberOfLines={2}>
          {item.content}
        </Text>
        {item.author && (
          <Text style={[styles.searchResultAuthor, { color: colors.primary }]}>— {item.author}</Text>
        )}
        <Text style={[styles.searchResultMeta, { color: colors.textLight }]}>Saved {item.savedAt}</Text>
      </View>
    </TouchableOpacity>
  );

  const renderRecentItem = (item: SavedItem) => (
    <TouchableOpacity key={item.id} style={[styles.recentItem, { backgroundColor: colors.card }]}>
      <View style={[styles.recentItemIcon, { backgroundColor: colors.surface }]}>
        {item.type === 'quote' && <Quote size={16} color={colors.primary} />}
        {item.type === 'book' && <BookOpen size={16} color={colors.coral} />}
        {item.type === 'tip' && <Star size={16} color={colors.accent} />}
      </View>
      
      <View style={styles.recentItemContent}>
        <Text style={[styles.recentItemTitle, { color: colors.text }]}>{item.title}</Text>
        <Text style={[styles.recentItemText, { color: colors.textSecondary }]} numberOfLines={2}>
          {item.content}
        </Text>
        <Text style={[styles.recentItemMeta, { color: colors.textLight }]}>{item.savedAt}</Text>
      </View>
    </TouchableOpacity>
  );

  const renderCollectionDetail = () => {
    if (!selectedCollection) return null;

    return (
      <View style={[styles.detailContainer, { backgroundColor: colors.background }]}>
        <View style={styles.detailHeader}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => setSelectedCollection(null)}
          >
            <Text style={[styles.backText, { color: colors.primary }]}>← Back</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={[styles.addButton, { backgroundColor: colors.card }]}>
            <Plus size={20} color={colors.primary} />
          </TouchableOpacity>
        </View>

        <LinearGradient
          colors={selectedCollection.color}
          style={styles.detailBanner}
        >
          <View style={styles.detailBannerContent}>
            <View style={styles.detailIcon}>
              {selectedCollection.icon}
            </View>
            <Text style={styles.detailName}>{selectedCollection.name}</Text>
            <Text style={styles.detailDescription}>
              {selectedCollection.description}
            </Text>
            <Text style={styles.detailCount}>
              {selectedCollection.itemCount} items
            </Text>
          </View>
        </LinearGradient>

        <ScrollView style={styles.detailItems}>
          {selectedCollection.items.length === 0 && (
            <View style={styles.emptyState}>
              <Text style={[styles.emptyStateText, { color: colors.textSecondary }]}>No items yet</Text>
              <Text style={[styles.emptyStateSubtext, { color: colors.textLight }]}>
                Start adding quotes, tips, and insights to this collection
              </Text>
            </View>
          )}
        </ScrollView>
      </View>
    );
  };

  if (selectedCollection) {
    return (
      <SafeAreaView style={[{ flex: 1, backgroundColor: colors.background }]}>
        {renderCollectionDetail()}
      </SafeAreaView>
    );
  }

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
    headerActions: {
      flexDirection: 'row',
      gap: 12,
    },
    searchButton: {
      width: 36,
      height: 36,
      borderRadius: 18,
      backgroundColor: colors.card,
      alignItems: 'center',
      justifyContent: 'center',
    },
    viewToggle: {
      width: 36,
      height: 36,
      borderRadius: 18,
      backgroundColor: colors.card,
      alignItems: 'center',
      justifyContent: 'center',
    },
    searchContainer: {
      paddingHorizontal: 20,
      paddingBottom: 16,
    },
    searchInputContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.card,
      borderRadius: 12,
      paddingHorizontal: 16,
      paddingVertical: 12,
      gap: 12,
    },
    searchInput: {
      flex: 1,
      fontFamily: 'Inter-Regular',
      fontSize: 16,
      color: colors.text,
    },
    searchResultsSection: {
      paddingHorizontal: 20,
      marginBottom: 24,
    },
    searchResults: {
      gap: 12,
    },
    searchResultItem: {
      flexDirection: 'row',
      padding: 16,
      borderRadius: 12,
      shadowColor: colors.text,
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 2,
      elevation: 1,
    },
    searchResultIcon: {
      width: 32,
      height: 32,
      borderRadius: 16,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 12,
    },
    searchResultContent: {
      flex: 1,
    },
    searchResultTitle: {
      fontFamily: 'Inter-SemiBold',
      fontSize: 16,
      marginBottom: 4,
    },
    searchResultText: {
      fontFamily: 'Inter-Regular',
      fontSize: 14,
      lineHeight: 20,
      marginBottom: 4,
    },
    searchResultAuthor: {
      fontFamily: 'Inter-Medium',
      fontSize: 13,
      fontStyle: 'italic',
      marginBottom: 4,
    },
    searchResultMeta: {
      fontFamily: 'Inter-Regular',
      fontSize: 11,
    },
    noResults: {
      alignItems: 'center',
      paddingVertical: 40,
    },
    noResultsText: {
      fontFamily: 'Inter-SemiBold',
      fontSize: 16,
      color: colors.textSecondary,
      marginBottom: 4,
    },
    noResultsSubtext: {
      fontFamily: 'Inter-Regular',
      fontSize: 14,
      color: colors.textLight,
      textAlign: 'center',
    },
    scrollView: {
      flex: 1,
    },
    quickActions: {
      paddingHorizontal: 20,
      marginBottom: 24,
    },
    createButton: {
      borderRadius: 12,
      overflow: 'hidden',
    },
    createGradient: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 16,
      gap: 8,
    },
    createText: {
      fontFamily: 'Inter-SemiBold',
      fontSize: 16,
      color: colors.white,
    },
    collectionsSection: {
      paddingHorizontal: 20,
      marginBottom: 32,
    },
    sectionTitle: {
      fontFamily: 'Inter-Bold',
      fontSize: 20,
      color: colors.text,
      marginBottom: 16,
    },
    collectionsGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
      gap: 16,
    },
    collectionCard: {
      width: '48%',
      borderRadius: 16,
      overflow: 'hidden',
    },
    collectionGradient: {
      padding: 20,
      minHeight: 140,
    },
    collectionHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: 16,
    },
    collectionIcon: {
      width: 32,
      height: 32,
      borderRadius: 16,
      backgroundColor: 'rgba(255, 255, 255, 0.2)',
      alignItems: 'center',
      justifyContent: 'center',
    },
    collectionOptions: {
      padding: 4,
    },
    collectionContent: {
      flex: 1,
      justifyContent: 'flex-end',
    },
    collectionName: {
      fontFamily: 'Inter-Bold',
      fontSize: 16,
      color: colors.white,
      marginBottom: 4,
    },
    collectionDescription: {
      fontFamily: 'Inter-Regular',
      fontSize: 12,
      color: colors.white,
      opacity: 0.8,
      marginBottom: 8,
    },
    collectionCount: {
      fontFamily: 'Inter-Medium',
      fontSize: 12,
      color: colors.white,
      opacity: 0.9,
    },
    collectionsList: {
      gap: 12,
    },
    collectionListItem: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 16,
      borderRadius: 12,
      shadowColor: colors.text,
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 2,
      elevation: 1,
    },
    collectionListIcon: {
      width: 40,
      height: 40,
      borderRadius: 20,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 12,
    },
    collectionListContent: {
      flex: 1,
    },
    collectionListName: {
      fontFamily: 'Inter-SemiBold',
      fontSize: 16,
      marginBottom: 2,
    },
    collectionListMeta: {
      fontFamily: 'Inter-Regular',
      fontSize: 12,
    },
    recentSection: {
      paddingHorizontal: 20,
      marginBottom: 32,
    },
    sectionHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 16,
    },
    seeAllText: {
      fontFamily: 'Inter-SemiBold',
      fontSize: 14,
      color: colors.primary,
    },
    recentItems: {
      gap: 12,
    },
    recentItem: {
      flexDirection: 'row',
      padding: 16,
      borderRadius: 12,
      shadowColor: colors.text,
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 2,
      elevation: 1,
    },
    recentItemIcon: {
      width: 32,
      height: 32,
      borderRadius: 16,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 12,
    },
    recentItemContent: {
      flex: 1,
    },
    recentItemTitle: {
      fontFamily: 'Inter-SemiBold',
      fontSize: 14,
      marginBottom: 4,
    },
    recentItemText: {
      fontFamily: 'Inter-Regular',
      fontSize: 13,
      lineHeight: 18,
      marginBottom: 4,
    },
    recentItemMeta: {
      fontFamily: 'Inter-Regular',
      fontSize: 11,
    },
    suggestionsSection: {
      paddingHorizontal: 20,
      paddingBottom: 32,
    },
    suggestionCard: {
      flexDirection: 'row',
      backgroundColor: colors.card,
      padding: 16,
      borderRadius: 12,
      shadowColor: colors.text,
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 2,
      elevation: 1,
    },
    suggestionIcon: {
      width: 32,
      height: 32,
      borderRadius: 16,
      backgroundColor: `${colors.coral}15`,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 12,
    },
    suggestionContent: {
      flex: 1,
    },
    suggestionTitle: {
      fontFamily: 'Inter-SemiBold',
      fontSize: 14,
      color: colors.text,
      marginBottom: 4,
    },
    suggestionText: {
      fontFamily: 'Inter-Regular',
      fontSize: 13,
      color: colors.textSecondary,
      lineHeight: 18,
      marginBottom: 12,
    },
    suggestionActions: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 16,
    },
    suggestionButton: {
      paddingVertical: 6,
      paddingHorizontal: 12,
      backgroundColor: colors.primary,
      borderRadius: 6,
    },
    suggestionButtonText: {
      fontFamily: 'Inter-SemiBold',
      fontSize: 12,
      color: colors.white,
    },
    dismissText: {
      fontFamily: 'Inter-Medium',
      fontSize: 12,
      color: colors.textLight,
    },
    // Detail View Styles
    detailContainer: {
      flex: 1,
    },
    detailHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: 20,
      paddingVertical: 16,
    },
    backButton: {
      paddingVertical: 8,
    },
    backText: {
      fontFamily: 'Inter-SemiBold',
      fontSize: 16,
    },
    addButton: {
      width: 36,
      height: 36,
      borderRadius: 18,
      alignItems: 'center',
      justifyContent: 'center',
      shadowColor: colors.text,
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 2,
      elevation: 1,
    },
    detailBanner: {
      marginHorizontal: 20,
      borderRadius: 16,
      marginBottom: 20,
    },
    detailBannerContent: {
      padding: 24,
      alignItems: 'center',
    },
    detailIcon: {
      width: 48,
      height: 48,
      borderRadius: 24,
      backgroundColor: 'rgba(255, 255, 255, 0.2)',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 12,
    },
    detailName: {
      fontFamily: 'Inter-Bold',
      fontSize: 20,
      color: colors.white,
      marginBottom: 4,
    },
    detailDescription: {
      fontFamily: 'Inter-Regular',
      fontSize: 14,
      color: colors.white,
      opacity: 0.9,
      textAlign: 'center',
      marginBottom: 8,
    },
    detailCount: {
      fontFamily: 'Inter-Medium',
      fontSize: 12,
      color: colors.white,
      opacity: 0.8,
    },
    detailItems: {
      flex: 1,
      paddingHorizontal: 20,
    },
    emptyState: {
      alignItems: 'center',
      paddingVertical: 40,
    },
    emptyStateText: {
      fontFamily: 'Inter-SemiBold',
      fontSize: 16,
      marginBottom: 4,
    },
    emptyStateSubtext: {
      fontFamily: 'Inter-Regular',
      fontSize: 14,
      textAlign: 'center',
      lineHeight: 20,
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Smart Library</Text>
          <Text style={styles.subtitle}>Your saved wisdom & insights</Text>
        </View>
        <View style={styles.headerActions}>
          <TouchableOpacity 
            style={styles.searchButton}
            onPress={() => setIsSearching(!isSearching)}
          >
            <Search size={18} color={colors.textSecondary} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.viewToggle}
            onPress={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
          >
            {viewMode === 'grid' ? (
              <List size={18} color={colors.textSecondary} />
            ) : (
              <Grid3X3 size={18} color={colors.textSecondary} />
            )}
          </TouchableOpacity>
        </View>
      </View>

      {/* Search Bar */}
      {isSearching && (
        <View style={styles.searchContainer}>
          <View style={styles.searchInputContainer}>
            <Search size={16} color={colors.textSecondary} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search quotes, books, tips..."
              placeholderTextColor={colors.textLight}
              value={searchQuery}
              onChangeText={handleSearch}
              autoFocus
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={clearSearch}>
                <X size={16} color={colors.textSecondary} />
              </TouchableOpacity>
            )}
          </View>
        </View>
      )}

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Search Results */}
        {isSearching && searchQuery.length > 0 && (
          <View style={styles.searchResultsSection}>
            <Text style={styles.sectionTitle}>
              Search Results ({searchResults.length})
            </Text>
            {searchResults.length > 0 ? (
              <View style={styles.searchResults}>
                {searchResults.map(renderSearchResult)}
              </View>
            ) : (
              <View style={styles.noResults}>
                <Text style={styles.noResultsText}>No results found</Text>
                <Text style={styles.noResultsSubtext}>
                  Try searching with different keywords
                </Text>
              </View>
            )}
          </View>
        )}

        {/* Show normal content when not searching or no search query */}
        {(!isSearching || searchQuery.length === 0) && (
          <>
            {/* Quick Actions */}
            <View style={styles.quickActions}>
              <TouchableOpacity style={styles.createButton}>
                <LinearGradient
                  colors={[colors.primary, colors.accent]}
                  style={styles.createGradient}
                >
                  <Plus size={20} color={colors.white} />
                  <Text style={styles.createText}>Create Collection</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>

            {/* Collections */}
            <View style={styles.collectionsSection}>
              <Text style={styles.sectionTitle}>My Collections</Text>
              
              {viewMode === 'grid' ? (
                <View style={styles.collectionsGrid}>
                  {collections.map(renderCollectionCard)}
                </View>
              ) : (
                <View style={styles.collectionsList}>
                  {collections.map(renderCollectionList)}
                </View>
              )}
            </View>

            {/* Recent Items */}
            {recentItems.length > 0 && (
              <View style={styles.recentSection}>
                <View style={styles.sectionHeader}>
                  <Text style={styles.sectionTitle}>Recently Saved</Text>
                  <TouchableOpacity>
                    <Text style={styles.seeAllText}>See all</Text>
                  </TouchableOpacity>
                </View>
                
                <View style={styles.recentItems}>
                  {recentItems.map(renderRecentItem)}
                </View>
              </View>
            )}

            {/* Empty State for Recent Items */}
            {recentItems.length === 0 && (
              <View style={styles.recentSection}>
                <Text style={styles.sectionTitle}>Recently Saved</Text>
                <View style={styles.emptyState}>
                  <Text style={[styles.emptyStateText, { color: colors.textSecondary }]}>No saved items yet</Text>
                  <Text style={[styles.emptyStateSubtext, { color: colors.textLight }]}>
                    Start exploring and save your favorite content to see it here
                  </Text>
                </View>
              </View>
            )}

            {/* Getting Started Tips */}
            <View style={styles.suggestionsSection}>
              <Text style={styles.sectionTitle}>Getting Started</Text>
              <View style={styles.suggestionCard}>
                <View style={styles.suggestionIcon}>
                  <Star size={20} color={colors.coral} />
                </View>
                <View style={styles.suggestionContent}>
                  <Text style={styles.suggestionTitle}>Start Your Journey</Text>
                  <Text style={styles.suggestionText}>
                    Explore the Discover tab to find inspiring quotes, books, and tips. Save your favorites to build your personal library.
                  </Text>
                  <View style={styles.suggestionActions}>
                    <TouchableOpacity style={styles.suggestionButton}>
                      <Text style={styles.suggestionButtonText}>Explore</Text>
                    </TouchableOpacity>
                    <TouchableOpacity>
                      <Text style={styles.dismissText}>Later</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </View>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}