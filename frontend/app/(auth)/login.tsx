import { View, TouchableOpacity, Text, StyleSheet, Image, TextInput} from 'react-native';
import React, { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons'; // For back button icon
import loginImage from "@assets/images/login-image.png";
import googleLogoImage from "@assets/images/google-logo.png";
import { Checkbox } from 'react-native-paper';
import { useLanguage } from '../config/(lang)/LanguageContext';

type TranslationKeys = "login_title" | "login_subtitle" | "email" | "password" | "remember_me" | "forgot_password" | "login_button" | "signup_prompt" | "signup_link" | "or_use_email" | "signup_now";

const Login: React.FC = () => {
  const router = useRouter();
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [rememberMe, setRememberMe] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const { t } = useLanguage() as { t: (key: TranslationKeys) => string };

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
      <View style={styles.topSection}>
        <TouchableOpacity onPress={() => router.push('/(auth)/langselection')} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Image source={loginImage} style={styles.image} />
      </View>

      <View style={styles.loginHeader}>
        <Text style={styles.loginText}>{t("login_title")}</Text>
      </View>

      <View style={styles.bottomSection}>
        <View style={styles.socialIcons}>
          <TouchableOpacity onPress={()=>router.push('/(auth)/signupusinggoogle')}>
            <Image source={googleLogoImage} style={styles.socialIcon} />
          </TouchableOpacity>
        </View>
        <Text style={{ textAlign: 'center', color: 'gray', margin: 10, marginBottom: 20 }}>{t('or_use_email')}</Text>
        
        <TextInput 
          placeholder={t('email')} 
          value={email}
          onChangeText={setEmail}
          style={styles.input}
          keyboardType='email-address'
        />
        <View style={styles.passwordContainer}>
          <TextInput 
            placeholder={t('password')} 
            value={password}
            onChangeText={setPassword}
            style={styles.passwordInput}
            secureTextEntry={!showPassword}
          />
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
            <Ionicons name={showPassword ? "eye" : "eye-off"} size={24} color="gray" />
          </TouchableOpacity>
        </View>

        <View style={styles.rememberMe}>
          <TouchableOpacity onPress={() => setRememberMe(!rememberMe)}>
            <Checkbox.Android status={rememberMe ? 'checked' : 'unchecked'} color="#009DA5" />
          </TouchableOpacity>
          <Text style={styles.rememberText}>{t('remember_me')}</Text>
        </View>
        <TouchableOpacity onPress={() => router.push('/(auth)/forgotpassword')}>
          <Text style={styles.forgotPassword}>{t('forgot_password')}</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={handleLogin} style={styles.button}>
          <Text style={styles.buttonText}>{t('login_button')}</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push('../signup')}>
          <Text style={styles.signupText}>{t('signup_prompt')} <Text style={styles.signupLink}>{t('signup_now')}</Text></Text>
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
    flex: 1.75,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    marginBottom: 60,
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
    paddingVertical: 10, 
    alignItems: 'center',
    borderTopStartRadius: 50,
    borderTopEndRadius: 50,
    height: 160, 
    textAlign:'center',
  },
  loginText: {
    fontSize: 22, 
    fontWeight: 'bold',
    color: '#525252',
    textAlign: 'center',
    flexWrap: 'wrap',
    lineHeight: 35, 
  },
  bottomSection: {
    flex: 3,
    backgroundColor: 'white',
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
    paddingVertical: 15, 
    paddingHorizontal: 22, 
    alignItems: 'center',
    marginTop: -70,
  },
  socialIcons: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  socialIcon: {
    width: 42,
    height: 42,
    marginHorizontal: 10,
  },
  input: {
    width: '95%', 
    height: 58, 
    borderWidth: 1,
    borderColor: 'lightgrey',
    borderRadius: 20,
    paddingHorizontal: 18,
    fontSize: 16, 
    lineHeight: 26, 
    marginBottom: 15,
    backgroundColor: '#f9f9f9',
  },
  optionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '95%',
    alignItems: 'center',
    marginBottom: 15,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '95%',
    height: 58, 
    borderWidth: 1,
    borderColor: 'lightgrey',
    borderRadius: 20,
    backgroundColor: '#f9f9f9',
    marginBottom: 15,
    paddingHorizontal: 18,
  },
  passwordInput: {
    flex: 1,
    fontSize: 16,
    lineHeight: 26,
  },
  eyeIcon: {
    padding: 10,
  },
  rememberMe: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  rememberText: {
    fontSize: 15, 
    color: '#525252',
  },
  forgotPassword: {
    color: '#009DA5',
    fontSize: 15,
    fontWeight: 'bold',
    flexWrap: 'wrap',
  },
  button: {
    width: '85%', 
    height: 55, 
    backgroundColor: '#009DA5',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 25,
    marginTop: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 17, 
    letterSpacing: 1.5, 
  },
  signupText: {
    marginTop: 15,
    fontSize: 15,
    textAlign: 'center',
  },
  signupLink: {
    color: "#009DA5",
    fontWeight: 'bold',
  },
});