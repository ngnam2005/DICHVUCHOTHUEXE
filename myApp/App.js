import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import NavigationWelcome from './navigation/navigationWelcome';
import { ThemeProvider } from './components/darkScreen'; // ✅ đúng đường dẫn

export default function App() {
  return (
    <ThemeProvider>
      <NavigationWelcome />
    </ThemeProvider>
  );
}
