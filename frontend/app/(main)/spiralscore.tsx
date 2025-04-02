import React, { useEffect } from "react";
import { View, Text } from "react-native";
import Svg, { Path, Text as SvgText } from "react-native-svg";
import Animated, {
  useSharedValue,
  withRepeat,
  withTiming,
  useAnimatedProps,
} from "react-native-reanimated";

const { createAnimatedComponent } = Animated;

// Define colors for different test results
const resultColors = {
  Low: "#008000", // Green
  Moderate: "#FFA500", // Orange
  High: "#FF0000", // Red
};

// Wrap the Path component with Animated.createAnimatedComponent
const AnimatedPath = createAnimatedComponent(Path);

interface SpiralScoreProps {
  testResult: "Low" | "Moderate" | "High";
}

const SpiralScore = ({ testResult }: SpiralScoreProps) => {
  const color = resultColors[testResult] || "#808080"; // Default to gray if unknown

  // Dynamically adjust radius based on text length
  const baseRadius = 30;
  const textLengthFactor = testResult.length * 1.2; // Increase size based on text length
  const outerRadius = baseRadius + textLengthFactor;
  const innerRadius = outerRadius * 0.75; // Slightly increased for better spacing

  // Shared value for animation
  const animatedRadius = useSharedValue(outerRadius);

  useEffect(() => {
    // Expand and contract the outer circle repeatedly
    animatedRadius.value = withRepeat(
      withTiming(outerRadius + 5, { duration: 1000 }), // Expand
      -1, // Infinite repeat
      true // Alternate between values (expand/contract)
    );
  }, []);

  // Animated props for outer circle path
  const animatedOuterCircle = useAnimatedProps(() => ({
    d: `M 50,50 m -${animatedRadius.value},0 a ${animatedRadius.value},${animatedRadius.value} 0 1,1 ${
      animatedRadius.value * 2
    },0 a ${animatedRadius.value},${animatedRadius.value} 0 1,1 -${animatedRadius.value * 2},0`,
  }));

  return (
    <View style={{ alignItems: "center", justifyContent: "center", marginVertical: 20 }}>
      <Svg height="220" width="220" viewBox="0 0 100 100">
        {/* Filled Region between the Circles */}
        <Path
          d={`
            M 50,50 m -${outerRadius},0
            a ${outerRadius},${outerRadius} 0 1,1 ${outerRadius * 2},0
            a ${outerRadius},${outerRadius} 0 1,1 -${outerRadius * 2},0
            M 50,50 m -${innerRadius},0
            a ${innerRadius},${innerRadius} 0 1,0 ${innerRadius * 2},0
            a ${innerRadius},${innerRadius} 0 1,0 -${innerRadius * 2},0
            Z
          `}
          fill={color}
          stroke="none"
          opacity="0.8"
        />

        {/* Animated Outer Circle */}
        <AnimatedPath animatedProps={animatedOuterCircle} stroke={color} strokeWidth="3" fill="none" />

        {/* Inner Circle */}
        <Path
          d={`M 50,50 m -${innerRadius},0 a ${innerRadius},${innerRadius} 0 1,1 ${innerRadius * 2},0 a ${innerRadius},${innerRadius} 0 1,1 -${innerRadius * 2},0`}
          stroke={color}
          strokeWidth="3"
          fill="none"
        />
        
        {/* Centered Result Text */}
        <SvgText
          x="50"
          y="55"  // Adjusted for better centering
          fontSize="12"
          fill="black"
          textAnchor="middle"
          fontWeight="bold"
          fontFamily="Roboto"
        >
          {testResult}
        </SvgText>
      </Svg>
    </View>
  );
};

export default SpiralScore;
