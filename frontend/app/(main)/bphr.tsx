import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, Alert } from "react-native";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ProgressBarCustom from "../(assessment)/progressbar";

const BloodPressureHeartRateScreen = () => {  
  const [systolic, setSystolic] = useState("");
  const [diastolic, setDiastolic] = useState("");
  const [heartRate, setHeartRate] = useState("");
  const [bpCategory, setBpCategory] = useState<string | null>(null);
  const router = useRouter();

  // Function to handle numeric input
  const handleSystolicChange = (text: string) => {
    if (/^\d*$/.test(text)) setSystolic(text);
  };

  const handleDiastolicChange = (text: string) => {
    if (/^\d*$/.test(text)) setDiastolic(text);
  };

  const handleHeartRateChange = (text: string) => {
    if (/^\d*$/.test(text)) setHeartRate(text);
  };

  // Classify Blood Pressure based on the entered values
  const classifyBloodPressure = () => {
    const systolicValue = parseInt(systolic);
    const diastolicValue = parseInt(diastolic);

    if (systolicValue && diastolicValue) {
      if (systolicValue <= 120 && diastolicValue <= 80) {
        setBpCategory("Normal");
      } else if (systolicValue >= 120 && systolicValue <= 129 && diastolicValue < 80) {
        setBpCategory("Elevated");
      } else if (systolicValue >= 130 && systolicValue <= 139 || diastolicValue >= 80 && diastolicValue <= 89) {
        setBpCategory("High Blood Pressure (Stage 1)");
      } else if (systolicValue >= 140 || diastolicValue >= 90) {
        setBpCategory("High Blood Pressure (Stage 2)");
      } else {
        setBpCategory("Hypertensive Crisis (Consult your doctor immediately)");
      }
    }
  };

  useEffect(() => {
    classifyBloodPressure();
  }, [systolic, diastolic]);

  // Function to send data to the backend
  const sendToBackend = async () => {
    if (!systolic || !diastolic || !heartRate) {
      Alert.alert("Error", "Please enter valid blood pressure and heart rate values.");
      return;
    }

    const data = {
      systolic: parseInt(systolic),
      diastolic: parseInt(diastolic),
      heart_rate: parseInt(heartRate),
    };

    try {
      const token = await AsyncStorage.getItem("access_token");
      if (!token) {
        Alert.alert("Error", "You are not logged in.");
        return;
      }

      const response = await fetch("http://192.168.1.7:5000/update-bp-hr", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Failed to send data");
      }

      console.log("Data sent successfully");
      router.push("../(assessment)/smokequestion"); // Navigate to next screen only after success
    } catch (error) {
      console.error("Error sending data:", error);
      Alert.alert("Error", "Failed to send data. Please try again.");
    }
  };

  // Handle "Continue" button press
  const handleContinue = () => {
    sendToBackend();
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      
      <Text style={styles.question}>What's your blood pressure?</Text>
      <Text style={styles.subQuestion}>Enter your systolic (upper) and diastolic (lower) values:</Text>
      
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.inputBox}
          value={systolic}
          onChangeText={handleSystolicChange}
          placeholder="Systolic (mmHg)"
          keyboardType="numeric"
        />
        <TextInput
          style={styles.inputBox}
          value={diastolic}
          onChangeText={handleDiastolicChange}
          placeholder="Diastolic (mmHg)"
          keyboardType="numeric"
        />
      </View>

      <Text style={styles.question}>What's your heart rate?</Text>
      <TextInput
        style={styles.inputBox}
        value={heartRate}
        onChangeText={handleHeartRateChange}
        placeholder="Heart rate (bpm)"
        keyboardType="numeric"
      />

      <Text style={styles.instructionsTitle}>How to Measure Your Heart Rate:</Text>
      <Text style={styles.instructionsText}>
        1. Place your index and middle fingers on your wrist or neck to find your pulse.
        {"\n"}2. Count the number of beats in 15 seconds, then multiply by 4 to get your beats per minute (bpm).
        {"\n"}3. Alternatively, use a heart rate monitor (pulse oximeter) for more accuracy.
      </Text>

      {bpCategory && (
        <Text style={styles.bpCategoryText}>
          Your Blood Pressure Category: {bpCategory}
        </Text>
      )}

      <TouchableOpacity style={styles.continueButton} onPress={handleContinue}>
        <Text style={styles.continueText}>Continue →</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flexGrow: 1, alignItems: "center", backgroundColor: "#fff", paddingHorizontal: 40, paddingVertical: 40,  justifyContent:"center" },
  title: { fontSize: 26, fontWeight: "bold", textAlign: "center", marginVertical: 10 },
  question: { fontSize: 30, fontWeight: "bold", marginTop: 30, textAlign: "center" },
  subQuestion: { fontSize: 20, fontWeight: "normal", marginTop: 5, color: "#555", textAlign: "center" },
  inputContainer: { flexDirection: "row", justifyContent: "space-between", width: "100%" },
  inputBox: { width: "49%", height: 80, fontSize: 20, textAlign: "center", borderBottomWidth: 2, borderColor: "#0098A5", marginVertical: 10 },
  instructionsTitle: { fontSize: 20, fontWeight: "bold", marginTop: 30, textAlign: "center" },
  instructionsText: { fontSize: 16, marginTop: 10, color: "#555", lineHeight: 24, textAlign: "center" },
  bpCategoryText: { fontSize: 24, fontWeight: "bold", color: "black", marginTop: 20, textAlign: "center" },
  continueButton: { marginTop: 20, backgroundColor: "#0098A5", padding: 15, borderRadius: 30, width: "80%", alignItems: "center" },
  continueText: { color: "#fff", fontSize: 18, fontWeight: "bold" },
});

export default BloodPressureHeartRateScreen;
