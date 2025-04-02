import React, { useEffect, useState } from "react";
import { View, ScrollView, Text, ActivityIndicator, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { BACKEND_URL } from "../config";
import SemiCircleGauge from "./semicirclegauge"; 
import BottomNavBar from "./bottomnavigationbar";
import Linechart from "./linechart";

const ResultPage = () => {
  const [reasons, setReasons] = useState([]);
  const [tips, setTips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [riskLevel, setRiskLevel] = useState<"Moderate" | "Low" | "High" | "Very High" | null>(null); 

  useEffect(() => {
    const fetchAnalysis = async () => {
      try {
        const token = await AsyncStorage.getItem("access_token");
        if (!token) {
          console.error("JWT Token not found");
          return;
        }

        const response = await fetch(`${BACKEND_URL}/analyze-health`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();
        if (response.ok) {
          setReasons(data.reasons || []);
          setTips(data.tips || []);
          setRiskLevel(data.risk_level);
        } else {
          console.error("Error fetching analysis:", data.message);
        }
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalysis();
  }, []);

  return (
    <View style={styles.screenContainer}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.container}>
          <Text style={styles.header}>Assessment Result</Text>
          
          {loading ? (
            <ActivityIndicator size="large" color="#333" />
          ) : (
            <>
              <SemiCircleGauge riskLevel={riskLevel || "Low"} />
              <Text style={styles.riskText}>{riskLevel} Risk</Text>
              <Text style={styles.summaryText}>
                {riskLevel === "Low"
                  ? "Great job! Keep up the healthy habits!"
                  : riskLevel === "Moderate"
                  ? "Your current cardiovascular risk is moderate, but small lifestyle changes can lower it further!"
                  : riskLevel === "High"
                  ? "Your risk level is high. Consider lifestyle improvements and seek medical advice."
                  : "Your cardiovascular risk is very high. Immediate lifestyle changes and professional medical consultation are strongly recommended!"}
              </Text>
              <View style={styles.reasonsContainer}>
                <Text style={styles.reasonsTitle}>Possible Reasons:</Text>
                {reasons.length > 0 ? (
                  reasons.map((reason, index) => (
                    <Text key={index} style={styles.reasonItem}>• {reason}</Text>
                  ))
                ) : (
                  <Text style={styles.reasonItem}>No specific reasons available.</Text>
                )}
              </View>
              <View style={styles.tipsContainer}>
                <Text style={styles.tipsTitle}>Health Tips:</Text>
                {tips.map((tip, index) => (
                  <View key={index} style={[
                    styles.tipItem,
                    index % 2 === 0 ? styles.tipLeft : styles.tipRight,
                  ]}>
                    <Text style={styles.tipText}>{index + 1}. {tip}</Text>
                  </View>
                ))}
              </View>
              <Linechart />
            </>
          )}
        </View>
      </ScrollView>
      <BottomNavBar />
    </View>
  );
};

export default ResultPage;

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 70,
  },
  container: {
    flex: 1,
    alignItems: "center",
    paddingTop: 50,
    backgroundColor: "#fff",
    paddingHorizontal: 40,
  },
  header: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 20,
  },
  riskText: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#333",
    marginVertical: 10,
  },
  summaryText: {
    fontSize: 18,
    textAlign: "center",
    marginBottom: 20,
    color: "#555",
  },
  reasonsContainer: {
    width: "85%",
    backgroundColor: "#FFF",
    padding: 15,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    marginBottom: 20,
  },
  reasonsTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 5,
  },
  reasonItem: {
    fontSize: 18,
    color: "#555",
  },
  tipsContainer: {
    width: "90%",
    marginBottom: 20,
  },
  tipsTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  tipItem: {
    padding: 15,
    borderRadius: 10,
    marginVertical: 5,
  },
  tipLeft: {
    backgroundColor: "#E3F2FD",
  },
  tipRight: {
    backgroundColor: "#C8E6C9",
  },
  tipText: {
    fontSize: 18,
    color: "#333",
  },
});
