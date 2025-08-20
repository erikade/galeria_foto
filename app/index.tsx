import { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, Pressable, Alert, Animated, Easing } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

export default function Index() {
  const STORAGE_NAME = 'galeria';

  const [image, setImage] = useState<string | null>(null);
  const [listaFotos, setListaFotos] = useState<string[]>([]);
  const [fileSize, setFileSize] = useState<number | undefined>(undefined);
  const [hoveredItem, setHoveredItem] = useState<number | null>(null);

  // Animações para os botões
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const saveScaleAnim = useRef(new Animated.Value(1)).current;
  const cancelScaleAnim = useRef(new Animated.Value(1)).current;
  const deleteScaleAnim = useRef(new Animated.Value(1)).current;
  const hoverAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    getImage();
  }, []);

  const handleHoverIn = (index: number | null = null) => {
    setHoveredItem(index);
    Animated.timing(hoverAnim, {
      toValue: 1,
      duration: 200,
      easing: Easing.out(Easing.ease),
      useNativeDriver: true
    }).start();
  };

  const handleHoverOut = () => {
    setHoveredItem(null);
    Animated.timing(hoverAnim, {
      toValue: 0,
      duration: 200,
      easing: Easing.out(Easing.ease),
      useNativeDriver: true
    }).start();
  };

  const handleAddPressIn = () => {
    Animated.parallel([
      Animated.spring(scaleAnim, { toValue: 0.95, friction: 3, useNativeDriver: true }),
      Animated.timing(hoverAnim, { toValue: 1, duration: 150, useNativeDriver: true })
    ]).start();
  };

  const handleAddPressOut = () => {
    Animated.parallel([
      Animated.spring(scaleAnim, { toValue: 1, friction: 3, useNativeDriver: true }),
      Animated.timing(hoverAnim, { toValue: 0, duration: 200, useNativeDriver: true })
    ]).start(() => {
      pickImage();
    });
  };

  const handleActionPressIn = (anim: Animated.Value) => {
    Animated.spring(anim, { toValue: 0.9, friction: 3, useNativeDriver: true }).start();
  };

  const handleActionPressOut = (anim: Animated.Value, action: () => void) => {
    Animated.spring(anim, { toValue: 1, friction: 3, useNativeDriver: true }).start(() => {
      action();
    });
  };

  const storeImage = async (value: string) => {
    try {
      const fotos = [...listaFotos, value];
      setListaFotos(fotos);
      await AsyncStorage.setItem(STORAGE_NAME, JSON.stringify(fotos));
      setImage(null);
      Alert.alert("✅ Sucesso", "Imagem salva na galeria!");
    } catch (error) {
      console.error("Erro ao salvar a imagem:", error);
      Alert.alert("❌ Erro", "Não foi possível salvar a imagem.");
    }
  };

  const getImage = async () => {
    try {
      const value = await AsyncStorage.getItem(STORAGE_NAME);
      if (value !== null) {
        setListaFotos(JSON.parse(value));
      }
    } catch (error) {
      console.error("Erro ao carregar a galeria:", error);
    }
  };

  const removeImage = async (indice: number) => {
    try {
      const newLista = [...listaFotos];
      newLista.splice(indice, 1);
      if (newLista.length > 0) {
        await AsyncStorage.setItem(STORAGE_NAME, JSON.stringify(newLista));
      } else {
        await AsyncStorage.removeItem(STORAGE_NAME);
      }
      setListaFotos(newLista);
      Alert.alert("🗑️ Sucesso", "Imagem removida da galeria.");
    } catch (e) {
      console.error('Erro ao remover a imagem:', e);
      Alert.alert("❌ Erro", "Não foi possível remover a imagem.");
    }
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    if (!result.canceled) {
      setImage(result.assets[0].uri);
      setFileSize(result.assets[0].fileSize);
    }
  };

  const convertBytesToHuman = (size: number | undefined) => {
    if (size === undefined) return "";
    const kb = size / 1024;
    const mb = kb / 1024;
    if (mb >= 1) {
      return `${mb.toFixed(2)} MB`;
    }
    return `${kb.toFixed(2)} KB`;
  };

  // Interpolação para efeitos de brilho
  const glowOpacity = hoverAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 0.6]
  });

  const glowScale = hoverAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.05]
  });

  return (
    <View style={styles.container}>
      
      {image ? (
        <View style={styles.previewContainer}>
          <Image source={{ uri: image }} style={styles.preview} />
          <Text style={styles.fileSize}>{convertBytesToHuman(fileSize)}</Text>
          <View style={styles.actionButtons}>
            <Pressable 
              onPressIn={() => handleActionPressIn(saveScaleAnim)}
              onPressOut={() => handleActionPressOut(saveScaleAnim, () => storeImage(image))}
            >
              <Animated.View style={[
                styles.iconButton, 
                styles.saveButton, 
                { 
                  transform: [{ scale: saveScaleAnim }],
                }
              ]}>
                <Animated.View style={[
                  styles.glowEffect,
                  {
                    opacity: glowOpacity,
                    backgroundColor: '#00FF87',
                    transform: [{ scale: glowScale }]
                  }
                ]} />
                <MaterialCommunityIcons name="content-save" size={26} color="#00FF87" />
              </Animated.View>
            </Pressable>
            <Pressable 
              onPressIn={() => handleActionPressIn(cancelScaleAnim)}
              onPressOut={() => handleActionPressOut(cancelScaleAnim, () => setImage(null))}
            >
              <Animated.View style={[
                styles.iconButton, 
                styles.cancelButton, 
                { 
                  transform: [{ scale: cancelScaleAnim }],
                }
              ]}>
                <Animated.View style={[
                  styles.glowEffect,
                  {
                    opacity: glowOpacity,
                    backgroundColor: '#FF00FF',
                    transform: [{ scale: glowScale }]
                  }
                ]} />
                <MaterialCommunityIcons name="close-circle" size={26} color="#FF00FF" />
              </Animated.View>
            </Pressable>
          </View>
        </View>
      ) : (
        <Pressable 
          onPressIn={handleAddPressIn}
          onPressOut={handleAddPressOut}
        >
          <Animated.View style={[
            styles.addButton, 
            { 
              transform: [{ scale: scaleAnim }],
            }
          ]}>
            {/* Efeito de brilho no botão principal */}
            <Animated.View style={[
              styles.glowEffect,
              {
                opacity: glowOpacity,
                backgroundColor: '#007BFF',
                transform: [{ scale: glowScale }]
              }
            ]} />
            
            <MaterialCommunityIcons name="plus" size={30} color="#fff" style={styles.addButtonIcon} />
            <Text style={styles.addButtonText}>Adicionar Foto</Text>
          </Animated.View>
        </Pressable>
      )}

      {listaFotos.length > 0 && <Text style={styles.subtitle}>📂 Fotos Salvas</Text>}

      <ScrollView contentContainerStyle={styles.gallery} horizontal={true}>
        {listaFotos.map((foto, indice) => (
          <Pressable
            key={indice}
            onPressIn={() => handleHoverIn(indice)}
            onPressOut={handleHoverOut}
          >
            <View style={styles.galleryItem}>
              <Image source={{ uri: foto }} style={styles.galleryImage} />
              
              {/* Overlay de brilho quando hover */}
              {hoveredItem === indice && (
                <Animated.View style={[
                  styles.hoverOverlay,
                  {
                    opacity: hoverAnim,
                  }
                ]} />
              )}
              
              <Pressable
                onPressIn={() => handleActionPressIn(deleteScaleAnim)}
                onPressOut={() => handleActionPressOut(deleteScaleAnim, () => removeImage(indice))}
                style={styles.deleteButton}
              >
                <Animated.View style={{ transform: [{ scale: deleteScaleAnim }] }}>
                  <MaterialCommunityIcons name="delete" size={22} color="#FF00FF" />
                </Animated.View>
              </Pressable>
            </View>
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    paddingTop: 60,
  },
  subtitle: {
    fontSize: 20,
    fontWeight: '600',
    marginTop: 20,
    marginLeft: 20,
    color: '#E0E0E0',
  },
  previewContainer: {
    alignItems: 'center',
    marginVertical: 20,
    paddingHorizontal: 20,
  },
  preview: {
    width: '100%',
    height: 300,
    borderRadius: 16,
    resizeMode: 'cover',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
  },
  fileSize: {
    fontSize: 14,
    color: '#B0B0B0',
    marginBottom: 16,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconButton: {
    padding: 12,
    borderRadius: 50,
    backgroundColor: '#2C2C2C',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 4,
    elevation: 4,
    overflow: 'hidden',
    position: 'relative',
  },
  saveButton: {
    backgroundColor: '#2C2C2C',
    shadowColor: '#00FF87',
    shadowOpacity: 0.8,
    shadowRadius: 8,
  },
  cancelButton: {
    backgroundColor: '#2C2C2C',
    shadowColor: '#FF00FF',
    shadowOpacity: 0.8,
    shadowRadius: 8,
  },
  addButton: {
    alignSelf: 'center',
    backgroundColor: '#007BFF',
    borderRadius: 12,
    paddingVertical: 20,
    paddingHorizontal: 40,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 5,
    overflow: 'hidden',
    position: 'relative',
  },
  addButtonIcon: {
    marginBottom: 10,
    zIndex: 2,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    zIndex: 2,
  },
  gallery: {
    flexDirection: 'row',
    padding: 20,
    gap: 12,
  },
  galleryItem: {
    position: 'relative',
    width: 250,
    height: 250,
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#00C6FF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  galleryImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  deleteButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    borderRadius: 20,
    padding: 6,
    shadowColor: '#FF00FF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 6,
    elevation: 8,
    zIndex: 3,
  },
  // Efeitos visuais
  glowEffect: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 12,
  },
  hoverOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
  },
});