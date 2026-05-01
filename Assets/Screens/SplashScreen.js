import React, { useEffect } from 'react';  // ← FIXED: Added useEffect
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Platform,
  Image,
} from 'react-native';

const SplashScreen = ({ navigation }) => {
  const handleStartNow = () => {
    
    navigation.reset({
      index: 0,
      routes: [{ name: 'Login' }],
    });
  };
  
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor={Platform.OS === 'android' ? '#F0F2F5' : undefined}
      />

      <View style={styles.content}>
        
        <View style={styles.logoContainer}>
          <Image source={require('../Images/logo.png')} style={styles.logoImage} resizeMode="contain" />
        </View>

        <Text style={styles.appName}>CareConnect</Text>
        <Text style={styles.tagline}>speak.connect.belong.</Text>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.startButton}
          onPress={() => navigation.navigate('Login')}
          activeOpacity={0.85}
        >
          <Text style={styles.startButtonText}>Start Now</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F2F5',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 32,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoContainer: {
    width: 110,
    height: 110,
    borderRadius: 24,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 28,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 3,
  },
  logoImage: {
    width: 80,
    height: 80,
  },
  appName: {
    fontSize: 32,
    fontWeight: Platform.OS === 'ios' ? '800' : '700',
    color: '#1A1D2E',
    letterSpacing: -0.5,
    marginBottom: 8,
  },
  tagline: {
    fontSize: 16,
    color: '#6B7280',
    letterSpacing: 0.5,
  },
  buttonContainer: {
  alignItems: 'center',
  marginTop: 20, // Instead of gap: 20
  },
  startButton: {
    width: '100%',
    backgroundColor: '#1A73E8',
    paddingVertical: 18,
    borderRadius: 50,
    alignItems: 'center',
    shadowColor: '#1A73E8',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },
  startButtonText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
});

export default SplashScreen;