import React, { useEffect, useState } from 'react';
import { PermissionsAndroid, SafeAreaView, StyleSheet, Text, TouchableHighlight, View } from 'react-native';
import RNFS from 'react-native-fs';
import ImagePicker from 'react-native-image-crop-picker';
import ImageResizer from 'react-native-image-resizer';

const CameraScreen = ({ navigation, route }) => {
  const [scannedImage, setScannedImage] = useState(null);
  const [textColor, setTextColor] = useState('white');
  const { item, userData } = route.params;
  
  const getUniqueFileName = () => {
    const randomNumber = Math.floor(Math.random() * (500 - 1 + 1)) + 1;
    return `teslim${randomNumber}.jpg`;
  };

  const requestPermission = async () => {
    try {
      const cameraPermission = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA
      );
      const storagePermission = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE
      );

      return (
        cameraPermission === PermissionsAndroid.RESULTS.GRANTED &&
        storagePermission === PermissionsAndroid.RESULTS.GRANTED
      );
    } catch (err) {
      console.warn(err);
      return false;
    }
  };

  useEffect(() => {
    const requestPermissions = async () => {
      const granted = await requestPermission();
      if (!granted) {
        console.log('Gerekli izinler verilmedi.');
      }
      else{
        handleScan();
      }
    };
  
    requestPermissions();
  }, []);

  const handleScan = async () => {
    try {
      const photo = await ImagePicker.openCamera({
        width: 800,
        height: 800,
        compressImageMaxWidth: 800,
        compressImageMaxHeight: 800,
        mediaType: 'photo',
      });

      const resizedImage = await ImageResizer.createResizedImage(photo.path, 800, 800, 'JPEG', 80);
      const fileName = getUniqueFileName();
      const filePath = `${RNFS.ExternalStorageDirectoryPath}/DCIM/Camera/${fileName}`;
      
      await RNFS.moveFile(resizedImage.uri, filePath);
      const fileExists = await RNFS.exists(filePath);
      
      if (fileExists) {
        console.log("Yeni dosya yolu:", filePath);
        navigation.navigate('Preview', { filePath, item, userData });
      } else {
        console.log('Fotoğraf dosyası mevcut değil.');
      }
      
    } catch (error) {
      console.log('Fotoğraf çekme hatası:', error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.overlay}>
        <TouchableHighlight
          style={Form.button}
          onPress={handleScan}
        >
          <Text style={[Form.buttonText, { color: textColor }]}>Kaydet</Text>
        </TouchableHighlight>
      </View>
    </SafeAreaView>
  );
};

const Form = StyleSheet.create({
  button: {
    width: '80%',
    height: 40,
    backgroundColor: '#e30d4f',
    borderWidth: 3,
    borderColor: '#e30d4f',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    marginBottom: 20,
    marginTop: 20,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default CameraScreen;
