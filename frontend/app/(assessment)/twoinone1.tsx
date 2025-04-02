import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Switch, TouchableOpacity, ScrollView } from "react-native";
import ProgressBarCustom from "./progressbar";
import { useRouter } from "expo-router";
import { useFormData } from "./FormDataProvider";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { BACKEND_URL } from "../config";

const FirstSelectionScreen = () => {
  const { formData, updateFormData } = useFormData();
  const [chestPain, setChestPain] = useState(false);
  const [shortnessOfBreath, setShortnessOfBreath] = useState(false);
  const [dizziness, setDizziness] = useState(false);
  const [swelling, setSwelling] = useState(false);
  const [diabetes, setDiabetes] = useState(false);
  const [irregularHeartbeat, setIrregularHeartbeat] = useState(false);
  const router = useRouter();

  const handleToggle = (value: boolean, type: string) => {
    updateFormData({ [type]: value ? "Yes" : "No" });
    if (type === "chest_pain") setChestPain(value);
    else if (type === "shortness_of_breath") setShortnessOfBreath(value);
    else if (type === "dizziness") setDizziness(value);
    else if (type === "swelling") setSwelling(value);
    else if (type === "diabetes") setDiabetes(value);
    else if (type === "irregular_heartbeat") setIrregularHeartbeat(value);
  };

  const sendDataToBackend = async () => {
    try {
      const token = await AsyncStorage.getItem("access_token");
      if (!token) {
        console.error("JWT token is missing");
        return;
      }
      console.log(formData);

      const isFormValid = Object.values(formData).every(value => value !== null);
      if (!isFormValid) {
        console.log("Some form values are missing!");
        return;
      }

      const response = await fetch(`${BACKEND_URL}/assessments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const responseData = await response.json();
      if (response.ok) {
        console.log("Form submitted successfully:", responseData);
        router.push("../(main)/result");
      } else {
        console.error("Error submitting form:", responseData);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <ProgressBarCustom progress={12 / 12} />
        {[
          { label: "Have you experienced chest pain?", type: "chest_pain", value: chestPain },
          { label: "Do you often experience shortness of breath?", type: "shortness_of_breath", value: shortnessOfBreath },
          { label: "Have you felt dizzy or light-headed in the last month?", type: "dizziness", value: dizziness },
          { label: "Have you noticed swelling in your legs, feet, or hands?", type: "swelling", value: swelling },
          { label: "Do you have diabetes?", type: "diabetes", value: diabetes },
          { label: "Do you often experience irregular heartbeat or palpitations?", type: "irregular_heartbeat", value: irregularHeartbeat }
        ].map(({ label, type, value }) => (
          <View key={type} style={styles.questionContainer}>
            <Text style={styles.title}>{label}</Text>
            <View style={styles.switchContainer}>
              <Text style={styles.switchLabel}>{value ? "Yes" : "No"}</Text>
              <Switch
                trackColor={{ false: "#d3d3d3", true: "#00A896" }}
                thumbColor={value ? "#ffffff" : "#ffffff"}
                ios_backgroundColor="#d3d3d3"
                onValueChange={(newValue) => handleToggle(newValue, type)}
                value={value}
              />
            </View>
          </View>
        ))}

        <TouchableOpacity style={styles.continueButton} onPress={sendDataToBackend}>
          <Text style={styles.continueText}>Continue →</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: { flexGrow: 1, },
  container: { flex: 1, alignItems: "center", backgroundColor: "#fff", paddingHorizontal: 20,paddingVertical:30 },
  title: { fontSize: 20, fontWeight: "bold", textAlign: "center", marginBottom: 10 },
  questionContainer: { width: "100%", marginVertical: 15, paddingHorizontal: 10 },
  switchContainer: { flexDirection: "row", justifyContent: "center", alignItems: "center", marginTop: 5 },
  switchLabel: { fontSize: 16, fontWeight: "bold", marginRight: 10 },
  continueButton: { marginTop: 20, backgroundColor: "#0098A5", padding: 15, borderRadius: 30, width: "80%", alignItems: "center" },
  continueText: { color: "#fff", fontSize: 18, fontWeight: "bold" },
});

export default FirstSelectionScreen;