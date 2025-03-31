import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import ProgressBarCustom from "./progressbar";
import { useRouter } from "expo-router";
import { useFormData } from './FormDataProvider'; // Assuming useFormData is available for managing form data
import AsyncStorage from "@react-native-async-storage/async-storage"; // To handle AsyncStorage

const ThirdSelectionScreen = () => {
  const [selectedOption3, setSelectedOption3] = useState<"Yes" | "No" | null>(null);
  const [selectedOption4, setSelectedOption4] = useState<"Yes" | "No" | null>(null);
  const router = useRouter();
  const { formData, updateFormData } = useFormData(); // Access formData and updateFormData from the provider

  // Function to handle option selection and update form data
  const handleSelection = (option: "Yes" | "No", type: string) => {
    if (type === "swelling") {
      setSelectedOption3(option);
      updateFormData({ swelling: option }); // Update formData with swelling data
    } else if (type === "diabetes") {
      setSelectedOption4(option);
      updateFormData({ diabetes: option }); // Update formData with diabetes data
    }
  };

  // Function to send form data to the backend
  const sendDataToBackend = async () => {
    try {
      // Retrieve JWT token from AsyncStorage
      const token = await AsyncStorage.getItem("access_token");
      
      if (!token) {
        console.error("JWT token is missing");
        return;
      }

      console.log(formData);

      // Make sure the form data is complete
      const isFormValid = Object.values(formData).every(value => value !== null);
      if (!isFormValid) {
        console.log("Some form values are missing!");
        return;
      }

      // Send form data to backend
      const response = await fetch("http://192.168.1.7:5000/assessments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Attach JWT token in Authorization header
        },
        body: JSON.stringify(formData), // Send form data
      });

      const responseData = await response.json();
      if (response.ok) {
        console.log("Form submitted successfully:", responseData);
        console.log("Predicted risk level: ",responseData.predicted_risk_level);
        // You can navigate to the next screen or show success message
        router.push("../(main)/home"); // Change to your desired route
      } else {
        console.error("Error submitting form:", responseData);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <View style={styles.container}>
      {/* Progress Bar */}
      <ProgressBarCustom progress={12 / 12} />

      {/* Swelling Question */}
      <Text style={styles.title}>Have you noticed swelling in your legs, feet, or hands?</Text>
      <View style={styles.genderContainer}>
        <TouchableOpacity
          style={[styles.card, selectedOption3 === "Yes" && styles.selectedCard]}
          onPress={() => handleSelection("Yes", "swelling")}
        >
          <FontAwesome5 name="thumbs-up" size={24} color="#555" />
          <Text style={styles.genderText}>Yes</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.card, selectedOption3 === "No" && styles.selectedCard]}
          onPress={() => handleSelection("No", "swelling")}
        >
          <FontAwesome5 name="thumbs-down" size={24} color="#555" />
          <Text style={styles.genderText}>No</Text>
        </TouchableOpacity>
      </View>

      <View style={{ height: 30 }}></View>

      {/* Diabetes Question */}
      <Text style={styles.title}>Do you have diabetes?</Text>
      <View style={styles.genderContainer}>
        <TouchableOpacity
          style={[styles.card, selectedOption4 === "Yes" && styles.selectedCard]}
          onPress={() => handleSelection("Yes", "diabetes")}
        >
          <FontAwesome5 name="thumbs-up" size={24} color="#555" />
          <Text style={styles.genderText}>Yes</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.card, selectedOption4 === "No" && styles.selectedCard]}
          onPress={() => handleSelection("No", "diabetes")}
        >
          <FontAwesome5 name="thumbs-down" size={24} color="#555" />
          <Text style={styles.genderText}>No</Text>
        </TouchableOpacity>
      </View>

      {/* Continue Button */}
      <TouchableOpacity style={styles.continueButton} onPress={sendDataToBackend}>
        <Text style={styles.continueText}>Continue →</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", backgroundColor: "#fff", paddingHorizontal: 20, paddingVertical: 40, justifyContent: "space-around" },
  title: { fontSize: 26, fontWeight: "bold", textAlign: "center", marginVertical: 10 },
  genderContainer: { flexDirection: "row", justifyContent: "space-between", width: "100%" },
  card: { width: "45%", backgroundColor: "#f7f7f7", borderRadius: 12, padding: 20, alignItems: "center", borderWidth: 2, borderColor: "transparent" },
  selectedCard: { borderColor: "#00A896", backgroundColor: "#E0F7F5" },
  genderText: { fontSize: 18, fontWeight: "bold", marginTop: 10 },
  continueButton: { marginTop: 20, backgroundColor: "#0098A5", padding: 15, borderRadius: 30, width: "80%", alignItems: "center" },
  continueText: { color: "#fff", fontSize: 18, fontWeight: "bold" },
});

export default ThirdSelectionScreen;
