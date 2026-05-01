import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Image,
} from 'react-native';

const DashboardScreen = ({ navigation }) => {
  const [btnLabel, setBtnLabel] = useState('Start Conversation');

 const handleStartConversation = () => {
  setBtnLabel('Starting...');
  
  setTimeout(() => {
    setBtnLabel('Start Conversation');
    navigation.navigate('InputOutput'); // ← navigates after 1.5s
  }, 1500);
};

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      <View style={styles.container}>

        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Dashboard</Text>
          <View style={styles.heartIcon}>
            <Image source={require('../Images/logo.png')} style={styles.logoImage} resizeMode="contain" />
        </View>
        </View>

        {/* Avatar & Greeting */}
        <View style={styles.avatarSection}>
          <View style={styles.avatarWrapper}>
            <View style={styles.avatarCircle}>
              {/* Replace with <Image source={require('./assets/avatar.png')} style={styles.avatarImage} /> */}
              <Text style={styles.avatarPlaceholder}>👤</Text>
            </View>
            
          </View>
          <Text style={styles.greetingText}>Hello, Zaid Khan</Text>
        </View>

        {/* CTA Button */}
        <TouchableOpacity
          style={styles.ctaButton}
          onPress={handleStartConversation}
          
          activeOpacity={0.85}
        >
          <Text style={styles.ctaButtonText}>{btnLabel}</Text>
        </TouchableOpacity>

        {/* Info Cards */}
        <View style={styles.cardsRow}>
          {/* Daily Tip Card */}
          <View style={[styles.card, styles.tipCard]}>
            <View style={styles.cardLabelRow}>
              <Text style={styles.sparkle}>✦</Text>
              <Text style={styles.cardLabel}>DAILY TIP</Text>
            </View>
            <Text style={styles.tipText}>
              Enable dark mode in settings for better contrast during night hours.
            </Text>
          </View>

          {/* 24/7 Card */}
          <View style={[styles.card, styles.supportCard]}>
            <Text style={styles.supportNumber}>24/7</Text>
            <Text style={styles.supportText}>Support available</Text>
          </View>
        </View>

      </View>
    </SafeAreaView>
  );
};

const CARD_BG = '#d4f5e2';
const CARD_TEXT_DARK = '#1a7a4a';
const CARD_TEXT_LIGHT = '#1a5c38';

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    paddingHorizontal: 20,
    paddingTop: 16,
  },

  // Header
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
    marginTop:30
  },
  logoImage: {
    width: 40,
    height: 40,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#1a1a2e',
  },
  heartIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  heartEmoji: {
    fontSize: 20,
  },

  // Avatar
  avatarSection: {
    alignItems: 'center',
    marginBottom: 28,
  },
  avatarWrapper: {
    position: 'relative',
    marginBottom: 12,
  },
  avatarCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#f7c9a3',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#fff',
  },
  avatarPlaceholder: {
    fontSize: 40,
  },
  avatarImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  onlineDot: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#2ecc71',
    borderWidth: 2,
    borderColor: '#fff',
  },
  greetingText: {
    fontSize: 22,
    fontWeight: '800',
    color: '#1a1a2e',
  },

  // CTA Button
  ctaButton: {
    backgroundColor: '#3ab5e6',
    borderRadius: 18,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#3ab5e6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  ctaButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.3,
  },

  // Cards
  cardsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  card: {
    flex: 1,
    borderRadius: 20,
    padding: 16,
    backgroundColor: CARD_BG,
  },
  tipCard: {
    flex: 1.1,
  },
  supportCard: {
    justifyContent: 'center',
  },
  cardLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    gap: 4,
  },
  sparkle: {
    fontSize: 12,
    color: CARD_TEXT_DARK,
  },
  cardLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: CARD_TEXT_DARK,
    letterSpacing: 0.8,
  },
  tipText: {
    fontSize: 13,
    color: CARD_TEXT_LIGHT,
    lineHeight: 20,
  },
  supportNumber: {
    fontSize: 34,
    fontWeight: '800',
    color: CARD_TEXT_DARK,
    marginBottom: 4,
  },
  supportText: {
    fontSize: 13,
    color: CARD_TEXT_LIGHT,
  },
});

export default DashboardScreen;
