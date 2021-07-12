import React, { useState, useEffect } from "react";
import { GiftedChat, Bubble, InputToolbar } from "react-native-gifted-chat";

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
export default function LoginScreen({ user, route, navigation }) {
  const [messages, setMessages] = useState([]);
  const { uid } = route.params;
  const getAllMessages = async () => {
    /* const docid = uid > user.uid ? user.uid + "-" + uid : uid + "-" + user.uid;
    const querySnap = await firebase
      .firestore()
      .collection("chatrooms ")
      .doc(docid)
      .collection("messages")
      .orderBy("createdAt", "desc")
      .get();
    const allmsg = querySnap.docs.map((docSnap) => {
      return {
        ...docSnap.data(),
        createdAt: docSnap.data().createdAt.toDate(),
      };
    });
    setMessages(allmsg); */
    const docid = uid > user.uid ? user.uid + "-" + uid : uid + "-" + user.uid;
    const messageRef = firebase
      .firestore()
      .collection("chatrooms")
      .doc(docid)
      .collection("messages")
      .orderBy("createdAt", "desc");

    const unSubscribe = messageRef.onSnapshot((querySnap) => {
      const allmsg = querySnap.docs.map((docSanp) => {
        const data = docSanp.data();
        if (data.createdAt) {
          return {
            ...docSanp.data(),
            createdAt: docSanp.data().createdAt.toDate(),
          };
        } else {
          return {
            ...docSanp.data(),
            createdAt: new Date(),
          };
        }
      });
      setMessages(allmsg);
    });

    return () => {
      unSubscribe();
    };
  };
  useEffect(() => {
    getAllMessages();
  }, []);
  const onSend = (messageArray = []) => {
    const msg = messageArray[0];
    const mymsg = {
      ...msg,
      sentBy: user.uid,
      sentTo: uid,
      createdAt: new Date(),
    };

    setMessages((previousMessages) =>
      GiftedChat.append(previousMessages, mymsg)
    );
    const docid = uid > user.uid ? user.uid + "-" + uid : uid + "-" + user.uid;
    firebase
      .firestore()
      .collection("chatrooms")
      .doc(docid)
      .collection("messages")
      .add({
        ...mymsg,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      });
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#1E2D3B" }}>
      <GiftedChat
        messages={messages}
        onSend={(text) => onSend(text)}
        user={{
          _id: user.uid,
        }}
        renderBubble={(props) => {
          return (
            <Bubble
              {...props}
              wrapperStyle={{
                right: {
                  backgroundColor: "#000000",
                },
              }}
            />
          );
        }}
        renderInputToolbar={(props) => {
          return (
            <InputToolbar
              {...props}
              containerStyle={{ borderTopWidth: 1.5, borderTopColor: "black" }}
              textInputStyle={{ color: "black" }}
            />
          );
        }}
      />
    </View>
  );
}
const styles = StyleSheet.create({});
