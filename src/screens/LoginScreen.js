/* eslint-disable prettier/prettier */
// eslint-disable-next-line prettier/prettier
// eslint-disable-next-line prettier/prettier
import React, { useState } from "react";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  Image,
  View,
  KeyboardAvoidingView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import firebase from "firebase";
import { TextInput, Button } from "react-native-paper";
export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  if (loading) {
    return <ActivityIndicator size="large" color="red" />;
  }
  const userLogin = async () => {
    setLoading(true);
    if (!email || !password) {
      alert("please add all the field");
      return;
    }
    try {
      const result = await firebase
        .auth()
        .signInWithEmailAndPassword(email, password);
      alert("Login Success");
      setLoading(false);
    } catch (err) {
      alert(err);
    }
  };
  return (
    <KeyboardAvoidingView behavior="position">
      <View>
        <View style={styles.box1}>
          <Text style={styles.text}>Welcome</Text>
          <Image
            style={styles.img}
            source={require("../assets/backgroud.jpg")}
          />
        </View>
        <View style={styles.box2}>
          <TextInput
            style={styles.input}
            label="Email"
            mode="outlined"
            right={<TextInput.Icon name="email" />}
            value={email}
            onChangeText={(text) => setEmail(text)}
          />
          <TextInput
            style={styles.input}
            label="Password"
            mode="outlined"
            value={password}
            onChangeText={(text) => setPassword(text)}
            secureTextEntry
          />

          <Button
            icon="login"
            style={styles.button}
            mode="contained"
            onPress={() => {
              userLogin();
            }}
          >
            NEXT
          </Button>
          <TouchableOpacity>
            <Text
              style={{ textAlign: "center" }}
              onPress={() => navigation.navigate("Signup")}
            >
              Dont have Account?
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
const styles = StyleSheet.create({
  input: {
    color: "black",
    height: 40,
    margin: 12,
    borderWidth: 0,
  },
  button: {
    alignSelf: "center",
    width: 200,
  },
  text: {
    fontSize: 22,
    color: "green",
  },
  img: {
    width: 200,
    height: 200,
  },
  box1: {
    alignItems: "center",
  },
  box2: {
    paddingHorizontal: 40,
    justifyContent: "space-evenly",
    height: "50%",
  },
});
