import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, Pressable, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

export default function Index() {
  const STORAGE_NAME = 'galeria';

  const [image, setImage] = useState<string | null>(null);
  const [listaFotos, setListaFotos] = useState<string[]>([]);
  const [fileSize, setFileSize] = useState<number | undefined>(undefined);

  useEffect(() => {
    getImage();
  }, []);

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

  return (
    <View style={styles.container}>
      
      {image ? (
        <View style={styles.previewContainer}>
          <Image source={{ uri: image }} style={styles.preview} />
          <Text style={styles.fileSize}>{convertBytesToHuman(fileSize)}</Text>
          <View style={styles.actionButtons}>
            <Pressable style={[styles.iconButton, styles.saveButton]} onPress={() => storeImage(image)}>
              <MaterialCommunityIcons name="content-save" size={26} color="#00FF87" />
            </Pressable>
            <Pressable style={[styles.iconButton, styles.cancelButton]} onPress={() => setImage(null)}>
              <MaterialCommunityIcons name="close-circle" size={26} color="#FF00FF" />
            </Pressable>
          </View>
        </View>
      ) : (
        <Pressable style={styles.addButton} onPress={pickImage}>
          <LinearGradient
            colors={['#00C6FF', '#0072FF']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.addButtonGradient}
          >
            <MaterialCommunityIcons name="plus-circle" size={52} color="#fff" />
            <Text style={styles.addButtonText}>Adicionar Foto</Text>
          </LinearGradient>
        </Pressable>
      )}

      {listaFotos.length > 0 && <Text style={styles.subtitle}>📂 Fotos Salvas</Text>}

      <ScrollView contentContainerStyle={styles.gallery}>
        {listaFotos.map((foto, indice) => (
          <View key={indice} style={styles.galleryItem}>
            <Image source={{ uri: foto }} style={styles.galleryImage} />
            <Pressable
              style={styles.deleteButton}
              onPress={() => removeImage(indice)}
            >
              <MaterialCommunityIcons name="delete" size={22} color="#FF00FF" />
            </Pressable>
          </View>
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
  },
  saveButton: {
    backgroundColor: '#2C2C2C',
  },
  cancelButton: {
    backgroundColor: '#2C2C2C',
  },
  addButton: {
    alignSelf: 'center',
    borderRadius: 24,
    overflow: 'hidden',
    shadowColor: '#00C6FF',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8,
  },
  addButtonGradient: {
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButtonText: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
  },
  gallery: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    padding: 10,
    gap: 12,
  },
  galleryItem: {
    position: 'relative',
    width: '45%',
    aspectRatio: 1,
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#00C6FF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
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
  },
});