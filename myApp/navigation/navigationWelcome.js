import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import WelcomeScreen from "../screens/welcomeScreen";
import LoginScreen from "../screens/loginScreen";
import RegisterScreen from "../screens/registerScreen";
import { Provider } from "react-redux";
import store from "../redux/store";
import HomeScreen from "../screens/HomeScreen";
import ForgotPasswordScreen from "../screens/ForgotPassScreen";
import Navigation from "./navigationBottom";
import VerifyOtpScreen from "../screens/verify_OTP";







const Stack = createStackNavigator();
const Tab = createMaterialTopTabNavigator();

const AuthTabs = () => (
  <Tab.Navigator>
    <Tab.Screen name="Login" component={LoginScreen} options={{ title: "Đăng Nhập" }} />
    <Tab.Screen name="Register" component={RegisterScreen} options={{ title: "Đăng Ký" }} />
  </Tab.Navigator>
);

const NavigationWelcome = () => (
  <Provider store={store}>
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Welcome" component={WelcomeScreen} />
        <Stack.Screen name="Auth" component={AuthTabs} />
        <Stack.Screen name="HomeScreen" component={Navigation} />
        <Stack.Screen name="ForgotPass" component={ForgotPasswordScreen}/>
        <Stack.Screen name="VerifyOTP" component={VerifyOtpScreen}/>
      </Stack.Navigator>
    </NavigationContainer>
  </Provider>

);

export default NavigationWelcome;
