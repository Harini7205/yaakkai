import { View, TouchableOpacity, Text, StyleSheet, Image, TextInput } from 'react-native';
import React, { useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons'; // For icons
import signupImage from "@assets/images/signup-image.png";
import googleLogoImage from "@assets/images/google-logo.png";

const Signup: React.FC = () => {
  const router = useRouter();
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);

  const handleSignup = async () => {
    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    try {
      const response = await fetch('http://192.168.1.7:5000/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (response.status === 201) {
        console.log('Signup successful', data.message);
        await AsyncStorage.setItem('access_token', data.access_token);
        router.push({ pathname: '../(auth)/verifyotp', params: { email } });
      } else {
        alert('Signup failed: ' + data.message);
      }
    } catch (error) {
      console.error('Error during signup:', error);
      alert('An error occurred during signup');
    }
  };

  return (
    <View style={styles.container}>
      {/* Top Section with Image & Back Button */}
      <View style={styles.topSection}>
        <TouchableOpacity onPress={() => router.push('/(auth)/langselection')} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Image source={signupImage} style={styles.image} />
      </View>

      {/* Grey Background for Signup Header */}
      <View style={styles.signupHeader}>
        <Text style={styles.signupText}>Create an account</Text>
      </View>

      {/* Bottom Section with Form & Options */}
      <View style={styles.bottomSection}>
        {/* Social Signup */}
        <View style={styles.socialIcons}>
          <TouchableOpacity>
            <Image source={googleLogoImage} style={styles.socialIcon} />
          </TouchableOpacity>
        </View>
        <Text style={{ textAlign: 'center', color: 'gray', margin: 10, marginBottom: 20 }}>or sign up with email</Text>

        {/* Signup Form */}
        <TextInput 
          placeholder="Full Name" 
          value={name}
          onChangeText={setName}
          style={styles.input}
        />
        <TextInput 
          placeholder="Email" 
          value={email}
          onChangeText={setEmail}
          style={styles.input}
          keyboardType='email-address'
        />
        
        {/* Password Input with Toggle */}
        <View style={styles.passwordContainer}>
          <TextInput 
            placeholder="Password" 
            value={password}
            onChangeText={setPassword}
            style={styles.passwordInput}
            secureTextEntry={!showPassword}
          />
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
            <Ionicons name={showPassword ? "eye" : "eye-off"} size={24} color="gray" />
          </TouchableOpacity>
        </View>

        {/* Confirm Password Input with Toggle */}
        <View style={styles.passwordContainer}>
          <TextInput 
            placeholder="Confirm Password" 
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            style={styles.passwordInput}
            secureTextEntry={!showConfirmPassword}
          />
          <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)} style={styles.eyeIcon}>
            <Ionicons name={showConfirmPassword ? "eye" : "eye-off"} size={24} color="gray" />
          </TouchableOpacity>
        </View>

        {/* Signup Button */}
        <TouchableOpacity onPress={handleSignup} style={styles.button}>
          <Text style={styles.buttonText}>SIGN UP</Text>
        </TouchableOpacity>

        {/* Already have an account? */}
        <TouchableOpacity onPress={() => router.push('../login')}>
          <Text style={styles.loginText}>Already have an account? <Text style={styles.loginLink}>Login</Text></Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Signup;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#009DA5',
  },
  topSection: {
    flex: 2.0, 
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 20,
  },
  image: {
    marginTop: 40,
    width: 250,
    height: 250,
    resizeMode: 'contain',
  },
  signupHeader: {
    backgroundColor: '#EDEDED',
    paddingTop:20,
    paddingBottom:40,
    alignItems: 'center',
    borderTopStartRadius: 50,
    borderTopEndRadius: 50,
    height: 120,
  },
  signupText: {
    fontSize: 25,
    fontWeight: 'bold',
    color: '#525252',
  },
  bottomSection: {
    flex: 3, 
    backgroundColor: 'white',
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignItems: 'center',
    marginTop: -50, 
  },
  socialIcons: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  socialIcon: {
    width: 40,
    height: 40,
    marginHorizontal: 10,
  },
  input: {
    width: '90%',
    height: 55,
    borderWidth: 1,
    borderColor: 'lightgrey',
    borderRadius: 20,
    paddingHorizontal: 15,
    fontSize: 16,
    marginBottom: 15,
    backgroundColor: '#f9f9f9',
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '90%',
    height: 55,
    borderWidth: 1,
    borderColor: 'lightgrey',
    borderRadius: 20,
    backgroundColor: '#f9f9f9',
    marginBottom: 15,
    paddingHorizontal: 15,
  },
  passwordInput: {
    flex: 1,
    fontSize: 16,
  },
  eyeIcon: {
    padding: 10,
  },
  button: {
    width: '80%',
    height: 50,
    backgroundColor: '#009DA5',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 25,
    marginTop: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    letterSpacing: 2,
  },
  loginText: {
    marginTop: 15,
    fontSize: 16,
  },
  loginLink: {
    color: "#009DA5",
    fontWeight: 'bold',
  },
});
