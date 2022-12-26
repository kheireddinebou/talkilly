import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useContext, useState } from "react";
import { colors } from "../globalStyles";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth, db } from "../firebase";
import {
  validateEmail,
  validateName,
  validatePassword,
} from "../validateInput";
import { doc, setDoc } from "firebase/firestore";
import { AuthContext } from "../context/AuthContext";

const Register = ({ navigation }) => {
  const [formData, setFormData] = useState({});
  const [err, setErr] = useState({});
  const [loading, setLoading] = useState();

  const { currentUser } = useContext(AuthContext);

  const handleChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
  };

  const validateInputs = () => {
    if (!validateName(formData.displayName)) {
      setErr({
        type: "displayName",
        message: "name must contain at least 4 characters",
      });
      return false;
    } else if (!validateEmail(formData.email)) {
      setErr({ type: "email", message: "email is not correct" });
      return false;
    } else if (!validatePassword(formData.password)) {
      setErr({
        type: "password",
        message: "password must contain at least 6 characters",
      });
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    setErr({});
    if (validateInputs()) {
      setLoading(true);
      try {
        await createUserWithEmailAndPassword(
          auth,
          formData.email,
          formData.password
        )
          .then(async userCredential => {
            setLoading(false);
            const user = userCredential.user;
            await updateProfile(user, {
              displayName: formData.displayName,
              photoURL:
                "https://firebasestorage.googleapis.com/v0/b/chat-mob-f8088.appspot.com/o/blank-profile-picture-g003eec065_1280.png?alt=media&token=4d852bc1-a733-48ce-8851-ead7ee107f83",
            });

            try {
              await setDoc(doc(db, "users", user.uid), {
                uid: user.uid,
                displayName: formData.displayName,
                email: formData.email,
                photoURL:
                  "https://firebasestorage.googleapis.com/v0/b/chat-mob-f8088.appspot.com/o/blank-profile-picture-g003eec065_1280.png?alt=media&token=4d852bc1-a733-48ce-8851-ead7ee107f83",
                status: "active",
              });

              await setDoc(doc(db, "userChats", user.uid), {});
            } catch (err) {
              console.log(err);
            }
          })
          .catch(error => {
            setErr({ type: "email", message: error.code?.split("/")[1] });
            setLoading(false);
          });
      } catch (err) {
        console.log(err);
        setLoading(false);
      }
    }
  };
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create Account</Text>
      <Text style={styles.subTitle}>Connect with your friends today!</Text>

      <View style={styles.inputWrapper}>
        <Text style={styles.label}>Name</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your name"
          onChangeText={text => handleChange("displayName", text)}
        />
        {err.type === "displayName" && (
          <Text style={{ color: "red" }}>{err.message}</Text>
        )}
      </View>

      <View style={styles.inputWrapper}>
        <Text style={styles.label}>Email Address</Text>
        <TextInput
          style={styles.input}
          autoCompleteType="email"
          keyboardType="email-address"
          textContentType="emailAddress"
          placeholder="Enter your email"
          onChangeText={text => handleChange("email", text)}
        />
        {err.type === "email" && (
          <Text style={{ color: "red" }}>{err.message}</Text>
        )}
      </View>

      <View style={styles.inputWrapper}>
        <Text style={styles.label}>Password</Text>
        <TextInput
          style={styles.input}
          secureTextEntry
          autoCompleteType="password"
          placeholder="Enter your password"
          onChangeText={text => handleChange("password", text)}
        />
        {err.type === "password" && (
          <Text style={{ color: "red" }}>{err.message}</Text>
        )}
      </View>

      <TouchableOpacity
        onPress={handleSubmit}
        style={[styles.btn, { opacity: loading ? 0.5 : 1 }]}
        disabled={loading}
      >
        <Text style={styles.btnText}>Sign Up</Text>
      </TouchableOpacity>

      {!loading && (
        <Text style={styles.bottomText}>
          Already have an account ?{" "}
          <Text
            onPress={() => navigation.navigate("Login")}
            style={styles.bolderText}
          >
            Login
          </Text>
        </Text>
      )}
    </View>
  );
};

export default Register;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },

  title: {
    fontSize: 35,
    color: colors.textPrimary,
    fontWeight: "600",
    marginTop: 30,
    marginBottom: 5,
  },

  subTitle: {
    fontSize: 18,
    color: colors.textSecondary,
    fontWeight: "400",
    marginBottom: 30,
  },

  label: {
    fontWeight: "500",
    color: colors.textPrimary,
    marginBottom: 5,
    fontSize: 16,
  },

  inputWrapper: {
    alignSelf: "stretch",
    marginBottom: 30,
  },

  input: {
    padding: 9,
    borderColor: colors.textSecondary,
    borderWidth: 1,
    alignSelf: "stretch",
    borderRadius: 10,
    fontSize: 16,
  },

  btn: {
    marginTop: 20,
    padding: 15,
    borderRadius: 12,
    backgroundColor: colors.primaryColor,
    alignItems: "center",
    alignSelf: "stretch",
  },

  btnText: {
    color: "white",
    fontSize: 18,
    fontWeight: "500",
  },

  bottomText: {
    marginTop: 140,
    color: colors.textSecondary,
    fontSize: 16,
    textAlign: "center",
    width: "100%",
  },
  bolderText: {
    color: colors.primaryColor,
    fontWeight: "500",
  },
});
