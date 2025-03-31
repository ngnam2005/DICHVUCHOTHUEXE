import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import LoginScreen from './screens/loginScreen';
import NavigationWelcome from './navigation/navigationWelcome';
import HomeScreen from './screens/HomeScreen';
import Navigation from './navigation/navigationBottom';
import VerifyOtpScreen from './screens/verify_OTP';
import ForgotPasswordScreen from './screens/ForgotPassScreen';





export default function App() {
  return (
    
      // <ForgotPasswordScreen/>
    <NavigationWelcome />

  );
}
