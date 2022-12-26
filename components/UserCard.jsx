import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableHighlight,
} from "react-native";
import React from "react";
import { colors } from "../globalStyles";

const UserCard = ({ user, handleSelect }) => {
  return (
    <TouchableHighlight onPress={() => handleSelect(user)}>
      <View style={styles.userInfo}>
        <Image
          source={{
            uri: user.photoURL,
          }}
          style={styles.userImg}
        />

        <Text style={styles.username}>{user.displayName}</Text>
      </View>
    </TouchableHighlight>
  );
};

export default UserCard;

const styles = StyleSheet.create({
  userInfo: {
    backgroundColor: colors.backPrimary,
    padding: 8,
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
    borderRadius: 20,
  },

  userImg: {
    width: 50,
    height: 50,
    borderRadius: 50,
    marginRight: 20,
  },

  username: {
    fontSize: 18,
    fontWeight: "400",
    color: colors.textPrimary,
    marginBottom: 5,
    textTransform: "capitalize",
  },

  useremail: {
    fontSize: 16,
    fontWeight: "400",
    color: colors.textSecondary,
  },
});
