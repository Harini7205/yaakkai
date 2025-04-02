import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import ProgressBarCustom from './progressbar';
import { useRouter } from 'expo-router';

const RatingScreen = () => {
  const [selectedRating, setSelectedRating] = useState(1);
  const router=useRouter();

  const subtexts: { [key: number]: string } = {
    1: 'Non-drinker',
    2: 'Occasional drinker',
    3: 'Regular drinker',
    4: 'Heavy drinker',
  };

  return (
    <View style={styles.container}>
      {/* Progress bar section */}
      <ProgressBarCustom progress={(7/12)} />

      {/* Question section */}
      <Text style={styles.questionText}>How often do you drink?</Text>

      {/* Image section */}
      <Image source={require('@assets/images/drinking.png')} style={styles.image} />

      {/* Rating selection */}
      <View style={styles.ratingContainer}>
        {[1, 2, 3, 4].map((rating) => (
          <TouchableOpacity
            key={rating}
            onPress={() => setSelectedRating(rating)}
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

      {/* Continue button */}
      <TouchableOpacity style={styles.continueButton} onPress={()=>{router.push('../dietary')}}>
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
    fontSize: 30,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  image: {
    width: '100%',
    height: 300,
    resizeMode: 'contain',
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