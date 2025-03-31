import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { FontAwesome5, MaterialCommunityIcons } from "@expo/vector-icons";
import Svg, { Line } from "react-native-svg";

interface HealthCardProps {
  title: string;
  value: string;
  unit: string;
  normalRange: string;
  icon: React.ReactNode;
  graphColor: string;
  isDarkMode: boolean;
}

const HealthCard: React.FC<HealthCardProps> = ({ title, value, unit, normalRange, icon, graphColor, isDarkMode }) => {
  return (
    <View style={[styles.card, { backgroundColor: isDarkMode ? "#121212" : "#FFF" }]}> 
      <View style={styles.header}>
        <Text style={[styles.title, { color: isDarkMode ? "#FFF" : "#000" }]}>{title}</Text>
        {icon}
      </View>
      <Text style={[styles.value, { color: isDarkMode ? "#FFF" : "#000" }]}>
        {value} <Text style={[styles.unit, { color: isDarkMode ? "#DDD" : "gray" }]}>{unit}</Text>
      </Text>
      <Svg height="40" width="100%" viewBox="0 0 100 40">
        {[10, 25, 15, 35, 20, 30, 25].map((height, index) => (
          <Line
            key={index}
            x1={index * 12 + 8}
            y1={40}
            x2={index * 12 + 8}
            y2={40 - height}
            stroke={graphColor}
            strokeWidth="3"
          />
        ))}
      </Svg>
      <Text style={[styles.normalRange, { color: isDarkMode ? "#FFF" : "gray" }]}>Normal Range: {normalRange}</Text>
    </View>
  );
};

interface HealthCardsProps {
  isDarkMode: boolean;
  bloodpressure: string;
  heartrate: string;
}

const HealthCards: React.FC<HealthCardsProps> = ({ isDarkMode, bloodpressure, heartrate }) => {
  return (
    <View style={styles.container}>
      <HealthCard
        title="Blood Pressure"
        value={bloodpressure}
        unit="mmHg"
        normalRange="120/80"
        icon={<MaterialCommunityIcons name="stethoscope" size={20} color="#009DA5" />}
        graphColor="#009DA5"
        isDarkMode={isDarkMode}
      />
      <HealthCard
        title="Heart Rate"
        value={heartrate}
        unit="bpm"
        normalRange="60 - 100"
        icon={<FontAwesome5 name="heartbeat" size={20} color="#009DA5" />}
        graphColor="#009DA5"
        isDarkMode={isDarkMode}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 20,
    paddingVertical: 20,
  },
  card: {
    borderRadius: 12,
    padding: 15,
    width: 160,
    alignItems: "center",
    borderColor: "#D3D3D3",
    borderWidth: 1,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  title: {
    fontWeight: "bold",
    fontSize: 14,
  },
  value: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 10,
  },
  unit: {
    fontSize: 14,
    marginBottom: 10,
  },
  normalRange: {
    fontSize: 12,
    textAlign: "center",
    marginTop: 20,
  },
});

export default HealthCards;
