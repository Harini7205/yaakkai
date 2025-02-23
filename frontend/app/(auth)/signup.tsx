import { View, TouchableOpacity, Text, StyleSheet, Image, TextInput } from 'react-native';
import React, { useState } from 'react';
import { Picker } from '@react-native-picker/picker';
import signupImage from "@/assets/images/signup-image.png";
import googleLogoImage from "@/assets/images/google-logo.png";
import { useRouter } from 'expo-router';
import { AntDesign } from '@expo/vector-icons'; 

const SignUp:React.FC = () => {
  const router = useRouter();
  const [firstname, setFirstName] = useState<string>('');
  const [lastname, setLastName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [gender, setGender] = useState<string>('');
  const [age, setAge] = useState<number>(18);

  const increaseAge = () => {
    setAge(prevAge => (prevAge + 1));
  };

  const decreaseAge = () => {
    setAge(prevAge => (prevAge > 0 ? prevAge - 1 : 0));
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={()=>router.push('../login')}>
        <AntDesign name='arrowleft' color='black' size={20} />
      </TouchableOpacity>
      <Image source={signupImage} style={styles.image} />
      <Text style={styles.signuptitletext}>Signup</Text>

      {/* Input Fields */}
      <TextInput placeholder="First name" value={firstname} onChangeText={setFirstName} style={styles.input} />
      <TextInput placeholder="Last name" value={lastname} onChangeText={setLastName} style={styles.input} />
      <TextInput placeholder="Email" value={email} onChangeText={setEmail} style={styles.input} keyboardType="email-address" />
      <TextInput placeholder="Password" value={password} onChangeText={setPassword} style={styles.input} secureTextEntry />

      {/* Gender & Age Row */}
      <View style={styles.rowContainer}>
        {/* Gender Picker */}
        <View style={styles.genderContainer}>
          <Picker
            placeholder='Gender'
            selectedValue={gender}
            onValueChange={(itemValue) => setGender(itemValue)}
            style={styles.picker}
          >
            <Picker.Item label="Select Gender" value="" />
            <Picker.Item label="Male" value="male" />
            <Picker.Item label="Female" value="female" />
            <Picker.Item label="Other" value="other" />
          </Picker>
        </View>

        {/* Age Adjuster */}
        <View style={styles.ageContainer}>
          <TextInput 
            placeholder="Age" 
            value={age.toString()} 
            onChangeText={(text)=>setAge(Number(text)||0)} 
            keyboardType="numeric" 
            style={styles.ageInput} 
          />
          <View style={styles.ageButtons}>
            <TouchableOpacity onPress={increaseAge} style={styles.arrowButton}>
              <AntDesign name="caretup" size={16} color="black" />
            </TouchableOpacity>
            <TouchableOpacity onPress={decreaseAge} style={styles.arrowButton}>
              <AntDesign name="caretdown" size={16} color="black" />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Signup Button */}
      <TouchableOpacity onPress={() => console.log('Signup pressed')} style={styles.button}>
        <Text style={styles.buttonText}>Sign Up</Text>
      </TouchableOpacity>

      {/* Signup with Google */}
      <Text style={styles.signuptext}>or sign up with</Text>
      <TouchableOpacity onPress={() => router.push('../signupusinggoogle')}>
        <Image source={googleLogoImage} style={styles.googleicon} />
      </TouchableOpacity>
    </View>
  );
};

export default SignUp;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 20,
  },
  image: {
    width:200,
    height: 200,
    marginBottom: 10,
  },
  signuptitletext: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#525252',
    marginBottom: 20,
  },
  input: {
    width: '80%',
    height: 50,
    borderWidth: 1,
    borderColor: 'lightgrey',
    borderRadius: 20,
    marginBottom: 15,
    paddingLeft: 10,
    fontSize: 16,
  },
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '80%',
    marginBottom: 20,
  },
  genderContainer: {
    flex: 1,
    height:50,
    borderWidth: 1,
    borderColor: 'lightgrey',
    borderRadius: 20,
    marginRight: 10,
    paddingLeft:5,
    paddingRight:10,
  },
  pickerContainer: {
    flex: 1,
    overflow:'hidden',
    justifyContent: 'center',
    height:50,
  },
  picker: {
    width: '100%',
    height: 50,
    borderWidth:0,
    fontSize:16,
  },
  ageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height:50,
    borderWidth: 1,
    borderColor: 'lightgrey',
    borderRadius: 20,
    marginLeft: 10,
    overflow: 'hidden',
  },
  ageInput: {
    width: 60,
    height: 50,
    textAlign: 'center',
    fontSize: 16,
  },
  ageButtons: {
    flexDirection: 'column',
    backgroundColor: 'white',
    borderTopRightRadius: 20,
    borderBottomRightRadius: 20,
  },
  arrowButton: {
    paddingHorizontal: 10,
  },
  button: {
    width: '80%',
    height: 50,
    backgroundColor: '#009DA5',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    fontSize: 18,
    color: 'white',
    fontWeight: 'bold',
  },
  signuptext: {
    marginTop: 10,
    fontSize: 16,
  },
  googleicon: {
    marginTop: 15,
    height: 30,
    width: 30,
  },
});
