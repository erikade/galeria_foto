import React, { useEffect, useRef } from "react";
import { TouchableOpacity, StyleSheet, Animated, Easing, View, Text } from "react-native";
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

interface AddType {
  onPress: () => void;
}

const AddButton = ({ onPress }: AddType) => {
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Animação de pulso contínua para dar vida ao botão
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.05, // Pulso mais sutil
          duration: 1500,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1500,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [pulseAnim]);

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.9,
      friction: 3,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 3,
      useNativeDriver: true,
    }).start(() => {
      onPress();
    });
  };

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.pulseWrapper, { 
        transform: [{ scale: pulseAnim }] 
      }]}>
        <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
          <TouchableOpacity 
            style={styles.touchable}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            activeOpacity={0.7}
          >
            <LinearGradient
              colors={['#00C6FF', '#0072FF']} // Gradiente de azul para o visual tech
              style={styles.buttonGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <MaterialCommunityIcons name="plus" size={32} color="white" />
            </LinearGradient>
          </TouchableOpacity>
        </Animated.View>
      </Animated.View>
      <Text style={styles.text}>Adicionar Foto</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 20,
  },
  pulseWrapper: {
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: '#00C6FF', // Sombra com cor do destaque
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  touchable: {
    width: "100%",
    height: "100%",
    borderRadius: 35,
    overflow: 'hidden', // Importante para o gradiente não vazar
  },
  buttonGradient: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    marginTop: 8,
    fontSize: 16,
    fontWeight: "600",
    color: '#00C6FF', // Cor do texto alinhada com o gradiente
  },
});

export default AddButton;