import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, ScrollView, TextInput, Animated, KeyboardTypeOptions } from 'react-native';
import Slider from '@react-native-community/slider';
import smoke from "@assets/images/smoke.png";

const questions = [
  {
    question: 'What is your age?',
    inputType: 'slider',
    minValue: 18,
    maxValue: 80,
    sliderShape: 'rounded', // Custom slider shape
  },
  {
    question: 'What is your gender?',
    inputType: 'options',
    options: ['Male', 'Female', 'Other'],
  },
  {
    question: 'How often do you smoke?',
    inputType: 'uSlider', // U-shaped slider simulation
    options: ['Non-Smoker', 'Occasional', 'Regular', 'Heavy'],
  },
  {
    question: 'How many hours sedentary?',
    inputType: 'textInput',
    keyboardType: 'numeric',
    placeholder: 'Enter hours',
  },
  {
    question: 'Diagnosed with hypertension?',
    inputType: 'toggle', // Toggle switch
    options: ['Yes', 'No'],
  },
  {
    question: 'Hypertension severity?',
    inputType: 'options',
    options: ['Mild', 'Moderate', 'Severe'],
  },
  {
    question: 'Do you have diabetes?',
    inputType: 'toggle',
    options: ['Yes', 'No'],
  },
  {
    question: 'Hours of sleep?',
    inputType: 'slider',
    minValue: 0,
    maxValue: 12,
    sliderShape: 'triangle', // Another custom slider shape
  },
  {
    question: 'Social connectedness level?',
    inputType: 'options',
    options: ['High', 'Moderate', 'Low', 'Very Low'],
  },
  {
    question: 'What is your BMI?',
    inputType: 'textInput',
    keyboardType: 'numeric',
    placeholder: 'Enter BMI',
  },
];

