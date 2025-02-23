import { View, TouchableOpacity, Text, StyleSheet, Image } from 'react-native';
import React from 'react';
import heartImage from '@assets/images/heart.png';
import { useRouter } from 'expo-router';
import BottomNav from './bottomNav';

const Home: React.FC = () => {
  const router = useRouter();
  return (
    <View style={styles.outer}>
    <View style={styles.container}>
      <Text style={styles.heading}>Welcome to Yaakkai</Text>
      <Image source={heartImage} style={styles.image} />
      
      <View style={styles.mottoContainer}>
        <Text style={styles.mottoTitle}>OUR MOTTO</Text>
        <Text style={styles.mottoText}>மருந்தென வேண்டாவாம் யாக்கைக்கு அருந்தியது</Text>
        <Text style={styles.mottoText}>அற்றது போற்றி உணி</Text>
        <Text style={styles.explanationTitle}>EXPLANATION:</Text>
        <Text style={styles.explanationText}>
          One should not seek medicine for a disease that can be cured by self-discipline;
          The remedy lies in avoiding excess, which is the true cure for illness.
        </Text>
      </View>

      <Text style={styles.subHeading}>
        Answer a few questions to know your risk level for cardiovascular disease.
      </Text>

      <TouchableOpacity onPress={() => router.push('../assessment')} style={styles.button}>
        <Text style={styles.buttonText}>Take a New Assessment</Text>
      </TouchableOpacity>
    </View>
    <BottomNav />
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  outer:{
    flex:1,
    width:'100%',
  },
  container: {
    flex: 1,
    justifyContent:'center',
    alignItems: 'center',
    backgroundColor: 'white',
    paddingHorizontal: 20,
    width:'100%'
  },
  welcomeText: {
    fontSize: 22,
    alignSelf:'flex-start',
    fontWeight: 'bold',
    color: '#525252',
    marginBottom: 5,
  },
  subText: {
    fontSize: 16,
    alignSelf:'flex-start',
    color: '#7a7a7a',
    marginBottom: 20,
  },
  mottoContainer: {
    backgroundColor: '#009DA5',
    borderRadius:20,
    padding: 15,
    width: '100%',
    marginBottom: 20,
  },
  mottoTitle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 5,
  },
  mottoText: {
    color: 'white',
    width:'100%',
    fontSize:13,
    textAlign: 'left',
  },
  explanationTitle: {
    marginTop: 10,
    color: 'white',
    fontWeight: 'bold',
  },
  explanationText: {
    marginTop: 10,
    color: 'white',
  },
  image: {
    width: 250,
    height: 250,
    marginBottom: 20,
  },
  heading: {
    fontSize: 26,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  subHeading: {
    fontSize: 16,
    textAlign: 'center',
    color: 'black',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#009DA5',
    borderRadius: 20,
    paddingVertical: 15,
    paddingHorizontal: 30,
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 4 }, 
    shadowOpacity: 0.3, 
    shadowRadius: 4, 
    elevation: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  disclaimer: {
    marginTop:30,
    fontSize: 16,
    textAlign: 'justify',
    color: '#7a7a7a',
    marginBottom: 20,
  }
});