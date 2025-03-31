import React from "react";
import { View, StyleSheet } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { useRouter } from "expo-router";

const BottomNavBar = () => {
  const router=useRouter();
  return (
    <View style={styles.navbar}>
      <FontAwesome name="home" size={24} color="white" />
      <FontAwesome name="bar-chart" size={24} color="white" />
      <FontAwesome name="plus-circle" size={28} color="white" onPress={()=>router.push('../(assessment)/smokequestion')}/>
      <FontAwesome name="user" size={24} color="white" />
    </View>
  );
};

const styles = StyleSheet.create({
  navbar: {
    position: "absolute",
    bottom: 20,
    alignSelf: "center",
    backgroundColor: "#009DA5",
    padding: 15,
    borderRadius: 30,
    flexDirection: "row",
    width: 280,
    justifyContent: "space-between",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
});

export default BottomNavBar;