import {
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
  FlatList,
  ActivityIndicator,
} from "react-native";
import React, {
  useContext,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { colors } from "../globalStyles";
import Icon from "react-native-vector-icons/MaterialIcons";
import ChatCard from "../components/ChatCard";
import { AuthContext } from "../context/AuthContext";
import {
  collection,
  doc,
  getDocs,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import { auth, db } from "../firebase";
import { getAuth } from "firebase/auth";

const ChatsList = ({ navigation }) => {
  const [allChats, setAllChats] = useState([]);
  const [chats, setChats] = useState(allChats);
  const [uploading, setUploading] = useState(false);

  const { currentUser } = useContext(AuthContext);

  const handleSearch = async text => {
    if (text.trim().length === 0) {
      setChats(allChats);
    } else {
      const newChats = Object.entries(chats).filter(c =>
        c[1].userInfo.displayName.includes(text)
      );
      setChats(Object.fromEntries(newChats));
    }
  };

  useLayoutEffect(() => {
    const getData = () => {
      setUploading(true);
      const unsub = onSnapshot(doc(db, "userChats", currentUser.uid), doc => {
        setAllChats(doc.data());
        setChats(doc.data());
        setUploading(false);
      });

      return () => {
        unsub();
      };
    };

    currentUser.uid && getData();
  }, [currentUser.uid]);

  return (
    <View style={styles.container}>
      <View style={styles.inputWrapper}>
        <Icon name="search" size={35} color={colors.textSecondary} />
        <TextInput
          onChangeText={text => handleSearch(text)}
          placeholder="Search message..."
          style={styles.input}
        />
      </View>

      {uploading ? (
        <ActivityIndicator
          style={{ marginTop: 50 }}
          size="large"
          color={colors.textSecondary}
        />
      ) : (
        <FlatList
          data={Object.entries(chats).sort(
            (a, b) => a[1].date?.seconds < b[1].date?.seconds
          )}
          renderItem={itemData => (
            <ChatCard navigation={navigation} chat={itemData.item[1]} />
          )}
          keyExtractor={item => item[0]}
        />
      )}
    </View>
  );
};

export default ChatsList;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backSecondary,
    padding: 16,
  },

  inputWrapper: {
    backgroundColor: colors.backPrimary,
    padding: 12,
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
    borderRadius: 10,
  },

  input: {
    fontSize: 18,
    flex: 1,
    marginLeft: 5,
  },
});
