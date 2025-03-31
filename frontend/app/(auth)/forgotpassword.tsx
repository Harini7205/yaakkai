import { View, TouchableOpacity, Text, StyleSheet, TextInput, Image } from 'react-native';
import React, { useState } from 'react';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useLanguage } from '../config/(lang)/LanguageContext';
import resetPasswordImage from "@assets/images/forgot-password.png";

const ForgotPassword: React.FC = () => {
  const router = useRouter();
  const { t } = useLanguage();
  
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const handleResetPassword = async () => {
    if (password !== confirmPassword) {
      alert(t("passwords_do_not_match"));
      return;
    }

    try {
      const response = await fetch('http://192.168.1.7:5000/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, 'new_password': password }),
      });

      const data = await response.json();

      if (response.status === 200) {
        alert(t("reset_success"));
        router.push('/(auth)/login');
      } else {
        alert(t("reset_failed") + data.message);
      }
    } catch (error) {
      alert(t("reset_error"));
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.topSection}>
        <TouchableOpacity onPress={() => router.push('/(auth)/login')} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Image source={resetPasswordImage} style={styles.image} />
      </View>
      <View style={styles.loginHeader}>
        <Text style={styles.loginText}>{t("reset_password")}</Text>
      </View>
      <View style={styles.bottomSection}>
        <TextInput placeholder={t("email")} value={email} onChangeText={setEmail} style={styles.input} keyboardType='email-address' />
        <View style={styles.passwordContainer}>
          <TextInput placeholder={t("new_password")} value={password} onChangeText={setPassword} style={styles.passwordInput} secureTextEntry={!showPassword} />
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
            <Ionicons name={showPassword ? "eye" : "eye-off"} size={24} color="gray" />
          </TouchableOpacity>
        </View>
        <View style={styles.passwordContainer}>
          <TextInput placeholder={t("confirm_password")} value={confirmPassword} onChangeText={setConfirmPassword} style={styles.passwordInput} secureTextEntry={!showPassword} />
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
            <Ionicons name={showPassword ? "eye" : "eye-off"} size={24} color="gray" />
          </TouchableOpacity>
        </View>
        <TouchableOpacity onPress={handleResetPassword} style={styles.button}>
          <Text style={styles.buttonText}>{t("reset_password_button")}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ForgotPassword;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#009DA5',
  },
  topSection: {
    flex: 2,
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
    marginTop: 180,
    width: 280,
    height: 280,
    resizeMode: 'contain',
    marginBottom: 20,
  },
  loginHeader: {
    backgroundColor: '#EDEDED',
    paddingTop: 20,
    alignItems: 'center',
    borderTopStartRadius: 50,
    borderTopEndRadius: 50,
    height: 120,
    marginTop:50,
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
    paddingVertical: 30,
    paddingHorizontal: 20,
    alignItems: 'center',
    marginTop: -50,
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
    marginBottom: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    letterSpacing: 2,
    textAlign:"center",
  },
});
