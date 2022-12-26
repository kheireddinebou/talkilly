import {
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React from "react";
import { colors } from "../globalStyles";

const Welcome = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <ImageBackground
        source={require("../assets/images/welcome.png")}
        resizeMode="cover"
        style={{ flex: 1, justifyContent: "flex-end" }}
      >
        <View style={styles.textWrapper}>
          <Text style={styles.title}>
            Enjoy the new experience of chating with global friends
          </Text>
          <Text style={styles.subTitle}>
            Connect people around the world for free
          </Text>

          <TouchableOpacity
            onPress={() => navigation.navigate("Login")}
            style={styles.btn}
          >
            <Text style={styles.btnText}>Get Started</Text>
          </TouchableOpacity>

          <Text style={styles.footer}>
            Powered by{" "}
            <Text style={styles.boldText}>Kheiereddin Boukhatem</Text>
          </Text>
        </View>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-end",
  },

  textWrapper: {
    height: 300,
    backgroundColor: colors.backPrimary,
    alignItems: "center",
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    padding: 40,
  },

  title: {
    color: colors.textPrimary,
    fontSize: 22,
    marginBottom: 20,
    fontWeight: "600",
  },

  subTitle: {
    color: colors.textSecondary,
    fontSize: 17,
    marginBottom: 30,
    fontWeight: "500",
    textAlign: "center",
  },

  btn: {
    alignSelf: "stretch",
    alignItems: "center",
    justifyContent: "center",
    padding: 15,
    borderRadius: 25,
    marginBottom: 20,
    backgroundColor: colors.primaryColor,
  },

  btnText: {
    color: "white",
    fontSize: 18,
    fontWeight: "500",
  },

  footer: {
    color: "gray",
    fontSize: 16,
  },

  boldText: {
    fontWeight: "700",
  },
});

export default Welcome;
