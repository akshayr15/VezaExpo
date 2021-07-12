import React, { useState, useEffect } from "react";
import firebase from "firebase";
import {
  StyleSheet,
  Image,
  View,
  FlatList,
  Text,
  Button,
  TouchableOpacity,
} from "react-native";
export default function HomeScreen({ user, navigation }) {
  const [users, setUser] = useState(null);
  const getUsers = async () => {
    const querSnap = await firebase
      .firestore()
      .collection("users")
      .where("uid", "!=", user.uid)
      .get();
    const allUser = querSnap.docs.map((docSnap) => docSnap.data());
    console.log(allUser, "======users========");
    setUser(allUser);
  };
  useEffect(() => {
    getUsers();
  }, []);
  const RenderCard = ({ item }) => {
    return (
      <TouchableOpacity
        onPress={() =>
          navigation.navigate("chat", { name: item.name, uid: item.uid })
        }
      >
        <View style={styles.mycard}>
          <Image source={{ uri: item.pic }} style={styles.img} />
          <View>
            <Text style={styles.text}>{item.name}</Text>
            <Text style={styles.text}>{item.email}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };
  return (
    <View>
      <FlatList
        data={users}
        renderItem={({ item }) => {
          return <RenderCard item={item} />;
        }}
        keyExtractor={(item) => item.uid}
      />
    </View>
  );
}
const styles = StyleSheet.create({
  img: { width: 60, height: 60, borderRadius: 30, backgroundColor: "red" },
  text: {
    fontSize: 18,
    marginLeft: 15,
    color: "black",
  },
  mycard: {
    flexDirection: "row",
    margin: 3,
    padding: 4,
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: "grey",
  },
});
