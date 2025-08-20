import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";

export default function DeleteButton() {
  return (
    <TouchableOpacity style={styles.button}>
      <Text style={styles.text}>✕</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#E53935",
    shadowColor: "#E53935",
    shadowOpacity: 0.8,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 6,
    elevation: 10,
  },
  text: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});
