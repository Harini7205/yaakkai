import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import ProgressBarCustom from './progressbar';
import { useRouter } from 'expo-router';
import Slider from '@react-native-community/slider';
import { useFormData } from './FormDataProvider';

const RatingScreen = () => {
  const {formData, updateFormData} = useFormData();
  const [hours, setHours] = useState<number>(formData.sleep_hours||0); // Store the number of hours of sleep
   // Form data state
  const router = useRouter();

  const handleSliderChange = (value: number) => {
    setHours(value);

    updateFormData({sleep_hours:value})
  };

  return (
    
      <View style={styles.container}>
        {/* Progress bar section */}
        <ProgressBarCustom progress={4 / 12} />

        {/* Question section */}
        <Text style={styles.questionText}>How many hours of sleep do you get on average?</Text>

        {/* Image section */}
        <Image source={require('@assets/images/sleep.png')} style={styles.image} />

        {/* Slider for hours of sleep selection */}
        <Text style={styles.sliderLabel}>Select number of hours:</Text>
        <Slider
          style={styles.slider}
          minimumValue={0}
          maximumValue={12}
          step={1}
          value={hours}
          onValueChange={handleSliderChange} // Update formData on change
          minimumTrackTintColor="#0098A5"
          maximumTrackTintColor="#E0E0E0"
          thumbTintColor="#0098A5"
        />
        <Text style={styles.selectedValue}>{hours} hours</Text>

        {/* Continue button */}
        <TouchableOpacity
          style={styles.continueButton}
          onPress={() => {
            if (hours > 0) {
              // Proceed to next screen and you can use formData here as needed
              console.log(formData); // You can send formData as part of your request or navigation
              router.push('../social');
            } else {
              alert('Please select the number of hours.');
            }
          }}
        >
          <Text style={styles.continueText}>Continue →</Text>
        </TouchableOpacity>
      </View>
    
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 40,
    alignItems: 'center',
    justifyContent:"center"
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
  sliderLabel: {
    fontSize: 18,
    color: '#000',
    marginVertical: 10,
  },
  slider: {
    width: '100%',
    height: 40,
  },
  selectedValue: {
    fontSize: 20,
    color: '#000',
    marginVertical: 10,
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
