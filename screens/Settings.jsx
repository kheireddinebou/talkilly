import {
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
  TouchableOpacity,
} from "react-native";
import React, { useContext, useState } from "react";
import { colors } from "../globalStyles";
import Icon from "react-native-vector-icons/Feather";
import EditModel from "../components/EditModel";
import { auth } from "../firebase";
import { signOut } from "firebase/auth";
import { AuthContext } from "../context/AuthContext";

const Settings = () => {
  const [showEditModel, setShowEditModel] = useState(false);
  const { currentUser, setCurrentUser } = useContext(AuthContext);

  const handleLogout = () => {
    signOut(auth);
    setCurrentUser(null);
  };
  return (
    <>
      <EditModel
        showEditModel={showEditModel}
        setShowEditModel={setShowEditModel}
      />
      <View style={styles.container}>
        <View style={styles.userInfo}>
          <Image
            source={{
              uri: currentUser.photoURL,
            }}
            style={styles.userImg}
          />
          <View style={{ alignItems: "center" }}>
            <Text style={styles.username}>{currentUser.displayName}</Text>
            <Text style={styles.useremail}>{currentUser.email}</Text>
          </View>
        </View>

        <View style={styles.editCard}>
          <Text style={styles.editText}>Edit Information</Text>
          <TouchableOpacity
            onPress={() => setShowEditModel(true)}
            style={styles.editBtn}
          >
            <Icon name="edit-2" size={23} color="white" />
          </TouchableOpacity>
        </View>

        <TouchableOpacity onPress={handleLogout} style={styles.logoutBtn}>
          <Text style={styles.btnText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </>
  );
};

export default Settings;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backSecondary,
    padding: 16,
  },

  userInfo: {
    alignItems: "center",
    marginTop: 60,
  },

  userImg: {
    width: 150,
    height: 150,
    borderRadius: 100,
    marginBottom: 15,
  },

  username: {
    fontSize: 20,
    fontWeight: "500",
    color: colors.textPrimary,
    marginBottom: 5,
    textTransform: "capitalize",
  },

  useremail: {
    fontSize: 18,
    fontWeight: "400",
    color: colors.textSecondary,
  },

  editCard: {
    padding: 20,
    backgroundColor: colors.primaryColor,
    borderRadius: 15,
    marginTop: 40,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  editText: {
    fontSize: 22,
    color: "white",
  },

  editBtn: {
    borderRadius: 100,
    borderColor: "white",
    borderWidth: 2,
    padding: 6,
  },

  logoutBtn: {
    backgroundColor: "#3a3a3a",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 15,
    padding: 15,
    position: "absolute",
    bottom: 20,
    width: "100%",
    alignSelf: "center",
  },

  btnText: {
    color: "white",
    fontSize: 20,
    fontWeight: "500",
  },
});
