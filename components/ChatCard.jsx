import {
  StyleSheet,
  Text,
  View,
  Image,
  Touchable,
  TouchableOpacity,
  TouchableHighlight,
} from "react-native";
import React, { useEffect, useState } from "react";
import { colors } from "../globalStyles";
import ImageIcon from "react-native-vector-icons/Octicons";

const ChatCard = ({ navigation, chat }) => {
  const [date, setDate] = useState("00:00");

  useEffect(() => {
    const oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
    const today = new Date();
    const chatDate = new Date(chat.date?.seconds * 1000);
    const diffDays = Math.round(Math.abs((today - chatDate) / oneDay));
    if (diffDays === 0) {
      setDate(
        new Date(chat.date?.seconds * 1000).toLocaleTimeString().slice(0, 5)
      );
    } else if (diffDays <= 7) {
      setDate(new Date(chat.date?.seconds * 1000).toDateString().slice(0, 3));
    } else {
      setDate(new Date(chat.date?.seconds * 1000).toDateString().slice(4, 10));
    }
  }, [chat]);

  return (
    <TouchableHighlight
      style={{ marginTop: 20 }}
      onPress={() => navigation.navigate("Chat", { user: chat.userInfo })}
    >
      <View style={styles.userInfo}>
        <Image
          source={{
            uri: chat.userInfo?.photoURL,
          }}
          style={styles.userImg}
        />
        <View>
          <Text style={styles.username}>{chat.userInfo?.displayName}</Text>
          {chat.lastMessage?.type === "text" ? (
            <Text style={styles.lastMessage}>
              {chat.lastMessage?.content.length > 20
                ? chat.lastMessage?.content.slice(0, 22) + "..."
                : chat.lastMessage?.content}
            </Text>
          ) : (
            chat.lastMessage?.type === "image" && (
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <ImageIcon
                  name="image"
                  size={16}
                  color={colors.textSecondary}
                />
                <Text style={{ color: colors.textSecondary, marginLeft: 3 }}>
                  File
                </Text>
              </View>
            )
          )}
        </View>
        <Text style={styles.time}>{date}</Text>
      </View>
    </TouchableHighlight>
  );
};

export default ChatCard;

const styles = StyleSheet.create({
  userInfo: {
    backgroundColor: colors.backPrimary,
    padding: 20,
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 20,
    position: "relative",
  },

  userImg: {
    width: 50,
    height: 50,
    borderRadius: 50,
    marginRight: 20,
  },

  username: {
    fontSize: 18,
    fontWeight: "500",
    color: colors.textPrimary,
    textTransform: "capitalize",
    marginBottom: 5,
  },

  lastMessage: {
    fontSize: 16,
    fontWeight: "400",
    color: colors.textSecondary,
  },

  time: {
    position: "absolute",
    top: 12,
    right: 20,
    color: colors.textSecondary,
    fontSize: 16,
  },
});
