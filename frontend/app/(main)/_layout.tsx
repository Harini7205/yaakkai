import { Stack } from 'expo-router';

export default function MainLayout() {
  return (
    <Stack>
        <Stack.Screen name="home" options={{ headerShown: false }} />
        <Stack.Screen name="agequestion" options={{ headerShown: false }} />
        <Stack.Screen name="assessment" options={{ headerShown: false }} />        
        <Stack.Screen name="profile" options={{ headerShown: false }} />
        <Stack.Screen name="resultscreen" options={{ headerShown: false }} />
        <Stack.Screen name="pastassessments" options={{ headerShown: false }} />
    </Stack>
  );
}
