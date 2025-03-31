import React, { useState, useEffect } from "react";
import { View, Text, Image, TouchableOpacity, ScrollView, Linking, ActivityIndicator, Alert } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import TestScoreCard from "./testscorecard";
import HealthCards from "./healthstatus";
import BottomNavBar from "./bottomnavigationbar";
import AsyncStorage from "@react-native-async-storage/async-storage";

const HomePage = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [healthTip, setHealthTip] = useState("");
  const [youtubeResources, setYoutubeResources] = useState<{ url: string; thumbnail: string; title: string }[]>([]);
  const [loadingHealthTip, setLoadingHealthTip] = useState(true);
  const [loadingYouTube, setLoadingYouTube] = useState(true);
  const [loadingTestResult, setLoadingTestResult] = useState(true);

  // State variables for fetched test data
  const [testResult, setTestResult] = useState("N/A");
  const [testDate, setTestDate] = useState("N/A");
  const [bloodPressure, setBloodPressure] = useState("N/A");
  const [heartRate, setHeartRate] = useState("N/A");
  const [username, setUserName]= useState("N/A");

  useEffect(() => {
    fetchLatestTestResult();
    fetchHealthTip();
    fetchYouTubeResources();
  }, []);

  // Fetch latest test result from API
  const fetchLatestTestResult = async () => {
    try {
      const token = await AsyncStorage.getItem("access_token");
      if (!token) {
        Alert.alert("Error", "You are not logged in.");
        return;
      }
      const response = await fetch("http://192.168.1.7:5000/latest-test-result",{
        method:'GET',
        headers:{
          Authorization: `Bearer ${token}`,
        }
      });
      const data = await response.json();

      if (response.ok) {
        setTestResult(data.test_result || "N/A");
        setTestDate(data.test_taken_at || "N/A");
        setBloodPressure(data.bloodpressure || "N/A");
        setHeartRate(data.heartrate || "N/A");
        setUserName(data.username || "N/A");
      } else {
        console.error("Error fetching test result:", data.message);
      }
    } catch (error) {
      console.error("Error fetching test result:", error);
    } finally {
      setLoadingTestResult(false);
    }
  };

  const fetchHealthTip = () => {
    const tips = [
      "🥦 Eat fiber-rich foods like spinach and oats to lower bad cholesterol and stabilize blood pressure.",
      "🍎 Include Omega-3-rich foods like salmon and walnuts to prevent irregular heartbeats and lower triglycerides.",
      "🏃‍♂️ Regular exercise like walking or cycling strengthens the heart and improves circulation."
    ];
    setTimeout(() => {
      setHealthTip(tips[Math.floor(Math.random() * tips.length)]);
      setLoadingHealthTip(false);
    }, 1000);
  };

  const fetchYouTubeResources = async () => {
    try {
      const response = await fetch("http://192.168.1.7:5000/youtube-resources");
      const data = await response.json();
      setYoutubeResources(data.resources || []);
    } catch (error) {
      console.error("Error fetching YouTube resources:", error);
    } finally {
      setLoadingYouTube(false);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: darkMode ? "#121212" : "white"}}>
      <ScrollView 
        contentContainerStyle={{ flexGrow: 1, paddingHorizontal: 20, paddingVertical: 60 }} 
        keyboardShouldPersistTaps="handled"
      >
      {/* Header */}
      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
        <View>
          <Text style={{ fontSize: 22, fontWeight: "bold", color: darkMode ? "#fff" : "black" }}>Hello, {username}!</Text>
          <Text style={{ fontSize: 16, color: darkMode ? "#aaa" : "#333" }}>How are you doing?</Text>
        </View>
        <TouchableOpacity onPress={() => setDarkMode(!darkMode)}>
          <FontAwesome5 name={darkMode ? "moon" : "sun"} size={24} color="#009DA5" solid />
        </TouchableOpacity>
      </View>

      {/* Health Metrics Section */}
      <HealthCards isDarkMode={darkMode} bloodpressure={bloodPressure} heartrate={heartRate}/>

      {/* Test Result Section */}
      {loadingTestResult ? (
        <ActivityIndicator size="large" color="#009DA5" style={{ marginVertical: 20 }} />
      ) : (
        <TestScoreCard 
          testResult={
            ["Low", "Moderate", "High", "Very High"].includes(testResult) 
              ? (testResult as "Low" | "Moderate" | "High" | "Very High") 
              : "Low"
          } 
          testDate={testDate} 
        />
      )}

      {/* Health Tip Section */}
      <View style={{ backgroundColor: darkMode ? "#121212" : "#fff", padding: 15, borderRadius: 10, marginVertical: 15, borderWidth: 1, borderColor: darkMode ? "#fff" : "#333" }}>
        <Text style={{ fontSize: 16, fontWeight: "bold", marginBottom: 10, color: darkMode ? "#fff" : "#333" }}>Health Tip of the Day</Text>
        {loadingHealthTip ? (
          <ActivityIndicator size="small" color="#009DA5" />
        ) : (
          <Text style={{ color: darkMode ? "#fff" : "#333" }}>{healthTip}</Text>
        )}
      </View>

      {/* YouTube Resources Section */}
      <Text style={{ fontSize: 22, fontWeight: "bold", marginBottom: 10, color: darkMode ? "#fff" : "#333" }}>Related YouTube Resources</Text>
      {loadingYouTube ? (
        <ActivityIndicator size="large" color="#009DA5" style={{ marginVertical: 20 }} />
      ) : (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginVertical: 15, marginBottom:40 }}>
          {youtubeResources.map((video, index) => (
            <TouchableOpacity key={index} onPress={() => Linking.openURL(video.url)} style={{ marginRight: 15 }}>
              <Image source={{ uri: video.thumbnail }} style={{ width: 180, height: 100, borderRadius: 10 }} />
              <Text style={{ width: 180, fontSize: 12, textAlign: "center", marginTop: 5, color: darkMode ? "#fff" : "#333" }} numberOfLines={2}>{video.title}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}
      </ScrollView>

      {/* Bottom Navigation Bar */}
      <BottomNavBar />
    </View>
  );
};

export default HomePage;
