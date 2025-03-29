import { View, TouchableOpacity, Text, StyleSheet, Image, TextInput} from 'react-native';
import React, { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons'; // For back button icon
import loginImage from "@assets/images/login-image.png";
import googleLogoImage from "@assets/images/google-logo.png";
import { Checkbox } from 'react-native-paper';

const Login: React.FC = () => {
  const router = useRouter();
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [rememberMe, setRememberMe] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);

  useEffect(() => {
    const loadRememberedEmail = async () => {
      const remember = await AsyncStorage.getItem('remember_me');
      if (remember === 'true') {
        const savedEmail = await AsyncStorage.getItem('saved_email');
        if (savedEmail) {
          setEmail(savedEmail);
          setRememberMe(true);
        }
      }
    };
  
    loadRememberedEmail();
  }, []);

  const handleLogin = async () => {
    try {
      const response = await fetch('http://192.168.1.7:5000/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
  
      const data = await response.json();
  
      if (response.status === 200) {
        console.log('Login successful', data.message);
  
        // Store tokens
        await AsyncStorage.setItem('access_token', data.access_token);
  
        // Save email if 'Remember Me' is checked
        if (rememberMe) {
          await AsyncStorage.setItem('remember_me', 'true');
          await AsyncStorage.setItem('saved_email', email);
        } else {
          await AsyncStorage.removeItem('remember_me');
          await AsyncStorage.removeItem('saved_email');
        }
  
        router.push('/(main)/home');
      } else {
        alert('Login failed: ' + data.message);
      }
    } catch (error) {
      console.error('Error during login:', error);
      alert('An error occurred during login');
    }
  };  

  return (
    <View style={styles.container}>
      {/* Top Section with Image & Back Button */}
      <View style={styles.topSection}>
        <TouchableOpacity onPress={() => router.push('/(auth)/langselection')} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Image source={loginImage} style={styles.image} />
      </View>

      {/* Grey Background for Login Header */}
      <View style={styles.loginHeader}>
        <Text style={styles.loginText}>Login to your account</Text>
      </View>

      {/* Bottom Section with Form & Options */}
      <View style={styles.bottomSection}>
        {/* Social Login */}
        <View style={styles.socialIcons}>
          <TouchableOpacity>
            <Image source={googleLogoImage} style={styles.socialIcon} />
          </TouchableOpacity>
        </View>
        <Text style={{textAlign:'center', color:'gray', margin:10, marginBottom:20}}>or use your email</Text>
        {/* Login Form */}
        <TextInput 
          placeholder="Email" 
          value={email}
          onChangeText={setEmail}
          style={styles.input}
          keyboardType='email-address'
        />
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

        {/* Remember Me & Forgot Password */}
        <View style={styles.optionsRow}>
          <View style={styles.rememberMe}>
            <TouchableOpacity onPress={() => setRememberMe(!rememberMe)}>
              <Checkbox.Android status={rememberMe ? 'checked' : 'unchecked'} color="#009DA5" />
            </TouchableOpacity>
            <Text style={styles.rememberText}>Remember me</Text>
          </View>
          <TouchableOpacity onPress={() => router.push('/(auth)/forgotpassword')}>
            <Text style={styles.forgotPassword}>Forgot Password?</Text>
          </TouchableOpacity>
        </View>

        {/* Login Button */}
        <TouchableOpacity onPress={handleLogin} style={styles.button}>
          <Text style={styles.buttonText}>LOGIN</Text>
        </TouchableOpacity>

        {/* Signup Option */}
        <TouchableOpacity onPress={() => router.push('../signup')}>
          <Text style={styles.signupText}>New to Yaakkai? <Text style={styles.signupLink}>Sign Up Now</Text></Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Login;

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
    marginBottom:60,
  },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 20,
  },
  image: {
    marginTop: 150,
    width: 280,
    height: 280,
    resizeMode: 'contain',
    marginBottom: 20,
  },
  loginHeader: {
    backgroundColor: '#EDEDED',
    paddingTop:20,
    paddingBottom:20,
    alignItems: 'center',
    borderTopStartRadius: 50,
    borderTopEndRadius: 50,
    height: 150,
  },
  loginText: {
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
    marginTop: -80, 
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
  optionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '90%',
    alignItems: 'center',
    marginBottom: 15,
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
  rememberMe: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rememberText: {
    marginLeft: 5,
    fontSize: 16,
    color: '#525252',
  },
  forgotPassword: {
    color: '#009DA5',
    fontSize: 16,
    fontWeight: 'bold',
  },
  button: {
    width: '80%',
    height: 50,
    backgroundColor: '#009DA5',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 25,
    marginTop: 10,
    marginBottom: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    letterSpacing:2,
  },
  signupText: {
    marginTop: 15,
    fontSize: 16,
  },
  signupLink: {
    color: "#009DA5",
    fontWeight: 'bold',
  },
});
