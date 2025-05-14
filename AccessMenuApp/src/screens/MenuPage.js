import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Image,
  Button,
  Alert,
  SafeAreaView
} from 'react-native';
import * as Speech from 'expo-speech';
import { Video } from 'expo-av';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';


// Image mapping remains the same
const imageMapping = {
  "burger.jpg": require('../../assets/images/burger.jpg'),
  "pizza.jpg": require('../../assets/images/pizza.jpg'),
  "salad.jpg": require('../../assets/images/salad.jpg'),
  "fish.jpg": require('../../assets/images/fish.jpg'),
  "Pasta.png": require('../../assets/images/Pasta.png'),
  "suchi.png": require('../../assets/images/suchi.png'),
  "Rice.webp": require('../../assets/images/Rice.webp'),
  "Pancakes.jpg": require('../../assets/images/Pancakes.jpg'),
  "omelette.jpg": require('../../assets/images/omelette.jpg'),
  "cereal.jpeg": require('../../assets/images/cereal.jpeg'),
  "orange-juice.jpg": require('../../assets/images/orange-juice.jpg'),
  "coffee.jpeg": require('../../assets/images/coffee.jpeg'),
  "milkshake.jpeg": require('../../assets/images/milkshake.jpeg'),
  "ice-cream.jpg": require('../../assets/images/Ice-cream.jpg'),
  "chocolate-cake.jpg": require('../../assets/images/Chocolate-Cake.jpg'),
  "fruit-salad.jpeg": require('../../assets/images/fruit-salad.jpeg')
};

const allergenIcons = {
  Gluten: "🌾",
  Dairy: "🥛",
  Nuts: "🥜",
  Eggs: "🥚",
  Fish: "🐟",
  Soy: "🌱",
  None: "✅ no allergens",
};

const categories = ['All', 'Breakfast', 'Dinner', 'Dessert', 'Drinks'];
const allergyOptions = ['Gluten', 'Dairy', 'Nuts'];

