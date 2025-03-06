import { View, Text, TouchableOpacity, StyleSheet, ScrollView} from 'react-native';
import React, { useState } from 'react';
import { useRouter } from 'expo-router';
import { ProgressBar } from 'react-native-paper';
import BottomNav from './bottomNav';
import { AntDesign } from '@expo/vector-icons'; 
import AsyncStorage from '@react-native-async-storage/async-storage';

const Assessment: React.FC = () => {
  const router = useRouter();
  const questions = [
    { id: 1, question: "Do you smoke?", options: ["Yes", "No"], parameter: "Smoking" },
    { id: 2, question: "Do you consume alcohol?", options: ["Yes", "No"], parameter: "Alcohol_Consumption" },
    { id: 3, question: "How would you describe your level of physical activity?", options: ["Low", "Moderate", "High"], parameter: "Physical_Activity_Level" },
    { id: 4, question: "Do you have a family history of heart disease?", options: ["Yes", "No"], parameter: "Family_History" },
    { id: 5, question: "Have you been diagnosed with hypertension (high blood pressure)?", options: ["Yes", "No"], parameter: "Hypertension" },
    { id: 6, question: "How would you rate your stress level?", options: ["Low stress", "Moderate stress", "High stress"], parameter: "Stress_Level" }
  ];

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [progress, setProgress] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string>('');
  const [answers, setAnswers] = useState<{ [key: string]: string }>({});

  const isYesNoQuestion = questions[currentQuestion].options.length === 2 && 
                          questions[currentQuestion].options.includes("Yes") &&
                          questions[currentQuestion].options.includes("No");

  const handleAnswer = async (answer: string) => {
    setSelectedOption(answer);

    const newAnswers = {
      ...answers,
      [questions[currentQuestion].parameter]: answer,
    };
    setAnswers(newAnswers);

    setTimeout(async () => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
        setProgress(((currentQuestion + 1) / questions.length) * 100);
      } else {
        setProgress(100);

        try {
          let token = await AsyncStorage.getItem('access_token');
          if (!token) {
            console.log('No access token found');
            return;
          }

          const profileResponse = await fetch('http://127.0.0.1:5000/auth/profile', {
            method: 'GET',
            headers: { 'Authorization': `Bearer ${token}`,'Content-Type': 'application/json' },
          });

          if (!profileResponse.ok) {
            throw new Error('Failed to fetch profile data');
          }

          const profileData = await profileResponse.json();
          const updatedAnswers = {
              ...newAnswers,
              "Age": profileData.age,
              "Gender": profileData.gender,
              "user_id":profileData.userid
          };
          sendDataToBackend(updatedAnswers);
          return updatedAnswers;

        } catch (error) {
          console.error('Error fetching profile data:', error);
          console.log('Error', 'Failed to fetch profile data.');
        }
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

  const sendDataToBackend = async (answers:{ [key: string]: string }) => {
    try {
      const response = await fetch('http://127.0.0.1:5000/predict', {  
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(answers),
      });

      const result = await response.json();
      console.log('Prediction Result', `Your risk level: ${result.prediction}`);
      if (!(result.prediction in ['0','1','2'])){
        return "Prediction value undefined"
      }

      router.push({
        pathname: '/(main)/resultscreen',
        params: { prediction: Number(result.prediction) },
      });
    } catch (error) {
      console.error('Error sending data:', error);
      console.log('Error', 'Failed to send data to the server.');
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
        <View style={[styles.mainContainer, { height: isYesNoQuestion ? '40%' : '50%' }]}>
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
  outer: {
    flexGrow: 1,
    width: '100%',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'white',
  },
  mainContainer: {
    height: '50%',
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
    display: 'flex',
    justifyContent: 'center', 
    alignItems: 'center',
  },
  optionButton: {
    backgroundColor: 'white',
    padding: 10,
    marginVertical: 5,
    borderColor: '#7a7a7a',
    borderWidth: 1,
    borderRadius: 10,
    width: '100%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  selectedOption: { 
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
});
