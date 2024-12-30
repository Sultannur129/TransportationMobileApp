/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import NetInfo from '@react-native-community/netinfo';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Alert, Image, KeyboardAvoidingView, Modal, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableHighlight, TouchableOpacity, View } from 'react-native';
import RNFS from 'react-native-fs';

//import { startBackgroundFetch } from './BackgroundFetch';
const LoginScreen = ({ navigation, checkFileExists, fetchData, startLocationUpdates }) => {

 
 
  
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
        if (!state.isConnected) {
            // İnternet bağlantısı yoksa Alert göster
            Alert.alert(
                'Bağlantı Hatası',
                'İnternet bağlantınız yok. Lütfen kontrol edin.',
                [{ text: 'Tamam' }],
                { cancelable: false }
            );
        }
    });

    // Temizlik işlemi
    return () => {
        unsubscribe();
    };
}, []);

NetInfo.fetch().then(state => {
  console.log('Is connected?', state.isConnected);
});




const [phone, setPhone] = useState('');
const [password, setPassword] = useState('');
const [isPrivacyModalVisible, setPrivacyModalVisible] = useState(false);
const [isTermsModalVisible, setTermsModalVisible] = useState(false);
const [isPrivacyAccepted, setPrivacyAccepted] = useState(false);
const [isTermsAccepted, setTermsAccepted] = useState(false);
const [privacyText, setPrivacyText] = useState('');
const [termsText, setTermsText] = useState('');

