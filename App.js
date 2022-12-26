import { StatusBar } from "expo-status-bar";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import AppRoutes from "./AppRoutes";
import { AuthContextProvider } from "./context/AuthContext";

export default function App() {
  return (
    <AuthContextProvider>
      <AppRoutes />
    </AuthContextProvider>
  );
}
