import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import React, { useState } from 'react';
import { useRouter } from 'expo-router';
import { ProgressBar } from 'react-native-paper';
import BottomNav from './bottomNav';
import { AntDesign } from '@expo/vector-icons'; 

const Assessment: React.FC = () => {
  const router = useRouter();
  const questions = [
    { id: 1, question: "How often do you smoke?", options: ["Non-smoker", "Occasional Smoker", "Regular smoker", "Heavy smoker"] },
    { id: 2, question: "How often do you consume alcohol?", options: ["Non-alcoholic", "Occasional Drinker", "Regular drinker", "Heavy alcoholic"] },
    { id: 3, question: "How many hours of sleep do you get on a day on an average?", options: ["Less than 4 hours", "4-8 hours", "More than 8 hours"] },
    { id: 4, question: "How would you describe your physical activity level?", options: ["Sedentary", "Moderate Activity", " Very Active"] },
    { id: 5, question: "What is your diet like? (Generally, what kind of foods do you consume)", options: ["Vegetarian", "Non-Vegetarian", "Vegan"] },
    { id: 6, question: "How would you rate your stress level?", options: ["Low stress", "Moderate stress", "High stress", "Chronic stress"] }
  ];

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [progress, setProgress] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string>('');

  const handleAnswer = (answer: string) => {
    setSelectedOption(answer);
    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
        setProgress(((currentQuestion + 1) / questions.length) * 100);
      } else {
        setProgress(100);
        console.log('all done');
      }
    }, 1000);
  };

  const goBack = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
      setProgress(((currentQuestion - 1) / questions.length) * 100);
      setSelectedOption(''); 
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.outer}>
      <View style={styles.container}>
      {currentQuestion > 0 && (
          <TouchableOpacity onPress={goBack} style={styles.backButton}>
            <AntDesign name='arrowleft' color='black' size={20} />
          </TouchableOpacity>
        )}
      <View style={styles.mainContainer}>
        <View style={styles.optionsContainer}>
          <Text style={{ fontWeight: 'bold', textAlign: 'center', fontSize: 16 }}>LIFESTYLE ASSESSMENT</Text>
          <View style={styles.progressbarcontainer}>
            <ProgressBar progress={progress / 100} color="#009DA5" style={styles.progressBar} />
          </View>
          <Text style={styles.question}>{questions[currentQuestion].question}</Text>
          <View style={styles.optionsWrapper}>
            {questions[currentQuestion].options.map((option, index) => (
              <TouchableOpacity key={index} onPress={() => handleAnswer(option)} style={[
                styles.optionButton,
                selectedOption === option && styles.selectedOption, 
              ]}>
                <Text style={styles.optionText}>{option}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>
      </View>
      <BottomNav />
    </ScrollView>
  );
};

export default Assessment;

const styles = StyleSheet.create({
  outer:{
    flexGrow:1,
    width:'100%'
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'white',
  },
  mainContainer: {
    height: '60%',
    width: '90%',
    backgroundColor: '#009DA5',
    borderRadius: 10,
    display: 'flex',
    justifyContent: 'center',
    alignContent: 'center',
    padding: 20,
  },
  backButton: {
    position: 'absolute',
    top: 60,
    left: 30,
  },
  backButtonText: {
    color: 'black',
    fontSize: 28,
    fontWeight: 'bold',
  },
  optionsContainer: {
    height: '100%', 
    width: '100%', 
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    display: 'flex',
    justifyContent: 'space-between', 
    alignItems: 'center',
    gap: 10,
  },
  question: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  optionsWrapper: {
    display:'flex',
    justifyContent: 'center', 
    alignItems: 'center',
  },
  optionButton: {
    backgroundColor: 'white',
    padding: 10,
    marginVertical: 5,
    borderColor: '#7a7a7a',
    borderWidth:1,
    borderRadius: 10,
    width: '100%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  selectedOption:{ 
    borderColor: '#009DA5', 
    borderWidth: 2 
  },
  optionText: {
    color: 'black',
    fontSize: 18,
  },
  progressbarcontainer: {
    width: '80%',
  },
  progressBar: {
    height: 30,
    borderRadius: 10,
    width: '100%',
  },
  progressText: {
    fontSize: 16,
    color: 'black',
    marginTop: 10,
  },
});
