import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";
import WheelPickerExpo from "react-native-wheel-picker-expo";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {BACKEND_URL} from "../config";

const AgePickerScreen = () => {
  const router = useRouter();
  const [selectedAge, setSelectedAge] = useState(19);

  const updateAgeInBackend = async (age: number) => {
    try {
      const token = await AsyncStorage.getItem("access_token"); // Retrieve JWT from storage
      if (!token) {
        Alert.alert("Error", "You are not logged in.");
        return;
      }
      console.log(token);
      const response = await fetch(`${BACKEND_URL}/update-age`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Send token for authentication
        },
        body: JSON.stringify({ age }),
      });

      const result = await response.json();

      if (response.ok) {
        setSelectedAge(age);
        Alert.alert("Success", "Age updated successfully!");
      } else {
        Alert.alert("Error", result.message || "Failed to update age.");
      }
    } catch (error) {
      console.error("Update Age Error:", error);
      Alert.alert("Error", "Something went wrong. Please try again.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Please tell us your current age</Text>

      <WheelPickerExpo
        items={Array.from({ length: 100 }, (_, i) => ({
          label: `${i + 1}`,
          value: i + 1,
        }))}
        initialSelectedIndex={selectedAge - 1}
        onChange={({ item }) => setSelectedAge(item.value)}
        height={350}
        width={400}
        backgroundColor="#FFFFFF"
      />

      <Text style={{ fontSize: 22, marginBottom: 10 }}>
        Selected Age: {selectedAge}
      </Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() => {updateAgeInBackend(selectedAge),router.push("/genderquestion")}}
      >
        <Text style={styles.buttonText}>Continue →</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingHorizontal: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 30,
  },
  button: {
    marginTop: 20,
    backgroundColor: "#009DA5",
    paddingVertical: 18,
    paddingHorizontal: 50,
    borderRadius: 30,
  },
  buttonText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
  },
});

export default AgePickerScreen;
