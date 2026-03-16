import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, ActivityIndicator, Modal, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';
import { FIREBASE_AUTH } from '../../FirebaseConfig';
import { saveGame } from '../../src/mock/store';

const Upload = () => {
  const navigation = useNavigation();
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showCustomAlert, setShowCustomAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [debugImage, setDebugImage] = useState<string | null>(null);

  const handlePickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      quality: 1,
    });
    if (!result.canceled && result.assets && result.assets[0]) {
      setCapturedImage(result.assets[0].uri);
    }
  };

  const resizeImage = async (uri: string): Promise<string> => {
    const manipResult = await ImageManipulator.manipulateAsync(
      uri,
      [{ resize: { width: 640, height: 640 } }],
      { compress: 0.7, format: ImageManipulator.SaveFormat.JPEG, base64: true }
    );
    return manipResult.base64 ?? '';
  };

  const sendBase64Image = async (base64Image: string) => {
    const url = 'https://rbz0ltdjwg.execute-api.us-east-2.amazonaws.com/Development/process-image';
    try {
      const response = await fetch(url, {
        method: 'POST',
        body: base64Image,
        headers: { 'Accept': '*/*', 'Content-Type': 'text/plain' },
      });
      const responseJson = await response.json();
      return { status: response.status, body: responseJson };
    } catch (error) {
      return { status: 500, body: null, error };
    }
  };

  const handleUpload = async () => {
    if (!capturedImage) return;
    setIsLoading(true);
    try {
      const base64 = await resizeImage(capturedImage);
      const response = await sendBase64Image(base64);

      if (response.status === 200) {
        const fen = response.body + ' w KQkq - 0 1';
        const newGame = await saveGame({
          title: 'Uploaded Game',
          status: 'Playing',
          side: 'White',
          opponentName: 'Opponent',
          moves: [fen],
        });
        navigation.navigate('Game' as never, { item: newGame } as never);
      } else if (response.status === 400) {
        setAlertMessage(response.body.error);
        setDebugImage('data:image/jpeg;base64,' + response.body.image);
        setShowCustomAlert(true);
      } else {
        Alert.alert('Error', 'Server error. Please try again.');
      }
    } catch (err) {
      Alert.alert('Error', 'Failed to process image.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.navigate('Home' as never)} style={styles.backButton}>
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Upload Board Photo</Text>
        <View style={styles.placeholder} />
      </View>

      <View style={styles.content}>
        {capturedImage ? (
          <Image source={{ uri: capturedImage }} style={styles.preview} resizeMode="contain" />
        ) : (
          <View style={styles.emptyPreview}>
            <Text style={styles.emptyText}>No image selected</Text>
          </View>
        )}

        <TouchableOpacity style={styles.button} onPress={handlePickImage}>
          <Text style={styles.buttonText}>Choose Photo</Text>
        </TouchableOpacity>

        {capturedImage && (
          <TouchableOpacity style={[styles.button, styles.uploadButton]} onPress={handleUpload}>
            <Text style={styles.buttonText}>Upload &amp; Analyze</Text>
          </TouchableOpacity>
        )}

        <Text style={styles.hint}>
          Take a photo of a physical chess board and upload it. The AI will detect the position and create a game for you.
        </Text>
      </View>

      {isLoading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#789454" />
          <Text style={styles.loadingText}>Analyzing board...</Text>
        </View>
      )}

      <Modal
        animationType="slide"
        transparent={true}
        visible={showCustomAlert}
        onRequestClose={() => setShowCustomAlert(false)}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>{alertMessage}</Text>
            {debugImage && (
              <Image source={{ uri: debugImage }} style={styles.debugImage} />
            )}
            <TouchableOpacity style={styles.button} onPress={() => setShowCustomAlert(false)}>
              <Text style={[styles.buttonText, { color: 'black' }]}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default Upload;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2E2E2E',
    maxWidth: 480,
    alignSelf: 'center' as any,
    width: '100%',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#444',
  },
  backButton: { padding: 4 },
  backButtonText: { color: '#789454', fontSize: 16 },
  title: { color: 'white', fontSize: 20, fontWeight: 'bold' },
  placeholder: { width: 60 },
  content: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
  },
  preview: {
    width: '100%',
    height: 300,
    marginBottom: 20,
    borderRadius: 8,
    backgroundColor: '#1a1a1a',
  },
  emptyPreview: {
    width: '100%',
    height: 300,
    marginBottom: 20,
    borderRadius: 8,
    backgroundColor: '#1a1a1a',
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: { color: '#666', fontSize: 16 },
  button: {
    backgroundColor: '#789454',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 8,
    marginBottom: 12,
    width: '100%',
    alignItems: 'center',
  },
  uploadButton: { backgroundColor: '#4a7a3a' },
  buttonText: { color: 'white', fontSize: 16, fontWeight: 'bold' },
  hint: {
    color: '#888',
    fontSize: 13,
    textAlign: 'center',
    marginTop: 16,
    lineHeight: 20,
  },
  loadingContainer: {
    position: 'absolute',
    inset: 0,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)',
  },
  loadingText: { color: 'white', marginTop: 12, fontSize: 16 },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalText: { marginBottom: 15, textAlign: 'center', fontSize: 16 },
  debugImage: { width: 200, height: 200, marginBottom: 15 },
});
