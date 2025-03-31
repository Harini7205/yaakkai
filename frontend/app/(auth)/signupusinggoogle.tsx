import React, { useState } from "react";
import { View, Button, Text } from "react-native";
import * as WebBrowser from "expo-web-browser";
import * as SecureStore from "expo-secure-store";
import { useRouter } from "expo-router";

const backendUrl = "https://ad71-2401-4900-1ce0-7d42-c962-ff23-742f-aab1.ngrok-free.app";  // Change this when deploying

export default function SignInWithGoogle() {
  interface UserInfo {
    name: string;
    email: string;
    picture: string;
    access_token: string;
  }

  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const router = useRouter();

  const handleGoogleSignIn = async () => {
    const authUrl = `${backendUrl}/auth/google`; // Redirects to Google OAuth
    const result = await WebBrowser.openAuthSessionAsync(authUrl, backendUrl);
  
    if (result.type === "success" && result.url) {
      try {
        // Extract authorization code manually
        const params = new URL(result.url).searchParams;
        const code = params.get("code");
  
        if (code) {
          // Fetch token & user info from backend
          const response = await fetch(`${backendUrl}/auth/google/callback?code=${code}`);
          const data = await response.json();
  
          if (data.access_token) {
            // ✅ Store in Secure Storage
            await SecureStore.setItemAsync("access_token", data.access_token);
            await SecureStore.setItemAsync("user", JSON.stringify(data));
  
            // ✅ Update UI & Navigate to Home
            setUserInfo(data);
            router.replace("/home"); // Navigate to home page
          } else {
            console.error("Failed to authenticate:", data);
          }
        }
      } catch (error) {
        console.error("Error fetching user info:", error);
      }
    } else {
      console.error("Google Sign-In failed or canceled.");
    }
  };  

  return (
    <View>
      <Button title="Sign in with Google" onPress={handleGoogleSignIn} />
      {userInfo && <Text>Welcome, {userInfo.name}!</Text>}
    </View>
  );
}
