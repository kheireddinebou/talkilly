import { StyleSheet, Text, View, Image } from "react-native";
import React, { useContext, useEffect, useRef, useState } from "react";
import { colors } from "../globalStyles";
import { AuthContext } from "../context/AuthContext";
import Hyperlink from "react-native-hyperlink";

const Message = ({ message }) => {
  const [isMyMessage, setIsMyMessage] = useState(true);
  const [date, setDate] = useState("00:00");
  const { currentUser } = useContext(AuthContext);

  useEffect(() => {
    const oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
    const today = new Date();
    const chatDate = new Date(message?.date.seconds * 1000);
    const diffDays = Math.round(Math.abs((today - chatDate) / oneDay));
    if (diffDays === 0) {
      setDate(
        new Date(message?.date.seconds * 1000).toLocaleTimeString().slice(0, 5)
      );
    } else if (diffDays <= 7) {
      setDate(
        new Date(message?.date.seconds * 1000).toDateString().slice(0, 3)
      );
    } else {
      setDate(
        new Date(message?.date.seconds * 1000).toDateString().slice(4, 10)
      );
    }
  }, [message]);

  useEffect(() => {
    setIsMyMessage(currentUser.uid === message.senderId);
  }, []);

  return (
    <View
      style={[
        styles.container,
        {
          marginLeft: isMyMessage ? 50 : 0,
          marginRight: isMyMessage ? 0 : 50,
          alignSelf: isMyMessage ? "flex-end" : "flex-start",
        },
      ]}
    >
      {message.type === "text" ? (
        <View
          style={[
            styles.message,
            {
              backgroundColor: isMyMessage ? colors.primaryColor : "white",
              borderBottomLeftRadius: isMyMessage ? 15 : 0,
              borderBottomRightRadius: isMyMessage ? 0 : 15,
            },
          ]}
        >
          <Hyperlink
            linkStyle={{ textDecorationLine: "underline" }}
            linkDefault={true}
          >
            <Text
              style={[
                styles.messageText,
                { color: isMyMessage ? "white" : colors.textPrimary },
              ]}
            >
              {message.content}
            </Text>
          </Hyperlink>
        </View>
      ) : (
        <Image style={styles.messageImg} source={{ uri: message.content }} />
      )}

      <Text
        style={[
          styles.time,
          { alignSelf: isMyMessage ? "flex-start" : "flex-end" },
        ]}
      >
        {date}
      </Text>
    </View>
  );
};

export default Message;

const styles = StyleSheet.create({
  container: {
    position: "relative",
    marginBottom: 12,
    alignSelf: "flex-end",
  },
  message: {
    padding: 12,
    borderTopEndRadius: 15,
    borderTopStartRadius: 15,
  },

  messageImg: {
    width: 270,
    height: 320,
    resizeMode: "cover",
  },

  time: {
    color: colors.textSecondary,
    fontSize: 15,
    marginTop: 5,
  },

  messageText: {
    fontSize: 19,
    lineHeight: 28,
  },
});
