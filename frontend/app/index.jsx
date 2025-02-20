import { Pressable, StyleSheet , Image} from 'react-native'
import React from 'react'
import splashImage from "@/assets/images/yaakkai-splash.png";
import { useRouter } from 'expo-router';

const App = () => {
  const router=useRouter();
  return (
      <Pressable onPress={()=>router.push('/login')} style={styles.container}>
        <Image source={splashImage} style={styles.image}/>
      </Pressable>
  )
}

export default App

const styles = StyleSheet.create({
  container:{
    flex:1,
    backgroundColor:'#009DA5',
    justifyContent:'center',
    alignItems:'center'
  },
  image:{
    width:'90%',
    height:'30%',
    resizeMode:'contain',
    justifyContent:'center'
  }
})