import { View, Text} from "react-native";
import {Image} from "expo-image";

// Import GIFs for different test results
import lowGif from "@assets/gif/low-unscreen.gif";
import moderateGif from "@assets/gif/moderate-unscreen.gif";
import highGif from "@assets/gif/think.gif";
import veryHighGif from "@assets/gif/veryhigh-unscreen.gif";

interface TestScoreCardProps {
  testResult: "Low" | "Moderate" | "High" | "Very High";
  testDate: string; // Date in 'YYYY-MM-DD' format
}

const TestScoreCard = ({ testResult, testDate }: TestScoreCardProps) => {
  // Define background colors based on test result categories
  const backgroundColors = {
    Low: "#008000", // Green
    Moderate: "#FFD700", // Yellow
    High: "#FFA500", // Orange
    "Very High": "#FF0000", // Red
  };

  // Function to get the corresponding GIF
  const getGif = () => {
    switch (testResult) {
      case "Low":
        return lowGif;
      case "Moderate":
        return moderateGif;
      case "High":
        return highGif;
      case "Very High":
        return veryHighGif;
      default:
        return lowGif; // Default to 'low.gif'
    }
  };

  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: backgroundColors[testResult] || "#808080", // Default to gray if unknown
        paddingHorizontal: 15,
        borderRadius: 10,
      }}
    >
      <View style={{ flex: 1, justifyContent: "space-between", gap: 10 }}>
        <Text style={{ fontSize: 20, color: "white" }}>
          Your latest test score is:
        </Text>
        <Text style={{ fontSize: 32, color: "white", fontWeight: "bold" }}>
          {testResult}
        </Text>
        <Text style={{ fontSize: 14, color: "white" }}>
          Test taken on: {testDate}
        </Text>
      </View>
      <Image source={getGif()} style={{ width: 150, height: 200 }} />
    </View>
  );
};

export default TestScoreCard;
