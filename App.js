import { StatusBar } from "react-native";
import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import SignupScreen from "./src/screens/SignupScreen";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import LoginScreen from "./src/screens/LoginScreen";
import HomeScreen from "./src/screens/HomeScreen";
import ChatScreen from "./src/screens/ChatScreen";
import firebase from "./firebase/fire";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { LogBox } from "react-native";
LogBox.ignoreLogs(["Warning: ..."]); // Ignore log notification by message
LogBox.ignoreAllLogs();
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

const App = () => {
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
        <Stack.Navigator
          screenOptions={{
            headerTintColor: "red",
          }}
        >
          {user ? (
            <>
              <Stack.Screen
                name="Home"
                options={{
                  headerRight: () => (
                    <MaterialIcons
                      name="account-circle"
                      size={34}
                      color="red"
                      onPress={() => {
                        firebase.auth().signOut();
                      }}
                    />
                  ),
                  title: "Veza",
                }}
              >
                {(props) => <HomeScreen {...props} user={user} />}
              </Stack.Screen>
              <Stack.Screen
                name="chat"
                options={({ route }) => ({ title: route.params.name })}
              >
                {(props) => <ChatScreen {...props} user={user} />}
              </Stack.Screen>
            </>
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
