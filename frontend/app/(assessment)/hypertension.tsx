import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import ProgressBarCustom from './progressbar';
import { useRouter } from 'expo-router';
import { useFormData } from './FormDataProvider';

const RatingScreen = () => {
  const { formData, updateFormData } = useFormData();
  const [hasHypertension, setHasHypertension] = useState<boolean | null>(null); // To track Yes/No selection
  const [severity, setSeverity] = useState<number | null>(null); // To track severity selection
  const router = useRouter();

  const severitySubtexts: { [key: number]: string } = {
    1: 'Mild',
    2: 'Moderate',
    3: 'Severe',
  };

  // Handle change function to update form data
  const handleChange = () => {
    if (hasHypertension === false) {
      updateFormData({ hypertension: 'no' });
    } else if (hasHypertension === true && severity) {
      updateFormData({ hypertension: severitySubtexts[severity] });
    }
  };

  return (
    <View style={styles.container}>
      {/* Progress bar section */}
      <ProgressBarCustom progress={3 / 12} />

      {/* Question section */}
      <Text style={styles.questionText}>Have you been diagnosed with hypertension?</Text>

      {/* Image section */}
      <Image source={require('@assets/images/hypertension.png')} style={[styles.image, { height: hasHypertension ? 200 : 300 }]} />

      {/* Yes/No selection */}
      <View style={styles.yesNoContainer}>
        <TouchableOpacity
          onPress={() => {
            setHasHypertension(true);
            handleChange(); // Update form data when selection is made
          }}
          style={[styles.yesNoButton, hasHypertension === true && styles.selectedYesNoButton]}
        >
          <Text style={[styles.yesNoText, hasHypertension === true && styles.selectedYesNoText]}>Yes</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            setHasHypertension(false);
            setSeverity(null); // Reset severity if "No" is selected
            handleChange(); // Update form data when selection is made
          }}
          style={[styles.yesNoButton, hasHypertension === false && styles.selectedYesNoButton]}
        >
          <Text style={[styles.yesNoText, hasHypertension === false && styles.selectedYesNoText]}>No</Text>
        </TouchableOpacity>
      </View>

      {/* Severity selection (if Yes is selected) */}
      {hasHypertension === true && (
        <>
          <Text style={styles.severityQuestion}>How severe is your hypertension?</Text>
          <View style={styles.severityContainer}>
            {[1, 2, 3].map((level) => (
              <TouchableOpacity
                key={level}
                onPress={() => {
                  setSeverity(level);
                  handleChange(); // Update form data when severity is selected
                }}
                style={[styles.severityButton, severity === level && styles.selectedSeverityButton]}
              >
                <Text style={[styles.severityText, severity === level && styles.selectedSeverityText]}>
                  {severitySubtexts[level]}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </>
      )}

      {/* Continue button */}
      <TouchableOpacity
        style={styles.continueButton}
        onPress={() => {
          // Navigate only if a valid option is selected
          if (hasHypertension === false || (hasHypertension === true && severity)) {
            handleChange(); // Ensure form data is updated before navigating
            router.push('../sleephours');
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
  yesNoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginVertical: 20,
  },
  yesNoButton: {
    backgroundColor: '#E0E0E0',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    width: '40%',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  selectedYesNoButton: {
    borderColor: '#009DA5',
  },
  yesNoText: {
    fontSize: 18,
    color: '#000',
  },
  selectedYesNoText: {
    color: '#009DA5',
    fontWeight: 'bold',
  },
  severityQuestion: {
    marginVertical: 20,
    fontSize: 25,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  severityContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginVertical: 20,
  },
  severityButton: {
    width: 80,
    height: 80,
    borderRadius: 10,
    borderColor: 'gray',
    borderWidth: 1,
    backgroundColor: '#E0E0E0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedSeverityButton: {
    borderColor: '#009DA5',
  },
  severityText: {
    fontSize: 16,
    color: '#000',
  },
  selectedSeverityText: {
    color: '#009DA5',
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
