import React, { useEffect, useRef } from "react";
import { View, StyleSheet, Animated } from "react-native";
import { Svg, Path, Circle } from "react-native-svg";

const getArcColor = (riskLevel: string) => {
  switch (riskLevel) {
    case "Low":
      return "#1CA285"; // Green
    case "Moderate":
      return "#F5A623"; // Orange
    case "High":
      return "#E85D5D"; // Red
    case "Very High":
      return "#B80000"; // Dark Red
    default:
      return "#ccc";
  }
};

// Define risk levels and corresponding positions
const riskLevels = {
  Low: { offset: 50, cx: 65 },
  Moderate: { offset: 30, cx: 115 },
  High: { offset: 10, cx: 165 },
  "Very High": { offset: 0, cx: 195 },
};

const SemiCircleGauge: React.FC<{ riskLevel: "Low" | "Moderate" | "High" | "Very High" }> = ({ riskLevel }) => {
  const arcColor = getArcColor(riskLevel);
  const animatedOffset = useRef(new Animated.Value(180)).current;
  const animatedPointer = useRef(new Animated.Value(10)).current;

  useEffect(() => {
    Animated.timing(animatedOffset, {
      toValue: riskLevels[riskLevel]?.offset ?? 100,
      duration: 1000,
      useNativeDriver: false,
    }).start();

    Animated.timing(animatedPointer, {
      toValue: riskLevels[riskLevel]?.cx ?? 65,
      duration: 1000,
      useNativeDriver: false,
    }).start();
  }, [riskLevel]);

  return (
    <View style={styles.container}>
      <Svg width="200" height="120" viewBox="0 0 200 100">
        {/* Background Arc */}
        <Path
          d="M 10 100 A 90 90 0 0 1 190 100"
          fill="none"
          stroke="#ddd"
          strokeWidth="20"
        />
        {/* Animated Dynamic Arc */}
        <AnimatedPath
          d="M 10 100 A 90 90 0 0 1 190 100"
          fill="none"
          stroke={arcColor}
          strokeWidth="20"
          strokeDasharray="180"
          strokeDashoffset={animatedOffset}
        />
        {/* Animated Moving Pointer */}
        <AnimatedCircle cx={Animated.add(animatedPointer,-60)} cy="15" r="18" fill={arcColor} />
      </Svg>
    </View>
  );
};

// Animated Circle Component
const AnimatedCircle = Animated.createAnimatedComponent(Circle);

// Animated Path Component
const AnimatedPath = Animated.createAnimatedComponent(Path);

export default SemiCircleGauge;

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    marginBottom: 15,
    marginTop: 20,
  },
});
