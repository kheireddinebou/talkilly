import ExpoStatusBar from "expo-status-bar/build/ExpoStatusBar";
import React, { useContext, useEffect, useRef, useState } from "react";
import { View, StyleSheet, StatusBar } from "react-native";
import Chat from "./screens/Chat";
import Login from "./screens/Login";
import Register from "./screens/Register";
import Welcome from "./screens/Welcome";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeNavigation from "./screens/HomeNavigation";
import { AuthContext } from "./context/AuthContext";

const AppRoutes = () => {
  const Stack = createNativeStackNavigator();
  const { currentUser } = useContext(AuthContext);


  return (
    <>
      <ExpoStatusBar style="dark" />
      <View style={styles.container}>
        <NavigationContainer>
          <Stack.Navigator>
            {currentUser ? (
              <>
                <Stack.Screen
                  name="HomeNav"
                  component={HomeNavigation}
                  options={{ headerShown: false }}
                />
                <Stack.Screen
                  name="Chat"
                  component={Chat}
                  options={{ headerShown: false }}
                />
              </>
            ) : (
              <>
                <Stack.Screen
                  name="Welcome"
                  component={Welcome}
                  options={{ headerShown: false }}
                />
                <Stack.Screen
                  name="Register"
                  component={Register}
                  options={{ headerShown: false }}
                />

                <Stack.Screen
                  name="Login"
                  component={Login}
                  options={{ headerShown: false }}
                />
              </>
            )}
          </Stack.Navigator>
        </NavigationContainer>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: StatusBar.currentHeight,
  },
});

export default AppRoutes;
