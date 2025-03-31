import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, TextInput, ScrollView } from 'react-native';
import ProgressBarCustom from './progressbar';
import { useRouter } from 'expo-router';
import { useFormData } from './FormDataProvider';

const RatingScreen = () => {
  const { formData, updateFormData } = useFormData(); // Access formData and updateFormData from the provider
  const [selectedRating, setSelectedRating] = useState(1); // Track selected rating
  const [cigarettesPerDay, setCigarettesPerDay] = useState(''); // Track number of cigarettes per day
  const router = useRouter(); // Router for navigation

  // Handle the rating change
  const handleChange = (rating: number) => {
    setSelectedRating(rating);
    let smokingStatus = '';

    // Update smoking status based on the rating
    if (rating === 1) {
      smokingStatus = 'Non-Smoker';
      updateFormData({ cigarettes_per_day: 0 }); // Set cigarettes per day to 0 for non-smoker
      setCigarettesPerDay(''); // Clear input when non-smoker
    } else if (rating === 2) {
      smokingStatus = 'Light Smoker';
    } else if (rating === 3) {
      smokingStatus = 'Regular Smoker';
    } else if (rating === 4) {
      smokingStatus = 'Heavy Smoker';
    }

    // Update form data with the selected smoking status
    updateFormData({ smoking_status: smokingStatus });
  };

  // Subtexts for each rating option
  const subtexts: { [key: number]: string } = {
    1: 'Non-smoker',
    2: 'Occasional smoker',
    3: 'Regular smoker',
    4: 'Heavy smoker',
  };

  return (
    <ScrollView style={{ height: "100%", backgroundColor: "#fff" }} contentContainerStyle={{justifyContent:'center'}}>
      <View style={styles.container}>
        {/* Progress bar section */}
        <ProgressBarCustom progress={1/12} />

        {/* Question section */}
        <Text style={styles.questionText}>How often do you smoke?</Text>

        {/* Image section */}
        <Image source={require('@assets/images/smoke.png')} style={styles.image} />

        {/* Rating selection */}
        <View style={styles.ratingContainer}>
          {[1, 2, 3, 4].map((rating) => (
            <TouchableOpacity
              key={rating}
              onPress={() => handleChange(rating)} // Update the selected rating
              style={[
                styles.ratingButton,
                selectedRating === rating && styles.selectedRatingButton,
              ]}
            >
              <Text style={styles.ratingText}>{rating}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Subtext */}
        <Text style={styles.subtext}>{subtexts[selectedRating]}</Text>

        {/* Conditional question for smokers */}
        {(selectedRating === 2 || selectedRating === 3 || selectedRating === 4) && (
          <View style={styles.inputContainer}>
            <Text style={styles.additionalQuestion}>
              On average, how many cigarettes do you smoke? 
            </Text>
            <TextInput
              style={styles.textInput}
              keyboardType="numeric"
              value={cigarettesPerDay}
              onChangeText={(text) => setCigarettesPerDay(text)} // Update the state for cigarettes per day
            />
          </View>
        )}

        {/* Continue button */}
        <TouchableOpacity
          style={styles.continueButton}
          onPress={() => {
            // Update the form data when the user navigates to the next screen
            if (selectedRating > 1 && cigarettesPerDay) {
              // Ensure the user entered a valid number when they are a smoker
              updateFormData({ cigarettes_per_day: parseInt(cigarettesPerDay) });
            }
            updateFormData({smoking_status:subtexts[selectedRating]});
            router.push('../sedentaryhours'); // Navigate to next screen
          }}
        >
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
    height: 300,
    resizeMode: 'contain',
    marginVertical: 10,
  },
  ratingContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    gap: 20,
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
  },
  selectedRatingButton: {
    backgroundColor: '#009DA5',
  },
  ratingText: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
  },
  subtext: {
    fontSize: 25,
    color: 'black',
    textAlign: 'center',
    marginVertical: 15,
  },
  inputContainer: {
    marginVertical: 15,
    width: '100%',
    alignItems: 'center',
  },
  additionalQuestion: {
    fontSize: 20,
    color: 'black',
    marginBottom: 10,
    textAlign: 'center',
  },
  textInput: {
    width: 50,
    padding: 10,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 10,
    fontSize: 18,
    textAlign: 'center',
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
