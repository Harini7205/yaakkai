import React from "react";
import { View, StyleSheet } from "react-native";
import { FontAwesome, FontAwesome5 } from "@expo/vector-icons";
import { useRouter } from "expo-router";

const BottomNavBar = () => {
  const router = useRouter();

  return (
    <View style={styles.navbar}>
      <FontAwesome name="home" size={24} color="white" onPress={() => router.push('../(main)/home')} />
      <FontAwesome5 name="file-alt" size={24} color="white" onPress={() => router.push('../(main)/pastassessments')} />
      <FontAwesome name="plus-circle" size={28} color="white" onPress={() => router.push('../(assessment)/smokequestion')} />
      <FontAwesome name="user" size={24} color="white" onPress={() => router.push('../(main)/profile')} />
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
    width: 250,
    justifyContent: "space-between",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
    alignItems:"center"
  },
});

export default BottomNavBar;
