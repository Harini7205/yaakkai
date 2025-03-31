import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import ProgressBarCustom from "./progressbar";
import { useRouter } from "expo-router";
import { useFormData } from './FormDataProvider'; // Assuming useFormData is available for managing form data

const SecondSelectionScreen = () => {
  const [selectedOption5, setSelectedOption5] = useState<"Yes" | "No" | null>(null);
  const [selectedOption6, setSelectedOption6] = useState<"Yes" | "No" | null>(null);
  const router = useRouter();
  const { updateFormData } = useFormData(); // Access updateFormData from the provider

  const handleSelection = (option: "Yes" | "No", type: string) => {
    if (type === "dizziness") {
      setSelectedOption5(option);
      updateFormData({ dizziness: option }); // Update formData with dizziness
    } else if (type === "irregular_heartbeat") {
      setSelectedOption6(option);
      updateFormData({ irregular_heartbeat: option }); // Update formData with irregular_heartbeat
    }
  };

  return (
    <View style={styles.container}>
      {/* Progress Bar */}
      <ProgressBarCustom progress={11 / 12} />

      {/* Dizziness Question */}
      <Text style={styles.title}>Have you felt dizzy or light headed in the last month?</Text>
      <View style={styles.genderContainer}>
        <TouchableOpacity
          style={[styles.card, selectedOption5 === "Yes" && styles.selectedCard]}
          onPress={() => handleSelection("Yes", "dizziness")}
        >
          <FontAwesome5 name="thumbs-up" size={24} color="#555" />
          <Text style={styles.genderText}>Yes</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.card, selectedOption5 === "No" && styles.selectedCard]}
          onPress={() => handleSelection("No", "dizziness")}
        >
          <FontAwesome5 name="thumbs-down" size={24} color="#555" />
          <Text style={styles.genderText}>No</Text>
        </TouchableOpacity>
      </View>

      <View style={{ height: 30 }}></View>

      {/* Irregular Heartbeat Question */}
      <Text style={styles.title}>Do you often experience irregular heartbeat or palpitations?</Text>
      <View style={styles.genderContainer}>
        <TouchableOpacity
          style={[styles.card, selectedOption6 === "Yes" && styles.selectedCard]}
          onPress={() => handleSelection("Yes", "irregular_heartbeat")}
        >
          <FontAwesome5 name="thumbs-up" size={24} color="#555" />
          <Text style={styles.genderText}>Yes</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.card, selectedOption6 === "No" && styles.selectedCard]}
          onPress={() => handleSelection("No", "irregular_heartbeat")}
        >
          <FontAwesome5 name="thumbs-down" size={24} color="#555" />
          <Text style={styles.genderText}>No</Text>
        </TouchableOpacity>
      </View>

      {/* Continue Button */}
      <TouchableOpacity style={styles.continueButton} onPress={() => router.push('../twoinone3')}>
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

export default SecondSelectionScreen;
