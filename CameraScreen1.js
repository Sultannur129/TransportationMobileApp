import React, { useEffect, useRef, useState } from 'react';
import { Image, PermissionsAndroid, SafeAreaView, StyleSheet, Text, TouchableHighlight, TouchableOpacity, View } from 'react-native';
//import ImagePicker from 'react-native-image-crop-picker';
import { Camera, useCameraDevices, /*useCodeScanner*/ } from 'react-native-vision-camera';
//import { captureRef } from 'react-native-view-shot';
import RNFS from 'react-native-fs';
import ImageResizer from 'react-native-image-resizer';

//import ImageCropPicker from 'react-native-image-crop-picker';

const CameraScreen = ({ navigation, route }) => {


  const devices = useCameraDevices();
  const device = devices.back || devices[0];
  const cameraRef = useRef(null);
  const [scannedImage, setScannedImage] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const [textColor, setTextColor] = useState('white');
  const { item, userData } = route.params;
  const [flashMode, setFlashMode] = useState('off');
  
  const toggleFlash = async () => {
    const newMode = flashMode === 'off' ? 'on' : 'off';
    setFlashMode(newMode);
    if (cameraRef.current && device.hasFlash) {
      cameraRef.current.flash = newMode; // Prop ile ayarlama
      console.log(`Flaş ${newMode === 'on' ? 'açıldı' : 'kapandı'}`);
    }
   
  };

  const getUniqueFileName = () => {
    //const now = new Date();
    //const timestamp = now.toISOString().replace(/[:.-]/g, ''); // "20231007T123456" formatında
    const randomNumber = Math.floor(Math.random() * (500 - 1 + 1)) + 1;
    return `teslim${randomNumber}.jpg`;
  };

  const requestPermission = async () => {
    try {
      const writePermission = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE
      );
      const readPermission = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE
      );
      const cameraPermission = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA
      );

      const flashLightPermission = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
      );
  
      return (
        writePermission === PermissionsAndroid.RESULTS.GRANTED &&
        readPermission === PermissionsAndroid.RESULTS.GRANTED &&
        cameraPermission === PermissionsAndroid.RESULTS.GRANTED &&
        flashLightPermission === PermissionsAndroid.RESULTS.GRANTED
      );
    } catch (err) {
      console.warn(err);
      return false;
    }
  };

  

  const handlePressIn = () => {
    setTextColor('blue');
    
  };

  const handlePressOut = () => {
    setTextColor('white');
    
  };
  
 

  useEffect(() => {

    const requestPermissions = async () => {
      const granted = await requestPermission();
      if (!granted) {
        console.log('Gerekli izinler verilmedi.');
      }
    };
  
    requestPermissions();
    
    
  }, []);

  const handleScan = async () => {
    
    if (cameraRef.current) {
      console.log('Handle Scane girdi')
      setIsScanning(true);

      if (device && device.hasFlash) {
        setFlashMode(flashMode === 'on' ? 'on' : 'off');
        console.log('Flaş durumu:', flashMode);
      }
      const photo = await cameraRef.current.takePhoto({
        quality: 1,
        skipMetadata: true,
        hdr:true,
        flash: flashMode, // Flaş durumunu burada ayarlayın
        
      });

      
      console.log('Flaş durumu:', flashMode);
      console.log('Cropped Image başı girdi');
      console.log("Photo",photo);
      // Fotoğrafı sıkıştırın
      const resizedImage = await ImageResizer.createResizedImage(photo.path, 800, 800, 'JPEG', 80); // Genişlik, yükseklik, format ve kalite
      console.log('Sıkıştırılmış fotoğraf:', resizedImage);
      const fileName = getUniqueFileName();
      // Dosya yolunu DCIM klasörüne kaydedin
      const filePath = `${RNFS.ExternalStorageDirectoryPath}/DCIM/Camera/${fileName}`;
      
      await RNFS.moveFile(resizedImage.uri, filePath);
      
      const fileExists = await RNFS.exists(filePath);
      console.log(`File exists: ${fileExists}`); // Dosya var mı kontrol et
  
      if (fileExists) {
         
        //setScannedImage(filePath);
        console.log("Yeni dosya yolu:",filePath);
        navigation.navigate('Preview', {filePath, item, userData }); // Taranmış belgeyi göster
        // OCR işlemi
      //const text = await performOCR(`file://${photo.path}`);
      //console.log('Taranan metin:', text);
      } else {
        console.log('Fotoğraf dosyası mevcut değil.');
      }
      
      //setScannedImage(photo.path);
      setIsScanning(false);

      
    }
  };

  

  
 

  useEffect(() => {
    if (scannedImage) {
      console.log('Scanned image updated:', scannedImage);
    }
  }, [scannedImage]);
  if (device == null) return <Text>Yükleniyor...</Text>;

  return (
    <SafeAreaView style={styles.container}>
     
      <Camera
        ref={cameraRef}
        style={styles.camera}
        device={device}
        isActive={true}
        photo={true} // Burada photo={true} eklenmeli
        videoStabilizationMode="auto" // Stabilizasyon modu
        frameProcessorFps={30} // FPS ayarları
        focusMode="auto" // Otomatik odaklama modu
        flash={flashMode} // Flaş durumu burada ayarlanıyor
        
      />
      <TouchableOpacity style={styles.flashButton} onPress={toggleFlash}>
        <Image 
        resizeMode='center'
        source={require('./images/flash-icon.png')}/>
        <Text style={styles.buttonText}>Flash: {flashMode === 'on' ? 'Açık' : 'Kapalı'}</Text>
      </TouchableOpacity>
      <View style={styles.overlay}>
        <View style={styles.cornerTopLeft} />
        <View style={styles.cornerTopRight} />
        <View style={styles.cornerBottomLeft} />
        <View style={styles.cornerBottomRight} />
      </View>
      
      <TouchableHighlight style={Form.button}
         onPressIn={handlePressIn}
         onPressOut={handlePressOut}
         underlayColor="white"
         onPress={handleScan}
         >
      <Text style={[Form.buttonText, {color:textColor}]}>Kaydet</Text>
      </TouchableHighlight>
      
      
      
    </SafeAreaView>
  );
 
};


