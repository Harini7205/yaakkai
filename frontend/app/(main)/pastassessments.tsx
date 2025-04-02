import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BACKEND_URL } from '../config';
import Linechart from './linechart';
import BottomNavBar from './bottomnavigationbar';

const PastAssessment = () => {
  interface Assessment {
    id: number;
    created_at: string;
    prediction: '0' | '1' | '2' | '3';
  }

  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAssessments = async () => {
      try {
        const token = await AsyncStorage.getItem('access_token');
        if (!token) {
          setError('No access token found');
          return;
        }

        const response = await fetch(`${BACKEND_URL}/assessments`, {
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
        setAssessments(data);
      } catch (error) {
        setError('Error fetching assessments: ' + (error instanceof Error ? error.message : 'Unknown error'));
      }
    };

    fetchAssessments();
  }, []);

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  if (!assessments.length) {
    return (
      <View style={styles.container}>
        <Text style={styles.noAssessmentText}>
          Take an assessment to view your risk level of CVD. Click the plus icon in the nav bar to take a new assessment.
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Past Assessments</Text>
      <FlatList
        data={assessments}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }: { item: Assessment }) => (
          <View style={styles.assessmentItem}>
            <Text style={styles.assessmentText}>Date: {item.created_at || "Unknown date"}</Text>
            <Text style={styles.assessmentText}>Risk Level: {item.prediction || "Unknown"}</Text>
          </View>
        )}
      />
      <Text style={{textAlign:"center",fontSize:22,fontWeight:"bold", marginTop:10}}>Past Risk Trends</Text>
      <Linechart />
      <BottomNavBar />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 40,
    backgroundColor: '#fff',
    paddingVertical:40,
    paddingBottom:60,
  },
  heading: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  assessmentItem: {
    padding: 15,
    borderRadius: 8,
    backgroundColor: '#f4f4f4',
    marginBottom: 10,
  },
  assessmentText: {
    fontSize: 16,
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
  },
  noAssessmentText: {
    fontSize: 16,
    textAlign: 'center',
    color: '#555',
    marginTop: 20,
  },
});

export default PastAssessment;
