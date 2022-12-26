import {
  StyleSheet,
  Text,
  View,
  Modal,
  TouchableOpacity,
  Image,
  TextInput,
  ActivityIndicator,
} from "react-native";
import React, { useContext, useState } from "react";
import Icon from "react-native-vector-icons/Feather";
import AntDesignIcon from "react-native-vector-icons/AntDesign";
import { colors } from "../globalStyles";
import { AuthContext } from "../context/AuthContext";
import * as ImagePicker from "expo-image-picker";
import { db, storage } from "../firebase";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytes,
  uploadBytesResumable,
  uploadString,
} from "firebase/storage";
import { doc, updateDoc } from "firebase/firestore";
import { updateProfile } from "firebase/auth";

const EditModel = ({ showEditModel, setShowEditModel }) => {
  const { currentUser, setCurrentUser } = useContext(AuthContext);
  const [uploading, setUploading] = useState(false);
  const [newName, setNewName] = useState(currentUser.displayName);
  const [userImg, setUserImg] = useState(currentUser.photoURL);
  const [newImg, setNewImg] = useState(null);

  const uploadImage = async uri => {
    try {
      setUploading(true);
      const filename = uri.substring(uri.lastIndexOf("/") + 1);
      const response = await fetch(uri);
      const blobFile = await response.blob();

      const reference = ref(storage, filename);
      await uploadBytes(reference, blobFile).then(res => {
        getDownloadURL(res.ref).then(url => {
          setNewImg(url);
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
      allowsEditing: true,
      aspect: [1, 1],
    });

    if (!result.canceled) {
      const uri = result.assets[0].uri;
      setUserImg(uri);
      await uploadImage(uri);
    }
  };

  const updateUser = async () => {
    try {
      setUploading(true);
      await updateProfile(currentUser, {
        displayName: newName,
        photoURL: newImg || userImg,
      });

      await updateDoc(doc(db, "users", currentUser.uid), {
        displayName: newName,
        photoURL: newImg || userImg,
      });

      setShowEditModel(false);
    } catch (err) {
      console.log(err);
    } finally {
      setUploading(false);
      setCurrentUser({
        ...currentUser,
        displayName: newName,
        photoURL: newImg || userImg,
      });
    }
  };

  return (
    <Modal animationType="slide" visible={showEditModel} transparent={true}>
      <View style={styles.transparentBg} />
      <View style={styles.wrapper}>
        <TouchableOpacity
          style={styles.closeBtn}
          onPress={() => setShowEditModel(false)}
        >
          <AntDesignIcon name="close" size={35} />
        </TouchableOpacity>

        <View style={styles.userInfo}>
          <View>
            <Image
              source={{
                uri: userImg,
              }}
              style={[styles.userImg, { opacity: uploading ? 0.4 : 1 }]}
            />
          </View>

          <Text style={styles.username}>{newName}</Text>
        </View>

        <View style={styles.inputWrapper}>
          <Text style={styles.label}>Change Image</Text>

          {uploading ? (
            <ActivityIndicator
              style={{ marginTop: 50 }}
              size="large"
              color={colors.primaryColor}
            />
          ) : (
            <TouchableOpacity
              disabled={uploading}
              onPress={selectImage}
              style={[styles.imageBtn, { opacity: uploading ? 0.5 : 1 }]}
            >
              <Icon name="camera" size={35} color={colors.textSecondary} />
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.inputWrapper}>
          <Text style={styles.label}>Name</Text>
          <TextInput
            onChangeText={text => setNewName(text)}
            value={newName}
            style={styles.input}
          />
        </View>

        <TouchableOpacity
          onPress={updateUser}
          style={[styles.updateBtn, { opacity: uploading ? 0.5 : 1 }]}
        >
          <Text style={styles.submitBtnText}>
            {uploading ? (
              <ActivityIndicator
                style={{ marginTop: 50 }}
                size="large"
                color="#fff"
              />
            ) : (
              "Upload"
            )}
          </Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
};

export default EditModel;

const styles = StyleSheet.create({
  transparentBg: {
    flex: 1,
    backgroundColor: "#000",
    opacity: 0.7,
  },

  closeBtn: {
    alignSelf: "flex-end",
  },

  wrapper: {
    padding: 20,
    backgroundColor: colors.backPrimary,
    position: "absolute",
    bottom: 0,
    zIndex: 2,
    width: "100%",
    borderTopEndRadius: 20,
    borderTopStartRadius: 20,
  },

  userInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },

  userImg: {
    width: 95,
    height: 95,
    borderRadius: 50,
    marginRight: 20,
  },

  username: {
    fontSize: 20,
    fontWeight: "500",
    color: colors.textPrimary,
    marginBottom: 5,
    textTransform: "capitalize",
  },

  inputWrapper: {
    marginTop: 30,
  },

  input: {
    backgroundColor: "#d1d1d1",
    padding: 15,
    borderRadius: 7,
    fontSize: 18,
    marginTop: 10,
  },

  label: {
    fontSize: 17,
    fontWeight: "500",
    marginBottom: 10,
  },
  imageBtn: {
    backgroundColor: "#d1d1d1",
    padding: 25,
    borderRadius: 100,
    alignSelf: "flex-start",
  },

  updateBtn: {
    backgroundColor: colors.primaryColor,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 15,
    padding: 15,
    marginTop: 30,
  },

  submitBtnText: {
    color: "white",
    fontSize: 20,
    fontWeight: "500",
  },
});
