import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import Slider from '@react-native-community/slider';
import age18 from "@assets/images/age18.png"; 
import age30 from "@assets/images/age30.png";
import age50 from "@assets/images/age50.png";
import age65 from "@assets/images/age65.png";
import age80 from "@assets/images/age80.png"; 

interface AgeQuestionPageProps {
  onNext: (data: { age: number }) => void;
}

const AgeQuestionPage: React.FC<AgeQuestionPageProps> = ({ onNext }) => {
  const [age, setAge] = useState(18);

  const getImageForAge = (age: number) => {
    if (age <= 25) return age18;
    if (age <= 45) return age30;
    if (age <= 65) return age50;
    if (age <= 75) return age65;
    return age80;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your Health Survey</Text>
      <View style={styles.progressBarContainer}>
        <View style={[styles.progressBar, { width: `${(age - 18) / 62 * 100}%` }]} />
      </View>
      <Text style={styles.question}>What is your age?</Text>
      <View style={styles.content}>
        <Image source={getImageForAge(age)} style={styles.image} />
        <Slider
          style={styles.slider}
          minimumValue={18}
          maximumValue={80}
          value={age}
          onValueChange={setAge}
        />
      </View>
      <TouchableOpacity style={styles.nextButton} onPress={() => onNext({ age })}>
        <Text style={styles.nextButtonText}>Next</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'space-around',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  progressBarContainer: {
    width: '100%',
    height: 10,
    backgroundColor: '#d1c4e9',
    borderRadius: 5,
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#42a5f5',
    borderRadius: 5,
  },
  question: {
    fontSize: 20,
    textAlign: 'center',
  },
  content: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  image: {
    width: 150,
    height: 200,
    resizeMode: 'contain',
  },
  slider: {
    width: '50%',
  },
  nextButton: {
    backgroundColor: '#42a5f5',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  nextButtonText: {
    color: 'white',
    fontSize: 18,
  },
});

export default AgeQuestionPage;