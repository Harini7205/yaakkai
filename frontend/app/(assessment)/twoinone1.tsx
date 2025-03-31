import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import ProgressBarCustom from "./progressbar";
import { useRouter } from "expo-router";
import { useFormData } from './FormDataProvider'; // Assuming useFormData is available for managing form data

const FirstSelectionScreen = () => {
  const { formData, updateFormData } = useFormData();
  const [selectedOption1, setSelectedOption] = useState<"Yes" | "No" | null>(null);
  const [selectedOption2, setSelectedOption2] = useState<"Yes" | "No" | null>(null);
  const router = useRouter();
   // Access updateFormData from the provider

  const handleSelection = (option: "Yes" | "No", type: string) => {
    if (type === "chest_pain") {
      setSelectedOption(option);
      console.log(option,selectedOption1);
      updateFormData({ chest_pain: option }); // Update formData with chest_pain
    } else if (type === "shortness_of_breath") {
      setSelectedOption2(option);
      updateFormData({ shortness_of_breath: option }); // Update formData with shortness_of_breath
    }
  };

  useEffect(()=>{
    console.log(selectedOption1);
    console.log(selectedOption2);
    console.log(formData.chest_pain);
    console.log(formData.shortness_of_breath);
  })

  return (
    <View style={styles.container}>
      {/* Progress Bar */}
      <ProgressBarCustom progress={10 / 12} />

      {/* Chest Pain Question */}
      <Text style={styles.title}>Have you experienced chest pain?</Text>
      <View style={styles.genderContainer}>
        <TouchableOpacity
          style={[styles.card, selectedOption1 === "Yes" && styles.selectedCard]}
          onPress={() => handleSelection("Yes", "chest_pain")}
        >
          <FontAwesome5 name="thumbs-up" size={24} color="#555" />
          <Text style={styles.genderText}>Yes</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.card, selectedOption1 === "No" && styles.selectedCard]}
          onPress={() => handleSelection("No", "chest_pain")}
        >
          <FontAwesome5 name="thumbs-down" size={24} color="#555" />
          <Text style={styles.genderText}>No</Text>
        </TouchableOpacity>
      </View>

      <View style={{ height: 30 }}></View>

      {/* Shortness of Breath Question */}
      <Text style={styles.title}>Do you often experience shortness of breath?</Text>
      <View style={styles.genderContainer}>
        <TouchableOpacity
          style={[styles.card, selectedOption2 === "Yes" && styles.selectedCard]}
          onPress={() => handleSelection("Yes", "shortness_of_breath")}
        >
          <FontAwesome5 name="thumbs-up" size={24} color="#555" />
          <Text style={styles.genderText}>Yes</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.card, selectedOption2 === "No" && styles.selectedCard]}
          onPress={() => handleSelection("No", "shortness_of_breath")}
        >
          <FontAwesome5 name="thumbs-down" size={24} color="#555" />
          <Text style={styles.genderText}>No</Text>
        </TouchableOpacity>
      </View>

      {/* Continue Button */}
      <TouchableOpacity style={styles.continueButton} onPress={() => router.push("../twoinone2")}>
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

export default FirstSelectionScreen;
