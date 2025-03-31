import React, { useState } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity, Animated } from "react-native";
import { GestureHandlerRootView, PanGestureHandler, PanGestureHandlerGestureEvent } from "react-native-gesture-handler";
import { useRouter } from "expo-router";
import { FontAwesome5 } from "@expo/vector-icons";

const WelcomeScreen = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [translateX] = useState(new Animated.Value(0));
  const router = useRouter();

  const handleGesture = (event: PanGestureHandlerGestureEvent) => {
    if (event.nativeEvent.translationX > 150) {
      router.push("./agequestion");
    }
    Animated.spring(translateX, {
      toValue: 0,
      useNativeDriver: true,
    }).start();
  };

  return (
    <GestureHandlerRootView style={[styles.container, { backgroundColor: darkMode ? "#121212" : "#FDFDFD" }]}> 
      <TouchableOpacity onPress={() => setDarkMode(!darkMode)} style={styles.toggleButton}>
        <FontAwesome5 name={darkMode ? "moon" : "sun"} size={24} color="#009DA5" solid />
      </TouchableOpacity>

      <Image source={darkMode ? require("@assets/images/yaakkai-splash.png") : require("@assets/images/yaakkai-logo-dark.png")} style={styles.logo} />
      <Text style={[styles.title, { color: darkMode ? "#fff" : "#333" }]}>Welcome to Yaakkai! 🎉</Text>
      <Text style={[styles.subtitle, { color: darkMode ? "#bbb" : "#555" }]}>Gain insights into lifestyle factors affecting cardiovascular health and assess risk levels using our ML model. Available in Tamil for local users.</Text>
      <Text style={[styles.subtitle, { color: darkMode ? "#bbb" : "#555" }]}>Developed by 5 students from PSG College of Technology as part of coursework.</Text>
      
      <View style={styles.contributorBox}>
        <Image source={require("@assets/images/psg-logo.png")} style={styles.psgLogo} />
        <Text style={styles.contributorsTitle}>Contributors:</Text>
        <Text style={styles.contributorsList}>Harini M{"\n"}Shreenithi C{"\n"}Sneha Rajesh{"\n"}Sri Sai Varshini B{"\n"}V Pranaya</Text>
      </View>
      
      <PanGestureHandler onGestureEvent={handleGesture} onHandlerStateChange={handleGesture}>
        <View style={styles.slideButton}>
          <Animated.View style={[styles.slider, { transform: [{ translateX }] }]}>
            <Text style={styles.sliderText}>{'>'}</Text>
          </Animated.View>
          <Text style={styles.slideText}>Slide to Start</Text>
        </View>
      </PanGestureHandler>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  toggleButton: {
    position: "absolute",
    top: 50,
    right: 20,
  },
  logo: {
    width: 160,
    height: 70,
    resizeMode: "contain",
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    textAlign: "center",
    marginTop: 10,
    paddingHorizontal: 20,
    lineHeight: 22,
  },
  contributorBox: {
    backgroundColor: "#EAEAEA",
    padding: 18,
    borderRadius: 12,
    marginTop: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
    width: 300,
  },
  psgLogo: {
    width: 150,
    height: 200,
    marginBottom: 10,
  },
  contributorsTitle: {
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 5,
  },
  contributorsList: {
    textAlign: "center",
    fontSize: 14,
  },
  slideButton: {
    width: 300,
    height: 60,
    borderRadius: 30,
    marginTop: 30,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#009DA5",
    position: "relative",
    overflow: "hidden",
  },
  slider: {
    position: "absolute",
    left:0,
    width: 60,
    height: 60,
    backgroundColor: "#fff",
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    elevation: 3,
  },
  sliderText: {
    fontSize: 30,
    color: "#009DA5",
    fontWeight: "bold",
    alignItems: "center",
  },
  slideText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
  },
});

export default WelcomeScreen;
