import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import BottomNav from './bottomNav';

const PastAssessment = () => {
  const router = useRouter();
  const [assessments, setAssessments] = useState([{"id":null,"created_at":null,"prediction":''}]);
  const [error, setError] = useState('');
  const mapping:{[key:string]:string}={'0':"Low","1":"Moderate","2":"High"};

  useEffect(() => {
    // Function to fetch past assessments
    const fetchAssessments = async () => {
      try {
        // Get the access token from AsyncStorage
        const token = await AsyncStorage.getItem('access_token');
        console.log(token);
        if (!token) {
          console.log('No access token found');
          return;
        }

        // Fetch assessments from the backend
        const response = await fetch('http://127.0.0.1:5000/assessments', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch assessments');
        }

        const data = await response.json();
        setAssessments(data); // Assuming the response returns an array of assessments
      } catch (error) {
        setError('Error fetching assessments: ' + error);
        console.error('Error fetching assessments:', error);
      }
    };

    fetchAssessments();
  }, []);

  if (error) {
    return (
      <View style={styles.container}>
        <Text>{error}</Text>
      </View>
    );
  }

  if (!assessments.length) {
    return (
      <View style={styles.container}>
        <Text>Loading past assessments...</Text>
      </View>
    );
  }

  return (
    <View style={styles.outer}>
    <View style={styles.container}>
      <Text style={styles.heading}>Past Assessments</Text>
      {assessments.map((assessment, index) => (
        <View key={index} style={styles.assessmentItem}>
          <Text style={styles.assessmentText}>Assessment {assessment.id}</Text>
          <Text style={styles.assessmentText}>Date: {assessment.created_at}</Text>
          <Text style={styles.assessmentText}>Prediction: {mapping[assessment.prediction]}</Text>
        </View>
      ))}
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Text style={styles.backButtonText}>Back</Text>
      </TouchableOpacity>
    </View>
    <BottomNav/>
    </View>
  );
};

const styles = StyleSheet.create({
  outer:{
    flex:1,
    width:'100%',
  },
  container: {
    padding: 20,
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign:'center',
    marginTop:20,
  },
  assessmentItem: {
    marginBottom: 15,
    padding: 10,
    borderRadius: 8,
    backgroundColor: '#f4f4f4',
  },
  assessmentText: {
    fontSize: 16,
  },
  backButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#0098A5',
    borderRadius: 5,
  },
  backButtonText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
  },
});

export default PastAssessment;
