import React, { useContext, useState } from "react";
import {
  View,
  StyleSheet,
  TextInput,
  Image,
  Text,
  FlatList,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import { colors } from "../globalStyles";
import { AuthContext } from "../context/AuthContext";
import { db } from "../firebase";
import {
  collection,
  doc,
  query,
  where,
  getDocs,
  setDoc,
  updateDoc,
  serverTimestamp,
  getDoc,
} from "firebase/firestore";
import UserCard from "../components/UserCard";

const Home = ({ navigation }) => {
  const [serachUsers, setSearchUsers] = useState([]);
  const { currentUser } = useContext(AuthContext);

  const handleSearch = async text => {
    // check if the search text is empty
    if (text.trim().lenght === 0) return;

    const q = query(
      collection(db, "users"),
      where("displayName", ">=", text),
      where("displayName", "<=", text + "\uf8ff"),
      where("displayName", "!=", currentUser.displayName)
    );
    try {
      const querySnapshot = await getDocs(q);
      let data = [];
      querySnapshot.forEach(doc => data.push(doc.data()));
      setSearchUsers(data);
    } catch (err) {
      console.log(err);
    }
  };

  const handleSelect = async user => {
    const combinedId =
      currentUser.uid > user.uid
        ? currentUser.uid + user.uid
        : user.uid + currentUser.uid;
    try {
      // check if the chat is exists
      const res = await getDoc(doc(db, "chats", combinedId));
      if (!res.exists()) {
        // create new chat
        await setDoc(doc(db, "chats", combinedId), { messages: [] });

        // update userChats
        await updateDoc(doc(db, "userChats", currentUser.uid), {
          [combinedId + ".userInfo"]: {
            uid: user.uid,
            displayName: user.displayName,
            photoURL: user.photoURL,
          },
          [combinedId + ".date"]: serverTimestamp(),
        });

        await updateDoc(doc(db, "userChats", user.uid), {
          [combinedId + ".userInfo"]: {
            uid: currentUser.uid,
            displayName: currentUser.displayName,
            photoURL: currentUser.photoURL,
          },
          [combinedId + ".date"]: serverTimestamp(),
        });
      } else {
        console.log(res.data().uid);
      }
    } catch (error) {
      console.log(error);
    }

    navigation.navigate("Chat", { user });
  };

  return (
    <View style={styles.container}>
      <View style={styles.userInfo}>
        <Image
          source={{
            uri: currentUser.photoURL,
          }}
          style={styles.userImg}
        />
        <View>
          <Text style={styles.username}>
            {currentUser.displayName.length > 22
              ? currentUser.displayName.slice(0, 20) + "..."
              : currentUser.displayName}
          </Text>
          <Text style={styles.useremail}>
            {" "}
            {currentUser.email.length > 24
              ? currentUser.email.slice(0, 22) + "..."
              : currentUser.email}
          </Text>
        </View>
      </View>

      <Text style={styles.label}>Search for friend....</Text>

      <View style={styles.inputWrapper}>
        <Icon name="search" size={33} color={colors.textSecondary} />
        <TextInput
          onChangeText={text => handleSearch(text.toLowerCase())}
          style={styles.input}
          placeholder="Tap here..."
        />
      </View>
      {serachUsers.length > 0 && (
        <FlatList
          data={serachUsers}
          renderItem={itemData => (
            <UserCard handleSelect={handleSelect} user={itemData.item} />
          )}
          keyExtractor={item => item.uid}
        />
      )}
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backSecondary,
    padding: 16,
  },

  userInfo: {
    backgroundColor: colors.backPrimary,
    paddingHorizontal: 10,
    paddingVertical: 20,
    flexDirection: "row",
    alignItems: "center",
    marginTop: 30,
    borderRadius: 20,
  },

  userImg: {
    width: 95,
    height: 95,
    borderRadius: 50,
    marginRight: 10,
  },

  username: {
    fontSize: 18,
    fontWeight: "500",
    color: colors.textPrimary,
    marginBottom: 5,
    textTransform: "capitalize",
  },

  useremail: {
    fontSize: 16,
    fontWeight: "400",
    color: colors.textSecondary,
  },

  label: {
    fontSize: 20,
    color: colors.textSecondary,
    marginTop: 25,
  },

  inputWrapper: {
    backgroundColor: colors.backPrimary,
    padding: 10,
    flexDirection: "row",
    alignItems: "center",
    marginTop: 15,
    borderRadius: 10,
  },

  input: {
    fontSize: 16,
    flex: 1,
  },
});