const MenuScreen = ({ user }) => {
  const [menuItems, setMenuItems] = useState([]);
  const [userAllergies, setUserAllergies] = useState(user?.allergies?.split(',') || []);
  const [glutenFreeMode, setGlutenFreeMode] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [theme, setTheme] = useState('light');
  const [visibleSignId, setVisibleSignId] = useState(null);
  const navigation = useNavigation();


  useEffect(() => {
    fetch('http://192.168.1.42:5050/menu')
      .then((res) => res.json())
      .then((data) => setMenuItems(data))
      .catch((err) => console.error('Error loading menu:', err));
  }, []);

  const filteredItems = menuItems.filter(
    (item) =>
      (!glutenFreeMode || !item.allergens?.includes('Gluten')) &&
      (selectedCategory === 'All' || item.category === selectedCategory) &&
      !userAllergies.some((allergy) => item.allergens?.includes(allergy))
  );

  const speakAllItems = () => {
    Speech.stop();
    const allText = filteredItems
      .map(
        (item) =>
          `${item.name}. ${item.description}. Allergens: ${(item.allergens || []).join(', ')}.`
      )
      .join(' ');
    Speech.speak(allText);
  };

  const saveAllergies = async () => {
    try {
      const res = await fetch(
        `http://192.168.1.42:5050/users/${user.user_id}/allergies`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ allergies: userAllergies }),
        }
      );
      const result = await res.json();
      Alert.alert('Preferences Saved', result.message);
    } catch (err) {
      Alert.alert('Error', 'Failed to save allergies');
    }
  };

  const handleLogout = () => {
    Alert.alert('Logged Out', 'Come back soon!');
    navigation.replace('Login'); 
  }

  const toggleAllergy = (allergy) => {
    setUserAllergies(prev => 
      prev.includes(allergy) 
        ? prev.filter(a => a !== allergy) 
        : [...prev, allergy]
    );
  };

  return (
    <SafeAreaView style={[styles.container, themeStyles[theme].container]}>
      {/* Header Section */}
      <LinearGradient
        colors={themeStyles[theme].headerGradient}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <Text style={[styles.greeting, themeStyles[theme].text]}>
            Welcome back, {user?.username || user?.email || 'Guest'} 👋
          </Text>
          
          <View style={styles.headerControls}>
            <View style={styles.themeSwitcher}>
              {['light', 'dark', 'yellow'].map((t) => (
                <TouchableOpacity
                  key={t}
                  onPress={() => setTheme(t)}
                  style={[
                    styles.themeButton,
                    theme === t && styles.themeButtonActive,
                    themeStyles[t].themeButton
                  ]}
                >
                  <Text style={themeStyles[t].themeButtonText}>
                    {t === 'light' ? '⚪' : t === 'dark' ? '🌑' : '🟡'}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            
            <TouchableOpacity 
              onPress={handleLogout} 
              style={styles.logoutButton}
            >
              <Text style={styles.logoutText}>🚪 Logout</Text>
            </TouchableOpacity>
          </View>
        </View>
      </LinearGradient>

      {/* Filters Section */}
      <View style={[styles.filtersContainer, themeStyles[theme].filtersContainer]}>
        {/* Category Filter */}
        <Text style={[styles.sectionTitle, themeStyles[theme].text]}>Categories</Text>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryContainer}
        >
          {categories.map((cat) => (
            <TouchableOpacity
            key={cat}
            onPress={() => setSelectedCategory(cat)}
            accessible={true}
            accessibilityLabel={`Category: ${cat}`}
            accessibilityRole="button"
            importantForAccessibility="yes"
            focusable={true}
            style={[
              styles.categoryButton,
              themeStyles[theme].categoryButton,
              selectedCategory === cat && styles.categorySelected
            ]}
          >
          
          <Text style={[
          styles.categoryText,
          themeStyles[theme].categoryText,
          selectedCategory === cat && styles.categoryTextSelected
        ]}>
          {cat}
        </Text>

          </TouchableOpacity>
          
          ))}
        </ScrollView>

        {/* Allergy Filter */}
        <Text style={[styles.sectionTitle, themeStyles[theme].text]}>Dietary Preferences</Text>
        <View style={styles.allergyContainer}>
          {allergyOptions.map((allergy) => (
            <TouchableOpacity
              key={allergy}
              onPress={() => toggleAllergy(allergy)}
              accessible={true}
              accessibilityLabel={`Toggle allergy filter for ${allergy}`}
              accessibilityRole="button"
              importantForAccessibility="yes"
              focusable={true}
              style={[
                styles.allergyButton,
                themeStyles[theme].allergyButton,
                userAllergies.includes(allergy) && styles.allergySelected
              ]}
              
            >
              <Text style={[
                styles.allergyText,
                userAllergies.includes(allergy) && styles.allergyTextSelected,
                themeStyles[theme].allergyText
              ]}>
                {allergenIcons[allergy]} {allergy}
              </Text>
            </TouchableOpacity>
          ))}
          <TouchableOpacity 
            onPress={saveAllergies}
            accessible={true}
            accessibilityLabel="Save allergy preferences"
            accessibilityRole="button"
            importantForAccessibility="yes"
            focusable={true}
            style={[styles.saveButton, themeStyles[theme].saveButton]}
          >
            <Text style={styles.saveButtonText}>💾 Save Preferences</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Menu Items */}
      <ScrollView 
        contentContainerStyle={styles.menuContainer}
        showsVerticalScrollIndicator={false}
      >
        {filteredItems.length > 0 ? (
          filteredItems.map((item) => (
            <View 
              key={item.id} 
              style={[styles.card, themeStyles[theme].card]}
            >
              <Image 
                source={imageMapping[item.image]} 
                style={styles.cardImage} 
                resizeMode="cover"
              />
              
              <View style={styles.cardContent}>
                <View style={styles.cardHeader}>
                  <Text style={[styles.cardTitle, themeStyles[theme].text]}>
                    {item.name}
                  </Text>
                  <View style={styles.allergenIcons}>
                    {(item.allergens || []).map((allergen, index) => (
                      <Text 
                        key={index} 
                        style={styles.allergenIcon}
                      >
                        {allergenIcons[allergen] || '⚠️'}
                      </Text>
                    ))}
                  </View>
                </View>
                
                <Text style={[styles.cardDescription, themeStyles[theme].secondaryText]}>
                  {item.description}
                </Text>
                
                <View style={styles.cardActions}>
                  <TouchableOpacity
                    onPress={() => {
                      Speech.stop();
                      const text = `${item.name}. ${item.description}. Allergens: ${(item.allergens || []).join(', ')}`;
                      Speech.speak(text);
                    }}
                    accessible={true}
                    accessibilityLabel={`Read item description for ${item.name}`}
                    accessibilityRole="button"
                    importantForAccessibility="yes"
                    focusable={true}
                    style={[styles.actionButton, styles.readButton]}
                  >
                    <Text style={styles.actionButtonText}>🔊 Read</Text>
                  </TouchableOpacity>

                  {item.signVideo && (
                    <TouchableOpacity
                      onPress={() => setVisibleSignId(visibleSignId === item.id ? null : item.id)}
                      accessible={true}
                      accessibilityLabel={`Show sign language video for ${item.name}`}
                      accessibilityRole="button"
                      importantForAccessibility="yes"
                      focusable={true}
                      style={[styles.actionButton, styles.signButton]}
                    >
                      <Text style={styles.actionButtonText}>✋ Sign</Text>
                    </TouchableOpacity>
                  )}
                </View>

                {visibleSignId === item.id && item.signVideo && (
                  <Video
                    source={{ uri: item.signVideo }}
                    useNativeControls
                    resizeMode="contain"
                    style={styles.videoPlayer}
                  />
                )}
              </View>
            </View>
          ))
        ) : (
          <View style={styles.emptyState}>
            <Text style={[styles.emptyText, themeStyles[theme].text]}>
              No items match your current filters
            </Text>
            <TouchableOpacity
              onPress={() => {
                setSelectedCategory('All');
                setUserAllergies([]);
              }}
              style={styles.resetButton}
            >
              <Text style={styles.resetButtonText}>Reset Filters</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>

      {/* Floating Action Buttons */}
      <View style={styles.floatingActions}>
        <TouchableOpacity 
          onPress={speakAllItems} 
          accessible={true}
          accessibilityLabel="Speak all menu items"
          accessibilityRole="button"
          importantForAccessibility="yes"
          focusable={true}
          style={[styles.floatingButton, styles.speakButton]}
        >
          <Text style={styles.floatingButtonText}>🔊 Speak All</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          onPress={() => Speech.stop()} 
          accessible={true}
          accessibilityLabel="Stop speaking"
          accessibilityRole="button"
          importantForAccessibility="yes"
          focusable={true}
          style={[styles.floatingButton, styles.stopButton]}
        >
          <Text style={styles.floatingButtonText}>🛑 Stop</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

// Theme Styles
const themeStyles = {
  light: {
    container: {
      backgroundColor: '#f8f9fa',
    },
    headerGradient: ['#4b6cb7', '#182848'],
    text: {
      color: '#000000',
    },
    secondaryText: {
      color: '#000000',
    },
    card: {
      backgroundColor: '#ffffff',
      shadowColor: '#000',
      shadowOpacity: 0.1,
      shadowRadius: 6,
      shadowOffset: { width: 0, height: 2 },
      elevation: 3,
    },
    categoryButton: {
      backgroundColor: '#e9ecef',
    },
    categoryText: {
      color: '#495057',
    },
    allergyButton: {
      backgroundColor: '#e9ecef',
    },
    allergyText: {
      color: '#495057',
    },
    saveButton: {
      backgroundColor: '#28a745',
    },
    themeButton: {
      backgroundColor: '#ffffff',
    },
    themeButtonText: {
      color: '#000000',
    },
    filtersContainer: {
      backgroundColor: '#ffffff',
    },
  },
  dark: {
    container: {
      backgroundColor: '#121212',
    },
    headerGradient: ['#0f2027', '#203a43', '#2c5364'],
    text: {
      color: '#f8f9fa',
    },
    secondaryText: {
      color: '#adb5bd',
    },
    card: {
      backgroundColor: '#1e1e1e',
      shadowColor: '#000',
      shadowOpacity: 0.3,
      shadowRadius: 6,
      shadowOffset: { width: 0, height: 2 },
      elevation: 3,
    },
    categoryButton: {
      backgroundColor: '#2d2d2d',
    },
    categoryText: {
      color: '#dee2e6',
    },
    allergyButton: {
      backgroundColor: '#2d2d2d',
    },
    allergyText: {
      color: '#dee2e6',
    },
    saveButton: {
      backgroundColor: '#218838',
    },
    themeButton: {
      backgroundColor: '#333333',
    },
    themeButtonText: {
      color: '#ffffff',
    },
    filtersContainer: {
      backgroundColor: '#1e1e1e',
    },
  },
  yellow: {
    container: {
      backgroundColor: '#fff9e6',
    },
    headerGradient: ['#ffd700', '#ffcc00'],
    text: {
      color: '#343a40',
    },
    secondaryText: {
      color: '#6c757d',
    },
    card: {
      backgroundColor: '#fffef2',
      shadowColor: '#ffd700',
      shadowOpacity: 0.2,
      shadowRadius: 6,
      shadowOffset: { width: 0, height: 2 },
      elevation: 3,
    },
    categoryButton: {
      backgroundColor: '#fff3cd',
    },
    categoryText: {
      color: '#856404',
    },
    allergyButton: {
      backgroundColor: '#fff3cd',
    },
    allergyText: {
      color: '#856404',
    },
    saveButton: {
      backgroundColor: '#ffc107',
    },
    themeButton: {
      backgroundColor: '#ffeb3b',
    },
    themeButtonText: {
      color: '#000000',
    },
    filtersContainer: {
      backgroundColor: '#fffef2',
    },
  },
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingVertical: 20,
    paddingHorizontal: 16,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  greeting: {
    fontSize: 20,
    fontWeight: '600',
    color: '#fff',
    flex: 1,
  },
  headerControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  themeSwitcher: {
    flexDirection: 'row',
    borderRadius: 20,
    overflow: 'hidden',
    marginRight: 10,
  },
  themeButton: {
    padding: 8,
  },
  themeButtonActive: {
    backgroundColor: 'rgba(255,255,255,0.3)',
  },
  logoutButton: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  logoutText: {
    color: '#fff',
    fontSize: 14,
  },
  filtersContainer: {
    padding: 16,
    margin: 16,
    borderRadius: 12,
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
  },
  categoryContainer: {
    paddingBottom: 10,
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
  },
  categorySelected: {
    backgroundColor: '#4b6cb7',  
  },
  categoryTextSelected: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
  
  categoryText: {
    fontSize: 14,
    fontWeight: '500',
  },
  categoryTextSelected: {
    color: '#fff',
  },
  allergyContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 8,
  },
  allergyButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
  },
  allergySelected: {
    backgroundColor: '#4b6cb7',
  },
  allergyText: {
    fontSize: 14,
  },
  allergyTextSelected: {
    color: '#fff',
  },
  
  saveButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginLeft: 'auto',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
  menuContainer: {
    paddingHorizontal: 16,
    paddingBottom: 100,
  },
  card: {
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 16,
  },
  cardImage: {
    width: '100%',
    height: undefined,
    aspectRatio: 2.0, 
    resizeMode: 'cover',
  },
  cardContent: {
    padding: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '700',
    flex: 1,
  },
  allergenIcons: {
    flexDirection: 'row',
    gap: 4,
  },
  allergenIcon: {
    fontSize: 26,
  },
  cardDescription: {
    fontSize: 26,
    lineHeight: 26,
    marginBottom: 12,
  },
  cardActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    flex: 1,
    alignItems: 'center',
  },
  readButton: {
    backgroundColor: '#4b6cb7',
    paddingVertical: 14, 
    paddingHorizontal: 20, 
    borderRadius: 10, 
  },
  
  signButton: {
    backgroundColor: '#28a745',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  
  actionButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
  videoPlayer: {
    width: '100%',
    height: 200,
    marginTop: 12,
    borderRadius: 8,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 16,
  },
  resetButton: {
    backgroundColor: '#4b6cb7',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  resetButtonText: {
    color: '#fff',
    fontWeight: '500',
  },
  floatingActions: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    flexDirection: 'column',
    gap: 10,
  },
  floatingButton: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  speakButton: {
    backgroundColor: '#4b6cb7',
  },
  stopButton: {
    backgroundColor: '#dc3545',
  },
  floatingButtonText: {
    color: '#fff',
    fontWeight: '500',
    fontSize: 14,
  },
});

export default MenuScreen;