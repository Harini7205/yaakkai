import React, { useEffect, useState } from 'react';
import { ScrollView, View, Text, Image, TouchableOpacity, StyleSheet} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { AntDesign } from '@expo/vector-icons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { BACKEND_URL } from '../config';
import BottomNavBar from './bottomnavigationbar';

const Profile = () => {
  const router = useRouter();
  const [userData, setUserData] = useState({
    "name": "", "email": "", "gender": "", "age": "", "testsTaken": 0, "latestTestResult": "None"
  });

  useEffect(() => {
    const refreshAccessToken = async () => {
      try {
        const refreshToken = await AsyncStorage.getItem('refresh_token');
        if (!refreshToken) {
          console.log('No refresh token found');
          return null;
        }
  
        const response = await fetch('http://127.0.0.1:5000/auth/refresh', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ refresh_token: refreshToken }),
        });
  
        if (!response.ok) {
          console.log('Failed to refresh token');
          return null;
        }
  
        const data = await response.json();
        await AsyncStorage.setItem('access_token', data.access_token);
        return data.access_token;
      } catch (error) {
        console.error('Error refreshing token:', error);
        return null;
      }
    };
  
    // Function to fetch profile and handle expired tokens
    const fetchProfile = async () => {
      try {
        let token = await AsyncStorage.getItem('access_token');
        if (!token) {
          console.log('No access token found');
          return;
        }
  
        let response = await fetch(`${BACKEND_URL}/profile`, {
          method: 'GET',
          headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        });
  
        if (response.status === 401) {
          console.log('Access token expired, trying to refresh...');
          token = await refreshAccessToken();
  
          if (!token) {
            console.log('Token refresh failed. User needs to log in again.');
            alert('Session expired. Please log in again.');
            handleLogout();
            router.push('/(auth)/login');
            return;
          }
  
          // Retry fetching profile with the new token
          response = await fetch(`${BACKEND_URL}/profile`, {
            method: 'GET',
            headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
          });
        }
  
        if (!response.ok) throw new Error('Failed to fetch profile');
  
        const data = await response.json();
        setUserData(data);
        console.log('Profile Data:', data);
        return data;
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    };

    fetchProfile();
  }, []);

  if (!userData) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  const profilePic = userData.gender === 'Female'
    ? require('@/assets/images/female-icon.png')
    : require('@/assets/images/male-icon.png');

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('access_token');
      console.log('Success', 'Logged out successfully');
      router.push('/(auth)/login');
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.outer}>
    <View style={styles.container}>
      <View>
        <View style={styles.profileSection}>
          <Image source={profilePic} style={styles.profilePic} />

          <View style={styles.nameAndEmail}>
            <Text style={styles.userName}>{userData.name}</Text>
            <Text style={styles.userEmail}>{userData.email}</Text>
          </View>
        </View>
      </View>

      <View style={styles.profileCard}>
        <View style={[styles.cardColumn,styles.columnWithBorder]}>
          <Text style={styles.cardLabel}>Age</Text>
          <Text style={styles.cardData}>{userData.age}</Text>
        </View>
        <View style={[styles.cardColumn,styles.columnWithBorder]}>
          <Text style={styles.cardLabel}>Tests Taken</Text>
          <Text style={styles.cardData}>{userData.testsTaken}</Text>
        </View>
        <View style={styles.cardColumn}>
          <Text style={styles.cardLabel}>Latest Test Result</Text>
          <Text style={styles.cardData}>{userData.latestTestResult}</Text>
        </View>
      </View>

      {/* Options */}
      <View style={styles.optionsContainer}>
        <TouchableOpacity style={styles.option} onPress={() => router.push('/home')}>
          <Text style={styles.optionText}>Edit Profile</Text>
          <Text style={styles.optionText}>{'>'}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.option} onPress={() => router.push('/home')}>
          <Text style={styles.optionText}>Settings</Text>
          <Text style={styles.optionText}>{'>'}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.option} onPress={() => router.push('/home')}>
          <Text style={styles.optionText}>About Us</Text>
          <Text style={styles.optionText}>{'>'}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.logout} onPress={handleLogout}>
          <Ionicons name='log-out-outline' color='red' size={20} />
          <Text style={styles.logoutButtonText}>Logout</Text>
        </TouchableOpacity>
      </View>

      {/* Bottom Navigation */}
      </View>
      <BottomNavBar />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  outer:{
    flex:1,
    height:'100%',
    paddingBottom:80,
    backgroundColor:"#fff"
  },
  container: {
    padding:20,
    paddingTop:50,
  },
  profileSection: {
    flexDirection: 'column',
    alignItems: 'center',
  },
  profilePic: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginTop: 40,
  },
  nameAndEmail: {
    marginTop: 20,
    alignItems: 'center',
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  userEmail: {
    fontSize: 16,
  },
  profileCard: {
    flexDirection: 'row',
    backgroundColor: '#0098A5',
    padding: 20,
    borderRadius: 10,
    marginTop: 20,
    justifyContent: 'space-around',
    gap:10,
  },
  cardColumn: {
    flex: 1,
    alignItems: 'center',
    justifyContent:"center"
  },
  columnWithBorder: {
    borderRightWidth: 1,
    borderRightColor: 'rgba(255, 255, 255, 0.5)', 
  },
  cardLabel: {
    color: 'white',
    fontSize: 14,
    textAlign:"center"
  },
  cardData: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  optionsContainer: {
    marginTop: 20,
  },
  option: {
    padding: 15,
    borderRadius: 5,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  optionText: {
    fontSize: 20,
    textAlign: 'left',
  },
  logout: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    gap: 10,
    padding: 15,
    borderRadius: 5,
    marginBottom: 10,
  },
  logoutButtonText: {
    fontSize: 20,
    color: 'red',
  },
});

export default Profile;
