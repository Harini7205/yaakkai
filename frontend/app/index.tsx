import React, { useEffect, useRef } from 'react';
import {  StyleSheet, Animated, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';

SplashScreen.preventAutoHideAsync(); // Prevent automatic hiding

const Index: React.FC = () => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const router = useRouter();

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 2000, useNativeDriver: true }), // Slower fade-in
      Animated.timing(scaleAnim, { toValue: 1, duration: 2000, useNativeDriver: true }), // Slower scaling
    ]).start(async () => {
      await SplashScreen.hideAsync(); // Hide splash after animation
    });
  }, []);

  const handlePress = () => {
    router.replace('./(auth)/langselection'); // Navigate when user taps
  };

  return (
    <TouchableOpacity style={styles.splashContainer} onPress={handlePress} activeOpacity={1}>
      <Animated.Image
        source={require('@assets/images/yaakkai-splash.png')}
        style={[styles.logo, { opacity: fadeAnim, transform: [{ scale: scaleAnim }] }]}
        onLoad={() => SplashScreen.hideAsync()} // Ensure splash hides after image loads
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  splashContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#009DA5' },
  logo: { width: '90%', height: 200, resizeMode: 'contain' },
});

export default Index;
