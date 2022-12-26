import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  View,
  Image,
  ActivityIndicator,
} from "react-native";
import React, {
  useContext,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import Icon from "react-native-vector-icons/AntDesign";
import FeatherIcon from "react-native-vector-icons/Feather";
import IoniconsIcon from "react-native-vector-icons/Ionicons";
import { colors } from "../globalStyles";
import Message from "../components/Message";
import { useRoute } from "@react-navigation/native";
import {
  doc,
  onSnapshot,
  updateDoc,
  Timestamp,
  arrayUnion,
  serverTimestamp,
} from "firebase/firestore";
import { AuthContext } from "../context/AuthContext";
import * as ImagePicker from "expo-image-picker";
import { db, storage } from "../firebase";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

const Chat = ({ navigation }) => {
  const [messages, setMessages] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [text, setText] = useState("");
  let flatListRef = useRef();
  const { params } = useRoute();
  const user = params.user;
  const { currentUser } = useContext(AuthContext);

  const combinedId =
    currentUser.uid > user.uid
      ? currentUser.uid + user.uid
      : user.uid + currentUser.uid;

  const handleSend = async (type, content) => {
    if (content.trim().length === 0) return;
    setText("");
    try {
      await updateDoc(doc(db, "chats", combinedId), {
        messages: arrayUnion({
          type,
          content,
          date: Timestamp.now(),
          senderId: currentUser.uid,
        }),
      });

      // update userChats
      await updateDoc(doc(db, "userChats", currentUser.uid), {
        [combinedId + ".lastMessage"]: {
          type,
          content,
          date: Timestamp.now(),
          senderId: currentUser.uid,
        },
        [combinedId + ".date"]: serverTimestamp(),
      });

      await updateDoc(doc(db, "userChats", user.uid), {
        [combinedId + ".lastMessage"]: {
          type,
          content,
          date: Timestamp.now(),
          senderId: currentUser.uid,
        },
        [combinedId + ".date"]: serverTimestamp(),
      });
    } catch (err) {
      console.log(err);
    }
  };

  const uploadImage = async uri => {
    try {
      setUploading(true);
      const filename = uri.substring(uri.lastIndexOf("/") + 1);
      const response = await fetch(uri);
      const blobFile = await response.blob();

      const reference = ref(storage, filename);
      await uploadBytes(reference, blobFile).then(res => {
        getDownloadURL(res.ref).then(url => {
          handleSend("image", url);
          setUploading(false);
        });
      });
    } catch (err) {
      console.log(err);
      setUploading(false);
    }
  };

  const selectImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      quality: 1,
    });

    if (!result.canceled) {
      const uri = result.assets[0].uri;
      await uploadImage(uri);
    }
  };

  useLayoutEffect(() => {
    const getData = () => {
      const unsub = onSnapshot(doc(db, "chats", combinedId), doc => {
        setMessages(doc.data().messages);
      });
      return () => {
        unsub();
      };
    };

    currentUser.uid && getData();
  }, [combinedId]);

  return (
    <View style={styles.container}>
      <View style={styles.top}>
        <Icon
          onPress={() => navigation.navigate("ChatsList")}
          name="arrowleft"
          size={30}
        />
        <Image
          source={{
            uri: user.photoURL,
          }}
          style={styles.userImg}
        />

        <Text style={styles.username}>{user.displayName}</Text>
      </View>

      <View style={styles.messagesWrapper}>
        <FlatList
          ref={flatListRef}
          onContentSizeChange={() =>
            flatListRef.current.scrollToEnd({ animated: true })
          }
          onLayout={() => flatListRef.current.scrollToEnd({ animated: true })}
          data={messages}
          renderItem={itemData => <Message message={itemData.item} />}
          keyExtractor={item => item.date}
        />
      </View>

      <View style={styles.bottom}>
        <View style={styles.inputWrapper}>
          <TextInput
            value={text}
            onChangeText={t => setText(t)}
            style={styles.input}
            placeholder="Type here..."
          />
          {uploading ? (
            <ActivityIndicator size="large" color={colors.primaryColor} />
          ) : (
            <TouchableOpacity onPress={selectImage}>
              <FeatherIcon
                name="camera"
                size={30}
                color={colors.textSecondary}
              />
            </TouchableOpacity>
          )}
        </View>
        <TouchableOpacity onPress={() => handleSend("text", text)}>
          <IoniconsIcon name="md-send" size={30} color={colors.primaryColor} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Chat;

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.backSecondary,
    flex: 1,
    justifyContent: "space-between",
  },

  top: {
    padding: 20,
    paddingLeft: 15,
    borderBottomEndRadius: 20,
    borderBottomStartRadius: 20,
    backgroundColor: colors.backPrimary,
    height: 90,
    alignItems: "center",
    flexDirection: "row",
  },

  userImg: {
    width: 50,
    height: 50,
    borderRadius: 50,
    marginRight: 10,
    marginLeft: 20,
  },

  username: {
    fontSize: 18,
    fontWeight: "500",
    color: colors.textPrimary,
    marginBottom: 5,
    textTransform: "capitalize",
  },

  messagesWrapper: {
    flex: 1,
    padding: 10,
  },

  bottom: {
    padding: 10,
    borderTopEndRadius: 20,
    borderTopStartRadius: 20,
    backgroundColor: colors.backPrimary,
    height: 90,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },

  inputWrapper: {
    backgroundColor: colors.backSecondary,
    borderRadius: 20,
    padding: 10,
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    marginRight: 10,
  },
  input: {
    fontSize: 17,
    flex: 1,
  },
});
