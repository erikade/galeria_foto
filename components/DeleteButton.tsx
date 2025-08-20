import React from "react";
import { TouchableOpacity, StyleSheet, Text, View } from "react-native";
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function DeleteButton() {
  return (
    <TouchableOpacity style={styles.button}>
      <View style={styles.iconContainer}>
        <MaterialCommunityIcons name="delete" size={20} color="#FF00FF" />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(30, 30, 30, 0.6)", // Fundo semi-transparente
    borderWidth: 1,
    borderColor: 'rgba(255, 0, 255, 0.2)', // Borda sutil neon
  },
  iconContainer: {
    shadowColor: "#FF00FF", // Brilho neon
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 6,
    elevation: 8,
  },
});