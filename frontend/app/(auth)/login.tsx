import { View, TouchableOpacity, Text, StyleSheet , Image, TextInput, Button} from 'react-native'
import React from 'react';
import { useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import loginImage from "@assets/images/login-image.png";
import googleLogoImage from "@assets/images/google-logo.png";
import { useRouter } from 'expo-router';

const Login:React.FC = () => {
  const router=useRouter();
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const handleLogin = async () => {
    try {
      const response = await fetch('http://127.0.0.1:5000/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await response.json();

      if (response.status === 200) {
        console.log('Login successful', data.message, data.access_token);
        await AsyncStorage.setItem('access_token', data.access_token);
        router.push('/(main)/home'); 
      } else {
        console.error('Login failed', data.message);
        alert('Login failed: ' + data.message);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred during login');
    }
  };

  return (
    <View style={styles.container}>
      <Image
        source={loginImage}
        style={styles.image}
      />
      <Text style={styles.logintext}>Login</Text>
      <TextInput 
        placeholder="Email" 
        value={email}
        onChangeText={setEmail}
        style={styles.input}
        keyboardType='email-address'
      />
      <TextInput 
        placeholder="Password" 
        value={password}
        onChangeText={setPassword}
        style={styles.input}
        secureTextEntry
      />
      <TouchableOpacity onPress={handleLogin} style={styles.button}>
        <Text style={styles.buttonText}>Continue</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={()=>router.push('../signup')}>
        <Text style={styles.signuptext}>New To Yaakai? <Text style={styles.signuplink}>Sign Up Now</Text></Text>
      </TouchableOpacity>
      <Text style={styles.signuptext}>or sign up using</Text>
      <TouchableOpacity onPress={()=>router.push('../signupusinggoogle')}>
        <Image source={googleLogoImage} style={styles.googleicon}/>
      </TouchableOpacity>      
    </View>
  )
}

export default Login

const styles = StyleSheet.create({
  container:{
    flex:1,
    justifyContent:'center',
    alignItems:'center',
    flexDirection:'column',
    backgroundColor:'white'
  },
  image:{
    width:300,
    height:300,
    marginBottom:2,
  },
  logintext:{
    fontSize:22,
    fontWeight:'bold',
    color:'#525252',
    marginBottom:20,
  },
  input:{
    width:'80%',
    height:60,
    borderWidth:1,
    borderColor:'lightgrey',
    borderRadius:20,
    marginBottom:20,
    paddingLeft:10,
    fontSize:16,
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 2}, 
    shadowOpacity: 0.2, 
    shadowRadius: 2, 
  },
  button:{
    width:'60%',
    height:50,
    justifyContent:'center',
    alignItems:'center',
    marginTop:10,
    backgroundColor:'#009DA5',
    borderRadius:20,
  },
  buttonText:{
    color:"white",
    fontSize:20,
    fontWeight:'bold'
  },
  signuptext:{
    marginTop:10,
    fontSize:20,
  },
  signuplink:{
    color:"#009DA5",
    fontSize:20,
    fontWeight:'bold'
  },
  googleicon:{
    marginTop:20,
    height:27,
    width:27
  },
})