import { Stack } from 'expo-router';
import { FormDataProvider } from './FormDataProvider';

export default function MainLayout() {
  return (
    <FormDataProvider>
    <Stack>        
        <Stack.Screen name="smokequestion" options={{ headerShown: false }} />
        <Stack.Screen name="sedentaryhours" options={{ headerShown: false }} />
        <Stack.Screen name="hypertension" options={{ headerShown: false }} />
        <Stack.Screen name="sleephours" options={{ headerShown: false }} />
        <Stack.Screen name="social" options={{ headerShown: false }} />
        <Stack.Screen name="physicalactivity" options={{ headerShown: false }} />
        <Stack.Screen name="drinking" options={{ headerShown: false }} />
        <Stack.Screen name="dietary" options={{ headerShown: false }} />
        <Stack.Screen name="stress" options={{ headerShown: false }} />
        <Stack.Screen name="twoinone1" options={{ headerShown: false }} />
    </Stack>
    </FormDataProvider>
  );
}
