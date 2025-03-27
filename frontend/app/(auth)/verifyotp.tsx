import { View, Text, StyleSheet, TextInput, TouchableOpacity, Image } from 'react-native';
import React, { useState, useRef } from 'react';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons'; 
import verifyOtpImage from "@assets/images/verify-otp.png"; 

const VerifyOtp: React.FC = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  const email = params.email as string;

  const [otp, setOtp] = useState<string[]>(new Array(6).fill(""));
  const otpInputs = useRef<Array<TextInput | null>>([]);

  const handleChangeText = (text: string, index: number) => {
    if (text.length > 1) return;
    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);
    if (text !== "" && index < 5) otpInputs.current[index + 1]?.focus();
  };

  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === "Backspace" && index > 0 && otp[index] === "") {
      otpInputs.current[index - 1]?.focus();
    }
  };

  const handleResendOtp = async () => {
    try {
      const response = await fetch('http://127.0.0.1:5000/auth/resend-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await response.json();
      alert(response.status === 200 ? 'A new OTP has been sent to your email.' : 'Failed to resend OTP: ' + data.message);
    } catch (error) {
      alert('An error occurred while resending OTP.');
    }
  };

  const handleOtpVerification = async () => {
    const enteredOtp = otp.join("");
    if (enteredOtp.length !== 6) {
      alert("Please enter a valid 6-digit OTP.");
      return;
    }
    try {
      const response = await fetch('http://127.0.0.1:5000/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp: enteredOtp }),
      });
      const data = await response.json();
      if (response.status === 200) {
        alert('OTP verified successfully');
        router.push('/(main)/home');
      } else {
        alert('OTP verification failed: ' + data.message);
      }
    } catch (error) {
      alert('An error occurred during OTP verification');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.topSection}>
        <TouchableOpacity onPress={() => router.push('/(auth)/signup')} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Image source={verifyOtpImage} style={styles.image} />
      </View>

      <View style={styles.contentSection}>
        <Text style={styles.otpText}>Enter Verification Code</Text>
        <Text style={styles.subText}>An OTP of 6 digits has been send to email {email}</Text>

        <View style={styles.otpContainer}>
          {otp.map((digit, index) => (
            <TextInput
              key={index}
              ref={(input) => (otpInputs.current[index] = input)}
              style={styles.otpBox}
              value={digit}
              onChangeText={(text) => handleChangeText(text, index)}
              keyboardType="numeric"
              maxLength={1}
              onKeyPress={(e) => handleKeyPress(e, index)}
              textAlign="center"
            />
          ))}
        </View>

        <TouchableOpacity onPress={handleOtpVerification} style={styles.button}>
          <Text style={styles.buttonText}>VERIFY OTP</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={handleResendOtp}>
          <Text style={styles.resendLink}>Didn't receive an OTP? Resend</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default VerifyOtp;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#009DA5',
  },
  topSection: {
    flex: 1.5,
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
    width: 280,
    height: 280,
    resizeMode: 'contain',
  },
  contentSection: {
    flex: 1.5,
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop:50,
    paddingBottom: 40,
    backgroundColor:"white",
    borderTopLeftRadius:50,
    borderTopRightRadius:50,
  },
  otpText: {
    fontSize: 25,
    fontWeight: 'bold',
    color: '#525252',
  },
  subText: {
    textAlign: 'center',
    color: 'gray',
    marginTop: 10,
    marginHorizontal:20,
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    width: '80%',
    marginBottom:20,
  },
  otpBox: {
    width: 50,
    height: 50,
    borderWidth: 1,
    borderColor: 'lightgrey',
    borderRadius: 10,
    fontSize: 22,
    backgroundColor: '#f9f9f9',
    textAlign:'center',
  },
  button: {
    width: '80%',
    height: 50,
    backgroundColor: '#009DA5',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 25,
    marginTop: 20,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    letterSpacing: 2,
  },
  resendLink: {
    marginTop: 15,
    fontSize: 16,
    color: '#009DA5',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});