const QuestionPage = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [progress, setProgress] = useState(0);
  const [sliderValue, setSliderValue] = useState(questions[currentQuestion].minValue);
  const [textInputValue, setTextInputValue] = useState('');
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, [currentQuestion]);

  const handleNext = () => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
        setProgress((currentQuestion + 1) / questions.length);
        if (questions[currentQuestion + 1].inputType === 'slider') {
          setSliderValue(questions[currentQuestion + 1].minValue);
        }
        setTextInputValue('');
        setSelectedOption(null);
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }).start();
      }
    });
  };

  const handleBack = () => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      if (currentQuestion > 0) {
        setCurrentQuestion(currentQuestion - 1);
        setProgress((currentQuestion - 1) / questions.length);
        if (questions[currentQuestion - 1].inputType === 'slider') {
          setSliderValue(questions[currentQuestion - 1].minValue);
        }
        setTextInputValue('');
        setSelectedOption(null);
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }).start();
      }
    });
  };

  const renderOptions = (options: string[]) => {
    if (questions[currentQuestion].inputType === 'uSlider') {
      return (
        <View style={styles.uSliderContainer}>
          {options.map((option, index) => (
            <TouchableOpacity
              key={index}
              style={[styles.uSliderOption, selectedOption === option && styles.selectedOption]}
              onPress={() => setSelectedOption(option)}
            >
              <Text style={styles.uSliderText}>{option}</Text>
            </TouchableOpacity>
          ))}
        </View>
      );
    }
    if (questions[currentQuestion].inputType === 'toggle') {
      return (
        <View style={styles.toggleContainer}>
          {options.map((option, index) => (
            <TouchableOpacity
              key={index}
              style={[styles.toggleOption, selectedOption === option && styles.selectedToggle]}
              onPress={() => setSelectedOption(option)}
            >
              <Text style={styles.toggleText}>{option}</Text>
            </TouchableOpacity>
          ))}
        </View>
      );
    }
    return (
      <View style={styles.optionsContainer}>
        {options.map((option, index) => (
          <TouchableOpacity
            key={index}
            style={[styles.optionButton, selectedOption === option && styles.selectedOption]}
            onPress={() => setSelectedOption(option)}
          >
            <Text style={styles.optionText}>{option}</Text>
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  const renderSlider = () => {
    const sliderShape = questions[currentQuestion].sliderShape;
    return (
      <View style={styles.sliderContainer}>
        <Slider
          style={styles.slider}
          minimumValue={questions[currentQuestion].minValue}
          maximumValue={questions[currentQuestion].maxValue}
          value={sliderValue}
          onValueChange={setSliderValue}
          thumbTintColor={sliderShape === 'rounded' ? '#42a5f5' : '#ff7043'}
        />
        <Text style={styles.sliderValueText}>{sliderValue}</Text>
      </View>
    );
  };

  return (
    <View style={styles.outerContainer}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Your Health Survey</Text>
        <View style={styles.progressBarContainer}>
          <View style={[styles.progressBar, { width: `${progress * 100}%` }]} />
        </View>
        <Animated.View style={{ ...styles.questionArea, opacity: fadeAnim }}>
          <Text style={styles.questionText}>{questions[currentQuestion].question}</Text>
          <Image source={smoke} style={styles.image} />
          {questions[currentQuestion].inputType === 'slider' && renderSlider()}
          {questions[currentQuestion].inputType === 'textInput' && (
            <TextInput
              style={styles.textInput}
              keyboardType={questions[currentQuestion].keyboardType as KeyboardTypeOptions}
              placeholder={questions[currentQuestion].placeholder}
              value={textInputValue}
              onChangeText={setTextInputValue}
            />
          )}
          {['options', 'uSlider', 'toggle'].includes(questions[currentQuestion].inputType) && renderOptions(questions[currentQuestion].options || [])}
        </Animated.View>
      </ScrollView>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.navButton} onPress={handleBack}>
          <Text style={styles.navButtonText}>{'< Back'}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navButton} onPress={handleNext}>
          <Text style={styles.navButtonText}>{'Next >'}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    backgroundColor: '#e0f2f7',
  },
  container: {
    flexGrow: 1,
    alignItems: 'center',
    padding: 20,
    paddingBottom: 80,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 10,
    marginTop: 20,
    color: '#283593',
  },
  progressBarContainer: {
    width: '100%',
    height: 10,
    backgroundColor: '#d1c4e9',
    borderRadius: 5,
    marginBottom: 20,
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#42a5f5',
    borderRadius: 5,
  },
  questionArea: {
    backgroundColor: '#4db6ac',
    padding: 20,
    borderRadius: 10,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    flexGrow: 1,
  },
  questionText: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    color: 'white',
    marginBottom: 20,
  },
  image: {
    width: 250,
    height: 200,
    marginBottom: 30,
    resizeMode: 'contain',
  },
  optionsContainer: {
    width: '100%',
    marginTop: 20,
  },
  optionButton: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 8,
    marginVertical: 10,
    width: '100%',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'black',
  },
  optionText: {
    fontSize: 18,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    padding: 20,
    position: 'absolute',
    bottom: 0,
  },
  navButton: {
    backgroundColor: '#42a5f5',
    padding: 15,
    borderRadius: 8,
    width: '48%',
    alignItems: 'center',
  },
  navButtonText: {
    color: 'white',
    fontSize: 18,
  },
  sliderContainer: {
    width: '100%',
    marginTop: 20,
  },
  slider: {
    width: '100%',
    height: 40,
  },
  sliderValueText: {
    fontSize: 18,
    textAlign: 'center',
    marginTop: 10,
    color: 'white',
  },
  textInput: {
    width: '100%',
    height: 40,
    backgroundColor: 'white',
    borderRadius: 8,
    paddingHorizontal: 10,
    marginTop: 20,
    color: 'black',
  },
  uSliderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: 20,
  },
  uSliderOption: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'black',
  },
  uSliderText: {
    fontSize: 16,
  },
  selectedOption: {
    backgroundColor: '#42a5f5',
    borderColor: '#42a5f5',
    color: 'white',
  },
  toggleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: 20,
  },
  toggleOption: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'black',
  },
  toggleText: {
    fontSize: 16,
  },
  selectedToggle: {
    backgroundColor: '#42a5f5',
    borderColor: '#42a5f5',
    color: 'white',
  },
  roundedThumb: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#42a5f5',
  },
  triangleThumb: {
    width: 0,
    height: 0,
    borderLeftWidth: 10,
    borderRightWidth: 10,
    borderBottomWidth: 20,
    borderStyle: 'solid',
    backgroundColor: 'transparent',
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: '#42a5f5',
  },
});

export default QuestionPage;