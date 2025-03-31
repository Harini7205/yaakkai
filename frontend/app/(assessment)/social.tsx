import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import ProgressBarCustom from './progressbar';
import { useRouter } from 'expo-router';
import { useFormData } from './FormDataProvider'; // Assuming useFormData is available for managing form data

const RatingScreen = () => {
  const { updateFormData } = useFormData(); // Access updateFormData from the provider
  const [selectedRating, setSelectedRating] = useState(1); // Track selected rating
  const router = useRouter();

  // Handle the rating change
  const handleChange = (rating: number) => {
    setSelectedRating(rating);
    updateFormData({ social_connectedness: rating }); // Update form data with selected rating
  };

  return (
    <View style={styles.container}>
      {/* Progress bar section */}
      <ProgressBarCustom progress={5 / 12} />

      {/* Question section */}
      <Text style={styles.questionText}>How would you rate your level of social connectedness?</Text>

      {/* Image section */}
      <Image source={require('@assets/images/social.png')} style={styles.image} />

      {/* Rating selection */}
      <View style={styles.ratingContainer}>
        {[...Array(10).keys()].map((i) => (
          <TouchableOpacity
            key={i + 1}
            onPress={() => handleChange(i + 1)} // Set rating to i+1 (1 to 10)
            style={[
              styles.ratingButton,
              selectedRating === i + 1 && styles.selectedRatingButton,
            ]}
          >
            <Text style={styles.ratingText}>{i + 1}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Continue button */}
      <TouchableOpacity style={styles.continueButton} onPress={() => router.push('../physicalactivity')}>
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
    paddingTop: 30,
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
  ratingContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    flexWrap: 'wrap', // Allow the buttons to wrap if needed
    marginVertical: 20,
  },
  ratingButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderColor: 'white',
    borderWidth: 1,
    backgroundColor: '#E0E0E0',
    alignItems: 'center',
    justifyContent: 'center',
    margin: 5,
  },
  selectedRatingButton: {
    backgroundColor: '#009DA5',
  },
  ratingText: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
  },
  continueButton: {
    marginTop: 20,
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
