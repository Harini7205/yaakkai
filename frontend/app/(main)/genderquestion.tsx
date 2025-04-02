import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Alert } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {BACKEND_URL} from "../config";

const GenderSelectionScreen = () => {
  const [selectedGender, setSelectedGender] = useState<"Male" | "Female" | "Other" | null>(null);
  const [weight, setWeight] = useState( "70");
  const [height, setHeight] = useState("170");
  const [bmi, setBmi] = useState<number | null>(null);
  const [bmiCategory, setBmiCategory] = useState<string | null>(null);
  const router = useRouter();

  // Function to handle numeric input
  const handleWeightChange = (text: string) => {
    if (/^\d*$/.test(text)) {
      setWeight(text); // Update weight in formData
    }
  };

  const handleHeightChange = (text: string) => {
    if (/^\d*$/.test(text)) {
      setHeight(text);// Update height in formData
    }
  };

  // Calculate BMI and classify it whenever weight or height changes
  useEffect(() => {
    const weightNum = parseFloat(weight);
    const heightNum = parseFloat(height) / 100; // Convert cm to meters
    if (weightNum > 0 && heightNum > 0) {
      const bmiValue = weightNum / (heightNum * heightNum);
      setBmi(parseFloat(bmiValue.toFixed(2))); // Round to 2 decimal places // Update BMI in formData

      // Classify BMI
      if (bmiValue < 18.5) {
        setBmiCategory("Underweight");
      } else if (bmiValue >= 18.5 && bmiValue < 25) {
        setBmiCategory("Healthy weight");
      } else if (bmiValue >= 25 && bmiValue < 30) {
        setBmiCategory("Overweight");
      } else if (bmiValue >= 30 && bmiValue < 35) {
        setBmiCategory("Class 1 Obesity (Low Obesity)");
      } else if (bmiValue >= 35 && bmiValue < 40) {
        setBmiCategory("Class 2 Obesity (Moderate Obesity)");
      } else if (bmiValue >= 40) {
        setBmiCategory("Class 3 Obesity (Severe Obesity)");
      }
    } else {
      setBmi(null);
      setBmiCategory(null);
    }
  }, [weight, height]);

  // Send gender and BMI to backend
  // Function to send gender and BMI to backend
const sendToBackend = async () => {
  if (!selectedGender) {
    Alert.alert("Error", "Please select a gender.");
    return;
  }

  if (bmi === null) {
    Alert.alert("Error", "Please enter valid weight and height to calculate BMI.");
    return;
  }

  const data = {
    gender: selectedGender,
    bmi,
    height: parseFloat(height), // Ensure it's sent as a number
    weight: parseFloat(weight),
  };

  try {
    const token = await AsyncStorage.getItem("access_token"); // Retrieve JWT from storage
    if (!token) {
      Alert.alert("Error", "You are not logged in.");
      return;
    }

    const response = await fetch(`${BACKEND_URL}/gender-bmi`, {
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
    router.push("../bphr"); // Navigate to next screen only after success
  } catch (error) {
    console.error("Error sending data:", error);
    Alert.alert("Error", "Failed to send data. Please try again.");
  }
};

// Handle "Continue" button press
  const handleContinue = () => {
    sendToBackend();
  };


  // Update gender in formData when a gender is selected and send to backend
  const handleGenderSelection = (gender: "Male" | "Female" | "Other") => {
    setSelectedGender(gender);
  };

  return (
    <View style={styles.container}>

      {/* Title */}
      <Text style={styles.title}>What's your official gender?</Text>

      {/* Gender Selection */}
      <View style={styles.genderContainer}>
        <TouchableOpacity
          style={[styles.card, selectedGender === "Male" && styles.selectedCard]}
          onPress={() => handleGenderSelection("Male")}
        >
          <FontAwesome5 name="mars" size={24} color="#555" />
          <Text style={styles.genderText}>Male</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.card, selectedGender === "Female" && styles.selectedCard]}
          onPress={() => handleGenderSelection("Female")}
        >
          <FontAwesome5 name="venus" size={24} color="#555" />
          <Text style={styles.genderText}>Female</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.card, selectedGender === "Other" && styles.selectedCard]}
          onPress={() => handleGenderSelection("Other")}
        >
          <FontAwesome5 name="genderless" size={24} color="#555" />
          <Text style={styles.genderText}>Other</Text>
        </TouchableOpacity>
      </View>

      {/* Weight Selection */}
      <Text style={styles.question}>What's your weight (kg)?</Text>
      <TextInput
        style={styles.inputBox}
        value={weight}
        onChangeText={handleWeightChange}
        keyboardType="numeric"
      />

      {/* Height Selection */}
      <Text style={styles.question}>What's your height (cm)?</Text>
      <TextInput
        style={styles.inputBox}
        value={height}
        onChangeText={handleHeightChange}
        keyboardType="numeric"
      />

      {/* Display BMI */}
      {bmi !== null && (
        <>
          <Text style={styles.bmiText}>Your BMI: {bmi}</Text>
          <Text style={styles.bmiCategoryText}>Category: {bmiCategory}</Text>
        </>
      )}

      {/* Continue Button */}
      <TouchableOpacity style={styles.continueButton} onPress={() => {handleContinue(),router.push('../bphr')}}>
        <Text style={styles.continueText}>Continue →</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", backgroundColor: "#fff", paddingHorizontal: 20, paddingVertical: 40,  justifyContent:"center" },
  title: { fontSize: 26, fontWeight: "bold", textAlign: "center", marginVertical: 10 },
  genderContainer: { flexDirection: "row", justifyContent: "space-between", width: "100%" },
  card: { width: "30%", backgroundColor: "#f7f7f7", borderRadius: 12, padding: 20, alignItems: "center", borderWidth: 2, borderColor: "transparent" },
  selectedCard: { borderColor: "#00A896", backgroundColor: "#E0F7F5" },
  genderText: { fontSize: 18, fontWeight: "bold", marginTop: 10 },
  question: { fontSize: 22, fontWeight: "bold", marginTop: 30 },
  inputBox: { width: 100, height: 80, fontSize: 40, fontWeight: "bold", textAlign: "center", borderBottomWidth: 2, borderColor: "#0098A5", marginVertical: 10 },
  bmiText: { fontSize: 22, fontWeight: "bold", color: "black", marginVertical: 20 },
  bmiCategoryText: { fontSize: 18, fontWeight: "bold", color: "#009DA5", marginVertical: 10 },
  continueButton: { marginTop: 20, backgroundColor: "#0098A5", padding: 15, borderRadius: 30, width: "80%", alignItems: "center" },
  continueText: { color: "#fff", fontSize: 18, fontWeight: "bold" },
});

export default GenderSelectionScreen;
