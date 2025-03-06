import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import React from 'react';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { AntDesign } from '@expo/vector-icons'
import BottomNav from './bottomNav';

const ResultScreen: React.FC = () => {
  const router = useRouter();
  const { prediction } = useLocalSearchParams();
  const pred = parseInt(prediction as string, 10);

  const mapping: { [key: number]: string } = {
    0: "Low",
    1: "Moderate",
    2: "High",
  };

  const descriptions: { [key: number]: string } = {
    0: "You are at a low risk. Keep maintaining your healthy habits!",
    1: "You are at a moderate risk. Consider making small improvements.",
    2: "You are at a high risk. It’s important to take preventive measures.",
  };


  return (
    <View style={styles.outer}>
    <View style={styles.container}>
      <TouchableOpacity onPress={() => router.push('/(main)/home')} style={styles.backButton}>
        <AntDesign name="arrowleft" color="black" size={24} />
      </TouchableOpacity>

      <Text style={styles.title}>Assessment Result</Text>
      <Text style={styles.resultText}>Your risk level:</Text>
      <Text style={styles.result}>{mapping[pred]}</Text>
      <Text style={styles.description}>{descriptions[pred]}</Text>

      {/* Retake Assessment Button */}
      <TouchableOpacity style={styles.button} onPress={() => router.push('/assessment')}>
        <Text style={styles.buttonText}>Retake Assessment</Text>
      </TouchableOpacity>
    </View>
    <BottomNav />
    </View>
  );
};

export default ResultScreen;

const styles = StyleSheet.create({
  outer:{
    flex:1,
    width:'100%',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  backButton: {
    position: 'absolute',
    top: 60,
    left: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  resultText: {
    fontSize: 18,
    marginBottom: 10,
  },
  result: {
    fontSize: 28,
    fontWeight: 'bold',
    color: "#0098A5",
    marginBottom:10,
  },
  description: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginHorizontal: 20,
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#009DA5",
    padding: 12,
    borderRadius: 8,
    marginTop: 20,
    width: "80%",
    alignItems: "center",
  },
  shareButton: {
    backgroundColor: "#007BFF",
    padding: 12,
    borderRadius: 8,
    marginTop: 10,
    width: "80%",
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
});