useEffect(() => {
  // API'den gizlilik politikası metnini alma
  const fetchPrivacyPolicy = async () => {
      try {
          const response = await axios.get('https://nevsoft.net/admin/api/pratik/getConfig');
          setPrivacyText(response.data.gizlilik_sartlari);
      } catch (error) {
          console.error('Error fetching privacy policy:', error);
      }
  };

  // API'den kullanım şartları metnini alma
  const fetchTermsOfUse = async () => {
      try {
          const response = await axios.get('https://nevsoft.net/admin/api/pratik/getConfig');
          setTermsText(response.data.kvkk_aydinlatma_metni);
      } catch (error) {
          console.error('Error fetching terms of use:', error);
      }
  };

  fetchPrivacyPolicy();
  fetchTermsOfUse();
}, []);

  const handleLogin = async () => {
    
    try {

        
        
        const response = await axios.post('https://nevsoft.net/admin/api/pratik/login',{
          phone:phone,
          password:password,
        });
        //console.log(response.data); // API yanıtını konsola yazdır
        
        console.log(response.data);
        if (response.data.sonuc) {
          //Alert.alert('Başarılı', 'Giriş başarılı!');
          //console.log(response.data);
          if(isPrivacyAccepted && isTermsAccepted){
          const filePath = `${RNFS.DocumentDirectoryPath}/data.json`;
          const exists = await RNFS.exists(filePath);
          if (exists) {
            await RNFS.unlink(filePath); // Dosyayı sil
            console.log('Dosya başarıyla silindi.');
          }
          const data = {
            id:response.data.id,
          };
          try {
            await RNFS.writeFile(filePath, JSON.stringify(data), 'utf8');
            console.log('JSON dosyası başarıyla yazıldı:', filePath);
            
            await checkFileExists();
            console.log("Şoför Id login:",response.data.id);
            await fetchData(response.data.id);
            //await startLocationUpdates();
          } catch (error) {
            console.error('Dosya yazma hatası:', error);
          }
          //startBackgroundFetch(); 
          //setSharedData(response.data);
          
            navigation.navigate('Home',{userData:response.data});
          }
          else{
            Alert.alert('GİZLİLİK KOŞULLARI', 'Lütfen Privacy Policy ve Term of Use Kısmındaki Gizlilik Koşullarını Onaylayın.');
          }
          
          
          
          // Token'ı sakla
          //await AsyncStorage.setItem('userToken', response.data.token);
      } else {
        
          Alert.alert('HATA', response.data.message || 'Giriş başarısız.');
      }
    } catch (error) {
      console.error(error.response ? error.response.data : error.message);
        Alert.alert('Hata', 'Bir hata oluştu. Lütfen tekrar deneyin.');
    }
};






  const [textColor, setTextColor] = useState('white');
  
  const [privacyColor, setPrivacyColor] = useState('black');
  const [termsColor, setTermsColor] = useState('black');
  
  const [borderColor, setBorderColor] = useState('#ccc');
  const [borderColor2, setBorderColor2] = useState('#ccc');

  const handlePressIn = () => {
    setTextColor('blue');
    
  };

  const handlePressOut = () => {
    setTextColor('white');
    
  };

 

  return(
  <SafeAreaView style={styles.container}>
   
       

   <View style={imageStyle.container}>
      <Image
        style={imageStyle.image}
        resizeMode='center'
        source={require('./images/footerlogoo.png')}
      />
    </View>

    
      <Text style={{color:'#1e1e1e', fontWeight:700, textAlign:'center', top:20, fontSize:15, width:'90%'}} allowFontScaling={false}>
        GİRİŞ
        {"\n"}
        {"\n"}
        <Text style={{color:'gray', fontSize:12, fontWeight:'bold'}} allowFontScaling={false}>
        Kullanıcı Adınız Telefonunuz. Şifreniz Plakanızın İlk 2 ve Son 2 Numarasıdır.
        </Text>
       
      </Text>
      
      <ScrollView style={Scrolview.container}>
      <KeyboardAvoidingView style={formView.container}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={100} // İsteğe bağlı, yukarı kaydırma miktarını ayarlamak için
      >
      
        <View style={labelView.container}>
        <Text style={labelView.label} allowFontScaling={false}>Cep Telefon Numarası </Text>
        <TextInput
       
        style={[Form.input, {borderColor:borderColor}]}
        value={phone}
        allowFontScaling={false}
        onChangeText={setPhone}
        onFocus={() => setBorderColor('blue')}
        onBlur={() => setBorderColor('#ccc')}
        placeholder="5325553322"
        placeholderTextColor="#ccc"
        keyboardType="phone-pad"
      />
       
        </View>
      
        
      
        <View style={labelView.container}>
        <Text style={labelView.label} allowFontScaling={false}>Şifre</Text>
        <TextInput
        style={[Form.input, {borderColor:borderColor2}]}
        allowFontScaling={false}
        onFocus={() => setBorderColor2('blue')}
        onBlur={() => setBorderColor2('#ccc')}
        value={password}
        onChangeText={setPassword}
        placeholder="Plaka İlk 2 ve Son 2 Numarası"
        placeholderTextColor="#ccc"
        secureTextEntry={true}
      />
        </View>
        
        

     
     
     <TouchableHighlight style={Form.button}
         onPressIn={handlePressIn}
         onPressOut={handlePressOut}
         underlayColor="white"
         onPress={handleLogin}
         >
        <Text style={[Form.buttonText, {color:textColor}]} allowFontScaling={false}>Giriş Yap</Text>
      </TouchableHighlight>
      <View style={Form.linksContainer}>
      <Text style={term.text} allowFontScaling={false}>
        Pratik Ulaştırma{' '}
        <TouchableOpacity
          activeOpacity={0.9}
          onPressIn={() => setPrivacyColor('blue')}
          onPressOut={() => setPrivacyColor('black')}
          onPress={() => setPrivacyModalVisible(true)}
          
        >
        <Text style={[term.text, {color:privacyColor,fontWeight:'bold'}]} allowFontScaling={false}>Privacy Policy</Text>
        </TouchableOpacity> {' '} and {' '}
        <TouchableOpacity
          activeOpacity={0.9}
          onPressIn={() => setTermsColor('blue')}
          onPressOut={() => setTermsColor('black')}
          onPress={() => setTermsModalVisible(true)}
        >
        <Text style={[term.text, {color:termsColor,fontWeight:'bold'}]} allowFontScaling={false}>Term of Use</Text>
        </TouchableOpacity>
        </Text> 

        {/* Gizlilik Politikası Modal */}
        <Modal
                visible={isPrivacyModalVisible}
                transparent={true}
                animationType="slide"
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                      <ScrollView>
                        <Text style={{color:'black', fontSize:18, textAlignVertical:'center'}} allowFontScaling={false}>{privacyText || 'Yükleniyor...'}</Text>
                        </ScrollView>
                        <View style={styles.buttonContainer}>
                        <TouchableOpacity style={{backgroundColor:'#e30d4f', borderRadius:5}} onPress={() => {
                                setPrivacyAccepted(true);
                                setPrivacyModalVisible(false);
                                // Onay işlemleri
                            }}>
                                <Text style={styles.buttonText} allowFontScaling={false}>Okudum, Onaylıyorum</Text>
                        </TouchableOpacity>
                        
                        <TouchableOpacity style={{backgroundColor:'#e30d4f', borderRadius:5, top:10}} onPress={() => setPrivacyModalVisible(false)}>
                                <Text style={styles.buttonText} allowFontScaling={false}>Kapat</Text>
                        </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

            {/* Kullanım Şartları Modal */}
            <Modal
                visible={isTermsModalVisible}
                transparent={true}
                animationType="slide"
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                      <ScrollView>
                        <Text style={{color:'black', fontSize:18, textAlignVertical:'center'}} allowFontScaling={false}>{termsText || 'Yükleniyor...'}</Text>
                        </ScrollView>
                        <View style={styles.buttonContainer}>
                        <TouchableOpacity style={{backgroundColor:'#e30d4f', borderRadius:5}} onPress={() => {
                                setTermsAccepted(true);
                                setTermsModalVisible(false);
                                // Onay işlemleri
                            }}>
                                <Text style={styles.buttonText} allowFontScaling={false}>Okudum, Onaylıyorum</Text>
                        </TouchableOpacity>
                        
                        <TouchableOpacity style={{backgroundColor:'#e30d4f', borderRadius:5, top:10}} onPress={() => setTermsModalVisible(false)}>
                                <Text style={styles.buttonText} allowFontScaling={false}>Kapat</Text>
                        </TouchableOpacity>
                        </View>
                        
                    </View>
                </View>
            </Modal>
      </View>
      
      </KeyboardAvoidingView>
      </ScrollView>
      
     
   
  </SafeAreaView>
  );
  
};


