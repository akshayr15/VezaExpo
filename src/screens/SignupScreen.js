/* eslint-disable prettier/prettier */
// eslint-disable-next-line prettier/prettier
// eslint-disable-next-line prettier/prettier
import React, { useState, useEffect } from "react";
import {
  View,
  KeyboardAvoidingView,
  SafeAreaView,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
  Alert,
  Image,
  ActivityIndicator,
} from "react-native";
import * as Progress from "react-native-progress";
import { TextInput, Button } from "react-native-paper";

import firebase from "../../firebase/fire";

import { random } from "nanoid/non-secure";
import * as ImagePicker from "expo-image-picker";

export default function SignupScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [file, setFile] = useState("");
  const [password, setPassword] = useState("");
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showNext, setshowNext] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [transferred, setTransferred] = useState(0);
  useEffect(async () => {
    if (Platform.OS !== "web") {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        alert("permisson denied");
      }
    }
    getresponse();
  }, []);
  if (loading) {
    return <ActivityIndicator size="large" color="red" />;
  }
  const min = 1;
  const max = 100;
  const rand = min + Math.random() * (max - min);
  const userSignup = async () => {
    setLoading(true);
    if (!email || !password || !image || !name) {
      alert("please add all the field");
      navigation.navigate()("Signup");
      return;
    }
    try {
      const result = await firebase
        .auth()
        .createUserWithEmailAndPassword(email, password);
      firebase.firestore().collection("users").doc(result.user.uid).set({
        name: name,
        email: result.user.email,
        uid: result.user.uid,
        pic: image,
        status: "online",
      });
      alert("User Signup success");
      setLoading(false);
    } catch (err) {
      alert(err);
    }
  };
  const pickImageAndUpload = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [7, 6],
      quality: 1,
    });
    console.log(result);
    alert("Image Uploaded Successfully");
    if (!result.cancelled) {
      console.log("Failed");
    }
    (async () => {
      // console.log(abcd, '==== file');
      const response = await fetch(result.uri);
      // console.log(response, '==== response');
      const blob = await response.blob();
      var ref = firebase.storage().ref(`/userprofile/${rand}`).put(blob);
      ref.on(
        firebase.storage.TaskEvent.STATE_CHANGED,
        (snapshot) => {
          let progress = (
            (snapshot.bytesTransferred / snapshot.totalBytes) *
            100
          ).toFixed(0);
          console.log("Upload is " + progress + "% complete");
          console.log(snapshot.state);
          if (progress == 100) {
            console.log("sucess");
            firebase
              .storage()
              .ref(`/userprofile/${rand}`)
              .getDownloadURL()
              .then((url) => {
                console.log(url, "=====url");
                setImage(url);
              });
          }
        },
        (error) => {
          console.log(error);
        }
      );
    })();
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
          {!showNext && (
            <>
              <TextInput
                style={styles.input}
                label="Email"
                mode="outlined"
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
            </>
          )}
          {showNext ? (
            <>
              <TextInput
                style={styles.input}
                label="Name"
                mode="outlined"
                value={name}
                onChangeText={(text) => setName(text)}
              />
              <Button
                style={styles.button}
                mode="contained"
                onPress={() => {
                  pickImageAndUpload();
                }}
              >
                Select Profile pic
              </Button>
              <Button
                style={styles.button}
                mode="contained"
                disabled={image ? false : true}
                onPress={() => {
                  userSignup();
                }}
              >
                Signup
              </Button>
            </>
          ) : (
            <Button
              style={styles.button}
              mode="contained"
              onPress={() => setshowNext(true)}
            >
              NEXT
            </Button>
          )}
          <TouchableOpacity>
            <Text
              style={{ textAlign: "center" }}
              onPress={() => navigation.goBack()}
            >
              Already Have Account?
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
