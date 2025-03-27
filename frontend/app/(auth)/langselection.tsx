import React, { useState } from 'react';
import { View, Text, ImageBackground, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import tamilbg from '@assets/images/tamilbg.jpg';
import englishbackground from '@assets/images/englishbackground.jpeg';

const LanguageSelection: React.FC = () => {
  const router = useRouter();
  const [selectedLanguage, setSelectedLanguage] = useState<string | null>(null);

  const handleLanguageSelection = (language: string) => {
    setSelectedLanguage(language);
  };

  const handleContinue = () => {
    if (selectedLanguage) {
      console.log(`Selected language: ${selectedLanguage}`);
      router.push('/login'); // Navigate to Login Screen
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Select Language</Text>

      <TouchableOpacity 
        onPress={() => handleLanguageSelection('en')} 
        style={[styles.languageBox, selectedLanguage === 'en' && styles.selectedBox]}
      >
        <ImageBackground source={englishbackground} style={styles.imageBackground} imageStyle={styles.imageStyle}>
          <Text style={styles.languageText}>English</Text>
        </ImageBackground>
      </TouchableOpacity>

      <TouchableOpacity 
        onPress={() => handleLanguageSelection('ta')} 
        style={[styles.languageBox, selectedLanguage === 'ta' && styles.selectedBox]}
      >
        <ImageBackground source={tamilbg} style={styles.imageBackground} imageStyle={styles.imageStyle}>
          <Text style={styles.languageText}>தமிழ்</Text>
        </ImageBackground>
      </TouchableOpacity>

      <TouchableOpacity 
        onPress={handleContinue} 
        style={[styles.continueButton, !selectedLanguage && styles.disabledButton]} 
        disabled={!selectedLanguage}
      >
        <Text style={styles.continueText}>Continue</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff', paddingHorizontal: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, color: '#333' },
  
  languageBox: { width: '100%', height: 300, marginVertical: 10, borderRadius: 10, overflow: 'hidden', borderWidth: 2, borderColor: 'transparent' },
  selectedBox: { borderColor: '#009DA5' }, // Highlight selected language
  imageBackground: { flex: 1, justifyContent: 'center', alignItems: 'center', opacity:0.8 },
  imageStyle: { resizeMode: 'cover', width: '100%', height: '100%' },
  languageText: { fontSize: 24, fontWeight: 'bold', color: 'rgba(0,0,0)', backgroundColor: 'white', padding: 10, borderRadius: 5 },

  continueButton: { marginTop: 20, backgroundColor: '#009DA5', paddingVertical: 12, paddingHorizontal: 40, borderRadius: 10 },
  disabledButton: { backgroundColor: '#B0B0B0' }, // Gray out when no language is selected
  continueText: { fontSize: 18, fontWeight: 'bold', color: '#fff' }
});

export default LanguageSelection;