const Form = StyleSheet.create({

  
  button: {
    width: '80%',
    height: 40,
    backgroundColor:'#e30d4f',
    borderWidth:3,
    borderColor:'#e30d4f',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    marginBottom: 20,
    marginTop:20,
  },
  buttonText: {
    underlayColor:'blue',
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  
  
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems:'center',
  
  },
  camera: {
    width: '100%',
    height: '90%',
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
  cornerTopLeft: {
    position: 'absolute',
    top: 100,
    left: 20,
    width: 90,
    height: 90,
    borderColor: 'black',
    borderWidth: 7,
    borderBottomWidth: 0,
    borderRightWidth: 0,
    borderRadius: 10,
  },
  cornerTopRight: {
    position: 'absolute',
    top: 100,
    right: 20,
    width: 90,
    height: 90,
    borderColor: 'black',
    borderWidth: 7,
    borderBottomWidth: 0,
    borderLeftWidth: 0,
    borderRadius: 10,
  },
  cornerBottomLeft: {
    position: 'absolute',
    bottom: 150,
    left: 20,
    width: 90,
    height: 90,
    borderColor: 'black',
    borderWidth: 7,
    borderTopWidth: 0,
    borderRightWidth: 0,
    borderRadius: 10,
  },
  cornerBottomRight: {
    position: 'absolute',
    bottom: 150,
    right: 20,
    width: 90,
    height: 90,
    borderColor: 'black',
    borderWidth: 7,
    borderTopWidth: 0,
    borderLeftWidth: 0,
    borderRadius: 10,
  },
  flashButton: {
    
    flexDirection:'row',
    borderRadius: 5,
    alignSelf: 'center',
    margin: 20,
    position: 'absolute',
    width:'50%',
    height:'6%',
    top: 0,
    left: 60,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    backgroundColor:'#e30d4f',
    
  },

  buttonText:{
   color:'white',
   fontWeight:'bold',
  },
  
});

/*const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  camera: {
    flex: 1,
  },
});*/

export default CameraScreen;
