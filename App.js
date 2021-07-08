import { StatusBar } from "react-native";
import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import SignupScreen from "./src/screens/SignupScreen";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import LoginScreen from "./src/screens/LoginScreen";
import HomeScreen from "./src/screens/HomeScreen";
import firebase from "./firebase/fire";
//import auth from "@react-native-firebase/auth";
import { DefaultTheme, Provider as PaperProvider } from "react-native-paper";

const theme = {
  ...DefaultTheme,
  roundness: 2,
  colors: {
    ...DefaultTheme.colors,
    primary: "red",
  },
};
const Stack = createStackNavigator();
const Naviagtion = () => {
  const [user, setuser] = useState("");
  useEffect(() => {
    const unregister = firebase.auth().onAuthStateChanged((userExist) => {
      if (userExist) {
        firebase.firestore().collection("users").doc(userExist.uid).update({
          status: "online",
        });
        setuser(userExist);
      } else setuser("");
    });

    return () => {
      unregister();
    };
  }, []);
  return (
    <NavigationContainer>
      <Stack.Navigator>
        {user ? (
          <Stack.Screen
            name="Home"
            component={HomeScreen}
            options={{ headerShown: false }}
          />
        ) : (
          <>
            <Stack.Screen
              name="Login"
              component={LoginScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Signup"
              component={SignupScreen}
              options={{ headerShown: false }}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};
const App = () => {
  return (
    <>
      <PaperProvider theme={theme}>
        <StatusBar barStyle="light-content" backgroundColor="red" />
        <Naviagtion />
      </PaperProvider>
    </>
  );
};
export default App;
