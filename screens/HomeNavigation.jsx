import React, { useContext, useEffect } from "react";
import { View, StyleSheet, AppState } from "react-native";
import ChatsList from "./ChatsList";
import Home from "./Home";
import Settings from "./Settings";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Ionicons from "react-native-vector-icons/Ionicons";
import Fontisto from "react-native-vector-icons/Fontisto";
import { colors } from "../globalStyles";

const HomeNavigation = () => {
  const Tab = createBottomTabNavigator();

  return (
    <Tab.Navigator
      initialRouteName={"Home"}
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          let rn = route.name;

          if (rn === "Home") {
            iconName = focused ? "world" : "world-o";
            return <Fontisto name={iconName} size={33} color={color} />;
          } else if (rn === "ChatsList") {
            iconName = focused ? "chatbubbles" : "chatbubbles-outline";
            return <Ionicons name={iconName} size={33} color={color} />;
          } else if (rn === "Settings") {
            iconName = focused ? "settings" : "settings-outline";
            return <Ionicons name={iconName} size={35} color={color} />;
          }

          // You can return any component that you like here!
        },
        tabBarActiveTintColor: colors.primaryColor,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarLabelStyle: {
          display: "none",
        },
        tabBarStyle: [
          {
            height: 80,
            borderTopEndRadius: 30,
            borderTopLeftRadius: 30,
          },
        ],
      })}
    >
      <Tab.Screen
        name="Home"
        component={Home}
        options={{ headerShown: false }}
      />
      <Tab.Screen
        name="ChatsList"
        component={ChatsList}
        options={{ headerShown: false }}
      />
      <Tab.Screen
        name="Settings"
        component={Settings}
        options={{ headerShown: false }}
      />
    </Tab.Navigator>
  );
};

export default HomeNavigation;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backSecondary,
    padding: 16,
  },

  userInfo: {
    backgroundColor: colors.backPrimary,
    paddingHorizontal: 10,
    paddingVertical: 20,
    flexDirection: "row",
    alignItems: "center",
    marginTop: 30,
    borderRadius: 20,
  },

  userImg: {
    width: 95,
    height: 95,
    borderRadius: 50,
    marginRight: 20,
  },

  username: {
    fontSize: 18,
    fontWeight: "500",
    color: colors.textPrimary,
    marginBottom: 5,
    textTransform: "capitalize",
  },

  useremail: {
    fontSize: 16,
    fontWeight: "400",
    color: colors.textSecondary,
  },

  label: {
    fontSize: 20,
    color: colors.textSecondary,
    marginTop: 25,
  },

  inputWrapper: {
    backgroundColor: colors.backPrimary,
    padding: 10,
    flexDirection: "row",
    alignItems: "center",
    marginTop: 15,
    borderRadius: 10,
  },

  input: {
    fontSize: 16,
    flex: 1,
  },
});
