import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Keyboard,
} from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { colors } from "../globalStyles";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { validateEmail, validatePassword } from "../validateInput";
import { AuthContext } from "../context/AuthContext";

const Login = ({ navigation }) => {
  const [formData, setFormData] = useState({});
  const [err, setErr] = useState({});
  const [loading, setLoading] = useState(false);
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);


  const handleChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
  };

  const validateInputs = () => {
    if (!validateEmail(formData.email)) {
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
      try {
        setLoading(true);
        await signInWithEmailAndPassword(
          auth,
          formData.email,
          formData.password
        )
          .then(userCredential => {
            const user = userCredential.user;
            setLoading(false);
          })
          .catch(error => {
            console.log(error);
            setErr({ type: "email", message: error.code?.split("/")[1] });
            setLoading(false);
          });
      } catch (err) {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      () => {
        setKeyboardVisible(true);
      }
    );
    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => {
        setKeyboardVisible(false);
      }
    );

    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome Back!</Text>
      <Text style={styles.subTitle}>Hello again, you've been missed!</Text>
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
        disabled={loading}
        style={[styles.btn, { opacity: loading ? 0.5 : 1 }]}
      >
        <Text style={styles.btnText}>Login</Text>
      </TouchableOpacity>

      {!loading && !isKeyboardVisible && (
        <Text style={styles.bottomText}>
          Don't have an account ?{" "}
          <Text
            onPress={() => navigation.navigate("Register")}
            style={styles.bolderText}
          >
            SignUp
          </Text>
        </Text>
      )}
    </View>
  );
};

export default Login;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    position: "relative",
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
    position: "absolute",
    bottom: 50,
    width: "100%",
    alignSelf: "center",
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
