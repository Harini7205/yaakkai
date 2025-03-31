import React from "react";
import { View, StyleSheet } from "react-native";

interface ProgressBarProps {
  progress: number; // Progress value (0 to 1)
}

const ProgressBarCustom: React.FC<ProgressBarProps> = ({ progress }) => {
  return (
    <View style={styles.container}>
      <View style={[styles.progressFill, { width: `${progress * 100}%` }]} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "80%",
    margin:"auto",
    height: 20, // Thin but visible
    backgroundColor: "#E0E0E0", // Light gray background
    borderRadius: 10,
    overflow: "hidden", // Keeps rounded corners clean
    marginVertical: 20, // Space above and below
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#009DA5", // Progress color
  },
});

export default ProgressBarCustom;
