// DetailsScreen.js
import React, { useEffect } from 'react';
import { Image, PermissionsAndroid, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import RNFS from 'react-native-fs';
import ImagePicker from 'react-native-image-crop-picker';
import ImageResizer from 'react-native-image-resizer';


const DetailsScreen = ({ route, navigation }) => {
  const { item, userData } = route.params;
  const apiResponse = {
    timestamp: item.irsaliye_tarihi
  };
  
  // Tarih ve saat bilgisini alın
  const dateTimeString = apiResponse.timestamp;


  
  // Date nesnesi oluşturun
  const dateObject = new Date(dateTimeString);
  // Türkiye tarih formatı
   const options = { year: 'numeric', month: '2-digit', day: '2-digit', locale: 'tr-TR' };
  // Tarih ve saati ayırın
  const datePart = dateObject.toLocaleDateString('tr-TR', options); // "2024-10-01"
  const timePart = dateObject.toLocaleTimeString(); // "14:30:00" (yerel saat dilimine göre)

 
  
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
        //mediaType: 'photo',
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
  /*()=>navigation.navigate('Camera',{item, userData})*/

  return (
    <SafeAreaView style={siparisDetail.container}>
     <View style={head.container}>
     <Image resizeMode='center'
       source={require('./images/water-icon64.png')}
       style={{bottom:15}}
      
       />
     <Text style={{color:'black', fontWeight:'bold', textAlign:'center',top:5}} allowFontScaling={false}>Sipariş Detayı</Text>
     </View>

     <TouchableOpacity style={Camera.container}
       onPress={handleScan}>
     <Image resizeMode='center'
       source={require('./images/camera.png')}
       style={{bottom:15}}
      
       />
      <Text style={{color:'black', fontWeight:'bold', textAlign:'center', borderBottomWidth:1, borderColor:'black',bottom:40, fontSize:13}} allowFontScaling={false}>İmzalı Teslim İrsaliye Yükle</Text>
      <Text style={{color:'black', textAlign:'center',bottom:40, fontSize:12}} allowFontScaling={false}>{item.irsaliye_no}</Text>
     </TouchableOpacity>
     
      <Text style={{color:'black', fontWeight:'bold', textAlign:'center', fontSize:20, bottom:20}} allowFontScaling={false}>Sipariş Detay</Text>
      <View style={{flexDirection:'row',width:'90%',justifyContent:'space-between'}}>
        <Text style={{color:'gray',flex:1}} allowFontScaling={false}>İrsaliye No</Text>
        <Text style={{color:'black', flex:1}} allowFontScaling={false}>{item.irsaliye_no}</Text>
      </View>
      <View style={{flexDirection:'row',width:'90%',justifyContent:'space-between', top:10}}>
        <Text style={{color:'gray', flex:1}} allowFontScaling={false}>İrsaliye Tarihi</Text>
        <Text style={{color:'black', flex:1}} allowFontScaling={false}>{datePart}</Text>
      </View>
      <View style={{flexDirection:'row',width:'90%',justifyContent:'space-between', top:20}}>
        <Text style={{color:'gray',flex:1}} allowFontScaling={false}>Gönderici Firma</Text>
        <Text style={{color:'black', fontSize:12, flex:1}} allowFontScaling={false}>{item.gonderici_firma_unvan}</Text>
      </View>
      <View style={{flexDirection:'row',width:'90%',justifyContent:'space-between', top:30}}>
        <Text style={{color:'gray',  flex:1}} allowFontScaling={false}>Alıcı Firma</Text>
        <Text style={{color:'black', fontSize:12, flex:1}} allowFontScaling={false}>{item.alici_firma_unvan}</Text>
      </View>
     
    </SafeAreaView>
  );
};



const siparisDetail=StyleSheet.create({

   container:{
    flex:1,
    backgroundColor:'white',
    alignItems:'center',
    flexDirection:'column',
   },
});

const head = StyleSheet.create({
   container:{
    flexDirection:'row',
    width:'80%',
    height:'5%',
    borderWidth:0.5,
    borderColor:'gray',
    top:20,
    borderRadius:5,
    alignItems:'flex-start',
   },
});

const Camera = StyleSheet.create({
  container:{
   flexDirection:'column',
   width:'80%',
   height:'50%',
   top:20,
   alignItems:'center',
   justifyContent:'center',
  },
});
export default DetailsScreen;