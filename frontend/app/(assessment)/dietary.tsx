import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import ProgressBarCustom from './progressbar';
import { useRouter } from 'expo-router';

const RatingScreen = () => {
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const router=useRouter();

  const subtexts: { [key: number]: string } = {
    1: 'Vegetarian',
    2: 'Vegan',
    3: 'Non-vegetarian',
    4: 'Pescatarian',
  };

  return (
    <ScrollView style={{height:"100%",backgroundColor:"#fff"}}>
    <View style={styles.container}>
      {/* Progress bar section */}
      <ProgressBarCustom progress={(8/12)} />

      {/* Question section */}
      <Text style={styles.questionText}>Which of the following describes your dietary preferences?</Text>

      {/* Image section */}
      <Image source={require('@assets/images/diet.png')} style={styles.image} />

      {/* Rating selection */}
      <View style={styles.optionsContainer}>
        {Object.keys(subtexts).map((key) => {
          const option = parseInt(key, 10);
          return (
            <TouchableOpacity
              key={option}
              onPress={() => setSelectedOption(option)}
              style={[
                styles.optionButton,
                selectedOption === option && styles.selectedOptionButton,
              ]}
            >
              <Text style={styles.optionText}>{subtexts[option]}</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Continue button */}
      <TouchableOpacity style={styles.continueButton} onPress={()=>{router.push('../stress')}}>
        <Text style={styles.continueText}>Continue →</Text>
      </TouchableOpacity>
    </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 40,
    paddingTop: 30,
    alignItems: 'center',
  },
  questionText: {
    marginVertical: 20,
    fontSize: 30,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  image: {
    width: '100%',
    height: 200,
    resizeMode: 'contain',
    marginVertical: 10,
  },
  optionsContainer: {
    width: '100%',
    marginVertical: 20,
  },
  optionButton: {
    backgroundColor: '#E0E0E0',
    padding: 15,
    borderRadius: 10,
    marginVertical: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0', // Default border color
  },
  selectedOptionButton: {
    borderColor: '#009DA5', // Selected border color
    borderWidth: 2,
  },
  optionText: {
    fontSize: 18,
    color: '#000',
  },
  continueButton: {
    backgroundColor: '#0098A5',
    padding: 15,
    borderRadius: 30,
    width: '80%',
    alignItems: 'center',
  },
  continueText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
});

export default RatingScreen;