const Scrolview = StyleSheet.create({

  container:{
    flex:0.2,
    width:'100%',
  },
});

const formView = StyleSheet.create({

   container:{
    flex:0.5,
    top:70,
    width:'100%',
    alignItems:'center',
    
   }
});

const netStyle = StyleSheet.create({

  container: {
    
    backgroundColor:'blue',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius:5,
    top:30,
},
text: {
    fontSize: 18,
    color:'white'
}, 
});
const labelView = StyleSheet.create({

  container: {
    flexDirection: 'column',
    alignItems: 'left',
    justifyContent:'center',
    padding: 4,
    width:'100%',
    left:15,
    
    
  },
  label: {
    fontSize: 15,
    color:'black',
    backgroundColor:'white',
    textAlign:'left',
    left:5,
    
  },
  
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    alignItems:'center',
    
  },
  text: {
    fontSize: 18,
}, 
modalContainer: {
  flex: 1,
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
},
modalContent: {
  width: 300,
  padding: 20,
  backgroundColor: 'white',
  borderRadius: 10,
},

buttonContainer: {
  marginTop: 10, // Butonlar arasında boşluk
},
buttonText: {
  marginVertical: 10, // Butonlar arasında boşluk
  color: 'white',
  textAlign: 'center',
  fontWeight: 'bold',
},

});

const term = StyleSheet.create({
  text: {
    color: 'gray',
    fontSize: 13,
    textAlignVertical: 'center',
  },
});

const Form = StyleSheet.create({

  input: {
   
    width: '90%',
    height: 40,
    borderColor: '#ccc',
    borderWidth:1,
    borderRadius: 5,
    paddingHorizontal: 10,
    color:'black',
  },
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
    marginTop:40,
  },
  buttonText: {
    underlayColor:'blue',
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  linksContainer: {
   
    flexDirection: 'row',
    alignItems: 'center',
    width: '80%',
  },
  link: {
    color: '#1e90ff',
    textDecorationLine: 'underline',
  },
  
});
const imageStyle = StyleSheet.create({

  

  container: {
    backgroundColor:'#ed1c24',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 40,
    position: 'center',
    width:320,
    height:200,
    
   
  },
  image: {
    width: 250, // Set your desired width here
    height: 250, // Set your desired height here
  },
  

});

export default LoginScreen;